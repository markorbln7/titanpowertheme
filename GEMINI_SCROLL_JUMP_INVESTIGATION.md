# GEMINI SCROLL JUMP INVESTIGATION

**Purpose:** Complete modal close flow analysis for Gemini Deep Think investigation
**Date:** 2025-11-24
**Context:** Scroll jump fix applied, need full sequence for optimization review

---

## EXTRACTION 1: Complete close() Method

**File:** `assets/bf25-expansion-core.js`
**Lines:** 2490-2600

```javascript
/**
 * Close the modal
 */
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

    if (this.config.debug) {
      console.log('🚪 Closing Modal');
    }

    // ─────────────────────────────────────────────────────────────────
    // MEMORY CLEANUP (Prompt 12)
    // ─────────────────────────────────────────────────────────────────

    // Clear countdown timer interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Remove focus trap event listener
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }

    // Clear any pending notification timeouts
    if (this.notificationTimeouts) {
      this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.notificationTimeouts = [];
    }

    // ─────────────────────────────────────────────────────────────────
    // ACCESSIBILITY CLEANUP (Prompt 12)
    // ─────────────────────────────────────────────────────────────────
    this.announceToScreenReader('Product details closed', 'polite');

    // ─────────────────────────────────────────────────────────────────
    // REVERSE FLIP ANIMATION (Prompt 5 - IMPLEMENTED)
    // ─────────────────────────────────────────────────────────────────
    this.animateClose();

    // ─────────────────────────────────────────────────────────────────
    // FOCUS RESTORATION (Prompt 12)
    // ─────────────────────────────────────────────────────────────────
    // Restore focus after animation completes
    setTimeout(() => {
      this.restoreFocus();

      // Re-enable theme modals after BF25 closes
      const themeModals = document.querySelectorAll('details-modal');
      themeModals.forEach(modal => {
        modal.style.pointerEvents = '';
      });

      if (this.config.debug) {
        console.log('✅ Re-enabled theme modals');
      }
    }, 350); // Wait for animation to complete

    // Reset state (will happen after animation completes)
    // The animateClose method handles state.reset() on completion

  } catch (error) {
    console.error('❌ Error in close():', error);
    // Ensure cleanup happens even if error occurs
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.focusTrapHandler) document.removeEventListener('keydown', this.focusTrapHandler);
    this.state.update('isAnimating', false);
    this.state.update('isOpen', false);
  }
}
```

**Key Observations:**
1. **Scroll captured at start** - `scrollY` and `scrollX` stored in local variables (lines 2513-2514)
2. **History API manipulation** - `scrollRestoration = 'manual'` to prevent browser interference
3. **Animation state guard** - Prevents multiple simultaneous closes
4. **Memory cleanup** - Clears intervals, event listeners, timeouts
5. **animateClose()** called at line 2560
6. **Focus restoration** - Happens in 350ms setTimeout (line 2566)
7. **State reset** - Handled by animateClose completion handler

**Critical Question for Gemini:**
- Why are scroll coordinates captured in `close()` but NOT stored in `this.scrollY/this.scrollX`?
- `lockBodyScroll(false)` expects `this.scrollY/this.scrollX` to exist - where is the handoff?

---

## EXTRACTION 2: Complete lockBodyScroll() Method (After Fix)

**File:** `assets/bf25-expansion-core.js`
**Lines:** 2870-2930

