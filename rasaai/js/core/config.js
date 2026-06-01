/*
 * Filename: config.js
 * Path: /js/core/config.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Global configuration, Google API credentials, Sheet IDs, API keys
 * Type: Core JavaScript
 */

// ============================================
// GOOGLE CONFIGURATION
// ============================================

const GOOGLE_CONFIG = {
    // Google Sign-In Client ID
    // Get from: https://console.cloud.google.com/apis/credentials
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    
    // Google Sheets API
    spreadsheetId: 'YOUR_GOOGLE_SPREADSHEET_ID',
    apiKey: 'YOUR_GOOGLE_API_KEY',
    
    // Google Apps Script Backend URL
    // Deploy from: https://script.google.com/
    appsScriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Google Drive Folder for Audio Ads
    audioAdsFolderId: 'YOUR_AUDIO_ADS_FOLDER_ID',
    
    // Google Drive Folder for Creatives
    creativesFolderId: 'YOUR_CREATIVES_FOLDER_ID',
    
    // OAuth Scopes
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
};

// ============================================
// SHEET TAB NAMES
// ============================================

const SHEETS = {
    users: 'Users',
    sessions: 'Sessions',
    campaigns: 'Campaigns',
    invoices: 'Invoices',
    payments: 'Payments',
    leads: 'Leads',
    tasks: 'Tasks',
    referrals: 'Referrals',
    commissions: 'Commissions',
    withdrawals: 'Withdrawals',
    inventory: 'Inventory',
    attendance: 'Attendance',
    uploads: 'Uploads',
    gpsLogs: 'GPSLogs',
    audioLogs: 'AudioLogs',
    audioAds: 'AudioAds',
    scanLogs: 'ScanLogs',
    auditLogs: 'AuditLogs',
    priceHistory: 'PriceHistory',
    notifications: 'Notifications',
    settings: 'Settings',
    backupHistory: 'BackupHistory'
};

// ============================================
// APPLICATION CONFIGURATION
// ============================================

const APP_CONFIG = {
    // App Info
    name: 'RASAAI',
    fullName: 'RASAAI - Auto Rickshaw Advertising Network',
    version: '4.0.0',
    description: "India's first hyperlocal auto rickshaw advertising network",
    tagline: 'Your Ad on 600+ Moving Rickshaws Across Mumbra',
    
    // Domain
    domain: 'rizvi.store',
    basePath: '/rasaai',
    fullUrl: 'https://rizvi.store/rasaai',
    
    // Contact
    whatsappNumber: '919594306625',
    whatsappLink: 'https://wa.me/919594306625',
    phoneNumber: '+91 95943 06625',
    phoneLink: 'tel:+919594306625',
    email: 'hello@rasaai.com',
    emailLink: 'mailto:hello@rasaai.com',
    upiId: '9594306625@ybl',
    
    // Address
    address: 'Mumbra, Thane, Maharashtra',
    city: 'Mumbra',
    district: 'Thane',
    state: 'Maharashtra',
    country: 'India',
    
    // Social Media
    social: {
        facebook: 'https://facebook.com/rasaai',
        instagram: 'https://instagram.com/rasaai',
        twitter: 'https://twitter.com/rasaai',
        youtube: 'https://youtube.com/@rasaai',
        linkedin: 'https://linkedin.com/company/rasaai'
    }
};

// ============================================
// PRICING CONFIGURATION
// ============================================

