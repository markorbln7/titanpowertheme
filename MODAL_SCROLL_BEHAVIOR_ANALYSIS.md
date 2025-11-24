# MODAL SCROLL BEHAVIOR ANALYSIS

**Purpose:** Understand how the modal manages body scroll to fix jump on close
**Date:** 2025-11-24
**Issue:** Modal may jump/scroll when closing after auto-close on add-to-cart

---

## EXTRACTION 1: Scroll Lock/Unlock Handling

**Command:** `grep -n -B5 -A15 "overflow|scroll|body.*style|lockScroll|unlockScroll|position.*fixed" assets/bf25-expansion-core.js`

### Finding 1: Scroll Position Lock on Close (Lines 2509-2522)

```javascript
// ─────────────────────────────────────────────────────────────────
// CRITICAL: Lock scroll position before any DOM changes
// ─────────────────────────────────────────────────────────────────
const scrollY = window.scrollY;
const scrollX = window.scrollX;

// Prevent browser scroll restoration during animation
if ('scrollRestoration' in history) {
  this.previousScrollRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';
}

if (this.config.debug) {
  console.log('🔒 Locking scroll at:', { x: scrollX, y: scrollY });
}
```

**Purpose:** Captures scroll position BEFORE modal close animation starts

---

### Finding 2: Body Scroll Lock on Modal Open (Lines 2640-2641)

```javascript
// Lock body scroll
this.lockBodyScroll(true);
```

**Purpose:** Prevents background page from scrolling when modal is open

---

### Finding 3: Body Scroll Unlock on Modal Close (Lines 2834-2835)

```javascript
// Unlock body scroll
this.lockBodyScroll(false);
```

**Purpose:** Restores page scrolling after modal closes

---

### Finding 4: Complete lockBodyScroll Method (Lines 2872-2920)

```javascript
/**
 * Lock/unlock body scroll (iOS-compatible method)
 *
 * @param {boolean} lock - True to lock, false to unlock
 */
lockBodyScroll(lock) {
  if (lock) {
    // Store current scroll position
    this.scrollY = window.pageYOffset;
    this.scrollX = window.pageXOffset;

    // Lock scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';

    if (this.config.debug) {
      console.log('🔒 Body scroll locked at:', { x: this.scrollX, y: this.scrollY });
    }
  } else {
    // Unlock scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // Restore scroll position immediately
    if (this.scrollY !== undefined || this.scrollX !== undefined) {
      const targetX = this.scrollX || 0;
      const targetY = this.scrollY || 0;

      // Use requestAnimationFrame to ensure DOM has settled
      requestAnimationFrame(() => {
        window.scrollTo(targetX, targetY);

        if (this.config.debug) {
          console.log('✅ Scroll restored to:', { x: targetX, y: targetY });
        }
      });
    }

    // Restore scroll restoration behavior
    if ('scrollRestoration' in history && this.previousScrollRestoration) {
      history.scrollRestoration = this.previousScrollRestoration;
      this.previousScrollRestoration = null;
    }

    if (this.config.debug) {
      console.log('🔓 Body scroll unlocked');
    }
  }
}
```

**Key Details:**
1. **Lock (when modal opens):**
   - Stores current `scrollY` and `scrollX`
   - Sets `body` to `position: fixed`
   - Sets `top: -{scrollY}px` (keeps visual position)
   - Sets `width: 100%` (prevents layout shift)

2. **Unlock (when modal closes):**
   - Removes inline styles from body
   - Uses `requestAnimationFrame` + `window.scrollTo()` to restore position
   - Restores `history.scrollRestoration` behavior

---

## EXTRACTION 2: Modal Close Method

**Command:** `grep -n -B5 -A30 "close()" assets/bf25-expansion-core.js`

### Close Method Structure (Lines 2493-2583)

