/*
 * Filename: sheets.js
 * Path: /js/core/sheets.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Google Sheets API CRUD Operations, Data Sync, Offline Fallback
 * Type: Core JavaScript
 */

// ============================================
// SHEETS API STATE
// ============================================

const SheetsState = {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    pendingOperations: [],
    cache: {},
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
};

// ============================================
// SHEETS API - READ OPERATIONS
// ============================================

async function sheetsAPI_getSheetData(sheetName, range = '') {
    try {
        // Check cache first
        const cacheKey = `${sheetName}_${range}`;
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.log(`📦 Using cached data for: ${sheetName}`);
            return cached;
        }

        // Build URL
        let url = API.sheets.getValues(sheetName, range);
        
        // Add access token if available
        const token = AuthState.googleToken;
        if (token) {
            url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${sheetName}${range ? '!' + range : ''}?access_token=${token}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Sheets API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const values = data.values || [];
        
        // Convert to array of objects
        const headers = values[0] || [];
        const rows = values.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        // Cache the result
        setCachedData(cacheKey, rows);

        console.log(`✅ Loaded ${rows.length} rows from: ${sheetName}`);
        return rows;

    } catch (error) {
        console.error(`❌ Failed to load sheet: ${sheetName}`, error);
        
        // Try offline fallback
        const offlineData = getOfflineData(sheetName);
        if (offlineData) {
            console.log(`📦 Using offline data for: ${sheetName}`);
            return offlineData;
        }
        
        throw error;
    }
}

async function sheetsAPI_getRow(sheetName, columnName, value) {
    const rows = await sheetsAPI_getSheetData(sheetName);
    return rows.find(row => row[columnName] === value) || null;
}

async function sheetsAPI_getRows(sheetName, filters = {}) {
    let rows = await sheetsAPI_getSheetData(sheetName);
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
        rows = rows.filter(row => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === null || value === undefined) return true;
                if (typeof value === 'object') {
                    // Handle range filters like { min: 1, max: 100 }
                    if (value.min !== undefined && row[key] < value.min) return false;
                    if (value.max !== undefined && row[key] > value.max) return false;
                    return true;
                }
                return row[key] == value;
            });
        });
    }
    
    return rows;
}

// ============================================
// SHEETS API - WRITE OPERATIONS
// ============================================

async function sheetsAPI_appendRow(sheetName, rowData) {
    try {
        if (!SheetsState.isOnline) {
            queueOfflineOperation('append', sheetName, rowData);
            return { success: true, offline: true };
        }

        // Get headers for the sheet
        const headers = await getSheetHeaders(sheetName);
        
        // Convert rowData object to array matching headers
        const values = headers.map(header => {
            // Convert header to snake_case key
            const key = header.toLowerCase().replace(/\s+/g, '_');
            return rowData[header] || rowData[key] || '';
        });

        const url = API.sheets.append(sheetName);
        const token = AuthState.googleToken;

        const requestBody = {
            values: [values]
        };

        let fetchUrl = url;
        if (token) {
            fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&access_token=${token}`;
        }

        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Append failed: ${response.status}`);
        }

        // Invalidate cache
        clearCache(sheetName);

        console.log(`✅ Row appended to: ${sheetName}`);
        return await response.json();

    } catch (error) {
        console.error(`❌ Append failed: ${sheetName}`, error);
        
        // Queue for later
        queueOfflineOperation('append', sheetName, rowData);
        return { success: false, offline: true, error: error.message };
    }
}

async function sheetsAPI_updateRow(sheetName, columnName, columnValue, updates) {
    try {
        if (!SheetsState.isOnline) {
            queueOfflineOperation('update', sheetName, { columnName, columnValue, updates });
            return { success: true, offline: true };
        }

        const rows = await sheetsAPI_getSheetData(sheetName);
        const rowIndex = rows.findIndex(row => row[columnName] === columnValue);

        if (rowIndex === -1) {
            throw new Error(`Row not found: ${columnName}=${columnValue}`);
        }

        const headers = Object.keys(rows[0]);
        const actualRowIndex = rowIndex + 2; // +1 for 0-index, +1 for header row

        const token = AuthState.googleToken;
        const range = `${sheetName}!A${actualRowIndex}`;

        let fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
        if (token) {
            fetchUrl += `&access_token=${token}`;
        }

        // Build updated row
        const updatedRow = { ...rows[rowIndex], ...updates };
        const values = headers.map(header => updatedRow[header] || '');

        const response = await fetch(fetchUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [values]
            })
        });

        if (!response.ok) {
            throw new Error(`Update failed: ${response.status}`);
        }

        clearCache(sheetName);
        console.log(`✅ Row updated in: ${sheetName}`);
        return await response.json();

    } catch (error) {
        console.error(`❌ Update failed: ${sheetName}`, error);
        queueOfflineOperation('update', sheetName, { columnName, columnValue, updates });
        return { success: false, offline: true, error: error.message };
    }
}

