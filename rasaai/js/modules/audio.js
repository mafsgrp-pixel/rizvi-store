/*
 * Filename: audio.js
 * Path: /js/modules/audio.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Audio ad engine - 15/30/45/60 sec ads, admin-controlled duration & interval, Bluetooth speaker
 * Type: Module JavaScript
 */

// ============================================
// AUDIO ENGINE STATE
// ============================================

const AudioEngine = {
    isPlaying: false,
    isPaused: false,
    playlist: [],
    currentIndex: 0,
    currentAd: null,
    currentAudio: null,
    playIntervalId: null,
    adTimeoutId: null,
    countdownIntervalId: null,
    secondsUntilNext: 0,
    totalPlaysToday: 0,
    earningsToday: 0,
    driverEmail: null,
    driverZone: null,
    volume: 0.8,
    error: null
};

// ============================================
// AUDIO ENGINE INITIALIZATION
// ============================================

async function initAudioEngine(driverEmail, driverZone) {
    console.log('🔊 Initializing Audio Engine...');
    
    AudioEngine.driverEmail = driverEmail || getCurrentUserEmail();
    AudioEngine.driverZone = driverZone || getCurrentUser()?.zone || 'Kausa';
    
    // Load playlist from Google Sheets or demo data
    await loadAudioPlaylist();
    
    console.log(`✅ Audio Engine Ready - ${AudioEngine.playlist.length} ads loaded`);
    console.log(`📍 Zone: ${AudioEngine.driverZone}`);
    
    return {
        success: true,
        playlistSize: AudioEngine.playlist.length,
        zone: AudioEngine.driverZone
    };
}

// ============================================
// PLAYLIST LOADING
// ============================================

async function loadAudioPlaylist() {
    try {
        let ads = [];
        
        if (FEATURES.googleSheets && navigator.onLine) {
            ads = await sheetsAPI.getSheetData(SHEETS.audioAds);
        } else {
            ads = getDemoAudioAds();
        }
        
        // Filter active ads for this driver's zone
        const now = new Date();
        const currentTime = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        const currentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
        
        AudioEngine.playlist = ads.filter(ad => {
            // Check status
            if (ad.status !== 'active') return false;
            
            // Check zone assignment
            const assignedZones = (ad.assigned_zones || '').split(',').map(z => z.trim());
            if (!assignedZones.includes(AudioEngine.driverZone) && 
                !assignedZones.includes('all') && 
                !assignedZones.includes('All')) {
                return false;
            }
            
            // Check driver assignment
            const assignedDrivers = (ad.assigned_drivers || '').split(',').map(d => d.trim());
            if (assignedDrivers.includes('all') || assignedDrivers.includes('All')) {
                // OK
            } else if (!assignedDrivers.includes(AudioEngine.driverEmail)) {
                return false;
            }
            
            // Check time range
            if (ad.start_time && ad.end_time) {
                if (currentTime < ad.start_time || currentTime > ad.end_time) {
                    return false;
                }
            }
            
            // Check active days
            if (ad.active_days) {
                const activeDays = ad.active_days.split(',').map(d => d.trim());
                if (!activeDays.includes(currentDay)) {
                    return false;
                }
            }
            
            // Check max plays
            if (ad.max_plays_per_day && AudioEngine.totalPlaysToday >= parseInt(ad.max_plays_per_day)) {
                return false;
            }
            
            return true;
        });
        
        // Sort by priority (high first), then randomize within same priority
        AudioEngine.playlist.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const pa = priorityOrder[a.priority] || 1;
            const pb = priorityOrder[b.priority] || 1;
            if (pa !== pb) return pb - pa;
            return Math.random() - 0.5;
        });
        
        console.log(`📋 Playlist loaded: ${AudioEngine.playlist.length} ads`);
        
    } catch (error) {
        console.error('❌ Failed to load audio playlist:', error);
        AudioEngine.playlist = [];
    }
}

// ============================================
// PLAYBACK CONTROL
// ============================================

function startAudioPlayback() {
    if (AudioEngine.isPlaying) {
        console.warn('⚠️ Audio already playing');
        return;
    }
    
    if (AudioEngine.playlist.length === 0) {
        showToast('No audio ads available for your zone', 'warning');
        return;
    }
    
    AudioEngine.isPlaying = true;
    AudioEngine.isPaused = false;
    AudioEngine.currentIndex = 0;
    AudioEngine.totalPlaysToday = 0;
    AudioEngine.earningsToday = 0;
    
    console.log('▶️ Audio playback started');
    playNextAd();
    
    // Update UI
    updateAudioUI();
}

