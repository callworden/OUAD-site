// ====================================
// IMAGE GALLERY FUNCTIONALITY
// For game detail pages
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Gallery elements
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    if (!mainImage || thumbnails.length === 0) {
        console.log('Gallery not found on this page');
        return;
    }
    
    let currentIndex = 0;
    const totalImages = thumbnails.length;
    
    // ========================================
    // THUMBNAIL CLICK HANDLER
    // ========================================
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            changeImage(index);
        });
    });
    
    // ========================================
    // NAVIGATION BUTTONS
    // ========================================
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            changeImage(currentIndex);
            updateImageCounter();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalImages;
            changeImage(currentIndex);
            updateImageCounter();
        });
    }
    
    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            changeImage(currentIndex);
            updateImageCounter();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalImages;
            changeImage(currentIndex);
            updateImageCounter();
        }
    });
    
    // ========================================
    // TOUCH SWIPE SUPPORT (Mobile)
    // ========================================
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const imageContainer = document.querySelector('.main-image-container');
    
    if (imageContainer) {
        imageContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        imageContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                currentIndex = (currentIndex + 1) % totalImages;
                changeImage(currentIndex);
                updateImageCounter();
            } else {
                // Swipe right - previous image
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                changeImage(currentIndex);
                updateImageCounter();
            }
        }
    }
    
    // ========================================
    // CHANGE IMAGE FUNCTION
    // ========================================
    
    function changeImage(index) {
        currentIndex = index;
        
        // Get new image data
        const newImageSrc = thumbnails[index].getAttribute('data-image');
        const newImageAlt = thumbnails[index].getAttribute('data-alt');
        
        // Add fade effect
        mainImage.classList.add('loading');
        
        // Change image after brief delay for effect
        setTimeout(function() {
            mainImage.src = newImageSrc;
            mainImage.alt = newImageAlt;
            
            // Remove loading, add fade-in
            mainImage.classList.remove('loading');
            mainImage.classList.add('fade-in');
            
            // Remove fade-in class after animation
            setTimeout(function() {
                mainImage.classList.remove('fade-in');
            }, 300);
        }, 150);
        
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        
        // Update image counter
        updateImageCounter();
        
        // Scroll thumbnail into view
        thumbnails[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
    
    // ========================================
    // LAZY LOADING FOR THUMBNAILS
    // ========================================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Observe thumbnail images
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ========================================
    // PRELOAD NEXT/PREV IMAGES
    // ========================================
    
    function preloadAdjacentImages() {
        const nextIndex = (currentIndex + 1) % totalImages;
        const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        
        // Preload next image
        const nextImg = new Image();
        nextImg.src = thumbnails[nextIndex].getAttribute('data-image');
        
        // Preload previous image
        const prevImg = new Image();
        prevImg.src = thumbnails[prevIndex].getAttribute('data-image');
    }
    
    // Preload adjacent images on load and after each change
    preloadAdjacentImages();
    
    // ========================================
    // IMAGE COUNTER (Optional)
    // ========================================
    
    function updateImageCounter() {
        const counter = document.querySelector('.image-counter');
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${totalImages}`;
            console.log(`Counter updated: ${currentIndex + 1} / ${totalImages}`);
        } else {
            console.log('Counter element not found');
        }
    }
    
    // Initialize counter on page load
    updateImageCounter();
    
    // ========================================
    // LOGGING (Remove in production)
    // ========================================
    
    console.log(`Gallery initialized with ${totalImages} images`);
    
});