async function sheetsAPI_deleteRow(sheetName, columnName, columnValue) {
    try {
        if (!SheetsState.isOnline) {
            queueOfflineOperation('delete', sheetName, { columnName, columnValue });
            return { success: true, offline: true };
        }

        const rows = await sheetsAPI_getSheetData(sheetName);
        const rowIndex = rows.findIndex(row => row[columnName] === columnValue);

        if (rowIndex === -1) {
            throw new Error(`Row not found: ${columnName}=${columnValue}`);
        }

        const actualRowIndex = rowIndex + 2;
        const token = AuthState.googleToken;

        // Google Sheets API doesn't support direct row deletion via REST
        // We clear the row instead
        const headers = Object.keys(rows[0]);
        const emptyValues = headers.map(() => '');
        const range = `${sheetName}!A${actualRowIndex}`;

        let fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
        if (token) {
            fetchUrl += `&access_token=${token}`;
        }

        const response = await fetch(fetchUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [emptyValues]
            })
        });

        clearCache(sheetName);
        console.log(`✅ Row deleted from: ${sheetName}`);
        return await response.json();

    } catch (error) {
        console.error(`❌ Delete failed: ${sheetName}`, error);
        queueOfflineOperation('delete', sheetName, { columnName, columnValue });
        return { success: false, offline: true, error: error.message };
    }
}

// ============================================
// BATCH OPERATIONS
// ============================================

async function sheetsAPI_batchAppend(sheetName, rowsArray) {
    const results = [];
    for (const row of rowsArray) {
        const result = await sheetsAPI_appendRow(sheetName, row);
        results.push(result);
    }
    return results;
}

async function sheetsAPI_getAllSheets() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.spreadsheetId}?key=${GOOGLE_CONFIG.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.sheets?.map(s => s.properties.title) || Object.values(SHEETS);
    } catch {
        return Object.values(SHEETS);
    }
}

// ============================================
// CACHE MANAGEMENT
// ============================================

function getCachedData(key) {
    const cached = SheetsState.cache[key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > SheetsState.cacheTimeout) {
        delete SheetsState.cache[key];
        return null;
    }

    return cached.data;
}

function setCachedData(key, data) {
    SheetsState.cache[key] = {
        data: data,
        timestamp: Date.now()
    };
}

function clearCache(sheetName = null) {
    if (sheetName) {
        Object.keys(SheetsState.cache).forEach(key => {
            if (key.startsWith(sheetName)) {
                delete SheetsState.cache[key];
            }
        });
    } else {
        SheetsState.cache = {};
    }
}

function clearAllCache() {
    SheetsState.cache = {};
    console.log('🗑️ All cache cleared');
}

// ============================================
// OFFLINE SUPPORT
// ============================================

function getOfflineData(sheetName) {
    try {
        const offlineData = localStorage.getItem(STORAGE_KEYS.offlineData);
        if (!offlineData) return null;
        
        const parsed = JSON.parse(offlineData);
        return parsed[sheetName] || null;
    } catch {
        return null;
    }
}

function saveOfflineData(sheetName, data) {
    try {
        const offlineData = JSON.parse(localStorage.getItem(STORAGE_KEYS.offlineData) || '{}');
        offlineData[sheetName] = data;
        localStorage.setItem(STORAGE_KEYS.offlineData, JSON.stringify(offlineData));
    } catch (error) {
        console.warn('⚠️ Failed to save offline data');
    }
}

