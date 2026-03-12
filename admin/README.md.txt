# Rizvi Store - Admin Guide

## Managing Products

### Product File Location
All product data is stored in: `/data/products.json`

### Product Structure
```json
{
    "id": 1,                    // Unique product ID
    "name": "Product Name",      // Product title
    "price": 1999,               // Regular price
    "salePrice": 1799,           // Sale price (null if not on sale)
    "category": "abaya",         // "abaya" or "hijab"
    "image": "/images/products/filename.jpg",
    "description": "Description",
    "fabric": "Nida",            // Fabric type
    "sizes": ["S", "M", "L"],     // Available sizes
    "colors": ["Black", "Navy"],  // Available colors
    "inStock": true,              // Stock status
    "featured": true,             // Show on homepage
    "tags": ["tag1", "tag2"]      // Search tags
}