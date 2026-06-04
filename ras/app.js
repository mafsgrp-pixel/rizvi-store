// app.js - RASAAI Data Loading & Content Builders
let DATA = {};

// Load data from JSON
async function loadData() {
  try {
    const response = await fetch('data.json');
    DATA = await response.json();
    console.log('✅ RASAAI Data loaded successfully');
    buildAllSections();
  } catch (error) {
    console.error('❌ Error loading data:', error);
    // Fallback: try inline data
    if (typeof RASAAI_DATA !== 'undefined') {
      DATA = RASAAI_DATA;
      buildAllSections();
    }
  }
}

function buildAllSections() {
  buildRoutesGrid();
  buildZonesGrid();
  buildIntelGrid();
  buildTrustLogos();
  buildEyeCalculator();
  buildNeuroGrid();
  buildMetrics();
  buildComparison();
  buildAudioPlayer();
  buildFormatCards();
  buildBookingCard();
  buildPricingGrid();
  buildInventoryGrid();
  buildROICalculator();
  buildCaseStudies();
  buildIndustries();
  buildTestimonials();
  buildVideoGrid();
  buildHeatmap();
  buildLeaderboard();
  buildAffiliate();
  buildContest();
  buildHashtag();
  buildFAQ();
  populateModalZones();
}

