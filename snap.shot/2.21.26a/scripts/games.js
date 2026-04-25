// ====================================
// GAMES PAGE JAVASCRIPT
// Filtering and Sorting
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const gamesGrid = document.getElementById('gamesGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const gameCards = document.querySelectorAll('.game-card');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter game cards
            gameCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const categories = card.getAttribute('data-categories');
                    if (categories && categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // Sort functionality
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const cardsArray = Array.from(gameCards);

        cardsArray.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);

                case 'players':
                    const playersA = parseInt(a.getAttribute('data-players').split('-')[0]);
                    const playersB = parseInt(b.getAttribute('data-players').split('-')[0]);
                    return playersA - playersB;

                case 'playtime':
                    const timeA = parseInt(a.getAttribute('data-playtime'));
                    const timeB = parseInt(b.getAttribute('data-playtime'));
                    return timeA - timeB;

                default: // featured
                    // Keep original order
                    return 0;
            }
        });

        // Re-append cards in sorted order
        cardsArray.forEach(card => {
            gamesGrid.appendChild(card);
        });
    });

    // Add smooth scroll to "Learn More" buttons
    document.querySelectorAll('a[href^="/games/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow normal navigation
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe game cards for animation
    gameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
