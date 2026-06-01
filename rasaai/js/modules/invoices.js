/*
 * Filename: invoices.js
 * Path: /js/modules/invoices.js
 * Project: RASAAI - Auto Ruckshaw Advertising Network
 * Description: Invoice generation, PDF export, payment tracking, invoice management
 * Type: Module JavaScript
 */

// ============================================
// INVOICE STATE
// ============================================

const InvoiceState = {
    invoices: [],
    activeInvoice: null,
    isLoading: false,
    error: null,
    filters: {
        status: 'all',
        type: 'all',
        search: ''
    }
};

// ============================================
// INVOICE DATA LOADING
// ============================================

async function loadInvoices(email = null) {
    InvoiceState.isLoading = true;
    InvoiceState.error = null;

    try {
        let invoices = [];

        if (FEATURES.googleSheets && navigator.onLine) {
            invoices = await sheetsAPI.getSheetData(SHEETS.invoices);
        } else {
            const userEmail = email || getCurrentUserEmail();
            invoices = getDemoInvoices(userEmail);
        }

        if (email) {
            invoices = invoices.filter(i => i.client_email === email);
        } else if (AuthState.currentUser?.role === 'client') {
            invoices = invoices.filter(i => i.client_email === AuthState.currentUser.email);
        }

        InvoiceState.invoices = invoices;
        InvoiceState.isLoading = false;

        console.log(`📄 Loaded ${invoices.length} invoices`);
        return invoices;

    } catch (error) {
        InvoiceState.isLoading = false;
        InvoiceState.error = error.message;
        console.error('❌ Failed to load invoices:', error);
        return [];
    }
}

// ============================================
// INVOICE GENERATION
// ============================================

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
}

async function generateInvoice(campaignData) {
    try {
        const invoiceNumber = generateInvoiceNumber();

        const invoice = {
            invoice_id: generateId('INV'),
            invoice_number: invoiceNumber,
            campaign_id: campaignData.campaign_id || '',
            client_email: campaignData.client_email,
            client_name: campaignData.client_name || '',
            company: campaignData.company || '',
            type: 'tax_invoice',
            amount: campaignData.subtotal || campaignData.amount,
            gst: campaignData.gst || 0,
            total: campaignData.total_cost || campaignData.total,
            status: 'pending',
            due_date: campaignData.due_date || addDays(new Date(), 7).toISOString().split('T')[0],
            paid_date: null,
            created_at: new Date().toISOString(),
            items: campaignData.items || [
                {
                    description: `${formatCampaignType(campaignData.type)} Campaign - ${campaignData.zone}`,
                    quantity: campaignData.rickshaws,
                    rate: campaignData.base_price,
                    amount: campaignData.subtotal
                }
            ],
            notes: campaignData.notes || 'Thank you for choosing RASAAI!',
            terms: 'Payment due within 7 days. Late payment may attract additional charges.'
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.invoices, invoice);
        }

        InvoiceState.invoices.unshift(invoice);

        await logAudit('generate_invoice', invoice.client_email,
            `Generated invoice ${invoice.invoice_number}`);

        console.log(`✅ Invoice generated: ${invoice.invoice_number}`);
        return { success: true, invoice };

    } catch (error) {
        console.error('❌ Invoice generation failed:', error);
        return { success: false, error: error.message };
    }
}

function generateInvoiceFromCampaign(campaign) {
    const costBreakdown = calculateCampaignCost(
        campaign.type,
        campaign.zone,
        parseInt(campaign.rickshaws),
        parseInt(campaign.days)
    );

    return generateInvoice({
        campaign_id: campaign.campaign_id,
        client_email: campaign.client_email,
        client_name: campaign.client_name,
        company: campaign.company,
        type: campaign.type,
        zone: campaign.zone,
        rickshaws: campaign.rickshaws,
        days: campaign.days,
        base_price: costBreakdown.pricePerRickshaw,
        subtotal: costBreakdown.subtotal,
        gst: costBreakdown.gst.total,
        total_cost: costBreakdown.grandTotal
    });
}

// ============================================
// INVOICE QUERIES
// ============================================

function getInvoiceById(invoiceId) {
    return InvoiceState.invoices.find(i => i.invoice_id === invoiceId) || null;
}

function getInvoiceByNumber(invoiceNumber) {
    return InvoiceState.invoices.find(i => i.invoice_number === invoiceNumber) || null;
}

function getInvoicesByCampaign(campaignId) {
    return InvoiceState.invoices.filter(i => i.campaign_id === campaignId);
}

function getPendingInvoices() {
    return InvoiceState.invoices.filter(i => i.status === 'pending');
}

function getPaidInvoices() {
    return InvoiceState.invoices.filter(i => i.status === 'paid');
}

function getOverdueInvoices() {
    const today = getTodayDate();
    return InvoiceState.invoices.filter(i =>
        i.status === 'pending' && i.due_date && i.due_date < today
    );
}

