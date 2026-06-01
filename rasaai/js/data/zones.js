/*
 * Filename: zones.js
 * Path: /js/data/zones.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Complete 12 Mumbra zones data with stats, pricing, availability
 * Type: Data JavaScript
 */

// ============================================
// MUMBRA ZONES COMPLETE DATA
// ============================================

const MUMBRA_ZONES = [
    {
        id: 1,
        name: 'Kausa',
        slug: 'kausa',
        population: 45000,
        dailyTraffic: 85000,
        impressions: 125000,
        impressionsFormatted: '1.25L',
        peakHours: {
            morning: { start: '08:00', end: '10:00', label: '8-10 AM' },
            evening: { start: '17:00', end: '20:00', label: '5-8 PM' }
        },
        peakHoursLabel: '8-10 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        tierLabel: 'Medium Traffic',
        tierIcon: '🟡',
        isPremium: false,
        isDiscount: false,
        priceMultiplier: 1.0,
        baseLEDPrice: 1442,
        baseAudioPrice: 478,
        availableRickshaws: 50,
        activeRickshaws: 42,
        maintenanceRickshaws: 8,
        keyLandmarks: ['Kausa Market', 'Kausa Masjid', 'Kausa Bridge'],
        bestFor: ['Local shops', 'Restaurants', 'Medical stores'],
        description: 'Dense residential area with strong local commerce. Ideal for neighborhood businesses targeting family audiences.',
        coordinates: { lat: 19.1670, lng: 73.0860 },
        active: true
    },
    {
        id: 2,
        name: 'Mumbra Station',
        slug: 'mumbra-station',
        population: 78000,
        dailyTraffic: 150000,
        impressions: 220000,
        impressionsFormatted: '2.2L',
        peakHours: {
            morning: { start: '07:00', end: '10:00', label: '7-10 AM' },
            evening: { start: '16:00', end: '21:00', label: '4-9 PM' }
        },
        peakHoursLabel: '7-10 AM, 4-9 PM',
        density: 'High',
        tier: 'high',
        tierLabel: 'High Traffic 🔥',
        tierIcon: '🔴',
        isPremium: true,
        isDiscount: false,
        priceMultiplier: 1.20,
        baseLEDPrice: 1647,
        baseAudioPrice: 639,
        availableRickshaws: 50,
        activeRickshaws: 48,
        maintenanceRickshaws: 2,
        keyLandmarks: ['Mumbra Railway Station', 'Station Road', 'Bus Depot'],
        bestFor: ['Big brands', 'Chain stores', 'Service businesses', 'Events'],
        description: 'The busiest transit hub in Mumbra. Maximum visibility with commuter crowd. Premium pricing zone.',
        coordinates: { lat: 19.1765, lng: 73.0911 },
        active: true
    },
    {
        id: 3,
        name: 'Amrut Nagar',
        slug: 'amrut-nagar',
        population: 35000,
        dailyTraffic: 65000,
        impressions: 95000,
        impressionsFormatted: '95K',
        peakHours: {
            morning: { start: '09:00', end: '11:00', label: '9-11 AM' },
            evening: { start: '18:00', end: '20:00', label: '6-8 PM' }
        },
        peakHoursLabel: '9-11 AM, 6-8 PM',
        density: 'Low',
        tier: 'low',
        tierLabel: 'Low Traffic',
        tierIcon: '🟢',
        isPremium: false,
        isDiscount: true,
        priceMultiplier: 0.90,
        baseLEDPrice: 1238,
        baseAudioPrice: 318,
        availableRickshaws: 50,
        activeRickshaws: 30,
        maintenanceRickshaws: 20,
        keyLandmarks: ['Amrut Nagar Garden', 'Community Hall'],
        bestFor: ['Budget advertisers', 'New businesses', 'Test campaigns'],
        description: 'Quiet residential zone. Affordable option for testing campaigns or targeting specific local audience. 10% discount zone.',
        coordinates: { lat: 19.1720, lng: 73.0840 },
        active: true
    },
    {
        id: 4,
        name: 'Shilphata',
        slug: 'shilphata',
        population: 55000,
        dailyTraffic: 110000,
        impressions: 155000,
        impressionsFormatted: '1.55L',
        peakHours: {
            morning: { start: '07:00', end: '09:00', label: '7-9 AM' },
            evening: { start: '17:00', end: '21:00', label: '5-9 PM' }
        },
        peakHoursLabel: '7-9 AM, 5-9 PM',
        density: 'High',
        tier: 'high',
        tierLabel: 'High Traffic 🔥',
        tierIcon: '🔴',
        isPremium: true,
        isDiscount: false,
        priceMultiplier: 1.20,
        baseLEDPrice: 1647,
        baseAudioPrice: 639,
        availableRickshaws: 50,
        activeRickshaws: 45,
        maintenanceRickshaws: 5,
        keyLandmarks: ['Shilphata Junction', 'Highway Crossing', 'Industrial Area'],
        bestFor: ['Automobile', 'Logistics', 'Hardware', 'Industrial supplies'],
        description: 'Major junction connecting Mumbra to highways. Industrial and commercial traffic. High visibility premium zone.',
        coordinates: { lat: 19.1800, lng: 73.0950 },
        active: true
    },
    {
        id: 5,
        name: 'Retibunder',
        slug: 'retibunder',
        population: 28000,
        dailyTraffic: 52000,
        impressions: 78000,
        impressionsFormatted: '78K',
        peakHours: {
            morning: { start: '08:00', end: '10:00', label: '8-10 AM' },
            evening: { start: '16:00', end: '19:00', label: '4-7 PM' }
        },
        peakHoursLabel: '8-10 AM, 4-7 PM',
        density: 'Low',
        tier: 'low',
        tierLabel: 'Low Traffic',
        tierIcon: '🟢',
        isPremium: false,
        isDiscount: true,
        priceMultiplier: 0.90,
        baseLEDPrice: 1238,
        baseAudioPrice: 318,
        availableRickshaws: 50,
        activeRickshaws: 25,
        maintenanceRickshaws: 25,
        keyLandmarks: ['Retibunder Dock', 'Fishing Community', 'Coastal Road'],
        bestFor: ['Local businesses', 'Community services', 'Budget campaigns'],
        description: 'Coastal area with fishing community. Lower traffic but loyal local audience. 10% discount zone.',
        coordinates: { lat: 19.1650, lng: 73.0800 },
        active: true
    },
    {
        id: 6,
        name: 'Diva Junction',
        slug: 'diva-junction',
        population: 62000,
        dailyTraffic: 120000,
        impressions: 175000,
        impressionsFormatted: '1.75L',
        peakHours: {
            morning: { start: '06:00', end: '10:00', label: '6-10 AM' },
            evening: { start: '16:00', end: '22:00', label: '4-10 PM' }
        },
        peakHoursLabel: '6-10 AM, 4-10 PM',
        density: 'High',
        tier: 'high',
        tierLabel: 'High Traffic 🔥',
        tierIcon: '🔴',
        isPremium: true,
        isDiscount: false,
        priceMultiplier: 1.20,
        baseLEDPrice: 1647,
        baseAudioPrice: 639,
        availableRickshaws: 50,
        activeRickshaws: 46,
        maintenanceRickshaws: 4,
        keyLandmarks: ['Diva Railway Station', 'Diva Market', 'Diva Bridge'],
        bestFor: ['Retail chains', 'Restaurants', 'Education', 'Healthcare'],
        description: 'Second busiest transit point. Long operating hours with extended evening peak. Premium pricing zone.',
        coordinates: { lat: 19.1850, lng: 73.0880 },
        active: true
    },
    {
        id: 7,
        name: 'Mumbra Bypass',
        slug: 'mumbra-bypass',
        population: 38000,
        dailyTraffic: 72000,
        impressions: 105000,
        impressionsFormatted: '1.05L',
        peakHours: {
            morning: { start: '07:00', end: '09:00', label: '7-9 AM' },
            evening: { start: '17:00', end: '20:00', label: '5-8 PM' }
        },
        peakHoursLabel: '7-9 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        tierLabel: 'Medium Traffic',
        tierIcon: '🟡',
        isPremium: false,
        isDiscount: false,
        priceMultiplier: 1.0,
        baseLEDPrice: 1442,
        baseAudioPrice: 478,
        availableRickshaws: 50,
        activeRickshaws: 38,
        maintenanceRickshaws: 12,
        keyLandmarks: ['Bypass Highway', 'Petrol Pump', 'Toll Naka'],
        bestFor: ['Automobile', 'Travel services', 'Highway businesses'],
        description: 'Highway bypass route with steady traffic flow. Good for targeting commuters and travelers.',
        coordinates: { lat: 19.1700, lng: 73.0980 },
        active: true
    },
    {
        id: 8,
        name: 'Check Naka',
        slug: 'check-naka',
        population: 42000,
        dailyTraffic: 80000,
        impressions: 118000,
        impressionsFormatted: '1.18L',
        peakHours: {
            morning: { start: '08:00', end: '11:00', label: '8-11 AM' },
            evening: { start: '17:00', end: '21:00', label: '5-9 PM' }
        },
        peakHoursLabel: '8-11 AM, 5-9 PM',
        density: 'Medium',
        tier: 'medium',
        tierLabel: 'Medium Traffic',
        tierIcon: '🟡',
        isPremium: false,
        isDiscount: false,
        priceMultiplier: 1.0,
        baseLEDPrice: 1442,
        baseAudioPrice: 478,
        availableRickshaws: 50,
        activeRickshaws: 40,
        maintenanceRickshaws: 10,
        keyLandmarks: ['Check Post', 'Market Area', 'Police Station'],
        bestFor: ['Retail', 'Services', 'Local brands'],
        description: 'Busy checkpoint area with extended morning peak. Good mix of residential and commercial audience.',
        coordinates: { lat: 19.1750, lng: 73.0850 },
        active: true
    },
    {
        id: 9,
        name: 'Kalwa Route',
        slug: 'kalwa-route',
        population: 48000,
        dailyTraffic: 92000,
        impressions: 135000,
        impressionsFormatted: '1.35L',
        peakHours: {
            morning: { start: '07:00', end: '10:00', label: '7-10 AM' },
            evening: { start: '16:00', end: '20:00', label: '4-8 PM' }
        },
        peakHoursLabel: '7-10 AM, 4-8 PM',
        density: 'Medium',
        tier: 'medium',
        tierLabel: 'Medium Traffic',
        tierIcon: '🟡',
        isPremium: false,
        isDiscount: false,
        priceMultiplier: 1.0,
        baseLEDPrice: 1442,
        baseAudioPrice: 478,
        availableRickshaws: 50,
        activeRickshaws: 43,
        maintenanceRickshaws: 7,
        keyLandmarks: ['Kalwa Bridge', 'School Zone', 'Hospital Area'],
        bestFor: ['Education', 'Healthcare', 'Family businesses'],
        description: 'Route connecting Mumbra to Kalwa. Good for reaching both Mumbra and Kalwa audiences.',
        coordinates: { lat: 19.1820, lng: 73.0920 },
        active: true
    },
    {
        id: 10,
        name: 'Almas Colony',
        slug: 'almas-colony',
        population: 32000,
        dailyTraffic: 60000,
        impressions: 88000,
        impressionsFormatted: '88K',
        peakHours: {
            morning: { start: '09:00', end: '11:00', label: '9-11 AM' },
            evening: { start: '17:00', end: '19:00', label: '5-7 PM' }
        },
        peakHoursLabel: '9-11 AM, 5-7 PM',
        density: 'Low',
        tier: 'low',
        tierLabel: 'Low Traffic',
        tierIcon: '🟢',
        isPremium: false,
        isDiscount: true,
        priceMultiplier: 0.90,
        baseLEDPrice: 1238,
        baseAudioPrice: 318,
        availableRickshaws: 50,
        activeRickshaws: 28,
        maintenanceRickshaws: 22,
        keyLandmarks: ['Almas Masjid', 'Colony Gate', 'Local Market'],
        bestFor: ['Community businesses', 'Local services', 'Budget ads'],
        description: 'Close-knit residential colony. Loyal local audience. 10% discount for budget-friendly campaigns.',
        coordinates: { lat: 19.1680, lng: 73.0820 },
        active: true
    },
    {
        id: 11,
        name: 'Azad Nagar',
        slug: 'azad-nagar',
        population: 40000,
        dailyTraffic: 76000,
        impressions: 112000,
        impressionsFormatted: '1.12L',
        peakHours: {
            morning: { start: '08:00', end: '10:00', label: '8-10 AM' },
            evening: { start: '17:00', end: '20:00', label: '5-8 PM' }
        },
        peakHoursLabel: '8-10 AM, 5-8 PM',
        density: 'Medium',
        tier: 'medium',
        tierLabel: 'Medium Traffic',
        tierIcon: '🟡',
        isPremium: false,
        isDiscount: false,
        priceMultiplier: 1.0,
        baseLEDPrice: 1442,
        baseAudioPrice: 478,
        availableRickshaws: 50,
        activeRickshaws: 36,
        maintenanceRickshaws: 14,
        keyLandmarks: ['Azad Nagar Garden', 'Sports Ground', 'School'],
        bestFor: ['Sports', 'Education', 'Family products'],
        description: 'Family-oriented neighborhood with parks and schools. Steady medium-density traffic.',
        coordinates: { lat: 19.1730, lng: 73.0900 },
        active: true
    },
    {
        id: 12,
        name: 'Mumbra Market',
        slug: 'mumbra-market',
        population: 52000,
        dailyTraffic: 100000,
        impressions: 148000,
        impressionsFormatted: '1.48L',
        peakHours: {
            morning: { start: '08:00', end: '22:00', label: '8 AM - 10 PM' }
        },
        peakHoursLabel: '8 AM - 10 PM',
        density: 'High',
        tier: 'high',
        tierLabel: 'High Traffic 🔥',
        tierIcon: '🔴',
        isPremium: true,
        isDiscount: false,
        priceMultiplier: 1.20,
        baseLEDPrice: 1647,
        baseAudioPrice: 639,
        availableRickshaws: 50,
        activeRickshaws: 47,
        maintenanceRickshaws: 3,
        keyLandmarks: ['Mumbra Main Market', 'Shopping Complex', 'Masjid'],
        bestFor: ['Retail shops', 'Fashion', 'Electronics', 'Food brands'],
        description: 'The commercial heart of Mumbra. All-day high traffic with shoppers. Longest peak hours. Premium zone.',
        coordinates: { lat: 19.1740, lng: 73.0870 },
        active: true
    }
];

