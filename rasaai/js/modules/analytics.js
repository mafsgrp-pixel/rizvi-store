/*
 * Filename: analytics.js
 * Path: /js/modules/analytics.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Data analysis, reports, metrics calculation, analytics dashboard
 * Type: Module JavaScript
 */

// ============================================
// ANALYTICS STATE
// ============================================

const AnalyticsState = {
    period: 'monthly',
    startDate: null,
    endDate: null,
    selectedZone: 'all',
    selectedCampaign: 'all',
    isLoading: false,
    error: null,
    data: {
        revenue: [],
        campaigns: [],
        impressions: [],
        scans: [],
        audioPlays: [],
        driverEarnings: [],
        affiliateCommissions: []
    }
};

// ============================================
// DATA LOADING
// ============================================

async function loadAnalyticsData() {
    AnalyticsState.isLoading = true;
    AnalyticsState.error = null;

    try {
        const promises = [];

        if (FEATURES.googleSheets && navigator.onLine) {
            promises.push(
                sheetsAPI.getSheetData(SHEETS.campaigns).then(d => AnalyticsState.data.campaigns = d).catch(() => {}),
                sheetsAPI.getSheetData(SHEETS.payments).then(d => AnalyticsState.data.revenue = d).catch(() => {}),
                sheetsAPI.getSheetData(SHEETS.scanLogs).then(d => AnalyticsState.data.scans = d).catch(() => {}),
                sheetsAPI.getSheetData(SHEETS.audioLogs).then(d => AnalyticsState.data.audioPlays = d).catch(() => {}),
                sheetsAPI.getSheetData(SHEETS.attendance).then(d => AnalyticsState.data.driverEarnings = d).catch(() => {}),
                sheetsAPI.getSheetData(SHEETS.commissions).then(d => AnalyticsState.data.affiliateCommissions = d).catch(() => {})
            );
        } else {
            AnalyticsState.data.campaigns = DEMO_CAMPAIGNS || [];
            AnalyticsState.data.revenue = DEMO_PAYMENTS || [];
            AnalyticsState.data.scans = [];
            AnalyticsState.data.audioPlays = [];
            AnalyticsState.data.driverEarnings = [];
            AnalyticsState.data.affiliateCommissions = [];
        }

        await Promise.allSettled(promises);
        AnalyticsState.isLoading = false;

        console.log('📊 Analytics data loaded');
        return true;

    } catch (error) {
        AnalyticsState.isLoading = false;
        AnalyticsState.error = error.message;
        console.error('❌ Failed to load analytics data:', error);
        return false;
    }
}

// ============================================
// REVENUE ANALYTICS
// ============================================

function getRevenueData() {
    const payments = AnalyticsState.data.revenue.filter(p => p.status === 'verified');
    
    const total = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    // Group by month
    const monthly = {};
    payments.forEach(p => {
        const month = p.created_at?.substring(0, 7);
        if (month) {
            if (!monthly[month]) monthly[month] = 0;
            monthly[month] += parseFloat(p.amount) || 0;
        }
    });

    // Group by campaign type
    const byType = { led: 0, audio: 0, combo: 0 };
    payments.forEach(p => {
        const campaign = AnalyticsState.data.campaigns.find(c => c.campaign_id === p.invoice_id);
        if (campaign && byType[campaign.type] !== undefined) {
            byType[campaign.type] += parseFloat(p.amount) || 0;
        }
    });

    // Current month
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentMonthRevenue = monthly[currentMonth] || 0;
    
    // Previous month
    const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7);
    const prevMonthRevenue = monthly[prevMonth] || 0;
    
    // Growth
    const growth = prevMonthRevenue > 0 
        ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100) 
        : 0;

    return {
        total,
        currentMonth: currentMonthRevenue,
        previousMonth: prevMonthRevenue,
        growth,
        monthly,
        byType,
        gstCollected: total * (PRICING_CONFIG.gstRate / (100 + PRICING_CONFIG.gstRate)),
        averagePerPayment: payments.length > 0 ? total / payments.length : 0,
        totalPayments: payments.length
    };
}

// ============================================
// CAMPAIGN ANALYTICS
// ============================================