const PRICING_CONFIG = {
    // LED Campaign
    led: {
        minPrice: 1238,        // ₹ per day per rickshaw
        maxPrice: 1647,
        updateFrequency: 15,   // minutes
        freeCreatives: 30      // FREE social media creatives
    },
    
    // Audio Campaign
    audio: {
        minPrice: 318,
        maxPrice: 639,
        updateFrequency: 15,
        adDuration: 60,        // seconds (default, admin can change)
        playInterval: 15       // seconds between ads (default, admin can change)
    },
    
    // Combo Campaign
    combo: {
        minPrice: 1556,        // LED min + Audio min
        maxPrice: 2286         // LED max + Audio max
    },
    
    // Booking Limits
    minRickshaws: 1,
    maxRickshaws: 50,
    minDays: 1,
    maxDays: 90,
    
    // Discounts
    bulkDiscount: 10,          // percentage off on 10+ rickshaws
    bulkMinRickshaws: 10,
    longTermDiscount: 5,       // percentage off on 30+ days
    longTermMinDays: 30,
    
    // GST
    gstRate: 18,               // percentage
    cgstRate: 9,               // percentage
    sgstRate: 9,               // percentage
    
    // Premium Zones (+20%)
    premiumZones: [
        'Mumbra Station',
        'Diva Junction',
        'Mumbra Market',
        'Shilphata'
    ],
    premiumZoneMarkup: 20,     // percentage
    
    // Low Traffic Zones (-10%)
    discountZones: [
        'Amrut Nagar',
        'Retibunder',
        'Almas Colony'
    ],
    lowTrafficDiscount: 10,    // percentage
};

// ============================================
// AFFILIATE CONFIGURATION
// ============================================

const AFFILIATE_CONFIG = {
    commissionRate: 10,        // percentage of booking value
    minWithdrawal: 500,        // ₹
    paymentMethods: ['UPI', 'Bank Transfer'],
    cookieDuration: 30,        // days
};

// ============================================
// DRIVER CONFIGURATION
// ============================================

const DRIVER_CONFIG = {
    dailyAttendance: 100,      // ₹ per day
    perAdPlay: 5,              // ₹ per audio ad played
    taskCompletion: 50,        // ₹ per completed task
    zoneAnnouncement: 2,       // ₹ per announcement
    maxPlaysPerDay: 200,       // default
};

// ============================================
// PASSENGER / REWARDS CONFIGURATION
// ============================================

const REWARDS_CONFIG = {
    perScan: 10,               // coins per QR scan
    dailyFirstScanBonus: 25,   // extra coins
    streakBonus: 50,           // bonus for 3+ day streak
    zoneExplorerBonus: 100,    // bonus for 5 different zones
    coinsToRupee: 100,         // 100 coins = ₹1
    minRedemption: 1000,       // minimum coins to redeem
};

// ============================================
// ZONE DATA
// ============================================

const ZONES = [
    {
        id: 1,
        name: 'Kausa',
        population: 45000,
        dailyTraffic: 85000,
        impressions: 125000,
        peakHours: '8-10 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        premium: false,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 2,
        name: 'Mumbra Station',
        population: 78000,
        dailyTraffic: 150000,
        impressions: 220000,
        peakHours: '7-10 AM, 4-9 PM',
        density: 'High',
        tier: 'high',
        premium: true,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 3,
        name: 'Amrut Nagar',
        population: 35000,
        dailyTraffic: 65000,
        impressions: 95000,
        peakHours: '9-11 AM, 6-8 PM',
        density: 'Low',
        tier: 'low',
        premium: false,
        discount: true,
        rickshaws: 50,
        active: true
    },
    {
        id: 4,
        name: 'Shilphata',
        population: 55000,
        dailyTraffic: 110000,
        impressions: 155000,
        peakHours: '7-9 AM, 5-9 PM',
        density: 'High',
        tier: 'high',
        premium: true,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 5,
        name: 'Retibunder',
        population: 28000,
        dailyTraffic: 52000,
        impressions: 78000,
        peakHours: '8-10 AM, 4-7 PM',
        density: 'Low',
        tier: 'low',
        premium: false,
        discount: true,
        rickshaws: 50,
        active: true
    },
    {
        id: 6,
        name: 'Diva Junction',
        population: 62000,
        dailyTraffic: 120000,
        impressions: 175000,
        peakHours: '6-10 AM, 4-10 PM',
        density: 'High',
        tier: 'high',
        premium: true,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 7,
        name: 'Mumbra Bypass',
        population: 38000,
        dailyTraffic: 72000,
        impressions: 105000,
        peakHours: '7-9 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        premium: false,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 8,
        name: 'Check Naka',
        population: 42000,
        dailyTraffic: 80000,
        impressions: 118000,
        peakHours: '8-11 AM, 5-9 PM',
        density: 'Medium',
        tier: 'medium',
        premium: false,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 9,
        name: 'Kalwa Route',
        population: 48000,
        dailyTraffic: 92000,
        impressions: 135000,
        peakHours: '7-10 AM, 4-8 PM',
        density: 'Medium',
        tier: 'medium',
        premium: false,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 10,
        name: 'Almas Colony',
        population: 32000,
        dailyTraffic: 60000,
        impressions: 88000,
        peakHours: '9-11 AM, 5-7 PM',
        density: 'Low',
        tier: 'low',
        premium: false,
        discount: true,
        rickshaws: 50,
        active: true
    },
    {
        id: 11,
        name: 'Azad Nagar',
        population: 40000,
        dailyTraffic: 76000,
        impressions: 112000,
        peakHours: '8-10 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        premium: false,
        discount: false,
        rickshaws: 50,
        active: true
    },
    {
        id: 12,
        name: 'Mumbra Market',
        population: 52000,
        dailyTraffic: 100000,
        impressions: 148000,
        peakHours: '8 AM - 10 PM',
        density: 'High',
        tier: 'high',
        premium: true,
        discount: false,
        rickshaws: 50,
        active: true
    }
];

