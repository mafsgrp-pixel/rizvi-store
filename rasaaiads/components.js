// ============================================
// RASAAI V2 - Reusable UI Components
// ============================================

class ComponentBuilder {
    constructor() {
        this.components = {};
    }

    // Build Zone Cards
    buildZoneCards() {
        const grid = document.getElementById('zoneCardsGrid');
        if (!grid) return;

        const zones = RASAAI_DATA.zones;
        
        Object.values(zones).forEach(zone => {
            const card = document.createElement('div');
            card.className = 'zone-card card fade-up';
            card.innerHTML = `
                <div class="zone-card-header">
                    <h3>📍 ${zone.name}</h3>
                    <span class="zone-coverage-badge" style="background: ${zone.coveragePercentage > 80 ? 'var(--brand-green)' : 'var(--amber)'}">
                        ${zone.coveragePercentage}% Covered
                    </span>
                </div>
                <div class="zone-metrics">
                    <div class="zone-metric">
                        <span class="metric-icon">👁️</span>
                        <span class="metric-value">${this.formatNumber(zone.estimatedDailyEyeViews)}</span>
                        <span class="metric-label">Daily Eye Views</span>
                    </div>
                    <div class="zone-metric">
                        <span class="metric-icon">🛺</span>
                        <span class="metric-value">${zone.rickshawCount}</span>
                        <span class="metric-label">Rickshaws</span>
                    </div>
                    <div class="zone-metric">
                        <span class="metric-icon">👥</span>
                        <span class="metric-value">${this.formatNumber(zone.populationEstimate)}</span>
                        <span class="metric-label">Population</span>
                    </div>
                </div>
                <div class="zone-poi">
                    ${Object.entries(zone.pointsOfInterest).map(([key, val]) => 
                        `<span class="poi-pill">${this.getPOIIcon(key)} ${val} ${key}</span>`
                    ).join('')}
                </div>
                <div class="zone-price">
                    <span>From <strong>₹${zone.basePricePerDay}</strong>/day per rickshaw</span>
                    <span class="zone-available ${zone.availableRickshaws < 10 ? 'low-stock' : ''}">
                        ${zone.availableRickshaws} available
                    </span>
                </div>
                <button class="btn-primary btn-gradient btn-block" onclick="scrollToSection('pricing')">
                    Book ${zone.name} Zone
                </button>
            `;
            grid.appendChild(card);
        });
    }

    getPOIIcon(key) {
        const icons = {
            schools: '🏫', mosques: '🕌', restaurants: '🍽️',
            clinics: '🏥', markets: '🏪'
        };
        return icons[key] || '📍';
    }

