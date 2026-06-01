/*
 * Filename: demo-users.js
 * Path: /js/data/demo-users.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: 6 Demo user accounts with complete sample data for testing all roles
 * Type: Data JavaScript
 */

// ============================================
// DEMO USER ACCOUNTS
// ============================================

const DEMO_USERS = [
    {
        user_id: 'USR001',
        email: 'admin@rasaai.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'super_admin',
        phone: '9594306625',
        company: 'RASAAI',
        zone: '',
        rickshawId: '',
        referralCode: 'ADMIN01',
        avatar: null,
        active: true,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        last_login: null
    },
    {
        user_id: 'USR002',
        email: 'client@rasaai.com',
        password: 'client123',
        name: 'Rahul Sharma',
        role: 'client',
        phone: '9876543210',
        company: 'Mumbra Pizza House',
        zone: '',
        rickshawId: '',
        referralCode: 'RAHUL01',
        avatar: null,
        active: true,
        created_at: '2024-01-05T00:00:00.000Z',
        updated_at: '2024-01-05T00:00:00.000Z',
        last_login: null
    },
    {
        user_id: 'USR003',
        email: 'driver@rasaai.com',
        password: 'driver123',
        name: 'Salman Khan',
        role: 'driver',
        phone: '9876543211',
        company: '',
        zone: 'Mumbra Station',
        rickshawId: 'RICK001',
        referralCode: 'SALMAN01',
        avatar: null,
        active: true,
        created_at: '2024-01-10T00:00:00.000Z',
        updated_at: '2024-01-10T00:00:00.000Z',
        last_login: null
    },
    {
        user_id: 'USR004',
        email: 'driver2@rasaai.com',
        password: 'driver123',
        name: 'Anwar Hussain',
        role: 'driver',
        phone: '9876543212',
        company: '',
        zone: 'Kausa',
        rickshawId: 'RICK002',
        referralCode: 'ANWAR01',
        avatar: null,
        active: true,
        created_at: '2024-01-10T00:00:00.000Z',
        updated_at: '2024-01-10T00:00:00.000Z',
        last_login: null
    },
    {
        user_id: 'USR005',
        email: 'affiliate@rasaai.com',
        password: 'affiliate123',
        name: 'Priya Patel',
        role: 'affiliate',
        phone: '9876543213',
        company: '',
        zone: '',
        rickshawId: '',
        referralCode: 'PRIYA01',
        avatar: null,
        active: true,
        created_at: '2024-01-15T00:00:00.000Z',
        updated_at: '2024-01-15T00:00:00.000Z',
        last_login: null
    },
    {
        user_id: 'USR006',
        email: 'sales@rasaai.com',
        password: 'sales123',
        name: 'Amit Verma',
        role: 'sales',
        phone: '9876543214',
        company: '',
        zone: '',
        rickshawId: '',
        referralCode: 'AMIT01',
        avatar: null,
        active: true,
        created_at: '2024-01-20T00:00:00.000Z',
        updated_at: '2024-01-20T00:00:00.000Z',
        last_login: null,
        salesTarget: 500000
    }
];

// ============================================
// DEMO CAMPAIGNS (For Client Dashboard)
// ============================================

