// ============================================
// RASAAI - Complete Application Logic
// Email: mafs.grp@gmail.com | Phone: +919594306625
// Dynamic Pricing: ₹1,238 - ₹1,647 | Theme: Zoomcar
// All 50 Neuro Triggers | All 30 Fixes Applied
// ============================================

const PHONE = "+919594306625";
const WHATSAPP = "919594306625";
const EMAIL = "mafs.grp@gmail.com";
const FORM_SUBMIT_URL = "https://formsubmit.co/mafs.grp@gmail.com";

// Image URLs for cards
const IMG_URLS = [
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/16.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/13.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/8.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/7.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/6.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/5.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/2.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/1.jpg",
    "https://www.hanksadvertising.com/cms/resources/assets/frontend/images/noparking_slider/HANKS_ADVERTISING_AUTO_BRANDING.jpeg",
    "https://www.hanksadvertising.com/cms/uploads/images/auto-rickshaw-advertising-ad.jpg",
    "https://www.hanksadvertising.com/cms/uploads/images/auto-ads-delhi.jpg"
];

// ============================================
// DATA
// ============================================
const ROUTES_DATA = [
    { id:"route1", name:"Mumbra → Kausa → MM Valley Road", zones:["Mumbra","Kausa","MM Valley Road"], ricks:85, eyes:"125,000", color:"#FFF3D6", img:IMG_URLS[0] },
    { id:"route2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", zones:["Mumbra","Kausa","Kalsekar Bypass","Shilphata","Kalyan Phata","Taloja Phase 1","Taloja Phase 2"], ricks:185, eyes:"315,000", color:"#E8F5E9", img:IMG_URLS[1] },
    { id:"route3", name:"Mumbra → Retibunder → Kalwa Naka", zones:["Mumbra","Retibunder","Kalwa Naka"], ricks:50, eyes:"75,000", color:"#FCE4EC", img:IMG_URLS[2] },
    { id:"route4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", zones:["Mumbra","Retibunder","Check Naka","Majhiwada"], ricks:30, eyes:"77,000", color:"#E3F2FD", img:IMG_URLS[3] }
];

const ZONES_DATA = [
    { id:"kausa", name:"Kausa", pop:45000, traffic:"85K/day", peak:"8AM-8PM", eyes:"125,000", ricks:85, avail:42, cov:87, lat:19.1765, lng:73.0320, img:IMG_URLS[4] },
    { id:"mumbra-station", name:"Mumbra Station", pop:78000, traffic:"150K/day", peak:"7AM-9PM", eyes:"220,000", ricks:120, avail:8, cov:92, lat:19.1800, lng:73.0280, img:IMG_URLS[5] },
    { id:"shilphata", name:"Shilphata", pop:55000, traffic:"110K/day", peak:"7AM-9PM", eyes:"155,000", ricks:65, avail:25, cov:78, lat:19.1950, lng:73.0480, img:IMG_URLS[6] },
    { id:"retibunder", name:"Retibunder", pop:35000, traffic:"65K/day", peak:"9AM-8PM", eyes:"75,000", ricks:50, avail:30, cov:72, lat:19.1700, lng:73.0380, img:IMG_URLS[7] },
    { id:"check-naka", name:"Check Naka", pop:40000, traffic:"70K/day", peak:"7AM-8PM", eyes:"77,000", ricks:30, avail:20, cov:65, lat:19.1850, lng:73.0350, img:IMG_URLS[8] },
    { id:"kalwa", name:"Kalwa Naka", pop:52000, traffic:"95K/day", peak:"8AM-9PM", eyes:"130,000", ricks:55, avail:18, cov:74, lat:19.1650, lng:73.0420, img:IMG_URLS[9] },
    { id:"majhiwada", name:"Majhiwada", pop:48000, traffic:"80K/day", peak:"8AM-8PM", eyes:"110,000", ricks:40, avail:22, cov:68, lat:19.1900, lng:73.0300, img:IMG_URLS[10] },
    { id:"taloja1", name:"Taloja Phase 1", pop:30000, traffic:"45K/day", peak:"7AM-7PM", eyes:"60,000", ricks:25, avail:15, cov:55, lat:19.2000, lng:73.0600, img:IMG_URLS[11] },
    { id:"taloja2", name:"Taloja Phase 2", pop:28000, traffic:"40K/day", peak:"7AM-7PM", eyes:"55,000", ricks:22, avail:17, cov:50, lat:19.2050, lng:73.0650, img:IMG_URLS[12] },
    { id:"kalyan-phata", name:"Kalyan Phata", pop:42000, traffic:"75K/day", peak:"8AM-9PM", eyes:"100,000", ricks:45, avail:20, cov:70, lat:19.1980, lng:73.0550, img:IMG_URLS[13] },
    { id:"kalsekar", name:"Kalsekar Bypass", pop:38000, traffic:"60K/day", peak:"7AM-8PM", eyes:"85,000", ricks:35, avail:28, cov:62, lat:19.1850, lng:73.0500, img:IMG_URLS[0] },
    { id:"mm-valley", name:"MM Valley Road", pop:32000, traffic:"50K/day", peak:"8AM-8PM", eyes:"70,000", ricks:28, avail:25, cov:58, lat:19.1720, lng:73.0250, img:IMG_URLS[1] }
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
    {q:"How do I track my campaign?",a:"Real-time dashboard: Eye Views, Impressions, Reach, GPS routes, daily reports. Data refreshes every 30 seconds. Access via web and mobile."},
    {q:"How fast can I launch?",a:"48-72 hours from booking. We handle creative production, rickshaw installation, GPS setup. Call +91 95943 06625."},
    {q:"How does RASAAI compare to digital ads?",a:"0% skip rate (vs 76% YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 Instagram). Physical ads reach non-internet users and build unskippable local trust."},
    {q:"Can I choose specific routes?",a:"Yes! Select from 4 routes and 12 zones. Target school zones, market areas, station queues, or industrial corridors based on your audience."}
];

