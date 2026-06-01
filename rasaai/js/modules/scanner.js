/*
 * Filename: scanner.js
 * Path: /js/modules/scanner.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: QR code scanning logic, scan verification, rewards crediting
 * Type: Module JavaScript
 */

// ============================================
// SCANNER STATE
// ============================================

const ScannerState = {
    isScanning: false,
    lastScan: null,
    scanHistory: [],
    todayScans: 0,
    totalCoins: 0,
    currentStreak: 0,
    zonesVisited: [],
    stream: null,
    scannerReady: false
};

// ============================================
// QR SCANNER SETUP
// ============================================

async function initScanner() {
    console.log('📷 Initializing QR Scanner...');
    
    // Load scan history
    await loadScanHistory();
    
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('⚠️ Camera not available on this device');
        ScannerState.scannerReady = false;
        return false;
    }
    
    ScannerState.scannerReady = true;
    console.log('✅ Scanner Ready');
    return true;
}

async function loadScanHistory() {
    try {
        let scans = [];
        
        if (FEATURES.googleSheets && navigator.onLine) {
            scans = await sheetsAPI.getSheetData(SHEETS.scanLogs);
            const userEmail = getCurrentUserEmail();
            scans = scans.filter(s => s.passenger_email === userEmail);
        } else {
            scans = getDemoPassengerData()?.scans || [];
        }
        
        ScannerState.scanHistory = scans;
        ScannerState.todayScans = scans.filter(s => 
            s.scanned_at?.startsWith(getTodayDate())
        ).length;
        ScannerState.totalCoins = scans.reduce((sum, s) => sum + (parseInt(s.coins_earned) || 0), 0);
        
        // Calculate streak
        calculateStreak(scans);
        
        // Track zones visited
        ScannerState.zonesVisited = [...new Set(scans.map(s => s.zone))];
        
        console.log(`📷 Loaded ${scans.length} scans - ${ScannerState.totalCoins} coins`);
        
    } catch (error) {
        console.warn('⚠️ Failed to load scan history');
    }
}

// ============================================
// CAMERA SCANNER
// ============================================

async function startCameraScanner(videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (!videoElement) {
        console.error('❌ Video element not found');
        return false;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false
        });
        
        videoElement.srcObject = stream;
        ScannerState.stream = stream;
        ScannerState.isScanning = true;
        
        console.log('📷 Camera started');
        return true;
        
    } catch (error) {
        console.error('❌ Camera access failed:', error);
        showToast('Camera access denied. Please allow camera permission.', 'error');
        return false;
    }
}

function stopCameraScanner() {
    if (ScannerState.stream) {
        ScannerState.stream.getTracks().forEach(track => track.stop());
        ScannerState.stream = null;
    }
    ScannerState.isScanning = false;
    console.log('📷 Camera stopped');
}

// ============================================
// QR CODE SIMULATION (For demo without actual QR library)
// ============================================

function simulateQRScan(campaignData = null) {
    // In production, this would use a QR scanning library
    // For demo, simulate a scan with sample data
    
    const campaigns = DEMO_CAMPAIGNS || [];
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    
    const campaign = campaignData || (activeCampaigns.length > 0 
        ? activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)] 
        : {
            campaign_id: 'CAM001',
            client_name: 'Mumbra Pizza House',
            zone: 'Mumbra Station',
            type: 'combo'
        });
    
    return {
        campaign_id: campaign.campaign_id,
        advertiser_name: campaign.client_name || campaign.company || 'Local Business',
        zone: campaign.zone,
        type: campaign.type,
        timestamp: new Date().toISOString()
    };
}