// ============================================
// USER ROLES
// ============================================

const USER_ROLES = {
    super_admin: {
        name: 'Super Admin',
        level: 100,
        dashboard: '/rasaai/pages/admin.html',
        permissions: ['all']
    },
    admin: {
        name: 'Admin',
        level: 80,
        dashboard: '/rasaai/pages/admin.html',
        permissions: [
            'view_all', 'manage_users', 'manage_campaigns',
            'manage_zones', 'manage_inventory', 'view_analytics',
            'manage_invoices', 'verify_payments', 'manage_affiliates'
        ]
    },
    client: {
        name: 'Client',
        level: 50,
        dashboard: '/rasaai/pages/client.html',
        permissions: [
            'view_own_campaigns', 'create_campaign', 'view_own_analytics',
            'view_own_invoices', 'make_payment', 'manage_creatives',
            'view_own_wallet', 'access_affiliate'
        ]
    },
    driver: {
        name: 'Driver',
        level: 30,
        dashboard: '/rasaai/pages/driver.html',
        permissions: [
            'view_own_tasks', 'start_duty', 'view_own_earnings',
            'mark_attendance', 'upload_proof', 'view_own_stats'
        ]
    },
    affiliate: {
        name: 'Affiliate',
        level: 40,
        dashboard: '/rasaai/pages/affiliate.html',
        permissions: [
            'generate_links', 'view_own_referrals', 'view_own_commissions',
            'request_withdrawal', 'view_leaderboard'
        ]
    },
    sales: {
        name: 'Sales Representative',
        level: 60,
        dashboard: '/rasaai/pages/sales.html',
        permissions: [
            'manage_leads', 'view_pipeline', 'create_tasks',
            'view_own_targets', 'view_own_commissions', 'onboard_clients'
        ]
    },
    passenger: {
        name: 'Passenger',
        level: 10,
        dashboard: '/rasaai/pages/passenger.html',
        permissions: [
            'scan_qr', 'view_own_rewards', 'earn_coins',
            'redeem_coins', 'view_leaderboard', 'rate_ads'
        ]
    },
    guest: {
        name: 'Guest',
        level: 0,
        dashboard: '/rasaai/index.html',
        permissions: [
            'view_landing', 'view_zones', 'view_pricing',
            'use_calculator', 'register'
        ]
    }
};

// ============================================
// CAMPAIGN TYPES
// ============================================

const CAMPAIGN_TYPES = {
    led: {
        name: 'LED Screen Ad',
        icon: '🖥️',
        description: 'Digital LED display on rickshaw back',
        hasVisual: true,
        hasAudio: false,
        minPrice: 1238,
        maxPrice: 1647
    },
    audio: {
        name: 'Audio Announcement',
        icon: '🔊',
        description: 'Audio ad via Bluetooth speaker',
        hasVisual: false,
        hasAudio: true,
        minPrice: 318,
        maxPrice: 639
    },
    combo: {
        name: 'Combo (LED + Audio)',
        icon: '🔥',
        description: 'Maximum visibility with LED + Audio',
        hasVisual: true,
        hasAudio: true,
        minPrice: 1556,
        maxPrice: 2286
    }
};

