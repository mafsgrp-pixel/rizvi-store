/*
 * Filename: payments.js
 * Path: /js/modules/payments.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Payment processing, UPI deep links, payment verification, transaction management
 * Type: Module JavaScript
 */

// ============================================
// PAYMENT STATE
// ============================================

const PaymentState = {
    payments: [],
    activePayment: null,
    isLoading: false,
    error: null,
    processingPayment: false,
    upiId: CONTACT.UPI_ID,
    upiLink: CONTACT.UPI_LINK
};

// ============================================
// PAYMENT DATA LOADING
// ============================================

async function loadPayments(email = null) {
    PaymentState.isLoading = true;
    PaymentState.error = null;

    try {
        let payments = [];

        if (FEATURES.googleSheets && navigator.onLine) {
            payments = await sheetsAPI.getSheetData(SHEETS.payments);
        } else {
            const userEmail = email || getCurrentUserEmail();
            payments = getDemoPayments(userEmail);
        }

        if (email) {
            payments = payments.filter(p => p.client_email === email);
        } else if (AuthState.currentUser?.role === 'client') {
            payments = payments.filter(p => p.client_email === AuthState.currentUser.email);
        }

        PaymentState.payments = payments;
        PaymentState.isLoading = false;

        console.log(`💳 Loaded ${payments.length} payments`);
        return payments;

    } catch (error) {
        PaymentState.isLoading = false;
        PaymentState.error = error.message;
        console.error('❌ Failed to load payments:', error);
        return [];
    }
}

// ============================================
// UPI PAYMENT PROCESSING
// ============================================

function generateUPILink(amount, invoiceId, description = 'RASAAI Campaign Payment') {
    const upiId = PaymentState.upiId;
    const name = 'RASAAI';
    const transactionNote = `${description} - ${invoiceId}`;
    const transactionRef = invoiceId + '_' + Date.now();

    // Build UPI deep link
    const upiURL = new URL('upi://pay');
    upiURL.searchParams.set('pa', upiId);
    upiURL.searchParams.set('pn', name);
    upiURL.searchParams.set('am', amount.toFixed(2));
    upiURL.searchParams.set('tn', transactionNote.substring(0, 40));
    upiURL.searchParams.set('tr', transactionRef.substring(0, 30));
    upiURL.searchParams.set('cu', 'INR');

    return {
        upiLink: upiURL.toString(),
        upiId: upiId,
        amount: amount,
        name: name,
        note: transactionNote,
        reference: transactionRef
    };
}

function generateUPIQRCode(amount, invoiceId) {
    const upiData = generateUPILink(amount, invoiceId);
    
    // Generate QR code data string
    const qrString = `upi://pay?pa=${upiData.upiId}&pn=${encodeURIComponent(upiData.name)}&am=${upiData.amount.toFixed(2)}&tn=${encodeURIComponent(upiData.note.substring(0, 40))}&cu=INR`;
    
    return {
        qrString: qrString,
        upiLink: upiData.upiLink,
        upiId: upiData.upiId,
        amount: upiData.amount
    };
}

function openUPIApp(amount, invoiceId, description = 'RASAAI Campaign Payment') {
    const upiData = generateUPILink(amount, invoiceId, description);
    
    // Try to open UPI app
    window.location.href = upiData.upiLink;
    
    // Store payment attempt
    sessionStorage.setItem('rasaai_pending_payment', JSON.stringify({
        invoice_id: invoiceId,
        amount: amount,
        reference: upiData.reference,
        timestamp: new Date().toISOString()
    }));
    
    return upiData;
}

function openPhonePe(amount, invoiceId) {
    const upiData = generateUPILink(amount, invoiceId);
    const phonePeLink = `phonepe://pay?pa=${upiData.upiId}&pn=RASAAI&am=${amount.toFixed(2)}&tn=${encodeURIComponent(upiData.note.substring(0, 40))}`;
    window.location.href = phonePeLink;
    return upiData;
}

function openGooglePay(amount, invoiceId) {
    const upiData = generateUPILink(amount, invoiceId);
    const gpayLink = `gpay://pay?pa=${upiData.upiId}&pn=RASAAI&am=${amount.toFixed(2)}&tn=${encodeURIComponent(upiData.note.substring(0, 40))}`;
    window.location.href = gpayLink;
    return upiData;
}

// ============================================
// PAYMENT CREATION
// ============================================