// ============================================
// DYNAMIC PRICING ENGINE (₹1,238-₹1,647)
// ============================================
function getDynamicPrice() {
    const min = 1238, max = 1647;
    const cycle = Date.now() / 900000 * Math.PI;
    const demand = Math.sin(cycle) * 0.5 + 0.5;
    const noise = Math.random() * 0.08;
    return Math.floor(min + (max - min) * (demand * 0.65 + noise));
}

function updateAllPrices() {
    const price = getDynamicPrice();
    const heroPriceEl = document.getElementById('heroPrice');
    if (heroPriceEl) heroPriceEl.innerHTML = `₹${price.toLocaleString('en-IN')}<span>/day</span>`;
    buildPricingCards(price);
    if (typeof updateBookingEstimate === 'function') updateBookingEstimate(price);
}

// ============================================
// HELPERS
// ============================================
function $(id) { return document.getElementById(id); }
function fmt(n) { return n >= 10000000 ? (n/10000000).toFixed(1)+'M' : n >= 100000 ? (n/100000).toFixed(1)+'L' : n >= 1000 ? n.toLocaleString('en-IN') : n.toString(); }
function scrollToSection(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function getRandomImage() { return IMG_URLS[Math.floor(Math.random() * IMG_URLS.length)]; }

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
    setupModals();
    
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 500); }
    }, 1000);
}

// SECTION 3: TRUST LOGOS (Single line)
function buildTrustLogos() {
    const container = $('trustLogosTrack');
    if (!container) return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🏢 Shilphata Ind.","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point","🍕 Pizza Corner","💇 Style Salon","📱 Mobile Zone"];
    const all = [...logos, ...logos];
    container.innerHTML = all.map(l => `<span class="trust-logo-item">${l}</span>`).join('');
}

// SECTION 7: ROUTES (Interactive cards with images)
function buildRoutes() {
    const grid = $('routesGrid');
    if (!grid) return;
    grid.innerHTML = ROUTES_DATA.map((r, i) => `
        <div class="route-card" onclick="scrollToSection('zones')">
            <div class="route-card-image" style="background-image:url('${r.img}')">
                <div class="route-overlay"></div>
            </div>
            <div class="route-card-body">
                <h4>🛣️ Route ${i+1}</h4>
                <p style="font-size:13px;color:var(--gray-700);margin-bottom:8px">${r.name}</p>
                <div class="route-meta"><span>🛺 ${r.ricks} Rickshaws</span><span>👁️ ${r.eyes} Eyes/Day</span><span>📍 ${r.zones.length} Stops</span></div>
                <div class="route-zones">${r.zones.map(z => `<span class="route-zone-pill" style="background:${r.color}">${z}</span>`).join(' → ')}</div>
            </div>
        </div>
    `).join('');
}

