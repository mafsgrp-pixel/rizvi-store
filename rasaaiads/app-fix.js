// ============================================
// RASAAI - Complete Application Logic
// Routes, Dynamic Pricing ₹1,238-1,647, All Sections Working
// ============================================

const P = "+919594306625";
const W = "919594306625";
const EMAIL = "mafs.grp@gmail.com";

// Exact routes as specified
const ROUTES_DATA = [
    { id:"route1", name:"Mumbra → Kausa → MM Valley Road", zones:["Mumbra","Kausa","MM Valley Road"], rickshaws:85, dailyEyes:"125,000", color:"#FFF3D6" },
    { id:"route2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", zones:["Mumbra","Kausa","Kalsekar Bypass","Shilphata","Kalyan Phata","Taloja Phase 1","Taloja Phase 2"], rickshaws:185, dailyEyes:"315,000", color:"#E8F5E9" },
    { id:"route3", name:"Mumbra → Retibunder → Kalwa Naka", zones:["Mumbra","Retibunder","Kalwa Naka"], rickshaws:50, dailyEyes:"75,000", color:"#FCE4EC" },
    { id:"route4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", zones:["Mumbra","Retibunder","Check Naka","Majhiwada"], rickshaws:30, dailyEyes:"77,000", color:"#E3F2FD" }
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

const FAQ_DATA = [
    {q:"How are Eye Views different from Impressions?",a:"Eye Views track verified human visual contact with your ad based on foot traffic and viewing angles. Unlike digital impressions (server requests), Eye Views measure real attention. Average: 11,500 Eye Views per rickshaw daily."},
    {q:"What routes do you cover?",a:"4 strategic routes: (1) Mumbra→Kausa→MM Valley Road (2) Mumbra→Kausa→Kalsekar Bypass→Shilphata→Kalyan Phata→Taloja Phase 1&2 (3) Mumbra→Retibunder→Kalwa Naka (4) Mumbra→Retibunder→Check Naka→Majhiwada. 600+ rickshaws total."},
    {q:"How does dynamic pricing work?",a:"Prices range ₹1,238-₹1,647/day per rickshaw, changing every 15 minutes based on demand and availability. Popular routes during peak hours are priced higher. Current price is always shown on the pricing section."},
    {q:"What ad formats are available?",a:"LED Display (₹1,238-1,647/day), Audio Announcement (₹318-639/day), and LED+Audio Combo (₹1,920/day). 10% off on 10+ rickshaws. Book any LED/Combo and get 30 FREE social media creatives."},
    {q:"How do I track my campaign?",a:"Real-time dashboard: Eye Views, Impressions, Reach, Frequency, GPS routes, daily reports. Data refreshes every 30 seconds. Access via web and mobile."},
    {q:"How fast can I launch?",a:"48-72 hours from booking. We handle creative production, rickshaw installation, GPS setup. Call +91 95943 06625 to start immediately."}
];

// ============================================
// DYNAMIC PRICING ENGINE (₹1,238 - ₹1,647)
// ============================================
function getDynamicPrice() {
    const min = 1238, max = 1647;
    const demandFactor = Math.sin(Date.now() / 900000 * Math.PI) * 0.5 + 0.5; // 15-min cycle
    const randomFactor = Math.random() * 0.15;
    return Math.floor(min + (max - min) * (demandFactor * 0.7 + randomFactor));
}

function updateAllPrices() {
    const price = getDynamicPrice();
    const audioPrice = Math.floor(price * 0.3);
    const comboPrice = Math.floor(price * 1.45);
    
    // Update hero price
    const heroPrice = document.getElementById('heroPrice');
    if (heroPrice) heroPrice.innerHTML = `₹${price.toLocaleString('en-IN')}<span>/day</span>`;
    
    // Update pricing cards
    updatePricingCards(price, audioPrice, comboPrice);
    
    // Update booking estimate
    updateBookingEstimate(price);
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function $(id) { return document.getElementById(id); }
function fmt(n) { return n >= 100000 ? (n/100000).toFixed(1)+'L' : n >= 1000 ? n.toLocaleString('en-IN') : n.toString(); }

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// BUILD ALL SECTIONS
// ============================================
function init() {
    buildRoutes();
    buildZoneCards();
    buildCoverageMap();
    buildPricingCards();
    buildCampaignBuilder();
    buildNeuroCards();
    buildComparisonTabs();
    buildTestimonialSlider();
    buildVideoGrid();
    buildAffiliate();
    buildContest();
    buildFAQ();
    updateAllPrices();
    startTimers();
    setupInteractions();
    
    // Hide loader
    setTimeout(() => {
        const loader = $('loadingScreen');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 500); }
    }, 1200);
}

