#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Applying visual enhancements to Smart Parking System${NC}"

# Create directories if they don't exist
mkdir -p static/css
mkdir -p templates

# Copy enhanced CSS
echo -e "${BLUE}Copying enhanced CSS...${NC}"
cp -f backup/static/css/style.css static/css/

# Copy enhanced templates
echo -e "${BLUE}Copying enhanced templates...${NC}"
cp -f backup/templates/base.html templates/
cp -f backup/templates/index.html templates/
cp -f backup/templates/login.html templates/

# Copy app.py if it exists in the backup
if [ -f backup/app.py ]; then
    echo -e "${BLUE}Copying app.py...${NC}"
    cp -f backup/app.py ./
fi

echo -e "${GREEN}Enhancements applied successfully!${NC}"
echo "Run your application with: python app.py" 