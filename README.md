# 🚗 Smart Parking System Documentation

## Project Overview
A simple and efficient smart parking system using Raspberry Pi that detects parking spot occupancy and displays real-time status through LEDs and a web interface.

## Hardware Requirements
```plaintext
1. Core Components:
   - Raspberry Pi 3B+ or 4
   - HC-SR04 Ultrasonic Sensor
   - Red LED (1)
   - Green LED (1)
   - 220Ω Resistors (2)
   - Jumper Wires
   - Breadboard
   - Power Supply (5V/2.5A)
   - SD Card (32GB+)

2. Optional Components:
   - HDMI Monitor
   - USB Keyboard
   - USB Mouse
   - Ethernet Cable
```

## Hardware Connections
```plaintext
1. Ultrasonic Sensor (HC-SR04):
   VCC  → 5V (Pin 2)
   GND  → GND (Pin 6)
   TRIG → GPIO17 (Pin 11)
   ECHO → GPIO27 (Pin 13)

2. LEDs:
   Red LED:
   - Anode → 220Ω Resistor → GPIO22 (Pin 15)
   - Cathode → GND (Pin 6)
   
   Green LED:
   - Anode → 220Ω Resistor → GPIO23 (Pin 16)
   - Cathode → GND (Pin 6)
```

## Software Requirements
```plaintext
1. Operating System:
   - Raspberry Pi OS (32-bit)

2. Python Packages:
   - Flask
   - RPi.GPIO
   - SQLite3 (built-in)
```

## Installation Steps

### 1. Raspberry Pi Setup
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install python3-pip -y
pip3 install flask RPi.GPIO
```

### 2. Project Setup
```bash
# Create project directory
mkdir smart_parking
cd smart_parking

# Create project files
touch main.py sensor_setup.py led_control.py database.py
mkdir templates
touch templates/index.html
```

## Code Implementation

### 1. sensor_setup.py
```python
import RPi.GPIO as GPIO
import time

class ParkingSensor:
    def __init__(self, trigger_pin, echo_pin):
        self.trigger_pin = trigger_pin
        self.echo_pin = echo_pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(trigger_pin, GPIO.OUT)
        GPIO.setup(echo_pin, GPIO.IN)
        
    def get_distance(self):
        GPIO.output(self.trigger_pin, True)
        time.sleep(0.00001)
        GPIO.output(self.trigger_pin, False)
        
        start_time = time.time()
        stop_time = time.time()
        
        while GPIO.input(self.echo_pin) == 0:
            start_time = time.time()
            
        while GPIO.input(self.echo_pin) == 1:
            stop_time = time.time()
            
        time_elapsed = stop_time - start_time
        distance = (time_elapsed * 34300) / 2
        
        return distance
        
    def is_occupied(self):
        distance = self.get_distance()
        return distance < 20  # Adjust threshold as needed
```

### 2. led_control.py
```python
class LEDControl:
    def __init__(self, red_pin, green_pin):
        self.red_pin = red_pin
        self.green_pin = green_pin
        GPIO.setup(red_pin, GPIO.OUT)
        GPIO.setup(green_pin, GPIO.OUT)
        
    def spot_occupied(self):
        GPIO.output(self.red_pin, GPIO.HIGH)
        GPIO.output(self.green_pin, GPIO.LOW)
        
    def spot_available(self):
        GPIO.output(self.red_pin, GPIO.LOW)
        GPIO.output(self.green_pin, GPIO.HIGH)
```

### 3. database.py
```python
import sqlite3

