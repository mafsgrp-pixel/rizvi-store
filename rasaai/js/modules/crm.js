/*
 * Filename: crm.js
 * Path: /js/modules/crm.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Lead management, pipeline kanban, sales tasks, CRM analytics
 * Type: Module JavaScript
 */

// ============================================
// CRM STATE
// ============================================

const CRMState = {
    leads: [],
    tasks: [],
    activeLead: null,
    activeTask: null,
    isLoading: false,
    error: null,
    filters: {
        status: 'all',
        source: 'all',
        assignedTo: 'all',
        search: ''
    },
    sort: {
        field: 'created_at',
        order: 'desc'
    },
    pipeline: {
        new: [],
        contacted: [],
        qualified: [],
        proposal: [],
        negotiation: [],
        won: [],
        lost: []
    }
};

// ============================================
// DATA LOADING
// ============================================

async function loadLeads() {
    CRMState.isLoading = true;
    CRMState.error = null;

    try {
        let leads = [];

        if (FEATURES.googleSheets && navigator.onLine) {
            leads = await sheetsAPI.getSheetData(SHEETS.leads);
        } else {
            leads = getDemoSalesData()?.leads || [];
        }

        // Filter for assigned sales rep
        if (AuthState.currentUser?.role === 'sales') {
            leads = leads.filter(l => l.assigned_to === AuthState.currentUser.email);
        }

        CRMState.leads = leads;
        updatePipeline();
        CRMState.isLoading = false;

        console.log(`👥 Loaded ${leads.length} leads`);
        return leads;

    } catch (error) {
        CRMState.isLoading = false;
        CRMState.error = error.message;
        console.error('❌ Failed to load leads:', error);
        return [];
    }
}

async function loadTasks() {
    try {
        let tasks = [];

        if (FEATURES.googleSheets && navigator.onLine) {
            tasks = await sheetsAPI.getSheetData(SHEETS.tasks);
        } else {
            tasks = getDemoSalesData()?.tasks || [];
        }

        if (AuthState.currentUser?.role === 'sales') {
            tasks = tasks.filter(t => t.assigned_to === AuthState.currentUser.email);
        }

        CRMState.tasks = tasks;
        console.log(`📋 Loaded ${tasks.length} tasks`);
        return tasks;

    } catch (error) {
        console.error('❌ Failed to load tasks:', error);
        return [];
    }
}

// ============================================
// LEAD CRUD
// ============================================

async function createLead(leadData) {
    try {
        if (!leadData.name || !leadData.phone) {
            throw new Error('Name and phone are required');
        }

        const lead = {
            lead_id: generateId('LEAD'),
            name: leadData.name,
            company: leadData.company || '',
            phone: sanitizePhone(leadData.phone),
            email: sanitizeEmail(leadData.email) || '',
            source: leadData.source || 'website',
            status: 'new',
            assigned_to: leadData.assigned_to || getCurrentUserEmail(),
            notes: leadData.notes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            value: leadData.value || 0,
            last_contacted: null
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.leads, lead);
        }

        CRMState.leads.unshift(lead);
        updatePipeline();

        await logAudit('create_lead', getCurrentUserEmail(),
            `Created lead: ${lead.name} from ${lead.company}`);

        console.log(`✅ Lead created: ${lead.lead_id}`);
        return { success: true, lead };

    } catch (error) {
        console.error('❌ Lead creation failed:', error);
        return { success: false, error: error.message };
    }
}

async function updateLead(leadId, updates) {
    try {
        const index = CRMState.leads.findIndex(l => l.lead_id === leadId);
        if (index === -1) throw new Error('Lead not found');

        const updated = {
            ...CRMState.leads[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        CRMState.leads[index] = updated;

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.leads, 'lead_id', leadId, updates);
        }

        updatePipeline();
        console.log(`✅ Lead updated: ${leadId}`);
        return { success: true, lead: updated };

    } catch (error) {
        console.error('❌ Lead update failed:', error);
        return { success: false, error: error.message };
    }
}