const DEMO_CAMPAIGNS = [
    {
        campaign_id: 'CAM001',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        company: 'Mumbra Pizza House',
        zone: 'Mumbra Station',
        type: 'led',
        rickshaws: 5,
        days: 7,
        start_date: '2024-01-15',
        end_date: '2024-01-22',
        status: 'completed',
        base_price: 8235,
        zone_adjustment: 1647,
        discount: 0,
        subtotal: 57645,
        gst: 10376,
        total_cost: 68021,
        creative_url: '',
        audio_url: '',
        impressions: 220000,
        scans: 145,
        created_at: '2024-01-10T00:00:00.000Z',
        updated_at: '2024-01-22T00:00:00.000Z'
    },
    {
        campaign_id: 'CAM002',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        company: 'Mumbra Pizza House',
        zone: 'Kausa',
        type: 'combo',
        rickshaws: 3,
        days: 14,
        start_date: '2024-02-01',
        end_date: '2024-02-15',
        status: 'active',
        base_price: 4668,
        zone_adjustment: 0,
        discount: 0,
        subtotal: 65352,
        gst: 11763,
        total_cost: 77115,
        creative_url: '',
        audio_url: '',
        impressions: 125000,
        scans: 89,
        created_at: '2024-01-25T00:00:00.000Z',
        updated_at: '2024-02-01T00:00:00.000Z'
    },
    {
        campaign_id: 'CAM003',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        company: 'Mumbra Pizza House',
        zone: 'Mumbra Market',
        type: 'audio',
        rickshaws: 2,
        days: 7,
        start_date: '2024-03-01',
        end_date: '2024-03-08',
        status: 'pending',
        base_price: 1278,
        zone_adjustment: 255,
        discount: 0,
        subtotal: 10731,
        gst: 1931,
        total_cost: 12662,
        creative_url: '',
        audio_url: 'https://drive.google.com/sample-audio/pizza-ad.mp3',
        impressions: 0,
        scans: 0,
        created_at: '2024-02-28T00:00:00.000Z',
        updated_at: '2024-02-28T00:00:00.000Z'
    }
];

// ============================================
// DEMO INVOICES
// ============================================

const DEMO_INVOICES = [
    {
        invoice_id: 'INV001',
        invoice_number: 'INV-2401-0001',
        campaign_id: 'CAM001',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        type: 'tax_invoice',
        amount: 57645,
        gst: 10376,
        total: 68021,
        status: 'paid',
        due_date: '2024-01-15',
        paid_date: '2024-01-14',
        created_at: '2024-01-10T00:00:00.000Z'
    },
    {
        invoice_id: 'INV002',
        invoice_number: 'INV-2402-0002',
        campaign_id: 'CAM002',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        type: 'tax_invoice',
        amount: 65352,
        gst: 11763,
        total: 77115,
        status: 'paid',
        due_date: '2024-02-01',
        paid_date: '2024-01-30',
        created_at: '2024-01-25T00:00:00.000Z'
    },
    {
        invoice_id: 'INV003',
        invoice_number: 'INV-2403-0003',
        campaign_id: 'CAM003',
        client_email: 'client@rasaai.com',
        client_name: 'Rahul Sharma',
        type: 'proforma',
        amount: 10731,
        gst: 1931,
        total: 12662,
        status: 'pending',
        due_date: '2024-03-01',
        paid_date: null,
        created_at: '2024-02-28T00:00:00.000Z'
    }
];

// ============================================
// DEMO PAYMENTS
// ============================================

const DEMO_PAYMENTS = [
    {
        payment_id: 'PAY001',
        invoice_id: 'INV001',
        client_email: 'client@rasaai.com',
        amount: 68021,
        method: 'upi',
        upi_id: 'rahul@okhdfc',
        transaction_id: 'UPI123456789',
        status: 'verified',
        verified_by: 'admin@rasaai.com',
        verified_at: '2024-01-14T10:30:00.000Z',
        created_at: '2024-01-14T10:25:00.000Z'
    },
    {
        payment_id: 'PAY002',
        invoice_id: 'INV002',
        client_email: 'client@rasaai.com',
        amount: 77115,
        method: 'upi',
        upi_id: 'rahul@okhdfc',
        transaction_id: 'UPI987654321',
        status: 'verified',
        verified_by: 'admin@rasaai.com',
        verified_at: '2024-01-30T14:00:00.000Z',
        created_at: '2024-01-30T13:55:00.000Z'
    }
];

// ============================================
// DEMO DRIVER DATA
// ============================================

