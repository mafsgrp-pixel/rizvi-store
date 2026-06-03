// ============================================
// RASAAI V2 - Live Dashboard & Counters
// ============================================

class DashboardEngine {
    constructor() {
        this.liveData = {
            liveRickshaws: 342,
            liveCampaigns: 127,
            liveEyeViews: 1247893,
            zonesCovered: 5
        };
        this.updateIntervals = [];
        this.init();
    }

    init() {
        this.startLiveUpdates();
        this.startNotificationCycle();
        this.startInventorySimulation();
    }

    startLiveUpdates() {
        // Update live stats every 5 seconds
        const updateInterval = setInterval(() => {
            this.liveData.liveRickshaws = 340 + Math.floor(Math.random() * 10);
            this.liveData.liveCampaigns = 125 + Math.floor(Math.random() * 8);
            this.liveData.liveEyeViews += Math.floor(Math.random() * 500) + 200;

            animationEngine.animateLiveCounter('liveRickshaws', this.liveData.liveRickshaws);
            animationEngine.animateLiveCounter('liveCampaigns', this.liveData.liveCampaigns);
            animationEngine.animateLiveCounter('liveEyeViews', this.liveData.liveEyeViews);
        }, 5000);

        this.updateIntervals.push(updateInterval);
    }

    startNotificationCycle() {
        const notifications = [
            '🏃 3 businesses booked Kausa zone today',
            '🔥 Mumbra Station zone: Only 8 rickshaws left',
            '✅ New campaign live in Shilphata',
            '💼 A real estate agency just booked 15 rickshaws',
            '🎯 Retibunder zone: 2 new campaigns this hour',
            '⚡ Flash sale: Check Naka at ₹90/day',
            '🏆 Kausa: Top performing zone this week'
        ];

        let notifIndex = 0;
        const notifInterval = setInterval(() => {
            animationEngine.showNotification(notifications[notifIndex]);
            notifIndex = (notifIndex + 1) % notifications.length;
        }, 8000);

        this.updateIntervals.push(notifInterval);
    }

    startInventorySimulation() {
        // Slowly decrease available rickshaws to create urgency
        const inventoryInterval = setInterval(() => {
            Object.values(RASAAI_DATA.zones).forEach(zone => {
                if (zone.availableRickshaws > 3 && Math.random() > 0.7) {
                    zone.availableRickshaws--;
                }
            });
            // Rebuild inventory display
            componentBuilder.buildInventoryCards();
        }, 30000);

        this.updateIntervals.push(inventoryInterval);
    }

    // Pricing countdown timer
    startPricingTimer() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (!timerDisplay) return;

        let seconds = 299; // 4:59

        const timerInterval = setInterval(() => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            if (seconds <= 60) {
                timerDisplay.style.color = 'var(--red)';
                timerDisplay.style.animation = 'pulse 1s ease-in-out infinite';
            }
            
            seconds--;
            
            if (seconds < 0) {
                seconds = 299;
                timerDisplay.style.color = 'var(--amber)';
                timerDisplay.style.animation = '';
            }
        }, 1000);

        this.updateIntervals.push(timerInterval);
    }

    // Exit popup timer
    startExitTimer() {
        const exitTimerDisplay = document.getElementById('exitTimer');
        if (!exitTimerDisplay) return;

        let exitSeconds = 299;

        const exitInterval = setInterval(() => {
            const mins = Math.floor(exitSeconds / 60);
            const secs = exitSeconds % 60;
            exitTimerDisplay.textContent = `Offer refreshes in: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            exitSeconds--;
            if (exitSeconds < 0) exitSeconds = 299;
        }, 1000);

        this.updateIntervals.push(exitInterval);
    }

    // Stop all updates
    cleanup() {
        this.updateIntervals.forEach(clearInterval);
    }
}

const dashboardEngine = new DashboardEngine();
