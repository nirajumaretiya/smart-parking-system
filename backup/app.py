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
        
        self.sensors = [
            {'trig': 17, 'echo': 27},  # Slot 1
            {'trig': 22, 'echo': 23},  # Slot 2
            {'trig': 24, 'echo': 25},  # Slot 3
            {'trig': 8, 'echo': 7}     # Slot 4
        ]
        
        self.leds = [
            {'red': 5, 'green': 6},    # Slot 1
            {'red': 12, 'green': 13},  # Slot 2
            {'red': 19, 'green': 26},  # Slot 3
            {'red': 16, 'green': 20}   # Slot 4
        ]
        
        self._setup_pins()
        self.status = [False] * 4  # False = empty, True = occupied
    
    def _setup_pins(self):
        for sensor in self.sensors:
            GPIO.setup(sensor['trig'], GPIO.OUT)
            GPIO.setup(sensor['echo'], GPIO.IN)
        
        for led in self.leds:
            GPIO.setup(led['red'], GPIO.OUT)
            GPIO.setup(led['green'], GPIO.OUT)
    
    def _get_distance(self, trig_pin, echo_pin):
        GPIO.output(trig_pin, True)
        time.sleep(0.00001)
        GPIO.output(trig_pin, False)
        
        start_time = time.time()
        stop_time = time.time()
        
        while GPIO.input(echo_pin) == 0:
            start_time = time.time()
        
        while GPIO.input(echo_pin) == 1:
            stop_time = time.time()
        
        time_elapsed = stop_time - start_time
        distance = (time_elapsed * 34300) / 2
        
        return distance
    
    def update_sensor_status(self):
        for i, sensor in enumerate(self.sensors):
            distance = self._get_distance(sensor['trig'], sensor['echo'])
            is_occupied = distance < 20  
            
            self.status[i] = is_occupied
            GPIO.output(self.leds[i]['red'], is_occupied)
            GPIO.output(self.leds[i]['green'], not is_occupied)
    
    def get_status(self):
        return {
            'slots': [
                {'id': i+1, 'occupied': status}
                for i, status in enumerate(self.status)
            ],
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def cleanup(self):
        GPIO.cleanup()

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
