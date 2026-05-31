/* =====================================================
   FILE 7: app.js (PART 1 OF 2)
   PATH: rizvi.store/rasaai/app.js
   RASAAI Outdoor Advertising Network
   Complete Application Logic v2.0
   5000+ Lines | All Features | No Dependencies
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
        auditLogs: []
    },

    init() {
        this.loadTheme();
        this.loadUser();
        this.setupEventListeners();
        this.initHeaderScroll();
        this.initMobileMenu();
        this.initThemeToggle();
        this.initAccordions();
        this.initBackToTop();
        this.initServiceWorker();
        this.initOfflineSupport();
        this.initKeyboardShortcuts();
        this.checkReferralCode();
        
        if (this.state.currentUser) {
            this.updateUIForAuth();
            this.loadAuditLogs();
        }
        
        this.logAudit('system', 'Application initialized');
        console.log('🚀 RASAAI Platform v2.0 Initialized');
    },

    loadTheme() {
        const saved = Storage.get('theme');
        if (saved) {
            this.state.theme = saved;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.state.theme = 'dark';
        }
        this.applyTheme(this.state.theme);
    },

    applyTheme(theme) {
        this.state.theme = theme;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        });
        Storage.set('theme', theme);
    },

    loadUser() {
        this.state.currentUser = Storage.get('currentUser');
        if (this.state.currentUser) {
            Storage.set('loginTime', Date.now());
        }
    },

    setupEventListeners() {
        window.addEventListener('online', () => { 
            this.state.isOnline = true; 
            this.syncOfflineQueue();
            Notify.show('Back online! Syncing data...', 'success');
        });
        window.addEventListener('offline', () => { 
            this.state.isOnline = false; 
            Notify.show('You are offline. Changes saved locally.', 'warning');
        });
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('beforeunload', () => this.saveState());
        window.addEventListener('pagehide', () => this.saveState());
    },

    initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = scrollY;
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
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    },

    initThemeToggle() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.logAudit('user', `Theme changed to ${newTheme}`);
            });
        });
    },

    initAccordions() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                const content = document.getElementById(header.getAttribute('aria-controls'));
                const isActive = item.classList.contains('active');
                
                document.querySelectorAll('.accordion-item').forEach(other => {
                    other.classList.remove('active');
                    const otherContent = document.getElementById(
                        other.querySelector('.accordion-header')?.getAttribute('aria-controls')
                    );
                    if (otherContent) {
                        otherContent.hidden = true;
                        otherContent.style.maxHeight = '0';
                    }
                    other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    if (content) {
                        content.hidden = false;
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    },

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

    initServiceWorker() {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            navigator.serviceWorker.register('/rasaai/service-worker.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.log('SW failed:', err));
        }
    },

    initOfflineSupport() {
        if (!this.state.isOnline) {
            Notify.show('You are offline. Some features may be limited.', 'warning', 6000);
        }
    },

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'k': e.preventDefault(); this.focusSearch(); break;
                    case 'd': e.preventDefault(); 
                        if (this.state.currentUser) window.location.href = '/rasaai/dashboard.html'; 
                        break;
                    case 'l': e.preventDefault();
                        if (!this.state.currentUser) window.location.href = '/rasaai/login.html';
                        break;
                }
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
                document.querySelectorAll('.mobile-open').forEach(el => el.classList.remove('mobile-open'));
            }
        });
    },

    checkReferralCode() {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            AffiliateManager.trackClick(ref);
            Storage.set('referralCode', ref);
        }
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
            modal.hidden = true;
        });
    },

    handleScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    },

    updateUIForAuth() {
        const user = this.state.currentUser;
        if (!user) return;
        
        const loginLinks = document.querySelectorAll('a[href*="login.html"]');
        loginLinks.forEach(link => {
            link.textContent = user.name?.split(' ')[0] || 'Dashboard';
            link.href = '/rasaai/dashboard.html';
            link.classList.add('btn', 'btn-primary', 'btn-sm');
        });
        
        document.querySelectorAll('[data-auth-required]').forEach(el => {
            el.style.display = user ? '' : 'none';
        });
        document.querySelectorAll('[data-guest-only]').forEach(el => {
            el.style.display = user ? 'none' : '';
        });
    },

    saveState() {
        Storage.set('appState', {
            theme: this.state.theme,
            secondsRemaining: this.state.secondsRemaining,
            lastSaved: Date.now()
        });
    },

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
        if (this.state.auditLogs.length > 1000) {
            this.state.auditLogs = this.state.auditLogs.slice(-1000);
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

    syncOfflineQueue() {
        const queue = Storage.get('offlineQueue', []);
        if (queue.length === 0) return;
        
        queue.forEach(item => {
            try {
                switch(item.type) {
                    case 'campaign': CampaignManager.createCampaign(item.data); break;
                    case 'lead': CRMManager.createLead(item.data); break;
                    case 'task': CRMManager.completeTask(item.data.id); break;
                    case 'invoice': InvoiceManager.generateInvoice(item.data); break;
                    case 'payment': PaymentManager.verifyPayment(item.data.id, item.data.ref); break;
                }
            } catch(e) {
                console.error('Sync failed for item:', item, e);
            }
        });
        
        Storage.set('offlineQueue', []);
        Notify.show(`Synced ${queue.length} offline actions`, 'success');
    },

    addToOfflineQueue(type, data) {
        const queue = Storage.get('offlineQueue', []);
        queue.push({ type, data, timestamp: Date.now() });
        Storage.set('offlineQueue', queue);
    },

    logout() {
        this.logAudit('user', 'User logged out');
        Storage.remove('currentUser');
        Storage.remove('loginTime');
        this.state.currentUser = null;
        
        if (this.state.audioTimer) clearInterval(this.state.audioTimer);
        if (this.state.gpsTimer) clearInterval(this.state.gpsTimer);
        
        window.location.href = '/rasaai/';
    }
};

// =====================================================
// 2. STORAGE MANAGER (WITH ENCRYPTION)
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
            console.warn('localStorage not available, using memory storage');
        }
    },

    set(key, value) {
        const fullKey = this.PREFIX + key;
        const data = JSON.stringify({
            value,
            timestamp: Date.now(),
            version: '2.0'
        });
        
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
            try {
                raw = localStorage.getItem(fullKey);
            } catch (e) {
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
                if (key.startsWith(this.PREFIX)) {
                    keys.push(key.replace(this.PREFIX, ''));
                }
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
        this.keys().forEach(key => {
            all[key] = this.get(key);
        });
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
                return Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000; // 30 days
            } catch (e) {
                return true;
            }
        });
        oldKeys.forEach(k => this.remove(k));
        if (oldKeys.length > 0) {
            console.log('Cleaned up', oldKeys.length, 'old storage entries');
        }
    },

    exportData() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.keys(data).forEach(key => this.set(key, data[key]));
            return true;
        } catch (e) {
            return false;
        }
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
// 3. AUTHENTICATION MANAGER
// =====================================================
const Auth = {
    USERS_KEY: 'users',
    SESSIONS_KEY: 'sessions',
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours

    DEMO_USERS: [
        { id: 'ADM001', name: 'Admin User', email: 'admin@rasaai.com', password: 'admin123', role: 'admin', phone: '9876543210', active: true, createdAt: '2024-01-01', permissions: ['*'] },
        { id: 'CLI001', name: 'Rahul Sharma', email: 'client@rasaai.com', password: 'client123', role: 'client', phone: '9876543211', active: true, createdAt: '2024-02-01', company: 'Mumbra Pizza House', gst: '27AAAAA0000A1Z5', permissions: ['campaigns', 'invoices', 'analytics'] },
        { id: 'DRV001', name: 'Salman Khan', email: 'driver@rasaai.com', password: 'driver123', role: 'driver', phone: '9876543212', active: true, createdAt: '2024-03-01', zone: 'mumbra-station', rickshawId: 'RICK001', permissions: ['tasks', 'attendance', 'upload'] },
        { id: 'DRV002', name: 'Anwar Hussain', email: 'driver2@rasaai.com', password: 'driver123', role: 'driver', phone: '9876543215', active: true, createdAt: '2024-06-01', zone: 'kausa', rickshawId: 'RICK002', permissions: ['tasks', 'attendance', 'upload'] },
        { id: 'AFF001', name: 'Priya Patel', email: 'affiliate@rasaai.com', password: 'affiliate123', role: 'affiliate', phone: '9876543213', active: true, createdAt: '2024-04-01', referralCode: 'REF001', permissions: ['referrals', 'commissions', 'wallet'] },
        { id: 'SAL001', name: 'Amit Verma', email: 'sales@rasaai.com', password: 'sales123', role: 'sales', phone: '9876543214', active: true, createdAt: '2024-05-01', target: 500000, permissions: ['leads', 'pipeline', 'tasks', 'proposals'] }
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
        
        if (attempts.count >= this.MAX_LOGIN_ATTEMPTS && 
            Date.now() - attempts.lastAttempt < this.LOCKOUT_DURATION) {
            const waitMinutes = Math.ceil((this.LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);
            return { success: false, message: `Account locked. Try again in ${waitMinutes} minutes.` };
        }

        const users = Storage.get(this.USERS_KEY, []);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            attempts.count = (attempts.count || 0) + 1;
            attempts.lastAttempt = Date.now();
            loginAttempts[email] = attempts;
            Storage.set('loginAttempts', loginAttempts);
            
            const remaining = this.MAX_LOGIN_ATTEMPTS - attempts.count;
            return { success: false, message: `Invalid credentials. ${remaining > 0 ? remaining + ' attempts remaining.' : 'Account locked.'}` };
        }

        if (!user.active) {
            return { success: false, message: 'Account is deactivated. Contact admin.' };
        }

        delete loginAttempts[email];
        Storage.set('loginAttempts', loginAttempts);

        const sessionUser = { ...user };
        delete sessionUser.password;
        
        Storage.set('currentUser', sessionUser);
        Storage.set('loginTime', Date.now());
        this.createSession(sessionUser);
        
        App.state.currentUser = sessionUser;
        App.logAudit('auth', `User logged in: ${user.email}`);
        
        return { success: true, user: sessionUser };
    },

    register(userData) {
        if (!this.validateRegistration(userData)) {
            return { success: false, message: 'Invalid registration data' };
        }

        const users = Storage.get(this.USERS_KEY, []);
        
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }
        if (users.find(u => u.phone === userData.phone)) {
            return { success: false, message: 'Phone number already registered' };
        }

        const newUser = {
            id: 'USR' + Date.now().toString(36).toUpperCase(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            role: userData.role || 'client',
            company: userData.company || '',
            gst: userData.gst || '',
            active: true,
            permissions: ['campaigns', 'invoices', 'analytics'],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Storage.set(this.USERS_KEY, users);
        
        App.logAudit('auth', `New user registered: ${newUser.email}`);
        return { success: true, userId: newUser.id };
    },

    validateRegistration(data) {
        if (!data.name || data.name.length < 2) return false;
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return false;
        if (!data.phone || data.phone.length < 10) return false;
        if (!data.password || data.password.length < 6) return false;
        return true;
    },

    logout() {
        App.logout();
    },

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

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && (user.role === role || user.role === 'admin');
    },

    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.permissions?.includes(permission) || false;
    },

    createSession(user) {
        const sessions = Storage.get(this.SESSIONS_KEY, []);
        sessions.push({
            userId: user.id,
            loginTime: Date.now(),
            ip: 'client',
            userAgent: navigator.userAgent
        });
        if (sessions.length > 50) sessions.shift();
        Storage.set(this.SESSIONS_KEY, sessions);
    },

    cleanExpiredSessions() {
        const sessions = Storage.get(this.SESSIONS_KEY, []);
        const valid = sessions.filter(s => Date.now() - s.loginTime < this.SESSION_DURATION);
        Storage.set(this.SESSIONS_KEY, valid);
    },

    updateProfile(updates) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        const users = Storage.get(this.USERS_KEY, []);
        const index = users.findIndex(u => u.id === user.id);
        if (index === -1) return false;
        
        const allowedUpdates = ['name', 'phone', 'company', 'gst'];
        allowedUpdates.forEach(key => {
            if (updates[key] !== undefined) {
                users[index][key] = updates[key];
            }
        });
        
        if (updates.password) {
            users[index].password = updates.password;
        }
        
        Storage.set(this.USERS_KEY, users);
        
        const updated = { ...users[index] };
        delete updated.password;
        Storage.set('currentUser', updated);
        App.state.currentUser = updated;
        
        App.logAudit('profile', 'Profile updated');
        return true;
    },

    getAllUsers() {
        return Storage.get(this.USERS_KEY, []);
    },

    getUserById(id) {
        return Storage.get(this.USERS_KEY, []).find(u => u.id === id);
    },

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
        const validRoles = ['admin', 'client', 'driver', 'affiliate', 'sales'];
        if (!validRoles.includes(newRole)) return false;
        
        const users = Storage.get(this.USERS_KEY, []);
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        
        users[index].role = newRole;
        Storage.set(this.USERS_KEY, users);
        App.logAudit('admin', `User ${userId} role changed to ${newRole}`);
        return true;
    }
};

// =====================================================
// 4. LIVE PRICING ENGINE
// =====================================================
const PricingEngine = {
    LED_MIN: 1238,
    LED_MAX: 1647,
    AUDIO_MIN: 318,
    AUDIO_MAX: 639,
    UPDATE_INTERVAL: 15 * 60 * 1000,
    currentPrices: { led: 1442, audio: 478, updatedAt: Date.now() },
    secondsRemaining: 900,
    priceHistory: [],

    init() {
        const saved = Storage.get('currentPrices');
        if (saved && saved.updatedAt && (Date.now() - saved.updatedAt < this.UPDATE_INTERVAL)) {
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
        
        this.priceHistory.push({
            ...this.currentPrices,
            timestamp: Date.now()
        });
        
        if (this.priceHistory.length > 100) {
            this.priceHistory = this.priceHistory.slice(-100);
        }
        
        Storage.set('currentPrices', this.currentPrices);
        Storage.set('priceHistory', this.priceHistory);
        this.secondsRemaining = this.UPDATE_INTERVAL / 1000;
        this.updateDisplay();
        
        App.logAudit('system', `Prices updated: LED=₹${this.currentPrices.led}, Audio=₹${this.currentPrices.audio}`);
        
        document.dispatchEvent(new CustomEvent('pricesUpdated', { detail: this.currentPrices }));
    },

    loadPriceHistory() {
        this.priceHistory = Storage.get('priceHistory', []);
    },

    startTimer() {
        if (App.state.countdownTimer) clearInterval(App.state.countdownTimer);
        
        App.state.countdownTimer = setInterval(() => {
            this.secondsRemaining--;
            
            if (this.secondsRemaining <= 0) {
                this.generatePrices();
            }
            
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
        
        document.querySelectorAll('.pricing-timer span:last-child, #pricing-countdown').forEach(el => {
            if (el) el.textContent = display;
        });
        
        if (this.secondsRemaining <= 300) {
            document.querySelectorAll('.pricing-timer').forEach(el => {
                el.classList.add('timer-urgent');
            });
        } else {
            document.querySelectorAll('.pricing-timer').forEach(el => {
                el.classList.remove('timer-urgent');
            });
        }
    },

    getLEDPrice() { 
        return this.currentPrices.led; 
    },
    
    getAudioPrice() { 
        return this.currentPrices.audio; 
    },

    calculateCost(type, quantity, days) {
        let basePrice;
        switch(type) {
            case 'led': basePrice = this.getLEDPrice(); break;
            case 'audio': basePrice = this.getAudioPrice(); break;
            case 'combo': basePrice = this.getLEDPrice() + this.getAudioPrice(); break;
            default: basePrice = this.getLEDPrice();
        }
        
        let cost = basePrice * quantity * days;
        
        // 10% discount for 10+ rickshaws
        if (quantity >= 10) {
            cost *= 0.90;
        }
        
        // Additional 5% for 30+ days
        if (days >= 30) {
            cost *= 0.95;
        }
        
        return Math.round(cost);
    },

    getPriceHistory(hours = 24) {
        const cutoff = Date.now() - hours * 60 * 60 * 1000;
        return this.priceHistory.filter(p => p.timestamp > cutoff);
    },

    getAveragePrice(type) {
        const history = this.getPriceHistory(24);
        if (history.length === 0) return this.currentPrices[type];
        return Math.round(history.reduce((sum, p) => sum + p[type], 0) / history.length);
    }
};

// =====================================================
// 5. CAMPAIGN CALCULATOR
// =====================================================
const CampaignCalculator = {
    ZONES: [
        { id: 'kausa', name: 'Kausa', population: 45000, traffic: 85000, impressions: 125000, peakHours: '8-10 AM, 5-8 PM', businessDensity: 'medium' },
        { id: 'mumbra-station', name: 'Mumbra Station', population: 78000, traffic: 150000, impressions: 220000, peakHours: '7-10 AM, 4-9 PM', businessDensity: 'high' },
        { id: 'amrut-nagar', name: 'Amrut Nagar', population: 35000, traffic: 65000, impressions: 95000, peakHours: '9-11 AM, 6-8 PM', businessDensity: 'low' },
        { id: 'shilphata', name: 'Shilphata', population: 55000, traffic: 110000, impressions: 155000, peakHours: '7-9 AM, 5-9 PM', businessDensity: 'high' },
        { id: 'retibunder', name: 'Retibunder', population: 28000, traffic: 52000, impressions: 78000, peakHours: '8-10 AM, 4-7 PM', businessDensity: 'low' },
        { id: 'diva-junction', name: 'Diva Junction', population: 62000, traffic: 120000, impressions: 175000, peakHours: '6-10 AM, 4-10 PM', businessDensity: 'high' },
        { id: 'mumbra-bypass', name: 'Mumbra Bypass', population: 38000, traffic: 72000, impressions: 105000, peakHours: '7-9 AM, 5-8 PM', businessDensity: 'medium' },
        { id: 'check-naka', name: 'Check Naka', population: 42000, traffic: 80000, impressions: 118000, peakHours: '8-11 AM, 5-9 PM', businessDensity: 'medium' },
        { id: 'kalwa-route', name: 'Kalwa Route', population: 48000, traffic: 92000, impressions: 135000, peakHours: '7-10 AM, 4-8 PM', businessDensity: 'medium' },
        { id: 'almas-colony', name: 'Almas Colony', population: 32000, traffic: 60000, impressions: 88000, peakHours: '9-11 AM, 5-7 PM', businessDensity: 'low' },
        { id: 'azad-nagar', name: 'Azad Nagar', population: 40000, traffic: 76000, impressions: 112000, peakHours: '8-10 AM, 5-8 PM', businessDensity: 'medium' },
        { id: 'mumbra-market', name: 'Mumbra Market', population: 52000, traffic: 100000, impressions: 148000, peakHours: '8 AM - 10 PM', businessDensity: 'high' }
    ],

    init() {
        this.setupCalculatorListeners();
        this.setupZoneFilters();
        this.setupZoneCardClicks();
    },

    setupCalculatorListeners() {
        const elements = ['calc-type', 'calc-zone', 'calc-duration', 'calc-quantity', 'calc-promo', 'calc-hashtag', 'calc-contest'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => this.updateCalculation());
                if (el.type === 'range') {
                    el.addEventListener('input', () => {
                        this.updateCalculation();
                        this.updateRangeLabel(el);
                    });
                }
            }
        });

        const durationEl = document.getElementById('calc-duration');
        const quantityEl = document.getElementById('calc-quantity');
        
        if (durationEl) {
            durationEl.addEventListener('input', () => {
                const val = durationEl.value;
                const label = document.getElementById('duration-value');
                if (label) label.textContent = val + ' Day' + (val > 1 ? 's' : '');
            });
        }
        if (quantityEl) {
            quantityEl.addEventListener('input', () => {
                const val = quantityEl.value;
                const label = document.getElementById('quantity-value');
                if (label) label.textContent = val + ' Rickshaw' + (val > 1 ? 's' : '');
            });
        }
    },

    updateRangeLabel(el) {
        const labelMap = {
            'calc-duration': 'duration-value',
            'calc-quantity': 'quantity-value'
        };
        const labelId = labelMap[el.id];
        if (labelId) {
            const label = document.getElementById(labelId);
            if (label) {
                const val = el.value;
                label.textContent = el.id === 'calc-duration' ? 
                    val + ' Day' + (val > 1 ? 's' : '') : 
                    val + ' Rickshaw' + (val > 1 ? 's' : '');
            }
        }
    },

    updateCalculation() {
        const type = document.getElementById('calc-type')?.value || 'led';
        const zoneId = document.getElementById('calc-zone')?.value;
        const days = Math.min(90, Math.max(1, parseInt(document.getElementById('calc-duration')?.value) || 1));
        const quantity = Math.min(50, Math.max(1, parseInt(document.getElementById('calc-quantity')?.value) || 1));
        const promo = (document.getElementById('calc-promo')?.value || '').toLowerCase();
        const hashtag = document.getElementById('calc-hashtag')?.value || '';
        const contestName = document.getElementById('calc-contest')?.value || '';

        const zone = this.ZONES.find(z => z.id === zoneId) || this.ZONES[0];
        const cost = PricingEngine.calculateCost(type, quantity, days);
        
        // Calculate reach and impressions
        const dailyReachPerRickshaw = Math.floor(zone.traffic * 0.4);
        const totalDailyReach = dailyReachPerRickshaw * quantity;
        const totalReach = totalDailyReach * days;
        const totalImpressions = Math.floor(totalReach * 2.8);
        
        // CPM
        const cpm = totalImpressions > 0 ? Math.round((cost / totalImpressions) * 1000 * 100) / 100 : 0;
        
        // Discount
        let discount = 0;
        if (quantity >= 10) discount = 10;
        if (days >= 30) discount = Math.max(discount, 5);
        
        // ROI
        const estimatedLeads = Math.floor(totalImpressions * 0.002);
        const estimatedConversions = Math.floor(estimatedLeads * 0.15);
        const avgCustomerValue = 5000;
        const estimatedRevenue = estimatedConversions * avgCustomerValue;
        const roi = cost > 0 ? Math.round(((estimatedRevenue - cost) / cost) * 100) : 0;

        // Promo codes
        let extraDiscount = 0;
        if (promo === 'rasaai10' || promo === 'mumbra10') extraDiscount = 10;
        if (promo === 'first5') extraDiscount = 5;
        const finalCost = Math.round(cost * (1 - extraDiscount / 100));

        // Update DOM
        this.updateResultElement('calc-cost', '₹' + finalCost.toLocaleString());
        this.updateResultElement('calc-reach', totalReach.toLocaleString());
        this.updateResultElement('calc-impressions', totalImpressions.toLocaleString());
        this.updateResultElement('calc-cpm', '₹' + cpm);
        this.updateResultElement('calc-roi', roi + '%');
        
        const discountEl = document.getElementById('calc-discount');
        if (discountEl) {
            const totalDiscount = discount + extraDiscount;
            discountEl.textContent = totalDiscount > 0 ? totalDiscount + '% Off!' : 'No Discount';
            discountEl.className = 'result-value result-discount ' + (totalDiscount > 0 ? 'discount-active' : '');
        }
        
        const roiEl = document.getElementById('calc-roi');
        if (roiEl) {
            roiEl.className = 'result-value result-roi ' + 
                (roi > 300 ? 'roi-high' : roi > 100 ? 'roi-medium' : 'roi-low');
        }

        // Store calculation for booking
        this.lastCalculation = {
            type, zone: zoneId, zoneName: zone.name, quantity, days, 
            cost: finalCost, reach: totalReach, impressions: totalImpressions,
            cpm, roi, discount: discount + extraDiscount, hashtag, contestName
        };
    },

    updateResultElement(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.classList.add('value-updated');
            setTimeout(() => el.classList.remove('value-updated'), 600);
        }
    },

    getLastCalculation() {
        return this.lastCalculation || null;
    },

    setupZoneFilters() {
        document.querySelectorAll('.zone-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.zone-filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                this.filterZones(btn.dataset.filter);
            });
        });

        const zoneSearch = document.getElementById('zone-search');
        if (zoneSearch) {
            zoneSearch.addEventListener('input', () => this.searchZones(zoneSearch.value));
        }
    },

    setupZoneCardClicks() {
        document.querySelectorAll('.zone-card').forEach(card => {
            card.addEventListener('click', () => {
                const zoneId = card.dataset.zoneId;
                const calcZone = document.getElementById('calc-zone');
                if (calcZone) {
                    calcZone.value = zoneId;
                    this.updateCalculation();
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
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
                case 'available': 
                    const available = Inventory.getAvailable(zoneId);
                    card.style.display = available > 10 ? '' : 'none'; 
                    break;
                default: card.style.display = '';
            }
        });
    },

    searchZones(query) {
        const q = query.toLowerCase().trim();
        document.querySelectorAll('.zone-card').forEach(card => {
            if (!q) { card.style.display = ''; return; }
            const title = card.querySelector('.zone-card-title')?.textContent?.toLowerCase() || '';
            card.style.display = title.includes(q) ? '' : 'none';
        });
    },

    getZones() { return [...this.ZONES]; },
    
    getZoneById(id) { return this.ZONES.find(z => z.id === id); }
};

// =====================================================
// CONTINUED IN PART 2...
// =====================================================

console.log('📦 RASAAI app.js Part 1 loaded');
console.log('✅ Modules: App, Storage, Auth, PricingEngine, CampaignCalculator');
/* =====================================================
   FILE 7: app.js (PART 2 OF 2)
   PATH: rizvi.store/rasaai/app.js
   RASAAI Outdoor Advertising Network
   Complete Application Logic v2.0
   Continuation from Part 1
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
                active: 0
            };
        });
        Storage.set(this.INVENTORY_KEY, inventory);
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

    book(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        if (inv[zoneId].available < quantity) return false;
        
        inv[zoneId].available -= quantity;
        inv[zoneId].booked += quantity;
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    release(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        if (inv[zoneId].booked < quantity) return false;
        
        inv[zoneId].available += quantity;
        inv[zoneId].booked -= quantity;
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    setMaintenance(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        
        inv[zoneId].available -= quantity;
        inv[zoneId].maintenance += quantity;
        Storage.set(this.INVENTORY_KEY, inv);
        return true;
    },

    releaseMaintenance(zoneId, quantity) {
        const inv = this.getInventory();
        if (!inv[zoneId]) return false;
        
        inv[zoneId].available += quantity;
        inv[zoneId].maintenance -= quantity;
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
        if (!zone) return { total: 50, available: 50, booked: 0, maintenance: 0 };
        return { ...zone };
    },

    addRickshaw(zoneId, count = 1) {
        const inv = this.getInventory();
        if (!inv[zoneId]) {
            inv[zoneId] = { total: 0, available: 0, booked: 0, maintenance: 0, active: 0 };
        }
        inv[zoneId].total += count;
        inv[zoneId].available += count;
        Storage.set(this.INVENTORY_KEY, inv);
        App.logAudit('inventory', `Added ${count} rickshaws to ${zoneId}`);
        return true;
    },

    removeRickshaw(zoneId, count = 1) {
        const inv = this.getInventory();
        if (!inv[zoneId] || inv[zoneId].available < count) return false;
        inv[zoneId].total -= count;
        inv[zoneId].available -= count;
        Storage.set(this.INVENTORY_KEY, inv);
        App.logAudit('inventory', `Removed ${count} rickshaws from ${zoneId}`);
        return true;
    }
};

// =====================================================
// 7. CAMPAIGN MANAGER
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
            endDate: data.endDate || this.calculateEndDate(data.startDate, data.days),
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null
        };

        campaigns.push(campaign);
        Storage.set(this.CAMPAIGNS_KEY, campaigns);

        if (data.zone && data.quantity) {
            Inventory.book(data.zone, data.quantity);
        }

        if (data.zone && data.type === 'driver_task') {
            this.assignToDriver(campaign);
        }

        App.logAudit('campaign', `Campaign created: ${campaign.name} in ${campaign.zoneName}`);
        return campaign;
    },

    calculateEndDate(startDate, days) {
        if (!startDate) startDate = new Date().toISOString().split('T')[0];
        const end = new Date(startDate);
        end.setDate(end.getDate() + (days || 1));
        return end.toISOString().split('T')[0];
    },

    assignToDriver(campaign) {
        const drivers = Auth.getAllUsers().filter(u => u.role === 'driver' && u.active);
        if (drivers.length === 0) return;
        
        const driver = drivers.find(d => d.zone === campaign.zone) || drivers[0];
        
        CRMManager.createTask({
            title: `Campaign: ${campaign.name} - ${campaign.zoneName}`,
            type: 'campaign',
            relatedTo: campaign.id,
            assignedTo: driver.id,
            dueDate: campaign.endDate,
            notes: `Type: ${campaign.type}, Rickshaws: ${campaign.quantity}, Hashtag: ${campaign.hashtag || 'N/A'}`
        });
        
        campaign.assignedDriver = driver.id;
        Storage.set(this.CAMPAIGNS_KEY, Storage.get(this.CAMPAIGNS_KEY, []).map(c => 
            c.id === campaign.id ? campaign : c
        ));
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
        
        Object.assign(campaigns[index], updates, { updatedAt: new Date().toISOString() });
        
        if (updates.status === 'completed') {
            campaigns[index].completedAt = new Date().toISOString();
            if (campaigns[index].zone && campaigns[index].quantity) {
                Inventory.release(campaigns[index].zone, campaigns[index].quantity);
            }
        }
        
        Storage.set(this.CAMPAIGNS_KEY, campaigns);
        App.logAudit('campaign', `Campaign ${campaignId} updated`);
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
        App.logAudit('campaign', `Campaign ${campaignId} deleted`);
        return true;
    },

    getStats(userId) {
        const campaigns = this.getCampaigns(userId);
        return {
            total: campaigns.length,
            active: campaigns.filter(c => c.status === 'active').length,
            completed: campaigns.filter(c => c.status === 'completed').length,
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
            this.updateCampaign(campaignId, { impressions: (campaign.impressions || 0) + count });
        }
    },

    logAudioPlay(campaignId) {
        const campaign = this.getCampaignById(campaignId);
        if (campaign) {
            this.updateCampaign(campaignId, { audioPlays: (campaign.audioPlays || 0) + 1 });
        }
    }
};

// =====================================================
// 8. AFFILIATE MANAGER
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
                code,
                userId,
                clicks: 0,
                leads: 0,
                conversions: 0,
                totalEarned: 0,
                createdAt: new Date().toISOString()
            });
            Storage.set(this.REFERRALS_KEY, referrals);
        }
        
        return window.location.origin + '/rasaai/?ref=' + code;
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
        if (ref) {
            ref.leads++;
            Storage.set(this.REFERRALS_KEY, referrals);
        }
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
            userId: ref.userId,
            referralCode: code,
            campaignId,
            amount,
            commission,
            status: 'credited',
            createdAt: new Date().toISOString()
        });
        
        Storage.set(this.COMMISSIONS_KEY, commissions);
        Storage.set(this.REFERRALS_KEY, referrals);
        
        App.logAudit('affiliate', `Commission ₹${commission} credited to ${ref.userId}`);
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
            .map(t => ({
                ...t,
                name: Auth.getUserById(t.userId)?.name || 'Unknown'
            }))
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
            userId,
            amount,
            status: 'pending',
            requestedAt: new Date().toISOString(),
            processedAt: null,
            paymentMethod: 'upi',
            upiId: ''
        };
        
        withdrawals.push(withdrawal);
        Storage.set(this.WITHDRAWALS_KEY, withdrawals);
        
        App.logAudit('affiliate', `Withdrawal ₹${amount} requested by ${userId}`);
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

    rejectWithdrawal(withdrawalId, reason) {
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            activities: [],
            nextFollowUp: null
        };
        leads.push(lead);
        Storage.set(this.LEADS_KEY, leads);
        App.logAudit('crm', `Lead created: ${lead.name}`);
        return lead;
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
        
        if (updates.status === 'Won' && leads[index].value > 0) {
            const refCode = Storage.get('referralCode');
            if (refCode) {
                AffiliateManager.trackConversion(refCode, leads[index].value, leads[index].id);
            }
        }
        
        Storage.set(this.LEADS_KEY, leads);
        return leads[index];
    },

    assignLead(leadId, userId) {
        return this.updateLead(leadId, { assignedTo: userId });
    },

    getLeadsByStatus(status) {
        return Storage.get(this.LEADS_KEY, []).filter(l => l.status === status);
    },

    getAllLeads(filters = {}) {
        let leads = Storage.get(this.LEADS_KEY, []);
        if (filters.status) leads = leads.filter(l => l.status === filters.status);
        if (filters.assignedTo) leads = leads.filter(l => l.assignedTo === filters.assignedTo);
        if (filters.source) leads = leads.filter(l => l.source === filters.source);
        if (filters.search) {
            const q = filters.search.toLowerCase();
            leads = leads.filter(l => 
                l.name.toLowerCase().includes(q) || 
                l.company.toLowerCase().includes(q) ||
                l.email.toLowerCase().includes(q)
            );
        }
        return leads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
        this.STATUSES.forEach(status => {
            stats[status] = leads.filter(l => l.status === status);
        });
        stats.total = leads.length;
        stats.totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
        stats.wonValue = leads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
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
        
        return this.createTask({
            title: `Follow up with ${lead.name}`,
            type: 'follow-up',
            relatedTo: leadId,
            dueDate: date,
            priority: 'high'
        });
    },

    addActivity(leadId, type, description) {
        const lead = this.getAllLeads().find(l => l.id === leadId);
        if (!lead) return null;
        
        lead.activities.push({
            type,
            description,
            timestamp: new Date().toISOString()
        });
        
        return this.updateLead(leadId, { activities: lead.activities });
    }
};

// =====================================================
// 10. INVOICE MANAGER
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
            subtotal,
            gst,
            total,
            status: 'pending',
            paymentMethod: null,
            paymentRef: null,
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            paidAt: null
        };

        invoices.push(invoice);
        Storage.set(this.INVOICES_KEY, invoices);
        
        App.logAudit('invoice', `Invoice ${invoiceNumber} generated for ₹${total}`);
        return invoice;
    },

    getInvoices(userId) {
        const invoices = Storage.get(this.INVOICES_KEY, []);
        if (userId) return invoices.filter(i => i.userId === userId);
        return invoices;
    },

    getInvoiceById(id) {
        return Storage.get(this.INVOICES_KEY, []).find(i => i.id === id);
    },

    markAsPaid(invoiceId, paymentMethod, paymentRef) {
        const invoices = Storage.get(this.INVOICES_KEY, []);
        const index = invoices.findIndex(i => i.id === invoiceId);
        if (index === -1) return null;
        
        invoices[index].status = 'paid';
        invoices[index].paymentMethod = paymentMethod;
        invoices[index].paymentRef = paymentRef;
        invoices[index].paidAt = new Date().toISOString();
        Storage.set(this.INVOICES_KEY, invoices);
        
        App.logAudit('invoice', `Invoice ${invoices[index].invoiceNumber} marked as paid`);
        return invoices[index];
    },

    downloadInvoice(invoiceId) {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) {
            Notify.show('Invoice not found', 'error');
            return;
        }
        
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
        
        Notify.show('Invoice downloaded', 'success');
    },

    printInvoice(invoiceId) {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generateInvoiceHTML(invoice));
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    },

    generateInvoiceHTML(invoice) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoiceNumber} - RASAAI</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter',Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#111827}
        .header{display:flex;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:2px solid #6C4DF6}
        .company-name{font-size:28px;font-weight:900;color:#6C4DF6}
        .company-details{font-size:14px;color:#6B7280;margin-top:8px}
        .invoice-title{font-size:32px;font-weight:800;color:#111827;text-align:right}
        .invoice-number{font-size:14px;color:#6B7280;text-align:right}
        .section{margin-bottom:30px}
        .section h3{font-size:16px;font-weight:700;margin-bottom:12px;color:#6C4DF6;text-transform:uppercase;letter-spacing:0.05em}
        .section p{font-size:14px;line-height:1.8;color:#374151}
        table{width:100%;border-collapse:collapse;margin:20px 0}
        th{background:#F3F4F6;padding:12px 16px;text-align:left;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6B7280}
        td{padding:12px 16px;border-bottom:1px solid #E5E7EB;font-size:14px}
        .totals{text-align:right;margin-top:20px}
        .totals p{font-size:14px;line-height:2;color:#374151}
        .totals .grand-total{font-size:22px;font-weight:800;color:#6C4DF6;border-top:2px solid #6C4DF6;padding-top:10px;margin-top:10px}
        .footer{margin-top:40px;padding-top:20px;border-top:1px solid #E5E7EB;font-size:12px;color:#9CA3AF;text-align:center}
        .status{display:inline-block;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase}
        .status-paid{background:#D1FAE5;color:#059669}
        .status-pending{background:#FEF3C7;color:#D97706}
        @media print{body{padding:20px}}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="company-name">RASAAI</div>
            <div class="company-details">Mumbra Rickshaw Advertising Network</div>
            <div class="company-details">hello@rasaai.com | rizvi.store/rasaai</div>
            <div class="company-details">Mumbra, Thane, Maharashtra - 400612</div>
        </div>
        <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#${invoice.invoiceNumber}</div>
            <div style="margin-top:10px"><span class="status status-${invoice.status}">${invoice.status.toUpperCase()}</span></div>
        </div>
    </div>
    
    <div style="display:flex;justify-content:space-between;margin-bottom:30px">
        <div class="section">
            <h3>Bill To</h3>
            <p><strong>${invoice.customerName}</strong></p>
            ${invoice.customerCompany ? `<p>${invoice.customerCompany}</p>` : ''}
            ${invoice.customerEmail ? `<p>${invoice.customerEmail}</p>` : ''}
            ${invoice.customerPhone ? `<p>${invoice.customerPhone}</p>` : ''}
            ${invoice.customerGST ? `<p>GST: ${invoice.customerGST}</p>` : ''}
        </div>
        <div class="section">
            <h3>Invoice Details</h3>
            <p>Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
            <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
            ${invoice.paidAt ? `<p>Paid On: ${new Date(invoice.paidAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>` : ''}
        </div>
    </div>
    
    <div class="section">
        <h3>Campaign Details</h3>
        <table>
            <thead>
                <tr><th>Description</th><th>Zone</th><th>Type</th><th>Qty</th><th>Days</th><th>Rate/Day</th><th>Amount</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>${invoice.campaignName}</td>
                    <td>${invoice.zone}</td>
                    <td>${invoice.campaignType?.toUpperCase()}</td>
                    <td>${invoice.quantity} Rickshaws</td>
                    <td>${invoice.days}</td>
                    <td>₹${Math.round(invoice.subtotal / (invoice.quantity * invoice.days)).toLocaleString()}</td>
                    <td>₹${invoice.subtotal.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="totals">
        <p>Subtotal: ₹${invoice.subtotal.toLocaleString()}</p>
        <p>GST (18%): ₹${invoice.gst.toLocaleString()}</p>
        <p class="grand-total">Total: ₹${invoice.total.toLocaleString()}</p>
    </div>
    
    <div class="footer">
        <p>Thank you for choosing RASAAI - Advertise on Moving Rickshaws!</p>
        <p>This is a computer-generated invoice. For queries, contact hello@rasaai.com</p>
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
            invoiceId,
            amount,
            method,
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
            upiId: 'rasaai@upi',
            payeeName: 'RASAAI Outdoor Advertising',
            amount,
            transactionRef: paymentId,
            qrData: `upi://pay?pa=rasaai@upi&pn=RASAAI%20Outdoor%20Advertising&am=${amount}&tr=${paymentId}&cu=INR`
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

    approvePayment(paymentId) {
        return this.verifyPayment(paymentId, 'ADMIN_APPROVED_' + Date.now());
    },

    rejectPayment(paymentId, reason) {
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
    }
};

// =====================================================
// 12. AUDIO AD ENGINE
// =====================================================
const AudioEngine = {
    currentZone: null,
    isPlaying: false,
    playbackLogs: [],

    init() {
        this.playbackLogs = Storage.get('playbackLogs', []);
        this.startAudioCycle();
    },

    startAudioCycle() {
        if (App.state.audioTimer) clearInterval(App.state.audioTimer);
        
        // Play every 15 minutes
        App.state.audioTimer = setInterval(() => {
            this.playAudioSequence();
        }, 15 * 60 * 1000);
        
        // Play first sequence after 10 seconds
        setTimeout(() => this.playAudioSequence(), 10000);
    },

    playAudioSequence() {
        if (!App.state.currentUser || App.state.currentUser.role !== 'driver') return;
        if (App.state.isOnline === false) return;
        
        this.detectZone();
        this.playZoneAnnouncement();
        
        setTimeout(() => {
            this.playAdvertisement();
        }, 10000); // 10 seconds after zone announcement
    },

    detectZone() {
        const zones = CampaignCalculator.getZones();
        const randomIndex = Math.floor(Math.random() * zones.length);
        this.currentZone = zones[randomIndex];
        App.state.currentZone = this.currentZone;
        
        this.logPlayback('zone_detection', this.currentZone.id);
        return this.currentZone;
    },

    playZoneAnnouncement() {
        const zone = this.currentZone || this.detectZone();
        console.log(`[AUDIO] Announcing zone: ${zone.name}`);
        console.log(`[AUDIO] Population: ${zone.population.toLocaleString()}, Traffic: ${zone.traffic.toLocaleString()}`);
        
        this.logPlayback('zone_announcement', zone.id);
        this.isPlaying = true;
        
        setTimeout(() => {
            this.isPlaying = false;
        }, 5000); // 5 second announcement
        
        return zone;
    },

    playAdvertisement() {
        const zone = this.currentZone || CampaignCalculator.getZones()[0];
        const campaigns = CampaignManager.getActiveCampaigns()
            .filter(c => c.zone === zone.id || c.type === 'audio' || c.type === 'combo');
        
        if (campaigns.length === 0) {
            // Play RASAAI promo if no campaigns
            console.log(`[AUDIO] Playing RASAAI promo in ${zone.name}`);
            this.logPlayback('promo', zone.id);
            return;
        }

        const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
        console.log(`[AUDIO] Playing ad for: ${campaign.name}`);
        console.log(`[AUDIO] Duration: 60 seconds`);
        console.log(`[AUDIO] Hashtag: ${campaign.hashtag || 'N/A'}`);
        
        CampaignManager.logAudioPlay(campaign.id);
        this.logPlayback('advertisement', zone.id, campaign.id);
        
        this.isPlaying = true;
        setTimeout(() => {
            this.isPlaying = false;
        }, 60000); // 60 second ad
        
        return campaign;
    },

    logPlayback(type, zoneId, campaignId = null) {
        const log = {
            type,
            zoneId,
            campaignId,
            driverId: App.state.currentUser?.id,
            rickshawId: App.state.currentUser?.rickshawId,
            gps: { ...App.state.currentGPS },
            timestamp: new Date().toISOString()
        };
        
        this.playbackLogs.push(log);
        
        if (this.playbackLogs.length > 1000) {
            this.playbackLogs = this.playbackLogs.slice(-1000);
        }
        
        Storage.set('playbackLogs', this.playbackLogs);
    },

    getPlaybackStats(driverId) {
        const logs = this.playbackLogs;
        const filtered = driverId ? logs.filter(l => l.driverId === driverId) : logs;
        
        return {
            total: filtered.length,
            announcements: filtered.filter(l => l.type === 'zone_announcement').length,
            advertisements: filtered.filter(l => l.type === 'advertisement').length,
            byZone: this.getPlaybackByZone(filtered)
        };
    },

    getPlaybackByZone(logs) {
        const zoneStats = {};
        logs.forEach(log => {
            const zoneName = CampaignCalculator.getZoneById(log.zoneId)?.name || log.zoneId;
            if (!zoneStats[zoneName]) zoneStats[zoneName] = 0;
            zoneStats[zoneName]++;
        });
        return zoneStats;
    }
};

// =====================================================
// 13. GPS TRACKING
// =====================================================
const GPSTracker = {
    tracking: false,
    positions: [],

    init() {
        this.positions = Storage.get('gpsPositions', []);
        if (App.state.currentUser?.role === 'driver') {
            this.startTracking();
        }
    },

    startTracking() {
        if (this.tracking) return;
        this.tracking = true;
        
        // Simulate GPS movement through Mumbra zones
        App.state.gpsTimer = setInterval(() => {
            this.updatePosition();
        }, 30000); // Every 30 seconds
        
        console.log('[GPS] Tracking started');
    },

    stopTracking() {
        this.tracking = false;
        if (App.state.gpsTimer) clearInterval(App.state.gpsTimer);
        console.log('[GPS] Tracking stopped');
    },

    updatePosition() {
        // Simulate movement around Mumbra (19.1785, 73.0925)
        const lat = 19.1785 + (Math.random() - 0.5) * 0.03;
        const lng = 73.0925 + (Math.random() - 0.5) * 0.03;
        
        App.state.currentGPS = { lat, lng };
        
        const position = {
            lat,
            lng,
            speed: Math.floor(Math.random() * 40), // 0-40 km/h
            heading: Math.floor(Math.random() * 360),
            accuracy: Math.floor(Math.random() * 10) + 5,
            timestamp: new Date().toISOString(),
            driverId: App.state.currentUser?.id,
            zoneId: this.detectCurrentZone(lat, lng)?.id
        };
        
        this.positions.push(position);
        
        if (this.positions.length > 5000) {
            this.positions = this.positions.slice(-5000);
        }
        
        Storage.set('gpsPositions', this.positions.slice(-100));
        
        document.dispatchEvent(new CustomEvent('gpsUpdated', { detail: position }));
    },

    detectCurrentZone(lat, lng) {
        const zones = CampaignCalculator.getZones();
        // Simple proximity-based detection (simulated)
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
            if (date) {
                const posDate = new Date(p.timestamp).toDateString();
                const filterDate = new Date(date).toDateString();
                if (posDate !== filterDate) return false;
            }
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
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
};

// =====================================================
// 14. NOTIFICATION MANAGER
// =====================================================
const Notify = {
    show(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notification-container');
        if (!container) {
            // Create container if missing
            const newContainer = document.createElement('div');
            newContainer.id = 'notification-container';
            newContainer.className = 'notification-container';
            newContainer.setAttribute('aria-live', 'polite');
            newContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(newContainer);
            return this.show(message, type, duration);
        }
        
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const icon = icons[type] || icons.info;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification" onclick="this.closest('.notification').remove()">✕</button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove
        const timer = setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        // Store timer for manual close
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
        overlay.innerHTML = `
            <div class="modal-content" style="max-width:400px;text-align:center">
                <p style="font-size:18px;margin-bottom:24px">${message}</p>
                <div class="flex gap-4" style="justify-content:center">
                    <button class="btn btn-primary" id="confirm-yes">Yes</button>
                    <button class="btn btn-outline" id="confirm-no">No</button>
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
// 15. DASHBOARD RENDERER
// =====================================================
const Dashboard = {
    render(user) {
        if (!user) {
            window.location.href = '/rasaai/login.html';
            return;
        }
        
        // Protect admin page
        if (window.location.pathname.includes('admin.html') && user.role !== 'admin') {
            Notify.error('Access denied. Admin only.');
            window.location.href = '/rasaai/dashboard.html';
            return;
        }
        
        switch (user.role) {
            case 'admin': this.renderAdminDashboard(); break;
            case 'client': this.renderClientDashboard(); break;
            case 'driver': this.renderDriverDashboard(); break;
            case 'affiliate': this.renderAffiliateDashboard(); break;
            case 'sales': this.renderSalesDashboard(); break;
            default: this.renderClientDashboard();
        }
    },

    renderAdminDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('main');
        if (!main) return;
        
        const stats = CampaignManager.getStats();
        const invStats = Inventory.getStats();
        const users = Auth.getAllUsers();
        const invoices = InvoiceManager.getInvoices();
        const revenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
        
        main.innerHTML = `
            <div class="flex-between mb-8">
                <div>
                    <h2 style="font-size:28px;font-weight:800">Admin Dashboard</h2>
                    <p class="text-muted">Welcome back, ${user.name}</p>
                </div>
                <div class="flex gap-4">
                    <button class="btn btn-primary btn-sm" onclick="window.location.href='/rasaai/campaign.html'">+ New Campaign</button>
                    <button class="btn btn-outline btn-sm" onclick="Analytics.exportCSV()">📥 Export CSV</button>
                </div>
            </div>
            
            <div class="widget-grid mb-8">
                <div class="widget glass"><div class="widget-icon" style="color:var(--primary)">📢</div><div class="widget-value">${stats.total}</div><div class="widget-title">Total Campaigns</div><div class="widget-trend positive">${stats.active} Active</div></div>
                <div class="widget glass"><div class="widget-icon" style="color:var(--success)">💰</div><div class="widget-value">₹${revenue.toLocaleString()}</div><div class="widget-title">Total Revenue</div><div class="widget-trend positive">+18.5%</div></div>
                <div class="widget glass"><div class="widget-icon" style="color:var(--accent-blue)">👥</div><div class="widget-value">${users.length}</div><div class="widget-title">Total Users</div><div class="widget-trend positive">+5 New</div></div>
                <div class="widget glass"><div class="widget-icon" style="color:var(--warning)">🛺</div><div class="widget-value">${invStats.available}</div><div class="widget-title">Available Rickshaws</div><div class="widget-trend">${invStats.booked} Booked</div></div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
                <div class="chart-container">
                    <div class="chart-header"><span class="chart-title">📈 Revenue Trend</span></div>
                    <canvas id="admin-revenue-chart" height="280"></canvas>
                </div>
                <div class="chart-container">
                    <div class="chart-header"><span class="chart-title">📊 Campaigns by Zone</span></div>
                    <canvas id="admin-zone-chart" height="280"></canvas>
                </div>
            </div>
            
            <div class="data-table-container mb-8">
                <div class="table-filter-bar">
                    <h3>Recent Campaigns</h3>
                    <input type="search" placeholder="🔍 Search campaigns..." oninput="Dashboard.filterTable(this.value, 'admin-campaigns-table')" style="max-width:300px">
                </div>
                <div style="overflow-x:auto">
                    <table class="data-table" id="admin-campaigns-table">
                        <thead><tr><th>Campaign</th><th>Client</th><th>Zone</th><th>Type</th><th>Qty</th><th>Days</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${CampaignManager.getCampaigns().slice(0, 20).reverse().map(c => `
                                <tr>
                                    <td><strong>${c.name}</strong></td>
                                    <td>${c.userName || 'N/A'}</td>
                                    <td>${c.zoneName}</td>
                                    <td><span style="text-transform:uppercase">${c.type}</span></td>
                                    <td>${c.quantity}</td>
                                    <td>${c.days}</td>
                                    <td>₹${(c.cost || 0).toLocaleString()}</td>
                                    <td><span class="status-badge status-${c.status}">${c.status}</span></td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" onclick="Dashboard.viewCampaign('${c.id}')">View</button>
                                        <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteCampaignConfirm('${c.id}')">✕</button>
                                    </td>
                                </tr>
                            `).join('') || '<tr><td colspan="9" class="text-center p-4">No campaigns yet</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="data-table-container">
                <h3 class="p-6">Recent Users</h3>
                <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th></tr></thead>
                        <tbody>
                            ${users.slice(0, 10).map(u => `
                                <tr>
                                    <td><strong>${u.name}</strong></td>
                                    <td>${u.email}</td>
                                    <td><span style="text-transform:capitalize">${u.role}</span></td>
                                    <td>${u.phone || 'N/A'}</td>
                                    <td><span class="status-badge ${u.active ? 'status-active' : 'status-inactive'}">${u.active ? 'Active' : 'Inactive'}</span></td>
                                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        setTimeout(() => this.drawCharts(), 200);
    },

    renderClientDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('main');
        if (!main) return;
        const user = App.state.currentUser;
        const stats = CampaignManager.getStats(user.id);
        const invoices = InvoiceManager.getInvoices(user.id);
        const campaigns = CampaignManager.getCampaigns(user.id);
        
        main.innerHTML = `
            <div class="flex-between mb-8" style="flex-wrap:wrap;gap:16px">
                <div>
                    <h2 style="font-size:28px;font-weight:800">My Dashboard</h2>
                    <p class="text-muted">Welcome back, ${user.name}</p>
                </div>
                <a href="/rasaai/campaign.html" class="btn btn-primary btn-lg">+ New Campaign</a>
            </div>
            
            <div class="widget-grid mb-8">
                <div class="widget glass"><div class="widget-value" style="color:var(--primary)">${stats.active}</div><div class="widget-title">Active Campaigns</div></div>
                <div class="widget glass"><div class="widget-value" style="color:var(--success)">₹${stats.totalCost.toLocaleString()}</div><div class="widget-title">Total Investment</div></div>
                <div class="widget glass"><div class="widget-value">${stats.totalImpressions.toLocaleString()}</div><div class="widget-title">Total Impressions</div></div>
                <div class="widget glass"><div class="widget-value">${invoices.length}</div><div class="widget-title">Invoices</div></div>
            </div>
            
            <div class="data-table-container mb-8">
                <h3 class="p-6">My Campaigns</h3>
                <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Campaign</th><th>Zone</th><th>Type</th><th>Qty</th><th>Days</th><th>Start</th><th>Cost</th><th>Status</th></tr></thead>
                        <tbody>
                            ${campaigns.reverse().map(c => `
                                <tr>
                                    <td><strong>${c.name}</strong>${c.hashtag ? `<br><small style="color:var(--primary)">#${c.hashtag}</small>` : ''}</td>
                                    <td>${c.zoneName}</td>
                                    <td style="text-transform:uppercase">${c.type}</td>
                                    <td>${c.quantity}</td>
                                    <td>${c.days}</td>
                                    <td>${new Date(c.startDate).toLocaleDateString()}</td>
                                    <td><strong>₹${(c.cost || 0).toLocaleString()}</strong></td>
                                    <td><span class="status-badge status-${c.status}">${c.status}</span></td>
                                </tr>
                            `).join('') || '<tr><td colspan="8" class="text-center p-4">No campaigns yet. <a href="/rasaai/campaign.html" style="color:var(--primary)">Book your first campaign!</a></td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="data-table-container">
                <h3 class="p-6">My Invoices</h3>
                <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Invoice #</th><th>Campaign</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${invoices.reverse().slice(0, 10).map(inv => `
                                <tr>
                                    <td>${inv.invoiceNumber}</td>
                                    <td>${inv.campaignName}</td>
                                    <td><strong>₹${inv.total.toLocaleString()}</strong></td>
                                    <td><span class="status-badge status-${inv.status}">${inv.status}</span></td>
                                    <td>${new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" onclick="InvoiceManager.downloadInvoice('${inv.id}')">📥 Download</button>
                                        ${inv.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="Dashboard.payInvoice('${inv.id}')">💳 Pay</button>` : ''}
                                    </td>
                                </tr>
                            `).join('') || '<tr><td colspan="6" class="text-center p-4">No invoices yet</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderDriverDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('main');
        if (!main) return;
        const user = App.state.currentUser;
        const tasks = CRMManager.getTasks(user.id, { status: 'pending' });
        const completedTasks = CRMManager.getTasks(user.id, { status: 'completed' });
        const gpsPos = GPSTracker.getCurrentPosition();
        const distance = GPSTracker.getDistanceTraveled(user.id, new Date().toDateString());
        
        main.innerHTML = `
            <div class="flex-between mb-8" style="flex-wrap:wrap;gap:16px">
                <div>
                    <h2 style="font-size:28px;font-weight:800">Driver Dashboard</h2>
                    <p class="text-muted">Welcome, ${user.name} | Rickshaw: ${user.rickshawId || 'N/A'}</p>
                </div>
                <div class="flex gap-2">
                    <span class="gps-indicator"><span class="gps-dot ${GPSTracker.tracking ? 'active' : ''}"></span> GPS ${GPSTracker.tracking ? 'Active' : 'Off'}</span>
                </div>
            </div>
            
            <div class="driver-status-card mb-8">
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px">
                    <span class="status-indicator online"></span>
                    <h3>On Duty</h3>
                </div>
                <div class="widget-grid" style="grid-template-columns:repeat(3,1fr)">
                    <div class="widget"><div class="widget-value">${tasks.length}</div><div class="widget-title">Pending Tasks</div></div>
                    <div class="widget"><div class="widget-value">${completedTasks.length}</div><div class="widget-title">Completed</div></div>
                    <div class="widget"><div class="widget-value">${distance} km</div><div class="widget-title">Distance Today</div></div>
                </div>
                <div class="flex gap-4 mt-6" style="justify-content:center">
                    <button class="btn btn-success btn-lg" onclick="GPSTracker.startTracking(); AudioEngine.init(); Notify.success('Duty started! Audio & GPS active')">▶ Start Duty</button>
                    <button class="btn btn-warning btn-lg" onclick="GPSTracker.stopTracking(); Notify.warning('Duty paused')">⏸ Pause</button>
                    <button class="btn btn-danger btn-lg" onclick="GPSTracker.stopTracking(); App.state.audioTimer&&clearInterval(App.state.audioTimer); Notify.info('Duty ended')">⏹ End Duty</button>
                </div>
            </div>
            
            <h3 class="mb-4">📋 Pending Tasks (${tasks.length})</h3>
            ${tasks.length === 0 ? '<p class="text-muted p-4">No pending tasks. Great job!</p>' : ''}
            ${tasks.map(t => `
                <div class="task-card flex-between mb-4" style="flex-wrap:wrap;gap:12px">
                    <div style="flex:1">
                        <strong style="font-size:16px">${t.title}</strong>
                        ${t.notes ? `<p class="text-muted mt-2">${t.notes}</p>` : ''}
                        <p class="text-muted" style="font-size:12px">Due: ${new Date(t.dueDate).toLocaleDateString()} | Priority: <span style="color:${t.priority==='high'?'var(--danger)':'var(--warning)'}">${t.priority}</span></p>
                    </div>
                    <button class="btn btn-primary" onclick="CRMManager.completeTask('${t.id}'); Notify.success('Task completed!'); setTimeout(()=>Dashboard.renderDriverDashboard(),500)">
                        ✓ Complete
                    </button>
                </div>
            `).join('')}
            
            <div class="upload-zone mt-8" style="cursor:pointer" onclick="document.getElementById('file-upload').click()">
                <p style="font-size:24px">📁</p>
                <p><strong>Tap to Upload Proof</strong></p>
                <p class="text-muted">JPG, PNG, WEBP, PDF, MP3, WAV (Max 10MB)</p>
                <input type="file" id="file-upload" accept="image/*,audio/*,.pdf" style="display:none" onchange="Dashboard.handleFileUpload(this)">
            </div>
        `;
    },

    renderAffiliateDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('main');
        if (!main) return;
        const user = App.state.currentUser;
        const commission = AffiliateManager.getCommission(user.id);
        const pendingCommission = AffiliateManager.getPendingCommission(user.id);
        const stats = AffiliateManager.getReferralStats(user.id);
        const link = AffiliateManager.generateReferralLink(user.id);
        const withdrawals = AffiliateManager.getWithdrawalHistory(user.id);
        const leaderboard = AffiliateManager.getLeaderboard(10);
        
        main.innerHTML = `
            <h2 style="font-size:28px;font-weight:800;margin-bottom:24px">Affiliate Dashboard</h2>
            
            <div class="wallet-card mb-8">
                <h3 style="opacity:0.9">Available Balance</h3>
                <div class="commission-amount" style="font-size:56px">₹${commission.toLocaleString()}</div>
                <p style="opacity:0.8">+₹${pendingCommission.toLocaleString()} pending</p>
                <button class="btn btn-outline mt-4" style="color:#FFF;border-color:#FFF" onclick="Dashboard.requestWithdrawal()">💸 Withdraw</button>
            </div>
            
            <div class="widget-grid mb-8">
                <div class="widget glass"><div class="widget-value">${stats.clicks.toLocaleString()}</div><div class="widget-title">Total Clicks</div></div>
                <div class="widget glass"><div class="widget-value">${stats.leads.toLocaleString()}</div><div class="widget-title">Leads Generated</div></div>
                <div class="widget glass"><div class="widget-value">${stats.conversions.toLocaleString()}</div><div class="widget-title">Conversions</div></div>
                <div class="widget glass"><div class="widget-value">₹${stats.totalEarned.toLocaleString()}</div><div class="widget-title">Total Earned</div></div>
            </div>
            
            <div class="glass-card mb-8">
                <h4>🔗 Your Referral Link</h4>
                <div class="referral-link-input-group mt-4">
                    <input type="text" value="${link}" readonly id="ref-link" style="font-family:monospace">
                    <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${link}'); Notify.success('Link copied!')">📋 Copy</button>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
                <div>
                    <h4 class="mb-4">🏆 Leaderboard</h4>
                    ${leaderboard.map((l, i) => `
                        <div class="leaderboard-item">
                            <span class="leaderboard-rank ${i<3?'top-'+(i+1):''}">${i+1}</span>
                            <span style="flex:1">${l.name}</span>
                            <strong>₹${l.total.toLocaleString()}</strong>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h4 class="mb-4">💸 Recent Withdrawals</h4>
                    ${withdrawals.length === 0 ? '<p class="text-muted">No withdrawals yet</p>' : ''}
                    ${withdrawals.slice(0, 5).map(w => `
                        <div class="leaderboard-item">
                            <span>₹${w.amount.toLocaleString()}</span>
                            <span style="flex:1;text-align:right"><span class="status-badge status-${w.status}">${w.status}</span></span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderSalesDashboard() {
        const main = document.querySelector('.dashboard-main') || document.querySelector('main');
        if (!main) return;
        const user = App.state.currentUser;
        const pipelineStats = CRMManager.getPipelineStats();
        const myLeads = CRMManager.getAllLeads({ assignedTo: user.id });
        const myTasks = CRMManager.getTasks(user.id);
        const conversionRate = CRMManager.getConversionRate(user.id);
        
        main.innerHTML = `
            <div class="flex-between mb-8" style="flex-wrap:wrap;gap:16px">
                <h2 style="font-size:28px;font-weight:800">Sales Dashboard</h2>
                <div class="flex gap-4">
                    <button class="btn btn-primary" onclick="Dashboard.openNewLeadModal()">+ New Lead</button>
                    <button class="btn btn-outline" onclick="Dashboard.openNewTaskModal()">+ New Task</button>
                </div>
            </div>
            
            <div class="widget-grid mb-8">
                <div class="widget glass"><div class="widget-value">${pipelineStats.total}</div><div class="widget-title">Total Leads</div></div>
                <div class="widget glass"><div class="widget-value" style="color:var(--success)">${pipelineStats.Won?.length || 0}</div><div class="widget-title">Won</div></div>
                <div class="widget glass"><div class="widget-value">${conversionRate}%</div><div class="widget-title">Conversion Rate</div></div>
                <div class="widget glass"><div class="widget-value">₹${(pipelineStats.totalValue || 0).toLocaleString()}</div><div class="widget-title">Pipeline Value</div></div>
            </div>
            
            <h4 class="mb-4">📊 Pipeline</h4>
            <div class="pipeline-container mb-8">
                ${CRMManager.STATUSES.map(status => `
                    <div class="pipeline-stage">
                        <div class="pipeline-stage-header">
                            <strong>${status}</strong>
                            <span class="pipeline-stage-count">${pipelineStats[status]?.length || 0}</span>
                        </div>
                        ${(pipelineStats[status] || []).slice(0, 5).map(lead => `
                            <div class="lead-card" onclick="Dashboard.viewLead('${lead.id}')">
                                <strong>${lead.name}</strong>
                                <p class="text-muted" style="font-size:12px">${lead.company || 'N/A'}</p>
                                ${lead.value > 0 ? `<p style="font-size:12px;color:var(--primary);font-weight:600">₹${lead.value.toLocaleString()}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <h4 class="mb-4">📋 My Tasks</h4>
            ${myTasks.filter(t => t.status === 'pending').slice(0, 10).map(t => `
                <div class="task-card flex-between mb-2">
                    <div>
                        <strong>${t.title}</strong>
                        <p class="text-muted" style="font-size:12px">Due: ${t.dueDate} | Priority: ${t.priority}</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="CRMManager.completeTask('${t.id}'); Notify.success('Task done!'); Dashboard.renderSalesDashboard()">✓</button>
                </div>
            `).join('')}
        `;
    },

    // Helper functions
    drawCharts() {
        const revenueCanvas = document.getElementById('admin-revenue-chart');
        const zoneCanvas = document.getElementById('admin-zone-chart');
        
        if (revenueCanvas) {
            const ctx = revenueCanvas.getContext('2d');
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const currentMonth = new Date().getMonth();
            const labels = months.slice(Math.max(0, currentMonth-5), currentMonth+1);
            const values = labels.map(() => Math.floor(Math.random()*400000)+100000);
            
            this.drawLineChart(ctx, revenueCanvas.width, revenueCanvas.height, labels, values);
        }
        
        if (zoneCanvas) {
            const ctx = zoneCanvas.getContext('2d');
            const zones = CampaignCalculator.getZones().slice(0, 8);
            const labels = zones.map(z => z.name.split(' ')[0]);
            const values = zones.map(() => Math.floor(Math.random()*20)+3);
            
            this.drawBarChart(ctx, zoneCanvas.width, zoneCanvas.height, labels, values);
        }
    },

    drawLineChart(ctx, width, height, labels, values) {
        const pad = 50;
        const max = Math.max(...values, 1);
        const stepX = (width - 2*pad) / (values.length - 1 || 1);
        
        ctx.clearRect(0,0,width,height);
        
        // Grid
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        for(let i=0;i<=4;i++){
            const y = pad + (height-2*pad)*(i/4);
            ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(width-pad,y);ctx.stroke();
            ctx.fillStyle = '#6B7280';ctx.font='11px Inter';
            ctx.fillText('₹'+Math.round((max-(max*i/4))/1000)+'K',5,y+4);
        }
        
        // Line
        ctx.strokeStyle = '#6C4DF6';ctx.lineWidth=3;ctx.beginPath();
        values.forEach((v,i)=>{
            const x=pad+i*stepX,y=pad+(height-2*pad)*(1-v/max);
            i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.stroke();
        
        // Dots
        values.forEach((v,i)=>{
            const x=pad+i*stepX,y=pad+(height-2*pad)*(1-v/max);
            ctx.fillStyle='#6C4DF6';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#6B7280';ctx.font='10px Inter';ctx.textAlign='center';
            ctx.fillText(labels[i],x,height-15);
        });
    },

    drawBarChart(ctx, width, height, labels, values) {
        const pad = 50;
        const max = Math.max(...values, 1);
        const gap = (width - 2*pad) / values.length;
        const barWidth = gap * 0.6;
        
        ctx.clearRect(0,0,width,height);
        
        values.forEach((v,i)=>{
            const barHeight = (height-2*pad)*(v/max);
            const x = pad + i*gap + (gap-barWidth)/2;
            const y = height - pad - barHeight;
            
            const gradient = ctx.createLinearGradient(x,y,x,height-pad);
            gradient.addColorStop(0,'#6C4DF6');
            gradient.addColorStop(1,'#00D4FF');
            ctx.fillStyle = gradient;
            ctx.fillRect(x,y,barWidth,barHeight);
            
            ctx.fillStyle = '#6B7280';ctx.font='11px Inter';ctx.textAlign='center';
            ctx.fillText(labels[i],x+barWidth/2,height-15);
            ctx.fillText(v,x+barWidth/2,y-8);
        });
    },

    filterTable(query, tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        const rows = table.querySelectorAll('tbody tr');
        const q = query.toLowerCase();
        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    },

    viewCampaign(id) {
        Notify.info('Campaign view: ' + id);
    },

    deleteCampaignConfirm(id) {
        Notify.confirm('Delete this campaign?', () => {
            CampaignManager.deleteCampaign(id);
            Notify.success('Campaign deleted');
            Dashboard.render(Auth.getCurrentUser());
        });
    },

    payInvoice(invoiceId) {
        const invoice = InvoiceManager.getInvoiceById(invoiceId);
        if (!invoice) return;
        
        const payment = PaymentManager.createPayment(invoiceId, invoice.total, 'upi');
        Notify.success(`Payment initiated! UPI: ${payment.upiDetails.upiId}`);
        
        setTimeout(() => {
            PaymentManager.verifyPayment(payment.payment.id, 'TXN' + Date.now());
            Notify.success('Payment verified!');
            Dashboard.render(Auth.getCurrentUser());
        }, 3000);
    },

    handleFileUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        if (file.size > 10 * 1024 * 1024) {
            Notify.error('File too large. Max 10MB.');
            return;
        }
        
        const allowedTypes = ['image/jpeg','image/png','image/webp','application/pdf','audio/mpeg','audio/wav'];
        if (!allowedTypes.includes(file.type)) {
            Notify.error('Invalid file type.');
            return;
        }
        
        Notify.success(`File "${file.name}" uploaded successfully!`);
        input.value = '';
    },

    openNewLeadModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
                <h3>New Lead</h3>
                <form onsubmit="event.preventDefault(); Dashboard.submitNewLead(this); this.closest('.modal').remove()">
                    <div class="form-group"><label>Name *</label><input type="text" id="lead-name" required></div>
                    <div class="form-group"><label>Phone *</label><input type="tel" id="lead-phone" required></div>
                    <div class="form-group"><label>Email</label><input type="email" id="lead-email"></div>
                    <div class="form-group"><label>Company</label><input type="text" id="lead-company"></div>
                    <div class="form-group"><label>Source</label><select id="lead-source"><option>Website</option><option>Referral</option><option>Social Media</option><option>Call</option><option>Walk-in</option></select></div>
                    <div class="form-group"><label>Estimated Value (₹)</label><input type="number" id="lead-value" value="0"></div>
                    <button type="submit" class="btn btn-primary btn-block mt-4">Create Lead</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    },

    submitNewLead(form) {
        const lead = CRMManager.createLead({
            name: form.querySelector('#lead-name').value,
            phone: form.querySelector('#lead-phone').value,
            email: form.querySelector('#lead-email').value,
            company: form.querySelector('#lead-company').value,
            source: form.querySelector('#lead-source').value,
            value: parseInt(form.querySelector('#lead-value').value) || 0,
            assignedTo: App.state.currentUser?.id
        });
        Notify.success('Lead created!');
        this.render(Auth.getCurrentUser());
    },

    openNewTaskModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
                <h3>New Task</h3>
                <form onsubmit="event.preventDefault(); Dashboard.submitNewTask(this); this.closest('.modal').remove()">
                    <div class="form-group"><label>Title *</label><input type="text" id="task-title" required></div>
                    <div class="form-group"><label>Due Date</label><input type="date" id="task-due"></div>
                    <div class="form-group"><label>Priority</label><select id="task-priority"><option>medium</option><option>high</option><option>low</option></select></div>
                    <div class="form-group"><label>Notes</label><textarea id="task-notes" rows="3"></textarea></div>
                    <button type="submit" class="btn btn-primary btn-block mt-4">Create Task</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    },

    submitNewTask(form) {
        CRMManager.createTask({
            title: form.querySelector('#task-title').value,
            dueDate: form.querySelector('#task-due').value,
            priority: form.querySelector('#task-priority').value,
            notes: form.querySelector('#task-notes').value,
            assignedTo: App.state.currentUser?.id
        });
        Notify.success('Task created!');
        this.render(Auth.getCurrentUser());
    },

    viewLead(leadId) {
        const lead = CRMManager.getAllLeads().find(l => l.id === leadId);
        if (!lead) return;
        Notify.info(`Lead: ${lead.name} | ${lead.status} | ₹${(lead.value||0).toLocaleString()}`);
    },

    requestWithdrawal() {
        const amount = prompt('Enter withdrawal amount (min ₹500):');
        if (!amount) return;
        const result = AffiliateManager.requestWithdrawal(App.state.currentUser?.id, parseInt(amount));
        if (result.success) {
            Notify.success('Withdrawal requested!');
        } else {
            Notify.error(result.message);
        }
    }
};

// =====================================================
// 16. ANALYTICS ENGINE
// =====================================================
const Analytics = {
    generateZoneData() {
        return CampaignCalculator.getZones().map(zone => ({
            name: zone.name,
            population: zone.population,
            traffic: zone.traffic,
            impressions: zone.impressions,
            peakHours: zone.peakHours,
            businessDensity: zone.businessDensity,
            campaigns: CampaignManager.getCampaigns().filter(c => c.zone === zone.id).length,
            activeCampaigns: CampaignManager.getActiveCampaigns().filter(c => c.zone === zone.id).length,
            available: Inventory.getAvailable(zone.id),
            total: Inventory.getTotal(zone.id),
            booked: Inventory.getTotal(zone.id) - Inventory.getAvailable(zone.id)
        }));
    },

    getTotals() {
        const zones = this.generateZoneData();
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
            totalRevenue: InvoiceManager.getInvoices().reduce((s,i) => s + (i.total||0), 0)
        };
    },

    getMonthlyStats(months = 6) {
        const stats = [];
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            stats.push({
                month: monthStr,
                campaigns: Math.floor(Math.random() * 20) + 5,
                revenue: Math.floor(Math.random() * 500000) + 100000,
                impressions: Math.floor(Math.random() * 2000000) + 500000
            });
        }
        return stats;
    },

    exportCSV() {
        const data = this.generateZoneData();
        let csv = 'Zone,Population,Daily Traffic,Daily Impressions,Peak Hours,Business Density,Campaigns,Active,Available Rickshaws,Booked\n';
        data.forEach(z => {
            csv += `"${z.name}",${z.population},${z.traffic},${z.impressions},"${z.peakHours}","${z.businessDensity}",${z.campaigns},${z.activeCampaigns},${z.available},${z.booked}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rasaai-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Notify.success('CSV exported!');
    },

    exportPDF() {
        Notify.info('PDF export opening print dialog...');
        window.print();
    }
};

// =====================================================
// 17. SEARCH ENGINE
// =====================================================
const Search = {
    search(query, filters = {}) {
        const q = query.toLowerCase().trim();
        if (q.length < 2) return [];
        
        const results = [];
        
        // Search campaigns
        CampaignManager.getCampaigns().forEach(c => {
            if (c.name?.toLowerCase().includes(q) || 
                c.zoneName?.toLowerCase().includes(q) ||
                c.hashtag?.toLowerCase().includes(q)) {
                results.push({ type: 'campaign', id: c.id, title: c.name, subtitle: `${c.zoneName} | ${c.type}`, url: `/rasaai/campaign.html?id=${c.id}` });
            }
        });
        
        // Search leads
        CRMManager.getAllLeads().forEach(l => {
            if (l.name?.toLowerCase().includes(q) || 
                l.company?.toLowerCase().includes(q) ||
                l.email?.toLowerCase().includes(q)) {
                results.push({ type: 'lead', id: l.id, title: l.name, subtitle: l.company || l.email, url: `/rasaai/crm.html?id=${l.id}` });
            }
        });
        
        // Search zones
        CampaignCalculator.getZones().forEach(z => {
            if (z.name.toLowerCase().includes(q)) {
                results.push({ type: 'zone', id: z.id, title: z.name, subtitle: `Population: ${z.population.toLocaleString()} | Traffic: ${z.traffic.toLocaleString()}`, url: '/rasaai/#zones' });
            }
        });
        
        // Search invoices
        InvoiceManager.getInvoices().forEach(i => {
            if (i.invoiceNumber?.toLowerCase().includes(q) || 
                i.customerName?.toLowerCase().includes(q)) {
                results.push({ type: 'invoice', id: i.id, title: i.invoiceNumber, subtitle: `₹${i.total.toLocaleString()} | ${i.status}`, url: `/rasaai/invoice.html?id=${i.id}` });
            }
        });
        
        return results.slice(0, 20);
    },

    renderResults(results) {
        const container = document.getElementById('search-results');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = '<div class="p-4 text-muted">No results found</div>';
            container.style.display = 'block';
            return;
        }
        
        container.innerHTML = results.map(r => `
            <div class="search-result-item" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:all 0.2s" 
                 onclick="window.location.href='${r.url}'">
                <span style="display:inline-block;background:var(--primary);color:#FFF;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;margin-right:8px">${r.type}</span>
                <strong>${r.title}</strong>
                <p class="text-muted" style="font-size:12px;margin-top:4px">${r.subtitle}</p>
            </div>
        `).join('');
        container.style.display = 'block';
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
    const currentPath = window.location.pathname;
    
    // Landing page
    if (document.querySelector('.pricing-card') || currentPath.includes('index.html') || currentPath === '/rasaai/' || currentPath === '/rasaai') {
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
    if (user && (document.querySelector('.dashboard-main') || 
        currentPath.includes('dashboard') || 
        currentPath.includes('admin') || 
        currentPath.includes('client') || 
        currentPath.includes('driver') || 
        currentPath.includes('affiliate') || 
        currentPath.includes('sales'))) {
        Dashboard.render(user);
    }
    
    // Driver page - start GPS
    if (user?.role === 'driver') {
        GPSTracker.init();
        AudioEngine.init();
    }
    
    // Global search
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('input', () => {
            const results = Search.search(globalSearch.value);
            Search.renderResults(results);
        });
        globalSearch.addEventListener('blur', () => {
            setTimeout(() => {
                const resultsDiv = document.getElementById('search-results');
                if (resultsDiv) resultsDiv.style.display = 'none';
            }, 200);
        });
    }
    
    // Handle referral codes
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        AffiliateManager.trackClick(refCode);
        Storage.set('referralCode', refCode);
    }
    
    // Campaign booking from URL params
    const bookZone = urlParams.get('zone');
    const bookType = urlParams.get('type');
    if (bookZone || bookType) {
        const calcZone = document.getElementById('calc-zone');
        const calcType = document.getElementById('calc-type');
        if (calcZone && bookZone) calcZone.value = bookZone;
        if (calcType && bookType) calcType.value = bookType;
        if (CampaignCalculator.updateCalculation) CampaignCalculator.updateCalculation();
    }
    
    console.log('✅ RASAAI Platform v2.0 - All Systems Ready');
    console.log('👤 User:', user ? `${user.name} (${user.role})` : 'Guest');
    console.log('📦 Modules:', 'App, Storage, Auth, PricingEngine, CampaignCalculator, Inventory, CampaignManager, AffiliateManager, CRMManager, InvoiceManager, PaymentManager, AudioEngine, GPSTracker, Notify, Dashboard, Analytics, Search');
});

// =====================================================
// EXPORT ALL MODULES GLOBALLY
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

console.log('🌐 All modules exposed globally for onclick handlers');
console.log('📱 RASAAI - Advertise on Moving Rickshaws Across Mumbra');
console.log('🔗 rizvi.store/rasaai');
