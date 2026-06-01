/*
 * Filename: campaigns.js
 * Path: /js/modules/campaigns.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Campaign CRUD operations, booking, management, status tracking
 * Type: Module JavaScript
 */

// ============================================
// CAMPAIGN STATE
// ============================================

const CampaignState = {
    campaigns: [],
    activeCampaign: null,
    isLoading: false,
    error: null,
    filters: {
        status: 'all',
        type: 'all',
        zone: 'all',
        search: ''
    },
    sort: {
        field: 'created_at',
        order: 'desc'
    }
};

// ============================================
// CAMPAIGN CRUD OPERATIONS
// ============================================

async function loadCampaigns(email = null) {
    CampaignState.isLoading = true;
    CampaignState.error = null;
    
    try {
        let campaigns = [];
        
        // Load from Google Sheets if online
        if (FEATURES.googleSheets && navigator.onLine) {
            campaigns = await sheetsAPI.getSheetData(SHEETS.campaigns);
        } else {
            // Use demo data for the logged-in user
            const userEmail = email || getCurrentUserEmail();
            campaigns = getDemoCampaigns(userEmail);
        }
        
        // Filter by user if provided
        if (email) {
            campaigns = campaigns.filter(c => c.client_email === email);
        } else if (AuthState.currentUser?.role === 'client') {
            campaigns = campaigns.filter(c => c.client_email === AuthState.currentUser.email);
        }
        
        CampaignState.campaigns = campaigns;
        CampaignState.isLoading = false;
        
        console.log(`📋 Loaded ${campaigns.length} campaigns`);
        return campaigns;
        
    } catch (error) {
        CampaignState.isLoading = false;
        CampaignState.error = error.message;
        console.error('❌ Failed to load campaigns:', error);
        return [];
    }
}

async function createCampaign(campaignData) {
    try {
        // Validate campaign data
        const validation = validateCampaignForm(campaignData);
        if (!validation.isValid) {
            throw new ValidationError('Campaign validation failed', validation.errors);
        }
        
        // Calculate costs
        const costBreakdown = calculateCampaignCost(
            campaignData.type,
            campaignData.zone,
            parseInt(campaignData.rickshaws),
            parseInt(campaignData.days)
        );
        
        // Create campaign object
        const campaign = {
            campaign_id: generateCampaignId(),
            client_email: campaignData.client_email || getCurrentUserEmail(),
            client_name: campaignData.client_name || getCurrentUser()?.name || '',
            company: campaignData.company || '',
            zone: campaignData.zone,
            type: campaignData.type,
            rickshaws: parseInt(campaignData.rickshaws),
            days: parseInt(campaignData.days),
            start_date: campaignData.start_date || '',
            end_date: campaignData.end_date || '',
            status: 'pending',
            base_price: costBreakdown.basePrice,
            zone_adjustment: costBreakdown.zoneMultiplier,
            discount: costBreakdown.discountTotal,
            subtotal: costBreakdown.subtotal,
            gst: costBreakdown.gst.total,
            total_cost: costBreakdown.grandTotal,
            creative_url: campaignData.creative_url || '',
            audio_url: campaignData.audio_url || '',
            impressions: 0,
            scans: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Save to Google Sheets
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.campaigns, campaign);
        }
        
        // Add to local state
        CampaignState.campaigns.unshift(campaign);
        
        // Log audit
        await logAudit('create_campaign', campaign.client_email, 
            `Created ${campaign.type} campaign in ${campaign.zone}`);
        
        console.log(`✅ Campaign created: ${campaign.campaign_id}`);
        return { success: true, campaign };
        
    } catch (error) {
        console.error('❌ Campaign creation failed:', error);
        return { success: false, error: error.message, errors: error.details || null };
    }
}

async function updateCampaign(campaignId, updates) {
    try {
        // Find campaign
        const index = CampaignState.campaigns.findIndex(c => c.campaign_id === campaignId);
        if (index === -1) throw new Error('Campaign not found');
        
        // Update local state
        const updatedCampaign = {
            ...CampaignState.campaigns[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        
        CampaignState.campaigns[index] = updatedCampaign;
        
        // Update in Google Sheets
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.campaigns, 'campaign_id', campaignId, updates);
        }
        
        // Log audit
        await logAudit('update_campaign', getCurrentUserEmail(), 
            `Updated campaign ${campaignId}`);
        
        console.log(`✅ Campaign updated: ${campaignId}`);
        return { success: true, campaign: updatedCampaign };
        
    } catch (error) {
        console.error('❌ Campaign update failed:', error);
        return { success: false, error: error.message };
    }
}