function getCampaignAnalytics() {
    const campaigns = AnalyticsState.data.campaigns;
    
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'active').length;
    const completed = campaigns.filter(c => c.status === 'completed').length;
    
    const totalImpressions = campaigns.reduce((sum, c) => sum + (parseInt(c.impressions) || 0), 0);
    const totalScans = campaigns.reduce((sum, c) => sum + (parseInt(c.scans) || 0), 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + (parseFloat(c.total_cost) || 0), 0);
    
    // Average CPM
    const avgCPM = totalImpressions > 0 ? (totalSpend / (totalImpressions / 1000)) : 0;
    
    // By zone
    const byZone = {};
    campaigns.forEach(c => {
        if (!byZone[c.zone]) byZone[c.zone] = { count: 0, spend: 0, impressions: 0 };
        byZone[c.zone].count++;
        byZone[c.zone].spend += parseFloat(c.total_cost) || 0;
        byZone[c.zone].impressions += parseInt(c.impressions) || 0;
    });
    
    // By type
    const byType = {};
    campaigns.forEach(c => {
        if (!byType[c.type]) byType[c.type] = { count: 0, spend: 0 };
        byType[c.type].count++;
        byType[c.type].spend += parseFloat(c.total_cost) || 0;
    });
    
    // By status
    const byStatus = {};
    campaigns.forEach(c => {
        if (!byStatus[c.status]) byStatus[c.status] = 0;
        byStatus[c.status]++;
    });
    
    return {
        total,
        active,
        completed,
        totalImpressions,
        totalScans,
        totalSpend,
        avgCPM,
        byZone,
        byType,
        byStatus,
        averageDuration: total > 0 ? Math.round(campaigns.reduce((sum, c) => sum + (parseInt(c.days) || 0), 0) / total) : 0,
        averageRickshaws: total > 0 ? Math.round(campaigns.reduce((sum, c) => sum + (parseInt(c.rickshaws) || 0), 0) / total) : 0
    };
}

// ============================================
// DRIVER ANALYTICS
// ============================================

function getDriverAnalytics() {
    const earnings = AnalyticsState.data.driverEarnings;
    const audioPlays = AnalyticsState.data.audioPlays;
    
    const totalEarnings = earnings.reduce((sum, e) => sum + (parseFloat(e.earnings) || 0), 0);
    const totalPlays = audioPlays.length;
    
    // Per driver
    const byDriver = {};
    earnings.forEach(e => {
        if (!byDriver[e.driver_email]) byDriver[e.driver_email] = { earnings: 0, days: 0 };
        byDriver[e.driver_email].earnings += parseFloat(e.earnings) || 0;
        byDriver[e.driver_email].days++;
    });
    
    // Per zone
    const byZone = {};
    audioPlays.forEach(p => {
        if (!byZone[p.driver_zone]) byZone[p.driver_zone] = 0;
        byZone[p.driver_zone]++;
    });
    
    return {
        totalEarnings,
        totalPlays,
        byDriver,
        byZone,
        averageEarningsPerDriver: Object.keys(byDriver).length > 0 
            ? totalEarnings / Object.keys(byDriver).length : 0,
        averagePlaysPerDay: totalPlays > 0 
            ? Math.round(totalPlays / new Set(audioPlays.map(p => p.played_at?.substring(0, 10))).size) : 0
    };
}

// ============================================
// PASSENGER ANALYTICS
// ============================================

function getPassengerAnalytics() {
    const scans = AnalyticsState.data.scans;
    
    const total = scans.length;
    const uniquePassengers = new Set(scans.map(s => s.passenger_email)).size;
    
    // By zone
    const byZone = {};
    scans.forEach(s => {
        if (!byZone[s.zone]) byZone[s.zone] = 0;
        byZone[s.zone]++;
    });
    
    // By day
    const byDay = {};
    scans.forEach(s => {
        const day = s.scanned_at?.substring(0, 10);
        if (day) {
            if (!byDay[day]) byDay[day] = 0;
            byDay[day]++;
        }
    });
    
    // Daily active scanners
    const dailyActive = Object.keys(byDay).length > 0 
        ? Math.round(total / Object.keys(byDay).length) : 0;
    
    return {
        total,
        uniquePassengers,
        byZone,
        byDay,
        dailyActive,
        averageScansPerPassenger: uniquePassengers > 0 ? (total / uniquePassengers).toFixed(1) : 0,
        totalCoinsEarned: scans.reduce((sum, s) => sum + (parseInt(s.coins_earned) || 0), 0)
    };
}

// ============================================
// AFFILIATE ANALYTICS
// ============================================

function getAffiliateAnalytics() {
    const commissions = AnalyticsState.data.affiliateCommissions;
    
    const totalCommissions = commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const pendingCommissions = commissions.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const approvedCommissions = commissions.filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    
    const byAffiliate = {};
    commissions.forEach(c => {
        if (!byAffiliate[c.affiliate_email]) byAffiliate[c.affiliate_email] = 0;
        byAffiliate[c.affiliate_email] += parseFloat(c.amount) || 0;
    });
    
    return {
        totalCommissions,
        pendingCommissions,
        approvedCommissions,
        byAffiliate,
        totalAffiliates: Object.keys(byAffiliate).length,
        averagePerAffiliate: Object.keys(byAffiliate).length > 0 
            ? totalCommissions / Object.keys(byAffiliate).length : 0
    };
}