function pauseAudioPlayback() {
    if (!AudioEngine.isPlaying) return;
    
    AudioEngine.isPaused = true;
    
    if (AudioEngine.currentAudio) {
        AudioEngine.currentAudio.pause();
    }
    
    clearTimeout(AudioEngine.adTimeoutId);
    clearInterval(AudioEngine.countdownIntervalId);
    
    console.log('⏸️ Audio playback paused');
    updateAudioUI();
}

function resumeAudioPlayback() {
    if (!AudioEngine.isPaused) return;
    
    AudioEngine.isPaused = false;
    
    if (AudioEngine.currentAudio) {
        AudioEngine.currentAudio.play();
    }
    
    console.log('▶️ Audio playback resumed');
    updateAudioUI();
}

function stopAudioPlayback() {
    AudioEngine.isPlaying = false;
    AudioEngine.isPaused = false;
    
    if (AudioEngine.currentAudio) {
        AudioEngine.currentAudio.pause();
        AudioEngine.currentAudio = null;
    }
    
    clearTimeout(AudioEngine.adTimeoutId);
    clearInterval(AudioEngine.countdownIntervalId);
    clearInterval(AudioEngine.playIntervalId);
    
    // Sync any pending logs
    syncOfflineAudioLogs();
    
    console.log(`⏹️ Audio stopped - Total plays: ${AudioEngine.totalPlaysToday}, Earnings: ₹${AudioEngine.earningsToday}`);
    updateAudioUI();
}

// ============================================
// AD PLAYBACK
// ============================================

function playNextAd() {
    if (!AudioEngine.isPlaying || AudioEngine.isPaused) return;
    
    // Check daily play limit
    if (AudioEngine.totalPlaysToday >= DRIVER_CONFIG.maxPlaysPerDay) {
        console.log('📊 Daily play limit reached');
        stopAudioPlayback();
        showToast('Daily play limit reached', 'info');
        return;
    }
    
    // Get current ad
    if (AudioEngine.playlist.length === 0) {
        console.warn('⚠️ No ads in playlist');
        stopAudioPlayback();
        return;
    }
    
    const ad = AudioEngine.playlist[AudioEngine.currentIndex];
    AudioEngine.currentAd = ad;
    
    const duration = parseInt(ad.duration_seconds) || 30;
    const interval = parseInt(ad.play_interval_seconds) || 15;
    
    console.log(`🔊 Playing: "${ad.ad_name}" (${duration}s) → Next in ${interval}s`);
    
    // Update display
    updateNowPlaying(ad, duration);
    
    // Create and play audio
    try {
        const audio = new Audio(ad.audio_drive_url || ad.audio_url || '');
        audio.volume = AudioEngine.volume;
        AudioEngine.currentAudio = audio;
        
        audio.play().then(() => {
            console.log(`✅ Playing: ${ad.ad_name}`);
            
            // Stop after duration
            AudioEngine.adTimeoutId = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                
                // Log the play
                logAudioPlay(ad);
                
                // Update earnings
                AudioEngine.earningsToday += DRIVER_CONFIG.perAdPlay;
                AudioEngine.totalPlaysToday++;
                
                // Move to next ad
                AudioEngine.currentIndex = (AudioEngine.currentIndex + 1) % AudioEngine.playlist.length;
                
                // Schedule next ad after interval
                scheduleNextAd(interval);
                
            }, duration * 1000);
            
        }).catch(error => {
            console.warn(`⚠️ Audio play failed: ${error.message}`);
            // Use dummy audio for demo
            logAudioPlay(ad);
            AudioEngine.earningsToday += DRIVER_CONFIG.perAdPlay;
            AudioEngine.totalPlaysToday++;
            AudioEngine.currentIndex = (AudioEngine.currentIndex + 1) % AudioEngine.playlist.length;
            scheduleNextAd(interval);
        });
        
    } catch (error) {
        console.warn('⚠️ Audio element creation failed, using simulated playback');
        logAudioPlay(ad);
        AudioEngine.earningsToday += DRIVER_CONFIG.perAdPlay;
        AudioEngine.totalPlaysToday++;
        AudioEngine.currentIndex = (AudioEngine.currentIndex + 1) % AudioEngine.playlist.length;
        scheduleNextAd(interval);
    }
}

function scheduleNextAd(intervalSeconds) {
    AudioEngine.secondsUntilNext = intervalSeconds;
    
    // Start countdown
    updateCountdown();
    AudioEngine.countdownIntervalId = setInterval(() => {
        AudioEngine.secondsUntilNext--;
        updateCountdown();
        
        if (AudioEngine.secondsUntilNext <= 0) {
            clearInterval(AudioEngine.countdownIntervalId);
        }
    }, 1000);
    
    // Schedule next ad
    AudioEngine.playIntervalId = setTimeout(() => {
        clearInterval(AudioEngine.countdownIntervalId);
        playNextAd();
    }, intervalSeconds * 1000);
}

