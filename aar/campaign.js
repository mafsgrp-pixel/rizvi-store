// ============================================
// RASAAI - Campaign & Interaction Engine
// WhatsApp Booking | Dynamic Pricing | All Interactive
// ============================================

const RASAAI = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    currentPrice: 1238,
    priceInterval: null,
    liveInterval: null,
    notifInterval: null,
    exitShown: false,
    scrollDepth: 0,

    // DYNAMIC PRICING
    getPrice: function() {
        const cycle = Date.now() / 900000 * Math.PI;
        const demand = Math.sin(cycle) * 0.5 + 0.5;
        const noise = Math.random() * 0.08;
        return Math.floor(1238 + (1647 - 1238) * (demand * 0.65 + noise));
    },

    updateAllPrices: function() {
        this.currentPrice = this.getPrice();
        const hp = document.getElementById('heroPrice');
        if (hp) hp.innerHTML = `₹${this.currentPrice.toLocaleString('en-IN')}<span>/day</span>`;
        buildPricing();
        this.updateBookingEstimate();
        this.updateEyeCalc();
    },

    startPriceTimer: function() {
        let sec = 900;
        const el = document.getElementById('priceTimer');
        if (!el) return;
        this.priceInterval = setInterval(() => {
            const m = Math.floor(sec/60), s = sec%60;
            el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            sec--;
            if (sec < 0) { sec = 900; this.updateAllPrices(); }
        }, 1000);
        setInterval(() => this.updateAllPrices(), 900000);
    },

    // WHATSAPP BOOKING
    bookViaWhatsApp: function() {
        const name = document.getElementById('cbName')?.value || 'Customer';
        const type = document.getElementById('cbType')?.value || 'led';
        const routeEl = document.getElementById('cbRoute');
        const route = routeEl?.options[routeEl?.selectedIndex]?.text || 'Route';
        const ricks = document.getElementById('cbRicks')?.value || '1';
        const duration = document.getElementById('cbDuration')?.value || '1';
        const phone = document.getElementById('cbPhone')?.value || '';
        const typeNames = {led:'LED Campaign', audio:'Audio Campaign', combo:'Combo'};
        let rate = this.currentPrice;
        if (type==='audio') rate = Math.floor(this.currentPrice*0.3);
        if (type==='combo') rate = Math.floor(this.currentPrice*1.45);
        const total = rate * parseInt(ricks) * parseInt(duration);
        
        const msg = `Hi RASAAI! 🛺%0A%0AI want to book:%0A📋 ${name}%0A🎯 ${typeNames[type]}%0A🛣️ ${route}%0A🛺 ${ricks} Rickshaws%0A📅 ${duration} Days%0A💰 Est: ₹${total.toLocaleString('en-IN')}%0A📞 ${phone}`;
        window.open(`https://wa.me/${this.whatsapp}?text=${msg}`, '_blank');
    },

    // BOOKING ESTIMATE
    updateBookingEstimate: function() {
        const s = document.getElementById('priceSummary'); if(!s) return;
        const type = document.getElementById('cbType')?.value||'led';
        const r = parseInt(document.getElementById('cbRicks')?.value||1);
        const d = parseInt(document.getElementById('cbDuration')?.value||1);
        let rate = this.currentPrice;
        if(type==='audio') rate=Math.floor(this.currentPrice*0.3);
        if(type==='combo') rate=Math.floor(this.currentPrice*1.45);
        const sub = rate*r*d, disc = r>=10?Math.floor(sub*0.1):0, tot = sub-disc;
        s.innerHTML = `<div class="row"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>${disc>0?`<div class="row"><span>10% Discount</span><span style="color:var(--green)">-₹${disc.toLocaleString('en-IN')}</span></div>`:''}<div class="row total"><span>Total</span><span>₹${tot.toLocaleString('en-IN')}</span></div>`;
    },

    // EYE CALCULATOR
    updateEyeCalc: function() {
        const zid = document.getElementById('ecZone')?.value;
        const r = parseInt(document.getElementById('ecRicks')?.value||10);
        const d = parseInt(document.getElementById('ecDays')?.value||30);
        let avg=11500; if(zid){const z=DATA.zones.find(x=>x.id===zid);if(z)avg=z.dailyEyeViews/z.totalRickshaws;}
        const eyes=avg*r*d, cost=this.currentPrice*r*d;
        const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
        set('ecEyes',fmt(eyes)); set('ecReach',fmt(Math.floor(eyes*0.74)));
        set('ecCost','₹'+cost.toLocaleString('en-IN')); set('ecCPM','₹'+(cost/(eyes/1000)).toFixed(2));
    },

    // ROI CALCULATOR
    updateROICalc: function() {
        const zid = document.getElementById('roiZone')?.value||'kausa';
        const budget = parseInt(document.getElementById('roiBudget')?.value||50000);
        const z = DATA.zones.find(x=>x.id===zid)||DATA.zones[0];
        const ricks = Math.min(Math.floor(budget/(this.currentPrice*30)),z.totalRickshaws);
        const cost=ricks*this.currentPrice*30;
        const eyes=(z.dailyEyeViews/z.totalRickshaws)*ricks*30;
        const biz=document.getElementById('roiBiz')?.value||'retail';
        const rates={retail:0.025,restaurant:0.035,clinic:0.02};
        const txns={retail:500,restaurant:300,clinic:800};
        const conv=rates[biz]||0.02, foot=Math.floor(eyes*conv), cust=Math.floor(foot*0.3), rev=cust*(txns[biz]||500);
        const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
        set('roiEyes',fmt(eyes)); set('roiFoot','+'+foot+'%'); set('roiCust',cust.toLocaleString('en-IN'));
        set('roiRev','₹'+rev.toLocaleString('en-IN')); set('roiROI',cost>0?Math.floor((rev-cost)/cost*100)+'%':'--');
        set('roiBE',rev>0?Math.ceil(cost/(rev/30))+' days':'--');
    },

    // COMPARISON
    showComparison: function(platform, btn) {
        document.querySelectorAll('.comp-tab').forEach(t=>t.classList.remove('active'));
        if(btn) btn.classList.add('active');
        const data = DATA.comparisons[platform];
        const c = document.getElementById('comparisonContent'); if(!c) return;
        c.innerHTML = `<table class="comp-table"><thead><tr><th>Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead><tbody>${data.map(r=>`<tr><td><strong>${r[0]}</strong></td><td class="win">${r[1]}</td><td class="${r[2].startsWith('✅')?'win':'lose'}">${r[2]}</td></tr>`).join('')}</tbody></table>`;
    },

    // AUDIO
    playAudio: function(type) {
        try {
            const ctx = new (window.AudioContext||window.webkitAudioContext)();
            const o=ctx.createOscillator(), g=ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = {restaurant:520, clinic:440, education:660}[type]||500;
            g.gain.value=0.15; o.start();
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+2);
            o.stop(ctx.currentTime+2);
        } catch(e) { alert('🔊 Playing sample beep. Replace with MP3.'); }
    },

    // VIDEO
    openVideo: function(id) {
        const m=document.getElementById('videoModal'), e=document.getElementById('videoEmbed');
        if(!m||!e) return;
        e.innerHTML=`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        m.classList.add('show'); document.body.style.overflow='hidden';
    },
    closeVideoModal: function() {
        const m=document.getElementById('videoModal'), e=document.getElementById('videoEmbed');
        if(m) m.classList.remove('show'); if(e) e.innerHTML=''; document.body.style.overflow='';
    },

    // HEATMAP
    updateHeatmap: function(hour) {
        const t=document.getElementById('htTime'); if(t) t.textContent=hour+':00';
        document.querySelectorAll('.heatmap-zone').forEach(el=>{
            const base=parseInt(el.dataset.cov), h=parseInt(hour);
            let m=1; if(h>=7&&h<=10) m=1.3; else if(h>=17&&h<=20) m=1.4; else if(h>=22||h<=5) m=0.5;
            const adj=Math.min(100,Math.floor(base*m));
            el.style.background=`rgba(0,168,107,${adj/150})`;
            const f=el.querySelector('.heatmap-bar-fill'); if(f) f.style.width=adj+'%';
        });
    },

    // AFFILIATE
    updateAffiliate: function(value) {
        const e=document.getElementById('affEarn'); if(e) e.textContent='₹'+Math.floor(value*0.1).toLocaleString('en-IN');
    },

    // CONTEST
    launchContest: function() {
        const hash=document.getElementById('contestHash')?.value||'#RasaaiContest';
        const prize=document.getElementById('contestPrizeVal')?.value||'Prize';
        const dur=document.getElementById('contestDuration')?.value||'7 Days';
        const phone=document.getElementById('contestPhone')?.value;
        if(!phone){alert('⚠️ Enter phone number');return;}
        window.open(`https://wa.me/${this.whatsapp}?text=Hi!%20I%20want%20to%20launch:%20${encodeURIComponent(hash)}%20-%20${encodeURIComponent(prize)}%20-%20${encodeURIComponent(dur)}%20📞${phone}`,'_blank');
        alert(`🏆 Contest Request Sent!\n${hash}\n${prize}\n${dur}`);
    },

    // LIVE UPDATES
    startLiveUpdates: function() {
        this.liveInterval = setInterval(() => {
            const r=document.getElementById('liveRickshaws'); if(r) r.textContent=340+Math.floor(Math.random()*10);
            const c=document.getElementById('liveCampaigns'); if(c) c.textContent=125+Math.floor(Math.random()*8);
            const e=document.getElementById('liveEyeViews'); if(e){const v=parseInt(e.textContent.replace(/,/g,''))||1247893;e.textContent=(v+Math.floor(Math.random()*300)+100).toLocaleString('en-IN');}
            const m=document.getElementById('htMentions'); if(m) m.textContent=247+Math.floor(Math.random()*8);
        },5000);
    },

    startNotifications: function() {
        const msgs=['🏃 3 businesses booked Kausa today','🔥 Mumbra Station: Only 8 left','✅ New campaign in Shilphata','💼 Agency booked 15 rickshaws','⚡ Check Naka available'];
        let i=0;
        this.notifInterval = setInterval(()=>{
            const w=document.getElementById('notificationWidget'),t=document.getElementById('notificationText');
            if(w&&t){t.textContent=msgs[i];w.classList.add('show');setTimeout(()=>w.classList.remove('show'),4000);i=(i+1)%msgs.length;}
        },8000);
    },

    // COUNTERS
    startCounters: function() {
        document.querySelectorAll('[data-count]').forEach(el=>{
            const target=parseInt(el.getAttribute('data-count')); let current=0;
            const step=Math.ceil(target/50);
            const iv=setInterval(()=>{current+=step;if(current>=target){current=target;clearInterval(iv);}
                el.textContent=current>=10000000?(current/10000000).toFixed(1)+'M+':current>=100000?(current/100000).toFixed(1)+'L+':current>=1000?current.toLocaleString('en-IN'):current;
            },30);
        });
    },

    // EXIT INTENT
    setupExitIntent: function() {
        window.addEventListener('scroll',()=>{this.scrollDepth=Math.max(this.scrollDepth,(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100);});
        document.addEventListener('mouseout',e=>{if(!this.exitShown&&e.clientY<=0&&this.scrollDepth>50){document.getElementById('exitPopup')?.classList.add('show');this.exitShown=true;setTimeout(()=>this.exitShown=false,300000);}});
    },

    // MOBILE
    setupMobileNav: function() {
        window.addEventListener('scroll',()=>{
            const h=document.getElementById('desktopHeader'); if(h) h.classList.toggle('scrolled',window.scrollY>50);
            const s=document.getElementById('stickyBar'); if(s) s.style.display=window.scrollY>400?'flex':'none';
        });
    },

    // MAP
    buildMap: function() {
        const container=document.getElementById('coverageMap');
        if(!container||typeof L==='undefined') return;
        const map=L.map('coverageMap').setView([19.1800,73.0400],12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:18}).addTo(map);
        const colors=['#2196F3','#4CAF50','#F44336','#FF9800'];
        DATA.routes.forEach((r,i)=>{if(r.coordinates&&r.coordinates.length>1){L.polyline(r.coordinates.map(c=>[c.lat,c.lng]),{color:colors[i],weight:3,opacity:0.7}).addTo(map).bindPopup(`<b>${r.name}</b><br>🛺 ${r.rickshawCount} rickshaws`);}});
        DATA.zones.forEach(z=>{const color=z.available<15?'#E74C3C':z.coverage>80?'#00A86B':'#FFB800';L.circleMarker([z.lat,z.lng],{radius:Math.sqrt(z.totalRickshaws)*1.2,fillColor:color,color:'#fff',weight:2,fillOpacity:0.8}).addTo(map).bindPopup(`<b>${z.name}</b><br>🛺 ${z.totalRickshaws} rickshaws<br>👁️ ${z.dailyEyeViews.toLocaleString('en-IN')}/day<br>${z.available} available`);});
        const allCoords=DATA.zones.map(z=>[z.lat,z.lng]); if(allCoords.length) map.fitBounds(allCoords,{padding:[30,30]});
    },

    // INIT
    init: function() {
        this.currentPrice=this.getPrice();
        this.updateAllPrices();
        this.startPriceTimer();
        this.startLiveUpdates();
        this.startNotifications();
        this.startCounters();
        this.setupExitIntent();
        this.setupMobileNav();
        this.buildMap();
        setTimeout(()=>{this.updateEyeCalc();this.updateROICalc();this.updateBookingEstimate();},500);
        console.log('✅ RASAAI Ready | 📞 +919594306625 | 💰 ₹'+this.currentPrice+'/day');
    }
};

document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>RASAAI.init(),300));
window.RASAAI=RASAAI;
