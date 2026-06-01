/*
 * Filename: constants.js
 * Path: /js/data/constants.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: All application constants, enums, labels, and static data
 * Type: Data JavaScript
 */

// ============================================
// APPLICATION CONSTANTS
// ============================================

const APP = {
    NAME: 'RASAAI',
    FULL_NAME: 'RASAAI - Auto Rickshaw Advertising Network',
    VERSION: '4.0.0',
    TAGLINE: "India's first hyperlocal auto rickshaw advertising network",
    DESCRIPTION: 'Connect local businesses with 5L+ daily commuters across 12 Mumbra zones through LED screen advertisements and audio announcements on 600+ moving rickshaws.',
    DOMAIN: 'rizvi.store',
    BASE_PATH: '/rasaai',
    FULL_URL: 'https://rizvi.store/rasaai',
    COPYRIGHT_YEAR: '2024',
    MADE_IN: 'Mumbra, Thane, Maharashtra, India'
};

// ============================================
// CONTACT CONSTANTS
// ============================================

const CONTACT = {
    WHATSAPP_NUMBER: '919594306625',
    WHATSAPP_LINK: 'https://wa.me/919594306625',
    PHONE: '+91 95943 06625',
    PHONE_LINK: 'tel:+919594306625',
    EMAIL: 'hello@rasaai.com',
    EMAIL_LINK: 'mailto:hello@rasaai.com',
    UPI_ID: '9594306625@ybl',
    UPI_LINK: 'upi://pay?pa=9594306625@ybl&pn=RASAAI',
    ADDRESS: 'Mumbra, Thane, Maharashtra - 400612',
    CITY: 'Mumbra',
    DISTRICT: 'Thane',
    STATE: 'Maharashtra',
    COUNTRY: 'India'
};

// ============================================
// SOCIAL MEDIA
// ============================================

const SOCIAL = {
    FACEBOOK: 'https://facebook.com/rasaai',
    INSTAGRAM: 'https://instagram.com/rasaai',
    TWITTER: 'https://twitter.com/rasaai',
    YOUTUBE: 'https://youtube.com/@rasaai',
    LINKEDIN: 'https://linkedin.com/company/rasaai'
};

// ============================================
// PRICING CONSTANTS
// ============================================

const PRICING = {
    LED: {
        MIN_PRICE: 1238,
        MAX_PRICE: 1647,
        UPDATE_FREQUENCY_MINUTES: 15,
        FREE_CREATIVES: 30,
        LABEL: 'LED Screen Ad',
        ICON: '🖥️',
        DESCRIPTION: 'Digital LED display on rickshaw back'
    },
    AUDIO: {
        MIN_PRICE: 318,
        MAX_PRICE: 639,
        UPDATE_FREQUENCY_MINUTES: 15,
        DEFAULT_DURATION_SECONDS: 60,
        DEFAULT_INTERVAL_SECONDS: 15,
        LABEL: 'Audio Announcement',
        ICON: '🔊',
        DESCRIPTION: 'Audio ad via Bluetooth speaker'
    },
    COMBO: {
        MIN_PRICE: 1556,
        MAX_PRICE: 2286,
        LABEL: 'Combo (LED + Audio)',
        ICON: '🔥',
        DESCRIPTION: 'Maximum visibility with LED + Audio'
    },
    BOOKING: {
        MIN_RICKSHAWS: 1,
        MAX_RICKSHAWS: 50,
        MIN_DAYS: 1,
        MAX_DAYS: 90
    },
    DISCOUNTS: {
        BULK_PERCENT: 10,
        BULK_MIN_RICKSHAWS: 10,
        LONG_TERM_PERCENT: 5,
        LONG_TERM_MIN_DAYS: 30
    },
    GST: {
        RATE: 18,
        CGST: 9,
        SGST: 9
    },
    ZONE_PRICING: {
        PREMIUM_ZONES: ['Mumbra Station', 'Diva Junction', 'Mumbra Market', 'Shilphata'],
        PREMIUM_MARKUP_PERCENT: 20,
        DISCOUNT_ZONES: ['Amrut Nagar', 'Retibunder', 'Almas Colony'],
        LOW_TRAFFIC_DISCOUNT_PERCENT: 10
    }
};