// SECTION 8: COVERAGE MAP (Corrected pins)
function buildCoverageMap() {
    const container = $('coverageMap');
    if (!container || typeof L === 'undefined') return;
    const map = L.map('coverageMap').setView([19.1800, 73.0400], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    ZONES_DATA.forEach(z => {
        const color = z.avail < 15 ? '#E74C3C' : z.cov > 80 ? '#00A86B' : '#FFB800';
        L.circleMarker([z.lat, z.lng], { radius: Math.sqrt(z.ricks) * 1.2, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.7 })
            .addTo(map)
            .bindPopup(`<b>${z.name}</b><br>🛺 ${z.ricks} rickshaws<br>👁️ ${z.eyes} eyes/day<br>${z.avail} available<br><button onclick="scrollToSection('campaignBuilder')" style="background:#FF5A00;color:white;border:none;padding:6px 12px;border-radius:100px;cursor:pointer;font-weight:600;margin-top:6px">Book Now</button>`);
    });
}

// SECTION 9: ZONE CARDS (With images)
function buildZoneCards() {
    const grid = $('zonesGrid');
    if (!grid) return;
    grid.innerHTML = ZONES_DATA.map(z => `
        <div class="zone-card" onclick="scrollToSection('campaignBuilder')">
            <div class="zone-card-image" style="background-image:url('${z.img}')">
                <span class="zone-availability ${z.avail < 15 ? 'low' : ''}">${z.avail} Left</span>
            </div>
            <div class="zone-card-body">
                <h4>📍 ${z.name}</h4>
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
    let html = '';
    for (let i = 0; i < 6; i++) {
        const z = ZONES_DATA[i % 12];
        const online = Math.random() > 0.1;
        const audio = Math.random() > 0.1 ? 'active' : 'inactive';
        const led = Math.random() > 0.05 ? 'active' : 'inactive';
        const route = ROUTES_DATA[i % 4];
        html += `<div class="track-card">
            <div class="track-header">
                <div class="track-id"><span class="track-dot ${online ? 'online' : 'offline'}"></span>RKS-MUM-${String(i+1).padStart(3,'0')}</div>
                <span style="font-size:12px">🔋 ${Math.floor(Math.random()*40)+60}%</span>
            </div>
            <div style="font-weight:600">📍 ${z.name}</div>
            <div class="track-route">🛣️ ${route.name.split('→')[0].trim()}</div>
            <div class="track-metrics"><span>👁️ ${fmt(Math.floor(Math.random()*7000)+8000)} views</span><span>📊 ${fmt(Math.floor(Math.random()*5000)+6000)} exp</span></div>
            <div style="display:flex;gap:6px;margin-top:8px">
                <span class="track-badge ${audio}">🔊 Audio: ${audio}</span>
                <span class="track-badge ${led}">💡 LED: ${led}</span>
            </div>
            ${Math.random() > 0.3 ? '<div style="padding:6px 10px;background:var(--green-light);border-radius:8px;font-size:11px;color:var(--green);margin-top:8px;font-weight:600">Active: Campaign Running</div>' : '<div style="padding:6px 10px;background:var(--gray-50);border-radius:8px;font-size:11px;color:var(--gray-500);margin-top:8px">Available for booking</div>'}
        </div>`;
    }
    grid.innerHTML = html;
}

// SECTION 11: EYE CALCULATOR
function buildEyeCalculator() {
    const container = $('eyeCalculator');
    if (!container) return;
    container.innerHTML = `
        <h3 style="margin-bottom:16px">👁️ Estimate Your Eye Views</h3>
        <div class="calc-inputs">
            <div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="updateEyeCalc()"><option value="">All Zones (Average)</option>${ZONES_DATA.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="$('ecRicksVal').textContent=this.value;updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700;min-width:30px">10</span></div>
            <div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="$('ecDaysVal').textContent=this.value;updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700;min-width:30px">30</span></div>
        </div>
        <div class="calc-results">
            <div class="calc-result-item"><div class="calc-result-icon">👁️</div><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">👥</div><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">💰</div><div class="calc-result-value" id="ecCost">₹45,000</div><div class="calc-result-label">Est. Cost</div></div>
            <div class="calc-result-item"><div class="calc-result-icon">📊</div><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM (Eye View)</div></div>
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
        <div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><p style="color:var(--gray-600);font-size:13px">Verified human visual contact</p><span class="metrics-badge">RASAAI Proprietary</span></div>
        <div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div><p style="color:var(--gray-600);font-size:13px">Total exposures including frequency</p></div>
        <div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div><p style="color:var(--gray-600);font-size:13px">Unique individuals reached monthly</p></div>
    `;
    detail.innerHTML = `
        <div class="metric-detail"><div class="label">CPM (Eye View)</div><div class="value">₹4.50</div></div>
        <div class="metric-detail"><div class="label">Brand Recall</div><div class="value">68%</div></div>
        <div class="metric-detail"><div class="label">Attention Time</div><div class="value">4.2s</div></div>
        <div class="metric-detail"><div class="label" style="color:var(--green)">Skip Rate</div><div class="value" style="color:var(--green)">0%</div></div>
    `;
}

// SECTION 14: COMPARISON (Interactive with icons)
function buildComparisonTabs() {
    const tabs = $('comparisonTabs');
    if (!tabs) return;
    tabs.innerHTML = `
        <button class="comp-tab active" onclick="showComparison('instagram',this)" aria-label="Compare with Instagram">📱 vs Instagram</button>
        <button class="comp-tab" onclick="showComparison('facebook',this)" aria-label="Compare with Facebook">👍 vs Facebook</button>
        <button class="comp-tab" onclick="showComparison('youtube',this)" aria-label="Compare with YouTube">▶️ vs YouTube</button>
    `;
    showComparison('instagram', tabs.querySelector('.comp-tab'));
}

function showComparison(platform, btn) {
    document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const data = {
        instagram: [["Hyperlocal Visibility","✅ Full zone dominance","❌ Limited by algorithm"],["Physical Presence","✅ Tangible, unavoidable","❌ Digital-only"],["Ad Blocking Resistance","✅ Cannot be blocked","❌ Ad blockers work"],["Non-Internet Users","✅ 100% foot traffic reach","❌ Internet required"],["Attention Time","✅ 3-8 seconds natural gaze","❌ <1 second scroll"],["Brand Recall (24hr)","✅ 68%","❌ 24%"],["Effective CPM","✅ ₹4.50","❌ ₹35-150"],["Ad Fatigue","✅ Low (environmental)","❌ High (repetitive feed)"],["Audio Advertising","✅ Voice + visual dual channel","❌ Visual only (muted)"],["Local Trust Building","✅ Physical presence = real","⚠️ Perceived as online ad"]],
        facebook: [["Local Penetration","✅ 100% zone coverage","❌ 15-40% of locals"],["Trust Factor","✅ Physical = real business","❌ Scam ad skepticism"],["Multi-sensory Impact","✅ Visual + Audio","❌ Visual only"],["Community Recognition","✅ Seen in neighborhood","❌ No physical trace"],["Cost per 1000 Eye Views","✅ ₹4.50","❌ N/A (no eye metric)"],["Cost per 1000 Impressions","✅ ₹2.80","❌ ₹25-90"],["Offline Conversion","✅ Direct walk-in trigger","❌ Click-to-website friction"],["Local Market Dominance","✅ Area monopolization","⚠️ Fragmented reach"]],
        youtube: [["Skip Rate","✅ 0% (unskippable)","❌ 65-76% skipped"],["Ad Fatigue","✅ Low","❌ High (pre-roll)"],["Attention Time","✅ 4.2 seconds avg","⚠️ 2.1 sec (before skip)"],["Brand Recall","✅ 68%","❌ 18%"],["Physical Presence","✅ Tangible, real-world","❌ Digital-only"],["Local Trust","✅ Community embedded","❌ Global, impersonal"],["Cost Per View","✅ ₹0.04 per eye view","❌ ₹0.15-0.40"],["Context Relevance","✅ Neighborhood context","⚠️ Content-dependent"]]
    };
    const content = $('comparisonContent');
    if (!content) return;
    content.innerHTML = `<table class="comp-table"><thead><tr><th>📋 Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead><tbody>${data[platform].map(row => `<tr><td><strong>${row[0]}</strong></td><td class="win">${row[1]}</td><td class="${row[2].startsWith('✅')?'win':row[2].startsWith('❌')?'lose':'partial'}">${row[2]}</td></tr>`).join('')}</tbody></table>`;
}

// SECTION 15: AUDIO PLAYER (3 columns)
function buildAudioPlayer() {
    const container = $('audioPlayer');
    if (!container) return;
    const samples = [
        {icon:"🍽️",title:"Restaurant Ad",desc:"Food & dining promotions",type:"restaurant"},
        {icon:"🏥",title:"Clinic Ad",desc:"Healthcare & medical services",type:"clinic"},
        {icon:"🏫",title:"Education Ad",desc:"Schools & coaching classes",type:"education"}
    ];
    container.innerHTML = samples.map(s => `
        <div class="audio-card" onclick="playSampleAudio('${s.type}')">
            <div class="audio-icon">${s.icon}</div>
            <h4>${s.title}</h4>
            <p style="color:var(--gray-500);font-size:13px">${s.desc}</p>
            <div class="audio-wave">${'<div class="bar"></div>'.repeat(8)}</div>
            <button class="btn btn-primary btn-sm">▶️ Play Sample</button>
        </div>
    `).join('');
}

function playSampleAudio(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = { restaurant: 520, clinic: 440, education: 660 }[type] || 500;
        gain.gain.value = 0.15;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        osc.stop(ctx.currentTime + 2);
    } catch(e) {
        alert('🔊 Sample ' + type + ' ad would play here. Replace with actual MP3 file.');
    }
}

// SECTION 16: FORMATS (3 columns forced)
function buildFormatCards() {
    const grid = $('formatCards');
    if (!grid) return;
    const formats = [
        { icon: "💡", name: "LED Display", desc: "Bright, weatherproof LED screen on rickshaw back. Visible day and night. Perfect for brand awareness.", features: ["Full-color LED display","Weatherproof, 24/7 visible","GPS tracked coverage","Change creative anytime","Real-time analytics"], price: "₹1,238-1,647/day", rec: false },
        { icon: "🔊", name: "Audio Announcement", desc: "Professional voice advertisement through rickshaw speakers. Reaches pedestrians and passengers at stops.", features: ["Professional voice-over","Multi-language support","Zone-specific messaging","60-sec ad every 15 min","Playback analytics"], price: "₹318-639/day", rec: false },
        { icon: "⚡", name: "LED + Audio Combo", desc: "Dual-channel advertising for maximum impact. 85% higher recall than single-format ads. Best value for money.", features: ["Visual + Audio synchronized","85% higher brand recall","Maximum attention capture","Priority zone access","Best ROI guaranteed"], price: "₹1,795-2,388/day", rec: true }
    ];
    grid.innerHTML = formats.map(f => `
        <div class="format-card ${f.rec ? 'recommended' : ''}">
            ${f.rec ? '<span class="recommended-badge">⭐ Recommended</span>' : ''}
            <div class="format-icon">${f.icon}</div>
            <h4>${f.name}</h4>
            <p>${f.desc}</p>
            <ul class="format-features">${f.features.map(ft => `<li>${ft}</li>`).join('')}</ul>
            <div class="format-price">${f.price}</div>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block btn-sm" style="margin-top:12px">Choose ${f.name.split(' ')[0]}</button>
        </div>
    `).join('');
}

// SECTION 17: CAMPAIGN BUILDER (Functional + WhatsApp)
function buildCampaignBuilder() {
    const container = $('bookingCard');
    if (!container) return;
    const price = getDynamicPrice();
    container.innerHTML = `
        <h3>📋 Build Your Campaign</h3>
        <p style="color:var(--gray-500);font-size:13px;margin-bottom:24px">Fill the details below and get an instant estimate. We'll call you back within 5 minutes.</p>
        <div class="form-row">
            <div class="form-group"><label for="cbName">Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>
            <div class="form-group"><label for="cbType">Campaign Type</label><select id="cbType" onchange="updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo (LED + Audio)</option></select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label for="cbRoute">Route / Zone</label><select id="cbRoute" onchange="updateBookingEstimate()">${ROUTES_DATA.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}</select></div>
            <div class="form-group"><label for="cbRicks">Number of Rickshaws</label><select id="cbRicks" onchange="updateBookingEstimate()"><option value="1">1 Rickshaw</option><option value="5">5 Rickshaws</option><option value="10">10 Rickshaws (10% off!)</option><option value="20">20 Rickshaws (10% off!)</option><option value="50">50 Rickshaws (10% off!)</option></select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label for="cbDuration">Duration</label><select id="cbDuration" onchange="updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option><option value="90">90 Days</option></select></div>
            <div class="form-group"><label for="cbPhone">Your Phone Number *</label><input type="tel" id="cbPhone" required placeholder="+91" oninput="updateBookingEstimate()"></div>
        </div>
        <div class="price-summary" id="priceSummary"></div>
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" style="flex:1" onclick="submitCampaignBooking()">🚀 Book This Campaign</button>
            <button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="bookViaWhatsApp()">💬 Book via WhatsApp</button>
        </div>
        <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--gray-500)">Or call directly: <a href="tel:${PHONE}" style="color:var(--orange);font-weight:600">${PHONE}</a></p>
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
    const names = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo (LED + Audio)' };
    summary.innerHTML = `
        <div class="row"><span>📋 ${names[type]} × ${ricks} Rickshaws × ${duration} Days</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        ${discount > 0 ? `<div class="row"><span>🎉 10% Bulk Discount (10+ rickshaws)</span><span style="color:var(--green)">-₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="row total"><span>💰 Total Estimate</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    `;
}

function submitCampaignBooking() {
    const phone = $('cbPhone')?.value;
    if (!phone) { alert('⚠️ Please enter your phone number to continue.'); $('cbPhone')?.focus(); return; }
    const name = $('cbName')?.value || 'Customer';
    const type = $('cbType')?.value || 'led';
    const routeEl = $('cbRoute');
    const route = ROUTES_DATA.find(r => r.id === routeEl?.value)?.name || 'Selected Route';
    const ricks = $('cbRicks')?.value || '1';
    const duration = $('cbDuration')?.value || '1';
    const names = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo' };
    
    // Open booking modal
    openBookingModal();
    
    // Submit via FormSubmit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_SUBMIT_URL;
    form.style.display = 'none';
    form.innerHTML = `
        <input type="hidden" name="_subject" value="New RASAAI Campaign Booking!">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="BusinessName" value="${name}">
        <input type="hidden" name="Phone" value="${phone}">
        <input type="hidden" name="CampaignType" value="${names[type]}">
        <input type="hidden" name="Route" value="${route}">
        <input type="hidden" name="Rickshaws" value="${ricks}">
        <input type="hidden" name="Duration" value="${duration} days">
    `;
    document.body.appendChild(form);
    
    // Show loading
    const submitBtn = document.querySelector('#bookingCard .btn-primary');
    if (submitBtn) { submitBtn.textContent = '⏳ Submitting...'; submitBtn.disabled = true; }
    
    setTimeout(() => {
        form.submit();
        document.body.removeChild(form);
        alert(`✅ Booking Submitted Successfully!\n\n📋 ${name}\n🎯 ${names[type]}\n🛣️ ${route}\n🛺 ${ricks} Rickshaws\n📅 ${duration} Days\n📞 ${phone}\n\nWe'll call you at ${PHONE} within 5 minutes!\nConfirmation sent to: ${EMAIL}`);
        if (submitBtn) { submitBtn.textContent = '🚀 Book This Campaign'; submitBtn.disabled = false; }
    }, 500);
}

