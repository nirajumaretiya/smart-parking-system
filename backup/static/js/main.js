function updateParkingStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            data.slots.forEach(slot => {
                const slotElement = document.getElementById(`slot-${slot.id}`);
                const redLed = slotElement.querySelector('.red');
                const greenLed = slotElement.querySelector('.green');
                const statusText = slotElement.querySelector('.status-text');
                
                if (slot.occupied) {
                    redLed.classList.add('active');
                    greenLed.classList.remove('active');
                    statusText.textContent = 'Occupied';
                    statusText.style.color = '#ff4444';
                } else {
                    redLed.classList.remove('active');
                    greenLed.classList.add('active');
                    statusText.textContent = 'Available';
                    statusText.style.color = '#00C851';
                }
            });
            
            document.getElementById('timestamp').textContent = data.timestamp;
        })
        .catch(error => console.error('Error:', error));
}

// Update status every second
setInterval(updateParkingStatus, 1000);
updateParkingStatus(); // Initial update
