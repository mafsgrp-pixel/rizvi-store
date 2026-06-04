// RASAAI - Application Core
let DATA = {};

async function loadData() {
    try {
        const res = await fetch('data.json');
        DATA = await res.json();
        initApp();
    } catch(e) {
        console.error('Loading data:', e);
        document.getElementById('loadingScreen').innerHTML = '<p style="color:white">Failed to load. Please refresh.</p>';
    }
}

function fmt(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); }
function img(i) { return DATA.images[i] || DATA.images[0]; }

// BUILD FUNCTIONS
function buildTrustLogos() {
    const t = document.getElementById('trustLogosTrack');
    if(!t) return;
    const logos = ["🏪 Patel General","🏥 Mumbra Clinic","🍽️ Spice Garden","🏫 Oxford Academy","🛒 Kausa Mart","💊 HealthPlus","👗 Fashion Hub","📚 Students Point","🏠 Mumbra Realty","🚗 AutoCare","☕ Chai Point","🍕 Pizza Corner"];
    t.innerHTML = [...logos,...logos].map(l=>`<span class="trust-logo-item">${l}</span>`).join('');
}

function buildRoutes() {
    const g = document.getElementById('routesGrid'); if(!g) return;
    g.innerHTML = DATA.routes.map((r,i) => `
        <div class="route-card" onclick="document.getElementById('zones').scrollIntoView({behavior:'smooth'})">
            <div class="route-card-image" style="background-image:url('${img(r.id==='route1'?0:r.id==='route2'?1:r.id==='route3'?2:3)}')"><div class="route-overlay"></div></div>
            <div class="route-card-body">
                <h4>🛣️ Route ${i+1}</h4>
                <p style="font-size:13px;color:var(--gray-700);margin-bottom:8px">${r.name}</p>
                <div class="route-meta"><span>🛺 ${r.rickshawCount} Rickshaws</span><span>👁️ ${r.dailyEyeViews.toLocaleString('en-IN')} Eyes/Day</span><span>📍 ${r.stops.length} Stops</span></div>
                <div class="route-zones">${r.stops.map(z=>`<span class="route-zone-pill" style="background:var(--yellow-light)">${z}</span>`).join(' → ')}</div>
            </div>
        </div>
    `).join('');
}

function buildZones() {
    const g = document.getElementById('zonesGrid'); if(!g) return;
    g.innerHTML = DATA.zones.map(z => `
        <div class="zone-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})">
            <div class="zone-card-image" style="background-image:url('${img(z.img)}')">
                <span class="zone-availability ${z.available<15?'low':''}">${z.available} Left</span>
            </div>
            <div class="zone-card-body">
                <h4>📍 ${z.name}</h4>
                <div class="zone-meta"><span>👥 ${fmt(z.population)}</span><span>🚶 ${z.traffic}</span><span>🕐 ${z.peak}</span></div>
                <div class="zone-stats">
                    <div class="stat"><div class="val">${z.dailyEyeViews.toLocaleString('en-IN')}</div><div class="lbl">Impressions</div></div>
                    <div class="stat"><div class="val">${z.available}/${z.totalRickshaws}</div><div class="lbl">Available</div></div>
                    <div class="stat"><div class="val">${z.coverage}%</div><div class="lbl">Coverage</div></div>
                </div>
            </div>
        </div>
    `).join('');
}

