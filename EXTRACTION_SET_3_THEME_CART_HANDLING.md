# EXTRACTION SET 3: THEME-LEVEL CART HANDLING

**Extraction Date:** 2025-11-24
**Purpose:** Document theme-level cart configuration, Rebuy integration, and page detection
**Source Files:** `templates/cart.json`, `layout/theme.liquid`

---

## 1. CART TEMPLATE STRUCTURE

**Location:** `templates/cart.json`
**Type:** Shopify OS 2.0 JSON template
**Purpose:** Cart page section configuration

```json
{
  "sections": {
    "cart-items": {
      "type": "main-cart-items",
      "settings": {
        "padding_top": 0,
        "padding_bottom": 24
      }
    },
    "cart-footer": {
      "type": "main-cart-footer",
      "blocks": {
        "subtotal": {
          "type": "subtotal",
          "settings": {}
        },
        "buttons": {
          "type": "buttons",
          "settings": {}
        }
      },
      "block_order": [
        "subtotal",
        "buttons"
      ],
      "settings": {
        "padding_top": 20,
        "padding_bottom": 40
      }
    }
  },
  "order": [
    "cart-items",
    "cart-footer"
  ]
}
```

**Analysis:**
- **Sections:** 2 sections (cart-items, cart-footer)
- **Blocks:** Subtotal + Buttons in footer
- **No custom cart logic:** Standard Shopify cart implementation
- **No BOGO-specific sections:** BOGO Builder bypasses cart page in checkout flow

**Cart Page Bypass Strategy:**
```javascript
// BOGO Builder redirects directly to checkout in production
const isDev = window.location.hostname === 'localhost' ||
              window.location.hostname.includes('127.0.0.1');

if (isDev) {
  window.location.href = '/cart';  // Dev: View cart
} else {
  window.location.replace(`/checkout?discount=${codes}`);  // Prod: Skip cart
}
```

---

## 2. REBUY INTEGRATION IN THEME

**Location:** `layout/theme.liquid`
**Lines:** 89-90
**Purpose:** Global Rebuy Smart Cart initialization

```liquid
<script async src="https://cdn.rebuyengine.com/onsite/js/rebuy.js?shop={{ shop.permanent_domain }}"></script>
{% render 'rebuy-smartcart-extensions' %}
```

**Rebuy Configuration:**
- **Script:** Async load from Rebuy CDN
- **Extensions:** `rebuy-smartcart-extensions` snippet (likely in `snippets/`)
- **Shop-specific:** Uses `{{ shop.permanent_domain }}` for shop identification

**Conflict Points:**
1. **BOGO Checkout:** Rebuy intercepts `cart:change` events
2. **Cart Drawer:** Rebuy opens drawer on cart updates
3. **BOGO Solution:** Multi-layer suppression system (see Extraction Set 2)

**Suppression Required:**
- Global flags: `window.rebuyDisabled`, `sessionStorage.setItem('rebuy-disabled', 'true')`
- Object nullification: Replace `window.Rebuy` with no-op Proxy
- Event blocking: Intercept `rebuy:cart-open`, `rebuy:cart-update`, `rebuy:checkout`
- DOM hiding: Hide `[data-rebuy]`, `rebuy-cart`, `.rebuy-cart` elements
- Body class: Add `bogo-checkout-mode` class

---

## 3. BF25 PAGE DETECTION

**Location:** `layout/theme.liquid`
**Search Query:** `grep -n "black-friday\|bf25\|bf-2025"`
**Result:** No matches found

**Analysis:**
- **No global BF25 detection:** Theme does not detect BF25 pages at layout level
- **Section-level detection:** BF25 sections use `data-section="bf25"` attribute
- **JavaScript detection:** Scripts check for BF25 section existence

**Current Detection Pattern:**
```javascript
// Example from section-bundle-builder-bf25.js
const bundleSection = document.querySelector('.section-collections-with-nav.dark-mode[data-section="bf25"]');

if (!bundleSection) {
  console.log('BF25 section not found on this page');
  return;  // Exit early
}
```

**Page Identification Strategy:**
```javascript
// Check if page is a BF25 page
const isBF25Page = () => {
  // Method 1: Check for BF25 section
  if (document.querySelector('[data-section="bf25"]')) {
    return true;
  }

  // Method 2: Check page handle
  const pageHandle = window.location.pathname.split('/')[2];  // /pages/{handle}
  const bf25Handles = ['black-friday-2024', 'bf25', 'bf-2025-dev'];
  return bf25Handles.includes(pageHandle);

  // Method 3: Check meta tag (if added)
  const metaTag = document.querySelector('meta[name="bf25-page"]');
  return metaTag && metaTag.content === 'true';
};
```