async function deleteCampaign(campaignId) {
    try {
        // Remove from local state
        CampaignState.campaigns = CampaignState.campaigns.filter(c => c.campaign_id !== campaignId);
        
        // Delete from Google Sheets
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.deleteRow(SHEETS.campaigns, 'campaign_id', campaignId);
        }
        
        // Log audit
        await logAudit('delete_campaign', getCurrentUserEmail(), 
            `Deleted campaign ${campaignId}`);
        
        console.log(`✅ Campaign deleted: ${campaignId}`);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Campaign delete failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// CAMPAIGN STATUS MANAGEMENT
// ============================================

async function approveCampaign(campaignId) {
    return await updateCampaignStatus(campaignId, 'approved');
}

async function activateCampaign(campaignId) {
    return await updateCampaignStatus(campaignId, 'active');
}

async function pauseCampaign(campaignId) {
    return await updateCampaignStatus(campaignId, 'paused');
}

async function completeCampaign(campaignId) {
    return await updateCampaignStatus(campaignId, 'completed');
}

async function cancelCampaign(campaignId) {
    return await updateCampaignStatus(campaignId, 'cancelled');
}

async function updateCampaignStatus(campaignId, newStatus) {
    const validStatuses = Object.keys(CAMPAIGN_STATUSES);
    if (!validStatuses.includes(newStatus)) {
        return { success: false, error: 'Invalid status' };
    }
    
    const result = await updateCampaign(campaignId, { 
        status: newStatus,
        ...(newStatus === 'active' ? { start_date: getTodayDate() } : {}),
        ...(newStatus === 'completed' ? { end_date: getTodayDate() } : {})
    });
    
    if (result.success) {
        console.log(`📋 Campaign ${campaignId} status: ${newStatus}`);
    }
    
    return result;
}

// ============================================
// CAMPAIGN QUERIES
// ============================================

function getCampaignById(campaignId) {
    return CampaignState.campaigns.find(c => c.campaign_id === campaignId) || null;
}

function getActiveCampaigns() {
    return CampaignState.campaigns.filter(c => c.status === 'active');
}

function getPendingCampaigns() {
    return CampaignState.campaigns.filter(c => c.status === 'pending');
}

function getCompletedCampaigns() {
    return CampaignState.campaigns.filter(c => c.status === 'completed');
}

function getCampaignsByZone(zone) {
    return CampaignState.campaigns.filter(c => c.zone === zone);
}

function getCampaignsByType(type) {
    return CampaignState.campaigns.filter(c => c.type === type);
}

function getCampaignsByStatus(status) {
    if (status === 'all') return CampaignState.campaigns;
    return CampaignState.campaigns.filter(c => c.status === status);
}

function getFilteredCampaigns() {
    let campaigns = [...CampaignState.campaigns];
    
    // Apply status filter
    if (CampaignState.filters.status !== 'all') {
        campaigns = campaigns.filter(c => c.status === CampaignState.filters.status);
    }
    
    // Apply type filter
    if (CampaignState.filters.type !== 'all') {
        campaigns = campaigns.filter(c => c.type === CampaignState.filters.type);
    }
    
    // Apply zone filter
    if (CampaignState.filters.zone !== 'all') {
        campaigns = campaigns.filter(c => c.zone === CampaignState.filters.zone);
    }
    
    // Apply search
    if (CampaignState.filters.search) {
        const search = CampaignState.filters.search.toLowerCase();
        campaigns = campaigns.filter(c => 
            c.campaign_id?.toLowerCase().includes(search) ||
            c.client_name?.toLowerCase().includes(search) ||
            c.company?.toLowerCase().includes(search) ||
            c.zone?.toLowerCase().includes(search)
        );
    }
    
    // Apply sort
    campaigns.sort((a, b) => {
        const field = CampaignState.sort.field;
        const order = CampaignState.sort.order === 'asc' ? 1 : -1;
        
        if (a[field] < b[field]) return -1 * order;
        if (a[field] > b[field]) return 1 * order;
        return 0;
    });
    
    return campaigns;
}

// ============================================
// CAMPAIGN STATS
// ============================================

function getCampaignStats() {
    const campaigns = CampaignState.campaigns;
    
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'active').length;
    const pending = campaigns.filter(c => c.status === 'pending').length;
    const completed = campaigns.filter(c => c.status === 'completed').length;
    const cancelled = campaigns.filter(c => c.status === 'cancelled').length;
    
    const totalSpend = campaigns.reduce((sum, c) => sum + (parseFloat(c.total_cost) || 0), 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + (parseInt(c.impressions) || 0), 0);
    const totalScans = campaigns.reduce((sum, c) => sum + (parseInt(c.scans) || 0), 0);
    
    const zoneBreakdown = {};
    campaigns.forEach(c => {
        if (!zoneBreakdown[c.zone]) zoneBreakdown[c.zone] = 0;
        zoneBreakdown[c.zone]++;
    });
    
    const typeBreakdown = {};
    campaigns.forEach(c => {
        if (!typeBreakdown[c.type]) typeBreakdown[c.type] = 0;
        typeBreakdown[c.type]++;
    });
    
    return {
        total,
        active,
        pending,
        completed,
        cancelled,
        totalSpend,
        totalImpressions,
        totalScans,
        zoneBreakdown,
        typeBreakdown,
        averageCost: total > 0 ? totalSpend / total : 0
    };
}