function buildRickshawTracks() {
    const g = document.getElementById('rickshawTrackGrid'); if(!g) return;
    let h = '';
    for(let i=0; i<6; i++) {
        const z = DATA.zones[i%12];
        const on = Math.random()>0.1, au = Math.random()>0.1?'active':'inactive', le = Math.random()>0.05?'active':'inactive';
        h += `<div class="track-card">
            <div class="track-header"><div class="track-id"><span class="track-dot ${on?'online':'offline'}"></span>RKS-${String(i+1).padStart(3,'0')}</div><span>🔋 ${Math.floor(Math.random()*40)+60}%</span></div>
            <div style="font-weight:600">📍 ${z.name}</div><div class="track-route">🛣️ Active Route</div>
            <div class="track-metrics"><span>👁️ ${fmt(Math.floor(Math.random()*7000)+8000)} views</span><span>📊 ${fmt(Math.floor(Math.random()*5000)+6000)} exp</span></div>
            <div style="display:flex;gap:6px;margin-top:8px"><span class="track-badge ${au}">🔊 ${au}</span><span class="track-badge ${le}">💡 ${le}</span></div>
            ${Math.random()>0.3?'<div style="padding:6px 10px;background:var(--green-light);border-radius:8px;font-size:11px;color:var(--green);margin-top:8px">Active Campaign</div>':'<div style="padding:6px 10px;background:var(--gray-50);border-radius:8px;font-size:11px;color:var(--gray-500);margin-top:8px">Available</div>'}
        </div>`;
    }
    g.innerHTML = h;
}

function buildEyeCalculator() {
    const c = document.getElementById('eyeCalculator'); if(!c) return;
    c.innerHTML = `<h3>👁️ Estimate Your Eye Views</h3>
        <div class="calc-inputs">
            <div class="calc-input-row"><label>Zone</label><select id="ecZone" onchange="RASAAI.updateEyeCalc()"><option value="">All Zones</option>${DATA.zones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div>
            <div class="calc-input-row"><label>Rickshaws</label><input type="range" id="ecRicks" min="1" max="50" value="10" oninput="document.getElementById('ecRicksVal').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecRicksVal" style="font-weight:700">10</span></div>
            <div class="calc-input-row"><label>Days</label><input type="range" id="ecDays" min="7" max="90" value="30" oninput="document.getElementById('ecDaysVal').textContent=this.value;RASAAI.updateEyeCalc()"><span id="ecDaysVal" style="font-weight:700">30</span></div>
        </div>
        <div class="calc-results">
            <div class="calc-result-item"><div class="calc-result-value" id="ecEyes">3,450,000</div><div class="calc-result-label">Eye Views</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="ecReach">2,553,000</div><div class="calc-result-label">Reach</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="ecCost">₹45,000</div><div class="calc-result-label">Est. Cost</div></div>
            <div class="calc-result-item"><div class="calc-result-value" id="ecCPM">₹4.50</div><div class="calc-result-label">CPM</div></div>
        </div>`;
}

function buildNeuroCards() {
    const g = document.getElementById('neuroGrid'); if(!g) return;
    g.innerHTML = DATA.neuro.map(c => `
        <div class="neuro-card"><div class="neuro-inner">
            <div class="neuro-front"><span class="neuro-icon">${c.icon}</span><h4>${c.title}</h4><div class="neuro-stat">${c.stat}</div><span class="neuro-stat-label">${c.label}</span></div>
            <div class="neuro-back"><p>${c.back}</p></div>
        </div></div>
    `).join('');
}

function buildMetrics() {
    const g = document.getElementById('metricsGrid'), d = document.getElementById('metricsDetail');
    if(!g||!d) return;
    g.innerHTML = `<div class="metrics-card primary"><div class="metrics-icon">👁️</div><h3>Eye Views</h3><div class="metrics-value">17.7M+</div><span class="metrics-badge">Proprietary</span></div>
        <div class="metrics-card"><div class="metrics-icon">📊</div><h3>Impressions</h3><div class="metrics-value">28M+</div></div>
        <div class="metrics-card"><div class="metrics-icon">👥</div><h3>Reach</h3><div class="metrics-value">12M+</div></div>`;
    d.innerHTML = `<div class="metric-detail"><div class="label">CPM</div><div class="value">₹4.50</div></div>
        <div class="metric-detail"><div class="label">Recall</div><div class="value">68%</div></div>
        <div class="metric-detail"><div class="label">Attention</div><div class="value">4.2s</div></div>
        <div class="metric-detail"><div class="label" style="color:var(--green)">Skip Rate</div><div class="value" style="color:var(--green)">0%</div></div>`;
}

