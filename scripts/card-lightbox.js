/* ====================================
   CARD LIGHTBOX - CLICK TO ZOOM
   Opens full-screen modal for card viewing
   FIXED: Only navigates within active category
   ==================================== */

(function() {
    let currentImageIndex = 0;
    let allImages = [];
    let lightbox = null;
    let lightboxImage = null;
    let lightboxTitle = null;
    let lightboxCounter = null;

    // Initialize lightbox
    function initLightbox() {
        // Create lightbox HTML if it doesn't exist
        if (!document.querySelector('.card-lightbox')) {
            const lightboxHTML = `
                <div class="card-lightbox" id="cardLightbox">
                    <div class="lightbox-content">
                        <button class="lightbox-close" id="closeLightbox" aria-label="Close">&times;</button>
                        
                        <button class="lightbox-nav prev" id="prevCard" aria-label="Previous card">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        
                        <img src="" alt="" class="lightbox-image" id="lightboxImage">
                        
                        <button class="lightbox-nav next" id="nextCard" aria-label="Next card">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        
                        <div class="lightbox-title" id="lightboxTitle"></div>
                        <div class="lightbox-counter" id="lightboxCounter"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        // Get elements
        lightbox = document.getElementById('cardLightbox');
        lightboxImage = document.getElementById('lightboxImage');
        lightboxTitle = document.getElementById('lightboxTitle');
        lightboxCounter = document.getElementById('lightboxCounter');

        // Attach event listeners
        attachLightboxEvents();
        
        // Attach click handlers to all card images
        attachCardClickHandlers();
    }

    // Get images from ONLY the currently active deck category
    function getActiveImages() {
        // Find the active deck container
        const activeDeck = document.querySelector('.deck-cards.active');
        
        if (!activeDeck) {
            // Fallback: get all visible images
            return Array.from(document.querySelectorAll('.deck-cards img'));
        }
        
        // Get only images from the active deck, excluding hidden/unrevealed cards
        return Array.from(activeDeck.querySelectorAll('.card-item:not(.card-hidden) img'));
    }

    // Attach click handlers to card images
    function attachCardClickHandlers() {
        const cardImages = document.querySelectorAll('.deck-cards .card-item img');
        
        cardImages.forEach(img => {
            img.style.cursor = 'pointer';
            
            // Remove old listener if exists
            img.removeEventListener('click', handleCardClick);
            
            // Add new listener
            img.addEventListener('click', handleCardClick);
        });
    }

    // Handle card image click
    function handleCardClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedImage = e.target;
        
        // Don't open lightbox for hidden/unrevealed cards
        if (clickedImage.closest('.card-item') && clickedImage.closest('.card-item').classList.contains('card-hidden')) {
            return;
        }
        
        // Get images from ONLY the active category
        allImages = getActiveImages();
        
        // Find index of clicked image within active category
        currentImageIndex = allImages.findIndex(img => img.src === clickedImage.src);
        
        if (currentImageIndex === -1) {
            currentImageIndex = 0;
        }
        
        openLightbox(currentImageIndex);
    }

    // Open lightbox
    function openLightbox(index) {
        if (!lightbox || allImages.length === 0) return;
        
        currentImageIndex = index;
        const img = allImages[currentImageIndex];
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = img.alt;
        
        updateImageCounter();
        
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Preload adjacent images
        preloadAdjacentImages();
    }

    // Close lightbox
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    // Navigate to previous image
    function prevImage() {
        if (allImages.length === 0) return;
        
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function nextImage() {
        if (allImages.length === 0) return;
        
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        updateLightboxImage();
    }

    // Update lightbox image
    function updateLightboxImage() {
        if (!lightboxImage || allImages.length === 0) return;
        
        const img = allImages[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = img.alt;
        
        updateImageCounter();
        preloadAdjacentImages();
    }

    // Update image counter
    function updateImageCounter() {
        if (!lightboxCounter) return;
        
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${allImages.length}`;
    }

    // Preload adjacent images for smooth navigation
    function preloadAdjacentImages() {
        if (allImages.length === 0) return;
        
        const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        const nextIndex = (currentImageIndex + 1) % allImages.length;
        
        const prevImg = new Image();
        prevImg.src = allImages[prevIndex].src;
        
        const nextImg = new Image();
        nextImg.src = allImages[nextIndex].src;
    }

    // Attach all lightbox event listeners
    function attachLightboxEvents() {
        if (!lightbox) return;
        
        // Close button
        const closeBtn = document.getElementById('closeLightbox');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // Previous button
        const prevBtn = document.getElementById('prevCard');
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevImage();
            });
        }
        
        // Next button
        const nextBtn = document.getElementById('nextCard');
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextImage();
            });
        }
        
        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next image
                nextImage();
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous image
                prevImage();
            }
        }
    }

    // Re-initialize when tab is switched
    function reinitializeOnTabSwitch() {
        const deckTabs = document.querySelectorAll('.deck-tab');
        
        deckTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Wait for tab switch animation to complete
                setTimeout(() => {
                    attachCardClickHandlers();
                }, 100);
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLightbox();
            reinitializeOnTabSwitch();
        });
    } else {
        initLightbox();
        reinitializeOnTabSwitch();
    }
})();
