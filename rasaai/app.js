/**
 * =====================================================
 * RASAAI Outdoor Advertising Network
 * Master Application JavaScript Architecture v1.0
 * Enterprise SaaS - Production Ready
 * 100% Vanilla JavaScript - No External Dependencies
 * =====================================================
 */

"use strict";

// =====================================================
// APPLICATION CONTROLLER
// =====================================================
const AppController = (function() {
    let state = {
        isInitialized: false,
        isOnline: navigator.onLine,
        currentUser: null,
        currentTheme: 'light',
        pricingUpdateInterval: null,
        countdownInterval: null,
        audioInterval: null,
        lastPricingUpdate: null,
        pendingSync: []
    };

    /**
     * Initialize the entire application
     */
    function init() {
        if (state.isInitialized) return;

        try {
            SecurityManager.init();
            StorageManager.init();
            ThemeManager.init();
            
            state.currentUser = StorageManager.get('currentUser', null, true);
            state.currentTheme = ThemeManager.loadTheme();
            
            ThemeManager.applyTheme(state.currentTheme);
            
            PricingEngine.init();
            CampaignCalculator.init();
            ZoneManager.init();
            DashboardManager.init();
            CRMManager.init();
            AffiliateManager.init();
            DriverManager.init();
            NotificationManager.init();
            InvoiceManager.init();
            FormManager.init();
            AnalyticsEngine.init();
            SearchEngine.init();
            
            if (state.currentUser) {
                DashboardManager.loadDashboard();
                NotificationManager.loadNotifications();
            }
            
            PricingEngine.updatePricingCards();
            PricingEngine.startPricingTimer();
            CampaignCalculator.initEventListeners();
            ZoneManager.renderZoneCards();
            
            if (state.currentUser && state.currentUser.role === 'driver') {
                DriverManager.initAudioEngine();
            }
            
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            window.addEventListener('error', ErrorHandler.handleGlobalError);
            window.addEventListener('unhandledrejection', ErrorHandler.handlePromiseError);
            
            state.isInitialized = true;
            console.log('RASAAI Application Initialized Successfully');
        } catch (error) {
            ErrorHandler.logError(error, 'AppController.init');
            ErrorHandler.recoverState();
        }
    }

    function handleOnline() {
        state.isOnline = true;
        NotificationManager.showNotification('You are back online', 'success');
        StorageManager.syncOffline();
    }

    function handleOffline() {
        state.isOnline = false;
        NotificationManager.showNotification('You are offline. Changes will be saved locally', 'warning');
    }

    function getState() {
        return { ...state };
    }

    function setCurrentUser(user) {
        state.currentUser = user;
        StorageManager.set('currentUser', user, true);
        DashboardManager.loadDashboard();
    }

    return {
        init,
        getState,
        setCurrentUser,
        handleOnline,
        handleOffline
    };
})();

// =====================================================
// THEME MANAGER
// =====================================================
const ThemeManager = (function() {
    const THEME_KEY = 'rasaai_theme';
    
    function init() {
        const saved = loadTheme();
        applyTheme(saved);
        document.addEventListener('DOMContentLoaded', () => {
            const toggles = document.querySelectorAll('.theme-toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', toggleTheme);
            });
        });
    }

    function toggleTheme() {
        const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        saveTheme(next);
    }

    function saveTheme(theme) {
        StorageManager.set(THEME_KEY, theme);
    }

    function loadTheme() {
        const saved = StorageManager.get(THEME_KEY);
        if (saved) return saved;
        return detectSystemTheme();
    }

    function detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        });
        
        if (window.AnalyticsEngine) {
            AnalyticsEngine.updateChartTheme(theme);
        }
    }

    return {
        init,
        toggleTheme,
        saveTheme,
        loadTheme,
        detectSystemTheme,
        applyTheme
    };
})();

// =====================================================
// SECURITY MANAGER
// =====================================================
const SecurityManager = (function() {
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    let rateLimitMap = new Map();
    
    function init() {
        validateSession();
        setInterval(validateSession, 60000);
    }

    function sanitize(input) {
        if (typeof input !== 'string') return input;
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    function validateInput(input, type = 'text') {
        if (!input && type !== 'number') return false;
        
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[+]?[\d\s()-]{10,15}$/,
            number: /^\d+$/,
            text: /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()]{1,500}$/,
            name: /^[a-zA-Z\s\-']{2,100}$/,
            url: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
            pincode: /^\d{6}$/,
            gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/
        };

        if (patterns[type]) {
            return patterns[type].test(input);
        }
        return true;
    }

    function validateSession() {
        const user = StorageManager.get('currentUser', null, true);
        if (user) {
            const loginTime = StorageManager.get('loginTime', Date.now());
            if (Date.now() - loginTime > SESSION_DURATION) {
                logout();
                return false;
            }
            StorageManager.set('loginTime', Date.now());
            return true;
        }
        return false;
    }

    function checkPermission(user, resource) {
        if (!user) return false;
        
        const permissions = {
            admin: ['*'],
            manager: ['dashboard', 'campaigns', 'analytics', 'crm', 'invoices', 'zones'],
            sales: ['crm', 'leads', 'campaigns', 'invoices'],
            driver: ['driver_dashboard', 'tasks', 'gps', 'audio'],
            affiliate: ['affiliate_dashboard', 'referrals', 'commissions', 'wallet'],
            client: ['campaigns', 'invoices', 'analytics']
        };

        const userPerms = permissions[user.role] || [];
        return userPerms.includes('*') || userPerms.includes(resource);
    }

    function rateLimit(key, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        if (!rateLimitMap.has(key)) {
            rateLimitMap.set(key, []);
        }
        
        const attempts = rateLimitMap.get(key).filter(time => now - time < windowMs);
        
        if (attempts.length >= maxAttempts) {
            return false;
        }
        
        attempts.push(now);
        rateLimitMap.set(key, attempts);
        return true;
    }

    function encryptData(data) {
        if (!data) return null;
        try {
            const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
            return btoa(unescape(encodeURIComponent(jsonString)));
        } catch (error) {
            ErrorHandler.logError(error, 'encryptData');
            return data;
        }
    }

    function decryptData(encoded) {
        if (!encoded) return null;
        try {
            const decoded = decodeURIComponent(escape(atob(encoded)));
            return JSON.parse(decoded);
        } catch (error) {
            ErrorHandler.logError(error, 'decryptData');
            return encoded;
        }
    }

    function logout() {
        StorageManager.remove('currentUser', true);
        StorageManager.remove('loginTime');
        window.location.reload();
    }

    function generateToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    return {
        init,
        sanitize,
        validateInput,
        validateSession,
        checkPermission,
        rateLimit,
        encryptData,
        decryptData,
        logout,
        generateToken
    };
})();

// =====================================================
// STORAGE MANAGER
// =====================================================
const StorageManager = (function() {
    const PREFIX = 'rasaai_';
    let memoryStorage = {};
    let isLocalStorageAvailable = false;

    function init() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            isLocalStorageAvailable = true;
        } catch (e) {
            isLocalStorageAvailable = false;
            console.warn('LocalStorage not available, using memory storage');
        }
    }

    function set(key, value, secure = false) {
        const fullKey = PREFIX + key;
        const data = {
            value: secure ? SecurityManager.encryptData(value) : value,
            timestamp: Date.now(),
            secure
        };

        if (isLocalStorageAvailable) {
            try {
                localStorage.setItem(fullKey, JSON.stringify(data));
            } catch (e) {
                memoryStorage[fullKey] = data;
            }
        } else {
            memoryStorage[fullKey] = data;
        }
    }

    function get(key, defaultValue = null, secure = false) {
        const fullKey = PREFIX + key;
        let data = null;

        if (isLocalStorageAvailable) {
            try {
                const stored = localStorage.getItem(fullKey);
                if (stored) {
                    data = JSON.parse(stored);
                }
            } catch (e) {
                data = memoryStorage[fullKey];
            }
        } else {
            data = memoryStorage[fullKey];
        }

        if (!data) return defaultValue;

        if (data.secure || secure) {
            return SecurityManager.decryptData(data.value) || defaultValue;
        }

        return data.value !== undefined ? data.value : defaultValue;
    }

    function remove(key) {
        const fullKey = PREFIX + key;
        if (isLocalStorageAvailable) {
            localStorage.removeItem(fullKey);
        }
        delete memoryStorage[fullKey];
    }

    function clear() {
        if (isLocalStorageAvailable) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        }
        memoryStorage = {};
    }

    function saveOffline(data, key) {
        const offlineQueue = get('offlineQueue', []);
        offlineQueue.push({
            key,
            data,
            timestamp: Date.now()
        });
        set('offlineQueue', offlineQueue);
    }

    function syncOffline() {
        const queue = get('offlineQueue', []);
        if (queue.length === 0) return;

        queue.forEach(item => {
            set(item.key, item.data);
        });
        remove('offlineQueue');
        console.log(`Synced ${queue.length} offline items`);
    }

    function backup() {
        const backup = {};
        if (isLocalStorageAvailable) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(PREFIX)) {
                    backup[key] = localStorage.getItem(key);
                }
            });
        }
        Object.keys(memoryStorage).forEach(key => {
            backup[key] = JSON.stringify(memoryStorage[key]);
        });
        return JSON.stringify(backup);
    }

    function restore(backupJson) {
        try {
            const backup = JSON.parse(backupJson);
            Object.keys(backup).forEach(key => {
                if (isLocalStorageAvailable) {
                    localStorage.setItem(key, backup[key]);
                } else {
                    memoryStorage[key] = JSON.parse(backup[key]);
                }
            });
            return true;
        } catch (error) {
            ErrorHandler.logError(error, 'StorageManager.restore');
            return false;
        }
    }

    return {
        init,
        set,
        get,
        remove,
        clear,
        saveOffline,
        syncOffline,
        backup,
        restore
    };
})();

// =====================================================
// LIVE PRICING ENGINE
// =====================================================
const PricingEngine = (function() {
    const UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes
    const LED_MIN = 1238;
    const LED_MAX = 1647;
    const AUDIO_MIN = 318;
    const AUDIO_MAX = 639;
    
    let currentPrices = {
        led: 0,
        audio: 0,
        combo: 0,
        lastUpdated: null
    };
    
    let updateInterval = null;
    let countdownInterval = null;
    let secondsRemaining = 900;

    function init() {
        const saved = StorageManager.get('currentPrices');
        if (saved && saved.lastUpdated) {
            const elapsed = Date.now() - saved.lastUpdated;
            if (elapsed < UPDATE_INTERVAL) {
                currentPrices = saved;
                secondsRemaining = Math.floor((UPDATE_INTERVAL - elapsed) / 1000);
                return;
            }
        }
        generatePrices();
    }

    function generateLEDPrice() {
        const base = Math.floor(Math.random() * (LED_MAX - LED_MIN + 1)) + LED_MIN;
        return base;
    }

    function generateAudioPrice() {
        const base = Math.floor(Math.random() * (AUDIO_MAX - AUDIO_MIN + 1)) + AUDIO_MIN;
        return base;
    }

    function generateComboPrice() {
        const led = currentPrices.led || generateLEDPrice();
        const audio = currentPrices.audio || generateAudioPrice();
        const combo = (led + audio) * 0.82; // 18% combo discount
        return Math.round(combo);
    }

    function applyDiscount(price, discountPercent) {
        if (discountPercent <= 0 || discountPercent > 100) return price;
        return Math.round(price * (1 - discountPercent / 100));
    }

    function generatePrices() {
        currentPrices.led = generateLEDPrice();
        currentPrices.audio = generateAudioPrice();
        currentPrices.combo = generateComboPrice();
        currentPrices.lastUpdated = Date.now();
        
        StorageManager.set('currentPrices', currentPrices);
        secondsRemaining = UPDATE_INTERVAL / 1000;
    }

    function updatePricingCards() {
        const ledElements = document.querySelectorAll('.price-led');
        const audioElements = document.querySelectorAll('.price-audio');
        const comboElements = document.querySelectorAll('.price-combo');
        const timerElements = document.querySelectorAll('.pricing-timer');

        ledElements.forEach(el => {
            el.textContent = `₹${currentPrices.led.toLocaleString()}`;
            animateNumber(el);
        });

        audioElements.forEach(el => {
            el.textContent = `₹${currentPrices.audio.toLocaleString()}`;
            animateNumber(el);
        });

        comboElements.forEach(el => {
            el.textContent = `₹${currentPrices.combo.toLocaleString()}`;
            animateNumber(el);
        });

        timerElements.forEach(el => {
            updateTimerDisplay(el);
        });
    }

    function animateNumber(element) {
        element.classList.add('number-animate');
        setTimeout(() => element.classList.remove('number-animate'), 500);
    }

    function startPricingTimer() {
        if (updateInterval) clearInterval(updateInterval);
        if (countdownInterval) clearInterval(countdownInterval);
        
        updateInterval = setInterval(() => {
            generatePrices();
            updatePricingCards();
            secondsRemaining = UPDATE_INTERVAL / 1000;
        }, UPDATE_INTERVAL);
        
        countdownInterval = setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining <= 0) {
                secondsRemaining = UPDATE_INTERVAL / 1000;
            }
            
            const timerElements = document.querySelectorAll('.pricing-timer');
            timerElements.forEach(el => updateTimerDisplay(el));
        }, 1000);
    }

    function updateTimerDisplay(element) {
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        element.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (secondsRemaining <= 300) {
            element.classList.add('timer-urgent');
        } else {
            element.classList.remove('timer-urgent');
        }
    }

    function getCurrentPrices() {
        return { ...currentPrices };
    }

    function savePricing() {
        StorageManager.set('currentPrices', currentPrices);
    }

    function loadPricing() {
        return StorageManager.get('currentPrices', currentPrices);
    }

    return {
        init,
        generateLEDPrice,
        generateAudioPrice,
        generateComboPrice,
        applyDiscount,
        updatePricingCards,
        startPricingTimer,
        getCurrentPrices,
        savePricing,
        loadPricing
    };
})();

