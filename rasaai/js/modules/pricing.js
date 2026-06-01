/*
 * Filename: pricing.js
 * Path: /js/modules/pricing.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: 15-minute dynamic pricing engine with live price updates
 * Type: Module JavaScript
 */

// ============================================
// PRICING STATE
// ============================================

const PricingState = {
    led: {
        current: 1442,
        min: 1238,
        max: 1647,
        history: [],
        lastUpdated: null,
        nextUpdate: null
    },
    audio: {
        current: 478,
        min: 318,
        max: 639,
        history: [],
        lastUpdated: null,
        nextUpdate: null
    },
    combo: {
        current: 1920,
        min: 1556,
        max: 2286,
        history: [],
        lastUpdated: null,
        nextUpdate: null
    },
    updateInterval: null,
    isUpdating: false,
    updateCount: 0
};

// ============================================
// PRICING ENGINE INITIALIZATION
// ============================================

function initPricing() {
    console.log('💰 Initializing Dynamic Pricing Engine...');
    
    // Load cached prices if available
    loadCachedPrices();
    
    // Generate initial prices if not cached
    if (!PricingState.led.lastUpdated) {
        generateInitialPrices();
    }
    
    // Start 15-minute update cycle
    startPricingCycle();
    
    // Update display
    updatePricingDisplay();
    
    // Start countdown display
    startCountdownDisplay();
    
    console.log(`✅ Pricing Engine Active`);
    console.log(`💡 LED: ₹${PricingState.led.current}/day (₹${PricingState.led.min}-₹${PricingState.led.max})`);
    console.log(`🔊 Audio: ₹${PricingState.audio.current}/day (₹${PricingState.audio.min}-₹${PricingState.audio.max})`);
    console.log(`🔥 Combo: ₹${PricingState.combo.current}/day`);
    console.log(`⏱️ Next update in: ${getMinutesUntilUpdate()} minutes`);
}

// ============================================
// PRICE CALCULATION
// ============================================

function generateInitialPrices() {
    const now = new Date();
    
    // LED Price
    PricingState.led.current = calculateDynamicPrice('led');
    PricingState.led.lastUpdated = now.toISOString();
    PricingState.led.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    // Audio Price
    PricingState.audio.current = calculateDynamicPrice('audio');
    PricingState.audio.lastUpdated = now.toISOString();
    PricingState.audio.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    // Combo Price
    PricingState.combo.current = PricingState.led.current + PricingState.audio.current;
    PricingState.combo.lastUpdated = now.toISOString();
    PricingState.combo.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    savePricesToCache();
}

function calculateDynamicPrice(type) {
    const config = type === 'led' ? PricingState.led : PricingState.audio;
    const { min, max } = config;
    
    // Factors affecting price:
    // 1. Time of day (peak hours = higher price)
    // 2. Day of week (weekdays vs weekend)
    // 3. Random demand fluctuation
    // 4. Available inventory
    
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0=Sunday, 6=Saturday
    
    // Time factor (0.8 to 1.2)
    let timeFactor = 1.0;
    if (hour >= 7 && hour <= 10) timeFactor = 1.15; // Morning peak
    else if (hour >= 17 && hour <= 21) timeFactor = 1.20; // Evening peak
    else if (hour >= 22 || hour <= 5) timeFactor = 0.85; // Night
    
    // Day factor (0.9 to 1.1)
    let dayFactor = 1.0;
    if (day === 0 || day === 6) dayFactor = 0.95; // Weekend slightly lower
    else if (day === 1) dayFactor = 1.05; // Monday slightly higher
    
    // Demand factor (random walk, 0.85 to 1.15)
    const demandFactor = 0.85 + Math.random() * 0.30;
    
    // Inventory factor (based on available rickshaws)
    const totalRickshaws = getTotalAvailableRickshaws();
    const inventoryFactor = totalRickshaws > 400 ? 0.90 : 
                            totalRickshaws > 300 ? 1.00 : 1.10;
    
    // Combined factor
    const combinedFactor = (timeFactor * 0.3) + 
                          (dayFactor * 0.2) + 
                          (demandFactor * 0.3) + 
                          (inventoryFactor * 0.2);
    
    // Calculate price
    const range = max - min;
    const price = min + (range * (combinedFactor - 0.85) / 0.30);
    
    // Clamp to min/max and round
    return Math.round(Math.min(Math.max(price, min), max));
}

