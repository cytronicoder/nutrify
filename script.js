document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    const navLinksElements = document.querySelectorAll('.nav-link[href^="#"]');
    navLinksElements.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (navLinks.classList.contains('mobile-open')) {
                    navLinks.classList.remove('mobile-open');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.persona-card, .feature-card, .privacy-features li');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    const stats = document.querySelectorAll('.stat-number');
    const animateCounter = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (suffix === 'min') {
                element.textContent = Math.floor(current) + '-' + (Math.floor(current) + 5) + suffix;
            } else if (suffix === '$') {
                element.textContent = suffix + Math.floor(current) + '-' + (Math.floor(current) + 2);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    };

    const heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach((stat, index) => {
                    const text = stat.textContent;
                    if (text.includes('$')) {
                        animateCounter(stat, 2, '$');
                    } else if (text.includes('min')) {
                        animateCounter(stat, 5, 'min');
                    } else if (text.includes('6')) {
                        animateCounter(stat, 6, '');
                    }
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });

    const personaCards = document.querySelectorAll('.persona-card');
    personaCards.forEach(card => {
        card.addEventListener('click', function () {
            this.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });

    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        document.addEventListener('mousemove', function (e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const tiltX = (mouseY - 0.5) * 10;
            const tiltY = (mouseX - 0.5) * -10;

            phoneMockup.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(-5deg)`;
        });

        phoneMockup.addEventListener('mouseleave', function () {
            this.style.transform = 'rotate(-5deg)';
        });
    }

    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

            if (this.textContent.includes('Get the App')) {
                showNotification('App download will be available soon! 📱');
            } else if (this.textContent.includes('See How It Works')) {
                showNotification('Demo video coming soon! 🎥');
            }
        });
    });

    const downloadButtons = document.querySelectorAll('.download-button');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            if (this.classList.contains('android')) {
                showNotification('Android app will be available on Google Play Store! 🤖');
            } else if (this.classList.contains('ios')) {
                showNotification('iOS version coming soon to App Store! 📱');
            }
        });
    });

    function showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    const privacyShield = document.querySelector('.privacy-shield');
    if (privacyShield) {
        const shieldObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'pulse 2s ease-in-out infinite';
                } else {
                    entry.target.style.animation = '';
                }
            });
        }, { threshold: 0.5 });

        shieldObserver.observe(privacyShield);
    }

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', function (e) {
        konamiCode.push(e.code);

        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.length === konamiSequence.length &&
            konamiCode.every((code, index) => code === konamiSequence[index])) {

            document.body.style.filter = 'sepia(1) hue-rotate(45deg) saturate(2)';
            showNotification('🍊 Orange mode activated! Refresh to return to normal.');

            setTimeout(() => {
                document.body.style.filter = '';
            }, 5000);

            konamiCode = [];
        }
    });

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedScrollHandler = debounce(function () {
        // Any scroll-dependent functionality can go here
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    console.log('🍊 Nutrify landing page loaded successfully!');
    console.log('Built for workers, by workers.');
});

const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-links.mobile-open {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        border-radius: 0 0 1rem 1rem;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(15px);
        box-shadow: var(--shadow-sm);
    }
    
    .header.hidden {
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .persona-card, .feature-card, .privacy-features li {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

const phone3DContainer = document.querySelector('.phone-3d-container');
const phoneMockup = document.querySelector('.phone-mockup');

if (phone3DContainer && phoneMockup) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        let isMouseOverPhone = false;

        phone3DContainer.addEventListener('mouseenter', () => {
            isMouseOverPhone = true;
        });

        phone3DContainer.addEventListener('mouseleave', () => {
            isMouseOverPhone = false;
            phoneMockup.style.transform = 'rotateX(15deg) rotateY(-25deg) rotateZ(-8deg) translateZ(50px)';
        });

        phone3DContainer.addEventListener('mousemove', (e) => {
            if (!isMouseOverPhone) return;

            const rect = phone3DContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateY = (mouseX / rect.width) * 20 - 25;
            const rotateX = -(mouseY / rect.height) * 15 + 15;

            requestAnimationFrame(() => {
                phoneMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(-8deg) translateZ(60px)`;
            });
        });
    }

    const phoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                phoneMockup.style.animation = 'phoneEntrance 1.2s ease-out';
            }
        });
    }, { threshold: 0.5 });

    phoneObserver.observe(phone3DContainer);
}