# BF25 Progress Bar Design System
**Ultimate Premium Progress Bar - Extraction Package**

Complete design specifications, tier logic, animations, and implementation guide for reuse in sticky cart and other components.

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Visual Specifications](#visual-specifications)
3. [HTML Structure](#html-structure)
4. [CSS Styling & Animations](#css-styling--animations)
5. [JavaScript Logic](#javascript-logic)
6. [Tier Configuration](#tier-configuration)
7. [Color System](#color-system)
8. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Principles
- **Discrete Cell Filling**: Progress fills in whole segments (1, 2, 3...), not continuous percentages
- **DOM-Based Segments**: Real HTML elements for each segment, not CSS masks
- **Tier-Based Theming**: Comprehensive color theming that affects ALL UI elements
- **Premium Animations**: Flowing energy gradients, pulsing glows, celebration effects
- **Accessibility First**: ARIA labels, keyboard navigation, reduced motion support

### Key Features
- 16 discrete segments representing 1-16 items
- 5 tier levels (0-4) with unique colors and animations
- Dynamic tier theming (gray → green → gold → platinum)
- Flowing gradient animation within filled segments
- Tier-specific glow effects

---

## Visual Specifications

### Dimensions
```css
--pb-height: 24px;
--pb-radius: 12px;
--pb-segment-count: 16;
--pb-segment-gap: 3px;
```

### Segment Calculation
```css
--total-gap-width: calc((16 - 1) * 3px);  /* 45px total gaps */
--segment-width: calc((100% - 45px) / 16);
```

### Spacing
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
```

---

## HTML Structure

### Core Progress Bar
```html
<!-- Progress Bar Container -->
<div class="progress-bar progress-bar--segmented">
  <div class="progress-bar__segments">
    <!-- 16 individual segments (Liquid loop or JS generation) -->
    {% for i in (1..16) %}
    <div class="progress-bar__segment" data-segment="{{ i }}"></div>
    {% endfor %}
  </div>
</div>
```

### Complete Slider Wrapper
```html
<div class="bf25-hero__slider-wrapper" data-active-tier="0">

  <!-- Discount Labels (Above Bar) -->
  <div class="bf25-hero__discount-labels">
    <div class="bf25-hero__discount-label-item" data-tier="0" data-value="1">
      <span class="bf25-hero__discount-text">50%</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="1" data-value="4">
      <span class="bf25-hero__discount-text">60%</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="2" data-value="8">
      <span class="bf25-hero__discount-text">70%</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="3" data-value="12">
      <span class="bf25-hero__discount-text">80%</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="4" data-value="16">
      <span class="bf25-hero__discount-text">85%</span>
    </div>
  </div>

  <!-- Drag Indicator (Optional) -->
  <div class="bf25-hero__drag-indicator" id="bf25-drag-indicator">
    <div class="bf25-hero__drag-arrow">→</div>
    <span class="bf25-hero__drag-text">DRAG</span>
  </div>

  <!-- Progress Bar -->
  <div class="progress-bar progress-bar--segmented">
    <div class="progress-bar__segments">
      {% for i in (1..16) %}
      <div class="progress-bar__segment" data-segment="{{ i }}"></div>
      {% endfor %}
    </div>
  </div>

  <!-- Invisible Range Input -->
  <input type="range" min="0" max="16" step="1" value="0"
         class="bf25-hero__input"
         aria-label="Select number of items"
         aria-valuemin="0" aria-valuemax="16" aria-valuenow="0"/>

  <!-- Checkpoints (Below Bar) -->
  <div class="bf25-hero__checkpoints">
    <div class="bf25-hero__checkpoint" data-value="1">
      <span class="bf25-hero__checkpoint-label">1 <span class="checkpoint-subtext">item</span></span>
    </div>
    <div class="bf25-hero__checkpoint" data-tier="1" data-value="4">
      <span class="bf25-hero__checkpoint-label">4 <span class="checkpoint-subtext">items</span></span>
    </div>
    <div class="bf25-hero__checkpoint" data-tier="2" data-value="8">
      <span class="bf25-hero__checkpoint-label">8 <span class="checkpoint-subtext">items</span></span>
    </div>
    <div class="bf25-hero__checkpoint" data-tier="3" data-value="12">
      <span class="bf25-hero__checkpoint-label">12 <span class="checkpoint-subtext">items</span></span>
    </div>
    <div class="bf25-hero__checkpoint" data-tier="4" data-value="16">
      <span class="bf25-hero__checkpoint-label">16 <span class="checkpoint-subtext">items</span></span>
    </div>
  </div>
</div>
```

---

## CSS Styling & Animations

### Base Container
```css
/* Progress bar container */
.progress-bar {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;

  /* Premium casing with depth */
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6),
              0 1px 0 rgba(255, 255, 255, 0.05);
  pointer-events: none;
}
```

### Segments Container
```css
/* Flexbox container for segments */
.progress-bar__segments {
  display: flex;
  gap: 3px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}
```

### Individual Segment
```css
/* Each segment (unfilled state) */
.progress-bar__segment {
  display: block !important; /* Force visibility */
  flex: 1;
  height: 100%;
  min-width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: background-color 300ms ease, box-shadow 300ms ease;
  opacity: 1;
  visibility: visible;
}

/* Filled segment */
.progress-bar__segment.is-filled {
  /* Animated gradient background */
  background: linear-gradient(
    90deg,
    var(--color-tier-current) 0%,
    var(--color-tier-glow) 50%,
    var(--color-tier-current) 100%
  );
  background-size: 200% 100%;
  animation: segmentFlow 2s ease-in-out infinite;
  box-shadow: 0 0 12px var(--pb-glow-color),
              inset 0 0 8px var(--pb-glow-color);
}
```

### Flowing Animation
```css
/* Flowing energy gradient animation */
@keyframes segmentFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Discount Labels (Above Bar)
```css
/* Container for labels above bar */
.bf25-hero__discount-labels {
  position: relative;
  width: 100%;
  height: 25px;
  margin-bottom: 8px;
  pointer-events: none;
}

/* Individual label */
.bf25-hero__discount-label-item {
  position: absolute;
  transform: translateX(-50%);
}

/* Positioning */
.bf25-hero__discount-label-item[data-value="1"] {
  left: 0%;
  transform: translateX(0);
}
.bf25-hero__discount-label-item[data-value="4"] { left: 25%; }
.bf25-hero__discount-label-item[data-value="8"] { left: 50%; }
.bf25-hero__discount-label-item[data-value="12"] { left: 75%; }
.bf25-hero__discount-label-item[data-value="16"] {
  left: 100%;
  transform: translateX(-100%);
}

/* Label styling */
.bf25-hero__discount-text {
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  background: #0a0a0a;
  padding: 3px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Reached state */
.bf25-hero__discount-label-item.is-reached .bf25-hero__discount-text {
  color: #000;
  background: var(--color-tier-current);
  border-color: var(--color-tier-current);
  box-shadow: 0 0 8px var(--pb-glow-color);
}
```

### Checkpoints (Below Bar)
```css
/* Container for checkpoints below bar */
.bf25-hero__checkpoints {
  position: relative;
  width: 100%;
  height: 30px;
  margin-top: 4px;
  pointer-events: none;
}

/* Individual checkpoint */
.bf25-hero__checkpoint {
  position: absolute;
  transform: translateX(-50%);
}

/* Positioning (same as labels) */
.bf25-hero__checkpoint[data-value="1"] {
  left: 0%;
  transform: translateX(0);
}
.bf25-hero__checkpoint[data-value="4"] { left: 25%; }
.bf25-hero__checkpoint[data-value="8"] { left: 50%; }
.bf25-hero__checkpoint[data-value="12"] { left: 75%; }
.bf25-hero__checkpoint[data-value="16"] {
  left: 100%;
  transform: translateX(-100%);
}

/* Checkpoint label */
.bf25-hero__checkpoint-label {
  font-size: 12px;
  font-weight: 600;
  color: #a1a1aa;
  transition: color 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Reached state */
.bf25-hero__checkpoint.is-reached .bf25-hero__checkpoint-label {
  color: #60c655;
}

/* Active checkpoint (current value) */
.bf25-hero__checkpoint.is-active .bf25-hero__checkpoint-label {
  color: var(--color-tier-current);
  font-weight: 800;
  text-shadow: 0 0 8px var(--pb-glow-color);
}
```

### Invisible Range Input
```css
/* Hidden range input for interaction */
.bf25-hero__input {
  position: absolute;
  top: 23px; /* Position over progress bar */
  left: 0;
  width: 100%;
  height: 44px;
  opacity: 0;
  cursor: pointer;
  z-index: 100;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  margin: 0;
  pointer-events: auto;
}

/* WebKit thumb */
.bf25-hero__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  pointer-events: auto;
}

/* Firefox thumb */
.bf25-hero__input::-moz-range-thumb {
  appearance: none;
  width: 24px;
  height: 44px;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  pointer-events: auto;
}
```

### Drag Indicator (Optional)
```css
/* Drag indicator */
.bf25-hero__drag-indicator {
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  opacity: 1;
  transition: opacity 400ms ease;
  pointer-events: none;
  z-index: 5;
}

/* Arrow */
.bf25-hero__drag-arrow {
  font-size: 28px;
  font-weight: 300;
  line-height: 1;
  color: rgba(255, 255, 255, 0.5);
  animation: arrowPulse 2s ease-in-out infinite;
}

/* "DRAG" text */
.bf25-hero__drag-text {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Pulse animation */
@keyframes arrowPulse {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.5;
  }
  50% {
    transform: translateX(4px);
    opacity: 1;
  }
}

/* Hide after interaction */
.bf25-hero__drag-indicator.is-hidden {
  opacity: 0;
}
```

---

## JavaScript Logic

### Core Segment Filling Logic
```javascript
/**
 * Update progress bar visualization with discrete segment filling
 * Called whenever slider value changes
 */
updateVisualization() {
  const section = document.getElementById('bf25-hero-section') || this.container;

  // Determine tier color and glow based on current tier
  let color, glow, glowColor;

  switch(this.currentTier.id) {
    case 0:
      color = '#6b7280';
      glow = 'rgba(107, 114, 128, 0.3)';
      glowColor = '#a1a1aa';
      break;
    case 1:
      color = '#60c655';
      glow = 'rgba(96, 198, 85, 0.5)';
      glowColor = '#7FFF00';
      break;
    case 2:
      color = '#60c655';
      glow = 'rgba(127, 255, 0, 0.6)';
      glowColor = '#39FF14';
      break;
    case 3:
      color = '#FFD700';
      glow = 'rgba(255, 215, 0, 0.7)';
      glowColor = '#FFF700';
      break;
    case 4:
      color = '#E0F7FF';
      glow = 'rgba(224, 247, 255, 0.8)';
      glowColor = '#FFFFFF';
      break;
    default:
      color = '#6b7280';
      glow = 'rgba(107, 114, 128, 0.3)';
      glowColor = '#a1a1aa';
  }

  // Set CSS custom properties globally
  section.style.setProperty('--color-tier-current', color);
  section.style.setProperty('--pb-glow-color', glow);
  section.style.setProperty('--color-tier-glow', glowColor);

  // Fill segments individually (DOM approach)
  const segments = this.container.querySelectorAll('.progress-bar__segment');
  segments.forEach((segment, index) => {
    // Segments are 0-indexed, values are 1-16
    if (index < this.currentValue) {
      segment.classList.add('is-filled');
    } else {
      segment.classList.remove('is-filled');
    }
  });
}
```

### Tier Calculation
```javascript
/**
 * Calculate current tier based on slider value
 * @param {number} value - Current slider value (0-16)
 * @returns {object} - Tier configuration object
 */
calculateTier(value) {
  const tier = this.tiers.find(t => value >= t.min && value <= t.max);
  return tier || this.tiers[0];
}
```

### Update Checkpoints
```javascript
/**
 * Update checkpoint states based on current value
 */
updateCheckpoints() {
  this.elements.checkpoints.forEach(checkpoint => {
    const checkpointValue = parseInt(checkpoint.dataset.value, 10);

    // Mark as reached if we've passed this checkpoint
    if (this.currentValue >= checkpointValue) {
      checkpoint.classList.add('is-reached');
    } else {
      checkpoint.classList.remove('is-reached');
    }

    // Mark current checkpoint as active
    if (this.currentValue === checkpointValue) {
      checkpoint.classList.add('is-active');
    } else {
      checkpoint.classList.remove('is-active');
    }
  });
}
```

### Update Discount Labels
```javascript
/**
 * Update discount labels above progress bar
 */
updateDiscountLabels() {
  this.elements.discountLabels.forEach(label => {
    const labelValue = parseInt(label.dataset.value, 10);
    if (this.currentValue >= labelValue) {
      label.classList.add('is-reached');
    } else {
      label.classList.remove('is-reached');
    }
  });
}
```

### Slider Input Handler
```javascript
/**
 * Handle slider input and trigger all updates
 * @param {number} value - New slider value
 */
handleSliderInput(value) {
  // Optimization: Exit if value didn't change
  if (this.currentValue === value) return;

  this.currentValue = value;
  this.currentTier = this.calculateTier(value);

  // Add tier to slider wrapper for tier-specific styling
  if (this.elements.sliderWrapper) {
    this.elements.sliderWrapper.dataset.activeTier = this.currentTier.id;
  }

  // Update all UI components
  this.updateVisualization();
  this.updateCheckpoints();
  this.updateDiscountLabels();

  // Update other components (card, pricing, etc.)
  // ... additional update methods
}
```

### Event Initialization
```javascript
/**
 * Initialize event listeners
 */
init() {
  this.elements.sliderInput.addEventListener('input', (e) => {
    this.handleSliderInput(parseInt(e.target.value, 10));
  });

  // Hide drag indicator on first interaction
  const dragIndicator = document.getElementById('bf25-drag-indicator');
  if (dragIndicator) {
    this.elements.sliderInput.addEventListener('pointerdown', () => {
      dragIndicator.classList.add('is-hidden');
    }, { once: true });
  }

  // Focus management for accessibility
  this.elements.sliderInput.addEventListener('focus', () => {
    if (this.elements.sliderWrapper) {
      this.elements.sliderWrapper.classList.add('is-focused');
    }
  });

  this.elements.sliderInput.addEventListener('blur', () => {
    if (this.elements.sliderWrapper) {
      this.elements.sliderWrapper.classList.remove('is-focused');
    }
  });

  // Set initial state
  this.handleSliderInput(0);
}
```

---

## Tier Configuration

### Tier Data Structure
```json
{
  "tiers": [
    {
      "id": 0,
      "min": 0,
      "max": 3,
      "badge": "Explore Tiers",
      "display_label": "Drag the slider",
      "multiplier": 1.0,
      "color": "#6b7280"
    },
    {
      "id": 1,
      "min": 4,
      "max": 7,
      "badge": "Better Deal",
      "display_label": "60% OFF",
      "multiplier": 0.91,
      "color": "#60c655"
    },
    {
      "id": 2,
      "min": 8,
      "max": 11,
      "badge": "Great Deal",
      "display_label": "70% OFF",
      "multiplier": 0.76,
      "color": "#60c655"
    },
    {
      "id": 3,
      "min": 12,
      "max": 15,
      "badge": "Gold Tier",
      "display_label": "80% OFF",
      "multiplier": 0.65,
      "color": "#FFD700"
    },
    {
      "id": 4,
      "min": 16,
      "max": 999,
      "badge": "Platinum Unlock",
      "display_label": "85% OFF",
      "multiplier": 0.57,
      "color": "#E0F7FF"
    }
  ]
}
```

### Checkpoint/Label Positions
| Value | Tier | Position | Discount |
|-------|------|----------|----------|
| 1     | 0    | 0%       | 50%      |
| 4     | 1    | 25%      | 60%      |
| 8     | 2    | 50%      | 70%      |
| 12    | 3    | 75%      | 80%      |
| 16    | 4    | 100%     | 85%      |

---

## Color System

### Tier Colors
```css
/* Tier 0 - Gray */
--color-tier-0: #6b7280;
--glow-tier-0: rgba(107, 114, 128, 0.3);
--bright-tier-0: #a1a1aa;

/* Tier 1 - Green */
--color-tier-1: #60c655;
--glow-tier-1: rgba(96, 198, 85, 0.5);
--bright-tier-1: #7FFF00;

/* Tier 2 - Bright Green */
--color-tier-2: #60c655;
--glow-tier-2: rgba(127, 255, 0, 0.6);
--bright-tier-2: #39FF14;

/* Tier 3 - Gold */
--color-tier-3: #FFD700;
--glow-tier-3: rgba(255, 215, 0, 0.7);
--bright-tier-3: #FFF700;

/* Tier 4 - Platinum/Ice Blue */
--color-tier-4: #E0F7FF;
--glow-tier-4: rgba(224, 247, 255, 0.8);
--bright-tier-4: #FFFFFF;
```

### Dynamic CSS Variables
These are set by JavaScript based on current tier:
```css
--color-tier-current: [tier color];
--pb-glow-color: [tier glow];
--color-tier-glow: [tier bright color for animation];
```

### Tier-Specific Overrides

#### Tier 3 (Gold)
```css
/* All reached checkpoints become gold */
.bf25-hero__slider-wrapper[data-active-tier="3"]
  .bf25-hero__checkpoint.is-reached
  .bf25-hero__checkpoint-label {
  color: #FFD700 !important;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  font-weight: 700;
}

/* All reached discount labels become gold */
.bf25-hero__slider-wrapper[data-active-tier="3"]
  .bf25-hero__discount-label-item.is-reached
  .bf25-hero__discount-text {
  color: #000 !important;
  background: #FFD700 !important;
  border-color: #FFD700 !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
```

#### Tier 4 (Platinum)
```css
/* All reached checkpoints become platinum */
.bf25-hero__slider-wrapper[data-active-tier="4"]
  .bf25-hero__checkpoint.is-reached
  .bf25-hero__checkpoint-label {
  color: #E0F7FF !important;
  text-shadow: 0 0 15px rgba(224, 247, 255, 0.8);
  font-weight: 700;
}

/* All reached discount labels become platinum */
.bf25-hero__slider-wrapper[data-active-tier="4"]
  .bf25-hero__discount-label-item.is-reached
  .bf25-hero__discount-text {
  color: #000 !important;
  background: #E0F7FF !important;
  border-color: #E0F7FF !important;
  box-shadow: 0 0 20px rgba(224, 247, 255, 0.8);
}
```

---

## Implementation Guide

### For Sticky Cart Component

#### 1. HTML Setup
```html
<!-- Compact version for sticky cart -->
<div class="sticky-cart__progress-wrapper">

  <!-- Progress bar only (no labels/checkpoints needed) -->
  <div class="progress-bar progress-bar--segmented">
    <div class="progress-bar__segments">
      <!-- Generate 16 segments -->
      <div class="progress-bar__segment" data-segment="1"></div>
      <div class="progress-bar__segment" data-segment="2"></div>
      <!-- ... up to 16 -->
    </div>
  </div>

  <!-- Optional: Show current tier badge -->
  <div class="sticky-cart__tier-badge">
    <span class="tier-badge__text">Better Deal</span>
    <span class="tier-badge__discount">60% OFF</span>
  </div>
</div>
```

#### 2. CSS Integration
Copy these essential CSS sections:
- Base Container (`.progress-bar`)
- Segments Container (`.progress-bar__segments`)
- Individual Segment (`.progress-bar__segment`)
- Filled Segment (`.progress-bar__segment.is-filled`)
- Flowing Animation (`@keyframes segmentFlow`)

#### 3. JavaScript Integration
```javascript
class StickyCartProgress {
  constructor() {
    this.cartItemCount = 0;
    this.currentTier = this.calculateTier(0);
    this.segments = document.querySelectorAll('.progress-bar__segment');
  }

  updateFromCart(itemCount) {
    this.cartItemCount = Math.min(itemCount, 16);
    this.currentTier = this.calculateTier(this.cartItemCount);
    this.updateVisualization();
  }

  calculateTier(value) {
    // Use same tier configuration as hero section
    const tiers = [
      { id: 0, min: 0, max: 3, color: '#6b7280', glow: 'rgba(107, 114, 128, 0.3)' },
      { id: 1, min: 4, max: 7, color: '#60c655', glow: 'rgba(96, 198, 85, 0.5)' },
      { id: 2, min: 8, max: 11, color: '#60c655', glow: 'rgba(127, 255, 0, 0.6)' },
      { id: 3, min: 12, max: 15, color: '#FFD700', glow: 'rgba(255, 215, 0, 0.7)' },
      { id: 4, min: 16, max: 999, color: '#E0F7FF', glow: 'rgba(224, 247, 255, 0.8)' }
    ];
    return tiers.find(t => value >= t.min && value <= t.max) || tiers[0];
  }

  updateVisualization() {
    // Set tier colors
    document.documentElement.style.setProperty('--color-tier-current', this.currentTier.color);
    document.documentElement.style.setProperty('--pb-glow-color', this.currentTier.glow);

    // Fill segments
    this.segments.forEach((segment, index) => {
      if (index < this.cartItemCount) {
        segment.classList.add('is-filled');
      } else {
        segment.classList.remove('is-filled');
      }
    });
  }
}

// Initialize on cart update
theme.cart.on('update', (cart) => {
  const progressBar = new StickyCartProgress();
  progressBar.updateFromCart(cart.item_count);
});
```

### Minimal Implementation (No JavaScript)
For purely visual progress bar without interaction:

```html
<!-- Static progress bar -->
<div class="progress-bar progress-bar--segmented">
  <div class="progress-bar__segments">
    <!-- First 8 segments filled for 50% -->
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <div class="progress-bar__segment is-filled"></div>
    <!-- Remaining 8 empty -->
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
    <div class="progress-bar__segment"></div>
  </div>
</div>
```

Set tier colors in inline styles:
```html
<div class="progress-bar" style="
  --color-tier-current: #60c655;
  --pb-glow-color: rgba(96, 198, 85, 0.5);
  --color-tier-glow: #7FFF00;
">
  <!-- segments -->
</div>
```

---

## Advanced Features

### Celebration Animations
```javascript
/**
 * Trigger celebration when tier changes
 */
triggerCelebration() {
  const checkpoint = Array.from(this.elements.checkpoints).find(
    cp => parseInt(cp.dataset.tier, 10) === this.currentTier.id
  );
  if (checkpoint) this.triggerAnimation(checkpoint, 'animate-celebration');
}

triggerAnimation(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth; // Force reflow
  element.classList.add(className);
  element.addEventListener('animationend', () => {
    element.classList.remove(className);
  }, { once: true });
}
```

Celebration CSS:
```css
@keyframes celebratePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.bf25-hero__checkpoint.animate-celebration {
  animation: celebratePulse 600ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

### Haptic Feedback (Mobile)
```javascript
triggerHaptics() {
  if (navigator.vibrate) {
    let pattern;
    switch (this.currentTier.id) {
      case 1: pattern = [50]; break;           // Light tick
      case 2: pattern = [50, 30, 50]; break;   // Double tick
      case 3: pattern = [100]; break;          // Strong buzz
      case 4: pattern = [100, 50, 150]; break; // Celebration
      default: return;
    }
    navigator.vibrate(pattern);
  }
}
```

### Accessibility
```javascript
updateARIA() {
  if (!this.elements.sliderInput) return;

  const announcement = `${this.currentValue} items selected.
    Tier ${this.currentTier.id}: ${this.currentTier.badge},
    ${this.currentTier.display_label}`;

  this.elements.sliderInput.setAttribute('aria-valuenow', this.currentValue);
  this.elements.sliderInput.setAttribute('aria-valuetext', announcement);
}
```

Reduced motion support:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimizations

### CSS Containment
```css
.progress-bar {
  contain: layout paint style;
}

.progress-bar__segment {
  contain: layout paint;
}
```

### Will-Change
```css
.progress-bar__segment.is-filled {
  will-change: background-color, box-shadow;
}
```

### Early Exit Optimization
```javascript
handleSliderInput(value) {
  // Exit early if value hasn't changed
  if (this.currentValue === value) return;

  // Continue with updates...
}
```

### Debounced Updates (Optional)
```javascript
handleSliderInput(value) {
  clearTimeout(this.updateTimeout);
  this.updateTimeout = setTimeout(() => {
    this.performUpdates(value);
  }, 16); // ~60fps
}
```

---

## Browser Compatibility

### Required Features
- CSS Custom Properties (IE11+)
- Flexbox (IE11+)
- CSS Animations (IE10+)
- `classList` API (IE10+)

### Fallbacks
For older browsers without custom properties:
```css
.progress-bar__segment.is-filled {
  /* Fallback */
  background: #60c655;

  /* Enhanced */
  background: linear-gradient(
    90deg,
    var(--color-tier-current, #60c655) 0%,
    var(--color-tier-glow, #7FFF00) 50%,
    var(--color-tier-current, #60c655) 100%
  );
}
```

---

## Testing Checklist

- [ ] Segments fill discretely (1, 2, 3... not continuously)
- [ ] Tier colors update correctly across all tiers
- [ ] Flowing animation works in filled segments
- [ ] Checkpoints highlight at correct values
- [ ] Discount labels update with tier colors
- [ ] Drag indicator hides after first interaction
- [ ] ARIA labels announce tier changes
- [ ] Keyboard navigation works (arrow keys)
- [ ] Touch/mouse drag works smoothly
- [ ] Reduced motion respects user preference
- [ ] Works in all target browsers
- [ ] Mobile responsive (narrow screens)

---

## File References

### Source Files
- **HTML Structure**: `sections/section-bf25-hero.liquid` (lines 138-168)
- **CSS Styles**: `assets/bf25-hero.css` (lines 304-403, 548-772)
- **JavaScript Logic**: `assets/bf25-hero.js` (lines 176-229, 295-325)
- **Tier Config**: `sections/section-bf25-hero.liquid` (lines 266-317)

### Key Sections
- Progress Bar Structure: bf25-hero.liquid:138-144
- Segment Filling Logic: bf25-hero.js:219-228
- Flowing Animation: bf25-hero.css:376-394
- Tier Calculation: bf25-hero.js:170-174
- Color System: bf25-hero.js:182-212

---

## Changelog

### Version 2.0 (Current)
- **BREAKING**: Replaced CSS mask with DOM-based segments
- Added discrete cell filling (16 individual elements)
- Implemented flowing gradient animation
- Added comprehensive tier theming (gold/platinum)
- Enhanced accessibility with ARIA labels
- Added drag indicator UX
- Optimized performance with CSS containment

### Version 1.0
- CSS mask-based approach (deprecated)
- Continuous percentage filling
- Basic tier colors

---

## Support

For questions or issues implementing this design system:
1. Review the HTML/CSS/JS source files listed above
2. Check the Testing Checklist for common issues
3. Verify tier configuration matches expected structure
4. Test in isolated environment before production deployment

---

**End of Documentation**
