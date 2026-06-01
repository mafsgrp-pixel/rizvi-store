/*
 * Filename: calculator.js
 * Path: /js/modules/calculator.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Campaign cost calculator with real-time pricing, discounts, and GST
 * Type: Module JavaScript
 */

// ============================================
// CALCULATOR STATE
// ============================================

const CalculatorState = {
    type: 'LED',
    zone: 'Kausa',
    rickshaws: 5,
    days: 7,
    result: null,
    isCalculating: false,
    lastCalculated: null
};

// ============================================
// CALCULATOR INITIALIZATION
// ============================================

function initCalculator() {
    console.log('🧮 Initializing Campaign Calculator...');
    
    // Load cached calculator state
    loadCalculatorCache();
    
    // Set up event listeners
    setupCalculatorListeners();
    
    // Initial calculation
    updateCalculator();
    
    console.log('✅ Calculator Ready');
}

function setupCalculatorListeners() {
    // Type selector
    const typeSelect = document.getElementById('calc-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', function() {
            CalculatorState.type = this.value;
            updateCalculator();
            saveCalculatorCache();
        });
    }
    
    // Zone selector
    const zoneSelect = document.getElementById('calc-zone');
    if (zoneSelect) {
        zoneSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            CalculatorState.zone = selectedOption.value;
            updateCalculator();
            saveCalculatorCache();
        });
    }
    
    // Rickshaws slider
    const rickshawSlider = document.getElementById('calc-rickshaws');
    if (rickshawSlider) {
        rickshawSlider.addEventListener('input', function() {
            CalculatorState.rickshaws = parseInt(this.value);
            document.getElementById('rickshaws-value').textContent = this.value;
            updateCalculator();
            saveCalculatorCache();
        });
    }
    
    // Days slider
    const daysSlider = document.getElementById('calc-days');
    if (daysSlider) {
        daysSlider.addEventListener('input', function() {
            CalculatorState.days = parseInt(this.value);
            document.getElementById('days-value').textContent = this.value;
            updateCalculator();
            saveCalculatorCache();
        });
    }
}

// ============================================
// CALCULATION ENGINE
// ============================================

function updateCalculator() {
    if (CalculatorState.isCalculating) return;
    CalculatorState.isCalculating = true;
    
    const { type, zone, rickshaws, days } = CalculatorState;
    
    // Get current prices
    const basePrice = getPriceForType(type);
    const zoneMultiplier = getZonePriceMultiplier(zone);
    const pricePerRickshaw = Math.round(basePrice * zoneMultiplier);
    
    // Calculate costs
    const subtotal = pricePerRickshaw * rickshaws * days;
    
    // Calculate discounts
    let discountPercent = 0;
    let discountAmount = 0;
    
    // Bulk discount
    if (rickshaws >= PRICING_CONFIG.bulkMinRickshaws) {
        const bulkDisc = Math.round(subtotal * (PRICING_CONFIG.bulkDiscount / 100));
        discountAmount += bulkDisc;
        discountPercent += PRICING_CONFIG.bulkDiscount;
        
        document.getElementById('bulk-row').style.display = 'flex';
        document.getElementById('result-bulk').textContent = '-₹' + formatIndianNumber(bulkDisc);
    } else {
        document.getElementById('bulk-row').style.display = 'none';
    }
    
    // Long-term discount
    if (days >= PRICING_CONFIG.longTermMinDays) {
        const longDisc = Math.round(subtotal * (PRICING_CONFIG.longTermDiscount / 100));
        discountAmount += longDisc;
        discountPercent += PRICING_CONFIG.longTermDiscount;
        
        document.getElementById('longterm-row').style.display = 'flex';
        document.getElementById('result-longterm').textContent = '-₹' + formatIndianNumber(longDisc);
    } else {
        document.getElementById('longterm-row').style.display = 'none';
    }
    
    // After discount
    const afterDiscount = subtotal - discountAmount;
    
    // GST
    const gstAmount = Math.round(afterDiscount * (PRICING_CONFIG.gstRate / 100));
    
    // Grand total
    const grandTotal = afterDiscount + gstAmount;
    
    // Zone adjustment display
    const zoneAdjustment = pricePerRickshaw - basePrice;
    
    // Estimated impressions
    const dailyImpressions = getZoneImpressions(zone);
    const totalImpressions = dailyImpressions * rickshaws * days;
    
    // CPM
    const cpm = totalImpressions > 0 ? (grandTotal / (totalImpressions / 1000)) : 0;
    
    // Store result
    CalculatorState.result = {
        basePrice,
        zoneMultiplier,
        pricePerRickshaw,
        rickshaws,
        days,
        subtotal,
        discountAmount,
        discountPercent,
        afterDiscount,
        gstAmount,
        grandTotal,
        zoneAdjustment,
        dailyImpressions,
        totalImpressions,
        cpm
    };
    
    CalculatorState.lastCalculated = new Date().toISOString();
    
    // Update display
    updateCalculatorDisplay();
    
    CalculatorState.isCalculating = false;
}