async function processScan(scanData) {
    try {
        const userEmail = getCurrentUserEmail();
        
        // Check if already scanned today (for bonus logic)
        const isFirstScanToday = ScannerState.todayScans === 0;
        
        // Calculate coins
        let coinsEarned = REWARDS_CONFIG.coinsPerScan;
        
        // First scan of the day bonus
        if (isFirstScanToday) {
            coinsEarned += REWARDS_CONFIG.dailyFirstScanBonus;
        }
        
        // Streak bonus (every 3 days)
        if ((ScannerState.currentStreak + 1) % 3 === 0 && ScannerState.currentStreak > 0) {
            coinsEarned += REWARDS_CONFIG.streakBonus;
        }
        
        // Zone explorer bonus
        if (!ScannerState.zonesVisited.includes(scanData.zone)) {
            ScannerState.zonesVisited.push(scanData.zone);
            if (ScannerState.zonesVisited.length >= REWARDS_CONFIG.zoneExplorerMinZones) {
                coinsEarned += REWARDS_CONFIG.zoneExplorerBonus;
            }
        }
        
        // Create scan log
        const scanLog = {
            scan_id: generateId('SCN'),
            passenger_email: userEmail,
            campaign_id: scanData.campaign_id,
            advertiser_name: scanData.advertiser_name || '',
            zone: scanData.zone,
            scanned_at: scanData.timestamp || new Date().toISOString(),
            coins_earned: coinsEarned,
            device_info: navigator.userAgent?.substring(0, 100)
        };
        
        // Save to Google Sheets
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.scanLogs, scanLog);
        }
        
        // Update local state
        ScannerState.scanHistory.push(scanLog);
        ScannerState.todayScans++;
        ScannerState.totalCoins += coinsEarned;
        ScannerState.lastScan = scanLog;
        
        console.log(`✅ Scan processed: +${coinsEarned} coins (Total: ${ScannerState.totalCoins})`);
        
        return {
            success: true,
            scan: scanLog,
            coinsEarned: coinsEarned,
            totalCoins: ScannerState.totalCoins,
            bonuses: {
                firstScan: isFirstScanToday,
                streak: (ScannerState.currentStreak + 1) % 3 === 0,
                zoneExplorer: ScannerState.zonesVisited.length >= REWARDS_CONFIG.zoneExplorerMinZones
            }
        };
        
    } catch (error) {
        console.error('❌ Scan processing failed:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// STREAK CALCULATION
// ============================================

function calculateStreak(scans) {
    if (!scans || scans.length === 0) {
        ScannerState.currentStreak = 0;
        return 0;
    }
    
    // Get unique scan dates sorted descending
    const scanDates = [...new Set(scans.map(s => s.scanned_at?.substring(0, 10)))].sort().reverse();
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < scanDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().substring(0, 10);
        
        if (scanDates[i] === expectedDateStr) {
            streak++;
        } else if (i === 0 && scanDates[i] === new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10)) {
            // Yesterday counts if today hasn't been scanned yet
            streak++;
        } else {
            break;
        }
    }
    
    ScannerState.currentStreak = streak;
    return streak;
}

// ============================================
// SCAN RESULT DISPLAY
// ============================================

function renderScanResult(result) {
    const container = document.getElementById('scan-result');
    if (!container) return;
    
    if (!result.success) {
        container.innerHTML = `
            <div class="scan-result error">
                <div class="scan-result-icon">❌</div>
                <h3>Scan Failed</h3>
                <p>${result.error || 'Please try again'}</p>
                <button class="btn btn-primary" onclick="resetScanner()">Try Again</button>
            </div>`;
        return;
    }
    
    container.innerHTML = `
        <div class="scan-result success">
            <div class="scan-result-icon">✅</div>
            <h3>Scan Successful!</h3>
            <div class="scan-coins-earned">
                <span class="coins-amount">+${result.coinsEarned}</span>
                <span class="coins-label">Coins Earned</span>
            </div>
            <div class="scan-details">
                <p><strong>Advertiser:</strong> ${result.scan.advertiser_name || 'Unknown'}</p>
                <p><strong>Zone:</strong> ${result.scan.zone || 'Unknown'}</p>
                <p><strong>Total Coins:</strong> ${result.totalCoins}</p>
            </div>
            ${result.bonuses.firstScan ? '<div class="scan-bonus">🎁 First Scan Bonus!</div>' : ''}
            ${result.bonuses.streak ? '<div class="scan-bonus">🔥 Streak Bonus!</div>' : ''}
            ${result.bonuses.zoneExplorer ? '<div class="scan-bonus">🗺️ Zone Explorer Bonus!</div>' : ''}
            <button class="btn btn-primary" onclick="resetScanner()">Scan Another</button>
        </div>`;
}

