/*
 * Filename: router.js
 * Path: /js/core/router.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: Page routing, role-based redirects, navigation management
 * Type: Core JavaScript
 */

// ============================================
// ROUTER STATE
// ============================================

const RouterState = {
    currentPage: null,
    previousPage: null,
    history: [],
    params: {},
    query: {},
    isNavigating: false,
    guards: []
};

// ============================================
// ROUTE DEFINITIONS
// ============================================

const ROUTES = {
    // Public Routes (No Auth Required)
    public: {
        landing: {
            path: '/rasaai/index.html',
            title: 'RASAAI - Auto Rickshaw Advertising Network',
            file: 'index.html'
        },
        login: {
            path: '/rasaai/pages/login.html',
            title: 'Login - RASAAI',
            file: 'login.html'
        },
        register: {
            path: '/rasaai/pages/register.html',
            title: 'Register - RASAAI',
            file: 'register.html'
        },
        forgotPassword: {
            path: '/rasaai/pages/forgot-password.html',
            title: 'Forgot Password - RASAAI',
            file: 'forgot-password.html'
        },
        privacy: {
            path: '/rasaai/pages/privacy.html',
            title: 'Privacy Policy - RASAAI',
            file: 'privacy.html'
        },
        terms: {
            path: '/rasaai/pages/terms.html',
            title: 'Terms of Service - RASAAI',
            file: 'terms.html'
        },
        refund: {
            path: '/rasaai/pages/refund.html',
            title: 'Refund Policy - RASAAI',
            file: 'refund.html'
        },
        leaderboard: {
            path: '/rasaai/pages/leaderboard.html',
            title: 'Leaderboard - RASAAI',
            file: 'leaderboard.html'
        },
        404: {
            path: '/rasaai/pages/404.html',
            title: '404 - Page Not Found - RASAAI',
            file: '404.html'
        },
        offline: {
            path: '/rasaai/pages/offline.html',
            title: 'Offline - RASAAI',
            file: 'offline.html'
        }
    },

    // Role-Based Dashboard Route (Auto-Redirect)
    dashboard: {
        path: '/rasaai/pages/dashboard.html',
        title: 'Dashboard - RASAAI',
        file: 'dashboard.html',
        redirectMap: {
            super_admin: '/rasaai/pages/admin.html',
            admin: '/rasaai/pages/admin.html',
            client: '/rasaai/pages/client.html',
            driver: '/rasaai/pages/driver.html',
            affiliate: '/rasaai/pages/affiliate.html',
            sales: '/rasaai/pages/sales.html',
            passenger: '/rasaai/pages/passenger.html'
        }
    },

    // Protected Routes (Auth Required)
    protected: {
        admin: {
            path: '/rasaai/pages/admin.html',
            title: 'Admin Panel - RASAAI',
            file: 'admin.html',
            roles: ['super_admin', 'admin']
        },
        client: {
            path: '/rasaai/pages/client.html',
            title: 'Client Portal - RASAAI',
            file: 'client.html',
            roles: ['client']
        },
        driver: {
            path: '/rasaai/pages/driver.html',
            title: 'Driver Portal - RASAAI',
            file: 'driver.html',
            roles: ['driver']
        },
        affiliate: {
            path: '/rasaai/pages/affiliate.html',
            title: 'Affiliate Portal - RASAAI',
            file: 'affiliate.html',
            roles: ['affiliate']
        },
        sales: {
            path: '/rasaai/pages/sales.html',
            title: 'Sales Portal - RASAAI',
            file: 'sales.html',
            roles: ['sales']
        },
        passenger: {
            path: '/rasaai/pages/passenger.html',
            title: 'Passenger Portal - RASAAI',
            file: 'passenger.html',
            roles: ['passenger']
        },
        campaign: {
            path: '/rasaai/pages/campaign.html',
            title: 'Book Campaign - RASAAI',
            file: 'campaign.html',
            roles: ['client', 'admin', 'super_admin']
        },
        invoice: {
            path: '/rasaai/pages/invoice.html',
            title: 'Invoices - RASAAI',
            file: 'invoice.html',
            roles: ['client', 'admin', 'super_admin']
        },
        analytics: {
            path: '/rasaai/pages/analytics.html',
            title: 'Analytics - RASAAI',
            file: 'analytics.html',
            roles: ['client', 'admin', 'super_admin', 'sales']
        },
        crm: {
            path: '/rasaai/pages/crm.html',
            title: 'CRM Pipeline - RASAAI',
            file: 'crm.html',
            roles: ['sales', 'admin', 'super_admin']
        },
        scan: {
            path: '/rasaai/pages/scan.html',
            title: 'QR Scanner - RASAAI',
            file: 'scan.html',
            roles: ['passenger', 'client', 'admin', 'super_admin']
        },
        rewards: {
            path: '/rasaai/pages/rewards.html',
            title: 'Rewards - RASAAI',
            file: 'rewards.html',
            roles: ['passenger']
        }
    }
};