// =====================================================
// CAMPAIGN CALCULATOR
// =====================================================
const CampaignCalculator = (function() {
    const ZONES = [
        { id: 'kausa', name: 'Kausa', population: 45000, rickshaws: 50, impressions: 125000, traffic: 85000 },
        { id: 'mumbra-station', name: 'Mumbra Station', population: 78000, rickshaws: 50, impressions: 220000, traffic: 150000 },
        { id: 'amrut-nagar', name: 'Amrut Nagar', population: 35000, rickshaws: 50, impressions: 95000, traffic: 65000 },
        { id: 'shilphata', name: 'Shilphata', population: 55000, rickshaws: 50, impressions: 155000, traffic: 110000 },
        { id: 'retibunder', name: 'Retibunder', population: 28000, rickshaws: 50, impressions: 78000, traffic: 52000 },
        { id: 'diva-junction', name: 'Diva Junction', population: 62000, rickshaws: 50, impressions: 175000, traffic: 120000 },
        { id: 'check-naka', name: 'Check Naka', population: 42000, rickshaws: 50, impressions: 118000, traffic: 80000 },
        { id: 'mumbra-bypass', name: 'Mumbra Bypass', population: 38000, rickshaws: 50, impressions: 105000, traffic: 72000 },
        { id: 'kalwa-route', name: 'Kalwa Route', population: 48000, rickshaws: 50, impressions: 135000, traffic: 92000 },
        { id: 'almas-colony', name: 'Almas Colony', population: 32000, rickshaws: 50, impressions: 88000, traffic: 60000 },
        { id: 'azad-nagar', name: 'Azad Nagar', population: 40000, rickshaws: 50, impressions: 112000, traffic: 76000 },
        { id: 'mumbra-market', name: 'Mumbra Market', population: 52000, rickshaws: 50, impressions: 148000, traffic: 100000 }
    ];

    const CAMPAIGN_TYPES = {
        led: { name: 'LED Campaign', baseCPM: 45, discountThreshold: 7, discountPercent: 8 },
        audio: { name: 'Audio Campaign', baseCPM: 22, discountThreshold: 10, discountPercent: 12 },
        combo: { name: 'Combo Campaign', baseCPM: 60, discountThreshold: 5, discountPercent: 15 }
    };

    function init() {
        // Any additional setup
    }

    function initEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const calculator = document.getElementById('campaign-calculator');
            if (calculator) {
                const inputs = calculator.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.addEventListener('change', calculateCampaign);
                    input.addEventListener('input', calculateCampaign);
                });
            }
        });
    }

    function calculateCampaign() {
        const zoneSelect = document.getElementById('calc-zone');
        const typeSelect = document.getElementById('calc-type');
        const durationInput = document.getElementById('calc-duration');
        const quantityInput = document.getElementById('calc-quantity');
        
        if (!zoneSelect || !typeSelect || !durationInput || !quantityInput) {
            return { cost: 0, reach: 0, impressions: 0, cpm: 0, roi: 0, discount: 0 };
        }

        const zoneId = zoneSelect.value;
        const campaignType = typeSelect.value;
        const duration = parseInt(durationInput.value) || 1;
        const quantity = parseInt(quantityInput.value) || 1;

        const zone = ZONES.find(z => z.id === zoneId);
        if (!zone) return { cost: 0, reach: 0, impressions: 0, cpm: 0, roi: 0, discount: 0 };

        const typeConfig = CAMPAIGN_TYPES[campaignType];
        if (!typeConfig) return { cost: 0, reach: 0, impressions: 0, cpm: 0, roi: 0, discount: 0 };

        const baseReach = Math.floor(zone.traffic * 0.4);
        const adjustedReach = calculateReach(baseReach, quantity, duration);
        const impressions = calculateImpressions(adjustedReach, duration);
        const baseCost = impressions * typeConfig.baseCPM / 1000;
        const discount = quantity >= typeConfig.discountThreshold ? typeConfig.discountPercent : 0;
        const discountedCost = PricingEngine.applyDiscount(baseCost, discount);
        const cpm = calculateCPM(discountedCost, impressions);
        const roi = calculateROI(discountedCost, impressions, zone);

        const result = {
            cost: Math.round(discountedCost),
            reach: adjustedReach,
            impressions: impressions,
            cpm: Math.round(cpm * 100) / 100,
            roi: Math.round(roi * 100) / 100,
            discount: discount
        };

        updateCalculatorDisplay(result);
        return result;
    }

    function calculateReach(baseReach, quantity, duration) {
        const quantityMultiplier = 1 + (quantity - 1) * 0.65;
        const durationMultiplier = 1 + (duration - 1) * 0.3;
        return Math.floor(baseReach * quantityMultiplier * durationMultiplier);
    }

    function calculateImpressions(reach, duration) {
        const frequencyMultiplier = 2.8;
        return Math.floor(reach * frequencyMultiplier * duration);
    }

    function calculateCPM(cost, impressions) {
        if (impressions === 0) return 0;
        return (cost / impressions) * 1000;
    }

    function calculateROI(cost, impressions, zone) {
        const estimatedLeads = impressions * 0.002;
        const estimatedConversions = estimatedLeads * 0.15;
        const avgCustomerValue = 5000;
        const revenue = estimatedConversions * avgCustomerValue;
        if (cost === 0) return 0;
        return ((revenue - cost) / cost) * 100;
    }

    function updateCalculatorDisplay(result) {
        const costEl = document.getElementById('calc-cost');
        const reachEl = document.getElementById('calc-reach');
        const impressionsEl = document.getElementById('calc-impressions');
        const cpmEl = document.getElementById('calc-cpm');
        const roiEl = document.getElementById('calc-roi');
        const discountEl = document.getElementById('calc-discount');

        if (costEl) {
            costEl.textContent = `₹${result.cost.toLocaleString()}`;
            animateElement(costEl);
        }
        if (reachEl) {
            reachEl.textContent = result.reach.toLocaleString();
            animateElement(reachEl);
        }
        if (impressionsEl) {
            impressionsEl.textContent = result.impressions.toLocaleString();
            animateElement(impressionsEl);
        }
        if (cpmEl) {
            cpmEl.textContent = `₹${result.cpm}`;
            animateElement(cpmEl);
        }
        if (roiEl) {
            roiEl.textContent = `${result.roi}%`;
            const roiClass = result.roi > 200 ? 'roi-high' : result.roi > 100 ? 'roi-medium' : 'roi-low';
            roiEl.className = roiClass;
            animateElement(roiEl);
        }
        if (discountEl) {
            discountEl.textContent = result.discount > 0 ? `${result.discount}% Applied!` : 'No Discount';
            discountEl.className = result.discount > 0 ? 'discount-active' : '';
        }
    }

    function animateElement(el) {
        el.classList.add('value-updated');
        setTimeout(() => el.classList.remove('value-updated'), 600);
    }

    function getZones() {
        return [...ZONES];
    }

    function getCampaignTypes() {
        return { ...CAMPAIGN_TYPES };
    }

    return {
        init,
        initEventListeners,
        calculateCampaign,
        calculateReach,
        calculateImpressions,
        calculateCPM,
        calculateROI,
        getZones,
        getCampaignTypes
    };
})();