// ============================================
// AFFILIATE CONSTANTS
// ============================================

const AFFILIATE = {
    COMMISSION_RATE_PERCENT: 10,
    MIN_WITHDRAWAL: 500,
    PAYMENT_METHODS: ['UPI', 'Bank Transfer'],
    COOKIE_DURATION_DAYS: 30,
    LABEL: 'Affiliate Partner',
    DESCRIPTION: 'Earn 10% commission on every booking through your referral'
};

// ============================================
// DRIVER CONSTANTS
// ============================================

const DRIVER = {
    DAILY_ATTENDANCE_EARNING: 100,
    PER_AD_PLAY_EARNING: 5,
    TASK_COMPLETION_EARNING: 50,
    ZONE_ANNOUNCEMENT_EARNING: 2,
    MAX_PLAYS_PER_DAY: 200,
    LABEL: 'Rickshaw Driver',
    DESCRIPTION: 'Earn extra income through ads and tasks'
};

// ============================================
// PASSENGER / REWARDS CONSTANTS
// ============================================

const REWARDS = {
    COINS_PER_SCAN: 10,
    DAILY_FIRST_SCAN_BONUS: 25,
    STREAK_BONUS: 50,
    STREAK_MIN_DAYS: 3,
    ZONE_EXPLORER_BONUS: 100,
    ZONE_EXPLORER_MIN_ZONES: 5,
    COINS_TO_RUPEE_RATIO: 100,
    MIN_REDEMPTION_COINS: 1000,
    LABEL: 'Passenger Rewards',
    DESCRIPTION: 'Scan QR codes and earn rewards'
};

// ============================================
// USER ROLE DEFINITIONS
// ============================================

const ROLES = {
    SUPER_ADMIN: {
        id: 'super_admin',
        name: 'Super Admin',
        level: 100,
        icon: '👑',
        color: '#221F60',
        dashboard: '/rasaai/pages/admin.html',
        permissions: ['all']
    },
    ADMIN: {
        id: 'admin',
        name: 'Admin',
        level: 80,
        icon: '⚙️',
        color: '#2D2A6E',
        dashboard: '/rasaai/pages/admin.html',
        permissions: [
            'view_all', 'manage_users', 'manage_campaigns',
            'manage_zones', 'manage_inventory', 'view_analytics',
            'manage_invoices', 'verify_payments', 'manage_affiliates'
        ]
    },
    CLIENT: {
        id: 'client',
        name: 'Client',
        level: 50,
        icon: '🏢',
        color: '#FF5A00',
        dashboard: '/rasaai/pages/client.html',
        permissions: [
            'view_own_campaigns', 'create_campaign', 'view_own_analytics',
            'view_own_invoices', 'make_payment', 'manage_creatives',
            'view_own_wallet', 'access_affiliate'
        ]
    },
    DRIVER: {
        id: 'driver',
        name: 'Driver',
        level: 30,
        icon: '🛺',
        color: '#00A86B',
        dashboard: '/rasaai/pages/driver.html',
        permissions: [
            'view_own_tasks', 'start_duty', 'view_own_earnings',
            'mark_attendance', 'upload_proof', 'view_own_stats'
        ]
    },
    AFFILIATE: {
        id: 'affiliate',
        name: 'Affiliate',
        level: 40,
        icon: '🔗',
        color: '#FFB800',
        dashboard: '/rasaai/pages/affiliate.html',
        permissions: [
            'generate_links', 'view_own_referrals', 'view_own_commissions',
            'request_withdrawal', 'view_leaderboard'
        ]
    },
    SALES: {
        id: 'sales',
        name: 'Sales Representative',
        level: 60,
        icon: '💼',
        color: '#3498DB',
        dashboard: '/rasaai/pages/sales.html',
        permissions: [
            'manage_leads', 'view_pipeline', 'create_tasks',
            'view_own_targets', 'view_own_commissions', 'onboard_clients'
        ]
    },
    PASSENGER: {
        id: 'passenger',
        name: 'Passenger',
        level: 10,
        icon: '👤',
        color: '#8E44AD',
        dashboard: '/rasaai/pages/passenger.html',
        permissions: [
            'scan_qr', 'view_own_rewards', 'earn_coins',
            'redeem_coins', 'view_leaderboard', 'rate_ads'
        ]
    },
    GUEST: {
        id: 'guest',
        name: 'Guest',
        level: 0,
        icon: '👋',
        color: '#6C757D',
        dashboard: '/rasaai/index.html',
        permissions: [
            'view_landing', 'view_zones', 'view_pricing',
            'use_calculator', 'register'
        ]
    }
};

