# UPSELL METAFIELD EXTRACTION

**Purpose:** Understand how upsell data flows from Shopify metafields to modal
**Date:** 2025-11-24
**Files Analyzed:** `sections/section-bundle-builder-bf25.liquid`, `assets/bf25-expansion-core.js`

---

## EXTRACTION 1: Metafield Upsell Data (Lines 56-57)

### Metafield Assignment at Product Loop Level

```liquid
{% for product in collection_obj.products %}
  {% assign product_description = product.metafields.custom.product_description | metafield_tag %}
  {% assign upsell_product_one = product.metafields.custom.first_upsell_product %}
  {% assign upsell_product_two = product.metafields.custom.second_upsell_product %}
```

**Critical Finding:**
- Upsells come from **Shopify metafields** (custom namespace)
- Metafield keys:
  - `product.metafields.custom.first_upsell_product`
  - `product.metafields.custom.second_upsell_product`
- Maximum: **2 upsells per product**
- Metafield type: **Product reference** (stores reference to another product)

---

## EXTRACTION 2: Upsells Array Construction (Lines 493-516)

### Full Upsell Data Structure in window.productData

```javascript
upsells: [
  {%- if product.metafields.custom.first_upsell_product.value -%}
    {
      id: "{{ product.metafields.custom.first_upsell_product.value.id }}",
      title: {{ product.metafields.custom.first_upsell_product.value.title | json }},
      handle: "{{ product.metafields.custom.first_upsell_product.value.handle }}",
      price: {{ product.metafields.custom.first_upsell_product.value.price }},
      comparePrice: {{ product.metafields.custom.first_upsell_product.value.compare_at_price | default: 0 }},
      image: "{{ product.metafields.custom.first_upsell_product.value.featured_image | img_url: '400x400' }}",
      url: "{{ product.metafields.custom.first_upsell_product.value.url }}"
    }{%- if product.metafields.custom.second_upsell_product.value -%},{%- endif -%}
  {%- endif -%}
  {%- if product.metafields.custom.second_upsell_product.value -%}
    {
      id: "{{ product.metafields.custom.second_upsell_product.value.id }}",
      title: {{ product.metafields.custom.second_upsell_product.value.title | json }},
      handle: "{{ product.metafields.custom.second_upsell_product.value.handle }}",
      price: {{ product.metafields.custom.second_upsell_product.value.price }},
      comparePrice: {{ product.metafields.custom.second_upsell_product.value.compare_at_price | default: 0 }},
      image: "{{ product.metafields.custom.second_upsell_product.value.featured_image | img_url: '400x400' }}",
      url: "{{ product.metafields.custom.second_upsell_product.value.url }}"
    }
  {%- endif -%}
],
```

### Upsell Object Structure

```javascript
{
  id: "8660340179122",           // Product ID (string)
  title: "Ultra Power Bank 20000mAh",
  handle: "ultra-power-bank",
  price: 2990,                    // Cents
  comparePrice: 4990,             // Cents (original price)
  image: "https://cdn.shopify.com/.../400x400.jpg",
  url: "/products/ultra-power-bank"
}
```

**Critical Issues Identified:**

1. **Missing Variant ID:**
   - ❌ Only has product ID, not variant ID
   - ❌ Cannot add to cart without variant ID
   - ❌ Product might have multiple variants (color, size)

2. **Fixed 2 Upsell Limit:**
   - ❌ Hardcoded to 2 metafields max
   - ❌ Cannot dynamically expand

3. **No First Available Variant:**
   - ⚠️ Need to fetch `selected_or_first_available_variant.id`

---

## EXTRACTION 3: window.productData Structure (Lines 428-523)

### Complete Product Data Object

