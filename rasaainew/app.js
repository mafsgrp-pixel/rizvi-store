// ============================================
// RASAAI - Data Layer & Build Functions
// ============================================
const RASAAI_DATA = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    
    img: [
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
    ],

    routes: [
        { id:"r1", name:"Mumbra → Kausa → MM Valley Road", zones:["Mumbra","Kausa","MM Valley Road"], ricks:85, eyes:"125,000", color:"#FFF3D6", img:0, coords:[[19.1800,73.0280],[19.1765,73.0320],[19.1720,73.0250]] },
        { id:"r2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", zones:["Mumbra","Kausa","Kalsekar Bypass","Shilphata","Kalyan Phata","Taloja Phase 1","Taloja Phase 2"], ricks:185, eyes:"315,000", color:"#E8F5E9", img:1, coords:[[19.1800,73.0280],[19.1765,73.0320],[19.1850,73.0500],[19.1950,73.0480],[19.1980,73.0550],[19.2000,73.0600],[19.2050,73.0650]] },
        { id:"r3", name:"Mumbra → Retibunder → Kalwa Naka", zones:["Mumbra","Retibunder","Kalwa Naka"], ricks:50, eyes:"75,000", color:"#FCE4EC", img:2, coords:[[19.1800,73.0280],[19.1700,73.0380],[19.1650,73.0420]] },
        { id:"r4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", zones:["Mumbra","Retibunder","Check Naka","Majhiwada"], ricks:30, eyes:"77,000", color:"#E3F2FD", img:3, coords:[[19.1800,73.0280],[19.1700,73.0380],[19.1850,73.0350],[19.1900,73.0300]] }
    ],

    zones: [
        { id:"kausa", name:"Kausa", pop:45000, traffic:"85K/day", peak:"8AM-8PM", eyes:"125,000", ricks:85, avail:42, cov:87, lat:19.1765, lng:73.0320, img:4 },
        { id:"mumbra-station", name:"Mumbra Station", pop:78000, traffic:"150K/day", peak:"7AM-9PM", eyes:"220,000", ricks:120, avail:8, cov:92, lat:19.1800, lng:73.0280, img:5 },
        { id:"shilphata", name:"Shilphata", pop:55000, traffic:"110K/day", peak:"7AM-9PM", eyes:"155,000", ricks:65, avail:25, cov:78, lat:19.1950, lng:73.0480, img:6 },
        { id:"retibunder", name:"Retibunder", pop:35000, traffic:"65K/day", peak:"9AM-8PM", eyes:"75,000", ricks:50, avail:30, cov:72, lat:19.1700, lng:73.0380, img:7 },
        { id:"check-naka", name:"Check Naka", pop:40000, traffic:"70K/day", peak:"7AM-8PM", eyes:"77,000", ricks:30, avail:20, cov:65, lat:19.1850, lng:73.0350, img:8 },
        { id:"kalwa", name:"Kalwa Naka", pop:52000, traffic:"95K/day", peak:"8AM-9PM", eyes:"130,000", ricks:55, avail:18, cov:74, lat:19.1650, lng:73.0420, img:9 },
        { id:"majhiwada", name:"Majhiwada", pop:48000, traffic:"80K/day", peak:"8AM-8PM", eyes:"110,000", ricks:40, avail:22, cov:68, lat:19.1900, lng:73.0300, img:10 },
        { id:"taloja1", name:"Taloja Phase 1", pop:30000, traffic:"45K/day", peak:"7AM-7PM", eyes:"60,000", ricks:25, avail:15, cov:55, lat:19.2000, lng:73.0600, img:11 },
        { id:"taloja2", name:"Taloja Phase 2", pop:28000, traffic:"40K/day", peak:"7AM-7PM", eyes:"55,000", ricks:22, avail:17, cov:50, lat:19.2050, lng:73.0650, img:12 },
        { id:"kalyan-phata", name:"Kalyan Phata", pop:42000, traffic:"75K/day", peak:"8AM-9PM", eyes:"100,000", ricks:45, avail:20, cov:70, lat:19.1980, lng:73.0550, img:13 },
        { id:"kalsekar", name:"Kalsekar Bypass", pop:38000, traffic:"60K/day", peak:"7AM-8PM", eyes:"85,000", ricks:35, avail:28, cov:62, lat:19.1850, lng:73.0500, img:0 },
        { id:"mm-valley", name:"MM Valley Road", pop:32000, traffic:"50K/day", peak:"8AM-8PM", eyes:"70,000", ricks:28, avail:25, cov:58, lat:19.1720, lng:73.0250, img:1 }
    ],

    neuro: [
        {icon:"👁️",title:"Motion Bias",stat:"400%",label:"More Attention",back:"Human visual cortex detects movement automatically. Moving rickshaw ads command 400% more attention than static billboards."},
        {icon:"⚡",title:"Pattern Interruption",stat:"3x",label:"Memory Encoding",back:"New ad breaks expected patterns, triggering norepinephrine release and encoding into memory."},
        {icon:"🔄",title:"Spaced Repetition",stat:"3x",label:"Consolidation",back:"Same ad on different rickshaws across days = 3x memory consolidation via spacing effect."},
        {icon:"🧠",title:"Visual Recall",stat:"65%",label:"Recall Rate",back:"65% of visual info recalled after 3 days vs 10% text. Transit ads use dual encoding."},
        {icon:"📍",title:"Location Familiarity",stat:"73%",label:"Trust Increase",back:"Ads in familiar locations feel trustworthy. Mere-exposure effect builds community connection."},
        {icon:"👥",title:"Social Proof",stat:"5x",label:"Word-of-Mouth",back:"Thousands seeing same ad = implicit social proof. Drives word-of-mouth and credibility."},
        {icon:"🔊",title:"Dual-Channel",stat:"85%",label:"Higher Recall",back:"Audio + Visual = two memory pathways. 85% higher recall than visual-only transit ads."},
        {icon:"🏘️",title:"Community",stat:"73%",label:"Prefer Local",back:"73% prefer brands that feel local. Transit ads create neighborhood ownership and trust."}
    ],

    testimonials: [
        {name:"Ahmed Shaikh",biz:"Mumbra Pizza House",zone:"Mumbra Station",text:"RASAAI se humare Pizza House ki walk-ins 65% badh gayi. Best advertising investment for local businesses!",rating:5,init:"AS"},
        {name:"Dr. Fatima Khan",biz:"Shifa Clinic",zone:"Kausa",text:"120 new patients in 6 months. Hyperlocal visibility that actually works!",rating:5,init:"FK"},
        {name:"Mohammed Ali",biz:"Al-Huda Tuition",zone:"Shilphata",text:"45 new students enrolled in 2 months. Combo package worth every rupee!",rating:5,init:"MA"},
        {name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Store visibility doubled. Customers walk in saying they saw our rickshaw ad!",rating:5,init:"RS"},
        {name:"Priya Patel",biz:"Fashion Hub",zone:"Mumbra Station",text:"Best advertising investment. Real people, real eyes, real customers. 40% sales increase.",rating:5,init:"PP"},
        {name:"Vikram Singh",biz:"AutoCare Center",zone:"Check Naka",text:"Reached truck drivers we couldn't reach online. Brilliant for B2B.",rating:5,init:"VS"},
        {name:"Sneha Gupta",biz:"Sweet Bengal",zone:"Kausa",text:"Sweet shop became talk of the area. Rickshaw branding is unforgettable.",rating:5,init:"SG"},
        {name:"Deepa Shah",biz:"Wellness Yoga",zone:"Shilphata",text:"50+ new members. Morning commuters see our ad every day.",rating:5,init:"DS"},
        {name:"Rajesh Patil",biz:"Shilphata Industries",zone:"Shilphata",text:"Reached warehouse managers who don't use social media. Unmatched for B2B.",rating:5,init:"RP"},
        {name:"Kavita Reddy",biz:"Spice Garden",zone:"Kausa",text:"Dinner crowd doubled in 2 weeks. Customers from areas we never reached.",rating:5,init:"KR"},
        {name:"Sunil Shetty",biz:"FitLife Gym",zone:"Check Naka",text:"80+ signups from New Year campaign. LED ads at night are magic.",rating:5,init:"SS"},
        {name:"Anita Desai",biz:"BookWorm Library",zone:"Retibunder",text:"Memberships tripled. Kids see ad on school routes and beg to join!",rating:4,init:"AD"},
        {name:"Mohan Lal",biz:"Lal Jewelers",zone:"Mumbra Station",text:"60+ inquiries from wedding campaign. Trust factor of physical ads unbeatable.",rating:5,init:"ML"},
        {name:"Pooja Malhotra",biz:"Pixel Photography",zone:"Retibunder",text:"Booked 12 weddings after campaign. Visual medium works wonders!",rating:4,init:"PM"},
        {name:"Harish Thakur",biz:"Thakur Hardware",zone:"Check Naka",text:"Everyone knows our shop now. Simple branding, massive recall.",rating:5,init:"HT"}
    ],

    industries: [
        {icon:"🏪",name:"Retail Stores",desc:"Drive footfall. Local visibility = local customers."},
        {icon:"🍽️",name:"Restaurants",desc:"Hungry commuters see your ad daily."},
        {icon:"🏥",name:"Clinics",desc:"Healthcare ads build local patient trust."},
        {icon:"💊",name:"Pharmacies",desc:"Be the first name they recall."},
        {icon:"🏫",name:"Schools",desc:"Reach parents on school routes."},
        {icon:"📚",name:"Coaching",desc:"Students see you every day."},
        {icon:"🏠",name:"Real Estate",desc:"Property ads in the neighborhood."},
        {icon:"💪",name:"Gyms",desc:"Fitness ads on commute routes."},
        {icon:"💇",name:"Salons",desc:"Beauty parlors visible daily."},
        {icon:"📱",name:"Electronics",desc:"Tech deals seen by gadget lovers."},
        {icon:"💍",name:"Jewelry",desc:"Wedding season? Be seen."},
        {icon:"🏦",name:"Banks",desc:"Financial services build trust."},
        {icon:"🛡️",name:"Insurance",desc:"Seen = trusted in local markets."},
        {icon:"🚗",name:"Automobile",desc:"Commuters are your audience."},
        {icon:"🔧",name:"Hardware",desc:"Found when needed most."},
        {icon:"🪑",name:"Furniture",desc:"Home dreams start on streets."},
        {icon:"🎉",name:"Events",desc:"Be booked for the big day."},
        {icon:"✈️",name:"Travel",desc:"Vacation dreams triggered daily."},
        {icon:"🍲",name:"Catering",desc:"Party orders from rickshaw ads."},
        {icon:"🦷",name:"Dentist",desc:"Toothache? They know where."}
    ],

    faq: [
        {q:"How are Eye Views different from Impressions?",a:"Eye Views track verified human visual contact based on foot traffic and viewing angles. Unlike digital impressions (server requests), Eye Views measure real attention. Average: 11,500 Eye Views per rickshaw daily."},
        {q:"What routes do you cover?",a:"4 strategic routes: (1) Mumbra→Kausa→MM Valley Road (2) Mumbra→Kausa→Kalsekar Bypass→Shilphata→Kalyan Phata→Taloja Phase 1&2 (3) Mumbra→Retibunder→Kalwa Naka (4) Mumbra→Retibunder→Check Naka→Majhiwada. 600+ rickshaws across 12 zones."},
        {q:"How does dynamic pricing work?",a:"Prices range ₹1,238-₹1,647/day per rickshaw, changing every 15 minutes based on demand. 10% discount on 10+ rickshaws."},
        {q:"What ad formats are available?",a:"LED Display (₹1,238-1,647/day), Audio Announcement (₹318-639/day), and LED+Audio Combo (₹1,795-2,388/day). Book LED/Combo and get 30 FREE social media creatives."},
        {q:"How do I track my campaign?",a:"Real-time dashboard: Eye Views, Impressions, Reach, GPS routes, daily reports. Data refreshes every 30 seconds."},
        {q:"How fast can I launch?",a:"48-72 hours from booking. We handle creative production, installation, GPS setup. Call +91 95943 06625."},
        {q:"How does RASAAI compare to digital ads?",a:"0% skip rate (vs 76% YouTube), 68% brand recall (vs 18% digital), ₹4.50 CPM (vs ₹35-150 Instagram). Physical ads reach non-internet users."},
        {q:"Can I choose specific routes?",a:"Yes! Select from 4 routes and 12 zones. Target school zones, market areas, station queues, or industrial corridors."}
    ],

    comparisons: {
        instagram: [["Hyperlocal Visibility","✅ Full zone dominance","❌ Limited by algorithm"],["Physical Presence","✅ Tangible, unavoidable","❌ Digital-only"],["Ad Blocking","✅ Cannot be blocked","❌ Ad blockers work"],["Non-Internet Users","✅ 100% foot traffic","❌ Internet required"],["Attention Time","✅ 3-8 seconds","❌ <1 second scroll"],["Brand Recall","✅ 68%","❌ 24%"],["Effective CPM","✅ ₹4.50","❌ ₹35-150"],["Ad Fatigue","✅ Low","❌ High"]],
        facebook: [["Local Penetration","✅ 100% zone coverage","❌ 15-40%"],["Trust Factor","✅ Physical = real","❌ Skepticism"],["Multi-sensory","✅ Visual + Audio","❌ Visual only"],["Community Feel","✅ Seen in area","❌ No trace"],["Cost/1000 Eyes","✅ ₹4.50","❌ N/A"],["Offline Conversion","✅ Walk-in","❌ Click friction"]],
        youtube: [["Skip Rate","✅ 0%","❌ 65-76%"],["Ad Fatigue","✅ Low","❌ High"],["Attention","✅ 4.2 sec","❌ 2.1 sec"],["Brand Recall","✅ 68%","❌ 18%"],["Physical","✅ Yes","❌ No"],["Local Trust","✅ Community","❌ Global"]]
    }
};