// ============================================
// LOGGING
// ============================================

async function logAudioPlay(ad) {
    const logEntry = {
        log_id: generateId('AUDLOG'),
        driver_email: AudioEngine.driverEmail,
        driver_zone: AudioEngine.driverZone,
        ad_id: ad.ad_id || '',
        ad_name: ad.ad_name || '',
        campaign_id: ad.campaign_id || '',
        advertiser_name: ad.advertiser_name || '',
        duration_seconds: ad.duration_seconds || 30,
        played_at: new Date().toISOString(),
        play_number_today: AudioEngine.totalPlaysToday + 1,
        synced: navigator.onLine ? 'yes' : 'no',
        device_info: navigator.userAgent?.substring(0, 200)
    };
    
    if (FEATURES.googleSheets && navigator.onLine) {
        try {
            await sheetsAPI.appendRow(SHEETS.audioLogs, logEntry);
            console.log(`📝 Play logged: #${AudioEngine.totalPlaysToday + 1}`);
        } catch (error) {
            storeOfflineAudioLog(logEntry);
        }
    } else {
        storeOfflineAudioLog(logEntry);
    }
}

function storeOfflineAudioLog(logEntry) {
    const offlineLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_AUDIO_LOGS) || '[]');
    offlineLogs.push(logEntry);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_AUDIO_LOGS, JSON.stringify(offlineLogs));
    console.log('📦 Log stored offline');
}

async function syncOfflineAudioLogs() {
    const offlineLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_AUDIO_LOGS) || '[]');
    if (offlineLogs.length === 0) return;
    
    console.log(`🔄 Syncing ${offlineLogs.length} offline audio logs...`);
    
    let synced = 0;
    for (const log of offlineLogs) {
        try {
            if (FEATURES.googleSheets && navigator.onLine) {
                await sheetsAPI.appendRow(SHEETS.audioLogs, log);
                synced++;
            }
        } catch {
            break;
        }
    }
    
    if (synced > 0) {
        localStorage.setItem(STORAGE_KEYS.OFFLINE_AUDIO_LOGS, JSON.stringify(offlineLogs.slice(synced)));
        console.log(`✅ Synced ${synced} logs`);
    }
}

// ============================================
// AUDIO AD MANAGEMENT (Admin)
// ============================================

async function uploadAudioAd(adData) {
    try {
        const validation = validateAudioAdForm(adData);
        if (!validation.isValid) {
            throw new ValidationError('Audio ad validation failed', validation.errors);
        }
        
        const ad = {
            ad_id: generateId('AUD'),
            ad_name: adData.ad_name,
            campaign_id: adData.campaign_id || '',
            advertiser_name: adData.advertiser_name || '',
            audio_drive_url: adData.audio_url || '',
            duration_seconds: parseInt(adData.duration_seconds) || 30,
            play_interval_seconds: parseInt(adData.play_interval_seconds) || 15,
            assigned_zones: Array.isArray(adData.assigned_zones) ? 
                adData.assigned_zones.join(',') : adData.assigned_zones,
            assigned_drivers: Array.isArray(adData.assigned_drivers) ? 
                adData.assigned_drivers.join(',') : (adData.assigned_drivers || 'all'),
            start_time: adData.start_time || '07:00',
            end_time: adData.end_time || '22:00',
            active_days: Array.isArray(adData.active_days) ? 
                adData.active_days.join(',') : (adData.active_days || 'Mon,Tue,Wed,Thu,Fri,Sat,Sun'),
            max_plays_per_day: parseInt(adData.max_plays_per_day) || 200,
            priority: adData.priority || 'medium',
            status: 'active',
            created_by: getCurrentUserEmail(),
            created_at: new Date().toISOString()
        };
        
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.audioAds, ad);
        }
        
        console.log(`✅ Audio ad created: ${ad.ad_id}`);
        return { success: true, ad };
        
    } catch (error) {
        console.error('❌ Audio ad upload failed:', error);
        return { success: false, error: error.message };
    }
}