**Recommendation:** Add global BF25 detection to `theme.liquid`
```liquid
{%- comment -%} BF25 Page Detection {%- endcomment -%}
{% if page.handle == 'black-friday-2024' or page.handle == 'bf25' or page.handle == 'bf-2025-dev' %}
  <meta name="bf25-page" content="true">
  <script>
    window.bf25Config = {
      mode: 'power_packs',  // or 'bundles'
      debug: {{ settings.bf25_debug | default: false }},
      stickyCartEnabled: {{ settings.bf25_sticky_cart | default: true }}
    };
  </script>
{% endif %}
```

---

## 4. REBUY SMART CART EXTENSIONS

**Location:** `snippets/rebuy-smartcart-extensions.liquid` (referenced but not extracted)
**Purpose:** Custom Rebuy Smart Cart configuration

**Expected Contents:**
```liquid
{%- comment -%} Rebuy Smart Cart Extensions {%- endcomment -%}
<script>
  window.RebuyConfig = window.RebuyConfig || {};

  // Cart drawer settings
  window.RebuyConfig.cart = {
    enabled: true,
    drawer: {
      position: 'right',
      width: '400px'
    }
  };

  // Product recommendations
  window.RebuyConfig.recommendations = {
    enabled: true,
    algorithms: ['similar', 'frequently_bought_together']
  };

  // Custom event handlers
  document.addEventListener('rebuy:cart.open', function(event) {
    console.log('Rebuy cart opened:', event.detail);
  });

  document.addEventListener('rebuy:cart.update', function(event) {
    console.log('Rebuy cart updated:', event.detail);
  });
</script>
```

**Potential Conflicts with BOGO:**
1. **Cart drawer auto-open:** Rebuy opens drawer on `cart:change` events
2. **Recommendation engine:** May suggest products that conflict with BOGO pairs
3. **Checkout interception:** Rebuy may redirect checkout flow

**Mitigation Strategy:**
```liquid
{%- comment -%} Disable Rebuy on BF25 pages {%- endcomment -%}
{% if page.handle == 'black-friday-2024' or page.handle == 'bf25' %}
  <script>
    // Disable Rebuy Smart Cart on BF25 pages
    window.RebuyConfig = window.RebuyConfig || {};
    window.RebuyConfig.cart = { enabled: false };

    // Or conditionally disable only during BOGO checkout
    document.addEventListener('DOMContentLoaded', function() {
      const isBOGOCheckout = sessionStorage.getItem('bogo-direct-checkout');
      if (isBOGOCheckout === 'true') {
        window.RebuyConfig.cart.enabled = false;
      }
    });
  </script>
{% endif %}
```

---

## 5. CART API USAGE PATTERNS

**Shopify Cart API Endpoints Used:**

### GET /cart.js
**Purpose:** Fetch current cart state
**Response Format:**
```json
{
  "token": "abc123...",
  "note": null,
  "attributes": {},
  "total_price": 9900,
  "total_weight": 500,
  "item_count": 2,
  "items": [
    {
      "id": 43480190943410,
      "properties": {
        "_pair_number": "1",
        "_bogo_offer": "Black Friday BOGO 2025"
      },
      "quantity": 1,
      "variant_id": 43480190943410,
      "key": "43480190943410:1",
      "title": "Titan Power Bank - Black",
      "price": 4999,
      "line_price": 4999,
      "final_price": 4999,
      "product_id": 8467056656562
    }
  ],
  "requires_shipping": true,
  "currency": "EUR",
  "items_subtotal_price": 9900
}
```

### POST /cart/add.js
**Purpose:** Add item(s) to cart
**Request Format:**
```json
{
  "items": [
    {
      "id": 43480190943410,
      "quantity": 1,
      "properties": {
        "_pair_number": 1,
        "_bogo_offer": "Black Friday BOGO 2025"
      }
    }
  ]
}
```

### POST /cart/clear.js
**Purpose:** Clear all cart items
**Request Format:**
```json
{}
```
**Response:** Empty cart object

### POST /cart/change.js
**Purpose:** Update item quantity or properties
**Request Format:**
```json
{
  "line": 1,
  "quantity": 2
}
```

---

## 6. THEME EVENT SYSTEM

**Custom Events Triggered:**

### cart:updated
**Triggered:** After cart operations (add/remove/update)
**Payload:**
```javascript
{
  detail: {
    cart: {/* cart.js response */},
    source: 'bogo-builder' // or 'theme', 'rebuy', etc.
  }
}
```

### bogo:checkout-start
**Triggered:** When BOGO checkout begins
**Payload:**
```javascript
{
  detail: {
    pairCount: 3,
    tier: 3,
    totalSavings: 105.50,
    discountCodes: ['BOGO2025', 'TIER3-10OFF', 'FREECABLE2025', 'FREESHIP']
  }
}
```

### bogo:state-updated
**Triggered:** When BOGO state changes (pair added/removed)
**Payload:**
```javascript
{
  detail: {
    pairs: [/* pair objects */],
    currentPair: {/* slot1, slot2 */},
    activePairNumber: 2
  }
}
```

