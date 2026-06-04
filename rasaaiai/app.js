// ============================================
// Rasaai AI OS - Complete Application
// AI Planner | Mockup Generator | WhatsApp Booking
// Dynamic Pricing | Dashboard | All Interactive
// ============================================

const RASAAI = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    currentPrice: 1400,
    priceMin: 1238,
    priceMax: 1647,

    // ============ DATA ============
    routes: [
        { id:"r1", name:"Mumbra → Kausa → MM Valley Road", stops:["Mumbra","Kausa","MM Valley Road"], ricks:85, eyes:125000, color:"#7C3AED" },
        { id:"r2", name:"Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", stops:["Mumbra","Kausa","Kalsekar","Shilphata","Kalyan Phata","Taloja P1","Taloja P2"], ricks:185, eyes:315000, color:"#06B6D4" },
        { id:"r3", name:"Mumbra → Retibunder → Kalwa Naka", stops:["Mumbra","Retibunder","Kalwa Naka"], ricks:50, eyes:75000, color:"#F59E0B" },
        { id:"r4", name:"Mumbra → Retibunder → Check Naka → Majhiwada", stops:["Mumbra","Retibunder","Check Naka","Majhiwada"], ricks:30, eyes:77000, color:"#10B981" }
    ],
    zones: [
        { id:"kausa", name:"Kausa", pop:45000, traffic:"85K/day", peak:"8AM-8PM", eyes:125000, ricks:85, avail:42, cov:87, color:"#7C3AED" },
        { id:"mumbra", name:"Mumbra Station", pop:78000, traffic:"150K/day", peak:"7AM-9PM", eyes:220000, ricks:120, avail:8, cov:92, color:"#06B6D4" },
        { id:"shilphata", name:"Shilphata", pop:55000, traffic:"110K/day", peak:"7AM-9PM", eyes:155000, ricks:65, avail:25, cov:78, color:"#F59E0B" },
        { id:"retibunder", name:"Retibunder", pop:35000, traffic:"65K/day", peak:"9AM-8PM", eyes:75000, ricks:50, avail:30, cov:72, color:"#10B981" },
        { id:"checknaka", name:"Check Naka", pop:40000, traffic:"70K/day", peak:"7AM-8PM", eyes:77000, ricks:30, avail:20, cov:65, color:"#EF4444" },
        { id:"kalwa", name:"Kalwa Naka", pop:52000, traffic:"95K/day", peak:"8AM-9PM", eyes:130000, ricks:55, avail:18, cov:74, color:"#8B5CF6" },
        { id:"majhiwada", name:"Majhiwada", pop:48000, traffic:"80K/day", peak:"8AM-8PM", eyes:110000, ricks:40, avail:22, cov:68, color:"#EC4899" },
        { id:"taloja1", name:"Taloja Phase 1", pop:30000, traffic:"45K/day", peak:"7AM-7PM", eyes:60000, ricks:25, avail:15, cov:55, color:"#F97316" },
        { id:"taloja2", name:"Taloja Phase 2", pop:28000, traffic:"40K/day", peak:"7AM-7PM", eyes:55000, ricks:22, avail:17, cov:50, color:"#14B8A6" },
        { id:"kalyan", name:"Kalyan Phata", pop:42000, traffic:"75K/day", peak:"8AM-9PM", eyes:100000, ricks:45, avail:20, cov:70, color:"#6366F1" },
        { id:"kalsekar", name:"Kalsekar Bypass", pop:38000, traffic:"60K/day", peak:"7AM-8PM", eyes:85000, ricks:35, avail:28, cov:62, color:"#0EA5E9" },
        { id:"mmvalley", name:"MM Valley Road", pop:32000, traffic:"50K/day", peak:"8AM-8PM", eyes:70000, ricks:28, avail:25, cov:58, color:"#D946EF" }
    ],
    qrPool: ["QR001","QR002","QR003","QR004","QR005"],

    // ============ HELPERS ============
    fmt: function(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); },
    $: function(id) { return document.getElementById(id); },
    getPrice: function() { var c=Date.now()/900000*Math.PI; return Math.floor(this.priceMin+(this.priceMax-this.priceMin)*(Math.sin(c)*0.5+0.5+Math.random()*0.08)); },

    // ============ INIT ============
    init: function() {
        this.currentPrice = this.getPrice();
        this.buildAll();
        this.startTimers();
        this.startLiveUpdates();
        this.startNotifications();
        this.startCounters();
        this.setupExitIntent();
        this.setupMobileNav();
        this.updateAllPrices();
        setTimeout(()=>{ var l=this.$('loadingScreen'); if(l){l.classList.add('hidden');setTimeout(()=>l.remove(),500);} },800);
    },

    buildAll: function() {
        this.buildTrustBar();
        this.buildRoutes();
        this.buildZones();
        this.buildTracks();
        this.buildPricing();
        this.buildCampaignBuilder();
        this.buildFormats();
        this.buildComparison();
        this.buildAudio();
        this.buildVideos();
        this.buildNeuro();
        this.buildDashboard();
        this.buildAffiliate();
        this.buildDriver();
        this.buildContest();
        this.buildHeatmap();
        this.buildLeaderboard();
        this.buildTestimonials();
        this.buildIndustries();
        this.buildFAQ();
        this.buildPayment();
        this.showComparison('instagram');
    },

    // ============ BUILD FUNCTIONS ============
    buildTrustBar: function() {
        var t=this.$('trustTrack'); if(!t)return;
        var logos=["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point"];
        t.innerHTML=[...logos,...logos].map(function(l){return'<span class="trust-item">'+l+'</span>';}).join('');
    },

    buildRoutes: function() {
        var g=this.$('routesGrid'), self=this; if(!g)return;
        g.innerHTML=this.routes.map(function(r,i){return'<div class="route-card glass-card" onclick="document.getElementById(\'zones\').scrollIntoView({behavior:\'smooth\'})"><h4>🛣️ Route '+(i+1)+'</h4><p style="font-size:13px;color:var(--gray-400);margin-bottom:8px">'+r.name+'</p><div class="route-meta"><span>🛺 '+r.ricks+' Rickshaws</span><span>👁️ '+self.fmt(r.eyes)+'/Day</span><span>📍 '+r.stops.length+' Stops</span></div><div class="route-pills">'+r.stops.map(function(s){return'<span class="route-pill">'+s+'</span>';}).join(' → ')+'</div></div>';}).join('');
    },

    buildZones: function() {
        var g=this.$('zonesGrid'), self=this; if(!g)return;
        g.innerHTML=this.zones.map(function(z){var sc=z.avail<15?'low':'good';return'<div class="zone-card glass-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})"><span class="zone-avail '+sc+'">'+z.avail+' Left</span><h4>📍 '+z.name+'</h4><div class="zone-meta"><span>👥 '+self.fmt(z.pop)+'</span><span>🚶 '+z.traffic+'</span><span>🕐 '+z.peak+'</span></div><div class="zone-stats"><div class="zone-stat"><div class="val">'+self.fmt(z.eyes)+'</div><div class="lbl">Impressions</div></div><div class="zone-stat"><div class="val">'+z.avail+'/'+z.ricks+'</div><div class="lbl">Available</div></div><div class="zone-stat"><div class="val">'+z.cov+'%</div><div class="lbl">Coverage</div></div></div></div>';}).join('');
    },

    buildTracks: function() {
        var g=this.$('trackGrid'), self=this; if(!g)return;
        var h=''; for(var i=0;i<6;i++){var z=this.zones[i%12],on=Math.random()>0.1,au=Math.random()>0.1,le=Math.random()>0.05;
        h+='<div class="track-card glass-card"><div class="track-header"><div class="track-id"><span class="track-dot '+(on?'on':'off')+'"></span>RKS-'+String(i+1).padStart(3,'0')+'</div><span style="font-size:12px;color:var(--gray-400)">🔋 '+(Math.floor(Math.random()*40)+60)+'%</span></div><div style="font-weight:600;color:var(--white)">📍 '+z.name+'</div><div style="color:var(--gray-400);font-size:12px">🛣️ Active Route</div><div style="display:flex;gap:6px;margin-top:8px"><span class="track-badge '+(au?'on':'off')+'">🔊 Audio</span><span class="track-badge '+(le?'on':'off')+'">💡 LED</span></div>'+(Math.random()>0.3?'<div style="padding:6px 10px;background:rgba(16,185,129,0.1);border-radius:8px;font-size:11px;color:var(--green);margin-top:8px">Active Campaign</div>':'<div style="padding:6px 10px;background:rgba(255,255,255,0.03);border-radius:8px;font-size:11px;color:var(--gray-500);margin-top:8px">Available</div>')+'</div>';}
        g.innerHTML=h;
    },

    buildPricing: function() {
        var g=this.$('pricingGrid'); if(!g)return;
        var p=this.currentPrice, a=Math.floor(p*0.3), co=Math.floor(p*1.45);
        g.innerHTML='<div class="pricing-card glass-card"><h4>📺 LED Campaign</h4><div class="price">₹'+p.toLocaleString('en-IN')+'<span style="font-size:14px;color:var(--gray-400)">/day</span></div><ul class="pricing-features"><li>LED Screen on rickshaw</li><li>GPS tracked coverage</li><li>Real-time analytics</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="RASAAI.selectPricing(\'led\')" class="btn btn-primary btn-block">Get LED</button></div>'+
        '<div class="pricing-card glass-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹'+a.toLocaleString('en-IN')+'<span style="font-size:14px;color:var(--gray-400)">/day</span></div><ul class="pricing-features"><li>Bluetooth speaker audio</li><li>60-sec ad every 15 min</li><li>Zone announcement included</li><li>10% off on 10+ rickshaws</li><li>💰 Most affordable plan</li></ul><button onclick="RASAAI.selectPricing(\'audio\')" class="btn btn-primary btn-block">Get Audio</button></div>'+
        '<div class="pricing-card glass-card"><h4>🔥 Combo (LED + Audio)</h4><div class="price">₹'+co.toLocaleString('en-IN')+'<span style="font-size:14px;color:var(--gray-400)">/day</span></div><ul class="pricing-features"><li>LED + Audio synchronized</li><li>Maximum visibility & recall</li><li>Full analytics suite</li><li>10% off on 10+ rickshaws</li><li>🎁 FREE 30 Social Media Creatives</li></ul><button onclick="RASAAI.selectPricing(\'combo\')" class="btn btn-primary btn-block">Get Combo</button></div>';
    },

    selectPricing: function(type) {
        document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'});
        var s=this.$('cbType'); if(s){s.value=type;this.updateBookingEstimate();}
    },

    buildCampaignBuilder: function() {
        var c=this.$('bookingCard'), self=this; if(!c)return;
        c.innerHTML='<h3>📋 Build Your Campaign</h3><p style="color:var(--gray-400);font-size:13px;margin-bottom:24px">Book instantly via WhatsApp. We\'ll call back in 5 minutes.</p>'+
        '<div class="form-row"><div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>'+
        '<div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="RASAAI.updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo (LED + Audio)</option></select></div></div>'+
        '<div class="form-row"><div class="form-group"><label>Route / Zone</label><select id="cbRoute" onchange="RASAAI.updateBookingEstimate()">'+this.routes.map(function(r){return'<option value="'+r.id+'">'+r.name+'</option>';}).join('')+'</select></div>'+
        '<div class="form-group"><label>Number of Rickshaws</label><select id="cbRicks" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Rickshaw</option><option value="5">5 Rickshaws</option><option value="10">10 Rickshaws (10% off!)</option><option value="20">20 Rickshaws (10% off!)</option><option value="50">50 Rickshaws (10% off!)</option></select></div></div>'+
        '<div class="form-row"><div class="form-group"><label>Duration</label><select id="cbDuration" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option><option value="90">90 Days</option></select></div>'+
        '<div class="form-group"><label>Your Phone Number *</label><input type="tel" id="cbPhone" required placeholder="+91"></div></div>'+
        '<div class="price-summary" id="priceSummary"></div>'+
        '<div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap"><button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="RASAAI.bookViaWhatsApp()">💬 Book via WhatsApp</button><a href="tel:+919594306625" class="btn btn-primary btn-lg" style="flex:1">📞 Call Now</a></div>';
        this.updateBookingEstimate();
    },

    updateBookingEstimate: function() {
        var s=this.$('priceSummary'); if(!s)return;
        var type=this.$('cbType')?.value||'led', r=parseInt(this.$('cbRicks')?.value||1), d=parseInt(this.$('cbDuration')?.value||1);
        var rate=this.currentPrice;
        if(type==='audio')rate=Math.floor(this.currentPrice*0.3);
        if(type==='combo')rate=Math.floor(this.currentPrice*1.45);
        var sub=rate*r*d, disc=r>=10?Math.floor(sub*0.1):0, tot=sub-disc;
        s.innerHTML='<div class="row"><span>Subtotal</span><span>₹'+sub.toLocaleString('en-IN')+'</span></div>'+(disc>0?'<div class="row"><span>10% Discount</span><span style="color:var(--green)">-₹'+disc.toLocaleString('en-IN')+'</span></div>':'')+'<div class="row total"><span>Total Estimate</span><span>₹'+tot.toLocaleString('en-IN')+'</span></div>';
    },

    bookViaWhatsApp: function() {
        var name=this.$('cbName')?.value||'Customer', type=this.$('cbType')?.value||'led', routeEl=this.$('cbRoute'), route=routeEl?.options[routeEl?.selectedIndex]?.text||'';
        var ricks=this.$('cbRicks')?.value||'1', duration=this.$('cbDuration')?.value||'1', phone=this.$('cbPhone')?.value||'';
        var typeNames={led:'LED Campaign',audio:'Audio Campaign',combo:'LED+Audio Combo'};
        var rate=this.currentPrice; if(type==='audio')rate=Math.floor(this.currentPrice*0.3); if(type==='combo')rate=Math.floor(this.currentPrice*1.45);
        var total=rate*parseInt(ricks)*parseInt(duration);
        var msg='Hi Rasaai AI OS!%0A%0AI want to book:%0A📋 '+name+'%0A🎯 '+typeNames[type]+'%0A🛣️ '+route+'%0A🛺 '+ricks+' Rickshaws%0A📅 '+duration+' Days%0A💰 Est: ₹'+total.toLocaleString('en-IN')+'%0A📞 '+phone;
        window.open('https://wa.me/'+this.whatsapp+'?text='+msg,'_blank');
    },

    buildFormats: function() {
        var g=this.$('formatCards'); if(!g)return;
        var f=[{icon:"💡",name:"LED Display",desc:"Bright LED screen. Day & night visibility.",feat:["Full-color display","Weatherproof","GPS tracked","Changeable content"],price:"₹1,238-1,647/day",rec:false},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers.",feat:["Pro voice-over","Multi-language","60-sec ads","Zone targeting"],price:"₹318-639/day",rec:false},{icon:"⚡",name:"LED + Audio Combo",desc:"85% higher recall.",feat:["Visual+Audio sync","Maximum attention","Best ROI","Priority access"],price:"₹1,795-2,388/day",rec:true}];
        g.innerHTML=f.map(function(f){return'<div class="format-card glass-card '+(f.rec?'recommended':'')+'">'+(f.rec?'<span class="rec-badge">⭐ Recommended</span>':'')+'<div class="format-icon">'+f.icon+'</div><h4 style="color:var(--white)">'+f.name+'</h4><p style="color:var(--gray-400);font-size:13px">'+f.desc+'</p><ul class="format-features">'+f.feat.map(function(ft){return'<li>'+ft+'</li>';}).join('')+'</ul><div style="font-weight:700;color:var(--cyan-light);margin-bottom:12px">'+f.price+'</div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block btn-sm">Choose</button></div>';}).join('');
    },

    buildComparison: function() {
        var t=this.$('compTabs'); if(!t)return;
        t.innerHTML='<button class="comp-tab active" onclick="RASAAI.showComparison(\'instagram\',this)">📱 Instagram</button><button class="comp-tab" onclick="RASAAI.showComparison(\'facebook\',this)">👍 Facebook</button><button class="comp-tab" onclick="RASAAI.showComparison(\'youtube\',this)">▶️ YouTube</button>';
    },

    showComparison: function(platform, btn) {
        document.querySelectorAll('.comp-tab').forEach(function(t){t.classList.remove('active');});
        if(btn)btn.classList.add('active');
        var data={instagram:[["Hyperlocal Visibility","✅ Full zone","❌ Limited"],["Physical Presence","✅ Tangible","❌ Digital-only"],["Ad Blocking","✅ Can't block","❌ Blocked"],["Non-Internet","✅ 100% reach","❌ Internet needed"],["Attention","✅ 3-8 sec","❌ <1 sec"],["Recall","✅ 68%","❌ 24%"],["CPM","✅ ₹4.50","❌ ₹35-150"]],facebook:[["Local Reach","✅ 100% zone","❌ 15-40%"],["Trust","✅ Physical","❌ Skepticism"],["Multi-sense","✅ Visual+Audio","❌ Visual only"],["Community","✅ Seen locally","❌ No trace"],["Cost/Eyes","✅ ₹4.50","❌ N/A"],["Conversion","✅ Walk-in","❌ Click friction"]],youtube:[["Skip Rate","✅ 0%","❌ 65-76%"],["Fatigue","✅ Low","❌ High"],["Attention","✅ 4.2 sec","❌ 2.1 sec"],["Recall","✅ 68%","❌ 18%"],["Physical","✅ Yes","❌ No"],["Local Trust","✅ Community","❌ Global"]]};
        var c=this.$('compContent'); if(!c)return;
        c.innerHTML='<table class="comp-table"><thead><tr><th>Feature</th><th style="color:var(--cyan-light)">🛺 Rasaai</th><th>Competitor</th></tr></thead><tbody>'+data[platform].map(function(r){return'<tr><td><strong>'+r[0]+'</strong></td><td class="win">'+r[1]+'</td><td class="lose">'+r[2]+'</td></tr>';}).join('')+'</tbody></table>';
    },

    buildAudio: function() {
        var g=this.$('audioGrid'); if(!g)return;
        g.innerHTML=[{icon:"🍽️",title:"Restaurant Ad",type:"restaurant"},{icon:"🏥",title:"Clinic Ad",type:"clinic"},{icon:"🏫",title:"Education Ad",type:"education"}].map(function(s){return'<div class="audio-card glass-card" onclick="RASAAI.playAudio(\''+s.type+'\')"><div class="audio-icon">'+s.icon+'</div><h4 style="color:var(--white)">'+s.title+'</h4><div class="audio-wave">'+'<div class="bar"></div>'.repeat(6)+'</div><button class="btn btn-primary btn-sm">▶️ Play Sample</button></div>';}).join('');
    },

    playAudio: function(type) {
        try{var ctx=new(window.AudioContext||window.webkitAudioContext)(),o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value={restaurant:520,clinic:440,education:660}[type]||500;g.gain.value=0.15;o.start();g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+2);o.stop(ctx.currentTime+2);}catch(e){alert('🔊 Playing beep. Replace with MP3.');}
    },

    buildVideos: function() {
        var g=this.$('videoGrid'); if(!g)return;
        g.innerHTML=[{t:"Rickshaw LED Ad",id:"dQw4w9WgXcQ"},{t:"Campaign Success",id:"dQw4w9WgXcQ"},{t:"Audio Ad Demo",id:"dQw4w9WgXcQ"},{t:"AI Campaign Demo",id:"dQw4w9WgXcQ"}].map(function(v){return'<div class="video-card glass-card" onclick="RASAAI.openVideo(\''+v.id+'\')"><div class="video-thumb"><div class="play-btn">▶️</div></div><div class="video-body"><h4>'+v.t+'</h4></div></div>';}).join('');
    },

    openVideo: function(id) {
        var m=this.$('videoModal'),e=this.$('videoEmbed'); if(!m||!e)return;
        e.innerHTML='<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+id+'?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        m.classList.add('show'); document.body.style.overflow='hidden';
    },
    closeVideo: function() {
        var m=this.$('videoModal'),e=this.$('videoEmbed'); if(m)m.classList.remove('show'); if(e)e.innerHTML=''; document.body.style.overflow='';
    },

    buildNeuro: function() {
        var g=this.$('neuroGrid'); if(!g)return;
        var cards=[{icon:"👁️",title:"Motion Bias",stat:"400%",label:"More Attention",back:"Human visual cortex detects movement automatically. Moving rickshaw ads command 400% more attention than static billboards."},{icon:"⚡",title:"Pattern Interruption",stat:"3x",label:"Memory Encoding",back:"New ad breaks expected patterns, triggering norepinephrine release."},{icon:"🔄",title:"Spaced Repetition",stat:"3x",label:"Consolidation",back:"Same ad on different rickshaws = 3x memory consolidation."},{icon:"🧠",title:"Visual Recall",stat:"65%",label:"Recall Rate",back:"65% visual recall vs 10% text. Dual encoding."},{icon:"📍",title:"Location Familiarity",stat:"73%",label:"Trust Increase",back:"Familiar locations feel trustworthy. Mere-exposure effect."},{icon:"👥",title:"Social Proof",stat:"5x",label:"Word-of-Mouth",back:"Thousands seeing same ad = implicit social proof."},{icon:"🔊",title:"Dual-Channel",stat:"85%",label:"Higher Recall",back:"Audio + Visual = 85% higher recall."},{icon:"🏘️",title:"Community",stat:"73%",label:"Prefer Local",back:"73% prefer brands that feel local."}];
        g.innerHTML=cards.map(function(c){return'<div class="neuro-card"><div class="neuro-inner"><div class="neuro-front"><span class="neuro-icon">'+c.icon+'</span><h4 style="color:var(--white)">'+c.title+'</h4><div class="neuro-stat">'+c.stat+'</div><span class="neuro-label">'+c.label+'</span></div><div class="neuro-back"><p>'+c.back+'</p></div></div></div>';}).join('');
    },

    buildDashboard: function() {
        var c=this.$('dashContent'), self=this; if(!c)return;
        var activeR=this.zones.reduce(function(s,z){return s+z.avail;},0);
        c.innerHTML='<div class="ticker-grid" style="margin-bottom:24px"><div class="ticker-card glass"><div class="ticker-val">'+activeR+'</div><div class="ticker-lbl">Available Rickshaws</div></div><div class="ticker-card glass"><div class="ticker-val">127</div><div class="ticker-lbl">Active Campaigns</div></div><div class="ticker-card glass"><div class="ticker-val">350+</div><div class="ticker-lbl">Total Clients</div></div><div class="ticker-card glass"><div class="ticker-val">₹12.5L</div><div class="ticker-lbl">Monthly Revenue</div></div></div><h4 style="color:var(--white);margin-bottom:12px">🛺 Active Rickshaws</h4><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:var(--dark-card)"><th style="padding:10px;text-align:left;color:var(--gray-300)">ID</th><th style="padding:10px;text-align:left;color:var(--gray-300)">Zone</th><th style="padding:10px;text-align:left;color:var(--gray-300)">Status</th><th style="padding:10px;text-align:left;color:var(--gray-300)">GPS</th><th style="padding:10px;text-align:left;color:var(--gray-300)">Daily Eyes</th></tr></thead><tbody>'+this.zones.slice(0,6).map(function(z,i){return'<tr style="border-bottom:1px solid var(--glass-border)"><td style="padding:10px;color:var(--white)">RKS-'+String(i+1).padStart(3,'0')+'</td><td style="padding:10px;color:var(--gray-300)">'+z.name+'</td><td style="padding:10px"><span style="background:rgba(16,185,129,0.2);color:var(--green);padding:3px 10px;border-radius:100px;font-size:10px">active</span></td><td style="padding:10px"><span style="background:rgba(16,185,129,0.2);color:var(--green);padding:3px 10px;border-radius:100px;font-size:10px">online</span></td><td style="padding:10px;color:var(--gray-300)">'+self.fmt(Math.floor(z.eyes/z.ricks))+'</td></tr>';}).join('')+'</tbody></table></div><br><button class="btn btn-primary" onclick="RASAAI.bookViaWhatsApp()">💬 New Booking via WhatsApp</button>';
    },

    buildAffiliate: function() {
        var c=this.$('affiliateContainer'); if(!c)return;
        c.innerHTML='<div class="glass-card" style="max-width:650px;margin:0 auto;padding:40px;text-align:center"><h3 style="color:var(--white)">💰 Earn 10% Commission</h3><p style="color:var(--gray-400);margin:12px 0">Refer a business and earn 10% of their campaign</p><div style="margin:24px 0"><label style="font-weight:600;color:var(--gray-300)">Campaign Budget</label><input type="range" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.updateAffiliate(this.value)" style="width:100%;margin-top:8px"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-500);margin-top:4px"><span>₹5K</span><span>₹5L</span></div></div><div style="font-size:28px;font-weight:800;color:var(--white);margin:16px 0">Your Earning: <strong style="color:var(--cyan-light)" id="affEarn">₹5,000</strong></div><div class="ticker-grid" style="margin:24px 0"><div class="ticker-card glass"><div class="ticker-val">₹25K</div><div class="ticker-lbl">5 Referrals</div></div><div class="ticker-card glass"><div class="ticker-val">₹50K</div><div class="ticker-lbl">10 Referrals</div></div><div class="ticker-card glass"><div class="ticker-val">₹1L</div><div class="ticker-lbl">20 Referrals</div></div></div><button onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary btn-block">Start Referring</button></div>';
    },

    updateAffiliate: function(value) { var e=this.$('affEarn'); if(e)e.textContent='₹'+Math.floor(value*0.1).toLocaleString('en-IN'); },

    buildDriver: function() {
        var c=this.$('driverCard'); if(!c)return;
        c.innerHTML='<h3 style="color:var(--white)">🛺 Driver Onboarding</h3><p style="color:var(--gray-400);font-size:13px;margin-bottom:24px">Join our rickshaw network</p><div class="form-row"><div class="form-group"><label>Driver Name</label><input type="text" placeholder="Full name"></div><div class="form-group"><label>Phone</label><input type="tel" placeholder="+91"></div></div><div class="form-row"><div class="form-group"><label>Vehicle Number</label><input type="text" placeholder="MH-05-XXXX"></div><div class="form-group"><label>Preferred Route</label><select>'+this.routes.map(function(r){return'<option>'+r.name+'</option>';}).join('')+'</select></div></div><button class="btn btn-primary btn-block" onclick="RASAAI.bookViaWhatsApp()">💬 Submit via WhatsApp</button>';
    },

    buildContest: function() {
        var c=this.$('contestContainer'); if(!c)return;
        c.innerHTML='<div class="glass-card" style="max-width:650px;margin:0 auto;padding:40px;text-align:center"><div style="font-size:48px">🏆</div><h3 style="color:var(--white)">Run a Hashtag Contest</h3><div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div><div class="form-group"><label>Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash"></div><div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div><button onclick="RASAAI.launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button></div>';
    },

    launchContest: function() {
        var hash=this.$('contestHash')?.value||'#RasaaiContest', prize=this.$('contestPrizeVal')?.value||'Prize', dur=this.$('contestDuration')?.value||'7 Days', phone=this.$('contestPhone')?.value;
        if(!phone){alert('⚠️ Enter phone number');return;}
        window.open('https://wa.me/'+this.whatsapp+'?text=Hi!%20Contest:%20'+encodeURIComponent(hash)+'%20'+encodeURIComponent(prize)+'%20'+encodeURIComponent(dur)+'%20📞'+phone,'_blank');
        alert('🏆 Contest Request Sent!\n'+hash+'\n'+prize+'\n'+dur);
    },

    buildHeatmap: function() {
        var c=this.$('heatmapContainer'), self=this; if(!c)return;
        c.innerHTML='<div class="heatmap-legend"><span style="color:var(--gray-500)">Low</span><div class="hm-gradient"></div><span style="color:var(--gray-500)">High</span></div>'+this.zones.map(function(z){return'<div class="hm-zone" style="background:rgba(16,185,129,'+(z.cov/150)+')" data-cov="'+z.cov+'"><div class="hm-info"><strong style="color:var(--white)">'+z.name+'</strong><span style="color:var(--gray-400)">'+z.cov+'% | '+z.ricks+' ricks</span></div><div class="hm-track"><div class="hm-fill" style="width:'+z.cov+'%"></div></div></div>';}).join('')+'<div class="hm-slider"><label style="color:var(--gray-300)">Time:</label><input type="range" min="6" max="22" value="12" oninput="RASAAI.updateHeatmap(this.value)" style="flex:1;max-width:300px"><span id="htTime" style="color:var(--white)">12:00</span></div>';
    },

    updateHeatmap: function(hour) {
        var t=this.$('htTime'); if(t)t.textContent=hour+':00';
        document.querySelectorAll('.hm-zone').forEach(function(el){var base=parseInt(el.dataset.cov),h=parseInt(hour),m=1;if(h>=7&&h<=10)m=1.3;else if(h>=17&&h<=20)m=1.4;else if(h>=22||h<=5)m=0.5;var adj=Math.min(100,Math.floor(base*m));el.style.background='rgba(16,185,129,'+(adj/150)+')';var f=el.querySelector('.hm-fill');if(f)f.style.width=adj+'%';});
    },

    buildLeaderboard: function() {
        var c=this.$('leaderboardContainer'), self=this; if(!c)return;
        var s=[...this.zones].sort(function(a,b){return b.eyes-a.eyes;});
        c.innerHTML=s.map(function(z,i){return'<div class="lb-row"><div class="lb-rank">#'+(i+1)+'</div><div class="lb-info"><div class="lb-name">'+z.name+'</div><div class="lb-track"><div class="lb-fill" style="width:'+((z.eyes/s[0].eyes)*100)+'%"></div></div><div class="lb-val">👁️ '+self.fmt(z.eyes)+'/day | 🛺 '+z.ricks+' ricks</div></div></div>';}).join('');
    },

    buildTestimonials: function() {
        var s=this.$('testimonialSlider'); if(!s)return;
        var ts=[{name:"Ahmed Shaikh",biz:"Mumbra Pizza",zone:"Station",text:"Walk-ins 65% up! Best investment.",r:5,init:"AS"},{name:"Dr. Fatima",biz:"Shifa Clinic",zone:"Kausa",text:"120 new patients in 6 months.",r:5,init:"FK"},{name:"Mohammed Ali",biz:"Al-Huda Tuition",zone:"Shilphata",text:"45 new students enrolled.",r:5,init:"MA"},{name:"Rahul Sharma",biz:"Kausa Mart",zone:"Kausa",text:"Visibility doubled.",r:5,init:"RS"},{name:"Priya Patel",biz:"Fashion Hub",zone:"Station",text:"40% sales increase.",r:5,init:"PP"}];
        s.innerHTML='<div class="testimonial-track" id="testTrack">'+ts.map(function(t){return'<div class="testimonial-card glass-card"><div class="stars">'+'⭐'.repeat(t.r)+'</div><p class="quote">"'+t.text+'"</p><div class="author"><div class="avatar">'+t.init+'</div><div><strong style="color:var(--white)">'+t.name+'</strong><p style="font-size:11px;color:var(--gray-500)">'+t.biz+', '+t.zone+'</p></div></div></div>';}).join('')+'</div><div class="slider-nav"><button onclick="document.getElementById(\'testTrack\').scrollBy({left:-340,behavior:\'smooth\'})">←</button><button onclick="document.getElementById(\'testTrack\').scrollBy({left:340,behavior:\'smooth\'})">→</button></div>';
    },

    buildIndustries: function() {
        var g=this.$('industryCards'); if(!g)return;
        var inds=[{icon:"🏪",name:"Retail",desc:"Drive footfall"},{icon:"🍽️",name:"Restaurant",desc:"Hungry commuters"},{icon:"🏥",name:"Clinic",desc:"Patient trust"},{icon:"💊",name:"Pharmacy",desc:"First recalled"},{icon:"🏫",name:"School",desc:"Reach parents"},{icon:"📚",name:"Coaching",desc:"Students daily"},{icon:"🏠",name:"Real Estate",desc:"Neighborhood"},{icon:"💪",name:"Gym",desc:"Commute routes"},{icon:"💇",name:"Salon",desc:"Visible daily"},{icon:"📱",name:"Electronics",desc:"Gadget lovers"},{icon:"💍",name:"Jewelry",desc:"Wedding season"},{icon:"🏦",name:"Bank",desc:"Financial trust"},{icon:"🛡️",name:"Insurance",desc:"Seen=trusted"},{icon:"🚗",name:"Auto",desc:"Commuters"},{icon:"🔧",name:"Hardware",desc:"Found needed"},{icon:"🪑",name:"Furniture",desc:"Home dreams"},{icon:"🎉",name:"Events",desc:"Big day"},{icon:"✈️",name:"Travel",desc:"Vacation"},{icon:"🍲",name:"Catering",desc:"Party orders"},{icon:"🦷",name:"Dentist",desc:"Toothache"}];
        g.innerHTML=inds.map(function(i){return'<div class="industry-card glass-card" onclick="document.getElementById(\'campaignBuilder\').scrollIntoView({behavior:\'smooth\'})"><div class="icon">'+i.icon+'</div><h4>'+i.name+'</h4><p>'+i.desc+'</p></div>';}).join('');
    },

    buildFAQ: function() {
        var c=this.$('faqContainer'); if(!c)return;
        var faq=[{q:"How does AI plan my campaign?",a:"Our AI analyzes your business type, location, budget, and objectives to recommend the optimal zone, rickshaw quantity, and campaign duration for maximum ROI."},{q:"What routes do you cover?",a:"4 strategic routes across Mumbra covering Kausa, Shilphata, Retibunder, Check Naka, Kalwa, Majhiwada, Taloja, Kalyan Phata, Kalsekar, and MM Valley Road."},{q:"How does dynamic pricing work?",a:"₹1,238-1,647/day per rickshaw. AI adjusts prices every 15 minutes based on demand. 10% off on 10+ rickshaws."},{q:"How do I book?",a:"Use our AI Planner or Campaign Builder, then book instantly via WhatsApp. We'll call you back in 5 minutes."}];
        c.innerHTML=faq.map(function(item){return'<div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle(\'active\')"><span>'+item.q+'</span><span class="icon">+</span></button><div class="faq-a"><p>'+item.a+'</p></div></div>';}).join('');
    },

    buildPayment: function() {
        var c=this.$('paymentCard'); if(!c)return;
        var qr=this.qrPool[Math.floor(Math.random()*this.qrPool.length)];
        c.innerHTML='<h3 style="color:var(--white)">💳 Payment Center</h3><p style="color:var(--gray-400);margin:12px 0">Scan QR or pay via UPI</p><div style="background:white;width:200px;height:200px;margin:20px auto;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--dark);font-weight:700">QR Code:<br>'+qr+'</div><p style="color:var(--gray-400);font-size:12px">UPI ID: rasaai@upi</p><div class="form-group"><label>Transaction ID</label><input type="text" placeholder="Enter UPI transaction ID"></div><button class="btn btn-whatsapp btn-block" onclick="RASAAI.bookViaWhatsApp()">💬 Confirm via WhatsApp</button>';
    },

    // ============ AI PLANNER ============
    runAIPlanner: function() {
        var biz=this.$('aiBiz')?.value, loc=this.$('aiLocation')?.value, budget=this.$('aiBudget')?.value, obj=this.$('aiObjective')?.value;
        if(!biz||!loc||!budget||!obj){alert('⚠️ Please fill all fields for AI recommendation');return;}
        var zone=this.zones.find(function(z){return z.name.toLowerCase()===loc.toLowerCase();})||this.zones[0];
        var budgetNum=budget.includes('5K')?10000:budget.includes('50K')?35000:budget.includes('1L')?75000:150000;
        var recommendedRicks=Math.min(Math.floor(budgetNum/(this.currentPrice*30)),zone.ricks);
        var reach=Math.floor((zone.eyes/zone.ricks)*recommendedRicks*30);
        var cpm=(this.currentPrice*recommendedRicks*30)/(reach/1000);
        var visibilityScore=Math.min(100,Math.floor((recommendedRicks/zone.ricks)*zone.cov));
        var result=this.$('aiResult'); if(!result)return;
        result.style.display='block';
        result.innerHTML='<h4 style="color:var(--cyan-light);margin-bottom:12px">🤖 AI Recommendation</h4><div class="ticker-grid" style="margin-bottom:16px"><div class="ticker-card glass"><div class="ticker-val">'+zone.name+'</div><div class="ticker-lbl">Best Zone</div></div><div class="ticker-card glass"><div class="ticker-val">'+recommendedRicks+'</div><div class="ticker-lbl">Rickshaws</div></div><div class="ticker-card glass"><div class="ticker-val">'+this.fmt(reach)+'</div><div class="ticker-lbl">Est. Reach</div></div><div class="ticker-card glass"><div class="ticker-val">₹'+cpm.toFixed(2)+'</div><div class="ticker-lbl">CPM</div></div></div><p style="color:var(--gray-300);font-size:14px">📊 Visibility Score: <strong style="color:var(--green)">'+visibilityScore+'%</strong></p><p style="color:var(--gray-400);font-size:13px;margin-top:8px">AI recommends <strong style="color:var(--white)">'+recommendedRicks+' rickshaws</strong> in <strong style="color:var(--white)">'+zone.name+'</strong> for optimal reach of <strong style="color:var(--white)">'+this.fmt(reach)+'</strong> at <strong style="color:var(--white)">₹'+cpm.toFixed(2)+' CPM</strong>.</p><button class="btn btn-primary btn-block" style="margin-top:16px" onclick="RASAAI.selectPricing(\'led\')">🎯 Book This Campaign</button>';
    },

    // ============ MOCKUP GENERATOR ============
    generateMockup: function() {
        var file=this.$('mockupFile')?.files[0]; if(!file)return;
        var reader=new FileReader(), self=this;
        reader.onload=function(e){
            ['dayCanvas','nightCanvas','roadCanvas','trafficCanvas'].forEach(function(id){
                var canvas=self.$(id); if(!canvas)return;
                var ctx=canvas.getContext('2d'); canvas.width=300; canvas.height=160;
                ctx.fillStyle=id==='nightCanvas'?'#0F0A1A':'#1A1525'; ctx.fillRect(0,0,300,160);
                ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=2; ctx.strokeRect(20,20,260,120);
                var img=new Image(); img.onload=function(){ctx.drawImage(img,30,30,240,100);};
                img.src=e.target.result;
                ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font='14px Inter'; ctx.fillText('YOUR AD',100,50);
                if(id==='nightCanvas'){ctx.fillStyle='rgba(124,58,237,0.3)';ctx.fillRect(0,0,300,160);ctx.fillStyle='#06B6D4';ctx.beginPath();ctx.arc(250,30,20,0,Math.PI*2);ctx.fill();}
            });
        };
        reader.readAsDataURL(file);
    },

    // ============ TIMERS & UPDATES ============
    updateAllPrices: function() { this.currentPrice=this.getPrice(); var hp=this.$('heroPrice'); if(hp)hp.innerHTML='₹'+this.currentPrice.toLocaleString('en-IN')+'<span style="font-size:15px;color:var(--gray-400)">/day</span>'; this.buildPricing(); this.updateBookingEstimate(); },
    startTimers: function() { var self=this, sec=900, el=this.$('priceTimer'); if(el)setInterval(function(){var m=Math.floor(sec/60),s=sec%60;el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');sec--;if(sec<0){sec=900;self.updateAllPrices();}},1000); setInterval(function(){self.updateAllPrices();},900000); },
    startLiveUpdates: function() { var self=this; setInterval(function(){var r=self.$('liveRickshaws');if(r)r.textContent=340+Math.floor(Math.random()*10);var c=self.$('liveCampaigns');if(c)c.textContent=125+Math.floor(Math.random()*8);var e=self.$('liveEyeViews');if(e){var v=parseInt(e.textContent.replace(/,/g,''))||1247893;e.textContent=(v+Math.floor(Math.random()*300)+100).toLocaleString('en-IN');}var b=self.$('liveBookings');if(b)b.textContent=24+Math.floor(Math.random()*5);},5000); },
    startNotifications: function() { var msgs=['🏃 3 businesses booked today','🔥 Mumbra Station: Only 8 left','✅ AI campaign live in Shilphata','💼 Agency booked 15 rickshaws'],i=0,self=this; setInterval(function(){var w=self.$('notifWidget'),t=self.$('notifText');if(w&&t){t.textContent=msgs[i];w.classList.add('show');setTimeout(function(){w.classList.remove('show');},4000);i=(i+1)%msgs.length;}},8000); },
    startCounters: function() { document.querySelectorAll('[data-count]').forEach(function(el){var target=parseInt(el.getAttribute('data-count')),current=0,step=Math.ceil(target/50);var iv=setInterval(function(){current+=step;if(current>=target){current=target;clearInterval(iv);}el.textContent=current>=10000000?(current/10000000).toFixed(1)+'M+':current>=100000?(current/100000).toFixed(1)+'L+':current>=1000?current.toLocaleString('en-IN'):current;},30);}); },
    setupExitIntent: function() { var depth=0,shown=false,self=this; window.addEventListener('scroll',function(){depth=Math.max(depth,(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);}); document.addEventListener('mouseout',function(e){if(!shown&&e.clientY<=0&&depth>50){var p=self.$('exitPopup');if(p)p.classList.add('show');shown=true;setTimeout(function(){shown=false;},300000);}}); },
    setupMobileNav: function() { window.addEventListener('scroll',function(){var h=document.getElementById('desktopHeader');if(h)h.classList.toggle('scrolled',window.scrollY>50);var s=document.getElementById('stickyBar');if(s)s.style.display=window.scrollY>400?'flex':'none';}); },
    closeExitPopup: function() { var p=this.$('exitPopup'); if(p)p.classList.remove('show'); }
};

document.addEventListener('DOMContentLoaded', function() { RASAAI.init(); });
