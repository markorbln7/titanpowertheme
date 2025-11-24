# EXTRACTION SET 4: DISCOUNT CONFIGURATION

**Extraction Date:** 2025-11-24
**Purpose:** Document discount codes, BF25 file structure, and configuration management
**Source:** `config/settings_data.json` search + file listing

---

## 1. SETTINGS_DATA.JSON SEARCH

**Search Query:** `grep -n "discount\|BF25\|black_friday" config/settings_data.json`
**Result:** No matches found

**Analysis:**
- **No discount configuration in theme settings:** Discount codes are hardcoded in JavaScript
- **No BF25 theme customizer settings:** BF25 configuration is file-based, not admin-configurable
- **Shopify discount codes:** Managed in Shopify Admin > Discounts, not theme files

**Current Discount Code Management:**
```javascript
// Hardcoded in bogo-builder.js
function getBOGODiscountCodes(pairCount) {
  if (pairCount === 1) {
    return 'BOGO2025';
  } else if (pairCount === 2) {
    return 'BOGO2025,TIER2-5OFF,FREESHIP';
  } else if (pairCount >= 3) {
    return 'BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP';
  }
  return '';
}
```

**Recommendation:** Move to theme settings for admin control
```json
{
  "name": "BF25 Configuration",
  "settings": [
    {
      "type": "header",
      "content": "Discount Codes"
    },
    {
      "type": "text",
      "id": "bf25_tier1_code",
      "label": "Tier 1 Discount Code",
      "default": "BOGO2025"
    },
    {
      "type": "text",
      "id": "bf25_tier2_codes",
      "label": "Tier 2 Discount Codes (comma-separated)",
      "default": "BOGO2025,TIER2-5OFF,FREESHIP"
    },
    {
      "type": "text",
      "id": "bf25_tier3_codes",
      "label": "Tier 3 Discount Codes (comma-separated)",
      "default": "BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP"
    }
  ]
}
```

---

## 2. BF25 FILE STRUCTURE

**Search Query:** `find . -name "*bf25*" -o -name "*BF25*"`
**Total Files:** 30 BF25-related files

### Documentation Files (9)
```
BF25_SLIDER_DIAGNOSTIC.md
BF25-CLICK-HANDLER-FIX-APPLIED.md
BF25-LAUNCH-CHECKLIST.md
BF25-MODAL-USER-GUIDE.md
BF25_PROGRESS_BAR_DESIGN_SYSTEM.md
BF25-STATE-CONFIG-FIX-APPLIED.md
BF25_SLIDER_FIX_APPLIED.md
BF25_HERO_EXTRACTION_SUMMARY.md
BF25_IMPLEMENTATION_VALIDATION.md
BF25-MODAL-TECHNICAL-DOCS.md
BF25_STICKY_CART_COMPLETE_EXTRACTION.md
EXTRACTION_SET_1_BF25_IMPLEMENTATION.md (this set)
```

### JavaScript Files (8)
```
assets/bf25-tier-cart-tests.js        # Test suite for sticky cart
assets/bf25-expansion-core.js          # Modal state management
assets/bf25-hero.js                    # Hero section animations
assets/section-power-pairs-bf25.js     # Power Pairs section
assets/section-bundle-builder-bf25.js  # Bundle Builder modal handlers
assets/bf25-tier-cart.js               # Sticky cart CartManager
bf25-diagnostic.js                     # Diagnostic tool (root)
```

### CSS Files (7)
```
assets/section-bundle-builder-bf25.css              # Bundle Builder dark mode
assets/section-power-pairs-bf25-variant-picker.css  # Variant picker styles
assets/bf25-hero.css                                # Hero section styles
assets/bf25-modal-design.css                        # Modal design system
assets/section-power-pairs-bf25-redesign.css        # Power Pairs redesign
assets/section-power-pairs-bf25.css                 # Power Pairs base
assets/bf25-tier-cart.css                           # Sticky cart styles
```

### Liquid Files (2)
```
snippets/buy-now-popup-bf25.liquid    # Modal template
snippets/bundle-card-bf25.liquid      # Bundle card component
```

### Data Files (3)
```
BF25_HERO_COMPLETE_EXTRACTION.txt     # Hero extraction (text format)
BF25_HERO_FILES_BUNDLE.txt            # Hero file bundle
.git/objects/63/3cda55b1b6c698f431bf25e8f81e10594933d3  # Git object
```

---

## 3. DISCOUNT CODE STRUCTURE