```javascript
close() {
  try {
    // Prevent closing if not open
    if (!this.state.get('isOpen')) {
      return;
    }

    // Prevent multiple simultaneous closes
    if (this.state.get('isAnimating')) {
      if (this.config.debug) {
        console.warn('⚠️ Modal animating, ignoring close request');
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // CRITICAL: Lock scroll position before any DOM changes
    // ─────────────────────────────────────────────────────────────────
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Prevent browser scroll restoration during animation
    if ('scrollRestoration' in history) {
      this.previousScrollRestoration = history.scrollRestoration;
      history.scrollRestoration = 'manual';
    }

    if (this.config.debug) {
      console.log('🔒 Locking scroll at:', { x: scrollX, y: scrollY });
    }

    this.state.update('isAnimating', true);

    // ... animation logic ...

    // Inside animation completion callback:
    // Unlock body scroll
    this.lockBodyScroll(false);

    // Return focus to card (accessibility)
    card.focus();

    // Reset state
    this.state.reset();
  } catch (error) {
    console.error('❌ Error in close():', error);
    // Cleanup even on error
  }
}
```

**Close Flow:**
1. Check if modal is open
2. Check if already animating (prevent duplicate closes)
3. **Lock scroll position** (prevent jump during animation)
4. Set `isAnimating = true`
5. Run close animation
6. On animation complete:
   - **Unlock body scroll** (`lockBodyScroll(false)`)
   - Restore scroll position via `window.scrollTo()`
   - Reset state
   - Return focus to trigger card

---

## EXTRACTION 3: Modal Open Method

**Command:** `grep -n -B5 -A30 "open()|openModal" assets/bf25-expansion-core.js`

### Open Method Structure (Lines 2300-2488)

```javascript
async open(productId, card) {
  try {
    // Prevent opening if already open
    if (this.state.get('isOpen')) {
      if (this.config.debug) {
        console.warn('⚠️ Modal already open, ignoring open request');
      }
      return;
    }

    // ... validation logic ...

    // ─────────────────────────────────────────────────────────────────
    // CRITICAL: Force close theme search/modals
    // ─────────────────────────────────────────────────────────────────
    const themeModals = document.querySelectorAll('details-modal[open], details[open]');
    themeModals.forEach(modal => {
      modal.removeAttribute('open');
    });

    // ... more setup ...

    // Show modal container/overlay
    this.container.hidden = false;
    this.overlay.hidden = false;
    this.container.classList.add('is-active');
    this.overlay.classList.add('is-visible');

    // Lock body scroll
    this.lockBodyScroll(true);

    // ... FLIP animation logic ...

  } catch (error) {
    console.error('❌ Fatal error in open():', error);
    this.state.update('isAnimating', false);
    this.state.update('isOpen', false);
  }
}
```

**Open Flow:**
1. Check if modal already open
2. Close any theme modals (search, etc.)
3. Show modal container + overlay
4. **Lock body scroll** (`lockBodyScroll(true)`)
5. Run FLIP open animation
6. Set `isOpen = true`

---

## EXTRACTION 4: CSS Scroll Styles

**Command:** `grep -n "overflow|position.*fixed|body" assets/bf25-modal-design.css`

### Relevant CSS Rules

```css
/* Lines 3602-3617: Body has modal open - suppress other modals */
body:has(.bf25-modal-container.is-active) details-modal,
body:has(.bf25-modal-container.is-active) .header__search,
body:has(.bf25-modal-container.is-active) .search-modal,
body:has(.bf25-modal-container.is-active) .modal__content:not(.bf25-modal-content) {
  display: none !important;
  pointer-events: none !important;
}

body:has(.bf25-modal-container.is-active) .modal__toggle-close,
body:has(.bf25-modal-container.is-active) .modal__close-button {
  display: none !important;
}

/* Modal container positioning */
.bf25-modal-container {
  position: fixed;
  /* ... */
}

/* Modal overlay */
.bf25-modal-overlay {
  position: fixed;
  /* ... */
}

/* Modal content scroll */
.bf25-modal-content {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
}
```