    // Build Comparison Table
    buildComparisonTable(containerId, data, competitorName, competitorColor = '#E1306C') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const table = document.createElement('table');
        table.className = 'comparison-table fade-up';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Feature</th>
                    <th style="color: var(--brand-green)">🛺 RASAAI</th>
                    <th style="color: ${competitorColor}">${competitorName}</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr class="${row.rasaaiWin ? 'rasaai-wins' : ''}">
                        <td><strong>${row.feature}</strong></td>
                        <td class="rasaai-col">${row.rasaai}</td>
                        <td>${row[competitorName.toLowerCase().replace(' ', '')] || row.instagram || row.facebook || row.youtube}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.appendChild(table);
    }

    // Build Neuromarketing Cards
    buildNeuroCards() {
        const grid = document.getElementById('neuroCardsGrid');
        if (!grid) return;

        RASAAI_DATA.neuromarketing.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'neuro-card flip-card fade-up';
            cardEl.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <span class="neuro-icon">${card.icon}</span>
                        <h3>${card.front}</h3>
                        <div class="neuro-stat">${card.stat}</div>
                        <span class="neuro-stat-label">${card.statLabel}</span>
                    </div>
                    <div class="flip-card-back">
                        <p>${card.back}</p>
                    </div>
                </div>
            `;
            grid.appendChild(cardEl);
        });
    }

    // Build Rickshaw Tracking Cards
    buildRickshawTracks() {
        const grid = document.getElementById('rickshawTrackGrid');
        if (!grid) return;

        const rickshaws = RASAAI_DATA.generateRickshawData().slice(0, 6);

        rickshaws.forEach(rick => {
            const card = document.createElement('div');
            card.className = 'rickshaw-track-card card fade-up';
            card.innerHTML = `
                <div class="track-header">
                    <div class="track-id">
                        <span class="live-dot ${rick.gpsStatus === 'online' ? 'online' : 'offline'}"></span>
                        ${rick.id}
                    </div>
                    <span class="track-battery">🔋 ${rick.batteryLevel}%</span>
                </div>
                <div class="track-zone">📍 ${rick.currentZoneName}</div>
                <div class="track-route">🛣️ ${rick.currentRoute}</div>
                <div class="track-metrics">
                    <span>👁️ ${this.formatNumber(rick.dailyEyeViews)} eye views</span>
                    <span>📊 ${this.formatNumber(rick.currentExposureEstimate)} exposure</span>
                </div>
                <div class="track-campaigns">
                    <span class="campaign-badge ${rick.audioCampaignStatus}">🔊 Audio: ${rick.audioCampaignStatus}</span>
                    <span class="campaign-badge ${rick.ledCampaignStatus}">💡 LED: ${rick.ledCampaignStatus}</span>
                </div>
                ${rick.campaignRunning ? `
                    <div class="track-active-campaign">
                        Active: ${rick.campaignRunning.advertiser} (${rick.campaignRunning.type})
                    </div>
                ` : '<div class="track-available">Available for booking</div>'}
            `;
            grid.appendChild(card);
        });
    }

    // Build Pricing Cards
    buildPricingCards() {
        const grid = document.getElementById('pricingGrid');
        if (!grid) return;

        const pricing = RASAAI_DATA.pricing;
        const zones = RASAAI_DATA.zones;

        Object.entries(pricing).forEach(([zoneId, price], index) => {
            const zone = zones[zoneId];
            const card = document.createElement('div');
            card.className = `pricing-card fade-up ${index === 1 ? 'featured' : ''}`;
            
            card.innerHTML = `
                ${index === 1 ? '<span class="pricing-badge">🔥 Most Popular</span>' : ''}
                <h3 class="zone-name">📍 ${zone.name}</h3>
                <div class="price">₹${price.dailyRate}<span class="price-period">/day</span></div>
                <p class="price-sub">per rickshaw</p>
                <ul class="features-list">
                    <li>👁️ ${this.formatNumber(zone.estimatedDailyEyeViews / zone.rickshawCount * 10)} eye views/day*</li>
                    <li>🛺 ${price.rickshawsAvailable} rickshaws available</li>
                    <li>📍 ${zone.coveragePercentage}% zone coverage</li>
                    <li>📊 Real-time tracking</li>
                    <li>🎨 Creative production included</li>
                    <li>🔄 Content changes allowed</li>
                </ul>
                <div class="pricing-periods">
                    <div class="period-option">₹${price.weeklyRate}/week</div>
                    <div class="period-option best-value">₹${price.monthlyRate}/month</div>
                </div>
                <p class="pricing-note">*Based on 10 rickshaws</p>
                <button class="btn-primary btn-gradient btn-block" onclick="openBookingModal()">
                    Book Now
                </button>
            `;
            grid.appendChild(card);
        });
    }

    // Build Case Studies Swipe
    buildCaseStudies() {
        const container = document.getElementById('caseStudiesSwipe');
        if (!container) return;

        RASAAI_DATA.caseStudies.forEach((study, index) => {
            const card = document.createElement('div');
            card.className = 'case-study-card card fade-up';
            card.innerHTML = `
                <div class="case-study-header">
                    <span class="case-number">Case Study ${index + 1}</span>
                    <span class="case-type">${study.type}</span>
                </div>
                <h3>${study.businessName}</h3>
                <div class="case-meta">
                    <span>📍 ${study.zone}</span>
                    <span>⏱️ ${study.duration}</span>
                    <span>💰 ${study.budget}</span>
                </div>
                <div class="case-results">
                    <div class="result-item">
                        <span class="result-value">${study.results.footfallIncrease || study.results.patientIncrease || study.results.inquiriesIncrease}</span>
                        <span class="result-label">Increase</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${study.results.roi}</span>
                        <span class="result-label">ROI</span>
                    </div>
                    <div class="result-item">
                        <span class="result-value">${study.results.brandRecall}</span>
                        <span class="result-label">Brand Recall</span>
                    </div>
                </div>
                <blockquote class="case-testimonial">
                    "${study.testimonial}"
                    <cite>— ${study.owner}</cite>
                </blockquote>
            `;
            container.appendChild(card);
        });
    }

    // Build FAQ Accordion
    buildFAQ() {
        const container = document.getElementById('faqContainer');
        if (!container) return;

        RASAAI_DATA.faq.forEach((item, index) => {
            const accordion = document.createElement('div');
            accordion.className = 'faq-item fade-up';
            accordion.innerHTML = `
                <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                    <span>${item.q}</span>
                    <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer">
                    <p>${item.a}</p>
                </div>
            `;
            container.appendChild(accordion);
        });
    }

    // Build Industry Cards
    buildIndustryCards() {
        const container = document.getElementById('industryCards');
        if (!container) return;

        RASAAI_DATA.industries.forEach(industry => {
            const card = document.createElement('div');
            card.className = 'industry-card card fade-up';
            card.innerHTML = `
                <div class="industry-icon">${industry.icon}</div>
                <h3>${industry.name}</h3>
                <p>${industry.description}</p>
            `;
            container.appendChild(card);
        });
    }

    // Build Testimonial Carousel
    buildTestimonials() {
        const container = document.getElementById('testimonialCarousel');
        if (!container) return;

        RASAAI_DATA.testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card card fade-up';
            card.innerHTML = `
                <div class="testimonial-stars">${'⭐'.repeat(testimonial.rating)}</div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <strong>${testimonial.name}</strong>
                    <span>${testimonial.business}, ${testimonial.zone}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Build Format Cards
    buildFormatCards() {
        const container = document.getElementById('formatCards');
        if (!container) return;

        RASAAI_DATA.adFormats.forEach(format => {
            const card = document.createElement('div');
            card.className = `format-card card fade-up ${format.recommended ? 'recommended' : ''}`;
            card.innerHTML = `
                ${format.recommended ? '<span class="recommended-badge">⭐ Recommended</span>' : ''}
                <div class="format-icon">${format.icon}</div>
                <h3>${format.name}</h3>
                <p>${format.description}</p>
                <ul class="format-features">
                    ${format.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <div class="format-price-multiplier">
                    ${format.priceMultiplier}x base rate
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Build Leaderboard
    buildLeaderboard() {
        const container = document.getElementById('leaderboardContainer');
        if (!container) return;

        const zones = Object.values(RASAAI_DATA.zones)
            .sort((a, b) => b.estimatedDailyEyeViews - a.estimatedDailyEyeViews);

        zones.forEach((zone, index) => {
            const bar = document.createElement('div');
            bar.className = 'leaderboard-bar fade-up';
            const maxViews = zones[0].estimatedDailyEyeViews;
            const widthPercent = (zone.estimatedDailyEyeViews / maxViews) * 100;
            
            bar.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-info">
                    <span class="leaderboard-name">${zone.name}</span>
                    <div class="leaderboard-bar-track">
                        <div class="leaderboard-bar-fill" style="width: ${widthPercent}%; animation-delay: ${index * 0.2}s"></div>
                    </div>
                    <span class="leaderboard-value">${this.formatNumber(zone.estimatedDailyEyeViews)} eye views/day</span>
                </div>
            `;
            container.appendChild(bar);
        });
    }

    // Build Affiliate Calculator
    buildAffiliateSection() {
        const container = document.getElementById('affiliateContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="affiliate-card card fade-up">
                <h3>💰 Earn 10% on Every Referral</h3>
                <p>Refer a business to RASAAI and earn 10% commission on their first campaign.</p>
                <div class="affiliate-calculator">
                    <label>Referral's Campaign Budget:</label>
                    <input type="range" min="5000" max="500000" value="50000" step="5000" 
                           oninput="document.getElementById('affiliateEarning').textContent = '₹' + (this.value * 0.1).toLocaleString('en-IN')">
                    <div class="affiliate-result">
                        Your Earning: <strong id="affiliateEarning">₹5,000</strong>
                    </div>
                </div>
                <button class="btn-primary btn-gradient btn-block" onclick="openBookingModal()">
                    Start Referring
                </button>
            </div>
        `;
    }

    // Build Inventory Cards
    buildInventoryCards() {
        const grid = document.getElementById('inventoryGrid');
        if (!grid) return;

        Object.values(RASAAI_DATA.zones).forEach(zone => {
            const card = document.createElement('div');
            card.className = 'inventory-card card fade-up';
            const stockLevel = zone.availableRickshaws < 10 ? 'critical' : 
                              zone.availableRickshaws < 20 ? 'low' : 'good';
            
            card.innerHTML = `
                <h3>📍 ${zone.name}</h3>
                <div class="inventory-stock ${stockLevel}">
                    <span class="stock-number">${zone.availableRickshaws}</span>
                    <span class="stock-label">rickshaws left</span>
                </div>
                <div class="inventory-bar">
                    <div class="inventory-fill" style="width: ${zone.coveragePercentage}%"></div>
                </div>
                <p class="inventory-status ${stockLevel}">
                    ${stockLevel === 'critical' ? '⚠️ Almost sold out!' : 
                      stockLevel === 'low' ? '⚡ Selling fast' : '✅ Available'}
                </p>
            `;
            grid.appendChild(card);
        });
    }

    // Helper
    formatNumber(num) {
        if (num >= 10000000) return (num / 10000000).toFixed(1) + 'M';
        if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
        if (num >= 1000) return num.toLocaleString('en-IN');
        return num.toString();
    }

    // Build all components
    buildAll() {
        this.buildZoneCards();
        this.buildNeuroCards();
        this.buildRickshawTracks();
        this.buildPricingCards();
        this.buildCaseStudies();
        this.buildFAQ();
        this.buildIndustryCards();
        this.buildTestimonials();
        this.buildFormatCards();
        this.buildLeaderboard();
        this.buildAffiliateSection();
        this.buildInventoryCards();
        
        // Comparison tables
        this.buildComparisonTable('comparisonInstagram', RASAAI_DATA.comparisons.instagram, 'Instagram Ads', '#E1306C');
        this.buildComparisonTable('comparisonFacebook', RASAAI_DATA.comparisons.facebook, 'Facebook Ads', '#1877F2');
        // YouTube comparison (animated bars)
        this.buildYoutubeComparison();
    }

    buildYoutubeComparison() {
        const container = document.getElementById('comparisonYoutube');
        if (!container) return;

        RASAAI_DATA.comparisons.youtube.forEach(item => {
            const bar = document.createElement('div');
            bar.className = 'comparison-bar fade-up';
            bar.innerHTML = `
                <div class="bar-label">${item.feature}</div>
                <div class="bar-row">
                    <div class="bar-rasaai">
                        <div class="bar-fill rasaai-fill" style="width: 100%"></div>
                        <span>${item.rasaai}</span>
                    </div>
                    <div class="bar-competitor">
                        <div class="bar-fill competitor-fill" style="width: ${item.rasaaiWin ? '35%' : '100%'}"></div>
                        <span>${item.youtube}</span>
                    </div>
                </div>
            `;
            container.appendChild(bar);
        });
    }
}

const componentBuilder = new ComponentBuilder();
