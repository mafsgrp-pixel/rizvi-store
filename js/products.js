// Product data (loaded from JSON file)
let productsData = [];

// Fetch products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        productsData = data.products;
        initializeProductDisplay();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to hardcoded products if JSON fails to load
        productsData = getFallbackProducts();
        initializeProductDisplay();
    }
}

// Fallback products in case JSON fails to load
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Classic Black Abaya",
            price: 1999,
            category: "abaya",
            image: "/images/products/classic-black-abaya.jpg",
            description: "Premium elegant black abaya.",
            featured: true
        },
        {
            id: 2,
            name: "Dubai Style Abaya",
            price: 2999,
            category: "abaya",
            image: "/images/products/dubai-abaya.jpg",
            description: "Luxurious Dubai-style abaya.",
            featured: true
        }
    ];
}

// Initialize product displays based on page
function initializeProductDisplay() {
    // Display featured products on homepage
    if (document.getElementById('featured-abayas')) {
        displayFeaturedProducts('abaya', 'featured-abayas', 4);
    }
    
    if (document.getElementById('featured-hijabs')) {
        displayFeaturedProducts('hijab', 'featured-hijabs', 4);
    }
    
    // Display all products on shop page
    if (document.getElementById('all-products')) {
        displayAllProducts();
    }
}

// Display featured products by category
function displayFeaturedProducts(category, containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const categoryProducts = productsData
        .filter(p => p.category === category && p.featured)
        .slice(0, limit);
    
    container.innerHTML = categoryProducts.map(product => createProductCard(product)).join('');
}

// Display all products (for shop page)
function displayAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.innerHTML = productsData.map(product => createProductCard(product)).join('');
    
    // Setup category filters
    setupCategoryFilters();
}

// Create product card HTML
function createProductCard(product) {
    const price = product.salePrice || product.price;
    const originalPrice = product.salePrice ? product.price : null;
    
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.salePrice ? '<span class="product-badge">Sale</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    ₹${price.toLocaleString()}
                    ${originalPrice ? `<small><s>₹${originalPrice.toLocaleString()}</s></small>` : ''}
                </div>
                <div class="product-actions">
                    <a href="https://wa.me/919594306625?text=${encodeURIComponent(getOrderMessage(product))}" 
                       class="btn-whatsapp-small" 
                       target="_blank"
                       onclick="trackWhatsAppClick('${product.name}')">
                        <i class="fab fa-whatsapp"></i> Order
                    </a>
                    <a href="#" class="btn-details" onclick="showProductDetails(${product.id}); return false;">
                        Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Generate WhatsApp order message
function getOrderMessage(product) {
    return `Hello Rizvi Store,

I'm interested in ordering:
Product: ${product.name}
Price: ₹${product.price}
Link: ${window.location.href}

Please let me know about:
- Availability
- Shipping
- Payment options

Thank you!`;
}

// Setup category filter buttons
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.tab-btn');
    const products = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const category = btn.dataset.category;
            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Track WhatsApp clicks (for analytics)
function trackWhatsAppClick(productName) {
    console.log(`WhatsApp inquiry for: ${productName}`);
    // You can add Google Analytics or other tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': productName
        });
    }
}

// Show product details modal
function showProductDetails(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal HTML
    const modalHTML = `
        <div class="product-modal" id="product-modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeProductModal()">&times;</span>
                <div class="modal-grid">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="modal-info">
                        <h2>${product.name}</h2>
                        <p class="modal-price">₹${product.price.toLocaleString()}</p>
                        <p class="modal-description">${product.description}</p>
                        
                        <div class="modal-details">
                            <p><strong>Fabric:</strong> ${product.fabric}</p>
                            <p><strong>Available Sizes:</strong> ${product.sizes.join(', ')}</p>
                            <p><strong>Colors:</strong> ${product.colors.join(', ')}</p>
                        </div>
                        
                        <a href="https://wa.me/919594306625?text=${encodeURIComponent(getOrderMessage(product))}" 
                           class="btn btn-primary btn-block" 
                           target="_blank">
                            <i class="fab fa-whatsapp"></i> Order Now on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('product-modal').style.display = 'flex';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.remove();
    }
}

// Load products when DOM is ready
document.addEventListener('DOMContentLoaded', loadProducts);