function updateCalculatorDisplay() {
    const result = CalculatorState.result;
    if (!result) return;
    
    // Update result fields
    const basePriceEl = document.getElementById('result-base');
    if (basePriceEl) basePriceEl.textContent = '₹' + formatIndianNumber(result.subtotal);
    
    const zoneAdjEl = document.getElementById('result-zone');
    if (zoneAdjEl) {
        const sign = result.zoneAdjustment >= 0 ? '+' : '';
        zoneAdjEl.textContent = sign + '₹' + formatIndianNumber(result.zoneAdjustment * result.rickshaws * result.days);
    }
    
    const totalEl = document.getElementById('result-total');
    if (totalEl) totalEl.textContent = '₹' + formatIndianNumber(result.afterDiscount);
    
    const gstEl = document.getElementById('result-gst');
    if (gstEl) gstEl.textContent = '₹' + formatIndianNumber(result.gstAmount);
    
    const grandEl = document.getElementById('result-grand');
    if (grandEl) grandEl.textContent = '₹' + formatIndianNumber(result.grandTotal);
    
    // Update additional info if exists
    const impressionsEl = document.getElementById('result-impressions');
    if (impressionsEl) impressionsEl.textContent = formatCompactNumber(result.totalImpressions);
    
    const cpmEl = document.getElementById('result-cpm');
    if (cpmEl) cpmEl.textContent = '₹' + result.cpm.toFixed(2);
    
    const perDayEl = document.getElementById('result-per-day');
    if (perDayEl) perDayEl.textContent = '₹' + formatIndianNumber(Math.round(result.grandTotal / result.days));
}

// ============================================
// QUICK CALCULATE (Programmatic)
// ============================================

function quickCalculate(type, zone, rickshaws, days) {
    CalculatorState.type = type || CalculatorState.type;
    CalculatorState.zone = zone || CalculatorState.zone;
    CalculatorState.rickshaws = rickshaws || CalculatorState.rickshaws;
    CalculatorState.days = days || CalculatorState.days;
    
    updateCalculator();
    return CalculatorState.result;
}

function getCalculatorResult() {
    return CalculatorState.result;
}

function getCalculatorState() {
    return { ...CalculatorState };
}

// ============================================
// PRE-FILL CALCULATOR
// ============================================

function prefillCalculator(type, zone, rickshaws, days) {
    // Update type
    if (type) {
        const typeSelect = document.getElementById('calc-type');
        if (typeSelect) {
            typeSelect.value = type;
            CalculatorState.type = type;
        }
    }
    
    // Update zone
    if (zone) {
        const zoneSelect = document.getElementById('calc-zone');
        if (zoneSelect) {
            for (let i = 0; i < zoneSelect.options.length; i++) {
                if (zoneSelect.options[i].value === zone || 
                    zoneSelect.options[i].text.startsWith(zone)) {
                    zoneSelect.selectedIndex = i;
                    CalculatorState.zone = zoneSelect.options[i].value;
                    break;
                }
            }
        }
    }
    
    // Update rickshaws
    if (rickshaws) {
        const rickshawSlider = document.getElementById('calc-rickshaws');
        const rickshawValue = document.getElementById('rickshaws-value');
        if (rickshawSlider) {
            rickshawSlider.value = rickshaws;
            CalculatorState.rickshaws = parseInt(rickshaws);
        }
        if (rickshawValue) {
            rickshawValue.textContent = rickshaws;
        }
    }
    
    // Update days
    if (days) {
        const daysSlider = document.getElementById('calc-days');
        const daysValue = document.getElementById('days-value');
        if (daysSlider) {
            daysSlider.value = days;
            CalculatorState.days = parseInt(days);
        }
        if (daysValue) {
            daysValue.textContent = days;
        }
    }
    
    updateCalculator();
    saveCalculatorCache();
}

