# BF25 Sticky Cart - CSS & Structure Extraction
**Generated:** 2025-11-24
**Purpose:** Complete CSS, HTML structure, z-index stack, and gift slot implementation reference

---

## SECTION 1: STICKY CART CONTAINER CSS

**File:** `assets/bf25-tier-cart.css`

### 1.1: Core Container Styles (Lines 66-96)

```css
.bf25sc-sticky-cart {
  /* Positioning */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--bf25sc-z-sticky);

  /* Glassmorphic Background (Premium) */
  background: linear-gradient(
    135deg,
    rgba(10, 10, 10, 0.98) 0%,
    rgba(25, 25, 25, 0.98) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* Dynamic Tier Glow Border */
  border-top: 2px solid rgba(var(--bf25sc-tier-color-rgb), 0.4);

  /* Elevation Shadow */
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.7),
    inset 0 10px 20px -10px var(--bf25sc-tier-glow);

  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px var(--bf25sc-space-lg);  /* Reduced top padding from 8px to 6px for compact layout */
  gap: var(--bf25sc-space-xs);

  /* Isolation */
  contain: layout style paint;
}
```

### 1.2: Progress Wrapper (Lines 111-119)

```css
.bf25sc-sticky-cart__progress-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 58px;  /* Compact: 20px tier + 3px gap + 20px bar + 3px gap + 12px items */
  display: flex;
  flex-direction: column;
  gap: 3px;  /* Compact spacing - tight layout for sticky cart */
}
```

### 1.3: Action Section (Lines 591-599)

```css
.bf25sc-sticky-cart__action-section {
  display: flex;
  align-items: center;
  gap: var(--bf25sc-space-md);
  width: 100%;
  max-width: 700px;
  height: 37px;
  margin-top: var(--bf25sc-space-xs);
}
```

### 1.4: State Variations

**Syncing State (Lines 1092-1109):**
```css
.bf25sc-sticky-cart[data-state="syncing"] {
  pointer-events: none;
}

.bf25sc-sticky-cart[data-state="syncing"]::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--bf25sc-tier-color);
  border-radius: 50%;
  animation: bf25scSpin 0.6s linear infinite;
  z-index: 1001;
}

@keyframes bf25scSpin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

**Loading State (Lines 1118-1138):**
```css
.bf25sc-sticky-cart[data-state="loading"] {
  pointer-events: none;
  opacity: 0.7;
}

.bf25sc-sticky-cart[data-state="loading"]::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
```

---

## SECTION 2: TIER-SPECIFIC STYLING

### 2.1: Tier 0 (Gray) - Default
```css
.bf25sc-sticky-cart[data-active-tier="0"] {
  --bf25sc-tier-color: #6b7280;
  --bf25sc-tier-glow-color: #9ca3af;
  --bf25sc-tier-glow: rgba(107, 114, 128, 0.4);
  --bf25sc-tier-color-rgb: 107, 114, 128;
}
```

### 2.2: Tier 1-2 (Green)
```css
.bf25sc-sticky-cart[data-active-tier="1"],
.bf25sc-sticky-cart[data-active-tier="2"] {
  --bf25sc-tier-color: #60c655;
  --bf25sc-tier-glow-color: #7ed957;
  --bf25sc-tier-glow: rgba(96, 198, 85, 0.5);
  --bf25sc-tier-color-rgb: 96, 198, 85;
}
```

### 2.3: Tier 3 (Gold) - Lines 518-529
```css
.bf25sc-sticky-cart[data-active-tier="3"] {
  --bf25sc-tier-color: #FFD700;
  --bf25sc-tier-glow-color: #FFF700;
  --bf25sc-tier-glow: rgba(255, 215, 0, 0.7);
  --bf25sc-tier-color-rgb: 255, 215, 0;
}

.bf25sc-sticky-cart[data-active-tier="3"] .bf25sc-tier-label.is-reached .bf25sc-tier-label__text {
  background: #FFD700 !important;
  border-color: #FFD700 !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7) !important;
}