```javascript
window.productData["{{ product.id }}"] = {
  // ─────────────────────────────────────────────────────────
  // Basic Product Info
  // ─────────────────────────────────────────────────────────
  id: "{{ product.id }}",
  handle: "{{ product.handle }}",
  title: {{ product.title | json }},

  // ─────────────────────────────────────────────────────────
  // Pricing (in cents for precise calculations)
  // ─────────────────────────────────────────────────────────
  basePrice: {{ product.price }},
  comparePrice: {{ product.compare_at_price | default: 0 }},

  // ─────────────────────────────────────────────────────────
  // Images
  // ─────────────────────────────────────────────────────────
  featuredImage: "{{ product.featured_image | img_url: 'master' }}",
  {% if product.metafields.custom.popup_image %}
  popupImage: "{{ product.metafields.custom.popup_image | img_url: 'master' }}",
  {% endif %}

  // ─────────────────────────────────────────────────────────
  // Content (Rich Text) - BF25-FIX-011
  // ─────────────────────────────────────────────────────────
  description: {{ desc_rendered | json }},
  ticks: {{ product.metafields.custom.ticks | json }},

  // ─────────────────────────────────────────────────────────
  // Reviews (from reviews.* namespace)
  // ─────────────────────────────────────────────────────────
  reviewRating: {{ product.metafields.reviews.rating | default: 0 }},
  reviewCount: {{ product.metafields.reviews.count | default: 0 }},

  // ─────────────────────────────────────────────────────────
  // Stock & Inventory
  // ─────────────────────────────────────────────────────────
  stockLevel: {{ product.selected_or_first_available_variant.inventory_quantity | default: 0 }},
  available: {{ product.available | json }},

  // ─────────────────────────────────────────────────────────
  // Upsell Products (Full details from metafields)
  // ─────────────────────────────────────────────────────────
  upsells: [
    // ... (from Extraction 2)
  ],

  // ─────────────────────────────────────────────────────────
  // Product Classification
  // ─────────────────────────────────────────────────────────
  productType: {{ product.type | json }},
  tags: {{ product.tags | json }},
  vendor: {{ product.vendor | json }}
};
```

**Debug Logging (Lines 541-555):**
```javascript
const productCount = Object.keys(window.productData).length;
console.log('📦 Products Loaded:', productCount);

if (productCount > 0) {
  const sampleProductId = Object.keys(window.productData)[0];
  const sampleProduct = window.productData[sampleProductId];
  console.log('📄 Sample Product:', {
    id: sampleProduct.id,
    title: sampleProduct.title,
    basePrice: sampleProduct.basePrice,
    reviewRating: sampleProduct.reviewRating,
    hasDescription: !!sampleProduct.description,
    hasUpsells: sampleProduct.upsells.length > 0
  });
}
```

**Important:** Debug logging confirms `hasUpsells: sampleProduct.upsells.length > 0` check exists.

---

## EXTRACTION 4: Variant ID Handling (Lines 160, 182, 194, 487)

### Selected or First Available Variant Pattern

**Line 160 (Product ID attribute):**
```liquid
product_id: product.selected_or_first_available_variant.id,
```

**Line 182 (Window.productVariants variant ID):**
```liquid
id: {{ variant.id | json }},
```

**Line 194 (Variant featured image):**
```liquid
src: {{ variant.featured_image.src | image_url: width: 800 | json }},
```

**Line 487 (Stock level from first variant):**
```liquid
stockLevel: {{ product.selected_or_first_available_variant.inventory_quantity | default: 0 }},
```

**Pattern Identified:**
- Main product uses `product.selected_or_first_available_variant.id`
- This gets the default variant ID for products with multiple variants
- **Upsells DO NOT use this pattern** ❌

---

## EXTRACTION 5: selectedUpsells Initialization (Lines 4278-4280, 4324, 1478-1485)

### JavaScript selectedUpsells Map

**Initialization in bindUpsellEvents() (Lines 4278-4280):**
```javascript
// Initialize selected upsells tracking
if (!this.selectedUpsells) {
  this.selectedUpsells = new Map();
}
```

**Storage on Selection (Lines 4330-4336):**
```javascript
// Select
card.classList.add('is-selected');
card.setAttribute('aria-checked', 'true');
this.selectedUpsells.set(variantId, {
  variantId: parseInt(variantId, 10),
  productId: parseInt(productId, 10),
  title: title,
  price: price
});
```

**Deletion on Deselection (Line 4324):**
```javascript
this.selectedUpsells.delete(variantId);
```

**Retrieval for Cart Addition (Lines 1478-1485):**
```javascript
// After main product added, add selected upsells
const selectedUpsells = this.manager.getSelectedUpsells();
if (selectedUpsells.length > 0) {
  if (this.config.debug) {
    console.log(`🛒 Adding ${selectedUpsells.length} selected upsell(s)...`);
  }

  const product = window.productData[this.state.get('productId')];
  for (const upsell of selectedUpsells) {
    // ... add to cart via /cart/add.js
  }
}
```

**Data Structure:**
```javascript
selectedUpsells = Map {
  "8660340179122" => {
    variantId: 8660340179122,
    productId: 123456,
    title: "Ultra Power Bank",
    price: 2990
  },
  "8363826348210" => {
    variantId: 8363826348210,
    productId: 789012,
    title: "USB-C Cable",
    price: 1490
  }
}
```