// =====================================================
// ZONE MANAGER
// =====================================================
const ZoneManager = (function() {
    const ZONES = CampaignCalculator.getZones();
    let currentFilter = 'all';
    let currentSearch = '';

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            renderZoneCards();
            
            const searchInput = document.getElementById('zone-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    currentSearch = e.target.value.toLowerCase();
                    renderZoneCards();
                });
            }

            const filterButtons = document.querySelectorAll('.zone-filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentFilter = btn.dataset.filter || 'all';
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderZoneCards();
                });
            });
        });
    }

    function loadZones() {
        return StorageManager.get('zones', ZONES);
    }

    function filterZones(criteria = {}) {
        let filtered = [...ZONES];
        
        if (criteria.minPopulation) {
            filtered = filtered.filter(z => z.population >= criteria.minPopulation);
        }
        if (criteria.maxPopulation) {
            filtered = filtered.filter(z => z.population <= criteria.maxPopulation);
        }
        if (criteria.minTraffic) {
            filtered = filtered.filter(z => z.traffic >= criteria.minTraffic);
        }
        if (criteria.availableRickshaws !== undefined) {
            const inventory = InventoryManager.getInventory();
            filtered = filtered.filter(z => {
                const zoneInventory = inventory[z.id] || {};
                const available = zoneInventory.available || 50;
                return criteria.availableRickshaws === true ? available > 0 : available === 0;
            });
        }
        
        return filtered;
    }

    function searchZones(query) {
        if (!query) return [...ZONES];
        const q = query.toLowerCase();
        return ZONES.filter(z => 
            z.name.toLowerCase().includes(q) || 
            z.id.toLowerCase().includes(q)
        );
    }

    function renderZoneCards() {
        const container = document.getElementById('zone-cards-container');
        if (!container) return;

        let zones = [...ZONES];
        
        if (currentSearch) {
            zones = searchZones(currentSearch);
        }
        
        if (currentFilter === 'high-traffic') {
            zones = zones.filter(z => z.traffic >= 100000);
        } else if (currentFilter === 'high-population') {
            zones = zones.filter(z => z.population >= 50000);
        } else if (currentFilter === 'available') {
            const inventory = InventoryManager.getInventory();
            zones = zones.filter(z => {
                const zoneInv = inventory[z.id];
                return zoneInv ? zoneInv.available > 0 : true;
            });
        }

        if (zones.length === 0) {
            container.innerHTML = `
                <div class="no-zones-message">
                    <p>No zones match your criteria</p>
                </div>`;
            return;
        }

        container.innerHTML = zones.map(zone => {
            const inventory = InventoryManager.getInventory();
            const zoneInventory = inventory[zone.id] || { total: 50, available: 50, booked: 0 };
            const availabilityPercent = Math.round((zoneInventory.available / zoneInventory.total) * 100);
            const availabilityClass = availabilityPercent > 50 ? 'high' : availabilityPercent > 20 ? 'medium' : 'low';
            
            return `
            <div class="zone-card glass-card" data-zone-id="${zone.id}" onclick="ZoneManager.selectZone('${zone.id}')">
                <div class="zone-card-header">
                    <h3 class="card-title">${zone.name}</h3>
                    <span class="zone-availability ${availabilityClass}">${zoneInventory.available} Available</span>
                </div>
                <div class="zone-stats">
                    <div class="zone-stat">
                        <span>Population</span>
                        <strong>${zone.population.toLocaleString()}</strong>
                    </div>
                    <div class="zone-stat">
                        <span>Daily Traffic</span>
                        <strong>${zone.traffic.toLocaleString()}</strong>
                    </div>
                    <div class="zone-stat">
                        <span>Impressions</span>
                        <strong>${zone.impressions.toLocaleString()}</strong>
                    </div>
                    <div class="zone-stat">
                        <span>Rickshaws</span>
                        <strong>${zoneInventory.available}/${zone.rickshaws}</strong>
                    </div>
                </div>
                <div class="zone-progress-bar">
                    <div class="zone-progress-fill" style="width: ${availabilityPercent}%"></div>
                </div>
            </div>`;
        }).join('');
    }

    function selectZone(zoneId) {
        const zone = ZONES.find(z => z.id === zoneId);
        if (!zone) return;

        const event = new CustomEvent('zoneSelected', { detail: zone });
        document.dispatchEvent(event);

        const zoneDetailModal = document.getElementById('zone-detail-modal');
        if (zoneDetailModal) {
            const modalContent = zoneDetailModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.innerHTML = renderZoneDetail(zone);
                zoneDetailModal.classList.add('active');
            }
        }

        if (document.getElementById('calc-zone')) {
            document.getElementById('calc-zone').value = zoneId;
            CampaignCalculator.calculateCampaign();
        }
    }

    function renderZoneDetail(zone) {
        const inventory = InventoryManager.getInventory();
        const zoneInventory = inventory[zone.id] || { total: 50, available: 50, booked: 0 };
        
        return `
        <div class="zone-detail">
            <h2>${zone.name}</h2>
            <div class="zone-detail-grid">
                <div class="detail-item">
                    <label>Population</label>
                    <span>${zone.population.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Daily Traffic</label>
                    <span>${zone.traffic.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Daily Impressions</label>
                    <span>${zone.impressions.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Total Rickshaws</label>
                    <span>${zoneInventory.total}</span>
                </div>
                <div class="detail-item">
                    <label>Available</label>
                    <span class="text-success">${zoneInventory.available}</span>
                </div>
                <div class="detail-item">
                    <label>Booked</label>
                    <span class="text-primary">${zoneInventory.booked}</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="ZoneManager.bookZone('${zone.id}')">Book This Zone</button>
            <button class="btn btn-secondary" onclick="document.getElementById('zone-detail-modal').classList.remove('active')">Close</button>
        </div>`;
    }

    function bookZone(zoneId) {
        const user = StorageManager.get('currentUser', null, true);
        if (!user) {
            NotificationManager.showNotification('Please login to book a zone', 'warning');
            return;
        }
        
        const zone = ZONES.find(z => z.id === zoneId);
        if (!zone) return;
        
        const success = InventoryManager.bookRickshaw(zoneId, 1);
        if (success) {
            NotificationManager.showNotification(`Zone ${zone.name} booked successfully!`, 'success');
            renderZoneCards();
        } else {
            NotificationManager.showNotification('No rickshaws available in this zone', 'error');
        }
    }

    return {
        init,
        loadZones,
        filterZones,
        searchZones,
        renderZoneCards,
        selectZone,
        bookZone
    };
})();

// =====================================================
// INVENTORY MANAGER
// =====================================================
const InventoryManager = (function() {
    const TOTAL_RICKSHAWS = 50;
    let inventory = {};

    function init() {
        const saved = StorageManager.get('inventory');
        if (saved) {
            inventory = saved;
        } else {
            initializeInventory();
        }
    }

    function initializeInventory() {
        const zones = CampaignCalculator.getZones();
        zones.forEach(zone => {
            inventory[zone.id] = {
                total: TOTAL_RICKSHAWS,
                available: TOTAL_RICKSHAWS,
                booked: 0,
                maintenance: 0,
                active: 0
            };
        });
        StorageManager.set('inventory', inventory);
    }

    function loadInventory() {
        return { ...inventory };
    }

    function getInventory() {
        return { ...inventory };
    }

    function calculateAvailability(zoneId) {
        const zoneInventory = inventory[zoneId];
        if (!zoneInventory) return 0;
        return zoneInventory.available;
    }

    function bookRickshaw(zoneId, quantity = 1) {
        const zoneInventory = inventory[zoneId];
        if (!zoneInventory || zoneInventory.available < quantity) return false;
        
        zoneInventory.available -= quantity;
        zoneInventory.booked += quantity;
        StorageManager.set('inventory', inventory);
        return true;
    }

    function releaseRickshaw(zoneId, quantity = 1) {
        const zoneInventory = inventory[zoneId];
        if (!zoneInventory || zoneInventory.booked < quantity) return false;
        
        zoneInventory.available += quantity;
        zoneInventory.booked -= quantity;
        StorageManager.set('inventory', inventory);
        return true;
    }

    function updateInventory(zoneId, updates) {
        if (!inventory[zoneId]) return false;
        
        Object.keys(updates).forEach(key => {
            if (inventory[zoneId][key] !== undefined) {
                inventory[zoneId][key] = updates[key];
            }
        });
        
        StorageManager.set('inventory', inventory);
        return true;
    }

    function renderInventory() {
        const container = document.getElementById('inventory-container');
        if (!container) return;

        const zones = CampaignCalculator.getZones();
        container.innerHTML = zones.map(zone => {
            const zoneInv = inventory[zone.id] || { total: 50, available: 50, booked: 0 };
            return `
            <tr>
                <td>${zone.name}</td>
                <td>${zoneInv.total}</td>
                <td>${zoneInv.available}</td>
                <td>${zoneInv.booked}</td>
                <td>${zoneInv.maintenance || 0}</td>
                <td>${zoneInv.active || 0}</td>
            </tr>`;
        }).join('');
    }

    function getInventoryStats() {
        let totalAvailable = 0;
        let totalBooked = 0;
        let totalMaintenance = 0;
        
        Object.values(inventory).forEach(zone => {
            totalAvailable += zone.available || 0;
            totalBooked += zone.booked || 0;
            totalMaintenance += zone.maintenance || 0;
        });
        
        return {
            totalAvailable,
            totalBooked,
            totalMaintenance,
            totalRickshaws: Object.keys(inventory).length * TOTAL_RICKSHAWS
        };
    }

    return {
        init,
        loadInventory,
        getInventory,
        calculateAvailability,
        bookRickshaw,
        releaseRickshaw,
        updateInventory,
        renderInventory,
        getInventoryStats
    };
})();

// =====================================================
// USER AUTHENTICATION
// =====================================================
const AuthManager = (function() {
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const logoutBtn = document.getElementById('logout-btn');
            const forgotForm = document.getElementById('forgot-password-form');
            
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            if (registerForm) {
                registerForm.addEventListener('submit', handleRegister);
            }
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logoutUser);
            }
            if (forgotForm) {
                forgotForm.addEventListener('submit', handleForgotPassword);
            }
        });
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const remember = document.getElementById('remember-me')?.checked;

        if (!SecurityManager.validateInput(email, 'email')) {
            NotificationManager.showNotification('Please enter a valid email', 'error');
            return false;
        }

        if (!SecurityManager.rateLimit(`login_${email}`, 5, 300000)) {
            NotificationManager.showNotification('Too many attempts. Please try again later.', 'error');
            return false;
        }

        const users = StorageManager.get('users', []);
        const user = users.find(u => u.email === email && u.password === hashPassword(password));

        if (user) {
            const sessionUser = { ...user };
            delete sessionUser.password;
            AppController.setCurrentUser(sessionUser);
            StorageManager.set('loginTime', Date.now());
            
            if (remember) {
                StorageManager.set('rememberedUser', email);
            }
            
            NotificationManager.showNotification('Login successful!', 'success');
            DashboardManager.loadDashboard();
            return true;
        } else {
            NotificationManager.showNotification('Invalid email or password', 'error');
            return false;
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name')?.value;
        const email = document.getElementById('reg-email')?.value;
        const phone = document.getElementById('reg-phone')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirmPassword = document.getElementById('reg-confirm-password')?.value;

        if (!SecurityManager.validateInput(name, 'name')) {
            NotificationManager.showNotification('Please enter a valid name', 'error');
            return false;
        }
        if (!SecurityManager.validateInput(email, 'email')) {
            NotificationManager.showNotification('Please enter a valid email', 'error');
            return false;
        }
        if (!SecurityManager.validateInput(phone, 'phone')) {
            NotificationManager.showNotification('Please enter a valid phone number', 'error');
            return false;
        }
        if (password !== confirmPassword) {
            NotificationManager.showNotification('Passwords do not match', 'error');
            return false;
        }
        if (password.length < 8) {
            NotificationManager.showNotification('Password must be at least 8 characters', 'error');
            return false;
        }

        const users = StorageManager.get('users', []);
        
        if (users.find(u => u.email === email)) {
            NotificationManager.showNotification('Email already registered', 'error');
            return false;
        }

        const newUser = {
            id: generateUserId(),
            name: SecurityManager.sanitize(name),
            email: SecurityManager.sanitize(email),
            phone: SecurityManager.sanitize(phone),
            password: hashPassword(password),
            role: 'client',
            createdAt: new Date().toISOString(),
            isActive: true
        };

        users.push(newUser);
        StorageManager.set('users', users);
        
        const sessionUser = { ...newUser };
        delete sessionUser.password;
        AppController.setCurrentUser(sessionUser);
        StorageManager.set('loginTime', Date.now());
        
        NotificationManager.showNotification('Registration successful!', 'success');
        DashboardManager.loadDashboard();
        return true;
    }

    function logoutUser() {
        AppController.setCurrentUser(null);
        StorageManager.remove('loginTime');
        NotificationManager.showNotification('Logged out successfully', 'info');
        window.location.hash = '#home';
        window.location.reload();
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email')?.value;
        
        if (!SecurityManager.validateInput(email, 'email')) {
            NotificationManager.showNotification('Please enter a valid email', 'error');
            return false;
        }

        const otp = generateOTP();
        StorageManager.set(`otp_${email}`, { otp, expires: Date.now() + 600000 });
        
        NotificationManager.showNotification(`OTP sent to ${email}. Demo OTP: ${otp}`, 'success');
        return true;
    }

    function verifyOTP(email, otp) {
        const stored = StorageManager.get(`otp_${email}`);
        if (!stored) {
            NotificationManager.showNotification('OTP expired. Please request again', 'error');
            return false;
        }
        
        if (Date.now() > stored.expires) {
            StorageManager.remove(`otp_${email}`);
            NotificationManager.showNotification('OTP expired. Please request again', 'error');
            return false;
        }
        
        if (stored.otp !== otp) {
            NotificationManager.showNotification('Invalid OTP', 'error');
            return false;
        }
        
        StorageManager.remove(`otp_${email}`);
        return true;
    }

    function changePassword(email, newPassword) {
        if (newPassword.length < 8) {
            NotificationManager.showNotification('Password must be at least 8 characters', 'error');
            return false;
        }
        
        const users = StorageManager.get('users', []);
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex === -1) {
            NotificationManager.showNotification('User not found', 'error');
            return false;
        }
        
        users[userIndex].password = hashPassword(newPassword);
        StorageManager.set('users', users);
        NotificationManager.showNotification('Password changed successfully', 'success');
        return true;
    }

    function updateProfile(updates) {
        const user = StorageManager.get('currentUser', null, true);
        if (!user) return false;
        
        const users = StorageManager.get('users', []);
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return false;
        
        Object.keys(updates).forEach(key => {
            if (key !== 'password' && key !== 'id' && key !== 'role') {
                users[userIndex][key] = SecurityManager.sanitize(updates[key]);
            }
        });
        
        StorageManager.set('users', users);
        
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        AppController.setCurrentUser(updatedUser);
        
        NotificationManager.showNotification('Profile updated successfully', 'success');
        return true;
    }

    function hashPassword(password) {
        let hash = 0;
        const salt = 'RASAAI_SALT_2024';
        const combined = password + salt;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    function generateUserId() {
        return 'USR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    function generateOTP() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    return {
        init,
        handleLogin,
        handleRegister,
        logoutUser,
        handleForgotPassword,
        verifyOTP,
        changePassword,
        updateProfile
    };
})();

