# 🚗 Smart Parking System

[![Python](https://img.shields.io/badge/python-3.x-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.x-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

## 📋 Overview
A modern smart parking system that uses Raspberry Pi to detect parking spot availability in real-time. The system provides visual feedback through LEDs and a web interface, making it easy for users to find available parking spots.

## ✨ Features
- 🎯 Real-time parking spot detection using ultrasonic sensors
- 💡 Visual LED indicators (Red for occupied, Green for available)
- 🌐 Web interface for remote monitoring
- 💾 Database storage for parking history
- 📊 Easy-to-use dashboard
- 🔄 Automatic status updates
- 📱 Mobile-responsive design

## 🔄 System Flow
1. **Hardware Detection**
   - Ultrasonic sensor continuously monitors parking spot
   - Detects presence/absence of vehicles
   - Updates LED status accordingly

2. **Data Processing**
   - Sensor data is processed in real-time
   - Status is stored in SQLite database
   - Updates are pushed to web interface

3. **User Interface**
   - Web dashboard shows parking spot status
   - Real-time updates every 5 seconds
   - Color-coded display (Red/Green)

## 🛠️ Hardware Requirements
- Raspberry Pi 3B+ or 4
- HC-SR04 Ultrasonic Sensor
- Red and Green LEDs
- Basic electronic components (resistors, wires, breadboard)
- Power supply and SD card
- Optional: HDMI display for local monitoring

## 💻 Software Requirements
- Raspberry Pi OS (32-bit)
- Python 3.x
- Flask web framework
- RPi.GPIO library
- SQLite3 (built-in)

## 📚 Documentation

### 🚀 Getting Started

#### Prerequisites
1. Raspberry Pi 3B+ or 4 with Raspberry Pi OS installed
2. Basic knowledge of Python and electronics
3. Required hardware components (listed above)

#### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/smart-parking-system.git
   cd smart-parking-system
   ```

2. **Set Up Python Environment**
   ```bash
   # Create and activate virtual environment (recommended)
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install required packages
   pip install -r requirements.txt
   ```

3. **Hardware Setup**
   ```plaintext
   Connect the components as follows:
   
   Ultrasonic Sensor (HC-SR04):
   - VCC  → 5V (Pin 2)
   - GND  → GND (Pin 6)
   - TRIG → GPIO17 (Pin 11)
   - ECHO → GPIO27 (Pin 13)

   LEDs:
   - Red LED:
     * Anode → 220Ω Resistor → GPIO22 (Pin 15)
     * Cathode → GND (Pin 6)
   
   - Green LED:
     * Anode → 220Ω Resistor → GPIO23 (Pin 16)
     * Cathode → GND (Pin 6)
   ```

4. **Enable GPIO**
   ```bash
   sudo raspi-config
   # Navigate to Interface Options → GPIO → Enable
   ```

5. **Run the Application**
   ```bash
   # Start the application
   python3 main.py
   ```

6. **Access the Web Interface**
   ```bash
   # Find your Raspberry Pi's IP address
   hostname -I
   
   # Open in browser:
   # http://<raspberry_pi_ip>:5000
   ```

### 🔧 Configuration

The system can be configured by modifying the following files:
- `config.py`: System settings and thresholds
- `database.py`: Database configuration
- `templates/index.html`: Web interface customization

### 🧪 Testing

1. **Hardware Testing**
   ```bash
   python3 tests/hardware_test.py
   ```

2. **Software Testing**
   ```bash
   python3 tests/software_test.py
   ```

### 🔍 Troubleshooting

Common issues and solutions:
1. **LEDs not working**
   - Check connections
   - Verify GPIO pins
   - Test with multimeter

2. **Sensor not detecting**
   - Check power supply
   - Verify connections
   - Clean sensor surface

3. **Web interface not accessible**
   - Check IP address
   - Verify application running
   - Check network connection

## 💡 Benefits
- ⏱️ Reduces time spent searching for parking
- 📊 Provides real-time parking information
- 🌐 Easy to monitor remotely
- 🔄 Scalable for multiple parking spots
- 💰 Cost-effective solution
- 🔒 Secure and reliable
- 🎯 Accurate vehicle detection

## 🔮 Future Scope
- 📱 Mobile app integration
- 🚗 Multiple parking spot support
- 💳 Payment system integration
- 👤 User authentication
- 📈 Advanced analytics
- 🔔 SMS/Email notifications
- 🗺️ Integration with navigation apps

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support
For any issues or queries, please refer to the troubleshooting section in the documentation or create an issue in the repository.