const DEMO_DRIVER_DATA = {
    driver1: {
        attendance: [
            { date: '2024-02-01', check_in: '07:00', check_out: '21:00', status: 'present', earnings: 350, plays_count: 70 },
            { date: '2024-02-02', check_in: '07:15', check_out: '20:45', status: 'present', earnings: 400, plays_count: 80 },
            { date: '2024-02-03', check_in: '06:45', check_out: '21:15', status: 'present', earnings: 425, plays_count: 85 },
            { date: '2024-02-04', check_in: null, check_out: null, status: 'absent', earnings: 0, plays_count: 0 },
            { date: '2024-02-05', check_in: '07:00', check_out: '20:30', status: 'present', earnings: 375, plays_count: 75 }
        ],
        tasks: [
            { task_id: 'TSK001', title: 'Announce new pizza offer at Mumbra Station', status: 'done', due_date: '2024-02-01' },
            { task_id: 'TSK002', title: 'Distribute flyers at Diva Junction', status: 'done', due_date: '2024-02-03' },
            { task_id: 'TSK003', title: 'Report rickshaw LED screen condition', status: 'in_progress', due_date: '2024-02-10' }
        ],
        earnings: {
            today: 0,
            week: 1550,
            month: 6200,
            total: 24800
        }
    },
    driver2: {
        attendance: [
            { date: '2024-02-01', check_in: '08:00', check_out: '20:00', status: 'present', earnings: 300, plays_count: 60 },
            { date: '2024-02-02', check_in: '08:30', check_out: '19:30', status: 'present', earnings: 275, plays_count: 55 },
            { date: '2024-02-03', check_in: '07:45', check_out: '20:45', status: 'present', earnings: 350, plays_count: 70 },
            { date: '2024-02-04', check_in: '08:00', check_out: '19:00', status: 'half_day', earnings: 150, plays_count: 30 },
            { date: '2024-02-05', check_in: '08:15', check_out: '20:15', status: 'present', earnings: 325, plays_count: 65 }
        ],
        tasks: [
            { task_id: 'TSK004', title: 'Clean LED screen on rickshaw', status: 'done', due_date: '2024-02-01' },
            { task_id: 'TSK005', title: 'Test audio speaker volume', status: 'done', due_date: '2024-02-02' },
            { task_id: 'TSK006', title: 'Report passenger count for the week', status: 'todo', due_date: '2024-02-08' }
        ],
        earnings: {
            today: 0,
            week: 1400,
            month: 5600,
            total: 22400
        }
    }
};

// ============================================
// DEMO AFFILIATE DATA
// ============================================

const DEMO_AFFILIATE_DATA = {
    referrals: [
        { referral_id: 'REF001', code: 'PRIYA01', clicks: 245, leads: 45, conversions: 8, created_at: '2024-01-15' }
    ],
    commissions: [
        { commission_id: 'COM001', campaign_id: 'CAM004', amount: 6802, status: 'approved', earned_at: '2024-01-22' },
        { commission_id: 'COM002', campaign_id: 'CAM005', amount: 3855, status: 'approved', earned_at: '2024-02-05' },
        { commission_id: 'COM003', campaign_id: 'CAM006', amount: 2500, status: 'pending', earned_at: '2024-02-15' }
    ],
    withdrawals: [
        { withdrawal_id: 'WTH001', amount: 5000, method: 'upi', upi_id: 'priya@okhdfc', status: 'completed', requested_at: '2024-02-01', processed_at: '2024-02-03' }
    ],
    earnings: {
        total: 13157,
        pending: 2500,
        available: 5657,
        withdrawn: 5000
    }
};

// ============================================
// DEMO SALES DATA
// ============================================

