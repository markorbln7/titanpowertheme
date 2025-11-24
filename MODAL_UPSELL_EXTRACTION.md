# MODAL UPSELL EXTRACTION

**Purpose:** Analyze current upsell implementation in BF25 expansion modal
**Date:** 2025-11-24
**Files Analyzed:** `assets/bf25-expansion-core.js`, `snippets/buy-now-popup-bf25.liquid`

---

## EXTRACTION 1: Upsell HTML Generation (Lines 4671-4718)

### Current Dynamic Modal Implementation

```javascript
<!-- Upsells Section -->
${(() => {
  const upsells = product.upsells;

  if (!upsells || upsells.length === 0) {
    return '';
  }

  const upsellCards = upsells.map(upsell => {
    // Calculate discount percentage
    const discount = upsell.comparePrice > upsell.price
      ? Math.round(((upsell.comparePrice - upsell.price) / upsell.comparePrice) * 100)
      : 0;

    // Format prices
    const price = this.formatPrice(upsell.price);
    const comparePrice = upsell.comparePrice > upsell.price
      ? this.formatPrice(upsell.comparePrice)
      : '';

    return `
      <div class="bf25-upsell-card" data-product-id="${upsell.id}">
        <div class="bf25-upsell-image">
          ${discount > 0 ? `<span class="bf25-upsell-badge">${discount}% OFF</span>` : ''}
          <img src="${upsell.image}" alt="${upsell.title}" loading="lazy">
        </div>
        <div class="bf25-upsell-info">
          <h4 class="bf25-upsell-title bf25-text-sm bf25-text-primary">${upsell.title}</h4>
          <div class="bf25-upsell-price">
            <span class="bf25-text-md bf25-text-accent">${price}</span>
            ${comparePrice ? `<span class="bf25-text-sm bf25-text-tertiary" style="text-decoration: line-through;">${comparePrice}</span>` : ''}
          </div>
        </div>
        <button class="bf25-upsell-add" type="button" data-upsell-url="${upsell.url}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="bf25-upsells-section bf25-mb-4 bf25-reveal-stagger-2">
      <h3 class="bf25-upsells-title bf25-text-md bf25-text-primary bf25-mb-3">You May Also Like</h3>
      <div class="bf25-upsells-grid">
        ${upsellCards}
      </div>
    </div>
  `;
})()}
```

### Structure Analysis

**Upsell Card Elements:**
- `.bf25-upsell-card` - Container with `data-product-id`
- `.bf25-upsell-image` - Image container with optional discount badge
- `.bf25-upsell-info` - Title and pricing
- `.bf25-upsell-add` - Button with `data-upsell-url`

**Data Requirements:**
```javascript
upsell = {
  id: 123456,                    // Product ID
  title: "Product Name",
  price: 2990,                   // Cents
  comparePrice: 4990,            // Cents (optional)
  image: "https://...",          // Image URL
  url: "/products/handle"        // Product page URL
}
```

---

## EXTRACTION 2: Upsell Click Handlers (Lines 4232-4253)

### Current Behavior: Navigation Only

```javascript
/**
 * Bind upsell add button events
 * Added: BF25-DESC-005
 */
bindUpsellEvents() {
  const upsellButtons = this.container.querySelectorAll('.bf25-upsell-add');

  upsellButtons.forEach(button => {
    button.addEventListener('click', () => {
      const upsellUrl = button.dataset.upsellUrl;

      if (upsellUrl) {
        // Navigate to upsell product page
        window.location.href = upsellUrl;

        if (this.config.debug) {
          console.log('🔗 Navigating to upsell:', upsellUrl);
        }
      }
    });
  });

  if (this.config.debug && upsellButtons.length > 0) {
    console.log(`✅ ${upsellButtons.length} upsell buttons bound`);
  }
}
```

### Critical Finding

**Current Implementation:**
- ❌ Navigates to product page (`window.location.href`)
- ❌ Does NOT add to cart
- ❌ User loses BF25 modal context
- ❌ No multi-product bundle support

