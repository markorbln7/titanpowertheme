# ACTIVE MODAL TEMPLATE EXTRACTION

**Purpose:** Identify which modal template is actually rendering on BF25 page
**Date:** 2025-11-24
**Context:** Pack buttons were added to buy-now-popup-bf25.liquid but may not be the active template

---

## EXTRACTION 1: Search for "Choose Your Pack" text

**Command:** `grep -rn "Choose Your Pack|CHOOSE YOUR PACK" sections/ snippets/ --include="*.liquid"`

**Results:**

```
snippets/buy-now-popup-bf25.liquid:112:  <h4 class="text-[14px] font-semibold text-[#333] mb-[10px]">Choose Your Pack:</h4>
```

**Finding:**
✅ "Choose Your Pack" exists ONLY in `buy-now-popup-bf25.liquid` line 112
- This is the new pack buttons system we just implemented
- If this text is NOT showing on the page, then `buy-now-popup-bf25.liquid` is NOT the active modal

---

## EXTRACTION 2: Search for "You May Also Like"

**Command:** `grep -rn "You May Also Like" sections/ snippets/ --include="*.liquid"`

**Results:**

```
snippets/buy-now-popup-bf25.liquid:473:                      <h4 class="text-[16px] font-semibold">You May Also Like:</h4>
snippets/buy-now-popup.liquid:134:                      <h4 class="text-[16px] font-semibold">You May Also Like:</h4>
```

**Finding:**
- "You May Also Like" exists in TWO files:
  1. `snippets/buy-now-popup-bf25.liquid` (line 473) - BF25 specific modal
  2. `snippets/buy-now-popup.liquid` (line 134) - Generic modal
- If upsell section is visible, need to check which file is rendering

---

## EXTRACTION 3: Search for "Customer Reviews"

**Command:** `grep -rn "Customer Reviews" sections/ snippets/ --include="*.liquid" | head -20`

**Results:**

```
snippets/buy-now-popup-bogof.liquid:83:                        <h3>Customer Reviews</h3>
```

**Finding:**
- "Customer Reviews" only in `snippets/buy-now-popup-bogof.liquid` (line 83)
- This is the BOGO (Buy One Get One) modal, NOT the BF25 modal
- If reviews are showing in modal, then `buy-now-popup-bogof.liquid` might be the active template

---

## EXTRACTION 4: List all BF25 related snippets

**Command:** `ls -la snippets/*bf25* snippets/*popup* snippets/*modal*`

**Results:**

```
-rw-r--r-- 1 tomo-titan tomo-titan  4470 Nov 24 09:35 snippets/bundle-card-bf25.liquid
-rw-r--r-- 1 tomo-titan tomo-titan  2270 Nov 13 16:14 snippets/bundle-popups.liquid
-rw-r--r-- 1 tomo-titan tomo-titan 24967 Nov 24 13:41 snippets/buy-now-popup-bf25.liquid
-rw-r--r-- 1 tomo-titan tomo-titan 24967 Nov 24 13:41 snippets/buy-now-popup-bf25.liquid
-rw-r--r-- 1 tomo-titan tomo-titan  7714 Nov 14 00:23 snippets/buy-now-popup-bogof.liquid
-rw-r--r-- 1 tomo-titan tomo-titan 15979 Nov 14 00:23 snippets/buy-now-popup.liquid
-rw-r--r-- 1 tomo-titan tomo-titan  1879 Nov 13 16:14 snippets/product-media-modal.liquid
```

**Finding:**
- **6 potential modal/popup snippets:**
  1. `bundle-card-bf25.liquid` (4.4 KB) - Product card, not modal
  2. `bundle-popups.liquid` (2.3 KB) - Generic popups
  3. `buy-now-popup-bf25.liquid` (25 KB) - **BF25 SPECIFIC MODAL** ← We edited this
  4. `buy-now-popup-bogof.liquid` (7.7 KB) - BOGO modal (has reviews)
  5. `buy-now-popup.liquid` (16 KB) - Generic modal
  6. `product-media-modal.liquid` (1.9 KB) - Image viewer modal

**Last Modified Dates:**
- `buy-now-popup-bf25.liquid`: Nov 24 13:41 (TODAY - our changes)
- `buy-now-popup-bogof.liquid`: Nov 14 00:23 (10 days ago)
- `buy-now-popup.liquid`: Nov 14 00:23 (10 days ago)

