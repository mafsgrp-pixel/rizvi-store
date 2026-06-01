/*
 * Filename: gamification.js
 * Path: /js/modules/gamification.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: XP, badges, streaks, leaderboard, rewards redemption system
 * Type: Module JavaScript
 */

// ============================================
// GAMIFICATION STATE
// ============================================

const GamificationState = {
    userXP: 0,
    userLevel: 1,
    badges: [],
    streak: 0,
    totalScans: 0,
    totalCoins: 0,
    redeemedCoins: 0,
    leaderboard: [],
    challenges: [],
    rewards: []
};

// ============================================
// BADGES DEFINITION
// ============================================

const BADGES = {
    first_scan: {
        id: 'first_scan',
        name: 'First Scan',
        icon: '📷',
        description: 'Complete your first QR scan',
        xp: 50,
        color: '#3498DB'
    },
    scan_10: {
        id: 'scan_10',
        name: 'Scanner Pro',
        icon: '🔍',
        description: 'Complete 10 QR scans',
        xp: 100,
        color: '#00A86B'
    },
    scan_50: {
        id: 'scan_50',
        name: 'Scan Master',
        icon: '🎯',
        description: 'Complete 50 QR scans',
        xp: 250,
        color: '#8E44AD'
    },
    scan_100: {
        id: 'scan_100',
        name: 'Scan Legend',
        icon: '👑',
        description: 'Complete 100 QR scans',
        xp: 500,
        color: '#FFB800'
    },
    streak_3: {
        id: 'streak_3',
        name: '3-Day Streak',
        icon: '🔥',
        description: 'Scan for 3 consecutive days',
        xp: 100,
        color: '#FF5A00'
    },
    streak_7: {
        id: 'streak_7',
        name: 'Weekly Warrior',
        icon: '⚔️',
        description: 'Scan for 7 consecutive days',
        xp: 250,
        color: '#E74C3C'
    },
    streak_30: {
        id: 'streak_30',
        name: 'Monthly Streak',
        icon: '🏆',
        description: 'Scan for 30 consecutive days',
        xp: 1000,
        color: '#FFB800'
    },
    zone_3: {
        id: 'zone_3',
        name: 'Zone Explorer',
        icon: '🗺️',
        description: 'Scan in 3 different zones',
        xp: 150,
        color: '#00A86B'
    },
    zone_5: {
        id: 'zone_5',
        name: 'Zone Traveler',
        icon: '🧭',
        description: 'Scan in 5 different zones',
        xp: 300,
        color: '#3498DB'
    },
    zone_10: {
        id: 'zone_10',
        name: 'Mumbra Mapper',
        icon: '🌟',
        description: 'Scan in 10 different zones',
        xp: 750,
        color: '#8E44AD'
    },
    first_redemption: {
        id: 'first_redemption',
        name: 'First Reward',
        icon: '🎁',
        description: 'Redeem your first reward',
        xp: 100,
        color: '#FFB800'
    },
    coin_1000: {
        id: 'coin_1000',
        name: 'Coin Collector',
        icon: '💰',
        description: 'Earn 1,000 coins',
        xp: 200,
        color: '#FFB800'
    },
    coin_10000: {
        id: 'coin_10000',
        name: 'Coin Millionaire',
        icon: '💎',
        description: 'Earn 10,000 coins',
        xp: 500,
        color: '#00A86B'
    },
    refer_1: {
        id: 'refer_1',
        name: 'Referrer',
        icon: '👥',
        description: 'Refer 1 friend',
        xp: 150,
        color: '#3498DB'
    },
    refer_5: {
        id: 'refer_5',
        name: 'Network Builder',
        icon: '🌐',
        description: 'Refer 5 friends',
        xp: 500,
        color: '#8E44AD'
    }
};

// ============================================
// LEVEL SYSTEM
// ============================================

const LEVELS = [
    { level: 1, xpRequired: 0, title: 'Beginner', icon: '🌱' },
    { level: 2, xpRequired: 100, title: 'Explorer', icon: '🔍' },
    { level: 3, xpRequired: 250, title: 'Scout', icon: '🎯' },
    { level: 4, xpRequired: 500, title: 'Adventurer', icon: '⚔️' },
    { level: 5, xpRequired: 1000, title: 'Warrior', icon: '🛡️' },
    { level: 6, xpRequired: 2000, title: 'Champion', icon: '🏆' },
    { level: 7, xpRequired: 3500, title: 'Hero', icon: '⭐' },
    { level: 8, xpRequired: 5500, title: 'Legend', icon: '🌟' },
    { level: 9, xpRequired: 8000, title: 'Master', icon: '👑' },
    { level: 10, xpRequired: 12000, title: 'Grand Master', icon: '💎' }
];

