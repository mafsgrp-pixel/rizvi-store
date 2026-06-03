// ============================================
// RASAAI V2 - ROI & Eye View Calculator Engine
// ============================================

class CalculatorEngine {
    constructor() {
        this.calculations = {};
    }

    // Build Eye View Calculator
    buildEyeCalculator() {
        const container = document.getElementById('eyeCalculator');
        if (!container) return;

        container.innerHTML = `
            <div class="calculator-card card fade-up">
                <h3>👁️ Estimate Your Eye Views</h3>
                <div class="calc-inputs">
                    <div class="calc-input-group">
                        <label>Select Zone</label>
                        <select id="calcZone">
                            <option value="">All Zones (Average)</option>
                            ${Object.values(RASAAI_DATA.zones).map(z => 
                                `<option value="${z.id}">${z.name} (${z.rickshawCount} rickshaws)</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="calc-input-group">
                        <label>Number of Rickshaws</label>
                        <input type="range" id="calcRickshaws" min="1" max="50" value="10" 
                               oninput="document.getElementById('rickshawValue').textContent = this.value; calculatorEngine.calculateEyeViews()">
                        <span id="rickshawValue">10</span> rickshaws
                    </div>
                    <div class="calc-input-group">
                        <label>Campaign Duration (Days)</label>
                        <input type="range" id="calcDuration" min="7" max="90" value="30" 
                               oninput="document.getElementById('durationValue').textContent = this.value; calculatorEngine.calculateEyeViews()">
                        <span id="durationValue">30</span> days
                    </div>
                </div>
                <div class="calc-results" id="calcResults">
                    <div class="calc-result-item">
                        <span class="calc-result-icon">👁️</span>
                        <span class="calc-result-value" id="resultEyeViews">3,450,000</span>
                        <span class="calc-result-label">Estimated Eye Views</span>
                    </div>
                    <div class="calc-result-item">
                        <span class="calc-result-icon">👥</span>
                        <span class="calc-result-value" id="resultReach">2,553,000</span>
                        <span class="calc-result-label">Estimated Reach</span>
                    </div>
                    <div class="calc-result-item">
                        <span class="calc-result-icon">💰</span>
                        <span class="calc-result-value" id="resultCost">₹45,000</span>
                        <span class="calc-result-label">Estimated Cost</span>
                    </div>
                    <div class="calc-result-item">
                        <span class="calc-result-icon">📊</span>
                        <span class="calc-result-value" id="resultCPM">₹4.50</span>
                        <span class="calc-result-label">CPM (Eye View)</span>
                    </div>
                </div>
            </div>
        `;

        this.calculateEyeViews();
    }

    calculateEyeViews() {
        const zoneId = document.getElementById('calcZone')?.value;
        const rickshaws = parseInt(document.getElementById('calcRickshaws')?.value || 10);
        const duration = parseInt(document.getElementById('calcDuration')?.value || 30);

        let avgEyeViewsPerRickshaw = 11500; // Default average
        let basePrice = 150; // Default

        if (zoneId && RASAAI_DATA.zones[zoneId]) {
            const zone = RASAAI_DATA.zones[zoneId];
            avgEyeViewsPerRickshaw = zone.estimatedDailyEyeViews / zone.rickshawCount;
            basePrice = zone.basePricePerDay;
        }

        const totalEyeViews = avgEyeViewsPerRickshaw * rickshaws * duration;
        const reach = totalEyeViews * 0.74;
        const totalCost = basePrice * rickshaws * duration;
        const cpm = totalCost / (totalEyeViews / 1000);

        document.getElementById('resultEyeViews').textContent = this.formatNumber(totalEyeViews);
        document.getElementById('resultReach').textContent = this.formatNumber(reach);
        document.getElementById('resultCost').textContent = '₹' + totalCost.toLocaleString('en-IN');
        document.getElementById('resultCPM').textContent = '₹' + cpm.toFixed(2);
    }

    // Build Full ROI Calculator
    buildROICalculator() {
        const container = document.getElementById('roiCalcContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="roi-calculator card fade-up">
                <h3>🧮 Advanced ROI Calculator</h3>
                <div class="roi-inputs">
                    <div class="calc-input-group">
                        <label>Business Type</label>
                        <select id="roiBusinessType">
                            <option value="retail">Retail Store</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="clinic">Clinic/Healthcare</option>
                            <option value="education">Education</option>
                            <option value="realestate">Real Estate</option>
                            <option value="service">Service Business</option>
                        </select>
                    </div>
                    <div class="calc-input-group">
                        <label>Zone Selection</label>
                        <select id="roiZone">
                            <option value="kausa">Kausa</option>
                            <option value="mumbra-station">Mumbra Station</option>
                            <option value="shilphata">Shilphata</option>
                            <option value="retibunder">Retibunder</option>
                            <option value="check-naka">Check Naka</option>
                        </select>
                    </div>
                    <div class="calc-input-group">
                        <label>Campaign Duration</label>
                        <select id="roiDuration">
                            <option value="7">7 Days</option>
                            <option value="15">15 Days</option>
                            <option value="30" selected>30 Days</option>
                            <option value="60">60 Days</option>
                            <option value="90">90 Days</option>
                        </select>
                    </div>
                    <div class="calc-input-group">
                        <label>Budget Range</label>
                        <input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000"
                               oninput="document.getElementById('budgetValue').textContent = '₹' + parseInt(this.value).toLocaleString('en-IN'); calculatorEngine.calculateROI()">
                        <span id="budgetValue">₹50,000</span>
                    </div>
                </div>
                <div class="roi-results" id="roiResults">
                    <h4>Projected Campaign Performance</h4>
                    <div class="roi-results-grid">
                        <div class="roi-result">
                            <span id="roiEyeViews">--</span>
                            <label>Eye Views</label>
                        </div>
                        <div class="roi-result">
                            <span id="roiFootfall">--</span>
                            <label>Est. Footfall Increase</label>
                        </div>
                        <div class="roi-result">
                            <span id="roiNewCustomers">--</span>
                            <label>Est. New Customers</label>
                        </div>
                        <div class="roi-result">
                            <span id="roiRevenue">--</span>
                            <label>Est. Revenue Impact</label>
                        </div>
                        <div class="roi-result">
                            <span id="roiROI">--</span>
                            <label>Projected ROI</label>
                        </div>
                        <div class="roi-result">
                            <span id="roiBreakEven">--</span>
                            <label>Break-even Timeline</label>
                        </div>
                    </div>
                    <div class="roi-comparison">
                        <h4>CPM Comparison</h4>
                        <div class="cpm-bars">
                            <div class="cpm-bar"><span>RASAAI</span><div class="cpm-fill rasaai" id="cpmRasaai"></div><span id="cpmRasaaiVal">₹4.50</span></div>
                            <div class="cpm-bar"><span>Instagram</span><div class="cpm-fill instagram"></div><span>₹35-150</span></div>
                            <div class="cpm-bar"><span>Facebook</span><div class="cpm-fill facebook"></div><span>₹25-90</span></div>
                            <div class="cpm-bar"><span>YouTube</span><div class="cpm-fill youtube"></div><span>₹15-40</span></div>
                        </div>
                    </div>
                </div>
                <button class="btn-primary btn-gradient btn-block" onclick="calculatorEngine.downloadROIReport()">
                    📥 Download PDF Report
                </button>
            </div>
        `;
    }

