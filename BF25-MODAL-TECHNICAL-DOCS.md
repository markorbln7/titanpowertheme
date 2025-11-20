# BF25 Bundle Builder - Technical Documentation

## Overview
Premium dual-mode product expansion modal system for Black Friday 2025.

## Architecture

### Core Components
- **ModalState:** Reactive state management with pub/sub pattern
- **ExpansionManager:** Main orchestrator, handles modal lifecycle
- **VariantManager:** Variant selection and display management
- **TierCalculator:** Tier-based pricing logic with cart awareness
- **CartManager:** Shopify Cart API integration with retry logic
- **PerformanceMonitor:** Core Web Vitals tracking and optimization

### File Structure
```
assets/
├── bf25-expansion-core.js     (Main JavaScript - 3600+ lines)
└── bf25-modal-design.css      (Styles - 2600+ lines)
```

### Data Layer

#### Configuration Object
```javascript
window.bf25Config = {
  debug: false,
  mode: 'power_packs', // or 'individual_products'
  tiers: [
    { min: 1, max: 3, discount: 0, label: "Standard" },
    { min: 4, max: 6, discount: 10, label: "Better Deal" },
    { min: 7, max: 9, discount: 15, label: "Great Deal" },
    { min: 10, max: 999, discount: 20, label: "Best Deal" }
  ],
  enhancedFeatures: {
    showReviews: true,
    showStockLevels: true,
    showCountdown: true,
    showFeatures: true,
    showShipping: true,
    enableKeyboardShortcuts: true,
    showTrustBadges: true
  }
}
```

#### Product Data
```javascript
window.productData = {
  "product-id": {
    id: "product-id",
    title: "Product Name",
    image: "https://cdn.shopify.com/...",
    basePrice: 24.99,
    reviewCount: 127,
    rating: 4.8,
    features: ["Feature 1", "Feature 2", "Feature 3"],
    stockLevel: 15, // optional
    shipsWithin: "2-3 business days" // optional
  }
}
```

#### Variant Data
```javascript
window.productVariants = {
  "product-id": [
    {
      id: "variant-id",
      title: "Black / 10000mAh",
      price: 24.99,
      available: true,
      image: "https://cdn.shopify.com/..." // optional
    }
  ]
}
```

## API Reference

### ExpansionManager

**Methods:**

#### `open(card, productId)`
Opens modal for specified product
- **Parameters:**
  - `card` (HTMLElement) - Product card element that triggered modal
  - `productId` (string) - Product identifier
- **Returns:** void
- **Throws:** Error if validation fails

#### `close()`
Closes modal with cleanup
- **Returns:** void
- **Side effects:**
  - Clears intervals
  - Removes event listeners
  - Restores focus
  - Resets state

#### `updateQuantity(newQuantity)`
Updates quantity with validation
- **Parameters:**
  - `newQuantity` (number) - New quantity value
- **Returns:** void
- **Validation:** Min 1, Max 99

#### `validateProductData(productId)`
Validates product data before opening
- **Parameters:**
  - `productId` (string) - Product to validate
- **Returns:** Object|null - Validated product or null if invalid

**Events:**

```javascript
// Cart added successfully
document.addEventListener('bf25:cart:added', (e) => {
  console.log('Added to cart:', e.detail);
});

// Cart operation error
document.addEventListener('bf25:cart:error', (e) => {
  console.error('Cart error:', e.detail);
});

// Performance metrics
document.addEventListener('bf25:performance', (e) => {
  console.log('Performance:', e.detail);
});
```

### TierCalculator

**Methods:**

#### `calculatePricing()`
Calculate pricing for current selection
- **Returns:** Object
  ```javascript
  {
    quantity: 7,
    tier: { min: 7, max: 9, discount: 15, label: "Great Deal" },
    basePrice: 24.99,
    discountedPrice: 21.24,
    totalPrice: 148.68,
    savings: 26.19,
    percentOff: 15
  }
  ```

#### `calculateCartAwarePricing()`
Calculate pricing including cart items
- **Returns:** Object with combined cart + modal calculations

#### `getCombinedQuantity()`
Get total quantity (cart + modal)
- **Returns:** number

### CartManager

**Methods:**

#### `addToCart()`
Add item to Shopify cart with retry logic
- **Returns:** Promise<Object>
  ```javascript
  {
    success: true,
    data: { /* Shopify cart response */ }
  }
  // or
  {
    success: false,
    error: { message, description }
  }
  ```
- **Retry Logic:** 2 retries, 10s timeout, exponential backoff

#### `fetchCart(force = false)`
Get current cart state (cached for 30s)
- **Parameters:**
  - `force` (boolean) - Force refresh cache
- **Returns:** Promise<Object>

### PerformanceMonitor

**Methods:**

#### `logSummary()`
Log performance summary to console
- **Returns:** void

#### `checkTargets()`
Verify performance meets targets
- **Returns:** Object with pass/fail for each metric

## Configuration Guide

### Mode Selection

#### Power Packs Mode
Best for bundles and products sold in sets
```javascript
window.bf25Config.mode = 'power_packs';
```
**Features:**
- Large tier buttons (4, 7, 10 items)
- "Most Popular" badge on default tier
- Instant tier selection
- Visual discount badges

#### Individual Products Mode
Best for accessories and single items
```javascript
window.bf25Config.mode = 'individual_products';
```
**Features:**
- Traditional quantity stepper
- Plus/minus buttons
- Manual input field
- Keyboard shortcuts (arrows, numbers)

### Tier Configuration

