# BF25 Modal System - Diagnostic Check

## ✅ SCHEMA FIX APPLIED

**Issue Fixed:** Schema label too long error
- **Before:** "⚡ Power Packs (Tier Buttons - Recommended for BF25)" (58 characters)
- **After:** "Power Packs (Tier Buttons)" (26 characters)

**Location:** `sections/section-bundle-builder-bf25.liquid` line 501

---

## 🔍 VERIFICATION STEPS

### Step 1: Check Shopify Customizer

1. Go to Shopify Admin → Online Store → Themes
2. Click "Customize" on your theme
3. The section should now load without errors
4. Look for the "bundle build bf25" section in the customizer

**Expected:** No schema errors, section loads properly

---

### Step 2: Check Browser Console

1. Open your Black Friday page with the section
2. Press F12 to open Developer Tools
3. Click the "Console" tab
4. Look for this message:

```
🚀 BF25 Data Layer Initialized - Prompt 1
   Mode: power_packs
   Tiers: 4 defined
   📦 Products Loaded: X
   ✅ window.productVariants preserved
```

**Expected:** Debug messages showing successful initialization

---

### Step 3: Check Window Objects

In the browser console, run:

```javascript
// Check configuration loaded
console.log('Config:', window.bf25Config);

// Check product data loaded
console.log('Products:', Object.keys(window.productData).length);

// Check variant data loaded
console.log('Variants:', Object.keys(window.productVariants).length);

// Check modal manager initialized
console.log('Expansion Manager:', window.bf25Expansion);

// Check ExpansionManager class exists
console.log('Class exists:', typeof ExpansionManager);

// Check assets loaded
console.log('CSS loaded:', !!document.querySelector('link[href*="bf25-modal-design"]'));
console.log('JS loaded:', !!document.querySelector('script[src*="bf25-expansion-core"]'));
```

**Expected Output:**
```
Config: {mode: "power_packs", tiers: Array(4), animation: {…}, debug: true}
Products: 27 (or however many products you have)
Variants: 27
Expansion Manager: ExpansionManager {state: ModalState, container: div#bf25-modal-container, ...}
Class exists: "function"
CSS loaded: true
JS loaded: true
```

---

### Step 4: Check Product Cards

```javascript
// Check product cards exist
const cards = document.querySelectorAll('[data-product-id]');
console.log('Product cards found:', cards.length);

// Check first card has proper attributes
if (cards.length > 0) {
  const firstCard = cards[0];
  console.log('First card product ID:', firstCard.dataset.productId);
  console.log('Card has click handler:', firstCard.hasAttribute('role'));
  console.log('Card is focusable:', firstCard.hasAttribute('tabindex'));
}
```

**Expected:**
```
Product cards found: 27 (or your product count)
First card product ID: 8675309 (some product ID)
Card has click handler: true
Card is focusable: true
```

---

### Step 5: Test Modal Opening

**Manual Test:**
1. Click on any product card
2. Modal should open with smooth FLIP animation
3. Check console for this message:
   ```
   🚀 Opening Modal
      Product ID: 8675309
      Product Data: {...}
      Card Element: <article>
   ```

**JavaScript Test:**
```javascript
// Find first product card
const card = document.querySelector('[data-product-id]');
const productId = card.dataset.productId;

// Trigger modal open (simulates click)
if (window.bf25Expansion) {
  window.bf25Expansion.open(card, productId);
} else {
  console.error('ExpansionManager not initialized!');
}
```

**Expected:** Modal opens smoothly

---

### Step 6: Check for Errors

```javascript
// Check for JavaScript errors
console.log('Any errors?',
  performance.getEntriesByType('navigation')[0].type === 'reload' ?
  'Check console history' : 'No reload needed'
);

// Check modal DOM exists
console.log('Modal container exists:', !!document.getElementById('bf25-modal-container'));
console.log('Modal overlay exists:', !!document.getElementById('bf25-modal-overlay'));
```

**Expected:**
```
Any errors? No errors found
Modal container exists: true
Modal overlay exists: true
```

---

## 🚨 TROUBLESHOOTING

### Issue: "ExpansionManager is not defined"

**Cause:** JavaScript file not loaded or loaded before DOM ready

**Fix:**
1. Check `bf25-expansion-core.js` exists in assets folder
2. Verify it's included in section: `<script src="{{ 'bf25-expansion-core.js' | asset_url }}" defer></script>`
3. Check file has no syntax errors (open in code editor)
4. Clear browser cache (Ctrl+Shift+R)

---

### Issue: "window.productData is empty"

**Cause:** Products not rendering in Liquid loop

**Fix:**
1. Check section settings has collections selected
2. Verify collections have products
3. Check Liquid loop is running:
   ```liquid
   {% for collection in section.settings.collections %}
     {% for product in collection.products %}
       // Should output product data here
     {% endfor %}
   {% endfor %}
   ```

---

### Issue: "Modal won't open when clicking cards"

**Cause:** Event listeners not attached or card missing attributes

**Fix:**
1. Check cards have `data-product-id` attribute
2. Check cards have `role="button"` and `tabindex="0"`
3. Verify click handler is bound:
   ```javascript
   // Should see this in bf25-expansion-core.js around line 2055
   document.addEventListener('click', (e) => {
     const card = e.target.closest('.bf25-product-card');
     // ...
   });
   ```
4. Check no JavaScript errors blocking execution

---

### Issue: "Schema still shows error"

**Cause:** Changes not saved or cached

**Fix:**
1. Verify file saved in theme editor
2. Hard refresh browser (Ctrl+Shift+R)
3. Try in incognito window
4. Check schema JSON is valid (no missing commas, brackets)