async function deleteLead(leadId) {
    try {
        CRMState.leads = CRMState.leads.filter(l => l.lead_id !== leadId);

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.deleteRow(SHEETS.leads, 'lead_id', leadId);
        }

        updatePipeline();
        console.log(`✅ Lead deleted: ${leadId}`);
        return { success: true };

    } catch (error) {
        console.error('❌ Lead delete failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LEAD STATUS MANAGEMENT
// ============================================

async function moveLead(leadId, newStatus) {
    const validStatuses = Object.keys(LEAD_STATUSES);
    if (!validStatuses.includes(newStatus)) {
        return { success: false, error: 'Invalid status' };
    }

    return await updateLead(leadId, {
        status: newStatus,
        ...(newStatus === 'contacted' ? { last_contacted: new Date().toISOString() } : {})
    });
}

async function convertLeadToWon(leadId) {
    return await moveLead(leadId, 'won');
}

async function convertLeadToLost(leadId, reason = '') {
    return await updateLead(leadId, {
        status: 'lost',
        notes: CRMState.leads.find(l => l.lead_id === leadId)?.notes + `\nLost reason: ${reason}`
    });
}

// ============================================
// TASK MANAGEMENT
// ============================================

async function createTask(taskData) {
    try {
        const task = {
            task_id: generateId('TSK'),
            assigned_to: taskData.assigned_to || getCurrentUserEmail(),
            title: taskData.title,
            description: taskData.description || '',
            due_date: taskData.due_date || '',
            status: 'todo',
            priority: taskData.priority || 'medium',
            related_to: taskData.related_to || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.tasks, task);
        }

        CRMState.tasks.unshift(task);
        console.log(`✅ Task created: ${task.task_id}`);
        return { success: true, task };

    } catch (error) {
        console.error('❌ Task creation failed:', error);
        return { success: false, error: error.message };
    }
}

async function updateTask(taskId, updates) {
    try {
        const index = CRMState.tasks.findIndex(t => t.task_id === taskId);
        if (index === -1) throw new Error('Task not found');

        const updated = {
            ...CRMState.tasks[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        CRMState.tasks[index] = updated;

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.tasks, 'task_id', taskId, updates);
        }

        console.log(`✅ Task updated: ${taskId}`);
        return { success: true, task: updated };

    } catch (error) {
        console.error('❌ Task update failed:', error);
        return { success: false, error: error.message };
    }
}

async function completeTask(taskId) {
    return await updateTask(taskId, { status: 'done' });
}

// ============================================
// PIPELINE MANAGEMENT
// ============================================

function updatePipeline() {
    const pipeline = {
        new: [],
        contacted: [],
        qualified: [],
        proposal: [],
        negotiation: [],
        won: [],
        lost: []
    };

    CRMState.leads.forEach(lead => {
        if (pipeline[lead.status]) {
            pipeline[lead.status].push(lead);
        }
    });

    CRMState.pipeline = pipeline;
    return pipeline;
}

function getPipelineStats() {
    const pipeline = CRMState.pipeline;

    const total = CRMState.leads.length;
    const won = pipeline.won.length;
    const lost = pipeline.lost.length;
    const active = total - won - lost;

    const totalValue = CRMState.leads.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0);
    const wonValue = pipeline.won.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0);

    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
    const winRate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : 0;

    return {
        total,
        active,
        won,
        lost,
        totalValue,
        wonValue,
        conversionRate,
        winRate,
        pipeline: {
            new: pipeline.new.length,
            contacted: pipeline.contacted.length,
            qualified: pipeline.qualified.length,
            proposal: pipeline.proposal.length,
            negotiation: pipeline.negotiation.length
        }
    };
}