**Expected Behavior (Not Implemented):**
- ✅ Should add upsell to cart via `/cart/add.js`
- ✅ Should keep modal open
- ✅ Should update total pricing
- ✅ Should allow adding multiple upsells

---

## EXTRACTION 3: Upsell Data Structure

### No Dedicated Extraction Found

**Evidence from HTML generation (Extraction 1):**
```javascript
const upsells = product.upsells;
```

**Expected Structure:**
```javascript
product = {
  id: 123,
  title: "Main Product",
  // ... other product fields
  upsells: [
    {
      id: 456,
      title: "Upsell Product 1",
      price: 2990,
      comparePrice: 4990,
      image: "https://cdn.shopify.com/...",
      url: "/products/upsell-1"
    },
    {
      id: 789,
      title: "Upsell Product 2",
      price: 1990,
      comparePrice: 2990,
      image: "https://cdn.shopify.com/...",
      url: "/products/upsell-2"
    }
  ]
}
```

**Question:** Where does `product.upsells` data come from?
- Likely populated from product metafields
- Or hardcoded in bundle builder section
- Need to verify data source

---

## EXTRACTION 4: Add to Cart Method (Lines 1395-1435)

### Current Main Product Add to Cart

```javascript
/**
 * Main method called when user clicks "Add to Cart"
 * Enhanced with retry logic and double-click prevention (Prompt 12)
 *
 * @returns {Promise<Object>} Cart response data
 */
async addToCart() {
  // ─────────────────────────────────────────────────────────────────
  // DOUBLE-CLICK PREVENTION (Prompt 12)
  // ─────────────────────────────────────────────────────────────────
  if (this.isAddingToCart) {
    if (this.config.debug) {
      console.warn('⚠️ Add to cart already in progress, ignoring duplicate request');
    }
    return { success: false, error: 'Request in progress' };
  }

  this.isAddingToCart = true;

  try {
    // Validate required data
    const validation = this.validateCartData();
    if (!validation.valid) {
      this.showError(validation.error);
      return { success: false, error: validation.error };
    }

    // Get current state
    const productId = this.state.get('productId');
    const variantId = this.state.get('selectedVariantId');
    const quantity = this.state.get('quantity');

    // Get product data for properties
    const product = window.productData[productId];
    const pricing = this.manager.tierCalculator.calculatePricing();

    // Build cart item object
    const cartItem = this.buildCartItem(variantId, quantity, product, pricing);

    if (this.config.debug) {
      console.group('🛒 Adding to Cart');
      console.log('Product:', product.title);
      console.log('Variant ID:', variantId);
      console.log('Quantity:', quantity);
      console.log('Cart Item:', cartItem);
      console.groupEnd();
    }

    // ... continues with API call to /cart/add.js
```

### Key Methods to Extend for Upsells

1. **buildCartItem(variantId, quantity, product, pricing)**
   - Constructs cart item object with properties
   - Need to adapt for upsells (no custom pricing, simpler properties)

2. **API Call Pattern:**
   ```javascript
   const response = await fetch('/cart/add.js', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(cartItem)
   });
   ```

3. **Success Handling:**
   - Shows success notification
   - Updates cart count
   - Closes modal (800ms delay)

---

## EXTRACTION 5: Snippet Upsell Structure (Lines 471-512)

### Legacy Liquid Template (NOT Used in Dynamic Modal)