// ============================================
// CAMPAIGN STATUS
// ============================================

const CAMPAIGN_STATUS = {
    draft: { label: 'Draft', color: 'gray', icon: '📝' },
    pending: { label: 'Pending Approval', color: 'yellow', icon: '⏳' },
    approved: { label: 'Approved', color: 'blue', icon: '✅' },
    active: { label: 'Active', color: 'green', icon: '▶️' },
    paused: { label: 'Paused', color: 'orange', icon: '⏸️' },
    completed: { label: 'Completed', color: 'navy', icon: '🏁' },
    cancelled: { label: 'Cancelled', color: 'red', icon: '❌' }
};

// ============================================
// PAYMENT STATUS
// ============================================

const PAYMENT_STATUS = {
    pending: { label: 'Pending', color: 'yellow' },
    verified: { label: 'Verified', color: 'green' },
    failed: { label: 'Failed', color: 'red' },
    refunded: { label: 'Refunded', color: 'gray' }
};

// ============================================
// INVOICE TYPES
// ============================================

const INVOICE_TYPES = {
    tax_invoice: 'Tax Invoice',
    proforma: 'Proforma Invoice',
    receipt: 'Payment Receipt',
    credit_note: 'Credit Note'
};

// ============================================
// DEMO USERS (For Development/Testing)
// ============================================

const DEMO_USERS = [
    {
        email: 'admin@rasaai.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'super_admin',
        phone: '9594306625',
        avatar: null,
        active: true
    },
    {
        email: 'client@rasaai.com',
        password: 'client123',
        name: 'Rahul Sharma',
        role: 'client',
        phone: '9876543210',
        company: 'Mumbra Pizza House',
        avatar: null,
        active: true
    },
    {
        email: 'driver@rasaai.com',
        password: 'driver123',
        name: 'Salman Khan',
        role: 'driver',
        phone: '9876543211',
        zone: 'Mumbra Station',
        rickshawId: 'RICK001',
        avatar: null,
        active: true
    },
    {
        email: 'driver2@rasaai.com',
        password: 'driver123',
        name: 'Anwar Hussain',
        role: 'driver',
        phone: '9876543212',
        zone: 'Kausa',
        rickshawId: 'RICK002',
        avatar: null,
        active: true
    },
    {
        email: 'affiliate@rasaai.com',
        password: 'affiliate123',
        name: 'Priya Patel',
        role: 'affiliate',
        phone: '9876543213',
        referralCode: 'REF001',
        avatar: null,
        active: true
    },
    {
        email: 'sales@rasaai.com',
        password: 'sales123',
        name: 'Amit Verma',
        role: 'sales',
        phone: '9876543214',
        target: 500000,
        avatar: null,
        active: true
    }
];

// ============================================
// SESSION CONFIGURATION
// ============================================

const SESSION_CONFIG = {
    timeout: 24 * 60 * 60 * 1000,  // 24 hours in milliseconds
    storageKey: 'rasaai_session',
    userKey: 'rasaai_user',
    rememberKey: 'rasaai_remember'
};

// ============================================
// FEATURE FLAGS
// ============================================

const FEATURES = {
    googleSignIn: true,
    googleSheets: true,
    dynamicPricing: true,
    audioAds: true,
    qrScanner: true,
    gamification: true,
    affiliateProgram: true,
    crmPipeline: true,
    darkMode: true,
    pwaEnabled: true,
    offlineMode: true,
    debugMode: false
};

// ============================================
// API ENDPOINTS
// ============================================

