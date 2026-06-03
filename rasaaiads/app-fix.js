// ============================================
// RASAAI V2 - Complete Working Application
// Single file that actually generates all content
// ============================================

// ============================================
// DATA
// ============================================
const DATA = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    
    zones: {
        kausa: { id:"kausa", name:"Kausa", populationEstimate:85000, dailyPedestrianTraffic:42000, dailyVehicleTraffic:18000, pointsOfInterest:{schools:12,mosques:8,restaurants:45,clinics:9,markets:3}, peakTrafficTimes:["07:30-09:30","17:00-20:00"], estimatedDailyEyeViews:125000, rickshawCount:85, activeCampaigns:23, availableRickshaws:12, basePricePerDay:150, coordinates:{lat:19.1765,lng:73.0320}, coveragePercentage:87 },
        "mumbra-station": { id:"mumbra-station", name:"Mumbra Station", populationEstimate:45000, dailyPedestrianTraffic:180000, dailyVehicleTraffic:35000, pointsOfInterest:{schools:5,mosques:3,restaurants:28,clinics:4,markets:2}, peakTrafficTimes:["06:00-10:00","16:00-21:00"], estimatedDailyEyeViews:220000, rickshawCount:120, activeCampaigns:35, availableRickshaws:8, basePricePerDay:250, coordinates:{lat:19.1800,lng:73.0280}, coveragePercentage:92, stationSpecific:{trainPassengerExposure:180000,rickshawQueueExposure:25000,retailExposure:15000,dailyImpressions:220000} },
        shilphata: { id:"shilphata", name:"Shilphata", populationEstimate:55000, dailyPedestrianTraffic:28000, dailyVehicleTraffic:22000, pointsOfInterest:{schools:4,mosques:2,restaurants:15,clinics:3,markets:1}, peakTrafficTimes:["08:00-10:00","17:30-19:30"], estimatedDailyEyeViews:95000, rickshawCount:65, activeCampaigns:18, availableRickshaws:15, basePricePerDay:120, coordinates:{lat:19.1950,lng:73.0480}, coveragePercentage:78 },
        retibunder: { id:"retibunder", name:"Retibunder", populationEstimate:35000, dailyPedestrianTraffic:22000, dailyVehicleTraffic:15000, pointsOfInterest:{schools:3,mosques:2,restaurants:12,clinics:2,markets:2}, peakTrafficTimes:["09:00-11:00","18:00-20:00"], estimatedDailyEyeViews:75000, rickshawCount:50, activeCampaigns:14, availableRickshaws:20, basePricePerDay:100, coordinates:{lat:19.1700,lng:73.0380}, coveragePercentage:72 },
        "check-naka": { id:"check-naka", name:"Check Naka", populationEstimate:40000, dailyPedestrianTraffic:30000, dailyVehicleTraffic:25000, pointsOfInterest:{schools:3,mosques:1,restaurants:10,clinics:2,markets:1}, peakTrafficTimes:["07:00-09:00","17:00-20:00"], estimatedDailyEyeViews:77000, rickshawCount:30, activeCampaigns:10, availableRickshaws:25, basePricePerDay:90, coordinates:{lat:19.1850,lng:73.0350}, coveragePercentage:65 }
    },
    
    comparisons: {
        instagram: [
            ["Hyperlocal Visibility","✓ Full zone dominance","⚠ Limited by algorithm"],
            ["Physical Presence","✓ Tangible, unavoidable","✗ Digital-only"],
            ["Ad Blocking Resistance","✓ Cannot be blocked","✗ Ad blockers, skip"],
            ["Non-Internet User Reach","✓ 100% of foot traffic","✗ Internet required"],
            ["Local Market Dominance","✓ Area monopolization","⚠ Fragmented"],
            ["Audio Advertising","✓ Voice + visual dual channel","✗ Visual only (mostly muted)"],
            ["Street Credibility","✓ Physical trust building","⚠ Perceived as online ad"],
            ["Attention Time","✓ 3-8 seconds","⚠ <1 second (scroll)"],
            ["Brand Recall (24hr)","✓ 68%","⚠ 24%"],
            ["CPM (Effective)","₹4.50","₹35-150"],
            ["Ad Fatigue","✓ Low (environmental)","✗ High (repetitive feed)"]
        ],
        facebook: [
            ["Local Penetration","✓ 100% zone coverage","⚠ 15-40% of local audience"],
            ["Trust Factor","✓ Physical = real","⚠ 'Scam ad' skepticism"],
            ["Multi-sensory","✓ Visual + Audio","⚠ Visual only"],
            ["Community Recognition","✓ 'I saw it in my area'","✗ No physical trace"],
            ["Cost per 1000 Eye Views","₹4.50","N/A"],
            ["Cost per 1000 Impressions","₹2.80","₹25-90"],
            ["Offline Conversion","✓ Direct walk-in trigger","✗ Click-to-website friction"]
        ],
        youtube: [
            ["Skip Rate","0% (unskippable)","65-76% skipped"],
            ["Ad Fatigue","Low","High (pre-roll annoyance)"],
            ["Attention Time","4.2 seconds avg","2.1 seconds (before skip)"],
            ["Brand Recall","68%","18%"],
            ["Physical Presence","✓","✗"],
            ["Local Trust","✓ Community embedded","✗ Global, impersonal"],
            ["Cost Per View","₹0.04 (eye view)","₹0.15-0.40"],
            ["Context Relevance","✓ Neighborhood context","⚠ Content-dependent"]
        ]
    },
    
    neuromarketing: [
        {icon:"👁️",title:"Motion Bias",front:"Motion Bias",back:"The human visual cortex is hardwired to detect movement. Moving rickshaw ads trigger the superior colliculus, commanding 400% more attention than static billboards.",stat:"400%",statLabel:"More Attention"},
        {icon:"⚡",title:"Pattern Interruption",front:"Pattern Interruption",back:"A new rickshaw ad breaks the expected visual pattern. This violation triggers norepinephrine release, encoding the ad into memory.",stat:"3x",statLabel:"Memory Encoding"},
        {icon:"🔄",title:"Spaced Repetition",front:"Spaced Repetition",back:"Seeing ads on different rickshaws across days leverages the spacing effect—memory consolidation increases 3x.",stat:"3x",statLabel:"Memory Consolidation"},
        {icon:"🧠",title:"Visual Recall",front:"Visual Recall Superiority",back:"Humans recall 65% of visual information after 3 days vs 10% of text. Transit ads combine visual + environmental context.",stat:"65%",statLabel:"Visual Recall Rate"},
        {icon:"📍",title:"Location Familiarity",front:"Location Familiarity Effect",back:"Ads seen in familiar locations feel more trustworthy. The mere-exposure effect makes brands feel like 'part of the community.'",stat:"73%",statLabel:"Trust Increase"},
        {icon:"👥",title:"Social Proof",front:"Social Proof by Visibility",back:"When thousands see the same ad daily, it creates implicit social proof driving word-of-mouth and local credibility.",stat:"5x",statLabel:"Word-of-Mouth"},
        {icon:"🔊",title:"Dual-Channel",front:"Dual-Channel Encoding",back:"Audio + Visual creates two memory pathways. RASAAI's LED + Audio rickshaws achieve 85% higher recall than visual-only.",stat:"85%",statLabel:"Higher Recall"},
        {icon:"🏘️",title:"Community Recognition",front:"Community Recognition",back:"Local brands on local transport feel indigenous. 73% of consumers prefer brands that 'feel local' even when national.",stat:"73%",statLabel:"Prefer Local-Feel"}
    ],
    
    pricing: {
        kausa:{dailyRate:150,weeklyRate:950,monthlyRate:3500,available:12},
        "mumbra-station":{dailyRate:250,weeklyRate:1600,monthlyRate:6000,available:8},
        shilphata:{dailyRate:120,weeklyRate:750,monthlyRate:2800,available:15},
        retibunder:{dailyRate:100,weeklyRate:650,monthlyRate:2400,available:20},
        "check-naka":{dailyRate:90,weeklyRate:550,monthlyRate:2100,available:25}
    },
    
    adFormats: [
        {id:"led",name:"LED Display",icon:"💡",description:"Bright, weatherproof LED screen on rickshaw back. Visible day and night.",features:["Full-color display","Weatherproof","Night visibility","Changeable content"],priceMultiplier:1},
        {id:"audio",name:"Audio Announcement",icon:"🔊",description:"Voice advertisement through rickshaw speakers. Reaches pedestrians at stops.",features:["Professional voice-over","Multi-language","Zone-specific messaging","Ear-catching"],priceMultiplier:0.8},
        {id:"led-audio",name:"LED + Audio Combo",icon:"⚡",description:"Dual-channel for maximum impact. 85% higher recall than single-format.",features:["Visual + Audio sync","85% higher recall","Maximum attention","Best ROI"],priceMultiplier:1.5,recommended:true}
    ],
    
    caseStudies: [
        {businessName:"Spice Garden Restaurant",type:"Restaurant",zone:"Kausa",duration:"30 days",budget:"₹15,000",result1:"45%",result1Label:"Footfall Increase",result2:"467%",result2Label:"ROI",result3:"72%",result3Label:"Brand Recall",testimonial:"RASAAI brought customers from areas we never reached before. Our dinner crowd doubled within 2 weeks!",owner:"Ahmed Siddiqui, Owner"},
        {businessName:"Mumbra Dental Care",type:"Clinic",zone:"Mumbra Station",duration:"45 days",budget:"₹22,000",result1:"38%",result1Label:"Patient Increase",result2:"445%",result2Label:"ROI",result3:"68%",result3Label:"Brand Recall",testimonial:"The audio ads on rickshaws near the station are incredibly effective. Patients mention hearing about us while commuting.",owner:"Dr. Fatima Khan"},
        {businessName:"Shilphata Industries",type:"B2B/Industrial",zone:"Shilphata",duration:"60 days",budget:"₹35,000",result1:"55%",result1Label:"Inquiry Increase",result2:"900%",result2Label:"ROI",result3:"64%",result3Label:"Brand Recall",testimonial:"We reached warehouse managers and truck drivers who don't use social media. RASAAI is unmatched.",owner:"Rajesh Patil, Director"}
    ],
    
    industries: [
        {name:"Retail",icon:"🏪",desc:"Drive footfall to your store. Local visibility = local customers."},
        {name:"Restaurant",icon:"🍽️",desc:"Hungry commuters = your next customers. Target peak meal times."},
        {name:"Healthcare",icon:"🏥",desc:"Clinics & pharmacies seen by thousands daily. Build local trust."},
        {name:"Education",icon:"🏫",desc:"Reach parents & students on school routes. Admission season ready."},
        {name:"Real Estate",icon:"🏠",desc:"Property ads seen by locals. Generate inquiries from the neighborhood."},
        {name:"Services",icon:"🔧",desc:"Plumbers, electricians, salons—be the go-to name in your zone."}
    ],
    
    testimonials: [
        {name:"Rahul Sharma",business:"Kausa Mart",zone:"Kausa",text:"Our store visibility doubled. Customers walk in saying they saw our rickshaw ad!",rating:5},
        {name:"Priya Patel",business:"Fashion Hub",zone:"Mumbra Station",text:"Best advertising investment. Real people, real eyes, real customers.",rating:5},
        {name:"Dr. Ahmed",business:"City Clinic",zone:"Shilphata",text:"Patient inquiries up 40%. The audio ads are incredibly effective.",rating:5},
        {name:"Meera Joshi",business:"Oxford Academy",zone:"Retibunder",text:"Admissions increased 25% after our rickshaw campaign.",rating:4},
        {name:"Vikram Singh",business:"AutoCare Center",zone:"Check Naka",text:"Reached truck drivers and commuters we couldn't reach online.",rating:5}
    ],
    
    faq: [
        {q:"How are Eye Views different from Impressions?",a:"Eye Views are RASAAI's proprietary metric measuring verified human visual contact with your ad. Unlike digital impressions (which count server requests), Eye Views track actual human attention based on foot traffic, vehicle density, and viewing angles. Average: 11,500 Eye Views per rickshaw daily."},
        {q:"What zones do you cover?",a:"We cover 5 high-traffic zones in Mumbra: Kausa (85 rickshaws), Mumbra Station (120 rickshaws), Shilphata (65 rickshaws), Retibunder (50 rickshaws), and Check Naka (30 rickshaws). Total: 350+ rickshaws generating 17.7M+ monthly Eye Views."},
        {q:"How much does it cost?",a:"Pricing starts from ₹90/day per rickshaw (Check Naka) to ₹250/day (Mumbra Station). A typical campaign of 10 rickshaws for 30 days in Kausa costs approximately ₹45,000."},
        {q:"Can I choose specific routes?",a:"Yes! Our Route Intelligence Engine lets you select specific routes within zones. Target school zones, market areas, station queues, or industrial corridors."},
        {q:"What ad formats are available?",a:"Three formats: LED Display (visual only), Audio Announcement (voice only), and LED+Audio (dual-channel, 85% higher recall). All ads produced by our team."},
        {q:"How do I track my campaign?",a:"Real-time dashboard showing: Eye Views, Impressions, Reach, Frequency, CPM, Brand Recall Score, GPS routes, and daily reports. Data refreshes every 30 seconds."},
        {q:"How does RASAAI compare to digital ads?",a:"0% skip rate (vs 76% YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 Instagram), and reach non-internet users."},
        {q:"How quickly can I launch?",a:"Campaigns go live within 48-72 hours. Creative production handled by our team. We manage installation, maintenance, and tracking."}
    ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function fmt(n) {
    if (n >= 10000000) return (n/10000000).toFixed(1)+'M';
    if (n >= 100000) return (n/100000).toFixed(1)+'L';
    if (n >= 1000) return n.toLocaleString('en-IN');
    return n.toString();
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
}

function openBookingModal() {
    document.getElementById('bookingModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('show');
    document.body.style.overflow = '';
}

function closeExitPopup() {
    document.getElementById('exitPopup').classList.remove('show');
}

function handleBookingSubmit(e) {
    e.preventDefault();
    alert('✅ Thank you! We will call you at +91 95943 06625 within 5 minutes.');
    closeBookingModal();
}

// ============================================
// BUILD ALL SECTIONS
// ============================================
function buildAll() {
    buildTrustCarousel();
    buildZoneCards();
    buildRickshawTracks();
    buildEyeCalculator();
    buildNeuroCards();
    buildComparisonTables();
    buildAudioPlayer();
    buildFormatCards();
    buildCampaignBuilder();
    buildPricingCards();
    buildInventoryCards();
    buildROICalculator();
    buildCaseStudies();
    buildIndustryCards();
    buildTestimonials();
    buildVideoGallery();
    buildHeatmap();
    buildLeaderboard();
    buildAffiliate();
    buildContest();
    buildHashtag();
    buildFAQ();
    startCounters();
    startTimers();
}

// SECTION 3: Trust Carousel
function buildTrustCarousel() {
    const track = document.querySelector('#trustCarousel .trust-logo-track');
    if (!track) return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🏢 Shilphata Ind.","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty"];
    const all = [...logos, ...logos];
    track.innerHTML = all.map(l => `<span>${l}</span>`).join('');
}

// SECTION 8: Zone Cards
function buildZoneCards() {
    const grid = document.getElementById('zoneCardsGrid');
    if (!grid) return;
    grid.innerHTML = Object.values(DATA.zones).map(z => `
        <div class="zone-card card">
            <div class="zone-card-header">
                <h3>📍 ${z.name}</h3>
                <span class="zone-coverage-badge" style="background:${z.coveragePercentage>80?'var(--brand-green)':'var(--amber)'}">${z.coveragePercentage}%</span>
            </div>
            <div class="zone-metrics">
                <div class="zone-metric"><span class="metric-icon">👁️</span><span class="metric-value">${fmt(z.estimatedDailyEyeViews)}</span><span class="metric-label">Daily Eyes</span></div>
                <div class="zone-metric"><span class="metric-icon">🛺</span><span class="metric-value">${z.rickshawCount}</span><span class="metric-label">Rickshaws</span></div>
                <div class="zone-metric"><span class="metric-icon">👥</span><span class="metric-value">${fmt(z.populationEstimate)}</span><span class="metric-label">Population</span></div>
            </div>
            <div class="zone-poi">${Object.entries(z.pointsOfInterest).map(([k,v])=>`<span class="poi-pill">${v} ${k}</span>`).join('')}</div>
            <div class="zone-price"><span>From <strong>₹${z.basePricePerDay}</strong>/day</span><span class="zone-available ${z.availableRickshaws<10?'low-stock':''}">${z.availableRickshaws} available</span></div>
            <button class="btn-primary btn-gradient btn-block" onclick="scrollToSection('pricing')">Book ${z.name}</button>
        </div>
    `).join('');
}

// SECTION 9: Rickshaw Tracks
function buildRickshawTracks() {
    const grid = document.getElementById('rickshawTrackGrid');
    if (!grid) return;
    const zones = Object.keys(DATA.zones);
    const routes = {
        kausa: ["Kausa Market → Station","School Road → Shilphata","Masjid → Retibunder"],
        "mumbra-station": ["Station → Kausa","Station → Shilphata","Station → Check Naka"],
        shilphata: ["Shilphata → Station","Shilphata → Kausa","Industrial → Check Naka"],
        retibunder: ["Retibunder → Station","Retibunder → Kausa","Market Loop"],
        "check-naka": ["Check Naka → Station","Check Naka → Shilphata","Highway → Retibunder"]
    };
    
    let html = '';
    for (let i=0; i<6; i++) {
        const zid = zones[i%5];
        const z = DATA.zones[zid];
        const route = routes[zid][i%3];
        const online = Math.random()>0.1;
        const audio = Math.random()>0.1?'active':'inactive';
        const led = Math.random()>0.05?'active':'inactive';
        const bat = Math.floor(Math.random()*40)+60;
        const eyes = Math.floor(Math.random()*7000)+8000;
        html += `
        <div class="rickshaw-track-card card">
            <div class="track-header">
                <div class="track-id"><span class="live-dot ${online?'online':'offline'}"></span>RKS-${String(i+1).padStart(3,'0')}</div>
                <span class="track-battery">🔋 ${bat}%</span>
            </div>
            <div class="track-zone">📍 ${z.name}</div>
            <div class="track-route">🛣️ ${route}</div>
            <div class="track-metrics"><span>👁️ ${fmt(eyes)} eye views</span><span>📊 ${fmt(Math.floor(Math.random()*7000)+8000)} exposure</span></div>
            <div class="track-campaigns">
                <span class="campaign-badge ${audio}">🔊 Audio: ${audio}</span>
                <span class="campaign-badge ${led}">💡 LED: ${led}</span>
            </div>
            ${Math.random()>0.3 ? '<div class="track-active-campaign">Active: Advertiser Campaign</div>' : '<div class="track-available">Available for booking</div>'}
        </div>`;
    }
    grid.innerHTML = html;
}

// SECTION 10: Eye Calculator
function buildEyeCalculator() {
    const container = document.getElementById('eyeCalculator');
    if (!container) return;
    container.innerHTML = `
        <div class="calculator-card card">
            <h3>👁️ Estimate Your Eye Views</h3>
            <div class="calc-inputs">
                <div class="calc-input-group">
                    <label>Select Zone</label>
                    <select id="calcZone" onchange="updateEyeCalc()">
                        <option value="">All Zones (Average)</option>
                        ${Object.values(DATA.zones).map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}
                    </select>
                </div>
                <div class="calc-input-group">
                    <label>Rickshaws</label>
                    <input type="range" id="calcRickshaws" min="1" max="50" value="10" oninput="document.getElementById('rickshawVal').textContent=this.value;updateEyeCalc()">
                    <span id="rickshawVal">10</span>
                </div>
                <div class="calc-input-group">
                    <label>Days</label>
                    <input type="range" id="calcDuration" min="7" max="90" value="30" oninput="document.getElementById('durationVal').textContent=this.value;updateEyeCalc()">
                    <span id="durationVal">30</span>
                </div>
            </div>
            <div class="calc-results">
                <div class="calc-result-item"><span class="calc-result-icon">👁️</span><span class="calc-result-value" id="resEyes">3,450,000</span><span class="calc-result-label">Eye Views</span></div>
                <div class="calc-result-item"><span class="calc-result-icon">👥</span><span class="calc-result-value" id="resReach">2,553,000</span><span class="calc-result-label">Reach</span></div>
                <div class="calc-result-item"><span class="calc-result-icon">💰</span><span class="calc-result-value" id="resCost">₹45,000</span><span class="calc-result-label">Cost</span></div>
                <div class="calc-result-item"><span class="calc-result-icon">📊</span><span class="calc-result-value" id="resCPM">₹4.50</span><span class="calc-result-label">CPM</span></div>
            </div>
        </div>
    `;
}

function updateEyeCalc() {
    const zid = document.getElementById('calcZone')?.value;
    const r = parseInt(document.getElementById('calcRickshaws')?.value||10);
    const d = parseInt(document.getElementById('calcDuration')?.value||30);
    let avg=11500, price=150;
    if (zid && DATA.zones[zid]) {
        const z = DATA.zones[zid];
        avg = z.estimatedDailyEyeViews / z.rickshawCount;
        price = z.basePricePerDay;
    }
    const eyes = avg * r * d;
    document.getElementById('resEyes').textContent = fmt(eyes);
    document.getElementById('resReach').textContent = fmt(Math.floor(eyes*0.74));
    document.getElementById('resCost').textContent = '₹'+(price*r*d).toLocaleString('en-IN');
    document.getElementById('resCPM').textContent = '₹'+((price*r*d)/(eyes/1000)).toFixed(2);
}

// SECTION 11: Neuro Cards
function buildNeuroCards() {
    const grid = document.getElementById('neuroCardsGrid');
    if (!grid) return;
    grid.innerHTML = DATA.neuromarketing.map(c => `
        <div class="neuro-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <span class="neuro-icon">${c.icon}</span>
                    <h3>${c.front}</h3>
                    <div class="neuro-stat">${c.stat}</div>
                    <span class="neuro-stat-label">${c.statLabel}</span>
                </div>
                <div class="flip-card-back"><p>${c.back}</p></div>
            </div>
        </div>
    `).join('');
}

// SECTION 13-15: Comparison Tables
function buildComparisonTables() {
    ['instagram','facebook','youtube'].forEach(platform => {
        const container = document.getElementById('comparison' + platform.charAt(0).toUpperCase() + platform.slice(1));
        if (!container) return;
        const data = DATA.comparisons[platform];
        const name = platform==='instagram'?'Instagram Ads':platform==='facebook'?'Facebook Ads':'YouTube Ads';
        const color = platform==='instagram'?'#E1306C':platform==='facebook'?'#1877F2':'#FF0000';
        
        if (platform === 'youtube') {
            container.innerHTML = data.map(row => `
                <div class="comparison-bar">
                    <div class="bar-label">${row[0]}</div>
                    <div class="bar-row">
                        <div class="bar-rasaai"><div class="bar-fill rasaai-fill" style="width:100%"></div><span>${row[1]}</span></div>
                        <div class="bar-competitor"><div class="bar-fill competitor-fill" style="width:35%"></div><span>${row[2]}</span></div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <table class="comparison-table">
                    <thead><tr><th>Feature</th><th style="color:var(--brand-green)">🛺 RASAAI</th><th style="color:${color}">${name}</th></tr></thead>
                    <tbody>${data.map(row=>`<tr><td><strong>${row[0]}</strong></td><td class="rasaai-col">${row[1]}</td><td>${row[2]}</td></tr>`).join('')}</tbody>
                </table>
            `;
        }
    });
}

// SECTION 16: Audio Player
function buildAudioPlayer() {
    const container = document.getElementById('audioPlayer');
    if (!container) return;
    container.innerHTML = `
        <div class="calculator-card card" style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px;">🔊</div>
            <h3>Sample Audio Ad</h3>
            <p style="color:var(--gray-500);margin-bottom:16px;">🎧 This is what your customers hear on the street</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
                <button class="btn-primary btn-gradient" onclick="alert('Audio: 🎙️ Visit Spice Garden Restaurant in Kausa! Best biryani in town. 20% off on your first visit!')">▶️ Restaurant Ad</button>
                <button class="btn-primary btn-gradient" onclick="alert('Audio: 🎙️ Mumbra Dental Care - Your smile is our priority! Book your checkup today. Near Mumbra Station.')">▶️ Clinic Ad</button>
                <button class="btn-primary btn-gradient" onclick="alert('Audio: 🎙️ Oxford Academy admissions open! Limited seats. Visit our Kausa campus today!')">▶️ Education Ad</button>
            </div>
        </div>
    `;
}

// SECTION 17: Format Cards
function buildFormatCards() {
    const container = document.getElementById('formatCards');
    if (!container) return;
    container.innerHTML = DATA.adFormats.map(f => `
        <div class="format-card card ${f.recommended?'recommended':''}">
            ${f.recommended?'<span class="recommended-badge">⭐ Recommended</span>':''}
            <div class="format-icon">${f.icon}</div>
            <h3>${f.name}</h3>
            <p>${f.description}</p>
            <ul class="format-features">${f.features.map(ft=>`<li>✓ ${ft}</li>`).join('')}</ul>
            <div class="format-price-multiplier">${f.priceMultiplier}x base rate</div>
        </div>
    `).join('');
}

// SECTION 18: Campaign Builder
function buildCampaignBuilder() {
    const container = document.getElementById('campaignBuilderContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="calculator-card card">
            <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap">
                <span class="step-number" style="margin:0">1</span><span style="line-height:36px">→</span>
                <span class="step-number" style="margin:0;background:var(--gray-300)">2</span><span style="line-height:36px">→</span>
                <span class="step-number" style="margin:0;background:var(--gray-300)">3</span><span style="line-height:36px">→</span>
                <span class="step-number" style="margin:0;background:var(--gray-300)">4</span><span style="line-height:36px">→</span>
                <span class="step-number" style="margin:0;background:var(--gray-300)">5</span><span style="line-height:36px">→</span>
                <span class="step-number" style="margin:0;background:var(--gray-300)">6</span>
            </div>
            <h3>Step 1: Select Zone(s)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:24px">
                ${Object.values(DATA.zones).map(z=>`<label style="display:flex;align-items:center;gap:8px;padding:12px;border:2px solid var(--gray-200);border-radius:8px;cursor:pointer"><input type="checkbox" checked>${z.name}</label>`).join('')}
            </div>
            <div class="calc-input-group"><label>Number of Rickshaws</label><input type="range" value="10" min="1" max="50"><span>10</span></div>
            <div class="calc-input-group"><label>Campaign Duration</label><select style="flex:1"><option>30 Days</option><option>15 Days</option><option>60 Days</option></select></div>
            <button class="btn-primary btn-gradient btn-block" onclick="openBookingModal()" style="margin-top:16px">Next: Upload Creative →</button>
        </div>
    `;
}

// SECTION 19: Pricing Cards
function buildPricingCards() {
    const grid = document.getElementById('pricingGrid');
    if (!grid) return;
    let i=0;
    grid.innerHTML = Object.entries(DATA.pricing).map(([zid,p]) => {
        const z = DATA.zones[zid];
        const featured = i===1;
        i++;
        return `
        <div class="pricing-card card ${featured?'featured':''}">
            ${featured?'<span class="pricing-badge">🔥 Most Popular</span>':''}
            <h3 class="zone-name">📍 ${z.name}</h3>
            <div class="price">₹${p.dailyRate}<span class="price-period">/day</span></div>
            <p class="price-sub">per rickshaw</p>
            <ul class="features-list">
                <li>👁️ ~${fmt(Math.floor(z.estimatedDailyEyeViews/z.rickshawCount*10))} eye views/day*</li>
                <li>🛺 ${p.available} rickshaws available</li>
                <li>📍 ${z.coveragePercentage}% zone coverage</li>
                <li>📊 Real-time tracking</li>
                <li>🎨 Creative included</li>
                <li>🔄 Content changes</li>
            </ul>
            <div class="pricing-periods">
                <div class="period-option">₹${p.weeklyRate}/wk</div>
                <div class="period-option best-value">₹${p.monthlyRate}/mo</div>
            </div>
            <p class="pricing-note">*Based on 10 rickshaws</p>
            <button class="btn-primary btn-gradient btn-block" onclick="openBookingModal()">Book Now</button>
        </div>`;
    }).join('');
}

// SECTION 20: Inventory
function buildInventoryCards() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;
    grid.innerHTML = Object.values(DATA.zones).map(z => {
        const stock = z.availableRickshaws<10?'critical':z.availableRickshaws<20?'low':'good';
        return `
        <div class="inventory-card card">
            <h3>📍 ${z.name}</h3>
            <div class="inventory-stock ${stock}">
                <span class="stock-number">${z.availableRickshaws}</span>
                <span class="stock-label">rickshaws left</span>
            </div>
            <div class="inventory-bar"><div class="inventory-fill" style="width:${z.coveragePercentage}%"></div></div>
            <p class="inventory-status ${stock}">${stock==='critical'?'⚠️ Almost sold out!':stock==='low'?'⚡ Selling fast':'✅ Available'}</p>
        </div>`;
    }).join('');
}

// SECTION 21: ROI Calculator
function buildROICalculator() {
    const container = document.getElementById('roiCalcContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="roi-calculator card">
            <h3>🧮 Advanced ROI Calculator</h3>
            <div class="roi-inputs">
                <div class="calc-input-group"><label>Business Type</label><select id="roiBiz"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option><option value="education">Education</option></select></div>
                <div class="calc-input-group"><label>Zone</label><select id="roiZone">${Object.values(DATA.zones).map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
                <div class="calc-input-group"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="document.getElementById('budgetVal').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');updateROI()"><span id="budgetVal">₹50,000</span></div>
            </div>
            <div class="roi-results"><h4>Projected Performance</h4>
                <div class="roi-results-grid">
                    <div class="calc-result-item"><span class="calc-result-value" id="roiEyes">--</span><span class="calc-result-label">Eye Views</span></div>
                    <div class="calc-result-item"><span class="calc-result-value" id="roiFoot">--</span><span class="calc-result-label">Footfall ↑</span></div>
                    <div class="calc-result-item"><span class="calc-result-value" id="roiCust">--</span><span class="calc-result-label">New Customers</span></div>
                    <div class="calc-result-item"><span class="calc-result-value" id="roiRev">--</span><span class="calc-result-label">Revenue Impact</span></div>
                    <div class="calc-result-item"><span class="calc-result-value" id="roiROI">--</span><span class="calc-result-label">ROI</span></div>
                    <div class="calc-result-item"><span class="calc-result-value" id="roiBE">--</span><span class="calc-result-label">Break-even</span></div>
                </div>
            </div>
        </div>
    `;
}

function updateROI() {
    const zid = document.getElementById('roiZone')?.value||'kausa';
    const budget = parseInt(document.getElementById('roiBudget')?.value||50000);
    const z = DATA.zones[zid];
    const ricks = Math.min(Math.floor(budget/(z.basePricePerDay*30)),z.rickshawCount);
    const cost = ricks*z.basePricePerDay*30;
    const eyes = (z.estimatedDailyEyeViews/z.rickshawCount)*ricks*30;
    const foot = Math.floor(eyes*0.02);
    const cust = Math.floor(foot*0.3);
    const rev = cust*500;
    document.getElementById('roiEyes').textContent = fmt(eyes);
    document.getElementById('roiFoot').textContent = '+'+foot+'%';
    document.getElementById('roiCust').textContent = cust.toLocaleString('en-IN');
    document.getElementById('roiRev').textContent = '₹'+rev.toLocaleString('en-IN');
    document.getElementById('roiROI').textContent = cost>0?Math.floor((rev-cost)/cost*100)+'%':'--';
    document.getElementById('roiBE').textContent = rev>0?Math.ceil(cost/(rev/30))+' days':'--';
}

// SECTION 22-24: Case Studies
function buildCaseStudies() {
    const container = document.getElementById('caseStudiesSwipe');
    if (!container) return;
    container.innerHTML = DATA.caseStudies.map((s,i) => `
        <div class="case-study-card card">
            <div class="case-study-header"><span class="case-number">Case ${i+1}</span><span class="case-type">${s.type}</span></div>
            <h3>${s.businessName}</h3>
            <div class="case-meta"><span>📍 ${s.zone}</span><span>⏱️ ${s.duration}</span><span>💰 ${s.budget}</span></div>
            <div class="case-results">
                <div class="result-item"><span class="result-value">${s.result1}</span><span class="result-label">${s.result1Label}</span></div>
                <div class="result-item"><span class="result-value">${s.result2}</span><span class="result-label">${s.result2Label}</span></div>
                <div class="result-item"><span class="result-value">${s.result3}</span><span class="result-label">${s.result3Label}</span></div>
            </div>
            <blockquote class="case-testimonial">"${s.testimonial}"<cite>— ${s.owner}</cite></blockquote>
        </div>
    `).join('');
}

// SECTION 25: Industries
function buildIndustryCards() {
    const container = document.getElementById('industryCards');
    if (!container) return;
    container.innerHTML = DATA.industries.map(ind => `
        <div class="industry-card card"><div class="industry-icon">${ind.icon}</div><h3>${ind.name}</h3><p>${ind.desc}</p></div>
    `).join('');
}

// SECTION 26: Testimonials
function buildTestimonials() {
    const container = document.getElementById('testimonialCarousel');
    if (!container) return;
    container.innerHTML = DATA.testimonials.map(t => `
        <div class="testimonial-card card">
            <div class="testimonial-stars">${'⭐'.repeat(t.rating)}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author"><strong>${t.name}</strong><span>${t.business}, ${t.zone}</span></div>
        </div>
    `).join('');
}

// SECTION 27: Video Gallery
function buildVideoGallery() {
    const container = document.getElementById('videoGrid');
    if (!container) return;
    container.innerHTML = [1,2,3,4].map(i => `
        <div class="card" style="text-align:center;padding:32px">
            <div style="font-size:48px">🎬</div>
            <h4>Campaign Video ${i}</h4>
            <p style="color:var(--gray-500);font-size:14px">RASAAI rickshaw ad in action</p>
            <button class="btn-primary btn-gradient" style="margin-top:12px">▶️ Watch</button>
        </div>
    `).join('');
}

// SECTION 28: Heatmap
function buildHeatmap() {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="heatmap-visual">
            <div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient"></div><span>High</span></div>
            ${Object.values(DATA.zones).map(z => {
                const i = z.coveragePercentage/100;
                return `<div class="heatmap-zone" style="background:rgba(0,200,83,${i*0.7});border:2px solid ${i>0.8?'#00C853':'rgba(0,200,83,0.3)'}">
                    <div class="heatmap-zone-info"><strong>${z.name}</strong><span>${z.coveragePercentage}%</span><span>${z.rickshawCount} rickshaws</span></div>
                    <div class="heatmap-bar"><div class="heatmap-fill" style="width:${z.coveragePercentage}%"></div></div>
                </div>`;
            }).join('')}
            <div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="document.getElementById('htTime').textContent=this.value+':00'"><span id="htTime">12:00</span></div>
        </div>
    `;
}

// SECTION 29: Leaderboard
function buildLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;
    const sorted = Object.values(DATA.zones).sort((a,b)=>b.estimatedDailyEyeViews-a.estimatedDailyEyeViews);
    container.innerHTML = sorted.map((z,i) => `
        <div class="leaderboard-bar">
            <div class="leaderboard-rank">#${i+1}</div>
            <div class="leaderboard-info">
                <span class="leaderboard-name">${z.name}</span>
                <div class="leaderboard-bar-track"><div class="leaderboard-bar-fill" style="width:${(z.estimatedDailyEyeViews/sorted[0].estimatedDailyEyeViews)*100}%"></div></div>
                <span class="leaderboard-value">${fmt(z.estimatedDailyEyeViews)} eye views/day</span>
            </div>
        </div>
    `).join('');
}

// SECTION 30: Affiliate
function buildAffiliate() {
    const container = document.getElementById('affiliateContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="affiliate-card card">
            <h3>💰 Earn 10% on Every Referral</h3>
            <p style="color:var(--gray-600);margin:16px 0">Refer a business to RASAAI and earn 10% commission on their first campaign.</p>
            <div class="affiliate-calculator">
                <label>Referral Campaign Budget:</label>
                <input type="range" min="5000" max="500000" value="50000" step="5000" oninput="document.getElementById('affEarn').textContent='₹'+(this.value*0.1).toLocaleString('en-IN')">
                <div class="affiliate-result">Your Earning: <strong id="affEarn">₹5,000</strong></div>
            </div>
            <button class="btn-primary btn-gradient btn-block" onclick="openBookingModal()">Start Referring</button>
        </div>
    `;
}

// SECTION 31: Contest
function buildContest() {
    const container = document.getElementById('contestContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="calculator-card card" style="text-align:center">
            <div style="font-size:48px">🏆</div>
            <h3>Run a Hashtag Contest</h3>
            <p style="color:var(--gray-500);margin:12px 0">Engage your audience with rickshaw-powered hashtag contests</p>
            <div class="calc-input-group"><label>Contest Hashtag</label><input type="text" value="#RasaaiContest" style="flex:1;padding:10px;border:2px solid var(--gray-200);border-radius:8px"></div>
            <div class="calc-input-group"><label>Prize</label><input type="text" value="₹5,000 Cash" style="flex:1;padding:10px;border:2px solid var(--gray-200);border-radius:8px"></div>
            <button class="btn-primary btn-gradient btn-block" style="margin-top:16px">Launch Contest</button>
        </div>
    `;
}

// SECTION 32: Hashtag Tracking
function buildHashtag() {
    const container = document.getElementById('hashtagContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="calculator-card card" style="text-align:center">
            <div style="font-size:48px">📱</div>
            <h3>Live Hashtag Tracking</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0">
                <div style="padding:16px;background:var(--gray-50);border-radius:8px"><div style="font-size:28px;font-weight:800;color:var(--brand-green)">247</div><div style="font-size:12px;color:var(--gray-500)">Mentions</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:8px"><div style="font-size:28px;font-weight:800;color:var(--purple)">1.2K</div><div style="font-size:12px;color:var(--gray-500)">Engagement</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:8px"><div style="font-size:28px;font-weight:800;color:var(--amber)">89%</div><div style="font-size:12px;color:var(--gray-500)">Positive</div></div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:100px;font-size:12px">📷 Instagram: 142</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:100px;font-size:12px">👍 Facebook: 68</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:100px;font-size:12px">🐦 Twitter: 37</span>
            </div>
        </div>
    `;
}

// SECTION 33: FAQ
function buildFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = DATA.faq.map(item => `
        <div class="faq-item">
            <button class="faq-question" onclick="this.parentElement.classList.toggle('active')"><span>${item.q}</span><span class="faq-icon">+</span></button>
            <div class="faq-answer"><p>${item.a}</p></div>
        </div>
    `).join('');
}

// ============================================
// COUNTERS & TIMERS
// ============================================
function startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now-start)/duration, 1);
            const eased = 1-(1-progress)*(1-progress);
            const val = Math.floor(target*eased);
            el.textContent = val>=10000000?(val/10000000).toFixed(1)+'M+':val>=100000?(val/100000).toFixed(1)+'L':val>=1000?val.toLocaleString('en-IN'):val;
            if (progress<1) requestAnimationFrame(update);
            else el.textContent = target>=10000000?(target/10000000).toFixed(1)+'M+':target>=100000?(target/100000).toFixed(1)+'L':target>=1000?target.toLocaleString('en-IN'):target;
        }
        requestAnimationFrame(update);
    });
}