```liquid
{% assign first_upsell_product = all_products[upsell_product_one] %}
{% assign second_upsell_product = all_products[upsell_product_two] %}

{% if upsell_product_one or upsell_product_two %}
  <div class="buy-now-popup__upsell">
    <h4 class="text-[16px] font-semibold">You May Also Like:</h4>
    <div class="mt-[10px]">
      {% if upsell_product_one %}
        <div class="mb-4 last:mb-0">
          <div data-product-id="{{first_upsell_product.selected_or_first_available_variant.id}}"
              class="js-upsell-selector buy-now-popup__upsell-box relative flex items-center py-[20px] pr-[16px] pl-[50px] border-2 border-[#ddd] cursor-pointer mb-[2px] rounded-[6px] box-border">
            <label class="buy-now-popup__checkbox">
              <input type="checkbox" />
              <span class="custom-checkbox"></span>
            </label>
            <figure class="relative mr-[16px]">
              <img src="{{ first_upsell_product.featured_image | img_url: 'master' }}" alt="{{first_upsell_product.title}}" height="60" width="60" class="h-[60px] w-[60px] object-contain"/>
            </figure>
            <div class="w-full">
              <h4 class="mt-[4px] text-[16px] font-medium text-[#000] mb-[6px] leading-[1]">{{ first_upsell_product.title }}</h4>
              <div class="flex w-full flex-wrap items-center justify-between">
                <div class="flex items-center flex-wrap">
                  <div class="font-semibold mr-[6px] text-[#000] leading-[1]">{{ first_upsell_product.price | money }}</div>
                  {% if first_upsell_product.compare_at_price != blank %}
                    <div class="text-[14px] font-semibold text-[#777777] line-through">{{ first_upsell_product.compare_at_price | money }}</div>
                  {% endif %}
                  {% if first_upsell_product.compare_at_price > first_upsell_product.price  %}
                    <div class="ml-1 flex-none text-[10px] font-medium titan-red">
                      Save {{ first_upsell_product.compare_at_price | minus: first_upsell_product.price | money }}
                    </div>
                  {% endif %}
                </div>
              </div>
            </div>
          </div>
        </div>
      {% endif %}
      {% if upsell_product_two %}
        <!-- Second upsell (similar structure) -->
      {% endif %}
    </div>
  </div>
{% endif %}
```

### Legacy Structure Analysis

**Key Differences from Dynamic Modal:**

| Feature | Legacy Snippet | Dynamic Modal |
|---------|---------------|---------------|
| Selector | `.js-upsell-selector` | `.bf25-upsell-add` |
| Interaction | Checkbox selection | Button click |
| Data Storage | `data-product-id` (variant ID) | `data-upsell-url` (product URL) |
| Layout | Horizontal card (checkbox + image + info) | Compact card (image + title + button) |
| Limit | 2 upsells max | Unlimited array |
| Configuration | Liquid variables (`upsell_product_one`, `upsell_product_two`) | JavaScript object array |

**Legacy Snippet Issues:**
- ❌ Hardcoded to 2 upsells only
- ❌ Uses product handles in settings (not flexible)
- ❌ No JavaScript interaction (checkbox only)
- ❌ No add-to-cart implementation

---

## CRITICAL FINDINGS

### 1. Current Implementation is Incomplete

**What Exists:**
- ✅ Upsell HTML generation (dynamic modal)
- ✅ Click event binding
- ✅ Visual styling (cards with images, prices, badges)

**What's Missing:**
- ❌ Add to cart functionality (currently navigates to product page)
- ❌ Multi-product cart addition
- ❌ Price recalculation with upsells
- ❌ Visual feedback (checkmarks, loading states)
- ❌ Upsell selection state management

---

### 2. Data Source Unknown

**Need to verify:**
- Where does `product.upsells` come from?
- Is it populated in bundle builder section?
- Are upsells stored in product metafields?
- How are upsell products selected?

**Likely Sources:**
1. **Metafields:** `product.metafields.custom.upsells` (JSON array)
2. **Section Settings:** Hardcoded in `section-bundle-builder-bf25.liquid`
3. **JavaScript Configuration:** Defined in page-level script

---

### 3. Two Upsell Systems Coexist

**System 1: Dynamic Modal (Active)**
- Location: `assets/bf25-expansion-core.js`
- Selector: `.bf25-upsell-add`
- Behavior: Navigation to product page
- Layout: Compact card with + button

**System 2: Legacy Snippet (Inactive)**
- Location: `snippets/buy-now-popup-bf25.liquid`
- Selector: `.js-upsell-selector`
- Behavior: Checkbox selection (no add-to-cart)
- Layout: Horizontal card with checkbox

**Recommendation:** Remove legacy snippet code to avoid confusion.

---

### 4. No Variant Selection for Upsells