### Active Discount Codes

#### BOGO2025
**Type:** Base BOGO offer
**Applied To:** All tiers
**Discount:** Free item (lower-priced item in pair)
**Status:** Active
**Created In:** Shopify Admin > Discounts

#### TIER2-5OFF
**Type:** Percentage discount
**Applied To:** Tier 2 (2 pairs)
**Discount:** 5% off order total
**Minimum:** 2 BOGO pairs
**Status:** Active
**Stacks With:** BOGO2025, FREESHIP

#### TIER3-10OFF
**Type:** Percentage discount
**Applied To:** Tier 3 (3+ pairs)
**Discount:** 10% off order total
**Minimum:** 3 BOGO pairs
**Status:** Active
**Stacks With:** BOGO2025, FREECABLE2025, FREESHIP

#### FREESHIP
**Type:** Free shipping
**Applied To:** Tier 2+ (2+ pairs)
**Discount:** Free premium shipping (€4.99 value)
**Minimum:** 2 BOGO pairs
**Status:** Active
**Stacks With:** All BOGO codes

#### FREECABLE2025
**Type:** Free product (gift with purchase)
**Applied To:** Tier 3 (3+ pairs)
**Discount:** Free Titan Smart Cable (€18.95 value)
**Minimum:** 3 BOGO pairs
**Variant ID:** 43480190943410
**Status:** Active
**Stacks With:** BOGO2025, TIER3-10OFF, FREESHIP

---

## 4. DISCOUNT CODE CONFIGURATION

### Shopify Admin Setup Required

**Navigation:** Shopify Admin > Discounts > Create discount

#### BOGO2025 Setup
```
Discount type: Buy X Get Y
Discount code: BOGO2025
Customer buys: Minimum quantity 2
Customer gets: 1 item at 100% off
Collections: [All BOGO-eligible collections]
Active dates: Nov 1, 2024 - Dec 31, 2024
Maximum uses: Unlimited
One use per customer: No
Combines with: Order discounts, Shipping discounts, Product discounts
```

#### TIER2-5OFF Setup
```
Discount type: Percentage
Discount code: TIER2-5OFF
Discount value: 5%
Applies to: Entire order
Minimum purchase: 4 items (2 pairs)
Active dates: Nov 1, 2024 - Dec 31, 2024
Maximum uses: Unlimited
Combines with: Product discounts (BOGO2025), Shipping discounts
```

#### TIER3-10OFF Setup
```
Discount type: Percentage
Discount code: TIER3-10OFF
Discount value: 10%
Applies to: Entire order
Minimum purchase: 6 items (3 pairs)
Active dates: Nov 1, 2024 - Dec 31, 2024
Maximum uses: Unlimited
Combines with: Product discounts (BOGO2025, FREECABLE2025), Shipping discounts
```

#### FREESHIP Setup
```
Discount type: Free shipping
Discount code: FREESHIP
Countries: All countries
Shipping rates: All rates
Minimum purchase: 4 items (2 pairs)
Active dates: Nov 1, 2024 - Dec 31, 2024
Maximum uses: Unlimited
Combines with: Product discounts, Order discounts
```

#### FREECABLE2025 Setup
```
Discount type: Buy X Get Y
Discount code: FREECABLE2025
Customer buys: Minimum quantity 6 (3 pairs)
Customer gets: Titan Smart Cable (variant 43480190943410) at 100% off
Collections: [Bonus cables collection]
Active dates: Nov 1, 2024 - Dec 31, 2024
Maximum uses: Unlimited
Combines with: Order discounts, Shipping discounts
```

---

## 5. GIFT PRODUCT CONFIGURATION

### BF25 Sticky Cart Gifts

**Location:** `assets/bf25-tier-cart.js` lines 9-39

```javascript
const GIFT_PRODUCTS = {
  cable: {
    handle: 'bf25sc-free-cable',
    variantId: null, // Will be fetched dynamically
    tier: 1,
    emoji: '🔌',
    name: 'Premium Cable'
  },
  case: {
    handle: 'bf25sc-free-case',
    variantId: null,
    tier: 2,
    emoji: '📦',
    name: 'Protective Case'
  },
  magnetic: {
    handle: 'bf25sc-free-magnetic-set',
    variantId: null,
    tier: 3,
    emoji: '🧲',
    name: 'Magnetic Set'
  },
  mystery: {
    handle: 'bf25sc-free-mystery-box',
    variantId: null,
    tier: 4,
    emoji: '🎁',
    name: 'Mystery Box'
  }
};
```