// ============================================
// COMPARISON ANALYTICS
// ============================================

function compareCampaigns(campaignId1, campaignId2) {
    const c1 = AnalyticsState.data.campaigns.find(c => c.campaign_id === campaignId1);
    const c2 = AnalyticsState.data.campaigns.find(c => c.campaign_id === campaignId2);
    
    if (!c1 || !c2) return null;
    
    const c1CPM = (parseInt(c1.impressions) || 0) > 0 
        ? (parseFloat(c1.total_cost) || 0) / ((parseInt(c1.impressions) || 0) / 1000) : 0;
    const c2CPM = (parseInt(c2.impressions) || 0) > 0 
        ? (parseFloat(c2.total_cost) || 0) / ((parseInt(c2.impressions) || 0) / 1000) : 0;
    
    return {
        campaign1: {
            id: c1.campaign_id,
            type: c1.type,
            zone: c1.zone,
            cost: parseFloat(c1.total_cost) || 0,
            impressions: parseInt(c1.impressions) || 0,
            scans: parseInt(c1.scans) || 0,
            cpm: c1CPM
        },
        campaign2: {
            id: c2.campaign_id,
            type: c2.type,
            zone: c2.zone,
            cost: parseFloat(c2.total_cost) || 0,
            impressions: parseInt(c2.impressions) || 0,
            scans: parseInt(c2.scans) || 0,
            cpm: c2CPM
        },
        difference: {
            cost: (parseFloat(c2.total_cost) || 0) - (parseFloat(c1.total_cost) || 0),
            impressions: (parseInt(c2.impressions) || 0) - (parseInt(c1.impressions) || 0),
            cpm: c2CPM - c1CPM,
            winner: c1CPM < c2CPM ? c1.campaign_id : c2.campaign_id
        }
    };
}

// ============================================
// PERIOD COMPARISON
// ============================================

function comparePeriods(period1Data, period2Data) {
    const calcTotal = (data) => data.reduce((sum, item) => sum + (parseFloat(item.amount || item.total_cost) || 0), 0);
    const calcCount = (data) => data.length;
    
    const total1 = calcTotal(period1Data);
    const total2 = calcTotal(period2Data);
    const count1 = calcCount(period1Data);
    const count2 = calcCount(period2Data);
    
    return {
        period1: { total: total1, count: count1, average: count1 > 0 ? total1 / count1 : 0 },
        period2: { total: total2, count: count2, average: count2 > 0 ? total2 / count2 : 0 },
        change: {
            total: total2 - total1,
            percent: total1 > 0 ? Math.round(((total2 - total1) / total1) * 100) : 0,
            count: count2 - count1
        }
    };
}

// ============================================
// EXPORT ANALYTICS
// ============================================