---

## ✅ SUCCESS CHECKLIST

When everything is working, you should have:

- [ ] No schema errors in Shopify Customizer
- [ ] Section loads in customizer without issues
- [ ] Browser console shows initialization messages
- [ ] `window.bf25Config` exists and has correct mode
- [ ] `window.productData` has products (count > 0)
- [ ] `window.productVariants` has variants (count > 0)
- [ ] `window.bf25Expansion` is initialized
- [ ] Product cards have `data-product-id` attributes
- [ ] Clicking product card opens modal
- [ ] Modal shows product details
- [ ] Close button works
- [ ] ESC key closes modal
- [ ] No JavaScript errors in console

---

## 📊 COMPLETE DIAGNOSTIC SCRIPT

Run this all at once for a full health check:

```javascript
console.group('🔍 BF25 Modal System Diagnostic');

// 1. Configuration Check
console.log('1️⃣ Configuration:');
console.log('   Mode:', window.bf25Config?.mode);
console.log('   Tiers:', window.bf25Config?.tiers?.length);
console.log('   Debug:', window.bf25Config?.debug);

// 2. Data Layer Check
console.log('\n2️⃣ Data Layer:');
console.log('   Products:', Object.keys(window.productData || {}).length);
console.log('   Variants:', Object.keys(window.productVariants || {}).length);

// 3. Manager Check
console.log('\n3️⃣ Expansion Manager:');
console.log('   Initialized:', !!window.bf25Expansion);
console.log('   Class exists:', typeof ExpansionManager);
if (window.bf25Expansion) {
  console.log('   State:', window.bf25Expansion.state.getAll());
}

// 4. Asset Check
console.log('\n4️⃣ Assets:');
const cssLoaded = !!document.querySelector('link[href*="bf25-modal-design"]');
const jsLoaded = !!document.querySelector('script[src*="bf25-expansion-core"]');
console.log('   CSS loaded:', cssLoaded);
console.log('   JS loaded:', jsLoaded);

// 5. DOM Check
console.log('\n5️⃣ DOM Elements:');
const container = document.getElementById('bf25-modal-container');
const overlay = document.getElementById('bf25-modal-overlay');
const cards = document.querySelectorAll('[data-product-id]');
console.log('   Modal container:', !!container);
console.log('   Modal overlay:', !!overlay);
console.log('   Product cards:', cards.length);

// 6. Sample Product Check
if (cards.length > 0) {
  console.log('\n6️⃣ Sample Product Card:');
  const card = cards[0];
  const productId = card.dataset.productId;
  console.log('   Product ID:', productId);
  console.log('   Has role:', card.hasAttribute('role'));
  console.log('   Is focusable:', card.hasAttribute('tabindex'));
  console.log('   Product data exists:', !!window.productData[productId]);
  console.log('   Variant data exists:', !!window.productVariants[productId]);
}

// 7. Overall Health
console.log('\n7️⃣ System Health:');
const isHealthy =
  window.bf25Config &&
  window.productData &&
  Object.keys(window.productData).length > 0 &&
  window.bf25Expansion &&
  container &&
  overlay &&
  cards.length > 0 &&
  cssLoaded &&
  jsLoaded;

console.log('   Status:', isHealthy ? '✅ HEALTHY' : '❌ ISSUES DETECTED');

if (!isHealthy) {
  console.log('\n⚠️ Issues Found:');
  if (!window.bf25Config) console.log('   - bf25Config not loaded');
  if (!window.productData || Object.keys(window.productData).length === 0) console.log('   - productData empty');
  if (!window.bf25Expansion) console.log('   - ExpansionManager not initialized');
  if (!container) console.log('   - Modal container missing');
  if (!overlay) console.log('   - Modal overlay missing');
  if (cards.length === 0) console.log('   - No product cards found');
  if (!cssLoaded) console.log('   - CSS not loaded');
  if (!jsLoaded) console.log('   - JavaScript not loaded');
}

console.groupEnd();

// Return summary object
({
  healthy: isHealthy,
  config: !!window.bf25Config,
  products: Object.keys(window.productData || {}).length,
  variants: Object.keys(window.productVariants || {}).length,
  manager: !!window.bf25Expansion,
  cards: cards.length
});
```

**Copy and paste this entire script into your browser console for instant diagnosis!**

---

## 🎯 EXPECTED RESULT

When everything is working correctly, you should see:

```
🔍 BF25 Modal System Diagnostic

1️⃣ Configuration:
   Mode: power_packs
   Tiers: 4
   Debug: true

2️⃣ Data Layer:
   Products: 27
   Variants: 27

3️⃣ Expansion Manager:
   Initialized: true
   Class exists: "function"
   State: {isOpen: false, isAnimating: false, ...}

4️⃣ Assets:
   CSS loaded: true
   JS loaded: true

5️⃣ DOM Elements:
   Modal container: true
   Modal overlay: true
   Product cards: 27

6️⃣ Sample Product Card:
   Product ID: 8675309
   Has role: true
   Is focusable: true
   Product data exists: true
   Variant data exists: true

7️⃣ System Health:
   Status: ✅ HEALTHY

{healthy: true, config: true, products: 27, variants: 27, manager: true, cards: 27}
```

---

## 📞 NEXT STEPS

1. **Save the section file** (schema fix applied)
2. **Refresh Shopify Customizer** (should load without errors)
3. **Open your BF25 page** in browser
4. **Run the diagnostic script** (copy/paste from above)
5. **Share results** if you see any issues

**The schema error should now be fixed! 🎉**
