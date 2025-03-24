# 🚗 Smart Parking System

## Overview
A modern smart parking system that uses Raspberry Pi to detect parking spot availability in real-time. The system provides visual feedback through LEDs and a web interface, making it easy for users to find available parking spots.

## Features
- Real-time parking spot detection using ultrasonic sensors
- Visual LED indicators (Red for occupied, Green for available)
- Web interface for remote monitoring
- Database storage for parking history
- Easy-to-use dashboard

## System Flow
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

## Hardware Requirements
- Raspberry Pi 3B+ or 4
- HC-SR04 Ultrasonic Sensor
- Red and Green LEDs
- Basic electronic components (resistors, wires, breadboard)
- Power supply and SD card

## Software Requirements
- Raspberry Pi OS (32-bit)
- Python 3.x
- Flask web framework
- RPi.GPIO library

## Quick Start
1. Set up Raspberry Pi with required OS
2. Install necessary Python packages
3. Connect hardware components
4. Run the application
5. Access web interface through browser

## Benefits
- Reduces time spent searching for parking
- Provides real-time parking information
- Easy to monitor remotely
- Scalable for multiple parking spots
- Cost-effective solution

## Future Scope
- Mobile app integration
- Multiple parking spot support
- Payment system integration
- User authentication
- Advanced analytics

## Support
For any issues or queries, please refer to the troubleshooting section in the documentation or create an issue in the repository.