function getLevelForXP(xp) {
    let currentLevel = LEVELS[0];
    for (const level of LEVELS) {
        if (xp >= level.xpRequired) {
            currentLevel = level;
        }
    }
    
    const nextLevel = LEVELS.find(l => l.xpRequired > xp);
    const xpForNext = nextLevel ? nextLevel.xpRequired - xp : 0;
    const xpProgress = nextLevel 
        ? Math.round(((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100)
        : 100;
    
    return {
        current: currentLevel,
        next: nextLevel || currentLevel,
        xpForNext,
        xpProgress
    };
}

// ============================================
// BADGE MANAGEMENT
// ============================================

function checkAndAwardBadges() {
    const newBadges = [];
    const scans = ScannerState.scanHistory;
    const user = getCurrentUser();
    
    if (!user) return newBadges;
    
    // Scan count badges
    if (scans.length >= 1 && !hasBadge('first_scan')) {
        newBadges.push(awardBadge('first_scan'));
    }
    if (scans.length >= 10 && !hasBadge('scan_10')) {
        newBadges.push(awardBadge('scan_10'));
    }
    if (scans.length >= 50 && !hasBadge('scan_50')) {
        newBadges.push(awardBadge('scan_50'));
    }
    if (scans.length >= 100 && !hasBadge('scan_100')) {
        newBadges.push(awardBadge('scan_100'));
    }
    
    // Streak badges
    const streak = ScannerState.currentStreak;
    if (streak >= 3 && !hasBadge('streak_3')) {
        newBadges.push(awardBadge('streak_3'));
    }
    if (streak >= 7 && !hasBadge('streak_7')) {
        newBadges.push(awardBadge('streak_7'));
    }
    if (streak >= 30 && !hasBadge('streak_30')) {
        newBadges.push(awardBadge('streak_30'));
    }
    
    // Zone badges
    const zonesVisited = ScannerState.zonesVisited.length;
    if (zonesVisited >= 3 && !hasBadge('zone_3')) {
        newBadges.push(awardBadge('zone_3'));
    }
    if (zonesVisited >= 5 && !hasBadge('zone_5')) {
        newBadges.push(awardBadge('zone_5'));
    }
    if (zonesVisited >= 10 && !hasBadge('zone_10')) {
        newBadges.push(awardBadge('zone_10'));
    }
    
    // Coin badges
    if (ScannerState.totalCoins >= 1000 && !hasBadge('coin_1000')) {
        newBadges.push(awardBadge('coin_1000'));
    }
    if (ScannerState.totalCoins >= 10000 && !hasBadge('coin_10000')) {
        newBadges.push(awardBadge('coin_10000'));
    }
    
    // Notify user of new badges
    newBadges.forEach(badge => {
        if (badge) {
            showToast(`🏅 Badge Unlocked: ${badge.name}!`, 'success', 5000);
        }
    });
    
    return newBadges;
}

function hasBadge(badgeId) {
    return GamificationState.badges.some(b => b.id === badgeId);
}

function awardBadge(badgeId) {
    const badge = BADGES[badgeId];
    if (!badge) return null;
    
    const awardedBadge = {
        ...badge,
        awardedAt: new Date().toISOString()
    };
    
    GamificationState.badges.push(awardedBadge);
    GamificationState.userXP += badge.xp;
    
    // Check level up
    checkLevelUp();
    
    // Save to storage
    saveGamificationState();
    
    console.log(`🏅 Badge awarded: ${badge.name} (+${badge.xp} XP)`);
    return awardedBadge;
}

function checkLevelUp() {
    const oldLevel = GamificationState.userLevel;
    const levelInfo = getLevelForXP(GamificationState.userXP);
    GamificationState.userLevel = levelInfo.current.level;
    
    if (GamificationState.userLevel > oldLevel) {
        showToast(`🎉 Level Up! You are now Level ${GamificationState.userLevel} - ${levelInfo.current.title}`, 'success', 6000);
    }
}

// ============================================
// LEADERBOARD
// ============================================

function getLeaderboard(type = 'scans', limit = 20) {
    // Generate leaderboard from scan data
    const scanData = ScannerState.scanHistory || [];
    
    // Group by passenger
    const playerStats = {};
    scanData.forEach(scan => {
        const email = scan.passenger_email;
        if (!playerStats[email]) {
            playerStats[email] = {
                email: email,
                name: email?.split('@')[0] || 'Anonymous',
                scans: 0,
                coins: 0,
                zones: new Set(),
                streak: 0
            };
        }
        playerStats[email].scans++;
        playerStats[email].coins += parseInt(scan.coins_earned) || 0;
        playerStats[email].zones.add(scan.zone);
    });
    
    // Convert to array and sort
    let leaderboard = Object.values(playerStats).map(p => ({
        ...p,
        zones: p.zones.size
    }));
    
    if (type === 'scans') {
        leaderboard.sort((a, b) => b.scans - a.scans);
    } else if (type === 'coins') {
        leaderboard.sort((a, b) => b.coins - a.coins);
    } else if (type === 'zones') {
        leaderboard.sort((a, b) => b.zones - a.zones);
    }
    
    GamificationState.leaderboard = leaderboard.slice(0, limit);
    return GamificationState.leaderboard;
}

function getCurrentUserRank(type = 'scans') {
    const leaderboard = getLeaderboard(type, 999);
    const userEmail = getCurrentUserEmail();
    const index = leaderboard.findIndex(p => p.email === userEmail);
    return index >= 0 ? index + 1 : null;
}

// ============================================
// REWARDS REDEMPTION
// ============================================

const REWARDS_CATALOG = [
    { id: 'reward_1', name: '₹10 Cashback', description: 'Get ₹10 cashback on next ride', coins: 1000, type: 'cashback', value: 10 },
    { id: 'reward_2', name: '₹25 Paytm Cash', description: 'Get ₹25 Paytm cash', coins: 2500, type: 'paytm', value: 25 },
    { id: 'reward_3', name: '₹50 UPI Cash', description: 'Get ₹50 via UPI transfer', coins: 5000, type: 'upi', value: 50 },
    { id: 'reward_4', name: '₹100 Voucher', description: 'Get ₹100 shopping voucher', coins: 10000, type: 'voucher', value: 100 },
    { id: 'reward_5', name: 'Free Rickshaw Ride', description: 'Get 1 free rickshaw ride (up to ₹30)', coins: 3000, type: 'ride', value: 30 },
    { id: 'reward_6', name: 'Exclusive Badge', description: 'Unlock an exclusive profile badge', coins: 500, type: 'badge', value: 0 },
    { id: 'reward_7', name: 'Double Coins Boost', description: 'Earn 2x coins for next 24 hours', coins: 2000, type: 'boost', value: 0 },
    { id: 'reward_8', name: '₹200 Big Reward', description: 'Get ₹200 cash reward', coins: 20000, type: 'upi', value: 200 }
];

function getRewardsCatalog() {
    return REWARDS_CATALOG;
}

async function redeemReward(rewardId) {
    const reward = REWARDS_CATALOG.find(r => r.id === rewardId);
    if (!reward) {
        return { success: false, error: 'Reward not found' };
    }
    
    if (ScannerState.totalCoins < reward.coins) {
        return { success: false, error: `Not enough coins. Need ${reward.coins} coins.` };
    }
    
    // Deduct coins
    ScannerState.totalCoins -= reward.coins;
    GamificationState.redeemedCoins += reward.coins;
    
    // Log redemption
    const redemption = {
        redemption_id: generateId('REDEEM'),
        reward_id: reward.id,
        reward_name: reward.name,
        coins_spent: reward.coins,
        value: reward.value,
        type: reward.type,
        redeemed_at: new Date().toISOString()
    };
    
    GamificationState.rewards.push(redemption);
    
    // Save state
    saveGamificationState();
    
    // Check for redemption badge
    if (!hasBadge('first_redemption')) {
        awardBadge('first_redemption');
    }
    
    console.log(`🎁 Reward redeemed: ${reward.name} (${reward.coins} coins)`);
    
    return {
        success: true,
        redemption: redemption,
        remainingCoins: ScannerState.totalCoins
    };
}

function getRedemptionHistory() {
    return GamificationState.rewards;
}

// ============================================
// DAILY CHALLENGES
// ============================================

const DAILY_CHALLENGES = [
    { id: 'daily_scan', name: 'Daily Scanner', description: 'Scan 1 QR code today', target: 1, reward: 25, type: 'scans' },
    { id: 'scan_3', name: 'Triple Scan', description: 'Scan 3 QR codes today', target: 3, reward: 50, type: 'scans' },
    { id: 'scan_5', name: 'Power Scanner', description: 'Scan 5 QR codes today', target: 5, reward: 100, type: 'scans' },
    { id: 'zone_2', name: 'Zone Hopper', description: 'Scan in 2 different zones today', target: 2, reward: 75, type: 'zones' },
    { id: 'first_scan', name: 'Early Bird', description: 'Complete first scan before 9 AM', target: 1, reward: 30, type: 'time' }
];

function getDailyChallenges() {
    return DAILY_CHALLENGES;
}

function getChallengeProgress(challengeId) {
    const challenge = DAILY_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return { progress: 0, target: 1, completed: false };
    
    const todayScans = ScannerState.scanHistory.filter(s => 
        s.scanned_at?.startsWith(getTodayDate())
    );
    
    let progress = 0;
    
    switch (challenge.type) {
        case 'scans':
            progress = todayScans.length;
            break;
        case 'zones':
            progress = new Set(todayScans.map(s => s.zone)).size;
            break;
        case 'time':
            const earlyScans = todayScans.filter(s => {
                const hour = new Date(s.scanned_at).getHours();
                return hour < 9;
            });
            progress = earlyScans.length;
            break;
    }
    
    return {
        progress: Math.min(progress, challenge.target),
        target: challenge.target,
        completed: progress >= challenge.target,
        reward: challenge.reward
    };
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function renderLeaderboard(containerId, type = 'scans') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const leaderboard = getLeaderboard(type);
    
    let html = '<div class="leaderboard-list">';
    
    leaderboard.forEach((player, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'default';
        const isCurrentUser = player.email === getCurrentUserEmail();
        
        html += `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="leaderboard-rank ${rankClass}">${rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : '#' + rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${maskEmail(player.email)}</div>
                    <div class="leaderboard-subtitle">${player.zones} zones</div>
                </div>
                <div class="leaderboard-value">${player[type] || player.scans} ${type === 'coins' ? '💰' : type === 'scans' ? '📷' : ''}</div>
            </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderBadges(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const allBadges = Object.values(BADGES);
    
    let html = '<div class="badges-grid">';
    
    allBadges.forEach(badge => {
        const earned = hasBadge(badge.id);
        html += `
            <div class="badge-card ${earned ? 'earned' : 'locked'}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
                <div class="badge-xp">+${badge.xp} XP</div>
                ${earned ? '<div class="badge-earned-badge">✅ Earned</div>' : '<div class="badge-locked">🔒</div>'}
            </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderRewardsCatalog(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const rewards = getRewardsCatalog();
    
    let html = '<div class="rewards-grid">';
    
    rewards.forEach(reward => {
        const canAfford = ScannerState.totalCoins >= reward.coins;
        
        html += `
            <div class="reward-card ${canAfford ? 'available' : 'locked'}">
                <div class="reward-name">${reward.name}</div>
                <div class="reward-desc">${reward.description}</div>
                <div class="reward-cost">🪙 ${reward.coins} coins</div>
                <button class="btn btn-sm ${canAfford ? 'btn-primary' : 'btn-outline'}" 
                        ${canAfford ? `onclick="handleRedeem('${reward.id}')"` : 'disabled'}>
                    ${canAfford ? 'Redeem Now' : 'Need More Coins'}
                </button>
            </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

async function handleRedeem(rewardId) {
    if (!confirm('Are you sure you want to redeem this reward?')) return;
    
    const result = await redeemReward(rewardId);
    
    if (result.success) {
        showToast(`🎁 Reward redeemed successfully! ${result.remainingCoins} coins remaining.`, 'success');
        renderRewardsCatalog('rewards-catalog');
    } else {
        showToast(result.error, 'error');
    }
}

function renderLevelProgress(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const levelInfo = getLevelForXP(GamificationState.userXP);
    
    container.innerHTML = `
        <div class="level-card">
            <div class="level-icon">${levelInfo.current.icon}</div>
            <div class="level-info">
                <div class="level-title">Level ${levelInfo.current.level} - ${levelInfo.current.title}</div>
                <div class="level-xp">${GamificationState.userXP} XP</div>
                <div class="level-progress-bar">
                    <div class="level-progress-fill" style="width:${levelInfo.xpProgress}%"></div>
                </div>
                <div class="level-next">${levelInfo.xpForNext > 0 ? `${levelInfo.xpForNext} XP to Level ${levelInfo.next.level}` : 'Max Level!'}</div>
            </div>
        </div>`;
}

// ============================================
// STATE PERSISTENCE
// ============================================

function saveGamificationState() {
    const state = {
        userXP: GamificationState.userXP,
        userLevel: GamificationState.userLevel,
        badges: GamificationState.badges,
        redeemedCoins: GamificationState.redeemedCoins,
        rewards: GamificationState.rewards,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('rasaai_gamification', JSON.stringify(state));
}

function loadGamificationState() {
    try {
        const saved = localStorage.getItem('rasaai_gamification');
        if (saved) {
            const state = JSON.parse(saved);
            GamificationState.userXP = state.userXP || 0;
            GamificationState.userLevel = state.userLevel || 1;
            GamificationState.badges = state.badges || [];
            GamificationState.redeemedCoins = state.redeemedCoins || 0;
            GamificationState.rewards = state.rewards || [];
        }
    } catch (error) {
        console.warn('⚠️ Failed to load gamification state');
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initGamification() {
    loadGamificationState();
    console.log('✅ Gamification Module Loaded');
    console.log(`🎮 Level ${GamificationState.userLevel} | ${GamificationState.userXP} XP | ${GamificationState.badges.length} Badges`);
}

document.addEventListener('DOMContentLoaded', initGamification);

console.log('✅ Gamification Module Ready');
