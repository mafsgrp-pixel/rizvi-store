/*
 * Filename: templates.js
 * Path: /js/data/templates.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Campaign templates, creative guidelines, pre-built ad templates for all business types
 * Type: Data JavaScript
 */

// ============================================
// CAMPAIGN TEMPLATES
// ============================================

const CAMPAIGN_TEMPLATES = [
    {
        id: 'restaurant',
        name: 'Restaurant / Food Business',
        icon: '🍕',
        category: 'Food & Beverage',
        description: 'Perfect for restaurants, cafes, cloud kitchens, and food delivery businesses looking to attract local diners.',
        bestZones: ['Mumbra Station', 'Mumbra Market', 'Diva Junction', 'Kausa'],
        suggestedBudget: {
            min: 8666,
            max: 25000,
            recommended: 15000,
            duration: '7-14 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: 'Craving Delicious {CUISINE}?',
            subheadline: 'Order from {BUSINESS_NAME}',
            body: '🍕 Fresh & Hot\n🚀 Fast Delivery\n📍 {LOCATION}',
            cta: 'Order Now: {PHONE}',
            designTips: [
                'Use high-quality food photos',
                'Show your best-selling dishes',
                'Include your Zomato/Swiggy link QR',
                'Use bright appetizing colors'
            ]
        },
        audioTemplate: {
            script: "Craving delicious {CUISINE}? Visit {BUSINESS_NAME} at {LOCATION}! We serve fresh, hot {SIGNATURE_DISH} and more. Fast delivery available. Call {PHONE} or order online. {BUSINESS_NAME} - Taste the difference!",
            tips: [
                'Use upbeat background music',
                'Mention your signature dish',
                'Keep it under 30 seconds for best impact',
                'Add a limited-time offer for urgency'
            ]
        },
        sampleData: {
            business_name: 'Mumbra Pizza House',
            cuisine: 'Italian Pizza',
            location: 'Near Mumbra Station',
            phone: '9876543210',
            signature_dish: 'Tandoori Paneer Pizza'
        }
    },
    {
        id: 'clinic',
        name: 'Clinic / Healthcare',
        icon: '🏥',
        category: 'Healthcare',
        description: 'Ideal for doctors, dentists, clinics, diagnostic centers, and pharmacies.',
        bestZones: ['Kausa', 'Check Naka', 'Kalwa Route', 'Azad Nagar'],
        suggestedBudget: {
            min: 8666,
            max: 30000,
            recommended: 20000,
            duration: '14-30 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: '{SPECIALIZATION} Specialist',
            subheadline: 'Dr. {DOCTOR_NAME}',
            body: '🏥 {CLINIC_NAME}\n⏰ {TIMINGS}\n📍 {LOCATION}',
            cta: 'Book Appointment: {PHONE}',
            designTips: [
                'Use professional clean design',
                'Show doctor photo for trust',
                'Display qualifications',
                'Use calming blue/white colors'
            ]
        },
        audioTemplate: {
            script: "Your health is our priority. Visit {CLINIC_NAME} for expert {SPECIALIZATION} care by Dr. {DOCTOR_NAME}. We're located at {LOCATION}, open {TIMINGS}. Affordable consultation and advanced treatment. Call {PHONE} to book your appointment today!",
            tips: [
                'Use professional calm voice',
                'Mention experience years',
                'Highlight any special equipment',
                'Keep tone reassuring'
            ]
        },
        sampleData: {
            clinic_name: 'Khan Dental Clinic',
            doctor_name: 'Fatima Khan',
            specialization: 'Dental Care',
            location: 'Kausa Main Road',
            timings: '10 AM - 8 PM',
            phone: '9876543211'
        }
    },
    {
        id: 'retail',
        name: 'Retail Store / Shop',
        icon: '🏪',
        category: 'Retail',
        description: 'For clothing stores, electronics shops, grocery stores, and general retail businesses.',
        bestZones: ['Mumbra Market', 'Mumbra Station', 'Check Naka', 'Diva Junction'],
        suggestedBudget: {
            min: 8666,
            max: 20000,
            recommended: 12000,
            duration: '7-14 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: 'New Arrivals at {STORE_NAME}!',
            subheadline: '{PRODUCT_CATEGORY}',
            body: '🛍️ Best Prices\n📍 {LOCATION}\n🎉 Special Discounts',
            cta: 'Visit Us Today!',
            designTips: [
                'Showcase your products',
                'Use bold sale tags',
                'Show before/after pricing',
                'Include store exterior photo'
            ]
        },
        audioTemplate: {
            script: "Big savings at {STORE_NAME}! Discover the latest {PRODUCT_CATEGORY} at unbeatable prices. Visit us at {LOCATION} and enjoy special discounts on your first purchase. Hurry, offer valid for limited time! {STORE_NAME} - Quality you can trust.",
            tips: [
                'Mention specific discount percentage',
                'Create urgency with limited-time offers',
                'Describe product variety',
                'Add festive offers if applicable'
            ]
        },
        sampleData: {
            store_name: 'Patel General Store',
            product_category: 'Groceries & Household Items',
            location: 'Diva Market Area',
            phone: '9876543212'
        }
    },
    {
        id: 'education',
        name: 'Education / Coaching',
        icon: '📚',
        category: 'Education',
        description: 'For schools, coaching classes, tuition centers, and skill development institutes.',
        bestZones: ['Kausa', 'Azad Nagar', 'Kalwa Route', 'Amrut Nagar'],
        suggestedBudget: {
            min: 8666,
            max: 25000,
            recommended: 15000,
            duration: '14-21 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: 'Score Higher with {INSTITUTE_NAME}',
            subheadline: '{COURSES_OFFERED}',
            body: '✅ Expert Faculty\n✅ Study Material\n✅ {SUCCESS_RATE} Success Rate',
            cta: 'Enroll Now: {PHONE}',
            designTips: [
                'Show student success photos',
                'Display result statistics',
                'Use motivational colors',
                'Show your infrastructure'
            ]
        },
        audioTemplate: {
            script: "Give your child the best education at {INSTITUTE_NAME}! We offer {COURSES_OFFERED} with expert faculty and proven results. Our students have achieved {SUCCESS_RATE} success rate. Located at {LOCATION}. Call {PHONE} for a free demo class! Admissions open now.",
            tips: [
                'Highlight any awards or recognition',
                'Mention successful alumni',
                'Talk about teaching methodology',
                'Keep tone inspiring and confident'
            ]
        },
        sampleData: {
            institute_name: 'Bright Future Academy',
            courses_offered: 'SSC, HSC, JEE, NEET Coaching',
            success_rate: '95%',
            location: 'Azad Nagar Main Road',
            phone: '9876543213'
        }
    },
    {
        id: 'real_estate',
        name: 'Real Estate / Property',
        icon: '🏠',
        category: 'Real Estate',
        description: 'For builders, real estate agents, property dealers, and housing societies.',
        bestZones: ['Mumbra Bypass', 'Shilphata', 'Kalwa Route', 'Mumbra Station'],
        suggestedBudget: {
            min: 12000,
            max: 35000,
            recommended: 25000,
            duration: '21-30 days',
            rickshaws: '5-10'
        },
        ledTemplate: {
            headline: 'Your Dream Home Awaits!',
            subheadline: '{PROJECT_NAME}',
            body: '🏠 {CONFIG}\n📍 {LOCATION}\n💰 Starting {PRICE}',
            cta: 'Book a Visit: {PHONE}',
            designTips: [
                'Show property photos/renderings',
                'Display amenities icons',
                'Show location map',
                'Use aspirational imagery'
            ]
        },
        audioTemplate: {
            script: "Own your dream home at {PROJECT_NAME}! Spacious {CONFIG} apartments starting at just {PRICE}. Premium amenities, prime location at {LOCATION}. Easy payment plans available. Call {PHONE} to schedule a site visit today. {PROJECT_NAME} - Where dreams come home!",
            tips: [
                'Emphasize location advantages',
                'Mention nearby facilities (schools, hospitals)',
                'Talk about payment plans',
                'Create exclusivity feeling'
            ]
        },
        sampleData: {
            project_name: 'Green Valley Residency',
            config: '1, 2 & 3 BHK',
            location: 'Mumbra Bypass Road',
            price: '₹35 Lakhs',
            phone: '9876543214'
        }
    },
    {
        id: 'salon',
        name: 'Salon / Spa / Beauty',
        icon: '💇',
        category: 'Beauty & Wellness',
        description: 'For salons, spas, beauty parlors, and grooming centers.',
        bestZones: ['Mumbra Market', 'Mumbra Station', 'Kausa', 'Check Naka'],
        suggestedBudget: {
            min: 8666,
            max: 18000,
            recommended: 10000,
            duration: '7-14 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: 'Look Your Best at {SALON_NAME}',
            subheadline: '{SERVICES}',
            body: '💇 Expert Stylists\n💅 Premium Products\n🎁 First Visit Discount',
            cta: 'Book Now: {PHONE}',
            designTips: [
                'Use elegant feminine/masculine design',
                'Show before/after transformations',
                'Display service menu',
                'Use soothing colors'
            ]
        },
        audioTemplate: {
            script: "Pamper yourself at {SALON_NAME}! We offer {SERVICES} with expert stylists using premium products. Special {FIRST_VISIT_OFFER} for first-time customers. Visit us at {LOCATION} or call {PHONE} to book your appointment. {SALON_NAME} - Because you deserve the best!",
            tips: [
                'Use soothing background music',
                'Mention any celebrity stylist',
                'Talk about hygiene standards',
                'Create relaxation imagery'
            ]
        },
        sampleData: {
            salon_name: 'Style Studio Unisex Salon',
            services: 'Haircut, Facial, Massage, Bridal Makeup',
            first_visit_offer: '20% off on first visit',
            location: 'Mumbra Market Complex',
            phone: '9876543215'
        }
    },
    {
        id: 'event',
        name: 'Event Promotion',
        icon: '🎉',
        category: 'Events',
        description: 'For event organizers, wedding planners, exhibition promoters, and festival celebrations.',
        bestZones: ['Mumbra Station', 'Diva Junction', 'Mumbra Market', 'Mumbra Bypass'],
        suggestedBudget: {
            min: 5000,
            max: 15000,
            recommended: 8000,
            duration: '5-10 days',
            rickshaws: '5-10'
        },
        ledTemplate: {
            headline: '{EVENT_NAME}',
            subheadline: '{EVENT_TYPE}',
            body: '📅 {DATE}\n📍 {VENUE}\n🎟️ Entry: {ENTRY_FEE}',
            cta: 'Book Tickets: {PHONE}',
            designTips: [
                'Use bold vibrant event poster design',
                'Show event highlights',
                'Display date prominently',
                'Create urgency with limited tickets'
            ]
        },
        audioTemplate: {
            script: "Don't miss {EVENT_NAME}, the biggest {EVENT_TYPE} in Mumbra! Happening on {DATE} at {VENUE}. Enjoy {HIGHLIGHTS}. Entry just {ENTRY_FEE}. Limited seats available! Call {PHONE} or visit our website to book now. See you there!",
            tips: [
                'Create excitement in voice',
                'Add background music relevant to event',
                'Mention any celebrity appearances',
                'Use countdown urgency'
            ]
        },
        sampleData: {
            event_name: 'Mumbra Food Festival 2024',
            event_type: 'Food & Music Festival',
            date: '15-17 December 2024',
            venue: 'Mumbra Maidan',
            highlights: '50+ food stalls, live music, kids zone',
            entry_fee: 'Free Entry',
            phone: '9876543216'
        }
    },
    {
        id: 'automobile',
        name: 'Automobile / Garage',
        icon: '🔧',
        category: 'Automobile',
        description: 'For car/bike showrooms, garages, service centers, spare parts shops, and petrol pumps.',
        bestZones: ['Shilphata', 'Mumbra Bypass', 'Check Naka', 'Diva Junction'],
        suggestedBudget: {
            min: 8666,
            max: 20000,
            recommended: 12000,
            duration: '14-21 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: '{SERVICE_TYPE} Experts',
            subheadline: '{BUSINESS_NAME}',
            body: '🔧 {SERVICES}\n⚡ Fast Service\n📍 {LOCATION}',
            cta: 'Call Now: {PHONE}',
            designTips: [
                'Use bold mechanical colors (red, black, yellow)',
                'Show service bays or equipment',
                'Display brand logos you service',
                'Show price for common services'
            ]
        },
        audioTemplate: {
            script: "Is your vehicle due for service? Visit {BUSINESS_NAME}, the trusted {SERVICE_TYPE} experts in Mumbra. We offer {SERVICES} with genuine parts and warranty. Free pick-up and drop available. Located at {LOCATION}. Call {PHONE} to book your slot!",
            tips: [
                'Sound authoritative and trustworthy',
                'Mention any certifications',
                'Talk about warranty',
                'Add engine sound subtly in background'
            ]
        },
        sampleData: {
            business_name: 'Mumbra Auto Garage',
            service_type: 'Car & Bike Repair',
            services: 'Engine Repair, AC Service, Denting Painting',
            location: 'Shilphata Highway',
            phone: '9876543217'
        }
    },
    {
        id: 'gym',
        name: 'Gym / Fitness Center',
        icon: '💪',
        category: 'Fitness',
        description: 'For gyms, yoga centers, fitness studios, and sports facilities.',
        bestZones: ['Kausa', 'Mumbra Station', 'Azad Nagar', 'Kalwa Route'],
        suggestedBudget: {
            min: 8666,
            max: 18000,
            recommended: 12000,
            duration: '14-21 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: 'Transform Your Body!',
            subheadline: '{GYM_NAME}',
            body: '💪 {FACILITIES}\n⏰ {TIMINGS}\n💰 Starting {PRICE}/month',
            cta: 'Join Now: {PHONE}',
            designTips: [
                'Use energetic bold colors',
                'Show fit models (with permission)',
                'Display equipment photos',
                'Show transformation stories'
            ]
        },
        audioTemplate: {
            script: "Get fit, stay healthy! Join {GYM_NAME}, Mumbra's premium fitness center. We offer {FACILITIES} with certified trainers. Open {TIMINGS}. Memberships starting at just {PRICE} per month. First week FREE trial! Call {PHONE} or visit us at {LOCATION}. Your fitness journey starts here!",
            tips: [
                'Use energetic motivational voice',
                'Add upbeat workout music',
                'Mention free trial prominently',
                'Create community feeling'
            ]
        },
        sampleData: {
            gym_name: 'Iron Fitness Gym',
            facilities: 'Cardio, Weight Training, Yoga, Zumba',
            timings: '5 AM - 11 PM',
            price: '₹499',
            location: 'Kausa Main Road',
            phone: '9876543218'
        }
    },
    {
        id: 'other',
        name: 'Other Business',
        icon: '🏢',
        category: 'General',
        description: 'Generic template for any business type not covered above.',
        bestZones: ['All Zones'],
        suggestedBudget: {
            min: 8666,
            max: 20000,
            recommended: 12000,
            duration: '7-14 days',
            rickshaws: '3-5'
        },
        ledTemplate: {
            headline: '{HEADLINE}',
            subheadline: '{BUSINESS_NAME}',
            body: '{KEY_POINTS}',
            cta: 'Contact: {PHONE}',
            designTips: [
                'Use your brand colors',
                'Keep message clear and simple',
                'Include your logo prominently',
                'Add a clear call to action'
            ]
        },
        audioTemplate: {
            script: "Discover {BUSINESS_NAME}, your trusted {BUSINESS_TYPE} in Mumbra. We offer {KEY_SERVICES}. Visit us at {LOCATION} or call {PHONE} for more information. {BUSINESS_NAME} - {TAGLINE}!",
            tips: [
                'Keep it simple and clear',
                'Focus on your unique value proposition',
                'Mention location clearly',
                'End with a strong call to action'
            ]
        },
        sampleData: {
            business_name: 'Your Business Name',
            business_type: 'Your Service',
            headline: 'Best Service in Mumbra',
            key_services: 'Quality products and services',
            location: 'Your Address',
            phone: '9876543219',
            tagline: 'Service you can trust'
        }
    }
];