function updatePrices() {
    if (PricingState.isUpdating) return;
    
    PricingState.isUpdating = true;
    const now = new Date();
    
    // Store history
    PricingState.led.history.push({
        price: PricingState.led.current,
        timestamp: PricingState.led.lastUpdated
    });
    PricingState.audio.history.push({
        price: PricingState.audio.current,
        timestamp: PricingState.audio.lastUpdated
    });
    
    // Keep only last 96 entries (24 hours of 15-min updates)
    if (PricingState.led.history.length > 96) {
        PricingState.led.history = PricingState.led.history.slice(-96);
        PricingState.audio.history = PricingState.audio.history.slice(-96);
    }
    
    // Calculate new prices
    const newLED = calculateDynamicPrice('led');
    const newAudio = calculateDynamicPrice('audio');
    
    // Update state
    PricingState.led.current = newLED;
    PricingState.led.lastUpdated = now.toISOString();
    PricingState.led.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    PricingState.audio.current = newAudio;
    PricingState.audio.lastUpdated = now.toISOString();
    PricingState.audio.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    PricingState.combo.current = newLED + newAudio;
    PricingState.combo.lastUpdated = now.toISOString();
    PricingState.combo.nextUpdate = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    
    PricingState.updateCount++;
    PricingState.isUpdating = false;
    
    // Save to cache
    savePricesToCache();
    
    // Update display
    updatePricingDisplay();
    
    // Reset countdown
    startCountdownDisplay();
    
    // Log price change
    logPriceChange('led', newLED);
    logPriceChange('audio', newAudio);
    
    console.log(`💰 Prices Updated (#${PricingState.updateCount})`);
    console.log(`💡 LED: ₹${newLED} | 🔊 Audio: ₹${newAudio} | 🔥 Combo: ₹${newLED + newAudio}`);
}

// ============================================
// PRICING CYCLE MANAGEMENT
// ============================================

function startPricingCycle() {
    // Clear existing interval
    if (PricingState.updateInterval) {
        clearInterval(PricingState.updateInterval);
    }
    
    // Update every 15 minutes (900000 ms)
    PricingState.updateInterval = setInterval(() => {
        updatePrices();
    }, 15 * 60 * 1000);
    
    console.log('⏱️ 15-minute pricing cycle started');
}

function stopPricingCycle() {
    if (PricingState.updateInterval) {
        clearInterval(PricingState.updateInterval);
        PricingState.updateInterval = null;
        console.log('⏱️ Pricing cycle stopped');
    }
}

function getMinutesUntilUpdate() {
    if (!PricingState.led.nextUpdate) return 15;
    
    const now = new Date();
    const next = new Date(PricingState.led.nextUpdate);
    const diffMs = next - now;
    
    return Math.max(0, Math.floor(diffMs / 60000));
}

function getSecondsUntilUpdate() {
    if (!PricingState.led.nextUpdate) return 900;
    
    const now = new Date();
    const next = new Date(PricingState.led.nextUpdate);
    const diffMs = next - now;
    
    return Math.max(0, Math.floor(diffMs / 1000));
}

// ============================================
// PRICE QUERIES
// ============================================

function getCurrentLEDPrice() {
    return PricingState.led.current;
}

function getCurrentAudioPrice() {
    return PricingState.audio.current;
}

function getCurrentComboPrice() {
    return PricingState.combo.current;
}

function getPriceForType(type) {
    switch (type.toLowerCase()) {
        case 'led': return PricingState.led.current;
        case 'audio': return PricingState.audio.current;
        case 'combo': return PricingState.combo.current;
        default: return PricingState.led.current;
    }
}

function getPriceForZone(type, zoneName) {
    const basePrice = getPriceForType(type);
    const multiplier = getZonePriceMultiplier(zoneName);
    return Math.round(basePrice * multiplier);
}

function getPriceHistory(type, limit = 24) {
    const history = type === 'led' ? PricingState.led.history : PricingState.audio.history;
    return history.slice(-limit);
}

function getPriceRange(type) {
    switch (type.toLowerCase()) {
        case 'led':
            return { min: PricingState.led.min, max: PricingState.led.max, current: PricingState.led.current };
        case 'audio':
            return { min: PricingState.audio.min, max: PricingState.audio.max, current: PricingState.audio.current };
        case 'combo':
            return { min: PricingState.combo.min, max: PricingState.combo.max, current: PricingState.combo.current };
        default:
            return { min: 0, max: 0, current: 0 };
    }
}

function getPriceChange(type) {
    const history = type === 'led' ? PricingState.led.history : PricingState.audio.history;
    if (history.length < 2) return { direction: 'same', amount: 0, percent: 0 };
    
    const previous = history[history.length - 2].price;
    const current = history[history.length - 1].price;
    const diff = current - previous;
    const percent = previous > 0 ? Math.round((diff / previous) * 100) : 0;
    
    return {
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
        amount: diff,
        percent: percent
    };
}

