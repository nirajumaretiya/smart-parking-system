#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Smart Parking System${NC}"

# Check if screen is installed
if ! command -v screen &> /dev/null; then
    echo "Screen is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y screen
fi

# Kill existing screen sessions
screen -ls | grep smart-parking | cut -d. -f1 | awk '{print $1}' | xargs -I % screen -X -S % quit > /dev/null 2>&1

# Start a new screen session
screen -dmS smart-parking-backend bash -c "cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python app.py; exec bash"
echo -e "${BLUE}Backend server started in screen session 'smart-parking-backend'${NC}"
echo -e "${BLUE}Access the backend at http://localhost:5000${NC}"

# Start frontend
screen -dmS smart-parking-frontend bash -c "cd frontend-next && npm install && npm run dev; exec bash"
echo -e "${BLUE}Frontend server started in screen session 'smart-parking-frontend'${NC}"
echo -e "${BLUE}Access the frontend at http://localhost:3000${NC}"

echo ""
echo -e "${GREEN}Both servers are now running in the background${NC}"
echo "To view the backend server: screen -r smart-parking-backend"
echo "To view the frontend server: screen -r smart-parking-frontend"
echo "To detach from a screen session: Press Ctrl+A then D"
echo ""
echo -e "${GREEN}Default login credentials:${NC}"
echo "Username: admin"
echo "Password: admin123" 