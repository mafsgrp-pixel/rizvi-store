/*
 * Filename: auth.js
 * Path: /js/core/auth.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Google Sign-In, Authentication, Session Management, Permissions
 * Type: Core JavaScript
 */

// ============================================
// AUTH STATE
// ============================================

const AuthState = {
    currentUser: null,
    isAuthenticated: false,
    sessionToken: null,
    googleToken: null,
    isLoading: true,
    isInitialized: false
};

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================

function initGoogleAuth() {
    return new Promise((resolve, reject) => {
        try {
            if (typeof google === 'undefined' || !google.accounts) {
                console.warn('⚠️ Google Identity Services not loaded. Using fallback auth.');
                AuthState.isInitialized = true;
                AuthState.isLoading = false;
                resolve(false);
                return;
            }

            google.accounts.id.initialize({
                client_id: GOOGLE_CONFIG.clientId,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                context: 'signin',
                ux_mode: 'popup',
                itp_support: true
            });

            // Check if user was previously signed in
            checkExistingSession();

            console.log('✅ Google Sign-In initialized');
            AuthState.isInitialized = true;
            AuthState.isLoading = false;
            resolve(true);

        } catch (error) {
            console.error('❌ Google Sign-In initialization failed:', error);
            AuthState.isInitialized = true;
            AuthState.isLoading = false;
            resolve(false);
        }
    });
}

// ============================================
// GOOGLE CREDENTIAL HANDLER
// ============================================

async function handleGoogleCredentialResponse(response) {
    try {
        const credential = parseGoogleJwt(response.credential);
        
        if (!credential || !credential.email) {
            throw new Error('Invalid Google credential');
        }

        const userData = {
            email: credential.email,
            name: credential.name,
            picture: credential.picture,
            googleId: credential.sub,
            authProvider: 'google'
        };

        // Check if user exists in database
        let user = await findUserByEmail(userData.email);

        if (!user) {
            // New user - redirect to registration
            sessionStorage.setItem('google_signup_data', JSON.stringify(userData));
            window.location.href = '/rasaai/pages/register.html';
            return;
        }

        if (!user.active) {
            showNotification('Your account has been deactivated. Contact admin.', 'error');
            return;
        }

        // Login successful
        await completeLogin(user, response.credential);

    } catch (error) {
        console.error('❌ Google Sign-In handler error:', error);
        showNotification('Google Sign-In failed. Please try again.', 'error');
    }
}

// ============================================
// GOOGLE JWT PARSER
// ============================================

function parseGoogleJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('❌ JWT parse error:', error);
        return null;
    }
}

// ============================================
// RENDER GOOGLE SIGN-IN BUTTON
// ============================================

function renderGoogleButton(elementId, options = {}) {
    if (typeof google === 'undefined' || !google.accounts) {
        console.warn('⚠️ Google Identity Services not loaded');
        return;
    }

    const defaultOptions = {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: '100%'
    };

    const buttonOptions = { ...defaultOptions, ...options };

    google.accounts.id.renderButton(
        document.getElementById(elementId),
        buttonOptions
    );
}

// ============================================
// GOOGLE ONE TAP PROMPT
// ============================================

function showGoogleOneTap() {
    if (typeof google === 'undefined' || !google.accounts) return;

    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('One Tap not shown:', notification.getNotDisplayedReason());
        }
    });
}

// ============================================
// EMAIL/PASSWORD LOGIN (Fallback)
// ============================================