**Key CSS Behaviors:**
1. Modal container/overlay are `position: fixed`
2. Modal content has internal scrolling (`overflow-y: auto`)
3. Body scroll is controlled via JavaScript (not CSS)
4. Other theme modals suppressed when BF25 modal is active

---

## SCROLL BEHAVIOR FLOW

### When Modal Opens
```
open() called
  ↓
lockBodyScroll(true)
  ↓
this.scrollY = window.pageYOffset (e.g., 500px)
  ↓
document.body.style.position = 'fixed'
document.body.style.top = '-500px'
  ↓
Body appears at same visual position but can't scroll
Modal content scrolls internally
```

### When Modal Closes (Normal User Click)
```
close() called
  ↓
Lock scroll position (prevent jump during animation)
scrollY = window.scrollY
  ↓
Run close animation
  ↓
Animation complete callback:
  ↓
lockBodyScroll(false)
  ↓
document.body.style.position = ''
document.body.style.top = ''
  ↓
requestAnimationFrame(() => {
  window.scrollTo(0, 500) // Restore original position
})
  ↓
User is back at original scroll position
```

### When Modal Closes (Auto-Close After Add-to-Cart)
```
handleSuccess() called
  ↓
setTimeout(() => {
  this.manager.close()
}, 800)
  ↓
800ms delay...
  ↓
close() called
  ↓
Same flow as above
```

---

## POTENTIAL SCROLL JUMP ISSUE

### The Problem

When `handleSuccess()` triggers `this.manager.close()` after 800ms delay:

1. **During the 800ms wait:**
   - Modal is still open
   - Body scroll is still locked
   - User might try to scroll inside modal content
   - Modal content scroll position changes

2. **When close() executes:**
   - `lockBodyScroll(false)` restores body position
   - `window.scrollTo()` attempts to restore scroll
   - BUT: If user scrolled modal content during wait, there might be a visual jump

### Why This Happens

**Scenario:**
```
1. Modal opens at page scroll position Y = 500px
2. User clicks "ADD TO DEAL"
3. Success! Button shows checkmark
4. During 800ms wait, user scrolls modal content down
5. Auto-close triggers
6. close() restores body to Y = 500px
7. BUT: User expected to stay at modal scroll position
8. Result: Visual jump back to Y = 500px
```

### Current Mitigation

The code already has scroll jump prevention:

**In close() method (lines 2509-2522):**
```javascript
// CRITICAL: Lock scroll position before any DOM changes
const scrollY = window.scrollY;
const scrollX = window.scrollX;

// Prevent browser scroll restoration during animation
if ('scrollRestoration' in history) {
  this.previousScrollRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';
}
```

**This prevents browser from auto-restoring scroll during animation.**

---

## RECOMMENDED FIXES (If Jump Occurs)

### Option 1: Capture Scroll Position Immediately Before Auto-Close

Modify `handleSuccess()` to capture scroll position:

```javascript
// In assets/bf25-expansion-core.js
// Method: handleSuccess()
// Location: Around line 1680

handleSuccess(data) {
  // ... existing success handling ...

  // Close modal after showing success feedback
  setTimeout(() => {
    if (this.manager && typeof this.manager.close === 'function') {
      // Capture scroll position RIGHT before close
      const currentScrollY = window.pageYOffset;
      const currentScrollX = window.pageXOffset;

      // Store in manager for close() to use
      this.manager._targetScrollY = currentScrollY;
      this.manager._targetScrollX = currentScrollX;

      this.manager.close();
    }
  }, 800);
}
```

Then in `close()` method, use stored position:

```javascript
// In close() method's lockBodyScroll(false) section
// Use _targetScrollY/_targetScrollX if available

if (this._targetScrollY !== undefined) {
  requestAnimationFrame(() => {
    window.scrollTo(this._targetScrollX || 0, this._targetScrollY);
    this._targetScrollY = undefined;
    this._targetScrollX = undefined;
  });
} else {
  // Use stored scrollY from lockBodyScroll
  requestAnimationFrame(() => {
    window.scrollTo(this.scrollX || 0, this.scrollY);
  });
}
```