function exportAnalyticsReport(format = 'csv') {
    const data = {
        revenue: getRevenueData(),
        campaigns: getCampaignAnalytics(),
        drivers: getDriverAnalytics(),
        passengers: getPassengerAnalytics(),
        affiliates: getAffiliateAnalytics()
    };
    
    if (format === 'csv') {
        let csv = 'Section,Metric,Value\n';
        
        csv += `Revenue,Total,${data.revenue.total}\n`;
        csv += `Revenue,Current Month,${data.revenue.currentMonth}\n`;
        csv += `Revenue,Growth,${data.revenue.growth}%\n`;
        csv += `Revenue,Total Payments,${data.revenue.totalPayments}\n`;
        
        csv += `Campaigns,Total,${data.campaigns.total}\n`;
        csv += `Campaigns,Active,${data.campaigns.active}\n`;
        csv += `Campaigns,Total Impressions,${data.campaigns.totalImpressions}\n`;
        csv += `Campaigns,Total Scans,${data.campaigns.totalScans}\n`;
        csv += `Campaigns,Avg CPM,${data.campaigns.avgCPM.toFixed(2)}\n`;
        
        csv += `Drivers,Total Earnings,${data.drivers.totalEarnings}\n`;
        csv += `Drivers,Total Plays,${data.drivers.totalPlays}\n`;
        
        csv += `Passengers,Total Scans,${data.passengers.total}\n`;
        csv += `Passengers,Unique Passengers,${data.passengers.uniquePassengers}\n`;
        
        csv += `Affiliates,Total Commissions,${data.affiliates.totalCommissions}\n`;
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rasaai-analytics-${getTodayDate()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    if (format === 'print') {
        window.print();
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderAnalyticsDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const revenue = getRevenueData();
    const campaigns = getCampaignAnalytics();
    const drivers = getDriverAnalytics();
    const passengers = getPassengerAnalytics();

    container.innerHTML = `
        <div class="analytics-dashboard">
            <div class="stats-row">
                <div class="stat-card-dashboard" onclick="highlightMetric('revenue')">
                    <div class="stat-card-icon-box green">💰</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Total Revenue</div>
                        <div class="stat-card-value">${formatINR(revenue.total)}</div>
                        <div class="stat-card-change ${revenue.growth >= 0 ? 'up' : 'down'}">
                            ${revenue.growth >= 0 ? '↑' : '↓'} ${Math.abs(revenue.growth)}% vs last month
                        </div>
                    </div>
                </div>

                <div class="stat-card-dashboard" onclick="highlightMetric('campaigns')">
                    <div class="stat-card-icon-box blue">📋</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Active Campaigns</div>
                        <div class="stat-card-value">${campaigns.active}</div>
                        <div class="stat-card-change">of ${campaigns.total} total</div>
                    </div>
                </div>

                <div class="stat-card-dashboard" onclick="highlightMetric('impressions')">
                    <div class="stat-card-icon-box orange">👁️</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Total Impressions</div>
                        <div class="stat-card-value">${formatCompactNumber(campaigns.totalImpressions)}</div>
                        <div class="stat-card-change">Avg CPM: ₹${campaigns.avgCPM.toFixed(2)}</div>
                    </div>
                </div>

                <div class="stat-card-dashboard" onclick="highlightMetric('drivers')">
                    <div class="stat-card-icon-box purple">🛺</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Driver Earnings</div>
                        <div class="stat-card-value">${formatINR(drivers.totalEarnings)}</div>
                        <div class="stat-card-change">${drivers.totalPlays} audio plays</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid-2">
                <div class="chart-widget">
                    <div class="chart-widget-header">
                        <span class="chart-widget-title">Revenue Trend</span>
                        <div class="chart-widget-actions">
                            <button class="chart-period-btn active" onclick="changePeriod('monthly')">Monthly</button>
                            <button class="chart-period-btn" onclick="changePeriod('weekly')">Weekly</button>
                        </div>
                    </div>
                    <div class="chart-widget-body">
                        <canvas id="revenue-chart" width="400" height="200"></canvas>
                    </div>
                </div>

                <div class="chart-widget">
                    <div class="chart-widget-header">
                        <span class="chart-widget-title">Campaigns by Zone</span>
                    </div>
                    <div class="chart-widget-body">
                        <canvas id="zone-chart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid-3">
                <div class="stat-card-dashboard">
                    <div class="stat-card-icon-box yellow">📱</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">QR Scans</div>
                        <div class="stat-card-value">${formatCompactNumber(passengers.total)}</div>
                        <div class="stat-card-change">${passengers.uniquePassengers} unique users</div>
                    </div>
                </div>

                <div class="stat-card-dashboard">
                    <div class="stat-card-icon-box green">✅</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Completed Campaigns</div>
                        <div class="stat-card-value">${campaigns.completed}</div>
                        <div class="stat-card-change">${campaigns.total > 0 ? Math.round((campaigns.completed / campaigns.total) * 100) : 0}% completion rate</div>
                    </div>
                </div>

                <div class="stat-card-dashboard">
                    <div class="stat-card-icon-box blue">🔗</div>
                    <div class="stat-card-info">
                        <div class="stat-card-label">Avg Campaign Value</div>
                        <div class="stat-card-value">${formatINR(campaigns.total > 0 ? campaigns.totalSpend / campaigns.total : 0)}</div>
                        <div class="stat-card-change">${campaigns.averageDuration} days avg</div>
                    </div>
                </div>
            </div>

            <div class="chart-widget">
                <div class="chart-widget-header">
                    <span class="chart-widget-title">Zone Performance</span>
                </div>
                <div class="table-widget-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Zone</th>
                                <th>Campaigns</th>
                                <th>Spend</th>
                                <th>Impressions</th>
                                <th>Avg CPM</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(campaigns.byZone).map(([zone, data]) => `
                                <tr>
                                    <td><strong>${zone}</strong></td>
                                    <td>${data.count}</td>
                                    <td>${formatINR(data.spend)}</td>
                                    <td>${formatCompactNumber(data.impressions)}</td>
                                    <td>₹${data.impressions > 0 ? (data.spend / (data.impressions / 1000)).toFixed(2) : '0.00'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

// ============================================
// INITIALIZATION
// ============================================

async function initAnalytics() {
    await loadAnalyticsData();
    console.log('✅ Analytics Module Loaded');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.analytics-dashboard, .analytics-container')) {
        initAnalytics();
    }
});

console.log('✅ Analytics Module Ready');