/* Enhanced Gold Glow (Lines 987-994) */
.bf25sc-sticky-cart[data-active-tier="3"] {
  border-top-color: rgba(255, 215, 0, 0.6);
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.7),
    inset 0 10px 20px -10px rgba(255, 215, 0, 0.3),
    0 0 30px rgba(255, 215, 0, 0.2);
}

/* Gold Gradient for Text (Lines 997-1003) */
.bf25sc-sticky-cart[data-active-tier="3"] .bf25sc-highlight {
  background: linear-gradient(90deg, #d1b002 0%, #ffd700 50%, #f8e47a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
}
```

### 2.4: Tier 4 (Platinum) - Lines 532-544
```css
.bf25sc-sticky-cart[data-active-tier="4"] {
  --bf25sc-tier-color: #E0F7FF;
  --bf25sc-tier-glow-color: #FFFFFF;
  --bf25sc-tier-glow: rgba(224, 247, 255, 0.8);
  --bf25sc-tier-color-rgb: 224, 247, 255;
}

.bf25sc-sticky-cart[data-active-tier="4"] .bf25sc-tier-label.is-reached .bf25sc-tier-label__text {
  color: #000 !important;
  background: #E0F7FF !important;
  border-color: #E0F7FF !important;
  box-shadow: 0 0 20px rgba(224, 247, 255, 0.8) !important;
}

/* Enhanced Platinum Glow (Lines 1006-1013) */
.bf25sc-sticky-cart[data-active-tier="4"] {
  border-top-color: rgba(224, 247, 255, 0.7);
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.7),
    inset 0 10px 20px -10px rgba(224, 247, 255, 0.4),
    0 0 40px rgba(224, 247, 255, 0.3);
}