// ============================================
// ROUTE MATCHING
// ============================================

function getCurrentRoute() {
    const path = window.location.pathname;
    const allRoutes = [
        ...Object.values(ROUTES.public),
        ROUTES.dashboard,
        ...Object.values(ROUTES.protected)
    ];

    return allRoutes.find(route => route.path === path) || ROUTES.public[404];
}

function getRouteByFile(filename) {
    const allRoutes = [
        ...Object.values(ROUTES.public),
        ROUTES.dashboard,
        ...Object.values(ROUTES.protected)
    ];

    return allRoutes.find(route => route.file === filename);
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(path, params = {}, query = {}) {
    if (RouterState.isNavigating) return;
    RouterState.isNavigating = true;
    RouterState.previousPage = RouterState.currentPage;

    // Build URL with query params
    let url = path;
    const queryString = new URLSearchParams(query).toString();
    if (queryString) {
        url += '?' + queryString;
    }

    // Store params for next page
    if (Object.keys(params).length > 0) {
        sessionStorage.setItem('rasaai_nav_params', JSON.stringify(params));
    }

    // Add to history
    RouterState.history.push({
        from: RouterState.currentPage,
        to: url,
        timestamp: new Date().toISOString()
    });

    // Navigate
    window.location.href = url;
}

function navigateToDashboard() {
    if (!AuthState.isAuthenticated) {
        navigateTo(ROUTES.public.login.path);
        return;
    }

    const role = AuthState.currentUser?.role;
    const redirectMap = ROUTES.dashboard.redirectMap;

    if (redirectMap[role]) {
        navigateTo(redirectMap[role]);
    } else {
        navigateTo(ROUTES.public.landing.path);
    }
}

function navigateToLogin(redirectAfter = null) {
    const query = {};
    if (redirectAfter) {
        query.redirect = redirectAfter;
    }
    navigateTo(ROUTES.public.login.path, {}, query);
}

function goBack() {
    if (RouterState.history.length > 1) {
        window.history.back();
    } else {
        navigateToDashboard();
    }
}

// ============================================
// ROLE-BASED REDIRECT
// ============================================

function getDashboardForRole(role) {
    const redirectMap = {
        super_admin: ROUTES.protected.admin.path,
        admin: ROUTES.protected.admin.path,
        client: ROUTES.protected.client.path,
        driver: ROUTES.protected.driver.path,
        affiliate: ROUTES.protected.affiliate.path,
        sales: ROUTES.protected.sales.path,
        passenger: ROUTES.protected.passenger.path
    };

    return redirectMap[role] || ROUTES.public.landing.path;
}

function redirectToRoleDashboard() {
    if (!AuthState.isAuthenticated) return;

    const dashboardPath = getDashboardForRole(AuthState.currentUser.role);
    
    // Don't redirect if already on correct dashboard
    if (window.location.pathname === dashboardPath) return;
    
    navigateTo(dashboardPath);
}

// ============================================
// PAGE PROTECTION
// ============================================

function checkPageAccess() {
    const currentRoute = getCurrentRoute();
    
    // Check if route is protected
    const protectedRoute = Object.values(ROUTES.protected).find(
        r => r.path === currentRoute.path
    );

    if (protectedRoute) {
        // Check authentication
        if (!AuthState.isAuthenticated) {
            navigateToLogin(currentRoute.path);
            return false;
        }

        // Check role
        const userRole = AuthState.currentUser?.role;
        if (protectedRoute.roles && !protectedRoute.roles.includes(userRole)) {
            if (userRole !== 'super_admin') {
                navigateTo(ROUTES.public[404].path);
                return false;
            }
        }
    }

    // Handle dashboard auto-redirect
    if (currentRoute.path === ROUTES.dashboard.path) {
        if (AuthState.isAuthenticated) {
            redirectToRoleDashboard();
            return false;
        } else {
            navigateToLogin();
            return false;
        }
    }

    // Redirect authenticated users away from login/register
    if (AuthState.isAuthenticated) {
        const authPages = [
            ROUTES.public.login.path,
            ROUTES.public.register.path,
            ROUTES.public.forgotPassword.path
        ];
        
        if (authPages.includes(currentRoute.path)) {
            redirectToRoleDashboard();
            return false;
        }
    }

    return true;
}

// ============================================
// QUERY PARAMETER PARSING
// ============================================

function getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    
    RouterState.query = params;
    return params;
}

