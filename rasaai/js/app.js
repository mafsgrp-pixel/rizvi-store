/*
 * Filename: app.js
 * Path: /js/app.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Main application controller - initialization, orchestration, global setup
 * Type: Core JavaScript
 */

// ============================================
// APPLICATION STATE
// ============================================

const AppState = {
    initialized: false,
    loading: true,
    error: null,
    page: null,
    online: navigator.onLine,
    initTime: null,
    modules: {
        config: false,
        auth: false,
        sheets: false,
        router: false,
        state: false,
        pricing: false,
        calculator: false,
        campaigns: false,
        inventory: false,
        invoices: false,
        payments: false,
        crm: false,
        affiliates: false,
        analytics: false,
        charts: false,
        notifications: false,
        audio: false,
        scanner: false,
        gamification: false
    }
};

// ============================================
// APPLICATION INITIALIZATION
// ============================================

async function initApp() {
    if (AppState.initialized) return;
    
    const startTime = performance.now();
    console.log('🚀 Initializing RASAAI...');
    console.log(`📋 Version: ${APP_CONFIG.version}`);
    console.log(`🌐 Environment: ${window.location.hostname}`);
    console.log(`📱 Online: ${navigator.onLine}`);

    try {
        // Phase 1: Core Setup
        await initPhase1_Core();
        
        // Phase 2: Detect Page & Setup
        await initPhase2_PageSetup();
        
        // Phase 3: Features
        await initPhase3_Features();
        
        // Phase 4: Finalize
        await initPhase4_Finalize();

        const loadTime = Math.round(performance.now() - startTime);
        AppState.initialized = true;
        AppState.loading = false;
        AppState.initTime = new Date().toISOString();

        console.log(`✅ RASAAI Initialized in ${loadTime}ms`);
        console.log(`👤 User: ${AuthState.isAuthenticated ? AuthState.currentUser?.email : 'Guest'}`);
        console.log(`📄 Page: ${AppState.page}`);

        // Hide loading screen
        hideLoadingScreen();

    } catch (error) {
        AppState.loading = false;
        AppState.error = error.message;
        console.error('❌ App initialization failed:', error);
        showInitError(error.message);
    }
}

// ============================================
// PHASE 1: CORE SETUP
// ============================================

async function initPhase1_Core() {
    console.log('📦 Phase 1: Core Setup');
    
    // Config is already loaded via script tag
    AppState.modules.config = true;
    
    // Initialize state
    if (typeof initState === 'function') {
        initState();
        AppState.modules.state = true;
    }
    
    // Initialize auth (Google Sign-In)
    if (typeof initGoogleAuth === 'function') {
        await initGoogleAuth();
        AppState.modules.auth = true;
    }
    
    // Initialize sheets API
    if (typeof initSheetsAPI === 'function') {
        initSheetsAPI();
        AppState.modules.sheets = true;
    }
    
    // Initialize router
    if (typeof initRouter === 'function') {
        initRouter();
        AppState.modules.router = true;
    }
    
    console.log('✅ Phase 1 Complete');
}

// ============================================
// PHASE 2: PAGE DETECTION & SETUP
// ============================================

async function initPhase2_PageSetup() {
    console.log('📄 Phase 2: Page Setup');
    
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    AppState.page = page;

    // Page-specific initialization
    switch (page) {
        case 'index.html':
        case '':
            await setupLandingPage();
            break;
            
        case 'login.html':
            await setupLoginPage();
            break;
            
        case 'register.html':
            await setupRegisterPage();
            break;
            
        case 'dashboard.html':
            await setupDashboardRouter();
            break;
            
        case 'admin.html':
            await setupAdminPage();
            break;
            
        case 'client.html':
            await setupClientPage();
            break;
            
        case 'driver.html':
            await setupDriverPage();
            break;
            
        case 'affiliate.html':
            await setupAffiliatePage();
            break;
            
        case 'sales.html':
            await setupSalesPage();
            break;
            
        case 'passenger.html':
            await setupPassengerPage();
            break;
            
        case 'campaign.html':
            await setupCampaignPage();
            break;
            
        case 'invoice.html':
            await setupInvoicePage();
            break;
            
        case 'analytics.html':
            await setupAnalyticsPage();
            break;
            
        case 'crm.html':
            await setupCRMPage();
            break;
            
        case 'scan.html':
            await setupScanPage();
            break;
            
        case 'rewards.html':
            await setupRewardsPage();
            break;
            
        default:
            console.log(`📄 Unknown page: ${page}`);
    }
    
    console.log('✅ Phase 2 Complete');
}

// ============================================
// PHASE 3: FEATURE MODULES
// ============================================