async function loginWithEmail(email, password, rememberMe = false) {
    try {
        validateEmail(email);
        validatePassword(password);

        // Find user by email
        let user = await findUserByEmail(email.toLowerCase().trim());

        if (!user) {
            // Check demo users
            user = DEMO_USERS.find(u => u.email === email.toLowerCase().trim());
        }

        if (!user) {
            throw new Error(ERROR_MESSAGES.auth.loginFailed);
        }

        // Verify password
        const hashedPassword = simpleHash(password);
        if (user.password !== password && user.password !== hashedPassword) {
            throw new Error(ERROR_MESSAGES.auth.loginFailed);
        }

        if (!user.active) {
            throw new Error('Your account has been deactivated. Contact admin.');
        }

        // Login successful
        await completeLogin(user, null, rememberMe);

        return { success: true, user: user };

    } catch (error) {
        console.error('❌ Login error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// COMPLETE LOGIN PROCESS
// ============================================

async function completeLogin(user, googleToken = null, rememberMe = false) {
    // Create session
    const sessionToken = generateSessionToken();
    const sessionData = {
        token: sessionToken,
        userId: user.user_id || user.email,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_CONFIG.timeout).toISOString(),
        googleToken: googleToken,
        rememberMe: rememberMe
    };

    // Save session
    AuthState.currentUser = user;
    AuthState.isAuthenticated = true;
    AuthState.sessionToken = sessionToken;
    AuthState.googleToken = googleToken;

    // Store session
    storeSession(sessionData);
    storeUserData(user);

    if (rememberMe) {
        localStorage.setItem(SESSION_CONFIG.rememberKey, 'true');
    }

    // Log to audit
    await logAudit('login', user.email, 'User logged in');

    // Update last login
    await updateLastLogin(user.email);

    console.log(`✅ User logged in: ${user.email} (${user.role})`);
}

// ============================================
// USER REGISTRATION
// ============================================

async function registerUser(userData) {
    try {
        // Validate
        validateEmail(userData.email);
        validatePassword(userData.password);
        validateName(userData.name);
        validatePhone(userData.phone);

        // Check if email already exists
        const existingUser = await findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('An account with this email already exists.');
        }

        // Create user object
        const newUser = {
            user_id: generateUserId(),
            email: userData.email.toLowerCase().trim(),
            password: userData.password, // In production, this would be hashed
            name: userData.name.trim(),
            role: userData.role || 'client',
            phone: userData.phone || '',
            company: userData.company || '',
            zone: userData.zone || '',
            rickshawId: userData.rickshawId || '',
            referralCode: generateReferralCode(userData.name),
            avatar: userData.picture || null,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: null
        };

        // Save to Google Sheets
        await saveUserToSheets(newUser);

        // Auto-login after registration
        await completeLogin(newUser, null, false);

        console.log(`✅ New user registered: ${newUser.email}`);
        return { success: true, user: newUser };

    } catch (error) {
        console.error('❌ Registration error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// GOOGLE SIGN-UP HANDLER
// ============================================

async function completeGoogleSignup(additionalData) {
    const googleData = JSON.parse(sessionStorage.getItem('google_signup_data'));
    
    if (!googleData) {
        throw new Error('Google sign-up data not found. Please try again.');
    }

    const userData = {
        ...googleData,
        ...additionalData,
        role: additionalData.role || 'client',
        password: generateRandomPassword()
    };

    const result = await registerUser(userData);
    
    if (result.success) {
        sessionStorage.removeItem('google_signup_data');
    }

    return result;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

function checkExistingSession() {
    const sessionData = getSessionData();
    const userData = getUserData();

    if (sessionData && userData) {
        // Check if session is expired
        const expiresAt = new Date(sessionData.expiresAt);
        if (expiresAt > new Date()) {
            // Valid session
            AuthState.currentUser = userData;
            AuthState.isAuthenticated = true;
            AuthState.sessionToken = sessionData.token;
            AuthState.googleToken = sessionData.googleToken || null;
            console.log(`✅ Session restored: ${userData.email}`);
            return true;
        } else {
            // Session expired
            clearSession();
            console.log('⏰ Session expired');
        }
    }

    AuthState.isAuthenticated = false;
    AuthState.isLoading = false;
    return false;
}

function storeSession(sessionData) {
    sessionStorage.setItem(SESSION_CONFIG.storageKey, JSON.stringify(sessionData));
}

function getSessionData() {
    try {
        const data = sessionStorage.getItem(SESSION_CONFIG.storageKey);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function storeUserData(userData) {
    // Don't store password in session
    const { password, ...safeUserData } = userData;
    sessionStorage.setItem(SESSION_CONFIG.userKey, JSON.stringify(safeUserData));
}

function getUserData() {
    try {
        const data = sessionStorage.getItem(SESSION_CONFIG.userKey);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function clearSession() {
    AuthState.currentUser = null;
    AuthState.isAuthenticated = false;
    AuthState.sessionToken = null;
    AuthState.googleToken = null;
    sessionStorage.removeItem(SESSION_CONFIG.storageKey);
    sessionStorage.removeItem(SESSION_CONFIG.userKey);
    localStorage.removeItem(SESSION_CONFIG.rememberKey);
}

// ============================================
// LOGOUT
// ============================================

async function logout() {
    try {
        // Log audit
        if (AuthState.currentUser) {
            await logAudit('logout', AuthState.currentUser.email, 'User logged out');
        }

        // Disable Google Sign-In
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.disableAutoSelect();
        }

        // Clear session
        clearSession();

        console.log('👋 User logged out');
        
        // Redirect to landing page
        window.location.href = '/rasaai/index.html';

    } catch (error) {
        console.error('❌ Logout error:', error);
        clearSession();
        window.location.href = '/rasaai/index.html';
    }
}

// ============================================
// PERMISSION CHECKS
// ============================================

function requireAuth() {
    if (!AuthState.isAuthenticated) {
        const currentPage = window.location.pathname;
        window.location.href = `/rasaai/pages/login.html?redirect=${encodeURIComponent(currentPage)}`;
        return false;
    }
    return true;
}

function requireRole(...allowedRoles) {
    if (!requireAuth()) return false;
    
    const userRole = AuthState.currentUser?.role;
    
    if (!allowedRoles.includes(userRole)) {
        console.warn(`⚠️ Access denied. Required: ${allowedRoles.join(', ')}, User: ${userRole}`);
        window.location.href = '/rasaai/pages/404.html';
        return false;
    }
    
    return true;
}

function hasPermission(permission) {
    if (!AuthState.currentUser) return false;
    
    const roleConfig = USER_ROLES[AuthState.currentUser.role];
    if (!roleConfig) return false;
    
    if (roleConfig.permissions.includes('all')) return true;
    return roleConfig.permissions.includes(permission);
}

function getCurrentUser() {
    return AuthState.currentUser;
}

function getCurrentUserEmail() {
    return AuthState.currentUser?.email || null;
}

function getUserRole() {
    return AuthState.currentUser?.role || 'guest';
}

function isAuthenticated() {
    return AuthState.isAuthenticated;
}

// ============================================
// ROUTE PROTECTION
// ============================================

function protectPage(requiredRole = null) {
    if (!AuthState.isInitialized) {
        // Wait for initialization
        setTimeout(() => protectPage(requiredRole), 100);
        return;
    }

    if (!AuthState.isAuthenticated) {
        const currentPage = window.location.pathname + window.location.search;
        window.location.href = `/rasaai/pages/login.html?redirect=${encodeURIComponent(currentPage)}`;
        return;
    }

    if (requiredRole && AuthState.currentUser.role !== requiredRole && 
        AuthState.currentUser.role !== 'super_admin') {
        // Check if super_admin (can access all)
        if (requiredRole === 'admin' && AuthState.currentUser.role === 'super_admin') {
            return; // Super admin can access admin pages
        }
        window.location.href = '/rasaai/pages/404.html';
        return;
    }
}

// ============================================
// DATABASE OPERATIONS (Google Sheets)
// ============================================

async function findUserByEmail(email) {
    try {
        // Try Google Sheets first
        if (FEATURES.googleSheets) {
            const users = await sheetsAPI.getRows(SHEETS.users);
            const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (user) return user;
        }
        
        // Fallback to demo users
        return DEMO_USERS.find(u => u.email === email.toLowerCase()) || null;
        
    } catch (error) {
        console.warn('⚠️ Sheets lookup failed, using demo data');
        return DEMO_USERS.find(u => u.email === email.toLowerCase()) || null;
    }
}

async function saveUserToSheets(userData) {
    if (!FEATURES.googleSheets) return;
    
    try {
        await sheetsAPI.appendRow(SHEETS.users, userData);
        console.log('✅ User saved to Sheets');
    } catch (error) {
        console.error('❌ Failed to save user:', error);
        throw new Error('Failed to save user data. Please try again.');
    }
}

async function updateLastLogin(email) {
    if (!FEATURES.googleSheets) return;
    
    try {
        await sheetsAPI.updateRow(SHEETS.users, 'email', email, {
            last_login: new Date().toISOString()
        });
    } catch (error) {
        console.warn('⚠️ Could not update last login');
    }
}

async function logAudit(action, email, details) {
    if (!FEATURES.googleSheets) return;
    
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action: action,
            user_email: email,
            details: details,
            ip: 'client-side',
            user_agent: navigator.userAgent.substring(0, 200)
        };
        
        await sheetsAPI.appendRow(SHEETS.auditLogs, logEntry);
    } catch (error) {
        console.warn('⚠️ Audit log failed');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateSessionToken() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

function generateUserId() {
    return 'USR' + Date.now().toString(36).toUpperCase();
}

function generateReferralCode(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return initials + random;
}

function generateRandomPassword() {
    return Math.random().toString(36).substring(2, 10) + 'A1!';
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new Error(ERROR_MESSAGES.general.invalidEmail);
    }
}

function validatePassword(password) {
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
    }
}

function validateName(name) {
    if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long.');
    }
}

function validatePhone(phone) {
    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/[^0-9]/g, ''))) {
        throw new Error(ERROR_MESSAGES.general.invalidPhone);
    }
}

// ============================================
// NOTIFICATION HELPER
// ============================================

function showNotification(message, type = 'info') {
    // Check if notification function exists
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
        alert(message);
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await initGoogleAuth();
    
    // If on a protected page, check auth
    const protectedPages = [
        'dashboard.html', 'admin.html', 'client.html', 
        'driver.html', 'affiliate.html', 'sales.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        protectPage();
    }
});

console.log('✅ Auth Module Loaded');