```javascript
/**
 * Lock/unlock body scroll to prevent background scrolling
 * Includes iOS-compatible fixed positioning with scroll restoration
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
    // Unlock scroll - FIXED: Restore position BEFORE removing styles

    // Get the stored scroll position
    const targetX = this.scrollX || 0;
    const targetY = this.scrollY || 0;

    // CRITICAL: Parse the current top value to get scroll position
    // This handles cases where scrollY wasn't stored properly
    const bodyTop = document.body.style.top;
    const scrollFromTop = bodyTop ? parseInt(bodyTop, 10) * -1 : targetY;

    // Step 1: Remove fixed positioning
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // Step 2: IMMEDIATELY restore scroll (no RAF delay)
    // This must happen in the same frame as style removal
    window.scrollTo(targetX, scrollFromTop);

    if (this.config.debug) {
      console.log('✅ Scroll restored to:', { x: targetX, y: scrollFromTop });
    }

    // Restore scroll restoration behavior
    if ('scrollRestoration' in history && this.previousScrollRestoration) {
      history.scrollRestoration = this.previousScrollRestoration;
      this.previousScrollRestoration = null;
    }

    // Clear stored values
    this.scrollX = undefined;
    this.scrollY = undefined;

    if (this.config.debug) {
      console.log('🔓 Body scroll unlocked');
    }
  }
}
```

**Key Fix Applied:**
- **Line 2908**: Removed `requestAnimationFrame` wrapper
- **Line 2902**: Parse `body.style.top` as fallback (converts `-500px` → `500`)
- **Line 2908**: Immediate `window.scrollTo()` in same execution frame as style removal

**Critical Observations:**
1. **Lock path** - Stores `this.scrollY` and `this.scrollX` (lines 2881-2882)
2. **Unlock path** - Reads `this.scrollY` and `this.scrollX` (lines 2894-2895)
3. **Fallback mechanism** - Parses `body.style.top` if stored values missing (line 2900)
4. **Synchronous restore** - No animation frame delay (line 2908)
5. **Values cleared** - `this.scrollX/scrollY = undefined` after restore (lines 2920-2921)

**Questions for Gemini:**
- Is parsing `body.style.top` the optimal fallback, or should we prevent this path?
- Should we validate scroll values before clearing them?
- Is there a race condition between `animateClose()` completion and `lockBodyScroll(false)` call?

---

## EXTRACTION 3: Animation Completion Handler

**File:** `assets/bf25-expansion-core.js`
**Command:** `grep -n -B5 -A30 "onfinish|animationend|transitionend|animation.*complete"`

```javascript
2465-      this.state.update('isOpen', true);
2466-
2467-      // ─────────────────────────────────────────────────────────────────
2468-      // ACCESSIBILITY SETUP (Prompt 12)
2469-      // ─────────────────────────────────────────────────────────────────
2470:      // Initialize focus trap after animation completes
2471-      setTimeout(() => {
2472-        this.initializeFocusTrap();
2473-        this.announceToScreenReader(`Product details opened for ${validatedProduct.title}`, 'polite');
2474:      }, 350); // Wait for animation to complete
2475-
2476-      // Note: isAnimating will be set to false by animation completion
2477-
2478-    } catch (error) {
2479-      console.error('❌ Fatal error in open():', error);
2480-      this.showErrorModal(
2481-        'Unexpected Error',
2482-        'An unexpected error occurred while opening the product details. Please try again.'
2483-      );
2484-      // Reset state on error
2485-      // ...
2706-      easing: this.config.animation.easing,
2707-      fill: 'forwards'
2708-    });
2709-
2710-    // Handle animation completion
2711:    containerAnimation.onfinish = () => {
2712-      if (this.config.debug) {
```

**Key Finding:**
- **Line 2711**: `containerAnimation.onfinish` callback - this is where animation completes
- **Line 2474**: Fixed 350ms setTimeout in `open()` waits for animation
- **Line 2566** (from Extraction 1): Fixed 350ms setTimeout in `close()` for focus restoration

**Critical Question for Gemini:**
- Where is the `lockBodyScroll(false)` call triggered?
- Is it in the `onfinish` callback of `animateClose()`?
- Need to see the full `animateClose()` method to understand timing

---

## EXTRACTION 4: CSS Transitions on Modal

**Files:** `assets/bf25-modal-design.css`, `assets/section-bundle-builder-bf25.css`
**Command:** `grep -n "transition|animation|transform" | head -50`