function getQueryParam(key, defaultValue = null) {
    const params = getQueryParams();
    return params[key] || defaultValue;
}

function getNavParams() {
    try {
        const params = sessionStorage.getItem('rasaai_nav_params');
        if (params) {
            sessionStorage.removeItem('rasaai_nav_params');
            return JSON.parse(params);
        }
    } catch {}
    return {};
}

// ============================================
// PAGE TITLE MANAGEMENT
// ============================================

function setPageTitle(title) {
    document.title = title || 'RASAAI';
}

function updatePageTitle() {
    const currentRoute = getCurrentRoute();
    if (currentRoute) {
        setPageTitle(currentRoute.title);
    }
}

// ============================================
// NAVIGATION GUARDS
// ============================================

function addNavigationGuard(guardFn) {
    RouterState.guards.push(guardFn);
}

function removeNavigationGuard(guardFn) {
    RouterState.guards = RouterState.guards.filter(g => g !== guardFn);
}

async function runNavigationGuards(to, from) {
    for (const guard of RouterState.guards) {
        try {
            const result = await guard(to, from);
            if (result === false) return false;
            if (typeof result === 'string') {
                navigateTo(result);
                return false;
            }
        } catch (error) {
            console.error('Navigation guard error:', error);
            return false;
        }
    }
    return true;
}

// ============================================
// BREADCRUMB GENERATION
// ============================================

function getBreadcrumbs() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p && p !== 'rasaai' && p !== 'pages');
    const breadcrumbs = [
        { label: 'Home', path: '/rasaai/index.html' }
    ];

    let currentPath = '/rasaai';
    for (const part of parts) {
        currentPath += '/' + part;
        const route = getRouteByFile(part);
        breadcrumbs.push({
            label: route ? route.title.replace(' - RASAAI', '') : part.replace('.html', '').replace(/-/g, ' '),
            path: currentPath
        });
    }

    return breadcrumbs;
}

function renderBreadcrumbs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const breadcrumbs = getBreadcrumbs();
    const isLast = breadcrumbs.length - 1;

    container.innerHTML = breadcrumbs.map((crumb, index) => {
        if (index === isLast) {
            return `<span class="breadcrumb-current">${crumb.label}</span>`;
        }
        return `<a href="${crumb.path}">${crumb.label}</a><span class="breadcrumb-separator">/</span>`;
    }).join('');
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================