function getFilteredInvoices() {
    let invoices = [...InvoiceState.invoices];

    if (InvoiceState.filters.status !== 'all') {
        invoices = invoices.filter(i => i.status === InvoiceState.filters.status);
    }
    if (InvoiceState.filters.type !== 'all') {
        invoices = invoices.filter(i => i.type === InvoiceState.filters.type);
    }
    if (InvoiceState.filters.search) {
        const search = InvoiceState.filters.search.toLowerCase();
        invoices = invoices.filter(i =>
            i.invoice_number?.toLowerCase().includes(search) ||
            i.client_name?.toLowerCase().includes(search) ||
            i.client_email?.toLowerCase().includes(search)
        );
    }

    return invoices;
}

// ============================================
// INVOICE STATUS MANAGEMENT
// ============================================

async function markInvoiceAsPaid(invoiceId, paymentDetails = {}) {
    return await updateInvoice(invoiceId, {
        status: 'paid',
        paid_date: getTodayDate(),
        payment_method: paymentDetails.method || '',
        transaction_id: paymentDetails.transaction_id || ''
    });
}

async function cancelInvoice(invoiceId, reason = '') {
    return await updateInvoice(invoiceId, {
        status: 'cancelled',
        notes: `Cancelled: ${reason}`
    });
}

