from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from functools import wraps
import RPi.GPIO as GPIO
import threading
import time
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key

# Admin credentials (in a real application, these should be stored securely in a database)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class ParkingSystem:
    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        
        # Sensor configuration
        self.sensors = [
            {'trig': 17, 'echo': 27},  # Slot 1
            {'trig': 22, 'echo': 23},  # Slot 2
            {'trig': 24, 'echo': 25}   # Slot 3
        ]
        
        # LED configuration
        self.leds = [
            {'red': 5, 'green': 6},    # Slot 1
            {'red': 12, 'green': 13},  # Slot 2
            {'red': 19, 'green': 26}   # Slot 3
        ]
        
        # Sensor parameters
        self.MIN_DISTANCE = 2  # Minimum valid distance in cm
        self.MAX_DISTANCE = 400  # Maximum valid distance in cm
        self.OCCUPANCY_THRESHOLD = 20  # Distance threshold for occupancy in cm
        self.TIMEOUT = 0.1  # Timeout for sensor reading in seconds
        
        self._setup_pins()
        self.status = [False] * 3  # False = empty, True = occupied
        self.last_valid_distance = [0] * 3  # Store last valid distance for each sensor
    
    def _setup_pins(self):
        try:
            for sensor in self.sensors:
                GPIO.setup(sensor['trig'], GPIO.OUT)
                GPIO.setup(sensor['echo'], GPIO.IN)
                # Initialize trigger pins to LOW
                GPIO.output(sensor['trig'], False)
            
            for led in self.leds:
                GPIO.setup(led['red'], GPIO.OUT)
                GPIO.setup(led['green'], GPIO.OUT)
                # Initialize LEDs to OFF
                GPIO.output(led['red'], False)
                GPIO.output(led['green'], False)
        except Exception as e:
            print(f"Error setting up pins: {e}")
            raise
    
    def _get_distance(self, trig_pin, echo_pin):
        try:
            # Send trigger pulse
            GPIO.output(trig_pin, True)
            time.sleep(0.00001)  # 10 microseconds
            GPIO.output(trig_pin, False)
            
            # Wait for echo to start
            start_time = time.time()
            while GPIO.input(echo_pin) == 0:
                if time.time() - start_time > self.TIMEOUT:
                    return None
            
            # Wait for echo to end
            start_time = time.time()
            while GPIO.input(echo_pin) == 1:
                if time.time() - start_time > self.TIMEOUT:
                    return None
            
            # Calculate distance
            time_elapsed = time.time() - start_time
            distance = (time_elapsed * 34300) / 2  # Speed of sound = 343 m/s
            
            # Validate distance
            if self.MIN_DISTANCE <= distance <= self.MAX_DISTANCE:
                return distance
            return None
            
        except Exception as e:
            print(f"Error reading sensor: {e}")
            return None
    
    def update_sensor_status(self):
        for i, sensor in enumerate(self.sensors):
            try:
                distance = self._get_distance(sensor['trig'], sensor['echo'])
                
                if distance is not None:
                    self.last_valid_distance[i] = distance
                    is_occupied = distance < self.OCCUPANCY_THRESHOLD
                    self.status[i] = is_occupied
                    
                    # Update LEDs
                    GPIO.output(self.leds[i]['red'], is_occupied)
                    GPIO.output(self.leds[i]['green'], not is_occupied)
                else:
                    # If reading failed, use last valid distance
                    is_occupied = self.last_valid_distance[i] < self.OCCUPANCY_THRESHOLD
                    self.status[i] = is_occupied
                    
                    # Update LEDs
                    GPIO.output(self.leds[i]['red'], is_occupied)
                    GPIO.output(self.leds[i]['green'], not is_occupied)
                    
            except Exception as e:
                print(f"Error updating sensor {i+1}: {e}")
                # Keep last known status on error
                continue
    
    def get_status(self):
        return {
            'slots': [
                {
                    'id': i+1,
                    'occupied': status,
                    'distance': self.last_valid_distance[i] if status is not None else None
                }
                for i, status in enumerate(self.status)
            ],
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def cleanup(self):
        try:
            # Turn off all LEDs
            for led in self.leds:
                GPIO.output(led['red'], False)
                GPIO.output(led['green'], False)
            GPIO.cleanup()
        except Exception as e:
            print(f"Error during cleanup: {e}")

parking_system = ParkingSystem()

def update_sensors():
    while True:
        parking_system.update_sensor_status()
        time.sleep(1)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Invalid username or password')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/api/status')
@login_required
def get_status():
    return jsonify(parking_system.get_status())

if __name__ == '__main__':
    sensor_thread = threading.Thread(target=update_sensors, daemon=True)
    sensor_thread.start()
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    finally:
        parking_system.cleanup()
