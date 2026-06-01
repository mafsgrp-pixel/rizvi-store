/*
 * Filename: notifications.js
 * Path: /js/modules/notifications.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Toast notifications, snackbar, push notifications, notification center
 * Type: Module JavaScript
 */

// ============================================
// NOTIFICATION STATE
// ============================================

const NotificationState = {
    notifications: [],
    unreadCount: 0,
    toasts: [],
    maxToasts: 5,
    toastDuration: 4000,
    isNotificationSupported: 'Notification' in window,
    permissionGranted: false
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', duration = null) {
    const toastDuration = duration || NotificationState.toastDuration;
    const toast = {
        id: Date.now() + Math.random(),
        message,
        type,
        duration: toastDuration,
        createdAt: new Date()
    };

    NotificationState.toasts.push(toast);

    // Limit number of toasts
    if (NotificationState.toasts.length > NotificationState.maxToasts) {
        const oldestToast = NotificationState.toasts.shift();
        removeToastElement(oldestToast.id);
    }

    renderToast(toast);

    // Auto dismiss
    if (toastDuration > 0) {
        setTimeout(() => {
            dismissToast(toast.id);
        }, toastDuration);
    }

    return toast.id;
}

function showSuccessToast(message, duration = null) {
    return showToast(message, 'success', duration);
}

function showErrorToast(message, duration = null) {
    return showToast(message, 'error', duration || 6000);
}

function showWarningToast(message, duration = null) {
    return showToast(message, 'warning', duration);
}

function showInfoToast(message, duration = null) {
    return showToast(message, 'info', duration);
}

function renderToast(toast) {
    // Get or create toast container
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    // Toast icons and colors
    const config = {
        success: { icon: '✅', bg: '#E6F7F0', color: '#00A86B', border: '#00A86B' },
        error: { icon: '❌', bg: '#FDEDEC', color: '#E74C3C', border: '#E74C3C' },
        warning: { icon: '⚠️', bg: '#FFF8E6', color: '#FFB800', border: '#FFB800' },
        info: { icon: 'ℹ️', bg: '#EBF5FB', color: '#3498DB', border: '#3498DB' }
    };

    const style = config[toast.type] || config.info;

    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.id = `toast-${toast.id}`;
    toastEl.style.cssText = `
        background: ${style.bg};
        color: ${style.color};
        border-left: 4px solid ${style.border};
        border-radius: 12px;
        padding: 14px 18px;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        cursor: pointer;
        min-width: 280px;
        max-width: 100%;
        word-wrap: break-word;
    `;

    toastEl.innerHTML = `
        <span style="font-size:18px;">${style.icon}</span>
        <span style="flex:1;">${toast.message}</span>
        <button style="background:none;border:none;color:${style.color};cursor:pointer;font-size:16px;padding:0;opacity:0.6;" 
                onclick="dismissToast(${toast.id})">✕</button>
    `;

    toastEl.addEventListener('click', () => dismissToast(toast.id));
    container.appendChild(toastEl);

    // Remove after animation
    setTimeout(() => {
        if (toastEl.parentNode) {
            toastEl.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (toastEl.parentNode) toastEl.remove();
            }, 300);
        }
    }, toast.duration);
}

function dismissToast(toastId) {
    NotificationState.toasts = NotificationState.toasts.filter(t => t.id !== toastId);
    removeToastElement(toastId);
}

function removeToastElement(toastId) {
    const toastEl = document.getElementById(`toast-${toastId}`);
    if (toastEl) {
        toastEl.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (toastEl.parentNode) toastEl.remove();
        }, 300);
    }
}

function dismissAllToasts() {
    NotificationState.toasts.forEach(t => removeToastElement(t.id));
    NotificationState.toasts = [];
}

// ============================================
// SNACKBAR (Mobile-style bottom notification)
// ============================================