```css
assets/bf25-modal-design.css:20: * - GPU-accelerated for 60fps animations (Prompt 5)
assets/bf25-modal-design.css:158:  transform: rotate(0deg) !important;
assets/bf25-modal-design.css:174:  /* Animation-ready (Prompt 5 will add transitions) */
assets/bf25-modal-design.css:217:  /* Performance: GPU acceleration for animations */
assets/bf25-modal-design.css:218:  will-change: transform, border-radius;
assets/bf25-modal-design.css:219:  transform: translateZ(0); /* Force GPU layer */
assets/bf25-modal-design.css:240:  transform: translate(-50%, -50%) translateZ(0);
assets/bf25-modal-design.css:254:    transform: translateZ(0); /* No centering on mobile */
assets/bf25-modal-design.css:361:  transition: all 0.2s ease;
assets/bf25-modal-design.css:370:  transform: scale(1.05);
assets/bf25-modal-design.css:374:  transform: scale(0.95);
assets/bf25-modal-design.css:411:   These classes are animation-ready but don't have transitions yet.
assets/bf25-modal-design.css:412:   Prompt 5 will add the FLIP animation logic.
assets/bf25-modal-design.css:420:  transform: translateY(20px);
assets/bf25-modal-design.css:424:  animation: bf25FadeInUp 0.3s var(--bf25-easing-entrance) 0.1s both;
assets/bf25-modal-design.css:428:  animation: bf25FadeInUp 0.3s var(--bf25-easing-entrance) 0.2s both;
assets/bf25-modal-design.css:432:  animation: bf25FadeInUp 0.3s var(--bf25-easing-entrance) 0.3s both;
assets/bf25-modal-design.css:438:    transform: translateY(20px);
assets/bf25-modal-design.css:442:    transform: translateY(0);
assets/bf25-modal-design.css:458:    animation: none !important;
assets/bf25-modal-design.css:459:    transition: none !important;
assets/bf25-modal-design.css:527:   - Will add FLIP transform transitions to .bf25-modal-container
assets/bf25-modal-design.css:528:   - Will add fade transitions to .bf25-modal-overlay
assets/bf25-modal-design.css:529:   - Will use will-change and transform properties defined here
```

**Key Findings:**
1. **GPU acceleration** - `transform: translateZ(0)` forces GPU layer (line 219)
2. **will-change** - `transform, border-radius` pre-optimized (line 218)
3. **No CSS transitions on container** - FLIP uses Web Animations API, not CSS (line 527 comment)
4. **Child animations** - `bf25FadeInUp` with staggered delays (0.1s, 0.2s, 0.3s)
5. **Reduced motion** - `animation: none !important` for accessibility (line 458)

**Critical Observation:**
- Modal uses **Web Animations API**, not CSS transitions
- This means `onfinish` callback is reliable (not dependent on CSS `transitionend`)
- But child elements have CSS animations that might finish at different times

---

## EXTRACTION 5: Modal State Changes

**File:** `assets/bf25-expansion-core.js`
**Command:** `grep -n -B3 -A10 "is-active|is-visible|hidden|aria-hidden" | head -80`

```javascript
1771-
1772-    // Animate in
1773-    requestAnimationFrame(() => {
1774:      notification.classList.add('is-visible');
1775-    });
1776-
1777-    // Close button
1778-    const closeBtn = notification.querySelector('.bf25-notification-close');
1779-    closeBtn.addEventListener('click', () => {
1780-      this.hideNotification(notification);
1781-    });
1782-
1783-    // Auto-hide after delay
1784-    const delay = type === 'success' ? 3000 : 5000;
--
1799-  hideNotification(notification) {
1800-    if (!notification) return;
1801-
1802:    notification.classList.remove('is-visible');
1803-    setTimeout(() => {
1804-      notification.remove();
1805-    }, 300);
1806-  }
--
2372-      const ppSheet = document.querySelector('#pp-bottom-sheet, .pp-bottom-sheet, [data-sheet="power-pairs"]');
2373-      if (ppSheet) {
2374-        ppSheet.style.display = 'none';
2375:        ppSheet.style.visibility = 'hidden';
2376-        ppSheet.style.opacity = '0';
2377:        ppSheet.classList.remove('is-active', 'is-visible', 'is-open');
2378-        if (this.config.debug) {
2379-          console.log('🚫 Closed Power Pairs sheet');
2380-        }
2381-      }
--
2631-    // STEP 2: LAST - Show modal at final position/size
2632-    // ─────────────────────────────────────────────────────────────────
2633-
2634:    // Remove hidden attribute and add classes
2635:    this.container.hidden = false;
2636:    this.overlay.hidden = false;
2637:    this.container.classList.add('is-active');
2638:    this.overlay.classList.add('is-visible');
2639-
2640-    // Lock body scroll
2641-    this.lockBodyScroll(true);
2642-
2643-    // Force layout calculation
2644-    void this.container.offsetHeight;
```