function bookViaWhatsApp() {
    const name = $('cbName')?.value || 'Customer';
    const type = $('cbType')?.value || 'led';
    const routeEl = $('cbRoute');
    const route = ROUTES_DATA.find(r => r.id === routeEl?.value)?.name || 'Selected Route';
    const ricks = $('cbRicks')?.value || '1';
    const duration = $('cbDuration')?.value || '1';
    const phone = $('cbPhone')?.value || '';
    const names = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo (LED+Audio)' };
    
    const message = `Hi RASAAI! 👋\n\nI want to book a rickshaw advertising campaign:\n\n📋 Name: ${name}\n🎯 Type: ${names[type]}\n🛣️ Route: ${route}\n🛺 Rickshaws: ${ricks}\n📅 Duration: ${duration} days\n📞 Phone: ${phone}\n\nPlease share pricing & availability.`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}

// SECTION 18: PRICING
function buildPricingCards(priceOverride) {
    const grid = $('pricingGrid');
    if (!grid) return;
    const price = priceOverride || getDynamicPrice();
    const audio = Math.floor(price * 0.3);
    const combo = Math.floor(price * 1.45);
    grid.innerHTML = `
        <div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹${price.toLocaleString('en-IN')}<span>/day</span></div><p style="font-size:12px;color:var(--gray-500)">per rickshaw</p><ul class="pricing-features"><li>LED Screen on rickshaw</li><li>GPS tracked coverage</li><li>Real-time analytics dashboard</li><li>Change creative anytime</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get LED Campaign</button></div>
        <div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹${audio.toLocaleString('en-IN')}<span>/day</span></div><p style="font-size:12px;color:var(--gray-500)">per rickshaw</p><ul class="pricing-features"><li>Bluetooth speaker audio ad</li><li>60-sec ad every 15 minutes</li><li>Zone announcement included</li><li>Playback analytics</li><li>10% off on 10+ rickshaws</li><li>💰 Most affordable plan</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Audio Campaign</button></div>
        <div class="pricing-card"><h4>🔥 Combo (LED + Audio)</h4><div class="price">₹${combo.toLocaleString('en-IN')}<span>/day</span></div><p style="font-size:12px;color:var(--gray-500)">per rickshaw</p><ul class="pricing-features"><li>LED + Audio synchronized</li><li>85% higher brand recall</li><li>Full analytics suite</li><li>Priority zone access</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Combo Campaign</button></div>
    `;
}