async function initPhase3_Features() {
    console.log('🔧 Phase 3: Features');
    
    // Initialize pricing engine
    if (typeof initPricing === 'function' && FEATURES.DYNAMIC_PRICING) {
        initPricing();
        AppState.modules.pricing = true;
    }
    
    // Initialize calculator on pages that need it
    if (document.getElementById('calc-type') && typeof initCalculator === 'function') {
        initCalculator();
        AppState.modules.calculator = true;
    }
    
    // Initialize notifications
    if (typeof initNotifications === 'function') {
        initNotifications();
        AppState.modules.notifications = true;
    }
    
    // Initialize audio module on driver page
    if (AppState.page === 'driver.html' && typeof initAudioModule === 'function') {
        initAudioModule();
        AppState.modules.audio = true;
    }
    
    // Initialize scanner on scan page
    if (AppState.page === 'scan.html' && typeof initScannerModule === 'function') {
        initScannerModule();
        AppState.modules.scanner = true;
    }
    
    // Initialize gamification
    if (typeof initGamification === 'function') {
        initGamification();
        AppState.modules.gamification = true;
    }
    
    console.log('✅ Phase 3 Complete');
}

// ============================================
// PHASE 4: FINALIZE
// ============================================

async function initPhase4_Finalize() {
    console.log('🎯 Phase 4: Finalize');
    
    // Register service worker for PWA
    if (FEATURES.PWA_ENABLED && 'serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // Set up online/offline detection
    setupNetworkDetection();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Set up error handling
    if (typeof initErrorHandler === 'function') {
        initErrorHandler();
    }
    
    // Load user data if authenticated
    if (AuthState.isAuthenticated && FEATURES.googleSheets) {
        loadInitialData().catch(() => {});
    }
    
    // Update online status
    AppState.online = navigator.onLine;
    
    console.log('✅ Phase 4 Complete');
}

// ============================================
// PAGE SETUP FUNCTIONS
// ============================================

async function setupLandingPage() {
    console.log('🏠 Setting up Landing Page');
    
    // Initialize pricing display
    if (typeof initPricing === 'function') {
        initPricing();
    }
    
    // Initialize calculator
    if (typeof initCalculator === 'function') {
        setTimeout(initCalculator, 500);
    }
    
    // Handle affiliate referral tracking
    const refParam = getQueryParam('ref');
    if (refParam) {
        console.log(`🔗 Referral code detected: ${refParam}`);
        sessionStorage.setItem('rasaai_referral_code', refParam);
        if (typeof trackReferralClick === 'function') {
            trackReferralClick(refParam);
        }
    }
    
    // Smooth scroll for anchor links
    setupSmoothScroll();
}

async function setupLoginPage() {
    console.log('🔐 Setting up Login Page');
    
    // Render Google Sign-In button
    if (FEATURES.GOOGLE_SIGN_IN && typeof renderGoogleButton === 'function') {
        setTimeout(() => renderGoogleButton('google-signin-btn', {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: '100%'
        }), 500);
    }
    
    // Check for redirect after login
    const redirect = getQueryParam('redirect');
    if (redirect) {
        sessionStorage.setItem('rasaai_login_redirect', redirect);
    }
}

async function setupRegisterPage() {
    console.log('📝 Setting up Register Page');
    
    // Check for Google sign-up data
    const googleData = sessionStorage.getItem('google_signup_data');
    if (googleData) {
        const userData = JSON.parse(googleData);
        // Pre-fill form
        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        if (nameInput) nameInput.value = userData.name || '';
        if (emailInput) {
            emailInput.value = userData.email || '';
            emailInput.disabled = true;
        }
    }
}

async function setupDashboardRouter() {
    console.log('🔀 Setting up Dashboard Router');
    
    if (!AuthState.isAuthenticated) {
        navigateToLogin('/rasaai/pages/dashboard.html');
        return;
    }
    
    // Redirect to role-specific dashboard
    redirectToRoleDashboard();
}

async function setupAdminPage() {
    console.log('👑 Setting up Admin Page');
    protectPage('admin');
    
    if (typeof initCampaigns === 'function') initCampaigns();
    if (typeof initInventory === 'function') initInventory();
    if (typeof initCRM === 'function') initCRM();
    if (typeof initAnalytics === 'function') initAnalytics();
}

async function setupClientPage() {
    console.log('🏢 Setting up Client Page');
    protectPage('client');
    
    if (typeof initCampaigns === 'function') initCampaigns();
    if (typeof initInvoices === 'function') initInvoices();
    if (typeof initPayments === 'function') initPayments();
}

async function setupDriverPage() {
    console.log('🛺 Setting up Driver Page');
    protectPage('driver');
    
    if (typeof initAudioModule === 'function') initAudioModule();
}

async function setupAffiliatePage() {
    console.log('🔗 Setting up Affiliate Page');
    protectPage('affiliate');
    
    if (typeof initAffiliates === 'function') initAffiliates();
}

async function setupSalesPage() {
    console.log('💼 Setting up Sales Page');
    protectPage('sales');
    
    if (typeof initCRM === 'function') initCRM();
}

async function setupPassengerPage() {
    console.log('👤 Setting up Passenger Page');
    protectPage('passenger');
    
    if (typeof initScannerModule === 'function') initScannerModule();
}

async function setupCampaignPage() {
    console.log('📋 Setting up Campaign Page');
    
    // Pre-fill from calculator
    const params = getQueryParams();
    if (params.type && typeof prefillCalculator === 'function') {
        prefillCalculator(params.type, params.zone, 
            parseInt(params.rickshaws) || 5, 
            parseInt(params.days) || 7);
    }
}

async function setupInvoicePage() {
    console.log('📄 Setting up Invoice Page');
    if (typeof initInvoices === 'function') initInvoices();
}

async function setupAnalyticsPage() {
    console.log('📊 Setting up Analytics Page');
    if (typeof initAnalytics === 'function') initAnalytics();
    if (typeof renderAllCharts === 'function') setTimeout(renderAllCharts, 1000);
}

async function setupCRMPage() {
    console.log('👥 Setting up CRM Page');
    if (typeof initCRM === 'function') initCRM();
}

async function setupScanPage() {
    console.log('📷 Setting up Scan Page');
    if (typeof initScannerModule === 'function') initScannerModule();
}

async function setupRewardsPage() {
    console.log('🎁 Setting up Rewards Page');
    if (typeof initGamification === 'function') initGamification();
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

function registerServiceWorker() {
    if (!navigator.serviceWorker) return;
    
    navigator.serviceWorker.register('/rasaai/service-worker.js')
        .then(registration => {
            console.log('✅ Service Worker registered');
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showSnackbar('New version available!', () => {
                            window.location.reload();
                        }, 'Refresh');
                    }
                });
            });
        })
        .catch(error => {
            console.warn('⚠️ Service Worker registration failed:', error);
        });
}