async function updateInvoice(invoiceId, updates) {
    try {
        const index = InvoiceState.invoices.findIndex(i => i.invoice_id === invoiceId);
        if (index === -1) throw new Error('Invoice not found');

        const updated = {
            ...InvoiceState.invoices[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        InvoiceState.invoices[index] = updated;

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.invoices, 'invoice_id', invoiceId, updates);
        }

        console.log(`✅ Invoice updated: ${invoiceId}`);
        return { success: true, invoice: updated };

    } catch (error) {
        console.error('❌ Invoice update failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// INVOICE STATS
// ============================================

function getInvoiceStats() {
    const invoices = InvoiceState.invoices;

    const total = invoices.length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const pending = invoices.filter(i => i.status === 'pending').length;
    const overdue = getOverdueInvoices().length;

    const totalAmount = invoices.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const paidAmount = invoices.filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const gstCollected = invoices.filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (parseFloat(i.gst) || 0), 0);

    return {
        total,
        paid,
        pending,
        overdue,
        totalAmount,
        paidAmount,
        pendingAmount,
        gstCollected,
        collectionRate: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
    };
}

// ============================================
// PDF GENERATION (window.print)
// ============================================

function printInvoice(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return;

    InvoiceState.activeInvoice = invoice;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        window.print();
        return;
    }

    printWindow.document.write(generateInvoiceHTML(invoice));
    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

function generateInvoiceHTML(invoice) {
    const costBreakdown = invoice.items || [
        { description: 'Campaign', quantity: 1, rate: invoice.amount, amount: invoice.amount }
    ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoice_number} - RASAAI</title>
    <style>
        @page { margin: 1.5cm; size: A4; }
        body { font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: #333; line-height: 1.6; }
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #221F60; padding-bottom: 20px; margin-bottom: 30px; }
        .invoice-logo { font-size: 24px; font-weight: 900; color: #221F60; }
        .invoice-title { font-size: 28px; font-weight: 900; color: #221F60; text-transform: uppercase; }
        .invoice-number { font-size: 14px; color: #666; }
        .party-section { display: flex; gap: 40px; margin-bottom: 30px; }
        .party-box { flex: 1; }
        .party-box h4 { font-size: 11px; text-transform: uppercase; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
        .party-box p { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #221F60; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .text-right { text-align: right; }
        .totals { width: 50%; margin-left: auto; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .grand-total { font-size: 16px; font-weight: bold; border-top: 2px solid #221F60; border-bottom: 2px solid #221F60; }
        .gst-info { margin-top: 10px; font-size: 10px; color: #666; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999; }
        .status-stamp { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-20deg); font-size: 60px; font-weight: 900; color: rgba(0,168,107,0.1); text-transform: uppercase; pointer-events: none; }
        @media print { .no-print { display: none; } }
    </style>
</head>
<body>
    <div style="position: relative;">
        ${invoice.status === 'paid' ? '<div class="status-stamp">PAID</div>' : ''}
        ${invoice.status === 'cancelled' ? '<div class="status-stamp" style="color: rgba(231,76,60,0.1);">CANCELLED</div>' : ''}

        <div class="invoice-header">
            <div>
                <div class="invoice-logo">RASAAI</div>
                <p>Mumbra, Thane, Maharashtra - 400612</p>
                <p>📞 +91 95943 06625 | ✉️ hello@rasaai.com</p>
                <p>GST: 27AAAAA0000A1Z5</p>
            </div>
            <div style="text-align:right;">
                <div class="invoice-title">TAX INVOICE</div>
                <div class="invoice-number">Invoice #: ${invoice.invoice_number}</div>
                <p>Date: ${formatDate(invoice.created_at, 'DD MMM YYYY')}</p>
                <p>Due Date: ${formatDate(invoice.due_date, 'DD MMM YYYY')}</p>
            </div>
        </div>

        <div class="party-section">
            <div class="party-box">
                <h4>Bill To:</h4>
                <p><strong>${invoice.client_name || 'Client'}</strong></p>
                <p>${invoice.company || ''}</p>
                <p>${invoice.client_email}</p>
            </div>
            <div class="party-box">
                <h4>From:</h4>
                <p><strong>RASAAI</strong></p>
                <p>Auto Rickshaw Advertising Network</p>
                <p>Mumbra, Thane, Maharashtra</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate (₹)</th>
                    <th class="text-right">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                ${costBreakdown.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.description}</td>
                    <td>${item.quantity || 1}</td>
                    <td>${formatIndianNumber(item.rate || item.amount)}</td>
                    <td class="text-right">${formatIndianNumber(item.amount)}</td>
                </tr>`).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${formatIndianNumber(invoice.amount)}</span>
            </div>
            <div class="total-row">
                <span>CGST (9%):</span>
                <span>₹${formatIndianNumber(invoice.gst / 2)}</span>
            </div>
            <div class="total-row">
                <span>SGST (9%):</span>
                <span>₹${formatIndianNumber(invoice.gst / 2)}</span>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>₹${formatIndianNumber(invoice.total)}</span>
            </div>
        </div>

        <div class="gst-info">
            <p><strong>GST Summary:</strong> CGST ₹${formatIndianNumber(invoice.gst / 2)} + SGST ₹${formatIndianNumber(invoice.gst / 2)} = Total GST ₹${formatIndianNumber(invoice.gst)}</p>
            <p><strong>Amount in Words:</strong> ${formatINRWords(invoice.total)} Only</p>
        </div>

        <div style="margin-top:30px;">
            <p><strong>Payment Details:</strong></p>
            <p>UPI: ${CONTACT.UPI_ID}</p>
            <p>PhonePe / Google Pay / Paytm accepted</p>
        </div>

        <div style="margin-top:20px;">
            <p><strong>Terms & Conditions:</strong></p>
            <p style="font-size:10px;color:#666;">${invoice.terms || 'Payment due within 7 days.'}</p>
        </div>

        <div style="margin-top:30px;text-align:right;">
            <p>Authorized Signatory</p>
            <p style="margin-top:30px;border-top:1px solid #333;width:150px;display:inline-block;padding-top:5px;">RASAAI</p>
        </div>

        <div class="footer">
            <p>This is a computer-generated invoice. Thank you for your business!</p>
            <p>RASAAI - India's First Hyperlocal Auto Rickshaw Advertising Network</p>
        </div>
    </div>
    <div class="no-print" style="text-align:center;margin-top:20px;">
        <button onclick="window.print()" style="padding:10px 30px;font-size:16px;cursor:pointer;background:#221F60;color:white;border:none;border-radius:25px;">🖨️ Print Invoice</button>
        <button onclick="window.close()" style="padding:10px 30px;font-size:16px;cursor:pointer;background:#666;color:white;border:none;border-radius:25px;margin-left:10px;">Close</button>
    </div>
</body>
</html>`;
}

function downloadInvoicePDF(invoiceId) {
    printInvoice(invoiceId);
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderInvoiceTable(containerId, invoices = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = invoices || getFilteredInvoices();

    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3 class="empty-state-title">No invoices found</h3>
                <p class="empty-state-desc">Invoices will appear here after campaign booking</p>
            </div>`;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>GST</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;

    data.forEach(inv => {
        const statusInfo = inv.status === 'paid' ? PAYMENT_STATUSES.VERIFIED :
                          inv.status === 'pending' ? PAYMENT_STATUSES.PENDING :
                          inv.status === 'cancelled' ? PAYMENT_STATUSES.FAILED :
                          PAYMENT_STATUSES.PENDING;

        html += `
            <tr>
                <td><code>${inv.invoice_number}</code></td>
                <td>${inv.client_name || inv.client_email}</td>
                <td>${inv.campaign_id || '-'}</td>
                <td>${formatINR(inv.amount)}</td>
                <td>${formatINR(inv.gst)}</td>
                <td><strong>${formatINR(inv.total)}</strong></td>
                <td>
                    <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                        ${statusInfo.label}
                    </span>
                </td>
                <td>${formatDate(inv.created_at, 'DD/MM/YYYY')}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-ghost" onclick="printInvoice('${inv.invoice_id}')" title="Print">🖨️</button>
                        ${inv.status === 'pending' ?
                            `<button class="btn btn-sm btn-ghost" onclick="markInvoiceAsPaid('${inv.invoice_id}')" title="Mark Paid">✅</button>` : ''}
                    </div>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

// ============================================
// INITIALIZATION
// ============================================

async function initInvoices() {
    if (AuthState.isAuthenticated) {
        await loadInvoices();
    }
    console.log('✅ Invoices Module Loaded');
}

document.addEventListener('DOMContentLoaded', initInvoices);

console.log('✅ Invoices Module Ready');