// ============================================
// ZONE CATEGORIES
// ============================================

const ZONE_CATEGORIES = {
    HIGH_TRAFFIC: {
        name: 'High Traffic Zones',
        multiplier: 1.20,
        label: '+20% Pricing',
        color: '#FF5A00',
        bgColor: '#FFF0E6',
        icon: '🔴',
        zones: ['Mumbra Station', 'Diva Junction', 'Mumbra Market', 'Shilphata']
    },
    MEDIUM_TRAFFIC: {
        name: 'Medium Traffic Zones',
        multiplier: 1.0,
        label: 'Standard Pricing',
        color: '#FFB800',
        bgColor: '#FFF8E6',
        icon: '🟡',
        zones: ['Kausa', 'Mumbra Bypass', 'Check Naka', 'Kalwa Route', 'Azad Nagar']
    },
    LOW_TRAFFIC: {
        name: 'Low Traffic Zones',
        multiplier: 0.90,
        label: '-10% Discount',
        color: '#00A86B',
        bgColor: '#E6F7F0',
        icon: '🟢',
        zones: ['Amrut Nagar', 'Retibunder', 'Almas Colony']
    }
};

// ============================================
// ZONE HELPER FUNCTIONS
// ============================================

function getZoneByName(name) {
    return MUMBRA_ZONES.find(z => z.name.toLowerCase() === name.toLowerCase()) || null;
}