// ============================================
// CREATIVE GUIDELINES
// ============================================

const CREATIVE_GUIDELINES = {
    led: {
        name: 'LED Screen Guidelines',
        dimensions: {
            width: 960,
            height: 320,
            aspectRatio: '3:1',
            description: 'Landscape orientation for rickshaw back display'
        },
        fileFormats: ['JPG', 'PNG', 'GIF', 'MP4'],
        maxFileSize: '10 MB',
        maxDuration: '15 seconds (for video)',
        tips: [
            'Use large bold fonts for readability from distance',
            'Keep text minimal - 5-7 words maximum',
            'Use high contrast colors',
            'Include your logo for brand recognition',
            'Avoid QR codes that are too small to scan',
            'Test readability at 10-15 feet distance',
            'Use bright colors that pop in daylight',
            'Center your main message'
        ],
        restrictions: [
            'No political content',
            'No religious content',
            'No adult content',
            'No competitor brand names',
            'Must comply with ASCI guidelines'
        ]
    },
    audio: {
        name: 'Audio Ad Guidelines',
        duration: {
            min: 15,
            max: 60,
            recommended: 30,
            description: 'Seconds'
        },
        fileFormats: ['MP3', 'WAV', 'OGG', 'M4A', 'AAC'],
        maxFileSize: '20 MB',
        language: ['Hindi', 'Urdu', 'Marathi', 'English', 'Hinglish'],
        tips: [
            'Start with attention-grabbing opening',
            'Mention business name at least 3 times',
            'Speak clearly at moderate speed',
            'Include contact number twice',
            'Add gentle background music (optional)',
            'End with a strong call to action',
            'Keep tone friendly and local',
            'Use Hinglish for wider Mumbra appeal'
        ],
        restrictions: [
            'No loud/jarring sounds',
            'No misleading claims',
            'No political or religious content',
            'Volume must be comfortable for passengers',
            'Must include business identification'
        ]
    }
};