// ============================================
// CAMPAIGN STATUS DEFINITIONS
// ============================================

const CAMPAIGN_STATUSES = {
    DRAFT: {
        id: 'draft',
        label: 'Draft',
        color: '#6C757D',
        bgColor: '#F8F9FA',
        icon: '📝'
    },
    PENDING: {
        id: 'pending',
        label: 'Pending Approval',
        color: '#FFB800',
        bgColor: '#FFF8E6',
        icon: '⏳'
    },
    APPROVED: {
        id: 'approved',
        label: 'Approved',
        color: '#3498DB',
        bgColor: '#EBF5FB',
        icon: '✅'
    },
    ACTIVE: {
        id: 'active',
        label: 'Active',
        color: '#00A86B',
        bgColor: '#E6F7F0',
        icon: '▶️'
    },
    PAUSED: {
        id: 'paused',
        label: 'Paused',
        color: '#FF5A00',
        bgColor: '#FFF0E6',
        icon: '⏸️'
    },
    COMPLETED: {
        id: 'completed',
        label: 'Completed',
        color: '#221F60',
        bgColor: '#E8E7F4',
        icon: '🏁'
    },
    CANCELLED: {
        id: 'cancelled',
        label: 'Cancelled',
        color: '#E74C3C',
        bgColor: '#FDEDEC',
        icon: '❌'
    }
};

// ============================================
// PAYMENT STATUS DEFINITIONS
// ============================================

const PAYMENT_STATUSES = {
    PENDING: {
        id: 'pending',
        label: 'Pending',
        color: '#FFB800',
        bgColor: '#FFF8E6',
        icon: '⏳'
    },
    VERIFIED: {
        id: 'verified',
        label: 'Verified',
        color: '#00A86B',
        bgColor: '#E6F7F0',
        icon: '✅'
    },
    FAILED: {
        id: 'failed',
        label: 'Failed',
        color: '#E74C3C',
        bgColor: '#FDEDEC',
        icon: '❌'
    },
    REFUNDED: {
        id: 'refunded',
        label: 'Refunded',
        color: '#6C757D',
        bgColor: '#F1F3F5',
        icon: '↩️'
    }
};

// ============================================
// INVOICE TYPES
// ============================================

const INVOICE_TYPES = {
    TAX_INVOICE: {
        id: 'tax_invoice',
        label: 'Tax Invoice',
        description: 'GST-compliant invoice with CGST/SGST breakdown',
        icon: '📄'
    },
    PROFORMA: {
        id: 'proforma',
        label: 'Proforma Invoice',
        description: 'Pre-payment estimate',
        icon: '📋'
    },
    RECEIPT: {
        id: 'receipt',
        label: 'Payment Receipt',
        description: 'With transaction ID',
        icon: '🧾'
    },
    CREDIT_NOTE: {
        id: 'credit_note',
        label: 'Credit Note',
        description: 'For refund/cancellation',
        icon: '📝'
    }
};