function getZoneById(id) {
    return MUMBRA_ZONES.find(z => z.id === id) || null;
}

function getZoneBySlug(slug) {
    return MUMBRA_ZONES.find(z => z.slug === slug) || null;
}

function getPremiumZones() {
    return MUMBRA_ZONES.filter(z => z.isPremium);
}

function getDiscountZones() {
    return MUMBRA_ZONES.filter(z => z.isDiscount);
}

function getStandardZones() {
    return MUMBRA_ZONES.filter(z => !z.isPremium && !z.isDiscount);
}

function getZonesByTier(tier) {
    return MUMBRA_ZONES.filter(z => z.tier === tier);
}

function getActiveZones() {
    return MUMBRA_ZONES.filter(z => z.active);
}

function getZonePriceMultiplier(zoneName) {
    const zone = getZoneByName(zoneName);
    return zone ? zone.priceMultiplier : 1.0;
}

function getZoneLEDPrice(zoneName) {
    const zone = getZoneByName(zoneName);
    if (!zone) return PRICING.LED.MIN_PRICE;
    return Math.round(PRICING.LED.MIN_PRICE * zone.priceMultiplier);
}

function getZoneAudioPrice(zoneName) {
    const zone = getZoneByName(zoneName);
    if (!zone) return PRICING.AUDIO.MIN_PRICE;
    return Math.round(PRICING.AUDIO.MIN_PRICE * zone.priceMultiplier);
}