    calculateROI() {
        const zoneId = document.getElementById('roiZone')?.value || 'kausa';
        const duration = parseInt(document.getElementById('roiDuration')?.value || 30);
        const budget = parseInt(document.getElementById('roiBudget')?.value || 50000);
        const businessType = document.getElementById('roiBusinessType')?.value || 'retail';

        const zone = RASAAI_DATA.zones[zoneId];
        const rickshawsPossible = Math.floor(budget / (zone.basePricePerDay * duration));
        const actualRickshaws = Math.min(rickshawsPossible, zone.rickshawCount);
        const actualCost = actualRickshaws * zone.basePricePerDay * duration;

        const avgEyeViews = zone.estimatedDailyEyeViews / zone.rickshawCount;
        const totalEyeViews = avgEyeViews * actualRickshaws * duration;

        // Business-specific conversion rates
        const conversionRates = {
            retail: 0.02,
            restaurant: 0.03,
            clinic: 0.015,
            education: 0.01,
            realestate: 0.005,
            service: 0.025
        };

        const conversionRate = conversionRates[businessType] || 0.02;
        const footfallIncrease = totalEyeViews * conversionRate * 0.1;
        const newCustomers = footfallIncrease * 0.3;
        const avgTransactionValues = {
            retail: 500,
            restaurant: 300,
            clinic: 800,
            education: 5000,
            realestate: 50000,
            service: 1000
        };
        const avgTransaction = avgTransactionValues[businessType] || 500;
        const revenueImpact = newCustomers * avgTransaction;
        const roi = ((revenueImpact - actualCost) / actualCost * 100).toFixed(0);
        const breakEvenDays = Math.ceil(actualCost / (revenueImpact / duration));

        document.getElementById('roiEyeViews').textContent = this.formatNumber(totalEyeViews);
        document.getElementById('roiFootfall').textContent = '+' + footfallIncrease.toFixed(0) + '%';
        document.getElementById('roiNewCustomers').textContent = Math.floor(newCustomers).toLocaleString('en-IN');
        document.getElementById('roiRevenue').textContent = '₹' + revenueImpact.toLocaleString('en-IN');
        document.getElementById('roiROI').textContent = roi + '%';
        document.getElementById('roiBreakEven').textContent = breakEvenDays + ' days';
    }

    downloadROIReport() {
        alert('📄 ROI Report download simulated. In production, this generates a PDF with all campaign projections.');
        // In production: Generate PDF using jsPDF or similar library
    }

    formatNumber(num) {
        if (num >= 10000000) return (num / 10000000).toFixed(1) + 'M';
        if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
        if (num >= 1000) return num.toLocaleString('en-IN');
        return num.toString();
    }
}

const calculatorEngine = new CalculatorEngine();