**Current:**
```javascript
data-product-id="${upsell.id}"
data-upsell-url="${upsell.url}"
```

**Problem:**
- No variant ID stored
- If upsell has multiple variants (color, size), which one to add?

**Solutions:**
1. **Default Variant:** Always add first available variant
2. **Metafield Config:** Store variant ID in upsell data
3. **Modal Within Modal:** Open mini-variant selector for upsell

---

## RECOMMENDED IMPLEMENTATION: Add Upsells to Cart

### Step 1: Add Variant ID to Upsell Data

**Update HTML generation (Line 4692):**
```javascript
<div class="bf25-upsell-card"
     data-product-id="${upsell.id}"
     data-variant-id="${upsell.variantId}"
     data-upsell-url="${upsell.url}">
```

**Update data structure:**
```javascript
upsell = {
  id: 456,
  variantId: 12345678,  // NEW: First available variant ID
  title: "Upsell Product",
  price: 2990,
  comparePrice: 4990,
  image: "https://...",
  url: "/products/handle"
}
```

---

### Step 2: Replace Navigation with Cart Addition

**Update bindUpsellEvents() (Line 4236):**
```javascript
bindUpsellEvents() {
  const upsellButtons = this.container.querySelectorAll('.bf25-upsell-add');

  upsellButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const card = button.closest('.bf25-upsell-card');
      const variantId = parseInt(card.dataset.variantId);
      const productTitle = card.querySelector('.bf25-upsell-title')?.textContent || 'Upsell';

      if (!variantId) {
        console.error('[BF25 Modal] No variant ID for upsell');
        return;
      }

      // Disable button during add
      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        // Add upsell to cart (quantity = 1, no custom properties)
        const result = await this.addUpsellToCart(variantId, productTitle);

        if (result.success) {
          // Show success feedback
          button.textContent = '✓ Added';
          button.classList.add('is-added');

          // Update cart count in header
          this.updateCartCount();

          // Show toast notification
          if (window.BF25Toast) {
            window.BF25Toast.show(`${productTitle} added to cart`, 'success', 2000);
          }
        } else {
          throw new Error(result.error || 'Failed to add upsell');
        }

      } catch (error) {
        console.error('[BF25 Modal] Upsell add failed:', error);

        // Reset button
        button.disabled = false;
        button.textContent = 'Add';

        // Show error toast
        if (window.BF25Toast) {
          window.BF25Toast.show('Failed to add item. Please try again.', 'error', 3000);
        }
      }
    });
  });

  if (this.config.debug && upsellButtons.length > 0) {
    console.log(`✅ ${upsellButtons.length} upsell buttons bound`);
  }
}
```

---

### Step 3: Add Upsell Cart Method

**New method in CartManager class:**
```javascript
/**
 * Add upsell product to cart
 * Simplified version without tier pricing or custom properties
 *
 * @param {number} variantId - Variant ID to add
 * @param {string} productTitle - Product title for logging
 * @returns {Promise<Object>} Result object with success status
 */
async addUpsellToCart(variantId, productTitle) {
  if (this.config.debug) {
    console.log(`[BF25 Modal] Adding upsell: ${productTitle} (variant: ${variantId})`);
  }

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
        properties: {
          '_bf25_upsell': 'true',
          '_added_from': 'bf25_modal'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (this.config.debug) {
      console.log('[BF25 Modal] ✓ Upsell added:', result);
    }

    // Emit analytics event
    this.emitCartEvent('bf25:upsell:added', {
      variantId: variantId,
      productTitle: productTitle,
      price: result.price
    });

    return { success: true, data: result };

  } catch (error) {
    console.error('[BF25 Modal] Upsell add error:', error);
    return { success: false, error: error.message };
  }
}
```

---

### Step 4: Update Cart Count in Header

**New method in CartManager or ExpansionManager:**
```javascript
/**
 * Update cart count display in header
 * Fetches current cart and updates count badge
 */
async updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();

    // Update cart count badge (theme-specific selector)
    const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      el.setAttribute('data-cart-count', cart.item_count);
    });

    if (this.config.debug) {
      console.log('[BF25 Modal] Cart count updated:', cart.item_count);
    }

  } catch (error) {
    console.error('[BF25 Modal] Failed to update cart count:', error);
  }
}
```