**Gift Product Requirements:**
1. **Product Handle:** Must match handle in Shopify
2. **Variant ID:** Fetched dynamically via `/products/{handle}.js`
3. **Product Price:** Should be set to €0.00 or discounted to €0.00 via BOGO code
4. **Product Tags:** Tag with `bf25-gift` for filtering
5. **Product Availability:** Must be in stock and purchasable

### BOGO Builder Bonus Cable

**Location:** `assets/bogo-builder.js` line 6900

```javascript
async function addBonusCable() {
  const BONUS_CABLE_VARIANT_ID = '43480190943410';

  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{
        id: BONUS_CABLE_VARIANT_ID,
        quantity: 1,
        properties: {
          '_bonus_item': 'FREE Tier 3 Bonus',
          '_tier_3_bonus': 'Titan Smart Cable'
        }
      }]
    })
  });

  return response.json();
}
```

**Bonus Cable Product:**
- **Variant ID:** 43480190943410
- **Product:** Titan Smart Cable
- **Value:** €18.95
- **Tier:** 3 (3+ pairs)
- **Discount Code:** FREECABLE2025 (makes it €0.00)

---

## 6. TIER CONFIGURATION

### BF25 Sticky Cart Tiers

**Location:** `assets/bf25-tier-cart.js` lines 41-123

```javascript
const BF25_TIERS = [
  {
    id: 0,
    min: 0,
    max: 3,
    discount: "50%",
    badge: "50% OFF",
    color: "#6b7280",          // Gray
    glowColor: "#a1a1aa",
    glow: "rgba(107, 114, 128, 0.3)",
    gifts: []
  },
  {
    id: 1,
    min: 4,
    max: 7,
    discount: "60%",
    badge: "🔥 60% OFF",
    color: "#60c655",          // Lime Green
    glowColor: "#7FFF00",
    glow: "rgba(96, 198, 85, 0.5)",
    gifts: [{ name: "Cable", emoji: "🔌", value: 30 }]
  },
  {
    id: 2,
    min: 8,
    max: 11,
    discount: "70%",
    badge: "⭐ 70% OFF",
    color: "#60c655",          // Lime Green (brighter)
    glowColor: "#39FF14",
    glow: "rgba(127, 255, 0, 0.6)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 }
    ]
  },
  {
    id: 3,
    min: 12,
    max: 15,
    discount: "80%",
    badge: "🚀 80% OFF",
    color: "#FFD700",          // Gold
    glowColor: "#FFF700",
    glow: "rgba(255, 215, 0, 0.7)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 },
      { name: "Magnetic Set", emoji: "🧲", value: 60 }
    ],
    isDecoy: true              // Decoy tier (encourage push to tier 4)
  },
  {
    id: 4,
    min: 16,
    max: 999,
    discount: "85%",
    badge: "💎 85% OFF",
    color: "#E0F7FF",          // Platinum/Ice Blue
    glowColor: "#FFFFFF",
    glow: "rgba(224, 247, 255, 0.8)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 },
      { name: "Magnetic Set", emoji: "🧲", value: 60 },
      { name: "Mystery Box", emoji: "🎁", value: 150 }
    ]
  }
];
```

### BOGO Builder Tiers

**Simpler 3-Tier System:**
```
Tier 1: 1 pair   → BOGO only
Tier 2: 2 pairs  → BOGO + 5% OFF + Free Shipping
Tier 3: 3+ pairs → BOGO + 10% OFF + Free Cable + Free Shipping
```

**Key Differences:**
- **BF25 Sticky Cart:** 5 tiers (0-4), progressive gifts, visual progress bar
- **BOGO Builder:** 3 tiers (1-3), discount codes, simpler structure

---

## 7. CONFIGURATION FILES NEEDED

### Recommended Structure

```
config/
  ├─ bf25-config.json              # Main BF25 configuration
  ├─ bf25-tiers.json               # Tier definitions
  ├─ bf25-gifts.json               # Gift product configuration
  ├─ bf25-discount-codes.json      # Discount code mapping
  └─ settings_data.json            # Theme settings (existing)
```

### bf25-config.json (Proposed)
```json
{
  "enabled": true,
  "mode": "power_packs",
  "debug": false,
  "stickyCartEnabled": true,
  "pages": [
    "black-friday-2024",
    "bf25",
    "bf-2025-dev"
  ],
  "performance": {
    "fpsTarget": 60,
    "operationMaxMs": 50,
    "animationTargetMs": 1800
  }
}
```