function queueOfflineOperation(type, sheetName, data) {
    SheetsState.pendingOperations.push({
        type: type,
        sheetName: sheetName,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('rasaai_pending_ops', JSON.stringify(SheetsState.pendingOperations));
    console.log(`📝 Queued offline operation: ${type} on ${sheetName}`);
}

async function processPendingOperations() {
    if (!SheetsState.isOnline || SheetsState.pendingOperations.length === 0) return;
    
    console.log(`🔄 Processing ${SheetsState.pendingOperations.length} pending operations...`);
    SheetsState.isSyncing = true;

    const operations = [...SheetsState.pendingOperations];
    SheetsState.pendingOperations = [];
    localStorage.setItem('rasaai_pending_ops', JSON.stringify([]));

    let successCount = 0;
    let failCount = 0;

    for (const op of operations) {
        try {
            switch (op.type) {
                case 'append':
                    await sheetsAPI_appendRow(op.sheetName, op.data);
                    break;
                case 'update':
                    await sheetsAPI_updateRow(op.sheetName, op.data.columnName, op.data.columnValue, op.data.updates);
                    break;
                case 'delete':
                    await sheetsAPI_deleteRow(op.sheetName, op.data.columnName, op.data.columnValue);
                    break;
            }
            successCount++;
        } catch (error) {
            failCount++;
            SheetsState.pendingOperations.push(op);
        }
    }

    if (SheetsState.pendingOperations.length > 0) {
        localStorage.setItem('rasaai_pending_ops', JSON.stringify(SheetsState.pendingOperations));
    }

    SheetsState.isSyncing = false;
    SheetsState.lastSyncTime = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.lastSync, SheetsState.lastSyncTime);

    console.log(`✅ Sync complete: ${successCount} success, ${failCount} failed`);
}

// ============================================
// HEADER MANAGEMENT
// ============================================

async function getSheetHeaders(sheetName) {
    try {
        const data = await sheetsAPI_getSheetData(sheetName);
        if (data.length > 0) {
            return Object.keys(data[0]);
        }
    } catch {}
    
    // Return default headers based on sheet name
    return getDefaultHeaders(sheetName);
}

function getDefaultHeaders(sheetName) {
    const headers = {
        'Users': ['user_id', 'email', 'password', 'name', 'role', 'phone', 'company', 'zone', 'rickshawId', 'referralCode', 'avatar', 'active', 'created_at', 'updated_at', 'last_login'],
        'Campaigns': ['campaign_id', 'client_email', 'client_name', 'zone', 'type', 'rickshaws', 'days', 'start_date', 'end_date', 'status', 'base_price', 'zone_adjustment', 'discount', 'subtotal', 'gst', 'total_cost', 'creative_url', 'audio_url', 'created_at', 'updated_at'],
        'Invoices': ['invoice_id', 'invoice_number', 'campaign_id', 'client_email', 'client_name', 'type', 'amount', 'gst', 'total', 'status', 'due_date', 'paid_date', 'created_at'],
        'Payments': ['payment_id', 'invoice_id', 'client_email', 'amount', 'method', 'upi_id', 'transaction_id', 'status', 'verified_by', 'verified_at', 'created_at'],
        'AudioAds': ['ad_id', 'ad_name', 'campaign_id', 'advertiser_name', 'audio_drive_url', 'duration_seconds', 'play_interval_seconds', 'assigned_zones', 'assigned_drivers', 'start_time', 'end_time', 'active_days', 'max_plays_per_day', 'priority', 'status', 'created_by', 'created_at'],
        'AudioLogs': ['log_id', 'driver_email', 'driver_zone', 'ad_id', 'ad_name', 'campaign_id', 'advertiser_name', 'duration_seconds', 'played_at', 'play_number_today', 'synced', 'device_info'],
        'ScanLogs': ['scan_id', 'passenger_email', 'campaign_id', 'zone', 'scanned_at', 'coins_earned', 'device_info'],
        'Leads': ['lead_id', 'name', 'company', 'phone', 'email', 'source', 'status', 'assigned_to', 'notes', 'created_at', 'updated_at'],
        'Tasks': ['task_id', 'assigned_to', 'title', 'description', 'due_date', 'status', 'priority', 'related_to', 'created_at'],
        'Referrals': ['referral_id', 'affiliate_email', 'referral_code', 'link', 'clicks', 'leads', 'conversions', 'created_at'],
        'Commissions': ['commission_id', 'affiliate_email', 'campaign_id', 'amount', 'status', 'earned_at', 'paid_at'],
        'Withdrawals': ['withdrawal_id', 'affiliate_email', 'amount', 'method', 'upi_id', 'bank_details', 'status', 'requested_at', 'processed_at'],
        'Attendance': ['attendance_id', 'driver_email', 'date', 'check_in', 'check_out', 'status', 'earnings', 'plays_count'],
        'Inventory': ['rickshaw_id', 'driver_email', 'zone', 'status', 'has_led', 'has_speaker', 'last_maintenance', 'condition'],
        'Settings': ['setting_key', 'setting_value', 'updated_by', 'updated_at'],
        'AuditLogs': ['log_id', 'timestamp', 'action', 'user_email', 'details', 'ip', 'user_agent']
    };
    
    return headers[sheetName] || ['id', 'data', 'created_at'];
}

// ============================================
// SYNC MANAGEMENT
// ============================================

async function syncAllData() {
    if (!SheetsState.isOnline) {
        console.log('📴 Cannot sync - offline');
        return { success: false, reason: 'offline' };
    }

    console.log('🔄 Starting full data sync...');
    SheetsState.isSyncing = true;

    try {
        // Process pending operations first
        await processPendingOperations();

        // Refresh cache for all sheets
        clearAllCache();
        
        const sheets = Object.values(SHEETS);
        for (const sheetName of sheets) {
            try {
                await sheetsAPI_getSheetData(sheetName);
            } catch (error) {
                console.warn(`⚠️ Could not sync: ${sheetName}`);
            }
        }

        SheetsState.lastSyncTime = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.lastSync, SheetsState.lastSyncTime);
        
        console.log('✅ Full sync complete');
        return { success: true, time: SheetsState.lastSyncTime };

    } catch (error) {
        console.error('❌ Sync failed:', error);
        return { success: false, error: error.message };
    } finally {
        SheetsState.isSyncing = false;
    }
}