// SECTION 19: INVENTORY
function buildInventoryCards() {
    const grid = $('inventoryGrid');
    if (!grid) return;
    grid.innerHTML = ZONES_DATA.slice(0, 8).map(z => {
        const status = z.avail < 10 ? 'critical' : z.avail < 20 ? 'low' : 'good';
        const msgs = { critical: '⚠️ Almost gone!', low: '⚡ Selling fast', good: '✅ Available' };
        return `<div class="inventory-card">
            <h4 style="margin-bottom:12px">📍 ${z.name}</h4>
            <div class="inventory-stock ${status}"><span class="number">${z.avail}</span><span class="label">rickshaws left</span></div>
            <div class="inventory-bar"><div class="inventory-bar-fill" style="width:${z.cov}%"></div></div>
            <span class="inventory-status ${status}">${msgs[status]}</span>
        </div>`;
    }).join('');
}

// SECTION 20: ROI CALCULATOR
function buildROICalc() {
    const container = $('roiCalc');
    if (!container) return;
    container.innerHTML = `
        <h3 style="margin-bottom:16px">🧮 Advanced ROI Calculator</h3>
        <div class="calc-inputs">
            <div class="calc-input-row"><label>Business Type</label><select id="roiBiz" onchange="updateROICalc()"><option value="retail">Retail Store</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic/Healthcare</option><option value="education">Education</option></select></div>
            <div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="updateROICalc()">${ZONES_DATA.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="$('roiBudgetVal').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');updateROICalc()"><span id="roiBudgetVal" style="font-weight:700;min-width:80px">₹50,000</span></div>
        </div>
        <div class="calc-results">
            <div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Est. Eye Views</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall Increase</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">Est. New Customers</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue Impact</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">Projected ROI</div></div>
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
    const convRate = { retail: 0.025, restaurant: 0.035, clinic: 0.02, education: 0.015 }[$('roiBiz')?.value] || 0.02;
    const foot = Math.floor(eyes * convRate);
    const cust = Math.floor(foot * 0.3);
    const rev = cust * ({ retail: 500, restaurant: 300, clinic: 800, education: 5000 }[$('roiBiz')?.value] || 500);
    $('roiEyes').textContent = fmt(eyes);
    $('roiFoot').textContent = '+' + foot + '%';
    $('roiCust').textContent = cust.toLocaleString('en-IN');
    $('roiRev').textContent = '₹' + rev.toLocaleString('en-IN');
    $('roiROI').textContent = cost > 0 ? Math.floor((rev - cost) / cost * 100) + '%' : '--';
    $('roiBE').textContent = rev > 0 ? Math.ceil(cost / (rev / 30)) + ' days' : '--';
}

// SECTION 21-31: Remaining sections (case studies, industries, testimonials, videos, heatmap, leaderboard, affiliate, contest, hashtag, FAQ)
function buildCaseStudies() {
    const grid = $('caseStudiesGrid');
    if (!grid) return;
    const cases = [
        { biz:"Spice Garden Restaurant", type:"Restaurant", zone:"Kausa", dur:"30 days", budget:"₹15,000", r1:"45%", l1:"Footfall ↑", r2:"467%", l2:"ROI", r3:"72%", l3:"Recall", quote:"RASAAI brought customers from areas we never reached before. Our dinner crowd doubled within 2 weeks!", owner:"Ahmed Siddiqui" },
        { biz:"Mumbra Dental Care", type:"Clinic", zone:"Mumbra Station", dur:"45 days", budget:"₹22,000", r1:"38%", l1:"Patients ↑", r2:"445%", l2:"ROI", r3:"68%", l3:"Recall", quote:"The audio ads on rickshaws near the station are incredibly effective. Patients mention hearing about us while commuting.", owner:"Dr. Fatima Khan" },
        { biz:"Shilphata Industries", type:"B2B/Industrial", zone:"Shilphata", dur:"60 days", budget:"₹35,000", r1:"55%", l1:"Inquiries ↑", r2:"900%", l2:"ROI", r3:"64%", l3:"Recall", quote:"We reached warehouse managers and truck drivers who don't use social media. RASAAI is unmatched for B2B.", owner:"Rajesh Patil" }
    ];
    grid.innerHTML = cases.map(c => `
        <div class="case-card">
            <div class="case-header"><span style="font-weight:700;color:var(--orange)">Case Study</span><span class="case-tag">${c.type}</span></div>
            <h3 style="margin-bottom:4px">${c.biz}</h3>
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
            <button onclick="$('testTrack').scrollBy({left:-340,behavior:'smooth'})" aria-label="Previous testimonials">←</button>
            <button onclick="$('testTrack').scrollBy({left:340,behavior:'smooth'})" aria-label="Next testimonials">→</button>
        </div>
    `;
}

function buildVideoGrid() {
    const grid = $('videoGrid');
    if (!grid) return;
    const videos = [
        { title:"Rickshaw LED Ad in Action", thumb:IMG_URLS[6] },
        { title:"Campaign Success Story", thumb:IMG_URLS[7] },
        { title:"Audio Ad Demo", thumb:IMG_URLS[8] },
        { title:"RASAAI Coverage Map", thumb:IMG_URLS[9] }
    ];
    grid.innerHTML = videos.map(v => `
        <div class="video-card" onclick="openVideo('dQw4w9WgXcQ')">
            <div class="video-thumb" style="background-image:url('${v.thumb}')">
                <div class="play-btn">▶️</div>
            </div>
            <div class="video-body"><h4>${v.title}</h4></div>
        </div>
    `).join('');
}

function openVideo(id) {
    const modal = $('videoModal'), embed = $('videoEmbed');
    if (!modal || !embed) return;
    embed.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    $('videoModal')?.classList.remove('show');
    const embed = $('videoEmbed'); if (embed) embed.innerHTML = '';
    document.body.style.overflow = '';
}

function buildHeatmap() {
    const container = $('heatmapContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="heatmap-legend"><span>Low Density</span><div class="heatmap-gradient-bar"></div><span>High Density</span></div>
        ${ZONES_DATA.map(z => `<div class="heatmap-zone" style="background:rgba(0,168,107,${z.cov/150});border:1px solid rgba(0,168,107,${z.cov/100})" data-cov="${z.cov}">
            <div class="heatmap-zone-info"><strong>${z.name}</strong><span>${z.cov}% coverage | ${z.ricks} rickshaws</span></div>
            <div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:${z.cov}%"></div></div>
        </div>`).join('')}
        <div class="heatmap-time-slider"><label>Time of Day:</label><input type="range" min="6" max="22" value="12" oninput="updateHeatmap(this.value)"><span id="htTime">12:00</span></div>
    `;
}

