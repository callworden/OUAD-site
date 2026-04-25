// ====================================
// CONTACT FORM JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // TODO: Replace with your actual form handling endpoint
        // Options: FormSpree, Netlify Forms, your own backend, etc.
        
        console.log('Form submitted:', formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
    });
});

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = '✓ Message sent successfully! We\'ll get back to you within 24-48 hours.';
    
    // Insert before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// Form validation enhancement (optional)
document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.checkValidity()) {
            this.style.borderColor = 'var(--border-subtle)';
        } else {
            this.style.borderColor = 'var(--accent-red)';
        }
    });
});