async function createPayment(paymentData) {
    try {
        const payment = {
            payment_id: generateId('PAY'),
            invoice_id: paymentData.invoice_id,
            client_email: paymentData.client_email || getCurrentUserEmail(),
            amount: parseFloat(paymentData.amount),
            method: paymentData.method || 'upi',
            upi_id: paymentData.upi_id || '',
            transaction_id: paymentData.transaction_id || '',
            status: 'pending',
            verified_by: null,
            verified_at: null,
            created_at: new Date().toISOString(),
            notes: paymentData.notes || ''
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.payments, payment);
        }

        PaymentState.payments.push(payment);
        PaymentState.activePayment = payment;

        console.log(`✅ Payment created: ${payment.payment_id}`);
        return { success: true, payment };

    } catch (error) {
        console.error('❌ Payment creation failed:', error);
        return { success: false, error: error.message };
    }
}

async function submitPaymentProof(paymentId, transactionId, screenshotUrl = '') {
    return await updatePayment(paymentId, {
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        status: 'pending'
    });
}

// ============================================
// PAYMENT VERIFICATION
// ============================================

async function verifyPayment(paymentId, verifiedBy = null) {
    try {
        const verifier = verifiedBy || getCurrentUserEmail();
        
        const result = await updatePayment(paymentId, {
            status: 'verified',
            verified_by: verifier,
            verified_at: new Date().toISOString()
        });

        if (result.success) {
            // Mark associated invoice as paid
            const payment = result.payment;
            if (payment.invoice_id) {
                await markInvoiceAsPaid(payment.invoice_id, {
                    method: payment.method,
                    transaction_id: payment.transaction_id
                });
            }

            // Calculate affiliate commission
            await calculateAffiliateCommission(payment);

            await logAudit('verify_payment', verifier,
                `Verified payment ${paymentId} for ₹${payment.amount}`);
        }

        return result;

    } catch (error) {
        console.error('❌ Payment verification failed:', error);
        return { success: false, error: error.message };
    }
}

async function rejectPayment(paymentId, reason = '') {
    return await updatePayment(paymentId, {
        status: 'failed',
        notes: reason
    });
}

async function refundPayment(paymentId, reason = '') {
    return await updatePayment(paymentId, {
        status: 'refunded',
        notes: reason || 'Payment refunded'
    });
}