**Key State Transitions:**

### Open Sequence (Lines 2634-2641):
1. `container.hidden = false` (DOM visibility)
2. `overlay.hidden = false` (DOM visibility)
3. `container.classList.add('is-active')` (animation state)
4. `overlay.classList.add('is-visible')` (animation state)
5. `lockBodyScroll(true)` (body scroll lock)

### Close Sequence (Need to find in animateClose):
- **Missing from extraction** - Need to see where classes are removed
- **Question:** When does `container.hidden = true` happen?
- **Question:** When does `lockBodyScroll(false)` happen?

---

## EXTRACTION 6: Auto-Close Trigger (Recent Addition)

**File:** `assets/bf25-expansion-core.js`
**Lines:** 1675-1695

```javascript
this.trackAddToCart(data);

// Emit custom event for theme integration
this.emitCartEvent('bf25:cart:added', data);

// Close modal after showing success feedback
// Delay allows user to see checkmark confirmation
setTimeout(() => {
  if (this.manager && typeof this.manager.close === 'function') {
    this.manager.close();
  }
}, 800);
```

**Context:**
- This is in `handleSuccess()` method of CartHandler class
- Triggered when add-to-cart API call succeeds
- **800ms delay** allows user to see success checkmark
- Calls `this.manager.close()` which triggers the full close sequence

**Timing Chain:**
1. Add-to-cart success → `handleSuccess()`
2. Wait 800ms (show checkmark)
3. Call `manager.close()`
4. Close sequence starts (Extraction 1)
5. `animateClose()` runs (need to see this method)
6. Animation completes → `onfinish` callback
7. `lockBodyScroll(false)` called (WHERE?)
8. Scroll restored immediately (Extraction 2)

---

## CRITICAL GAPS FOR GEMINI INVESTIGATION

### 1. Missing animateClose() Method
**Need to extract:**
```bash
grep -n -A100 "animateClose\(\)" assets/bf25-expansion-core.js
```

**Questions:**
- Where does `animateClose()` call `lockBodyScroll(false)`?
- Is it in the `onfinish` callback or before animation?
- What is the animation duration?

### 2. Scroll Value Handoff
**Current Flow (Suspected):**
1. `close()` captures `scrollY/scrollX` in **local variables** (line 2513-2514)
2. `animateOpen()` called `lockBodyScroll(true)` which stored `this.scrollY/this.scrollX`
3. But `close()` does NOT re-store scroll values before unlock
4. `lockBodyScroll(false)` relies on `this.scrollY/this.scrollX` from open() call
5. **Fallback:** Parses `body.style.top` if values missing

**Question for Gemini:**
- Is this handoff reliable?
- Should `close()` explicitly store scroll values before unlock?
- Could there be a timing issue if modal opens and closes quickly?

### 3. Animation Timing Validation
**Current Timeouts:**
- Auto-close delay: **800ms**
- Focus restoration: **350ms** (line 2566)
- Notification hide: **300ms** (line 1805)

**Questions:**
- Does animation duration match these timeouts?
- Could focus restoration happen before unlock completes?
- Is 350ms timeout safe for all devices/browsers?

