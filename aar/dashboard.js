// ============================================
// RASAAI - Admin Dashboard Controller
// Manage Rickshaws, Clients, Affiliates, Campaigns
// All data stored in localStorage
// ============================================

const Dashboard = {
    data: null,
    
    // Load data from localStorage or data.json
    init: async function() {
        // Try localStorage first
        const saved = localStorage.getItem('rasaai_dashboard');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            // Load from data.json
            try {
                const res = await fetch('data.json');
                const json = await res.json();
                this.data = {
                    rickshaws: this.generateRickshaws(json),
                    clients: [],
                    affiliates: [],
                    campaigns: [],
                    zones: json.zones,
                    routes: json.routes
                };
                this.save();
            } catch(e) {
                console.error('Failed to load data:', e);
            }
        }
        this.renderDashboard();
        this.startLiveUpdates();
    },

    // Generate 600 rickshaws from zone data
    generateRickshaws: function(json) {
        const rickshaws = [];
        let id = 1;
        json.zones.forEach(zone => {
            for(let i = 0; i < zone.totalRickshaws; i++) {
                rickshaws.push({
                    id: 'RKS-' + String(id).padStart(3, '0'),
                    zone: zone.id,
                    zoneName: zone.name,
                    status: Math.random() > 0.2 ? 'active' : 'maintenance',
                    gps: Math.random() > 0.05 ? 'online' : 'offline',
                    battery: Math.floor(Math.random() * 40) + 60,
                    ledStatus: Math.random() > 0.1 ? 'active' : 'inactive',
                    audioStatus: Math.random() > 0.15 ? 'active' : 'inactive',
                    assignedCampaign: null,
                    dailyEyeViews: Math.floor(Math.random() * 7000) + 8000,
                    lastService: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0]
                });
                id++;
            }
        });
        return rickshaws;
    },

    // Save to localStorage
    save: function() {
        localStorage.setItem('rasaai_dashboard', JSON.stringify(this.data));
    },

    // Export data as JSON file
    exportData: function() {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rasaai_backup_' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Data exported successfully!');
    },

    // Import data from JSON file
    importData: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.data = JSON.parse(event.target.result);
                    this.save();
                    this.renderDashboard();
                    alert('✅ Data imported successfully!');
                } catch(err) {
                    alert('❌ Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // Get statistics
    getStats: function() {
        const activeRicks = this.data.rickshaws.filter(r => r.status === 'active').length;
        const onlineGPS = this.data.rickshaws.filter(r => r.gps === 'online').length;
        const activeCampaigns = this.data.campaigns.filter(c => c.status === 'active').length;
        const totalClients = this.data.clients.length;
        const totalAffiliates = this.data.affiliates.length;
        const totalRevenue = this.data.campaigns.reduce((sum, c) => sum + (c.totalCost || 0), 0);
        const todayEyes = this.data.rickshaws.reduce((sum, r) => sum + r.dailyEyeViews, 0);
        
        return { activeRicks, onlineGPS, activeCampaigns, totalClients, totalAffiliates, totalRevenue, todayEyes };
    },

    // Add new client
    addClient: function(name, phone, zone, business) {
        const client = {
            id: 'CLI-' + String(this.data.clients.length + 1).padStart(3, '0'),
            name: name,
            phone: phone,
            zone: zone,
            businessName: business,
            totalCampaigns: 0,
            totalSpent: 0,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.data.clients.push(client);
        this.save();
        this.renderClients();
    },

    // Add new affiliate
    addAffiliate: function(name, phone) {
        const affiliate = {
            id: 'AFF-' + String(this.data.affiliates.length + 1).padStart(3, '0'),
            name: name,
            phone: phone,
            totalReferrals: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            referralCode: name.replace(/\s/g, '').toUpperCase() + Math.floor(Math.random() * 100),
            referredClients: [],
            joinDate: new Date().toISOString().split('T')[0]
        };
        this.data.affiliates.push(affiliate);
        this.save();
        this.renderAffiliates();
    },

    // Create campaign
    createCampaign: function(clientId, type, zone, rickshaws, duration, totalCost) {
        const campaign = {
            id: 'CMP-' + String(this.data.campaigns.length + 1).padStart(3, '0'),
            clientId: clientId,
            type: type,
            zone: zone,
            rickshaws: rickshaws,
            duration: duration,
            totalCost: totalCost,
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            eyeViewsDelivered: 0,
            impressionsDelivered: 0
        };
        this.data.campaigns.push(campaign);
        
        // Update client stats
        const client = this.data.clients.find(c => c.id === clientId);
        if (client) {
            client.totalCampaigns++;
            client.totalSpent += totalCost;
        }
        
        this.save();
        this.renderCampaigns();
    },

    // Book via WhatsApp
    bookViaWhatsapp: function() {
        const msg = 'Hi RASAAI! I want to book a rickshaw advertising campaign. Please share details.';
        window.open('https://wa.me/919594306625?text=' + encodeURIComponent(msg), '_blank');
    },

    // Delete item
    deleteItem: function(type, id) {
        if (!confirm('Delete this ' + type + '? This cannot be undone.')) return;
        this.data[type] = this.data[type].filter(item => item.id !== id);
        this.save();
        this.renderDashboard();
    },

    // Render full dashboard
    renderDashboard: function() {
        const stats = this.getStats();
        document.getElementById('dashContent').innerHTML = `
            <div class="dash-stats">
                <div class="dash-stat-card"><div class="dash-stat-num">${stats.activeRicks}</div><div class="dash-stat-lbl">Active Rickshaws</div></div>
                <div class="dash-stat-card"><div class="dash-stat-num">${stats.onlineGPS}</div><div class="dash-stat-lbl">GPS Online</div></div>
                <div class="dash-stat-card"><div class="dash-stat-num">${stats.activeCampaigns}</div><div class="dash-stat-lbl">Active Campaigns</div></div>
                <div class="dash-stat-card"><div class="dash-stat-num">${stats.totalClients}</div><div class="dash-stat-lbl">Total Clients</div></div>
                <div class="dash-stat-card"><div class="dash-stat-num">${stats.totalAffiliates}</div><div class="dash-stat-lbl">Affiliates</div></div>
                <div class="dash-stat-card"><div class="dash-stat-num">₹${(stats.totalRevenue/100000).toFixed(1)}L</div><div class="dash-stat-lbl">Revenue</div></div>
            </div>
            <div class="dash-tabs">
                <button class="dash-tab active" onclick="Dashboard.showTab('rickshaws')">🛺 Rickshaws</button>
                <button class="dash-tab" onclick="Dashboard.showTab('clients')">👥 Clients</button>
                <button class="dash-tab" onclick="Dashboard.showTab('campaigns')">📊 Campaigns</button>
                <button class="dash-tab" onclick="Dashboard.showTab('affiliates')">💰 Affiliates</button>
            </div>
            <div id="tabContent"></div>
        `;
        this.showTab('rickshaws');
    },

    showTab: function(tab) {
        document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        switch(tab) {
            case 'rickshaws': this.renderRickshaws(); break;
            case 'clients': this.renderClients(); break;
            case 'campaigns': this.renderCampaigns(); break;
            case 'affiliates': this.renderAffiliates(); break;
        }
    },

    renderRickshaws: function() {
        const container = document.getElementById('tabContent');
        const rickshaws = this.data.rickshaws.slice(0, 20);
        container.innerHTML = `
            <div class="dash-actions">
                <button class="btn btn-primary btn-sm" onclick="Dashboard.exportData()">📥 Export</button>
                <button class="btn btn-outline btn-sm" onclick="Dashboard.importData()">📤 Import</button>
                <span style="color:var(--gray-500);font-size:13px">Showing 20 of ${this.data.rickshaws.length} rickshaws</span>
            </div>
            <div class="dash-table">
                <table>
                    <thead><tr><th>ID</th><th>Zone</th><th>Status</th><th>GPS</th><th>Battery</th><th>LED</th><th>Audio</th><th>Daily Eyes</th><th>Action</th></tr></thead>
                    <tbody>
                        ${rickshaws.map(r => `
                            <tr>
                                <td><strong>${r.id}</strong></td>
                                <td>${r.zoneName}</td>
                                <td><span class="status-badge ${r.status}">${r.status}</span></td>
                                <td><span class="status-badge ${r.gps}">${r.gps}</span></td>
                                <td>${r.battery}%</td>
                                <td>${r.ledStatus}</td>
                                <td>${r.audioStatus}</td>
                                <td>${r.dailyEyeViews.toLocaleString('en-IN')}</td>
                                <td><button class="btn btn-sm" style="background:var(--red);color:white" onclick="Dashboard.deleteItem('rickshaws','${r.id}')">✕</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderClients: function() {
        const container = document.getElementById('tabContent');
        container.innerHTML = `
            <div class="dash-actions">
                <button class="btn btn-primary btn-sm" onclick="Dashboard.showAddClientForm()">➕ Add Client</button>
                <span style="color:var(--gray-500);font-size:13px">${this.data.clients.length} clients</span>
            </div>
            <div id="addClientForm" style="display:none;background:var(--gray-50);padding:20px;border-radius:var(--radius-lg);margin-bottom:16px">
                <h4>Add New Client</h4>
                <div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="newClientName"></div><div class="form-group"><label>Phone</label><input type="tel" id="newClientPhone"></div></div>
                <div class="form-row"><div class="form-group"><label>Business</label><input type="text" id="newClientBiz"></div><div class="form-group"><label>Zone</label><select id="newClientZone">${this.data.zones.map(z=>`<option>${z.name}</option>`).join('')}</select></div></div>
                <button class="btn btn-primary" onclick="Dashboard.submitClient()">Save Client</button>
            </div>
            ${this.data.clients.length === 0 ? '<p style="text-align:center;color:var(--gray-500);padding:40px">No clients yet. Add your first client!</p>' : `
                <div class="dash-table"><table><thead><tr><th>ID</th><th>Name</th><th>Business</th><th>Zone</th><th>Campaigns</th><th>Spent</th><th>Action</th></tr></thead><tbody>
                ${this.data.clients.map(c => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.businessName}</td><td>${c.zone}</td><td>${c.totalCampaigns}</td><td>₹${c.totalSpent.toLocaleString('en-IN')}</td><td><button class="btn btn-sm" style="background:var(--red);color:white" onclick="Dashboard.deleteItem('clients','${c.id}')">✕</button></td></tr>`).join('')}
                </tbody></table></div>
            `}
        `;
    },

    renderCampaigns: function() {
        const container = document.getElementById('tabContent');
        container.innerHTML = `
            <div class="dash-actions">
                <button class="btn btn-primary btn-sm" onclick="Dashboard.bookViaWhatsapp()">💬 New Booking</button>
                <span style="color:var(--gray-500);font-size:13px">${this.data.campaigns.length} campaigns</span>
            </div>
            ${this.data.campaigns.length === 0 ? '<p style="text-align:center;color:var(--gray-500);padding:40px">No campaigns yet. Book via WhatsApp to create one!</p>' : `
                <div class="dash-table"><table><thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Zone</th><th>Ricks</th><th>Days</th><th>Cost</th><th>Status</th></tr></thead><tbody>
                ${this.data.campaigns.map(c => `<tr><td>${c.id}</td><td>${c.clientId}</td><td>${c.type}</td><td>${c.zone}</td><td>${c.rickshaws}</td><td>${c.duration}</td><td>₹${c.totalCost.toLocaleString('en-IN')}</td><td><span class="status-badge ${c.status}">${c.status}</span></td></tr>`).join('')}
                </tbody></table></div>
            `}
        `;
    },

    renderAffiliates: function() {
        const container = document.getElementById('tabContent');
        container.innerHTML = `
            <div class="dash-actions">
                <button class="btn btn-primary btn-sm" onclick="Dashboard.showAddAffiliateForm()">➕ Add Affiliate</button>
                <span style="color:var(--gray-500);font-size:13px">${this.data.affiliates.length} affiliates</span>
            </div>
            <div id="addAffiliateForm" style="display:none;background:var(--gray-50);padding:20px;border-radius:var(--radius-lg);margin-bottom:16px">
                <h4>Add New Affiliate</h4>
                <div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="newAffName"></div><div class="form-group"><label>Phone</label><input type="tel" id="newAffPhone"></div></div>
                <button class="btn btn-primary" onclick="Dashboard.submitAffiliate()">Save Affiliate</button>
            </div>
            ${this.data.affiliates.length === 0 ? '<p style="text-align:center;color:var(--gray-500);padding:40px">No affiliates yet. Add your first affiliate!</p>' : `
                <div class="dash-table"><table><thead><tr><th>ID</th><th>Name</th><th>Referrals</th><th>Earnings</th><th>Code</th><th>Action</th></tr></thead><tbody>
                ${this.data.affiliates.map(a => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.totalReferrals}</td><td>₹${a.totalEarnings.toLocaleString('en-IN')}</td><td>${a.referralCode}</td><td><button class="btn btn-sm" style="background:var(--red);color:white" onclick="Dashboard.deleteItem('affiliates','${a.id}')">✕</button></td></tr>`).join('')}
                </tbody></table></div>
            `}
        `;
    },

    showAddClientForm: function() {
        document.getElementById('addClientForm').style.display = 'block';
    },

    showAddAffiliateForm: function() {
        document.getElementById('addAffiliateForm').style.display = 'block';
    },

    submitClient: function() {
        const name = document.getElementById('newClientName').value;
        const phone = document.getElementById('newClientPhone').value;
        const biz = document.getElementById('newClientBiz').value;
        const zone = document.getElementById('newClientZone').value;
        if (!name || !phone) { alert('Name and Phone required'); return; }
        this.addClient(name, phone, zone, biz);
        alert('✅ Client added!');
    },

    submitAffiliate: function() {
        const name = document.getElementById('newAffName').value;
        const phone = document.getElementById('newAffPhone').value;
        if (!name || !phone) { alert('Name and Phone required'); return; }
        this.addAffiliate(name, phone);
        alert('✅ Affiliate added!');
    },

    startLiveUpdates: function() {
        setInterval(() => {
            // Update random rickshaw data
            if (this.data && this.data.rickshaws) {
                const idx = Math.floor(Math.random() * this.data.rickshaws.length);
                if (this.data.rickshaws[idx]) {
                    this.data.rickshaws[idx].battery = Math.max(10, this.data.rickshaws[idx].battery - Math.floor(Math.random() * 3));
                    this.data.rickshaws[idx].dailyEyeViews += Math.floor(Math.random() * 100);
                }
            }
        }, 10000);
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
