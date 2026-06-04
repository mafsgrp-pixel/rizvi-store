// ============================================
// Rasaai OS - AI-Powered Application Engine
// ============================================

const CONFIG = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    priceMin: 1238,
    priceMax: 1647,
    refreshMinutes: 15,
    qrCodes: [
        { id: "qr1", name: "Google Pay", upi: "rasaai@upi", icon: "📱" },
        { id: "qr2", name: "PhonePe", upi: "rasaai@phonepe", icon: "💳" },
        { id: "qr3", name: "Paytm", upi: "rasaai@paytm", icon: "📲" }
    ],
    zones: {
        kausa: { name: "Kausa", reach: 125000, ricks: 85, multiplier: 1.0 },
        station: { name: "Mumbra Station", reach: 220000, ricks: 120, multiplier: 1.8 },
        shilphata: { name: "Shilphata", reach: 155000, ricks: 65, multiplier: 1.3 },
        retibunder: { name: "Retibunder", reach: 75000, ricks: 50, multiplier: 0.8 }
    },
    aiRecommendations: {
        retail: { bestZone: "kausa", ricks: 15, cpm: 4.2, reason: "High footfall market area" },
        restaurant: { bestZone: "station", ricks: 10, cpm: 3.8, reason: "Peak hungry commuter traffic" },
        clinic: { bestZone: "kausa", ricks: 8, cpm: 5.0, reason: "Residential area with families" },
        education: { bestZone: "shilphata", ricks: 12, cpm: 4.5, reason: "School & college routes" },
        realestate: { bestZone: "retibunder", ricks: 20, cpm: 3.5, reason: "Developing area visibility" },
        salon: { bestZone: "station", ricks: 5, cpm: 6.0, reason: "High visibility to commuters" },
        gym: { bestZone: "shilphata", ricks: 8, cpm: 4.8, reason: "Morning/evening peak hours" },
        electronics: { bestZone: "kausa", ricks: 10, cpm: 4.0, reason: "Market shopping zone" }
    }
};

let currentPrice = 1400;
let selectedQR = null;