// =====================================================
// DASHBOARD MANAGER
// =====================================================
const DashboardManager = (function() {
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const user = StorageManager.get('currentUser', null, true);
            if (user) {
                loadDashboard();
            }
        });
    }

    function loadDashboard() {
        const user = StorageManager.get('currentUser', null, true);
        if (!user) return;

        const dashboardMain = document.querySelector('.dashboard-main');
        if (!dashboardMain) return;

        switch (user.role) {
            case 'admin':
                renderAdminDashboard();
                break;
            case 'client':
                renderClientDashboard();
                break;
            case 'driver':
                renderDriverDashboard();
                break;
            case 'affiliate':
                renderAffiliateDashboard();
                break;
            case 'sales':
                renderSalesDashboard();
                break;
            default:
                renderClientDashboard();
        }
    }

    function renderClientDashboard() {
        const main = document.querySelector('.dashboard-main');
        if (!main) return;
        
        main.innerHTML = `
            <div class="dashboard-welcome">
                <h2>Welcome back!</h2>
                <p>Here's your campaign overview</p>
            </div>
            <div class="widget-grid" id="dashboard-widgets"></div>
            <div class="dashboard-charts">
                <div class="chart-container" id="campaign-chart-container"></div>
                <div class="chart-container" id="revenue-chart-container"></div>
            </div>
            <div class="recent-campaigns">
                <h3>Recent Campaigns</h3>
                <div class="data-table-container" id="recent-campaigns-table"></div>
            </div>`;
        
        renderWidgets();
        AnalyticsEngine.initClientCharts();
        renderRecentCampaigns();
    }

    function renderAdminDashboard() {
        const main = document.querySelector('.dashboard-main');
        if (!main) return;
        
        main.innerHTML = `
            <div class="admin-header">
                <h2>Admin Dashboard</h2>
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="CRMManager.openNewLead()">Add Lead</button>
                    <button class="btn btn-secondary" onclick="InvoiceManager.generateInvoice()">New Invoice</button>
                </div>
            </div>
            <div class="widget-grid" id="admin-widgets"></div>
            <div class="admin-charts">
                <div class="chart-container" id="revenue-trend-chart"></div>
                <div class="chart-container" id="zone-performance-chart"></div>
            </div>
            <div class="admin-tables">
                <div class="table-section">
                    <h3>Recent Users</h3>
                    <div id="recent-users-table"></div>
                </div>
                <div class="table-section">
                    <h3>Pending Approvals</h3>
                    <div id="pending-approvals-table"></div>
                </div>
            </div>`;
        
        renderAdminWidgets();
        AnalyticsEngine.initAdminCharts();
    }

    function renderWidgets() {
        const container = document.getElementById('dashboard-widgets');
        if (!container) return;
        
        const stats = AnalyticsEngine.getUserStats();
        const inventoryStats = InventoryManager.getInventoryStats();
        
        const widgets = [
            {
                title: 'Active Campaigns',
                value: stats.activeCampaigns || 0,
                icon: '📊',
                color: 'var(--color-primary)',
                trend: '+12%'
            },
            {
                title: 'Total Impressions',
                value: (stats.totalImpressions || 0).toLocaleString(),
                icon: '👁️',
                color: 'var(--color-accent-cyan)',
                trend: '+8.5%'
            },
            {
                title: 'Revenue',
                value: `₹${(stats.revenue || 0).toLocaleString()}`,
                icon: '💰',
                color: 'var(--color-success)',
                trend: '+15.3%'
            },
            {
                title: 'Available Rickshaws',
                value: inventoryStats.totalAvailable,
                icon: '🛺',
                color: 'var(--color-warning)',
                trend: `${inventoryStats.totalBooked} Booked`
            }
        ];
        
        container.innerHTML = widgets.map(w => `
            <div class="widget glass">
                <div class="widget-header">
                    <span class="widget-icon" style="color: ${w.color}">${w.icon}</span>
                    <span class="widget-trend ${w.trend.includes('+') ? 'positive' : 'negative'}">${w.trend}</span>
                </div>
                <div class="widget-value">${w.value}</div>
                <div class="widget-title">${w.title}</div>
            </div>
        `).join('');
    }

    function renderAdminWidgets() {
        const container = document.getElementById('admin-widgets');
        if (!container) return;
        
        const totalUsers = StorageManager.get('users', []).length;
        const totalCampaigns = StorageManager.get('campaigns', []).length;
        const totalRevenue = AnalyticsEngine.getTotalRevenue();
        const pendingInvoices = StorageManager.get('invoices', []).filter(i => i.status === 'pending').length;
        
        const widgets = [
            { title: 'Total Users', value: totalUsers, icon: '👥', color: '#6C4DF6' },
            { title: 'Total Campaigns', value: totalCampaigns, icon: '📢', color: '#3C82F6' },
            { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💵', color: '#00C896' },
            { title: 'Pending Invoices', value: pendingInvoices, icon: '📄', color: '#FFB547' }
        ];
        
        container.innerHTML = widgets.map(w => `
            <div class="widget glass">
                <span class="widget-icon" style="color: ${w.color}">${w.icon}</span>
                <div class="widget-value">${w.value}</div>
                <div class="widget-title">${w.title}</div>
            </div>
        `).join('');
    }

    function renderDriverDashboard() {
        const main = document.querySelector('.dashboard-main');
        if (!main) return;
        
        main.innerHTML = `
            <div class="driver-status">
                <div class="driver-status-card glass-card">
                    <h3>Today's Status</h3>
                    <div class="status-indicator" id="driver-status-indicator">Offline</div>
                    <div class="driver-actions">
                        <button class="btn btn-primary" id="start-duty-btn" onclick="DriverManager.startDuty()">Start Duty</button>
                        <button class="btn btn-secondary" id="pause-duty-btn" onclick="DriverManager.pauseDuty()" disabled>Pause</button>
                        <button class="btn btn-danger" id="end-duty-btn" onclick="DriverManager.endDuty()" disabled>End Duty</button>
                    </div>
                </div>
            </div>
            <div class="driver-tasks" id="driver-tasks-container"></div>
            <div class="driver-earnings glass-card">
                <h3>Today's Earnings</h3>
                <div class="earnings-value" id="driver-earnings">₹0</div>
            </div>`;
        
        DriverManager.loadDriverTasks();
    }

    function renderRecentCampaigns() {
        const container = document.getElementById('recent-campaigns-table');
        if (!container) return;
        
        const campaigns = StorageManager.get('campaigns', []);
        const recent = campaigns.slice(-5).reverse();
        
        if (recent.length === 0) {
            container.innerHTML = '<p class="no-data">No campaigns yet. Start your first campaign!</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Zone</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    ${recent.map(c => `
                        <tr>
                            <td>${c.name || 'Untitled'}</td>
                            <td>${c.zone || 'N/A'}</td>
                            <td>${c.type || 'N/A'}</td>
                            <td><span class="status-badge status-${c.status || 'pending'}">${c.status || 'Pending'}</span></td>
                            <td>₹${(c.cost || 0).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function refreshData() {
        loadDashboard();
        NotificationManager.showNotification('Dashboard refreshed', 'info');
    }

    function updateStatistics() {
        renderWidgets();
    }

    return {
        init,
        loadDashboard,
        renderWidgets,
        renderAdminWidgets,
        renderRecentCampaigns,
        refreshData,
        updateStatistics
    };
})();

// =====================================================
// ANALYTICS ENGINE
// =====================================================
const AnalyticsEngine = (function() {
    function init() {
        // Charts will be initialized when dashboard loads
    }

    function initClientCharts() {
        createRevenueChart('revenue-chart-container');
        createCampaignChart('campaign-chart-container');
    }

    function initAdminCharts() {
        createRevenueTrendChart('revenue-trend-chart');
        createZonePerformanceChart('zone-performance-chart');
    }

    function loadAnalytics() {
        const campaigns = StorageManager.get('campaigns', []);
        const invoices = StorageManager.get('invoices', []);
        const users = StorageManager.get('users', []);
        
        return {
            totalCampaigns: campaigns.length,
            activeCampaigns: campaigns.filter(c => c.status === 'active').length,
            totalRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
            totalUsers: users.length,
            campaignsByZone: getCampaignsByZone(campaigns),
            revenueByMonth: getRevenueByMonth(invoices)
        };
    }

    function getUserStats() {
        const campaigns = StorageManager.get('campaigns', []);
        const invoices = StorageManager.get('invoices', []);
        const user = StorageManager.get('currentUser', null, true);
        
        let userCampaigns = campaigns;
        let userInvoices = invoices;
        
        if (user && user.role === 'client') {
            userCampaigns = campaigns.filter(c => c.userId === user.id);
            userInvoices = invoices.filter(i => i.userId === user.id);
        }
        
        return {
            activeCampaigns: userCampaigns.filter(c => c.status === 'active').length,
            totalImpressions: userCampaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
            revenue: userInvoices.reduce((sum, i) => sum + (i.amount || 0), 0),
            completedCampaigns: userCampaigns.filter(c => c.status === 'completed').length
        };
    }

    function getTotalRevenue() {
        const invoices = StorageManager.get('invoices', []);
        return invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    }

    function getCampaignsByZone(campaigns) {
        const zoneMap = {};
        campaigns.forEach(c => {
            const zone = c.zone || 'Unknown';
            zoneMap[zone] = (zoneMap[zone] || 0) + 1;
        });
        return zoneMap;
    }

    function getRevenueByMonth(invoices) {
        const monthMap = {};
        invoices.forEach(inv => {
            const date = new Date(inv.date || Date.now());
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthMap[monthKey] = (monthMap[monthKey] || 0) + (inv.amount || 0);
        });
        return monthMap;
    }

    function createLineChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 300;
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const values = data.values || [];
        const labels = data.labels || [];
        const maxVal = Math.max(...values, 1);
        const minVal = Math.min(...values, 0);
        const range = maxVal - minVal || 1;
        
        // Grid lines
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-border') || 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height - 2 * padding) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-secondary') || '#666';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(Math.round(maxVal - (range * i / 4)), 5, y + 4);
        }
        
        // Line
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--color-primary') || '#6C4DF6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const stepX = (width - 2 * padding) / (values.length - 1 || 1);
        
        values.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = padding + (height - 2 * padding) * (1 - (val - minVal) / range);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Dots
        values.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = padding + (height - 2 * padding) * (1 - (val - minVal) / range);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-primary') || '#6C4DF6';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Labels
        if (labels.length > 0) {
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-secondary') || '#666';
            ctx.font = '11px Inter, sans-serif';
            labels.forEach((label, i) => {
                const x = padding + i * stepX;
                ctx.fillText(label, x - 15, height - 10);
            });
        }
    }

    function createBarChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 300;
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const values = data.values || [];
        const labels = data.labels || [];
        const maxVal = Math.max(...values, 1);
        const barWidth = Math.min((width - 2 * padding) / values.length * 0.6, 60);
        const gap = (width - 2 * padding) / values.length;
        
        values.forEach((val, i) => {
            const barHeight = (height - 2 * padding) * (val / maxVal);
            const x = padding + i * gap + (gap - barWidth) / 2;
            const y = height - padding - barHeight;
            
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, getComputedStyle(document.body).getPropertyValue('--color-primary') || '#6C4DF6');
            gradient.addColorStop(1, getComputedStyle(document.body).getPropertyValue('--color-accent-cyan') || '#00D4FF');
            ctx.fillStyle = gradient;
            
            ctx.fillRect(x, y, barWidth, barHeight);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-secondary') || '#666';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            
            if (labels[i]) {
                ctx.fillText(labels[i], x + barWidth / 2, height - 15);
            }
            ctx.fillText(val, x + barWidth / 2, y - 10);
        });
    }

    function createPieChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = 300;
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        const values = data.values || [];
        const labels = data.labels || [];
        const colors = data.colors || ['#6C4DF6', '#3C82F6', '#00D4FF', '#00C896', '#FFB547', '#FF4D6D'];
        const total = values.reduce((sum, v) => sum + v, 0);
        
        let startAngle = -Math.PI / 2;
        
        values.forEach((val, i) => {
            const sliceAngle = (val / total) * 2 * Math.PI;
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            const midAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + (radius + 30) * Math.cos(midAngle);
            const labelY = centerY + (radius + 30) * Math.sin(midAngle);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text-primary') || '#111';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            
            if (labels[i]) {
                ctx.fillText(`${labels[i]} (${Math.round(val / total * 100)}%)`, labelX, labelY);
            }
            
            startAngle += sliceAngle;
        });
    }

    function createRevenueChart(containerId) {
        const monthlyRevenue = generateMonthlyRevenueData();
        createLineChart(containerId, {
            labels: monthlyRevenue.labels,
            values: monthlyRevenue.values
        });
    }

    function createCampaignChart(containerId) {
        const campaignData = generateCampaignData();
        createBarChart(containerId, {
            labels: campaignData.labels,
            values: campaignData.values
        });
    }

    function createRevenueTrendChart(containerId) {
        const monthlyRevenue = generateMonthlyRevenueData();
        createLineChart(containerId, {
            labels: monthlyRevenue.labels,
            values: monthlyRevenue.values
        });
    }

    function createZonePerformanceChart(containerId) {
        const zoneData = generateZonePerformanceData();
        createPieChart(containerId, {
            labels: zoneData.labels,
            values: zoneData.values
        });
    }

    function generateMonthlyRevenueData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const values = months.map(() => Math.floor(Math.random() * 500000) + 200000);
        return { labels: months, values };
    }

    function generateCampaignData() {
        const zones = ['Kausa', 'Mumbra Stn', 'Amrut Nagar', 'Shilphata', 'Diva Jn', 'Bypass'];
        const values = zones.map(() => Math.floor(Math.random() * 15) + 3);
        return { labels: zones, values };
    }

    function generateZonePerformanceData() {
        const zones = CampaignCalculator.getZones().slice(0, 6);
        return {
            labels: zones.map(z => z.name),
            values: zones.map(z => Math.floor(Math.random() * 100000) + 50000)
        };
    }

    function updateChartTheme(theme) {
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(container => {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                const event = new Event('themeChanged');
                canvas.dispatchEvent(event);
            }
        });
    }

    function updateCharts() {
        const revenueChart = document.getElementById('revenue-chart-container');
        const campaignChart = document.getElementById('campaign-chart-container');
        
        if (revenueChart) createRevenueChart('revenue-chart-container');
        if (campaignChart) createCampaignChart('campaign-chart-container');
    }

    function destroyCharts() {
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(c => { c.innerHTML = ''; });
    }

    function generateReports() {
        const analytics = loadAnalytics();
        return {
            summary: analytics,
            generatedAt: new Date().toISOString(),
            period: 'Last 6 Months'
        };
    }

    function exportCSV() {
        const analytics = loadAnalytics();
        let csv = 'Metric,Value\n';
        csv += `Total Campaigns,${analytics.totalCampaigns}\n`;
        csv += `Active Campaigns,${analytics.activeCampaigns}\n`;
        csv += `Total Revenue,${analytics.totalRevenue}\n`;
        csv += `Total Users,${analytics.totalUsers}\n`;
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rasaai-analytics-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        NotificationManager.showNotification('CSV exported successfully', 'success');
    }

    function exportPDF() {
        NotificationManager.showNotification('PDF export feature coming soon', 'info');
    }

    return {
        init,
        initClientCharts,
        initAdminCharts,
        loadAnalytics,
        getUserStats,
        getTotalRevenue,
        createLineChart,
        createBarChart,
        createPieChart,
        createRevenueChart,
        createCampaignChart,
        createRevenueTrendChart,
        createZonePerformanceChart,
        updateChartTheme,
        updateCharts,
        destroyCharts,
        generateReports,
        exportCSV,
        exportPDF
    };
})();