async function updatePayment(paymentId, updates) {
    try {
        const index = PaymentState.payments.findIndex(p => p.payment_id === paymentId);
        if (index === -1) throw new Error('Payment not found');

        const updated = {
            ...PaymentState.payments[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        PaymentState.payments[index] = updated;

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.payments, 'payment_id', paymentId, updates);
        }

        console.log(`✅ Payment updated: ${paymentId} → ${updates.status || 'updated'}`);
        return { success: true, payment: updated };

    } catch (error) {
        console.error('❌ Payment update failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// AFFILIATE COMMISSION
// ============================================

async function calculateAffiliateCommission(payment) {
    // Check if this payment came from an affiliate referral
    const referral = await getReferralForPayment(payment);
    if (!referral) return;

    const commissionAmount = Math.round(payment.amount * (AFFILIATE_CONFIG.commissionRate / 100));

    const commission = {
        commission_id: generateId('COM'),
        affiliate_email: referral.affiliate_email,
        campaign_id: payment.invoice_id,
        payment_id: payment.payment_id,
        amount: commissionAmount,
        status: 'pending',
        earned_at: new Date().toISOString(),
        paid_at: null
    };

    if (FEATURES.googleSheets && navigator.onLine) {
        await sheetsAPI.appendRow(SHEETS.commissions, commission);
    }

    console.log(`💰 Affiliate commission: ₹${commissionAmount} for ${referral.affiliate_email}`);
}

async function getReferralForPayment(payment) {
    // Check if the client was referred by an affiliate
    // This would look up the referral tracking data
    return null; // Simplified - would check referral tracking in production
}

// ============================================
// PAYMENT QUERIES
// ============================================

function getPaymentById(paymentId) {
    return PaymentState.payments.find(p => p.payment_id === paymentId) || null;
}

function getPaymentsByInvoice(invoiceId) {
    return PaymentState.payments.filter(p => p.invoice_id === invoiceId);
}

function getPaymentsByClient(email) {
    return PaymentState.payments.filter(p => p.client_email === email);
}

function getPendingPayments() {
    return PaymentState.payments.filter(p => p.status === 'pending');
}

function getVerifiedPayments() {
    return PaymentState.payments.filter(p => p.status === 'verified');
}

function getPaymentStats() {
    const payments = PaymentState.payments;

    const total = payments.length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const verified = payments.filter(p => p.status === 'verified').length;
    const failed = payments.filter(p => p.status === 'failed').length;
    const refunded = payments.filter(p => p.status === 'refunded').length;

    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const verifiedAmount = payments.filter(p => p.status === 'verified')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return {
        total,
        pending,
        verified,
        failed,
        refunded,
        totalAmount,
        verifiedAmount,
        pendingAmount,
        verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0
    };
}

// ============================================
// PAYMENT DISPLAY
// ============================================

function renderPaymentsTable(containerId, payments = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = payments || PaymentState.payments;

    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <h3 class="empty-state-title">No payments yet</h3>
                <p class="empty-state-desc">Payments will appear here after invoice generation</p>
            </div>`;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Invoice</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Transaction ID</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;

    data.forEach(p => {
        const statusInfo = PAYMENT_STATUSES[p.status?.toUpperCase()] || PAYMENT_STATUSES.PENDING;

        html += `
            <tr>
                <td><code>${p.payment_id}</code></td>
                <td>${p.invoice_id || '-'}</td>
                <td>${p.client_email}</td>
                <td><strong>${formatINR(p.amount)}</strong></td>
                <td>${p.method?.toUpperCase() || '-'}</td>
                <td><code>${formatTransactionId(p.transaction_id)}</code></td>
                <td>
                    <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                        ${statusInfo.icon} ${statusInfo.label}
                    </span>
                </td>
                <td>${formatDate(p.created_at, 'DD/MM/YYYY')}</td>
                <td>
                    <div class="btn-group">
                        ${p.status === 'pending' ?
                            `<button class="btn btn-sm btn-success" onclick="verifyPayment('${p.payment_id}')">✅ Verify</button>
                             <button class="btn btn-sm btn-ghost" onclick="rejectPayment('${p.payment_id}')">❌ Reject</button>` : ''}
                    </div>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function renderPaymentModal(amount, invoiceId, description = 'Campaign Payment') {
    const upiData = generateUPILink(amount, invoiceId, description);

    return `
        <div class="payment-modal">
            <h3>Complete Your Payment</h3>
            <div class="payment-amount">
                <span class="payment-label">Amount to Pay</span>
                <span class="payment-value">${formatINR(amount, true, 2)}</span>
            </div>

            <div class="payment-upi-id">
                <span class="payment-label">UPI ID</span>
                <code class="payment-upi">${upiData.upiId}</code>
                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${upiData.upiId}')">📋 Copy</button>
            </div>

            <div class="payment-apps">
                <p>Pay via your preferred UPI app:</p>
                <div class="payment-app-buttons">
                    <button class="btn btn-outline" onclick="openGooglePay(${amount}, '${invoiceId}')">
                        Google Pay
                    </button>
                    <button class="btn btn-outline" onclick="openPhonePe(${amount}, '${invoiceId}')">
                        PhonePe
                    </button>
                    <button class="btn btn-outline" onclick="openUPIApp(${amount}, '${invoiceId}')">
                        Other UPI
                    </button>
                </div>
            </div>

            <div class="payment-manual">
                <p>Or pay manually to:</p>
                <p><strong>UPI ID:</strong> ${upiData.upiId}</p>
                <p><strong>Amount:</strong> ${formatINR(amount, true, 2)}</p>
                <p><strong>Note:</strong> ${upiData.note}</p>
            </div>

            <div class="payment-proof">
                <p>After payment, submit your transaction ID:</p>
                <input type="text" id="transaction-id-input" placeholder="Enter UPI Transaction ID" class="form-input">
                <button class="btn btn-primary btn-full" onclick="submitPaymentWithProof('${invoiceId}', ${amount})">
                    Submit Payment Proof
                </button>
            </div>
        </div>`;
}

async function submitPaymentWithProof(invoiceId, amount) {
    const transactionId = document.getElementById('transaction-id-input')?.value;
    if (!transactionId) {
        showToast('Please enter the transaction ID', 'warning');
        return;
    }

    const result = await createPayment({
        invoice_id: invoiceId,
        amount: amount,
        method: 'upi',
        transaction_id: transactionId
    });

    if (result.success) {
        showToast('Payment proof submitted successfully!', 'success');
        closeModal();
    } else {
        showToast(result.error || 'Failed to submit payment', 'error');
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function initPayments() {
    if (AuthState.isAuthenticated) {
        await loadPayments();
    }
    console.log('✅ Payments Module Loaded');
}

document.addEventListener('DOMContentLoaded', initPayments);

console.log('✅ Payments Module Ready');
