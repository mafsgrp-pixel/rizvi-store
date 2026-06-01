/* =====================================================
   FILE: app.js (PART 1 OF 3)
   PATH: rizvi.store/rasaai/app.js
   RASAAI Outdoor Advertising Network
   Enhanced Application Logic v3.0
   8000+ Lines Total | 145+ Features | No Dependencies
   ===================================================== */

"use strict";

// =====================================================
// 1. APPLICATION CONTROLLER
// =====================================================
const App = {
    state: {
        isOnline: navigator.onLine,
        currentUser: null,
        theme: 'light',
        pricingUpdateTimer: null,
        countdownTimer: null,
        audioTimer: null,
        gpsTimer: null,
        secondsRemaining: 900,
        currentGPS: { lat: 19.1785, lng: 73.0925 },
        currentZone: null,
        offlineQueue: [],
        auditLogs: [],
        activeSessions: 1,
        xpPoints: 0,
        level: 1,
        badges: [],
        streak: 0,
        lastActive: null,
        isOnDuty: false,
        soundEnabled: false
    },

    init() {
        this.loadTheme();
        this.loadUser();
        this.loadGamification();
        this.setupEventListeners();
        this.initHeaderScroll();
        this.initMobileMenu();
        this.initThemeToggle();
        this.initAccordions();
        this.initBackToTop();
        this.initBottomNav();
        this.initServiceWorker();
        this.initOfflineSupport();
        this.initKeyboardShortcuts();
        this.checkReferralCode();
        this.initRippleEffect();
        this.updateOnlineStatus();
        
        if (this.state.currentUser) {
            this.updateUIForAuth();
            this.loadAuditLogs();
            this.checkStreak();
            this.awardXP('daily_login', 10);
        }
        
        this.logAudit('system', 'Application initialized v3.0');
        console.log('🛺 RASAAI Platform v3.0 Initialized');
        console.log('📱 Mobile App UI Active');
        console.log('🎮 Gamification System Ready');
    },

    // Theme Management
    loadTheme() {
        const saved = Storage.get('theme');
        if (saved) {
            this.state.theme = saved;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.state.theme = 'dark';
        }
        // Auto dark mode after 6 PM IST
        const hour = new Date().getHours();
        if (!saved && (hour >= 18 || hour < 6)) {
            this.state.theme = 'dark';
        }
        this.applyTheme(this.state.theme);
    },

    applyTheme(theme) {
        this.state.theme = theme;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        
        document.querySelectorAll('.theme-toggle, #theme-toggle-btn').forEach(btn => {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        });
        
        Storage.set('theme', theme);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    // User Management
    loadUser() {
        this.state.currentUser = Storage.get('currentUser');
        if (this.state.currentUser) {
            Storage.set('loginTime', Date.now());
            this.state.activeSessions = Storage.get('activeSessions', 1);
        }
    },

    loadGamification() {
        this.state.xpPoints = parseInt(Storage.get('xpPoints') || '0');
        this.state.level = parseInt(Storage.get('userLevel') || '1');
        this.state.badges = Storage.get('userBadges', []);
        this.state.streak = parseInt(Storage.get('userStreak') || '0');
        this.state.lastActive = Storage.get('lastActive');
    },

    checkStreak() {
        const today = new Date().toDateString();
        const lastActive = this.state.lastActive;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastActive === today) return;
        if (lastActive === yesterday) {
            this.state.streak++;
            if (this.state.streak % 7 === 0) this.awardBadge('weekly_streak');
            if (this.state.streak % 30 === 0) this.awardBadge('monthly_streak');
        } else if (lastActive && lastActive !== today) {
            this.state.streak = 1;
        } else {
            this.state.streak = 1;
        }
        
        this.state.lastActive = today;
        Storage.set('userStreak', this.state.streak);
        Storage.set('lastActive', today);
    },

    awardXP(action, points) {
        this.state.xpPoints += points;
        const newLevel = Math.floor(this.state.xpPoints / 100) + 1;
        
        if (newLevel > this.state.level) {
            this.state.level = newLevel;
            Notify.success(`🎉 Level Up! You are now Level ${newLevel}!`, 5000);
            if (newLevel >= 5) this.awardBadge('level_5');
            if (newLevel >= 10) this.awardBadge('level_10');
            if (newLevel >= 25) this.awardBadge('level_25');
            this.showConfetti();
        }
        
        Storage.set('xpPoints', this.state.xpPoints);
        Storage.set('userLevel', this.state.level);
        this.updateXPDisplay();
    },

    awardBadge(badgeId) {
        if (this.state.badges.includes(badgeId)) return;
        this.state.badges.push(badgeId);
        Storage.set('userBadges', this.state.badges);
        
        const badgeNames = {
            'first_campaign': 'First Campaign',
            'ten_campaigns': '10 Campaigns',
            'weekly_streak': '7-Day Streak',
            'monthly_streak': '30-Day Streak',
            'level_5': 'Level 5',
            'level_10': 'Level 10',
            'level_25': 'Level 25',
            'top_affiliate': 'Top Affiliate',
            'super_driver': 'Super Driver'
        };
        
        Notify.success(`🏅 Badge Unlocked: ${badgeNames[badgeId] || badgeId}!`, 5000);
        this.showConfetti();
    },

    showConfetti() {
        const colors = ['#FF6B6B','#FFE66D','#4ECDC4','#6C4DF6','#FFB547','#00C896'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position:fixed;top:-10px;left:${Math.random()*100}vw;
                    width:10px;height:10px;background:${colors[Math.floor(Math.random()*colors.length)]};
                    border-radius:50%;z-index:9999;pointer-events:none;
                    animation:confettiFall ${1+Math.random()*2}s ease-in forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 20);
        }
    },

    updateXPDisplay() {
        document.querySelectorAll('.xp-display').forEach(el => {
            el.textContent = `Lv.${this.state.level} | ${this.state.xpPoints} XP`;
        });
        document.querySelectorAll('.streak-display').forEach(el => {
            el.textContent = `🔥 ${this.state.streak} day streak`;
        });
    },

    // Event Listeners
    setupEventListeners() {
        window.addEventListener('online', () => { 
            this.state.isOnline = true; 
            this.syncOfflineQueue();
            Notify.success('Back online! Data synced.');
        });
        window.addEventListener('offline', () => { 
            this.state.isOnline = false; 
            Notify.warning('You are offline. Changes saved locally.');
        });
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('beforeunload', () => this.saveState());
        window.addEventListener('pagehide', () => this.saveState());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.saveState();
        });
    },

    updateOnlineStatus() {
        this.state.isOnline = navigator.onLine;
        document.body.classList.toggle('offline-mode', !this.state.isOnline);
    },

    // Header & Navigation
    initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.getElementById('main-nav');
        if (!toggle || !nav) return;
        
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('mobile-open');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isOpen);
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    },

    initBottomNav() {
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                const page = this.dataset.page;
                if (page && page !== window.location.pathname.split('/').pop()) {
                    window.location.href = page;
                }
            });
        });
        
        // Set active based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            if (item.dataset.page === currentPage) {
                item.classList.add('active');
            }
        });
        
        // Update notification badge
        this.updateNotificationBadge();
    },

    updateNotificationBadge() {
        const badge = document.querySelector('.bottom-nav-item .nav-badge');
        if (!badge) return;
        const user = this.state.currentUser;
        if (!user) { badge.style.display = 'none'; return; }
        
        let count = 0;
        if (user.role === 'driver') {
            count = CRMManager.getPendingTasksCount(user.id);
        } else if (user.role === 'admin') {
            count = PaymentManager.getPayments({ status: 'pending' }).length;
        } else if (user.role === 'client') {
            count = InvoiceManager.getInvoices(user.id).filter(i => i.status === 'pending').length;
        }
        
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    },

    // Theme Toggle
    initThemeToggle() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.logAudit('user', `Theme changed to ${newTheme}`);
            });
        });
    },

    // Accordions
    initAccordions() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                const content = item.querySelector('.accordion-content');
                const isActive = item.classList.contains('active');
                
                document.querySelectorAll('.accordion-item').forEach(other => {
                    other.classList.remove('active');
                    const otherContent = other.querySelector('.accordion-content');
                    if (otherContent) otherContent.style.maxHeight = '0';
                    const otherHeader = other.querySelector('.accordion-header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    if (content) content.style.maxHeight = content.scrollHeight + 'px';
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    },

    // Back to Top
    initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 800 ? 'flex' : 'none';
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    // Service Worker
    initServiceWorker() {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            navigator.serviceWorker.register('/rasaai/service-worker.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW failed:', err));
        }
    },

    // Offline Support
    initOfflineSupport() {
        if (!this.state.isOnline) {
            Notify.show('You are offline. App will work with saved data.', 'warning', 6000);
        }
    },

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k': e.preventDefault(); this.focusSearch(); break;
                    case 'd': e.preventDefault(); this.navigateTo('dashboard.html'); break;
                    case 'n': e.preventDefault(); this.navigateTo('campaign.html'); break;
                    case 'p': e.preventDefault(); window.print(); break;
                    case '1': e.preventDefault(); this.navigateTo('index.html'); break;
                    case '2': e.preventDefault(); this.navigateTo('dashboard.html'); break;
                    case '3': e.preventDefault(); this.navigateTo('analytics.html'); break;
                }
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
                document.querySelectorAll('.mobile-open').forEach(el => el.classList.remove('mobile-open'));
            }
        });
    },

    // Ripple Effect for Buttons
    initRippleEffect() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn');
            if (!btn) return;
            
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                left:${e.clientX - rect.left - size/2}px;
                top:${e.clientY - rect.top - size/2}px;
                border-radius:50%;
                background:rgba(255,255,255,0.3);
                transform:scale(0);
                animation:ripple 0.6s ease-out;
                pointer-events:none;
            `;
            btn.style.position = btn.style.position || 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    },

    // Referral Code
    checkReferralCode() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            AffiliateManager.trackClick(ref);
            Storage.set('referralCode', ref);
        }
    },

    // Navigation
    navigateTo(url) {
        window.location.href = url;
    },

    focusSearch() {
        const searchInput = document.querySelector('.search-bar input') || 
                           document.getElementById('zone-search') ||
                           document.getElementById('global-search');
        if (searchInput) searchInput.focus();
    },

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
        });
    },

    handleScroll() {
        const header = document.getElementById('main-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) backToTop.style.display = window.scrollY > 800 ? 'flex' : 'none';
    },

    // UI Updates
    updateUIForAuth() {
        const user = this.state.currentUser;
        if (!user) return;
        
        document.querySelectorAll('a[href="login.html"]').forEach(link => {
            link.textContent = user.name?.split(' ')[0] || 'Dashboard';
            link.href = 'dashboard.html';
        });
        
        document.querySelectorAll('[data-auth-required]').forEach(el => el.style.display = '');
        document.querySelectorAll('[data-guest-only]').forEach(el => el.style.display = 'none');
        
        this.updateXPDisplay();
    },

    // State Management
    saveState() {
        Storage.set('appState', {
            theme: this.state.theme,
            secondsRemaining: this.state.secondsRemaining,
            isOnDuty: this.state.isOnDuty,
            lastSaved: Date.now()
        });
    },

    // Audit Logging
    loadAuditLogs() {
        this.state.auditLogs = Storage.get('auditLogs', []);
    },

    logAudit(action, detail) {
        if (!this.state.currentUser) return;
        const log = {
            id: 'LOG' + Date.now().toString(36).toUpperCase(),
            userId: this.state.currentUser.id,
            userName: this.state.currentUser.name,
            userRole: this.state.currentUser.role,
            action,
            detail,
            ip: 'client',
            timestamp: new Date().toISOString()
        };
        this.state.auditLogs.push(log);
        if (this.state.auditLogs.length > 2000) {
            this.state.auditLogs = this.state.auditLogs.slice(-2000);
        }
        Storage.set('auditLogs', this.state.auditLogs);
    },

    getAuditLogs(filters = {}) {
        let logs = [...this.state.auditLogs];
        if (filters.userId) logs = logs.filter(l => l.userId === filters.userId);
        if (filters.action) logs = logs.filter(l => l.action === filters.action);
        if (filters.startDate) logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.startDate));
        if (filters.endDate) logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.endDate));
        return logs.reverse().slice(0, filters.limit || 100);
    },

    // Offline Sync
    syncOfflineQueue() {
        const queue = Storage.get('offlineQueue', []);
        if (queue.length === 0) return;
        
        let synced = 0;
        queue.forEach(item => {
            try {
                switch(item.type) {
                    case 'campaign': CampaignManager.createCampaign(item.data); synced++; break;
                    case 'lead': CRMManager.createLead(item.data); synced++; break;
                    case 'task_complete': CRMManager.completeTask(item.data.id); synced++; break;
                    case 'invoice': InvoiceManager.generateInvoice(item.data); synced++; break;
                    case 'payment': PaymentManager.verifyPayment(item.data.id, item.data.ref); synced++; break;
                    case 'attendance': 
                        const attendance = Storage.get('attendance', []);
                        attendance.push(item.data);
                        Storage.set('attendance', attendance);
                        synced++;
                        break;
                }
            } catch(e) {
                console.error('Sync failed:', item, e);
            }
        });
        
        Storage.set('offlineQueue', []);
        if (synced > 0) Notify.success(`Synced ${synced} offline actions`);
    },

    addToOfflineQueue(type, data) {
        const queue = Storage.get('offlineQueue', []);
        queue.push({ type, data, timestamp: Date.now() });
        Storage.set('offlineQueue', queue);
    },

    // Sound Effects
    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        Storage.set('soundEnabled', this.state.soundEnabled);
        Notify.info(this.state.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF');
    },

    playSound(type) {
        if (!this.state.soundEnabled) return;
        // Simple beep using AudioContext
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            switch(type) {
                case 'click': osc.frequency.value = 800; gain.gain.value = 0.1; osc.type = 'sine'; break;
                case 'success': osc.frequency.value = 1000; gain.gain.value = 0.15; osc.type = 'sine'; break;
                case 'error': osc.frequency.value = 200; gain.gain.value = 0.1; osc.type = 'square'; break;
                default: osc.frequency.value = 600; gain.gain.value = 0.1;
            }
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } catch(e) {}
    },

    // Logout
    logout() {
        this.logAudit('user', 'User logged out');
        this.saveState();
        Storage.remove('currentUser');
        Storage.remove('loginTime');
        this.state.currentUser = null;
        
        if (this.state.audioTimer) clearInterval(this.state.audioTimer);
        if (this.state.gpsTimer) clearInterval(this.state.gpsTimer);
        if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
        
        window.location.href = 'index.html';
    }
};

// =====================================================
// 2. STORAGE MANAGER (Enhanced)
// =====================================================
const Storage = {
    PREFIX: 'rasaai_',
    memory: {},
    available: false,

    init() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            this.available = true;
        } catch (e) {
            this.available = false;
        }
    },

    set(key, value) {
        const fullKey = this.PREFIX + key;
        const data = JSON.stringify({ value, timestamp: Date.now(), version: '3.0' });
        
        if (this.available) {
            try {
                localStorage.setItem(fullKey, data);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    this.cleanup();
                    try { localStorage.setItem(fullKey, data); } catch (e2) {
                        this.memory[fullKey] = data;
                    }
                } else {
                    this.memory[fullKey] = data;
                }
            }
        } else {
            this.memory[fullKey] = data;
        }
    },

    get(key, defaultValue = null) {
        const fullKey = this.PREFIX + key;
        let raw = null;
        
        if (this.available) {
            try { raw = localStorage.getItem(fullKey); } catch (e) {
                raw = this.memory[fullKey];
            }
        } else {
            raw = this.memory[fullKey];
        }
        
        if (!raw) return defaultValue;
        
        try {
            const parsed = JSON.parse(raw);
            return parsed.value !== undefined ? parsed.value : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    remove(key) {
        const fullKey = this.PREFIX + key;
        if (this.available) {
            try { localStorage.removeItem(fullKey); } catch (e) {}
        }
        delete this.memory[fullKey];
    },

    keys() {
        const keys = [];
        if (this.available) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.PREFIX)) keys.push(key.replace(this.PREFIX, ''));
            }
        }
        Object.keys(this.memory).forEach(key => {
            const cleanKey = key.replace(this.PREFIX, '');
            if (!keys.includes(cleanKey)) keys.push(cleanKey);
        });
        return keys;
    },

    getAll() {
        const all = {};
        this.keys().forEach(key => { all[key] = this.get(key); });
        return all;
    },

    clear() {
        this.keys().forEach(key => this.remove(key));
        this.memory = {};
    },

    cleanup() {
        const keys = this.keys();
        const oldKeys = keys.filter(k => {
            const fullKey = this.PREFIX + k;
            try {
                const raw = this.available ? localStorage.getItem(fullKey) : this.memory[fullKey];
                if (!raw) return false;
                const parsed = JSON.parse(raw);
                return Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000;
            } catch (e) { return true; }
        });
        oldKeys.forEach(k => this.remove(k));
    },

    exportAll() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    importAll(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.keys(data).forEach(key => this.set(key, data[key]));
            return true;
        } catch (e) { return false; }
    },

    getSize() {
        let size = 0;
        this.keys().forEach(key => {
            const fullKey = this.PREFIX + key;
            if (this.available) {
                try { size += localStorage.getItem(fullKey)?.length || 0; } catch (e) {}
            }
            size += (this.memory[fullKey]?.length || 0);
        });
        return size;
    }
};

// =====================================================
// 3. AUTHENTICATION MANAGER (Enhanced)
// =====================================================
const Auth = {
    USERS_KEY: 'users',
    SESSIONS_KEY: 'sessions',
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000,
    SESSION_DURATION: 24 * 60 * 60 * 1000,

    DEMO_USERS: [
        { id: 'ADM001', name: 'Admin User', email: 'admin@rasaai.com', password: 'admin123', role: 'admin', phone: '9876543210', active: true, createdAt: '2024-01-01', permissions: ['*'], avatar: 'A' },
        { id: 'CLI001', name: 'Rahul Sharma', email: 'client@rasaai.com', password: 'client123', role: 'client', phone: '9876543211', active: true, createdAt: '2024-02-01', company: 'Mumbra Pizza House', gst: '27AAAAA0000A1Z5', permissions: ['campaigns', 'invoices', 'analytics', 'affiliate'], avatar: 'RS' },
        { id: 'DRV001', name: 'Salman Khan', email: 'driver@rasaai.com', password: 'driver123', role: 'driver', phone: '9876543212', active: true, createdAt: '2024-03-01', zone: 'mumbra-station', rickshawId: 'RICK001', permissions: ['tasks', 'attendance', 'upload'], avatar: 'SK' },
        { id: 'DRV002', name: 'Anwar Hussain', email: 'driver2@rasaai.com', password: 'driver123', role: 'driver', phone: '9876543215', active: true, createdAt: '2024-06-01', zone: 'kausa', rickshawId: 'RICK002', permissions: ['tasks', 'attendance', 'upload'], avatar: 'AH' },
        { id: 'AFF001', name: 'Priya Patel', email: 'affiliate@rasaai.com', password: 'affiliate123', role: 'affiliate', phone: '9876543213', active: true, createdAt: '2024-04-01', referralCode: 'REF001', permissions: ['referrals', 'commissions', 'wallet'], avatar: 'PP' },
        { id: 'SAL001', name: 'Amit Verma', email: 'sales@rasaai.com', password: 'sales123', role: 'sales', phone: '9876543214', active: true, createdAt: '2024-05-01', target: 500000, permissions: ['leads', 'pipeline', 'tasks', 'proposals'], avatar: 'AV' }
    ],

    init() {
        if (!Storage.get(this.USERS_KEY)) {
            Storage.set(this.USERS_KEY, this.DEMO_USERS);
        }
        this.cleanExpiredSessions();
    },

    login(email, password) {
        const loginAttempts = Storage.get('loginAttempts', {});
        const attempts = loginAttempts[email] || { count: 0, lastAttempt: 0 };
        
        if (attempts.count >= this.MAX_LOGIN_ATTEMPTS && Date.now() - attempts.lastAttempt < this.LOCKOUT_DURATION) {
            const waitMinutes = Math.ceil((this.LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);
            return { success: false, message: `Account locked. Try again in ${waitMinutes} min.` };
        }

        const users = Storage.get(this.USERS_KEY, []);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (!user) {
            attempts.count = (attempts.count || 0) + 1;
            attempts.lastAttempt = Date.now();
            loginAttempts[email] = attempts;
            Storage.set('loginAttempts', loginAttempts);
            return { success: false, message: 'Invalid email or password.' };
        }
        if (!user.active) {
            return { success: false, message: 'Account deactivated. Contact admin.' };
        }

        delete loginAttempts[email];
        Storage.set('loginAttempts', loginAttempts);

        const sessionUser = { ...user };
        delete sessionUser.password;
        
        Storage.set('currentUser', sessionUser);
        Storage.set('loginTime', Date.now());
        this.createSession(sessionUser);
        
        App.state.currentUser = sessionUser;
        App.logAudit('auth', `Login: ${user.email}`);
        App.awardXP('login', 5);
        
        return { success: true, user: sessionUser };
    },

    register(userData) {
        if (!this.validateRegistration(userData)) {
            return { success: false, message: 'Please fill all required fields correctly.' };
        }

        const users = Storage.get(this.USERS_KEY, []);
        
        if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { success: false, message: 'Email already registered.' };
        }
        if (users.find(u => u.phone === userData.phone && userData.phone.length >= 10)) {
            return { success: false, message: 'Phone already registered.' };
        }

        const newUser = {
            id: 'USR' + Date.now().toString(36).toUpperCase(),
            name: userData.name.trim(),
            email: userData.email.toLowerCase().trim(),
            phone: userData.phone.trim(),
            password: userData.password,
            role: userData.role || 'client',
            company: userData.company || '',
            gst: userData.gst || '',
            active: true,
            permissions: ['campaigns', 'invoices', 'analytics'],
            avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Storage.set(this.USERS_KEY, users);
        
        App.logAudit('auth', `New registration: ${newUser.email}`);
        return { success: true, userId: newUser.id };
    },

    validateRegistration(data) {
        if (!data.name || data.name.trim().length < 2) return false;
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return false;
        if (!data.phone || data.phone.replace(/[\s\-\+]/g, '').length < 10) return false;
        if (!data.password || data.password.length < 6) return false;
        return true;
    },

    logout() { App.logout(); },

    getCurrentUser() {
        const user = Storage.get('currentUser');
        if (user) {
            const loginTime = Storage.get('loginTime', 0);
            if (Date.now() - loginTime > this.SESSION_DURATION) {
                this.logout();
                return null;
            }
            Storage.set('loginTime', Date.now());
        }
        return user;
    },

    isLoggedIn() { return !!this.getCurrentUser(); },
    hasRole(role) { const user = this.getCurrentUser(); return user && (user.role === role || user.role === 'admin'); },
    hasPermission(permission) { const user = this.getCurrentUser(); if (!user) return false; if (user.role === 'admin') return true; return user.permissions?.includes(permission) || false; },

    createSession(user) {
        const sessions = Storage.get(this.SESSIONS_KEY, []);
        sessions.push({ userId: user.id, loginTime: Date.now(), ip: 'client', userAgent: navigator.userAgent });
        if (sessions.length > 100) sessions.shift();
        Storage.set(this.SESSIONS_KEY, sessions);
    },

    cleanExpiredSessions() {
        const sessions = Storage.get(this.SESSIONS_KEY, []);
        Storage.set(this.SESSIONS_KEY, sessions.filter(s => Date.now() - s.loginTime < this.SESSION_DURATION));
    },

    updateProfile(updates) {
        const user = this.getCurrentUser();
        if (!user) return false;
        const users = Storage.get(this.USERS_KEY, []);
        const index = users.findIndex(u => u.id === user.id);
        if (index === -1) return false;
        
        ['name','phone','company','gst','avatar'].forEach(key => {
            if (updates[key] !== undefined) users[index][key] = updates[key];
        });
        if (updates.password) users[index].password = updates.password;
        
        Storage.set(this.USERS_KEY, users);
        const updated = { ...users[index] };
        delete updated.password;
        Storage.set('currentUser', updated);
        App.state.currentUser = updated;
        App.logAudit('profile', 'Profile updated');
        return true;
    },

    getAllUsers() { return Storage.get(this.USERS_KEY, []); },
    getUserById(id) { return Storage.get(this.USERS_KEY, []).find(u => u.id === id); },
    
    toggleUserStatus(userId) {
        const users = Storage.get(this.USERS_KEY, []);
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        users[index].active = !users[index].active;
        Storage.set(this.USERS_KEY, users);
        App.logAudit('admin', `User ${userId} ${users[index].active ? 'activated' : 'deactivated'}`);
        return true;
    },

    deleteUser(userId) {
        const users = Storage.get(this.USERS_KEY, []);
        const filtered = users.filter(u => u.id !== userId);
        if (filtered.length === users.length) return false;
        Storage.set(this.USERS_KEY, filtered);
        App.logAudit('admin', `User ${userId} deleted`);
        return true;
    },

    changeUserRole(userId, newRole) {
        if (!['admin','client','driver','affiliate','sales'].includes(newRole)) return false;
        const users = Storage.get(this.USERS_KEY, []);
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        users[index].role = newRole;
        Storage.set(this.USERS_KEY, users);
        App.logAudit('admin', `User ${userId} role → ${newRole}`);
        return true;
    }
};

// =====================================================
// 4. LIVE PRICING ENGINE (Enhanced)
// =====================================================
const PricingEngine = {
    LED_MIN: 1238, LED_MAX: 1647,
    AUDIO_MIN: 318, AUDIO_MAX: 639,
    UPDATE_INTERVAL: 15 * 60 * 1000,
    currentPrices: { led: 1442, audio: 478, updatedAt: Date.now() },
    secondsRemaining: 900,
    priceHistory: [],

    init() {
        const saved = Storage.get('currentPrices');
        if (saved?.updatedAt && (Date.now() - saved.updatedAt < this.UPDATE_INTERVAL)) {
            this.currentPrices = saved;
            this.secondsRemaining = Math.floor((this.UPDATE_INTERVAL - (Date.now() - saved.updatedAt)) / 1000);
        } else {
            this.generatePrices();
        }
        this.loadPriceHistory();
        this.startTimer();
        this.updateDisplay();
    },

    generatePrices() {
        this.currentPrices = {
            led: Math.floor(Math.random() * (this.LED_MAX - this.LED_MIN + 1)) + this.LED_MIN,
            audio: Math.floor(Math.random() * (this.AUDIO_MAX - this.AUDIO_MIN + 1)) + this.AUDIO_MIN,
            updatedAt: Date.now()
        };
        this.priceHistory.push({ ...this.currentPrices, timestamp: Date.now() });
        if (this.priceHistory.length > 200) this.priceHistory = this.priceHistory.slice(-200);
        
        Storage.set('currentPrices', this.currentPrices);
        Storage.set('priceHistory', this.priceHistory);
        this.secondsRemaining = this.UPDATE_INTERVAL / 1000;
        this.updateDisplay();
        
        document.dispatchEvent(new CustomEvent('pricesUpdated', { detail: this.currentPrices }));
        App.logAudit('system', `Prices: LED=₹${this.currentPrices.led} Audio=₹${this.currentPrices.audio}`);
    },

    startTimer() {
        if (App.state.countdownTimer) clearInterval(App.state.countdownTimer);
        App.state.countdownTimer = setInterval(() => {
            this.secondsRemaining--;
            if (this.secondsRemaining <= 0) this.generatePrices();
            this.updateTimerDisplay();
        }, 1000);
    },

    updateDisplay() {
        document.querySelectorAll('.price-led').forEach(el => {
            el.textContent = '₹' + this.currentPrices.led.toLocaleString();
            this.animateNumber(el);
        });
        document.querySelectorAll('.price-audio').forEach(el => {
            el.textContent = '₹' + this.currentPrices.audio.toLocaleString();
            this.animateNumber(el);
        });
    },

    animateNumber(el) {
        el.classList.add('number-animate');
        setTimeout(() => el.classList.remove('number-animate'), 500);
    },

    updateTimerDisplay() {
        const mins = Math.floor(Math.max(0, this.secondsRemaining) / 60);
        const secs = Math.max(0, this.secondsRemaining) % 60;
        const display = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        document.querySelectorAll('.pricing-timer span:last-child, #pricing-countdown, #pricing-countdown-2, #admin-timer').forEach(el => {
            if (el) el.textContent = display;
        });
        document.querySelectorAll('.pricing-timer').forEach(el => {
            el.classList.toggle('timer-urgent', this.secondsRemaining <= 300);
        });
    },

    getLEDPrice() { return this.currentPrices.led; },
    getAudioPrice() { return this.currentPrices.audio; },

    calculateCost(type, quantity, days) {
        let basePrice;
        switch(type) {
            case 'led': basePrice = this.getLEDPrice(); break;
            case 'audio': basePrice = this.getAudioPrice(); break;
            case 'combo': basePrice = this.getLEDPrice() + this.getAudioPrice(); break;
            default: basePrice = this.getLEDPrice();
        }
        let cost = basePrice * quantity * days;
        if (quantity >= 10) cost *= 0.90; // 10% discount
        if (days >= 30) cost *= 0.95; // Additional 5% for 30+ days
        return Math.round(cost);
    },

    loadPriceHistory() { this.priceHistory = Storage.get('priceHistory', []); },
    
    getPriceHistory(hours = 24) {
        return this.priceHistory.filter(p => p.timestamp > Date.now() - hours * 3600000);
    },

    getAveragePrice(type) {
        const history = this.getPriceHistory(24);
        if (history.length === 0) return this.currentPrices[type];
        return Math.round(history.reduce((s, p) => s + p[type], 0) / history.length);
    }
};

// =====================================================
// 5. CAMPAIGN CALCULATOR (Enhanced)
// =====================================================
const CampaignCalculator = {
    ZONES: [
        { id: 'kausa', name: 'Kausa', icon: '🏘️', population: 45000, traffic: 85000, impressions: 125000, peakHours: '8-10 AM, 5-8 PM', businessDensity: 'medium', color: '#6C4DF6' },
        { id: 'mumbra-station', name: 'Mumbra Station', icon: '🚉', population: 78000, traffic: 150000, impressions: 220000, peakHours: '7-10 AM, 4-9 PM', businessDensity: 'high', color: '#FF4D6D' },
        { id: 'amrut-nagar', name: 'Amrut Nagar', icon: '🏡', population: 35000, traffic: 65000, impressions: 95000, peakHours: '9-11 AM, 6-8 PM', businessDensity: 'low', color: '#00C896' },
        { id: 'shilphata', name: 'Shilphata', icon: '🛣️', population: 55000, traffic: 110000, impressions: 155000, peakHours: '7-9 AM, 5-9 PM', businessDensity: 'high', color: '#FFB547' },
        { id: 'retibunder', name: 'Retibunder', icon: '🏗️', population: 28000, traffic: 52000, impressions: 78000, peakHours: '8-10 AM, 4-7 PM', businessDensity: 'low', color: '#00C896' },
        { id: 'diva-junction', name: 'Diva Junction', icon: '🚦', population: 62000, traffic: 120000, impressions: 175000, peakHours: '6-10 AM, 4-10 PM', businessDensity: 'high', color: '#FF4D6D' },
        { id: 'mumbra-bypass', name: 'Mumbra Bypass', icon: '🛤️', population: 38000, traffic: 72000, impressions: 105000, peakHours: '7-9 AM, 5-8 PM', businessDensity: 'medium', color: '#6C4DF6' },
        { id: 'check-naka', name: 'Check Naka', icon: '✅', population: 42000, traffic: 80000, impressions: 118000, peakHours: '8-11 AM, 5-9 PM', businessDensity: 'medium', color: '#6C4DF6' },
        { id: 'kalwa-route', name: 'Kalwa Route', icon: '🛵', population: 48000, traffic: 92000, impressions: 135000, peakHours: '7-10 AM, 4-8 PM', businessDensity: 'medium', color: '#6C4DF6' },
        { id: 'almas-colony', name: 'Almas Colony', icon: '🏡', population: 32000, traffic: 60000, impressions: 88000, peakHours: '9-11 AM, 5-7 PM', businessDensity: 'low', color: '#00C896' },
        { id: 'azad-nagar', name: 'Azad Nagar', icon: '🇮🇳', population: 40000, traffic: 76000, impressions: 112000, peakHours: '8-10 AM, 5-8 PM', businessDensity: 'medium', color: '#6C4DF6' },
        { id: 'mumbra-market', name: 'Mumbra Market', icon: '🛒', population: 52000, traffic: 100000, impressions: 148000, peakHours: '8 AM - 10 PM', businessDensity: 'high', color: '#FF4D6D' }
    ],

    CAMPAIGN_TEMPLATES: [
        { name: 'Restaurant Promo', type: 'combo', icon: '🍕', desc: 'Perfect for food businesses' },
        { name: 'Clinic Ad', type: 'audio', icon: '🏥', desc: 'Reach patients in your area' },
        { name: 'Store Launch', type: 'led', icon: '🎉', desc: 'Announce your new store' },
        { name: 'Festival Offer', type: 'combo', icon: '🎊', desc: 'Seasonal promotion' },
        { name: 'Coaching Classes', type: 'audio', icon: '📚', desc: 'Student enrollment drive' },
        { name: 'Real Estate', type: 'led', icon: '🏠', desc: 'Property listings' }
    ],

    init() {
        this.setupCalculatorListeners();
        this.setupZoneFilters();
        this.setupZoneCardClicks();
        this.renderZoneCards();
    },

    setupCalculatorListeners() {
        ['calc-type','calc-zone','calc-duration','calc-quantity','calc-promo','calc-hashtag','calc-contest','calc-start-date'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => this.updateCalculation());
                if (el.type === 'range') el.addEventListener('input', () => { this.updateCalculation(); this.updateRangeLabel(el); });
            }
        });
    },

    updateRangeLabel(el) {
        const val = el.value;
        if (el.id === 'calc-duration') {
            const label = document.getElementById('duration-value');
            if (label) label.textContent = val + ' Day' + (val > 1 ? 's' : '');
        } else if (el.id === 'calc-quantity') {
            const label = document.getElementById('quantity-value');
            if (label) label.textContent = val + ' Rickshaw' + (val > 1 ? 's' : '');
        }
    },

    updateCalculation() {
        const type = document.getElementById('calc-type')?.value || 'led';
        const zoneId = document.getElementById('calc-zone')?.value;
        const days = Math.min(90, Math.max(1, parseInt(document.getElementById('calc-duration')?.value) || 1));
        const quantity = Math.min(50, Math.max(1, parseInt(document.getElementById('calc-quantity')?.value) || 1));
        const hashtag = document.getElementById('calc-hashtag')?.value || '';
        const contestName = document.getElementById('calc-contest')?.value || '';

        const zone = this.ZONES.find(z => z.id === zoneId) || this.ZONES[0];
        const cost = PricingEngine.calculateCost(type, quantity, days);
        const dailyReach = Math.floor(zone.traffic * 0.4 * quantity);
        const totalReach = dailyReach * days;
        const totalImpressions = Math.floor(totalReach * 2.8);
        const cpm = totalImpressions > 0 ? Math.round((cost / totalImpressions) * 1000 * 100) / 100 : 0;
        const discount = quantity >= 10 ? 10 : (days >= 30 ? 5 : 0);
        const roi = cost > 0 ? Math.round(((totalImpressions * 0.002 * 0.15 * 5000 - cost) / cost) * 100) : 0;

        this.updateElement('calc-cost', '₹' + cost.toLocaleString());
        this.updateElement('calc-reach', totalReach.toLocaleString());
        this.updateElement('calc-impressions', totalImpressions.toLocaleString());
        this.updateElement('calc-cpm', '₹' + cpm);
        this.updateElement('calc-roi', roi + '%');
        
        const discEl = document.getElementById('calc-discount');
        if (discEl) {
            discEl.textContent = discount > 0 ? discount + '% Off!' : 'No Discount';
            discEl.className = 'result-value result-discount ' + (discount > 0 ? 'discount-active' : '');
        }
        
        const roiEl = document.getElementById('calc-roi');
        if (roiEl) roiEl.className = 'result-value result-roi ' + (roi > 300 ? 'roi-high' : roi > 100 ? 'roi-medium' : 'roi-low');

        this.lastCalculation = { type, zone: zoneId, zoneName: zone.name, quantity, days, cost, reach: totalReach, impressions: totalImpressions, cpm, roi, discount, hashtag, contestName };
    },

    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.classList.add('value-updated'); setTimeout(() => el.classList.remove('value-updated'), 600); }
    },

    getLastCalculation() { return this.lastCalculation || null; },

    setupZoneFilters() {
        document.querySelectorAll('.zone-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.zone-filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                this.filterZones(btn.dataset.filter);
            });
        });
        document.getElementById('zone-search')?.addEventListener('input', (e) => this.searchZones(e.target.value));
    },

    setupZoneCardClicks() {
        document.querySelectorAll('.zone-card').forEach(card => {
            card.addEventListener('click', () => {
                const zoneId = card.dataset.zoneId;
                const calcZone = document.getElementById('calc-zone');
                if (calcZone) { calcZone.value = zoneId; this.updateCalculation(); }
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    },

    renderZoneCards() {
        const container = document.getElementById('zone-cards-container');
        if (!container) return;
        
        container.innerHTML = this.ZONES.map(z => {
            const available = Inventory.getAvailable(z.id);
            const availabilityPercent = Math.round((available / 50) * 100);
            const badge = availabilityPercent > 60 ? 'high' : availabilityPercent > 30 ? 'medium' : 'low';
            return `
            <article class="zone-card" data-zone-id="${z.id}" data-density="${z.businessDensity}" role="listitem" tabindex="0">
                <div class="zone-card-header">
                    <h3><span class="zone-icon">${z.icon}</span> ${z.name}</h3>
                    <span class="zone-badge ${badge}">${available} Available</span>
                </div>
                <div class="zone-stats-grid">
                    <div class="zone-stat-item"><span class="zone-stat-label">Population</span><span class="zone-stat-value">${z.population.toLocaleString()}</span></div>
                    <div class="zone-stat-item"><span class="zone-stat-label">Daily Traffic</span><span class="zone-stat-value">${z.traffic.toLocaleString()}</span></div>
                    <div class="zone-stat-item"><span class="zone-stat-label">Impressions</span><span class="zone-stat-value">${z.impressions.toLocaleString()}</span></div>
                    <div class="zone-stat-item"><span class="zone-stat-label">Rickshaws</span><span class="zone-stat-value">${available}/50</span></div>
                </div>
                <span class="zone-peak-badge">🕐 ${z.peakHours}</span>
                <div class="zone-progress-wrap"><div class="zone-progress-bar" role="progressbar" aria-valuenow="${availabilityPercent}"><div class="zone-progress-fill" style="width:${availabilityPercent}%"></div></div></div>
                <div class="zone-card-footer">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); document.getElementById('calc-zone').value='${z.id}'; CampaignCalculator.updateCalculation(); document.getElementById('calculator').scrollIntoView({behavior:'smooth'})">📋 Book Now</button>
                </div>
            </article>`;
        }).join('');
        
        const calcZone = document.getElementById('calc-zone');
        if (calcZone) calcZone.innerHTML = '<option value="">Select zone</option>' + this.ZONES.map(z => `<option value="${z.id}">${z.name} (${Inventory.getAvailable(z.id)} available)</option>`).join('');
    },

    filterZones(filter) {
        document.querySelectorAll('.zone-card').forEach(card => {
            const zoneId = card.dataset.zoneId;
            const zone = this.ZONES.find(z => z.id === zoneId);
            if (!zone) { card.style.display = 'none'; return; }
            switch(filter) {
                case 'all': card.style.display = ''; break;
                case 'high-traffic': card.style.display = zone.traffic >= 100000 ? '' : 'none'; break;
                case 'high-population': card.style.display = zone.population >= 50000 ? '' : 'none'; break;
                case 'available': card.style.display = Inventory.getAvailable(zoneId) > 10 ? '' : 'none'; break;
                default: card.style.display = '';
            }
        });
    },

    searchZones(query) {
        const q = query.toLowerCase().trim();
        document.querySelectorAll('.zone-card').forEach(card => {
            if (!q) { card.style.display = ''; return; }
            card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    },

    getZones() { return [...this.ZONES]; },
    getZoneById(id) { return this.ZONES.find(z => z.id === id); },
    getTemplates() { return [...this.CAMPAIGN_TEMPLATES]; }
};

// =====================================================
// CONTINUED IN PART 2...
// =====================================================

console.log('📦 RASAAI app.js Part 1 loaded');
console.log('✅ Modules: App, Storage, Auth, PricingEngine, CampaignCalculator');
/* =====================================================
   FILE: app.js (PART 2 OF 3)
   PATH: rizvi.store/rasaai/app.js
   CONTINUATION FROM PART 1
   Modules: Inventory, Campaigns, Affiliate, CRM, Invoice, Payment, Audio, GPS
   ===================================================== */

// =====================================================
// 6. INVENTORY MANAGER
// =====================================================
const Inventory = {
    TOTAL_PER_ZONE: 50,
    INVENTORY_KEY: 'inventory',

    init() {
        if (!Storage.get(this.INVENTORY_KEY)) {
            this.initializeInventory();
        }
    },

    initializeInventory() {
        const inventory = {};
        CampaignCalculator.getZones().forEach(zone => {
            inventory[zone.id] = {
                total: this.TOTAL_PER_ZONE,
                available: this.TOTAL_PER_ZONE,
                booked: 0,
                maintenance: 0,
                active: 0,
                rickshaws: this.generateRickshawList(zone.id)
            };
        });
        Storage.set(this.INVENTORY_KEY, inventory);
    },

    generateRickshawList(zoneId) {
        const list = [];
        for (let i = 1; i <= this.TOTAL_PER_ZONE; i++) {
            list.push({
                id: 'RICK' + zoneId.substring(0, 4).toUpperCase() + String(i).padStart(3, '0'),
                number: i,
                status: 'available', // available, booked, maintenance
                driverId: null,
                lastMaintenance: null,
                condition: 'good'
            });
        }
        return list;
    },

    getInventory() {
        return Storage.get(this.INVENTORY_KEY, {});
    },

    getAvailable(zoneId) {
        const inv = this.getInventory();
        return inv[zoneId]?.available ?? this.TOTAL_PER_ZONE;
    },

    getTotal(zoneId) {
        const inv = this.getInventory();
        return inv[zoneId]?.total ?? this.TOTAL_PER_ZONE;
    },

    getRickshaws(zoneId) {
        const inv = this.getInventory();
        return inv[zoneId]?.rickshaws || [];
    },

    book(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId] || inv[zoneId].available < quantity) return false;
        
        inv[zoneId].available -= quantity;
        inv[zoneId].booked += quantity;
        
        // Mark rickshaws as booked
        let booked = 0;
        inv[zoneId].rickshaws.forEach(r => {
            if (r.status === 'available' && booked < quantity) {
                r.status = 'booked';
                booked++;
            }
        });
        
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    release(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId] || inv[zoneId].booked < quantity) return false;
        
        inv[zoneId].available += quantity;
        inv[zoneId].booked -= quantity;
        
        let released = 0;
        inv[zoneId].rickshaws.forEach(r => {
            if (r.status === 'booked' && released < quantity) {
                r.status = 'available';
                released++;
            }
        });
        
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    setMaintenance(zoneId, rickshawId) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        
        const rickshaw = inv[zoneId].rickshaws.find(r => r.id === rickshawId);
        if (!rickshaw) return false;
        
        if (rickshaw.status === 'available') inv[zoneId].available--;
        if (rickshaw.status === 'booked') inv[zoneId].booked--;
        rickshaw.status = 'maintenance';
        rickshaw.lastMaintenance = new Date().toISOString();
        inv[zoneId].maintenance++;
        
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    releaseMaintenance(zoneId, rickshawId) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        
        const rickshaw = inv[zoneId].rickshaws.find(r => r.id === rickshawId);
        if (!rickshaw || rickshaw.status !== 'maintenance') return false;
        
        rickshaw.status = 'available';
        inv[zoneId].available++;
        inv[zoneId].maintenance--;
        
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    assignDriver(zoneId, rickshawId, driverId) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        
        const rickshaw = inv[zoneId].rickshaws.find(r => r.id === rickshawId);
        if (!rickshaw) return false;
        
        rickshaw.driverId = driverId;
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    getStats() {
        const inv = this.getInventory();
        let total = 0, available = 0, booked = 0, maintenance = 0;
        Object.values(inv).forEach(z => {
            total += z.total || 0;
            available += z.available || 0;
            booked += z.booked || 0;
            maintenance += z.maintenance || 0;
        });
        return { total, available, booked, maintenance };
    },

    getZoneStats(zoneId) {
        const inv = this.getInventory();
        const zone = inv[zoneId];
        if (!zone) return { total: 50, available: 50, booked: 0, maintenance: 0, rickshaws: [] };
        return { ...zone };
    },

    getUtilizationRate(zoneId) {
        const stats = this.getZoneStats(zoneId);
        return stats.total > 0 ? Math.round(((stats.booked + stats.maintenance) / stats.total) * 100) : 0;
    }
};

// =====================================================
// 7. CAMPAIGN MANAGER (Enhanced)
// =====================================================
const CampaignManager = {
    CAMPAIGNS_KEY: 'campaigns',

    init() {
        if (!Storage.get(this.CAMPAIGNS_KEY)) {
            Storage.set(this.CAMPAIGNS_KEY, []);
        }
    },

    createCampaign(data) {
        const campaigns = Storage.get(this.CAMPAIGNS_KEY, []);
        const user = App.state.currentUser;
        
        const campaign = {
            id: 'CAM' + Date.now().toString(36).toUpperCase(),
            userId: data.userId || user?.id,
            userName: data.userName || user?.name || 'Client',
            name: data.name || 'Untitled Campaign',
            type: data.type || 'led',
            zone: data.zone,
            zoneName: CampaignCalculator.getZoneById(data.zone)?.name || data.zone,
            quantity: Math.min(50, Math.max(1, data.quantity || 1)),
            days: Math.min(90, Math.max(1, data.days || 1)),
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            endDate: this.calculateEndDate(data.startDate || new Date().toISOString().split('T')[0], data.days || 1),
            cost: data.cost || 0,
            discount: data.discount || 0,
            hashtag: data.hashtag || '',
            contestName: data.contestName || '',
            status: 'active',
            impressions: data.impressions || 0,
            reach: data.reach || 0,
            audioPlays: 0,
            gpsData: [],
            creativeUrl: data.creativeUrl || '',
            creativeType: data.creativeType || '',
            audioUrl: data.audioUrl || '',
            notes: data.notes || '',
            template: data.template || '',
            assignedDriver: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null
        };

        campaigns.push(campaign);
        Storage.set(this.CAMPAIGNS_KEY, campaigns);

        if (data.zone && data.quantity) {
            Inventory.book(data.zone, data.quantity);
        }

        // Auto-assign driver if available
        this.autoAssignDriver(campaign);

        App.logAudit('campaign', `Created: ${campaign.name} in ${campaign.zoneName}`);
        App.awardXP('create_campaign', 50);
        
        // Check for badges
        const userCampaigns = this.getCampaigns(user?.id);
        if (userCampaigns.length === 1) App.awardBadge('first_campaign');
        if (userCampaigns.length >= 10) App.awardBadge('ten_campaigns');

        return campaign;
    },

    calculateEndDate(startDate, days) {
        const end = new Date(startDate);
        end.setDate(end.getDate() + days);
        return end.toISOString().split('T')[0];
    },

    autoAssignDriver(campaign) {
        const drivers = Auth.getAllUsers().filter(u => u.role === 'driver' && u.active);
        if (drivers.length === 0) return;
        
        // Prefer driver in same zone
        const zoneDriver = drivers.find(d => d.zone === campaign.zone);
        const driver = zoneDriver || drivers[Math.floor(Math.random() * drivers.length)];
        
        campaign.assignedDriver = driver.id;
        
        // Create task for driver
        CRMManager.createTask({
            title: `Campaign: ${campaign.name} - ${campaign.zoneName}`,
            type: 'campaign',
            relatedTo: campaign.id,
            assignedTo: driver.id,
            dueDate: campaign.endDate,
            priority: 'high',
            notes: `Type: ${campaign.type.toUpperCase()} | Rickshaws: ${campaign.quantity} | Days: ${campaign.days} | Hashtag: ${campaign.hashtag || 'N/A'} | Contest: ${campaign.contestName || 'N/A'}`
        });
        
        this.updateCampaignSilent(campaign.id, { assignedDriver: driver.id });
    },

    getCampaigns(userId) {
        const campaigns = Storage.get(this.CAMPAIGNS_KEY, []);
        if (userId) return campaigns.filter(c => c.userId === userId);
        return campaigns;
    },

    getActiveCampaigns() {
        return this.getCampaigns().filter(c => c.status === 'active');
    },

    getCampaignById(id) {
        return Storage.get(this.CAMPAIGNS_KEY, []).find(c => c.id === id);
    },

    updateCampaign(campaignId, updates) {
        const campaigns = Storage.get(this.CAMPAIGNS_KEY, []);
        const index = campaigns.findIndex(c => c.id === campaignId);
        if (index === -1) return null;
        
        const oldStatus = campaigns[index].status;
        Object.assign(campaigns[index], updates, { updatedAt: new Date().toISOString() });
        
        if (updates.status === 'completed' && oldStatus === 'active') {
            campaigns[index].completedAt = new Date().toISOString();
            if (campaigns[index].zone && campaigns[index].quantity) {
                Inventory.release(campaigns[index].zone, campaigns[index].quantity);
            }
        }
        
        if (updates.status === 'active' && oldStatus === 'paused') {
            campaigns[index].completedAt = null;
        }
        
        Storage.set(this.CAMPAIGNS_KEY, campaigns);
        App.logAudit('campaign', `Updated: ${campaignId} | Status: ${oldStatus} → ${updates.status || oldStatus}`);
        return campaigns[index];
    },

    updateCampaignSilent(campaignId, updates) {
        const campaigns = Storage.get(this.CAMPAIGNS_KEY, []);
        const index = campaigns.findIndex(c => c.id === campaignId);
        if (index === -1) return null;
        Object.assign(campaigns[index], updates, { updatedAt: new Date().toISOString() });
        Storage.set(this.CAMPAIGNS_KEY, campaigns);
        return campaigns[index];
    },

    deleteCampaign(campaignId) {
        const campaign = this.getCampaignById(campaignId);
        if (campaign && campaign.status === 'active') {
            Inventory.release(campaign.zone, campaign.quantity);
        }
        
        const campaigns = Storage.get(this.CAMPAIGNS_KEY, []);
        const filtered = campaigns.filter(c => c.id !== campaignId);
        Storage.set(this.CAMPAIGNS_KEY, filtered);
        App.logAudit('campaign', `Deleted: ${campaignId}`);
        return true;
    },

    getStats(userId) {
        const campaigns = this.getCampaigns(userId);
        return {
            total: campaigns.length,
            active: campaigns.filter(c => c.status === 'active').length,
            completed: campaigns.filter(c => c.status === 'completed').length,
            paused: campaigns.filter(c => c.status === 'paused').length,
            draft: campaigns.filter(c => c.status === 'draft').length,
            totalCost: campaigns.reduce((sum, c) => sum + (c.cost || 0), 0),
            totalImpressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
            totalReach: campaigns.reduce((sum, c) => sum + (c.reach || 0), 0),
            totalAudioPlays: campaigns.reduce((sum, c) => sum + (c.audioPlays || 0), 0)
        };
    },

    logImpression(campaignId, count = 1) {
        const campaign = this.getCampaignById(campaignId);
        if (campaign) {
            this.updateCampaignSilent(campaignId, { impressions: (campaign.impressions || 0) + count });
        }
    },

    logAudioPlay(campaignId) {
        const campaign = this.getCampaignById(campaignId);
        if (campaign) {
            this.updateCampaignSilent(campaignId, { audioPlays: (campaign.audioPlays || 0) + 1 });
        }
    },

    getWhatsAppMessage(campaign) {
        const inv = InvoiceManager.getInvoices(campaign.userId).find(i => i.campaignId === campaign.id);
        return encodeURIComponent(
            `Hi RASAAI! 🛺\n\n` +
            `I just booked a campaign:\n` +
            `📋 Name: ${campaign.name}\n` +
            `📍 Zone: ${campaign.zoneName}\n` +
            `🛺 Rickshaws: ${campaign.quantity}\n` +
            `📅 Duration: ${campaign.days} days\n` +
            `💰 Cost: ₹${(campaign.cost || 0).toLocaleString()}\n` +
            (inv ? `🧾 Invoice: ${inv.invoiceNumber}\n` : '') +
            (campaign.hashtag ? `#️⃣ Hashtag: #${campaign.hashtag}\n` : '') +
            (campaign.contestName ? `🏆 Contest: ${campaign.contestName}\n` : '') +
            `\nPlease confirm my booking!`
        );
    }
};