// ============================================
// FORMAT RESULT FOR DISPLAY
// ============================================

function formatCalculatorResult(result) {
    if (!result) return null;
    
    return {
        summary: {
            campaign: `${result.rickshaws} Rickshaw${result.rickshaws > 1 ? 's' : ''} × ${result.days} Day${result.days > 1 ? 's' : ''}`,
            zone: CalculatorState.zone,
            type: CalculatorState.type,
            pricePerUnit: '₹' + formatIndianNumber(result.pricePerRickshaw) + '/day/rickshaw'
        },
        costs: {
            baseTotal: '₹' + formatIndianNumber(result.subtotal),
            discount: result.discountAmount > 0 ? '-₹' + formatIndianNumber(result.discountAmount) : '₹0',
            afterDiscount: '₹' + formatIndianNumber(result.afterDiscount),
            gst: '₹' + formatIndianNumber(result.gstAmount) + ` (${PRICING_CONFIG.gstRate}%)`,
            grandTotal: '₹' + formatIndianNumber(result.grandTotal)
        },
        metrics: {
            dailyImpressions: formatCompactNumber(result.dailyImpressions),
            totalImpressions: formatCompactNumber(result.totalImpressions),
            cpm: '₹' + result.cpm.toFixed(2),
            costPerDay: '₹' + formatIndianNumber(Math.round(result.grandTotal / result.days))
        },
        discounts: []
    };
}

// ============================================
// SHARE CALCULATION
// ============================================

function shareCalculationViaWhatsApp() {
    const result = CalculatorState.result;
    if (!result) return;
    
    const message = `📊 *RASAAI Campaign Estimate*\n\n` +
                   `📋 Type: ${CalculatorState.type}\n` +
                   `📍 Zone: ${CalculatorState.zone}\n` +
                   `🛺 Rickshaws: ${result.rickshaws}\n` +
                   `📅 Days: ${result.days}\n\n` +
                   `💰 *Total Estimate: ₹${formatIndianNumber(result.grandTotal)}*\n` +
                   `(Includes GST: ₹${formatIndianNumber(result.gstAmount)})\n\n` +
                   `📊 Est. Impressions: ${formatCompactNumber(result.totalImpressions)}\n` +
                   `💡 CPM: ₹${result.cpm.toFixed(2)}\n\n` +
                   `_Book now at rizvi.store/rasaai_`;
    
    openWhatsApp(message);
}