function buildComparison() {
    const t = document.getElementById('comparisonTabs'); if(!t) return;
    t.innerHTML = `<button class="comp-tab active" onclick="RASAAI.showComparison('instagram',this)">📱 vs Instagram</button>
        <button class="comp-tab" onclick="RASAAI.showComparison('facebook',this)">👍 vs Facebook</button>
        <button class="comp-tab" onclick="RASAAI.showComparison('youtube',this)">▶️ vs YouTube</button>`;
}

function buildAudioPlayer() {
    const c = document.getElementById('audioPlayer'); if(!c) return;
    c.innerHTML = [{icon:"🍽️",title:"Restaurant Ad",type:"restaurant"},{icon:"🏥",title:"Clinic Ad",type:"clinic"},{icon:"🏫",title:"Education Ad",type:"education"}].map(s=>`
        <div class="audio-card" onclick="RASAAI.playAudio('${s.type}')">
            <div class="audio-icon">${s.icon}</div><h4>${s.title}</h4>
            <div class="audio-wave">${'<div class="bar"></div>'.repeat(8)}</div>
            <button class="btn btn-primary btn-sm">▶️ Play Sample</button>
        </div>`).join('');
}

function buildFormatCards() {
    const g = document.getElementById('formatCards'); if(!g) return;
    const f = [{icon:"💡",name:"LED Display",desc:"Bright LED screen. Day & night.",feat:["Full-color","Weatherproof","GPS tracked"],price:"₹1,238-1,647/day",rec:!1},{icon:"🔊",name:"Audio Announcement",desc:"Voice ad through speakers.",feat:["Pro voice-over","Multi-language","60-sec ads"],price:"₹318-639/day",rec:!1},{icon:"⚡",name:"LED + Audio Combo",desc:"85% higher recall.",feat:["Visual+Audio sync","Maximum attention","Best ROI"],price:"₹1,795-2,388/day",rec:!0}];
    g.innerHTML = f.map(f=>`<div class="format-card ${f.rec?'recommended':''}">${f.rec?'<span class="recommended-badge">⭐ Recommended</span>':''}<div class="format-icon">${f.icon}</div><h4>${f.name}</h4><p>${f.desc}</p><ul class="format-features">${f.feat.map(ft=>`<li>${ft}</li>`).join('')}</ul><div class="format-price">${f.price}</div><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block btn-sm" style="margin-top:12px">Choose</button></div>`).join('');
}

function buildCampaignBuilder() {
    const c = document.getElementById('bookingCard'); if(!c) return;
    c.innerHTML = `<h3>📋 Build Your Campaign</h3><p style="color:var(--gray-500);font-size:13px;margin-bottom:24px">Book instantly via WhatsApp. We'll call back in 5 minutes.</p>
        <div class="form-row"><div class="form-group"><label>Campaign Name</label><input type="text" id="cbName" placeholder="e.g., Mumbra Pizza Promo"></div>
        <div class="form-group"><label>Campaign Type</label><select id="cbType" onchange="RASAAI.updateBookingEstimate()"><option value="led">LED Campaign</option><option value="audio">Audio Campaign</option><option value="combo">Combo</option></select></div></div>
        <div class="form-row"><div class="form-group"><label>Route</label><select id="cbRoute" onchange="RASAAI.updateBookingEstimate()">${DATA.routes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label>Rickshaws</label><select id="cbRicks" onchange="RASAAI.updateBookingEstimate()"><option value="1">1</option><option value="5">5</option><option value="10">10 (10% off)</option><option value="20">20 (10% off)</option></select></div></div>
        <div class="form-row"><div class="form-group"><label>Duration</label><select id="cbDuration" onchange="RASAAI.updateBookingEstimate()"><option value="1">1 Day</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div>
        <div class="form-group"><label>Your Phone *</label><input type="tel" id="cbPhone" required placeholder="+91"></div></div>
        <div class="price-summary" id="priceSummary"></div>
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap"><button class="btn btn-whatsapp btn-lg" style="flex:1" onclick="RASAAI.bookViaWhatsApp()">💬 Book via WhatsApp</button><a href="tel:+919594306625" class="btn btn-primary btn-lg" style="flex:1">📞 Call Now</a></div>`;
}