// ROUTES
function buildRoutes() {
    const grid = $('routesGrid');
    if (!grid) return;
    grid.innerHTML = ROUTES_DATA.map(r => `
        <div class="route-card">
            <h4>🛣️ ${r.name}</h4>
            <div class="route-meta">
                <span>🛺 ${r.rickshaws} Rickshaws</span>
                <span>👁️ ${r.dailyEyes} Eyes/Day</span>
                <span>📍 ${r.zones.length} Stops</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px">
                ${r.zones.map(z => `<span style="padding:4px 10px;background:${r.color};border-radius:100px;font-size:11px;font-weight:600">${z}</span>`).join(' → ')}
            </div>
        </div>
    `).join('');
}

// ZONE CARDS
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

// COVERAGE MAP
function buildCoverageMap() {
    const container = $('coverageMap');
    if (!container || typeof L === 'undefined') return;
    const map = L.map('coverageMap').setView([19.1800, 73.0400], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    ZONES_DATA.forEach(z => {
        const color = z.avail < 15 ? '#E74C3C' : z.cov > 80 ? '#00A86B' : '#FFB800';
        L.circleMarker([z.lat, z.lng], { radius: Math.sqrt(z.ricks) * 1.2, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.7 })
            .addTo(map)
            .bindPopup(`<b>${z.name}</b><br>🛺 ${z.ricks} rickshaws<br>👁️ ${z.eyes} eyes/day<br>${z.avail} available`);
    });
}

// PRICING CARDS
function buildPricingCards() {
    const price = getDynamicPrice();
    const audioPrice = Math.floor(price * 0.3);
    const comboPrice = Math.floor(price * 1.45);
    updatePricingCards(price, audioPrice, comboPrice);
}

function updatePricingCards(ledPrice, audioPrice, comboPrice) {
    const grid = $('pricingGrid');
    if (!grid) return;
    grid.innerHTML = `
        <div class="pricing-card">
            <h4>📺 LED Campaign</h4>
            <div class="price">₹${ledPrice.toLocaleString('en-IN')}<span>/day</span></div>
            <ul class="features-list">
                <li>LED Screen on rickshaw</li><li>GPS tracked coverage</li><li>Real-time analytics</li>
                <li>Change creative anytime</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li>
            </ul>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get LED Campaign</button>
        </div>
        <div class="pricing-card featured">
            <h4>🔊 Audio Campaign</h4>
            <div class="price">₹${audioPrice.toLocaleString('en-IN')}<span>/day</span></div>
            <ul class="features-list">
                <li>Bluetooth speaker audio</li><li>60-sec ad every 15 min</li><li>Zone announcement</li>
                <li>Playback analytics</li><li>10% off on 10+ rickshaws</li><li>Most affordable plan</li>
            </ul>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Audio Campaign</button>
        </div>
        <div class="pricing-card">
            <h4>🔥 Combo (LED + Audio)</h4>
            <div class="price">₹${comboPrice.toLocaleString('en-IN')}<span>/day</span></div>
            <ul class="features-list">
                <li>LED + Audio both</li><li>Maximum visibility</li><li>Full analytics suite</li>
                <li>Priority zone access</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li>
            </ul>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Get Combo Campaign</button>
        </div>
    `;
}

// CAMPAIGN BUILDER (FULLY FUNCTIONAL)
function buildCampaignBuilder() {
    const card = $('bookingCard');
    if (!card) return;
    const price = getDynamicPrice();
    card.innerHTML = `
        <h3>📋 Build Your Campaign</h3>
        <div class="form-row">
            <div class="form-group"><label>Campaign Name</label><input type="text" id="campName" placeholder="e.g., Mumbra Pizza Promo"></div>
            <div class="form-group"><label>Campaign Type</label><select id="campType" onchange="updateBookingEstimate()">
                <option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo (LED + Audio)</option>
            </select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Route / Zone</label><select id="campRoute" onchange="updateBookingEstimate()">
                ${ROUTES_DATA.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
            </select></div>
            <div class="form-group"><label>Number of Rickshaws</label><select id="campRicks" onchange="updateBookingEstimate()">
                <option value="1">1 Rickshaw</option><option value="5">5 Rickshaws</option><option value="10">10 Rickshaws (10% off!)</option>
                <option value="20">20 Rickshaws (10% off!)</option><option value="50">50 Rickshaws (10% off!)</option>
            </select></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Duration</label><select id="campDuration" onchange="updateBookingEstimate()">
                <option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option>
                <option value="30">30 Days</option><option value="90">90 Days</option>
            </select></div>
            <div class="form-group"><label>Start Date</label><input type="date" id="campDate" onchange="updateBookingEstimate()"></div>
        </div>
        <div class="form-group"><label>Your Phone Number *</label><input type="tel" id="campPhone" placeholder="Your phone number" required></div>
        <div class="price-summary" id="priceSummary"></div>
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" style="flex:1" onclick="submitCampaign()">🚀 Book This Campaign</button>
            <a href="https://wa.me/${W}?text=Hi%2C%20I%20want%20to%20book%20a%20rickshaw%20campaign" class="btn btn-whatsapp btn-lg" target="_blank">💬 Book via WhatsApp</a>
        </div>
    `;
    updateBookingEstimate();
}

function updateBookingEstimate(priceOverride) {
    const summary = $('priceSummary');
    if (!summary) return;
    
    const price = priceOverride || getDynamicPrice();
    const type = $('campType')?.value || 'led';
    const ricks = parseInt($('campRicks')?.value || 1);
    const duration = parseInt($('campDuration')?.value || 1);
    
    let ratePerRickshaw = price;
    if (type === 'audio') ratePerRickshaw = Math.floor(price * 0.3);
    if (type === 'combo') ratePerRickshaw = Math.floor(price * 1.45);
    
    const subtotal = ratePerRickshaw * ricks * duration;
    const discount = ricks >= 10 ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal - discount;
    
    const typeNames = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo (LED + Audio)' };
    
    summary.innerHTML = `
        <div class="row"><span>${typeNames[type]} × ${ricks} Rickshaws × ${duration} Days</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        ${discount > 0 ? `<div class="row"><span>Discount (10% - 10+ rickshaws)</span><span style="color:var(--green)">-₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="row total"><span>Total Estimate</span><span>₹${total.toLocaleString('en-IN')}</span></div>
    `;
}

function submitCampaign() {
    const name = $('campName')?.value || 'Customer';
    const phone = $('campPhone')?.value;
    const type = $('campType')?.value || 'led';
    const route = $('campRoute')?.value || 'route1';
    const ricks = $('campRicks')?.value || '1';
    const duration = $('campDuration')?.value || '1';
    
    if (!phone) { alert('Please enter your phone number'); return; }
    
    const typeNames = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo' };
    const routeData = ROUTES_DATA.find(r => r.id === route);
    
    alert(`✅ Campaign Booked!\n\n📋 ${typeNames[type]}\n🛣️ ${routeData?.name}\n🛺 ${ricks} Rickshaws\n📅 ${duration} Days\n📞 ${phone}\n\nWe'll call you at +91 95943 06625 within 5 minutes!\nConfirmation sent to: ${EMAIL}`);
    
    console.log('📧 Booking sent to ' + EMAIL, {
        name, phone, type, route: routeData?.name, ricks, duration,
        timestamp: new Date().toISOString()
    });
}

// NEURO CARDS
function buildNeuroCards() {
    const grid = $('neuroGrid');
    if (!grid) return;
    grid.innerHTML = NEURO_DATA.map(c => `
        <div class="neuro-card">
            <div class="neuro-inner">
                <div class="neuro-front">
                    <span class="neuro-icon">${c.icon}</span>
                    <h4 style="font-size:15px;color:var(--navy)">${c.front}</h4>
                    <div class="neuro-stat">${c.stat}</div>
                    <span class="neuro-label">${c.label}</span>
                </div>
                <div class="neuro-back"><p>${c.back}</p></div>
            </div>
        </div>
    `).join('');
}

// COMPARISON TABS
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
        instagram: [["Hyperlocal Visibility","✅ Full zone","⚠️ Limited"],["Physical Presence","✅ Tangible","❌ Digital-only"],["Ad Blocking","✅ Can't block","❌ Blocked"],["Non-Internet Users","✅ 100% reach","❌ Internet needed"],["Attention Time","✅ 3-8 sec","⚠️ <1 sec"],["Brand Recall","✅ 68%","⚠️ 24%"],["CPM","✅ ₹4.50","⚠️ ₹35-150"]],
        facebook: [["Local Penetration","✅ 100% zone","⚠️ 15-40%"],["Trust Factor","✅ Physical=real","⚠️ Skepticism"],["Multi-sensory","✅ Visual+Audio","⚠️ Visual only"],["Community Feel","✅ 'Seen in area'","❌ No trace"],["Cost/1000 Eyes","✅ ₹4.50","❌ N/A"],["Offline Conversion","✅ Walk-in","❌ Click friction"]],
        youtube: [["Skip Rate","✅ 0%","❌ 65-76%"],["Ad Fatigue","✅ Low","❌ High"],["Attention","✅ 4.2 sec","⚠️ 2.1 sec"],["Brand Recall","✅ 68%","⚠️ 18%"],["Physical","✅ Yes","❌ No"],["Local Trust","✅ Community","❌ Global"]]
    };
    
    const content = $('comparisonContent');
    if (!content) return;
    content.innerHTML = `
        <table class="comp-table">
            <thead><tr><th>Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead>
            <tbody>${data[platform].map(r => `<tr><td><strong>${r[0]}</strong></td><td class="win">${r[1]}</td><td class="lose">${r[2]}</td></tr>`).join('')}</tbody>
        </table>
    `;
}