/* Platinum Gradient for Text (Lines 1016-1022) */
.bf25sc-sticky-cart[data-active-tier="4"] .bf25sc-highlight {
  background: linear-gradient(90deg, #d6f6ff 0%, #cae8f3 50%, #fafdff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(224, 247, 255, 0.6));
}

/* Platinum Button Styling (Lines 1025-1028) */
.bf25sc-sticky-cart[data-active-tier="4"] .bf25sc-action-btn--buy {
  color: #000;
  font-weight: 800;
}
```

---

## SECTION 3: Z-INDEX STACK

**File:** `assets/bf25-modal-design.css`

### Complete Z-Index Hierarchy (from grep output):

```css
/* Line 169: Overlay base */
z-index: var(--bf25-z-overlay);

/* Line 196: Modal container */
z-index: var(--bf25-z-modal);

/* Line 336: Content layer */
z-index: 10; /* Above content */

/* Line 600: Confetti canvas */
z-index: 1000;

/* Line 723: Element layer */
z-index: 2;

/* Line 1376: Background element */
z-index: 1;

/* Line 1949: Top element */
z-index: 10;

/* Line 2236: Layer 1 */
z-index: 1;

/* Line 2254: Layer 1 */
z-index: 1;

/* Line 2345: Layer 1 */
z-index: 1;

/* Line 2390: Layer 10 */
z-index: 10;

/* Line 2533: Modal element */
z-index: 100;

/* Line 2553: Below modal */
z-index: 99;

/* Line 2721: Toast messages */
z-index: 10000;

/* Line 2969: Layer 1 */
z-index: 1;

/* Line 2976: Layer 2 */
z-index: 2;

/* Line 3333: High priority modal */
z-index: 2000000; /* Higher than main modal */

/* Line 3640: Hidden layer */
z-index: -1 !important;

/* Line 3672: Critical overlay */
z-index: 99999 !important;

/* Line 3677: Top level */
z-index: 100000 !important;

/* Line 3702: Hidden layer */
z-index: -1 !important;
```

### Z-Index Summary Table:

| Layer | Z-Index | Purpose |
|-------|---------|---------|
| Hidden | -1 | Background elements |
| Base | 1-2 | Standard content |
| Content | 10 | Above base content |
| Modals | 99-100 | Product modals |
| Sticky Cart | 999 (via CSS variable) | Persistent cart UI |
| Confetti | 1000 | Celebration effects |
| Syncing Spinner | 1001 | Loading indicator |
| Toasts | 10000 | User notifications |
| Critical Overlays | 99999 | Emergency overlays |
| Top Level | 100000 | Absolute top |
| Priority Modals | 2000000 | Special cases |

**CSS Variables (Inferred):**
```css
:root {
  --bf25-z-overlay: ~9998;
  --bf25-z-modal: ~9999;
  --bf25sc-z-sticky: 999;
}
```

---

## SECTION 4: GIFT SLOT IMPLEMENTATION

### 4.1: HTML Structure (from sections/bf25-tier-cart.liquid)

**Lines 70-91:**
```liquid
{% if i == 4 or i == 8 or i == 12 or i == 16 %}
<div
  class="bf25sc-gift-slot"
  data-checkpoint-value="{{ i }}"
  data-state="locked"
  data-tier="{% if i == 4 %}1{% elsif i == 8 %}2{% elsif i == 12 %}3{% elsif i == 16 %}4{% endif %}"
>
  <!-- Locked Icon (Default) -->
  <span class="bf25sc-gift-icon bf25sc-gift-icon--locked">🎁</span>

  <!-- Unlocked Icons (Tier-Specific) -->
  <span class="bf25sc-gift-icon bf25sc-gift-icon--unlocked">
    {% if i == 4 %}🔌{% endif %}
    {% if i == 8 %}📦{% endif %}
    {% if i == 12 %}🧲{% endif %}
    {% if i == 16 %}🎁{% endif %}
  </span>

  <!-- Checkmark (Claimed State) -->
  <span class="bf25sc-gift-checkmark">✅</span>

  <!-- Value Flash Overlay (Gemini Phase 1) -->
  <span
    class="bf25sc-value-flash"
    data-value="{% if i == 4 %}30{% elsif i == 8 %}65{% elsif i == 12 %}125{% elsif i == 16 %}275{% endif %}"
  >
    +€{% if i == 4 %}30{% elsif i == 8 %}65{% elsif i == 12 %}125{% elsif i == 16 %}275{% endif %} Value
  </span>
</div>
{% endif %}
```

### 4.2: Gift Icon Mapping

| Checkpoint | Tier | Icon | Gift Product | Value |
|------------|------|------|--------------|-------|
| 4 items | 1 | 🔌 | 100W 4-in-1 Cable | €30 |
| 8 items | 2 | 📦 | Travel Case | €65 |
| 12 items | 3 | 🧲 | Magnetic Cable | €125 |
| 16 items | 4 | 🎁 | Mystery Gift | €275 |

### 4.3: JavaScript Gift Slot Selection (assets/bf25-tier-cart.js)

**Line 735-741: GiftAnimator finds slot by checkpoint**
```javascript
const slot = document.querySelector(
  `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
);

if (!slot) {
  console.error(`[GiftAnimator] No slot found for tier ${tier}`);
  return;
}
```

**Line 1096-1105: ConfettiSystem uses slot position**
```javascript
const slot = document.querySelector(
  `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
);

if (!slot) {
  console.warn(`[ConfettiSystem] No slot found for checkpoint ${checkpoint}`);
  return null;
}

const rect = slot.getBoundingClientRect();
const containerRect = this.container.getBoundingClientRect();
```

**Line 1150: CartManager element references**
```javascript
this.elements = {
  giftSlots: document.querySelectorAll('.bf25sc-gift-slot'),
  incentiveText: document.getElementById('bf25sc-incentive-text'),
  savingsAmount: document.getElementById('bf25sc-savings-amount'),
  btnView: document.getElementById('bf25sc-btn-view'),
  btnBuy: document.getElementById('bf25sc-btn-buy'),
  announcer: document.getElementById('bf25sc-cart-announcements')
};
```

**Line 1722-1725: Update gift slot states**
```javascript
this.elements.giftSlots.forEach(slot => {
  const checkpoint = parseInt(slot.dataset.checkpointValue, 10);
  if (this.itemCount >= checkpoint) {
    slot.dataset.state = 'claimed';
  }
});
```

### 4.4: Gift Slot CSS (from assets/bf25-tier-cart.css)

**Base Styles:**
```css
.bf25sc-gift-slot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  pointer-events: all;
}