---

### Option 2: Reduce Auto-Close Delay

Reduce the 800ms delay to minimize user interaction during wait:

```javascript
// In handleSuccess()
setTimeout(() => {
  if (this.manager && typeof this.manager.close === 'function') {
    this.manager.close();
  }
}, 400); // Reduce from 800ms to 400ms
```

**Trade-off:** Users have less time to see success feedback (checkmark)

---

### Option 3: Disable Auto-Close on User Interaction

Cancel auto-close if user interacts with modal during wait:

```javascript
// In handleSuccess()
const closeTimeout = setTimeout(() => {
  if (this.manager && typeof this.manager.close === 'function') {
    this.manager.close();
  }
}, 800);

// Cancel close if user scrolls modal content
const modalContent = document.querySelector('.bf25-modal-content');
if (modalContent) {
  const cancelClose = () => {
    clearTimeout(closeTimeout);
    console.log('[BF25] Auto-close cancelled - user interaction detected');
  };

  modalContent.addEventListener('scroll', cancelClose, { once: true });
  modalContent.addEventListener('click', cancelClose, { once: true });
}
```

**Benefit:** Modal stays open if user wants to keep browsing

---

## TESTING FOR SCROLL JUMP

### Test Scenario 1: Normal Add-to-Cart Flow
1. Open BF25 page, scroll down 500px
2. Click product to open modal
3. Add to cart
4. **Expected:** Modal closes, page scroll returns to ~500px
5. **Check:** No visual jump or jank

### Test Scenario 2: Modal Content Scroll During Wait
1. Open BF25 page, scroll down 500px
2. Click product to open modal
3. Scroll modal content down (read description)
4. Add to cart
5. During 800ms wait, scroll modal content more
6. **Expected:** Modal closes, page scroll returns to ~500px
7. **Check:** No jump from modal scroll to page scroll

### Test Scenario 3: Rapid Multi-Add
1. Open modal
2. Add to cart
3. Immediately scroll modal content during 800ms wait
4. **Expected:** Smooth transition, no jump
5. **Check:** Console for any errors

### Browser DevTools Commands

```javascript
// Check current scroll lock state
console.log('Body position:', document.body.style.position);
console.log('Body top:', document.body.style.top);
console.log('Scroll Y:', window.scrollY);

// Listen for scroll restoration
window.addEventListener('scroll', (e) => {
  console.log('Scroll event:', window.scrollY);
}, { passive: true });

// Check modal state
console.log('Modal open:', window.bf25Expansion?.state?.get('isOpen'));
console.log('Modal animating:', window.bf25Expansion?.state?.get('isAnimating'));
```

---

## SUMMARY

### Current Implementation (Correct)
✅ Scroll position is locked on modal open via `position: fixed`
✅ Scroll position is stored in `this.scrollY`
✅ Scroll is restored via `window.scrollTo()` on close
✅ `requestAnimationFrame` ensures DOM has settled
✅ `history.scrollRestoration = 'manual'` prevents browser interference

### Potential Issue
⚠️ During 800ms auto-close delay:
- User might scroll modal content
- Could cause confusion when page scroll restores
- Visual jump if user expects to stay at modal scroll position

### Solution Options
1. **Capture scroll position right before close** (most accurate)
2. **Reduce delay to 400ms** (less user interaction time)
3. **Cancel auto-close on user interaction** (keeps modal open if user engaged)

### Recommended Approach
**Option 1 (capture position) + Option 2 (shorter delay)**
- Capture scroll position immediately before close (in setTimeout)
- Reduce delay from 800ms to 500ms
- Provides balance of feedback visibility and smooth UX

### No Changes Needed If:
- Testing shows no scroll jump occurs
- Current 800ms delay + scroll restoration works smoothly
- Users don't interact with modal during wait period