// Routes Grid
function buildRoutesGrid() {
  const grid = document.getElementById('routesGrid');
  if (!grid || !DATA.routes) return;
  grid.innerHTML = DATA.routes.map(r => `
    <div class="route-card" style="background-image:url('${r.thumbnail}');background-size:cover;background-position:center" onclick="RASAAI.bookViaWhatsApp()">
      <div class="route-card-overlay">
        <span class="route-card-badge">${r.rickshawCount} 🛺</span>
        <h3 style="font-size:1.2rem;margin-bottom:0.3rem">${r.name}</h3>
        <p style="font-size:0.85rem;opacity:0.9;margin-bottom:0.5rem">${r.path}</p>
        <div style="display:flex;gap:1rem;font-size:0.75rem">
          <span>👁️ ${r.dailyEyeViews.toLocaleString()} views/day</span>
          <span>📍 ${r.stopCount} stops</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Zones Grid
function buildZonesGrid() {
  const grid = document.getElementById('zonesGrid');
  if (!grid || !DATA.zones) return;
  grid.innerHTML = DATA.zones.map(z => `
    <div class="zone-card" onclick="RASAAI.focusZone('${z.id}')">
      <div class="zone-card-img" style="background-image:url('${z.thumbnail}')"></div>
      <div class="zone-card-info">
        <h4 style="font-size:0.9rem;margin-bottom:4px">${z.name}</h4>
        <span class="zone-availability ${z.availableRickshaws > 5 ? 'avail-high' : 'avail-low'}">${z.availableRickshaws}/${z.totalRickshaws} available</span>
        <div style="font-size:0.7rem;color:var(--gray-500);margin-top:4px">👁️ ${(z.impressions/1000).toFixed(1)}K imp • ${z.coverage}% coverage</div>
      </div>
    </div>
  `).join('');
}

// Route Intelligence Grid
function buildIntelGrid() {
  const grid = document.getElementById('rickshawTrackGrid');
  if (!grid || !DATA.rickshaws) return;
  grid.innerHTML = DATA.rickshaws.map(r => {
    const zone = DATA.zones.find(z => z.id === r.zone);
    const route = DATA.routes.find(rt => rt.id === r.route);
    return `
    <div class="track-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <span class="gps-dot"></span>
        <strong>${r.id}</strong>
        <span style="font-size:0.75rem">🔋 ${r.battery}%</span>
      </div>
      <div style="font-size:0.85rem">📍 ${zone ? zone.name : 'Unknown'} → ${route ? route.name : 'N/A'}</div>
      <div style="font-size:0.75rem;color:var(--gray-500);margin-top:4px">
        🔊 ${r.audioStatus ? 'ON' : 'OFF'} • 💡 ${r.ledStatus ? 'ON' : 'OFF'} • 👁️ 1.2K views
      </div>
      <div style="font-size:0.7rem;color:var(--gray-500)">🚗 Driver: ${r.driver}</div>
    </div>
  `}).join('');
}

// Trust Logo Slider
function buildTrustLogos() {
  const track = document.getElementById('trustLogosTrack');
  if (!track) return;
  const logos = [
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/16.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/13.jpg'
  ];
  const duplicated = [...logos, ...logos, ...logos, ...logos];
  track.innerHTML = duplicated.map(src => `<img src="${src}" alt="partner" loading="lazy">`).join('');
}

// Eye View Calculator
function buildEyeCalculator() {
  const container = document.getElementById('eyeCalculator');
  if (!container) return;
  container.innerHTML = `
    <div class="calc-row">
      <label>Zone:</label>
      <select id="eyeZone" onchange="RASAAI.updateEyeCalc()" style="flex:1;padding:0.5rem;border-radius:8px;border:2px solid #eee">
        ${DATA.zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('')}
      </select>
    </div>
    <div class="calc-row">
      <label>Rickshaws:</label>
      <input type="range" id="eyeRickshaws" min="1" max="20" value="5" oninput="RASAAI.updateEyeCalc()">
      <span id="eyeRickshawVal">5</span>
    </div>
    <div class="calc-row">
      <label>Days:</label>
      <input type="range" id="eyeDays" min="1" max="90" value="30" oninput="RASAAI.updateEyeCalc()">
      <span id="eyeDaysVal">30</span>
    </div>
    <div class="calc-result">
      Estimated Eye Views: <span id="eyeViewResult" style="color:var(--orange)">0</span>
    </div>
    <p style="text-align:center;margin-top:0.5rem;color:var(--gray-500)">
      Cost per view: <strong id="eyeCPV">₹0.00</strong>
    </p>
  `;
}

// Neuromarketing Grid
function buildNeuroGrid() {
  const grid = document.getElementById('neuroGrid');
  if (!grid || !DATA.neuromarketing) return;
  grid.innerHTML = DATA.neuromarketing.map(n => `
    <div class="neuro-card">
      <div class="neuro-inner">
        <div class="neuro-front">
          <span class="neuro-icon">${n.icon}</span>
          <strong>${n.title}</strong>
        </div>
        <div class="neuro-back">
          <p>${n.description}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Metrics Grid
function buildMetrics() {
  const grid = document.getElementById('metricsGrid');
  if (!grid) return;
  const metrics = [
    { value: '₹0.04', label: 'Cost Per Eye View' },
    { value: '89%', label: 'Brand Recall Rate' },
    { value: '4.2s', label: 'Avg Attention Span' },
    { value: '0%', label: 'Skip Rate' }
  ];
  grid.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <div class="metric-value">${m.value}</div>
      <div class="metric-label">${m.label}</div>
    </div>
  `).join('');
  document.getElementById('metricsDetail').innerHTML = `
    <p style="text-align:center;color:var(--gray-500)">RASAAI measures <strong>real human eye views</strong> using GPS + traffic density + camera sensors. Not impressions. Not reach. <strong>Actual eyes on your ad.</strong></p>
  `;
}

// Comparison Tables
function buildComparison() {
  const tabs = document.getElementById('comparisonTabs');
  if (!tabs) return;
  tabs.innerHTML = ['instagram', 'facebook', 'youtube'].map(t => `
    <button class="comp-tab ${t === 'instagram' ? 'active' : ''}" onclick="RASAAI.showComparison('${t}')">${t.charAt(0).toUpperCase() + t.slice(1)}</button>
  `).join('');
}

// Audio Player
function buildAudioPlayer() {
  const container = document.getElementById('audioPlayer');
  if (!container) return;
  const types = [
    { name: 'Restaurant Ad', icon: '🍽️', desc: 'Food delivery & dine-in' },
    { name: 'Clinic Ad', icon: '🏥', desc: 'Healthcare services' },
    { name: 'Education Ad', icon: '📚', desc: 'Coaching & schools' }
  ];
  container.innerHTML = types.map(t => `
    <div class="audio-card">
      <div style="font-size:2.5rem;margin-bottom:0.5rem">${t.icon}</div>
      <h4>${t.name}</h4>
      <p style="font-size:0.85rem;color:var(--gray-500)">${t.desc}</p>
      <div class="waveform">
        <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
        <div class="wave-bar"></div><div class="wave-bar"></div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="RASAAI.playAudio()">▶ Play Sample</button>
    </div>
  `).join('');
}

// Ad Formats
function buildFormatCards() {
  const container = document.getElementById('formatCards');
  if (!container) return;
  const formats = [
    { name: 'LED Display', price: '₹1,238/day', features: ['High visibility','GPS tracked','Eye view analytics'], recommended: false },
    { name: 'Audio Announcement', price: '₹1,238/day', features: ['Voice ads','Zone targeting','Repetition effect'], recommended: false },
    { name: 'LED + Audio Combo', price: '₹2,228/day', features: ['Maximum impact','Audio-visual sync','70% better recall','Best value'], recommended: true }
  ];
  container.innerHTML = formats.map(f => `
    <div class="format-card ${f.recommended ? 'recommended' : ''}">
      ${f.recommended ? '<div class="recommended-badge">⭐ Recommended</div>' : ''}
      <h3>${f.name}</h3>
      <p style="font-size:1.5rem;font-weight:800;color:var(--orange);margin:0.75rem 0">${f.price}</p>
      <ul style="text-align:left;font-size:0.85rem">
        ${f.features.map(ft => `<li style="margin:0.3rem 0">✅ ${ft}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// Campaign Builder
function buildBookingCard() {
  const container = document.getElementById('bookingCard');
  if (!container) return;
  container.innerHTML = `
    <div class="form-group"><label>Your Name *</label><input type="text" id="campName" placeholder="Business or your name" required></div>
    <div class="form-group"><label>Campaign Type</label><select id="campType"><option value="led">LED Display</option><option value="audio">Audio Announcement</option><option value="combo">LED+Audio Combo</option></select></div>
    <div class="form-group"><label>Route</label><select id="campRoute">${DATA.routes.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}</select></div>
    <div class="form-group"><label>Number of Rickshaws</label><input type="number" id="campRickshaws" min="1" max="50" value="5"></div>
    <div class="form-group"><label>Duration (Days)</label><input type="number" id="campDuration" min="7" max="365" value="30"></div>
    <div class="form-group"><label>Phone Number *</label><input type="tel" id="campPhone" value="+919594306625" required></div>
    <div class="booking-estimate" id="bookingEstimate">Estimated: ₹0</div>
    <button onclick="RASAAI.bookViaWhatsApp()" class="btn btn-whatsapp btn-block btn-lg mt-2">💬 Book via WhatsApp</button>
    <button onclick="RASAAI.updateBookingEstimate()" class="btn btn-outline btn-block mt-1">🔄 Update Estimate</button>
    <p class="form-alt mt-2">Or call: <a href="tel:+919594306625"><strong>+91 95943 06625</strong></a></p>
  `;
}

// Pricing Grid
function buildPricingGrid() {
  const grid = document.getElementById('pricingGrid');
  if (!grid) return;
  const tiers = [
    { name: 'LED Only', multiplier: 1, rickshaws: '5-10', features: ['LED Screen','GPS Tracking','Basic Analytics'] },
    { name: 'Audio Only', multiplier: 1, rickshaws: '3-8', features: ['Voice Ads','Zone Targeting','Repetition'] },
    { name: 'Combo (Best Value)', multiplier: 1.8, rickshaws: '5-20', features: ['LED + Audio','GPS + Analytics','70% Better Recall','30 Free Social Creatives'] }
  ];
  grid.innerHTML = tiers.map(t => `
    <div class="pricing-card" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'})">
      <h4>${t.name}</h4>
      <div class="pricing-amount">₹${Math.floor(DATA.pricing.current * t.multiplier).toLocaleString()}<span style="font-size:0.9rem">/day</span></div>
      <p style="font-size:0.85rem;color:var(--gray-500)">${t.rickshaws} rickshaws</p>
      <ul style="text-align:left;font-size:0.8rem;margin-top:0.5rem">
        ${t.features.map(f => `<li>✅ ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// Inventory Grid
function buildInventoryGrid() {
  const grid = document.getElementById('inventoryGrid');
  if (!grid || !DATA.zones) return;
  grid.innerHTML = DATA.zones.map(z => `
    <div class="zone-card" style="padding:1rem">
      <h4 style="font-size:0.9rem">${z.name}</h4>
      <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0">
        <div style="flex:1;height:6px;background:var(--gray-200);border-radius:3px">
          <div style="width:${(z.availableRickshaws/z.totalRickshaws)*100}%;height:100%;background:${z.availableRickshaws > 5 ? '#22c55e' : '#ef4444'};border-radius:3px"></div>
        </div>
        <span style="font-size:0.8rem;font-weight:700">${z.availableRickshaws}/${z.totalRickshaws}</span>
      </div>
      <button class="btn btn-primary btn-sm btn-block" onclick="RASAAI.bookZone('${z.id}')">Book Zone</button>
    </div>
  `).join('');
}

// ROI Calculator
function buildROICalculator() {
  const container = document.getElementById('roiCalc');
  if (!container) return;
  container.innerHTML = `
    <div class="calc-row">
      <label>Business Type:</label>
      <select id="roiBusiness" style="flex:1;padding:0.5rem;border-radius:8px;border:2px solid #eee">
        <option>Restaurant</option><option>Clinic</option><option>Education</option><option>Retail</option>
      </select>
    </div>
    <div class="calc-row">
      <label>Zone:</label>
      <select id="roiZone" style="flex:1;padding:0.5rem;border-radius:8px;border:2px solid #eee">
        ${DATA.zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('')}
      </select>
    </div>
    <div class="calc-row">
      <label>Budget (₹):</label>
      <input type="number" id="roiBudget" value="50000" style="flex:1;padding:0.5rem;border-radius:8px;border:2px solid #eee">
    </div>
    <button class="btn btn-primary btn-block" onclick="RASAAI.calculateROI()">Calculate ROI</button>
    <div class="calc-result mt-2" id="roiResult">Projected ROI: --</div>
  `;
}

// Case Studies
function buildCaseStudies() {
  const grid = document.getElementById('caseStudiesGrid');
  if (!grid || !DATA.caseStudies) return;
  grid.innerHTML = DATA.caseStudies.map(c => `
    <div class="case-card">
      <div style="font-size:3rem">${c.icon}</div>
      <h4>${c.business}</h4>
      <div style="font-size:1.5rem;font-weight:800;color:var(--orange)">${c.result}</div>
      <p style="font-size:0.85rem;color:var(--gray-500)">${c.description}</p>
    </div>
  `).join('');
}

// Industries
function buildIndustries() {
  const grid = document.getElementById('industryCards');
  if (!grid || !DATA.industries) return;
  grid.innerHTML = DATA.industries.map(i => `
    <div class="industry-tag">${i}</div>
  `).join('');
}

// Testimonials
function buildTestimonials() {
  const slider = document.getElementById('testimonialSlider');
  if (!slider) return;
  const testimonials = Array(15).fill(0).map((_, i) => ({
    name: ['Rajesh','Priya','Amit','Sunita','Vikram','Neha','Suresh','Anita','Deepak','Meena','Rohit','Kavita','Arun','Pooja','Nikhil'][i],
    business: ['Restaurant','Clinic','Academy','Store','Salon','Gym','Pharmacy','Cafe','Real Estate','Jewelry','Hardware','Clothing','Travel','Bank','Insurance'][i],
    text: 'Best advertising decision! Our footfall increased 3x within the first month. Highly recommend RASAAI for local businesses.'
  }));
  const duplicated = [...testimonials, ...testimonials];
  slider.innerHTML = `<div class="testimonial-track">${duplicated.map(t => `
    <div class="testimonial-card">
      <div style="color:#f59e0b">⭐⭐⭐⭐⭐</div>
      <p style="font-size:0.85rem;margin:0.5rem 0">"${t.text}"</p>
      <strong>${t.name}</strong>
      <div style="font-size:0.75rem;color:var(--gray-500)">${t.business}</div>
    </div>
  `).join('')}</div>`;
}

// Video Grid
function buildVideoGrid() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  const videos = [
    { id: 'dQw4w9WgXcQ', thumb: 'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/1.jpg' },
    { id: 'dQw4w9WgXcQ', thumb: 'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/2.jpg' },
    { id: 'dQw4w9WgXcQ', thumb: 'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/5.jpg' },
    { id: 'dQw4w9WgXcQ', thumb: 'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/6.jpg' }
  ];
  grid.innerHTML = videos.map(v => `
    <div class="video-thumb" onclick="RASAAI.openVideo('${v.id}')">
      <img src="${v.thumb}" alt="video">
      <div class="video-play-btn"><span>▶</span></div>
    </div>
  `).join('');
}

// Heatmap
function buildHeatmap() {
  const container = document.getElementById('heatmapContainer');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align:center">
      <p style="margin-bottom:1rem">Drag slider to see zone intensity by time</p>
      <input type="range" class="heatmap-slider" id="heatmapSlider" min="6" max="22" value="8" oninput="RASAAI.updateHeatmap()">
      <div style="font-size:1.2rem;font-weight:700;margin-top:0.5rem" id="heatmapTime">8:00 AM</div>
      <div id="heatmapZones" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:0.5rem;margin-top:1rem"></div>
    </div>
  `;
}

// Leaderboard
function buildLeaderboard() {
  const container = document.getElementById('leaderboardContainer');
  if (!container || !DATA.zones) return;
  const sorted = [...DATA.zones].sort((a, b) => b.impressions - a.impressions).slice(0, 5);
  container.innerHTML = sorted.map((z, i) => `
    <div class="leaderboard-item">
      <span>🏆 ${i + 1}. ${z.name}</span>
      <span style="font-weight:700">${(z.impressions/1000).toFixed(1)}K impressions</span>
    </div>
  `).join('');
}

// Affiliate
function buildAffiliate() {
  const container = document.getElementById('affiliateContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="calculator-card">
      <h4 style="text-align:center;margin-bottom:1rem">Earn 10% Commission on Every Referral</h4>
      <div class="calc-row">
        <label>Referrals/month:</label>
        <input type="range" id="affiliateSlider" min="1" max="20" value="5" oninput="RASAAI.updateAffiliate()">
        <span id="affiliateCount">5</span>
      </div>
      <div class="calc-result">
        Estimated Monthly Commission: <span id="affiliateCommission" style="color:var(--orange)">₹0</span>
      </div>
      <button class="btn btn-whatsapp btn-block mt-2" onclick="RASAAI.joinAffiliate()">💬 Join Affiliate Program</button>
    </div>
  `;
}

// Contest
function buildContest() {
  const container = document.getElementById('contestContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="calculator-card">
      <div class="form-group"><label>Hashtag</label><input type="text" id="contestHashtag" value="#RASAAIcontest" placeholder="#YourHashtag"></div>
      <div class="form-group"><label>Prize</label><input type="text" id="contestPrize" value="Free Campaign Worth ₹10,000" placeholder="Prize description"></div>
      <div class="form-group"><label>Your Phone</label><input type="tel" id="contestPhone" value="+919594306625"></div>
      <button class="btn btn-whatsapp btn-block" onclick="RASAAI.launchContest()">🚀 Launch Contest via WhatsApp</button>
    </div>
  `;
}

// Hashtag
function buildHashtag() {
  const container = document.getElementById('hashtagContainer');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align:center">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:500px;margin:0 auto">
        <div class="metric-card"><div class="metric-value">12.4K</div><div class="metric-label">#RASAAI Mentions</div></div>
        <div class="metric-card"><div class="metric-value">8.7K</div><div class="metric-label">#MumbraAds</div></div>
        <div class="metric-card"><div class="metric-value">5.2K</div><div class="metric-label">#RickshawAd</div></div>
      </div>
    </div>
  `;
}

// FAQ
function buildFAQ() {
  const container = document.getElementById('faqContainer');
  if (!container || !DATA.faq) return;
  container.innerHTML = DATA.faq.map((f, i) => `
    <div class="faq-item ${i === 0 ? 'open' : ''}">
      <button class="faq-question" onclick="this.parentElement.classList.toggle('open')">
        ${f.q}
        <span>${i === 0 ? '−' : '+'}</span>
      </button>
      <div class="faq-answer">${f.a}</div>
    </div>
  `).join('');
}

function populateModalZones() {
  const select = document.getElementById('modalZone');
  if (!select || !DATA.zones) return;
  select.innerHTML = '<option>Select Zone</option>' + DATA.zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('');
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', loadData);
