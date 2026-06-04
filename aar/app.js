// RASAAI - Complete Application (No external dependencies)
// All data embedded directly - loads 100% of the time

// ============ ALL DATA EMBEDDED ============
const DATA = {
    admin: {
        phone: "+919594306625",
        whatsapp: "919594306625"
    },
    routes: [
        { id:"route1", name:"Mumbra → Kausa → MM Valley Road", stops:["Mumbra","Kausa","MM Valley Road"], rickshawCount:85, dailyEyeViews:125000, coords:[[19.1767,73.0222],[19.1800,73.0300],[19.1850,73.0350]], img:0 },
        { id:"route2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", stops:["Mumbra","Kausa","Kalsekar","Shilphata","Kalyan Phata","Taloja P1","Taloja P2"], rickshawCount:185, dailyEyeViews:315000, coords:[[19.1767,73.0222],[19.1800,73.0300],[19.1750,73.0450],[19.1900,73.0550],[19.1950,73.0650],[19.2000,73.0750],[19.2050,73.0800]], img:1 },
        { id:"route3", name:"Mumbra → Retibunder → Kalwa Naka", stops:["Mumbra","Retibunder","Kalwa Naka"], rickshawCount:50, dailyEyeViews:75000, coords:[[19.1767,73.0222],[19.1700,73.0400],[19.1650,73.0500]], img:2 },
        { id:"route4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", stops:["Mumbra","Retibunder","Check Naka","Majhiwada"], rickshawCount:30, dailyEyeViews:77000, coords:[[19.1767,73.0222],[19.1700,73.0400],[19.1780,73.0480],[19.1820,73.0520]], img:3 }
    ],
    zones: [
        { id:"kausa", name:"Kausa", population:45000, traffic:"85K/day", peak:"8AM-8PM", dailyEyeViews:125000, totalRickshaws:85, available:42, coverage:87, lat:19.1800, lng:73.0300 },
        { id:"mumbra-station", name:"Mumbra Station", population:78000, traffic:"150K/day", peak:"7AM-9PM", dailyEyeViews:220000, totalRickshaws:120, available:8, coverage:92, lat:19.1767, lng:73.0222 },
        { id:"shilphata", name:"Shilphata", population:55000, traffic:"110K/day", peak:"7AM-9PM", dailyEyeViews:155000, totalRickshaws:65, available:25, coverage:78, lat:19.1900, lng:73.0550 },
        { id:"retibunder", name:"Retibunder", population:35000, traffic:"65K/day", peak:"9AM-8PM", dailyEyeViews:75000, totalRickshaws:50, available:30, coverage:72, lat:19.1700, lng:73.0400 },
        { id:"check-naka", name:"Check Naka", population:40000, traffic:"70K/day", peak:"7AM-8PM", dailyEyeViews:77000, totalRickshaws:30, available:20, coverage:65, lat:19.1780, lng:73.0480 },
        { id:"kalwa", name:"Kalwa Naka", population:52000, traffic:"95K/day", peak:"8AM-9PM", dailyEyeViews:130000, totalRickshaws:55, available:18, coverage:74, lat:19.1650, lng:73.0500 },
        { id:"majhiwada", name:"Majhiwada", population:48000, traffic:"80K/day", peak:"8AM-8PM", dailyEyeViews:110000, totalRickshaws:40, available:22, coverage:68, lat:19.1820, lng:73.0520 },
        { id:"taloja1", name:"Taloja Phase 1", population:30000, traffic:"45K/day", peak:"7AM-7PM", dailyEyeViews:60000, totalRickshaws:25, available:15, coverage:55, lat:19.2000, lng:73.0750 },
        { id:"taloja2", name:"Taloja Phase 2", population:28000, traffic:"40K/day", peak:"7AM-7PM", dailyEyeViews:55000, totalRickshaws:22, available:17, coverage:50, lat:19.2050, lng:73.0800 },
        { id:"kalyan-phata", name:"Kalyan Phata", population:42000, traffic:"75K/day", peak:"8AM-9PM", dailyEyeViews:100000, totalRickshaws:45, available:20, coverage:70, lat:19.1950, lng:73.0650 },
        { id:"kalsekar", name:"Kalsekar Bypass", population:38000, traffic:"60K/day", peak:"7AM-8PM", dailyEyeViews:85000, totalRickshaws:35, available:28, coverage:62, lat:19.1750, lng:73.0450 },
        { id:"mm-valley", name:"MM Valley Road", population:32000, traffic:"50K/day", peak:"8AM-8PM", dailyEyeViews:70000, totalRickshaws:28, available:25, coverage:58, lat:19.1850, lng:73.0350 }
    ],
    images: [
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
        "https://www.hanksadvertising.com/cms/uploads/images/auto-rickshaw-advertising-ad.jpg"
    ]
};