// ============================================
// LEAD STATUS DEFINITIONS (CRM)
// ============================================

const LEAD_STATUSES = {
    NEW: { id: 'new', label: 'New Lead', color: '#3498DB', bgColor: '#EBF5FB' },
    CONTACTED: { id: 'contacted', label: 'Contacted', color: '#FFB800', bgColor: '#FFF8E6' },
    QUALIFIED: { id: 'qualified', label: 'Qualified', color: '#8E44AD', bgColor: '#F4E6FF' },
    PROPOSAL: { id: 'proposal', label: 'Proposal Sent', color: '#FF5A00', bgColor: '#FFF0E6' },
    NEGOTIATION: { id: 'negotiation', label: 'Negotiation', color: '#E67E22', bgColor: '#FDF2E9' },
    WON: { id: 'won', label: 'Won', color: '#00A86B', bgColor: '#E6F7F0' },
    LOST: { id: 'lost', label: 'Lost', color: '#E74C3C', bgColor: '#FDEDEC' }
};

// ============================================
// TASK STATUS DEFINITIONS
// ============================================

const TASK_STATUSES = {
    TODO: { id: 'todo', label: 'To Do', color: '#6C757D', bgColor: '#F8F9FA' },
    IN_PROGRESS: { id: 'in_progress', label: 'In Progress', color: '#3498DB', bgColor: '#EBF5FB' },
    DONE: { id: 'done', label: 'Done', color: '#00A86B', bgColor: '#E6F7F0' },
    CANCELLED: { id: 'cancelled', label: 'Cancelled', color: '#E74C3C', bgColor: '#FDEDEC' }
};

const TASK_PRIORITIES = {
    HIGH: { id: 'high', label: 'High', color: '#E74C3C', icon: '🔴' },
    MEDIUM: { id: 'medium', label: 'Medium', color: '#FFB800', icon: '🟡' },
    LOW: { id: 'low', label: 'Low', color: '#00A86B', icon: '🟢' }
};

// ============================================
// AUDIO AD CONSTANTS
// ============================================

const AUDIO_AD = {
    DURATIONS: [15, 30, 45, 60],
    INTERVALS: [15, 30, 60, 120, 300],
    MAX_PLAYS_PER_DAY: 500,
    PRIORITIES: {
        HIGH: { id: 'high', label: 'High - Play First', weight: 3 },
        MEDIUM: { id: 'medium', label: 'Medium', weight: 2 },
        LOW: { id: 'low', label: 'Low - Play When Others Done', weight: 1 }
    },
    DAYS_OF_WEEK: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    FILE_TYPES: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
    MAX_FILE_SIZE_MB: 20
};

// ============================================
// ATTENDANCE CONSTANTS
// ============================================

const ATTENDANCE = {
    STATUSES: {
        PRESENT: { id: 'present', label: 'Present', color: '#00A86B', icon: '✅' },
        ABSENT: { id: 'absent', label: 'Absent', color: '#E74C3C', icon: '❌' },
        HALF_DAY: { id: 'half_day', label: 'Half Day', color: '#FFB800', icon: '⏱️' },
        LEAVE: { id: 'leave', label: 'On Leave', color: '#3498DB', icon: '📅' }
    }
};

// ============================================
// INVENTORY CONSTANTS
// ============================================

const INVENTORY = {
    RICKSHAW_STATUSES: {
        ACTIVE: { id: 'active', label: 'Active', color: '#00A86B' },
        MAINTENANCE: { id: 'maintenance', label: 'Under Maintenance', color: '#FFB800' },
        INACTIVE: { id: 'inactive', label: 'Inactive', color: '#E74C3C' },
        ASSIGNED: { id: 'assigned', label: 'Assigned', color: '#3498DB' }
    },
    CONDITION: {
        EXCELLENT: { id: 'excellent', label: 'Excellent', color: '#00A86B' },
        GOOD: { id: 'good', label: 'Good', color: '#3498DB' },
        FAIR: { id: 'fair', label: 'Fair', color: '#FFB800' },
        POOR: { id: 'poor', label: 'Poor', color: '#E74C3C' }
    }
};

