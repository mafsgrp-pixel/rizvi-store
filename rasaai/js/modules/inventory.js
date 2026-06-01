/*
 * Filename: inventory.js
 * Path: /js/modules/inventory.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Rickshaw fleet management, zone availability, maintenance tracking
 * Type: Module JavaScript
 */

// ============================================
// INVENTORY STATE
// ============================================

const InventoryState = {
    rickshaws: [],
    isLoading: false,
    error: null,
    filters: {
        zone: 'all',
        status: 'all',
        condition: 'all',
        search: ''
    },
    stats: {
        total: 0,
        active: 0,
        maintenance: 0,
        inactive: 0,
        assigned: 0,
        withLED: 0,
        withSpeaker: 0
    }
};

// ============================================
// INVENTORY DATA LOADING
// ============================================

async function loadInventory() {
    InventoryState.isLoading = true;
    InventoryState.error = null;
    
    try {
        let inventory = [];
        
        if (FEATURES.googleSheets && navigator.onLine) {
            inventory = await sheetsAPI.getSheetData(SHEETS.inventory);
        } else {
            inventory = getDemoInventory();
        }
        
        InventoryState.rickshaws = inventory;
        updateInventoryStats();
        InventoryState.isLoading = false;
        
        console.log(`🚗 Loaded ${inventory.length} rickshaws`);
        return inventory;
        
    } catch (error) {
        InventoryState.isLoading = false;
        InventoryState.error = error.message;
        console.error('❌ Failed to load inventory:', error);
        return [];
    }
}

// ============================================
// INVENTORY CRUD
// ============================================

async function addRickshaw(rickshawData) {
    try {
        const rickshaw = {
            rickshaw_id: rickshawData.rickshaw_id || generateId('RICK'),
            driver_email: rickshawData.driver_email || '',
            zone: rickshawData.zone,
            status: rickshawData.status || 'active',
            has_led: rickshawData.has_led !== undefined ? rickshawData.has_led : true,
            has_speaker: rickshawData.has_speaker !== undefined ? rickshawData.has_speaker : false,
            last_maintenance: rickshawData.last_maintenance || getTodayDate(),
            condition: rickshawData.condition || 'good',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.inventory, rickshaw);
        }
        
        InventoryState.rickshaws.push(rickshaw);
        updateInventoryStats();
        
        console.log(`✅ Rickshaw added: ${rickshaw.rickshaw_id}`);
        return { success: true, rickshaw };
        
    } catch (error) {
        console.error('❌ Failed to add rickshaw:', error);
        return { success: false, error: error.message };
    }
}

async function updateRickshaw(rickshawId, updates) {
    try {
        const index = InventoryState.rickshaws.findIndex(r => r.rickshaw_id === rickshawId);
        if (index === -1) throw new Error('Rickshaw not found');
        
        const updated = {
            ...InventoryState.rickshaws[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        
        InventoryState.rickshaws[index] = updated;
        
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.inventory, 'rickshaw_id', rickshawId, updates);
        }
        
        updateInventoryStats();
        console.log(`✅ Rickshaw updated: ${rickshawId}`);
        return { success: true, rickshaw: updated };
        
    } catch (error) {
        console.error('❌ Failed to update rickshaw:', error);
        return { success: false, error: error.message };
    }
}