async function updateAudioAd(adId, updates) {
    try {
        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.updateRow(SHEETS.audioAds, 'ad_id', adId, updates);
        }
        console.log(`✅ Audio ad updated: ${adId}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Audio ad update failed:', error);
        return { success: false, error: error.message };
    }
}

async function toggleAudioAdStatus(adId, newStatus) {
    return await updateAudioAd(adId, { status: newStatus });
}

// ============================================
// UI UPDATES
// ============================================

function updateAudioUI() {
    const statusEl = document.getElementById('audio-status');
    const playBtn = document.getElementById('duty-toggle');
    const nowPlayingEl = document.getElementById('now-playing');
    const countdownEl = document.getElementById('next-ad-countdown');
    
    if (playBtn) {
        if (AudioEngine.isPlaying && !AudioEngine.isPaused) {
            playBtn.innerHTML = '⏸️ Pause Duty';
            playBtn.classList.add('active');
        } else if (AudioEngine.isPaused) {
            playBtn.innerHTML = '▶️ Resume Duty';
            playBtn.classList.add('active');
        } else {
            playBtn.innerHTML = '▶️ Start Duty';
            playBtn.classList.remove('active');
        }
    }
    
    if (statusEl) {
        statusEl.textContent = AudioEngine.isPlaying ? 
            (AudioEngine.isPaused ? '⏸️ Paused' : '▶️ Playing') : '⏹️ Stopped';
    }
    
    // Update stats
    const playsEl = document.getElementById('plays-today');
    const earningsEl = document.getElementById('earnings-today');
    const playlistEl = document.getElementById('playlist-size');
    
    if (playsEl) playsEl.textContent = AudioEngine.totalPlaysToday;
    if (earningsEl) earningsEl.textContent = '₹' + AudioEngine.earningsToday;
    if (playlistEl) playlistEl.textContent = AudioEngine.playlist.length + ' ads';
}

function updateNowPlaying(ad, duration) {
    const container = document.getElementById('now-playing');
    if (!container) return;
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="playing-card">
            <div class="playing-badge">🔊 NOW PLAYING</div>
            <div class="playing-name">${ad.ad_name || 'Audio Ad'}</div>
            <div class="playing-advertiser">${ad.advertiser_name || ''}</div>
            <div class="playing-duration">⏱️ ${duration}s</div>
            <div class="playing-progress">
                <div class="progress-bar" style="animation: progress ${duration}s linear;"></div>
            </div>
        </div>`;
}

function updateCountdown() {
    const el = document.getElementById('next-ad-countdown');
    if (!el) return;
    
    if (AudioEngine.isPlaying && !AudioEngine.isPaused && AudioEngine.secondsUntilNext > 0) {
        el.classList.remove('hidden');
        el.textContent = `Next ad in ${AudioEngine.secondsUntilNext}s`;
    } else {
        el.classList.add('hidden');
    }
}

// ============================================
// TOGGLE DUTY (Called from HTML)
// ============================================

async function toggleDuty() {
    if (AudioEngine.isPlaying && !AudioEngine.isPaused) {
        pauseAudioPlayback();
    } else if (AudioEngine.isPaused) {
        resumeAudioPlayback();
    } else {
        // Start duty
        if (!AudioEngine.driverEmail) {
            await initAudioEngine();
        }
        // Reload playlist in case of changes
        await loadAudioPlaylist();
        startAudioPlayback();
    }
}

// ============================================
// ADMIN AUDIO ADS TABLE
// ============================================

function renderAudioAdsTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Reload playlist to get all ads (admin view)
    loadAudioPlaylist().then(() => {
        const ads = AudioEngine.playlist;
        
        if (ads.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔊</div>
                    <h3 class="empty-state-title">No audio ads</h3>
                    <p class="empty-state-desc">Upload your first audio ad</p>
                </div>`;
            return;
        }
        
        let html = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Ad Name</th>
                            <th>Duration</th>
                            <th>Interval</th>
                            <th>Zones</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        ads.forEach(ad => {
            html += `
                <tr>
                    <td><strong>${ad.ad_name}</strong><br><small>${ad.advertiser_name || ''}</small></td>
                    <td>${ad.duration_seconds || 30}s</td>
                    <td>Every ${ad.play_interval_seconds || 15}s</td>
                    <td>${(ad.assigned_zones || '').substring(0, 30)}</td>
                    <td><span class="badge badge-${ad.priority || 'medium'}">${ad.priority || 'medium'}</span></td>
                    <td>
                        <span class="badge ${ad.status === 'active' ? 'badge-green' : 'badge-gray'}">
                            ${ad.status || 'unknown'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-ghost" onclick="toggleAudioAdStatus('${ad.ad_id}', '${ad.status === 'active' ? 'inactive' : 'active'}')">
                            ${ad.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                    </td>
                </tr>`;
        });
        
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    });
}

// ============================================
// INITIALIZATION
// ============================================

function initAudioModule() {
    // Check if on driver page
    if (document.querySelector('.audio-control-panel')) {
        const user = getCurrentUser();
        if (user?.role === 'driver') {
            initAudioEngine(user.email, user.zone);
        }
    }
    
    console.log('✅ Audio Module Loaded');
}

document.addEventListener('DOMContentLoaded', initAudioModule);

console.log('✅ Audio Module Ready');
