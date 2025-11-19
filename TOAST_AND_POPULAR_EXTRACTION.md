# TOAST NOTIFICATIONS & POPULAR BADGES EXTRACTION

**Date:** 2025-11-15
**Branch:** bf-2025
**Purpose:** Extract code for optimization
**Prompt Code:** SH-TOAST-POPULAR-EXTRACT-001

---

## 1. TOAST NOTIFICATION SYSTEM

### JavaScript Implementation

**Primary Function:** `showBogoToast()`
**File:** assets/bogo-builder.js
**Lines:** 267-289

```javascript
function showBogoToast(message, type = 'success', duration = 3000) {
  // Remove any existing toasts
  document.querySelectorAll('.bogo-toast').forEach(t => t.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `bogo-toast ${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

**Secondary Function:** `showNotification()` (Legacy)
**File:** assets/bogo-builder.js
**Lines:** 5712-5739

```javascript
function showNotification(message) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(96, 198, 85, 0.95);
    color: white;
    padding: 16px 32px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    font-size: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease-out;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
```

**Note:** Two different toast systems exist! `showNotification()` is legacy inline-styled version.

---

### Function Parameters

**showBogoToast:**
- `message`: string - The text to display
- `type`: 'success' | 'error' | 'warning' | 'info' (default: 'success')
- `duration`: number in milliseconds (default: 3000ms = 3 seconds)

**showNotification:**
- `message`: string - The text to display
- Fixed duration: 2000ms (2 seconds)
- No type parameter (always green success style)

---

### Current Timing

**showBogoToast:**
- Auto-dismiss after: 3000ms (default), configurable
- Fade in: 300ms (CSS animation)
- Fade out: 300ms (CSS animation)
- Total display time: ~3.6 seconds

**showNotification:**
- Auto-dismiss after: 2000ms (fixed)
- Fade out: 300ms
- Total display time: ~2.3 seconds

---

### Called From (showBogoToast)

**Success Messages:**
- Line 1091: Tier unlock celebration
- Line 2846: Pair removed from review modal
- Line 6606: All pairs cleared

**Error Messages:**
- Line 2788: Error removing pair
- Line 6566: No pairs to clear
- Line 6640: No pairs added before checkout
- Line 6652: Incomplete pairs before checkout
- Line 6811: Checkout failed

**Info Messages:**
- Line 7255: Checkout cancelled (back button)

---

### Called From (showNotification - Legacy)

- Line 814: Please select all variant options
- Line 830: Variant not available
- Line 929: Product added to Pair X (Slot 1)
- Line 944: Pair full! Lock in your pair
- Line 1050: Pair removed
- Line 2703: Pair removed

**⚠️ ISSUE:** Two toast systems are being used inconsistently!

---

## 2. TOAST CSS STYLING

### Main Toast Styles

**File:** assets/bogo-builder.css
**Lines:** 6942-7003

```css
.bogo-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid rgba(96, 198, 85, 0.5);
  font-size: 14px;
  font-weight: 600;
  z-index: 100001 !important; /* Above modals and header */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  animation: toastSlideIn 300ms ease forwards;
}

.bogo-toast.success {
  border-color: rgba(96, 198, 85, 0.7);
}

.bogo-toast.success .toast-icon {
  color: #60c655;
}

.bogo-toast.error {
  border-color: rgba(239, 68, 68, 0.7);
}

.bogo-toast.error .toast-icon {
  color: #ef4444;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

.bogo-toast.hiding {
  animation: toastSlideOut 300ms ease forwards;
}
```

---

### Mobile Adjustments

**File:** assets/bogo-builder.css
**Lines:** 7006-7024

```css
/* Mobile adjustments */
@media (max-width: 768px) {
  .bogo-toast {
    bottom: 80px; /* Above sticky cart */
    left: 16px;
    right: 16px;
    transform: none;
    width: auto;
  }

  @keyframes toastSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toastSlideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
}
```

---

### Current Dimensions

**Desktop:**
- Width: auto (centered via transform)
- Min-width: Not set (relies on content)
- Max-width: Not set
- Padding: 16px (vertical) × 24px (horizontal)
- Font size: 14px
- Font weight: 600
- Position: Fixed, bottom 24px, centered
- Border radius: 12px
- Gap between icon and text: 12px

**Mobile (≤768px):**
- Width: auto (calculated by left: 16px + right: 16px)
- Effective max-width: calc(100vw - 32px)
- Padding: 16px × 24px (SAME AS DESKTOP - ISSUE!)
- Font size: 14px (SAME AS DESKTOP)
- Position: Fixed, bottom 80px (above sticky cart)
- Left/Right margins: 16px each

---

### Visual Properties

- Background: rgba(0, 0, 0, 0.95) - near-black with 95% opacity
- Text color: #ffffff - white
- Border (success): 1px solid rgba(96, 198, 85, 0.7) - green with 70% opacity
- Border (error): 1px solid rgba(239, 68, 68, 0.7) - red with 70% opacity
- Box shadow: 0 8px 24px rgba(0, 0, 0, 0.8) - strong black shadow
- Z-index: 100001 !important

**Icon Colors:**
- Success icon: #60c655 - bright green
- Error icon: #ef4444 - bright red

---

### HTML Structure

```html
<div class="bogo-toast success">
  <span class="toast-icon">✓</span>
  <span class="toast-message">Product added to Pair 1 (Slot 1) ✓</span>
</div>
```

**DOM Insertion:**
- Appended directly to `document.body`
- Removes any existing `.bogo-toast` elements before creating new one
- Only one toast visible at a time

---

## 3. CURRENT ISSUES (User Feedback Analysis)

### Size Issues

**Mobile Padding:**
- Current: 16px × 24px
- Issue: Too much padding on small screens
- Takes up excessive vertical space
- Proposed: 10px × 16px (37% reduction in padding)

**Mobile Width:**
- Current: calc(100vw - 32px) = full width minus 32px total margins
- Issue: Too wide, feels overwhelming
- Proposed: max-width: 90% or ~320px

### Readability Issues

**Font Size:**
- Current: 14px on both desktop and mobile
- Mobile issue: May be too small on some devices, but user says "hard to read"
- Likely issue is contrast/weight, not size
- Font weight: 600 (semi-bold) - acceptable
- No text-shadow applied to message text
- Proposed: Keep 14px but improve contrast

**Text Contrast:**
- Background: rgba(0, 0, 0, 0.95) - very dark
- Text: #ffffff - white
- Contrast ratio: ~20:1 (excellent for normal use)
- Issue may be the ICON + MESSAGE layout causing scanning difficulty
- Proposed: Increase message font weight to 700 (bold)

### Positioning Issues

**Mobile Vertical Position:**
- Current: bottom 80px
- Issue: May conflict with sticky cart (which is typically at bottom: 0)
- Sticky cart height: ~70-80px
- Gap above cart: 80px - 70px = only 10px clearance (TOO TIGHT!)
- Proposed: bottom 100px (20px clearance)

**Desktop Vertical Position:**
- Current: bottom 24px
- Issue: Too low, may be missed
- Proposed: bottom 40px or top positioning instead

### Height Issues

**Current Height:**
- Not explicitly set (auto)
- With padding 16px top/bottom: min 32px + content
- With 14px font + line-height: ~16-18px
- Total estimated: 48-50px per toast
- Issue: Feels tall/chunky
- Proposed: Reduce padding to 10px × 16px = ~36-38px total

---

## 4. "POPULAR" BADGE SYSTEM

### How Products Are Marked Popular

**Method:** Random/Simulated (Client-side JavaScript)
**File:** assets/bogo-builder.js
**Lines:** 6315-6337

```javascript
// ✅ BOGO-PREMIUM-BADGE-FINAL-056: Minimal text-glow "POPULAR" badge
function addPopularityBadges() {
  if (!SOCIAL_PROOF_CONFIG.popularityBadges.enabled) return;

  const productCards = document.querySelectorAll('.product-card');

  // ✅ Minimal text-glow badge - no icon, just glowing text
  const popularBadge = { type: 'premium', text: 'POPULAR', probability: 0.4 };

  productCards.forEach((card, index) => {
    const random = Math.random();

    // ✅ Show "POPULAR" badge on ~40% of products
    if (random < popularBadge.probability) {
      const badgeElement = document.createElement('div');
      badgeElement.className = 'popularity-badge-premium';
      badgeElement.textContent = popularBadge.text;

      // ✅ Append to card
      card.appendChild(badgeElement);
    }
  });
}
```

**Logic:**
- **NOT** hardcoded product IDs
- **NOT** based on Shopify tags
- **NOT** based on real sales data
- **IS** randomly assigned on page load
- Probability: 40% (0.4) of all products get "POPULAR" badge
- Uses `Math.random()` - different products each page load

**Configuration:**
**File:** assets/bogo-builder.js
**Lines:** 6086-6089

```javascript
popularityBadges: {
  enabled: true,
  showProbability: 0.4
}
```

**Initialization:**
**File:** assets/bogo-builder.js
**Line:** 6370-6371

```javascript
if (SOCIAL_PROOF_CONFIG.popularityBadges.enabled) {
  setTimeout(addPopularityBadges, 500);
}
```

Called 500ms after DOMContentLoaded.

---

### Popular Products List

**No hardcoded list exists.** Badges are assigned randomly on each page load.

To see which products have badges, run in console:
```javascript
document.querySelectorAll('.popularity-badge-premium').forEach(badge => {
  console.log(badge.parentElement.querySelector('.product-title')?.textContent);
});
```

---

### Badge HTML Structure

**Dynamically Created:**
```html
<div class="popularity-badge-premium">POPULAR</div>
```

**Parent Element:**
- Appended to `.product-card`
- Positioned absolutely over product image

**No Liquid Template Code** - entirely JavaScript-generated.

---

### Badge CSS

**File:** assets/bogo-builder.css
**Lines:** 3919-3970

```css
/* ✅ BOGO-PREMIUM-BADGE-FINAL-056: Minimal text-glow "POPULAR" badge */
.popularity-badge-premium {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  z-index: 8;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #60c655;
  text-shadow: 0 0 8px rgba(96, 198, 85, 0.8),
               0 0 16px rgba(96, 198, 85, 0.5),
               0 0 24px rgba(96, 198, 85, 0.3);
  pointer-events: none;
  user-select: none;
  will-change: opacity, text-shadow;
  animation: premiumGlow 3s ease-in-out infinite;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@keyframes premiumGlow {
  0%, 100% {
    opacity: 0.85;
    text-shadow: 0 0 8px rgba(96, 198, 85, 0.8),
                 0 0 16px rgba(96, 198, 85, 0.5),
                 0 0 24px rgba(96, 198, 85, 0.3);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 12px rgba(96, 198, 85, 0.9),
                 0 0 20px rgba(96, 198, 85, 0.6),
                 0 0 28px rgba(96, 198, 85, 0.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .popularity-badge-premium {
    animation: none;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .popularity-badge-premium {
    font-size: 8px;
    text-shadow: 0 0 10px rgba(96, 198, 85, 0.9),
                 0 0 18px rgba(96, 198, 85, 0.6),
                 0 0 26px rgba(96, 198, 85, 0.4);
  }
}
```

---

### Badge Styling Details

**Desktop:**
- Background: None (text-only)
- Text color: #60c655 (bright green)
- Font size: 9px
- Font weight: 900 (ultra-bold)
- Letter spacing: 0.12em
- Text shadow: Triple-layer glow effect
- Position: Absolute, top 4px, centered horizontally
- Z-index: 8
- Animation: Pulsing glow effect (3s infinite)

**Mobile (≤768px):**
- Font size: 8px (11% smaller)
- Text shadow: Slightly adjusted glow values
- Everything else same as desktop

**Visual Effect:**
- Glowing green text
- No background box/pill
- Minimal, premium feel
- Pulsing animation draws attention

---

### Other "Popular" Badge (Tier Cards)

**File:** sections/bogo-builder-2024.liquid
**Line:** 109

```liquid
<div class="popular-badge">⭐ MOST POPULAR</div>
```

**File:** assets/bogo-builder.css
**Lines:** 921-938

```css
.popular-badge {
  position: absolute;
  top: -14px; /* Moved up to prevent cutoff */
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #60c655 0%, #50b645 100%);
  color: #000;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  letter-spacing: 0.08em;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
```

**Usage:** This is for TIER CARDS, not product cards. Different system.

---

## 5. TOAST MESSAGES INVENTORY

### Success Messages

1. `"${productData.title} added to Pair ${state.activePairNumber} (Slot 1) ✓"` (Line 929)
   - Example: "Titan Smart Cable added to Pair 1 (Slot 1) ✓"
   - Estimated length: 40-60 characters

2. Tier unlock messages (Line 1091, variable `tierMessage`)
   - "🎉 Pair X Complete! [Product] is FREE!"
   - "🎉 Pair X Complete! [Product] is FREE! 🔓 Tier 2 Unlocked: FREE SHIPPING + 5% OFF!"
   - "🎉 Pair X Complete! [Product] is FREE! 🔓 Tier 3 Unlocked: FREE TITAN CABLE + 10% OFF!"
   - Longest: ~85 characters

3. `"Pair ${pairNumber} removed"` (Lines 1050, 2703, 2846)
   - Example: "Pair 3 removed"
   - Length: ~15 characters

4. `"All ${pairCount} pairs cleared"` (Line 6606)
   - Example: "All 3 pairs cleared"
   - Length: ~20 characters

### Error Messages

5. `"Error removing pair"` (Line 2788)
   - Length: 19 characters

6. `"No pairs to clear"` (Line 6566)
   - Length: 17 characters

7. `"Please add at least one pair to continue"` (Line 6640)
   - Length: 41 characters

8. `"Please complete all pairs before checkout"` (Line 6652)
   - Length: 42 characters

9. `"Checkout failed. Please try again or contact support."` (Line 6811)
   - Length: 55 characters

### Warning Messages

10. `"⚠️ Please select all variant options"` (Line 814)
    - Length: 36 characters

11. `"⚠️ Variant not available"` (Line 830)
    - Length: 24 characters

12. `"⚠️ Pair full! Lock in your pair to start a new one."` (Line 944)
    - Length: 52 characters

### Info Messages

13. `"Checkout cancelled. Build a new bundle to continue!"` (Line 7255)
    - Length: 53 characters

---

### Longest Message

**Winner:** Tier 3 unlock message
```
"🎉 Pair 3 Complete! Titan Smart Cable is FREE! 🔓 Tier 3 Unlocked: FREE TITAN CABLE + 10% OFF!"
```
**Estimated length:** ~95 characters

**Design Impact:**
- With 14px font, ~7-8 chars per inch
- 95 chars ≈ 11-12 inches wide on desktop (excessive!)
- Must wrap or overflow on mobile
- Current padding 16px × 24px adds ~48px total horizontal
- Need to ensure max-width prevents overflow

---

## 6. PROPOSED OPTIMIZATIONS

### Toast Notifications - Critical Fixes

**Issue 1: Mobile Padding Too Large**
- Current: 16px × 24px
- Proposed: 10px × 16px
- Impact: 37% smaller vertical padding, 33% smaller horizontal

**Issue 2: Mobile Width Too Wide**
- Current: calc(100vw - 32px)
- Proposed: max-width: 90% or 340px
- Impact: More compact on larger phones

**Issue 3: Poor Mobile Positioning**
- Current: bottom 80px (only 10px clearance above 70px cart)
- Proposed: bottom 100px (20px clearance)
- Impact: Less likely to overlap with sticky cart

**Issue 4: Font Weight Too Light**
- Current: 600 (semi-bold)
- Proposed: 700 (bold) for better readability
- Impact: Easier to read on dark background

**Issue 5: No Max-Width on Desktop**
- Current: auto width (can grow very wide)
- Proposed: max-width: 500px
- Impact: Long messages don't stretch across entire screen

**Issue 6: Two Toast Systems**
- Current: `showBogoToast()` AND `showNotification()` both in use
- Proposed: Consolidate to `showBogoToast()` only
- Impact: Consistent styling, easier maintenance

---

### Recommended CSS Changes

**File:** assets/bogo-builder.css
**Lines to modify:** 6942-7024

```css
.bogo-toast {
  position: fixed;
  bottom: 40px; /* ✅ Raised from 24px */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  padding: 12px 20px; /* ✅ Reduced from 16px 24px */
  border-radius: 10px; /* ✅ Slightly smaller from 12px */
  border: 1px solid rgba(96, 198, 85, 0.5);
  font-size: 14px;
  font-weight: 700; /* ✅ Increased from 600 */
  z-index: 100001 !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  gap: 10px; /* ✅ Reduced from 12px */
  max-width: 500px; /* ✅ NEW: Prevent excessive width */
  opacity: 0;
  animation: toastSlideIn 300ms ease forwards;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .bogo-toast {
    bottom: 100px; /* ✅ Increased from 80px for better clearance */
    left: 16px;
    right: 16px;
    max-width: 90%; /* ✅ NEW: Cap at 90% on small screens */
    padding: 10px 16px; /* ✅ Further reduced for mobile */
    font-size: 13px; /* ✅ Slightly smaller on mobile */
    gap: 8px; /* ✅ Tighter spacing */
    transform: none;
    width: auto;
  }
}
```

---

### Recommended JavaScript Changes

**File:** assets/bogo-builder.js
**Lines to modify:** 814, 830, 929, 944, 1050, 2703

**Replace all `showNotification()` calls with `showBogoToast()`**

Example:
```javascript
// OLD:
showNotification('⚠️ Please select all variant options', 'warning');

// NEW:
showBogoToast('⚠️ Please select all variant options', 'warning', 3000);
```

**Consider removing `showNotification()` function entirely** (Lines 5712-5739)

---

### Popular Badges - No Changes Needed

**Assessment:** Badge system works well
- Minimal design ✅
- Glowing effect is premium ✅
- Small font size appropriate ✅
- Random assignment creates FOMO ✅
- No user complaints ✅

**Optional Enhancement:**
- Could make probability configurable in Shopify theme settings
- Could persist random selection in localStorage for session consistency

---

## 7. MOBILE-SPECIFIC ANALYSIS

### Current Mobile Breakpoints

**Primary breakpoint:** `@media (max-width: 768px)`

Used for:
- Toast notifications
- Popular badges
- Social proof notifications
- Tier cards
- Product cards

---

### Toast on Mobile (Current)

- Width: calc(100vw - 32px) = full width minus margins
- Padding: 16px × 24px (SAME AS DESKTOP - PROBLEM!)
- Font size: 14px (SAME AS DESKTOP)
- Font weight: 600
- Position: Fixed, bottom 80px
- Gap: 12px between icon and message
- Border radius: 12px

**Screen Width Analysis:**
- iPhone SE (375px): Toast width = 343px (91% of screen)
- iPhone 12 (390px): Toast width = 358px (92% of screen)
- iPhone 14 Pro Max (430px): Toast width = 398px (93% of screen)

**Issue:** Takes up 91-93% of screen width - feels overwhelming.

---

### Popular Badge on Mobile (Current)

- Font size: 8px (vs 9px desktop)
- Text shadow: Adjusted values
- Position: Same (top 4px, centered)
- Animation: Same pulsing glow

**Assessment:** Works well, no complaints.

---

## 8. CODE REFERENCES

### Toast System - Files to Modify

**JavaScript:**
1. `assets/bogo-builder.js` - Lines 267-289: `showBogoToast()` function (NO CHANGES NEEDED)
2. `assets/bogo-builder.js` - Lines 5712-5739: `showNotification()` function (REMOVE/DEPRECATE)
3. `assets/bogo-builder.js` - Lines 814, 830, 929, 944, 1050, 2703: Replace calls

**CSS:**
1. `assets/bogo-builder.css` - Lines 6942-6961: Main `.bogo-toast` styles (MODIFY PADDING, GAP, MAX-WIDTH)
2. `assets/bogo-builder.css` - Lines 7006-7024: Mobile `.bogo-toast` overrides (MODIFY PADDING, BOTTOM, MAX-WIDTH)

---

### Popular Badges - No Changes Required

**JavaScript:**
1. `assets/bogo-builder.js` - Lines 6086-6089: Config (already optimal)
2. `assets/bogo-builder.js` - Lines 6315-6337: `addPopularityBadges()` (already optimal)

**CSS:**
1. `assets/bogo-builder.css` - Lines 3919-3970: `.popularity-badge-premium` (already optimal)

---

## 9. BEFORE/AFTER TARGETS

### Toast Notifications

**Desktop - Before:**
- Bottom: 24px
- Padding: 16px × 24px
- Font weight: 600
- Gap: 12px
- Max-width: none

**Desktop - After:**
- Bottom: 40px ✅
- Padding: 12px × 20px ✅
- Font weight: 700 ✅
- Gap: 10px ✅
- Max-width: 500px ✅

**Mobile - Before:**
- Bottom: 80px
- Padding: 16px × 24px (SAME AS DESKTOP)
- Font size: 14px
- Width: calc(100vw - 32px)
- Gap: 12px

**Mobile - After:**
- Bottom: 100px ✅ (+20px clearance)
- Padding: 10px × 16px ✅ (37% less vertical)
- Font size: 13px ✅ (slightly smaller)
- Max-width: 90% ✅ (caps at 90% screen width)
- Gap: 8px ✅ (tighter)

---

## 10. VISUAL COMPARISON

### Current Toast (Mobile)

```
┌─────────────────────────────────────────┐  ← Screen width (343px on iPhone SE)
│                                         │
│  16px margin                            │
│  ┌─────────────────────────────────┐   │  ← Bottom: 80px
│  │  24px pad                       │   │
│  │  ✓  12px gap  Product added... │   │  ← 16px padding top/bottom
│  │  24px pad                       │   │
│  └─────────────────────────────────┘   │
│  16px margin                            │
│                                         │
│  ┌─────────────────────────────────┐   │  ← Sticky cart at bottom: 0
│  │     STICKY CART (70px high)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

Total toast height: ~50px (16+16 padding + 18px content)
Clearance above cart: 80 - 70 = 10px ❌ TOO TIGHT!
```

### Proposed Toast (Mobile)

```
┌─────────────────────────────────────────┐  ← Screen width
│                                         │
│  Max 90% = 308px width on iPhone SE    │
│  ┌───────────────────────────────┐     │  ← Bottom: 100px
│  │ 16px pad                      │     │
│  │ ✓ 8px Product added...        │     │  ← 10px padding top/bottom
│  │ 16px pad                      │     │
│  └───────────────────────────────┘     │
│                                         │
│                                         │  ← 20px clearance ✅
│  ┌─────────────────────────────────┐   │  ← Sticky cart
│  │     STICKY CART (70px high)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

Total toast height: ~36px (10+10 padding + 16px content)
Clearance above cart: 100 - 70 = 30px ✅ MUCH BETTER!
Reduced height: 50px → 36px (28% reduction)
```

---

## 11. ACCESSIBILITY CONSIDERATIONS

### Current Accessibility

**Positive:**
- High contrast ratio (20:1) ✅
- Auto-dismiss with reasonable timing ✅
- Clear visual distinction between types (color-coded borders) ✅
- Z-index ensures visibility ✅

**Issues:**
- No ARIA live region ❌
- Screen readers may miss toast notifications ❌
- No keyboard dismiss option ❌
- Emoji icons (✓, ⚠️) may not announce properly ❌

### Recommended Improvements

Add ARIA attributes:
```javascript
toast.setAttribute('role', 'alert');
toast.setAttribute('aria-live', 'polite');
toast.setAttribute('aria-atomic', 'true');
```

Consider adding dismiss button for keyboard users.

---

## 12. PERFORMANCE NOTES

**Current Performance:**
- Toast creation: Fast (simple DOM manipulation)
- Animation: GPU-accelerated (transform/opacity)
- Cleanup: Good (removes from DOM after hide)
- Multiple toasts: Handled (removes existing before showing new)

**No performance issues identified.**

---

## END OF EXTRACTION

**Next Steps:**
1. Review this extraction document
2. Approve proposed optimizations
3. Implement CSS changes (5 minutes)
4. Replace `showNotification()` calls (10 minutes)
5. Test on mobile devices
6. Deploy to production

**Estimated Total Time:** 20-30 minutes
**Risk Level:** VERY LOW (only CSS + function call replacements)
**Impact:** HIGH (better UX, cleaner code, consistent styling)
