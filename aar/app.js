// ============================================
// RASAAI - Complete Application
// All Data + Build + WhatsApp + Dashboard
// No External Dependencies
// ============================================

const RASAAI = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    currentPrice: 1400,

    // ============ ALL DATA ============
    routes: [
        { id:"r1", name:"Mumbra → Kausa → MM Valley Road", stops:["Mumbra","Kausa","MM Valley Road"], ricks:85, eyes:125000, coords:[[19.1767,73.0222],[19.1800,73.0300],[19.1850,73.0350]], img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg" },
        { id:"r2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", stops:["Mumbra","Kausa","Kalsekar","Shilphata","Kalyan Phata","Taloja P1","Taloja P2"], ricks:185, eyes:315000, coords:[[19.1767,73.0222],[19.1800,73.0300],[19.1750,73.0450],[19.1900,73.0550],[19.1950,73.0650],[19.2000,73.0750],[19.2050,73.0800]], img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg" },
        { id:"r3", name:"Mumbra → Retibunder → Kalwa Naka", stops:["Mumbra","Retibunder","Kalwa Naka"], ricks:50, eyes:75000, coords:[[19.1767,73.0222],[19.1700,73.0400],[19.1650,73.0500]], img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg" },
        { id:"r4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", stops:["Mumbra","Retibunder","Check Naka","Majhiwada"], ricks:30, eyes:77000, coords:[[19.1767,73.0222],[19.1700,73.0400],[19.1780,73.0480],[19.1820,73.0520]], img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/16.jpg" }
    ],
    zones: [
        { id:"kausa", name:"Kausa", pop:45000, traffic:"85K/day", peak:"8AM-8PM", eyes:125000, ricks:85, avail:42, cov:87, lat:19.1800, lng:73.0300, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/13.jpg" },
        { id:"mumbra", name:"Mumbra Station", pop:78000, traffic:"150K/day", peak:"7AM-9PM", eyes:220000, ricks:120, avail:8, cov:92, lat:19.1767, lng:73.0222, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/8.jpg" },
        { id:"shilphata", name:"Shilphata", pop:55000, traffic:"110K/day", peak:"7AM-9PM", eyes:155000, ricks:65, avail:25, cov:78, lat:19.1900, lng:73.0550, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/7.jpg" },
        { id:"retibunder", name:"Retibunder", pop:35000, traffic:"65K/day", peak:"9AM-8PM", eyes:75000, ricks:50, avail:30, cov:72, lat:19.1700, lng:73.0400, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/6.jpg" },
        { id:"checknaka", name:"Check Naka", pop:40000, traffic:"70K/day", peak:"7AM-8PM", eyes:77000, ricks:30, avail:20, cov:65, lat:19.1780, lng:73.0480, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/5.jpg" },
        { id:"kalwa", name:"Kalwa Naka", pop:52000, traffic:"95K/day", peak:"8AM-9PM", eyes:130000, ricks:55, avail:18, cov:74, lat:19.1650, lng:73.0500, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/2.jpg" },
        { id:"majhiwada", name:"Majhiwada", pop:48000, traffic:"80K/day", peak:"8AM-8PM", eyes:110000, ricks:40, avail:22, cov:68, lat:19.1820, lng:73.0520, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/1.jpg" },
        { id:"taloja1", name:"Taloja Phase 1", pop:30000, traffic:"45K/day", peak:"7AM-7PM", eyes:60000, ricks:25, avail:15, cov:55, lat:19.2000, lng:73.0750, img:"https://www.hanksadvertising.com/cms/uploads/images/auto-rickshaw-advertising-ad.jpg" },
        { id:"taloja2", name:"Taloja Phase 2", pop:28000, traffic:"40K/day", peak:"7AM-7PM", eyes:55000, ricks:22, avail:17, cov:50, lat:19.2050, lng:73.0800, img:"https://www.hanksadvertising.com/cms/uploads/images/auto-ads-delhi.jpg" },
        { id:"kalyan", name:"Kalyan Phata", pop:42000, traffic:"75K/day", peak:"8AM-9PM", eyes:100000, ricks:45, avail:20, cov:70, lat:19.1950, lng:73.0650, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg" },
        { id:"kalsekar", name:"Kalsekar Bypass", pop:38000, traffic:"60K/day", peak:"7AM-8PM", eyes:85000, ricks:35, avail:28, cov:62, lat:19.1750, lng:73.0450, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg" },
        { id:"mmvalley", name:"MM Valley Road", pop:32000, traffic:"50K/day", peak:"8AM-8PM", eyes:70000, ricks:28, avail:25, cov:58, lat:19.1850, lng:73.0350, img:"https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg" }
    ],

    // ============ HELPERS ============
    fmt: function(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); },
    $: function(id) { return document.getElementById(id); },

    // ============ BUILD ALL SECTIONS ============
    init: function() {
        this.buildTrustLogos();
        this.buildRoutes();
        this.buildZones();
        this.buildRickshawTracks();
        this.buildEyeCalculator();
        this.buildNeuroCards();
        this.buildMetrics();
        this.buildComparison();
        this.buildAudioPlayer();
        this.buildFormatCards();
        this.buildCampaignBuilder();
        this.buildPricing();
        this.buildInventory();
        this.buildROICalc();
        this.buildCaseStudies();
        this.buildIndustries();
        this.buildTestimonials();
        this.buildVideos();
        this.buildHeatmap();
        this.buildLeaderboard();
        this.buildAffiliate();
        this.buildContest();
        this.buildHashtag();
        this.buildFAQ();
        this.buildMap();
        this.startTimers();
        this.startLiveUpdates();
        this.startNotifications();
        this.startCounters();
        this.setupExitIntent();
        this.setupMobileNav();
        this.updateAllPrices();
        setTimeout(() => { const l = this.$('loadingScreen'); if(l) { l.classList.add('hidden'); setTimeout(() => l.remove(), 500); } }, 800);
    },

    buildTrustLogos: function() {
        const t = this.$('trustLogosTrack'); if(!t) return;
        const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point"];
        t.innerHTML = [...logos,...logos].map(l => '<span class="trust-logo-item">'+l+'</span>').join('');
    },

    buildRoutes: function() {
        const g = this.$('routesGrid'); if(!g) return;
        const self = this;
        g.innerHTML = this.routes.map(function(r,i) {
            return '<div class="route-card" onclick="document.getElementById(\'zones\').scrollIntoView({behavior:\'smooth\'})">'+
                '<div class="route-card-image" style="background-image:url(\''+r.img+'\')"><div class="route-overlay"></div></div>'+
                '<div class="route-card-body"><h4>🛣️ Route '+(i+1)+'</h4>'+
                '<p style="font-size:13px;color:#495057;margin-bottom:8px">'+r.name+'</p>'+
                '<div class="route-meta"><span>🛺 '+r.ricks+' Rickshaws</span><span>👁️ '+self.fmt(r.eyes)+'/Day</span><span>📍 '+r.stops.length+' Stops</span></div>'+
                '<div class="route-zones">'+r.stops.map(function(z){ return '<span class="route-zone-pill" style="background:#FFF8E1">'+z+'</span>'; }).join(' → ')+'</div>'+
                '</div></div>';
        }).join('');
    },

    buildZones: function() {
        const g = this.$('zonesGrid'); if(!g) return;
        const self = this;
        g.innerHTML = this.zones.map(function(z) {
            var sc = z.avail < 15 ? 'low' : '';
            return '<div class="zone-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})">'+
                '<div class="zone-card-image" style="background-image:url(\''+z.img+'\')"><span class="zone-availability '+sc+'">'+z.avail+' Left</span></div>'+
                '<div class="zone-card-body"><h4>📍 '+z.name+'</h4>'+
                '<div class="zone-meta"><span>👥 '+self.fmt(z.pop)+'</span><span>🚶 '+z.traffic+'</span><span>🕐 '+z.peak+'</span></div>'+
                '<div class="zone-stats"><div class="stat"><div class="val">'+self.fmt(z.eyes)+'</div><div class="lbl">Impressions</div></div>'+
                '<div class="stat"><div class="val">'+z.avail+'/'+z.ricks+'</div><div class="lbl">Available</div></div>'+
                '<div class="stat"><div class="val">'+z.cov+'%</div><div class="lbl">Coverage</div></div></div></div></div>';
        }).join('');
    },

    buildRickshawTracks: function() {
        const g = this.$('rickshawTrackGrid'); if(!g) return;
        var h = '', self = this;
        for(var i=0; i<6; i++) {
            var z = this.zones[i%12], on = Math.random()>0.1, au = Math.random()>0.1?'active':'inactive', le = Math.random()>0.05?'active':'inactive';
            h += '<div class="track-card"><div class="track-header"><div class="track-id"><span class="track-dot '+(on?'online':'offline')+'"></span>RKS-'+String(i+1).padStart(3,'0')+'</div><span>🔋 '+(Math.floor(Math.random()*40)+60)+'%</span></div>'+
                '<div style="font-weight:600">📍 '+z.name+'</div><div class="track-route">🛣️ Active Route</div>'+
                '<div class="track-metrics"><span>👁️ '+self.fmt(Math.floor(Math.random()*7000)+8000)+' views</span></div>'+
                '<div style="display:flex;gap:6px;margin-top:8px"><span class="track-badge '+au+'">🔊 '+au+'</span><span class="track-badge '+le+'">💡 '+le+'</span></div>'+
                (Math.random()>0.3?'<div style="padding:6px 10px;background:#E6F7F0;border-radius:8px;font-size:11px;color:#00A86B;margin-top:8px">Active Campaign</div>':'<div style="padding:6px 10px;background:#F8F9FA;border-radius:8px;font-size:11px;color:#ADB5BD;margin-top:8px">Available</div>')+'</div>';
        }
        g.innerHTML = h;
    },

    buildEyeCalculator: function() {
        var c = this.$('eyeCalculator'); if(!c) return;
        var self = this;
        c.innerHTML = '<h3>👁️ Eye View Calculator</h3><div class="calc-inputs">'+
            '<div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="RASAAI.updateEyeCalc()"><option value="">All Zones</option>'+this.zones.map(function(z){return '<option value="'+z.id+'">'+z.name+'</option>';}).join('')+'</select></div>'+
            '<div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="RASAAI.$(\'ecRicksVal\').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700">10</span></div>'+
            '<div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="RASAAI.$(\'ecDaysVal\').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700">30</span></div></div>'+
            '<div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div>'+
            '<div class="calc-result-item"><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div>'+
            '<div class="calc-result-item"><div class="calc-result-value" id="ecCost">₹42,000</div><div class="calc-result-label">Est. Cost</div></div>'+
            '<div class="calc-result-item"><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM</div></div></div>';
    },

    updateEyeCalc: function() {
        var zid = this.$('ecZone')?.value, r = parseInt(this.$('ecRicks')?.value||10), d = parseInt(this.$('ecDays')?.value||30);
        var avg = 11500;
        if(zid) { var z = this.zones.find(function(x){return x.id===zid;}); if(z) avg = z.eyes / z.ricks; }
        var eyes = avg * r * d, cost = this.currentPrice * r * d;
        var set = function(id,v) { var e = RASAAI.$(id); if(e) e.textContent = v; };
        set('ecEyes', this.fmt(eyes)); set('ecReach', this.fmt(Math.floor(eyes*0.74)));
        set('ecCost', '₹'+cost.toLocaleString('en-IN')); set('ecCPM', '₹'+(cost/(eyes/1000)).toFixed(2));
    },

    buildNeuroCards: function() {
        var g = this.$('neuroGrid'); if(!g) return;
        var cards = [{icon:"👁️",title:"Motion Bias",stat:"400%",label:"More Attention",back:"Human visual cortex detects movement automatically. Moving rickshaw ads command 400% more attention than static billboards."},{icon:"⚡",title:"Pattern Interruption",stat:"3x",label:"Memory Encoding",back:"New ad breaks expected patterns, triggering norepinephrine release."},{icon:"🔄",title:"Spaced Repetition",stat:"3x",label:"Consolidation",back:"Same ad on different rickshaws = 3x memory consolidation."},{icon:"🧠",title:"Visual Recall",stat:"65%",label:"Recall Rate",back:"65% visual recall vs 10% text. Dual encoding."},{icon:"📍",title:"Location Familiarity",stat:"73%",label:"Trust Increase",back:"Familiar locations feel trustworthy. Mere-exposure effect."},{icon:"👥",title:"Social Proof",stat:"5x",label:"Word-of-Mouth",back:"Thousands seeing same ad = implicit social proof."},{icon:"🔊",title:"Dual-Channel",stat:"85%",label:"Higher Recall",back:"Audio + Visual = 85% higher recall."},{icon:"🏘️",title:"Community",stat:"73%",label:"Prefer Local",back:"73% prefer brands that feel local."}];
        g.innerHTML = cards.map(function(c){return '<div class="neuro-card"><div class="neuro-inner"><div class="neuro-front"><span class="neuro-icon">'+c.icon+'</span><h4>'+c.title+'</h4><div class="neuro-stat">'+c.stat+'</div><span class="neuro-stat-label">'+c.label+'</span></div><div class="neuro-back"><p>'+c.back+'</p></div></div></div>';}).join('');
    },

    buildMetrics: function() {
        var g = this.$('metricsGrid'), d = this.$('metricsDetail');
        if(!g||!d) return;
        g.innerHTML = '<div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><span class="metrics-badge">Proprietary</span></div><div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div></div><div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div></div>';
        d.innerHTML = '<div class="metric-detail"><div class="label">CPM</div><div class="value">₹4.50</div></div><div class="metric-detail"><div class="label">Recall</div><div class="value">68%</div></div><div class="metric-detail"><div class="label">Attention</div><div class="value">4.2s</div></div><div class="metric-detail"><div class="label" style="color:#00A86B">Skip Rate</div><div class="value" style="color:#00A86B">0%</div></div>';
    },

    buildComparison: function() {
        var t = this.$('comparisonTabs'); if(!t) return;
        t.innerHTML = '<button class="comp-tab active" onclick="RASAAI.showComparison(\'instagram\',this)">📱 Instagram</button><button class="comp-tab" onclick="RASAAI.showComparison(\'facebook\',this)">👍 Facebook</button><button class="comp-tab" onclick="RASAAI.showComparison(\'youtube\',this)">▶️ YouTube</button>';
        this.showComparison('instagram', t.querySelector('.comp-tab'));
    },

    showComparison: function(platform, btn) {
        document.querySelectorAll('.comp-tab').forEach(function(t){t.classList.remove('active');});
        if(btn) btn.classList.add('active');
        var data = {
            instagram: [["Hyperlocal Visibility","✅ Full zone","❌ Limited"],["Physical Presence","✅ Tangible","❌ Digital-only"],["Ad Blocking","✅ Can't block","❌ Blocked"],["Non-Internet","✅ 100% reach","❌ Internet needed"],["Attention","✅ 3-8 sec","❌ <1 sec"],["Recall","✅ 68%","❌ 24%"],["CPM","✅ ₹4.50","❌ ₹35-150"]],
            facebook: [["Local Reach","✅ 100% zone","❌ 15-40%"],["Trust","✅ Physical","❌ Skepticism"],["Multi-sense","✅ Visual+Audio","❌ Visual only"],["Community","✅ Seen locally","❌ No trace"],["Cost/Eyes","✅ ₹4.50","❌ N/A"],["Conversion","✅ Walk-in","❌ Click friction"]],
            youtube: [["Skip Rate","✅ 0%","❌ 65-76%"],["Fatigue","✅ Low","❌ High"],["Attention","✅ 4.2 sec","❌ 2.1 sec"],["Recall","✅ 68%","❌ 18%"],["Physical","✅ Yes","❌ No"],["Local Trust","✅ Community","❌ Global"]]
        };
        var c = this.$('comparisonContent'); if(!c) return;
        c.innerHTML = '<table class="comp-table"><thead><tr><th>Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead><tbody>'+data[platform].map(function(r){return '<tr><td><strong>'+r[0]+'</strong></td><td class="win">'+r[1]+'</td><td class="lose">'+r[2]+'</td></tr>';}).join('')+'</tbody></table>';
    },

    buildAudioPlayer: function() {
        var c = this.$('audioPlayer'); if(!c) return;
        c.innerHTML = [{icon:"🍽️",title:"Restaurant Ad",type:"restaurant"},{icon:"🏥",title:"Clinic Ad",type:"clinic"},{icon:"🏫",title:"Education Ad",type:"education"}].map(function(s){return '<div class="audio-card" onclick="RASAAI.playAudio(\''+s.type+'\')"><div class="audio-icon">'+s.icon+'</div><h4>'+s.title+'</h4><div class="audio-wave">'+'<div class="bar"></div>'.repeat(8)+'</div><button class="btn btn-primary btn-sm">▶️ Play</button></div>';}).join('');
    },

    playAudio: function(type) {
        try { var ctx = new (window.AudioContext||window.webkitAudioContext)(), o=ctx.createOscillator(), g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value={restaurant:520,clinic:440,education:660}[type]||500; g.gain.value=0.15; o.start(); g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+2); o.stop(ctx.currentTime+2); } catch(e) { alert('🔊 Playing beep. Replace with MP3.'); }
    },

    buildFormatCards: function() {
        var g = this.$('formatCards'); if(!g) return;
        var f = [{icon:"💡",name:"LED Display",desc:"Bright LED screen. Day & night.",feat:["Full-color","Weatherproof","GPS tracked"],price:"₹1,238-1,647/day",rec:false},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers.",feat:["Pro voice-over","Multi-language","60-sec ads"],price:"₹318-639/day",rec:false},{icon:"⚡",name:"LED + Audio Combo",desc:"85% higher recall.",feat:["Visual+Audio sync","Maximum attention","Best ROI"],price:"₹1,795-2,388/day",rec:true}];
        g.innerHTML = f.map(function(f){return '<div class="format-card '+(f.rec?'recommended':'')+'">'+(f.rec?'<span class="recommended-badge">⭐ Recommended</span>':'')+'<div class="format-icon">'+f.icon+'</div><h4>'+f.name+'</h4><p>'+f.desc+'</p><ul class="format-features">'+f.feat.map(function(ft){return '<li>'+ft+'</li>';}).join('')+'</ul><div class="format-price">'+f.price+'</div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block btn-sm" style="margin-top:12px">Choose</button></div>';}).join('');
    },

    buildCampaignBuilder: function() {
        var c = this.$('bookingCard'); if(!c) return;
        var self = this;
        c.innerHTML = '<h3>📋 Build Your Campaign</h3><p style="color:#6C757D;font-size:13px;margin-bottom:24px">Book instantly via WhatsApp. We\'ll call back in 5 minutes.</p>'+
            '<div class="form-row"><div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>'+
            '<div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="RASAAI.updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo</option></select></div></div>'+
            '<div class="form-row"><div class="form-group"><label>Route</label><select id="cbRoute" onchange="RASAAI.updateBookingEstimate()">'+this.routes.map(function(r){return '<option value="'+r.id+'">'+r.name+'</option>';}).join('')+'</select></div>'+
            '<div class="form-group"><label>Rickshaws</label><select id="cbRicks" onchange="RASAAI.updateBookingEstimate()"><option value="1">1</option><option value="5">5</option><option value="10">10 (10% off)</option><option value="20">20 (10% off)</option></select></div></div>'+
            '<div class="form-row"><div class="form-group"><label>Duration</label><select id="cbDuration" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div>'+
            '<div class="form-group"><label>Your Phone *</label><input type="tel" id="cbPhone" required placeholder="+91"></div></div>'+
            '<div class="price-summary" id="priceSummary"></div>'+
            '<div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap"><button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="RASAAI.bookViaWhatsApp()">💬 Book via WhatsApp</button><a href="tel:+919594306625" class="btn btn-primary btn-lg" style="flex:1">📞 Call Now</a></div>';
        this.updateBookingEstimate();
    },

    updateBookingEstimate: function() {
        var s = this.$('priceSummary'); if(!s) return;
        var type = this.$('cbType')?.value||'led', r = parseInt(this.$('cbRicks')?.value||1), d = parseInt(this.$('cbDuration')?.value||1);
        var rate = this.currentPrice;
        if(type==='audio') rate = Math.floor(this.currentPrice*0.3);
        if(type==='combo') rate = Math.floor(this.currentPrice*1.45);
        var sub = rate*r*d, disc = r>=10?Math.floor(sub*0.1):0, tot = sub-disc;
        s.innerHTML = '<div class="row"><span>Subtotal</span><span>₹'+sub.toLocaleString('en-IN')+'</span></div>'+(disc>0?'<div class="row"><span>10% Discount</span><span style="color:#00A86B">-₹'+disc.toLocaleString('en-IN')+'</span></div>':'')+'<div class="row total"><span>Total</span><span>₹'+tot.toLocaleString('en-IN')+'</span></div>';
    },

    bookViaWhatsApp: function() {
        var name = this.$('cbName')?.value||'', type = this.$('cbType')?.value||'led', routeEl = this.$('cbRoute'), route = routeEl?.options[routeEl?.selectedIndex]?.text||'', ricks = this.$('cbRicks')?.value||'1', duration = this.$('cbDuration')?.value||'1', phone = this.$('cbPhone')?.value||'';
        var typeNames = {led:'LED Campaign',audio:'Audio Campaign',combo:'LED+Audio Combo'};
        var rate = this.currentPrice;
        if(type==='audio') rate=Math.floor(this.currentPrice*0.3);
        if(type==='combo') rate=Math.floor(this.currentPrice*1.45);
        var total = rate*parseInt(ricks)*parseInt(duration);
        var msg = 'Hi RASAAI!%0A%0AI want to book:%0A📋 '+name+'%0A🎯 '+typeNames[type]+'%0A🛣️ '+route+'%0A🛺 '+ricks+' Rickshaws%0A📅 '+duration+' Days%0A💰 Est: ₹'+total.toLocaleString('en-IN')+'%0A📞 '+phone;
        window.open('https://wa.me/'+this.whatsapp+'?text='+msg, '_blank');
    },

    buildPricing: function() {
        var g = this.$('pricingGrid'); if(!g) return;
        var p = this.currentPrice, a = Math.floor(p*0.3), co = Math.floor(p*1.45);
        g.innerHTML = '<div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹'+p.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>LED Screen</li><li>GPS Tracked</li><li>Real Analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="RASAAI.selectPricing(\'led\')" class="btn btn-primary btn-block">Get LED</button></div>'+
            '<div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹'+a.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>Bluetooth Speaker</li><li>60-sec Ads</li><li>Zone Targeting</li><li>10% off 10+</li><li>💰 Most Affordable</li></ul><button onclick="RASAAI.selectPricing(\'audio\')" class="btn btn-primary btn-block">Get Audio</button></div>'+
            '<div class="pricing-card"><h4>🔥 Combo</h4><div class="price">₹'+co.toLocaleString('en-IN')+'<span>/day</span></div><ul class="pricing-features"><li>LED + Audio</li><li>Max Visibility</li><li>Full Analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="RASAAI.selectPricing(\'combo\')" class="btn btn-primary btn-block">Get Combo</button></div>';
    },

    selectPricing: function(type) {
        document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'});
        var sel = this.$('cbType'); if(sel) { sel.value = type; this.updateBookingEstimate(); }
    },

    buildInventory: function() {
        var g = this.$('inventoryGrid'); if(!g) return;
        var self = this;
        g.innerHTML = this.zones.slice(0,8).map(function(z){
            var s = z.avail<10?'critical':z.avail<20?'low':'good', m = {critical:'⚠️ Almost gone!',low:'⚡ Selling fast',good:'✅ Available'};
            return '<div class="inventory-card"><h4>📍 '+z.name+'</h4><div class="inventory-stock '+s+'"><span class="number">'+z.avail+'</span><span class="label">left</span></div><div class="inventory-bar"><div class="inventory-bar-fill" style="width:'+z.cov+'%"></div></div><span class="inventory-status '+s+'">'+m[s]+'</span></div>';
        }).join('');
    },

    buildROICalc: function() {
        var c = this.$('roiCalc'); if(!c) return;
        var self = this;
        c.innerHTML = '<h3>🧮 ROI Calculator</h3><div class="calc-inputs"><div class="calc-input-row"><label>Business</label><select id="roiBiz" onchange="RASAAI.updateROICalc()"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option></select></div><div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="RASAAI.updateROICalc()">'+this.zones.map(function(z){return '<option value="'+z.id+'">'+z.name+'</option>';}).join('')+'</select></div><div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.$(\'roiBudgetVal\').textContent=\'₹\'+parseInt(this.value).toLocaleString(\'en-IN\');RASAAI.updateROICalc()"><span id="roiBudgetVal" style="font-weight:700">₹50,000</span></div></div><div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Eye Views</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall ↑</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">New Customers</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">ROI</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiBE">--</div><div class="calc-result-label">Break-even</div></div></div>';
        this.updateROICalc();
    },

    updateROICalc: function() {
        var zid = this.$('roiZone')?.value||'kausa', budget = parseInt(this.$('roiBudget')?.value||50000);
        var z = this.zones.find(function(x){return x.id===zid;})||this.zones[0];
        var ricks = Math.min(Math.floor(budget/(this.currentPrice*30)), z.ricks);
        var cost = ricks*this.currentPrice*30, eyes = (z.eyes/z.ricks)*ricks*30;
        var biz = this.$('roiBiz')?.value||'retail';
        var rates = {retail:0.025,restaurant:0.035,clinic:0.02}, txns = {retail:500,restaurant:300,clinic:800};
        var conv = rates[biz]||0.02, foot = Math.floor(eyes*conv), cust = Math.floor(foot*0.3), rev = cust*(txns[biz]||500);
        var set = function(id,v) { var e = RASAAI.$(id); if(e) e.textContent = v; };
        set('roiEyes', this.fmt(eyes)); set('roiFoot', '+'+foot+'%'); set('roiCust', cust.toLocaleString('en-IN'));
        set('roiRev', '₹'+rev.toLocaleString('en-IN')); set('roiROI', cost>0?Math.floor((rev-cost)/cost*100)+'%':'--');
        set('roiBE', rev>0?Math.ceil(cost/(rev/30))+' days':'--');
    },

    buildCaseStudies: function() {
        var g = this.$('caseStudiesGrid'); if(!g) return;
        var cs = [{biz:"Spice Garden",type:"Restaurant",zone:"Kausa",d:"30d",b:"₹15K",r1:"45%",l1:"Footfall",r2:"467%",l2:"ROI",r3:"72%",l3:"Recall",q:"Dinner crowd doubled in 2 weeks!",o:"Ahmed Siddiqui"},{biz:"Mumbra Dental",type:"Clinic",zone:"Station",d:"45d",b:"₹22K",r1:"38%",l1:"Patients",r2:"445%",l2:"ROI",r3:"68%",l3:"Recall",q:"Audio ads near station incredibly effective.",o:"Dr. Fatima Khan"},{biz:"Shilphata Ind.",type:"B2B",zone:"Shilphata",d:"60d",b:"₹35K",r1:"55%",l1:"Inquiries",r2:"900%",l2:"ROI",r3:"64%",l3:"Recall",q:"Reached managers who don't use social media.",o:"Rajesh Patil"}];
        g.innerHTML = cs.map(function(c){return '<div class="case-card"><div class="case-header"><span style="font-weight:700;color:#FF5A00">Case Study</span><span class="case-tag">'+c.type+'</span></div><h3>'+c.biz+'</h3><div style="display:flex;gap:12px;margin:8px 0;font-size:12px;color:#6C757D"><span>📍 '+c.zone+'</span><span>⏱️ '+c.d+'</span><span>💰 '+c.b+'</span></div><div class="case-results"><div class="case-result"><div class="val">'+c.r1+'</div><div class="lbl">'+c.l1+'</div></div><div class="case-result"><div class="val">'+c.r2+'</div><div class="lbl">'+c.l2+'</div></div><div class="case-result"><div class="val">'+c.r3+'</div><div class="lbl">'+c.l3+'</div></div></div><blockquote class="case-quote">"'+c.q+'"<cite>— '+c.o+'</cite></blockquote></div>';}).join('');
    },

    buildIndustries: function() {
        var g = this.$('industryCards'); if(!g) return;
        var inds = [{icon:"🏪",name:"Retail",desc:"Drive footfall"},{icon:"🍽️",name:"Restaurant",desc:"Hungry commuters"},{icon:"🏥",name:"Clinic",desc:"Patient trust"},{icon:"💊",name:"Pharmacy",desc:"First recalled"},{icon:"🏫",name:"School",desc:"Reach parents"},{icon:"📚",name:"Coaching",desc:"Students daily"},{icon:"🏠",name:"Real Estate",desc:"Neighborhood"},{icon:"💪",name:"Gym",desc:"Commute routes"},{icon:"💇",name:"Salon",desc:"Visible daily"},{icon:"📱",name:"Electronics",desc:"Gadget lovers"},{icon:"💍",name:"Jewelry",desc:"Wedding season"},{icon:"🏦",name:"Bank",desc:"Financial trust"},{icon:"🛡️",name:"Insurance",desc:"Seen=trusted"},{icon:"🚗",name:"Auto",desc:"Commuters"},{icon:"🔧",name:"Hardware",desc:"Found needed"},{icon:"🪑",name:"Furniture",desc:"Home dreams"},{icon:"🎉",name:"Events",desc:"Big day"},{icon:"✈️",name:"Travel",desc:"Vacation"},{icon:"🍲",name:"Catering",desc:"Party orders"},{icon:"🦷",name:"Dentist",desc:"Toothache"}];
        g.innerHTML = inds.map(function(i){return '<div class="industry-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})"><div class="icon">'+i.icon+'</div><h4>'+i.name+'</h4><p>'+i.desc+'</p></div>';}).join('');
    },

    buildTestimonials: function() {
        var s = this.$('testimonialSlider'); if(!s) return;
        var ts = [{name:"Ahmed Shaikh",biz:"Mumbra Pizza",zone:"Station",text:"Walk-ins 65% up! Best investment.",r:5,init:"AS"},{name:"Dr. Fatima",biz:"Shifa Clinic",zone:"Kausa",text:"120 new patients in 6 months.",r:5,init:"FK"},{name:"Mohammed Ali",biz:"Al-Huda Tuition",zone:"Shilphata",text:"45 new students enrolled.",r:5,init:"MA"},{name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Visibility doubled.",r:5,init:"RS"},{name:"Priya Patel",biz:"Fashion Hub",zone:"Station",text:"40% sales increase.",r:5,init:"PP"},{name:"Vikram Singh",biz:"AutoCare",zone:"Check Naka",text:"Reached offline audience.",r:5,init:"VS"},{name:"Sneha Gupta",biz:"Sweet Bengal",zone:"Kausa",text:"Became area famous.",r:5,init:"SG"},{name:"Deepa Shah",biz:"Wellness Yoga",zone:"Shilphata",text:"50+ new members.",r:5,init:"DS"},{name:"Rajesh Patil",biz:"Shilphata Ind.",zone:"Shilphata",text:"B2B unmatched.",r:5,init:"RP"},{name:"Kavita Reddy",biz:"Spice Garden",zone:"Kausa",text:"Crowd doubled.",r:5,init:"KR"}];
        s.innerHTML = '<div class="testimonial-track" id="testTrack">'+ts.map(function(t){return '<div class="testimonial-card"><div class="stars">'+'⭐'.repeat(t.r)+'</div><p class="quote">"'+t.text+'"</p><div class="author"><div class="avatar">'+t.init+'</div><div><strong>'+t.name+'</strong><p style="font-size:11px;color:#6C757D">'+t.biz+', '+t.zone+'</p></div></div></div>';}).join('')+'</div><div class="slider-nav"><button onclick="document.getElementById(\'testTrack\').scrollBy({left:-340,behavior:\'smooth\'})">←</button><button onclick="document.getElementById(\'testTrack\').scrollBy({left:340,behavior:\'smooth\'})">→</button></div>';
    },

    buildVideos: function() {
        var g = this.$('videoGrid'); if(!g) return;
        var thumbs = ["https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/6.jpg","https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/7.jpg","https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/8.jpg","https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/9.jpg"];
        g.innerHTML = [{t:"Rickshaw LED Ad",img:0},{t:"Campaign Success",img:1},{t:"Audio Ad Demo",img:2},{t:"Coverage Map",img:3}].map(function(v){return '<div class="video-card" onclick="RASAAI.openVideo(\'dQw4w9WgXcQ\')"><div class="video-thumb" style="background-image:url(\''+thumbs[v.img]+'\')"><div class="play-btn">▶️</div></div><div class="video-body"><h4>'+v.t+'</h4></div></div>';}).join('');
    },

    openVideo: function(id) {
        var m = this.$('videoModal'), e = this.$('videoEmbed');
        if(!m||!e) return;
        e.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+id+'?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        m.classList.add('show'); document.body.style.overflow='hidden';
    },
    closeVideoModal: function() {
        var m = this.$('videoModal'), e = this.$('videoEmbed');
        if(m) m.classList.remove('show'); if(e) e.innerHTML=''; document.body.style.overflow='';
    },

    buildHeatmap: function() {
        var c = this.$('heatmapContainer'); if(!c) return;
        var self = this;
        c.innerHTML = '<div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient-bar"></div><span>High</span></div>'+this.zones.map(function(z){return '<div class="heatmap-zone" style="background:rgba(0,168,107,'+(z.cov/150)+')" data-cov="'+z.cov+'"><div class="heatmap-zone-info"><strong>'+z.name+'</strong><span>'+z.cov+'% | '+z.ricks+' ricks</span></div><div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:'+z.cov+'%"></div></div></div>';}).join('')+'<div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="RASAAI.updateHeatmap(this.value)"><span id="htTime">12:00</span></div>';
    },

    updateHeatmap: function(hour) {
        var t = this.$('htTime'); if(t) t.textContent = hour+':00';
        document.querySelectorAll('.heatmap-zone').forEach(function(el){
            var base = parseInt(el.dataset.cov), h = parseInt(hour), m = 1;
            if(h>=7&&h<=10) m=1.3; else if(h>=17&&h<=20) m=1.4; else if(h>=22||h<=5) m=0.5;
            var adj = Math.min(100,Math.floor(base*m));
            el.style.background = 'rgba(0,168,107,'+(adj/150)+')';
            var f = el.querySelector('.heatmap-bar-fill'); if(f) f.style.width = adj+'%';
        });
    },

    buildLeaderboard: function() {
        var c = this.$('leaderboardContainer'); if(!c) return;
        var s = [...this.zones].sort(function(a,b){return b.eyes-a.eyes;}), self = this;
        c.innerHTML = s.map(function(z,i){return '<div class="lb-row"><div class="lb-rank">#'+(i+1)+'</div><div class="lb-info"><div class="lb-name">'+z.name+'</div><div class="lb-bar-track"><div class="lb-bar-fill" style="width:'+((z.eyes/s[0].eyes)*100)+'%"></div></div><div class="lb-value">👁️ '+self.fmt(z.eyes)+'/day | 🛺 '+z.ricks+' ricks</div></div></div>';}).join('');
    },

    buildAffiliate: function() {
        var c = this.$('affiliateContainer'); if(!c) return;
        c.innerHTML = '<div class="affiliate-card"><h3>💰 Earn 10% Commission</h3><p style="color:#6C757D;margin:12px 0">Refer a business and earn 10% of their campaign</p><div class="affiliate-slider"><label style="font-weight:600">Campaign Budget</label><input type="range" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.updateAffiliate(this.value)"><div style="display:flex;justify-content:space-between;font-size:11px;color:#ADB5BD;margin-top:4px"><span>₹5K</span><span>₹5L</span></div></div><div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div><div class="affiliate-tiers"><div class="tier-card"><div class="tier-val">₹25K</div><div>5 Refs</div></div><div class="tier-card"><div class="tier-val">₹50K</div><div>10 Refs</div></div><div class="tier-card"><div class="tier-val">₹1L</div><div>20 Refs</div></div></div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block">Start Referring</button></div>';
    },

    updateAffiliate: function(value) {
        var e = this.$('affEarn'); if(e) e.textContent = '₹'+Math.floor(value*0.1).toLocaleString('en-IN');
    },

    buildContest: function() {
        var c = this.$('contestContainer'); if(!c) return;
        c.innerHTML = '<div class="contest-card"><div style="font-size:48px">🏆</div><h3>Run a Hashtag Contest</h3><div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div><div class="form-group"><label>Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash"></div><div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div><button onclick="RASAAI.launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button></div>';
    },

    launchContest: function() {
        var hash = this.$('contestHash')?.value||'#RasaaiContest', prize = this.$('contestPrizeVal')?.value||'Prize', dur = this.$('contestDuration')?.value||'7 Days', phone = this.$('contestPhone')?.value;
        if(!phone) { alert('⚠️ Enter phone number'); return; }
        window.open('https://wa.me/'+this.whatsapp+'?text=Hi!%20Contest:%20'+encodeURIComponent(hash)+'%20'+encodeURIComponent(prize)+'%20'+encodeURIComponent(dur)+'%20📞'+phone, '_blank');
        alert('🏆 Contest Request Sent!\n'+hash+'\n'+prize+'\n'+dur);
    },

    buildHashtag: function() {
        var c = this.$('hashtagContainer'); if(!c) return;
        c.innerHTML = '<div style="text-align:center;background:white;border-radius:24px;padding:32px;box-shadow:0 4px 16px rgba(0,0,0,0.1)"><div style="font-size:48px">📱</div><h3>Live Tracking</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0"><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#FF5A00" id="htMentions">247</div><div style="font-size:11px;color:#ADB5BD">Mentions</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#7C4DFF">1.2K</div><div style="font-size:11px;color:#ADB5BD">Engagement</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#00A86B">89%</div><div style="font-size:11px;color:#ADB5BD">Positive</div></div><div style="padding:16px;background:#F8F9FA;border-radius:10px;text-align:center"><div style="font-size:24px;font-weight:800;color:#221F60">₹0.42</div><div style="font-size:11px;color:#ADB5BD">Cost/Eng.</div></div></div></div>';
    },

    buildFAQ: function() {
        var c = this.$('faqContainer'); if(!c) return;
        var faq = [{q:"How are Eye Views different?",a:"Eye Views track verified human visual contact. Average 11,500 per rickshaw daily."},{q:"What routes do you cover?",a:"4 routes: Mumbra→Kausa→MM Valley, Mumbra→Kausa→Shilphata→Taloja, Mumbra→Retibunder→Kalwa, Mumbra→Retibunder→Check Naka→Majhiwada."},{q:"How does pricing work?",a:"₹1,238-1,647/day per rickshaw. Changes every 15 min. 10% off on 10+."},{q:"What formats?",a:"LED Display, Audio Announcement, LED+Audio Combo. Free 30 social media creatives."},{q:"How to track?",a:"Real-time dashboard: Eye Views, GPS routes, daily reports."},{q:"Launch time?",a:"48-72 hours. Call +91 95943 06625."}];
        c.innerHTML = faq.map(function(item){return '<div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle(\'active\')"><span>'+item.q+'</span><span class="icon">+</span></button><div class="faq-a"><p>'+item.a+'</p></div></div>';}).join('');
    },

    buildMap: function() {
        var container = this.$('coverageMap'); if(!container||typeof L==='undefined') return;
        var map = L.map('coverageMap').setView([19.1850,73.0400],12), self = this;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:18}).addTo(map);
        var colors = ['#2196F3','#4CAF50','#F44336','#FF9800'];
        this.routes.forEach(function(r,i){if(r.coords&&r.coords.length>1){L.polyline(r.coords,{color:colors[i],weight:3,opacity:0.7}).addTo(map).bindPopup('<b>'+r.name+'</b><br>🛺 '+r.ricks+' rickshaws');}});
        this.zones.forEach(function(z){var color=z.avail<15?'#E74C3C':z.cov>80?'#00A86B':'#FFB800';L.circleMarker([z.lat,z.lng],{radius:Math.sqrt(z.ricks)*1.2,fillColor:color,color:'#fff',weight:2,fillOpacity:0.8}).addTo(map).bindPopup('<b>'+z.name+'</b><br>🛺 '+z.ricks+' rickshaws<br>👁️ '+self.fmt(z.eyes)+'/day');});
    },

    // ============ TIMERS & UPDATES ============
    getPrice: function() { var cycle=Date.now()/900000*Math.PI; return Math.floor(1238+(1647-1238)*(Math.sin(cycle)*0.5+0.5+Math.random()*0.08)); },
    updateAllPrices: function() { this.currentPrice=this.getPrice(); var hp=this.$('heroPrice'); if(hp) hp.innerHTML='₹'+this.currentPrice.toLocaleString('en-IN')+'<span>/day</span>'; this.buildPricing(); this.updateBookingEstimate(); },
    startTimers: function() { var self=this, sec=900, el=this.$('priceTimer'); if(el) setInterval(function(){var m=Math.floor(sec/60),s=sec%60; el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); sec--; if(sec<0){sec=900;self.updateAllPrices();}},1000); setInterval(function(){self.updateAllPrices();},900000); },
    startLiveUpdates: function() { var self=this; setInterval(function(){var r=self.$('liveRickshaws');if(r)r.textContent=340+Math.floor(Math.random()*10);var c=self.$('liveCampaigns');if(c)c.textContent=125+Math.floor(Math.random()*8);var e=self.$('liveEyeViews');if(e){var v=parseInt(e.textContent.replace(/,/g,''))||1247893;e.textContent=(v+Math.floor(Math.random()*300)+100).toLocaleString('en-IN');}var m=self.$('htMentions');if(m)m.textContent=247+Math.floor(Math.random()*8);},5000); },
    startNotifications: function() { var msgs=['🏃 3 businesses booked Kausa today','🔥 Mumbra Station: Only 8 left','✅ New campaign in Shilphata','💼 Agency booked 15 rickshaws'],i=0,self=this; setInterval(function(){var w=self.$('notificationWidget'),t=self.$('notificationText');if(w&&t){t.textContent=msgs[i];w.classList.add('show');setTimeout(function(){w.classList.remove('show');},4000);i=(i+1)%msgs.length;}},8000); },
    startCounters: function() { document.querySelectorAll('[data-count]').forEach(function(el){var target=parseInt(el.getAttribute('data-count')),current=0,step=Math.ceil(target/50);var iv=setInterval(function(){current+=step;if(current>=target){current=target;clearInterval(iv);}el.textContent=current>=10000000?(current/10000000).toFixed(1)+'M+':current>=100000?(current/100000).toFixed(1)+'L+':current>=1000?current.toLocaleString('en-IN'):current;},30);}); },
    setupExitIntent: function() { var depth=0,shown=false,self=this; window.addEventListener('scroll',function(){depth=Math.max(depth,(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);}); document.addEventListener('mouseout',function(e){if(!shown&&e.clientY<=0&&depth>50){var p=self.$('exitPopup');if(p)p.classList.add('show');shown=true;setTimeout(function(){shown=false;},300000);}}); },
    setupMobileNav: function() { window.addEventListener('scroll',function(){var h=document.getElementById('desktopHeader');if(h)h.classList.toggle('scrolled',window.scrollY>50);var s=document.getElementById('stickyBar');if(s)s.style.display=window.scrollY>400?'flex':'none';}); },
    closeExitPopup: function() { var p=this.$('exitPopup'); if(p) p.classList.remove('show'); },
    openDashboard: function() { var m=this.$('dashboardModal'),c=this.$('dashboardContent'); if(!m||!c)return; m.classList.add('show'); document.body.style.overflow='hidden'; this.renderDashboard(c); },
    closeDashboard: function() { var m=this.$('dashboardModal'); if(m)m.classList.remove('show'); document.body.style.overflow=''; },
    renderDashboard: function(c) { var self=this; var activeR=this.zones.reduce(function(s,z){return s+z.avail;},0), onlineR=Math.floor(activeR*0.85); c.innerHTML='<div class="dash-stats"><div class="dash-stat-card"><div class="dash-stat-num">'+activeR+'</div><div class="dash-stat-lbl">Available Rickshaws</div></div><div class="dash-stat-card"><div class="dash-stat-num">'+onlineR+'</div><div class="dash-stat-lbl">GPS Online</div></div><div class="dash-stat-card"><div class="dash-stat-num">127</div><div class="dash-stat-lbl">Active Campaigns</div></div><div class="dash-stat-card"><div class="dash-stat-num">350+</div><div class="dash-stat-lbl">Total Clients</div></div><div class="dash-stat-card"><div class="dash-stat-num">₹12.5L</div><div class="dash-stat-lbl">Monthly Revenue</div></div><div class="dash-stat-card"><div class="dash-stat-num">'+self.fmt(self.zones.reduce(function(s,z){return s+z.eyes;},0))+'</div><div class="dash-stat-lbl">Daily Eye Views</div></div></div><h4>🛺 Rickshaw Fleet</h4><div class="dash-table"><table><thead><tr><th>ID</th><th>Zone</th><th>Status</th><th>GPS</th><th>LED</th><th>Audio</th><th>Daily Eyes</th></tr></thead><tbody>'+this.zones.slice(0,8).map(function(z,i){return'<tr><td>RKS-'+String(i+1).padStart(3,'0')+'</td><td>'+z.name+'</td><td><span class="status-badge active">active</span></td><td><span class="status-badge online">online</span></td><td>active</td><td>active</td><td>'+self.fmt(Math.floor(z.eyes/z.ricks))+'</td></tr>';}).join('')+'</tbody></table></div><br><h4>📋 Recent Campaigns</h4><div class="dash-table"><table><thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Zone</th><th>Ricks</th><th>Days</th><th>Cost</th><th>Status</th></tr></thead><tbody><tr><td>CMP-001</td><td>Spice Garden</td><td>LED</td><td>Kausa</td><td>10</td><td>30</td><td>₹42,000</td><td><span class="status-badge active">active</span></td></tr><tr><td>CMP-002</td><td>Mumbra Dental</td><td>Audio</td><td>Station</td><td>5</td><td>45</td><td>₹18,900</td><td><span class="status-badge active">active</span></td></tr><tr><td>CMP-003</td><td>Shilphata Ind.</td><td>Combo</td><td>Shilphata</td><td>15</td><td>60</td><td>₹1,26,000</td><td><span class="status-badge active">active</span></td></tr></tbody></table></div><br><button class="btn btn-primary" onclick="RASAAI.bookViaWhatsApp()">💬 New Booking via WhatsApp</button>'; }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    RASAAI.init();
    document.getElementById('bookingModal')?.addEventListener('click',function(e){if(e.target===this)RASAAI.closeDashboard();});
    document.getElementById('dashboardModal')?.addEventListener('click',function(e){if(e.target===this)RASAAI.closeDashboard();});
    document.getElementById('videoModal')?.addEventListener('click',function(e){if(e.target===this)RASAAI.closeVideoModal();});
});