function shareCalculationViaEmail() {
    const result = CalculatorState.result;
    if (!result) return;
    
    const subject = 'RASAAI Campaign Estimate';
    const body = `RASAAI Campaign Estimate\n\n` +
                 `Type: ${CalculatorState.type}\n` +
                 `Zone: ${CalculatorState.zone}\n` +
                 `Rickshaws: ${result.rickshaws}\n` +
                 `Days: ${result.days}\n\n` +
                 `Total Estimate: ₹${formatIndianNumber(result.grandTotal)}\n` +
                 `(Includes GST: ₹${formatIndianNumber(result.gstAmount)})\n\n` +
                 `Est. Impressions: ${formatCompactNumber(result.totalImpressions)}\n` +
                 `CPM: ₹${result.cpm.toFixed(2)}\n\n` +
                 `Book now at rizvi.store/rasaai`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function printCalculation() {
    window.print();
}

// ============================================
// COMPARISON MODE
// ============================================

function compareScenarios(scenario1, scenario2) {
    const result1 = quickCalculate(
        scenario1.type, scenario1.zone, 
        scenario1.rickshaws, scenario1.days
    );
    const result2 = quickCalculate(
        scenario2.type, scenario2.zone, 
        scenario2.rickshaws, scenario2.days
    );
    
    return {
        scenario1: {
            config: scenario1,
            result: result1
        },
        scenario2: {
            config: scenario2,
            result: result2
        },
        difference: {
            cost: result2.grandTotal - result1.grandTotal,
            impressions: result2.totalImpressions - result1.totalImpressions,
            cpm: result2.cpm - result1.cpm
        }
    };
}

// ============================================
// BUDGET CALCULATOR (Reverse)
// ============================================

function calculateFromBudget(budget, type, zone) {
    const basePrice = getPriceForType(type);
    const zoneMultiplier = getZonePriceMultiplier(zone);
    const pricePerRickshaw = Math.round(basePrice * zoneMultiplier);
    
    // Try different combinations
    const options = [];
    
    for (let rickshaws = 1; rickshaws <= PRICING_CONFIG.maxRickshaws; rickshaws++) {
        for (let days = 1; days <= PRICING_CONFIG.maxDays; days++) {
            const subtotal = pricePerRickshaw * rickshaws * days;
            
            // Apply discounts
            let discountAmount = 0;
            if (rickshaws >= PRICING_CONFIG.bulkMinRickshaws) {
                discountAmount += Math.round(subtotal * (PRICING_CONFIG.bulkDiscount / 100));
            }
            if (days >= PRICING_CONFIG.longTermMinDays) {
                discountAmount += Math.round(subtotal * (PRICING_CONFIG.longTermDiscount / 100));
            }
            
            const afterDiscount = subtotal - discountAmount;
            const gst = Math.round(afterDiscount * (PRICING_CONFIG.gstRate / 100));
            const total = afterDiscount + gst;
            
            if (total <= budget && total >= budget * 0.7) {
                options.push({
                    rickshaws,
                    days,
                    total,
                    impressions: getZoneImpressions(zone) * rickshaws * days,
                    cpm: total / (getZoneImpressions(zone) * rickshaws * days / 1000)
                });
            }
        }
    }
    
    // Sort by best value (lowest CPM)
    options.sort((a, b) => a.cpm - b.cpm);
    
    return options.slice(0, 10);
}

// ============================================
// CACHE MANAGEMENT
// ============================================

function saveCalculatorCache() {
    const cacheData = {
        type: CalculatorState.type,
        zone: CalculatorState.zone,
        rickshaws: CalculatorState.rickshaws,
        days: CalculatorState.days,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.CALCULATOR_CACHE, JSON.stringify(cacheData));
}

function loadCalculatorCache() {
    try {
        const cached = localStorage.getItem(STORAGE_KEYS.CALCULATOR_CACHE);
        if (!cached) return;
        
        const data = JSON.parse(cached);
        
        if (data.type) CalculatorState.type = data.type;
        if (data.zone) CalculatorState.zone = data.zone;
        if (data.rickshaws) CalculatorState.rickshaws = data.rickshaws;
        if (data.days) CalculatorState.days = data.days;
        
        // Update UI elements
        const typeSelect = document.getElementById('calc-type');
        if (typeSelect && data.type) typeSelect.value = data.type;
        
        const rickshawSlider = document.getElementById('calc-rickshaws');
        const rickshawValue = document.getElementById('rickshaws-value');
        if (rickshawSlider && data.rickshaws) {
            rickshawSlider.value = data.rickshaws;
        }
        if (rickshawValue && data.rickshaws) {
            rickshawValue.textContent = data.rickshaws;
        }
        
        const daysSlider = document.getElementById('calc-days');
        const daysValue = document.getElementById('days-value');
        if (daysSlider && data.days) {
            daysSlider.value = data.days;
        }
        if (daysValue && data.days) {
            daysValue.textContent = data.days;
        }
        
    } catch (error) {
        console.warn('⚠️ Failed to load calculator cache');
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

function proceedToBook() {
    const result = CalculatorState.result;
    if (!result) return;
    
    // Check if user is logged in
    if (!isAuthenticated()) {
        // Save calculation and redirect to login
        saveCalculatorCache();
        const params = new URLSearchParams({
            type: CalculatorState.type,
            zone: CalculatorState.zone,
            rickshaws: CalculatorState.rickshaws,
            days: CalculatorState.days,
            redirect: 'campaign'
        });
        window.location.href = `/rasaai/pages/login.html?${params.toString()}`;
        return;
    }
    
    // Navigate to campaign booking page
    const params = new URLSearchParams({
        type: CalculatorState.type,
        zone: CalculatorState.zone,
        rickshaws: CalculatorState.rickshaws,
        days: CalculatorState.days
    });
    window.location.href = `/rasaai/pages/campaign.html?${params.toString()}`;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calc-type')) {
        initCalculator();
    }
});

console.log('✅ Calculator Module Loaded');