// ============================================
// NETWORK DETECTION
// ============================================

function setupNetworkDetection() {
    window.addEventListener('online', () => {
        AppState.online = true;
        console.log('🌐 Online');
        hideOfflineIndicator();
        
        // Sync pending operations
        if (typeof processPendingOperations === 'function') {
            processPendingOperations();
        }
        if (typeof syncOfflineAudioLogs === 'function') {
            syncOfflineAudioLogs();
        }
        
        showToast('Back online! 📶', 'success', 3000);
    });
    
    window.addEventListener('offline', () => {
        AppState.online = false;
        console.log('📴 Offline');
        showOfflineIndicator();
        showToast('You are offline. Changes will be saved locally.', 'warning', 5000);
    });
}

function showOfflineIndicator() {
    let indicator = document.getElementById('offline-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #E74C3C;
            color: white;
            text-align: center;
            padding: 4px;
            font-size: 12px;
            font-weight: 600;
            z-index: 9999;
        `;
        indicator.textContent = '📴 You are offline';
        document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
}

function hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) indicator.style.display = 'none';
}

// ============================================
// LOADING SCREEN
// ============================================

function hideLoadingScreen() {
    const loader = document.getElementById('app-loading');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}

function showInitError(message) {
    const loader = document.getElementById('app-loading');
    if (loader) {
        loader.innerHTML = `
            <div style="text-align:center;color:#E74C3C;">
                <div style="font-size:48px;">⚠️</div>
                <h3>Failed to Load</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="padding:10px 24px;background:#221F60;color:white;border:none;border-radius:25px;cursor:pointer;font-size:14px;">
                    🔄 Retry
                </button>
            </div>`;
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            if (typeof closeAllModals === 'function') closeAllModals();
            if (typeof closeSidebar === 'function') closeSidebar();
        }
        
        // Ctrl+K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.header-search input, [id*="search"]');
            if (searchInput) searchInput.focus();
        }
        
        // Ctrl+D for dark mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            if (typeof toggleTheme === 'function') toggleTheme();
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Don't show toast for every error
    if (event.error && event.error instanceof RASAAIError) {
        // Already handled
        return;
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// ============================================
// APP LAUNCH
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded
    initApp();
}

// ============================================
// GLOBAL EXPORTS
// ============================================

// Make key functions globally available
window.RASAAI_APP = {
    init: initApp,
    state: AppState,
    version: APP_CONFIG.version,
    isOnline: () => AppState.online,
    isAuthenticated: () => AuthState?.isAuthenticated || false,
    getCurrentUser: () => AuthState?.currentUser || null,
    reload: () => window.location.reload(),
    goHome: () => window.location.href = '/rasaai/index.html'
};

console.log('✅ App Module Loaded');
console.log('🚀 RASAAI Ready');