// ============================================
// NOTIFICATION TYPES
// ============================================

const NOTIFICATION_TYPES = {
    CAMPAIGN_APPROVED: { id: 'campaign_approved', icon: '✅', color: '#00A86B' },
    CAMPAIGN_STARTED: { id: 'campaign_started', icon: '▶️', color: '#3498DB' },
    CAMPAIGN_ENDED: { id: 'campaign_ended', icon: '🏁', color: '#221F60' },
    PAYMENT_RECEIVED: { id: 'payment_received', icon: '💰', color: '#00A86B' },
    PAYMENT_FAILED: { id: 'payment_failed', icon: '❌', color: '#E74C3C' },
    INVOICE_GENERATED: { id: 'invoice_generated', icon: '📄', color: '#3498DB' },
    TASK_ASSIGNED: { id: 'task_assigned', icon: '📋', color: '#FFB800' },
    TASK_COMPLETED: { id: 'task_completed', icon: '✅', color: '#00A86B' },
    COMMISSION_EARNED: { id: 'commission_earned', icon: '💸', color: '#FFB800' },
    WITHDRAWAL_PROCESSED: { id: 'withdrawal_processed', icon: '🏦', color: '#00A86B' },
    REWARD_EARNED: { id: 'reward_earned', icon: '🎁', color: '#8E44AD' },
    SYSTEM_ALERT: { id: 'system_alert', icon: '⚠️', color: '#FF5A00' }
};

// ============================================
// AUDIT LOG ACTIONS
// ============================================

const AUDIT_ACTIONS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',
    CREATE_CAMPAIGN: 'create_campaign',
    UPDATE_CAMPAIGN: 'update_campaign',
    DELETE_CAMPAIGN: 'delete_campaign',
    APPROVE_CAMPAIGN: 'approve_campaign',
    MAKE_PAYMENT: 'make_payment',
    VERIFY_PAYMENT: 'verify_payment',
    GENERATE_INVOICE: 'generate_invoice',
    CREATE_LEAD: 'create_lead',
    UPDATE_LEAD: 'update_lead',
    START_DUTY: 'start_duty',
    END_DUTY: 'end_duty',
    MARK_ATTENDANCE: 'mark_attendance',
    SCAN_QR: 'scan_qr',
    REDEEM_REWARD: 'redeem_reward',
    REQUEST_WITHDRAWAL: 'request_withdrawal',
    PROCESS_WITHDRAWAL: 'process_withdrawal',
    UPDATE_SETTINGS: 'update_settings',
    EXPORT_DATA: 'export_data',
    IMPORT_DATA: 'import_data'
};

// ============================================
// CHART COLORS
// ============================================

const CHART_COLORS = {
    PRIMARY: '#221F60',
    SECONDARY: '#FF5A00',
    ACCENT: '#FFB800',
    SUCCESS: '#00A86B',
    DANGER: '#E74C3C',
    INFO: '#3498DB',
    WARNING: '#FFB800',
    PURPLE: '#8E44AD',
    TEAL: '#1ABC9C',
    PINK: '#E91E63',
    
    PALETTE: [
        '#221F60', '#FF5A00', '#FFB800', '#00A86B', '#3498DB',
        '#E74C3C', '#8E44AD', '#1ABC9C', '#E91E63', '#795548',
        '#607D8B', '#FF9800', '#4CAF50', '#2196F3', '#F44336'
    ],
    
    PALETTE_LIGHT: [
        '#E8E7F4', '#FFF0E6', '#FFF8E6', '#E6F7F0', '#EBF5FB',
        '#FDEDEC', '#F4E6FF', '#E8F8F5', '#FCE4EC', '#EFEBE9',
        '#ECEFF1', '#FFF3E0', '#E8F5E9', '#E3F2FD', '#FFEBEE'
    ]
};

