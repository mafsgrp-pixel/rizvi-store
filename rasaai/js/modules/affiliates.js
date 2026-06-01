/*
 * Filename: affiliates.js
 * Path: /js/modules/affiliates.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Affiliate tracking, referral links, commission management, withdrawals
 * Type: Module JavaScript
 */

// ============================================
// AFFILIATE STATE
// ============================================

const AffiliateState = {
    referrals: [],
    commissions: [],
    withdrawals: [],
    activeAffiliate: null,
    isLoading: false,
    error: null,
    stats: {
        totalClicks: 0,
        totalLeads: 0,
        totalConversions: 0,
        totalEarned: 0,
        pendingCommissions: 0,
        availableBalance: 0,
        totalWithdrawn: 0
    }
};

// ============================================
// DATA LOADING
// ============================================

async function loadAffiliateData(email = null) {
    AffiliateState.isLoading = true;
    AffiliateState.error = null;

    const userEmail = email || getCurrentUserEmail();

    try {
        // Load referrals
        if (FEATURES.googleSheets && navigator.onLine) {
            const allReferrals = await sheetsAPI.getSheetData(SHEETS.referrals);
            AffiliateState.referrals = allReferrals.filter(r => r.affiliate_email === userEmail);
            
            const allCommissions = await sheetsAPI.getSheetData(SHEETS.commissions);
            AffiliateState.commissions = allCommissions.filter(c => c.affiliate_email === userEmail);
            
            const allWithdrawals = await sheetsAPI.getSheetData(SHEETS.withdrawals);
            AffiliateState.withdrawals = allWithdrawals.filter(w => w.affiliate_email === userEmail);
        } else {
            const demoData = getDemoAffiliateData();
            AffiliateState.referrals = demoData?.referrals || [];
            AffiliateState.commissions = demoData?.commissions || [];
            AffiliateState.withdrawals = demoData?.withdrawals || [];
        }

        updateAffiliateStats();
        AffiliateState.isLoading = false;

        console.log(`🔗 Loaded affiliate data for ${userEmail}`);
        return true;

    } catch (error) {
        AffiliateState.isLoading = false;
        AffiliateState.error = error.message;
        console.error('❌ Failed to load affiliate data:', error);
        return false;
    }
}

// ============================================
// REFERRAL LINK MANAGEMENT
// ============================================

function generateReferralCode() {
    const user = getCurrentUser();
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'REF';
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return initials + random;
}

function generateReferralLink(code = null) {
    const referralCode = code || generateReferralCode();
    return `${APP_CONFIG.FULL_URL}/index.html?ref=${referralCode}`;
}

function getAffiliateReferralLink() {
    const user = getCurrentUser();
    const code = user?.referralCode || generateReferralCode();
    return {
        code: code,
        link: generateReferralLink(code),
        shortLink: `${APP_CONFIG.FULL_URL}/r/${code}`,
        whatsappMessage: `🚀 Boost your business with RASAAI! Get LED & Audio advertising on auto rickshaws in Mumbra. Starting at just ₹1,238/day!\n\nCheck it out: ${generateReferralLink(code)}\n\nUse my referral code: ${code}`,
        socialMessage: `I'm earning with RASAAI! 🛺 Join India's first auto rickshaw advertising network and get 10% commission on every booking. Sign up with my link: ${generateReferralLink(code)}`
    };
}

async function createReferralLink() {
    try {
        const linkData = getAffiliateReferralLink();

        const referral = {
            referral_id: generateId('REF'),
            affiliate_email: getCurrentUserEmail(),
            referral_code: linkData.code,
            link: linkData.link,
            clicks: 0,
            leads: 0,
            conversions: 0,
            created_at: new Date().toISOString()
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.referrals, referral);
        }

        AffiliateState.referrals.push(referral);
        console.log(`✅ Referral link created: ${linkData.code}`);
        return { success: true, linkData, referral };

    } catch (error) {
        console.error('❌ Failed to create referral link:', error);
        return { success: false, error: error.message };
    }
}

