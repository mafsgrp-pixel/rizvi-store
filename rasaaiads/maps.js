// ============================================
// RASAAI V2 - Maps & Route Intelligence
// ============================================

class MapsEngine {
    constructor() {
        this.maps = {};
        this.markers = [];
        this.init();
    }

    init() {
        this.buildCoverageMap();
        this.buildHeatmap();
    }

    buildCoverageMap() {
        const mapContainer = document.getElementById('coverageMap');
        if (!mapContainer) return;

        // Using Leaflet.js
        const map = L.map('coverageMap').setView([19.1800, 73.0350], 14);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        // Add zone markers
        Object.values(RASAAI_DATA.zones).forEach(zone => {
            const color = zone.coveragePercentage > 80 ? '#00C853' : 
                         zone.coveragePercentage > 70 ? '#FF6D00' : '#FF1744';
            
            const marker = L.circleMarker([zone.coordinates.lat, zone.coordinates.lng], {
                radius: Math.sqrt(zone.rickshawCount) * 2,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(map);

            marker.bindPopup(`
                <div style="font-family: sans-serif; min-width: 200px;">
                    <h3 style="margin: 0 0 8px; color: #0A1929;">📍 ${zone.name}</h3>
                    <p style="margin: 4px 0;">👁️ <strong>${zone.estimatedDailyEyeViews.toLocaleString('en-IN')}</strong> daily eye views</p>
                    <p style="margin: 4px 0;">🛺 <strong>${zone.rickshawCount}</strong> rickshaws</p>
                    <p style="margin: 4px 0;">📊 <strong>${zone.coveragePercentage}%</strong> coverage</p>
                    <p style="margin: 4px 0;">💰 From <strong>₹${zone.basePricePerDay}</strong>/day</p>
                    <button onclick="scrollToSection('pricing')" 
                            style="background: #00C853; color: white; border: none; padding: 8px 16px; 
                                   border-radius: 100px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 8px;">
                        Book This Zone
                    </button>
                </div>
            `);

            marker.on('click', () => {
                setTimeout(() => {
                    const popupButtons = document.querySelectorAll('.leaflet-popup button');
                    popupButtons.forEach(btn => {
                        btn.addEventListener('click', () => scrollToSection('pricing'));
                    });
                }, 100);
            });

            this.markers.push(marker);
        });

        // Add rickshaw simulation dots
        this.simulateRickshaws(map);
        
        this.maps.coverage = map;
    }

    simulateRickshaws(map) {
        const rickshaws = RASAAI_DATA.generateRickshawData().slice(0, 20);
        const rickshawMarkers = [];

        rickshaws.forEach(rick => {
            const marker = L.circleMarker([rick.lat, rick.lng], {
                radius: 4,
                fillColor: rick.gpsStatus === 'online' ? '#00E676' : '#FF5252',
                color: '#fff',
                weight: 1,
                fillOpacity: 0.9
            }).addTo(map);

            marker.bindTooltip(`${rick.id}: ${rick.currentRoute}`, {
                direction: 'top',
                offset: [0, -10]
            });

            rickshawMarkers.push({ marker, rick });

            // Simulate movement
            setInterval(() => {
                if (rick.gpsStatus === 'online') {
                    const newLat = rick.lat + (Math.random() * 0.002 - 0.001);
                    const newLng = rick.lng + (Math.random() * 0.002 - 0.001);
                    marker.setLatLng([newLat, newLng]);
                }
            }, 3000);
        });
    }

    buildHeatmap() {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;

        // Simple CSS-based heatmap visualization
        container.innerHTML = `
            <div class="heatmap-visual">
                <div class="heatmap-legend">
                    <span>Low Density</span>
                    <div class="heatmap-gradient"></div>
                    <span>High Density</span>
                </div>
                ${Object.values(RASAAI_DATA.zones).map(zone => {
                    const intensity = zone.coveragePercentage / 100;
                    const bgColor = `rgba(0, 200, 83, ${intensity * 0.7})`;
                    return `
                        <div class="heatmap-zone" style="
                            background: ${bgColor};
                            border: 2px solid ${intensity > 0.8 ? '#00C853' : 'rgba(0,200,83,0.3)'};
                        ">
                            <div class="heatmap-zone-info">
                                <strong>${zone.name}</strong>
                                <span>${zone.coveragePercentage}% coverage</span>
                                <span>${zone.rickshawCount} rickshaws</span>
                            </div>
                            <div class="heatmap-bar">
                                <div class="heatmap-fill" style="width: ${zone.coveragePercentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
                <div class="heatmap-time-slider">
                    <label>Time of Day:</label>
                    <input type="range" min="6" max="22" value="12" step="1"
                           oninput="document.getElementById('heatmapTime').textContent = this.value + ':00'">
                    <span id="heatmapTime">12:00</span>
                </div>
            </div>
        `;
    }
}

const mapsEngine = new MapsEngine();
