/*
 * Filename: state.js
 * Path: /js/core/state.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Global state management, event system, data store
 * Type: Core JavaScript
 */

// ============================================
// GLOBAL STATE STORE
// ============================================

const Store = {
    // Application State
    app: {
        initialized: false,
        loading: true,
        error: null,
        currentView: null,
        sidebarOpen: false,
        modalOpen: false,
        theme: 'light'
    },

    // User State
    user: {
        current: null,
        isAuthenticated: false,
        role: null,
        permissions: []
    },

    // Data State
    data: {
        campaigns: [],
        invoices: [],
        payments: [],
        leads: [],
        tasks: [],
        zones: ZONES,
        audioAds: [],
        audioLogs: [],
        scanLogs: [],
        referrals: [],
        commissions: [],
        withdrawals: [],
        attendance: [],
        inventory: [],
        notifications: [],
        settings: {}
    },

    // UI State
    ui: {
        activeTab: null,
        activeModal: null,
        toasts: [],
        searchQuery: '',
        selectedItems: [],
        filters: {},
        sortBy: null,
        sortOrder: 'asc',
        pagination: {
            current: 1,
            perPage: 20,
            total: 0
        }
    },

    // Pricing State
    pricing: {
        led: { current: 1238, min: 1238, max: 1647, history: [] },
        audio: { current: 318, min: 318, max: 639, history: [] },
        lastUpdated: null,
        nextUpdate: null
    },

    // Network State
    network: {
        online: navigator.onLine,
        syncing: false,
        lastSync: null,
        pendingOps: 0
    },

    // Audio Engine State
    audio: {
        isPlaying: false,
        currentAd: null,
        playlist: [],
        playsToday: 0,
        earnings: 0
    }
};

// ============================================
// EVENT SYSTEM
// ============================================