function getZoneComboPrice(zoneName) {
    return getZoneLEDPrice(zoneName) + getZoneAudioPrice(zoneName);
}

function getZoneImpressions(zoneName) {
    const zone = getZoneByName(zoneName);
    return zone ? zone.impressions : 0;
}

function getZoneDailyTraffic(zoneName) {
    const zone = getZoneByName(zoneName);
    return zone ? zone.dailyTraffic : 0;
}

function getZoneAvailableRickshaws(zoneName) {
    const zone = getZoneByName(zoneName);
    return zone ? zone.activeRickshaws : 0;
}

function getTotalAvailableRickshaws() {
    return MUMBRA_ZONES.reduce((sum, zone) => sum + zone.activeRickshaws, 0);
}

function getTotalImpressions() {
    return MUMBRA_ZONES.reduce((sum, zone) => sum + zone.impressions, 0);
}

function getTotalDailyTraffic() {
    return MUMBRA_ZONES.reduce((sum, zone) => sum + zone.dailyTraffic, 0);
}

function getTotalPopulation() {
    return MUMBRA_ZONES.reduce((sum, zone) => sum + zone.population, 0);
}

function getZoneNames() {
    return MUMBRA_ZONES.map(z => z.name);
}

function getZoneOptions() {
    return MUMBRA_ZONES.map(z => ({
        value: z.name,
        label: `${z.name} ${z.tierIcon}`,
        multiplier: z.priceMultiplier,
        isPremium: z.isPremium,
        isDiscount: z.isDiscount
    }));
}