---

### Step 5: Add Visual State Classes

**CSS for upsell button states:**
```css
/* Upsell button states */
.bf25-upsell-add {
  transition: all 0.2s ease;
}

.bf25-upsell-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.bf25-upsell-add.is-added {
  background: #60c655;
  color: white;
  border-color: #60c655;
}

.bf25-upsell-card.is-added {
  opacity: 0.7;
  pointer-events: none;
}
```

---

## TESTING CHECKLIST

### Scenario 1: Single Upsell Addition
1. Open modal for product with upsells
2. Click "Add" on first upsell
3. **Expected:** Button shows "Adding..." → "✓ Added"
4. **Expected:** Toast notification "Product added to cart"
5. **Expected:** Cart count increments by 1
6. **Expected:** Modal stays open

### Scenario 2: Multiple Upsells
1. Open modal with 2+ upsells
2. Click "Add" on first upsell → Wait for success
3. Click "Add" on second upsell
4. **Expected:** Both upsells added to cart
5. **Expected:** Cart count increments by 2
6. **Expected:** Both buttons show "✓ Added"

### Scenario 3: Main Product + Upsell
1. Open modal, select variant, set quantity
2. Add upsell product
3. Click main "ADD TO DEAL" button
4. **Expected:** Both main product + upsell in cart
5. **Expected:** Modal closes after main product added
6. **Expected:** Checkout shows correct total

### Scenario 4: Upsell Error Handling
1. Open modal with upsells
2. Disconnect network
3. Click "Add" on upsell
4. **Expected:** Error toast "Failed to add item"
5. **Expected:** Button resets to "Add"
6. **Expected:** No cart count change

### Scenario 5: Rapid Clicks
1. Open modal with upsells
2. Click same upsell button 5 times rapidly
3. **Expected:** Button disabled after first click
4. **Expected:** Only 1 item added to cart
5. **Expected:** No duplicate cart additions

### Scenario 6: Out of Stock Upsell
1. Set upsell product to 0 inventory
2. Open modal
3. Click "Add" on out-of-stock upsell
4. **Expected:** Error from Shopify API
5. **Expected:** Error toast shown
6. **Expected:** Button resets

---

## DATA SOURCE INVESTIGATION

**Need to run:**
```bash
# Find where upsells data is populated
grep -n "upsells\|upsellProducts" sections/section-bundle-builder-bf25.liquid | head -50

# Check for metafield usage
grep -n "metafields.*upsell" sections/section-bundle-builder-bf25.liquid | head -20

# Check window.productData structure
grep -n "window.productData" sections/section-bundle-builder-bf25.liquid assets/bf25-expansion-core.js | head -30
```

---

## NEXT STEPS

1. **Identify upsell data source** - Run investigation commands above
2. **Add variantId to upsell data** - Update data structure
3. **Implement addUpsellToCart method** - Add cart API call
4. **Update bindUpsellEvents** - Replace navigation with cart addition
5. **Add visual feedback** - Button states, toasts, cart count
6. **Test all scenarios** - Single, multiple, errors, rapid clicks
7. **Remove legacy snippet code** - Clean up unused upsell system
8. **Add analytics tracking** - Track upsell conversion rate

---

## QUESTIONS FOR USER

1. **Where does `product.upsells` data come from?**
   - Metafields?
   - Section settings?
   - JavaScript config?

2. **Should upsells support variant selection?**
   - Default to first variant?
   - Store specific variant ID in config?
   - Mini-modal for variant selection?

3. **Should main product + upsells be added together?**
   - Current: Separate cart additions
   - Alternative: Batch add when clicking "ADD TO DEAL"

4. **Should there be a combined pricing display?**
   - Show: "Main Product + 2 Upsells = €XX.XX"
   - Update dynamically as upsells are added

5. **What happens to upsells at checkout?**
   - Do they get tier discounts?
   - Are they separate line items?
   - Do they affect gift tier calculation?