```javascript
window.bf25Config.tiers = [
  { min: 1, max: 3, discount: 0, label: "Standard" },
  { min: 4, max: 6, discount: 10, label: "Better Deal" },
  { min: 7, max: 9, discount: 15, label: "Great Deal" },
  { min: 10, max: 999, discount: 20, label: "Best Deal" }
];
```

**Best Practices:**
- Keep 3-4 tiers maximum
- Most popular tier: 7-9 items (15% off)
- Maximum tier should be compelling (20%+ off)
- Ensure gaps between tiers motivate upsell

### Enhanced Features Toggle

```javascript
window.bf25Config.enhancedFeatures = {
  showReviews: true,           // Star ratings and review count
  showStockLevels: true,       // "Only X left" when stock < 20
  showCountdown: true,         // Black Friday countdown timer
  showFeatures: true,          // Product features list
  showShipping: true,          // Free shipping information
  enableKeyboardShortcuts: true, // Keyboard navigation
  showTrustBadges: true        // Quality/shipping/guarantee badges
};
```

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint):** <2.5s (green)
- **FID (First Input Delay):** <100ms (green)
- **CLS (Cumulative Layout Shift):** <0.1 (green)
- **INP (Interaction to Next Paint):** <200ms (green)

### Custom Metrics
- **Modal Open Time:** <300ms
- **Add to Cart Time:** <2s
- **Tier Calculation:** <50ms
- **Cart Fetch:** <500ms (cached: <10ms)
- **Image Load:** <1.5s (lazy loaded)

### Optimization Features
- GPU acceleration (will-change: transform)
- Debounced inputs (150ms)
- Lazy image loading (Intersection Observer)
- Cart state caching (30s TTL)
- Network retry logic (2 attempts)
- Request deduplication

## Browser Support

### Supported Browsers
- **Chrome:** 90+ ✅
- **Firefox:** 88+ ✅
- **Safari:** 14+ ✅
- **Edge:** 90+ ✅
- **iOS Safari:** 14+ ✅
- **Android Chrome:** 90+ ✅

### Not Supported
- Internet Explorer (any version)
- Opera Mini
- Android Browser <80
- Safari <14

### Browser-Specific Fixes
- iOS Safari 100vh fix (--vh CSS variable)
- Input zoom prevention (16px font size)
- Passive event listeners
- -webkit-appearance resets
- Safari smooth scroll polyfill

## Accessibility (WCAG 2.2 AA)

### Keyboard Navigation
- **Tab:** Navigate through elements
- **Shift+Tab:** Navigate backwards
- **Enter:** Activate buttons/links
- **Space:** Activate buttons
- **ESC:** Close modal
- **1-9:** Quick quantity select (individual mode)
- **Arrow Up/Down:** Adjust quantity

### Screen Reader Support
- ARIA live regions for announcements
- Proper ARIA attributes on all interactive elements
- Semantic HTML structure
- Screen reader only content (.bf25-sr-only)
- Focus management (trap + restore)

### Visual Accessibility
- Color contrast ratios verified (WCAG AA)
- Focus visible indicators (2px green outline)
- High contrast mode support
- Reduced motion support (@media prefers-reduced-motion)
- Minimum touch target size (44x44px)

## Dependencies

### Required
- Shopify Online Store 2.0
- JavaScript enabled
- Cookies enabled (for cart)

### Optional
- Google Analytics (for event tracking)
- Facebook Pixel (for conversion tracking)
- Performance Observer API (for Core Web Vitals)

### No External Libraries
- Zero dependencies (no jQuery)
- Native browser APIs only
- Modern JavaScript (ES6+)

## Known Limitations

### Technical
- Single product per modal (no multi-product bundles)
- Maximum 99 quantity per transaction
- Requires modern browser (no IE support)
- JavaScript must be enabled

### Feature
- No product comparison view
- No wishlist integration
- No save-for-later functionality
- No multi-currency display (relies on theme)

### Performance
- Large product catalogs (1000+ variants) may slow variant loading
- Very large images may impact LCP
- Heavy third-party scripts may affect performance

## Troubleshooting

### Debug Mode
Enable verbose logging:
```javascript
window.bf25Config.debug = true;
```

### Common Commands
```javascript
// Check state
window.bf25Expansion.state.getAll();

// Force cart refresh
await window.bf25Expansion.cartManager.fetchCart(true);

// Check performance
window.bf25Performance.logSummary();
window.bf25Performance.checkTargets();

// Emergency disable
window.bf25Expansion = null;
```

### Log Interpretation
- `🚀 Opening Modal` - Modal open initiated
- `✅ Cart response` - Add to cart succeeded
- `❌ Cart error` - Add to cart failed
- `📊 Performance Summary` - Performance metrics logged
- `⚠️ Warning` - Non-critical issue detected
- `🔒 Focus trap initialized` - Accessibility active

## Security

### XSS Prevention
- All user input sanitized
- innerHTML only used with trusted data
- Product data validated before rendering

### CSRF Protection
- Shopify Cart API handles CSRF tokens
- No custom form submissions

### Data Privacy
- No personal data collected
- Cart operations use Shopify's secure API
- Analytics data anonymized

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review performance metrics monthly
- Update browser compatibility list quarterly
- Audit accessibility annually

### Version Control
- Semantic versioning (Major.Minor.Patch)
- Current version: 1.0.0
- Changelog maintained

### Support
- Technical documentation: This file
- User guide: BF25-MODAL-USER-GUIDE.md
- Troubleshooting: BF25-MODAL-TROUBLESHOOTING.md

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-19
**Maintainer:** Titan Power Plus Development Team