### bf25-tiers.json (Proposed)
```json
{
  "tiers": [
    {
      "id": 1,
      "minItems": 4,
      "maxItems": 7,
      "discount": "60%",
      "badge": "🔥 60% OFF",
      "color": "#60c655",
      "gifts": ["cable"],
      "discountCodes": ["BOGO2025"]
    },
    {
      "id": 2,
      "minItems": 8,
      "maxItems": 11,
      "discount": "70%",
      "badge": "⭐ 70% OFF",
      "color": "#60c655",
      "gifts": ["cable", "case"],
      "discountCodes": ["BOGO2025", "TIER2-5OFF", "FREESHIP"]
    },
    {
      "id": 3,
      "minItems": 12,
      "maxItems": 15,
      "discount": "80%",
      "badge": "🚀 80% OFF",
      "color": "#FFD700",
      "gifts": ["cable", "case", "magnetic"],
      "isDecoy": true,
      "discountCodes": ["BOGO2025", "TIER2-5OFF", "FREESHIP"]
    },
    {
      "id": 4,
      "minItems": 16,
      "maxItems": 999,
      "discount": "85%",
      "badge": "💎 85% OFF",
      "color": "#E0F7FF",
      "gifts": ["cable", "case", "magnetic", "mystery"],
      "discountCodes": ["BOGO2025", "TIER3-10OFF", "FREECABLE2025", "FREESHIP"]
    }
  ]
}
```

### bf25-gifts.json (Proposed)
```json
{
  "gifts": {
    "cable": {
      "handle": "bf25sc-free-cable",
      "name": "Premium Cable",
      "value": 30,
      "emoji": "🔌",
      "tier": 1
    },
    "case": {
      "handle": "bf25sc-free-case",
      "name": "Protective Case",
      "value": 35,
      "emoji": "📦",
      "tier": 2
    },
    "magnetic": {
      "handle": "bf25sc-free-magnetic-set",
      "name": "Magnetic Set",
      "value": 60,
      "emoji": "🧲",
      "tier": 3
    },
    "mystery": {
      "handle": "bf25sc-free-mystery-box",
      "name": "Mystery Box",
      "value": 150,
      "emoji": "🎁",
      "tier": 4
    }
  }
}
```

### bf25-discount-codes.json (Proposed)
```json
{
  "codes": {
    "BOGO2025": {
      "type": "buy_x_get_y",
      "value": "100%",
      "applies_to": "lower_priced_item",
      "minimum": 2,
      "active": true
    },
    "TIER2-5OFF": {
      "type": "percentage",
      "value": "5%",
      "applies_to": "order",
      "minimum": 4,
      "active": true
    },
    "TIER3-10OFF": {
      "type": "percentage",
      "value": "10%",
      "applies_to": "order",
      "minimum": 6,
      "active": true
    },
    "FREESHIP": {
      "type": "free_shipping",
      "value": "€4.99",
      "applies_to": "all_shipping",
      "minimum": 4,
      "active": true
    },
    "FREECABLE2025": {
      "type": "free_product",
      "value": "€18.95",
      "variantId": "43480190943410",
      "minimum": 6,
      "active": true
    }
  }
}
```

---

## 8. ENVIRONMENT-SPECIFIC CONFIGURATION

### Development Settings
```javascript
window.bf25Config = {
  mode: 'power_packs',
  debug: true,                      // Enable verbose logging
  stickyCartEnabled: true,
  redirectToCart: true,             // Dev: View cart before checkout
  performanceMonitoring: true,      // Track FPS, operations
  animationSpeed: 1.0,              // Normal speed (1x)
  mockData: false                   // Use real Shopify data
};
```

### Staging Settings
```javascript
window.bf25Config = {
  mode: 'power_packs',
  debug: true,                      // Keep logging for QA
  stickyCartEnabled: true,
  redirectToCart: false,            // Test direct checkout
  performanceMonitoring: true,      // Track metrics
  animationSpeed: 1.0,
  mockData: false
};
```

### Production Settings
```javascript
window.bf25Config = {
  mode: 'power_packs',
  debug: false,                     // Disable logging
  stickyCartEnabled: true,
  redirectToCart: false,            // Direct to checkout
  performanceMonitoring: false,     // Disable for performance
  animationSpeed: 1.0,
  mockData: false
};
```

---

## 9. CONFIGURATION MANAGEMENT RECOMMENDATIONS

