// platform.js - RASAAI Platform Dashboard System
const PLATFORM = {
  currentRole: null,

  openDashboard(role) {
    this.currentRole = role;
    const modal = document.getElementById('dashboardModal');
    const content = document.getElementById('dashboardContent');
    
    if (!modal || !content) return;

    switch(role) {
      case 'admin': this.renderAdminDashboard(content); break;
      case 'driver': this.renderDriverDashboard(content); break;
      case 'client': this.renderClientDashboard(content); break;
      case 'affiliate': this.renderAffiliateDashboard(content); break;
      default: content.innerHTML = '<p>Select a role to view dashboard</p>';
    }
    
    modal.classList.add('active');
  },

  // Admin Dashboard
  renderAdminDashboard(container) {
    const totalRickshaws = DATA.rickshaws?.length || 0;
    const activeRickshaws = DATA.rickshaws?.filter(r => r.status === 'active').length || 0;
    const totalCampaigns = DATA.campaigns?.length || 0;
    const totalRevenue = DATA.campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0) || 0;

    container.innerHTML = `
      <h2 style="margin-bottom:1.5rem">🔑 Admin Dashboard</h2>
      
      <div class="dashboard-grid" style="margin-bottom:2rem">
        <div class="dash-card">
          <div class="dash-stat">${activeRickshaws}/${totalRickshaws}</div>
          <div class="dash-label">Active Rickshaws</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">${totalCampaigns}</div>
          <div class="dash-label">Total Campaigns</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">₹${(totalRevenue/100000).toFixed(1)}L</div>
          <div class="dash-label">Total Revenue</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">${DATA.zones?.length || 0}</div>
          <div class="dash-label">Active Zones</div>
        </div>
      </div>

      <h3 style="margin-bottom:1rem">🛺 Rickshaw Fleet</h3>
      <div style="overflow-x:auto;margin-bottom:2rem">
        <table class="dash-table">
          <thead><tr><th>ID</th><th>Driver</th><th>Zone</th><th>Status</th><th>Battery</th><th>LED</th><th>Audio</th></tr></thead>
          <tbody>
            ${(DATA.rickshaws || []).map(r => {
              const zone = DATA.zones?.find(z => z.id === r.zone);
              return `
              <tr>
                <td><strong>${r.id}</strong></td>
                <td>${r.driver}</td>
                <td>${zone?.name || 'N/A'}</td>
                <td><span class="status-badge ${r.status === 'active' ? 'status-active' : 'status-pending'}">${r.status}</span></td>
                <td>${r.battery}%</td>
                <td>${r.ledStatus ? '🟢' : '🔴'}</td>
                <td>${r.audioStatus ? '🟢' : '🔴'}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>

      <h3 style="margin-bottom:1rem">📋 Campaigns</h3>
      <div style="overflow-x:auto">
        <table class="dash-table">
          <thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Rickshaws</th><th>Budget</th><th>Status</th></tr></thead>
          <tbody>
            ${(DATA.campaigns || []).map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.client}</td>
                <td>${c.type.toUpperCase()}</td>
                <td>${c.rickshaws}</td>
                <td>₹${c.budget?.toLocaleString()}</td>
                <td><span class="status-badge ${c.status === 'active' ? 'status-active' : 'status-pending'}">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // Driver Dashboard
  renderDriverDashboard(container) {
    const driverRickshaw = DATA.rickshaws?.[0] || {};
    const zone = DATA.zones?.find(z => z.id === driverRickshaw.zone);

    container.innerHTML = `
      <h2 style="margin-bottom:1.5rem">🛺 Driver Dashboard</h2>
      
      <div class="dashboard-grid" style="margin-bottom:2rem">
        <div class="dash-card">
          <div class="dash-stat">${driverRickshaw.id || 'RJ-0000'}</div>
          <div class="dash-label">Your Rickshaw ID</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">${zone?.name || 'Mumbra Station'}</div>
          <div class="dash-label">Current Zone</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">₹12,450</div>
          <div class="dash-label">Monthly Earnings</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">98%</div>
          <div class="dash-label">Uptime Rating</div>
        </div>
      </div>

      <div style="background:var(--gray-100);padding:1.5rem;border-radius:var(--radius);margin-bottom:1.5rem">
        <h4 style="margin-bottom:1rem">📊 Today's Stats</h4>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;text-align:center">
          <div><strong style="font-size:1.2rem">4.2K</strong><br><small style="color:var(--gray-500)">Eye Views</small></div>
          <div><strong style="font-size:1.2rem">18</strong><br><small style="color:var(--gray-500)">Trips</small></div>
          <div><strong style="font-size:1.2rem">6.5h</strong><br><small style="color:var(--gray-500)">Active Time</small></div>
        </div>
      </div>

      <div style="display:flex;gap:1rem">
        <button class="btn btn-primary" onclick="alert('Status: ONLINE ✅')">🟢 Go Online</button>
        <button class="btn btn-outline" onclick="alert('Status: OFFLINE')">🔴 Go Offline</button>
      </div>

      <div style="margin-top:1.5rem">
        <h4 style="margin-bottom:0.5rem">Active Campaign</h4>
        <div style="background:white;padding:1rem;border-radius:var(--radius-sm);border:2px solid var(--orange)">
          <strong>${DATA.campaigns?.[0]?.client || 'Sharma Restaurant'}</strong>
          <p style="font-size:0.85rem;color:var(--gray-500)">${DATA.campaigns?.[0]?.type?.toUpperCase() || 'COMBO'} Campaign</p>
        </div>
      </div>
    `;
  },

  // Client Dashboard
  renderClientDashboard(container) {
    const clientCampaigns = DATA.campaigns || [];
    const activeCampaigns = clientCampaigns.filter(c => c.status === 'active');
    const totalSpent = clientCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);

    container.innerHTML = `
      <h2 style="margin-bottom:1.5rem">👤 Client Dashboard</h2>
      
      <div class="dashboard-grid" style="margin-bottom:2rem">
        <div class="dash-card">
          <div class="dash-stat">${activeCampaigns.length}</div>
          <div class="dash-label">Active Campaigns</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">₹${totalSpent.toLocaleString()}</div>
          <div class="dash-label">Total Investment</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">4.8M</div>
          <div class="dash-label">Total Eye Views</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">312%</div>
          <div class="dash-label">Avg ROI</div>
        </div>
      </div>

      <h3 style="margin-bottom:1rem">📋 Your Campaigns</h3>
      <div style="overflow-x:auto;margin-bottom:2rem">
        <table class="dash-table">
          <thead><tr><th>Campaign</th><th>Type</th><th>Rickshaws</th><th>Duration</th><th>Budget</th><th>Status</th></tr></thead>
          <tbody>
            ${clientCampaigns.map(c => `
              <tr>
                <td><strong>${c.client}</strong></td>
                <td>${c.type?.toUpperCase()}</td>
                <td>${c.rickshaws}</td>
                <td>${c.duration} days</td>
                <td>₹${c.budget?.toLocaleString()}</td>
                <td><span class="status-badge ${c.status === 'active' ? 'status-active' : 'status-pending'}">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <button class="btn btn-primary btn-block" onclick="document.getElementById('campaignBuilder').scrollIntoView({behavior:'smooth'});document.getElementById('dashboardModal').classList.remove('active')">
        🎯 Create New Campaign
      </button>
    `;
  },

  // Affiliate Dashboard
  renderAffiliateDashboard(container) {
    const affiliate = DATA.affiliates?.[0] || { name: 'You', referralCode: 'RAS000', totalReferrals: 0, commissionEarned: 0, commissionPending: 0 };

    container.innerHTML = `
      <h2 style="margin-bottom:1.5rem">🤝 Affiliate Dashboard</h2>
      
      <div class="dashboard-grid" style="margin-bottom:2rem">
        <div class="dash-card">
          <div class="dash-stat">${affiliate.referralCode}</div>
          <div class="dash-label">Your Referral Code</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">${affiliate.totalReferrals}</div>
          <div class="dash-label">Total Referrals</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">₹${affiliate.commissionEarned?.toLocaleString()}</div>
          <div class="dash-label">Commission Earned</div>
        </div>
        <div class="dash-card">
          <div class="dash-stat">₹${affiliate.commissionPending?.toLocaleString()}</div>
          <div class="dash-label">Pending Payout</div>
        </div>
      </div>

      <div style="background:linear-gradient(135deg,var(--navy),#3b3486);color:white;padding:1.5rem;border-radius:var(--radius);text-align:center;margin-bottom:1.5rem">
        <h4>Your Referral Link</h4>
        <div style="background:rgba(255,255,255,0.15);padding:0.75rem;border-radius:8px;margin:0.5rem 0;word-break:break-all;font-size:0.85rem">
          https://rizvi.store/rasaainew/?ref=${affiliate.referralCode}
        </div>
        <button class="btn btn-sm" style="background:white;color:var(--navy);font-weight:700" onclick="navigator.clipboard.writeText('https://rizvi.store/rasaainew/?ref=${affiliate.referralCode}');alert('Link copied!')">
          📋 Copy Link
        </button>
      </div>

      <div style="background:var(--gray-100);padding:1.5rem;border-radius:var(--radius)">
        <h4 style="margin-bottom:0.5rem">💰 Commission Structure</h4>
        <ul style="font-size:0.9rem;line-height:2">
          <li>✅ 10% commission on every campaign booking</li>
          <li>✅ No limit on earnings</li>
          <li>✅ Monthly payouts via UPI/Bank</li>
          <li>✅ Real-time tracking dashboard</li>
        </ul>
      </div>
    `;
  }
};