**Key Methods:**
- `this.selectedUpsells.set(id, data)` - Add/update selection
- `this.selectedUpsells.delete(id)` - Remove selection
- `this.selectedUpsells.clear()` - Clear all selections
- `this.manager.getSelectedUpsells()` - Get array of selected upsell objects

---

## CRITICAL PROBLEM: Missing Variant ID in Upsells

### Current Flow (BROKEN)

1. **Liquid Template (section-bundle-builder-bf25.liquid):**
   ```liquid
   upsells: [
     {
       id: "{{ product.metafields.custom.first_upsell_product.value.id }}",
       // ❌ This is PRODUCT ID, not VARIANT ID
     }
   ]
   ```

2. **JavaScript HTML Generation (bf25-expansion-core.js:4692):**
   ```javascript
   const variantId = upsell.variantId || upsell.variant_id || upsell.id;
   ```
   - Falls back to `upsell.id` (product ID) ❌
   - Cannot add to cart with product ID alone

3. **Cart Addition (bf25-expansion-core.js:1494):**
   ```javascript
   body: JSON.stringify({
     id: upsell.variantId,  // ❌ This will be a PRODUCT ID, not VARIANT ID
     quantity: 1
   })
   ```
   - Shopify `/cart/add.js` requires **variant ID**, not product ID
   - **This will fail** ❌

---

## SOLUTION: Add Variant ID to Upsell Data

### Update Liquid Template

**Find the upsell data structure (around line 493) and ADD variant ID:**

```liquid
upsells: [
  {%- if product.metafields.custom.first_upsell_product.value -%}
    {
      id: "{{ product.metafields.custom.first_upsell_product.value.id }}",
      variantId: {{ product.metafields.custom.first_upsell_product.value.selected_or_first_available_variant.id }},
      title: {{ product.metafields.custom.first_upsell_product.value.title | json }},
      handle: "{{ product.metafields.custom.first_upsell_product.value.handle }}",
      price: {{ product.metafields.custom.first_upsell_product.value.price }},
      comparePrice: {{ product.metafields.custom.first_upsell_product.value.compare_at_price | default: 0 }},
      image: "{{ product.metafields.custom.first_upsell_product.value.featured_image | img_url: '400x400' }}",
      url: "{{ product.metafields.custom.first_upsell_product.value.url }}"
    }{%- if product.metafields.custom.second_upsell_product.value -%},{%- endif -%}
  {%- endif -%}
  {%- if product.metafields.custom.second_upsell_product.value -%}
    {
      id: "{{ product.metafields.custom.second_upsell_product.value.id }}",
      variantId: {{ product.metafields.custom.second_upsell_product.value.selected_or_first_available_variant.id }},
      title: {{ product.metafields.custom.second_upsell_product.value.title | json }},
      handle: "{{ product.metafields.custom.second_upsell_product.value.handle }}",
      price: {{ product.metafields.custom.second_upsell_product.value.price }},
      comparePrice: {{ product.metafields.custom.second_upsell_product.value.compare_at_price | default: 0 }},
      image: "{{ product.metafields.custom.second_upsell_product.value.featured_image | img_url: '400x400' }}",
      url: "{{ product.metafields.custom.second_upsell_product.value.url }}"
    }
  {%- endif -%}
],
```

**Key Change:**
```liquid
variantId: {{ product.metafields.custom.first_upsell_product.value.selected_or_first_available_variant.id }},
```

This uses the same pattern as line 487 to get the default variant ID.

---

## TESTING CHECKLIST

### Test 1: Verify Upsell Data Structure
1. Open browser console on BF25 page
2. Run: `console.log(window.productData)`
3. Inspect upsells array for first product
4. **Expected:** Each upsell has `variantId` field (number, not string)
5. **Verify:** `variantId` is different from `id` (variant ID vs product ID)

### Test 2: Verify Upsell Selection
1. Open modal with upsells
2. Click upsell card to select
3. Console shows: `✅ Upsell selected: [title]`
4. Check console: `console.log(manager.selectedUpsells)`
5. **Expected:** Map with variantId as key

### Test 3: Verify Cart Addition
1. Select 1 upsell
2. Click "ADD TO DEAL"
3. Console shows: `🛒 Adding 1 selected upsell(s)...`
4. Console shows: `✅ Upsell added: [title]`
5. Check cart: `fetch('/cart.js').then(r => r.json()).then(console.log)`
6. **Expected:** Both main product AND upsell in cart

### Test 4: Verify Variant ID is Used
1. Find an upsell product with multiple variants (e.g., different colors)
2. Add as upsell
3. Check cart response
4. **Expected:** First available variant was added (not a random/wrong variant)