---

## EXTRACTION 5: Check section for modal render calls

**Command:** `grep -n "render.*popup|render.*modal|render.*expansion" sections/section-bundle-builder-bf25.liquid`

**Results:**

```
152:                  {% render 'buy-now-popup-bf25'
```

**Finding:**
✅ **CONFIRMED:** `sections/section-bundle-builder-bf25.liquid` line 152 renders `buy-now-popup-bf25`
- This is the correct snippet
- Our pack buttons implementation should be active

**Need to see full render context:**

---

## EXTRACTION 6: Check expansion core for modal logic

**Command:** `grep -n "modal|popup|expansion" assets/bf25-expansion-core.js | head -40`

**Results:**

```
8: * Purpose: Establish the core architecture for the dual-mode expansion modal.
134:   * Reset state to defaults (used when closing modal)
163: * - Update modal when variant changes
166:  constructor(expansionManager) {
167:    this.manager = expansionManager;
168:    this.state = expansionManager.state;
169:    this.config = expansionManager.config;
523:    const modalImage = document.querySelector('.bf25-modal-product-image');
524:    if (!modalImage) return;
527:    modalImage.style.opacity = '0.5';
530:      modalImage.src = variant.image;
531:      modalImage.style.opacity = '1';
629:  constructor(expansionManager) {
630:    this.manager = expansionManager;
631:    this.state = expansionManager.state;
632:    this.config = expansionManager.config;
924:    const modalQuantity = this.state.get('quantity') || 0;
926:    return cartQuantity + modalQuantity;
936:    // Get base pricing for current modal selection
943:    const modalQuantity = this.state.get('quantity');
944:    const combinedQuantity = cartQuantity + modalQuantity;
969:      modalQuantity,
1019:    const { hasCart, cartQuantity, modalQuantity, combinedQuantity, combinedTier, nextTierCombined, itemsToNextTierCombined, willUnlockTier } = pricing;
1037:      const itemWord = modalQuantity === 1 ? 'item' : 'items';
1043:            You have ${cartQuantity} in cart. Add these ${modalQuantity} ${itemWord} = ${combinedQuantity} total
1058:            You have ${cartQuantity} in cart${modalQuantity > 0 ? ` + ${modalQuantity} now = ${combinedQuantity} total` : ''}.
1126:   * Update pricing display in modal
1152:    const priceContainer = document.querySelector('.bf25-modal-pricing');
1224:      const pricingSection = document.querySelector('.bf25-modal-pricing');
1269:      const pricingSection = document.querySelector('.bf25-modal-pricing');
1293:    const { cartQuantity, modalQuantity, combinedQuantity, combinedTier, nextTierCombined, itemsToNextTierCombined } = pricing;
1316:          ${modalQuantity > 0 ? `
1319:                + <strong class="bf25-text-primary">${modalQuantity}</strong> now =
1332:            <div class="bf25-cart-progress-fill bf25-modal-fill"
1333:                 style="width: ${(modalQuantity / combinedQuantity) * Math.min(progressPercent, 100)}%"></div>
1369:  constructor(expansionManager) {
1370:    this.manager = expansionManager;
1371:    this.state = expansionManager.state;
1372:    this.config = expansionManager.config;
1756:    // Add to modal
```

**Finding:**
- `bf25-expansion-core.js` DOES interact with modal
- Key selectors used:
  - `.bf25-modal-product-image` (line 523)
  - `.bf25-modal-pricing` (line 1152, 1224, 1269)
  - `.bf25-cart-progress-fill.bf25-modal-fill` (line 1332)
- JavaScript queries DOM elements with `.bf25-modal-*` classes
- **These classes might NOT exist in `buy-now-popup-bf25.liquid`**

---

## CRITICAL ANALYSIS

### Issue 1: Class Name Mismatch

**JavaScript expects:**
```javascript
const modalImage = document.querySelector('.bf25-modal-product-image');
const priceContainer = document.querySelector('.bf25-modal-pricing');
```

**But `buy-now-popup-bf25.liquid` uses:**
```liquid
<img class="h-full w-full object-cover js-variant-image"/>  <!-- Line ~25 -->
<span class="js-variant-price">...</span>                    <!-- Generic classes -->
```

**Classes in buy-now-popup-bf25.liquid:**
- `.buy-now-popup` (wrapper)
- `.js-variant-image` (image)
- `.js-variant-price` (price)
- `.js-atc-bf` (add to cart button)

**Classes expansion-core.js expects:**
- `.bf25-modal-product-image`
- `.bf25-modal-pricing`
- `.bf25-modal-fill`

❌ **MISMATCH CONFIRMED**

### Issue 2: Modal Architecture Conflict

**Two Modal Systems Detected:**

1. **Legacy BOGO System** (buy-now-popup-bf25.liquid)
   - Uses old `.buy-now-popup` class structure
   - Has `.js-variant-*` selectors
   - Rendered via `{% render 'buy-now-popup-bf25' %}` (line 152)
   - **This is what we edited**

2. **New BF25 Expansion System** (bf25-expansion-core.js)
   - Expects `.bf25-modal-*` classes
   - Has state management via `expansionManager`
   - Dynamically creates/populates modal via JavaScript
   - **This is what's actually running**

### Issue 3: Potential Dynamic Modal Creation

From extraction 5, line 152 shows:
```liquid
{% render 'buy-now-popup-bf25'
```

But from extraction 6, the JavaScript file references:
- "dual-mode expansion modal" (line 8 comment)
- State management architecture
- Dynamic pricing updates

**Hypothesis:** The JavaScript might be:
1. Creating a NEW modal dynamically (not using the snippet)
2. OR populating the singleton modal container (lines 219-245 in section)
3. OR the snippet modal exists but JavaScript can't find it due to class mismatches

---

## NEXT STEPS TO INVESTIGATE

### Step 1: Check if singleton modal is being used
Look at `sections/section-bundle-builder-bf25.liquid` lines 219-245:
```liquid
<!-- MODAL CONTAINER (Singleton) -->
<div id="bf25-modal-container"
     class="bf25-modal-container"
     role="dialog"
     aria-modal="true"
     aria-labelledby="bf25-modal-title"
     aria-hidden="true"
     hidden>
  <!-- Modal Content (Populated Dynamically) -->
  <div class="bf25-modal-content">
    {%- comment -%}
      This will be populated via JavaScript in Prompt 6
      Content comes from window.productData + window.productVariants
    {%- endcomment -%}
  </div>
</div>
```

**If this is the active modal:**
- JavaScript populates it dynamically
- Our edits to `buy-now-popup-bf25.liquid` are NOT used
- Pack buttons need to be added via JavaScript or to the singleton template

### Step 2: Search for modal population logic
Need to find where `bf25-modal-content` gets populated:
```bash
grep -n "bf25-modal-content\|bf25-modal-container" assets/*.js
```

### Step 3: Check what's actually rendering
Look at browser DevTools:
1. Inspect modal when open
2. Check classes: `.bf25-modal-*` vs `.buy-now-popup`
3. Check if modal has `id="bf25-modal-container"`

---

## CONCLUSION

**Problem Identified:**
We edited `snippets/buy-now-popup-bf25.liquid` but there are TWO possible modal systems:

1. **Legacy rendered snippet** (`buy-now-popup-bf25.liquid`)
   - Rendered at section line 152
   - Uses `.buy-now-popup` classes
   - Has all HTML pre-rendered
   - **We added pack buttons here**

2. **Dynamic singleton modal** (lines 219-245 in section)
   - Container: `#bf25-modal-container`
   - Content: Populated by JavaScript
   - Uses `.bf25-modal-*` classes
   - **Empty template, JS fills it**

**Most Likely Scenario:**
The singleton modal (#bf25-modal-container) is the active one, and `bf25-expansion-core.js` populates it dynamically. Our edits to `buy-now-popup-bf25.liquid` are being rendered but NOT displayed.

**Required Action:**
1. Confirm which modal is active by checking browser DevTools
2. If singleton is active → pack buttons need to be added via JavaScript
3. If snippet is active → need to fix JavaScript class selectors to match snippet classes

**Next Extraction Needed:**
```bash
grep -n "bf25-modal-content\|innerHTML\|createElement.*modal" assets/bf25-expansion-core.js
```

This will show how the singleton modal gets populated.
