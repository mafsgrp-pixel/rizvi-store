// app.js - Data objects and HTML builders
const RASAAI_DATA = {
  routes: [
    { name: "Route 1", path: "Mumbra → Kausa → MM Valley Road", stops: 3, rickshaws: 45, views: "12K", img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg" },
    { name: "Route 2", path: "Mumbra → Kausa → Kalsekar Bypass → Shilphata → Kalyan Phata → Taloja Phase 1 & 2", stops: 6, rickshaws: 78, views: "28K", img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg" },
    { name: "Route 3", path: "Mumbra → Retibunder → Kalwa Naka", stops: 3, rickshaws: 32, views: "9K", img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg" },
    { name: "Route 4", path: "Mumbra → Retibunder → Check Naka → Majhiwada", stops: 4, rickshaws: 55, views: "15K", img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/16.jpg" }
  ],
  zones: [
    { name: "Mumbra Station", lat: 19.1800, lng: 73.0280, available: 12, total: 15, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/13.jpg" },
    { name: "Kausa", lat: 19.1765, lng: 73.0320, available: 8, total: 10, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/8.jpg" },
    { name: "MM Valley Road", lat: 19.1720, lng: 73.0250, available: 5, total: 6, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/7.jpg" },
    { name: "Kalsekar Bypass", lat: 19.1850, lng: 73.0500, available: 15, total: 18, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/6.jpg" },
    { name: "Shilphata", lat: 19.1950, lng: 73.0480, available: 7, total: 10, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/5.jpg" },
    { name: "Kalyan Phata", lat: 19.1980, lng: 73.0550, available: 20, total: 22, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/2.jpg" },
    { name: "Taloja Phase 1", lat: 19.2000, lng: 73.0600, available: 3, total: 5, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/1.jpg" },
    { name: "Taloja Phase 2", lat: 19.2050, lng: 73.0650, available: 9, total: 12, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images/noparking_slider/HANKS_ADVERTISING_AUTO_BRANDING.jpeg" },
    { name: "Retibunder", lat: 19.1700, lng: 73.0380, available: 11, total: 14, img: "https://www.hanksadvertising.com/cms/uploads/images/auto-rickshaw-advertising-ad.jpg" },
    { name: "Kalwa Naka", lat: 19.1650, lng: 73.0420, available: 6, total: 8, img: "https://www.hanksadvertising.com/cms/uploads/images/auto-ads-delhi.jpg" },
    { name: "Check Naka", lat: 19.1850, lng: 73.0350, available: 14, total: 16, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg" },
    { name: "Majhiwada", lat: 19.1900, lng: 73.0300, available: 4, total: 7, img: "https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg" }
  ]
};

function buildRoutes() {
  const grid = document.getElementById('routesGrid');
  grid.innerHTML = RASAAI_DATA.routes.map(r => `
    <div class="route-card" style="background-image: url('${r.img}')">
      <div class="route-card-content">
        <h3>${r.name}</h3>
        <p>${r.path}</p>
        <small>🛺 ${r.rickshaws} rickshaws • 👁️ ${r.views} views • 📍 ${r.stops} stops</small>
      </div>
    </div>
  `).join('');
}

function buildZoneCards() {
  const container = document.getElementById('zoneCardsContainer');
  container.innerHTML = RASAAI_DATA.zones.map(z => `
    <div class="zone-card">
      <div class="zone-card-img" style="background-image: url('${z.img}')"></div>
      <div class="zone-card-info">
        <h4>${z.name}</h4>
        <span class="availability-badge ${z.available > 5 ? 'badge-green' : 'badge-red'}">${z.available}/${z.total} available</span>
        <div style="font-size:0.8rem; margin-top:0.5rem;">👁️ 4.2K imp • 📈 87% coverage</div>
      </div>
    </div>
  `).join('');
}

function buildIntelCards() {
  const grid = document.getElementById('intelGrid');
  const ids = ['RJ-4521', 'RJ-7832', 'RJ-1290', 'RJ-5643', 'RJ-9087', 'RJ-2341'];
  grid.innerHTML = ids.map(id => `
    <div class="intel-card">
      <span class="gps-dot"></span> <strong>${id}</strong> • 🔋 ${Math.floor(Math.random()*40+60)}%
      <div>📍 ${RASAAI_DATA.zones[Math.floor(Math.random()*12)].name}</div>
      <div>🔊 Audio ON • 👁️ 1.2K views</div>
    </div>
  `).join('');
}

function buildTrustLogos() {
  const track = document.getElementById('trustTrack');
  const logos = ['https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/21.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/20.jpg',
    'https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/18.jpg'];
  const duplicated = [...logos, ...logos];
  track.innerHTML = duplicated.map(src => `<img src="${src}" alt="partner logo">`).join('');
}

function buildAudioColumns() {
  document.getElementById('audioColumns').innerHTML = ['Restaurant', 'Clinic', 'Education'].map(type => `
    <div class="audio-card">
      <span style="font-size:2rem;">🔊</span>
      <h4>${type} Ad</h4>
      <div class="waveform-bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
      <button class="btn-primary" onclick="RASAAI.playAudio()">▶ Play</button>
    </div>
  `).join('');
}

function buildFormats() {
  document.getElementById('formatsColumns').innerHTML = [
    { name: 'LED Display', feat: 'High visibility', price: '1x' },
    { name: 'Audio Announcement', feat: 'Ear-catching', price: '1x' },
    { name: 'LED+Audio Combo', feat: '⭐ Recommended', price: '1.8x' }
  ].map(f => `<div class="format-card"><h4>${f.name}</h4><p>${f.feat}</p><p>Price: ${f.price}</p></div>`).join('');
}

function buildVideoGrid() {
  document.getElementById('videoGrid').innerHTML = [1,2,3,4].map(i => `
    <div class="video-thumb" onclick="RASAAI.openVideo('dQw4w9WgXcQ')">
      <img src="https://www.hanksadvertising.com/cms/resources/assets/frontend/images2/1/Thumbnail/${i}.jpg">
      <div class="play-overlay">▶</div>
    </div>
  `).join('');
}

function populateSelects() {
  const routeSelects = document.querySelectorAll('#campRoute, #roiZone, #eyeZoneSelect');
  routeSelects.forEach(sel => {
    sel.innerHTML = RASAAI_DATA.routes.map(r => `<option>${r.name}</option>`).join('');
  });
}

// Initialize static content
document.addEventListener('DOMContentLoaded', () => {
  buildRoutes();
  buildZoneCards();
  buildIntelCards();
  buildTrustLogos();
  buildAudioColumns();
  buildFormats();
  buildVideoGrid();
  populateSelects();
  // Additional static sections
  document.getElementById('faqContainer').innerHTML = Array(8).fill(0).map((_,i) => `<details><summary>Question ${i+1} about RASAAI?</summary><p>Answer details here.</p></details>`).join('');
  document.getElementById('leaderboardList').innerHTML = RASAAI_DATA.zones.slice(0,5).map(z => `<li>${z.name} - ${z.available} active</li>`).join('');
});
