// ============================================
// RASAAI - Complete Application Logic
// Email: mafs.grp@gmail.com | Phone: +919594306625
// Dynamic Pricing: ₹1,238 - ₹1,647 | Theme: Zoomcar
// ============================================

const PHONE = "+919594306625";
const WHATSAPP = "919594306625";
const EMAIL = "mafs.grp@gmail.com";

// ============================================
// DATA
// ============================================
const ROUTES_DATA = [
    { id:"route1", name:"Mumbra → Kausa → MM Valley Road", zones:["Mumbra","Kausa","MM Valley Road"], ricks:85, eyes:"125,000", color:"#FFF3D6" },
    { id:"route2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", zones:["Mumbra","Kausa","Kalsekar Bypass","Shilphata","Kalyan Phata","Taloja Phase 1","Taloja Phase 2"], ricks:185, eyes:"315,000", color:"#E8F5E9" },
    { id:"route3", name:"Mumbra → Retibunder → Kalwa Naka", zones:["Mumbra","Retibunder","Kalwa Naka"], ricks:50, eyes:"75,000", color:"#FCE4EC" },
    { id:"route4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", zones:["Mumbra","Retibunder","Check Naka","Majhiwada"], ricks:30, eyes:"77,000", color:"#E3F2FD" }
];

const ZONES_DATA = [
    { id:"kausa", name:"Kausa", pop:45000, traffic:"85K/day", peak:"8AM-8PM", eyes:"125,000", ricks:85, avail:42, cov:87, lat:19.1765, lng:73.0320, color:"#E8F5E9" },
    { id:"mumbra-station", name:"Mumbra Station", pop:78000, traffic:"150K/day", peak:"7AM-9PM", eyes:"220,000", ricks:120, avail:8, cov:92, lat:19.1800, lng:73.0280, color:"#FFF3D6" },
    { id:"shilphata", name:"Shilphata", pop:55000, traffic:"110K/day", peak:"7AM-9PM", eyes:"155,000", ricks:65, avail:25, cov:78, lat:19.1950, lng:73.0480, color:"#E3F2FD" },
    { id:"retibunder", name:"Retibunder", pop:35000, traffic:"65K/day", peak:"9AM-8PM", eyes:"75,000", ricks:50, avail:30, cov:72, lat:19.1700, lng:73.0380, color:"#FCE4EC" },
    { id:"check-naka", name:"Check Naka", pop:40000, traffic:"70K/day", peak:"7AM-8PM", eyes:"77,000", ricks:30, avail:20, cov:65, lat:19.1850, lng:73.0350, color:"#FFF8E1" },
    { id:"kalwa", name:"Kalwa Naka", pop:52000, traffic:"95K/day", peak:"8AM-9PM", eyes:"130,000", ricks:55, avail:18, cov:74, lat:19.1650, lng:73.0420, color:"#F3E5F5" },
    { id:"majhiwada", name:"Majhiwada", pop:48000, traffic:"80K/day", peak:"8AM-8PM", eyes:"110,000", ricks:40, avail:22, cov:68, lat:19.1900, lng:73.0300, color:"#E0F7FA" },
    { id:"taloja1", name:"Taloja Phase 1", pop:30000, traffic:"45K/day", peak:"7AM-7PM", eyes:"60,000", ricks:25, avail:15, cov:55, lat:19.2000, lng:73.0600, color:"#F1F8E9" },
    { id:"taloja2", name:"Taloja Phase 2", pop:28000, traffic:"40K/day", peak:"7AM-7PM", eyes:"55,000", ricks:22, avail:17, cov:50, lat:19.2050, lng:73.0650, color:"#E8EAF6" },
    { id:"kalyan-phata", name:"Kalyan Phata", pop:42000, traffic:"75K/day", peak:"8AM-9PM", eyes:"100,000", ricks:45, avail:20, cov:70, lat:19.1980, lng:73.0550, color:"#FFF9C4" },
    { id:"kalsekar", name:"Kalsekar Bypass", pop:38000, traffic:"60K/day", peak:"7AM-8PM", eyes:"85,000", ricks:35, avail:28, cov:62, lat:19.1850, lng:73.0500, color:"#FBE9E7" },
    { id:"mm-valley", name:"MM Valley Road", pop:32000, traffic:"50K/day", peak:"8AM-8PM", eyes:"70,000", ricks:28, avail:25, cov:58, lat:19.1720, lng:73.0250, color:"#EFEBE9" }
];

const NEURO_DATA = [
    {icon:"👁️",title:"Motion Bias",front:"Motion Bias",back:"Human visual cortex detects movement automatically. Moving rickshaw ads command 400% more attention than static billboards.",stat:"400%",label:"More Attention"},
    {icon:"⚡",title:"Pattern Interruption",front:"Pattern Interruption",back:"New ad breaks expected patterns, triggering norepinephrine release and encoding into memory.",stat:"3x",label:"Memory Encoding"},
    {icon:"🔄",title:"Spaced Repetition",front:"Spaced Repetition",back:"Same ad on different rickshaws across days = 3x memory consolidation via spacing effect.",stat:"3x",label:"Consolidation"},
    {icon:"🧠",title:"Visual Recall",front:"Visual Recall",back:"65% of visual info recalled after 3 days vs 10% text. Transit ads use dual encoding.",stat:"65%",label:"Recall Rate"},
    {icon:"📍",title:"Location Familiarity",front:"Location Familiarity",back:"Ads in familiar locations feel trustworthy. Mere-exposure effect builds community connection.",stat:"73%",label:"Trust Increase"},
    {icon:"👥",title:"Social Proof",front:"Social Proof",back:"Thousands seeing same ad = implicit social proof. Drives word-of-mouth and credibility.",stat:"5x",label:"Word-of-Mouth"},
    {icon:"🔊",title:"Dual-Channel",front:"Dual-Channel Encoding",back:"Audio + Visual = two memory pathways. 85% higher recall than visual-only transit ads.",stat:"85%",label:"Higher Recall"},
    {icon:"🏘️",title:"Community",front:"Community Recognition",back:"73% prefer brands that feel local. Transit ads create neighborhood ownership and trust.",stat:"73%",label:"Prefer Local"}
];