// ============================================
// CAMPAIGN COST CALCULATION
// ============================================

function calculateCampaignCost(type, zone, rickshaws, days) {
    const basePrice = getPriceForType(type);
    const zoneMultiplier = getZonePriceMultiplier(zone);
    const pricePerRickshaw = Math.round(basePrice * zoneMultiplier);
    
    // Base cost
    let totalCost = pricePerRickshaw * rickshaws * days;
    
    // Apply discounts
    let discountPercent = 0;
    let discountAmount = 0;
    const discounts = [];
    
    // Bulk discount (10+ rickshaws)
    if (rickshaws >= PRICING_CONFIG.bulkMinRickshaws) {
        const bulkDiscount = Math.round(totalCost * (PRICING_CONFIG.bulkDiscount / 100));
        discountAmount += bulkDiscount;
        discountPercent += PRICING_CONFIG.bulkDiscount;
        discounts.push({
            type: 'Bulk Discount',
            percent: PRICING_CONFIG.bulkDiscount,
            amount: bulkDiscount
        });
    }
    
    // Long-term discount (30+ days)
    if (days >= PRICING_CONFIG.longTermMinDays) {
        const longTermDiscount = Math.round(totalCost * (PRICING_CONFIG.longTermDiscount / 100));
        discountAmount += longTermDiscount;
        discountPercent += PRICING_CONFIG.longTermDiscount;
        discounts.push({
            type: 'Long-term Discount',
            percent: PRICING_CONFIG.longTermDiscount,
            amount: longTermDiscount
        });
    }
    
    const afterDiscount = totalCost - discountAmount;
    
    // GST
    const gstAmount = Math.round(afterDiscount * (PRICING_CONFIG.gstRate / 100));
    const cgst = Math.round(gstAmount / 2);
    const sgst = Math.round(gstAmount / 2);
    
    // Final total
    const grandTotal = afterDiscount + gstAmount;
    
    return {
        basePrice: basePrice,
        zoneMultiplier: zoneMultiplier,
        pricePerRickshaw: pricePerRickshaw,
        rickshaws: rickshaws,
        days: days,
        subtotal: totalCost,
        discounts: discounts,
        discountTotal: discountAmount,
        afterDiscount: afterDiscount,
        gst: {
            total: gstAmount,
            cgst: cgst,
            sgst: sgst,
            rate: PRICING_CONFIG.gstRate
        },
        grandTotal: grandTotal,
        estimatedImpressions: getZoneImpressions(zone) * rickshaws * days,
        cpm: grandTotal / (getZoneImpressions(zone) * rickshaws * days / 1000)
    };
}

// ============================================
// DISPLAY UPDATES
// ============================================

function updatePricingDisplay() {
    // Update LED price display
    const ledPriceEl = document.getElementById('led-price');
    if (ledPriceEl) {
        ledPriceEl.textContent = formatIndianNumber(PricingState.led.current);
        animatePriceChange(ledPriceEl);
    }
    
    // Update Audio price display
    const audioPriceEl = document.getElementById('audio-price');
    if (audioPriceEl) {
        audioPriceEl.textContent = formatIndianNumber(PricingState.audio.current);
        animatePriceChange(audioPriceEl);
    }
    
    // Update Combo price display
    const comboPriceEl = document.getElementById('combo-price');
    if (comboPriceEl) {
        comboPriceEl.textContent = formatIndianNumber(PricingState.combo.current);
        animatePriceChange(comboPriceEl);
    }
    
    // Update calculator if visible
    if (typeof updateCalculator === 'function') {
        updateCalculator();
    }
}

function animatePriceChange(element) {
    element.classList.add('price-updated');
    setTimeout(() => {
        element.classList.remove('price-updated');
    }, 600);
}