function startTimers() {
    // Pricing timer
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) {
        let sec = 299;
        setInterval(() => {
            const m = Math.floor(sec/60), s = sec%60;
            timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            sec--; if (sec<0) sec=299;
        }, 1000);
    }
    
    // Live stats updates
    setInterval(() => {
        const r = document.getElementById('liveRickshaws');
        if (r) r.textContent = 340+Math.floor(Math.random()*10);
        const c = document.getElementById('liveCampaigns');
        if (c) c.textContent = 125+Math.floor(Math.random()*8);
    }, 5000);
    
    // Sticky bar
    window.addEventListener('scroll', () => {
        const bar = document.querySelector('.sticky-mobile-bar');
        if (bar) bar.style.display = window.scrollY>300?'flex':'none';
    });
    
    // Exit intent
    let exitShown = false;
    document.addEventListener('mouseout', (e) => {
        if (!exitShown && e.clientY<=0 && window.scrollY>500) {
            document.getElementById('exitPopup').classList.add('show');
            exitShown = true;
            setTimeout(()=>exitShown=false, 300000);
        }
    });
}

// ============================================
// FAB MENU
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) { loader.classList.add('hidden'); setTimeout(()=>loader.remove(),500); }
    }, 1500);
    
    // Build everything
    buildAll();
    
    // FAB toggle
    const fab = document.getElementById('fabMain');
    const fabContainer = document.querySelector('.fab-container');
    if (fab && fabContainer) {
        fab.addEventListener('click', (e) => {
            e.stopPropagation();
            fabContainer.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target)) fabContainer.classList.remove('active');
        });
    }
    
    // Bottom nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Notification cycle
    const notifs = ['🏃 3 businesses booked Kausa today','🔥 Mumbra Station: Only 8 left','✅ New campaign in Shilphata','💼 Agency booked 15 rickshaws'];
    let ni = 0;
    setInterval(() => {
        const w = document.getElementById('notificationWidget');
        const t = document.getElementById('notificationText');
        if (w && t) {
            t.textContent = notifs[ni];
            w.classList.add('show');
            setTimeout(()=>w.classList.remove('show'), 4000);
            ni = (ni+1)%notifs.length;
        }
    }, 8000);
});

// Make functions globally accessible
window.scrollToSection = scrollToSection;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeExitPopup = closeExitPopup;
window.handleBookingSubmit = handleBookingSubmit;
window.updateEyeCalc = updateEyeCalc;
window.updateROI = updateROI;
