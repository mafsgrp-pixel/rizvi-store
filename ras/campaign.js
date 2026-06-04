// campaign.js - RASAAI Interactive Features
const RASAAI = {
  currentPrice: 1450,
  priceMin: 1238,
  priceMax: 1647,
  mapInstance: null,
  mapMarkers: [],
  mapPolylines: [],
  priceInterval: null,
  liveInterval: null,
  notifInterval: null,
  exitTimerInterval: null,

  // Initialize everything
  init() {
    this.updateAllPrices();
    this.startPriceTimer();
    this.startLiveUpdates();
    this.startNotifications();
    this.startCounters();
    this.setupEventListeners();
    this.buildCoverageMap();
    this.updateEyeCalc();
    this.updateBookingEstimate();
    this.updateAffiliate();
    this.showComparison('instagram');
    this.updateHeatmap();
    this.setupExitIntent();
    this.hideLoader();
  },

  hideLoader() {
    setTimeout(() => {
      const loader = document.getElementById('loadingScreen');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }
    }, 1500);
  },

  // Dynamic Pricing
  getPrice() {
    return Math.floor(Math.random() * (this.priceMax - this.priceMin + 1) + this.priceMin);
  },

  updateAllPrices() {
    this.currentPrice = this.getPrice();
    
    // Update hero price
    const heroPrice = document.getElementById('heroPrice');
    if (heroPrice) {
      heroPrice.innerHTML = `₹${this.currentPrice.toLocaleString()}<span>/day</span>`;
    }

    // Update pricing cards
    const pricingGrid = document.getElementById('pricingGrid');
    if (pricingGrid && DATA.pricing) {
      const tiers = [
        { name: 'LED Only', multiplier: 1, rickshaws: '5-10', features: ['LED Screen','GPS Tracking','Basic Analytics'] },
        { name: 'Audio Only', multiplier: 1, rickshaws: '3-8', features: ['Voice Ads','Zone Targeting','Repetition'] },
        { name: 'Combo (Best Value)', multiplier: 1.8, rickshaws: '5-20', features: ['LED + Audio','GPS + Analytics','70% Better Recall','30 Free Social Creatives'] }
      ];
      pricingGrid.innerHTML = tiers.map(t => `
        <div class="pricing-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})">
          <h4>${t.name}</h4>
          <div class="pricing-amount">₹${Math.floor(this.currentPrice * t.multiplier).toLocaleString()}<span style="font-size:0.9rem">/day</span></div>
          <p style="font-size:0.85rem;color:var(--gray-500)">${t.rickshaws} rickshaws</p>
          <ul style="text-align:left;font-size:0.8rem;margin-top:0.5rem">
            ${t.features.map(f => `<li>✅ ${f}</li>`).join('')}
          </ul>
        </div>
      `).join('');
    }

    // Update booking estimate
    this.updateBookingEstimate();
  },

  startPriceTimer() {
    const timerEl = document.getElementById('priceTimer');
    if (!timerEl) return;
    let seconds = 900;

    this.priceInterval = setInterval(() => {
      seconds--;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      if (seconds <= 0) {
        this.updateAllPrices();
        seconds = 900;
      }
    }, 1000);
  },

  // WhatsApp Booking
  bookViaWhatsApp() {
    const name = document.getElementById('campName')?.value || 'Customer';
    const typeEl = document.getElementById('campType');
    const type = typeEl?.options[typeEl.selectedIndex]?.text || 'LED Display';
    const routeEl = document.getElementById('campRoute');
    const route = routeEl?.options[routeEl.selectedIndex]?.text || 'Route 1';
    const rickshaws = document.getElementById('campRickshaws')?.value || 5;
    const duration = document.getElementById('campDuration')?.value || 30;
    const phone = document.getElementById('campPhone')?.value || '+919594306625';
    
    const totalEstimate = rickshaws * duration * this.currentPrice;
    
    const message = `🚖 *RASAAI Campaign Booking*%0A%0A` +
      `👤 *Name:* ${name}%0A` +
      `📋 *Type:* ${type}%0A` +
      `📍 *Route:* ${route}%0A` +
      `🛺 *Rickshaws:* ${rickshaws}%0A` +
      `📅 *Duration:* ${duration} days%0A` +
      `📞 *Phone:* ${phone}%0A` +
      `💰 *Estimated:* ₹${totalEstimate.toLocaleString()}%0A%0A` +
      `Please confirm my campaign and share payment details.`;
    
    window.open(`https://wa.me/919594306625?text=${message}`, '_blank');
  },

  modalWhatsApp() {
    const bizName = document.getElementById('modalBizName')?.value || 'Customer';
    const phone = document.getElementById('modalPhone')?.value || '+919594306625';
    const zoneEl = document.getElementById('modalZone');
    const zone = zoneEl?.options[zoneEl.selectedIndex]?.text || 'Mumbra';
    
    const message = `🚖 *Quick RASAAI Booking*%0A%0A` +
      `👤 *Business:* ${bizName}%0A` +
      `📍 *Zone:* ${zone}%0A` +
      `📞 *Phone:* ${phone}%0A%0A` +
      `I'm interested in rickshaw advertising. Please share details.`;
    
    window.open(`https://wa.me/919594306625?text=${message}`, '_blank');
    this.closeBookingModal();
  },

  updateBookingEstimate() {
    const rickshaws = document.getElementById('campRickshaws')?.value || 5;
    const duration = document.getElementById('campDuration')?.value || 30;
    const typeEl = document.getElementById('campType');
    const type = typeEl?.value || 'led';
    
    const multiplier = type === 'combo' ? 1.8 : 1;
    const estimate = rickshaws * duration * this.currentPrice * multiplier;
    
    const estimateEl = document.getElementById('bookingEstimate');
    if (estimateEl) {
      estimateEl.textContent = `Estimated: ₹${estimate.toLocaleString()} (${rickshaws} rickshaws × ${duration} days × ₹${Math.floor(this.currentPrice * multiplier).toLocaleString()}/day)`;
    }
  },

  // Modal
  openBookingModal() {
    document.getElementById('bookingModal')?.classList.add('active');
  },

  closeBookingModal() {
    document.getElementById('bookingModal')?.classList.remove('active');
  },

  closeExitPopup() {
    document.getElementById('exitPopup')?.classList.remove('active');
    if (this.exitTimerInterval) clearInterval(this.exitTimerInterval);
  },

  // Eye View Calculator
  updateEyeCalc() {
    const zoneId = document.getElementById('eyeZone')?.value;
    const rickshaws = parseInt(document.getElementById('eyeRickshaws')?.value || 5);
    const days = parseInt(document.getElementById('eyeDays')?.value || 30);
    
    const zone = DATA.zones?.find(z => z.id === zoneId);
    const dailyViews = zone ? Math.floor(zone.impressions * (rickshaws / zone.totalRickshaws)) : rickshaws * 2500;
    const totalViews = dailyViews * days;
    const costPerView = (rickshaws * days * this.currentPrice) / totalViews;
    
    const resultEl = document.getElementById('eyeViewResult');
    const cpvEl = document.getElementById('eyeCPV');
    const rickshawVal = document.getElementById('eyeRickshawVal');
    const daysVal = document.getElementById('eyeDaysVal');
    
    if (resultEl) resultEl.textContent = totalViews.toLocaleString();
    if (cpvEl) cpvEl.textContent = `₹${costPerView.toFixed(2)}`;
    if (rickshawVal) rickshawVal.textContent = rickshaws;
    if (daysVal) daysVal.textContent = days;
  },

  // ROI Calculator
  calculateROI() {
    const budget = parseInt(document.getElementById('roiBudget')?.value || 50000);
    const zoneId = document.getElementById('roiZone')?.value;
    const zone = DATA.zones?.find(z => z.id === zoneId);
    
    const dailyCost = this.currentPrice;
    const possibleDays = Math.floor(budget / dailyCost);
    const estimatedViews = possibleDays * (zone ? zone.impressions : 15000);
    const estimatedCustomers = Math.floor(estimatedViews * 0.005); // 0.5% conversion
    const avgRevenue = 500; // Average revenue per customer
    const projectedRevenue = estimatedCustomers * avgRevenue;
    const roi = Math.floor(((projectedRevenue - budget) / budget) * 100);
    
    const resultEl = document.getElementById('roiResult');
    if (resultEl) {
      resultEl.innerHTML = `
        <strong>Projected ROI: ${roi}%</strong><br>
        <small>${possibleDays} days campaign • ${estimatedViews.toLocaleString()} eye views • ~${estimatedCustomers} customers</small>
      `;
    }
  },

  // Comparison Tables
  showComparison(platform) {
    const content = document.getElementById('comparisonContent');
    const data = DATA.comparison?.[platform];
    if (!content || !data) return;

    // Update active tab
    document.querySelectorAll('.comp-tab').forEach(tab => {
      tab.classList.toggle('active', tab.textContent.toLowerCase() === platform);
    });

    content.innerHTML = `
      <table class="comp-table">
        <thead><tr><th>Feature</th><th style="color:#22c55e">RASAAI</th><th style="color:#ef4444">${platform.charAt(0).toUpperCase() + platform.slice(1)} Ads</th></tr></thead>
        <tbody>${data.map(row => `
          <tr>
            <td><strong>${row.feature}</strong></td>
            <td>${row.rasaai}</td>
            <td>${row.competitor}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    `;
  },

  // Audio Player
  playAudio() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio play failed:', e);
    }
  },

  // Video Modal
  openVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const embed = document.getElementById('videoEmbed');
    if (modal && embed) {
      embed.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      modal.classList.add('active');
    }
  },

  closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const embed = document.getElementById('videoEmbed');
    if (modal) modal.classList.remove('active');
    if (embed) embed.innerHTML = '';
  },

  // Heatmap
  updateHeatmap() {
    const slider = document.getElementById('heatmapSlider');
    const timeDisplay = document.getElementById('heatmapTime');
    const zonesContainer = document.getElementById('heatmapZones');
    
    if (!slider || !timeDisplay) return;
    
    const hour = parseInt(slider.value);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    timeDisplay.textContent = `${displayHour}:00 ${ampm}`;
    
    if (zonesContainer && DATA.zones) {
      const isPeak = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
      const isNight = hour >= 22 || hour <= 5;
      
      zonesContainer.innerHTML = DATA.zones.map(z => {
        let intensity;
        if (isNight) intensity = 0.2;
        else if (isPeak) intensity = 0.9;
        else intensity = 0.5;
        
        return `
          <div style="padding:0.5rem;background:rgba(255,90,0,${intensity});border-radius:8px;text-align:center;font-size:0.7rem;font-weight:${intensity > 0.5 ? 700 : 400};color:${intensity > 0.5 ? 'white' : 'var(--dark)'}">
            ${z.name}
          </div>
        `;
      }).join('');
    }
  },

  // Affiliate
  updateAffiliate() {
    const slider = document.getElementById('affiliateSlider');
    const countEl = document.getElementById('affiliateCount');
    const commissionEl = document.getElementById('affiliateCommission');
    
    if (!slider) return;
    
    const referrals = parseInt(slider.value);
    const avgCampaign = 50000;
    const commission = Math.floor(referrals * avgCampaign * 0.10);
    
    if (countEl) countEl.textContent = referrals;
    if (commissionEl) commissionEl.textContent = `₹${commission.toLocaleString()}/month`;
  },

  joinAffiliate() {
    const message = `🤝 *Affiliate Program Inquiry*%0A%0A` +
      `I want to join the RASAAI affiliate program and earn 10%% commission.%0A` +
      `Please share my referral link and details.`;
    window.open(`https://wa.me/919594306625?text=${message}`, '_blank');
  },

  // Contest
  launchContest() {
    const hashtag = document.getElementById('contestHashtag')?.value || '#RASAAIcontest';
    const prize = document.getElementById('contestPrize')?.value || 'Free Campaign';
    const phone = document.getElementById('contestPhone')?.value || '+919594306625';
    
    const message = `🏆 *Contest Launch Request*%0A%0A` +
      `🏷️ *Hashtag:* ${hashtag}%0A` +
      `🎁 *Prize:* ${prize}%0A` +
      `📞 *Phone:* ${phone}%0A%0A` +
      `Please help me launch this contest with RASAAI.`;
    
    window.open(`https://wa.me/919594306625?text=${message}`, '_blank');
    alert('🎉 Contest launch request sent via WhatsApp! We will contact you shortly.');
  },

  // Zone Booking
  bookZone(zoneId) {
    const zone = DATA.zones?.find(z => z.id === zoneId);
    if (!zone) return;
    
    const message = `📍 *Zone Booking: ${zone.name}*%0A%0A` +
      `Available: ${zone.availableRickshaws}/${zone.totalRickshaws} rickshaws%0A` +
      `Traffic: ${zone.traffic}%0A` +
      `Peak: ${zone.peakTime}%0A%0A` +
      `I want to book rickshaws in this zone.`;
    
    window.open(`https://wa.me/919594306625?text=${message}`, '_blank');
  },

  focusZone(zoneId) {
    const zone = DATA.zones?.find(z => z.id === zoneId);
    if (!zone || !this.mapInstance) return;
    
    this.mapInstance.setView([zone.lat, zone.lng], 15);
    
    // Open popup for this zone's marker
    const marker = this.mapMarkers.find(m => m.zoneId === zoneId);
    if (marker) marker.openPopup();
  },

  // Coverage Map
  buildCoverageMap() {
    const mapEl = document.getElementById('coverageMap');
    if (!mapEl || !DATA.zones) return;

    this.mapInstance = L.map('coverageMap').setView([19.185, 73.045], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap | RASAAI',
      maxZoom: 18
    }).addTo(this.mapInstance);

    // Add zone markers
    this.mapMarkers = DATA.zones.map(z => {
      const marker = L.marker([z.lat, z.lng])
        .addTo(this.mapInstance)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif">
            <strong>${z.name}</strong><br>
            🛺 Available: ${z.availableRickshaws}/${z.totalRickshaws}<br>
            👁️ Impressions: ${(z.impressions/1000).toFixed(1)}K<br>
            📈 Coverage: ${z.coverage}%<br>
            <button onclick="RASAAI.bookZone('${z.id}')" style="background:#FF5A00;color:white;border:none;padding:6px 16px;border-radius:20px;cursor:pointer;margin-top:6px;font-weight:600">Book Zone</button>
          </div>
        `);
      marker.zoneId = z.id;
      return marker;
    });

    // Draw route polylines
    const routeCoordinates = [
      [[19.1800,73.0280],[19.1765,73.0320],[19.1720,73.0250]],
      [[19.1800,73.0280],[19.1765,73.0320],[19.1850,73.0500],[19.1950,73.0480],[19.1980,73.0550],[19.2000,73.0600],[19.2050,73.0650]],
      [[19.1800,73.0280],[19.1700,73.0380],[19.1650,73.0420]],
      [[19.1800,73.0280],[19.1700,73.0380],[19.1850,73.0350],[19.1900,73.0300]]
    ];

    const colors = ['#FF5A00', '#221F60', '#FFB800', '#00aa00'];
    
    this.mapPolylines = routeCoordinates.map((coords, i) => {
      return L.polyline(coords, {
        color: colors[i],
        weight: 4,
        opacity: 0.8,
        dashArray: i === 1 ? '10, 10' : null
      }).addTo(this.mapInstance).bindPopup(`<strong>Route ${i + 1}</strong>`);
    });

    // Fit bounds
    const allCoords = DATA.zones.map(z => [z.lat, z.lng]);
    this.mapInstance.fitBounds(allCoords, { padding: [30, 30] });
  },

  // Live Updates
  startLiveUpdates() {
    this.liveInterval = setInterval(() => {
      const liveRickshaws = document.getElementById('liveRickshaws');
      const liveCampaigns = document.getElementById('liveCampaigns');
      const liveEyeViews = document.getElementById('liveEyeViews');
      
      if (liveRickshaws) {
        liveRickshaws.textContent = Math.floor(300 + Math.random() * 100);
      }
      if (liveCampaigns) {
        liveCampaigns.textContent = Math.floor(100 + Math.random() * 50);
      }
      if (liveEyeViews) {
        const views = Math.floor(1000000 + Math.random() * 500000);
        liveEyeViews.textContent = views.toLocaleString();
      }
    }, 5000);
  },

  // Notifications
  startNotifications() {
    const messages = [
      '🔔 Sharma Restaurant just booked 10 rickshaws on Route 1!',
      '📍 3 rickshaws now available in Kausa zone',
      '👁️ 50,000+ eye views recorded today on Route 2',
      '🛺 New driver joined: RJ-7890 in Kalyan Phata',
      '⭐ City Clinic renewed campaign for 30 more days',
      '📊 Route 4 showing 95% coverage this hour'
    ];

    this.notifInterval = setInterval(() => {
      const widget = document.getElementById('notificationWidget');
      const text = document.getElementById('notificationText');
      if (widget && text) {
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        widget.classList.add('show');
        setTimeout(() => widget.classList.remove('show'), 5000);
      }
    }, 8000);
  },

  // Counter Animation
  startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString();
        }
      }, duration / steps);
    });
  },

  // Exit Intent
  setupExitIntent() {
    let shown = false;
    
    const showPopup = () => {
      if (shown) return;
      shown = true;
      
      const popup = document.getElementById('exitPopup');
      const countEl = document.getElementById('exitCount');
      
      if (popup && countEl) {
        countEl.textContent = Math.floor(Math.random() * 10) + 3;
        popup.classList.add('active');
        
        let exitSeconds = 300;
        const timerEl = document.getElementById('exitTimerDisplay');
        this.exitTimerInterval = setInterval(() => {
          exitSeconds--;
          const mins = Math.floor(exitSeconds / 60);
          const secs = exitSeconds % 60;
          if (timerEl) timerEl.textContent = `Offer refreshes: ${mins}:${secs.toString().padStart(2, '0')}`;
          if (exitSeconds <= 0) clearInterval(this.exitTimerInterval);
        }, 1000);
      }
    };

    // Show after 50% scroll
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) showPopup();
    });

    // Show on mouse leave
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) showPopup();
    });
  },

  // Event Listeners
  setupEventListeners() {
    // Campaign builder inputs
    document.getElementById('campRickshaws')?.addEventListener('input', () => this.updateBookingEstimate());
    document.getElementById('campDuration')?.addEventListener('input', () => this.updateBookingEstimate());
    document.getElementById('campType')?.addEventListener('change', () => this.updateBookingEstimate());
    
    // Eye calculator inputs
    document.getElementById('eyeRickshaws')?.addEventListener('input', () => {
      document.getElementById('eyeRickshawVal').textContent = document.getElementById('eyeRickshaws').value;
      this.updateEyeCalc();
    });
    document.getElementById('eyeDays')?.addEventListener('input', () => {
      document.getElementById('eyeDaysVal').textContent = document.getElementById('eyeDays').value;
      this.updateEyeCalc();
    });
    document.getElementById('eyeZone')?.addEventListener('change', () => this.updateEyeCalc());
    
    // Heatmap slider
    document.getElementById('heatmapSlider')?.addEventListener('input', () => this.updateHeatmap());
    
    // Affiliate slider
    document.getElementById('affiliateSlider')?.addEventListener('input', () => {
      document.getElementById('affiliateCount').textContent = document.getElementById('affiliateSlider').value;
      this.updateAffiliate();
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Smooth scroll for bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.addEventListener('click', function(e) {
        document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
};

// Initialize on load
window.addEventListener('load', () => {
  // Wait for data to be loaded
  const checkData = setInterval(() => {
    if (DATA && DATA.zones && DATA.zones.length > 0) {
      clearInterval(checkData);
      RASAAI.init();
    }
  }, 100);
  
  // Fallback: init after 3 seconds anyway
  setTimeout(() => {
    if (!RASAAI.mapInstance) {
      RASAAI.init();
    }
  }, 3000);
});
