// ============================================
// RASAAI - Master Functionality Controller
// WhatsApp Booking | Dynamic Pricing | Maps | All Interactive
// ============================================

const RASAAI = {
    phone: "+919594306625",
    whatsapp: "919594306625",
    priceMin: 1238,
    priceMax: 1647,
    currentPrice: 1238,
    priceInterval: null,
    liveInterval: null,
    notifInterval: null,
    exitShown: false,

    // ============================================
    // DYNAMIC PRICING ENGINE
    // ============================================
    getPrice: function() {
        const cycle = Date.now() / 900000 * Math.PI;
        const demand = Math.sin(cycle) * 0.5 + 0.5;
        const noise = Math.random() * 0.08;
        return Math.floor(this.priceMin + (this.priceMax - this.priceMin) * (demand * 0.65 + noise));
    },

    updateAllPrices: function() {
        this.currentPrice = this.getPrice();
        const hp = document.getElementById('heroPrice');
        if (hp) hp.innerHTML = `₹${this.currentPrice.toLocaleString('en-IN')}<span>/day</span>`;
        buildPricingCards();
        this.updateBookingEstimate();
        this.updateEyeCalc();
    },

    startPriceTimer: function() {
        let sec = 900;
        const timerEl = document.getElementById('priceTimer');
        if (!timerEl) return;
        
        this.priceInterval = setInterval(() => {
            const m = Math.floor(sec / 60), s = sec % 60;
            timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            sec--;
            if (sec < 0) { sec = 900; this.updateAllPrices(); }
        }, 1000);
        
        // Update prices every 15 minutes
        setInterval(() => this.updateAllPrices(), 900000);
    },

    // ============================================
    // WHATSAPP BOOKING ENGINE
    // ============================================
    bookViaWhatsApp: function() {
        const name = document.getElementById('cbName')?.value || 'Customer';
        const typeEl = document.getElementById('cbType');
        const type = typeEl?.value || 'led';
        const routeEl = document.getElementById('cbRoute');
        const route = routeEl?.options[routeEl?.selectedIndex]?.text || 'Selected Route';
        const ricks = document.getElementById('cbRicks')?.value || '1';
        const duration = document.getElementById('cbDuration')?.value || '1';
        const phone = document.getElementById('cbPhone')?.value || '';
        
        const typeNames = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo (LED+Audio)' };
        const price = this.currentPrice;
        let rate = price;
        if (type === 'audio') rate = Math.floor(price * 0.3);
        if (type === 'combo') rate = Math.floor(price * 1.45);
        const total = rate * parseInt(ricks) * parseInt(duration);
        
        const message = `Hi RASAAI!%0A%0AI want to book a rickshaw campaign:%0A%0A📋 Name: ${encodeURIComponent(name)}%0A🎯 Type: ${encodeURIComponent(typeNames[type])}%0A🛣️ Route: ${encodeURIComponent(route)}%0A🛺 Rickshaws: ${ricks}%0A📅 Duration: ${duration} days%0A💰 Est. Cost: ₹${total.toLocaleString('en-IN')}%0A📞 Phone: ${phone}%0A%0APlease share details & availability.`;
        
        window.open(`https://wa.me/${this.whatsapp}?text=${message}`, '_blank');
    },

    modalWhatsApp: function() {
        const name = document.getElementById('modalBizName')?.value || 'Customer';
        const phone = document.getElementById('modalPhone')?.value || '';
        const zone = document.getElementById('modalZone')?.value || 'Not specified';
        const message = `Hi RASAAI!%0A%0AI'm interested in rickshaw advertising:%0A%0A📋 Name: ${encodeURIComponent(name)}%0A📞 Phone: ${phone}%0A📍 Zone: ${encodeURIComponent(zone)}%0A%0APlease share pricing & availability.`;
        window.open(`https://wa.me/${this.whatsapp}?text=${message}`, '_blank');
        this.closeBookingModal();
    },

    // ============================================
    // BOOKING ESTIMATE
    // ============================================
    updateBookingEstimate: function() {
        const summary = document.getElementById('priceSummary');
        if (!summary) return;
        
        const type = document.getElementById('cbType')?.value || 'led';
        const ricks = parseInt(document.getElementById('cbRicks')?.value || 1);
        const duration = parseInt(document.getElementById('cbDuration')?.value || 1);
        let rate = this.currentPrice;
        if (type === 'audio') rate = Math.floor(this.currentPrice * 0.3);
        if (type === 'combo') rate = Math.floor(this.currentPrice * 1.45);
        
        const subtotal = rate * ricks * duration;
        const discount = ricks >= 10 ? Math.floor(subtotal * 0.1) : 0;
        const total = subtotal - discount;
        const names = { led: 'LED Campaign', audio: 'Audio Campaign', combo: 'Combo' };
        
        summary.innerHTML = `
            <div class="row"><span>📋 ${names[type]} × ${ricks} Rickshaws × ${duration} Days</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
            ${discount > 0 ? `<div class="row"><span>🎉 10% Bulk Discount</span><span style="color:var(--green)">-₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
            <div class="row total"><span>💰 Total Estimate</span><span>₹${total.toLocaleString('en-IN')}</span></div>
        `;
    },

    // ============================================
    // EYE CALCULATOR
    // ============================================
    updateEyeCalc: function() {
        const zid = document.getElementById('ecZone')?.value;
        const r = parseInt(document.getElementById('ecRicks')?.value || 10);
        const d = parseInt(document.getElementById('ecDays')?.value || 30);
        let avg = 11500;
        if (zid) {
            const z = RASAAI_DATA.zones.find(x => x.id === zid);
            if (z) avg = parseInt(z.eyes.replace(/,/g, '')) / z.ricks;
        }
        const eyes = avg * r * d;
        const cost = this.currentPrice * r * d;
        
        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('ecEyes', fmt(eyes));
        el('ecReach', fmt(Math.floor(eyes * 0.74)));
        el('ecCost', '₹' + cost.toLocaleString('en-IN'));
        el('ecCPM', '₹' + (cost / (eyes / 1000)).toFixed(2));
    },

    // ============================================
    // ROI CALCULATOR
    // ============================================
    updateROICalc: function() {
        const zid = document.getElementById('roiZone')?.value || 'kausa';
        const budget = parseInt(document.getElementById('roiBudget')?.value || 50000);
        const z = RASAAI_DATA.zones.find(x => x.id === zid) || RASAAI_DATA.zones[0];
        const ricks = Math.min(Math.floor(budget / (this.currentPrice * 30)), z.ricks);
        const cost = ricks * this.currentPrice * 30;
        const eyes = (parseInt(z.eyes.replace(/,/g, '')) / z.ricks) * ricks * 30;
        const biz = document.getElementById('roiBiz')?.value || 'retail';
        const rates = { retail: 0.025, restaurant: 0.035, clinic: 0.02 };
        const txnValues = { retail: 500, restaurant: 300, clinic: 800 };
        const convRate = rates[biz] || 0.02;
        const foot = Math.floor(eyes * convRate);
        const cust = Math.floor(foot * 0.3);
        const rev = cust * (txnValues[biz] || 500);
        
        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('roiEyes', fmt(eyes));
        el('roiFoot', '+' + foot + '%');
        el('roiCust', cust.toLocaleString('en-IN'));
        el('roiRev', '₹' + rev.toLocaleString('en-IN'));
        el('roiROI', cost > 0 ? Math.floor((rev - cost) / cost * 100) + '%' : '--');
        el('roiBE', rev > 0 ? Math.ceil(cost / (rev / 30)) + ' days' : '--');
    },

    // ============================================
    // COMPARISON TABLES
    // ============================================
    showComparison: function(platform, btn) {
        document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');
        
        const data = RASAAI_DATA.comparisons[platform];
        const content = document.getElementById('comparisonContent');
        if (!content) return;
        
        content.innerHTML = `<table class="comp-table"><thead><tr><th>📋 Feature</th><th style="color:#FFB800">🛺 RASAAI</th><th>Competitor</th></tr></thead><tbody>${data.map(row => {
            const competitorClass = row[2].startsWith('✅') ? 'win' : row[2].startsWith('❌') ? 'lose' : 'lose';
            return `<tr><td><strong>${row[0]}</strong></td><td class="win">${row[1]}</td><td class="${competitorClass}">${row[2]}</td></tr>`;
        }).join('')}</tbody></table>`;
    },

    // ============================================
    // AUDIO PLAYER
    // ============================================
    playAudio: function(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            const freqs = { restaurant: 520, clinic: 440, education: 660 };
            osc.frequency.value = freqs[type] || 500;
            osc.type = 'sine';
            gain.gain.value = 0.15;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
            osc.stop(ctx.currentTime + 2);
        } catch(e) {
            alert('🔊 Sample ' + type + ' ad playing. Replace with MP3 file.');
        }
    },

    // ============================================
    // VIDEO MODAL
    // ============================================
    openVideo: function(id) {
        const modal = document.getElementById('videoModal');
        const embed = document.getElementById('videoEmbed');
        if (!modal || !embed) return;
        embed.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    closeVideoModal: function() {
        const modal = document.getElementById('videoModal');
        const embed = document.getElementById('videoEmbed');
        if (modal) modal.classList.remove('show');
        if (embed) embed.innerHTML = '';
        document.body.style.overflow = '';
    },

    // ============================================
    // HEATMAP
    // ============================================
    updateHeatmap: function(hour) {
        const timeEl = document.getElementById('htTime');
        if (timeEl) timeEl.textContent = hour + ':00';
        
        const h = parseInt(hour);
        document.querySelectorAll('.heatmap-zone').forEach(el => {
            const baseCov = parseInt(el.dataset.cov);
            let multiplier = 1;
            if (h >= 7 && h <= 10) multiplier = 1.3;
            else if (h >= 17 && h <= 20) multiplier = 1.4;
            else if (h >= 22 || h <= 5) multiplier = 0.5;
            const adj = Math.min(100, Math.floor(baseCov * multiplier));
            el.style.background = `rgba(0,168,107,${adj/150})`;
            const fill = el.querySelector('.heatmap-bar-fill');
            if (fill) fill.style.width = adj + '%';
        });
    },

    // ============================================
    // AFFILIATE
    // ============================================
    updateAffiliate: function(value) {
        const earn = Math.floor(value * 0.1);
        const e = document.getElementById('affEarn');
        if (e) e.textContent = '₹' + earn.toLocaleString('en-IN');
    },

    // ============================================
    // CONTEST
    // ============================================
    launchContest: function() {
        const hash = document.getElementById('contestHash')?.value || '#RasaaiContest';
        const prize = document.getElementById('contestPrizeVal')?.value || 'Prize';
        const dur = document.getElementById('contestDuration')?.value || '7 Days';
        const phone = document.getElementById('contestPhone')?.value;
        
        if (!phone) { alert('⚠️ Please enter your phone number'); return; }
        
        const message = `Hi RASAAI!%0A%0AI want to launch a hashtag contest:%0A%0A🏆 Hashtag: ${encodeURIComponent(hash)}%0A🎁 Prize: ${encodeURIComponent(prize)}%0A📅 Duration: ${encodeURIComponent(dur)}%0A📞 Phone: ${phone}%0A%0APlease help me set this up!`;
        window.open(`https://wa.me/${this.whatsapp}?text=${message}`, '_blank');
        
        alert(`🏆 Contest Launch Request Sent!\n\n${hash}\n${prize}\n${dur}\n\nWe'll contact you shortly at ${phone}`);
    },

    // ============================================
    // MODAL CONTROLS
    // ============================================
    openBookingModal: function() {
        const modal = document.getElementById('bookingModal');
        if (modal) { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
    },
    
    closeBookingModal: function() {
        const modal = document.getElementById('bookingModal');
        if (modal) { modal.classList.remove('show'); document.body.style.overflow = ''; }
    },
    
    closeExitPopup: function() {
        const popup = document.getElementById('exitPopup');
        if (popup) popup.classList.remove('show');
    },

    // ============================================
    // LIVE UPDATES
    // ============================================
    startLiveUpdates: function() {
        this.liveInterval = setInterval(() => {
            const r = document.getElementById('liveRickshaws');
            const c = document.getElementById('liveCampaigns');
            const e = document.getElementById('liveEyeViews');
            const m = document.getElementById('htMentions');
            
            if (r) r.textContent = 340 + Math.floor(Math.random() * 10);
            if (c) c.textContent = 125 + Math.floor(Math.random() * 8);
            if (e) {
                const v = parseInt(e.textContent.replace(/,/g, '')) || 1247893;
                e.textContent = (v + Math.floor(Math.random() * 300) + 100).toLocaleString('en-IN');
            }
            if (m) m.textContent = 247 + Math.floor(Math.random() * 8);
        }, 5000);
    },

    startNotifications: function() {
        const msgs = [
            '🏃 3 businesses booked Kausa today',
            '🔥 Mumbra Station: Only 8 left',
            '✅ New campaign live in Shilphata',
            '💼 Agency booked 15 rickshaws',
            '⚡ Flash: Check Naka at low rate'
        ];
        let i = 0;
        this.notifInterval = setInterval(() => {
            const w = document.getElementById('notificationWidget');
            const t = document.getElementById('notificationText');
            if (w && t) {
                t.textContent = msgs[i];
                w.classList.add('show');
                setTimeout(() => w.classList.remove('show'), 4000);
                i = (i + 1) % msgs.length;
            }
        }, 8000);
    },

    // ============================================
    // COUNTER ANIMATIONS
    // ============================================
    startCounters: function() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const step = Math.ceil(target / 50);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(interval); }
                el.textContent = current >= 10000000 ? (current/10000000).toFixed(1)+'M+' : 
                                 current >= 100000 ? (current/100000).toFixed(1)+'L+' : 
                                 current >= 1000 ? current.toLocaleString('en-IN') : current;
            }, 30);
        });
    },

    // ============================================
    // EXIT INTENT
    // ============================================
    setupExitIntent: function() {
        let scrollDepth = 0;
        window.addEventListener('scroll', () => {
            scrollDepth = Math.max(scrollDepth, (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        });
        
        document.addEventListener('mouseout', (e) => {
            if (!this.exitShown && e.clientY <= 0 && scrollDepth > 50) {
                const popup = document.getElementById('exitPopup');
                if (popup) popup.classList.add('show');
                this.exitShown = true;
                setTimeout(() => { this.exitShown = false; }, 300000);
            }
        });
    },

    // ============================================
    // MOBILE NAV
    // ============================================
    setupMobileNav: function() {
        window.addEventListener('scroll', () => {
            const header = document.getElementById('desktopHeader');
            const sticky = document.getElementById('stickyBar');
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
            if (sticky) sticky.style.display = window.scrollY > 400 ? 'flex' : 'none';
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
    },

    // ============================================
    // MODAL CLICK OUTSIDE
    // ============================================
    setupModals: function() {
        document.getElementById('bookingModal')?.addEventListener('click', function(e) {
            if (e.target === this) RASAAI.closeBookingModal();
        });
        document.getElementById('exitPopup')?.addEventListener('click', function(e) {
            if (e.target === this) RASAAI.closeExitPopup();
        });
        document.getElementById('videoModal')?.addEventListener('click', function(e) {
            if (e.target === this) RASAAI.closeVideoModal();
        });
    },

    // ============================================
    // COVERAGE MAP
    // ============================================
    buildCoverageMap: function() {
        const container = document.getElementById('coverageMap');
        if (!container || typeof L === 'undefined') return;
        
        const map = L.map('coverageMap').setView([19.1850, 73.0400], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
        
        // Route colors
        const routeColors = ['#2196F3', '#4CAF50', '#F44336', '#FF9800'];
        
        // Draw route lines
        RASAAI_DATA.routes.forEach((route, i) => {
            if (route.coords && route.coords.length > 1) {
                L.polyline(route.coords, {
                    color: routeColors[i],
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(map).bindPopup(`<b>${route.name}</b><br>🛺 ${route.ricks} rickshaws<br>👁️ ${route.eyes} eyes/day`);
            }
        });
        
        // Add zone markers
        RASAAI_DATA.zones.forEach(z => {
            const color = z.avail < 15 ? '#E74C3C' : z.cov > 80 ? '#00A86B' : '#FFB800';
            L.circleMarker([z.lat, z.lng], {
                radius: Math.sqrt(z.ricks) * 1.2,
                fillColor: color,
                color: '#fff',
                weight: 2,
                fillOpacity: 0.8
            }).addTo(map).bindPopup(`
                <div style="font-family:sans-serif;min-width:180px">
                    <b>${z.name}</b><br>
                    🛺 ${z.ricks} rickshaws<br>
                    👁️ ${z.eyes} eyes/day<br>
                    📊 ${z.cov}% coverage<br>
                    ${z.avail} available<br>
                    <button onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})" 
                            style="background:#FF5A00;color:white;border:none;padding:6px 12px;border-radius:100px;cursor:pointer;font-weight:600;margin-top:6px;width:100%">
                        Book This Zone
                    </button>
                </div>
            `);
        });
        
        // Fit bounds to show all markers
        const allCoords = RASAAI_DATA.zones.map(z => [z.lat, z.lng]);
        if (allCoords.length > 0) {
            map.fitBounds(allCoords, { padding: [30, 30] });
        }
    },

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    init: function() {
        this.currentPrice = this.getPrice();
        this.updateAllPrices();
        this.startPriceTimer();
        this.startLiveUpdates();
        this.startNotifications();
        this.startCounters();
        this.setupExitIntent();
        this.setupMobileNav();
        this.setupModals();
        this.buildCoverageMap();
        
        // Update initial estimates
        setTimeout(() => {
            this.updateEyeCalc();
            this.updateROICalc();
            this.updateBookingEstimate();
        }, 500);
        
        console.log('✅ RASAAI Platform Initialized');
        console.log('📞 Phone:', this.phone);
        console.log('💬 WhatsApp:', this.whatsapp);
        console.log('💰 Current Price: ₹' + this.currentPrice.toLocaleString('en-IN') + '/day');
        console.log('🗺️ 4 Routes | 📍 12 Zones | 🛺 600+ Rickshaws');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => RASAAI.init(), 300);
});

// Expose to global scope
window.RASAAI = RASAAI;