// ============================================
// PDF TYPES (32 Types)
// ============================================

const PDF_TYPES = {
    // Invoice PDFs (4)
    TAX_INVOICE: 'tax_invoice',
    PROFORMA_INVOICE: 'proforma_invoice',
    PAYMENT_RECEIPT: 'payment_receipt',
    CREDIT_NOTE: 'credit_note',
    
    // Campaign PDFs (4)
    CAMPAIGN_PERFORMANCE: 'campaign_performance',
    CAMPAIGN_COMPARISON: 'campaign_comparison',
    CAMPAIGN_PROPOSAL: 'campaign_proposal',
    CAMPAIGN_COMPLETION: 'campaign_completion',
    
    // Analytics PDFs (9)
    MONTHLY_ANALYTICS: 'monthly_analytics',
    ZONE_PERFORMANCE: 'zone_performance',
    CLIENT_SUMMARY: 'client_summary',
    DRIVER_PERFORMANCE: 'driver_performance',
    AFFILIATE_PERFORMANCE: 'affiliate_performance',
    SALES_REPORT: 'sales_report',
    PASSENGER_ENGAGEMENT: 'passenger_engagement',
    FINANCIAL_REPORT: 'financial_report',
    ANNUAL_REPORT: 'annual_report',
    
    // Operational PDFs (5)
    RICKSHAW_ASSIGNMENT: 'rickshaw_assignment',
    DRIVER_TASK_SHEET: 'driver_task_sheet',
    MAINTENANCE_REPORT: 'maintenance_report',
    INVENTORY_REPORT: 'inventory_report',
    ZONE_COVERAGE: 'zone_coverage',
    
    // Affiliate PDFs (4)
    COMMISSION_STATEMENT: 'commission_statement',
    WITHDRAWAL_RECEIPT: 'withdrawal_receipt',
    ANNUAL_EARNINGS: 'annual_earnings',
    REFERRAL_PERFORMANCE: 'referral_performance',
    
    // Driver PDFs (4)
    EARNINGS_STATEMENT: 'earnings_statement',
    ATTENDANCE_RECORD: 'attendance_record',
    TASK_COMPLETION: 'task_completion',
    ROUTE_SUMMARY: 'route_summary',
    
    // Passenger PDFs (2)
    REWARDS_STATEMENT: 'rewards_statement',
    WINNING_CERTIFICATE: 'winning_certificate'
};

// ============================================
// CAMPAIGN TEMPLATE TYPES
// ============================================

const CAMPAIGN_TEMPLATES = {
    RESTAURANT: {
        id: 'restaurant',
        label: 'Restaurant / Food Business',
        icon: '🍕',
        suggestedCreatives: ['Food images', 'Menu highlights', 'Special offers'],
        suggestedAudio: 'Mention signature dishes and location'
    },
    CLINIC: {
        id: 'clinic',
        label: 'Clinic / Healthcare',
        icon: '🏥',
        suggestedCreatives: ['Doctor photo', 'Services list', 'Timings'],
        suggestedAudio: 'Mention specializations and contact number'
    },
    RETAIL: {
        id: 'retail',
        label: 'Retail Store',
        icon: '🏪',
        suggestedCreatives: ['Product showcase', 'Discount banner', 'Store photo'],
        suggestedAudio: 'Mention products and ongoing offers'
    },
    EDUCATION: {
        id: 'education',
        label: 'Education / Coaching',
        icon: '📚',
        suggestedCreatives: ['Courses offered', 'Results/achievements', 'Faculty'],
        suggestedAudio: 'Mention courses and admission details'
    },
    REAL_ESTATE: {
        id: 'real_estate',
        label: 'Real Estate',
        icon: '🏠',
        suggestedCreatives: ['Property photos', 'Amenities', 'Location map'],
        suggestedAudio: 'Mention property highlights and pricing'
    },
    SALON: {
        id: 'salon',
        label: 'Salon / Spa',
        icon: '💇',
        suggestedCreatives: ['Services menu', 'Before/after photos', 'Packages'],
        suggestedAudio: 'Mention services and special packages'
    },
    EVENT: {
        id: 'event',
        label: 'Event Promotion',
        icon: '🎉',
        suggestedCreatives: ['Event poster', 'Date/Venue', 'Highlights'],
        suggestedAudio: 'Mention event details and ticket info'
    },
    OTHER: {
        id: 'other',
        label: 'Other Business',
        icon: '🏢',
        suggestedCreatives: ['Business logo', 'Products/Services', 'Contact details'],
        suggestedAudio: 'Describe your business and unique selling points'
    }
};