### Test 5: Verify Multiple Upsells
1. Select 2 upsells
2. Click "ADD TO DEAL"
3. **Expected:** Main product + 2 upsells in cart (3 line items)

---

## DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. SHOPIFY METAFIELDS (Admin Configuration)                    │
│    product.metafields.custom.first_upsell_product              │
│    product.metafields.custom.second_upsell_product             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. LIQUID TEMPLATE (Server-Side Rendering)                     │
│    section-bundle-builder-bf25.liquid (Lines 493-516)          │
│    - Accesses metafield.value (product reference)              │
│    - Extracts: id, title, price, image, url                    │
│    - NEW: variantId from selected_or_first_available_variant   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. JAVASCRIPT GLOBAL OBJECT (Client-Side)                      │
│    window.productData[productId].upsells = [...]                │
│    - Available to all JavaScript on page                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. MODAL HTML GENERATION (Dynamic)                             │
│    bf25-expansion-core.js (Lines 4679-4731)                     │
│    - Reads product.upsells from window.productData              │
│    - Generates <div class="bf25-upsell-card">                   │
│    - Sets data-variant-id attribute                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. USER INTERACTION (Click/Keyboard)                           │
│    - User clicks upsell card                                    │
│    - toggleUpsellSelection() called                             │
│    - Stores in this.selectedUpsells Map                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. CART ADDITION (Main Product + Upsells)                      │
│    bf25-expansion-core.js (Lines 1477-1514)                     │
│    - Main product added via /cart/add.js                        │
│    - Loop through selectedUpsells                               │
│    - Each upsell added via /cart/add.js with variantId          │
└─────────────────────────────────────────────────────────────────┘
```

---

## METAFIELD CONFIGURATION (For Reference)

### How to Set Up Upsells in Shopify Admin

1. **Navigate to:** Settings → Custom data → Products → Metafields
2. **Create metafield:**
   - **Namespace:** `custom`
   - **Key:** `first_upsell_product`
   - **Type:** Product reference (single)
   - **Description:** First recommended upsell product for bundle builder
3. **Repeat for second upsell:**
   - **Key:** `second_upsell_product`
4. **Assign to products:**
   - Edit any product in bundle builder collection
   - Scroll to metafields section
   - Select upsell products from dropdown

**Metafield Limits:**
- ✅ Can store any product from catalog
- ✅ Automatically syncs price, title, images
- ❌ Cannot store arrays (hence 2 separate metafields)
- ❌ Cannot exceed 2 upsells per product (Liquid template limitation)

---

## NEXT STEPS

1. **Add variantId to Liquid template** (section-bundle-builder-bf25.liquid line 493-516)
2. **Test upsell selection** with browser console
3. **Verify cart addition** works with variant IDs
4. **Check for products with multiple variants** (color/size options)
5. **Ensure correct variant is added** (first available, not random)

---

## POTENTIAL FUTURE ENHANCEMENTS

### Support More Than 2 Upsells

**Option A: Multiple Metafields**
```liquid
{% assign upsell_product_three = product.metafields.custom.third_upsell_product %}
{% assign upsell_product_four = product.metafields.custom.fourth_upsell_product %}
```

**Option B: Product List Metafield**
```liquid
{% assign upsell_products = product.metafields.custom.upsell_products %}
{% for upsell in upsell_products.value %}
  {
    id: "{{ upsell.id }}",
    variantId: {{ upsell.selected_or_first_available_variant.id }},
    // ...
  }
{% endfor %}
```

**Recommendation:** Use **Option B** (Product list metafield) for unlimited upsells.

### Smart Upsell Recommendations

**Current:** Manual metafield configuration
**Future:** Algorithmic recommendations based on:
- Purchase history
- Cart contents
- Product tags/categories
- Bestsellers
- Inventory levels

Could integrate with Shopify's built-in recommendations API.

---

## SUMMARY

**Upsell Data Flow:**
1. ✅ Metafields store product references
2. ✅ Liquid template outputs to window.productData
3. ✅ JavaScript generates HTML with data attributes
4. ✅ User selects upsells (stored in Map)
5. ❌ **BROKEN:** Missing variantId causes cart addition to fail
6. 🔧 **FIX NEEDED:** Add `selected_or_first_available_variant.id` to template

**Files to Modify:**
- `sections/section-bundle-builder-bf25.liquid` (lines 496, 507) - Add variantId field

**Files Already Updated:**
- ✅ `assets/bf25-expansion-core.js` - Toggle selection system implemented
- ✅ `assets/bf25-modal-design.css` - Checkbox styling added