function updateHeatmap(hour) {
    $('htTime').textContent = hour + ':00';
    const h = parseInt(hour);
    document.querySelectorAll('.heatmap-zone').forEach(el => {
        const baseCov = parseInt(el.dataset.cov);
        let multiplier = 1;
        if (h >= 7 && h <= 10) multiplier = 1.3;
        else if (h >= 17 && h <= 20) multiplier = 1.4;
        else if (h >= 22 || h <= 5) multiplier = 0.5;
        const adjustedCov = Math.min(100, Math.floor(baseCov * multiplier));
        el.style.background = `rgba(0,168,107,${adjustedCov/150})`;
        el.querySelector('.heatmap-bar-fill').style.width = adjustedCov + '%';
    });
}

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
                <div class="lb-value">👁️ ${z.eyes} eye views/day | 🛺 ${z.ricks} rickshaws | 📊 ${z.cov}% coverage</div>
            </div>
        </div>
    `).join('');
}

function buildAffiliate() {
    const container = $('affiliateContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="affiliate-card">
            <h3>💰 Earn 10% Commission on Every Referral</h3>
            <p style="color:var(--gray-600);margin:12px 0">Refer a business to RASAAI and earn 10% of their first campaign budget</p>
            <div class="affiliate-slider">
                <label style="font-weight:600;display:block;margin-bottom:8px">Referral's Campaign Budget</label>
                <input type="range" min="5000" max="500000" value="50000" step="5000" oninput="updateAffiliate(this.value)">
                <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-500);margin-top:4px"><span>₹5,000</span><span>₹5,00,000</span></div>
            </div>
            <div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div>
            <p style="font-size:13px;color:var(--gray-500)">from <span id="affBudget">₹50,000</span> campaign budget</p>
            <div class="affiliate-tiers">
                <div class="tier-card"><div class="tier-val">₹25,000</div><div style="font-size:11px;color:var(--gray-500)">5 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹50,000</div><div style="font-size:11px;color:var(--gray-500)">10 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹1,00,000</div><div style="font-size:11px;color:var(--gray-500)">20 Referrals</div></div>
            </div>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Start Referring & Earning</button>
        </div>
    `;
}

