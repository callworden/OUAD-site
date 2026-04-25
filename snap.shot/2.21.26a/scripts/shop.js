// ====================================
// SHOP JAVASCRIPT - Shopping Cart
// ====================================

let cart = [];

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('hyperbaby-cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('hyperbaby-cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(id, name, price) {
    // Check if item already in cart
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showCartNotification(name);
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update items list
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                ${item.quantity > 1 ? `<div class="cart-item-quantity">Qty: ${item.quantity}</div>` : ''}
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total}`;
}

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Show notification when item added
function showCartNotification(itemName) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-red);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `✓ ${itemName} added to cart`;
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Checkout (placeholder - integrate with your payment processor)
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // TODO: Integrate with Stripe, PayPal, or your payment processor
    alert('Checkout functionality coming soon! This will integrate with Stripe for secure payments.');
    console.log('Cart contents:', cart);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Add click handlers to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
        });
    });
    
    // Check for URL parameters (e.g., /shop.html?game=blood-moon-rising)
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game');
    
    if (gameParam) {
        // Scroll to that product
        const productCard = document.querySelector(`[data-id="${gameParam}"]`);
        if (productCard) {
            productCard.closest('.product-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.closest('.product-card').style.outline = '2px solid var(--accent-red)';
            setTimeout(() => {
                productCard.closest('.product-card').style.outline = '';
            }, 2000);
        }
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
