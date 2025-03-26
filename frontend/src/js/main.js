// State management
const state = {
    slots: Array(4).fill(null).map(() => ({
        occupied: false,
        timestamp: null,
        duration: null
    })),
    statistics: {
        availableSlots: 4,
        occupancyRate: 0,
        lastUpdate: null,
        systemStatus: 'online'
    }
};

// DOM Elements
const elements = {
    slots: Array(4).fill(null).map((_, i) => ({
        container: document.getElementById(`slot-${i + 1}`),
        status: document.getElementById(`status-${i + 1}`),
        indicator: document.getElementById(`status-indicator-${i + 1}`),
        timestamp: document.getElementById(`slot-timestamp-${i + 1}`),
        duration: document.getElementById(`slot-duration-${i + 1}`),
        redLed: document.getElementById(`red-${i + 1}`),
        greenLed: document.getElementById(`green-${i + 1}`)
    })),
    stats: {
        availableSlots: document.getElementById('available-slots'),
        occupancyRate: document.getElementById('occupancy-rate'),
        timestamp: document.getElementById('timestamp'),
        systemStatus: document.getElementById('system-status'),
        currentTime: document.getElementById('current-time')
    }
};

// Update current time
function updateCurrentTime() {
    const now = new Date();
    elements.stats.currentTime.textContent = now.toLocaleTimeString();
}

// Format duration
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Update slot display
function updateSlotDisplay(slotIndex, data) {
    const slot = elements.slots[slotIndex];
    const isOccupied = data.occupied;

    // Update status indicator
    slot.indicator.className = `status-indicator ${isOccupied ? 'bg-red-500' : 'bg-gray-300'}`;

    // Update status text
    slot.status.textContent = isOccupied ? 'Occupied' : 'Available';
    slot.status.className = `text-sm font-medium ${isOccupied ? 'text-red-600' : 'text-green-600'}`;

    // Update LEDs
    slot.redLed.classList.toggle('opacity-30', !isOccupied);
    slot.greenLed.classList.toggle('opacity-30', isOccupied);

    // Update timestamp and duration
    if (isOccupied) {
        if (!state.slots[slotIndex].timestamp) {
            state.slots[slotIndex].timestamp = new Date();
        }
        const duration = Math.floor((new Date() - state.slots[slotIndex].timestamp) / 1000);
        slot.timestamp.textContent = state.slots[slotIndex].timestamp.toLocaleTimeString();
        slot.duration.textContent = formatDuration(duration);
    } else {
        state.slots[slotIndex].timestamp = null;
        slot.timestamp.textContent = '-';
        slot.duration.textContent = '-';
    }
}

// Update statistics
function updateStatistics(data) {
    const occupiedSlots = data.slots.filter(slot => slot.occupied).length;
    const availableSlots = 4 - occupiedSlots;
    const occupancyRate = ((occupiedSlots / 4) * 100).toFixed(1);

    elements.stats.availableSlots.textContent = availableSlots;
    elements.stats.occupancyRate.textContent = `${occupancyRate}%`;
    elements.stats.timestamp.textContent = data.timestamp;
}

// Fetch and update status
async function updateStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        // Update slots
        data.slots.forEach((slot, index) => {
            updateSlotDisplay(index, slot);
        });

        // Update statistics
        updateStatistics(data);

        // Update system status
        elements.stats.systemStatus.textContent = 'Online';
        elements.stats.systemStatus.classList.remove('text-red-600');
    } catch (error) {
        console.error('Error fetching status:', error);
        elements.stats.systemStatus.textContent = 'Offline';
        elements.stats.systemStatus.classList.add('text-red-600');
    }
}

// Initialize
function init() {
    // Start periodic updates
    setInterval(updateCurrentTime, 1000);
    setInterval(updateStatus, 1000);

    // Initial updates
    updateCurrentTime();
    updateStatus();

    // Add event listeners for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.closest('button').dataset.action;
            switch (action) {
                case 'refresh':
                    updateStatus();
                    break;
                case 'export':
                    // Implement export functionality
                    console.log('Export clicked');
                    break;
            }
        });
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', init); 