// ============ HELPERS ============
function $(id) { return document.getElementById(id); }
function fmt(n) { return n>=10000000?(n/10000000).toFixed(1)+'M':n>=100000?(n/100000).toFixed(1)+'L':n>=1000?n.toLocaleString('en-IN'):String(n); }
function scrollToSection(id) { const el = $(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
function toast(msg) { const t=$('toastMsg'),w=$('notificationToast'); if(t&&w){t.textContent=msg;w.classList.add('show');setTimeout(()=>w.classList.remove('show'),3000);} }

// ============ AI PLANNER ============
function runAIPlanner() {
    const business = $('aiBusiness').value;
    const location = $('aiLocation').value;
    const budget = $('aiBudget').value;
    const objective = $('aiObjective').value;
    const duration = parseInt($('aiDuration').value) || 30;

    if (!business || !location || !budget) {
        toast('⚠️ Please fill all fields for AI recommendation');
        return;
    }

    const rec = CONFIG.aiRecommendations[business] || CONFIG.aiRecommendations.retail;
    const zone = CONFIG.zones[rec.bestZone] || CONFIG.zones.kausa;
    const estReach = zone.reach * rec.ricks * (duration / 30);
    const estImpressions = estReach * 1.6;
    const estCost = rec.ricks * currentPrice * duration;
    const estCPM = (estCost / (estReach / 1000)).toFixed(1);

    const result = $('aiResult');
    result.style.display = 'block';
    result.innerHTML = `
        <h4>🤖 AI Recommendation for ${business.replace(/_/g,' ')}</h4>
        <p style="color:var(--gray-400);margin-bottom:16px">📝 ${rec.reason}</p>
        <div class="ai-rec">
            <div class="rec-item"><div class="rec-val">${rec.bestZone}</div><div class="rec-lbl">Best Zone</div></div>
            <div class="rec-item"><div class="rec-val">${rec.ricks} Rickshaws</div><div class="rec-lbl">Recommended</div></div>
            <div class="rec-item"><div class="rec-val">${fmt(estReach)}</div><div class="rec-lbl">Est. Reach</div></div>
            <div class="rec-item"><div class="rec-val">${fmt(estImpressions)}</div><div class="rec-lbl">Impressions</div></div>
            <div class="rec-item"><div class="rec-val">₹${estCPM}</div><div class="rec-lbl">CPM</div></div>
            <div class="rec-item"><div class="rec-val">₹${(estCost/1000).toFixed(1)}K</div><div class="rec-lbl">Est. Cost</div></div>
        </div>
        <button onclick="scrollToSection('book')" class="btn btn-primary btn-block" style="margin-top:16px">📋 Book This Campaign</button>
    `;
}

// ============ CALCULATOR ============
function updateCalculator() {
    const zoneId = $('calcZone').value;
    const ricks = parseInt($('calcRicks').value) || 10;
    const days = parseInt($('calcDays').value) || 30;
    const zone = CONFIG.zones[zoneId] || CONFIG.zones.kausa;
    const reach = Math.floor((zone.reach / zone.ricks) * ricks * days);
    const impressions = Math.floor(reach * 1.6);
    const cost = ricks * currentPrice * days;
    const cpm = (cost / (reach / 1000)).toFixed(1);

    $('calcReach').textContent = fmt(reach);
    $('calcImpressions').textContent = fmt(impressions);
    $('calcCost').textContent = '₹' + cost.toLocaleString('en-IN');
    $('calcCPM').textContent = '₹' + cpm;
}

// ============ PRICING ENGINE ============
function getDynamicPrice() {
    const cycle = Date.now() / (CONFIG.refreshMinutes * 60000) * Math.PI;
    return Math.floor(CONFIG.priceMin + (CONFIG.priceMax - CONFIG.priceMin) * (Math.sin(cycle) * 0.5 + 0.5 + Math.random() * 0.08));
}

function updatePrices() {
    currentPrice = getDynamicPrice();
    buildPricingCards();
    updateCalculator();
}

function buildPricingCards() {
    const g = $('pricingGrid'); if(!g) return;
    const p = currentPrice, a = Math.floor(p*0.3), co = Math.floor(p*1.45);
    g.innerHTML = `
        <div class="pricing-card"><h4>📺 LED Campaign</h4><div class="price">₹${p.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED Screen on rickshaw</li><li>GPS tracked</li><li>Real-time analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="scrollToSection('book')" class="btn btn-primary btn-block">Choose LED</button></div>
        <div class="pricing-card featured"><h4>🔊 Audio Campaign</h4><div class="price">₹${a.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>Bluetooth speaker</li><li>60-sec ads</li><li>Zone targeting</li><li>10% off 10+</li><li>💰 Most affordable</li></ul><button onclick="scrollToSection('book')" class="btn btn-primary btn-block">Choose Audio</button></div>
        <div class="pricing-card"><h4>🔥 Combo</h4><div class="price">₹${co.toLocaleString('en-IN')}<span>/day</span></div><ul class="pricing-features"><li>LED + Audio</li><li>Max visibility</li><li>Full analytics</li><li>10% off 10+</li><li>🎁 FREE 30 Creatives</li></ul><button onclick="scrollToSection('book')" class="btn btn-primary btn-block">Choose Combo</button></div>
    `;
}

// ============ QR PAYMENT ============
function buildQRGrid() {
    const g = $('qrGrid'); if(!g) return;
    g.innerHTML = CONFIG.qrCodes.map(qr => `
        <div class="qr-card" onclick="selectQR('${qr.id}')" id="qr-${qr.id}">
            <div class="qr-icon">${qr.icon}</div>
            <div class="qr-name">${qr.name}</div>
            <div style="font-size:10px;color:var(--gray-500)">${qr.upi}</div>
        </div>
    `).join('');
}

function selectQR(qrId) {
    document.querySelectorAll('.qr-card').forEach(c => c.classList.remove('selected'));
    const card = document.getElementById('qr-' + qrId);
    if(card) card.classList.add('selected');
    selectedQR = CONFIG.qrCodes.find(q => q.id === qrId);
    updateBookingSummary();
}

// ============ CREATIVE UPLOAD ============
function handleCreativeUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('⚠️ File too large. Max 5MB'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = $('mockupPreview');
        if(preview) preview.style.display = 'block';
        // Show mockup previews
        ['mockupDay','mockupNight','mockupRoad','mockupTraffic'].forEach(id => {
            const el = $(id);
            if(el) el.innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px">`;
        });
        toast('✅ Creative uploaded! Mockups generated.');
    };
    reader.readAsDataURL(file);
}

// ============ BOOKING ============
function updateBookingSummary() {
    const name = $('bookName')?.value || 'N/A';
    const type = $('bookType')?.value || 'LED';
    const zone = $('bookZone')?.value || 'Kausa';
    const txn = $('txnId')?.value || 'Pending';
    const payment = selectedQR ? selectedQR.name : 'Not selected';
    
    const summary = $('bookingSummary');
    if(!summary) return;
    summary.style.display = 'block';
    summary.innerHTML = `
        <h4>📋 Booking Summary</h4>
        <div class="sum-row"><span>Client</span><span>${name}</span></div>
        <div class="sum-row"><span>Campaign</span><span>${type}</span></div>
        <div class="sum-row"><span>Zone</span><span>${zone}</span></div>
        <div class="sum-row"><span>Payment</span><span>${payment}</span></div>
        <div class="sum-row"><span>Txn ID</span><span>${txn}</span></div>
        <div class="sum-total"><span>Total Est.</span><span>₹${(currentPrice*10*30).toLocaleString('en-IN')}</span></div>
    `;
}

function submitBooking() {
    const name = $('bookName')?.value;
    const phone = $('bookPhone')?.value;
    if (!name || !phone) { toast('⚠️ Name and phone required'); return; }
    
    updateBookingSummary();
    toast('✅ Booking confirmed! Redirecting to WhatsApp...');
    
    setTimeout(() => {
        const msg = `Hi Rasaai OS!%0A%0ABooking Confirmed:%0A📋 ${name}%0A📞 ${phone}%0A🎯 ${$('bookType')?.value}%0A📍 ${$('bookZone')?.value}%0A💳 ${selectedQR?.name||'N/A'}%0A🔢 Txn: ${$('txnId')?.value||'N/A'}`;
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
    }, 1500);
}

function bookViaWhatsApp() {
    const name = $('bookName')?.value || 'Client';
    const phone = $('bookPhone')?.value || '';
    const type = $('bookType')?.value || 'LED';
    const zone = $('bookZone')?.value || 'Kausa';
    const msg = `Hi Rasaai OS!%0A%0AI want to book:%0A📋 ${name}%0A📞 ${phone}%0A🎯 ${type}%0A📍 ${zone}%0A%0APlease share details.`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
}

// ============ AFFILIATE ============
function registerAffiliate() {
    const name = $('affName')?.value;
    const phone = $('affPhone')?.value;
    if (!name || !phone) { toast('⚠️ Name and phone required'); return; }
    
    const code = name.replace(/\s/g,'').toUpperCase() + Math.floor(Math.random()*100);
    const result = $('affiliateResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:20px;border-radius:12px">
            <h4 style="color:#10B981">✅ Affiliate Registered!</h4>
            <p>Your Referral Code: <strong style="color:#06B6D4;font-size:20px">${code}</strong></p>
            <p style="color:var(--gray-400);font-size:13px">Share this code to earn 10% commission</p>
            <button onclick="shareAffiliateCode('${code}')" class="btn btn-primary btn-sm" style="margin-top:12px">📤 Share via WhatsApp</button>
        </div>
    `;
}

function shareAffiliateCode(code) {
    const msg = `Join Rasaai OS for rickshaw advertising! Use my referral code: ${code} and get great deals. Visit: rizvi.store/rasaaiai/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// ============ DRIVER ONBOARDING ============
function registerDriver() {
    const name = $('driverName')?.value;
    const phone = $('driverPhone')?.value;
    const vehicle = $('driverVehicle')?.value;
    if (!name || !phone || !vehicle) { toast('⚠️ All fields required'); return; }
    
    const result = $('driverResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:20px;border-radius:12px">
            <h4 style="color:#10B981">✅ Driver Registered!</h4>
            <p>Driver ID: <strong style="color:#06B6D4">DRV-${String(Math.floor(Math.random()*900)+100)}</strong></p>
            <p style="color:var(--gray-400);font-size:13px">We'll contact you at ${phone} for onboarding</p>
        </div>
    `;
}

// ============ FAQ ============
function buildFAQ() {
    const c = $('faqContainer'); if(!c) return;
    const faq = [
        {q:"How does AI planning work?",a:"Our AI analyzes your business type, location, budget and objectives to recommend the best zone, rickshaw count and estimated results based on historical campaign data."},
        {q:"What routes are covered?",a:"4 strategic routes: Mumbra→Kausa→MM Valley, Mumbra→Kausa→Shilphata→Taloja, Mumbra→Retibunder→Kalwa, Mumbra→Retibunder→Check Naka→Majhiwada."},
        {q:"How does payment work?",a:"Select a QR code (Google Pay/PhonePe/Paytm), make payment, enter transaction ID and upload screenshot. We verify within minutes."},
        {q:"Can I upload my own creative?",a:"Yes! Upload your logo, poster or artwork (JPG/PNG/PDF). Our AI generates mockup previews showing how it looks on rickshaws."},
        {q:"How fast can I launch?",a:"48-72 hours after payment confirmation. We handle printing, installation and GPS tracking setup."},
        {q:"What are the free creatives?",a:"30 social media designs included with every LED/Combo campaign: Instagram posts, WhatsApp ads, Facebook posts, Stories, Carousels and Reels."}
    ];
    c.innerHTML = faq.map(item => `
        <div class="faq-item">
            <button class="faq-q" onclick="this.parentElement.classList.toggle('active')"><span>${item.q}</span><span class="icon">+</span></button>
            <div class="faq-a"><p>${item.a}</p></div>
        </div>
    `).join('');
}

// ============ LIVE TICKER ============
function startTicker() {
    const track = $('tickerTrack');
    if(!track) return;
    const msgs = [
        '🛺 3 businesses booked Kausa today',
        '🔥 Mumbra Station: Only 8 slots left',
        '✅ New campaign live in Shilphata',
        '💼 Agency booked 15 rickshaws',
        '⚡ AI recommends Kausa for retail',
        '🎯 85% recall rate achieved',
        '📊 Campaign delivered 3.4M views',
        '🏆 Top zone: Mumbra Station'
    ];
    track.innerHTML = [...msgs,...msgs].map(m => `<span>${m}</span>`).join('');
}

// ============ PRICE TIMER ============
function startPriceTimer() {
    let sec = CONFIG.refreshMinutes * 60;
    const el = $('priceCountdown');
    if(!el) return;
    setInterval(() => {
        const m = Math.floor(sec/60), s = sec%60;
        el.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
        sec--;
        if(sec < 0) { sec = CONFIG.refreshMinutes * 60; updatePrices(); }
    }, 1000);
    setInterval(updatePrices, CONFIG.refreshMinutes * 60000);
}

// ============ COUNTERS ============
function startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0, step = Math.ceil(target/50);
        const iv = setInterval(() => {
            current += step;
            if(current >= target) { current = target; clearInterval(iv); }
            el.textContent = current>=10000000?(current/10000000).toFixed(1)+'M+':current>=100000?(current/100000).toFixed(1)+'L+':current>=1000?current.toLocaleString('en-IN'):current;
        }, 30);
    });
}

// ============ HEADER SCROLL ============
function setupHeader() {
    window.addEventListener('scroll', () => {
        const h = $('header');
        if(h) h.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============ INIT ============
function init() {
    currentPrice = getDynamicPrice();
    buildPricingCards();
    buildQRGrid();
    buildFAQ();
    startTicker();
    startPriceTimer();
    startCounters();
    setupHeader();
    updateCalculator();
    
    // Update booking summary on input change
    ['bookName','bookPhone','bookType','bookZone','txnId'].forEach(id => {
        const el = $(id);
        if(el) el.addEventListener('input', updateBookingSummary);
    });
    
    setTimeout(() => {
        const l = $('loadingScreen');
        if(l) { l.classList.add('hidden'); setTimeout(() => l.remove(), 500); }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', init);
window.scrollToSection = scrollToSection;
window.updateCalculator = updateCalculator;
window.runAIPlanner = runAIPlanner;
window.handleCreativeUpload = handleCreativeUpload;
window.selectQR = selectQR;
window.updateBookingSummary = updateBookingSummary;
window.submitBooking = submitBooking;
window.bookViaWhatsApp = bookViaWhatsApp;
window.registerAffiliate = registerAffiliate;
window.registerDriver = registerDriver;
window.shareAffiliateCode = shareAffiliateCode;