.bf25sc-gift-slot[data-state="locked"] {
  background: rgba(107, 114, 128, 0.2);
  border-color: rgba(107, 114, 128, 0.4);
}

.bf25sc-gift-slot[data-state="claimed"] {
  background: rgba(var(--bf25sc-tier-color-rgb), 0.2);
  border-color: var(--bf25sc-tier-color);
  box-shadow: 0 0 12px var(--bf25sc-tier-glow);
}
```

**Icon Visibility:**
```css
/* Default: Show locked icon */
.bf25sc-gift-icon--locked {
  display: block;
}

.bf25sc-gift-icon--unlocked,
.bf25sc-gift-checkmark {
  display: none;
}

/* Claimed State: Show checkmark */
.bf25sc-gift-slot[data-state="claimed"] .bf25sc-gift-icon--locked,
.bf25sc-gift-slot[data-state="claimed"] .bf25sc-gift-icon--unlocked {
  display: none;
}

.bf25sc-gift-slot[data-state="claimed"] .bf25sc-gift-checkmark {
  display: block;
}
```

**Responsive Sizing (Lines 571-579, 825-832):**
```css
/* Mobile (<375px) */
.bf25sc-gift-slot {
  width: 16px;
  height: 16px;
}

.bf25sc-gift-icon {
  font-size: 14px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .bf25sc-gift-slot {
    width: 24px;
    height: 24px;
  }

  .bf25sc-gift-icon {
    font-size: 20px;
  }
}
```

---

## SECTION 5: COMPLETE LIQUID HTML STRUCTURE

**File:** `sections/bf25-tier-cart.liquid` (Lines 9-158)

```liquid
<div
  id="bf25sc-sticky-cart"
  class="bf25sc-sticky-cart"
  data-active-tier="0"
  data-item-count="0"
  data-section-id="{{ section.id }}"
  style="display: {% if section.settings.show_by_default %}flex{% else %}none{% endif %};"