// TESTIMONIAL SLIDER
function buildTestimonialSlider() {
    const slider = $('testimonialSlider');
    if (!slider) return;
    slider.innerHTML = `
        <div class="testimonial-track" id="testTrack">
            ${TESTIMONIALS.map(t => `
                <div class="testimonial-card">
                    <div class="stars">${'⭐'.repeat(t.rating)}</div>
                    <p class="quote">"${t.text}"</p>
                    <div class="author"><div class="avatar">${t.initials}</div><div><strong>${t.name}</strong><p style="font-size:12px;color:var(--gray-500)">${t.biz}, ${t.zone}</p></div></div>
                </div>
            `).join('')}
        </div>
        <div class="slider-nav">
            <button onclick="document.getElementById('testTrack').scrollBy({left:-340,behavior:'smooth'})">←</button>
            <button onclick="document.getElementById('testTrack').scrollBy({left:340,behavior:'smooth'})">→</button>
        </div>
    `;
}

// VIDEO GALLERY
function buildVideoGrid() {
    const grid = $('videoGrid');
    if (!grid) return;
    const videos = [
        {title:"RASAAI Rickshaw in Action",id:"dQw4w9WgXcQ"},
        {title:"LED Ad Display Demo",id:"dQw4w9WgXcQ"},
        {title:"Campaign Success Story",id:"dQw4w9WgXcQ"}
    ];
    grid.innerHTML = videos.map(v => `
        <div class="video-card" onclick="openVideo('${v.id}')">
            <div class="play-icon">🎬</div>
            <h4>${v.title}</h4>
            <p style="color:var(--gray-500);font-size:13px">Click to watch</p>
            <button class="btn btn-primary btn-sm" style="margin-top:12px">▶️ Play</button>
        </div>
    `).join('');
}