// Helper functions
function $(id) { return document.getElementById(id); }
function fmt(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); }
function img(i) { return RASAAI_DATA.img[i] || RASAAI_DATA.img[0]; }

// Build Trust Logos
function buildTrustLogos() {
    const t = $('trustLogosTrack'); if(!t)return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🏢 Shilphata Ind.","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point"];
    t.innerHTML = [...logos,...logos].map(l=>`<span class="trust-logo-item">${l}</span>`).join('');
}

// Build Routes
function buildRoutes() {
    const g = $('routesGrid'); if(!g)return;
    g.innerHTML = RASAAI_DATA.routes.map((r,i)=>`
        <div class="route-card" onclick="document.getElementById('zones').scrollIntoView({behavior:'smooth'})">
            <div class="route-card-image" style="background-image:url('${img(r.img)}')"><div class="route-overlay"></div></div>
            <div class="route-card-body">
                <h4>🛣️ Route ${i+1}</h4>
                <p style="font-size:13px;color:var(--gray-700);margin-bottom:8px">${r.name}</p>
                <div class="route-meta"><span>🛺 ${r.ricks} Rickshaws</span><span>👁️ ${r.eyes} Eyes/Day</span><span>📍 ${r.zones.length} Stops</span></div>
                <div class="route-zones">${r.zones.map(z=>`<span class="route-zone-pill" style="background:${r.color}">${z}</span>`).join(' → ')}</div>
            </div>
        </div>
    `).join('');
}

