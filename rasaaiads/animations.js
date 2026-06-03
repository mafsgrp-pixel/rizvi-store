// ============================================
// RASAAI V2 - Animation Engine
// ============================================

class AnimationEngine {
    constructor() {
        this.observers = [];
        this.animations = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupParticles();
        this.setupRippleEffect();
    }

    // Scroll-triggered animations using Intersection Observer
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.fade-up, .fade-in, .slide-left, .slide-right, .scale-in, .card, .problem-card, .step-card, .zone-card, .pricing-card'
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        this.playElementAnimation(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        animatedElements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    playElementAnimation(element) {
        // Stagger children
        const children = element.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 100}ms`;
            child.classList.add('animated');
        });

        // Card hover effects
        if (element.classList.contains('card') || 
            element.classList.contains('pricing-card') ||
            element.classList.contains('zone-card')) {
            this.addCardHoverEffect(element);
        }
    }

    addCardHoverEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }

    // Number rolling counters
    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out quad
            const easedProgress = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            
            element.textContent = this.formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    formatNumber(num) {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(1) + 'M+';
        } else if (num >= 100000) {
            return (num / 100000).toFixed(1) + 'L';
        } else if (num >= 1000) {
            return num.toLocaleString('en-IN');
        }
        return num.toString();
    }

    // Hero particles
    setupParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: ${Math.random() > 0.5 ? 'rgba(0,200,83,0.6)' : 'rgba(255,255,255,0.4)'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            container.appendChild(particle);
        }
    }

    // Ripple effect on buttons
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn-primary, .btn-secondary, .btn-whatsapp, .ripple');
            if (!target) return;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            target.style.position = target.style.position || 'relative';
            target.style.overflow = 'hidden';
            target.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    // Live counter animation
    animateLiveCounter(elementId, targetValue, prefix = '', suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentText = element.textContent.replace(/[^0-9]/g, '');
        const current = parseInt(currentText) || 0;
        
        if (current === targetValue) return;

        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            const value = Math.floor(current + (targetValue - current) * eased);
            
            element.textContent = `${prefix}${this.formatNumber(value)}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    // Pulse animation trigger
    pulse(element, duration = 500) {
        element.classList.add('pulse-animation');
        setTimeout(() => element.classList.remove('pulse-animation'), duration);
    }

    // Shake animation
    shake(element, duration = 500) {
        element.classList.add('shake-animation');
        setTimeout(() => element.classList.remove('shake-animation'), duration);
    }

    // Slide in notification
    showNotification(message, duration = 4000) {
        const widget = document.getElementById('notificationWidget');
        const text = document.getElementById('notificationText');
        if (!widget || !text) return;

        text.textContent = message;
        widget.classList.add('show');

        setTimeout(() => {
            widget.classList.remove('show');
        }, duration);
    }

    // Scroll to section smoothly
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Stagger list animation
    staggerList(container, itemSelector, delay = 100) {
        const items = container.querySelectorAll(itemSelector);
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.5s ease ${index * delay}ms`;
            
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize animation engine
const animationEngine = new AnimationEngine();

// Particle float keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes particleFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
    }
    
    @keyframes ripple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(4); opacity: 0; }
    }
    
    .shake-animation {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .fade-up { opacity: 0; transform: translateY(40px); transition: all 0.6s ease; }
    .fade-up.animated { opacity: 1; transform: translateY(0); }
    
    .slide-left { opacity: 0; transform: translateX(-40px); transition: all 0.6s ease; }
    .slide-left.animated { opacity: 1; transform: translateX(0); }
    
    .slide-right { opacity: 0; transform: translateX(40px); transition: all 0.6s ease; }
    .slide-right.animated { opacity: 1; transform: translateX(0); }
    
    .scale-in { opacity: 0; transform: scale(0.9); transition: all 0.6s ease; }
    .scale-in.animated { opacity: 1; transform: scale(1); }
`;
document.head.appendChild(styleSheet);