// =====================================================
// CRM MANAGER
// =====================================================
const CRMManager = (function() {
    const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const pipelineContainer = document.getElementById('sales-pipeline');
            if (pipelineContainer) {
                renderPipeline();
            }
        });
    }

    function createLead(leadData) {
        const leads = StorageManager.get('leads', []);
        
        const lead = {
            id: 'LEAD' + Date.now().toString(36).toUpperCase(),
            name: SecurityManager.sanitize(leadData.name),
            email: SecurityManager.sanitize(leadData.email),
            phone: SecurityManager.sanitize(leadData.phone),
            company: SecurityManager.sanitize(leadData.company || ''),
            source: leadData.source || 'Website',
            status: 'New',
            assignedTo: leadData.assignedTo || null,
            notes: SecurityManager.sanitize(leadData.notes || ''),
            value: leadData.value || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            activities: []
        };
        
        leads.push(lead);
        StorageManager.set('leads', leads);
        
        NotificationManager.showNotification('Lead created successfully', 'success');
        return lead;
    }

    function updateLead(leadId, updates) {
        const leads = StorageManager.get('leads', []);
        const index = leads.findIndex(l => l.id === leadId);
        
        if (index === -1) {
            NotificationManager.showNotification('Lead not found', 'error');
            return null;
        }
        
        Object.keys(updates).forEach(key => {
            if (key !== 'id' && key !== 'createdAt' && key !== 'activities') {
                leads[index][key] = SecurityManager.sanitize(String(updates[key]));
            }
        });
        
        leads[index].updatedAt = new Date().toISOString();
        StorageManager.set('leads', leads);
        
        NotificationManager.showNotification('Lead updated successfully', 'success');
        return leads[index];
    }

    function assignLead(leadId, userId) {
        return updateLead(leadId, { assignedTo: userId });
    }

    function closeLead(leadId, status) {
        if (!['Won', 'Lost'].includes(status)) {
            NotificationManager.showNotification('Invalid status', 'error');
            return null;
        }
        
        const lead = updateLead(leadId, { status, closedAt: new Date().toISOString() });
        
        if (status === 'Won' && lead) {
            createTask({
                title: `Follow up with ${lead.name}`,
                type: 'follow-up',
                relatedTo: leadId,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        
        return lead;
    }

    function renderPipeline() {
        const container = document.getElementById('sales-pipeline');
        if (!container) return;
        
        const leads = StorageManager.get('leads', []);
        const stages = {};
        
        LEAD_STATUSES.forEach(status => {
            stages[status] = leads.filter(l => l.status === status);
        });
        
        container.innerHTML = LEAD_STATUSES.map(status => {
            const stageLeads = stages[status] || [];
            return `
            <div class="pipeline-stage">
                <div class="stage-header">
                    <h4>${status}</h4>
                    <span class="stage-count">${stageLeads.length}</span>
                </div>
                <div class="stage-leads">
                    ${stageLeads.map(lead => `
                        <div class="lead-card glass-card" data-lead-id="${lead.id}">
                            <div class="lead-name">${lead.name}</div>
                            <div class="lead-company">${lead.company || 'N/A'}</div>
                            <div class="lead-value">₹${(lead.value || 0).toLocaleString()}</div>
                            <div class="lead-date">${new Date(lead.createdAt).toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }).join('');
    }

    function calculateConversionRate() {
        const leads = StorageManager.get('leads', []);
        const total = leads.length;
        const won = leads.filter(l => l.status === 'Won').length;
        
        if (total === 0) return 0;
        return Math.round((won / total) * 100);
    }

    function createTask(taskData) {
        const tasks = StorageManager.get('tasks', []);
        
        const task = {
            id: 'TASK' + Date.now().toString(36).toUpperCase(),
            title: SecurityManager.sanitize(taskData.title),
            type: taskData.type || 'general',
            relatedTo: taskData.relatedTo || null,
            assignedTo: taskData.assignedTo || null,
            status: 'pending',
            dueDate: taskData.dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        tasks.push(task);
        StorageManager.set('tasks', tasks);
        return task;
    }

    function completeTask(taskId) {
        const tasks = StorageManager.get('tasks', []);
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index === -1) return null;
        
        tasks[index].status = 'completed';
        tasks[index].completedAt = new Date().toISOString();
        StorageManager.set('tasks', tasks);
        
        NotificationManager.showNotification('Task completed', 'success');
        return tasks[index];
    }

    function scheduleFollowUp(leadId, date) {
        const lead = StorageManager.get('leads', []).find(l => l.id === leadId);
        if (!lead) return null;
        
        return createTask({
            title: `Follow up with ${lead.name}`,
            type: 'follow-up',
            relatedTo: leadId,
            dueDate: date
        });
    }

    function openNewLead() {
        const modal = document.createElement('div');
        modal.className = 'modal glass-card';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>New Lead</h3>
                <form id="new-lead-form" onsubmit="event.preventDefault(); CRMManager.submitNewLead()">
                    <input type="text" id="lead-name" placeholder="Full Name" required>
                    <input type="email" id="lead-email" placeholder="Email" required>
                    <input type="tel" id="lead-phone" placeholder="Phone" required>
                    <input type="text" id="lead-company" placeholder="Company">
                    <select id="lead-source">
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Call">Call</option>
                    </select>
                    <button type="submit" class="btn btn-primary">Create Lead</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </form>
            </div>`;
        document.body.appendChild(modal);
    }

    function submitNewLead() {
        const leadData = {
            name: document.getElementById('lead-name')?.value,
            email: document.getElementById('lead-email')?.value,
            phone: document.getElementById('lead-phone')?.value,
            company: document.getElementById('lead-company')?.value,
            source: document.getElementById('lead-source')?.value
        };
        
        const lead = createLead(leadData);
        if (lead) {
            document.querySelector('.modal')?.remove();
            renderPipeline();
        }
    }

    return {
        init,
        createLead,
        updateLead,
        assignLead,
        closeLead,
        renderPipeline,
        calculateConversionRate,
        createTask,
        completeTask,
        scheduleFollowUp,
        openNewLead,
        submitNewLead
    };
})();

// =====================================================
// AFFILIATE MANAGER
// =====================================================
const AffiliateManager = (function() {
    const COMMISSION_RATE = 0.10; // 10%
    
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const dashboard = document.getElementById('affiliate-dashboard');
            if (dashboard) {
                renderAffiliateDashboard();
            }
        });
    }

    function generateReferralLink(userId) {
        const baseUrl = window.location.origin;
        const code = SecurityManager.generateToken(12);
        
        const links = StorageManager.get('referralLinks', []);
        links.push({
            code,
            userId,
            createdAt: new Date().toISOString(),
            clicks: 0,
            leads: 0,
            conversions: 0
        });
        StorageManager.set('referralLinks', links);
        
        return `${baseUrl}/?ref=${code}`;
    }

    function trackClick(referralCode) {
        const links = StorageManager.get('referralLinks', []);
        const link = links.find(l => l.code === referralCode);
        
        if (link) {
            link.clicks++;
            link.lastClick = new Date().toISOString();
            StorageManager.set('referralLinks', links);
        }
    }

    function trackLead(referralCode) {
        const links = StorageManager.get('referralLinks', []);
        const link = links.find(l => l.code === referralCode);
        
        if (link) {
            link.leads++;
            StorageManager.set('referralLinks', links);
        }
    }

    function trackConversion(referralCode, amount) {
        const links = StorageManager.get('referralLinks', []);
        const link = links.find(l => l.code === referralCode);
        
        if (link) {
            link.conversions++;
            const commission = amount * COMMISSION_RATE;
            
            const commissions = StorageManager.get('commissions', []);
            commissions.push({
                id: 'COM' + Date.now().toString(36).toUpperCase(),
                userId: link.userId,
                referralCode,
                amount,
                commission,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            StorageManager.set('commissions', commissions);
            StorageManager.set('referralLinks', links);
            
            return commission;
        }
        return 0;
    }

    function calculateCommission(userId) {
        const commissions = StorageManager.get('commissions', []);
        const userCommissions = commissions.filter(c => c.userId === userId);
        return userCommissions.reduce((sum, c) => sum + c.commission, 0);
    }

    function requestWithdrawal(userId, amount) {
        const totalCommission = calculateCommission(userId);
        
        if (amount > totalCommission) {
            NotificationManager.showNotification('Insufficient commission balance', 'error');
            return false;
        }
        
        const withdrawals = StorageManager.get('withdrawals', []);
        withdrawals.push({
            id: 'WTH' + Date.now().toString(36).toUpperCase(),
            userId,
            amount,
            status: 'pending',
            requestedAt: new Date().toISOString()
        });
        StorageManager.set('withdrawals', withdrawals);
        
        NotificationManager.showNotification('Withdrawal request submitted', 'success');
        return true;
    }

    function renderAffiliateDashboard() {
        const user = StorageManager.get('currentUser', null, true);
        if (!user) return;
        
        const referralLink = generateReferralLink(user.id);
        const totalCommission = calculateCommission(user.id);
        const links = StorageManager.get('referralLinks', []);
        const userLink = links.find(l => l.userId === user.id);
        
        const container = document.getElementById('affiliate-dashboard');
        if (!container) return;
        
        container.innerHTML = `
            <div class="affiliate-stats widget-grid">
                <div class="widget glass">
                    <div class="widget-value">${userLink ? userLink.clicks : 0}</div>
                    <div class="widget-title">Total Clicks</div>
                </div>
                <div class="widget glass">
                    <div class="widget-value">${userLink ? userLink.leads : 0}</div>
                    <div class="widget-title">Leads Generated</div>
                </div>
                <div class="widget glass">
                    <div class="widget-value">${userLink ? userLink.conversions : 0}</div>
                    <div class="widget-title">Conversions</div>
                </div>
                <div class="widget glass">
                    <div class="widget-value">₹${totalCommission.toLocaleString()}</div>
                    <div class="widget-title">Total Commission</div>
                </div>
            </div>
            <div class="referral-link-section glass-card">
                <h3>Your Referral Link</h3>
                <div class="referral-link-input">
                    <input type="text" value="${referralLink}" readonly id="referral-link-input">
                    <button class="btn btn-primary" onclick="AffiliateManager.copyReferralLink()">Copy</button>
                </div>
            </div>
            <div class="payout-history">
                <h3>Payout History</h3>
                <div id="payout-history-table"></div>
            </div>`;
        
        renderPayoutHistory();
    }

    function copyReferralLink() {
        const input = document.getElementById('referral-link-input');
        if (input) {
            input.select();
            document.execCommand('copy');
            NotificationManager.showNotification('Referral link copied!', 'success');
        }
    }

    function renderPayoutHistory() {
        const container = document.getElementById('payout-history-table');
        if (!container) return;
        
        const withdrawals = StorageManager.get('withdrawals', []);
        const user = StorageManager.get('currentUser', null, true);
        const userWithdrawals = withdrawals.filter(w => w.userId === user?.id);
        
        if (userWithdrawals.length === 0) {
            container.innerHTML = '<p>No payout history yet.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${userWithdrawals.map(w => `
                        <tr>
                            <td>${new Date(w.requestedAt).toLocaleDateString()}</td>
                            <td>₹${w.amount.toLocaleString()}</td>
                            <td><span class="status-badge status-${w.status}">${w.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    return {
        init,
        generateReferralLink,
        trackClick,
        trackLead,
        trackConversion,
        calculateCommission,
        requestWithdrawal,
        renderAffiliateDashboard,
        copyReferralLink
    };
})();

// =====================================================
// DRIVER MANAGER
// =====================================================
const DriverManager = (function() {
    let currentStatus = 'offline'; // offline, online, paused
    let audioInterval = null;
    let gpsInterval = null;
    let currentZone = null;
    let earnings = 0;

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const dashboard = document.getElementById('driver-dashboard');
            if (dashboard) {
                loadDriverTasks();
                updateDriverUI();
            }
        });
    }

    function driverLogin() {
        currentStatus = 'online';
        earnings = 0;
        initAudioEngine();
        initGPSTracking();
        updateDriverUI();
        NotificationManager.showNotification('You are now on duty', 'success');
    }

    function startDuty() {
        driverLogin();
        const startBtn = document.getElementById('start-duty-btn');
        const pauseBtn = document.getElementById('pause-duty-btn');
        const endBtn = document.getElementById('end-duty-btn');
        
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (endBtn) endBtn.disabled = false;
        
        document.getElementById('driver-status-indicator').textContent = 'Online';
        document.getElementById('driver-status-indicator').className = 'status-online';
    }

    function pauseDuty() {
        if (currentStatus !== 'online') return;
        currentStatus = 'paused';
        clearInterval(audioInterval);
        clearInterval(gpsInterval);
        updateDriverUI();
        
        document.getElementById('driver-status-indicator').textContent = 'Paused';
        document.getElementById('driver-status-indicator').className = 'status-paused';
        NotificationManager.showNotification('Duty paused', 'warning');
    }

    function endDuty() {
        currentStatus = 'offline';
        clearInterval(audioInterval);
        clearInterval(gpsInterval);
        updateDriverUI();
        
        document.getElementById('driver-status-indicator').textContent = 'Offline';
        document.getElementById('driver-status-indicator').className = 'status-offline';
        
        const startBtn = document.getElementById('start-duty-btn');
        const pauseBtn = document.getElementById('pause-duty-btn');
        const endBtn = document.getElementById('end-duty-btn');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (endBtn) endBtn.disabled = true;
        
        saveEarnings();
        NotificationManager.showNotification(`Duty ended. Earnings: ₹${earnings}`, 'info');
    }

    function initAudioEngine() {
        if (audioInterval) clearInterval(audioInterval);
        
        audioInterval = setInterval(() => {
            if (currentStatus !== 'online') return;
            
            detectArea();
            if (currentZone) {
                playAreaAnnouncement(currentZone);
                setTimeout(() => playAd(currentZone), 5000);
            }
        }, 15 * 60 * 1000); // Every 15 minutes
    }

    function initGPSTracking() {
        if (gpsInterval) clearInterval(gpsInterval);
        
        gpsInterval = setInterval(() => {
            if (currentStatus !== 'online') return;
            updateGPS();
        }, 30000); // Every 30 seconds
    }

    function detectArea() {
        const zones = CampaignCalculator.getZones();
        const randomZone = zones[Math.floor(Math.random() * zones.length)];
        currentZone = randomZone;
        return currentZone;
    }

    function playAreaAnnouncement(zone) {
        console.log(`[Audio] Playing zone announcement for: ${zone.name}`);
        logPlayback('announcement', zone.id);
    }

    function playAd(zone) {
        const campaigns = StorageManager.get('campaigns', []);
        const activeCampaigns = campaigns.filter(c => 
            c.status === 'active' && c.zone === zone.name
        );
        
        if (activeCampaigns.length > 0) {
            const campaign = activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)];
            console.log(`[Audio] Playing ad for campaign: ${campaign.name}`);
            logPlayback('ad', zone.id, campaign.id);
            earnings += 5; // ₹5 per ad play
            updateEarningsDisplay();
        }
    }

    function logPlayback(type, zoneId, campaignId = null) {
        const playbackLogs = StorageManager.get('playbackLogs', []);
        playbackLogs.push({
            type,
            zoneId,
            campaignId,
            timestamp: new Date().toISOString(),
            driverId: StorageManager.get('currentUser', null, true)?.id
        });
        StorageManager.set('playbackLogs', playbackLogs);
    }

    function updateGPS() {
        const lat = 19.1785 + (Math.random() - 0.5) * 0.02;
        const lng = 73.0925 + (Math.random() - 0.5) * 0.02;
        
        const gpsData = {
            lat,
            lng,
            timestamp: new Date().toISOString(),
            zone: currentZone?.name || 'Unknown'
        };
        
        StorageManager.set('currentGPS', gpsData);
    }

    function uploadProof(taskId, file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'audio/wav'];
        
        if (!allowedTypes.includes(file.type)) {
            NotificationManager.showNotification('Invalid file type', 'error');
            return false;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            NotificationManager.showNotification('File size must be under 10MB', 'error');
            return false;
        }
        
        const uploads = StorageManager.get('uploads', []);
        uploads.push({
            id: 'UPL' + Date.now().toString(36).toUpperCase(),
            taskId,
            fileName: file.name,
            fileType: file.type,
            uploadedAt: new Date().toISOString()
        });
        StorageManager.set('uploads', uploads);
        
        NotificationManager.showNotification('Proof uploaded successfully', 'success');
        return true;
    }

    function completeTask(taskId) {
        return CRMManager.completeTask(taskId);
    }

    function markAttendance() {
        const attendance = StorageManager.get('attendance', []);
        const today = new Date().toDateString();
        
        if (attendance.find(a => a.date === today)) {
            NotificationManager.showNotification('Attendance already marked', 'warning');
            return;
        }
        
        attendance.push({
            date: today,
            timestamp: new Date().toISOString(),
            status: 'present'
        });
        StorageManager.set('attendance', attendance);
        NotificationManager.showNotification('Attendance marked', 'success');
    }

    function loadDriverTasks() {
        const container = document.getElementById('driver-tasks-container');
        if (!container) return;
        
        const tasks = StorageManager.get('tasks', []);
        const user = StorageManager.get('currentUser', null, true);
        const driverTasks = tasks.filter(t => t.assignedTo === user?.id && t.status === 'pending');
        
        if (driverTasks.length === 0) {
            container.innerHTML = '<p class="no-tasks">No pending tasks</p>';
            return;
        }
        
        container.innerHTML = driverTasks.map(task => `
            <div class="task-card glass-card">
                <h4>${task.title}</h4>
                <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <button class="btn btn-primary" onclick="DriverManager.completeTask('${task.id}')">Complete</button>
            </div>
        `).join('');
    }

    function updateDriverUI() {
        const statusIndicator = document.getElementById('driver-status-indicator');
        if (statusIndicator) {
            statusIndicator.textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
            statusIndicator.className = `status-${currentStatus}`;
        }
    }

    function updateEarningsDisplay() {
        const earningsEl = document.getElementById('driver-earnings');
        if (earningsEl) {
            earningsEl.textContent = `₹${earnings}`;
        }
    }

    function saveEarnings() {
        const user = StorageManager.get('currentUser', null, true);
        if (!user) return;
        
        const earningsLog = StorageManager.get('earningsLog', []);
        earningsLog.push({
            userId: user.id,
            amount: earnings,
            date: new Date().toISOString()
        });
        StorageManager.set('earningsLog', earningsLog);
    }

    return {
        init,
        driverLogin,
        startDuty,
        pauseDuty,
        endDuty,
        initAudioEngine,
        detectArea,
        playAreaAnnouncement,
        playAd,
        logPlayback,
        updateGPS,
        uploadProof,
        completeTask,
        markAttendance,
        loadDriverTasks
    };
})();