const API = {
    // Google Sheets API
    sheets: {
        base: 'https://sheets.googleapis.com/v4/spreadsheets',
        getValues: function(sheetName, range) {
            const fullRange = range ? `${sheetName}!${range}` : sheetName;
            return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${fullRange}?key=${GOOGLE_CONFIG.apiKey}`;
        },
        append: function(sheetName) {
            return `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${GOOGLE_CONFIG.apiKey}`;
        }
    },
    
    // Google Apps Script
    appsScript: function(action) {
        return `${GOOGLE_CONFIG.appsScriptUrl}?action=${action}`;
    }
};

// ============================================
// STORAGE KEYS (localStorage fallback)
// ============================================

const STORAGE_KEYS = {
    session: 'rasaai_session',
    user: 'rasaai_user',
    settings: 'rasaai_settings',
    theme: 'rasaai_theme',
    offlineData: 'rasaai_offline_data',
    offlineAudioLogs: 'offline_audio_logs',
    lastSync: 'rasaai_last_sync',
    calculatorCache: 'rasaai_calculator_cache',
    pricingCache: 'rasaai_pricing_cache'
};

// ============================================
// ERROR MESSAGES
// ============================================

const ERROR_MESSAGES = {
    auth: {
        loginFailed: 'Invalid email or password. Please try again.',
        googleSignInFailed: 'Google Sign-In failed. Please try again.',
        sessionExpired: 'Your session has expired. Please login again.',
        accessDenied: 'You do not have permission to access this page.',
        notAuthenticated: 'Please login to continue.'
    },
    sheets: {
        loadFailed: 'Unable to load data. Please check your internet connection.',
        saveFailed: 'Unable to save data. Please try again.',
        syncFailed: 'Data sync failed. Working in offline mode.',
        quotaExceeded: 'API quota exceeded. Please try again later.'
    },
    payment: {
        failed: 'Payment failed. Please try again.',
        invalidUpi: 'Invalid UPI ID. Please check and try again.',
        amountMismatch: 'Payment amount does not match invoice amount.'
    },
    campaign: {
        invalidZone: 'Please select a valid zone.',
        invalidQuantity: 'Number of rickshaws must be between 1 and 50.',
        invalidDuration: 'Campaign duration must be between 1 and 90 days.',
        bookingFailed: 'Campaign booking failed. Please try again.'
    },
    general: {
        networkError: 'Network error. Please check your connection.',
        unknownError: 'Something went wrong. Please try again.',
        required: 'This field is required.',
        invalidEmail: 'Please enter a valid email address.',
        invalidPhone: 'Please enter a valid 10-digit phone number.'
    }
};

// ============================================
// DATE FORMATS
// ============================================

const DATE_FORMATS = {
    display: 'DD MMM YYYY',
    full: 'DD MMM YYYY, hh:mm A',
    short: 'DD/MM/YYYY',
    iso: 'YYYY-MM-DD',
    time: 'hh:mm A',
    monthYear: 'MMM YYYY',
    dayMonth: 'DD MMM'
};

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ RASAAI Config Loaded');
console.log(`📋 Version: ${APP_CONFIG.version}`);
console.log(`🔗 Domain: ${APP_CONFIG.fullUrl}`);
console.log(`📊 ${ZONES.length} Zones Configured`);
console.log(`👥 ${Object.keys(USER_ROLES).length} User Roles`);
console.log(`💰 LED: ₹${PRICING_CONFIG.led.minPrice}-₹${PRICING_CONFIG.led.maxPrice}/day`);
console.log(`🔊 Audio: ₹${PRICING_CONFIG.audio.minPrice}-₹${PRICING_CONFIG.audio.maxPrice}/day`);

// Freeze config objects to prevent accidental modification
Object.freeze(GOOGLE_CONFIG);
Object.freeze(APP_CONFIG);
Object.freeze(PRICING_CONFIG);
Object.freeze(AFFILIATE_CONFIG);
Object.freeze(DRIVER_CONFIG);
Object.freeze(REWARDS_CONFIG);
Object.freeze(USER_ROLES);
Object.freeze(CAMPAIGN_TYPES);
Object.freeze(CAMPAIGN_STATUS);
Object.freeze(PAYMENT_STATUS);
Object.freeze(INVOICE_TYPES);
Object.freeze(SESSION_CONFIG);
Object.freeze(ERROR_MESSAGES);
Object.freeze(DATE_FORMATS);