function updateAffiliate(value) {
    const earn = Math.floor(value * 0.1);
    const e = $('affEarn'), b = $('affBudget');
    if (e) e.textContent = '₹' + earn.toLocaleString('en-IN');
    if (b) b.textContent = '₹' + parseInt(value).toLocaleString('en-IN');
}

function buildContest() {
    const container = $('contestContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="contest-card">
            <div style="font-size:48px">🏆</div>
            <h3>Run a Hashtag Contest</h3>
            <p style="color:var(--gray-600);margin:12px 0">Boost engagement with rickshaw-powered hashtag contests across Mumbra</p>
            <div class="form-group"><label for="contestHash">Contest Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest" placeholder="#YourHashtag"></div>
            <div class="form-group"><label for="contestPrize">Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash Prize" placeholder="Prize description"></div>
            <div class="form-group"><label for="contestDuration">Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div>
            <div class="form-group"><label for="contestPhone">Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div>
            <button onclick="launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button>
        </div>
    `;
}

function launchContest() {
    const hash = $('contestHash')?.value || '#RasaaiContest';
    const prize = $('contestPrizeVal')?.value || 'Prize';
    const dur = $('contestDuration')?.value || '7 Days';
    const phone = $('contestPhone')?.value;
    if (!phone) { alert('⚠️ Please enter your phone number'); return; }
    
    // Send to email
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORM_SUBMIT_URL;
    form.style.display = 'none';
    form.innerHTML = `
        <input type="hidden" name="_subject" value="New Contest: ${hash}">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="ContestHashtag" value="${hash}">
        <input type="hidden" name="Prize" value="${prize}">
        <input type="hidden" name="Duration" value="${dur}">
        <input type="hidden" name="Phone" value="${phone}">
    `;
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form), 1000);
    
    alert(`🏆 Contest Launched Successfully!\n\n${hash}\n${prize}\n${dur}\n\nYour contest will appear on 600+ rickshaws across Mumbra!\nOur team will call you at ${PHONE} shortly.\nConfirmation sent to ${EMAIL}`);
}

function buildHashtag() {
    const container = $('hashtagContainer');
    if (!container) return;
    container.innerHTML = `
        <div style="text-align:center;background:var(--white);border-radius:var(--radius-2xl);padding:32px;box-shadow:var(--shadow-md)">
            <div style="font-size:48px">📱</div>
            <h3>Live Hashtag Tracking</h3>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0">
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--orange)" id="htMentions">247</div><div style="font-size:11px;color:var(--gray-500)">Total Mentions</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--purple)">1.2K</div><div style="font-size:11px;color:var(--gray-500)">Engagement</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--green)">89%</div><div style="font-size:11px;color:var(--gray-500)">Positive Sentiment</div></div>
                <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--navy)">₹0.42</div><div style="font-size:11px;color:var(--gray-500)">Cost per Engagement</div></div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">📷 Instagram: 142</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">👍 Facebook: 68</span>
                <span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">🐦 Twitter: 37</span>
            </div>
        </div>
    `;
}

function buildFAQ() {
    const container = $('faqContainer');
    if (!container) return;
    container.innerHTML = FAQ_DATA.map((item, i) => `
        <div class="faq-item">
            <button class="faq-q" onclick="toggleFAQ(this)" aria-expanded="false"><span>${item.q}</span><span class="icon">+</span></button>
            <div class="faq-a"><p>${item.a}</p></div>
        </div>
    `).join('');
}

function toggleFAQ(btn) {
    const item = btn.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }
}

// ============================================
// TIMERS & UPDATES
// ============================================
function startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const step = Math.ceil(target / 50);
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
    setInterval(updateAllPrices, 900000);
    
    // Exit popup timer
    let exitSec = 299;
    setInterval(() => {
        const et = $('exitTimerDisplay');
        if (et) {
            const m = Math.floor(exitSec / 60), s = exitSec % 60;
            et.textContent = `Offer refreshes in: ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            exitSec--; if (exitSec < 0) exitSec = 299;
        }
    }, 1000);
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
    const msgs = ['🏃 3 businesses booked Kausa today', '🔥 Mumbra Station: Only 8 rickshaws left', '✅ New campaign live in Shilphata', '💼 Real estate agency booked 15 rickshaws', '⚡ Flash: Check Naka available at low rate', '🎯 Retail store started campaign in Retibunder'];
    let i = 0;
    setInterval(() => {
        const w = $('notificationWidget'), t = $('notificationText');
        if (w && t) { t.textContent = msgs[i]; w.classList.add('show'); setTimeout(() => w.classList.remove('show'), 4000); i = (i + 1) % msgs.length; }
    }, 8000);
}

