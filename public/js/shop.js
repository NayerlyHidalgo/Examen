// JavaScript para la tienda - Tattoo Shop
// Funcionalidad del carrito de compras y búsqueda

class TattooShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('tattoo-cart')) || [];
        this.init();
    }

    init() {
        console.log('🛒 Inicializando Tattoo Shop');
        this.setupEventListeners();
        this.updateCartBadge();
        this.setupSearch();
        this.setupFilters();
        this.setupProductCards();
    }

    setupEventListeners() {
        // Búsqueda
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        
        if (searchButton) {
            searchButton.addEventListener('click', () => this.performSearch());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Filtro de categorías
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterByCategory());
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Debounce para búsqueda en tiempo real
            let timeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.performSearch();
                }, 500);
            });
        }
    }

    setupFilters() {
        // Configurar filtros adicionales si es necesario
        console.log('🔍 Filtros configurados');
    }

    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) {
            const searchTerm = searchInput.value.trim();
            const category = categoryFilter ? categoryFilter.value : '';
            
            // Construir URL con parámetros
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (category) params.set('category', category);
            
            const url = '/shop' + (params.toString() ? '?' + params.toString() : '');
            window.location.href = url;
        }
    }

    filterByCategory() {
        const categoryFilter = document.getElementById('categoryFilter');
        const searchInput = document.getElementById('searchInput');
        
        if (categoryFilter) {
            const category = categoryFilter.value;
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            
            // Construir URL con parámetros
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (category) params.set('category', category);
            
            const url = '/shop' + (params.toString() ? '?' + params.toString() : '');
            window.location.href = url;
        }
    }

    // Carrito de compras
    addToCart(productId, quantity = 1) {
        console.log(`🛒 Agregando producto ${productId} al carrito`);
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Producto agregado al carrito', 'success');
    }

    removeFromCart(productId) {
        console.log(`🗑️ Eliminando producto ${productId} del carrito`);
        
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Producto eliminado del carrito', 'info');
    }

    updateCartQuantity(productId, quantity) {
        console.log(`🔄 Actualizando cantidad del producto ${productId}`);
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartBadge();
            }
        }
    }

    clearCart() {
        console.log('🧹 Vaciando carrito');
        this.cart = [];
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Carrito vaciado', 'info');
    }

    saveCart() {
        localStorage.setItem('tattoo-cart', JSON.stringify(this.cart));
    }

    updateCartBadge() {
        const cartBadge = document.querySelector('.navbar .badge');
        if (cartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            
            if (totalItems > 0) {
                cartBadge.style.display = 'inline-block';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }

    getCart() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Notificaciones
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    // Wishlist (Lista de deseos)
    addToWishlist(productId) {
        console.log(`❤️ Agregando producto ${productId} a la lista de deseos`);
        
        let wishlist = JSON.parse(localStorage.getItem('tattoo-wishlist')) || [];
        
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem('tattoo-wishlist', JSON.stringify(wishlist));
            this.showNotification('Producto agregado a la lista de deseos', 'success');
        } else {
            this.showNotification('El producto ya está en la lista de deseos', 'info');
        }
    }

    removeFromWishlist(productId) {
        console.log(`💔 Eliminando producto ${productId} de la lista de deseos`);
        
        let wishlist = JSON.parse(localStorage.getItem('tattoo-wishlist')) || [];
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('tattoo-wishlist', JSON.stringify(wishlist));
        this.showNotification('Producto eliminado de la lista de deseos', 'info');
    }

    // Comparación de productos
    addToCompare(productId) {
        console.log(`🔍 Agregando producto ${productId} a comparación`);
        
        let compareList = JSON.parse(localStorage.getItem('tattoo-compare')) || [];
        
        if (compareList.length >= 4) {
            this.showNotification('Máximo 4 productos para comparar', 'warning');
            return;
        }
        
        if (!compareList.includes(productId)) {
            compareList.push(productId);
            localStorage.setItem('tattoo-compare', JSON.stringify(compareList));
            this.showNotification('Producto agregado a comparación', 'success');
        } else {
            this.showNotification('El producto ya está en comparación', 'info');
        }
    }

    // Funciones de utilidad
    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Funciones globales para usar en los templates
function addToCart(productId, quantity = 1) {
    if (window.tattooShop) {
        window.tattooShop.addToCart(productId, quantity);
    }
}

function addToWishlist(productId) {
    if (window.tattooShop) {
        window.tattooShop.addToWishlist(productId);
    }
}

function addToCompare(productId) {
    if (window.tattooShop) {
        window.tattooShop.addToCompare(productId);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tattooShop = new TattooShop();
    
    // Agregar animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

console.log('🛒 Tattoo Shop JS cargado correctamente');