// ============================================
// 30 FREE SOCIAL MEDIA CREATIVE IDEAS
// ============================================

const FREE_SOCIAL_CREATIVES = [
    { id: 1, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Business Introduction' },
    { id: 2, type: 'Instagram Story', format: 'Vertical 1080x1920', template: 'Behind the Scenes' },
    { id: 3, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Offer Announcement' },
    { id: 4, type: 'WhatsApp Forward', format: 'Square 1080x1080', template: 'Customer Testimonial' },
    { id: 5, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Product Showcase' },
    { id: 6, type: 'Instagram Reel Cover', format: 'Vertical 1080x1920', template: 'Tip/Tutorial' },
    { id: 7, type: 'Facebook Cover', format: 'Horizontal 820x312', template: 'Brand Banner' },
    { id: 8, type: 'WhatsApp Status', format: 'Vertical 1080x1920', template: 'Flash Sale' },
    { id: 9, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Customer Review' },
    { id: 10, type: 'Instagram Story', format: 'Vertical 1080x1920', template: 'Poll/Quiz' },
    { id: 11, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Event Invitation' },
    { id: 12, type: 'WhatsApp Forward', format: 'Square 1080x1080', template: 'Festive Greeting' },
    { id: 13, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Before/After' },
    { id: 14, type: 'Instagram Reel Cover', format: 'Vertical 1080x1920', template: 'Business Tips' },
    { id: 15, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Team Introduction' },
    { id: 16, type: 'WhatsApp Status', format: 'Vertical 1080x1920', template: 'Daily Deal' },
    { id: 17, type: 'Instagram Post', format: 'Square 1080x1080', template: 'FAQ' },
    { id: 18, type: 'Instagram Story', format: 'Vertical 1080x1920', template: 'Countdown' },
    { id: 19, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Milestone Celebration' },
    { id: 20, type: 'WhatsApp Forward', format: 'Square 1080x1080', template: 'Referral Offer' },
    { id: 21, type: 'Instagram Post', format: 'Square 1080x1080', template: 'How-To Guide' },
    { id: 22, type: 'Instagram Reel Cover', format: 'Vertical 1080x1920', template: 'Myth vs Fact' },
    { id: 23, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Customer Spotlight' },
    { id: 24, type: 'WhatsApp Status', format: 'Vertical 1080x1920', template: 'Weekend Special' },
    { id: 25, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Industry Facts' },
    { id: 26, type: 'Instagram Story', format: 'Vertical 1080x1920', template: 'New Launch Teaser' },
    { id: 27, type: 'Facebook Post', format: 'Square 1080x1080', template: 'Holiday Announcement' },
    { id: 28, type: 'WhatsApp Forward', format: 'Square 1080x1080', template: 'Loyalty Program' },
    { id: 29, type: 'Instagram Post', format: 'Square 1080x1080', template: 'Community Involvement' },
    { id: 30, type: 'Instagram Reel Cover', format: 'Vertical 1080x1920', template: 'Year in Review' }
];

// ============================================
// TEMPLATE HELPER FUNCTIONS
// ============================================

function getTemplateById(id) {
    return CAMPAIGN_TEMPLATES.find(t => t.id === id) || null;
}

function getTemplateByName(name) {
    return CAMPAIGN_TEMPLATES.find(t => t.name.toLowerCase().includes(name.toLowerCase())) || null;
}

function getTemplatesByCategory(category) {
    return CAMPAIGN_TEMPLATES.filter(t => t.category.toLowerCase() === category.toLowerCase());
}

function getAllTemplateCategories() {
    return [...new Set(CAMPAIGN_TEMPLATES.map(t => t.category))];
}

function getTemplateForBusiness(businessType) {
    const keywords = businessType.toLowerCase().split(/\s+/);
    
    const scored = CAMPAIGN_TEMPLATES.map(template => {
        let score = 0;
        const templateText = (template.name + ' ' + template.category + ' ' + 
                             template.description + ' ' + template.bestZones.join(' ')).toLowerCase();
        
        keywords.forEach(keyword => {
            if (templateText.includes(keyword)) score++;
        });
        
        return { template, score };
    });
    
    const best = scored.sort((a, b) => b.score - a.score)[0];
    return best && best.score > 0 ? best.template : CAMPAIGN_TEMPLATES[CAMPAIGN_TEMPLATES.length - 1];
}

function fillTemplate(templateId, data) {
    const template = getTemplateById(templateId);
    if (!template) return null;
    
    const fillString = (str) => {
        if (!str) return '';
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            const val = data[key] || data[key.toLowerCase()] || data[key.toUpperCase()];
            return val !== undefined ? val : match;
        });
    };
    
    return {
        led: {
            headline: fillString(template.ledTemplate.headline),
            subheadline: fillString(template.ledTemplate.subheadline),
            body: fillString(template.ledTemplate.body),
            cta: fillString(template.ledTemplate.cta)
        },
        audio: {
            script: fillString(template.audioTemplate.script)
        }
    };
}

function getSuggestedBudget(templateId) {
    const template = getTemplateById(templateId);
    return template ? template.suggestedBudget : null;
}

function getBestZones(templateId) {
    const template = getTemplateById(templateId);
    if (!template) return [];
    if (template.bestZones.includes('All Zones')) return getZoneNames();
    return template.bestZones;
}

function getCreativeGuidelines(type) {
    return CREATIVE_GUIDELINES[type] || null;
}

function getFreeCreatives(count = 30) {
    return FREE_SOCIAL_CREATIVES.slice(0, Math.min(count, 30));
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Templates Module Loaded');
console.log(`📋 ${CAMPAIGN_TEMPLATES.length} Campaign Templates`);
console.log(`🎨 ${Object.keys(CREATIVE_GUIDELINES).length} Creative Guideline Sets`);
console.log(`🎁 ${FREE_SOCIAL_CREATIVES.length} Free Social Media Creatives`);

// Freeze data
Object.freeze(CAMPAIGN_TEMPLATES);
Object.freeze(CREATIVE_GUIDELINES);
Object.freeze(FREE_SOCIAL_CREATIVES);