const EventBus = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return () => this.off(event, callback);
    },

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    },

    emit(event, data = {}) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Event handler error [${event}]:`, error);
            }
        });
    },

    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    },

    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
};

// ============================================
// STATE GETTERS
// ============================================

function getState(path) {
    const keys = path.split('.');
    let value = Store;
    
    for (const key of keys) {
        if (value === undefined || value === null) return undefined;
        value = value[key];
    }
    
    return value;
}

function getAppState() {
    return { ...Store.app };
}

function getUserState() {
    return { ...Store.user };
}

function getDataState() {
    return { ...Store.data };
}

function getUIState() {
    return { ...Store.ui };
}

function getPricingState() {
    return { ...Store.pricing };
}

function getNetworkState() {
    return { ...Store.network };
}

function getAudioState() {
    return { ...Store.audio };
}

// ============================================
// STATE SETTERS
// ============================================

function setState(path, value) {
    const keys = path.split('.');
    let target = Store;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) target[keys[i]] = {};
        target = target[keys[i]];
    }
    
    const oldValue = target[keys[keys.length - 1]];
    target[keys[keys.length - 1]] = value;
    
    // Emit change event
    EventBus.emit(`state:${path}`, { oldValue, newValue: value });
    EventBus.emit('state:change', { path, oldValue, newValue: value });
    
    return value;
}

function updateAppState(updates) {
    Object.assign(Store.app, updates);
    EventBus.emit('state:app', updates);
}

function updateUserState(updates) {
    Object.assign(Store.user, updates);
    EventBus.emit('state:user', updates);
}

function updateDataState(updates) {
    Object.assign(Store.data, updates);
    EventBus.emit('state:data', updates);
}

function updateUIState(updates) {
    Object.assign(Store.ui, updates);
    EventBus.emit('state:ui', updates);
}

function updatePricingState(updates) {
    Object.assign(Store.pricing, updates);
    EventBus.emit('state:pricing', updates);
}

function updateNetworkState(updates) {
    Object.assign(Store.network, updates);
    EventBus.emit('state:network', updates);
}

function updateAudioState(updates) {
    Object.assign(Store.audio, updates);
    EventBus.emit('state:audio', updates);
}

// ============================================
// DATA LOADING
// ============================================

async function loadInitialData() {
    console.log('📦 Loading initial data...');
    updateAppState({ loading: true, error: null });

    try {
        const loadPromises = [];

        // Load zones (already in config, but refresh from sheets if available)
        if (FEATURES.googleSheets && AuthState.isAuthenticated) {
            loadPromises.push(
                sheetsAPI.getSheetData(SHEETS.campaigns)
                    .then(data => setState('data.campaigns', data))
                    .catch(() => {})
            );
            loadPromises.push(
                sheetsAPI.getSheetData(SHEETS.invoices)
                    .then(data => setState('data.invoices', data))
                    .catch(() => {})
            );
            loadPromises.push(
                sheetsAPI.getSheetData(SHEETS.notifications)
                    .then(data => setState('data.notifications', data))
                    .catch(() => {})
            );
        }

        await Promise.allSettled(loadPromises);
        
        updateAppState({ loading: false, initialized: true });
        EventBus.emit('data:loaded');
        console.log('✅ Initial data loaded');

    } catch (error) {
        console.error('❌ Data loading failed:', error);
        updateAppState({ loading: false, error: error.message });
    }
}

async function refreshData(sheetName = null) {
    if (!FEATURES.googleSheets) return;
    
    console.log(`🔄 Refreshing data${sheetName ? ': ' + sheetName : ''}`);
    
    try {
        if (sheetName) {
            const data = await sheetsAPI.getSheetData(sheetName);
            const key = Object.keys(SHEETS).find(k => SHEETS[k] === sheetName);
            if (key) {
                setState(`data.${key}`, data);
            }
        } else {
            await loadInitialData();
        }
        
        EventBus.emit('data:refreshed', { sheet: sheetName });
    } catch (error) {
        console.error(`❌ Refresh failed: ${sheetName}`, error);
    }
}

// ============================================
// COMPUTED / DERIVED STATE
// ============================================

function getActiveCampaigns() {
    return Store.data.campaigns.filter(c => c.status === 'active');
}

function getPendingPayments() {
    return Store.data.payments.filter(p => p.status === 'pending');
}

function getUnreadNotifications() {
    return Store.data.notifications.filter(n => !n.read);
}

function getUnreadNotificationCount() {
    return getUnreadNotifications().length;
}

function getTodayEarnings() {
    const today = new Date().toISOString().split('T')[0];
    return Store.data.attendance
        .filter(a => a.date === today)
        .reduce((sum, a) => sum + (parseFloat(a.earnings) || 0), 0);
}

function getMonthlyEarnings() {
    const month = new Date().toISOString().substring(0, 7);
    return Store.data.attendance
        .filter(a => a.date?.startsWith(month))
        .reduce((sum, a) => sum + (parseFloat(a.earnings) || 0), 0);
}

function getTotalCommissions() {
    return Store.data.commissions
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
}

function getPendingCommissions() {
    return Store.data.commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
}

function getAvailableBalance() {
    return Store.data.commissions
        .filter(c => c.status === 'approved' || c.status === 'available')
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0) -
        Store.data.withdrawals
        .filter(w => w.status === 'approved')
        .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
}

// ============================================
// UI HELPERS
// ============================================

function toggleSidebar() {
    const isOpen = !Store.app.sidebarOpen;
    setState('app.sidebarOpen', isOpen);
    
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open', isOpen);
    }
    
    const backdrop = document.querySelector('.backdrop');
    if (backdrop) {
        backdrop.classList.toggle('active', isOpen);
    }
}

function closeSidebar() {
    setState('app.sidebarOpen', false);
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) sidebar.classList.remove('open');
    const backdrop = document.querySelector('.backdrop');
    if (backdrop) backdrop.classList.remove('active');
}

function openModal(modalId) {
    setState('app.modalOpen', true);
    setState('ui.activeModal', modalId);
    
    const backdrop = document.getElementById(modalId);
    if (backdrop) {
        backdrop.classList.add('active');
    }
    
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId = null) {
    const targetId = modalId || Store.ui.activeModal;
    
    setState('app.modalOpen', false);
    setState('ui.activeModal', null);
    
    if (targetId) {
        const backdrop = document.getElementById(targetId);
        if (backdrop) backdrop.classList.remove('active');
    }
    
    document.body.style.overflow = '';
}

function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active, .bottom-sheet-backdrop.active').forEach(modal => {
        modal.classList.remove('active');
    });
    setState('app.modalOpen', false);
    setState('ui.activeModal', null);
    document.body.style.overflow = '';
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = {
        id: Date.now(),
        message,
        type,
        duration
    };
    
    Store.ui.toasts.push(toast);
    EventBus.emit('toast:show', toast);
    
    if (duration > 0) {
        setTimeout(() => {
            dismissToast(toast.id);
        }, duration);
    }
    
    return toast.id;
}

function dismissToast(toastId) {
    Store.ui.toasts = Store.ui.toasts.filter(t => t.id !== toastId);
    EventBus.emit('toast:dismiss', toastId);
}

function setLoading(isLoading) {
    updateAppState({ loading: isLoading });
}

function setError(error) {
    updateAppState({ error: error });
    if (error) {
        showToast(error, 'error', 5000);
    }
}

function clearError() {
    updateAppState({ error: null });
}

// ============================================
// THEME MANAGEMENT
// ============================================

function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
}

function setTheme(theme) {
    Store.app.theme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
    
    EventBus.emit('theme:changed', { theme });
}

function toggleTheme() {
    const newTheme = Store.app.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function initTheme() {
    const savedTheme = getTheme();
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
}

// ============================================
// PERSISTENCE
// ============================================

function saveState() {
    try {
        const persistableState = {
            app: { theme: Store.app.theme },
            ui: { filters: Store.ui.filters, sortBy: Store.ui.sortBy, sortOrder: Store.ui.sortOrder },
            pricing: Store.pricing,
            network: { lastSync: Store.network.lastSync }
        };
        localStorage.setItem('rasaai_persisted_state', JSON.stringify(persistableState));
    } catch (error) {
        console.warn('⚠️ Failed to save state');
    }
}

function loadPersistedState() {
    try {
        const saved = localStorage.getItem('rasaai_persisted_state');
        if (saved) {
            const state = JSON.parse(saved);
            if (state.app) Object.assign(Store.app, state.app);
            if (state.ui) Object.assign(Store.ui, state.ui);
            if (state.pricing) Object.assign(Store.pricing, state.pricing);
            if (state.network) Object.assign(Store.network, state.network);
        }
    } catch (error) {
        console.warn('⚠️ Failed to load persisted state');
    }
}

// Auto-save state periodically
setInterval(saveState, 30000); // Every 30 seconds

// Save on page unload
window.addEventListener('beforeunload', saveState);

// ============================================
// INITIALIZATION
// ============================================

function initState() {
    console.log('🔄 Initializing state...');
    
    // Load persisted state
    loadPersistedState();
    
    // Initialize theme
    initTheme();
    
    // Set up network listeners
    window.addEventListener('online', () => {
        updateNetworkState({ online: true });
        EventBus.emit('network:online');
    });
    
    window.addEventListener('offline', () => {
        updateNetworkState({ online: false });
        EventBus.emit('network:offline');
    });
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
            closeSidebar();
        }
    });
    
    // Click outside modal to close
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop') || 
            e.target.classList.contains('bottom-sheet-backdrop') ||
            e.target.classList.contains('backdrop')) {
            closeAllModals();
            closeSidebar();
        }
    });
    
    updateAppState({ initialized: true });
    
    console.log('✅ State Module Loaded');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initState);

// ============================================
// GLOBAL STATE OBJECT
// ============================================

window.RASAAI = {
    Store: Store,
    EventBus: EventBus,
    
    // Getters
    getState: getState,
    getAppState: getAppState,
    getUserState: getUserState,
    getDataState: getDataState,
    getUIState: getUIState,
    getPricingState: getPricingState,
    getNetworkState: getNetworkState,
    getAudioState: getAudioState,
    
    // Setters
    setState: setState,
    updateAppState: updateAppState,
    updateUserState: updateUserState,
    updateDataState: updateDataState,
    updateUIState: updateUIState,
    updatePricingState: updatePricingState,
    updateNetworkState: updateNetworkState,
    updateAudioState: updateAudioState,
    
    // Data
    loadInitialData: loadInitialData,
    refreshData: refreshData,
    
    // Computed
    getActiveCampaigns: getActiveCampaigns,
    getPendingPayments: getPendingPayments,
    getUnreadNotifications: getUnreadNotifications,
    getUnreadNotificationCount: getUnreadNotificationCount,
    getTodayEarnings: getTodayEarnings,
    getMonthlyEarnings: getMonthlyEarnings,
    getTotalCommissions: getTotalCommissions,
    getPendingCommissions: getPendingCommissions,
    getAvailableBalance: getAvailableBalance,
    
    // UI
    toggleSidebar: toggleSidebar,
    closeSidebar: closeSidebar,
    openModal: openModal,
    closeModal: closeModal,
    closeAllModals: closeAllModals,
    showToast: showToast,
    dismissToast: dismissToast,
    setLoading: setLoading,
    setError: setError,
    clearError: clearError,
    
    // Theme
    getTheme: getTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    
    // Events
    on: EventBus.on.bind(EventBus),
    off: EventBus.off.bind(EventBus),
    emit: EventBus.emit.bind(EventBus),
    once: EventBus.once.bind(EventBus)
};

console.log('✅ State Global Object Ready (window.RASAAI)');