// ============================================
// LEAD SOURCES
// ============================================

const LEAD_SOURCES = {
    WEBSITE: { id: 'website', label: 'Website', icon: '🌐' },
    WHATSAPP: { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    PHONE: { id: 'phone', label: 'Phone Call', icon: '📞' },
    REFERRAL: { id: 'referral', label: 'Referral', icon: '🔗' },
    SOCIAL_MEDIA: { id: 'social_media', label: 'Social Media', icon: '📱' },
    WALK_IN: { id: 'walk_in', label: 'Walk-in', icon: '🚶' },
    EMAIL: { id: 'email', label: 'Email', icon: '✉️' },
    OTHER: { id: 'other', label: 'Other', icon: '📌' }
};

// ============================================
// WITHDRAWAL STATUS
// ============================================

const WITHDRAWAL_STATUSES = {
    PENDING: { id: 'pending', label: 'Pending', color: '#FFB800' },
    PROCESSING: { id: 'processing', label: 'Processing', color: '#3498DB' },
    COMPLETED: { id: 'completed', label: 'Completed', color: '#00A86B' },
    REJECTED: { id: 'rejected', label: 'Rejected', color: '#E74C3C' }
};

// ============================================
// DATE FORMATS
// ============================================

const DATE_FORMATS = {
    DISPLAY: 'DD MMM YYYY',
    FULL: 'DD MMM YYYY, hh:mm A',
    SHORT: 'DD/MM/YYYY',
    ISO: 'YYYY-MM-DD',
    TIME: 'hh:mm A',
    TIME_SECONDS: 'hh:mm:ss A',
    MONTH_YEAR: 'MMM YYYY',
    DAY_MONTH: 'DD MMM',
    DAY_NAME: 'dddd',
    MONTH_NAME: 'MMMM'
};

// ============================================
// PAGINATION
// ============================================

const PAGINATION = {
    DEFAULT_PER_PAGE: 20,
    PER_PAGE_OPTIONS: [10, 20, 50, 100],
    MAX_VISIBLE_PAGES: 5
};

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
    SESSION: 'rasaai_session',
    USER: 'rasaai_user',
    SETTINGS: 'rasaai_settings',
    THEME: 'rasaai_theme',
    OFFLINE_DATA: 'rasaai_offline_data',
    OFFLINE_AUDIO_LOGS: 'offline_audio_logs',
    LAST_SYNC: 'rasaai_last_sync',
    CALCULATOR_CACHE: 'rasaai_calculator_cache',
    PRICING_CACHE: 'rasaai_pricing_cache',
    PENDING_OPS: 'rasaai_pending_ops',
    NAV_PARAMS: 'rasaai_nav_params',
    PERSISTED_STATE: 'rasaai_persisted_state',
    REMEMBER_LOGIN: 'rasaai_remember',
    GOOGLE_SIGNUP: 'google_signup_data'
};

// ============================================
// FEATURE FLAGS
// ============================================