async function deleteRickshaw(rickshawId) {
    try {
        InventoryState.rickshaws = InventoryState.rickshaws.filter(r => r.rickshaw_id !== rickshawId);
        
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.deleteRow(SHEETS.inventory, 'rickshaw_id', rickshawId);
        }
        
        updateInventoryStats();
        console.log(`✅ Rickshaw deleted: ${rickshawId}`);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Failed to delete rickshaw:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// INVENTORY QUERIES
// ============================================

function getRickshawById(rickshawId) {
    return InventoryState.rickshaws.find(r => r.rickshaw_id === rickshawId) || null;
}

function getRickshawsByZone(zone) {
    return InventoryState.rickshaws.filter(r => r.zone === zone);
}

function getRickshawsByStatus(status) {
    return InventoryState.rickshaws.filter(r => r.status === status);
}

function getRickshawsByDriver(email) {
    return InventoryState.rickshaws.filter(r => r.driver_email === email);
}

function getActiveRickshaws() {
    return InventoryState.rickshaws.filter(r => r.status === 'active');
}

function getMaintenanceRickshaws() {
    return InventoryState.rickshaws.filter(r => r.status === 'maintenance');
}

function getAvailableRickshaws(zone = null) {
    let available = InventoryState.rickshaws.filter(r => r.status === 'active' && !r.driver_email);
    if (zone) {
        available = available.filter(r => r.zone === zone);
    }
    return available;
}

function getFilteredInventory() {
    let rickshaws = [...InventoryState.rickshaws];
    
    if (InventoryState.filters.zone !== 'all') {
        rickshaws = rickshaws.filter(r => r.zone === InventoryState.filters.zone);
    }
    if (InventoryState.filters.status !== 'all') {
        rickshaws = rickshaws.filter(r => r.status === InventoryState.filters.status);
    }
    if (InventoryState.filters.condition !== 'all') {
        rickshaws = rickshaws.filter(r => r.condition === InventoryState.filters.condition);
    }
    if (InventoryState.filters.search) {
        const search = InventoryState.filters.search.toLowerCase();
        rickshaws = rickshaws.filter(r => 
            r.rickshaw_id?.toLowerCase().includes(search) ||
            r.driver_email?.toLowerCase().includes(search) ||
            r.zone?.toLowerCase().includes(search)
        );
    }
    
    return rickshaws;
}

// ============================================
// ZONE AVAILABILITY
// ============================================

function getZoneAvailability() {
    const availability = {};
    
    MUMBRA_ZONES.forEach(zone => {
        const total = zone.availableRickshaws || 50;
        const active = getRickshawsByZone(zone.name).filter(r => r.status === 'active').length;
        const available = active; // Simplified
        
        availability[zone.name] = {
            total,
            active,
            available,
            utilization: total > 0 ? Math.round((active / total) * 100) : 0,
            status: available > 10 ? 'available' : available > 5 ? 'limited' : 'full'
        };
    });
    
    return availability;
}

function getZoneUtilization(zoneName) {
    const zone = MUMBRA_ZONES.find(z => z.name === zoneName);
    if (!zone) return 0;
    
    const active = getRickshawsByZone(zoneName).filter(r => r.status === 'active').length;
    const total = zone.availableRickshaws || 50;
    
    return total > 0 ? Math.round((active / total) * 100) : 0;
}

// ============================================
// MAINTENANCE TRACKING
// ============================================

function getUpcomingMaintenance(days = 30) {
    const today = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    return InventoryState.rickshaws.filter(r => {
        if (!r.last_maintenance) return true;
        const lastMaintenance = new Date(r.last_maintenance);
        const nextMaintenance = new Date(lastMaintenance);
        nextMaintenance.setDate(nextMaintenance.getDate() + 30); // Maintenance every 30 days
        return nextMaintenance <= future;
    });
}

function getOverdueMaintenance() {
    const today = new Date();
    
    return InventoryState.rickshaws.filter(r => {
        if (!r.last_maintenance) return true;
        const lastMaintenance = new Date(r.last_maintenance);
        const nextMaintenance = new Date(lastMaintenance);
        nextMaintenance.setDate(nextMaintenance.getDate() + 30);
        return nextMaintenance < today;
    });
}

async function scheduleMaintenance(rickshawId, date, notes = '') {
    return await updateRickshaw(rickshawId, {
        status: 'maintenance',
        last_maintenance: date,
        notes: notes
    });
}

async function completeMaintenance(rickshawId, condition = 'good') {
    return await updateRickshaw(rickshawId, {
        status: 'active',
        condition: condition,
        last_maintenance: getTodayDate()
    });
}

// ============================================
// DRIVER ASSIGNMENT
// ============================================

async function assignDriver(rickshawId, driverEmail, zone) {
    return await updateRickshaw(rickshawId, {
        driver_email: driverEmail,
        zone: zone,
        status: 'assigned'
    });
}

async function unassignDriver(rickshawId) {
    return await updateRickshaw(rickshawId, {
        driver_email: '',
        status: 'active'
    });
}

function getUnassignedRickshaws() {
    return InventoryState.rickshaws.filter(r => !r.driver_email && r.status === 'active');
}

function getAssignedRickshaws() {
    return InventoryState.rickshaws.filter(r => r.driver_email);
}

// ============================================
// STATISTICS
// ============================================

function updateInventoryStats() {
    const rickshaws = InventoryState.rickshaws;
    
    InventoryState.stats = {
        total: rickshaws.length,
        active: rickshaws.filter(r => r.status === 'active').length,
        maintenance: rickshaws.filter(r => r.status === 'maintenance').length,
        inactive: rickshaws.filter(r => r.status === 'inactive').length,
        assigned: rickshaws.filter(r => r.status === 'assigned').length,
        withLED: rickshaws.filter(r => r.has_led === 'true' || r.has_led === true).length,
        withSpeaker: rickshaws.filter(r => r.has_speaker === 'true' || r.has_speaker === true).length,
        unassigned: rickshaws.filter(r => !r.driver_email && r.status === 'active').length,
        needsMaintenance: getOverdueMaintenance().length
    };
    
    return InventoryState.stats;
}

function getInventoryStats() {
    return { ...InventoryState.stats };
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderInventoryTable(containerId, rickshaws = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const data = rickshaws || getFilteredInventory();
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🚗</div>
                <h3 class="empty-state-title">No rickshaws found</h3>
                <p class="empty-state-desc">Add rickshaws to your fleet</p>
            </div>`;
        return;
    }
    
    let html = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Rickshaw ID</th>
                        <th>Zone</th>
                        <th>Driver</th>
                        <th>Status</th>
                        <th>LED</th>
                        <th>Speaker</th>
                        <th>Condition</th>
                        <th>Last Maintenance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
    
    data.forEach(r => {
        const statusInfo = INVENTORY.RICKSHAW_STATUSES[r.status?.toUpperCase()] || 
                          INVENTORY.RICKSHAW_STATUSES.ACTIVE;
        const conditionInfo = INVENTORY.CONDITION[r.condition?.toUpperCase()] || 
                             INVENTORY.CONDITION.GOOD;
        
        html += `
            <tr>
                <td><code>${r.rickshaw_id}</code></td>
                <td>${r.zone || '-'}</td>
                <td>${r.driver_email || '<span class="text-gray">Unassigned</span>'}</td>
                <td>
                    <span class="badge" style="background:${statusInfo.color}20;color:${statusInfo.color}">
                        ${statusInfo.label}
                    </span>
                </td>
                <td>${r.has_led === 'true' || r.has_led === true ? '✅' : '❌'}</td>
                <td>${r.has_speaker === 'true' || r.has_speaker === true ? '✅' : '❌'}</td>
                <td>
                    <span style="color:${conditionInfo.color}">${conditionInfo.label}</span>
                </td>
                <td>${formatDate(r.last_maintenance, 'DD/MM/YYYY')}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-ghost" onclick="editRickshaw('${r.rickshaw_id}')">✏️</button>
                        ${r.status === 'active' && !r.driver_email ? 
                            `<button class="btn btn-sm btn-ghost" onclick="assignDriverPrompt('${r.rickshaw_id}')">👤</button>` : ''}
                        ${r.status !== 'maintenance' ? 
                            `<button class="btn btn-sm btn-ghost" onclick="scheduleMaintenance('${r.rickshaw_id}', '${getTodayDate()}')">🔧</button>` : ''}
                    </div>
                </td>
            </tr>`;
    });
    
    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function renderZoneAvailability(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const availability = getZoneAvailability();
    
    let html = '<div class="zone-availability-grid">';
    
    Object.entries(availability).forEach(([zone, data]) => {
        const statusColor = data.status === 'available' ? '#00A86B' : 
                           data.status === 'limited' ? '#FFB800' : '#E74C3C';
        
        html += `
            <div class="zone-availability-card">
                <h4>${zone}</h4>
                <div class="availability-bar">
                    <div class="availability-fill" style="width:${data.utilization}%;background:${statusColor}"></div>
                </div>
                <div class="availability-stats">
                    <span>${data.active}/${data.total} Active</span>
                    <span style="color:${statusColor}">${data.utilization}%</span>
                </div>
            </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// INITIALIZATION
// ============================================

async function initInventory() {
    await loadInventory();
    console.log('✅ Inventory Module Loaded');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.inventory-container, .zone-availability-grid')) {
        initInventory();
    }
});

console.log('✅ Inventory Module Ready');