>

  <!-- Progress Section (28px height) -->
  <div class="bf25sc-sticky-cart__progress-wrapper">

    <!-- Tier Labels Row (8px height, above bar) -->
    <div class="bf25sc-sticky-cart__tier-labels">
      <div class="bf25sc-tier-label" data-tier="0" data-value="1" data-checkpoint="start">
        <span class="bf25sc-tier-label__text">50%</span>
      </div>
      <div class="bf25sc-tier-label" data-tier="1" data-value="4" data-checkpoint="4">
        <span class="bf25sc-tier-label__text">60%</span>
      </div>
      <div class="bf25sc-tier-label" data-tier="2" data-value="8" data-checkpoint="8">
        <span class="bf25sc-tier-label__text">70%</span>
      </div>
      <div class="bf25sc-tier-label" data-tier="3" data-value="12" data-checkpoint="12">
        <span class="bf25sc-tier-label__text">80%</span>
      </div>
      <div class="bf25sc-tier-label" data-tier="4" data-value="16" data-checkpoint="16">
        <span class="bf25sc-tier-label__text">85%</span>
      </div>
    </div>

    <!-- Item Count Labels (Below Bar) -->
    <div class="bf25sc-sticky-cart__item-labels">
      <div class="bf25sc-item-label" data-value="1">
        <span class="bf25sc-item-label__text">1 item</span>
      </div>
      <div class="bf25sc-item-label" data-value="4">
        <span class="bf25sc-item-label__text">4 items</span>
      </div>
      <div class="bf25sc-item-label" data-value="8">
        <span class="bf25sc-item-label__text">8 items</span>
      </div>
      <div class="bf25sc-item-label" data-value="12">
        <span class="bf25sc-item-label__text">12 items</span>
      </div>
      <div class="bf25sc-item-label" data-value="16">
        <span class="bf25sc-item-label__text">16 items</span>
      </div>
    </div>

    <!-- Progress Bar Container (20px height) -->
    <div class="bf25sc-progress-bar">

      <!-- 16-Segment Structure (Flexbox Layout) -->
      <div class="bf25sc-progress-bar__segments">
        {% for i in (1..16) %}
        <div
          class="bf25sc-progress-bar__segment"
          data-segment="{{ i }}"
          data-checkpoint="{% if i == 4 or i == 8 or i == 12 or i == 16 %}true{% else %}false{% endif %}"
        >
          <!-- Gift icon slots at checkpoints (4, 8, 12, 16) -->
          {% if i == 4 or i == 8 or i == 12 or i == 16 %}
          <div class="bf25sc-gift-slot" data-checkpoint-value="{{ i }}" data-state="locked" data-tier="{% if i == 4 %}1{% elsif i == 8 %}2{% elsif i == 12 %}3{% elsif i == 16 %}4{% endif %}">
            <!-- Locked Icon (Default) -->
            <span class="bf25sc-gift-icon bf25sc-gift-icon--locked">🎁</span>

            <!-- Unlocked Icons (Tier-Specific) -->
            <span class="bf25sc-gift-icon bf25sc-gift-icon--unlocked">
              {% if i == 4 %}🔌{% endif %}
              {% if i == 8 %}📦{% endif %}
              {% if i == 12 %}🧲{% endif %}
              {% if i == 16 %}🎁{% endif %}
            </span>

            <!-- Checkmark (Claimed State) -->
            <span class="bf25sc-gift-checkmark">✅</span>

            <!-- Value Flash Overlay (Gemini Phase 1) -->
            <span class="bf25sc-value-flash" data-value="{% if i == 4 %}30{% elsif i == 8 %}65{% elsif i == 12 %}125{% elsif i == 16 %}275{% endif %}">
              +€{% if i == 4 %}30{% elsif i == 8 %}65{% elsif i == 12 %}125{% elsif i == 16 %}275{% endif %} Value
            </span>
          </div>
          {% endif %}
        </div>
        {% endfor %}
      </div>

    </div>
  </div>

  <!-- Action Section (37px height) -->
  <div class="bf25sc-sticky-cart__action-section">

    <!-- Incentive Message (Left, flexible width) -->
    <div class="bf25sc-action-incentive">
      <span class="bf25sc-action-incentive__text" id="bf25sc-incentive-text">
        Add <strong class="bf25sc-highlight">4 items</strong> → <strong class="bf25sc-highlight">🔥 60% OFF</strong>
      </span>
    </div>

    <!-- Savings Display (Center, 80px fixed) -->
    <div class="bf25sc-action-savings">
      <span class="bf25sc-action-savings__amount" id="bf25sc-savings-amount">Save €0</span>
    </div>

    <!-- CTAs (Right, 75px total) -->
    <div class="bf25sc-action-ctas">
      <button
        type="button"
        class="bf25sc-action-btn bf25sc-action-btn--view"
        id="bf25sc-btn-view"
        aria-label="View cart contents"
        aria-expanded="false"
      >
        View ▼
      </button>
      <button
        type="button"
        class="bf25sc-action-btn bf25sc-action-btn--buy"
        id="bf25sc-btn-buy"
        aria-label="Proceed to checkout"
      >
        Buy Now
      </button>
    </div>

  </div>

  <!-- Expanded Cart View (90px, initially hidden) -->
  <div class="bf25sc-sticky-cart__expanded" id="bf25sc-expanded-cart" style="display: none;">

    <!-- Products Carousel -->
    <div class="bf25sc-expanded-products" id="bf25sc-product-carousel">
      <div class="bf25sc-expanded-products__scroll" id="bf25sc-product-scroll">
        <!-- Products will be inserted here by JavaScript -->
      </div>
    </div>

    <!-- Empty State Message -->
    <div class="bf25sc-expanded-empty" id="bf25sc-expanded-empty" style="display: none;">
      <p class="bf25sc-expanded-empty__text">Your cart is empty</p>
    </div>

  </div>

  <!-- Confetti Container -->
  <div class="bf25sc-confetti-container" id="bf25sc-confetti-container"></div>

  <!-- Toast Notification System -->
  <div class="bf25sc-toast-container" id="bf25sc-toast-container"></div>

  <!-- Screen Reader Announcements -->
  <div
    id="bf25sc-cart-announcements"
    class="sr-only"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  ></div>