// Build Zone Cards
function buildZoneCards() {
    const g = $('zonesGrid'); if(!g)return;
    g.innerHTML = RASAAI_DATA.zones.map(z=>`
        <div class="zone-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})">
            <div class="zone-card-image" style="background-image:url('${img(z.img)}')">
                <span class="zone-availability ${z.avail<15?'low':''}">${z.avail} Left</span>
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

// Build Rickshaw Tracks
function buildRickshawTracks() {
    const g = $('rickshawTrackGrid'); if(!g)return;
    let h='';
    for(let i=0;i<6;i++){const z=RASAAI_DATA.zones[i%12],on=Math.random()>0.1,au=Math.random()>0.1?'active':'inactive',le=Math.random()>0.05?'active':'inactive';
        h+=`<div class="track-card"><div class="track-header"><div class="track-id"><span class="track-dot ${on?'online':'offline'}"></span>RKS-${String(i+1).padStart(3,'0')}</div><span>🔋 ${Math.floor(Math.random()*40)+60}%</span></div><div style="font-weight:600">📍 ${z.name}</div><div class="track-route">🛣️ Active Route</div><div class="track-metrics"><span>👁️ ${fmt(Math.floor(Math.random()*7000)+8000)} views</span><span>📊 ${fmt(Math.floor(Math.random()*5000)+6000)} exp</span></div><div style="display:flex;gap:6px;margin-top:8px"><span class="track-badge ${au}">🔊 ${au}</span><span class="track-badge ${le}">💡 ${le}</span></div>${Math.random()>0.3?'<div style="padding:6px 10px;background:var(--green-light);border-radius:8px;font-size:11px;color:var(--green);margin-top:8px">Active: Campaign</div>':'<div style="padding:6px 10px;background:var(--gray-50);border-radius:8px;font-size:11px;color:var(--gray-500);margin-top:8px">Available</div>'}</div>`;}
    g.innerHTML=h;
}

// Build Eye Calculator
function buildEyeCalculator() {
    const c=$('eyeCalculator'); if(!c)return;
    c.innerHTML=`<h3 style="margin-bottom:16px">👁️ Estimate Your Eye Views</h3><div class="calc-inputs"><div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="RASAAI.updateEyeCalc()"><option value="">All Zones</option>${RASAAI_DATA.zones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div><div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="$('ecRicksVal').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700">10</span></div><div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="$('ecDaysVal').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700">30</span></div></div><div class="calc-results"><div class="calc-result-item"><div class="calc-result-icon">👁️</div><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div><div class="calc-result-item"><div class="calc-result-icon">👥</div><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div><div class="calc-result-item"><div class="calc-result-icon">💰</div><div class="calc-result-value" id="ecCost">₹45,000</div><div class="calc-result-label">Est. Cost</div></div><div class="calc-result-item"><div class="calc-result-icon">📊</div><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM</div></div></div>`;
}

// Build Neuro Cards
function buildNeuroCards() {
    const g=$('neuroGrid'); if(!g)return;
    g.innerHTML=RASAAI_DATA.neuro.map(c=>`<div class="neuro-card"><div class="neuro-inner"><div class="neuro-front"><span class="neuro-icon">${c.icon}</span><h4>${c.title}</h4><div class="neuro-stat">${c.stat}</div><span class="neuro-stat-label">${c.label}</span></div><div class="neuro-back"><p>${c.back}</p></div></div></div>`).join('');
}

// Build Metrics
function buildMetrics() {
    const g=$('metricsGrid'),d=$('metricsDetail'); if(!g||!d)return;
    g.innerHTML=`<div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><p style="color:var(--gray-600);font-size:13px">Verified human contact</p><span class="metrics-badge">Proprietary</span></div><div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div><p style="color:var(--gray-600);font-size:13px">Total exposures</p></div><div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div><p style="color:var(--gray-600);font-size:13px">Unique individuals</p></div>`;
    d.innerHTML=`<div class="metric-detail"><div class="label">CPM (Eye View)</div><div class="value">₹4.50</div></div><div class="metric-detail"><div class="label">Brand Recall</div><div class="value">68%</div></div><div class="metric-detail"><div class="label">Attention Time</div><div class="value">4.2s</div></div><div class="metric-detail"><div class="label" style="color:var(--green)">Skip Rate</div><div class="value" style="color:var(--green)">0%</div></div>`;
}

// Build Comparison Tabs
function buildComparisonTabs() {
    const t=$('comparisonTabs'); if(!t)return;
    t.innerHTML=`<button class="comp-tab active" onclick="RASAAI.showComparison('instagram',this)">📱 vs Instagram</button><button class="comp-tab" onclick="RASAAI.showComparison('facebook',this)">👍 vs Facebook</button><button class="comp-tab" onclick="RASAAI.showComparison('youtube',this)">▶️ vs YouTube</button>`;
}

// Build Audio Player
function buildAudioPlayer() {
    const c=$('audioPlayer'); if(!c)return;
    c.innerHTML=[{icon:"🍽️",title:"Restaurant Ad",desc:"Food & dining",type:"restaurant"},{icon:"🏥",title:"Clinic Ad",desc:"Healthcare",type:"clinic"},{icon:"🏫",title:"Education Ad",desc:"Schools & coaching",type:"education"}].map(s=>`<div class="audio-card" onclick="RASAAI.playAudio('${s.type}')"><div class="audio-icon">${s.icon}</div><h4>${s.title}</h4><p style="color:var(--gray-500);font-size:13px">${s.desc}</p><div class="audio-wave">${'<div class="bar"></div>'.repeat(8)}</div><button class="btn btn-primary btn-sm">▶️ Play</button></div>`).join('');
}

// Build Format Cards
function buildFormatCards() {
    const g=$('formatCards'); if(!g)return;
    const f=[{icon:"💡",name:"LED Display",desc:"Bright LED screen. Day & night.",feat:["Full-color","Weatherproof","GPS tracked","Changeable"],price:"₹1,238-1,647/day",rec:!1},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers.",feat:["Pro voice-over","Multi-language","60-sec ads","Zone targeting"],price:"₹318-639/day",rec:!1},{icon:"⚡",name:"LED + Audio Combo",desc:"Dual-channel. 85% higher recall.",feat:["Visual+Audio sync","Maximum attention","Best ROI","Priority access"],price:"₹1,795-2,388/day",rec:!0}];
    g.innerHTML=f.map(f=>`<div class="format-card ${f.rec?'recommended':''}">${f.rec?'<span class="recommended-badge">⭐ Recommended</span>':''}<div class="format-icon">${f.icon}</div><h4>${f.name}</h4><p>${f.desc}</p><ul class="format-features">${f.feat.map(ft=>`<li>${ft}</li>`).join('')}</ul><div class="format-price">${f.price}</div><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block btn-sm" style="margin-top:12px">Choose ${f.name.split(' ')[0]}</button></div>`).join('');
}

// Build Campaign Builder
function buildCampaignBuilder() {
    const c=$('bookingCard'); if(!c)return;
    c.innerHTML=`<h3>📋 Build Your Campaign</h3><p style="color:var(--gray-500);font-size:13px;margin-bottom:24px">Fill details & book instantly via WhatsApp</p><div class="form-row"><div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div><div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="RASAAI.updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo (LED + Audio)</option></select></div></div><div class="form-row"><div class="form-group"><label>Route</label><select id="cbRoute" onchange="RASAAI.updateBookingEstimate()">${RASAAI_DATA.routes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}</select></div><div class="form-group"><label>Rickshaws</label><select id="cbRicks" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Rickshaw</option><option value="5">5 Rickshaws</option><option value="10">10 Rickshaws (10% off!)</option><option value="20">20 Rickshaws (10% off!)</option></select></div></div><div class="form-row"><div class="form-group"><label>Duration</label><select id="cbDuration" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="cbPhone" required placeholder="+91"></div></div><div class="price-summary" id="priceSummary"></div><div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap"><button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="RASAAI.bookViaWhatsApp()">💬 Book via WhatsApp</button><a href="tel:+919594306625" class="btn btn-primary btn-lg" style="flex:1">📞 Call Now</a></div>`;
}

// Build Pricing
function buildPricingCards() {
    const g=$('pricingGrid'); if(!g)return;
    const p=RASAAI.getPrice(),a=Math.floor(p*0.3),co=Math.floor(p*1.45);
    g.innerHTML=`<div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹${p.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED Screen on rickshaw</li><li>GPS tracked</li><li>Real-time analytics</li><li>Change creative anytime</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get LED Campaign</button></div><div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹${a.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>Bluetooth speaker audio</li><li>60-sec ad every 15 min</li><li>Zone announcement</li><li>Playback analytics</li><li>10% off on 10+ rickshaws</li><li>💰 Most affordable</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get Audio Campaign</button></div><div class="pricing-card"><h4>🔥 Combo (LED + Audio)</h4><div class="price">₹${co.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED + Audio both</li><li>Maximum visibility</li><li>Full analytics suite</li><li>Priority zone access</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get Combo Campaign</button></div>`;
}

// Build Inventory
function buildInventoryCards() {
    const g=$('inventoryGrid'); if(!g)return;
    g.innerHTML=RASAAI_DATA.zones.slice(0,8).map(z=>{const s=z.avail<10?'critical':z.avail<20?'low':'good',m={critical:'⚠️ Almost gone!',low:'⚡ Selling fast',good:'✅ Available'};return`<div class="inventory-card"><h4 style="margin-bottom:12px">📍 ${z.name}</h4><div class="inventory-stock ${s}"><span class="number">${z.avail}</span><span class="label">left</span></div><div class="inventory-bar"><div class="inventory-bar-fill" style="width:${z.cov}%"></div></div><span class="inventory-status ${s}">${m[s]}</span></div>`}).join('');
}

// Build ROI Calculator
function buildROICalc() {
    const c=$('roiCalc'); if(!c)return;
    c.innerHTML=`<h3 style="margin-bottom:16px">🧮 Advanced ROI Calculator</h3><div class="calc-inputs"><div class="calc-input-row"><label>Business</label><select id="roiBiz" onchange="RASAAI.updateROICalc()"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option></select></div><div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="RASAAI.updateROICalc()">${RASAAI_DATA.zones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div><div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="$('roiBudgetVal').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');RASAAI.updateROICalc()"><span id="roiBudgetVal" style="font-weight:700">₹50,000</span></div></div><div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Eye Views</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall ↑</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">New Customers</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">ROI</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiBE">--</div><div class="calc-result-label">Break-even</div></div></div>`;
}

// Build Case Studies
function buildCaseStudies() {
    const g=$('caseStudiesGrid'); if(!g)return;
    const cs=[{biz:"Spice Garden",type:"Restaurant",zone:"Kausa",dur:"30d",budget:"₹15K",r1:"45%",l1:"Footfall",r2:"467%",l2:"ROI",r3:"72%",l3:"Recall",q:"Dinner crowd doubled in 2 weeks! Customers from areas we never reached.",o:"Ahmed Siddiqui"},{biz:"Mumbra Dental",type:"Clinic",zone:"Station",dur:"45d",budget:"₹22K",r1:"38%",l1:"Patients",r2:"445%",l2:"ROI",r3:"68%",l3:"Recall",q:"Audio ads near station incredibly effective. Patients mention hearing us.",o:"Dr. Fatima Khan"},{biz:"Shilphata Ind.",type:"B2B",zone:"Shilphata",dur:"60d",budget:"₹35K",r1:"55%",l1:"Inquiries",r2:"900%",l2:"ROI",r3:"64%",l3:"Recall",q:"Reached warehouse managers who don't use social media.",o:"Rajesh Patil"}];
    g.innerHTML=cs.map(c=>`<div class="case-card"><div class="case-header"><span style="font-weight:700;color:var(--orange)">Case Study</span><span class="case-tag">${c.type}</span></div><h3>${c.biz}</h3><div style="display:flex;gap:12px;margin:8px 0;font-size:12px;color:var(--gray-500)"><span>📍 ${c.zone}</span><span>⏱️ ${c.dur}</span><span>💰 ${c.budget}</span></div><div class="case-results"><div class="case-result"><div class="val">${c.r1}</div><div class="lbl">${c.l1}</div></div><div class="case-result"><div class="val">${c.r2}</div><div class="lbl">${c.l2}</div></div><div class="case-result"><div class="val">${c.r3}</div><div class="lbl">${c.l3}</div></div></div><blockquote class="case-quote">"${c.q}"<cite style="display:block;margin-top:6px;font-weight:600">— ${c.o}</cite></blockquote></div>`).join('');
}

// Build Industries
function buildIndustries() {
    const g=$('industryCards'); if(!g)return;
    g.innerHTML=RASAAI_DATA.industries.map(i=>`<div class="industry-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})"><div class="icon">${i.icon}</div><h4>${i.name}</h4><p>${i.desc}</p></div>`).join('');
}

// Build Testimonials
function buildTestimonialSlider() {
    const s=$('testimonialSlider'); if(!s)return;
    s.innerHTML=`<div class="testimonial-track" id="testTrack">${RASAAI_DATA.testimonials.map(t=>`<div class="testimonial-card"><div class="stars">${'⭐'.repeat(t.rating)}</div><p class="quote">"${t.text}"</p><div class="author"><div class="avatar">${t.init}</div><div><strong>${t.name}</strong><p style="font-size:11px;color:var(--gray-500)">${t.biz}, ${t.zone}</p></div></div></div>`).join('')}</div><div class="slider-nav"><button onclick="$('testTrack').scrollBy({left:-340,behavior:'smooth'})">←</button><button onclick="$('testTrack').scrollBy({left:340,behavior:'smooth'})">→</button></div>`;
}

// Build Videos
function buildVideoGrid() {
    const g=$('videoGrid'); if(!g)return;
    g.innerHTML=[{t:"Rickshaw LED Ad",img:6},{t:"Campaign Success",img:7},{t:"Audio Ad Demo",img:8},{t:"Coverage Map",img:9}].map(v=>`<div class="video-card" onclick="RASAAI.openVideo('dQw4w9WgXcQ')"><div class="video-thumb" style="background-image:url('${img(v.img)}')"><div class="play-btn">▶️</div></div><div class="video-body"><h4>${v.t}</h4></div></div>`).join('');
}

// Build Heatmap
function buildHeatmap() {
    const c=$('heatmapContainer'); if(!c)return;
    c.innerHTML=`<div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient-bar"></div><span>High</span></div>${RASAAI_DATA.zones.map(z=>`<div class="heatmap-zone" style="background:rgba(0,168,107,${z.cov/150})" data-cov="${z.cov}"><div class="heatmap-zone-info"><strong>${z.name}</strong><span>${z.cov}% | ${z.ricks} ricks</span></div><div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:${z.cov}%"></div></div></div>`).join('')}<div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="RASAAI.updateHeatmap(this.value)"><span id="htTime">12:00</span></div>`;
}

// Build Leaderboard
function buildLeaderboard() {
    const c=$('leaderboardContainer'); if(!c)return;
    const s=[...RASAAI_DATA.zones].sort((a,b)=>parseInt(b.eyes.replace(/,/g,''))-parseInt(a.eyes.replace(/,/g,'')));
    c.innerHTML=s.map((z,i)=>`<div class="lb-row"><div class="lb-rank">#${i+1}</div><div class="lb-info"><div class="lb-name">${z.name}</div><div class="lb-bar-track"><div class="lb-bar-fill" style="width:${(parseInt(z.eyes.replace(/,/g,''))/parseInt(s[0].eyes.replace(/,/g,'')))*100}%"></div></div><div class="lb-value">👁️ ${z.eyes}/day | 🛺 ${z.ricks} rickshaws</div></div></div>`).join('');
}

// Build Affiliate
function buildAffiliate() {
    const c=$('affiliateContainer'); if(!c)return;
    c.innerHTML=`<div class="affiliate-card"><h3>💰 Earn 10% Commission</h3><p style="color:var(--gray-600);margin:12px 0">Refer a business and earn 10% of their campaign budget</p><div class="affiliate-slider"><label style="font-weight:600;display:block;margin-bottom:8px">Campaign Budget</label><input type="range" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.updateAffiliate(this.value)"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-500);margin-top:4px"><span>₹5K</span><span>₹5L</span></div></div><div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div><div class="affiliate-tiers"><div class="tier-card"><div class="tier-val">₹25,000</div><div style="font-size:11px;color:var(--gray-500)">5 Referrals</div></div><div class="tier-card"><div class="tier-val">₹50,000</div><div style="font-size:11px;color:var(--gray-500)">10 Referrals</div></div><div class="tier-card"><div class="tier-val">₹1,00,000</div><div style="font-size:11px;color:var(--gray-500)">20 Referrals</div></div></div><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Start Referring</button></div>`;
}

// Build Contest
function buildContest() {
    const c=$('contestContainer'); if(!c)return;
    c.innerHTML=`<div class="contest-card"><div style="font-size:48px">🏆</div><h3>Run a Hashtag Contest</h3><div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div><div class="form-group"><label>Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash"></div><div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div><button onclick="RASAAI.launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button></div>`;
}

// Build Hashtag
function buildHashtag() {
    const c=$('hashtagContainer'); if(!c)return;
    c.innerHTML=`<div style="text-align:center;background:var(--white);border-radius:var(--radius-2xl);padding:32px;box-shadow:var(--shadow-md)"><div style="font-size:48px">📱</div><h3>Live Hashtag Tracking</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0"><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--orange)" id="htMentions">247</div><div style="font-size:11px;color:var(--gray-500)">Mentions</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--purple)">1.2K</div><div style="font-size:11px;color:var(--gray-500)">Engagement</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--green)">89%</div><div style="font-size:11px;color:var(--gray-500)">Positive</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--navy)">₹0.42</div><div style="font-size:11px;color:var(--gray-500)">Cost/Eng.</div></div></div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">📷 IG: 142</span><span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">👍 FB: 68</span><span style="padding:6px 12px;background:var(--gray-100);border-radius:var(--radius-pill);font-size:11px">🐦 TW: 37</span></div></div>`;
}

// Build FAQ
function buildFAQ() {
    const c=$('faqContainer'); if(!c)return;
    c.innerHTML=RASAAI_DATA.faq.map(item=>`<div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('active')"><span>${item.q}</span><span class="icon">+</span></button><div class="faq-a"><p>${item.a}</p></div></div>`).join('');
}

// Initialize all sections
function initApp() {
    buildTrustLogos();
    buildRoutes();
    buildZoneCards();
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
    setTimeout(()=>{const l=$('loadingScreen');if(l){l.classList.add('hidden');setTimeout(()=>l.remove(),500);}},800);
}

document.addEventListener('DOMContentLoaded', initApp);