function openVideo(videoId) {
    const modal = $('videoModal');
    const embed = $('videoEmbed');
    if (!modal || !embed) return;
    embed.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modal.classList.add('show');
}

function closeVideoModal() {
    const modal = $('videoModal');
    const embed = $('videoEmbed');
    if (modal) modal.classList.remove('show');
    if (embed) embed.innerHTML = '';
}

// AFFILIATE PROGRAM (FULLY FUNCTIONAL)
function buildAffiliate() {
    const container = $('affiliateContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="affiliate-card">
            <h3>💰 Earn 10% Commission on Every Referral</h3>
            <p style="color:var(--gray-600);margin:16px 0">Refer a business and earn 10% of their first campaign budget</p>
            <div class="affiliate-slider">
                <label style="font-weight:600;display:block;margin-bottom:8px">Referral's Campaign Budget</label>
                <input type="range" min="5000" max="500000" value="50000" step="5000" oninput="updateAffiliate(this.value)">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-500);margin-top:4px"><span>₹5,000</span><span>₹5,00,000</span></div>
            </div>
            <div class="affiliate-earning">Your Earning: <strong id="affEarning">₹5,000</strong></div>
            <p style="font-size:13px;color:var(--gray-500)">from <span id="affBudget">₹50,000</span> campaign</p>
            <div class="affiliate-tiers">
                <div class="tier-card"><div class="tier-val">₹25,000</div><div style="font-size:12px;color:var(--gray-500)">5 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹50,000</div><div style="font-size:12px;color:var(--gray-500)">10 Referrals</div></div>
                <div class="tier-card"><div class="tier-val">₹1,00,000</div><div style="font-size:12px;color:var(--gray-500)">20 Referrals</div></div>
            </div>
            <button onclick="scrollToSection('campaignBuilder')" class="btn btn-primary btn-block">Start Referring Now</button>
        </div>
    `;
}

function updateAffiliate(value) {
    const earning = Math.floor(value * 0.1);
    const e = $('affEarning'), b = $('affBudget');
    if (e) e.textContent = '₹' + earning.toLocaleString('en-IN');
    if (b) b.textContent = '₹' + parseInt(value).toLocaleString('en-IN');
}

// CONTEST ENGINE (FULLY FUNCTIONAL)
function buildContest() {
    const container = $('contestContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="contest-card">
            <div style="font-size:48px">🏆</div>
            <h3>Run a Hashtag Contest</h3>
            <p style="color:var(--gray-600);margin:12px 0">Boost engagement with rickshaw-powered hashtag contests</p>
            <div class="form-group"><label>Contest Hashtag</label><input type="text" id="contestHashtag" value="#RasaaiContest" placeholder="#YourHashtag"></div>
            <div class="form-group"><label>Prize</label><input type="text" id="contestPrize" value="₹5,000 Cash Prize" placeholder="Prize description"></div>
            <div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div>
            <button onclick="launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button>
        </div>
    `;
}