</div>
```

---

## SECTION 6: RESPONSIVE BREAKPOINTS

### Mobile First Approach

**Base (Default):** Mobile (<375px)
```css
.bf25sc-sticky-cart {
  padding: 4px 8px;
}

.bf25sc-sticky-cart__progress-wrapper {
  height: 24px;
}

.bf25sc-progress-bar {
  height: 18px;
}

.bf25sc-gift-slot {
  width: 16px;
  height: 16px;
}

.bf25sc-action-btn {
  font-size: 11px;
  min-height: 28px;
}
```

**Small Mobile (375px-767px):**
```css
@media (min-width: 375px) {
  .bf25sc-sticky-cart {
    padding: 8px 20px;
  }

  .bf25sc-sticky-cart__action-section {
    gap: 12px;
  }

  .bf25sc-action-btn--view {
    width: 80px;
  }

  .bf25sc-action-btn--buy {
    width: 100px;
  }
}
```

**Tablet (768px+):**
```css
@media (min-width: 768px) {
  .bf25sc-sticky-cart {
    padding: var(--bf25sc-space-md) var(--bf25sc-space-xl);
  }

  .bf25sc-gift-slot {
    width: 24px;
    height: 24px;
  }

  .bf25sc-gift-icon {
    font-size: 20px;
  }

  .bf25sc-sticky-cart__action-section {
    max-width: 800px;
    gap: var(--bf25sc-space-lg);
  }
}
```

**Desktop (1280px+):**
```css
@media (min-width: 1280px) {
  .bf25sc-sticky-cart {
    padding: 12px 32px;
  }

  .bf25sc-sticky-cart__progress-wrapper,
  .bf25sc-sticky-cart__action-section {
    max-width: 900px;
  }

  .bf25sc-sticky-cart__action-section {
    gap: 16px;
  }

  .bf25sc-action-savings {
    width: 120px;
  }

  .bf25sc-action-btn {
    font-size: 15px;
    min-height: 40px;
  }

  .bf25sc-action-btn--view {
    width: 90px;
  }

  .bf25sc-action-btn--buy {
    width: 110px;
  }
}
```

**Landscape Mobile (<768px + landscape):**
```css
@media (max-width: 767px) and (orientation: landscape) {
  .bf25sc-sticky-cart {
    padding: 4px 12px;
  }

  .bf25sc-sticky-cart__progress-wrapper {
    height: 22px;
  }

  .bf25sc-progress-bar {
    height: 16px;
  }

  .bf25sc-sticky-cart__action-section {
    height: 30px;
  }

  .bf25sc-tier-label__text {
    font-size: 9px;
    padding: 1px 3px;
  }

  .bf25sc-action-incentive__text {
    font-size: 11px;
  }

  .bf25sc-action-btn {
    min-height: 26px;
    font-size: 11px;
  }
}
```

---

## SECTION 7: ACCESSIBILITY FEATURES

### 7.1: Keyboard Navigation Support

```css
/* Focus Visible States (Lines 1035-1039) */
.bf25sc-action-btn:focus-visible {
  outline: 3px solid var(--bf25sc-tier-color);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(var(--bf25sc-tier-color-rgb), 0.2);
}

