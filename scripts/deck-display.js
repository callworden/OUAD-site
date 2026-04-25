// ====================================
// DECK DISPLAY - TAB SWITCHING
// Handles category switching for card display
// Updated to prevent any automatic page scrolling on load
// ====================================

document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.deck-tab');
    const cardContainers = document.querySelectorAll('.deck-cards');
    const deckSection = document.querySelector('.whats-in-deck');

    if (tabs.length === 0 || cardContainers.length === 0) {
        console.log('Deck display not found on this page');
        return;
    }

    console.log(`Deck display initialized: ${tabs.length} categories, ${cardContainers.length} containers`);

    function getCategoryName(tab) {
        return tab.getAttribute('data-category') || tab.getAttribute('data-guild');
    }

    function switchToCategory(categoryName, clickedTab) {
        console.log(`Switching to: ${categoryName}`);

        tabs.forEach(t => t.classList.remove('active'));
        cardContainers.forEach(container => container.classList.remove('active'));

        if (clickedTab) {
            clickedTab.classList.add('active');
        }

        const targetContainer = document.getElementById(`${categoryName}-cards`);

        if (targetContainer) {
            targetContainer.classList.add('active');
            console.log(`Showing container: ${targetContainer.id}`);
        } else {
            console.error(`Container not found: ${categoryName}-cards`);
            console.log('Available containers:', Array.from(cardContainers).map(c => c.id));
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const categoryName = getCategoryName(this);

            console.log(`Tab clicked: ${categoryName}`);

            if (categoryName) {
                switchToCategory(categoryName, this);
                viewedCategories.add(categoryName);
                console.log(`Viewed categories: ${Array.from(viewedCategories).join(', ')}`);
                setTimeout(() => preloadNextCategory(categoryName), 500);
            } else {
                console.error('Tab missing data-category or data-guild attribute');
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        const activeElement = document.activeElement;
        const typingIntoField = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );

        if (typingIntoField) {
            return;
        }

        if (deckSection) {
            const rect = deckSection.getBoundingClientRect();
            const deckIsNearViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (!deckIsNearViewport) {
                return;
            }
        }

        const activeTabIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));

        if (e.key === 'ArrowRight' && activeTabIndex < tabs.length - 1) {
            tabs[activeTabIndex + 1].click();
        } else if (e.key === 'ArrowLeft' && activeTabIndex > 0) {
            tabs[activeTabIndex - 1].click();
        }
    });

    const viewedCategories = new Set();

    const initialTab = document.querySelector('.deck-tab.active');
    if (initialTab) {
        const initialCategory = getCategoryName(initialTab);
        if (initialCategory) {
            viewedCategories.add(initialCategory);
        }
    }

    function preloadNextCategory(currentCategory) {
        const currentIndex = Array.from(tabs).findIndex(
            tab => getCategoryName(tab) === currentCategory
        );

        if (currentIndex < 0 || currentIndex >= tabs.length - 1) {
            return;
        }

        const nextCategory = getCategoryName(tabs[currentIndex + 1]);
        const nextContainer = document.getElementById(`${nextCategory}-cards`);

        if (!nextContainer) {
            return;
        }

        const images = nextContainer.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const preloadImg = new Image();
                preloadImg.src = src;
            }
        });
    }

    console.log('Deck display ready');
    console.log(`Available categories: ${Array.from(tabs).map(getCategoryName).join(', ')}`);
});