function highlightActiveNav(selector = '.sidebar-link') {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(selector);

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.replace('/rasaai', ''))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function highlightMobileNav() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.mobile-nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href.replace('/rasaai', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ============================================
// SIDEBAR NAVIGATION (Based on Role)
// ============================================

function getSidebarLinks(role) {
    const links = {
        super_admin: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.admin.path },
                { icon: '👥', label: 'Users', path: '#users' },
                { icon: '📋', label: 'Campaigns', path: '#campaigns' },
                { icon: '📄', label: 'Invoices', path: ROUTES.protected.invoice.path },
                { icon: '💰', label: 'Payments', path: '#payments' }
            ]},
            { section: 'Management', items: [
                { icon: '🚗', label: 'Inventory', path: '#inventory' },
                { icon: '📍', label: 'Zones', path: '#zones' },
                { icon: '🔊', label: 'Audio Ads', path: '#audio-ads' },
                { icon: '👥', label: 'Affiliates', path: '#affiliates' }
            ]},
            { section: 'Reports', items: [
                { icon: '📈', label: 'Analytics', path: ROUTES.protected.analytics.path },
                { icon: '📝', label: 'Audit Logs', path: '#audit-logs' },
                { icon: '⚙️', label: 'Settings', path: '#settings' }
            ]}
        ],
        admin: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.admin.path },
                { icon: '📋', label: 'Campaigns', path: '#campaigns' },
                { icon: '📄', label: 'Invoices', path: ROUTES.protected.invoice.path },
                { icon: '💰', label: 'Payments', path: '#payments' }
            ]},
            { section: 'Management', items: [
                { icon: '🚗', label: 'Inventory', path: '#inventory' },
                { icon: '📍', label: 'Zones', path: '#zones' },
                { icon: '🔊', label: 'Audio Ads', path: '#audio-ads' }
            ]},
            { section: 'Reports', items: [
                { icon: '📈', label: 'Analytics', path: ROUTES.protected.analytics.path }
            ]}
        ],
        client: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.client.path },
                { icon: '➕', label: 'New Campaign', path: ROUTES.protected.campaign.path },
                { icon: '📋', label: 'My Campaigns', path: '#my-campaigns' }
            ]},
            { section: 'Finance', items: [
                { icon: '📄', label: 'Invoices', path: ROUTES.protected.invoice.path },
                { icon: '💳', label: 'Payments', path: '#payments' },
                { icon: '👛', label: 'Wallet', path: '#wallet' }
            ]},
            { section: 'Reports', items: [
                { icon: '📈', label: 'Analytics', path: ROUTES.protected.analytics.path },
                { icon: '🔗', label: 'Affiliate', path: '#affiliate' }
            ]}
        ],
        driver: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.driver.path },
                { icon: '▶️', label: 'Start Duty', path: '#duty' },
                { icon: '📋', label: 'My Tasks', path: '#tasks' }
            ]},
            { section: 'Earnings', items: [
                { icon: '💰', label: 'Earnings', path: '#earnings' },
                { icon: '📅', label: 'Attendance', path: '#attendance' }
            ]},
            { section: 'Account', items: [
                { icon: '📤', label: 'Uploads', path: '#uploads' },
                { icon: '👤', label: 'Profile', path: '#profile' }
            ]}
        ],
        affiliate: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.affiliate.path },
                { icon: '🔗', label: 'Referral Links', path: '#links' }
            ]},
            { section: 'Earnings', items: [
                { icon: '💰', label: 'Commissions', path: '#commissions' },
                { icon: '💸', label: 'Withdraw', path: '#withdraw' }
            ]},
            { section: 'Resources', items: [
                { icon: '📊', label: 'Leaderboard', path: ROUTES.public.leaderboard.path },
                { icon: '📢', label: 'Marketing Kit', path: '#marketing' }
            ]}
        ],
        sales: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.sales.path },
                { icon: '👥', label: 'Leads', path: ROUTES.protected.crm.path },
                { icon: '📋', label: 'Tasks', path: '#tasks' }
            ]},
            { section: 'Performance', items: [
                { icon: '🎯', label: 'Targets', path: '#targets' },
                { icon: '💰', label: 'Commissions', path: '#commissions' }
            ]},
            { section: 'Reports', items: [
                { icon: '📈', label: 'Analytics', path: ROUTES.protected.analytics.path }
            ]}
        ],
        passenger: [
            { section: 'Main', items: [
                { icon: '📊', label: 'Dashboard', path: ROUTES.protected.passenger.path },
                { icon: '📷', label: 'Scan QR', path: ROUTES.protected.scan.path },
                { icon: '🎁', label: 'Rewards', path: ROUTES.protected.rewards.path }
            ]},
            { section: 'Community', items: [
                { icon: '🏆', label: 'Leaderboard', path: ROUTES.public.leaderboard.path },
                { icon: '👥', label: 'Refer Friends', path: '#refer' }
            ]}
        ]
    };

    return links[role] || [];
}

function renderSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const role = getUserRole();
    const links = getSidebarLinks(role);
    const user = getCurrentUser();

    let html = `
        <div class="sidebar-brand">
            <img src="/rasaai/assets/images/logo-white.svg" alt="RASAAI" height="28">
            <span class="sidebar-brand-text">RASAAI</span>
        </div>
        
        <div class="sidebar-user">
            <div class="sidebar-user-avatar">${user?.name?.charAt(0) || 'U'}</div>
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">${user?.name || 'User'}</div>
                <div class="sidebar-user-role">${role.replace('_', ' ')}</div>
            </div>
        </div>
        
        <nav class="sidebar-nav">
    `;

    links.forEach(section => {
        html += `<div class="sidebar-section">
            <div class="sidebar-section-title">${section.section}</div>`;
        
        section.items.forEach(item => {
            html += `
                <a href="${item.path}" class="sidebar-link">
                    <span class="sidebar-link-icon">${item.icon}</span>
                    ${item.label}
                </a>`;
        });
        
        html += `</div>`;
    });

    html += `
        </nav>
        <div class="sidebar-footer">
            <a class="sidebar-footer-link" onclick="logout()">🚪 Logout</a>
        </div>
    `;

    container.innerHTML = html;
    highlightActiveNav();
}

// ============================================
// INITIALIZATION
// ============================================

function initRouter() {
    // Parse current route
    RouterState.currentPage = window.location.pathname;
    RouterState.query = getQueryParams();
    RouterState.params = getNavParams();

    // Update page title
    updatePageTitle();

    // Check page access
    if (!checkPageAccess()) return;

    // Highlight navigation
    highlightActiveNav();
    highlightMobileNav();

    // Handle back/forward browser buttons
    window.addEventListener('popstate', (event) => {
        RouterState.currentPage = window.location.pathname;
        updatePageTitle();
        checkPageAccess();
    });

    console.log(`📍 Current Page: ${RouterState.currentPage}`);
    console.log('✅ Router Module Loaded');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initRouter);

// ============================================
// GLOBAL ROUTER OBJECT
// ============================================

window.router = {
    navigateTo: navigateTo,
    navigateToDashboard: navigateToDashboard,
    navigateToLogin: navigateToLogin,
    goBack: goBack,
    getCurrentRoute: getCurrentRoute,
    getQueryParams: getQueryParams,
    getQueryParam: getQueryParam,
    getBreadcrumbs: getBreadcrumbs,
    renderBreadcrumbs: renderBreadcrumbs,
    renderSidebar: renderSidebar,
    getSidebarLinks: getSidebarLinks,
    highlightActiveNav: highlightActiveNav,
    setPageTitle: setPageTitle,
    addNavigationGuard: addNavigationGuard,
    ROUTES: ROUTES
};

console.log('✅ Router Global Object Ready');