### 1. Centralize Configuration
**Current:** Scattered across multiple JS files
**Proposed:** Single `bf25-config.js` file

```javascript
// assets/bf25-config.js
export const BF25Config = {
  tiers: [...],
  gifts: {...},
  discountCodes: {...},
  performance: {...}
};

// Load in sections
import { BF25Config } from './bf25-config';
```

### 2. Environment Detection
```javascript
const ENV = (() => {
  if (window.location.hostname.includes('localhost')) return 'development';
  if (window.location.hostname.includes('staging')) return 'staging';
  return 'production';
})();

const config = BF25Config[ENV];
```

### 3. Theme Customizer Integration
```liquid
{% schema %}
{
  "name": "BF25 Configuration",
  "settings": [
    {
      "type": "checkbox",
      "id": "bf25_enabled",
      "label": "Enable BF25 Features",
      "default": true
    },
    {
      "type": "radio",
      "id": "bf25_mode",
      "label": "Display Mode",
      "options": [
        { "value": "power_packs", "label": "Power Packs" },
        { "value": "bundles", "label": "Bundles" }
      ],
      "default": "power_packs"
    },
    {
      "type": "checkbox",
      "id": "bf25_debug",
      "label": "Debug Mode",
      "default": false
    }
  ]
}
{% endschema %}
```

### 4. Runtime Configuration
```javascript
// Expose configuration for runtime updates
window.BF25 = {
  config: BF25Config,
  updateConfig(key, value) {
    this.config[key] = value;
    document.dispatchEvent(new CustomEvent('bf25:config-updated', {
      detail: { key, value }
    }));
  }
};

// Update from console for debugging
window.BF25.updateConfig('debug', true);
```

---

## 10. DISCOUNT CODE TESTING MATRIX

### Test Scenarios

| Scenario | Pairs | Items | Codes Applied | Expected Discount | Gifts |
|----------|-------|-------|---------------|-------------------|-------|
| 1. Single Pair | 1 | 2 | BOGO2025 | 50% (1 free) | None |
| 2. Two Pairs | 2 | 4 | BOGO2025, TIER2-5OFF, FREESHIP | 55% + Free Ship | None |
| 3. Three Pairs | 3 | 6 | BOGO2025, TIER3-10OFF, FREECABLE2025, FREESHIP | 60% + Free Ship + Cable | Cable |
| 4. Four Pairs | 4 | 8 | BOGO2025, TIER3-10OFF, FREECABLE2025, FREESHIP | 60% + Free Ship + Cable | Cable |

### Manual Testing Commands
```bash
# Test discount code generation
console.log(getBOGODiscountCodes(1));  # BOGO2025
console.log(getBOGODiscountCodes(2));  # BOGO2025,TIER2-5OFF,FREESHIP
console.log(getBOGODiscountCodes(3));  # BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP

# Test tier calculation
console.log(calculateTier(4));   # Tier 1
console.log(calculateTier(8));   # Tier 2
console.log(calculateTier(12));  # Tier 3
console.log(calculateTier(16));  # Tier 4

# Test discount calculation
const subtotal = 200.00;
const bogoSavings = 100.00;
const tierDiscount = (subtotal - bogoSavings) * 0.10;  # 10.00
console.log('Total savings:', bogoSavings + tierDiscount);  # 110.00
```

---

## SUMMARY

**Discount Configuration Status:**
- ❌ No discount config in `settings_data.json`
- ✅ Discount codes hardcoded in JavaScript
- ✅ Shopify discount codes created in Admin
- ❌ No centralized configuration file
- ❌ No theme customizer integration

**BF25 File Structure:**
- 30 total BF25 files
- 9 documentation files
- 8 JavaScript files
- 7 CSS files
- 2 Liquid snippets
- 4 data/misc files

**Discount Codes Active:**
- BOGO2025 (base BOGO)
- TIER2-5OFF (5% discount)
- TIER3-10OFF (10% discount)
- FREESHIP (free shipping)
- FREECABLE2025 (free cable)

**Gift Products Configured:**
- Premium Cable (€30 value)
- Protective Case (€35 value)
- Magnetic Set (€60 value)
- Mystery Box (€150 value)

**Recommendations:**
1. Create centralized `bf25-config.js` file
2. Move discount codes to theme customizer
3. Implement environment-specific configs
4. Add runtime configuration API
5. Create discount code testing matrix

---

**End of Extraction Set 4**
Generated: 2025-11-24
Total: Discount structure + File listing + Configuration recommendations