function fmt(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); }
function img(i) { return DATA.images[i] || DATA.images[0]; }

// ============ BUILD ALL SECTIONS ============
function initApp() {
    buildTrustLogos();
    buildRoutes();
    buildZones();
    buildRickshawTracks();
    buildEyeCalculator();
    buildNeuroCards();
    buildMetrics();
    buildComparison();
    buildAudioPlayer();
    buildFormatCards();
    buildCampaignBuilder();
    buildPricing();
    buildInventory();
    buildROICalc();
    buildCaseStudies();
    buildIndustries();
    buildTestimonials();
    buildVideos();
    buildHeatmap();
    buildLeaderboard();
    buildAffiliate();
    buildContest();
    buildHashtag();
    buildFAQ();
    buildMap();
    
    setTimeout(function(){
        var l = document.getElementById('loadingScreen');
        if(l){ l.classList.add('hidden'); setTimeout(function(){ l.remove(); }, 500); }
    }, 800);
}

function buildTrustLogos() {
    var t = document.getElementById('trustLogosTrack'); if(!t) return;
    var logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point","🍕 Pizza Corner"];
    t.innerHTML = logos.concat(logos).map(function(l){ return '<span class="trust-logo-item">'+l+'</span>'; }).join('');
}

function buildRoutes() {
    var g = document.getElementById('routesGrid'); if(!g) return;
    g.innerHTML = DATA.routes.map(function(r,i){
        return '<div class="route-card" onclick="document.getElementById(\'zones\').scrollIntoView({behavior:\'smooth\'})">'+
            '<div class="route-card-image" style="background-image:url(\''+img(r.img)+'\')"><div class="route-overlay"></div></div>'+
            '<div class="route-card-body"><h4>🛣️ Route '+(i+1)+'</h4>'+
            '<p style="font-size:13px;color:#495057;margin-bottom:8px">'+r.name+'</p>'+
            '<div class="route-meta"><span>🛺 '+r.rickshawCount+' Rickshaws</span><span>👁️ '+r.dailyEyeViews.toLocaleString('en-IN')+'/Day</span><span>📍 '+r.stops.length+' Stops</span></div>'+
            '<div class="route-zones">'+r.stops.map(function(z){ return '<span class="route-zone-pill" style="background:#FFF8E1">'+z+'</span>'; }).join(' → ')+'</div>'+
            '</div></div>';
    }).join('');
}

