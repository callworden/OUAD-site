// ====================================
// HOMEPAGE ANIMATIONS - JAVASCRIPT
// Scroll reveals, parallax, and interactions
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    
    // ========================================
    // CARD TILT EFFECT (Mouse Following)
    // ========================================
    
    const cards = document.querySelectorAll('.card-tilt');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
    
    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
    
    
    // ========================================
    // PARALLAX EFFECT FOR FLOATING ELEMENTS
    // ========================================
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    
    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    
    // ========================================
    // CARD HOVER GLOW FOLLOWS MOUSE
    // ========================================
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 0, 85, 0.3), transparent 50%)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = '';
            }
        });
    });
    
    
    // ========================================
    // SMOOTH SCROLL TO NEWSLETTER
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
    // ========================================
    // LAZY LOAD IMAGES (Performance Boost)
    // ========================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    
    // ========================================
    // PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
    // ========================================
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.floating-element').forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    
    // ========================================
    // EASTER EGG: KONAMI CODE
    // ========================================
    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function triggerEasterEgg() {
        // Add rainbow effect to all cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'rainbow 2s ease-in-out';
            }, index * 200);
        });
        
        // Add confetti
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
    }
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.textContent = ['🎲', '🃏', '✨', '🎮', '🎯'][Math.floor(Math.random() * 5)];
        confetti.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}vw;
            font-size: 2rem;
            pointer-events: none;
            animation: fall ${3 + Math.random() * 2}s linear;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add fall animation
    const fallStyle = document.createElement('style');
    fallStyle.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        @keyframes rainbow {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(fallStyle);
    
});

console.log('🎮 Hyperbaby Games - Homepage animations loaded!');
console.log('💡 Tip: Try the Konami Code for a surprise! ↑↑↓↓←→←→BA');