function startCountdownDisplay() {
    const countdownInterval = setInterval(() => {
        const seconds = getSecondsUntilUpdate();
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        // Update countdown displays
        const countdownEls = document.querySelectorAll('[id$="-update"]');
        countdownEls.forEach(el => {
            el.textContent = display;
        });
        
        // If countdown reached zero, stop
        if (seconds <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

// ============================================
// CACHE MANAGEMENT
// ============================================

function savePricesToCache() {
    const cacheData = {
        led: {
            current: PricingState.led.current,
            history: PricingState.led.history.slice(-24),
            lastUpdated: PricingState.led.lastUpdated,
            nextUpdate: PricingState.led.nextUpdate
        },
        audio: {
            current: PricingState.audio.current,
            history: PricingState.audio.history.slice(-24),
            lastUpdated: PricingState.audio.lastUpdated,
            nextUpdate: PricingState.audio.nextUpdate
        },
        combo: {
            current: PricingState.combo.current,
            lastUpdated: PricingState.combo.lastUpdated,
            nextUpdate: PricingState.combo.nextUpdate
        },
        updateCount: PricingState.updateCount,
        cachedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.PRICING_CACHE, JSON.stringify(cacheData));
}

function loadCachedPrices() {
    try {
        const cached = localStorage.getItem(STORAGE_KEYS.PRICING_CACHE);
        if (!cached) return false;
        
        const data = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(data.cachedAt).getTime();
        
        // Use cache if less than 16 minutes old
        if (cacheAge < 16 * 60 * 1000) {
            PricingState.led.current = data.led.current;
            PricingState.led.history = data.led.history || [];
            PricingState.led.lastUpdated = data.led.lastUpdated;
            PricingState.led.nextUpdate = data.led.nextUpdate;
            
            PricingState.audio.current = data.audio.current;
            PricingState.audio.history = data.audio.history || [];
            PricingState.audio.lastUpdated = data.audio.lastUpdated;
            PricingState.audio.nextUpdate = data.audio.nextUpdate;
            
            PricingState.combo.current = data.combo.current;
            PricingState.combo.lastUpdated = data.combo.lastUpdated;
            PricingState.combo.nextUpdate = data.combo.nextUpdate;
            
            PricingState.updateCount = data.updateCount || 0;
            
            console.log('📦 Prices loaded from cache');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Failed to load cached prices');
    }
    
    return false;
}

// ============================================
// ADMIN PRICE OVERRIDE
// ============================================

function overridePrice(type, newPrice) {
    if (!hasPermission('manage_campaigns')) {
        console.warn('⚠️ Price override denied: insufficient permissions');
        return false;
    }
    
    const config = type === 'led' ? PricingState.led : PricingState.audio;
    
    if (newPrice < config.min || newPrice > config.max) {
        console.warn(`⚠️ Price override out of range: ₹${newPrice}`);
        return false;
    }
    
    const oldPrice = config.current;
    config.current = newPrice;
    config.lastUpdated = new Date().toISOString();
    
    if (type === 'led' || type === 'combo') {
        PricingState.combo.current = PricingState.led.current + PricingState.audio.current;
    }
    
    savePricesToCache();
    updatePricingDisplay();
    
    console.log(`🔧 Price override: ${type.toUpperCase()} ₹${oldPrice} → ₹${newPrice}`);
    return true;
}

function resetPricesToDynamic() {
    updatePrices();
    console.log('🔄 Prices reset to dynamic calculation');
}

// ============================================
// PRICE LOGGING
// ============================================

function logPriceChange(type, newPrice) {
    if (!FEATURES.googleSheets) return;
    
    try {
        const logEntry = {
            type: type,
            price: newPrice,
            min: type === 'led' ? PricingState.led.min : PricingState.audio.min,
            max: type === 'led' ? PricingState.led.max : PricingState.audio.max,
            timestamp: new Date().toISOString(),
            update_count: PricingState.updateCount
        };
        
        // Log to price history sheet
        if (typeof sheetsAPI !== 'undefined') {
            sheetsAPI.appendRow(SHEETS.priceHistory, logEntry).catch(() => {});
        }
    } catch (error) {
        console.warn('⚠️ Price logging failed');
    }
}

// ============================================
// PRICING STATS
// ============================================

function getPricingStats() {
    const ledHistory = PricingState.led.history;
    const audioHistory = PricingState.audio.history;
    
    const calcStats = (history) => {
        if (history.length === 0) return { avg: 0, high: 0, low: 0, volatility: 0 };
        
        const prices = history.map(h => h.price);
        const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const volatility = Math.round(((high - low) / avg) * 100);
        
        return { avg, high, low, volatility };
    };
    
    return {
        led: calcStats(ledHistory),
        audio: calcStats(audioHistory),
        current: {
            led: PricingState.led.current,
            audio: PricingState.audio.current,
            combo: PricingState.combo.current
        },
        updateCount: PricingState.updateCount,
        lastUpdated: PricingState.led.lastUpdated,
        nextUpdate: PricingState.led.nextUpdate
    };
}

// ============================================
// INITIALIZATION
// ============================================

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    if (FEATURES && FEATURES.DYNAMIC_PRICING) {
        initPricing();
    }
});

// Also initialize immediately if DOM already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    if (FEATURES && FEATURES.DYNAMIC_PRICING) {
        setTimeout(initPricing, 100);
    }
}

console.log('✅ Pricing Module Loaded');