const FEATURES = {
    GOOGLE_SIGN_IN: true,
    GOOGLE_SHEETS: true,
    DYNAMIC_PRICING: true,
    AUDIO_ADS: true,
    QR_SCANNER: true,
    GAMIFICATION: true,
    AFFILIATE_PROGRAM: true,
    CRM_PIPELINE: true,
    DARK_MODE: true,
    PWA_ENABLED: true,
    OFFLINE_MODE: true,
    DEBUG_MODE: false
};

// ============================================
// ERROR MESSAGES
// ============================================

const ERRORS = {
    AUTH: {
        LOGIN_FAILED: 'Invalid email or password. Please try again.',
        GOOGLE_FAILED: 'Google Sign-In failed. Please try again.',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
        ACCESS_DENIED: 'You do not have permission to access this page.',
        NOT_AUTHENTICATED: 'Please login to continue.',
        ACCOUNT_INACTIVE: 'Your account has been deactivated. Contact admin.'
    },
    SHEETS: {
        LOAD_FAILED: 'Unable to load data. Please check your internet connection.',
        SAVE_FAILED: 'Unable to save data. Please try again.',
        SYNC_FAILED: 'Data sync failed. Working in offline mode.'
    },
    CAMPAIGN: {
        INVALID_ZONE: 'Please select a valid zone.',
        INVALID_QUANTITY: 'Number of rickshaws must be between 1 and 50.',
        INVALID_DURATION: 'Campaign duration must be between 1 and 90 days.',
        BOOKING_FAILED: 'Campaign booking failed. Please try again.'
    },
    PAYMENT: {
        FAILED: 'Payment failed. Please try again.',
        INVALID_UPI: 'Invalid UPI ID. Please check and try again.',
        AMOUNT_MISMATCH: 'Payment amount does not match invoice amount.'
    },
    GENERAL: {
        NETWORK: 'Network error. Please check your connection.',
        UNKNOWN: 'Something went wrong. Please try again.',
        REQUIRED: 'This field is required.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        INVALID_PHONE: 'Please enter a valid 10-digit phone number.'
    }
};

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Constants Module Loaded');
console.log(`📋 App: ${APP.FULL_NAME} v${APP.VERSION}`);
console.log(`👥 ${Object.keys(ROLES).length} User Roles`);
console.log(`📊 ${Object.keys(CAMPAIGN_STATUSES).length} Campaign Statuses`);
console.log(`💳 ${Object.keys(PAYMENT_STATUSES).length} Payment Statuses`);
console.log(`📄 ${Object.keys(PDF_TYPES).length} PDF Types`);

// Freeze all constants to prevent modification
Object.freeze(APP);
Object.freeze(CONTACT);
Object.freeze(SOCIAL);
Object.freeze(PRICING);
Object.freeze(AFFILIATE);
Object.freeze(DRIVER);
Object.freeze(REWARDS);
Object.freeze(ROLES);
Object.freeze(CAMPAIGN_STATUSES);
Object.freeze(PAYMENT_STATUSES);
Object.freeze(INVOICE_TYPES);
Object.freeze(LEAD_STATUSES);
Object.freeze(TASK_STATUSES);
Object.freeze(TASK_PRIORITIES);
Object.freeze(AUDIO_AD);
Object.freeze(ATTENDANCE);
Object.freeze(INVENTORY);
Object.freeze(NOTIFICATION_TYPES);
Object.freeze(AUDIT_ACTIONS);
Object.freeze(CHART_COLORS);
Object.freeze(PDF_TYPES);
Object.freeze(CAMPAIGN_TEMPLATES);
Object.freeze(LEAD_SOURCES);
Object.freeze(WITHDRAWAL_STATUSES);
Object.freeze(DATE_FORMATS);
Object.freeze(PAGINATION);
Object.freeze(STORAGE_KEYS);
Object.freeze(FEATURES);
Object.freeze(ERRORS);