function getLastSyncTime() {
    return localStorage.getItem(STORAGE_KEYS.lastSync) || null;
}

// ============================================
// ONLINE/OFFLINE DETECTION
// ============================================

function setupOnlineDetection() {
    window.addEventListener('online', () => {
        SheetsState.isOnline = true;
        console.log('🌐 Back online');
        processPendingOperations();
    });

    window.addEventListener('offline', () => {
        SheetsState.isOnline = false;
        console.log('📴 Went offline');
    });

    // Initial check
    SheetsState.isOnline = navigator.onLine;
}

// ============================================
// EXPORT/IMPORT FUNCTIONS
// ============================================

async function exportAllData() {
    try {
        const allData = {};
        const sheets = Object.values(SHEETS);
        
        for (const sheetName of sheets) {
            allData[sheetName] = await sheetsAPI_getSheetData(sheetName);
        }

        const exportBlob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(exportBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rasaai-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('✅ Data exported successfully');
    } catch (error) {
        console.error('❌ Export failed:', error);
    }
}

async function importData(jsonData) {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        for (const [sheetName, rows] of Object.entries(data)) {
            if (Array.isArray(rows) && rows.length > 0) {
                await sheetsAPI_batchAppend(sheetName, rows);
            }
        }

        clearAllCache();
        console.log('✅ Data imported successfully');
    } catch (error) {
        console.error('❌ Import failed:', error);
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initSheetsAPI() {
    setupOnlineDetection();
    
    // Load pending operations
    const pending = localStorage.getItem('rasaai_pending_ops');
    if (pending) {
        try {
            SheetsState.pendingOperations = JSON.parse(pending);
            console.log(`📝 Loaded ${SheetsState.pendingOperations.length} pending operations`);
        } catch {
            SheetsState.pendingOperations = [];
        }
    }

    // If online, try to sync
    if (SheetsState.isOnline && SheetsState.pendingOperations.length > 0) {
        processPendingOperations();
    }

    console.log('✅ Sheets API Module Loaded');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initSheetsAPI);

// ============================================
// GLOBAL SHEETS API OBJECT
// ============================================

// Expose as global for easy access
window.sheetsAPI = {
    getSheetData: sheetsAPI_getSheetData,
    getRow: sheetsAPI_getRow,
    getRows: sheetsAPI_getRows,
    appendRow: sheetsAPI_appendRow,
    updateRow: sheetsAPI_updateRow,
    deleteRow: sheetsAPI_deleteRow,
    batchAppend: sheetsAPI_batchAppend,
    getAllSheets: sheetsAPI_getAllSheets,
    clearCache: clearAllCache,
    syncAll: syncAllData,
    getLastSyncTime: getLastSyncTime,
    exportAll: exportAllData,
    importData: importData,
    isOnline: () => SheetsState.isOnline,
    isSyncing: () => SheetsState.isSyncing,
    processPending: processPendingOperations
};

console.log('✅ Sheets API Global Object Ready');