const TESTIMONIALS = [
    {name:"Ahmed Shaikh",biz:"Mumbra Pizza House",zone:"Mumbra Station",text:"RASAAI se humare Pizza House ki walk-ins 65% badh gayi. Best advertising investment for local businesses in Mumbra!",rating:5,initials:"AS"},
    {name:"Dr. Fatima Khan",biz:"Shifa Clinic",zone:"Kausa",text:"120 new patients in 6 months through rickshaw ads. Hyperlocal visibility that actually works!",rating:5,initials:"FK"},
    {name:"Mohammed Ali",biz:"Al-Huda Tuition",zone:"Shilphata",text:"45 new students enrolled in 2 months. Combo package is worth every rupee!",rating:5,initials:"MA"},
    {name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Store visibility doubled. Customers walk in saying they saw our rickshaw ad. Best ₹15,000 spent!",rating:5,initials:"RS"},
    {name:"Priya Patel",biz:"Fashion Hub",zone:"Mumbra Station",text:"Best advertising investment. Real people, real eyes, real customers. 40% sales increase.",rating:5,initials:"PP"},
    {name:"Vikram Singh",biz:"AutoCare Center",zone:"Check Naka",text:"Reached truck drivers we couldn't reach online. Brilliant platform for B2B marketing.",rating:5,initials:"VS"},
    {name:"Sneha Gupta",biz:"Sweet Bengal",zone:"Kausa",text:"Sweet shop became talk of the area. Rickshaw branding is unforgettable marketing.",rating:5,initials:"SG"},
    {name:"Deepa Shah",biz:"Wellness Yoga",zone:"Shilphata",text:"50+ new members. Morning commuters see our ad every day. Consistent branding works.",rating:5,initials:"DS"},
    {name:"Rajesh Patil",biz:"Shilphata Industries",zone:"Shilphata",text:"Reached warehouse managers who don't use social media. RASAAI unmatched for industrial B2B.",rating:5,initials:"RP"},
    {name:"Kavita Reddy",biz:"Spice Garden",zone:"Kausa",text:"Dinner crowd doubled in 2 weeks. Brought customers from areas we never reached before.",rating:5,initials:"KR"},
    {name:"Sunil Shetty",biz:"FitLife Gym",zone:"Check Naka",text:"New year campaign got 80+ signups. LED ads at night are eye-catching magic.",rating:5,initials:"SS"},
    {name:"Anita Desai",biz:"BookWorm Library",zone:"Retibunder",text:"Memberships tripled. Kids see ad on school routes and beg parents to join!",rating:4,initials:"AD"},
    {name:"Mohan Lal",biz:"Lal Jewelers",zone:"Mumbra Station",text:"Wedding season campaign generated 60+ inquiries. Trust factor of physical ads unbeatable.",rating:5,initials:"ML"},
    {name:"Pooja Malhotra",biz:"Pixel Photography",zone:"Retibunder",text:"Booked 12 weddings after rickshaw campaign. Visual medium works wonders!",rating:4,initials:"PM"},
    {name:"Harish Thakur",biz:"Thakur Hardware",zone:"Check Naka",text:"Everyone knows our shop name now. Simple branding, massive recall. Highly recommend.",rating:5,initials:"HT"}
];

const INDUSTRIES = [
    {name:"Retail Stores",icon:"🏪",desc:"Drive footfall. Local visibility = local customers."},
    {name:"Restaurants",icon:"🍽️",desc:"Hungry commuters see your ad daily."},
    {name:"Clinics",icon:"🏥",desc:"Healthcare ads build local patient trust."},
    {name:"Pharmacies",icon:"💊",desc:"Be the first name they recall."},
    {name:"Schools",icon:"🏫",desc:"Reach parents on school routes."},
    {name:"Coaching",icon:"📚",desc:"Students see you every day."},
    {name:"Real Estate",icon:"🏠",desc:"Property ads in the neighborhood."},
    {name:"Gyms",icon:"💪",desc:"Fitness ads on commute routes."},
    {name:"Salons",icon:"💇",desc:"Beauty parlors visible daily."},
    {name:"Electronics",icon:"📱",desc:"Tech deals seen by gadget lovers."},
    {name:"Jewelry",icon:"💍",desc:"Wedding season? Be seen."},
    {name:"Banks",icon:"🏦",desc:"Financial services build trust."},
    {name:"Insurance",icon:"🛡️",desc:"Seen = trusted in local markets."},
    {name:"Automobile",icon:"🚗",desc:"Commuters are your audience."},
    {name:"Hardware",icon:"🔧",desc:"Found when needed most."},
    {name:"Furniture",icon:"🪑",desc:"Home dreams start on streets."},
    {name:"Events",icon:"🎉",desc:"Be booked for the big day."},
    {name:"Travel",icon:"✈️",desc:"Vacation dreams triggered daily."},
    {name:"Catering",icon:"🍲",desc:"Party orders from rickshaw ads."},
    {name:"Dentist",icon:"🦷",desc:"Toothache? They know where."}
];

const FAQ_DATA = [
    {q:"How are Eye Views different from Impressions?",a:"Eye Views track verified human visual contact based on foot traffic and viewing angles. Unlike digital impressions (server requests), Eye Views measure real attention. Average: 11,500 Eye Views per rickshaw daily."},
    {q:"What routes do you cover?",a:"4 strategic routes: (1) Mumbra→Kausa→MM Valley Road (2) Mumbra→Kausa→Kalsekar Bypass→Shilphata→Kalyan Phata→Taloja Phase 1&2 (3) Mumbra→Retibunder→Kalwa Naka (4) Mumbra→Retibunder→Check Naka→Majhiwada. 600+ rickshaws total across 12 zones."},
    {q:"How does dynamic pricing work?",a:"Prices range ₹1,238-₹1,647/day per rickshaw, changing every 15 minutes based on demand. Popular routes during peak hours are priced higher. 10% discount on 10+ rickshaws."},
    {q:"What ad formats are available?",a:"LED Display (₹1,238-1,647/day), Audio Announcement (₹318-639/day), and LED+Audio Combo. Book any LED/Combo and get 30 FREE social media creatives."},
    {q:"How do I track my campaign?",a:"Real-time dashboard: Eye Views, Impressions, Reach, GPS routes, daily reports. Data refreshes every 30 seconds."},
    {q:"How fast can I launch?",a:"48-72 hours from booking. We handle creative production, rickshaw installation, GPS setup. Call +91 95943 06625."},
    {q:"How does RASAAI compare to digital ads?",a:"0% skip rate (vs 76% YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 Instagram). Physical ads reach non-internet users."},
    {q:"Can I choose specific routes?",a:"Yes! Select from 4 routes and 12 zones. Target school zones, market areas, station queues, or industrial corridors."}
];

// ============================================
// DYNAMIC PRICING ENGINE
// ============================================
function getDynamicPrice() {
    const min = 1238, max = 1647;
    const cycle = Date.now() / 900000 * Math.PI;
    const demand = Math.sin(cycle) * 0.5 + 0.5;
    const noise = Math.random() * 0.1;
    return Math.floor(min + (max - min) * (demand * 0.7 + noise));
}

// ============================================
// HELPERS
// ============================================
function $(id) { return document.getElementById(id); }
function fmt(n) { return n >= 10000000 ? (n/10000000).toFixed(1)+'M' : n >= 100000 ? (n/100000).toFixed(1)+'L' : n >= 1000 ? n.toLocaleString('en-IN') : n.toString(); }
function scrollToSection(id) { const el = $(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

// ============================================
// BUILD ALL SECTIONS
// ============================================
function init() {
    buildTrustLogos();
    buildRoutes();
    buildZoneCards();
    buildCoverageMap();
    buildRickshawTracks();
    buildEyeCalculator();
    buildNeuroCards();
    buildMetrics();
    buildComparisonTabs();
    buildAudioPlayer();
    buildFormatCards();
    buildCampaignBuilder();
    buildPricingCards();
    buildInventoryCards();
    buildROICalc();
    buildCaseStudies();
    buildIndustries();
    buildTestimonialSlider();
    buildVideoGrid();
    buildHeatmap();
    buildLeaderboard();
    buildAffiliate();
    buildContest();
    buildHashtag();
    buildFAQ();
    updateAllPrices();
    startCounters();
    startTimers();
    startLiveUpdates();
    startNotifications();
    setupExitIntent();
    setupBookingForm();
    setupMobileNav();
    
    setTimeout(() => {
        const loader = $('loadingScreen');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 500); }
    }, 1000);
}

function updateAllPrices() {
    const price = getDynamicPrice();
    const heroPrice = $('heroPrice');
    if (heroPrice) heroPrice.innerHTML = `₹${price.toLocaleString('en-IN')}<span>/day</span>`;
    buildPricingCards(price);
    if (typeof updateBookingEstimate === 'function') updateBookingEstimate(price);
}

// SECTION 3: TRUST LOGOS
function buildTrustLogos() {
    const container = $('trustLogosTrack');
    if (!container) return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🏢 Shilphata Ind.","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point"];
    const all = [...logos, ...logos];
    container.className = 'trust-logos animated';
    container.innerHTML = all.map(l => `<span class="trust-logo-item">${l}</span>`).join('');
}

// SECTION 7: ROUTES
function buildRoutes() {
    const grid = $('routesGrid');
    if (!grid) return;
    grid.innerHTML = ROUTES_DATA.map(r => `
        <div class="route-card" onclick="scrollToSection('zones')">
            <h4>🛣️ ${r.name}</h4>
            <div class="route-meta"><span>🛺 ${r.ricks} Rickshaws</span><span>👁️ ${r.eyes} Eyes/Day</span><span>📍 ${r.zones.length} Stops</span></div>
            <div class="route-zones">${r.zones.map(z => `<span class="route-zone-pill" style="background:${r.color}">${z}</span>`).join(' → ')}</div>
        </div>
    `).join('');
}

// SECTION 8: COVERAGE MAP
function buildCoverageMap() {
    const container = $('coverageMap');
    if (!container || typeof L === 'undefined') return;
    const map = L.map('coverageMap').setView([19.1800, 73.0400], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    ZONES_DATA.forEach(z => {
        const color = z.avail < 15 ? '#E74C3C' : z.cov > 80 ? '#00A86B' : '#FFB800';
        L.circleMarker([z.lat, z.lng], { radius: Math.sqrt(z.ricks) * 1.2, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.7 })
            .addTo(map)
            .bindPopup(`<b>${z.name}</b><br>🛺 ${z.ricks} rickshaws<br>👁️ ${z.eyes} eyes/day<br>${z.avail} available<br><button onclick="scrollToSection('campaignBuilder')" style="background:#FF5A00;color:white;border:none;padding:6px 12px;border-radius:100px;cursor:pointer;font-weight:600;margin-top:4px">Book Now</button>`);
    });
}

// SECTION 9: ZONE CARDS
function buildZoneCards() {
    const grid = $('zonesGrid');
    if (!grid) return;
    grid.innerHTML = ZONES_DATA.map(z => `
        <div class="zone-card" onclick="scrollToSection('campaignBuilder')">
            <div class="zone-card-image" style="background:linear-gradient(135deg,${z.color},${z.color}88)">📍
                <span class="zone-availability ${z.avail < 15 ? 'low' : ''}">${z.avail} Left</span>
            </div>
            <div class="zone-card-body">
                <h4>${z.name}</h4>
                <div class="zone-meta"><span>👥 ${fmt(z.pop)}</span><span>🚶 ${z.traffic}</span><span>🕐 ${z.peak}</span></div>
                <div class="zone-stats">
                    <div class="stat"><div class="val">${z.eyes}</div><div class="lbl">Impressions</div></div>
                    <div class="stat"><div class="val">${z.avail}/${z.ricks}</div><div class="lbl">Available</div></div>
                    <div class="stat"><div class="val">${z.cov}%</div><div class="lbl">Coverage</div></div>
                </div>
            </div>
        </div>
    `).join('');
}

// SECTION 10: RICKSHAW TRACKS
function buildRickshawTracks() {
    const grid = $('rickshawTrackGrid');
    if (!grid) return;
    const zids = Object.keys(ZONES_DATA).slice(0, 6);
    let html = '';
    for (let i = 0; i < 6; i++) {
        const z = ZONES_DATA[i];
        const online = Math.random() > 0.1;
        const audio = Math.random() > 0.1 ? 'active' : 'inactive';
        const led = Math.random() > 0.05 ? 'active' : 'inactive';
        html += `<div class="track-card">
            <div class="track-header">
                <div class="track-id"><span class="track-dot ${online ? 'online' : 'offline'}"></span>RKS-${String(i+1).padStart(3,'0')}</div>
                <span>🔋 ${Math.floor(Math.random()*40)+60}%</span>
            </div>
            <div>📍 ${z.name}</div>
            <div class="track-route">🛣️ ${ROUTES_DATA[i%4].name.split(' → ').slice(0,2).join(' → ')}</div>
            <div class="track-metrics"><span>👁️ ${fmt(Math.floor(Math.random()*7000)+8000)} eyes</span><span>📊 ${fmt(Math.floor(Math.random()*7000)+8000)} exp</span></div>
            <div style="display:flex;gap:6px;margin-top:8px">
                <span class="track-badge ${audio}">🔊 ${audio}</span>
                <span class="track-badge ${led}">💡 ${led}</span>
            </div>
        </div>`;
    }
    grid.innerHTML = html;
}

// SECTION 11: EYE CALCULATOR
function buildEyeCalculator() {
    const container = $('eyeCalculator');
    if (!container) return;
    container.innerHTML = `
        <h3>👁️ Estimate Your Eye Views</h3>
        <div class="calc-inputs">
            <div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="updateEyeCalc()"><option value="">All Zones</option>${ZONES_DATA.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="$('ecRicksVal').textContent=this.value;updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700">10</span></div>
            <div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="$('ecDaysVal').textContent=this.value;updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700">30</span></div>
        </div>
        <div class="calc-results">
            <div class="calc-result-item"><div class="calc-result-icon">👁️</div><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">👥</div><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">💰</div><div class="calc-result-value" id="ecCost">₹45,000</div><div class="calc-result-label">Est. Cost</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">📊</div><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM</div></div>
        </div>
    `;
    updateEyeCalc();
}

function updateEyeCalc() {
    const zid = $('ecZone')?.value, r = parseInt($('ecRicks')?.value || 10), d = parseInt($('ecDays')?.value || 30);
    let avg = 11500, price = getDynamicPrice();
    if (zid) { const z = ZONES_DATA.find(x => x.id === zid); if (z) { avg = parseInt(z.eyes.replace(/,/g,'')) / z.ricks; } }
    const eyes = avg * r * d;
    $('ecEyes').textContent = fmt(eyes);
    $('ecReach').textContent = fmt(Math.floor(eyes * 0.74));
    $('ecCost').textContent = '₹' + (price * r * d).toLocaleString('en-IN');
    $('ecCPM').textContent = '₹' + ((price * r * d) / (eyes / 1000)).toFixed(2);
}

// SECTION 12: NEURO CARDS
function buildNeuroCards() {
    const grid = $('neuroGrid');
    if (!grid) return;
    grid.innerHTML = NEURO_DATA.map(c => `
        <div class="neuro-card">
            <div class="neuro-inner">
                <div class="neuro-front"><span class="neuro-icon">${c.icon}</span><h4>${c.front}</h4><div class="neuro-stat">${c.stat}</div><span class="neuro-stat-label">${c.label}</span></div>
                <div class="neuro-back"><p>${c.back}</p></div>
            </div>
        </div>
    `).join('');
}

// SECTION 13: METRICS
function buildMetrics() {
    const grid = $('metricsGrid'), detail = $('metricsDetail');
    if (!grid || !detail) return;
    grid.innerHTML = `
        <div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><p style="color:var(--gray-600);font-size:13px">Verified human contact</p><span class="metrics-badge">Proprietary</span></div>
        <div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div><p style="color:var(--gray-600);font-size:13px">Total exposures</p></div>
        <div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div><p style="color:var(--gray-600);font-size:13px">Unique individuals</p></div>
    `;
    detail.innerHTML = `
        <div class="metric-detail"><div class="label">CPM (Eye View)</div><div class="value">₹4.50</div></div>
        <div class="metric-detail"><div class="label">Brand Recall</div><div class="value">68%</div></div>
        <div class="metric-detail"><div class="label">Attention Time</div><div class="value">4.2s</div></div>
        <div class="metric-detail"><div class="label" style="color:var(--green)">Skip Rate</div><div class="value" style="color:var(--green)">0%</div></div>
    `;
}

// SECTION 14: COMPARISON
function buildComparisonTabs() {
    const tabs = $('comparisonTabs');
    if (!tabs) return;
    tabs.innerHTML = `
        <button class="comp-tab active" onclick="showComparison('instagram',this)">📱 vs Instagram</button>
        <button class="comp-tab" onclick="showComparison('facebook',this)">👍 vs Facebook</button>
        <button class="comp-tab" onclick="showComparison('youtube',this)">▶️ vs YouTube</button>
    `;
    showComparison('instagram', tabs.querySelector('.comp-tab'));
}

function showComparison(platform, btn) {
    document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const data = {
        instagram: [["Hyperlocal Visibility","✅ Full zone dominance","⚠️ Limited by algorithm"],["Physical Presence","✅ Tangible, unavoidable","❌ Digital-only"],["Ad Blocking","✅ Cannot be blocked","❌ Ad blockers work"],["Non-Internet Users","✅ 100% foot traffic","❌ Internet required"],["Attention Time","✅ 3-8 seconds","⚠️ <1 second scroll"],["Brand Recall","✅ 68%","⚠️ 24%"],["Effective CPM","✅ ₹4.50","⚠️ ₹35-150"],["Ad Fatigue","✅ Low","❌ High"]],
        facebook: [["Local Penetration","✅ 100% zone coverage","⚠️ 15-40%"],["Trust Factor","✅ Physical = real","⚠️ Skepticism"],["Multi-sensory","✅ Visual + Audio","⚠️ Visual only"],["Community Feel","✅ 'Seen in area'","❌ No trace"],["Cost/1000 Eyes","✅ ₹4.50","❌ N/A"],["Offline Conversion","✅ Walk-in","❌ Click friction"]],
        youtube: [["Skip Rate","✅ 0%","❌ 65-76%"],["Ad Fatigue","✅ Low","❌ High"],["Attention","✅ 4.2 sec","⚠️ 2.1 sec"],["Brand Recall","✅ 68%","⚠️ 18%"],["Physical","✅ Yes","❌ No"],["Local Trust","✅ Community","❌ Global"]]
    };
    const content = $('comparisonContent');
    if (!content) return;
    content.innerHTML = `<table class="comp-table"><thead><tr><th>Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead><tbody>${data[platform].map(r => `<tr><td><strong>${r[0]}</strong></td><td class="win">${r[1]}</td><td class="lose">${r[2]}</td></tr>`).join('')}</tbody></table>`;
}

// SECTION 15: AUDIO PLAYER
function buildAudioPlayer() {
    const container = $('audioPlayer');
    if (!container) return;
    container.innerHTML = `
        <p style="color:var(--gray-600);margin-bottom:16px">Click to hear sample rickshaw audio advertisements 🔊</p>
        <button class="btn btn-primary" onclick="playSampleAudio('restaurant')">🍽️ Restaurant Ad</button>
        <button class="btn btn-primary" onclick="playSampleAudio('clinic')">🏥 Clinic Ad</button>
        <button class="btn btn-primary" onclick="playSampleAudio('education')">🏫 Education Ad</button>
    `;
}

function playSampleAudio(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = { restaurant: 520, clinic: 440, education: 660 }[type] || 500;
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.stop(ctx.currentTime + 1.5);
        alert('🔊 Sample ' + type + ' ad playing. Replace with MP3 file.');
    } catch(e) { alert('Audio: ' + type + ' ad would play here.'); }
}

// SECTION 16: FORMATS
function buildFormatCards() {
    const grid = $('formatCards');
    if (!grid) return;
    const formats = [
        { icon: "💡", name: "LED Display", desc: "Bright LED screen. Day & night visibility.", features: ["Full-color display","Weatherproof","GPS tracked","Changeable content"], price: "1x base", rec: false },
        { icon: "🔊", name: "Audio Announcement", desc: "Voice ad through speakers.", features: ["Pro voice-over","Multi-language","60-sec ads","Zone targeting"], price: "0.3x base", rec: false },
        { icon: "⚡", name: "LED + Audio Combo", desc: "Dual-channel. 85% higher recall.", features: ["Visual + Audio","Maximum attention","Best ROI","Priority access"], price: "1.45x base", rec: true }
    ];
    grid.innerHTML = formats.map(f => `
        <div class="format-card ${f.rec ? 'recommended' : ''}">
            ${f.rec ? '<span class="recommended-badge">⭐ Recommended</span>' : ''}
            <div class="format-icon">${f.icon}</div>
            <h4>${f.name}</h4>
            <p>${f.desc}</p>
            <ul class="format-features">${f.features.map(ft => `<li>${ft}</li>`).join('')}</ul>
            <div class="format-price">${f.price}</div>
        </div>
    `).join('');
}

// SECTION 17: CAMPAIGN BUILDER
function buildCampaignBuilder() {
    const container = $('bookingCard');
    if (!container) return;
    const price = getDynamicPrice();
    container.innerHTML = `
        <h3>📋 Build Your Campaign</h3>
        <div class="form-row">
            <div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>
            <div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo (LED + Audio)</option></select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Route / Zone</label><select id="cbRoute" onchange="updateBookingEstimate()">${ROUTES_DATA.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Rickshaws</label><select id="cbRicks" onchange="updateBookingEstimate()"><option value="1">1 Rickshaw</option><option value="5">5 Rickshaws</option><option value="10">10 Rickshaws (10% off!)</option><option value="20">20 Rickshaws (10% off!)</option></select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Duration</label><select id="cbDuration" onchange="updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div>
            <div class="form-group"><label>Your Phone *</label><input type="tel" id="cbPhone" required placeholder="+91" oninput="updateBookingEstimate()"></div>
        </div>
        <div class="price-summary" id="priceSummary"></div>
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" style="flex:1" onclick="submitCampaignBooking()">🚀 Book This Campaign</button>
            <a href="https://wa.me/${WHATSAPP}?text=Hi%20RASAAI%2C%20I%20want%20to%20book%20a%20rickshaw%20campaign" class="btn btn-whatsapp btn-lg" target="_blank">💬 Book via WhatsApp</a>
        </div>
    `;
    updateBookingEstimate(price);
}

function updateBookingEstimate(priceOverride) {
    const summary = $('priceSummary');
    if (!summary) return;
    const price = priceOverride || getDynamicPrice();
    const type = $('cbType')?.value || 'led';
    const ricks = parseInt($('cbRicks')?.value || 1);
    const duration = parseInt($('cbDuration')?.value || 1);
    let rate = price;
    if (type === 'audio') rate = Math.floor(price * 0.3);
    if (type === 'combo') rate = Math.floor(price * 1.45);
    const subtotal = rate * ricks * duration;
    const discount = ricks >= 10 ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal - discount;
    const names = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo' };
    summary.innerHTML = `
        <div class="row"><span>${names[type]} × ${ricks} Rickshaws × ${duration} Days</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        ${discount > 0 ? `<div class="row"><span>Discount (10%)</span><span style="color:var(--green)">-₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="row total"><span>Total Estimate</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    `;
}

function submitCampaignBooking() {
    const phone = $('cbPhone')?.value;
    if (!phone) { alert('⚠️ Please enter your phone number'); return; }
    const name = $('cbName')?.value || 'Customer';
    const type = $('cbType')?.value || 'led';
    const route = ROUTES_DATA.find(r => r.id === ($('cbRoute')?.value))?.name || 'Route';
    const ricks = $('cbRicks')?.value || '1';
    const duration = $('cbDuration')?.value || '1';
    
    // Open booking modal pre-filled
    openBookingModal();
    
    // Also attempt direct email via FormSubmit hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hiddenFrame';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formsubmit.co/mafs.grp@gmail.com';
    form.target = 'hiddenFrame';
    form.innerHTML = `
        <input type="hidden" name="_subject" value="New RASAAI Campaign!">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="BusinessName" value="${name}">
        <input type="hidden" name="Phone" value="${phone}">
        <input type="hidden" name="CampaignType" value="${type}">
        <input type="hidden" name="Route" value="${route}">
        <input type="hidden" name="Rickshaws" value="${ricks}">
        <input type="hidden" name="Duration" value="${duration} days">
    `;
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => { form.remove(); iframe.remove(); }, 2000);
    
    alert(`✅ Booking Submitted!\n\n📋 ${name}\n🛣️ ${route}\n🛺 ${ricks} Rickshaws\n📅 ${duration} Days\n📞 ${phone}\n\nWe'll call you at ${PHONE} within 5 minutes!\nConfirmation sent to ${EMAIL}`);
}

// SECTION 18: PRICING
function buildPricingCards(priceOverride) {
    const grid = $('pricingGrid');
    if (!grid) return;
    const price = priceOverride || getDynamicPrice();
    const audio = Math.floor(price * 0.3);
    const combo = Math.floor(price * 1.45);
    grid.innerHTML = `
        <div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹${price.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED Screen on rickshaw</li><li>GPS tracked coverage</li><li>Real-time analytics</li><li>Change creative anytime</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get LED Campaign</button></div>
        <div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹${audio.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>Bluetooth speaker audio</li><li>60-sec ad every 15 min</li><li>Zone announcement included</li><li>Playback analytics</li><li>10% off on 10+ rickshaws</li><li>Most affordable plan</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Audio Campaign</button></div>
        <div class="pricing-card"><h4>🔥 Combo (LED + Audio)</h4><div class="price">₹${combo.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED + Audio both</li><li>Maximum visibility</li><li>Full analytics suite</li><li>Priority zone access</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Combo Campaign</button></div>
    `;
}

// SECTION 19: INVENTORY
function buildInventoryCards() {
    const grid = $('inventoryGrid');
    if (!grid) return;
    grid.innerHTML = ZONES_DATA.map(z => {
        const status = z.avail < 10 ? 'critical' : z.avail < 20 ? 'low' : 'good';
        return `<div class="inventory-card">
            <h4>📍 ${z.name}</h4>
            <div class="inventory-stock ${status}"><span class="number">${z.avail}</span><span class="label">rickshaws left</span></div>
            <div class="inventory-bar"><div class="inventory-bar-fill" style="width:${z.cov}%"></div></div>
            <span class="inventory-status ${status}">${status==='critical'?'⚠️ Almost gone!':status==='low'?'⚡ Selling fast':'✅ Available'}</span>
        </div>`;
    }).join('');
}

// SECTION 20: ROI CALCULATOR
function buildROICalc() {
    const container = $('roiCalc');
    if (!container) return;
    container.innerHTML = `
        <h3>🧮 Advanced ROI Calculator</h3>
        <div class="calc-inputs">
            <div class="calc-input-row"><label>Business</label><select id="roiBiz" onchange="updateROICalc()"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option></select></div>
            <div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="updateROICalc()">${ZONES_DATA.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="$('roiBudgetVal').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');updateROICalc()"><span id="roiBudgetVal" style="font-weight:700">₹50,000</span></div>
        </div>
        <div class="calc-results">
            <div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Eye Views</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall ↑</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">New Customers</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue Impact</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">ROI</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiBE">--</div><div class="calc-result-label">Break-even</div></div>
        </div>
    `;
    updateROICalc();
}

function updateROICalc() {
    const zid = $('roiZone')?.value || 'kausa', budget = parseInt($('roiBudget')?.value || 50000);
    const z = ZONES_DATA.find(x => x.id === zid) || ZONES_DATA[0];
    const ricks = Math.min(Math.floor(budget / (getDynamicPrice() * 30)), z.ricks);
    const cost = ricks * getDynamicPrice() * 30;
    const eyes = (parseInt(z.eyes.replace(/,/g,'')) / z.ricks) * ricks * 30;
    const foot = Math.floor(eyes * 0.02), cust = Math.floor(foot * 0.3), rev = cust * 500;
    $('roiEyes').textContent = fmt(eyes);
    $('roiFoot').textContent = '+' + foot + '%';
    $('roiCust').textContent = cust.toLocaleString('en-IN');
    $('roiRev').textContent = '₹' + rev.toLocaleString('en-IN');
    $('roiROI').textContent = cost > 0 ? Math.floor((rev - cost) / cost * 100) + '%' : '--';
    $('roiBE').textContent = rev > 0 ? Math.ceil(cost / (rev / 30)) + ' days' : '--';
}

// SECTION 21: CASE STUDIES
function buildCaseStudies() {
    const grid = $('caseStudiesGrid');
    if (!grid) return;
    const cases = [
        { biz: "Spice Garden", type: "Restaurant", zone: "Kausa", dur: "30d", budget: "₹15K", r1: "45%", l1: "Footfall", r2: "467%", l2: "ROI", r3: "72%", l3: "Recall", quote: "Dinner crowd doubled in 2 weeks! Customers from areas we never reached.", owner: "Ahmed Siddiqui" },
        { biz: "Mumbra Dental", type: "Clinic", zone: "Station", dur: "45d", budget: "₹22K", r1: "38%", l1: "Patients", r2: "445%", l2: "ROI", r3: "68%", l3: "Recall", quote: "Audio ads near station incredibly effective. Patients mention hearing us.", owner: "Dr. Fatima Khan" },
        { biz: "Shilphata Ind.", type: "B2B", zone: "Shilphata", dur: "60d", budget: "₹35K", r1: "55%", l1: "Inquiries", r2: "900%", l2: "ROI", r3: "64%", l3: "Recall", quote: "Reached warehouse managers who don't use social media.", owner: "Rajesh Patil" }
    ];
    grid.innerHTML = cases.map(c => `
        <div class="case-card">
            <div class="case-header"><span style="font-weight:700;color:var(--orange)">Case Study</span><span class="case-tag">${c.type}</span></div>
            <h3>${c.biz}</h3>
            <div style="display:flex;gap:12px;margin:8px 0;font-size:12px;color:var(--gray-500)"><span>📍 ${c.zone}</span><span>⏱️ ${c.dur}</span><span>💰 ${c.budget}</span></div>
            <div class="case-results">
                <div class="case-result"><div class="val">${c.r1}</div><div class="lbl">${c.l1}</div></div>
                <div class="case-result"><div class="val">${c.r2}</div><div class="lbl">${c.l2}</div></div>
                <div class="case-result"><div class="val">${c.r3}</div><div class="lbl">${c.l3}</div></div>
            </div>
            <blockquote class="case-quote">"${c.quote}"<cite style="display:block;margin-top:6px;font-weight:600;color:var(--gray-700)">— ${c.owner}</cite></blockquote>
        </div>
    `).join('');
}

// SECTION 22: INDUSTRIES
function buildIndustries() {
    const grid = $('industryCards');
    if (!grid) return;
    grid.innerHTML = INDUSTRIES.map(ind => `
        <div class="industry-card" onclick="scrollToSection('campaignBuilder')">
            <div class="icon">${ind.icon}</div>
            <h4>${ind.name}</h4>
            <p>${ind.desc}</p>
        </div>
    `).join('');
}

// SECTION 23: TESTIMONIALS
function buildTestimonialSlider() {
    const slider = $('testimonialSlider');
    if (!slider) return;
    slider.innerHTML = `
        <div class="testimonial-track" id="testTrack">
            ${TESTIMONIALS.map(t => `
                <div class="testimonial-card">
                    <div class="stars">${'⭐'.repeat(t.rating)}</div>
                    <p class="quote">"${t.text}"</p>
                    <div class="author"><div class="avatar">${t.initials}</div><div><strong>${t.name}</strong><p style="font-size:11px;color:var(--gray-500)">${t.biz}, ${t.zone}</p></div></div>
                </div>
            `).join('')}
        </div>
        <div class="slider-nav">
            <button onclick="$('testTrack').scrollBy({left:-340,behavior:'smooth'})">←</button>
            <button onclick="$('testTrack').scrollBy({left:340,behavior:'smooth'})">→</button>
        </div>
    `;
}

// SECTION 24: VIDEO GALLERY
function buildVideoGrid() {
    const grid = $('videoGrid');
    if (!grid) return;
    grid.innerHTML = [
        { title: "RASAAI Rickshaw in Action", id: "dQw4w9WgXcQ" },
        { title: "LED Ad Display Demo", id: "dQw4w9WgXcQ" },
        { title: "Campaign Success Story", id: "dQw4w9WgXcQ" }
    ].map(v => `
        <div class="video-card" onclick="openVideo('${v.id}')">
            <div class="play-icon">🎬</div>
            <h4>${v.title}</h4>
            <button class="btn btn-primary btn-sm" style="margin-top:12px">▶️ Play</button>
        </div>
    `).join('');
}

function openVideo(id) {
    const modal = $('videoModal'), embed = $('videoEmbed');
    if (!modal || !embed) return;
    embed.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modal.classList.add('show');
}

function closeVideoModal() {
    $('videoModal')?.classList.remove('show');
    const embed = $('videoEmbed'); if (embed) embed.innerHTML = '';
}

// SECTION 25: HEATMAP
function buildHeatmap() {
    const container = $('heatmapContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient-bar"></div><span>High</span></div>
        ${ZONES_DATA.map(z => `<div class="heatmap-zone" style="background:rgba(0,168,107,${z.cov/150});border:1px solid rgba(0,168,107,${z.cov/100})">
            <div class="heatmap-zone-info"><strong>${z.name}</strong><span>${z.cov}% | ${z.ricks} ricks</span></div>
            <div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:${z.cov}%"></div></div>
        </div>`).join('')}
        <div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="$('ht').textContent=this.value+':00'"><span id="ht">12:00</span></div>
    `;
}

// SECTION 26: LEADERBOARD
function buildLeaderboard() {
    const container = $('leaderboardContainer');
    if (!container) return;
    const sorted = [...ZONES_DATA].sort((a, b) => parseInt(b.eyes.replace(/,/g,'')) - parseInt(a.eyes.replace(/,/g,'')));
    container.innerHTML = sorted.map((z, i) => `
        <div class="lb-row">
            <div class="lb-rank">#${i+1}</div>
            <div class="lb-info">
                <div class="lb-name">${z.name}</div>
                <div class="lb-bar-track"><div class="lb-bar-fill" style="width:${(parseInt(z.eyes.replace(/,/g,''))/parseInt(sorted[0].eyes.replace(/,/g,'')))*100}%"></div></div>
                <div class="lb-value">👁️ ${z.eyes} eye views/day | 🛺 ${z.ricks} rickshaws</div>
            </div>
        </div>
    `).join('');
}

// SECTION 27: AFFILIATE
function buildAffiliate() {
    const container = $('affiliateContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="affiliate-card">
            <h3>💰 Earn 10% Commission</h3>
            <p style="color:var(--gray-600);margin:12px 0">Refer a business and earn 10% of their campaign budget</p>
            <div class="affiliate-slider">
                <label style="font-weight:600;display:block;margin-bottom:8px">Campaign Budget</label>
                <input type="range" min="5000" max="500000" value="50000" step="5000" oninput="updateAffiliate(this.value)">
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-500);margin-top:4px"><span>₹5K</span><span>₹5L</span></div>
            </div>
            <div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div>
            <div class="affiliate-tiers">
                <div class="tier-card"><div class="tier-val">₹25,000</div><div style="font-size:11px;color:var(--gray-500)">5 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹50,000</div><div style="font-size:11px;color:var(--gray-500)">10 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹1,00,000</div><div style="font-size:11px;color:var(--gray-500)">20 Referrals</div></div>
            </div>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Start Referring</button>
        </div>
    `;
}

function updateAffiliate(value) {
    const earn = Math.floor(value * 0.1);
    const e = $('affEarn'); if (e) e.textContent = '₹' + earn.toLocaleString('en-IN');
}

// SECTION 28: CONTEST
function buildContest() {
    const container = $('contestContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="contest-card">
            <div style="font-size:48px">🏆</div>
            <h3>Run a Hashtag Contest</h3>
            <div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div>
            <div class="form-group"><label>Prize</label><input type="text" id="contestPrize" value="₹5,000 Cash"></div>
            <div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div>
            <button onclick="launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button>
        </div>
    `;
}

function launchContest() {
    const hash = $('contestHash')?.value || '#RasaaiContest';
    const prize = $('contestPrize')?.value || 'Prize';
    const dur = $('contestDuration')?.value || '7 Days';
    alert(`🏆 Contest Launched!\n\n${hash}\n${prize}\n${dur}\n\nYour contest will appear on 600+ rickshaws!`);
}

// SECTION 29: HASHTAG TRACKING
function buildHashtag() {
    const container = $('hashtagContainer');
    if (!container) return;
    container.innerHTML = `
        <div style="text-align:center;background:var(--white);border-radius:var(--radius-2xl);padding:32px;box-shadow:var(--shadow-md)">
            <div style="font-size:48px">📱</div>
            <h3>Live Hashtag Tracking</h3>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0">
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--orange)" id="htMentions">247</div><div style="font-size:11px;color:var(--gray-500)">Mentions</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--purple)">1.2K</div><div style="font-size:11px;color:var(--gray-500)">Engagement</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--green)">89%</div><div style="font-size:11px;color:var(--gray-500)">Positive</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--navy)">₹0.42</div><div style="font-size:11px;color:var(--gray-500)">Cost/Eng.</div></div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">📷 Instagram: 142</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">👍 Facebook: 68</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">🐦 Twitter: 37</span>
            </div>
        </div>
    `;
}

// SECTION 31: FAQ
function buildFAQ() {
    const container = $('faqContainer');
    if (!container) return;
    container.innerHTML = FAQ_DATA.map(item => `
        <div class="faq-item">
            <button class="faq-q" onclick="this.parentElement.classList.toggle('active')"><span>${item.q}</span><span class="icon">+</span></button>
            <div class="faq-a"><p>${item.a}</p></div>
        </div>
    `).join('');
}

// ============================================
// TIMERS & UPDATES
// ============================================
function startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current >= 10000000 ? (current/10000000).toFixed(1)+'M+' : current >= 100000 ? (current/100000).toFixed(1)+'L+' : current >= 1000 ? current.toLocaleString('en-IN') : current;
        }, 30);
    });
}

function startTimers() {
    let priceSec = 900;
    const priceTimer = $('priceTimer');
    if (priceTimer) {
        setInterval(() => {
            const m = Math.floor(priceSec / 60), s = priceSec % 60;
            priceTimer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            priceSec--;
            if (priceSec < 0) { priceSec = 900; updateAllPrices(); }
        }, 1000);
    }
    // Update prices every 15 minutes
    setInterval(updateAllPrices, 900000);
}

function startLiveUpdates() {
    setInterval(() => {
        const r = $('liveRickshaws'); if (r) r.textContent = 340 + Math.floor(Math.random() * 10);
        const c = $('liveCampaigns'); if (c) c.textContent = 125 + Math.floor(Math.random() * 8);
        const e = $('liveEyeViews'); if (e) { const v = parseInt(e.textContent.replace(/,/g,'')) || 1247893; e.textContent = (v + Math.floor(Math.random() * 300) + 100).toLocaleString('en-IN'); }
        const m = $('htMentions'); if (m) m.textContent = 247 + Math.floor(Math.random() * 8);
    }, 5000);
}

function startNotifications() {
    const msgs = ['🏃 3 businesses booked Kausa today', '🔥 Mumbra Station: Only 8 left', '✅ New campaign live', '💼 Agency booked 15 rickshaws', '⚡ Flash: Check Naka available'];
    let i = 0;
    setInterval(() => {
        const w = $('notificationWidget'), t = $('notificationText');
        if (w && t) { t.textContent = msgs[i]; w.classList.add('show'); setTimeout(() => w.classList.remove('show'), 4000); i = (i + 1) % msgs.length; }
    }, 8000);
}

// ============================================
// INTERACTIONS
// ============================================
function setupExitIntent() {
    let shown = false;
    document.addEventListener('mouseout', e => {
        if (!shown && e.clientY <= 0 && window.scrollY > 500) { $('exitPopup').classList.add('show'); shown = true; setTimeout(() => shown = false, 300000); }
    });
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = form.querySelector('input[name="BusinessName"]')?.value || 'Customer';
            alert(`✅ Booking Submitted!\n\nThank you, ${name}!\nWe'll call you at ${PHONE} within 5 minutes.\nConfirmation sent to ${EMAIL}`);
            closeBookingModal();
            // Submit via fetch
            fetch(form.action, { method: 'POST', body: new FormData(form) }).catch(() => {});
        });
    }
}

function setupMobileNav() {
    window.addEventListener('scroll', () => {
        const header = $('desktopHeader'); if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        const sticky = $('stickyBar'); if (sticky) sticky.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    document.querySelectorAll('.bottom-nav-item[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const el = document.querySelector(this.getAttribute('href'));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function openBookingModal() { $('bookingModal')?.classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeBookingModal() { $('bookingModal')?.classList.remove('show'); document.body.style.overflow = ''; }
function closeExitPopup() { $('exitPopup')?.classList.remove('show'); }

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', init);

// Global exports
window.scrollToSection = scrollToSection;
window.showComparison = showComparison;
window.updateAffiliate = updateAffiliate;
window.launchContest = launchContest;
window.updateBookingEstimate = updateBookingEstimate;
window.submitCampaignBooking = submitCampaignBooking;
window.openVideo = openVideo;
window.closeVideoModal = closeVideoModal;
window.playSampleAudio = playSampleAudio;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeExitPopup = closeExitPopup;
window.updateEyeCalc = updateEyeCalc;
window.updateROICalc = updateROICalc;
window.$ = $;
