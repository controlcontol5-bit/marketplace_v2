// Mock Database
const products = [
    {
        id: 1,
        name: "Quantum Ultra Laptop",
        price: 15500000,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format",
        badge: "Hot Deal"
    },
    {
        id: 2,
        name: "Nova Smartwatch Pro",
        price: 2499000,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format",
        badge: "Low Commission"
    },
    {
        id: 3,
        name: "Urban Explorer Jacket",
        price: 850000,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&auto=format",
        badge: "Best Seller"
    },
    {
        id: 4,
        name: "Sonic Bass Headphones",
        price: 1200000,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format",
        badge: "Sale"
    },
    {
        id: 5,
        name: "Minimalist Leather Wallet",
        price: 350000,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format",
        badge: "New"
    },
    {
        id: 6,
        name: "Aero Gaming Mouse",
        price: 750000,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500&auto=format",
        badge: "Low Commission"
    }
];

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    initCart();
});

// Render Products Function
function renderProducts(items) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card glass animate-fade';
        
        const badgeHTML = product.badge ? `<span class="badge ${product.badge === 'Low Commission' ? 'badge-low-comm' : 'badge-primary'}" style="background: var(--primary); color: #000;">${product.badge}</span>` : '';

        card.innerHTML = `
            ${badgeHTML}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info" style="padding: 0 15px 15px;">
                <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 5px;">${product.category}</p>
                <h3>${product.name}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="product-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    <button class="btn btn-outline" onclick="addToCart(${product.id})" style="padding: 8px 12px;">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Simple Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Simple Toast notification
    showToast(`${product.name} ditambahkan ke keranjang!`);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = cart.length;
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'glass';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid var(--primary);
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
