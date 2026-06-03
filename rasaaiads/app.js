// ============================================
// RASAAI V2 - Main Application Controller
// ============================================

class RasaaiApp {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.currentSection = 'hero';
        this.exitIntentShown = false;
        this.init();
    }

    init() {
        this.hideLoader();
        this.setupEventListeners();
        this.buildAllComponents();
        this.setupMobileNav();
        this.setupExitIntent();
        this.setupFabMenu();
        this.startTimers();
        this.setupSmoothScroll();
        this.registerServiceWorker();
    }

    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loadingScreen');
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }
        }, 1500);
    }

    setupEventListeners() {
        // Scroll tracking
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // Resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.isMobile = window.innerWidth < 768;
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeBookingModal();
                closeExitPopup();
            }
        });
    }

    buildAllComponents() {
        componentBuilder.buildAll();
        calculatorEngine.buildEyeCalculator();
        calculatorEngine.buildROICalculator();
        dashboardEngine.startPricingTimer();
        dashboardEngine.startExitTimer();
        
        // Initialize ROI calculation
        setTimeout(() => calculatorEngine.calculateROI(), 1000);
    }

    setupMobileNav() {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Update active nav based on scroll position
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }

    setupExitIntent() {
        document.addEventListener('mouseout', (e) => {
            if (!this.exitIntentShown && e.clientY <= 0 && window.scrollY > 500) {
                this.showExitPopup();
                this.exitIntentShown = true;
                setTimeout(() => { this.exitIntentShown = false; }, 300000); // Reset after 5 min
            }
        });

        // Mobile: show after 30 seconds of scrolling
        if (this.isMobile) {
            setTimeout(() => {
                if (window.scrollY > 500 && !this.exitIntentShown) {
                    this.showExitPopup();
                    this.exitIntentShown = true;
                }
            }, 30000);
        }
    }

    showExitPopup() {
        const popup = document.getElementById('exitPopup');
        if (popup) {
            popup.classList.add('show');
        }
    }

    setupFabMenu() {
        const fab = document.getElementById('fabMain');
        const container = document.querySelector('.fab-container');
        
        if (fab && container) {
            fab.addEventListener('click', () => {
                container.classList.toggle('active');
            });

            // Close FAB when clicking outside
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    container.classList.remove('active');
                }
            });
        }
    }

    startTimers() {
        // Update live counters immediately
        dashboardEngine.startPricingTimer();
    }

    setupSmoothScroll() {
        // Handle all internal links with smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    handleScroll() {
        // Update current section
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
                this.currentSection = section.getAttribute('id');
            }
        });

        // Show/hide sticky bar based on scroll
        const stickyBar = document.querySelector('.sticky-mobile-bar');
        if (stickyBar) {
            if (window.scrollY > 300) {
                stickyBar.style.display = 'flex';
            } else {
                stickyBar.style.display = 'none';
            }
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/rasaaiads/sw.js');
                console.log('ServiceWorker registered');
            } catch (error) {
                console.log('ServiceWorker registration failed:', error);
            }
        }
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Global functions for HTML onclick handlers
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
}

function closeExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.remove('show');
}

function handleBookingSubmit(event) {
    event.preventDefault();
    alert('✅ Thank you! We will call you at +91 95943 06625 within 5 minutes.');
    closeBookingModal();
    
    // In production: Send form data to backend API
    const formData = new FormData(event.target);
    console.log('Booking submitted:', Object.fromEntries(formData));
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rasaaiApp = new RasaaiApp();
});

// Handle mobile install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 2 minutes
    setTimeout(() => {
        if (deferredPrompt && window.scrollY > 1000) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                deferredPrompt = null;
            });
        }
    }, 120000);
});