const DEMO_SALES_DATA = {
    leads: [
        { lead_id: 'LEAD001', name: 'Vikas Gupta', company: 'Gupta Electronics', phone: '9876543201', email: 'vikas@email.com', source: 'whatsapp', status: 'won', assigned_to: 'sales@rasaai.com', notes: 'Interested in LED campaign for Mumbra Market', created_at: '2024-01-10', updated_at: '2024-01-20' },
        { lead_id: 'LEAD002', name: 'Sunita Reddy', company: 'Reddy Medical Store', phone: '9876543202', email: 'sunita@email.com', source: 'referral', status: 'negotiation', assigned_to: 'sales@rasaai.com', notes: 'Wants combo campaign, negotiating on duration', created_at: '2024-01-15', updated_at: '2024-02-01' },
        { lead_id: 'LEAD003', name: 'Mohammed Ali', company: 'Ali Bakery', phone: '9876543203', email: 'mohammed@email.com', source: 'website', status: 'qualified', assigned_to: 'sales@rasaai.com', notes: 'Small budget, needs affordable options', created_at: '2024-02-01', updated_at: '2024-02-05' },
        { lead_id: 'LEAD004', name: 'Kavita Sharma', company: 'Kavita Boutique', phone: '9876543204', email: 'kavita@email.com', source: 'social_media', status: 'contacted', assigned_to: 'sales@rasaai.com', notes: 'Seen our Instagram ad, requested callback', created_at: '2024-02-10', updated_at: '2024-02-10' },
        { lead_id: 'LEAD005', name: 'Rajesh Patil', company: 'Patil Hardware', phone: '9876543205', email: 'rajesh@email.com', source: 'walk_in', status: 'new', assigned_to: 'sales@rasaai.com', notes: 'Walk-in inquiry at office', created_at: '2024-02-12', updated_at: '2024-02-12' }
    ],
    tasks: [
        { task_id: 'TSK007', title: 'Follow up with Sunita Reddy', due_date: '2024-02-15', status: 'todo', priority: 'high' },
        { task_id: 'TSK008', title: 'Send proposal to Mohammed Ali', due_date: '2024-02-14', status: 'in_progress', priority: 'medium' },
        { task_id: 'TSK009', title: 'Call Kavita Sharma for demo', due_date: '2024-02-16', status: 'todo', priority: 'medium' }
    ],
    targets: {
        monthly: 500000,
        achieved: 145136,
        percentage: 29
    }
};

// ============================================
// DEMO PASSENGER DATA
// ============================================

const DEMO_PASSENGER_DATA = {
    scans: [
        { scan_id: 'SCN001', zone: 'Mumbra Station', campaign: 'Mumbra Pizza House', coins: 10, scanned_at: '2024-02-01T08:30:00' },
        { scan_id: 'SCN002', zone: 'Kausa', campaign: 'Khan Dental Clinic', coins: 10, scanned_at: '2024-02-02T10:15:00' },
        { scan_id: 'SCN003', zone: 'Diva Junction', campaign: 'Patel General Store', coins: 10, scanned_at: '2024-02-03T17:45:00' }
    ],
    rewards: {
        totalCoins: 350,
        scans: 15,
        streak: 3,
        zonesVisited: 3,
        redeemed: 0
    }
};

// ============================================
// DEMO INVENTORY DATA
// ============================================

const DEMO_INVENTORY = [
    { rickshaw_id: 'RICK001', driver_email: 'driver@rasaai.com', zone: 'Mumbra Station', status: 'active', has_led: true, has_speaker: true, last_maintenance: '2024-01-15', condition: 'good' },
    { rickshaw_id: 'RICK002', driver_email: 'driver2@rasaai.com', zone: 'Kausa', status: 'active', has_led: true, has_speaker: true, last_maintenance: '2024-01-20', condition: 'excellent' },
    { rickshaw_id: 'RICK003', driver_email: '', zone: 'Diva Junction', status: 'active', has_led: true, has_speaker: false, last_maintenance: '2024-01-10', condition: 'good' },
    { rickshaw_id: 'RICK004', driver_email: '', zone: 'Mumbra Market', status: 'maintenance', has_led: false, has_speaker: false, last_maintenance: '2024-02-01', condition: 'fair' },
    { rickshaw_id: 'RICK005', driver_email: '', zone: 'Shilphata', status: 'active', has_led: true, has_speaker: true, last_maintenance: '2024-01-25', condition: 'good' }
];

// ============================================
// DEMO AUDIO ADS
// ============================================