/* High Contrast Focus (Lines 1042-1047) */
@media (prefers-contrast: high) {
  .bf25sc-action-btn:focus-visible {
    outline: 4px solid currentColor;
    outline-offset: 4px;
  }
}
```

### 7.2: Reduced Motion Support

```css
/* Disable Animations (Lines 1054-1069) */
@media (prefers-reduced-motion: reduce) {
  .bf25sc-sticky-cart,
  .bf25sc-sticky-cart *,
  .bf25sc-sticky-cart *::before,
  .bf25sc-sticky-cart *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Disable flowing animation */
  .bf25sc-progress-bar__segment.is-filled {
    animation: none;
    background: var(--bf25sc-tier-color);
  }
}
```

### 7.3: Screen Reader Support

**ARIA Live Region:**
```liquid
<div
  id="bf25sc-cart-announcements"
  class="sr-only"
  role="status"
  aria-live="polite"
  aria-atomic="true"
></div>
```

**Button Labels:**
```liquid
<button
  type="button"
  class="bf25sc-action-btn bf25sc-action-btn--view"
  id="bf25sc-btn-view"
  aria-label="View cart contents"
  aria-expanded="false"
>
  View ▼
</button>

<button
  type="button"
  class="bf25sc-action-btn bf25sc-action-btn--buy"
  id="bf25sc-btn-buy"
  aria-label="Proceed to checkout"
>
  Buy Now
</button>
```

---

## SECTION 8: PERFORMANCE OPTIMIZATIONS

### 8.1: CSS Containment

```css
/* Lines 58-61 */
.bf25sc-sticky-cart {
  contain: layout style paint;
}
```

**Benefits:**
- Isolates layout calculations
- Prevents style recalculation cascade
- Improves paint performance

### 8.2: Reduced Data Support

```css
/* Lines 1072-1078 */
@media (prefers-reduced-data: reduce) {
  .bf25sc-sticky-cart {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

**Benefits:**
- Disables expensive blur effects on slow connections
- Reduces CPU/GPU usage
- Saves bandwidth

### 8.3: Print Optimization

```css
/* Lines 1083-1087 */
@media print {
  .bf25sc-sticky-cart {
    display: none !important;
  }
}
```

---

## SECTION 9: KEY DESIGN DECISIONS

### 9.1: Fixed Positioning Strategy
- **Bottom-anchored:** Sticky cart always visible at bottom
- **Full-width:** Spans entire viewport on mobile
- **Centered content:** Progress bar and actions max-width 700-900px

### 9.2: Glassmorphic Background
- **Dark gradient:** rgba(10,10,10,0.98) → rgba(25,25,25,0.98)
- **Backdrop blur:** 20px blur + 180% saturation
- **Tier-specific glow:** Dynamic border-top color and inset shadow

### 9.3: Tier Color System
- **CSS Variables:** All tier colors use CSS custom properties
- **Dynamic updates:** JavaScript sets `data-active-tier` attribute
- **Cascading colors:** Tier color affects border, glow, buttons, labels

### 9.4: Gift Icon States
- **3 visual states:** locked (🎁), unlocked (tier-specific emoji), claimed (✅)
- **State transitions:** Controlled by `data-state` attribute
- **Animation hooks:** GiftAnimator class targets via `data-checkpoint-value`

### 9.5: Compact Mobile Layout
- **Vertical stacking:** Progress bar + action section
- **Adaptive spacing:** 6px padding on mobile → 32px on desktop
- **Smart hiding:** Savings display hidden <375px, incentive text truncated

---

**Generated by:** Claude Code
**Timestamp:** 2025-11-24
**Files Analyzed:**
- `assets/bf25-tier-cart.css` (1,362 lines)
- `assets/bf25-modal-design.css` (z-index declarations)
- `sections/bf25-tier-cart.liquid` (158 lines)
- `assets/bf25-tier-cart.js` (gift slot selectors)