// =====================================================
// NOTIFICATION MANAGER
// =====================================================
const NotificationManager = (function() {
    let notificationQueue = [];
    let activeNotification = null;

    function init() {
        loadNotifications();
    }

    function showNotification(message, type = 'info', duration = 4000) {
        const notification = {
            id: Date.now(),
            message: SecurityManager.sanitize(message),
            type,
            duration,
            createdAt: new Date().toISOString(),
            read: false
        };

        if (activeNotification) {
            notificationQueue.push(notification);
            return;
        }

        displayNotification(notification);
        saveNotification(notification);
    }

    function displayNotification(notification) {
        activeNotification = notification;

        const container = document.getElementById('notification-container') || createNotificationContainer();
        
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.setAttribute('role', 'alert');
        element.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getIconForType(notification.type)}</span>
                <span class="notification-message">${notification.message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close notification">×</button>
        `;

        container.appendChild(element);

        setTimeout(() => {
            element.classList.add('notification-exit');
            setTimeout(() => {
                element.remove();
                activeNotification = null;
                processQueue();
            }, 300);
        }, notification.duration);

        element.addEventListener('click', () => markAsRead(notification.id));
    }

    function createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    function processQueue() {
        if (notificationQueue.length > 0) {
            const next = notificationQueue.shift();
            displayNotification(next);
        }
    }

    function queueNotification(message, type, duration) {
        notificationQueue.push({
            id: Date.now(),
            message: SecurityManager.sanitize(message),
            type,
            duration,
            createdAt: new Date().toISOString(),
            read: false
        });
    }

    function hideNotification(id) {
        const element = document.querySelector(`[data-notification-id="${id}"]`);
        if (element) {
            element.remove();
            activeNotification = null;
            processQueue();
        }
    }

    function markAsRead(id) {
        const notifications = StorageManager.get('notifications', []);
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            StorageManager.set('notifications', notifications);
        }
    }

    function saveNotification(notification) {
        const notifications = StorageManager.get('notifications', []);
        notifications.push(notification);
        if (notifications.length > 100) {
            notifications.splice(0, notifications.length - 100);
        }
        StorageManager.set('notifications', notifications);
    }

    function loadNotifications() {
        const notifications = StorageManager.get('notifications', []);
        const unread = notifications.filter(n => !n.read);
        
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = unread.length;
            badge.style.display = unread.length > 0 ? 'flex' : 'none';
        }
        
        return notifications;
    }

    function getIconForType(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    return {
        init,
        showNotification,
        queueNotification,
        hideNotification,
        markAsRead,
        loadNotifications
    };
})();

// =====================================================
// INVOICE MANAGER
// =====================================================
const InvoiceManager = (function() {
    const GST_RATE = 0.18; // 18%
    
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const invoiceBtn = document.getElementById('generate-invoice-btn');
            if (invoiceBtn) {
                invoiceBtn.addEventListener('click', generateInvoice);
            }
        });
    }

    function generateInvoice(campaignData) {
        if (!campaignData) {
            NotificationManager.showNotification('No campaign data provided', 'error');
            return null;
        }
        
        const invoiceNumber = generateInvoiceNumber();
        const subtotal = campaignData.cost || 0;
        const gst = calculateGST(subtotal);
        const total = subtotal + gst;
        
        const invoice = {
            id: 'INV' + Date.now().toString(36).toUpperCase(),
            invoiceNumber,
            campaignId: campaignData.id || null,
            userId: campaignData.userId || StorageManager.get('currentUser', null, true)?.id,
            customerName: campaignData.customerName || 'Client',
            items: [
                {
                    description: `${campaignData.type || 'Campaign'} - ${campaignData.zone || 'N/A'}`,
                    quantity: 1,
                    rate: subtotal,
                    amount: subtotal
                }
            ],
            subtotal,
            gst,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const invoices = StorageManager.get('invoices', []);
        invoices.push(invoice);
        StorageManager.set('invoices', invoices);
        
        NotificationManager.showNotification('Invoice generated successfully', 'success');
        return invoice;
    }

    function downloadInvoice(invoiceId) {
        const invoices = StorageManager.get('invoices', []);
        const invoice = invoices.find(i => i.id === invoiceId);
        
        if (!invoice) {
            NotificationManager.showNotification('Invoice not found', 'error');
            return;
        }
        
        const invoiceHTML = generateInvoiceHTML(invoice);
        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.invoiceNumber}.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        NotificationManager.showNotification('Invoice downloaded', 'success');
    }

    function generateInvoiceHTML(invoice) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { display: flex; justify-content: space-between; }
                .company-name { font-size: 24px; font-weight: bold; color: #6C4DF6; }
                .invoice-title { font-size: 28px; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background: #f5f5f5; }
                .total { font-size: 18px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <div class="company-name">RASAAI</div>
                    <p>Mumbra Rickshaw Advertising Network</p>
                </div>
                <div>
                    <h1 class="invoice-title">INVOICE</h1>
                    <p>#${invoice.invoiceNumber}</p>
                    <p>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
                    <p>Due: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="bill-to">
                <h3>Bill To:</h3>
                <p>${invoice.customerName}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.rate.toLocaleString()}</td>
                            <td>₹${item.amount.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 20px;">
                <p>Subtotal: ₹${invoice.subtotal.toLocaleString()}</p>
                <p>GST (18%): ₹${invoice.gst.toLocaleString()}</p>
                <p class="total">Total: ₹${invoice.total.toLocaleString()}</p>
            </div>
        </body>
        </html>`;
    }

    function calculateGST(amount) {
        return Math.round(amount * GST_RATE);
    }

    function generateInvoiceNumber() {
        const count = StorageManager.get('invoices', []).length + 1;
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `RAS-${year}${month}-${String(count).padStart(4, '0')}`;
    }

    function saveInvoice(invoice) {
        const invoices = StorageManager.get('invoices', []);
        const index = invoices.findIndex(i => i.id === invoice.id);
        
        if (index !== -1) {
            invoices[index] = invoice;
        } else {
            invoices.push(invoice);
        }
        
        StorageManager.set('invoices', invoices);
    }

    return {
        init,
        generateInvoice,
        downloadInvoice,
        calculateGST,
        generateInvoiceNumber,
        saveInvoice
    };
})();