const DEMO_AUDIO_ADS = [
    {
        ad_id: 'AUD001',
        ad_name: 'Mumbra Pizza House Special',
        campaign_id: 'CAM002',
        advertiser_name: 'Mumbra Pizza House',
        audio_drive_url: 'https://drive.google.com/file/d/sample1/view',
        duration_seconds: 30,
        play_interval_seconds: 15,
        assigned_zones: 'Mumbra Station,Kausa,Mumbra Market',
        assigned_drivers: 'all',
        start_time: '07:00',
        end_time: '22:00',
        active_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
        max_plays_per_day: 200,
        priority: 'high',
        status: 'active',
        created_by: 'admin@rasaai.com',
        created_at: '2024-02-01T00:00:00.000Z'
    },
    {
        ad_id: 'AUD002',
        ad_name: 'Khan Dental Clinic Offer',
        campaign_id: 'CAM005',
        advertiser_name: 'Khan Dental Clinic',
        audio_drive_url: 'https://drive.google.com/file/d/sample2/view',
        duration_seconds: 30,
        play_interval_seconds: 30,
        assigned_zones: 'Kausa,Check Naka,Kalwa Route',
        assigned_drivers: 'all',
        start_time: '09:00',
        end_time: '20:00',
        active_days: 'Mon,Tue,Wed,Thu,Fri,Sat',
        max_plays_per_day: 150,
        priority: 'medium',
        status: 'active',
        created_by: 'admin@rasaai.com',
        created_at: '2024-02-05T00:00:00.000Z'
    }
];

// ============================================
// DEMO DATA HELPER FUNCTIONS
// ============================================

function getDemoUser(email) {
    return DEMO_USERS.find(u => u.email === email) || null;
}

function getDemoUserByRole(role) {
    return DEMO_USERS.find(u => u.role === role) || null;
}

function getDemoCampaigns(email) {
    return DEMO_CAMPAIGNS.filter(c => c.client_email === email);
}

function getDemoInvoices(email) {
    return DEMO_INVOICES.filter(i => i.client_email === email);
}

function getDemoPayments(email) {
    return DEMO_PAYMENTS.filter(p => p.client_email === email);
}

function getDemoDriverData(email) {
    if (email === 'driver@rasaai.com') return DEMO_DRIVER_DATA.driver1;
    if (email === 'driver2@rasaai.com') return DEMO_DRIVER_DATA.driver2;
    return null;
}

function getDemoAffiliateData() {
    return DEMO_AFFILIATE_DATA;
}

function getDemoSalesData() {
    return DEMO_SALES_DATA;
}

function getDemoPassengerData() {
    return DEMO_PASSENGER_DATA;
}

function getDemoInventory() {
    return DEMO_INVENTORY;
}

function getDemoAudioAds() {
    return DEMO_AUDIO_ADS;
}

function getAllDemoData() {
    return {
        users: DEMO_USERS,
        campaigns: DEMO_CAMPAIGNS,
        invoices: DEMO_INVOICES,
        payments: DEMO_PAYMENTS,
        driver1: DEMO_DRIVER_DATA.driver1,
        driver2: DEMO_DRIVER_DATA.driver2,
        affiliate: DEMO_AFFILIATE_DATA,
        sales: DEMO_SALES_DATA,
        passenger: DEMO_PASSENGER_DATA,
        inventory: DEMO_INVENTORY,
        audioAds: DEMO_AUDIO_ADS
    };
}

function validateDemoLogin(email, password) {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    return user || null;
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Demo Users Module Loaded');
console.log(`👥 ${DEMO_USERS.length} Demo Users`);
console.log(`📋 ${DEMO_CAMPAIGNS.length} Demo Campaigns`);
console.log(`📄 ${DEMO_INVOICES.length} Demo Invoices`);
console.log(`💳 ${DEMO_PAYMENTS.length} Demo Payments`);
console.log(`🚗 ${DEMO_INVENTORY.length} Demo Rickshaws`);
console.log(`🔊 ${DEMO_AUDIO_ADS.length} Demo Audio Ads`);

// Freeze demo data
Object.freeze(DEMO_USERS);
Object.freeze(DEMO_CAMPAIGNS);
Object.freeze(DEMO_INVOICES);
Object.freeze(DEMO_PAYMENTS);
Object.freeze(DEMO_DRIVER_DATA);
Object.freeze(DEMO_AFFILIATE_DATA);
Object.freeze(DEMO_SALES_DATA);
Object.freeze(DEMO_PASSENGER_DATA);
Object.freeze(DEMO_INVENTORY);
Object.freeze(DEMO_AUDIO_ADS);