function buildPricing() {
    const g = document.getElementById('pricingGrid'); if(!g) return;
    const p = RASAAI.getPrice(), a = Math.floor(p*0.3), co = Math.floor(p*1.45);
    g.innerHTML = `<div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹${p.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED Screen</li><li>GPS tracked</li><li>Real analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get LED</button></div>
    <div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹${a.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>Bluetooth speaker</li><li>60-sec ads</li><li>Zone targeting</li><li>10% off 10+</li><li>💰 Most affordable</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get Audio</button></div>
    <div class="pricing-card"><h4>🔥 Combo</h4><div class="price">₹${co.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED + Audio</li><li>Max visibility</li><li>Full analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Get Combo</button></div>`;
}

function buildInventory() {
    const g = document.getElementById('inventoryGrid'); if(!g) return;
    g.innerHTML = DATA.zones.slice(0,8).map(z => {
        const s = z.available<10?'critical':z.available<20?'low':'good';
        const m = {critical:'⚠️ Almost gone!',low:'⚡ Selling fast',good:'✅ Available'};
        return `<div class="inventory-card"><h4>📍 ${z.name}</h4><div class="inventory-stock ${s}"><span class="number">${z.available}</span><span class="label">left</span></div><div class="inventory-bar"><div class="inventory-bar-fill" style="width:${z.coverage}%"></div></div><span class="inventory-status ${s}">${m[s]}</span></div>`;
    }).join('');
}

function buildROICalc() {
    const c = document.getElementById('roiCalc'); if(!c) return;
    c.innerHTML = `<h3>🧮 ROI Calculator</h3><div class="calc-inputs"><div class="calc-input-row"><label>Business</label><select id="roiBiz" onchange="RASAAI.updateROICalc()"><option value="retail">Retail</option><option value="restaurant">Restaurant</option><option value="clinic">Clinic</option></select></div><div class="calc-input-row"><label>Zone</label><select id="roiZone" onchange="RASAAI.updateROICalc()">${DATA.zones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}</select></div><div class="calc-input-row"><label>Budget</label><input type="range" id="roiBudget" min="5000" max="500000" value="50000" step="5000" oninput="document.getElementById('roiBudgetVal').textContent='₹'+parseInt(this.value).toLocaleString('en-IN');RASAAI.updateROICalc()"><span id="roiBudgetVal" style="font-weight:700">₹50,000</span></div></div><div class="calc-results"><div class="calc-result-item"><div class="calc-result-value" id="roiEyes">--</div><div class="calc-result-label">Eye Views</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiFoot">--</div><div class="calc-result-label">Footfall ↑</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiCust">--</div><div class="calc-result-label">New Customers</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiRev">--</div><div class="calc-result-label">Revenue</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiROI">--</div><div class="calc-result-label">ROI</div></div><div class="calc-result-item"><div class="calc-result-value" id="roiBE">--</div><div class="calc-result-label">Break-even</div></div></div>`;
}

function buildCaseStudies() {
    const g = document.getElementById('caseStudiesGrid'); if(!g) return;
    const cs = [{biz:"Spice Garden",type:"Restaurant",zone:"Kausa",d:"30d",b:"₹15K",r1:"45%",l1:"Footfall",r2:"467%",l2:"ROI",r3:"72%",l3:"Recall",q:"Dinner crowd doubled in 2 weeks!",o:"Ahmed Siddiqui"},{biz:"Mumbra Dental",type:"Clinic",zone:"Station",d:"45d",b:"₹22K",r1:"38%",l1:"Patients",r2:"445%",l2:"ROI",r3:"68%",l3:"Recall",q:"Audio ads near station incredibly effective.",o:"Dr. Fatima Khan"},{biz:"Shilphata Ind.",type:"B2B",zone:"Shilphata",d:"60d",b:"₹35K",r1:"55%",l1:"Inquiries",r2:"900%",l2:"ROI",r3:"64%",l3:"Recall",q:"Reached managers who don't use social media.",o:"Rajesh Patil"}];
    g.innerHTML = cs.map(c=>`<div class="case-card"><div class="case-header"><span style="font-weight:700;color:var(--orange)">Case Study</span><span class="case-tag">${c.type}</span></div><h3>${c.biz}</h3><div style="display:flex;gap:12px;margin:8px 0;font-size:12px;color:var(--gray-500)"><span>📍 ${c.zone}</span><span>⏱️ ${c.d}</span><span>💰 ${c.b}</span></div><div class="case-results"><div class="case-result"><div class="val">${c.r1}</div><div class="lbl">${c.l1}</div></div><div class="case-result"><div class="val">${c.r2}</div><div class="lbl">${c.l2}</div></div><div class="case-result"><div class="val">${c.r3}</div><div class="lbl">${c.l3}</div></div></div><blockquote class="case-quote">"${c.q}"<cite>— ${c.o}</cite></blockquote></div>`).join('');
}