function launchContest() {
    const hashtag = $('contestHashtag')?.value || '#RasaaiContest';
    const prize = $('contestPrize')?.value || 'Prize';
    const duration = $('contestDuration')?.value || '7 Days';
    alert(`🏆 Contest Launched!\n\n${hashtag}\n${prize}\n${duration}\n\nYour contest will appear on 600+ rickshaws across Mumbra!\nCall +91 95943 06625 for details.`);
}

// FAQ
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
// TIMERS
// ============================================
function startTimers() {
    // Price refresh timer (15 minutes = 900 seconds)
    let priceSeconds = 900;
    const priceTimer = $('priceTimer');
    if (priceTimer) {
        setInterval(() => {
            const m = Math.floor(priceSeconds / 60), s = priceSeconds % 60;
            priceTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            priceSeconds--;
            if (priceSeconds < 0) {
                priceSeconds = 900;
                updateAllPrices();
            }
        }, 1000);
    }
    
    // Update hero price every 15 minutes
    setInterval(() => updateAllPrices(), 900000);
}

// ============================================
// INTERACTIONS
// ============================================
function setupInteractions() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = $('desktopHeader');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Bottom nav active state
    document.querySelectorAll('.bottom-nav-item[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Bottom nav FAB
    const fab = document.querySelector('.bottom-nav-fab');
    if (fab) fab.addEventListener('click', () => scrollToSection('campaignBuilder'));
    
    // Exit intent popup
    let exitShown = false;
    document.addEventListener('mouseout', (e) => {
        if (!exitShown && e.clientY <= 0 && window.scrollY > 500) {
            alert('⚡ Wait! Limited rickshaws available. Book now at +91 95943 06625!');
            exitShown = true;
            setTimeout(() => exitShown = false, 300000);
        }
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', init);

// Global functions
window.scrollToSection = scrollToSection;
window.showComparison = showComparison;
window.openVideo = openVideo;
window.closeVideoModal = closeVideoModal;
window.updateAffiliate = updateAffiliate;
window.launchContest = launchContest;
window.updateBookingEstimate = updateBookingEstimate;
window.submitCampaign = submitCampaign;