function showSnackbar(message, action = null, actionLabel = 'OK', duration = 4000) {
    // Remove existing snackbar
    const existing = document.getElementById('snackbar');
    if (existing) existing.remove();

    const snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    snackbar.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #212529;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        transition: transform 0.3s ease;
        white-space: nowrap;
        max-width: 90vw;
    `;

    snackbar.innerHTML = `
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;">${message}</span>
        ${action ? `<button style="background:none;border:none;color:#FF5A00;font-weight:600;cursor:pointer;font-size:14px;white-space:nowrap;" 
                         id="snackbar-action">${actionLabel}</button>` : ''}
    `;

    document.body.appendChild(snackbar);

    // Animate in
    setTimeout(() => {
        snackbar.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    // Action handler
    if (action) {
        document.getElementById('snackbar-action').addEventListener('click', () => {
            action();
            dismissSnackbar();
        });
    }

    // Auto dismiss
    if (duration > 0) {
        setTimeout(dismissSnackbar, duration);
    }

    return snackbar;
}

function dismissSnackbar() {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
        snackbar.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => snackbar.remove(), 300);
    }
}

// ============================================
// IN-APP NOTIFICATIONS
// ============================================

async function loadNotifications() {
    try {
        if (FEATURES.googleSheets && navigator.onLine) {
            NotificationState.notifications = await sheetsAPI.getSheetData(SHEETS.notifications);
        }
        
        // Filter for current user
        const userEmail = getCurrentUserEmail();
        if (userEmail) {
            NotificationState.notifications = NotificationState.notifications.filter(
                n => n.user_email === userEmail || n.user_email === 'all'
            );
        }

        updateUnreadCount();
        console.log(`🔔 Loaded ${NotificationState.notifications.length} notifications`);
    } catch (error) {
        console.warn('⚠️ Failed to load notifications');
    }
}

async function createNotification(userEmail, type, title, message, link = '') {
    try {
        const notification = {
            notification_id: generateId('NOTIF'),
            user_email: userEmail,
            type: type,
            title: title,
            message: message,
            link: link,
            read: false,
            created_at: new Date().toISOString()
        };

        NotificationState.notifications.unshift(notification);
        updateUnreadCount();

        if (FEATURES.googleSheets && navigator.onLine) {
            await sheetsAPI.appendRow(SHEETS.notifications, notification);
        }

        // Show toast for new notification
        const typeConfig = NOTIFICATION_TYPES[type?.toUpperCase()] || {};
        showToast(`${typeConfig.icon || '🔔'} ${title}`, 'info', 5000);

        return notification;
    } catch (error) {
        console.warn('⚠️ Failed to create notification');
        return null;
    }
}

async function markNotificationRead(notificationId) {
    const notification = NotificationState.notifications.find(n => n.notification_id === notificationId);
    if (notification) {
        notification.read = true;
        updateUnreadCount();
    }
}

async function markAllNotificationsRead() {
    NotificationState.notifications.forEach(n => n.read = true);
    updateUnreadCount();
    showToast('All notifications marked as read', 'success');
}

function updateUnreadCount() {
    NotificationState.unreadCount = NotificationState.notifications.filter(n => !n.read).length;
    
    // Update badge
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = NotificationState.unreadCount;
        badge.style.display = NotificationState.unreadCount > 0 ? 'flex' : 'none';
    }
}

function getUnreadCount() {
    return NotificationState.unreadCount;
}

// ============================================
// BROWSER PUSH NOTIFICATIONS
// ============================================

async function requestPushPermission() {
    if (!NotificationState.isNotificationSupported) {
        showToast('Notifications not supported on this browser', 'warning');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        NotificationState.permissionGranted = permission === 'granted';
        
        if (permission === 'granted') {
            showToast('Notifications enabled! 🔔', 'success');
        }
        
        return NotificationState.permissionGranted;
    } catch (error) {
        console.warn('⚠️ Push permission denied');
        return false;
    }
}

function sendPushNotification(title, body, icon = '/rasaai/assets/icons/icon-192x192.png') {
    if (!NotificationState.permissionGranted) return;

    try {
        const notification = new Notification(title, {
            body: body,
            icon: icon,
            badge: '/rasaai/assets/icons/icon-72x72.png',
            tag: 'rasaai-notification',
            requireInteraction: false,
            vibrate: [200, 100, 200]
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        setTimeout(() => notification.close(), 5000);
    } catch (error) {
        console.warn('⚠️ Push notification failed');
    }
}

// ============================================
// NOTIFICATION HELPERS
// ============================================

function notifyCampaignApproved(campaignId) {
    createNotification(
        getCurrentUserEmail(),
        'campaign_approved',
        'Campaign Approved ✅',
        `Your campaign ${campaignId} has been approved and is now active.`,
        `/rasaai/pages/campaign.html?id=${campaignId}`
    );
    sendPushNotification('Campaign Approved!', `Your campaign ${campaignId} is now live.`);
}

function notifyPaymentReceived(amount) {
    createNotification(
        getCurrentUserEmail(),
        'payment_received',
        'Payment Received 💰',
        `Payment of ${formatINR(amount)} has been received successfully.`,
        '/rasaai/pages/invoice.html'
    );
    sendPushNotification('Payment Received!', `${formatINR(amount)} received successfully.`);
}

function notifyCommissionEarned(amount) {
    createNotification(
        getCurrentUserEmail(),
        'commission_earned',
        'Commission Earned! 💸',
        `You earned ${formatINR(amount)} in affiliate commission.`,
        '/rasaai/pages/affiliate.html'
    );
}

function notifyTaskAssigned(taskTitle) {
    createNotification(
        getCurrentUserEmail(),
        'task_assigned',
        'New Task Assigned 📋',
        taskTitle,
        '/rasaai/pages/driver.html'
    );
}

// ============================================
// NOTIFICATION CENTER UI
// ============================================

function renderNotificationCenter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const notifications = NotificationState.notifications.slice(0, 50);

    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <h3 class="empty-state-title">No notifications</h3>
                <p class="empty-state-desc">You're all caught up!</p>
            </div>`;
        return;
    }

    let html = `
        <div class="notification-header">
            <h4>Notifications (${NotificationState.unreadCount} unread)</h4>
            ${NotificationState.unreadCount > 0 ? 
                '<button class="btn btn-sm btn-ghost" onclick="markAllNotificationsRead()">Mark all read</button>' : ''}
        </div>
        <div class="notification-list">`;

    notifications.forEach(n => {
        const typeConfig = NOTIFICATION_TYPES[n.type?.toUpperCase()] || {};
        
        html += `
            <div class="notification-item ${n.read ? '' : 'unread'}" 
                 onclick="markNotificationRead('${n.notification_id}'); ${n.link ? `window.location.href='${n.link}'` : ''}">
                <div class="notification-icon" style="background:${typeConfig.color || '#3498DB'}20;color:${typeConfig.color || '#3498DB'}">
                    ${typeConfig.icon || '🔔'}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-desc">${n.message}</div>
                    <div class="notification-time">${formatTimeAgo(n.created_at)}</div>
                </div>
                ${!n.read ? '<span class="notification-dot"></span>' : ''}
            </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderNotificationBell(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <button class="header-notification" onclick="toggleNotificationDropdown()" id="notification-bell">
            🔔
            <span class="header-notification-dot" id="notification-badge" 
                  style="display:${NotificationState.unreadCount > 0 ? 'block' : 'none'}">
                ${NotificationState.unreadCount}
            </span>
        </button>`;
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            renderNotificationCenter('notification-dropdown-body');
        }
    }
}

// ============================================
// TOAST ANIMATION STYLES (Injected)
// ============================================

function injectToastStyles() {
    if (document.getElementById('toast-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-animation-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .notification-dot {
            width: 8px; height: 8px; border-radius: 50%; background: #E74C3C;
            flex-shrink: 0; margin-left: auto;
        }
        .notification-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px; border-bottom: 1px solid #eee;
        }
        .notification-header h4 { margin: 0; font-size: 16px; }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================

async function initNotifications() {
    injectToastStyles();

    if (AuthState.isAuthenticated) {
        await loadNotifications();
    }

    // Request push permission for admins/clients
    if (NotificationState.isNotificationSupported && 
        ['super_admin', 'admin', 'client'].includes(getUserRole())) {
        setTimeout(requestPushPermission, 3000);
    }

    console.log('✅ Notifications Module Loaded');
}

document.addEventListener('DOMContentLoaded', initNotifications);

// Global toast function
window.showToast = showToast;

console.log('✅ Notifications Module Ready');
