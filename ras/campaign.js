// campaign.js - All interactive features
const RASAAI = {
  currentPrice: 1450,
  priceMin: 1238,
  priceMax: 1647,
  
  getPrice() {
    return Math.floor(Math.random() * (this.priceMax - this.priceMin + 1) + this.priceMin);
  },
  
  updateAllPrices() {
    this.currentPrice = this.getPrice();
    document.getElementById('heroPriceDisplay').innerHTML = `₹${this.currentPrice}<span>/rickshaw/day</span>`;
    const pricingCards = document.getElementById('pricingCards');
    if (pricingCards) {
      pricingCards.innerHTML = [1,2,3].map(i => `
        <div class="pricing-card" onclick="document.getElementById('builder').scrollIntoView({behavior:'smooth'})">
          <h4>${['Basic','Standard','Premium'][i-1]}</h4>
          <strong>₹${Math.floor(this.currentPrice * [1,1.3,1.8][i-1])}/day</strong>
        </div>
      `).join('');
    }
  },
  
  startPriceTimer() {
    let seconds = 900;
    const timerEl = document.getElementById('priceTimer');
    setInterval(() => {
      if (seconds <= 0) {
        this.updateAllPrices();
        seconds = 900;
      }
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `Next update: ${mins}:${secs.toString().padStart(2,'0')}`;
      seconds--;
    }, 1000);
  },
  
  bookViaWhatsApp() {
    const name = document.getElementById('campName').value || 'Customer';
    const type = document.getElementById('campType').value;
    const route = document.getElementById('campRoute').value;
    const rickshaws = document.getElementById('campRickshaws').value;
    const duration = document.getElementById('campDuration').value;
    const phone = document.getElementById('campPhone').value;
    const msg = `RASAAI Booking:%0A%0A*Name:* ${name}%0A*Type:* ${type}%0A*Route:* ${route}%0A*Rickshaws:* ${rickshaws}%0A*Duration:* ${duration} days%0A*Phone:* ${phone}%0A%0APlease confirm my campaign.`;
    window.open(`https://wa.me/919594306625?text=${msg}`, '_blank');
  },
  
  modalWhatsApp() {
    this.bookViaWhatsApp();
  },
  
  updateBookingEstimate() {
    const rickshaws = document.getElementById('campRickshaws').value || 5;
    const duration = document.getElementById('campDuration').value || 7;
    const estimate = rickshaws * duration * this.currentPrice;
    document.getElementById('bookingEstimate').textContent = `Estimate: ₹${estimate.toLocaleString()}`;
  },
  
  updateEyeCalc() {
    const rickshaws = document.getElementById('eyeRickshaw').value;
    const hours = document.getElementById('eyeHours').value;
    document.getElementById('eyeViewsResult').textContent = (rickshaws * hours * 280).toLocaleString();
  },
  
  updateROICalc() {
    const budget = document.getElementById('roiBudget').value || 50000;
    document.getElementById('roiResult').textContent = `Projected ROI: ${Math.floor(budget * 0.032)}%`;
  },
  
  showComparison(tab) {
    const data = {
      instagram: [['Reach','RASAAI','Competitor'],['Local','✅ High','❌ Low'],['Cost','✅ ₹0.8/view','❌ ₹2.5/view']],
      facebook: [['Engagement','RASAAI','Competitor'],['Shares','✅ 340','❌ 120'],['CPC','✅ ₹4','❌ ₹9']],
      youtube: [['Views','RASAAI','Competitor'],['Completion','✅ 78%','❌ 45%'],['CPV','✅ ₹0.3','❌ ₹1.2']]
    };
    const table = document.getElementById('compTable');
    table.innerHTML = `<table>${data[tab].map((row,i) => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`;
  },
  
  playAudio() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  },
  
  openVideo(videoId) {
    document.getElementById('videoFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    document.getElementById('videoModal').style.display = 'flex';
  },
  
  closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoFrame').src = '';
  },
  
  updateHeatmap() {
    const hour = document.getElementById('timeSlider').value;
    document.getElementById('heatmapDisplay').textContent = `Peak intensity at ${hour}:00 - ${hour >=7 && hour <=10 || hour>=17 && hour<=20 ? 'HIGH' : 'Moderate'}`;
  },
  
  updateAffiliate() {
    const val = document.getElementById('affiliateSlider').value;
    document.getElementById('affiliateComm').textContent = `₹${val * 50}`;
  },
  
  launchContest() {
    const hashtag = document.getElementById('contestHashtag').value || '#RASAAIcontest';
    window.open(`https://wa.me/919594306625?text=Contest:%20${hashtag}%20Launch%20request`, '_blank');
    alert('Contest launched via WhatsApp!');
  },
  
  startLiveUpdates() {
    setInterval(() => {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        el.textContent = Math.floor(target * (0.9 + Math.random() * 0.2));
      });
    }, 5000);
  },
  
  startNotifications() {
    setInterval(() => {
      // Simple toast simulation
      console.log('🔔 New rickshaw joined Route 2');
    }, 8000);
  },
  
  startCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = el.getAttribute('data-count');
    });
  },
  
  buildCoverageMap() {
    const map = L.map('rasaaiMap').setView([19.185, 73.045], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'RASAAI' }).addTo(map);
    
    const markers = RASAAI_DATA.zones.map(z => L.marker([z.lat, z.lng]).addTo(map).bindPopup(`<b>${z.name}</b><br>Available: ${z.available}/${z.total}<br><button onclick="RASAAI.modalWhatsApp()">Book</button>`));
    
    const routeCoords = [
      [[19.1800,73.0280],[19.1765,73.0320],[19.1720,73.0250]],
      [[19.1800,73.0280],[19.1765,73.0320],[19.1850,73.0500],[19.1950,73.0480],[19.1980,73.0550],[19.2000,73.0600],[19.2050,73.0650]],
      [[19.1800,73.0280],[19.1700,73.0380],[19.1650,73.0420]],
      [[19.1800,73.0280],[19.1700,73.0380],[19.1850,73.0350],[19.1900,73.0300]]
    ];
    const colors = ['#FF5A00','#221F60','#FFB800','#00aa00'];
    routeCoords.forEach((coords, i) => L.polyline(coords, {color: colors[i], weight: 4}).addTo(map));
  },
  
  setupMobileNav() {
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('active');
    });
  },
  
  setupExitIntent() {
    let scrolled = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5 && !scrolled) {
        scrolled = true;
        console.log('Exit intent popup triggered');
      }
    });
  },
  
  init() {
    this.updateAllPrices();
    this.startPriceTimer();
    this.startLiveUpdates();
    this.startNotifications();
    this.startCounters();
    this.setupMobileNav();
    this.setupExitIntent();
    this.buildCoverageMap();
    
    document.getElementById('whatsappBookBtn').addEventListener('click', () => this.bookViaWhatsApp());
    document.getElementById('heroBookBtn').addEventListener('click', () => this.modalWhatsApp());
    document.getElementById('finalCtaBtn').addEventListener('click', () => this.modalWhatsApp());
    document.getElementById('closeVideoModal').addEventListener('click', () => this.closeVideoModal());
    document.getElementById('timeSlider').addEventListener('input', () => this.updateHeatmap());
    document.getElementById('affiliateSlider').addEventListener('input', () => this.updateAffiliate());
    document.getElementById('launchContestBtn').addEventListener('click', () => this.launchContest());
    document.getElementById('calcRoiBtn').addEventListener('click', () => this.updateROICalc());
    document.getElementById('eyeRickshaw').addEventListener('input', () => this.updateEyeCalc());
    document.getElementById('eyeHours').addEventListener('input', () => this.updateEyeCalc());
    document.getElementById('campRickshaws').addEventListener('input', () => this.updateBookingEstimate());
    document.getElementById('campDuration').addEventListener('input', () => this.updateBookingEstimate());
    
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.showComparison(e.target.dataset.tab);
      });
    });
    
    this.showComparison('instagram');
    this.updateEyeCalc();
    this.updateBookingEstimate();
  }
};

window.addEventListener('load', () => RASAAI.init());