function searchZones(query) {
    const q = query.toLowerCase().trim();
    if (!q) return MUMBRA_ZONES;
    
    return MUMBRA_ZONES.filter(z => 
        z.name.toLowerCase().includes(q) ||
        z.keyLandmarks.some(l => l.toLowerCase().includes(q)) ||
        z.bestFor.some(b => b.toLowerCase().includes(q)) ||
        z.description.toLowerCase().includes(q)
    );
}

function getZoneStats() {
    return {
        totalZones: MUMBRA_ZONES.length,
        activeZones: getActiveZones().length,
        premiumZones: getPremiumZones().length,
        discountZones: getDiscountZones().length,
        standardZones: getStandardZones().length,
        totalRickshaws: getTotalAvailableRickshaws(),
        totalImpressions: getTotalImpressions(),
        totalDailyTraffic: getTotalDailyTraffic(),
        totalPopulation: getTotalPopulation()
    };
}

function getZoneComparison(zones) {
    if (!zones || zones.length < 2) return null;
    
    const zoneData = zones.map(name => getZoneByName(name)).filter(Boolean);
    
    return {
        zones: zoneData.map(z => ({
            name: z.name,
            tier: z.tier,
            priceMultiplier: z.priceMultiplier,
            impressions: z.impressions,
            dailyTraffic: z.dailyTraffic,
            activeRickshaws: z.activeRickshaws
        })),
        totalImpressions: zoneData.reduce((sum, z) => sum + z.impressions, 0),
        averagePrice: zoneData.reduce((sum, z) => sum + z.priceMultiplier, 0) / zoneData.length,
        totalRickshaws: zoneData.reduce((sum, z) => sum + z.activeRickshaws, 0)
    };
}

function isZoneAvailable(zoneName, requiredRickshaws = 1) {
    const zone = getZoneByName(zoneName);
    if (!zone) return false;
    return zone.active && zone.activeRickshaws >= requiredRickshaws;
}

function getBestZonesFor(businessType) {
    const type = businessType.toLowerCase();
    
    const scored = MUMBRA_ZONES.map(zone => {
        let score = 0;
        
        // Check if business type matches zone's bestFor
        zone.bestFor.forEach(b => {
            if (type.includes(b.toLowerCase()) || b.toLowerCase().includes(type)) {
                score += 3;
            }
        });
        
        // Add score based on traffic
        if (zone.tier === 'high') score += 2;
        if (zone.tier === 'medium') score += 1;
        
        // Add score for available rickshaws
        score += zone.activeRickshaws / 10;
        
        return { ...zone, score };
    });
    
    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ============================================
// ZONE STATISTICS SUMMARY
// ============================================

const ZONE_STATS_SUMMARY = {
    totalZones: 12,
    totalPopulation: '5,15,000',
    totalDailyTraffic: '9,62,000',
    totalImpressions: '15,20,000',
    totalRickshaws: 600,
    activeRickshaws: 468,
    maintenanceRickshaws: 132,
    premiumZones: 4,
    standardZones: 5,
    discountZones: 3,
    averageRickshawsPerZone: 50,
    averageActivePerZone: 39
};

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Zones Module Loaded');
console.log(`📍 ${MUMBRA_ZONES.length} Zones Configured`);
console.log(`🚗 ${getTotalAvailableRickshaws()} Active Rickshaws`);
console.log(`👁️ ${formatCompactNumber(getTotalImpressions())} Total Daily Impressions`);
console.log(`🔴 ${getPremiumZones().length} Premium Zones (+20%)`);
console.log(`🟡 ${getStandardZones().length} Standard Zones`);
console.log(`🟢 ${getDiscountZones().length} Discount Zones (-10%)`);

// Freeze zone data
Object.freeze(MUMBRA_ZONES);
Object.freeze(ZONE_CATEGORIES);
Object.freeze(ZONE_STATS_SUMMARY);