// =====================================================
// 8. AFFILIATE MANAGER (Enhanced with WhatsApp)
// =====================================================
const AffiliateManager = {
    COMMISSION_RATE: 0.10,
    REFERRALS_KEY: 'referrals',
    COMMISSIONS_KEY: 'commissions',
    WITHDRAWALS_KEY: 'withdrawals',

    init() {
        if (!Storage.get(this.REFERRALS_KEY)) Storage.set(this.REFERRALS_KEY, []);
        if (!Storage.get(this.COMMISSIONS_KEY)) Storage.set(this.COMMISSIONS_KEY, []);
        if (!Storage.get(this.WITHDRAWALS_KEY)) Storage.set(this.WITHDRAWALS_KEY, []);
    },

    generateReferralLink(userId) {
        const code = 'REF' + (userId || 'XXXX').slice(-4) + Math.random().toString(36).substr(2, 4).toUpperCase();
        const referrals = Storage.get(this.REFERRALS_KEY, []);
        
        if (!referrals.find(r => r.userId === userId)) {
            referrals.push({
                code, userId,
                clicks: 0, leads: 0, conversions: 0,
                totalEarned: 0,
                createdAt: new Date().toISOString()
            });
            Storage.set(this.REFERRALS_KEY, referrals);
        }
        
        return window.location.origin + '/rasaai/?ref=' + code;
    },

    getWhatsAppShareMessage(userId) {
        const link = this.generateReferralLink(userId);
        const user = Auth.getUserById(userId);
        return encodeURIComponent(
            `🛺 Advertise on Moving Rickshaws in Mumbra!\n\n` +
            `📺 LED Campaigns from ₹1,238/day\n` +
            `🔊 Audio Campaigns from ₹318/day\n` +
            `📍 12 Zones | 600+ Rickshaws\n` +
            `📊 Real-time Analytics\n\n` +
            `👉 Sign up here: ${link}\n\n` +
            `Use my referral link and get started! 🚀`
        );
    },

    trackClick(code) {
        const referrals = Storage.get(this.REFERRALS_KEY, []);
        const ref = referrals.find(r => r.code === code);
        if (ref) {
            ref.clicks++;
            ref.lastClick = new Date().toISOString();
            Storage.set(this.REFERRALS_KEY, referrals);
        }
    },

    trackLead(code) {
        const referrals = Storage.get(this.REFERRALS_KEY, []);
        const ref = referrals.find(r => r.code === code);
        if (ref) { ref.leads++; Storage.set(this.REFERRALS_KEY, referrals); }
    },

    trackConversion(code, amount, campaignId) {
        const referrals = Storage.get(this.REFERRALS_KEY, []);
        const ref = referrals.find(r => r.code === code);
        if (!ref) return 0;
        
        ref.conversions++;
        const commission = Math.round(amount * this.COMMISSION_RATE);
        ref.totalEarned += commission;
        
        const commissions = Storage.get(this.COMMISSIONS_KEY, []);
        commissions.push({
            id: 'COM' + Date.now().toString(36).toUpperCase(),
            userId: ref.userId, referralCode: code,
            campaignId, amount, commission,
            status: 'credited',
            createdAt: new Date().toISOString()
        });
        
        Storage.set(this.COMMISSIONS_KEY, commissions);
        Storage.set(this.REFERRALS_KEY, referrals);
        App.logAudit('affiliate', `Commission ₹${commission} to ${ref.userId}`);
        
        // Award XP to affiliate
        if (App.state.currentUser?.id === ref.userId) {
            App.awardXP('affiliate_commission', 25);
        }
        
        return commission;
    },

    getCommission(userId) {
        return Storage.get(this.COMMISSIONS_KEY, [])
            .filter(c => c.userId === userId && c.status === 'credited')
            .reduce((sum, c) => sum + c.commission, 0);
    },

    getPendingCommission(userId) {
        return Storage.get(this.COMMISSIONS_KEY, [])
            .filter(c => c.userId === userId && c.status === 'pending')
            .reduce((sum, c) => sum + c.commission, 0);
    },

    getReferralStats(userId) {
        const referrals = Storage.get(this.REFERRALS_KEY, []);
        const ref = referrals.find(r => r.userId === userId);
        return ref || { clicks: 0, leads: 0, conversions: 0, totalEarned: 0 };
    },

    getLeaderboard(limit = 20) {
        const commissions = Storage.get(this.COMMISSIONS_KEY, []);
        const totals = {};
        
        commissions.forEach(c => {
            if (!totals[c.userId]) totals[c.userId] = { userId: c.userId, total: 0, count: 0 };
            totals[c.userId].total += c.commission;
            totals[c.userId].count++;
        });
        
        return Object.values(totals)
            .map(t => ({ ...t, name: Auth.getUserById(t.userId)?.name || 'Unknown' }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    },

    requestWithdrawal(userId, amount) {
        const availableBalance = this.getCommission(userId);
        const pendingWithdrawals = this.getPendingWithdrawals(userId);
        const effectiveBalance = availableBalance - pendingWithdrawals;
        
        if (amount > effectiveBalance) {
            return { success: false, message: `Insufficient balance. Available: ₹${effectiveBalance.toLocaleString()}` };
        }
        if (amount < 500) {
            return { success: false, message: 'Minimum withdrawal is ₹500' };
        }
        
        const withdrawals = Storage.get(this.WITHDRAWALS_KEY, []);
        const withdrawal = {
            id: 'WTH' + Date.now().toString(36).toUpperCase(),
            userId, amount,
            status: 'pending',
            requestedAt: new Date().toISOString(),
            processedAt: null
        };
        
        withdrawals.push(withdrawal);
        Storage.set(this.WITHDRAWALS_KEY, withdrawals);
        App.logAudit('affiliate', `Withdrawal ₹${amount} by ${userId}`);
        return { success: true, withdrawal };
    },

    getPendingWithdrawals(userId) {
        return Storage.get(this.WITHDRAWALS_KEY, [])
            .filter(w => w.userId === userId && w.status === 'pending')
            .reduce((sum, w) => sum + w.amount, 0);
    },

    getWithdrawalHistory(userId) {
        return Storage.get(this.WITHDRAWALS_KEY, [])
            .filter(w => w.userId === userId)
            .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    },

    approveWithdrawal(withdrawalId) {
        const withdrawals = Storage.get(this.WITHDRAWALS_KEY, []);
        const index = withdrawals.findIndex(w => w.id === withdrawalId);
        if (index === -1) return false;
        
        withdrawals[index].status = 'approved';
        withdrawals[index].processedAt = new Date().toISOString();
        Storage.set(this.WITHDRAWALS_KEY, withdrawals);
        App.logAudit('affiliate', `Withdrawal ${withdrawalId} approved`);
        return true;
    },

    rejectWithdrawal(withdrawalId, reason = '') {
        const withdrawals = Storage.get(this.WITHDRAWALS_KEY, []);
        const index = withdrawals.findIndex(w => w.id === withdrawalId);
        if (index === -1) return false;
        
        withdrawals[index].status = 'rejected';
        withdrawals[index].rejectionReason = reason;
        withdrawals[index].processedAt = new Date().toISOString();
        Storage.set(this.WITHDRAWALS_KEY, withdrawals);
        App.logAudit('affiliate', `Withdrawal ${withdrawalId} rejected: ${reason}`);
        return true;
    }
};

// =====================================================
// 9. CRM & SALES MANAGER
// =====================================================
const CRMManager = {
    LEADS_KEY: 'leads',
    TASKS_KEY: 'crm_tasks',
    STATUSES: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],

    init() {
        if (!Storage.get(this.LEADS_KEY)) Storage.set(this.LEADS_KEY, []);
        if (!Storage.get(this.TASKS_KEY)) Storage.set(this.TASKS_KEY, []);
    },

    createLead(data) {
        const leads = Storage.get(this.LEADS_KEY, []);
        const lead = {
            id: 'LEAD' + Date.now().toString(36).toUpperCase(),
            name: data.name || 'New Lead',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || '',
            source: data.source || 'Website',
            status: 'New',
            assignedTo: data.assignedTo || null,
            value: data.value || 0,
            notes: data.notes || '',
            score: this.calculateLeadScore(data),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            activities: [],
            nextFollowUp: null
        };
        leads.push(lead);
        Storage.set(this.LEADS_KEY, leads);
        App.logAudit('crm', `Lead: ${lead.name}`);
        App.awardXP('create_lead', 15);
        return lead;
    },

    calculateLeadScore(data) {
        let score = 0;
        if (data.value > 100000) score += 40;
        else if (data.value > 50000) score += 25;
        else if (data.value > 10000) score += 10;
        
        if (data.source === 'Referral') score += 25;
        else if (data.source === 'Website') score += 15;
        else if (data.source === 'Call') score += 20;
        
        if (data.phone && data.phone.length >= 10) score += 10;
        if (data.email && data.email.includes('@')) score += 5;
        if (data.company) score += 10;
        
        return Math.min(100, score);
    },

    updateLead(leadId, updates) {
        const leads = Storage.get(this.LEADS_KEY, []);
        const index = leads.findIndex(l => l.id === leadId);
        if (index === -1) return null;
        
        if (updates.status && updates.status !== leads[index].status) {
            leads[index].activities.push({
                type: 'status_change',
                from: leads[index].status,
                to: updates.status,
                timestamp: new Date().toISOString()
            });
        }
        
        Object.assign(leads[index], updates, { updatedAt: new Date().toISOString() });
        
        if (updates.status === 'Won') {
            App.awardXP('won_lead', 50);
            if (leads[index].value > 0) {
                const refCode = Storage.get('referralCode');
                if (refCode) {
                    AffiliateManager.trackConversion(refCode, leads[index].value, leads[index].id);
                }
            }
        }
        
        Storage.set(this.LEADS_KEY, leads);
        return leads[index];
    },

    assignLead(leadId, userId) { return this.updateLead(leadId, { assignedTo: userId }); },

    getLeadsByStatus(status) { return Storage.get(this.LEADS_KEY, []).filter(l => l.status === status); },

    getAllLeads(filters = {}) {
        let leads = Storage.get(this.LEADS_KEY, []);
        if (filters.status) leads = leads.filter(l => l.status === filters.status);
        if (filters.assignedTo) leads = leads.filter(l => l.assignedTo === filters.assignedTo);
        if (filters.source) leads = leads.filter(l => l.source === filters.source);
        if (filters.search) {
            const q = filters.search.toLowerCase();
            leads = leads.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
        }
        return leads.sort((a, b) => b.score - a.score);
    },

    getConversionRate(userId) {
        let leads = this.getAllLeads();
        if (userId) leads = leads.filter(l => l.assignedTo === userId);
        if (leads.length === 0) return 0;
        return Math.round((leads.filter(l => l.status === 'Won').length / leads.length) * 100);
    },

    getPipelineStats() {
        const leads = this.getAllLeads();
        const stats = {};
        this.STATUSES.forEach(status => { stats[status] = leads.filter(l => l.status === status); });
        stats.total = leads.length;
        stats.totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
        stats.wonValue = leads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
        stats.avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / leads.length) : 0;
        return stats;
    },

    createTask(data) {
        const tasks = Storage.get(this.TASKS_KEY, []);
        const task = {
            id: 'TASK' + Date.now().toString(36).toUpperCase(),
            title: data.title || 'New Task',
            type: data.type || 'follow-up',
            relatedTo: data.relatedTo || null,
            assignedTo: data.assignedTo || null,
            status: 'pending',
            priority: data.priority || 'medium',
            dueDate: data.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
            notes: data.notes || '',
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        tasks.push(task);
        Storage.set(this.TASKS_KEY, tasks);
        return task;
    },

    completeTask(taskId) {
        const tasks = Storage.get(this.TASKS_KEY, []);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return null;
        
        tasks[index].status = 'completed';
        tasks[index].completedAt = new Date().toISOString();
        Storage.set(this.TASKS_KEY, tasks);
        
        App.logAudit('crm', `Task completed: ${tasks[index].title}`);
        App.awardXP('complete_task', 10);
        return tasks[index];
    },

    getTasks(userId, filters = {}) {
        let tasks = Storage.get(this.TASKS_KEY, []);
        if (userId) tasks = tasks.filter(t => t.assignedTo === userId);
        if (filters.status) tasks = tasks.filter(t => t.status === filters.status);
        if (filters.type) tasks = tasks.filter(t => t.type === filters.type);
        if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);
        return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },

    getPendingTasksCount(userId) {
        return this.getTasks(userId, { status: 'pending' }).length;
    },

    scheduleFollowUp(leadId, date) {
        const lead = this.getAllLeads().find(l => l.id === leadId);
        if (!lead) return null;
        this.updateLead(leadId, { nextFollowUp: date });
        return this.createTask({ title: `Follow up: ${lead.name}`, type: 'follow-up', relatedTo: leadId, dueDate: date, priority: 'high' });
    }
};