async function trackReferralClick(referralCode) {
    try {
        const referral = AffiliateState.referrals.find(r => r.referral_code === referralCode);
        if (!referral) return;

        const clicks = (parseInt(referral.clicks) || 0) + 1;
        await updateReferral(referral.referral_id, { clicks });
        console.log(`👆 Click tracked for: ${referralCode}`);
    } catch (error) {
        console.warn('⚠️ Click tracking failed');
    }
}

async function trackReferralConversion(referralCode) {
    try {
        const referral = AffiliateState.referrals.find(r => r.referral_code === referralCode);
        if (!referral) return;

        const conversions = (parseInt(referral.conversions) || 0) + 1;
        const leads = (parseInt(referral.leads) || 0) + 1;
        await updateReferral(referral.referral_id, { conversions, leads });
        console.log(`💰 Conversion tracked for: ${referralCode}`);
    } catch (error) {
        console.warn('⚠️ Conversion tracking failed');
    }
}

async function updateReferral(referralId, updates) {
    const index = AffiliateState.referrals.findIndex(r => r.referral_id === referralId);
    if (index !== -1) {
        AffiliateState.referrals[index] = { ...AffiliateState.referrals[index], ...updates };
    }

    if (FEATURES.googleSheets && navigator.onLine) {
        await sheetsAPI.updateRow(SHEETS.referrals, 'referral_id', referralId, updates).catch(() => {});
    }

    updateAffiliateStats();
}

// ============================================
// COMMISSION MANAGEMENT
// ============================================

function calculateCommission(bookingAmount) {
    return Math.round(bookingAmount * (AFFILIATE_CONFIG.commissionRate / 100));
}

async function creditCommission(affiliateEmail, campaignId, bookingAmount) {
    try {
        const commissionAmount = calculateCommission(bookingAmount);

        const commission = {
            commission_id: generateId('COM'),
            affiliate_email: affiliateEmail,
            campaign_id: campaignId,
            amount: commissionAmount,
            status: 'pending',
            earned_at: new Date().toISOString(),
            paid_at: null
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.commissions, commission);
        }

        AffiliateState.commissions.push(commission);
        updateAffiliateStats();

        console.log(`💰 Commission credited: ₹${commissionAmount} to ${affiliateEmail}`);
        return { success: true, commission };

    } catch (error) {
        console.error('❌ Commission credit failed:', error);
        return { success: false, error: error.message };
    }
}

function getPendingCommissions() {
    return AffiliateState.commissions.filter(c => c.status === 'pending');
}

function getApprovedCommissions() {
    return AffiliateState.commissions.filter(c => c.status === 'approved');
}

function getTotalEarned() {
    return AffiliateState.commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
}

function getAvailableBalance() {
    const approved = getApprovedCommissions().reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const withdrawn = AffiliateState.withdrawals
        .filter(w => w.status === 'completed')
        .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);
    return approved - withdrawn;
}

// ============================================
// WITHDRAWAL MANAGEMENT
// ============================================

async function requestWithdrawal(amount, method = 'upi', details = '') {
    try {
        const availableBalance = getAvailableBalance();

        if (amount < AFFILIATE_CONFIG.minWithdrawal) {
            throw new Error(`Minimum withdrawal amount is ₹${AFFILIATE_CONFIG.minWithdrawal}`);
        }

        if (amount > availableBalance) {
            throw new Error(`Insufficient balance. Available: ₹${formatIndianNumber(availableBalance)}`);
        }

        const withdrawal = {
            withdrawal_id: generateId('WTH'),
            affiliate_email: getCurrentUserEmail(),
            amount: amount,
            method: method,
            upi_id: method === 'upi' ? details : '',
            bank_details: method === 'bank' ? details : '',
            status: 'pending',
            requested_at: new Date().toISOString(),
            processed_at: null
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.withdrawals, withdrawal);
        }

        AffiliateState.withdrawals.push(withdrawal);
        updateAffiliateStats();

        await logAudit('request_withdrawal', getCurrentUserEmail(),
            `Withdrawal request: ₹${amount} via ${method}`);

        console.log(`💸 Withdrawal requested: ₹${amount}`);
        return { success: true, withdrawal };

    } catch (error) {
        console.error('❌ Withdrawal request failed:', error);
        return { success: false, error: error.message };
    }
}