function resetScanner() {
    ScannerState.lastScan = null;
    const container = document.getElementById('scan-result');
    if (container) container.innerHTML = '';
    const videoContainer = document.getElementById('scanner-video-container');
    if (videoContainer) videoContainer.classList.remove('hidden');
}

// ============================================
// SCANNER UI
// ============================================

function renderScanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="scanner-container">
            <div class="scanner-header">
                <h3>📷 Scan QR Code</h3>
                <p>Scan a QR code on any RASAAI rickshaw to earn coins!</p>
            </div>
            
            <div id="scanner-video-container" class="scanner-video-container">
                <video id="scanner-video" autoplay playsinline></video>
                <div class="scanner-overlay">
                    <div class="scanner-frame"></div>
                </div>
            </div>
            
            <div id="scan-result"></div>
            
            <div class="scanner-actions">
                <button class="btn btn-primary btn-lg" id="btn-start-scan" onclick="handleScanButton()">
                    📷 Start Scanning
                </button>
                <button class="btn btn-outline" id="btn-simulate-scan" onclick="handleSimulateScan()">
                    🎯 Simulate Scan (Demo)
                </button>
            </div>
            
            <div class="scanner-stats">
                <div class="scan-stat">
                    <span class="scan-stat-value">${ScannerState.todayScans}</span>
                    <span class="scan-stat-label">Today's Scans</span>
                </div>
                <div class="scan-stat">
                    <span class="scan-stat-value">${ScannerState.totalCoins}</span>
                    <span class="scan-stat-label">Total Coins</span>
                </div>
                <div class="scan-stat">
                    <span class="scan-stat-value">🔥 ${ScannerState.currentStreak} days</span>
                    <span class="scan-stat-label">Streak</span>
                </div>
            </div>
        </div>`;
}

async function handleScanButton() {
    const videoContainer = document.getElementById('scanner-video-container');
    const resultContainer = document.getElementById('scan-result');
    
    if (ScannerState.isScanning) {
        stopCameraScanner();
        document.getElementById('btn-start-scan').textContent = '📷 Start Scanning';
        return;
    }
    
    if (resultContainer) resultContainer.innerHTML = '';
    if (videoContainer) videoContainer.classList.remove('hidden');
    
    const started = await startCameraScanner('scanner-video');
    
    if (started) {
        document.getElementById('btn-start-scan').textContent = '⏹️ Stop Scanning';
        
        // For demo: auto-simulate scan after 3 seconds
        setTimeout(async () => {
            const scanData = simulateQRScan();
            const result = await processScan(scanData);
            stopCameraScanner();
            if (videoContainer) videoContainer.classList.add('hidden');
            document.getElementById('btn-start-scan').textContent = '📷 Start Scanning';
            renderScanResult(result);
        }, 3000);
    }
}

async function handleSimulateScan() {
    const videoContainer = document.getElementById('scanner-video-container');
    if (videoContainer) videoContainer.classList.add('hidden');
    
    stopCameraScanner();
    document.getElementById('btn-start-scan').textContent = '📷 Start Scanning';
    
    const scanData = simulateQRScan();
    const result = await processScan(scanData);
    renderScanResult(result);
}

// ============================================
// INITIALIZATION
// ============================================

async function initScannerModule() {
    if (document.querySelector('.scanner-container')) {
        await initScanner();
        renderScanner('scanner-container');
    }
    console.log('✅ Scanner Module Loaded');
}

document.addEventListener('DOMContentLoaded', initScannerModule);

console.log('✅ Scanner Module Ready');