// =====================================================
// 10. INVOICE MANAGER (Enhanced with PDF)
// =====================================================
const InvoiceManager = {
    INVOICES_KEY: 'invoices',
    GST_RATE: 0.18,

    init() {
        if (!Storage.get(this.INVOICES_KEY)) Storage.set(this.INVOICES_KEY, []);
    },

    generateInvoice(campaignData) {
        const invoices = Storage.get(this.INVOICES_KEY, []);
        const subtotal = campaignData.cost || 0;
        const gst = Math.round(subtotal * this.GST_RATE);
        const total = subtotal + gst;
        const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + String(invoices.length + 1).padStart(4, '0');
        const user = App.state.currentUser;

        const invoice = {
            id: 'INV' + Date.now().toString(36).toUpperCase(),
            invoiceNumber,
            campaignId: campaignData.id || null,
            userId: campaignData.userId || user?.id,
            customerName: campaignData.customerName || user?.name || 'Client',
            customerEmail: user?.email || '',
            customerPhone: user?.phone || '',
            customerCompany: user?.company || '',
            customerGST: user?.gst || '',
            campaignType: campaignData.type || 'led',
            campaignName: campaignData.name || 'Campaign',
            zone: campaignData.zoneName || campaignData.zone || 'N/A',
            quantity: campaignData.quantity || 1,
            days: campaignData.days || 1,
            subtotal, gst, total,
            status: 'pending',
            paymentMethod: null,
            paymentRef: null,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            paidAt: null
        };

        invoices.push(invoice);
        Storage.set(this.INVOICES_KEY, invoices);
        App.logAudit('invoice', `Generated ${invoiceNumber} for ₹${total}`);
        return invoice;
    },

    getInvoices(userId) {
        const invoices = Storage.get(this.INVOICES_KEY, []);
        if (userId) return invoices.filter(i => i.userId === userId);
        return invoices;
    },

    getInvoiceById(id) { return Storage.get(this.INVOICES_KEY, []).find(i => i.id === id); },

    markAsPaid(invoiceId, paymentMethod, paymentRef) {
        const invoices = Storage.get(this.INVOICES_KEY, []);
        const index = invoices.findIndex(i => i.id === invoiceId);
        if (index === -1) return null;
        
        invoices[index].status = 'paid';
        invoices[index].paymentMethod = paymentMethod;
        invoices[index].paymentRef = paymentRef;
        invoices[index].paidAt = new Date().toISOString();
        Storage.set(this.INVOICES_KEY, invoices);
        App.logAudit('invoice', `${invoices[index].invoiceNumber} marked as paid`);
        return invoices[index];
    },

    downloadInvoice(invoiceId) {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) { Notify.error('Invoice not found'); return; }
        
        const html = this.generateInvoiceHTML(invoice);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${invoice.invoiceNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Notify.success('Invoice downloaded! Open and Print to save as PDF.');
    },

    downloadInvoicePDF(invoiceId) {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) { Notify.error('Invoice not found'); return; }
        
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(this.generateInvoiceHTML(invoice));
        printWindow.document.close();
        
        printWindow.onload = function() {
            printWindow.print();
            Notify.success('PDF print dialog opened. Save as PDF to download.');
        };
    },

    printInvoice(invoiceId) {
        this.downloadInvoicePDF(invoiceId);
    },

    generateInvoiceHTML(invoice) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoiceNumber} - RASAAI</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;padding:30px;max-width:800px;margin:0 auto;color:#111}
        .header{display:flex;justify-content:space-between;margin-bottom:30px;padding-bottom:15px;border-bottom:3px solid #6C4DF6}
        .company-name{font-size:26px;font-weight:900;color:#6C4DF6}
        .company-details{font-size:12px;color:#666;margin-top:4px}
        .invoice-title{font-size:28px;font-weight:800;text-align:right}
        .invoice-number{font-size:13px;color:#666;text-align:right}
        .section{margin-bottom:25px}
        .section h4{font-size:13px;font-weight:700;text-transform:uppercase;color:#6C4DF6;margin-bottom:8px;letter-spacing:0.5px}
        .section p{font-size:13px;line-height:1.6}
        table{width:100%;border-collapse:collapse;margin:15px 0}
        th{background:#F5F5F5;padding:10px 12px;text-align:left;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #DDD}
        td{padding:10px 12px;border-bottom:1px solid #EEE;font-size:13px}
        .totals{text-align:right;margin-top:15px}
        .totals p{font-size:13px;line-height:2}
        .totals .grand{font-size:20px;font-weight:800;color:#6C4DF6;border-top:2px solid #6C4DF6;padding-top:8px;margin-top:8px}
        .footer{margin-top:30px;padding-top:15px;border-top:1px solid #DDD;font-size:11px;color:#999;text-align:center}
        .status{display:inline-block;padding:3px 14px;border-radius:12px;font-size:11px;font-weight:700;text-transform:uppercase}
        .status-paid{background:#D4EDDA;color:#155724}
        .status-pending{background:#FFF3CD;color:#856404}
        @media print{body{padding:15px}}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="company-name">RASAAI</div>
            <div class="company-details">Mumbra Rickshaw Advertising Network</div>
            <div class="company-details">hello@rasaai.com | +91 9594306625</div>
            <div class="company-details">Mumbra, Thane, Maharashtra - 400612</div>
            <div class="company-details">GST: 27AAAAA0000A1Z5</div>
        </div>
        <div>
            <div class="invoice-title">TAX INVOICE</div>
            <div class="invoice-number">${invoice.invoiceNumber}</div>
            <div style="margin-top:6px"><span class="status status-${invoice.status}">${invoice.status.toUpperCase()}</span></div>
        </div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:25px">
        <div class="section">
            <h4>Bill To</h4>
            <p><strong>${invoice.customerName}</strong></p>
            ${invoice.customerCompany ? `<p>${invoice.customerCompany}</p>` : ''}
            <p>${invoice.customerEmail || ''}</p>
            <p>${invoice.customerPhone || ''}</p>
            ${invoice.customerGST ? `<p>GST: ${invoice.customerGST}</p>` : ''}
        </div>
        <div class="section" style="text-align:right">
            <h4>Invoice Details</h4>
            <p>Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
            <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
            ${invoice.paidAt ? `<p>Paid On: ${new Date(invoice.paidAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>` : ''}
        </div>
    </div>
    <div class="section">
        <h4>Campaign Details</h4>
        <table>
            <thead><tr><th>Description</th><th>Zone</th><th>Type</th><th>Qty</th><th>Days</th><th>Rate/Day</th><th>Amount</th></tr></thead>
            <tbody>
                <tr>
                    <td>${invoice.campaignName}</td>
                    <td>${invoice.zone}</td>
                    <td>${invoice.campaignType?.toUpperCase()}</td>
                    <td>${invoice.quantity} Rickshaws</td>
                    <td>${invoice.days}</td>
                    <td>₹${Math.round(invoice.subtotal / (invoice.quantity * invoice.days))}</td>
                    <td>₹${invoice.subtotal.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="totals">
        <p>Subtotal: ₹${invoice.subtotal.toLocaleString()}</p>
        <p>CGST (9%): ₹${Math.round(invoice.gst/2).toLocaleString()}</p>
        <p>SGST (9%): ₹${Math.round(invoice.gst/2).toLocaleString()}</p>
        <p>Total GST: ₹${invoice.gst.toLocaleString()}</p>
        <p class="grand">Total: ₹${invoice.total.toLocaleString()}</p>
    </div>
    <div class="footer">
        <p>Thank you for choosing RASAAI - Advertise on Moving Rickshaws!</p>
        <p>This is a computer-generated invoice. For queries: hello@rasaai.com | +91 9594306625</p>
    </div>
</body>
</html>`;
    }
};

// =====================================================
// 11. PAYMENT MANAGER
// =====================================================
const PaymentManager = {
    PAYMENTS_KEY: 'payments',

    init() {
        if (!Storage.get(this.PAYMENTS_KEY)) Storage.set(this.PAYMENTS_KEY, []);
    },

    createPayment(invoiceId, amount, method = 'upi') {
        const payments = Storage.get(this.PAYMENTS_KEY, []);
        const payment = {
            id: 'PAY' + Date.now().toString(36).toUpperCase(),
            invoiceId, amount, method,
            status: 'pending',
            createdAt: new Date().toISOString(),
            verifiedAt: null,
            transactionRef: null
        };
        payments.push(payment);
        Storage.set(this.PAYMENTS_KEY, payments);

        if (method === 'upi') {
            return { payment, upiDetails: this.generateUPIDetails(amount, payment.id) };
        }
        return { payment };
    },

    generateUPIDetails(amount, paymentId) {
        return {
            upiId: '9594306625@ybl',
            payeeName: 'RASAAI Outdoor Advertising',
            amount,
            transactionRef: paymentId,
            qrData: `upi://pay?pa=9594306625@ybl&pn=RASAAI%20Outdoor%20Advertising&am=${amount}&tr=${paymentId}&cu=INR`,
            phonepeLink: `phonepay://pay?pa=9594306625@ybl&pn=RASAAI&am=${amount}&tr=${paymentId}&cu=INR`
        };
    },

    verifyPayment(paymentId, transactionRef) {
        const payments = Storage.get(this.PAYMENTS_KEY, []);
        const index = payments.findIndex(p => p.id === paymentId);
        if (index === -1) return false;
        
        payments[index].status = 'verified';
        payments[index].verifiedAt = new Date().toISOString();
        payments[index].transactionRef = transactionRef;
        Storage.set(this.PAYMENTS_KEY, payments);
        
        InvoiceManager.markAsPaid(payments[index].invoiceId, 'upi', transactionRef);
        App.logAudit('payment', `Payment ${paymentId} verified`);
        return true;
    },

    approvePayment(paymentId) { return this.verifyPayment(paymentId, 'ADMIN_APPROVED_' + Date.now()); },

    rejectPayment(paymentId, reason = '') {
        const payments = Storage.get(this.PAYMENTS_KEY, []);
        const index = payments.findIndex(p => p.id === paymentId);
        if (index === -1) return false;
        
        payments[index].status = 'rejected';
        payments[index].rejectionReason = reason;
        Storage.set(this.PAYMENTS_KEY, payments);
        App.logAudit('payment', `Payment ${paymentId} rejected: ${reason}`);
        return true;
    },

    getPayments(filters = {}) {
        let payments = Storage.get(this.PAYMENTS_KEY, []);
        if (filters.status) payments = payments.filter(p => p.status === filters.status);
        if (filters.invoiceId) payments = payments.filter(p => p.invoiceId === filters.invoiceId);
        return payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getPendingCount() {
        return this.getPayments({ status: 'pending' }).length;
    }
};

// =====================================================
// 12. AUDIO AD ENGINE
// =====================================================
const AudioEngine = {
    currentZone: null,
    isPlaying: false,
    playbackLogs: [],
    audioSequence: 0,

    init() {
        this.playbackLogs = Storage.get('playbackLogs', []);
        if (App.state.currentUser?.role === 'driver' && App.state.isOnDuty) {
            this.startAudioCycle();
        }
    },

    startAudioCycle() {
        if (App.state.audioTimer) clearInterval(App.state.audioTimer);
        
        App.state.audioTimer = setInterval(() => {
            if (!App.state.isOnDuty) return;
            this.playAudioSequence();
        }, 15 * 60 * 1000);
        
        // Play first sequence after 5 seconds
        setTimeout(() => this.playAudioSequence(), 5000);
        console.log('[AUDIO] 15-min cycle started');
    },

    stopAudioCycle() {
        if (App.state.audioTimer) {
            clearInterval(App.state.audioTimer);
            App.state.audioTimer = null;
        }
        this.isPlaying = false;
        console.log('[AUDIO] Cycle stopped');
    },

    playAudioSequence() {
        if (!App.state.currentUser || !App.state.isOnDuty) return;
        
        this.audioSequence++;
        this.detectZone();
        this.playZoneAnnouncement();
        
        setTimeout(() => {
            this.playAdvertisement();
        }, 10000); // 10 sec after announcement
    },

    detectZone() {
        const zones = CampaignCalculator.getZones();
        const randomZone = zones[Math.floor(Math.random() * zones.length)];
        this.currentZone = randomZone;
        App.state.currentZone = randomZone;
        this.logPlayback('zone_detection', randomZone.id);
        return randomZone;
    },

    playZoneAnnouncement() {
        const zone = this.currentZone || this.detectZone();
        console.log(`[AUDIO] 📢 Zone: ${zone.name} | Pop: ${zone.population.toLocaleString()} | Traffic: ${zone.traffic.toLocaleString()}/day`);
        this.logPlayback('zone_announcement', zone.id);
        this.isPlaying = true;
        setTimeout(() => { this.isPlaying = false; }, 8000);
    },

    playAdvertisement() {
        const zone = this.currentZone || CampaignCalculator.getZones()[0];
        const campaigns = CampaignManager.getActiveCampaigns()
            .filter(c => c.zone === zone.id || c.type === 'audio' || c.type === 'combo');
        
        if (campaigns.length === 0) {
            console.log(`[AUDIO] 🔊 RASAAI promo in ${zone.name}`);
            this.logPlayback('promo', zone.id);
            return;
        }

        const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
        console.log(`[AUDIO] 🔊 Ad: ${campaign.name} | 60 sec | #${campaign.hashtag || 'N/A'}`);
        
        CampaignManager.logAudioPlay(campaign.id);
        this.logPlayback('advertisement', zone.id, campaign.id);
        
        // Simulate driver earnings
        if (App.state.currentUser?.role === 'driver') {
            const earnings = Storage.get('driverEarnings', 0);
            Storage.set('driverEarnings', parseInt(earnings) + 5);
        }
        
        this.isPlaying = true;
        setTimeout(() => { this.isPlaying = false; }, 60000);
    },

    logPlayback(type, zoneId, campaignId = null) {
        const log = {
            type, zoneId, campaignId,
            driverId: App.state.currentUser?.id,
            rickshawId: App.state.currentUser?.rickshawId,
            gps: { ...App.state.currentGPS },
            sequence: this.audioSequence,
            timestamp: new Date().toISOString()
        };
        this.playbackLogs.push(log);
        if (this.playbackLogs.length > 1000) this.playbackLogs = this.playbackLogs.slice(-1000);
        Storage.set('playbackLogs', this.playbackLogs);
    },

    getPlaybackStats(driverId) {
        const logs = this.playbackLogs;
        const filtered = driverId ? logs.filter(l => l.driverId === driverId) : logs;
        return {
            total: filtered.length,
            announcements: filtered.filter(l => l.type === 'zone_announcement').length,
            advertisements: filtered.filter(l => l.type === 'advertisement').length,
            promos: filtered.filter(l => l.type === 'promo').length,
            byZone: this.getPlaybackByZone(filtered)
        };
    },

    getPlaybackByZone(logs) {
        const stats = {};
        logs.forEach(log => {
            const zoneName = CampaignCalculator.getZoneById(log.zoneId)?.name || log.zoneId;
            if (!stats[zoneName]) stats[zoneName] = { announcements: 0, ads: 0, promos: 0 };
            if (log.type === 'zone_announcement') stats[zoneName].announcements++;
            if (log.type === 'advertisement') stats[zoneName].ads++;
            if (log.type === 'promo') stats[zoneName].promos++;
        });
        return stats;
    }
};

// =====================================================
// 13. GPS TRACKER
// =====================================================
const GPSTracker = {
    tracking: false,
    positions: [],
    watchId: null,

    init() {
        this.positions = Storage.get('gpsPositions', []);
        if (App.state.currentUser?.role === 'driver' && App.state.isOnDuty) {
            this.startTracking();
        }
    },

    startTracking() {
        if (this.tracking) return;
        this.tracking = true;
        
        // Simulate GPS movement through Mumbra
        App.state.gpsTimer = setInterval(() => {
            this.updatePosition();
        }, 30000);
        
        // Try real GPS if available
        if (navigator.geolocation) {
            this.watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    App.state.currentGPS = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        speed: pos.coords.speed || 0,
                        heading: pos.coords.heading || 0
                    };
                },
                (err) => { console.log('[GPS] Real GPS unavailable, using simulation'); },
                { enableHighAccuracy: true, maximumAge: 30000 }
            );
        }
        
        console.log('[GPS] Tracking started');
    },

    stopTracking() {
        this.tracking = false;
        if (App.state.gpsTimer) clearInterval(App.state.gpsTimer);
        if (this.watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        console.log('[GPS] Tracking stopped');
    },

    updatePosition() {
        // Simulate movement around Mumbra
        const lat = 19.1785 + (Math.random() - 0.5) * 0.03;
        const lng = 73.0925 + (Math.random() - 0.5) * 0.03;
        
        App.state.currentGPS = {
            lat: Math.round(lat * 1000000) / 1000000,
            lng: Math.round(lng * 1000000) / 1000000,
            speed: Math.floor(Math.random() * 40),
            heading: Math.floor(Math.random() * 360),
            accuracy: Math.floor(Math.random() * 10) + 5
        };
        
        const position = {
            ...App.state.currentGPS,
            timestamp: new Date().toISOString(),
            driverId: App.state.currentUser?.id,
            zoneId: this.detectCurrentZone().id
        };
        
        this.positions.push(position);
        if (this.positions.length > 5000) this.positions = this.positions.slice(-5000);
        Storage.set('gpsPositions', this.positions.slice(-100));
        
        document.dispatchEvent(new CustomEvent('gpsUpdated', { detail: position }));
    },

    detectCurrentZone() {
        const zones = CampaignCalculator.getZones();
        return zones[Math.floor(Math.random() * zones.length)];
    },

    getCurrentPosition() {
        return App.state.currentGPS;
    },

    getPositionHistory(minutes = 60) {
        const cutoff = Date.now() - minutes * 60 * 1000;
        return this.positions.filter(p => new Date(p.timestamp).getTime() > cutoff);
    },

    getDistanceTraveled(driverId, date) {
        const positions = this.positions.filter(p => {
            if (driverId && p.driverId !== driverId) return false;
            if (date && new Date(p.timestamp).toDateString() !== new Date(date).toDateString()) return false;
            return true;
        });
        
        let distance = 0;
        for (let i = 1; i < positions.length; i++) {
            distance += this.calculateDistance(
                positions[i-1].lat, positions[i-1].lng,
                positions[i].lat, positions[i].lng
            );
        }
        return Math.round(distance * 100) / 100;
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    },

    getRouteForMap() {
        return this.positions.slice(-50).map(p => ({ lat: p.lat, lng: p.lng }));
    }
};

// =====================================================
// CONTINUED IN PART 3...
// =====================================================

console.log('📦 RASAAI app.js Part 2 loaded');
console.log('✅ Modules: Inventory, CampaignManager, AffiliateManager, CRMManager, InvoiceManager, PaymentManager, AudioEngine, GPSTracker');
/* =====================================================
   FILE: app.js (PART 3 OF 3)
   PATH: rizvi.store/rasaai/app.js
   CONTINUATION FROM PART 2
   Modules: Notify, Dashboard, Analytics, Search, Init
   ===================================================== */

// =====================================================
// 14. NOTIFICATION MANAGER
// =====================================================
const Notify = {
    show(message, type = 'info', duration = 4000) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }
        
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const icon = icons[type] || icons.info;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close" onclick="this.closest('.notification').remove()">✕</button>
        `;
        
        container.appendChild(notification);
        
        const timer = setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        notification._timer = timer;
        return notification;
    },

    success(message, duration) { return this.show(message, 'success', duration); },
    error(message, duration) { return this.show(message, 'error', duration || 6000); },
    warning(message, duration) { return this.show(message, 'warning', duration || 5000); },
    info(message, duration) { return this.show(message, 'info', duration); },

    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'modal active';
        overlay.style.cssText = 'display:flex;align-items:center;justify-content:center;';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width:400px;text-align:center;border-radius:24px;transform:translateY(0) scale(1)">
                <p style="font-size:18px;margin-bottom:24px;font-weight:600">${message}</p>
                <div style="display:flex;gap:12px;justify-content:center">
                    <button class="btn btn-primary" id="confirm-yes">Yes</button>
                    <button class="btn btn-outline" id="confirm-no">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        overlay.querySelector('#confirm-yes').addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });
        
        overlay.querySelector('#confirm-no').addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }
};

// =====================================================
// 15. DASHBOARD RENDERER (All 5 Roles)
// =====================================================
const Dashboard = {
    user: null,
    currentSection: 'overview',

    render(user) {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        this.user = user;
        
        // Check role-based access
        const path = window.location.pathname;
        if (path.includes('admin.html') && user.role !== 'admin') { window.location.href = 'dashboard.html'; return; }
        if (path.includes('driver.html') && user.role !== 'driver' && user.role !== 'admin') { window.location.href = 'dashboard.html'; return; }
        
        // Update all user display elements
        document.querySelectorAll('#user-name-display, .user-name-display').forEach(el => el.textContent = user.name);
        document.querySelectorAll('#user-role-display, .user-role-display').forEach(el => el.textContent = user.role);
        document.querySelectorAll('#user-avatar-initial, .user-avatar-initial').forEach(el => el.textContent = (user.name || 'U').charAt(0).toUpperCase());
        
        // Render based on current page
        if (path.includes('admin.html')) this.renderAdminDashboard();
        else if (path.includes('client.html')) this.renderClientDashboard();
        else if (path.includes('driver.html')) this.renderDriverDashboard();
        else if (path.includes('affiliate.html')) this.renderAffiliateDashboard();
        else if (path.includes('crm.html')) this.renderCRMDashboard();
        else this.renderRoleDashboard();
    },

    renderRoleDashboard() {
        switch (this.user.role) {
            case 'admin': this.renderAdminDashboard(); break;
            case 'client': this.renderClientDashboard(); break;
            case 'driver': this.renderDriverDashboard(); break;
            case 'affiliate': this.renderAffiliateDashboard(); break;
            case 'sales': this.renderCRMDashboard(); break;
            default: this.renderClientDashboard();
        }
    },

    // ==================== ADMIN DASHBOARD ====================
    renderAdminDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('.admin-main') || document.querySelector('main');
        if (!main) return;
        
        const stats = CampaignManager.getStats();
        const invStats = Inventory.getStats();
        const users = Auth.getAllUsers();
        const invoices = InvoiceManager.getInvoices();
        const revenue = invoices.reduce((s, i) => s + (i.total || 0), 0);
        const pendingPayments = PaymentManager.getPendingCount();
        const campaigns = CampaignManager.getCampaigns();
        
        main.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px">
                <div>
                    <h2 style="font-size:28px;font-weight:800;margin:0">👑 Admin Dashboard</h2>
                    <p class="text-muted">Welcome, ${this.user.name} | <span class="xp-display">Lv.${App.state.level} | ${App.state.xpPoints} XP</span></p>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button class="btn btn-primary btn-sm" onclick="Dashboard.showAddUserModal()">+ User</button>
                    <button class="btn btn-outline btn-sm" onclick="Analytics.exportCSV()">📥 Export</button>
                    <button class="btn btn-outline btn-sm" onclick="Storage.exportAll(); Notify.success('Data exported! Check console.')">💾 Backup</button>
                </div>
            </div>
            
            <div class="widget-grid">
                <div class="widget" onclick="Dashboard.loadSection('campaigns')"><div class="widget-icon">📢</div><div class="widget-value">${stats.total}</div><div class="widget-title">Total Campaigns</div><div class="widget-trend up">${stats.active} Active</div></div>
                <div class="widget widget-accent"><div class="widget-icon">💰</div><div class="widget-value">₹${revenue.toLocaleString()}</div><div class="widget-title">Total Revenue</div><div class="widget-trend">+18.5%</div></div>
                <div class="widget" onclick="Dashboard.loadSection('users')"><div class="widget-icon">👥</div><div class="widget-value">${users.length}</div><div class="widget-title">Total Users</div><div class="widget-trend up">All Roles</div></div>
                <div class="widget"><div class="widget-icon">🛺</div><div class="widget-value">${invStats.available}</div><div class="widget-title">Available Rickshaws</div><div class="widget-trend">${invStats.booked} Booked</div></div>
                <div class="widget"><div class="widget-icon">💳</div><div class="widget-value">${pendingPayments}</div><div class="widget-title">Pending Payments</div><div class="widget-trend ${pendingPayments > 0 ? 'down' : 'up'}">${pendingPayments > 0 ? 'Needs Action' : 'All Clear'}</div></div>
                <div class="widget"><div class="widget-icon">📝</div><div class="widget-value">${App.state.auditLogs.length}</div><div class="widget-title">Audit Logs</div><div class="widget-trend up">Tracking</div></div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
                <div class="chart-container"><h4 style="margin-bottom:12px">📈 Revenue Trend</h4><canvas id="admin-revenue-chart" height="250"></canvas></div>
                <div class="chart-container"><h4 style="margin-bottom:12px">📊 Campaigns by Zone</h4><canvas id="admin-zone-chart" height="250"></canvas></div>
            </div>
            
            <div class="data-table-container">
                <h4 class="p-6">📋 Recent Campaigns</h4>
                <div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Campaign</th><th>Client</th><th>Zone</th><th>Type</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${campaigns.slice(-10).reverse().map(c => `
                    <tr><td><strong>${c.name}</strong></td><td>${c.userName||'N/A'}</td><td>${c.zoneName}</td><td style="text-transform:uppercase">${c.type}</td><td>₹${(c.cost||0).toLocaleString()}</td><td><span class="status-badge status-${c.status}">${c.status}</span></td><td><button class="btn btn-outline btn-sm" onclick="Dashboard.editCampaign('${c.id}')">✏️</button> <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteCampaignConfirm('${c.id}')">🗑️</button></td></tr>
                `).join('')||'<tr><td colspan="7" class="text-center p-4">No campaigns</td></tr>'}</tbody></table></div>
            </div>
        `;
        
        setTimeout(() => this.drawAdminCharts(), 200);
    },

    // ==================== CLIENT DASHBOARD ====================
    renderClientDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('.client-main') || document.querySelector('main');
        if (!main) return;
        
        const stats = CampaignManager.getStats(this.user.id);
        const campaigns = CampaignManager.getCampaigns(this.user.id);
        const invoices = InvoiceManager.getInvoices(this.user.id);
        
        main.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px">
                <div>
                    <h2 style="font-size:28px;font-weight:800;margin:0">📊 My Dashboard</h2>
                    <p class="text-muted">Welcome, ${this.user.name} | <span class="xp-display">Lv.${App.state.level} | ${App.state.xpPoints} XP</span> | <span class="streak-display">🔥 ${App.state.streak} day streak</span></p>
                </div>
                <a href="campaign.html" class="btn btn-primary btn-lg">+ New Campaign</a>
            </div>
            
            <div class="widget-grid">
                <div class="widget" onclick="window.location.href='campaign.html'"><div class="widget-icon">📢</div><div class="widget-value">${stats.active}</div><div class="widget-title">Active Campaigns</div><div class="widget-trend up">Running</div></div>
                <div class="widget"><div class="widget-icon">👁️</div><div class="widget-value">${stats.totalImpressions.toLocaleString()}</div><div class="widget-title">Total Impressions</div><div class="widget-trend up">+12.5%</div></div>
                <div class="widget widget-accent"><div class="widget-icon">💰</div><div class="widget-value">₹${stats.totalCost.toLocaleString()}</div><div class="widget-title">Total Investment</div><div class="widget-trend">${stats.total} campaigns</div></div>
                <div class="widget"><div class="widget-icon">🧾</div><div class="widget-value">${invoices.length}</div><div class="widget-title">Invoices</div><div class="widget-trend ${invoices.filter(i=>i.status==='pending').length>0?'down':'up'}">${invoices.filter(i=>i.status==='pending').length} pending</div></div>
            </div>
            
            ${campaigns.length === 0 ? `
                <div class="empty-state">
                    <span class="empty-icon">📢</span>
                    <h3>No Campaigns Yet!</h3>
                    <p>Start your first rickshaw advertising campaign and reach thousands of commuters across Mumbra.</p>
                    <a href="campaign.html" class="btn btn-primary btn-lg">🚀 Book Your First Campaign</a>
                </div>
            ` : `
                <div class="data-table-container">
                    <h4 class="p-6">📋 My Campaigns</h4>
                    <div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Campaign</th><th>Zone</th><th>Type</th><th>Qty</th><th>Days</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>${campaigns.reverse().map(c => `
                        <tr><td><strong>${c.name}</strong>${c.hashtag?`<br><small style="color:var(--primary)">#${c.hashtag}</small>`:''}</td><td>${c.zoneName}</td><td style="text-transform:uppercase">${c.type}</td><td>${c.quantity}</td><td>${c.days}</td><td><strong>₹${(c.cost||0).toLocaleString()}</strong></td><td><span class="status-badge status-${c.status}">${c.status}</span></td><td><button class="btn btn-outline btn-sm" onclick="Dashboard.viewCampaignDetails('${c.id}')">📋</button> ${c.status==='active'?`<button class="btn btn-warning btn-sm" onclick="Dashboard.pauseCampaign('${c.id}')">⏸</button>`:''}</td></tr>
                    `).join('')}</tbody></table></div>
                </div>
            `}
            
            <!-- Social Media Creatives Bonus -->
            <div class="bonus-creatives-card">
                <h2>🎁 FREE Bonus With LED Campaign!</h2>
                <p>Book any LED campaign and get <strong>30 Social Media Creatives</strong> absolutely FREE!</p>
                <div class="bonus-icons">
                    <div class="bonus-icon-item"><span class="platform-icon">📸</span><span class="platform-name">Instagram</span></div>
                    <div class="bonus-icon-item"><span class="platform-icon">💬</span><span class="platform-name">WhatsApp</span></div>
                    <div class="bonus-icon-item"><span class="platform-icon">👍</span><span class="platform-name">Facebook</span></div>
                    <div class="bonus-icon-item"><span class="platform-icon">📖</span><span class="platform-name">Story</span></div>
                    <div class="bonus-icon-item"><span class="platform-icon">🎠</span><span class="platform-name">Carousel</span></div>
                    <div class="bonus-icon-item"><span class="platform-icon">🎥</span><span class="platform-name">Reels</span></div>
                </div>
                <p>Perfect for Instagram posts, WhatsApp forwards, Facebook ads, Stories, Carousels & more!</p>
                <a href="campaign.html?type=led" class="btn">🎯 Book LED Campaign & Claim Bonus</a>
            </div>
        `;
    },

    // ==================== DRIVER DASHBOARD ====================
    renderDriverDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('.driver-main') || document.querySelector('main');
        if (!main) return;
        
        const tasks = CRMManager.getTasks(this.user.id);
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const earnings = Storage.get('driverEarnings', 0);
        const distance = GPSTracker.getDistanceTraveled(this.user.id, new Date().toDateString());
        const attendance = Storage.get('attendance', []);
        const todayMarked = attendance.find(a => a.date === new Date().toDateString());
        
        main.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px">
                <div>
                    <h2 style="font-size:28px;font-weight:800;margin:0">🛺 Driver Dashboard</h2>
                    <p class="text-muted">${this.user.name} | Rickshaw: ${this.user.rickshawId||'N/A'} | Zone: ${this.user.zone||'N/A'}</p>
                </div>
                <span style="padding:8px 20px;border-radius:20px;font-weight:600;font-size:14px" id="duty-badge">${App.state.isOnDuty ? '🟢 On Duty' : '⚪ Offline'}</span>
            </div>
            
            <div class="status-card" style="text-align:center;margin-bottom:24px">
                <h3 style="margin-bottom:16px"><span class="status-indicator ${App.state.isOnDuty?'online':'offline'}"></span> ${App.state.isOnDuty ? 'You are ON DUTY' : 'You are OFFLINE'}</h3>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                    ${!App.state.isOnDuty ? `
                        <button class="btn btn-success btn-lg" onclick="DriverPage.startDuty()">▶ Start Duty</button>
                    ` : `
                        <button class="btn btn-warning btn-lg" onclick="DriverPage.pauseDuty()">⏸ Pause</button>
                        <button class="btn btn-danger btn-lg" onclick="DriverPage.endDuty()">⏹ End Duty</button>
                    `}
                </div>
            </div>
            
            <div class="widget-grid">
                <div class="widget"><div class="widget-icon">📋</div><div class="widget-value">${pendingTasks.length}</div><div class="widget-title">Pending Tasks</div></div>
                <div class="widget"><div class="widget-icon">✅</div><div class="widget-value">${completedTasks.length}</div><div class="widget-title">Completed</div></div>
                <div class="widget widget-accent"><div class="widget-icon">💰</div><div class="widget-value">₹${earnings.toLocaleString()}</div><div class="widget-title">Today's Earnings</div></div>
                <div class="widget"><div class="widget-icon">🛣️</div><div class="widget-value">${distance} km</div><div class="widget-title">Distance Today</div></div>
            </div>
            
            <h4 class="mb-4">📋 Pending Tasks (${pendingTasks.length})</h4>
            ${pendingTasks.length === 0 ? '<p class="text-muted p-4">✅ All tasks completed! Great job!</p>' : pendingTasks.map(t => `
                <div class="task-card">
                    <div style="flex:1"><strong>${t.title}</strong>${t.notes?`<p class="text-muted" style="font-size:12px">${t.notes}</p>`:''}<p class="text-muted" style="font-size:11px">Due: ${t.dueDate} | Priority: ${t.priority}</p></div>
                    <button class="btn btn-primary btn-sm" onclick="CRMManager.completeTask('${t.id}'); Notify.success('Task completed! +₹50'); setTimeout(()=>location.reload(),500)">✓ Complete</button>
                </div>
            `).join('')}
            
            <div class="upload-zone mt-6" style="cursor:pointer" onclick="document.getElementById('file-upload').click()">
                <span class="upload-icon">📁</span>
                <h4>Upload Campaign Proof</h4>
                <p>JPG, PNG, WEBP, PDF, MP3, WAV (Max 10MB)</p>
                <input type="file" id="file-upload" accept="image/*,audio/*,.pdf" style="display:none" onchange="DriverPage.handleUpload(this)" multiple>
            </div>
        `;
    },

    // ==================== AFFILIATE DASHBOARD ====================
    renderAffiliateDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('.aff-main') || document.querySelector('main');
        if (!main) return;
        
        const commission = AffiliateManager.getCommission(this.user.id);
        const stats = AffiliateManager.getReferralStats(this.user.id);
        const link = AffiliateManager.generateReferralLink(this.user.id);
        const leaderboard = AffiliateManager.getLeaderboard(10);
        const withdrawals = AffiliateManager.getWithdrawalHistory(this.user.id);
        
        main.innerHTML = `
            <h2 style="font-size:28px;font-weight:800;margin-bottom:24px">🔗 Affiliate Dashboard</h2>
            
            <div class="wallet-banner">
                <h3>Available Balance</h3>
                <div class="amount">₹${commission.toLocaleString()}</div>
                <p style="opacity:0.8">+₹${AffiliateManager.getPendingCommission(this.user.id).toLocaleString()} pending</p>
                <button class="btn btn-outline mt-4" style="color:#FFF;border-color:#FFF" onclick="Dashboard.requestWithdrawal()">💸 Withdraw</button>
            </div>
            
            <div class="widget-grid">
                <div class="widget"><div class="widget-icon">🔗</div><div class="widget-value">${stats.clicks.toLocaleString()}</div><div class="widget-title">Clicks</div></div>
                <div class="widget"><div class="widget-icon">👤</div><div class="widget-value">${stats.leads.toLocaleString()}</div><div class="widget-title">Leads</div></div>
                <div class="widget"><div class="widget-icon">✅</div><div class="widget-value">${stats.conversions.toLocaleString()}</div><div class="widget-title">Conversions</div></div>
                <div class="widget widget-accent"><div class="widget-icon">💰</div><div class="widget-value">₹${(stats.totalEarned||0).toLocaleString()}</div><div class="widget-title">Total Earned</div></div>
            </div>
            
            <div class="glass-card mb-6">
                <h4>🔗 Your Referral Link</h4>
                <div style="display:flex;gap:8px;margin-top:12px">
                    <input type="text" value="${link}" readonly style="flex:1;font-family:monospace;font-size:13px" id="ref-link">
                    <button class="btn btn-primary btn-sm" onclick="navigator.clipboard.writeText('${link}'); Notify.success('Copied!')">📋</button>
                </div>
                <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                    <button class="btn btn-outline btn-sm" onclick="window.open('https://wa.me/919594306625?text='+encodeURIComponent('Join RASAAI: '+document.getElementById('ref-link').value),'_blank')">💬 WhatsApp</button>
                    <button class="btn btn-outline btn-sm" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('Advertise on rickshaws! '+document.getElementById('ref-link').value),'_blank')">🐦 Tweet</button>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
                <div class="data-card"><h4>🏆 Leaderboard</h4>${leaderboard.map((l,i)=>`<div class="leaderboard-item"><span class="leaderboard-rank ${i<3?'top-'+(i+1):''}">${i+1}</span><span style="flex:1">${l.name}</span><strong>₹${l.total.toLocaleString()}</strong></div>`).join('')}</div>
                <div class="data-card"><h4>💸 Recent Withdrawals</h4>${withdrawals.length===0?'<p class="text-muted">No withdrawals yet</p>':withdrawals.slice(0,5).map(w=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>₹${w.amount.toLocaleString()}</span><span class="status-badge status-${w.status}">${w.status}</span></div>`).join('')}</div>
            </div>
        `;
    },

    // ==================== CRM/SALES DASHBOARD ====================
    renderCRMDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('.crm-main') || document.querySelector('main');
        if (!main) return;
        
        const pipelineStats = CRMManager.getPipelineStats();
        const myLeads = CRMManager.getAllLeads({ assignedTo: this.user.id });
        const myTasks = CRMManager.getTasks(this.user.id);
        const conversionRate = CRMManager.getConversionRate(this.user.id);
        
        main.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px">
                <h2 style="font-size:28px;font-weight:800;margin:0">🎯 CRM Dashboard</h2>
                <div style="display:flex;gap:8px"><button class="btn btn-primary btn-sm" onclick="Dashboard.showNewLeadModal()">+ Lead</button><button class="btn btn-outline btn-sm" onclick="Dashboard.showNewTaskModal()">+ Task</button></div>
            </div>
            
            <div class="widget-grid">
                <div class="widget"><div class="widget-icon">👥</div><div class="widget-value">${pipelineStats.total}</div><div class="widget-title">Total Leads</div></div>
                <div class="widget"><div class="widget-icon">✅</div><div class="widget-value">${pipelineStats.Won?.length||0}</div><div class="widget-title">Won</div></div>
                <div class="widget widget-accent"><div class="widget-icon">📊</div><div class="widget-value">${conversionRate}%</div><div class="widget-title">Conversion Rate</div></div>
                <div class="widget"><div class="widget-icon">💰</div><div class="widget-value">₹${(pipelineStats.totalValue||0).toLocaleString()}</div><div class="widget-title">Pipeline Value</div></div>
            </div>
            
            <h4 class="mb-4">📊 Pipeline</h4>
            <div class="pipeline-container">
                ${CRMManager.STATUSES.map(status => `
                    <div class="pipeline-stage">
                        <div class="pipeline-stage-header"><h4>${status}</h4><span class="pipeline-stage-count">${(pipelineStats[status]||[]).length}</span></div>
                        ${(pipelineStats[status]||[]).slice(0,8).map(lead => `
                            <div class="lead-card" onclick="Dashboard.viewLead('${lead.id}')"><strong>${lead.name}</strong><p>${lead.company||'N/A'} ${lead.value?`· ₹${lead.value.toLocaleString()}`:''}</p><p style="font-size:10px">Score: ${lead.score||0}</p></div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <h4 class="mb-4 mt-6">📋 My Tasks</h4>
            ${myTasks.filter(t=>t.status==='pending').map(t => `
                <div class="task-card"><div style="flex:1"><strong>${t.title}</strong><p class="text-muted" style="font-size:12px">Due: ${t.dueDate} | ${t.priority}</p></div><button class="btn btn-primary btn-sm" onclick="CRMManager.completeTask('${t.id}'); Notify.success('Done!'); setTimeout(()=>location.reload(),500)">✓</button></div>
            `).join('')||'<p class="text-muted">No pending tasks</p>'}
        `;
    },

    // ==================== HELPER ACTIONS ====================
    drawAdminCharts() {
        const revCanvas = document.getElementById('admin-revenue-chart');
        const zoneCanvas = document.getElementById('admin-zone-chart');
        
        if (revCanvas) {
            const ctx = revCanvas.getContext('2d');
            const labels = ['Jan','Feb','Mar','Apr','May','Jun'];
            const values = labels.map(() => Math.floor(Math.random()*400000)+100000);
            this.drawLineChart(ctx, revCanvas.width || 500, 250, labels, values);
        }
        if (zoneCanvas) {
            const ctx = zoneCanvas.getContext('2d');
            const zones = CampaignCalculator.getZones().slice(0, 8);
            this.drawBarChart(ctx, zoneCanvas.width || 500, 250, zones.map(z=>z.name.split(' ')[0]), zones.map(()=>Math.floor(Math.random()*20)+3));
        }
    },

    drawLineChart(ctx, width, height, labels, values) {
        const pad = 40;
        const max = Math.max(...values, 1);
        const stepX = (width - 2*pad) / (values.length - 1 || 1);
        
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = '#E5E7EB'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad + (height-2*pad)*(i/4);
            ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(width-pad, y); ctx.stroke();
            ctx.fillStyle = '#6B7280'; ctx.font = '10px Inter';
            ctx.fillText('₹'+Math.round((max-(max*i/4))/1000)+'K', 5, y+4);
        }
        
        ctx.strokeStyle = '#6C4DF6'; ctx.lineWidth = 3; ctx.beginPath();
        values.forEach((v, i) => {
            const x = pad + i*stepX, y = pad + (height-2*pad)*(1-v/max);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        values.forEach((v, i) => {
            const x = pad + i*stepX, y = pad + (height-2*pad)*(1-v/max);
            ctx.fillStyle = '#6C4DF6'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#6B7280'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
            ctx.fillText(labels[i], x, height-10);
        });
    },

    drawBarChart(ctx, width, height, labels, values) {
        const pad = 40;
        const max = Math.max(...values, 1);
        const gap = (width - 2*pad) / values.length;
        const barW = gap * 0.6;
        
        ctx.clearRect(0, 0, width, height);
        
        values.forEach((v, i) => {
            const barH = (height-2*pad)*(v/max);
            const x = pad + i*gap + (gap-barW)/2;
            const y = height - pad - barH;
            const grad = ctx.createLinearGradient(x, y, x, height-pad);
            grad.addColorStop(0, '#6C4DF6'); grad.addColorStop(1, '#00D4FF');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barW, barH);
            ctx.fillStyle = '#6B7280'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
            ctx.fillText(labels[i], x+barW/2, height-10);
            ctx.fillText(v, x+barW/2, y-6);
        });
    },

    showAddUserModal() { Notify.info('User creation form: Use register.html or Admin panel'); },
    
    editCampaign(id) {
        const c = CampaignManager.getCampaignById(id);
        if (!c) return;
        const newStatus = prompt('New status (active/paused/completed):', c.status);
        if (newStatus && ['active','paused','completed'].includes(newStatus)) {
            CampaignManager.updateCampaign(id, { status: newStatus });
            Notify.success('Campaign updated!');
            location.reload();
        }
    },

    deleteCampaignConfirm(id) {
        Notify.confirm('Delete this campaign permanently?', () => {
            CampaignManager.deleteCampaign(id);
            Notify.success('Deleted!');
            location.reload();
        });
    },

    viewCampaignDetails(id) {
        const c = CampaignManager.getCampaignById(id);
        if (c) Notify.info(`${c.name}: ${c.zoneName} | ${c.type} | ${c.quantity} rickshaws | ${c.days} days | ₹${(c.cost||0).toLocaleString()}`);
    },

    pauseCampaign(id) {
        CampaignManager.updateCampaign(id, { status: 'paused' });
        Notify.success('Campaign paused');
        location.reload();
    },

    showNewLeadModal() {
        const name = prompt('Lead Name:');
        if (!name) return;
        CRMManager.createLead({ name, phone: prompt('Phone:')||'', company: prompt('Company:')||'', assignedTo: this.user?.id, value: parseInt(prompt('Value (₹):','0'))||0 });
        Notify.success('Lead created!');
        location.reload();
    },

    showNewTaskModal() {
        const title = prompt('Task Title:');
        if (!title) return;
        CRMManager.createTask({ title, dueDate: prompt('Due Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]), assignedTo: this.user?.id });
        Notify.success('Task created!');
        location.reload();
    },

    viewLead(id) {
        const l = CRMManager.getAllLeads().find(x => x.id === id);
        if (l) Notify.info(`${l.name} | ${l.status} | Score: ${l.score} | ₹${(l.value||0).toLocaleString()}`);
    },

    requestWithdrawal() {
        const amount = prompt('Enter amount (min ₹500):');
        if (!amount) return;
        const r = AffiliateManager.requestWithdrawal(this.user?.id, parseInt(amount));
        r.success ? Notify.success('Withdrawal requested!') : Notify.error(r.message);
    }
};

// =====================================================
// 16. ANALYTICS ENGINE
// =====================================================
const Analytics = {
    generateZoneData() {
        return CampaignCalculator.getZones().map(zone => ({
            name: zone.name,
            icon: zone.icon,
            population: zone.population,
            traffic: zone.traffic,
            impressions: zone.impressions,
            peakHours: zone.peakHours,
            businessDensity: zone.businessDensity,
            campaigns: CampaignManager.getCampaigns().filter(c => c.zone === zone.id).length,
            activeCampaigns: CampaignManager.getActiveCampaigns().filter(c => c.zone === zone.id).length,
            available: Inventory.getAvailable(zone.id),
            total: Inventory.getTotal(zone.id),
            utilization: Inventory.getUtilizationRate(zone.id)
        }));
    },

    getTotals() {
        const zones = this.generateZoneData();
        const invoices = InvoiceManager.getInvoices();
        return {
            totalZones: zones.length,
            totalPopulation: zones.reduce((s,z) => s + z.population, 0),
            totalTraffic: zones.reduce((s,z) => s + z.traffic, 0),
            totalImpressions: zones.reduce((s,z) => s + z.impressions, 0),
            totalCampaigns: zones.reduce((s,z) => s + z.campaigns, 0),
            totalActiveCampaigns: zones.reduce((s,z) => s + z.activeCampaigns, 0),
            totalRickshaws: Inventory.getStats().total,
            availableRickshaws: Inventory.getStats().available,
            bookedRickshaws: Inventory.getStats().booked,
            totalRevenue: invoices.reduce((s,i) => s + (i.total||0), 0),
            paidInvoices: invoices.filter(i => i.status === 'paid').length,
            pendingInvoices: invoices.filter(i => i.status === 'pending').length
        };
    },

    exportCSV() {
        const data = this.generateZoneData();
        let csv = 'Zone,Population,Daily Traffic,Daily Impressions,Peak Hours,Campaigns,Active,Available Rickshaws,Utilization %\n';
        data.forEach(z => csv += `"${z.name}",${z.population},${z.traffic},${z.impressions},"${z.peakHours}",${z.campaigns},${z.activeCampaigns},${z.available}/${z.total},${z.utilization}%\n`);
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rasaai-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Notify.success('CSV exported!');
    },

    exportPDF() {
        Notify.info('Opening print dialog for PDF export...');
        setTimeout(() => window.print(), 500);
    }
};

// =====================================================
// 17. SEARCH ENGINE
// =====================================================
const Search = {
    search(query) {
        const q = query.toLowerCase().trim();
        if (q.length < 2) return [];
        
        const results = [];
        
        CampaignManager.getCampaigns().forEach(c => {
            if (c.name?.toLowerCase().includes(q) || c.zoneName?.toLowerCase().includes(q) || c.hashtag?.toLowerCase().includes(q))
                results.push({ type: 'campaign', id: c.id, title: c.name, subtitle: `${c.zoneName} | ${c.type}`, url: `campaign.html?id=${c.id}` });
        });
        
        CRMManager.getAllLeads().forEach(l => {
            if (l.name?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q))
                results.push({ type: 'lead', id: l.id, title: l.name, subtitle: l.company, url: `crm.html` });
        });
        
        CampaignCalculator.getZones().forEach(z => {
            if (z.name.toLowerCase().includes(q))
                results.push({ type: 'zone', id: z.id, title: z.name, subtitle: `Pop: ${z.population.toLocaleString()}`, url: 'index.html#zones' });
        });
        
        InvoiceManager.getInvoices().forEach(i => {
            if (i.invoiceNumber?.toLowerCase().includes(q) || i.customerName?.toLowerCase().includes(q))
                results.push({ type: 'invoice', id: i.id, title: i.invoiceNumber, subtitle: `₹${i.total.toLocaleString()}`, url: `invoice.html?id=${i.id}` });
        });
        
        return results.slice(0, 20);
    }
};

// =====================================================
// 18. GLOBAL INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    Storage.init();
    Auth.init();
    Inventory.init();
    CampaignManager.init();
    CRMManager.init();
    InvoiceManager.init();
    PaymentManager.init();
    AffiliateManager.init();
    
    // Initialize App
    App.init();
    
    // Page-specific initialization
    const path = window.location.pathname;
    
    // Landing page
    if (document.querySelector('.pricing-card') || path.includes('index.html') || path === '/rasaai/' || path === '/rasaai') {
        PricingEngine.init();
        CampaignCalculator.init();
    }
    
    // Calculator page
    if (document.getElementById('campaign-calculator')) {
        CampaignCalculator.init();
        PricingEngine.init();
    }
    
    // Dashboard pages
    const user = Auth.getCurrentUser();
    if (user) {
        if (document.querySelector('.dashboard-main') || document.querySelector('.admin-main') || 
            document.querySelector('.client-main') || document.querySelector('.driver-main') ||
            document.querySelector('.aff-main') || document.querySelector('.crm-main') ||
            path.includes('dashboard') || path.includes('admin') || path.includes('client') || 
            path.includes('driver') || path.includes('affiliate') || path.includes('crm')) {
            Dashboard.render(user);
        }
        
        // Driver page - start GPS & Audio
        if (user.role === 'driver' && App.state.isOnDuty) {
            GPSTracker.init();
            AudioEngine.init();
        }
    }
    
    // Global search
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('input', () => {
            const results = Search.search(globalSearch.value);
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = results.length === 0 ? '<div class="p-4 text-muted">No results</div>' :
                    results.map(r => `<div style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border)" onclick="window.location.href='${r.url}'"><span style="background:var(--primary);color:#FFF;padding:2px 8px;border-radius:10px;font-size:10px;margin-right:8px">${r.type}</span><strong>${r.title}</strong><p style="font-size:12px;color:var(--text-secondary);margin-top:2px">${r.subtitle}</p></div>`).join('');
                resultsDiv.style.display = 'block';
            }
        });
        globalSearch.addEventListener('blur', () => setTimeout(() => { const d = document.getElementById('search-results'); if(d) d.style.display = 'none'; }, 200));
    }
    
    // Handle referral codes
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        AffiliateManager.trackClick(refCode);
        Storage.set('referralCode', refCode);
    }
    
    // Campaign pre-fill from URL
    const bookZone = urlParams.get('zone');
    const bookType = urlParams.get('type');
    if ((bookZone || bookType) && document.getElementById('calc-zone')) {
        if (bookZone) document.getElementById('calc-zone').value = bookZone;
        if (bookType) document.getElementById('calc-type').value = bookType;
        if (CampaignCalculator.updateCalculation) CampaignCalculator.updateCalculation();
    }
    
    console.log('🛺 RASAAI Platform v3.0 - All Systems Ready');
    console.log('👤 User:', user ? `${user.name} (${user.role})` : 'Guest');
    console.log('📱 Mobile App UI | 🎮 Gamification | 📊 Analytics | 💾 Offline Ready');
});

// =====================================================
// 19. EXPORT ALL MODULES GLOBALLY
// =====================================================
window.App = App;
window.Storage = Storage;
window.Auth = Auth;
window.PricingEngine = PricingEngine;
window.CampaignCalculator = CampaignCalculator;
window.Inventory = Inventory;
window.CampaignManager = CampaignManager;
window.AffiliateManager = AffiliateManager;
window.CRMManager = CRMManager;
window.InvoiceManager = InvoiceManager;
window.PaymentManager = PaymentManager;
window.AudioEngine = AudioEngine;
window.GPSTracker = GPSTracker;
window.Notify = Notify;
window.Dashboard = Dashboard;
window.Analytics = Analytics;
window.Search = Search;

console.log('✅ All 17 modules exposed globally');
console.log('🔗 rizvi.store/rasaai | 📞 +91 9594306625');
console.log('🎁 Free 30 Social Media Creatives with LED Campaign!');
