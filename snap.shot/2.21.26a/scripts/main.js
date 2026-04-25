// ====================================
// HYPERBABY GAMES - MAIN JAVASCRIPT
// ====================================

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // TODO: Replace with actual newsletter signup endpoint
            console.log('Newsletter signup:', email);
            
            // Show success message
            alert('Thanks for signing up! We\'ll keep you posted on new releases.');
            this.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});

// View button handlers for project cards
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectLink = this.closest('.project-card').querySelector('.project-link');
            if (projectLink) {
                window.location.href = projectLink.getAttribute('href');
            }
        });
    });
});
