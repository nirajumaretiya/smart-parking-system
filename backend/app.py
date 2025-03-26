from flask import Flask, render_template, jsonify, request, redirect, url_for, session, send_file, send_from_directory
from flask_cors import CORS
from functools import wraps
import RPi.GPIO as GPIO
import threading
import time
from datetime import datetime
import os
import json
import csv
from io import StringIO

app = Flask(__name__, 
    static_folder='../frontend/dist',  # Serve static files from frontend build
    static_url_path=''  # Serve at root URL
)
# Enable CORS with credentials support
CORS(app, supports_credentials=True, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Use a consistent secret key for development
app.secret_key = 'smart-parking-system-development-key'

# Configure session to be more compatible with Next.js
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_PATH'] = '/'

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
        self.parking_history = []
        self._load_history()
    
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
            
            # Record status change in history
            if is_occupied != self.status[i]:
                self._record_status_change(i, is_occupied)
            
            self.status[i] = is_occupied
            GPIO.output(self.leds[i]['red'], is_occupied)
            GPIO.output(self.leds[i]['green'], not is_occupied)
    
    def _record_status_change(self, slot_index, is_occupied):
        event = {
            'timestamp': datetime.now().isoformat(),
            'slot': slot_index + 1,
            'status': 'occupied' if is_occupied else 'available'
        }
        self.parking_history.append(event)
        self._save_history()
    
    def _save_history(self):
        try:
            with open('parking_history.json', 'w') as f:
                json.dump(self.parking_history, f)
        except Exception as e:
            print(f"Error saving history: {e}")
    
    def _load_history(self):
        try:
            if os.path.exists('parking_history.json'):
                with open('parking_history.json', 'r') as f:
                    self.parking_history = json.load(f)
        except Exception as e:
            print(f"Error loading history: {e}")
    
    def get_status(self):
        return {
            'slots': [
                {'id': i+1, 'occupied': status}
                for i, status in enumerate(self.status)
            ],
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def get_statistics(self):
        occupied_slots = sum(self.status)
        total_slots = len(self.status)
        return {
            'total_slots': total_slots,
            'occupied_slots': occupied_slots,
            'available_slots': total_slots - occupied_slots,
            'occupancy_rate': (occupied_slots / total_slots) * 100,
            'last_update': datetime.now().isoformat()
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
            if request.path.startswith('/api/'):
                return jsonify({'error': 'Unauthorized'}), 401
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Check if the request is JSON
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            # Handle form data
            username = request.form.get('username')
            password = request.form.get('password')
        
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            # If the request expects JSON, return JSON
            if request.is_json or request.headers.get('Accept') == 'application/json':
                return jsonify({'success': True}), 200
            # Otherwise redirect (for form submissions)
            return redirect(url_for('index'))
        else:
            # Return error as JSON if requested, otherwise render template
            if request.is_json or request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Invalid username or password'}), 401
            return render_template('login.html', error='Invalid username or password')
    
    # For GET requests, check if JSON is expected
    if request.headers.get('Accept') == 'application/json':
        return jsonify({'message': 'Please submit login credentials'}), 200
    
    # Otherwise render the login template
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/status')
@login_required
def get_status():
    return jsonify(parking_system.get_status())

@app.route('/api/statistics')
@login_required
def get_statistics():
    return jsonify(parking_system.get_statistics())

@app.route('/api/history')
@login_required
def get_history():
    return jsonify(parking_system.parking_history)

@app.route('/api/export')
@login_required
def export_data():
    # Create CSV data
    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(['Timestamp', 'Slot', 'Status'])
    
    for event in parking_system.parking_history:
        writer.writerow([
            event['timestamp'],
            event['slot'],
            event['status']
        ])
    
    output = si.getvalue()
    si.close()
    
    return send_file(
        StringIO(output),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'parking_history_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    )

@app.route('/api/verify-session')
def verify_session():
    """Verify if the user is logged in and return appropriate JSON response"""
    if 'logged_in' in session:
        return jsonify({'valid': True}), 200
    return jsonify({'valid': False}), 401

if __name__ == '__main__':
    sensor_thread = threading.Thread(target=update_sensors, daemon=True)
    sensor_thread.start()
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    finally:
        parking_system.cleanup() 