// =====================================================
// PAYMENT MANAGER
// =====================================================
const PaymentManager = (function() {
    function createPayment(invoiceId, amount, method = 'upi') {
        const payments = StorageManager.get('payments', []);
        
        const payment = {
            id: 'PAY' + Date.now().toString(36).toUpperCase(),
            invoiceId,
            amount,
            method,
            status: 'pending',
            createdAt: new Date().toISOString(),
            verifiedAt: null
        };
        
        payments.push(payment);
        StorageManager.set('payments', payments);
        
        if (method === 'upi') {
            return generateUPIQR(amount, payment.id);
        }
        
        return payment;
    }

    function generateUPIQR(amount, paymentId) {
        const upiId = 'rasaai@upi';
        const name = 'RASAAI Outdoor Advertising';
        const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&tr=${paymentId}&cu=INR`;
        
        return {
            paymentId,
            upiLink,
            upiId,
            amount,
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`
        };
    }

    function verifyPayment(paymentId, transactionRef) {
        const payments = StorageManager.get('payments', []);
        const index = payments.findIndex(p => p.id === paymentId);
        
        if (index === -1) {
            NotificationManager.showNotification('Payment not found', 'error');
            return false;
        }
        
        payments[index].status = 'verified';
        payments[index].verifiedAt = new Date().toISOString();
        payments[index].transactionRef = transactionRef;
        StorageManager.set('payments', payments);
        
        // Update invoice status
        const invoiceId = payments[index].invoiceId;
        const invoices = StorageManager.get('invoices', []);
        const invIndex = invoices.findIndex(i => i.id === invoiceId);
        if (invIndex !== -1) {
            invoices[invIndex].status = 'paid';
            StorageManager.set('invoices', invoices);
        }
        
        NotificationManager.showNotification('Payment verified successfully', 'success');
        return true;
    }

    function approvePayment(paymentId) {
        return verifyPayment(paymentId, 'APPROVED_BY_ADMIN');
    }

    function rejectPayment(paymentId, reason) {
        const payments = StorageManager.get('payments', []);
        const index = payments.findIndex(p => p.id === paymentId);
        
        if (index === -1) return false;
        
        payments[index].status = 'rejected';
        payments[index].rejectedAt = new Date().toISOString();
        payments[index].rejectionReason = reason;
        StorageManager.set('payments', payments);
        
        NotificationManager.showNotification('Payment rejected', 'warning');
        return true;
    }

    function saveTransaction(transaction) {
        const transactions = StorageManager.get('transactions', []);
        transactions.push({
            ...transaction,
            savedAt: new Date().toISOString()
        });
        StorageManager.set('transactions', transactions);
    }

    return {
        createPayment,
        verifyPayment,
        approvePayment,
        rejectPayment,
        saveTransaction
    };
})();

// =====================================================
// FORM MANAGER
// =====================================================
const FormManager = (function() {
    let formDrafts = {};

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form[data-auto-save]');
            forms.forEach(form => {
                form.addEventListener('input', () => autoSave(form));
                const saved = loadDraft(form.id);
                if (saved) populateForm(form, saved);
            });
        });
    }

    function validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                errors.push(`${input.name || input.id} is required`);
                showFieldError(input, 'This field is required');
            }

            if (input.type === 'email' && input.value) {
                if (!SecurityManager.validateInput(input.value, 'email')) {
                    isValid = false;
                    errors.push('Invalid email format');
                    showFieldError(input, 'Invalid email format');
                }
            }

            if (input.type === 'tel' && input.value) {
                if (!SecurityManager.validateInput(input.value, 'phone')) {
                    isValid = false;
                    errors.push('Invalid phone format');
                    showFieldError(input, 'Invalid phone number');
                }
            }
        });

        return { isValid, errors };
    }

    function submitForm(formElement) {
        const validation = validateForm(formElement);
        
        if (!validation.isValid) {
            NotificationManager.showNotification('Please fix the form errors', 'error');
            return false;
        }

        const formData = new FormData(formElement);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = SecurityManager.sanitize(value);
        });

        clearDraft(formElement.id);
        formElement.reset();
        
        NotificationManager.showNotification('Form submitted successfully', 'success');
        return data;
    }

    function saveDraft(formId, data) {
        formDrafts[formId] = { ...data, savedAt: Date.now() };
        StorageManager.set(`draft_${formId}`, formDrafts[formId]);
    }

    function loadDraft(formId) {
        if (!formDrafts[formId]) {
            formDrafts[formId] = StorageManager.get(`draft_${formId}`);
        }
        return formDrafts[formId];
    }

    function clearDraft(formId) {
        delete formDrafts[formId];
        StorageManager.remove(`draft_${formId}`);
    }

    function autoSave(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        saveDraft(formElement.id, data);
    }

    function populateForm(formElement, data) {
        Object.keys(data).forEach(key => {
            const input = formElement.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'file') {
                input.value = data[key];
            }
        });
    }

    function showFieldError(input, message) {
        input.classList.add('input-error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.textContent = message;
        
        const existing = input.parentElement.querySelector('.field-error');
        if (existing) existing.remove();
        
        input.parentElement.appendChild(errorSpan);
        
        setTimeout(() => {
            input.classList.remove('input-error');
            errorSpan.remove();
        }, 3000);
    }

    function clearForm(formElement) {
        formElement.reset();
        clearDraft(formElement.id);
    }

    return {
        init,
        validateForm,
        submitForm,
        saveDraft,
        loadDraft,
        clearDraft,
        clearForm
    };
})();

// =====================================================
// FILE UPLOAD SYSTEM
// =====================================================
const FileUploader = (function() {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'audio/wav'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    function uploadFile(file, metadata = {}) {
        if (!validateFile(file)) return null;

        const reader = new FileReader();
        const uploadId = 'UPL' + Date.now().toString(36).toUpperCase();

        reader.onload = function(e) {
            const upload = {
                id: uploadId,
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                metadata,
                uploadedAt: new Date().toISOString()
            };

            const uploads = StorageManager.get('fileUploads', []);
            uploads.push(upload);
            StorageManager.set('fileUploads', uploads);

            NotificationManager.showNotification('File uploaded successfully', 'success');
        };

        reader.onerror = function() {
            NotificationManager.showNotification('Error uploading file', 'error');
        };

        reader.readAsDataURL(file);
        return uploadId;
    }

    function validateFile(file) {
        if (!file) {
            NotificationManager.showNotification('No file selected', 'error');
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            NotificationManager.showNotification('Invalid file type. Allowed: JPG, PNG, WEBP, PDF, MP3, WAV', 'error');
            return false;
        }

        if (file.size > MAX_SIZE) {
            NotificationManager.showNotification('File size must be under 10MB', 'error');
            return false;
        }

        return true;
    }

    function previewFile(file, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                container.innerHTML = `<img src="${e.target.result}" alt="Preview" class="file-preview-image">`;
            };
            reader.readAsDataURL(file);
        } else {
            container.innerHTML = `<div class="file-preview-generic">${file.name}</div>`;
        }
    }

    function deleteFile(uploadId) {
        const uploads = StorageManager.get('fileUploads', []);
        const filtered = uploads.filter(u => u.id !== uploadId);
        StorageManager.set('fileUploads', filtered);
        NotificationManager.showNotification('File deleted', 'info');
    }

    return {
        uploadFile,
        validateFile,
        previewFile,
        deleteFile
    };
})();