function buildIndustries() {
    const g = document.getElementById('industryCards'); if(!g) return;
    g.innerHTML = DATA.industries.map(i=>`<div class="industry-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})"><div class="icon">${i.icon}</div><h4>${i.name}</h4><p>${i.desc}</p></div>`).join('');
}

function buildTestimonials() {
    const s = document.getElementById('testimonialSlider'); if(!s) return;
    s.innerHTML = `<div class="testimonial-track" id="testTrack">${DATA.testimonials.map(t=>`<div class="testimonial-card"><div class="stars">${'⭐'.repeat(t.rating)}</div><p class="quote">"${t.text}"</p><div class="author"><div class="avatar">${t.init}</div><div><strong>${t.name}</strong><p style="font-size:11px;color:var(--gray-500)">${t.biz}, ${t.zone}</p></div></div></div>`).join('')}</div><div class="slider-nav"><button onclick="document.getElementById('testTrack').scrollBy({left:-340,behavior:'smooth'})">←</button><button onclick="document.getElementById('testTrack').scrollBy({left:340,behavior:'smooth'})">→</button></div>`;
}

function buildVideos() {
    const g = document.getElementById('videoGrid'); if(!g) return;
    g.innerHTML = [{t:"Rickshaw LED Ad",img:6},{t:"Campaign Success",img:7},{t:"Audio Ad Demo",img:8},{t:"Coverage Map",img:9}].map(v=>`<div class="video-card" onclick="RASAAI.openVideo('dQw4w9WgXcQ')"><div class="video-thumb" style="background-image:url('${img(v.img)}')"><div class="play-btn">▶️</div></div><div class="video-body"><h4>${v.t}</h4></div></div>`).join('');
}

function buildHeatmap() {
    const c = document.getElementById('heatmapContainer'); if(!c) return;
    c.innerHTML = `<div class="heatmap-legend"><span>Low</span><div class="heatmap-gradient-bar"></div><span>High</span></div>${DATA.zones.map(z=>`<div class="heatmap-zone" style="background:rgba(0,168,107,${z.coverage/150})" data-cov="${z.coverage}"><div class="heatmap-zone-info"><strong>${z.name}</strong><span>${z.coverage}% | ${z.totalRickshaws} ricks</span></div><div class="heatmap-bar-track"><div class="heatmap-bar-fill" style="width:${z.coverage}%"></div></div></div>`).join('')}<div class="heatmap-time-slider"><label>Time:</label><input type="range" min="6" max="22" value="12" oninput="RASAAI.updateHeatmap(this.value)"><span id="htTime">12:00</span></div>`;
}

function buildLeaderboard() {
    const c = document.getElementById('leaderboardContainer'); if(!c) return;
    const s = [...DATA.zones].sort((a,b)=>b.dailyEyeViews-a.dailyEyeViews);
    c.innerHTML = s.map((z,i)=>`<div class="lb-row"><div class="lb-rank">#${i+1}</div><div class="lb-info"><div class="lb-name">${z.name}</div><div class="lb-bar-track"><div class="lb-bar-fill" style="width:${(z.dailyEyeViews/s[0].dailyEyeViews)*100}%"></div></div><div class="lb-value">👁️ ${z.dailyEyeViews.toLocaleString('en-IN')}/day | 🛺 ${z.totalRickshaws} ricks</div></div></div>`).join('');
}