function buildZones() {
    var g = document.getElementById('zonesGrid'); if(!g) return;
    g.innerHTML = DATA.zones.map(function(z){
        var stockClass = z.available < 15 ? 'low' : '';
        return '<div class="zone-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})">'+
            '<div class="zone-card-image" style="background-image:url(\''+img(z.id===\'kausa\'?4:z.id===\'mumbra-station\'?5:z.id===\'shilphata\'?6:z.id===\'retibunder\'?7:z.id===\'check-naka\'?8:0)+'\')">'+
            '<span class="zone-availability '+stockClass+'">'+z.available+' Left</span></div>'+
            '<div class="zone-card-body"><h4>📍 '+z.name+'</h4>'+
            '<div class="zone-meta"><span>👥 '+fmt(z.population)+'</span><span>🚶 '+z.traffic+'</span><span>🕐 '+z.peak+'</span></div>'+
            '<div class="zone-stats"><div class="stat"><div class="val">'+z.dailyEyeViews.toLocaleString('en-IN')+'</div><div class="lbl">Impressions</div></div>'+
            '<div class="stat"><div class="val">'+z.available+'/'+z.totalRickshaws+'</div><div class="lbl">Available</div></div>'+
            '<div class="stat"><div class="val">'+z.coverage+'%</div><div class="lbl">Coverage</div></div></div></div></div>';
    }).join('');
}

function buildRickshawTracks() {
    var g = document.getElementById('rickshawTrackGrid'); if(!g) return;
    var h = '';
    for(var i=0; i<6; i++) {
        var z = DATA.zones[i%12];
        var on = Math.random()>0.1, au = Math.random()>0.1?'active':'inactive', le = Math.random()>0.05?'active':'inactive';
        h += '<div class="track-card"><div class="track-header"><div class="track-id"><span class="track-dot '+(on?'online':'offline')+'"></span>RKS-'+String(i+1).padStart(3,'0')+'</div><span>🔋 '+(Math.floor(Math.random()*40)+60)+'%</span></div>'+
            '<div style="font-weight:600">📍 '+z.name+'</div><div class="track-route">🛣️ Active Route</div>'+
            '<div class="track-metrics"><span>👁️ '+fmt(Math.floor(Math.random()*7000)+8000)+' views</span><span>📊 '+fmt(Math.floor(Math.random()*5000)+6000)+' exp</span></div>'+
            '<div style="display:flex;gap:6px;margin-top:8px"><span class="track-badge '+au+'">🔊 '+au+'</span><span class="track-badge '+le+'">💡 '+le+'</span></div>'+
            (Math.random()>0.3?'<div style="padding:6px 10px;background:#E6F7F0;border-radius:8px;font-size:11px;color:#00A86B;margin-top:8px">Active Campaign</div>':'<div style="padding:6px 10px;background:#F8F9FA;border-radius:8px;font-size:11px;color:#ADB5BD;margin-top:8px">Available</div>')+'</div>';
    }
    g.innerHTML = h;
}

function buildEyeCalculator() {
    var c = document.getElementById('eyeCalculator'); if(!c) return;
    c.innerHTML = '<h3>👁️ Estimate Your Eye Views</h3><div class="calc-inputs">'+
        '<div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="RASAAI.updateEyeCalc()"><option value="">All Zones</option>'+DATA.zones.map(function(z){return '<option value="'+z.id+'">'+z.name+'</option>';}).join('')+'</select></div>'+
        '<div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="document.getElementById(\'ecRicksVal\').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700">10</span></div>'+
        '<div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="document.getElementById(\'ecDaysVal\').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700">30</span></div></div>'+
        '<div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div>'+
        '<div class="calc-result-item"><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div>'+
        '<div class="calc-result-item"><div class="calc-result-value" id="ecCost">₹45,000</div><div class="calc-result-label">Est. Cost</div></div>'+
        '<div class="calc-result-item"><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM</div></div></div>';
}

function buildNeuroCards() {
    var g = document.getElementById('neuroGrid'); if(!g) return;
    var cards = [{icon:"👁️",title:"Motion Bias",stat:"400%",label:"More Attention",back:"Human visual cortex detects movement automatically. Moving rickshaw ads command 400% more attention than static billboards."},{icon:"⚡",title:"Pattern Interruption",stat:"3x",label:"Memory Encoding",back:"New ad breaks expected patterns, triggering norepinephrine release and encoding into memory."},{icon:"🔄",title:"Spaced Repetition",stat:"3x",label:"Consolidation",back:"Same ad on different rickshaws across days = 3x memory consolidation via spacing effect."},{icon:"🧠",title:"Visual Recall",stat:"65%",label:"Recall Rate",back:"65% of visual info recalled after 3 days vs 10% text. Transit ads use dual encoding."},{icon:"📍",title:"Location Familiarity",stat:"73%",label:"Trust Increase",back:"Ads in familiar locations feel trustworthy. Mere-exposure effect builds community connection."},{icon:"👥",title:"Social Proof",stat:"5x",label:"Word-of-Mouth",back:"Thousands seeing same ad = implicit social proof. Drives word-of-mouth and credibility."},{icon:"🔊",title:"Dual-Channel",stat:"85%",label:"Higher Recall",back:"Audio + Visual = two memory pathways. 85% higher recall than visual-only transit ads."},{icon:"🏘️",title:"Community",stat:"73%",label:"Prefer Local",back:"73% prefer brands that feel local. Transit ads create neighborhood ownership and trust."}];
    g.innerHTML = cards.map(function(c){return '<div class="neuro-card"><div class="neuro-inner"><div class="neuro-front"><span class="neuro-icon">'+c.icon+'</span><h4>'+c.title+'</h4><div class="neuro-stat">'+c.stat+'</div><span class="neuro-stat-label">'+c.label+'</span></div><div class="neuro-back"><p>'+c.back+'</p></div></div></div>';}).join('');
}

function buildMetrics() {
    var g = document.getElementById('metricsGrid'), d = document.getElementById('metricsDetail');
    if(!g||!d) return;
    g.innerHTML = '<div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><span class="metrics-badge">Proprietary</span></div><div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div></div><div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div></div>';
    d.innerHTML = '<div class="metric-detail"><div class="label">CPM</div><div class="value">₹4.50</div></div><div class="metric-detail"><div class="label">Recall</div><div class="value">68%</div></div><div class="metric-detail"><div class="label">Attention</div><div class="value">4.2s</div></div><div class="metric-detail"><div class="label" style="color:#00A86B">Skip Rate</div><div class="value" style="color:#00A86B">0%</div></div>';
}

function buildComparison() {
    var t = document.getElementById('comparisonTabs'); if(!t) return;
    t.innerHTML = '<button class="comp-tab active" onclick="RASAAI.showComparison(\'instagram\',this)">📱 vs Instagram</button><button class="comp-tab" onclick="RASAAI.showComparison(\'facebook\',this)">👍 vs Facebook</button><button class="comp-tab" onclick="RASAAI.showComparison(\'youtube\',this)">▶️ vs YouTube</button>';
}

function buildAudioPlayer() {
    var c = document.getElementById('audioPlayer'); if(!c) return;
    c.innerHTML = [{icon:"🍽️",title:"Restaurant Ad",type:"restaurant"},{icon:"🏥",title:"Clinic Ad",type:"clinic"},{icon:"🏫",title:"Education Ad",type:"education"}].map(function(s){return '<div class="audio-card" onclick="RASAAI.playAudio(\''+s.type+'\')"><div class="audio-icon">'+s.icon+'</div><h4>'+s.title+'</h4><div class="audio-wave">'+'<div class="bar"></div>'.repeat(8)+'</div><button class="btn btn-primary btn-sm">▶️ Play</button></div>';}).join('');
}

function buildFormatCards() {
    var g = document.getElementById('formatCards'); if(!g) return;
    var f = [{icon:"💡",name:"LED Display",desc:"Bright LED screen. Day & night.",feat:["Full-color","Weatherproof","GPS tracked"],price:"₹1,238-1,647/day",rec:false},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers.",feat:["Pro voice-over","Multi-language","60-sec ads"],price:"₹318-639/day",rec:false},{icon:"⚡",name:"LED + Audio Combo",desc:"85% higher recall.",feat:["Visual+Audio sync","Maximum attention","Best ROI"],price:"₹1,795-2,388/day",rec:true}];
    g.innerHTML = f.map(function(f){return '<div class="format-card '+(f.rec?'recommended':'')+'">'+(f.rec?'<span class="recommended-badge">⭐ Recommended</span>':'')+'<div class="format-icon">'+f.icon+'</div><h4>'+f.name+'</h4><p>'+f.desc+'</p><ul class="format-features">'+f.feat.map(function(ft){return '<li>'+ft+'</li>';}).join('')+'</ul><div class="format-price">'+f.price+'</div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block btn-sm" style="margin-top:12px">Choose</button></div>';}).join('');
}

function buildCampaignBuilder() {
    var c = document.getElementById('bookingCard'); if(!c) return;
    c.innerHTML = '<h3>📋 Build Your Campaign</h3><p style="color:#6C757D;font-size:13px;margin-bottom:24px">Book instantly via WhatsApp. We\'ll call back in 5 minutes.</p>'+
        '<div class="form-row"><div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>'+
        '<div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="RASAAI.updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo</option></select></div></div>'+
        '<div class="form-row"><div class="form-group"><label>Route</label><select id="cbRoute" onchange="RASAAI.updateBookingEstimate()">'+DATA.routes.map(function(r){return '<option value="'+r.id+'">'+r.name+'</option>';}).join('')+'</select></div>'+
        '<div class="form-group"><label>Rickshaws</label><select id="cbRicks" onchange="RASAAI.updateBookingEstimate()"><option value="1">1</option><option value="5">5</option><option value="10">10 (10% off)</option><option value="20">20 (10% off)</option></select></div></div>'+
        '<div class="form-row"><div class="form-group"><label>Duration</label><select id="cbDuration" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div>'+
        '<div class="form-group"><label>Your Phone *</label><input type="tel" id="cbPhone" required placeholder="+91"></div></div>'+
        '<div class="price-summary" id="priceSummary"></div>'+
        '<div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap"><button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="RASAAI.bookViaWhatsApp()">💬 Book via WhatsApp</button><a href="tel:+919594306625" class="btn btn-primary btn-lg" style="flex:1">📞 Call Now</a></div>';
}

function buildPricing() {
    var g = document.getElementById('pricingGrid'); if(!g) return;
    var p = 1400, a = 420, co = 2030;
    g.innerHTML = '<div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹'+p.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>LED Screen</li><li>GPS Tracked</li><li>Real Analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'});document.getElementById(\'cbType\').value=\'led\';RASAAI.updateBookingEstimate()" class="btn btn-primary btn-block">Get LED</button></div>'+
    '<div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹'+a.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>Bluetooth Speaker</li><li>60-sec Ads</li><li>Zone Targeting</li><li>10% off 10+</li><li>💰 Most Affordable</li></ul><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'});document.getElementById(\'cbType\').value=\'audio\';RASAAI.updateBookingEstimate()" class="btn btn-primary btn-block">Get Audio</button></div>'+
    '<div class="pricing-card"><h4>🔥 Combo</h4><div class="price">₹'+co.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>LED + Audio</li><li>Max Visibility</li><li>Full Analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'});document.getElementById(\'cbType\').value=\'combo\';RASAAI.updateBookingEstimate()" class="btn btn-primary btn-block">Get Combo</button></div>';
}

function buildInventory() {
    var g = document.getElementById('inventoryGrid'); if(!g) return;
    g.innerHTML = DATA.zones.slice(0,8).map(function(z){
        var s = z.available<10?'critical':z.available<20?'low':'good';
        var m = {critical:'⚠️ Almost gone!',low:'⚡ Selling fast',good:'✅ Available'};
        return '<div class="inventory-card"><h4>📍 '+z.name+'</h4><div class="inventory-stock '+s+'"><span class="number">'+z.available+'</span><span class="label">left</span></div><div class="inventory-bar"><div class="inventory-bar-fill" style="width:'+z.coverage+'%"></div></div><span class="inventory-status '+s+'">'+m[s]+'</span></div>';
    }).join('');
}

function buildROICalc() {
    var c = document.getElementById('roiCalc'); if(!c) return;
    c.innerHTML = '<h3>🧮 ROI Calculator</h3><div class="calc-inputs"><div class="calc-input-row"><label>Business</label><select id="roiBiz" onchange="RASAAI.updateROICalc()"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option></select></div><div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="RASAAI.updateROICalc()">'+DATA.zones.map(function(z){return '<option value="'+z.id+'">'+z.name+'</option>';}).join('')+'</select></div><div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="document.getElementById(\'roiBudgetVal\').textContent=\'₹\'+parseInt(this.value).toLocaleString(\'en-IN\');RASAAI.updateROICalc()"><span id="roiBudgetVal" style="font-weight:700">₹50,000</span></div></div><div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Eye Views</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall ↑</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">New Customers</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">ROI</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiBE">--</div><div class="calc-result-label">Break-even</div></div></div>';
}

function buildCaseStudies() {
    var g = document.getElementById('caseStudiesGrid'); if(!g) return;
    var cs = [{biz:"Spice Garden",type:"Restaurant",zone:"Kausa",d:"30d",b:"₹15K",r1:"45%",l1:"Footfall",r2:"467%",l2:"ROI",r3:"72%",l3:"Recall",q:"Dinner crowd doubled in 2 weeks!",o:"Ahmed Siddiqui"},{biz:"Mumbra Dental",type:"Clinic",zone:"Station",d:"45d",b:"₹22K",r1:"38%",l1:"Patients",r2:"445%",l2:"ROI",r3:"68%",l3:"Recall",q:"Audio ads near station incredibly effective.",o:"Dr. Fatima Khan"},{biz:"Shilphata Ind.",type:"B2B",zone:"Shilphata",d:"60d",b:"₹35K",r1:"55%",l1:"Inquiries",r2:"900%",l2:"ROI",r3:"64%",l3:"Recall",q:"Reached managers who don't use social media.",o:"Rajesh Patil"}];
    g.innerHTML = cs.map(function(c){return '<div class="case-card"><div class="case-header"><span style="font-weight:700;color:#FF5A00">Case Study</span><span class="case-tag">'+c.type+'</span></div><h3>'+c.biz+'</h3><div style="display:flex;gap:12px;margin:8px 0;font-size:12px;color:#6C757D"><span>📍 '+c.zone+'</span><span>⏱️ '+c.d+'</span><span>💰 '+c.b+'</span></div><div class="case-results"><div class="case-result"><div class="val">'+c.r1+'</div><div class="lbl">'+c.l1+'</div></div><div class="case-result"><div class="val">'+c.r2+'</div><div class="lbl">'+c.l2+'</div></div><div class="case-result"><div class="val">'+c.r3+'</div><div class="lbl">'+c.l3+'</div></div></div><blockquote class="case-quote">"'+c.q+'"<cite>— '+c.o+'</cite></blockquote></div>';}).join('');
}

function buildIndustries() {
    var g = document.getElementById('industryCards'); if(!g) return;
    var inds = [{icon:"🏪",name:"Retail",desc:"Drive footfall"},{icon:"🍽️",name:"Restaurant",desc:"Hungry commuters"},{icon:"🏥",name:"Clinic",desc:"Build patient trust"},{icon:"💊",name:"Pharmacy",desc:"First name recalled"},{icon:"🏫",name:"School",desc:"Reach parents"},{icon:"📚",name:"Coaching",desc:"Students daily"},{icon:"🏠",name:"Real Estate",desc:"Neighborhood ads"},{icon:"💪",name:"Gym",desc:"Commute routes"},{icon:"💇",name:"Salon",desc:"Visible daily"},{icon:"📱",name:"Electronics",desc:"Gadget lovers"},{icon:"💍",name:"Jewelry",desc:"Wedding season"},{icon:"🏦",name:"Bank",desc:"Financial trust"},{icon:"🛡️",name:"Insurance",desc:"Seen = trusted"},{icon:"🚗",name:"Auto",desc:"Commuters audience"},{icon:"🔧",name:"Hardware",desc:"Found when needed"},{icon:"🪑",name:"Furniture",desc:"Home dreams"},{icon:"🎉",name:"Events",desc:"Big day booked"},{icon:"✈️",name:"Travel",desc:"Vacation triggers"},{icon:"🍲",name:"Catering",desc:"Party orders"},{icon:"🦷",name:"Dentist",desc:"Toothache recall"}];
    g.innerHTML = inds.map(function(i){return '<div class="industry-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})"><div class="icon">'+i.icon+'</div><h4>'+i.name+'</h4><p>'+i.desc+'</p></div>';}).join('');
}

function buildTestimonials() {
    var s = document.getElementById('testimonialSlider'); if(!s) return;
    var ts = [{name:"Ahmed Shaikh",biz:"Mumbra Pizza",zone:"Station",text:"Walk-ins 65% up! Best investment.",r:5,init:"AS"},{name:"Dr. Fatima",biz:"Shifa Clinic",zone:"Kausa",text:"120 new patients in 6 months.",r:5,init:"FK"},{name:"Mohammed Ali",biz:"Al-Huda Tuition",zone:"Shilphata",text:"45 new students enrolled.",r:5,init:"MA"},{name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Visibility doubled.",r:5,init:"RS"},{name:"Priya Patel",biz:"Fashion Hub",zone:"Station",text:"40% sales increase.",r:5,init:"PP"},{name:"Vikram Singh",biz:"AutoCare",zone:"Check Naka",text:"Reached offline audience.",r:5,init:"VS"},{name:"Sneha Gupta",biz:"Sweet Bengal",zone:"Kausa",text:"Became area famous.",r:5,init:"SG"},{name:"Deepa Shah",biz:"Wellness Yoga",zone:"Shilphata",text:"50+ new members.",r:5,init:"DS"},{name:"Rajesh Patil",biz:"Shilphata Ind.",zone:"Shilphata",text:"B2B unmatched.",r:5,init:"RP"},{name:"Kavita Reddy",biz:"Spice Garden",zone:"Kausa",text:"Crowd doubled.",r:5,init:"KR"}];
    s.innerHTML = '<div class="testimonial-track" id="testTrack">'+ts.map(function(t){return '<div class="testimonial-card"><div class="stars">'+'⭐'.repeat(t.r)+'</div><p class="quote">"'+t.text+'"</p><div class="author"><div class="avatar">'+t.init+'</div><div><strong>'+t.name+'</strong><p style="font-size:11px;color:#6C757D">'+t.biz+', '+t.zone+'</p></div></div></div>';}).join('')+'</div><div class="slider-nav"><button onclick="document.getElementById(\'testTrack\').scrollBy({left:-340,behavior:\'smooth\'})">←</button><button onclick="document.getElementById(\'testTrack\').scrollBy({left:340,behavior:\'smooth\'})">→</button></div>';
}

function buildVideos() {
    var g = document.getElementById('videoGrid'); if(!g) return;
    g.innerHTML = [{t:"Rickshaw LED Ad",img:6},{t:"Campaign Success",img:7},{t:"Audio Ad Demo",img:8},{t:"Coverage Map",img:9}].map(function(v){return '<div class="video-card" onclick="RASAAI.openVideo(\'dQw4w9WgXcQ\')"><div class="video-thumb" style="background-image:url(\''+img(v.img)+'\')"><div class="play-btn">▶️</div></div><div class="video-body"><h4>'+v.t+'</h4></div></div>';}).join('');
}

function buildHeatmap() {
    var c = document.getElementById('heatmapContainer'); if(!c) return;
    c.innerHTML = '<div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient-bar"></div><span>High</span></div>'+DATA.zones.map(function(z){return '<div class="heatmap-zone" style="background:rgba(0,168,107,'+(z.coverage/150)+')" data-cov="'+z.coverage+'"><div class="heatmap-zone-info"><strong>'+z.name+'</strong><span>'+z.coverage+'% | '+z.totalRickshaws+' ricks</span></div><div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:'+z.coverage+'%"></div></div></div>';}).join('')+'<div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="RASAAI.updateHeatmap(this.value)"><span id="htTime">12:00</span></div>';
}

function buildLeaderboard() {
    var c = document.getElementById('leaderboardContainer'); if(!c) return;
    var s = DATA.zones.slice().sort(function(a,b){return b.dailyEyeViews-a.dailyEyeViews;});
    c.innerHTML = s.map(function(z,i){return '<div class="lb-row"><div class="lb-rank">#'+(i+1)+'</div><div class="lb-info"><div class="lb-name">'+z.name+'</div><div class="lb-bar-track"><div class="lb-bar-fill" style="width:'+((z.dailyEyeViews/s[0].dailyEyeViews)*100)+'%"></div></div><div class="lb-value">👁️ '+z.dailyEyeViews.toLocaleString('en-IN')+'/day | 🛺 '+z.totalRickshaws+' ricks</div></div></div>';}).join('');
}

function buildAffiliate() {
    var c = document.getElementById('affiliateContainer'); if(!c) return;
    c.innerHTML = '<div class="affiliate-card"><h3>💰 Earn 10% Commission</h3><p style="color:#6C757D;margin:12px 0">Refer a business and earn 10% of their campaign</p><div class="affiliate-slider"><label style="font-weight:600">Campaign Budget</label><input type="range" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.updateAffiliate(this.value)"><div style="display:flex;justify-content:space-between;font-size:11px;color:#ADB5BD;margin-top:4px"><span>₹5K</span><span>₹5L</span></div></div><div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div><div class="affiliate-tiers"><div class="tier-card"><div class="tier-val">₹25K</div><div>5 Refs</div></div><div class="tier-card"><div class="tier-val">₹50K</div><div>10 Refs</div></div><div class="tier-card"><div class="tier-val">₹1L</div><div>20 Refs</div></div></div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block">Start Referring</button></div>';
}

function buildContest() {
    var c = document.getElementById('contestContainer'); if(!c) return;
    c.innerHTML = '<div class="contest-card"><div style="font-size:48px">🏆</div><h3>Run a Hashtag Contest</h3><div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div><div class="form-group"><label>Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash"></div><div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div><button onclick="RASAAI.launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button></div>';
}

function buildHashtag() {
    var c = document.getElementById('hashtagContainer'); if(!c) return;
    c.innerHTML = '<div style="text-align:center;background:white;border-radius:24px;padding:32px;box-shadow:0 4px 16px rgba(0,0,0,0.1)"><div style="font-size:48px">📱</div><h3>Live Tracking</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0"><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#FF5A00" id="htMentions">247</div><div style="font-size:11px;color:#ADB5BD">Mentions</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#7C4DFF">1.2K</div><div style="font-size:11px;color:#ADB5BD">Engagement</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#00A86B">89%</div><div style="font-size:11px;color:#ADB5BD">Positive</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#221F60">₹0.42</div><div style="font-size:11px;color:#ADB5BD">Cost/Eng.</div></div></div></div>';
}

function buildFAQ() {
    var c = document.getElementById('faqContainer'); if(!c) return;
    var faq = [{q:"How are Eye Views different?",a:"Eye Views track verified human visual contact. Average 11,500 per rickshaw daily."},{q:"What routes do you cover?",a:"4 routes across Mumbra: Kausa, Shilphata, Retibunder, Check Naka, Kalwa, Majhiwada, Taloja, Kalyan Phata, Kalsekar, MM Valley."},{q:"How does pricing work?",a:"₹1,238-1,647/day per rickshaw. Changes every 15 min. 10% off on 10+ rickshaws."},{q:"What formats?",a:"LED Display, Audio Announcement, LED+Audio Combo. Free 30 social media creatives with LED/Combo."},{q:"How to track?",a:"Real-time dashboard with Eye Views, Impressions, GPS routes, daily reports."},{q:"How fast to launch?",a:"48-72 hours. We handle everything. Call +91 95943 06625."}];
    c.innerHTML = faq.map(function(item){return '<div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle(\'active\')"><span>'+item.q+'</span><span class="icon">+</span></button><div class="faq-a"><p>'+item.a+'</p></div></div>';}).join('');
}

function buildMap() {
    var container = document.getElementById('coverageMap');
    if(!container || typeof L === 'undefined') return;
    var map = L.map('coverageMap').setView([19.1850, 73.0400], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {maxZoom:18}).addTo(map);
    var colors = ['#2196F3','#4CAF50','#F44336','#FF9800'];
    DATA.routes.forEach(function(r,i){
        if(r.coords && r.coords.length > 1) {
            L.polyline(r.coords, {color:colors[i], weight:3, opacity:0.7}).addTo(map).bindPopup('<b>'+r.name+'</b><br>🛺 '+r.rickshawCount+' rickshaws');
        }
    });
    DATA.zones.forEach(function(z){
        var color = z.available < 15 ? '#E74C3C' : z.coverage > 80 ? '#00A86B' : '#FFB800';
        L.circleMarker([z.lat, z.lng], {radius:Math.sqrt(z.totalRickshaws)*1.2, fillColor:color, color:'#fff', weight:2, fillOpacity:0.8}).addTo(map).bindPopup('<b>'+z.name+'</b><br>🛺 '+z.totalRickshaws+' rickshaws<br>👁️ '+z.dailyEyeViews.toLocaleString('en-IN')+'/day');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});