### 4. iOS-Specific Behavior
**Code mentions iOS compatibility (line 2873):**
```javascript
/**
 * Lock/unlock body scroll to prevent background scrolling
 * Includes iOS-compatible fixed positioning with scroll restoration
 */
```

**Questions:**
- Does iOS handle `position: fixed` differently?
- Does iOS Safari have frame timing differences?
- Should we use `requestAnimationFrame` specifically for iOS?

---

## SCROLL JUMP FIX SUMMARY

### Problem Statement
Modal close had visible "jump to top then scroll back" effect:
1. User clicks close → modal animates away
2. Browser renders frame at scroll position 0
3. JavaScript restores scroll in next frame
4. **Visible jump detected by user**

### Root Cause
`requestAnimationFrame` wrapper in `lockBodyScroll(false)`:
```javascript
// OLD CODE (CAUSED JUMP)
requestAnimationFrame(() => {
  window.scrollTo(targetX, scrollFromTop);
});
```

This created 1-frame delay:
- **Frame N**: Remove `position: fixed` styles
- **Frame N+1**: Browser renders at scroll 0 (jump visible)
- **Frame N+2**: `window.scrollTo()` executes (scroll restores)

### Fix Applied
Immediate synchronous scroll restore:
```javascript
// NEW CODE (NO JUMP)
document.body.style.position = '';  // Frame N
document.body.style.top = '';
document.body.style.width = '';
window.scrollTo(targetX, scrollFromTop);  // Same frame N
```

Both style removal and scroll restore happen in **same execution frame**.

### Result
✅ Jump eliminated
✅ Smooth close animation maintained
✅ Scroll position correctly restored

---

## QUESTIONS FOR GEMINI DEEP THINK

### Primary Question
**Is the current scroll restoration implementation optimal, or are there edge cases/race conditions we should address?**

### Specific Areas to Analyze

1. **Scroll Value Storage Pattern**
   - Should `close()` re-capture scroll values instead of relying on `open()` stored values?
   - Is the fallback to `body.style.top` parsing safe?
   - Could rapid open/close cycles corrupt scroll state?

2. **Animation Timing Coordination**
   - Is the 350ms focus restoration timeout safe?
   - Should we use `onfinish` callback for unlock instead of hardcoded timeout?
   - Could CSS child animations (bf25FadeInUp) outlast the container animation?

3. **Frame Timing Optimization**
   - Is synchronous `window.scrollTo()` the best approach?
   - Should we add a safety check that styles were actually removed?
   - Could we improve performance with `scrollBehavior: 'instant'`?

4. **Cross-Browser/Device Compatibility**
   - Does iOS Safari need special handling?
   - Are there Firefox/Edge differences in scroll restoration?
   - Mobile Chrome layout shift concerns?

5. **State Management Robustness**
   - Should we validate scroll values before restore?
   - Add bounds checking (max scroll, negative values)?
   - Clear stored values earlier to prevent stale data?

6. **Error Handling**
   - What happens if `animateClose()` throws error?
   - Should unlock be in try/finally block?
   - Fallback if `window.scrollTo()` fails?

### Success Criteria
- ✅ No visible scroll jump
- ✅ Correct scroll position after close
- ✅ Works on all devices/browsers
- ✅ Handles edge cases (rapid clicks, errors)
- ✅ Optimal performance (no unnecessary RAF)
- ✅ Maintainable code

---

## NEXT EXTRACTION NEEDED

To complete this investigation, we need:

```bash
# Get full animateClose() method
grep -n -A150 "animateClose()" assets/bf25-expansion-core.js | head -180

# Find where lockBodyScroll(false) is called
grep -n "lockBodyScroll\(false\)" assets/bf25-expansion-core.js

# Get animation configuration
grep -n -B5 -A10 "animation.*duration\|config.animation" assets/bf25-expansion-core.js | head -50
```

This will reveal the exact timing and sequencing of the unlock operation.