// ============================================
// CAMPAIGN DISPLAY
// ============================================

function renderCampaignTable(containerId, campaigns = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const data = campaigns || getFilteredCampaigns();
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3 class="empty-state-title">No campaigns found</h3>
                <p class="empty-state-desc">Create your first campaign to get started</p>
                <a href="/rasaai/pages/campaign.html" class="btn btn-primary">+ New Campaign</a>
            </div>`;
        return;
    }
    
    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Campaign ID</th>
                        <th>Client</th>
                        <th>Type</th>
                        <th>Zone</th>
                        <th>Rickshaws</th>
                        <th>Duration</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
    
    data.forEach(campaign => {
        const statusInfo = CAMPAIGN_STATUSES[campaign.status?.toUpperCase()] || CAMPAIGN_STATUSES.DRAFT;
        
        html += `
            <tr>
                <td><code>${campaign.campaign_id}</code></td>
                <td>
                    <strong>${campaign.client_name || 'N/A'}</strong>
                    <br><small>${campaign.company || ''}</small>
                </td>
                <td>${formatCampaignType(campaign.type)}</td>
                <td>${campaign.zone}</td>
                <td>${campaign.rickshaws}</td>
                <td>${campaign.days} days</td>
                <td>${formatINR(campaign.total_cost)}</td>
                <td>
                    <span class="status-badge status-badge-${campaign.status}" 
                          style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                        ${statusInfo.label}
                    </span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-ghost" onclick="viewCampaign('${campaign.campaign_id}')" title="View">👁️</button>
                        ${campaign.status === 'pending' ? 
                            `<button class="btn btn-sm btn-ghost" onclick="approveCampaign('${campaign.campaign_id}')" title="Approve">✅</button>` : ''}
                        ${campaign.status === 'approved' ? 
                            `<button class="btn btn-sm btn-ghost" onclick="activateCampaign('${campaign.campaign_id}')" title="Activate">▶️</button>` : ''}
                        ${campaign.status === 'active' ? 
                            `<button class="btn btn-sm btn-ghost" onclick="pauseCampaign('${campaign.campaign_id}')" title="Pause">⏸️</button>` : ''}
                    </div>
                </td>
            </tr>`;
    });
    
    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function renderCampaignCard(campaign) {
    const statusInfo = CAMPAIGN_STATUSES[campaign.status?.toUpperCase()] || CAMPAIGN_STATUSES.DRAFT;
    
    return `
        <div class="card campaign-card" data-id="${campaign.campaign_id}">
            <div class="card-header">
                <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                    ${statusInfo.icon} ${statusInfo.label}
                </span>
                <small>${formatDate(campaign.created_at, 'DD MMM')}</small>
            </div>
            <div class="card-body">
                <h4>${formatCampaignType(campaign.type)} Campaign</h4>
                <p>📍 ${campaign.zone} | 🛺 ${campaign.rickshaws} rickshaws | 📅 ${campaign.days} days</p>
                <div class="campaign-cost">${formatINR(campaign.total_cost)}</div>
            </div>
            <div class="card-footer">
                <small>${campaign.client_name || ''}</small>
                <button class="btn btn-sm btn-primary" onclick="viewCampaign('${campaign.campaign_id}')">View</button>
            </div>
        </div>`;
}

function viewCampaign(campaignId) {
    const campaign = getCampaignById(campaignId);
    if (!campaign) return;
    
    CampaignState.activeCampaign = campaign;
    
    // Navigate to campaign detail or open modal
    if (typeof openModal === 'function') {
        openModal('campaign-detail-modal');
        renderCampaignDetail(campaign);
    }
}

function renderCampaignDetail(campaign) {
    const container = document.getElementById('campaign-detail-content');
    if (!container) return;
    
    const statusInfo = CAMPAIGN_STATUSES[campaign.status?.toUpperCase()] || CAMPAIGN_STATUSES.DRAFT;
    
    container.innerHTML = `
        <div class="campaign-detail">
            <div class="detail-header">
                <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                    ${statusInfo.icon} ${statusInfo.label}
                </span>
                <h3>${campaign.campaign_id}</h3>
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Type</label>
                    <span>${formatCampaignType(campaign.type)}</span>
                </div>
                <div class="detail-item">
                    <label>Zone</label>
                    <span>${campaign.zone}</span>
                </div>
                <div class="detail-item">
                    <label>Rickshaws</label>
                    <span>${campaign.rickshaws}</span>
                </div>
                <div class="detail-item">
                    <label>Duration</label>
                    <span>${campaign.days} days</span>
                </div>
                <div class="detail-item">
                    <label>Start Date</label>
                    <span>${formatDate(campaign.start_date) || 'TBD'}</span>
                </div>
                <div class="detail-item">
                    <label>End Date</label>
                    <span>${formatDate(campaign.end_date) || 'TBD'}</span>
                </div>
                <div class="detail-item">
                    <label>Base Price</label>
                    <span>${formatINR(campaign.base_price)}</span>
                </div>
                <div class="detail-item">
                    <label>Discount</label>
                    <span>${formatINR(campaign.discount)}</span>
                </div>
                <div class="detail-item">
                    <label>GST</label>
                    <span>${formatINR(campaign.gst)}</span>
                </div>
                <div class="detail-item">
                    <label>Total Cost</label>
                    <strong>${formatINR(campaign.total_cost)}</strong>
                </div>
                <div class="detail-item">
                    <label>Impressions</label>
                    <span>${formatCompactNumber(campaign.impressions || 0)}</span>
                </div>
                <div class="detail-item">
                    <label>QR Scans</label>
                    <span>${campaign.scans || 0}</span>
                </div>
            </div>
            <div class="detail-actions">
                ${campaign.status === 'pending' ? 
                    `<button class="btn btn-success" onclick="approveCampaign('${campaign.campaign_id}')">✅ Approve</button>` : ''}
                ${campaign.status === 'active' ? 
                    `<button class="btn btn-warning" onclick="pauseCampaign('${campaign.campaign_id}')">⏸️ Pause</button>` : ''}
                <button class="btn btn-outline" onclick="window.print()">🖨️ Print</button>
            </div>
        </div>`;
}

// ============================================
// QUICK REBOOK
// ============================================

function quickRebook(campaignId) {
    const campaign = getCampaignById(campaignId);
    if (!campaign) return;
    
    // Pre-fill calculator and navigate to booking
    prefillCalculator(campaign.type, campaign.zone, campaign.rickshaws, campaign.days);
    
    const params = new URLSearchParams({
        type: campaign.type,
        zone: campaign.zone,
        rickshaws: campaign.rickshaws,
        days: campaign.days,
        rebook: campaignId
    });
    
    window.location.href = `/rasaai/pages/campaign.html?${params.toString()}`;
}

// ============================================
// INITIALIZATION
// ============================================

async function initCampaigns() {
    if (AuthState.isAuthenticated) {
        await loadCampaigns();
    }
    
    console.log('✅ Campaigns Module Loaded');
}

document.addEventListener('DOMContentLoaded', initCampaigns);

console.log('✅ Campaigns Module Ready');