class ParkingDatabase:
    def __init__(self):
        self.conn = sqlite3.connect('parking.db')
        self.create_tables()
        
    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS parking_spots (
                spot_id INTEGER PRIMARY KEY,
                status BOOLEAN,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()
        
    def update_spot_status(self, spot_id, status):
        cursor = self.conn.cursor()
        cursor.execute('''
            UPDATE parking_spots 
            SET status = ?, last_updated = CURRENT_TIMESTAMP
            WHERE spot_id = ?
        ''', (status, spot_id))
        self.conn.commit()
        
    def get_all_spots(self):
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM parking_spots')
        return cursor.fetchall()
```

### 4. templates/index.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Smart Parking System</title>
    <style>
        .spot {
            width: 100px;
            height: 100px;
            margin: 10px;
            display: inline-block;
            text-align: center;
            line-height: 100px;
            border-radius: 5px;
        }
        .occupied {
            background-color: red;
            color: white;
        }
        .available {
            background-color: green;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Smart Parking System</h1>
    <div id="parking-lots"></div>

    <script>
        function updateSpots() {
            fetch('/api/spots')
                .then(response => response.json())
                .then(spots => {
                    const container = document.getElementById('parking-lots');
                    container.innerHTML = '';
                    spots.forEach(spot => {
                        const div = document.createElement('div');
                        div.className = `spot ${spot.status ? 'occupied' : 'available'}`;
                        div.textContent = `Spot ${spot.spot_id}`;
                        container.appendChild(div);
                    });
                });
        }

        setInterval(updateSpots, 5000);
        updateSpots();
    </script>
</body>
</html>
```

### 5. main.py
```python
from flask import Flask, render_template, jsonify
from database import ParkingDatabase
from sensor_setup import ParkingSensor
from led_control import LEDControl
import threading
import time

app = Flask(__name__)
db = ParkingDatabase()

# Initialize sensors and LEDs
sensor1 = ParkingSensor(trigger_pin=17, echo_pin=27)
led1 = LEDControl(red_pin=22, green_pin=23)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/spots')
def get_spots():
    spots = db.get_all_spots()
    return jsonify(spots)

@app.route('/api/update_spot/<int:spot_id>')
def update_spot(spot_id):
    status = sensor1.is_occupied()
    db.update_spot_status(spot_id, status)
    if status:
        led1.spot_occupied()
    else:
        led1.spot_available()
    return jsonify({'status': 'success'})

def monitor_spots():
    while True:
        status = sensor1.is_occupied()
        db.update_spot_status(1, status)
        if status:
            led1.spot_occupied()
        else:
            led1.spot_available()
        time.sleep(1)

if __name__ == '__main__':
    monitor_thread = threading.Thread(target=monitor_spots)
    monitor_thread.daemon = True
    monitor_thread.start()
    
    app.run(host='0.0.0.0', port=5000)
```

## Running the System

### 1. Enable GPIO
```bash
sudo raspi-config
# Navigate to Interface Options → GPIO → Enable
```

### 2. Start the Application
```bash
cd smart_parking
python3 main.py
```

### 3. Access the Web Interface
```plaintext
1. Find Raspberry Pi IP:
   hostname -I

2. Open web browser and go to:
   http://<raspberry_pi_ip>:5000
```

## Testing

### 1. Hardware Testing
```python
# Run connection test
python3 connection_test.py
```

### 2. Functionality Testing
```plaintext
1. Test sensor:
   - Place object in front of sensor
   - Check LED changes
   - Verify web interface updates

2. Test web interface:
   - Check real-time updates
   - Verify spot status display
```

## Troubleshooting

### Common Issues
```plaintext
1. No LED Response:
   - Check connections
   - Verify GPIO pins
   - Test with multimeter

2. Sensor Not Working:
   - Check power supply
   - Verify connections
   - Test with multimeter

3. Web Interface Not Accessible:
   - Check IP address
   - Verify application running
   - Check network connection
```

## Maintenance

### Regular Checks
```plaintext
1. Clean sensors
2. Check connections
3. Update software
4. Backup database
```

## Future Enhancements
```plaintext
1. Multiple parking spots
2. Mobile app integration
3. Payment system
4. User authentication
```#   s m a r t - p a r k i n g - s y s t e m  
 