function getFilteredLeads() {
    let leads = [...CRMState.leads];

    if (CRMState.filters.status !== 'all') {
        leads = leads.filter(l => l.status === CRMState.filters.status);
    }
    if (CRMState.filters.source !== 'all') {
        leads = leads.filter(l => l.source === CRMState.filters.source);
    }
    if (CRMState.filters.assignedTo !== 'all') {
        leads = leads.filter(l => l.assigned_to === CRMState.filters.assignedTo);
    }
    if (CRMState.filters.search) {
        const search = CRMState.filters.search.toLowerCase();
        leads = leads.filter(l =>
            l.name?.toLowerCase().includes(search) ||
            l.company?.toLowerCase().includes(search) ||
            l.phone?.includes(search) ||
            l.email?.toLowerCase().includes(search)
        );
    }

    return leads;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderKanbanBoard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pipeline = CRMState.pipeline;
    const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

    let html = '<div class="kanban-board">';

    statuses.forEach(status => {
        const statusInfo = LEAD_STATUSES[status.toUpperCase()] || { label: status, color: '#666', bgColor: '#f5f5f5' };
        const leads = pipeline[status] || [];

        html += `
            <div class="kanban-column">
                <div class="kanban-column-header">
                    <span class="kanban-column-title" style="color:${statusInfo.color}">${statusInfo.label}</span>
                    <span class="kanban-column-count">${leads.length}</span>
                </div>
                <div class="kanban-cards">`;

        leads.forEach(lead => {
            html += `
                <div class="kanban-card" onclick="openLeadDetail('${lead.lead_id}')">
                    <div class="kanban-card-title">${lead.name}</div>
                    <div class="kanban-card-meta">
                        <span>${lead.company || 'No company'}</span>
                    </div>
                    <div class="kanban-card-footer">
                        <span class="kanban-card-value">${lead.value > 0 ? formatINR(lead.value) : ''}</span>
                        <span class="kanban-card-source">${lead.source}</span>
                    </div>
                </div>`;
        });

        html += `</div></div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

function renderLeadsTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const leads = getFilteredLeads();

    if (leads.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3 class="empty-state-title">No leads found</h3>
                <p class="empty-state-desc">Create your first lead to start building your pipeline</p>
                <button class="btn btn-primary" onclick="openNewLeadForm()">+ New Lead</button>
            </div>`;
        return;
    }

    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Lead</th>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Value</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;

    leads.forEach(lead => {
        const statusInfo = LEAD_STATUSES[lead.status?.toUpperCase()] || LEAD_STATUSES.NEW;

        html += `
            <tr>
                <td><strong>${lead.name}</strong></td>
                <td>${lead.company || '-'}</td>
                <td>
                    <small>📞 ${formatPhone(lead.phone)}</small><br>
                    <small>✉️ ${lead.email || '-'}</small>
                </td>
                <td><span class="badge badge-gray">${lead.source}</span></td>
                <td>
                    <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">
                        ${statusInfo.label}
                    </span>
                </td>
                <td>${lead.value > 0 ? formatINR(lead.value) : '-'}</td>
                <td>${formatDate(lead.created_at, 'DD/MM')}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-ghost" onclick="openLeadDetail('${lead.lead_id}')">👁️</button>
                        <button class="btn btn-sm btn-ghost" onclick="openWhatsApp('${lead.phone}', 'Hi ${lead.name}, regarding your interest in RASAAI advertising...')">💬</button>
                    </div>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function openLeadDetail(leadId) {
    const lead = CRMState.leads.find(l => l.lead_id === leadId);
    if (!lead) return;

    CRMState.activeLead = lead;

    const statusInfo = LEAD_STATUSES[lead.status?.toUpperCase()] || LEAD_STATUSES.NEW;

    const detailHTML = `
        <div class="lead-detail">
            <div class="detail-header">
                <span class="badge" style="background:${statusInfo.bgColor};color:${statusInfo.color}">${statusInfo.label}</span>
                <h3>${lead.name}</h3>
                <p>${lead.company || 'No company'}</p>
            </div>
            <div class="detail-grid">
                <div class="detail-item"><label>Phone</label><span>${formatPhone(lead.phone)}</span></div>
                <div class="detail-item"><label>Email</label><span>${lead.email || '-'}</span></div>
                <div class="detail-item"><label>Source</label><span>${lead.source}</span></div>
                <div class="detail-item"><label>Value</label><span>${lead.value > 0 ? formatINR(lead.value) : '-'}</span></div>
                <div class="detail-item"><label>Created</label><span>${formatDate(lead.created_at, 'DD MMM YYYY')}</span></div>
                <div class="detail-item"><label>Last Contacted</label><span>${formatDate(lead.last_contacted, 'DD MMM') || 'Never'}</span></div>
                <div class="detail-item"><label>Assigned To</label><span>${lead.assigned_to || '-'}</span></div>
            </div>
            <div class="detail-notes">
                <h4>Notes</h4>
                <p>${lead.notes || 'No notes'}</p>
            </div>
            <div class="detail-actions">
                <button class="btn btn-sm btn-success" onclick="moveLead('${lead.lead_id}', 'won')">🏆 Mark Won</button>
                <button class="btn btn-sm btn-ghost" onclick="moveLead('${lead.lead_id}', 'lost')">❌ Mark Lost</button>
                <a href="tel:${lead.phone}" class="btn btn-sm btn-outline">📞 Call</a>
                <a href="https://wa.me/91${lead.phone?.replace(/[^0-9]/g,'')}" target="_blank" class="btn btn-sm btn-whatsapp">💬 WhatsApp</a>
            </div>
        </div>`;

    if (typeof openModal === 'function') {
        document.getElementById('modal-body').innerHTML = detailHTML;
        openModal('detail-modal');
    }
}

// ============================================
// TARGET TRACKING
// ============================================

function getSalesTargetProgress() {
    const salesData = getDemoSalesData();
    const target = salesData?.targets?.monthly || 500000;
    const achieved = salesData?.targets?.achieved || 0;
    const percentage = target > 0 ? Math.round((achieved / target) * 100) : 0;

    return { target, achieved, percentage, remaining: target - achieved };
}

function renderTargetProgress(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const progress = getSalesTargetProgress();

    container.innerHTML = `
        <div class="target-tracker">
            <div class="target-header">
                <span>Monthly Target: ${formatINR(progress.target)}</span>
                <span class="target-value">${progress.percentage}%</span>
            </div>
            <div class="target-bar">
                <div class="target-fill" style="width:${Math.min(progress.percentage, 100)}%"></div>
            </div>
            <div class="target-details">
                <span>Achieved: ${formatINR(progress.achieved)}</span>
                <span>Remaining: ${formatINR(progress.remaining)}</span>
            </div>
        </div>`;
}

// ============================================
// INITIALIZATION
// ============================================

async function initCRM() {
    await Promise.all([loadLeads(), loadTasks()]);
    console.log('✅ CRM Module Loaded');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.kanban-board, .crm-container')) {
        initCRM();
    }
});

console.log('✅ CRM Module Ready');