function buildAffiliate() {
    const c = document.getElementById('affiliateContainer'); if(!c) return;
    c.innerHTML = `<div class="affiliate-card"><h3>💰 Earn 10% Commission</h3><p style="color:var(--gray-600);margin:12px 0">Refer a business and earn 10% of their campaign</p><div class="affiliate-slider"><label style="font-weight:600">Campaign Budget</label><input type="range" min="5000" max="500000" value="50000" step="5000" oninput="RASAAI.updateAffiliate(this.value)"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-500);margin-top:4px"><span>₹5K</span><span>₹5L</span></div></div><div class="affiliate-earning">Your Earning: <strong id="affEarn">₹5,000</strong></div><div class="affiliate-tiers"><div class="tier-card"><div class="tier-val">₹25K</div><div>5 Refs</div></div><div class="tier-card"><div class="tier-val">₹50K</div><div>10 Refs</div></div><div class="tier-card"><div class="tier-val">₹1L</div><div>20 Refs</div></div></div><button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" class="btn btn-primary btn-block">Start Referring</button></div>`;
}

function buildContest() {
    const c = document.getElementById('contestContainer'); if(!c) return;
    c.innerHTML = `<div class="contest-card"><div style="font-size:48px">🏆</div><h3>Run a Hashtag Contest</h3><div class="form-group"><label>Hashtag</label><input type="text" id="contestHash" value="#RasaaiContest"></div><div class="form-group"><label>Prize</label><input type="text" id="contestPrizeVal" value="₹5,000 Cash"></div><div class="form-group"><label>Duration</label><select id="contestDuration"><option>7 Days</option><option>15 Days</option><option>30 Days</option></select></div><div class="form-group"><label>Your Phone *</label><input type="tel" id="contestPhone" required placeholder="+91"></div><button onclick="RASAAI.launchContest()" class="btn btn-primary btn-block btn-lg">🚀 Launch Contest</button></div>`;
}

function buildHashtag() {
    const c = document.getElementById('hashtagContainer'); if(!c) return;
    c.innerHTML = `<div style="text-align:center;background:var(--white);border-radius:var(--radius-2xl);padding:32px;box-shadow:var(--shadow-md)"><div style="font-size:48px">📱</div><h3>Live Tracking</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0"><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--orange)" id="htMentions">247</div><div style="font-size:11px;color:var(--gray-500)">Mentions</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--purple)">1.2K</div><div style="font-size:11px;color:var(--gray-500)">Engagement</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--green)">89%</div><div style="font-size:11px;color:var(--gray-500)">Positive</div></div><div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md);text-align:center"><div style="font-size:24px;font-weight:800;color:var(--navy)">₹0.42</div><div style="font-size:11px;color:var(--gray-500)">Cost/Eng.</div></div></div></div>`;
}

function buildFAQ() {
    const c = document.getElementById('faqContainer'); if(!c) return;
    c.innerHTML = DATA.faq.map(item=>`<div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('active')"><span>${item.q}</span><span class="icon">+</span></button><div class="faq-a"><p>${item.a}</p></div></div>`).join('');
}

function initApp() {
    buildTrustLogos(); buildRoutes(); buildZones(); buildRickshawTracks();
    buildEyeCalculator(); buildNeuroCards(); buildMetrics(); buildComparison();
    buildAudioPlayer(); buildFormatCards(); buildCampaignBuilder(); buildPricing();
    buildInventory(); buildROICalc(); buildCaseStudies(); buildIndustries();
    buildTestimonials(); buildVideos(); buildHeatmap(); buildLeaderboard();
    buildAffiliate(); buildContest(); buildHashtag(); buildFAQ();
    
    setTimeout(()=>{
        const l=document.getElementById('loadingScreen');
        if(l){l.classList.add('hidden');setTimeout(()=>l.remove(),500);}
    },800);
}

document.addEventListener('DOMContentLoaded', loadData);