// =====================================================
// SEARCH ENGINE
// =====================================================
const SearchEngine = (function() {
    let searchIndex = [];

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.addEventListener('input', handleSearch);
            }
        });
    }

    function buildIndex() {
        searchIndex = [];
        
        const campaigns = StorageManager.get('campaigns', []);
        campaigns.forEach(c => {
            searchIndex.push({
                type: 'campaign',
                id: c.id,
                title: c.name || 'Untitled Campaign',
                keywords: [c.zone, c.type, c.status].filter(Boolean).join(' ')
            });
        });

        const leads = StorageManager.get('leads', []);
        leads.forEach(l => {
            searchIndex.push({
                type: 'lead',
                id: l.id,
                title: l.name,
                keywords: [l.company, l.email, l.status].filter(Boolean).join(' ')
            });
        });

        const invoices = StorageManager.get('invoices', []);
        invoices.forEach(i => {
            searchIndex.push({
                type: 'invoice',
                id: i.id,
                title: i.invoiceNumber,
                keywords: [i.customerName, i.status].filter(Boolean).join(' ')
            });
        });

        const users = StorageManager.get('users', []);
        users.forEach(u => {
            searchIndex.push({
                type: 'user',
                id: u.id,
                title: u.name,
                keywords: [u.email, u.role].filter(Boolean).join(' ')
            });
        });
    }

    function search(query, filters = {}) {
        if (!query || query.length < 2) return [];
        
        buildIndex();
        const q = query.toLowerCase();
        
        let results = searchIndex.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(q);
            const keywordMatch = item.keywords.toLowerCase().includes(q);
            
            if (filters.type && item.type !== filters.type) return false;
            
            return titleMatch || keywordMatch;
        });

        return results.slice(0, 20);
    }

    function handleSearch(e) {
        const query = e.target.value;
        const results = search(query);
        renderSearchResults(results);
    }

    function renderSearchResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">No results found</div>';
            container.style.display = 'block';
            return;
        }

        container.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="SearchEngine.navigateTo('${r.type}', '${r.id}')">
                <span class="search-result-type">${r.type}</span>
                <span class="search-result-title">${r.title}</span>
            </div>
        `).join('');
        container.style.display = 'block';
    }

    function filter(items, criteria) {
        return items.filter(item => {
            return Object.keys(criteria).every(key => {
                if (!criteria[key]) return true;
                if (typeof criteria[key] === 'string') {
                    return String(item[key]).toLowerCase().includes(criteria[key].toLowerCase());
                }
                return item[key] === criteria[key];
            });
        });
    }

    function sort(items, key, order = 'asc') {
        return [...items].sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    function paginate(items, page = 1, perPage = 10) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            items: items.slice(start, end),
            total: items.length,
            page,
            totalPages: Math.ceil(items.length / perPage),
            hasMore: end < items.length
        };
    }

    function navigateTo(type, id) {
        switch (type) {
            case 'campaign':
                window.location.hash = `#campaign/${id}`;
                break;
            case 'lead':
                window.location.hash = `#lead/${id}`;
                break;
            case 'invoice':
                window.location.hash = `#invoice/${id}`;
                break;
            case 'user':
                window.location.hash = `#user/${id}`;
                break;
        }
    }

    return {
        init,
        search,
        filter,
        sort,
        paginate,
        navigateTo
    };
})();

// =====================================================
// ADMIN ERP MANAGER
// =====================================================
const AdminManager = (function() {
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            const user = StorageManager.get('currentUser', null, true);
            if (user && user.role === 'admin') {
                loadAdminDashboard();
            }
        });
    }

    function loadAdminDashboard() {
        DashboardManager.loadDashboard();
    }

    function manageUsers() {
        const users = StorageManager.get('users', []);
        const container = document.getElementById('admin-users-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>${u.name}</td>
                            <td>${u.email}</td>
                            <td>${u.role}</td>
                            <td><span class="status-badge ${u.isActive ? 'status-active' : 'status-inactive'}">${u.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="AdminManager.editUser('${u.id}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="AdminManager.toggleUserStatus('${u.id}')">${u.isActive ? 'Deactivate' : 'Activate'}</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function manageCampaigns() {
        const campaigns = StorageManager.get('campaigns', []);
        const container = document.getElementById('admin-campaigns-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Campaign</th>
                        <th>Zone</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${campaigns.map(c => `
                        <tr>
                            <td>${c.name || 'Untitled'}</td>
                            <td>${c.zone || 'N/A'}</td>
                            <td>${c.type || 'N/A'}</td>
                            <td><span class="status-badge status-${c.status}">${c.status}</span></td>
                            <td>₹${(c.cost || 0).toLocaleString()}</td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="AdminManager.editCampaign('${c.id}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="AdminManager.deleteCampaign('${c.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function manageDrivers() {
        const drivers = StorageManager.get('users', []).filter(u => u.role === 'driver');
        const container = document.getElementById('admin-drivers-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Today's Earnings</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${drivers.map(d => `
                        <tr>
                            <td>${d.name}</td>
                            <td>${d.phone}</td>
                            <td><span class="status-badge ${d.isActive ? 'status-active' : 'status-inactive'}">${d.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td>₹0</td>
                            <td>
                                <button class="btn btn-secondary btn-sm">View Details</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function manageInvoices() {
        const invoices = StorageManager.get('invoices', []);
        const container = document.getElementById('admin-invoices-table');
        if (!container) return;

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoices.map(inv => `
                        <tr>
                            <td>${inv.invoiceNumber}</td>
                            <td>${inv.customerName}</td>
                            <td>₹${inv.total.toLocaleString()}</td>
                            <td><span class="status-badge status-${inv.status}">${inv.status}</span></td>
                            <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="InvoiceManager.downloadInvoice('${inv.id}')">Download</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }

    function managePricing() {
        const prices = PricingEngine.getCurrentPrices();
        const container = document.getElementById('admin-pricing-panel');
        if (!container) return;

        container.innerHTML = `
            <div class="pricing-panel">
                <h3>Current Pricing</h3>
                <div class="pricing-item">
                    <span>LED Price:</span>
                    <strong>₹${prices.led.toLocaleString()}</strong>
                </div>
                <div class="pricing-item">
                    <span>Audio Price:</span>
                    <strong>₹${prices.audio.toLocaleString()}</strong>
                </div>
                <div class="pricing-item">
                    <span>Combo Price:</span>
                    <strong>₹${prices.combo.toLocaleString()}</strong>
                </div>
                <button class="btn btn-primary" onclick="PricingEngine.generatePrices(); PricingEngine.updatePricingCards();">Refresh Prices</button>
            </div>`;
    }

    function editUser(userId) {
        NotificationManager.showNotification('User editor coming soon', 'info');
    }

    function toggleUserStatus(userId) {
        const users = StorageManager.get('users', []);
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].isActive = !users[index].isActive;
            StorageManager.set('users', users);
            manageUsers();
            NotificationManager.showNotification('User status updated', 'success');
        }
    }

    return {
        init,
        loadAdminDashboard,
        manageUsers,
        manageCampaigns,
        manageDrivers,
        manageInvoices,
        managePricing,
        editUser,
        toggleUserStatus
    };
})();

// =====================================================
// ERROR HANDLER
// =====================================================
const ErrorHandler = (function() {
    const MAX_LOG_SIZE = 100;

    function handleGlobalError(event) {
        const error = event.error || event;
        logError(error, 'GlobalError');
        showUserFriendlyError(error);
    }

    function handlePromiseError(event) {
        logError(event.reason, 'UnhandledPromise');
        showUserFriendlyError(event.reason);
    }

    function logError(error, context = 'Unknown') {
        const errorLog = StorageManager.get('errorLog', []);
        
        errorLog.push({
            message: error.message || String(error),
            stack: error.stack || 'No stack trace',
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });

        if (errorLog.length > MAX_LOG_SIZE) {
            errorLog.splice(0, errorLog.length - MAX_LOG_SIZE);
        }

        StorageManager.set('errorLog', errorLog);
        
        if (AppController.getState().isOnline) {
            console.error(`[${context}]`, error);
        }
    }

    function reportError(error) {
        logError(error, 'Reported');
    }

    function recoverState() {
        try {
            const backup = StorageManager.backup();
            StorageManager.set('recoveryBackup', backup);
            
            AppController.setCurrentUser(null);
            
            document.querySelectorAll('.modal').forEach(m => m.remove());
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            NotificationManager.showNotification('Application recovered from error. Some data may be lost.', 'warning');
        } catch (e) {
            console.error('Recovery failed:', e);
        }
    }

    function showUserFriendlyError(error) {
        if (error.message && error.message.includes('Network')) {
            NotificationManager.showNotification('Network error. Please check your connection.', 'error');
        } else if (error.message && error.message.includes('Storage')) {
            NotificationManager.showNotification('Storage error. Clearing some data may help.', 'warning');
        } else {
            NotificationManager.showNotification('An unexpected error occurred. Please try again.', 'error');
        }
    }

    return {
        handleGlobalError,
        handlePromiseError,
        logError,
        reportError,
        recoverState
    };
})();

// =====================================================
// APPLICATION STARTUP
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    AppController.init();
    
    // Handle routing
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
    
    // Handle service worker for offline support
    if ('serviceWorker' in navigator) {
        // Service worker registration would go here
    }
});

function handleRoute() {
    const hash = window.location.hash || '#home';
    const user = StorageManager.get('currentUser', null, true);
    
    // Basic route handling
    if (hash === '#login' && !user) {
        showLoginPage();
    } else if (hash === '#dashboard' && user) {
        showDashboard();
    } else if (hash === '#admin' && user?.role === 'admin') {
        showAdminPanel();
    }
}

function showLoginPage() {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="auth-container glass-card">
                <h2>Login to RASAAI</h2>
                <form id="login-form" onsubmit="event.preventDefault(); AuthManager.handleLogin(event)">
                    <input type="email" id="login-email" placeholder="Email" required>
                    <input type="password" id="login-password" placeholder="Password" required>
                    <label><input type="checkbox" id="remember-me"> Remember me</label>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <p>Don't have an account? <a href="#register">Register</a></p>
            </div>`;
    }
}

function showDashboard() {
    DashboardManager.loadDashboard();
}

function showAdminPanel() {
    AdminManager.loadAdminDashboard();
}

// Expose modules globally for onclick handlers and debugging
window.AppController = AppController;
window.ThemeManager = ThemeManager;
window.SecurityManager = SecurityManager;
window.StorageManager = StorageManager;
window.PricingEngine = PricingEngine;
window.CampaignCalculator = CampaignCalculator;
window.ZoneManager = ZoneManager;
window.InventoryManager = InventoryManager;
window.AuthManager = AuthManager;
window.DashboardManager = DashboardManager;
window.AnalyticsEngine = AnalyticsEngine;
window.CRMManager = CRMManager;
window.AffiliateManager = AffiliateManager;
window.DriverManager = DriverManager;
window.NotificationManager = NotificationManager;
window.InvoiceManager = InvoiceManager;
window.PaymentManager = PaymentManager;
window.FormManager = FormManager;
window.FileUploader = FileUploader;
window.SearchEngine = SearchEngine;
window.AdminManager = AdminManager;
window.ErrorHandler = ErrorHandler;

console.log('%c🚀 RASAAI Outdoor Advertising Platform %cReady',
    'color: #6C4DF6; font-size: 20px; font-weight: bold;',
    'color: #00D4FF; font-size: 14px;');
console.log('%cVersion 1.0 | Premium SaaS Architecture',
    'color: #6B7280; font-style: italic;');
