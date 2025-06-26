// OPTIMA Project Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when mobile menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;
        
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                if (sectionId === activeSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Contact form submission
    const contactForm = document.getElementById('inquiryForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = document.getElementById('name').value.trim();
            const organization = document.getElementById('organization').value.trim();
            const email = document.getElementById('email').value.trim();
            const inquiryType = document.getElementById('inquiry-type').value;
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (!name || !organization || !email || !inquiryType || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            if (message.length < 10) {
                showNotification('Please provide a more detailed message.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your inquiry! Prof. Ashish Bhaskar will get back to you soon.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const iconMap = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${iconMap[type] || iconMap.info}</span>
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${getNotificationColor(type)};
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        const content = notification.querySelector('.notification__content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
        `;
        
        const icon = notification.querySelector('.notification__icon');
        icon.style.cssText = `
            font-size: 18px;
            flex-shrink: 0;
        `;
        
        const messageSpan = notification.querySelector('.notification__message');
        messageSpan.style.cssText = `
            flex: 1;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('results-grid') || 
                    entry.target.classList.contains('impact-metrics') ||
                    entry.target.classList.contains('parameter-grid') ||
                    entry.target.classList.contains('recommendations-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.transform = 'translateY(0)';
                            child.style.opacity = '1';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.phase-section, .finding-card, .metric-card, .partner-card, .impact-item, .results-grid, .impact-metrics, .parameter-grid, .recommendations-grid, .parameter-card, .recommendation-card'
    );
    animateElements.forEach(el => {
        observer.observe(el);
        
        // Set initial state for animated elements
        if (el.classList.contains('results-grid') || 
            el.classList.contains('impact-metrics') ||
            el.classList.contains('parameter-grid') ||
            el.classList.contains('recommendations-grid')) {
            const children = el.children;
            Array.from(children).forEach(child => {
                child.style.transform = 'translateY(30px)';
                child.style.opacity = '0';
                child.style.transition = 'all 0.6s ease';
            });
        }
    });

    // Parallax effect for hero background
    function updateParallax() {
        const heroBackground = document.querySelector('.hero-background-image');
        if (heroBackground) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }

    // Hero stats counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .metric-value, .impact-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumeric = /^\d+/.test(target);
            
            if (isNumeric) {
                const targetNum = parseInt(target);
                let current = 0;
                const increment = targetNum / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        counter.textContent = target; // Restore original text
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + target.replace(/^\d+/, '');
                    }
                }, 30);
            }
        });
    }

    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsElements = document.querySelectorAll('.hero-stats, .impact-metrics, .impact-grid');
    statsElements.forEach(el => statsObserver.observe(el));

    // Enhanced scroll effects
    let ticking = false;
    
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                updateNavbarBackground();
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Image loading enhancement
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading animation
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';

                // This function will handle making the image visible
                const showImage = () => {
                    img.style.opacity = '1';
                };

                // Check if the image is already loaded (from cache)
                if (img.complete) {
                    // If so, show it immediately
                    showImage();
                } else {
                    // Otherwise, add the listener to show it when it's done
                    img.addEventListener('load', showImage);
                }

                // Handle image load errors with placeholder
                img.addEventListener('error', function() {
                    this.style.opacity = '0.5';
                    this.style.filter = 'grayscale(100%)';
                    this.style.background = '#f0f0f0';
                });
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Enhanced figure containers hover effects
    const figureContainers = document.querySelectorAll('.figure-container');
    figureContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Scroll event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize event listener
    window.addEventListener('resize', function() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Recalculate active nav on resize
        updateActiveNav();
    });

    // Initialize on load
    updateActiveNav();
    updateNavbarBackground();

    // Keyboard navigation accessibility
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
            
            // Close notifications with Escape
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                hideNotification(notification);
            });
        }
        
        // Navigate with arrow keys in mobile menu
        if (navMenu.classList.contains('active')) {
            const links = Array.from(navMenu.querySelectorAll('.nav-link'));
            const currentIndex = links.findIndex(link => link === document.activeElement);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % links.length;
                links[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + links.length) % links.length;
                links[prevIndex].focus();
            }
        }
    });

    // Focus management for accessibility
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Enhanced focus indicators
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });

    // Form validation enhancements
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        // Real-time validation feedback
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Message length validation
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide a more detailed message (at least 10 characters).';
        }
        
        // Update field appearance
        if (!isValid) {
            field.classList.add('error');
            showFieldError(field, errorMessage);
        } else {
            field.classList.remove('error');
            removeFieldError(field);
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        removeFieldError(field); // Remove existing error
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
            display: block;
        `;
        
        field.parentNode.appendChild(errorElement);
        
        // Add error styles to field
        field.style.borderColor = '#ef4444';
    }

    function removeFieldError(field) {
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        field.style.borderColor = '';
    }

    // Analytics tracking (placeholder for future implementation)
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        console.log('Event tracked:', { category, action, label });
    }

    // Track important interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('Button Click', buttonText, window.location.pathname);
        });
    });

    // Track form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('Form', 'Submit', 'Contact Inquiry');
        });
    }

    // Track section views
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId) {
                    trackEvent('Section View', sectionId, window.location.pathname);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    // Print functionality
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });

    // Theme detection and handling
    function handleColorSchemeChange(e) {
        if (e.matches) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
        }
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', handleColorSchemeChange);
    handleColorSchemeChange(darkModeQuery);

    // Page visibility API for performance optimization
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is not visible
            document.body.classList.add('page-hidden');
        } else {
            // Resume animations when page becomes visible
            document.body.classList.remove('page-hidden');
        }
    });

    // Console message for developers
    console.log('🚀 OPTIMA Project Website Loaded Successfully!');
    console.log('📊 Advanced motorway control algorithms research');
    console.log('🎓 Led by Queensland University of Technology');
    console.log('🤝 Partners: TMR & Transmax | Funded by: iMOVE CRC');
    console.log('📧 Contact: Prof. Ashish Bhaskar - ashish.bhaskar@qut.edu.au');
    console.log('🔍 Enhanced Sensitivity Analysis Section Now Available!');
    
    // Performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
            
            // Track performance if analytics is available
            trackEvent('Performance', 'Page Load Time', Math.round(loadTime / 100) * 100);
        }
    });

    // Service worker registration (for future PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Placeholder for service worker registration
            console.log('🔧 Service Worker support detected');
        });
    }
});