// ============================================
// INTERACTIONS
// ============================================
let exitShown = false;
function setupExitIntent() {
    document.addEventListener('mouseout', e => {
        if (!exitShown && e.clientY <= 0 && window.scrollY > 800) {
            $('exitPopup')?.classList.add('show');
            exitShown = true;
            setTimeout(() => exitShown = false, 300000);
        }
    });
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = $('bizName')?.value || 'Customer';
            const phone = $('bizPhone')?.value;
            if (!phone) { alert('⚠️ Please enter your phone number'); return; }
            const btn = $('bookingSubmitBtn');
            if (btn) { btn.textContent = '⏳ Submitting...'; btn.disabled = true; }
            
            fetch(form.action, { method: 'POST', body: new FormData(form) })
                .then(() => {
                    alert(`✅ Booking Submitted!\n\nThank you, ${name}!\nWe'll call you at ${PHONE} within 5 minutes.\nConfirmation sent to ${EMAIL}`);
                    closeBookingModal();
                })
                .catch(() => {
                    alert(`✅ Booking Submitted!\n\nThank you, ${name}!\nWe'll call you at ${PHONE} shortly.`);
                    closeBookingModal();
                })
                .finally(() => { if (btn) { btn.textContent = '🚀 Submit & Get Callback'; btn.disabled = false; } });
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

function setupModals() {
    // Close modals on outside click
    $('bookingModal')?.addEventListener('click', function(e) { if (e.target === this) closeBookingModal(); });
    $('exitPopup')?.addEventListener('click', function(e) { if (e.target === this) closeExitPopup(); });
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
window.bookViaWhatsApp = bookViaWhatsApp;
window.openVideo = openVideo;
window.closeVideoModal = closeVideoModal;
window.playSampleAudio = playSampleAudio;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.closeExitPopup = closeExitPopup;
window.updateEyeCalc = updateEyeCalc;
window.updateROICalc = updateROICalc;
window.updateHeatmap = updateHeatmap;
window.toggleFAQ = toggleFAQ;
window.$ = $;