**Event Listener Pattern:**
```javascript
document.addEventListener('cart:updated', function(event) {
  console.log('Cart updated:', event.detail.cart);

  // Update UI elements
  const cartCount = event.detail.cart.item_count;
  document.querySelector('.cart-count-bubble').textContent = cartCount;
});

document.addEventListener('bogo:checkout-start', function(event) {
  console.log('BOGO checkout starting:', event.detail);

  // Suppress other cart systems
  if (window.Rebuy) {
    window.Rebuy.SmartCart.close();
  }
});
```

---

## 7. GLOBAL JAVASCRIPT VARIABLES

**Available on Window Object:**

```javascript
// BOGO State
window.bogoState = {
  pairs: [],              // Array of completed pairs
  currentPair: {},        // In-progress pair (slot1, slot2)
  activePairNumber: 1     // Next pair number
};

// BF25 Configuration
window.bf25Config = {
  mode: 'power_packs',    // or 'bundles'
  debug: false,           // Enable console logging
  stickyCartEnabled: true // Show sticky cart
};

// Rebuy State
window.Rebuy = {};        // Rebuy Smart Cart API
window.rebuyDisabled = false;  // Suppression flag

// Performance Monitoring
window.BF25Performance = {};  // PerformanceMonitor instance

// Product Variant Data
window.productVariants = {
  '8467056656562': [/* variant objects */]
};

window.productOptions = {
  '8467056656562': [/* option objects */]
};
```

---

## 8. CSS BODY CLASSES

**Dynamic Classes Added:**

```css
/* Modal Open */
body.modal-open {
  overflow: hidden;
}

/* BOGO Checkout Mode */
body.bogo-checkout-mode {
  /* Rebuy suppression class */
}

body.bogo-checkout-mode rebuy-cart,
body.bogo-checkout-mode [data-rebuy] {
  display: none !important;
  pointer-events: none !important;
}

/* Theme-Specific Classes */
body.template-cart {
  /* Cart page styles */
}

body.template-product {
  /* Product page styles */
}
```

---

## 9. THEME INTEGRATION CHECKLIST

- [x] **Cart Template:** Using Shopify OS 2.0 JSON template
- [x] **Rebuy Integration:** Loaded via theme.liquid (lines 89-90)
- [ ] **BF25 Page Detection:** Not implemented at theme level
- [ ] **Global BF25 Config:** Not set in theme.liquid
- [x] **Cart API:** Standard Shopify Cart API used
- [x] **Rebuy Suppression:** Implemented in bogo-builder.js
- [ ] **Event System:** Custom events defined but not documented
- [ ] **Performance Monitoring:** BF25Performance available but not global

**Recommendations:**
1. Add global BF25 page detection to theme.liquid
2. Set `window.bf25Config` in theme.liquid for all BF25 pages
3. Document custom event system in theme documentation
4. Add CSS body class for BF25 pages
5. Consider disabling Rebuy on BF25 pages via Rebuy config

---

## 10. DEVELOPMENT VS PRODUCTION BEHAVIOR

### Development Environment Detection
```javascript
const isDev = window.location.hostname === '127.0.0.1' ||
              window.location.hostname === 'localhost' ||
              window.location.port === '9292';
```

### Redirect Behavior
```javascript
if (isDev) {
  // Development: Redirect to cart page for verification
  window.location.href = '/cart';
  console.log('🔧 DEV MODE: Redirecting to cart page for verification');
} else {
  // Production: Skip cart, go directly to checkout
  window.location.replace(`/checkout?discount=${encodedDiscounts}`);
}
```

### Loading Overlay Differences
```javascript
const devNotice = isDev
  ? `<p class="dev-notice">⚠️ Development mode: Redirecting to cart page</p>`
  : '';

// Shown in checkout loading modal
```

**Dev Mode Benefits:**
- View cart contents before checkout
- Verify item properties
- Test discount codes manually
- Debug cart state

**Production Mode:**
- Faster checkout (skip cart page)
- Fewer clicks for user
- Reduced cart abandonment
- Immediate discount application

---

## SUMMARY

**Theme-Level Cart Handling:**
- Standard Shopify cart template (OS 2.0 JSON)
- Rebuy Smart Cart integrated globally (theme.liquid lines 89-90)
- No BF25-specific theme detection
- Cart API used for all cart operations
- BOGO Builder bypasses cart page in production
- Rebuy suppression handled at section level (not theme level)

**Key Files:**
- `templates/cart.json` - Cart page structure
- `layout/theme.liquid` - Rebuy integration (lines 89-90)
- `snippets/rebuy-smartcart-extensions.liquid` - Rebuy config (not extracted)

**Integration Points:**
- Shopify Cart API (`/cart/add.js`, `/cart/clear.js`, `/cart/change.js`)
- Rebuy Smart Cart API (`window.Rebuy`)
- Custom events (`cart:updated`, `bogo:checkout-start`)
- Global variables (`window.bogoState`, `window.bf25Config`)

---

**End of Extraction Set 3**
Generated: 2025-11-24
Total: Cart template + Rebuy integration + Detection patterns + API usage