async function processWithdrawal(withdrawalId, status = 'completed') {
    try {
        const index = AffiliateState.withdrawals.findIndex(w => w.withdrawal_id === withdrawalId);
        if (index === -1) throw new Error('Withdrawal not found');

        const updated = {
            ...AffiliateState.withdrawals[index],
            status: status,
            processed_at: new Date().toISOString()
        };

        AffiliateState.withdrawals[index] = updated;

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.withdrawals, 'withdrawal_id', withdrawalId, {
                status: status,
                processed_at: new Date().toISOString()
            });
        }

        updateAffiliateStats();
        console.log(`✅ Withdrawal ${withdrawalId}: ${status}`);
        return { success: true, withdrawal: updated };

    } catch (error) {
        console.error('❌ Withdrawal processing failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// STATISTICS
// ============================================

function updateAffiliateStats() {
    const referrals = AffiliateState.referrals;
    const commissions = AffiliateState.commissions;
    const withdrawals = AffiliateState.withdrawals;

    AffiliateState.stats = {
        totalClicks: referrals.reduce((sum, r) => sum + (parseInt(r.clicks) || 0), 0),
        totalLeads: referrals.reduce((sum, r) => sum + (parseInt(r.leads) || 0), 0),
        totalConversions: referrals.reduce((sum, r) => sum + (parseInt(r.conversions) || 0), 0),
        totalEarned: commissions.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
        pendingCommissions: commissions.filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0),
        availableBalance: getAvailableBalance(),
        totalWithdrawn: withdrawals.filter(w => w.status === 'completed')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        conversionRate: referrals.reduce((sum, r) => sum + (parseInt(r.clicks) || 0), 0) > 0
            ? Math.round((referrals.reduce((sum, r) => sum + (parseInt(r.conversions) || 0), 0) / 
                referrals.reduce((sum, r) => sum + (parseInt(r.clicks) || 0), 0)) * 100)
            : 0
    };

    return AffiliateState.stats;
}

function getAffiliateStats() {
    return { ...AffiliateState.stats };
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderAffiliateDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const linkData = getAffiliateReferralLink();
    const stats = getAffiliateStats();

    container.innerHTML = `
        <div class="affiliate-dashboard">
            <div class="wallet-card">
                <div class="wallet-label">Available Balance</div>
                <div class="wallet-balance">${formatINR(stats.availableBalance)}</div>
                <div class="wallet-actions">
                    <button class="btn btn-yellow btn-sm" onclick="openWithdrawModal()">💸 Withdraw</button>
                    <button class="btn btn-outline-white btn-sm" onclick="window.print()">📄 Statement</button>
                </div>
            </div>

            <div class="referral-box">
                <h3>Your Referral Link</h3>
                <div class="referral-code" onclick="copyReferralLink()" title="Click to copy">
                    ${linkData.code}
                </div>
                <div class="referral-link-box">
                    <input type="text" value="${linkData.link}" readonly id="referral-link-input">
                    <button class="btn btn-primary btn-sm" onclick="copyReferralLink()">📋 Copy</button>
                </div>
                <div class="referral-stats">
                    <div>
                        <span class="referral-stat-value">${formatCompactNumber(stats.totalClicks)}</span>
                        <span class="referral-stat-label">Clicks</span>
                    </div>
                    <div>
                        <span class="referral-stat-value">${formatCompactNumber(stats.totalLeads)}</span>
                        <span class="referral-stat-label">Leads</span>
                    </div>
                    <div>
                        <span class="referral-stat-value">${formatCompactNumber(stats.totalConversions)}</span>
                        <span class="referral-stat-label">Conversions</span>
                    </div>
                </div>
                <div class="share-buttons">
                    <button class="btn btn-whatsapp btn-sm" onclick="shareReferralWhatsApp()">💬 Share WhatsApp</button>
                    <button class="btn btn-outline btn-sm" onclick="shareReferralSocial()">📱 Share Social</button>
                </div>
            </div>
        </div>`;
}

function renderCommissionsTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const commissions = [...AffiliateState.commissions].reverse();

    if (commissions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <h3 class="empty-state-title">No commissions yet</h3>
                <p class="empty-state-desc">Share your referral link to start earning</p>
            </div>`;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>`;

    commissions.forEach(c => {
        html += `
            <tr>
                <td>${formatDate(c.earned_at, 'DD MMM YYYY')}</td>
                <td>${c.campaign_id || '-'}</td>
                <td><strong>${formatINR(c.amount)}</strong></td>
                <td>
                    <span class="badge ${c.status === 'approved' ? 'badge-green' : c.status === 'pending' ? 'badge-yellow' : 'badge-gray'}">
                        ${c.status}
                    </span>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function copyReferralLink() {
    const linkData = getAffiliateReferralLink();
    copyToClipboard(linkData.link).then(() => {
        showToast('Referral link copied! 📋', 'success');
    }).catch(() => {
        const input = document.getElementById('referral-link-input');
        if (input) {
            input.select();
            document.execCommand('copy');
            showToast('Referral link copied! 📋', 'success');
        }
    });
}

function shareReferralWhatsApp() {
    const linkData = getAffiliateReferralLink();
    openWhatsApp(linkData.whatsappMessage);
}

function shareReferralSocial() {
    const linkData = getAffiliateReferralLink();
    if (navigator.share) {
        navigator.share({
            title: 'Join RASAAI - Auto Rickshaw Advertising',
            text: linkData.socialMessage,
            url: linkData.link
        }).catch(() => {});
    } else {
        copyToClipboard(linkData.socialMessage);
        showToast('Message copied! Share it anywhere 📋', 'success');
    }
}

function openWithdrawModal() {
    const stats = getAffiliateStats();

    const modalContent = `
        <div class="withdraw-form">
            <h4>Request Withdrawal</h4>
            <p>Available Balance: <strong>${formatINR(stats.availableBalance)}</strong></p>
            <p>Minimum Withdrawal: ${formatINR(AFFILIATE_CONFIG.minWithdrawal)}</p>

            <div class="form-group">
                <label>Amount (₹)</label>
                <input type="number" id="withdraw-amount" min="${AFFILIATE_CONFIG.minWithdrawal}" max="${stats.availableBalance}" placeholder="Enter amount">
            </div>

            <div class="form-group">
                <label>Payment Method</label>
                <select id="withdraw-method">
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                </select>
            </div>

            <div class="form-group" id="upi-details-group">
                <label>UPI ID</label>
                <input type="text" id="withdraw-upi" placeholder="yourname@upi">
            </div>

            <div class="form-group hidden" id="bank-details-group">
                <label>Bank Account Details</label>
                <textarea id="withdraw-bank" placeholder="Account Number, IFSC, Account Holder Name"></textarea>
            </div>

            <button class="btn btn-primary btn-full" onclick="submitWithdrawal()">Submit Request</button>
        </div>`;

    if (typeof openModal === 'function') {
        document.getElementById('modal-body').innerHTML = modalContent;
        openModal('withdraw-modal');
    }
}

async function submitWithdrawal() {
    const amount = parseFloat(document.getElementById('withdraw-amount')?.value);
    const method = document.getElementById('withdraw-method')?.value;
    const details = method === 'upi' 
        ? document.getElementById('withdraw-upi')?.value 
        : document.getElementById('withdraw-bank')?.value;

    if (!amount || amount < AFFILIATE_CONFIG.minWithdrawal) {
        showToast(`Minimum withdrawal is ₹${AFFILIATE_CONFIG.minWithdrawal}`, 'warning');
        return;
    }

    if (!details) {
        showToast('Please enter payment details', 'warning');
        return;
    }

    const result = await requestWithdrawal(amount, method, details);

    if (result.success) {
        showToast('Withdrawal request submitted! 🎉', 'success');
        closeModal();
        renderAffiliateDashboard('affiliate-dashboard');
    } else {
        showToast(result.error || 'Withdrawal failed', 'error');
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function initAffiliates() {
    if (AuthState.isAuthenticated && 
        (AuthState.currentUser?.role === 'affiliate' || AuthState.currentUser?.role === 'client')) {
        await loadAffiliateData();
    }
    console.log('✅ Affiliates Module Loaded');
}

document.addEventListener('DOMContentLoaded', initAffiliates);

console.log('✅ Affiliates Module Ready');
