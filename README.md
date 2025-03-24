# 🚗 Smart Parking System (4 Slots)

[![Python](https://img.shields.io/badge/python-3.x-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.x-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

## 📋 Overview
A smart parking system designed for 4 parking slots, using Raspberry Pi to detect vehicle presence and display real-time status through LEDs and a web interface.

## 🛠️ Hardware Requirements
- Raspberry Pi 3B+ or 4
- 4x HC-SR04 Ultrasonic Sensors
- 8x LEDs (4 Red, 4 Green)
- 8x 220Ω Resistors
- Jumper Wires
- Breadboard
- 5V/2.5A Power Supply
- 32GB+ SD Card

## 🔌 Hardware Connections

### Ultrasonic Sensors
```plaintext
Sensor 1:
- VCC  → 5V (Pin 2)
- GND  → GND (Pin 6)
- TRIG → GPIO17 (Pin 11)
- ECHO → GPIO27 (Pin 13)

Sensor 2:
- VCC  → 5V (Pin 2)
- GND  → GND (Pin 6)
- TRIG → GPIO22 (Pin 15)
- ECHO → GPIO23 (Pin 16)

Sensor 3:
- VCC  → 5V (Pin 2)
- GND  → GND (Pin 6)
- TRIG → GPIO24 (Pin 18)
- ECHO → GPIO25 (Pin 22)

Sensor 4:
- VCC  → 5V (Pin 2)
- GND  → GND (Pin 6)
- TRIG → GPIO8 (Pin 24)
- ECHO → GPIO7 (Pin 26)
```

### LEDs
```plaintext
Slot 1:
- Red LED: GPIO5 (Pin 29) → 220Ω → LED → GND
- Green LED: GPIO6 (Pin 31) → 220Ω → LED → GND

Slot 2:
- Red LED: GPIO12 (Pin 32) → 220Ω → LED → GND
- Green LED: GPIO13 (Pin 33) → 220Ω → LED → GND

Slot 3:
- Red LED: GPIO19 (Pin 35) → 220Ω → LED → GND
- Green LED: GPIO26 (Pin 37) → 220Ω → LED → GND

Slot 4:
- Red LED: GPIO16 (Pin 36) → 220Ω → LED → GND
- Green LED: GPIO20 (Pin 38) → 220Ω → LED → GND
```

## 💻 Software Requirements
- Raspberry Pi OS (32-bit)
- Python 3.x
- Flask web framework
- RPi.GPIO library
- SQLite3 (built-in)

## 🚀 Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/smart-parking-system.git
   cd smart-parking-system
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Enable GPIO**
   ```bash
   sudo raspi-config
   # Navigate to Interface Options → GPIO → Enable
   ```

4. **Run Application**
   ```bash
   python3 main.py
   ```

5. **Access Web Interface**
   ```bash
   # Find Raspberry Pi IP
   hostname -I
   
   # Open in browser:
   # http://<raspberry_pi_ip>:5000
   ```

## ✨ Features
- Real-time detection for 4 parking slots
- Individual LED indicators per slot
- Web dashboard with slot status
- Mobile-responsive interface
- Automatic status updates
- Database storage for history

## 🔍 Troubleshooting
1. **LEDs not working**
   - Check resistor connections
   - Verify GPIO pins
   - Test with multimeter

2. **Sensor issues**
   - Check power supply
   - Verify connections
   - Clean sensor surface

3. **Web interface issues**
   - Check IP address
   - Verify application running
   - Check network connection






