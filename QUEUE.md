PROMPT 1: HTML STRUCTURE UPDATES ✅
[Implement: BF25-HERO-ULTIMATE-DESIGN-HTML]

CONTEXT: Implementing Gemini's Ultimate Progress Bar Design System - Phase 1: HTML structure updates.

CRITICAL: This adds new elements (discount labels, progress-bar classes) and updates checkpoint structure.

TASK: Update sections/section-bf25-hero.liquid with new HTML structure.

═══════════════════════════════════════════════════════════════
CHANGE 1: UPDATE SLIDER WRAPPER STRUCTURE
═══════════════════════════════════════════════════════════════

Find the slider wrapper section (around line 100-130):

CURRENT STRUCTURE:
```html
<div class="bf25-hero__slider-wrapper">
  <div class="bf25-hero__visualization">
    <div class="bf25-hero__track"></div>
    <div class="bf25-hero__fill"></div>
  </div>
  
  <input type="range"...>
  
  <div class="bf25-hero__checkpoints">...</div>
</div>
```

REPLACE WITH (adds discount labels + progress-bar classes):
```html
<div class="bf25-hero__slider-wrapper">
  
  <!-- NEW: Discount Labels Above Bar -->
  <div class="bf25-hero__discount-labels">
    <div class="bf25-hero__discount-label-item" data-tier="1" data-value="4">
      <span class="bf25-hero__discount-text">60% OFF</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="2" data-value="8">
      <span class="bf25-hero__discount-text">70% OFF</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="3" data-value="12">
      <span class="bf25-hero__discount-text">80% OFF</span>
    </div>
    <div class="bf25-hero__discount-label-item" data-tier="4" data-value="16">
      <span class="bf25-hero__discount-text">85% OFF</span>
    </div>
  </div>

  <!-- UPDATED: Progress Bar (New Classes) -->
  <div class="progress-bar progress-bar--segmented" id="bf25-visualization">
    <div class="progress-bar__track"></div>
    <div class="progress-bar__fill"></div>
  </div>

  <input type="range" min="0" max="16" step="1" value="0" class="bf25-hero__input" id="bf25-hero-slider"
         aria-label="Select number of items to see tier discounts and unlock gifts"
         aria-valuemin="0" aria-valuemax="16" aria-valuenow="0" aria-valuetext="0 items selected"/>

  <div class="bf25-hero__checkpoints">
    <!-- NEW: 1 Item Checkpoint -->
    <div class="bf25-hero__checkpoint" data-value="1">
      <span class="bf25-hero__checkpoint-label">1 <span class="checkpoint-subtext">item</span></span>
    </div>
    <!-- Existing checkpoints remain -->
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

═══════════════════════════════════════════════════════════════
CHANGE 2: UPDATE TIER 3 COLOR IN JSON
═══════════════════════════════════════════════════════════════

Find the tiers array in the JSON (around line 180):

UPDATE Tier 3:
```json
{
  "id": 3,
  "min": 12,
  "max": 15,
  "badge": "Best Deal",
  "display_label": "80% OFF",
  "multiplier": 0.65,
  "color": "#FFD700",  /* CHANGED: Gold color for Tier 3 */
  "discount_benefit_text": "80% OFF all items"
}
```

═══════════════════════════════════════════════════════════════
VERIFICATION:
═══════════════════════════════════════════════════════════════

After applying:
1. Check discount labels div exists above visualization
2. Verify progress-bar classes applied (progress-bar, progress-bar--segmented)
3. Confirm 1 item checkpoint added
4. Confirm Tier 3 has gold color #FFD700

Report completion with structure confirmed.

PROMPT 2: CSS DESIGN SYSTEM 🎨
[Implement: BF25-HERO-ULTIMATE-DESIGN-CSS]

CONTEXT: Implementing Gemini's Ultimate Progress Bar Design System - Phase 2: Complete CSS redesign with masking, animations, and premium styling.

CRITICAL: This replaces the visualization CSS with a modular design system using CSS masking for the "Energy Flow" effect.

TASK: Update assets/bf25-hero.css with the complete design system.

═══════════════════════════════════════════════════════════════
PART 1: ADD DESIGN SYSTEM VARIABLES (After :root variables)
═══════════════════════════════════════════════════════════════

Find the :root section (around line 10-25), ADD after existing variables:
```css
/* Ultimate Progress Bar Design System Variables */
.progress-bar {
  /* Base Config (Reusable) */
  --pb-height: 24px;
  --pb-radius: 12px;
  --pb-segment-count: 1;
  --pb-segment-gap: 3px;

  /* Dynamic Variables (Set by JS) */
  /* --pb-fill-width */
  /* --pb-fill-gradient */
  /* --pb-glow-color */
}
```

═══════════════════════════════════════════════════════════════
PART 2: REPLACE VISUALIZATION SECTION
═══════════════════════════════════════════════════════════════

Find the OLD visualization section (around line 280-350):
DELETE everything from `.bf25-hero__visualization` through the old `.bf25-hero__fill` styles.

REPLACE WITH this complete design system:
```css
/* ==================================================================
   ULTIMATE PREMIUM PROGRESS BAR DESIGN SYSTEM
   ================================================================== */

/* Base Component Structure */
.progress-bar {
  position: relative;
  width: 100%;
  height: var(--pb-height);
  border-radius: var(--pb-radius);
  overflow: hidden;
  
  /* Premium Casing: Depth and Texture */
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6),
              0 1px 0 rgba(255, 255, 255, 0.05);
  
  pointer-events: none;
}

.progress-bar__track,
.progress-bar__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: block !important; /* Force visibility */
}

.progress-bar__track {
  width: 100%;
  z-index: 1;
}

.progress-bar__fill {
  width: var(--pb-fill-width);
  z-index: 2;
  transition: width var(--duration-medium) var(--easing-premium),
              box-shadow var(--duration-medium) var(--easing-premium);
  will-change: width, box-shadow;

  /* Dynamic gradient set by JS */
  background-image: var(--pb-fill-gradient);
  
  /* Dynamic glow set by JS */
  box-shadow: 0 0 20px var(--pb-glow-color), 0 0 5px var(--pb-glow-color);
}

/* Segmented Variant (16 segments with masking) */
.progress-bar--segmented {
  --pb-segment-count: 16;
  --pb-total-gap-width: calc((var(--pb-segment-count) - 1) * var(--pb-segment-gap));
  --pb-segment-width: calc((100% - var(--pb-total-gap-width)) / var(--pb-segment-count));
  --pb-gradient-step-size: calc(var(--pb-segment-width) + var(--pb-segment-gap));

  /* Mask shape for segments */
  --pb-segment-mask: repeating-linear-gradient(
    to right,
    #000 0,
    #000 var(--pb-segment-width),
    transparent var(--pb-segment-width),
    transparent var(--pb-gradient-step-size)
  );
}

.progress-bar--segmented .progress-bar__track {
  /* Empty segment cells with depth */
  background: repeating-linear-gradient(
    to right,
    rgba(255, 255, 255, 0.15) 0,
    rgba(255, 255, 255, 0.10) var(--pb-segment-width),
    transparent var(--pb-segment-width),
    transparent var(--pb-gradient-step-size)
  );
}

.progress-bar--segmented .progress-bar__fill {
  /* Apply mask for segments */
  -webkit-mask-image: var(--pb-segment-mask);
  mask-image: var(--pb-segment-mask);
  
  /* Energy Flow Animation */
  background-size: 200% 100%;
  animation: energyFlow 3000ms linear infinite;
}

/* Energy Flow Animation */
@keyframes energyFlow {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

═══════════════════════════════════════════════════════════════
PART 3: ADD DISCOUNT LABELS STYLING
═══════════════════════════════════════════════════════════════

After the slider wrapper styles (around line 380), ADD:
```css
/* Discount Labels (Above Slider) */
.bf25-hero__discount-labels {
  position: relative;
  width: 100%;
  height: 25px;
  margin-bottom: var(--space-2);
  pointer-events: none;
}

.bf25-hero__discount-label-item {
  position: absolute;
  transform: translateX(-50%);
}

/* Positioning */
.bf25-hero__discount-label-item[data-value="4"] { left: 25%; }
.bf25-hero__discount-label-item[data-value="8"] { left: 50%; }
.bf25-hero__discount-label-item[data-value="12"] { left: 75%; }
.bf25-hero__discount-label-item[data-value="16"] { 
  left: 100%; 
  transform: translateX(-100%); 
}

.bf25-hero__discount-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-subtle);
  transition: all var(--duration-medium) var(--easing-premium);
  background: var(--color-bg-dark);
  padding: 3px 6px;
  border-radius: 6px;
  border: 1px solid var(--glass-border-color);
  white-space: nowrap;
}

@media (min-width: 500px) {
  .bf25-hero__discount-text {
    font-size: 13px;
  }
}

/* Active/Reached State */
.bf25-hero__discount-label-item.is-reached .bf25-hero__discount-text {
  color: var(--color-bg-dark);
  background: var(--color-tier-current);
  border-color: var(--color-tier-current);
  box-shadow: 0 0 8px var(--pb-glow-color);
}
```

═══════════════════════════════════════════════════════════════
PART 4: UPDATE CHECKPOINT POSITIONING (Add 1 item)
═══════════════════════════════════════════════════════════════

Find .bf25-hero__checkpoint positioning (around line 400):

ADD positioning for 1 item:
```css
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
```

═══════════════════════════════════════════════════════════════
PART 5: UPDATE CELEBRATION ANIMATIONS
═══════════════════════════════════════════════════════════════

Find @keyframes celebratePulse section, ADD alignment variants:
```css
@keyframes celebratePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Centered elements */
@keyframes celebratePulseCentered {
  0% { transform: scale(1) translateX(-50%); }
  50% { transform: scale(1.2) translateX(-50%); }
  100% { transform: scale(1) translateX(-50%); }
}

/* End-aligned elements */
@keyframes celebratePulseEnd {
  0% { transform: scale(1) translateX(-100%); }
  50% { transform: scale(1.2) translateX(-100%); }
  100% { transform: scale(1) translateX(-100%); }
}

/* Apply animations */
.bf25-hero__checkpoint.animate-celebration,
.bf25-hero__discount-label-item.animate-celebration {
  animation: celebratePulseCentered var(--duration-slow) var(--easing-premium);
}

.bf25-hero__checkpoint[data-value="1"].animate-celebration {
  animation-name: celebratePulse;
}

.bf25-hero__checkpoint[data-value="16"].animate-celebration,
.bf25-hero__discount-label-item[data-value="16"].animate-celebration {
  animation-name: celebratePulseEnd;
}
```

═══════════════════════════════════════════════════════════════
VERIFICATION:
═══════════════════════════════════════════════════════════════

After applying, hard refresh and check:
1. Progress bar has new casing with depth/shadow
2. Segments visible (gray empty cells)
3. Discount labels appear above bar
4. 1 item checkpoint positioned at start
5. 16 item checkpoint/label aligned to end

DO NOT test fill animation yet - JavaScript update needed next.

Report CSS structure is in place.

PROMPT 3: JAVASCRIPT DYNAMIC GRADIENTS ⚡
[Implement: BF25-HERO-ULTIMATE-DESIGN-JS]

CONTEXT: Implementing Gemini's Ultimate Progress Bar Design System - Phase 3: JavaScript for dynamic "Energy Flow" gradients and discount label management.

CRITICAL: This adds tier-specific animated gradients and manages the new discount labels.

TASK: Update assets/bf25-hero.js with gradient system and discount label logic.

═══════════════════════════════════════════════════════════════
CHANGE 1: ADD GRADIENT DEFINITIONS (After constructor setup)
═══════════════════════════════════════════════════════════════

In the constructor, AFTER these lines:
```javascript
this.currentTier = this.tiers[0];
this.previousTier = this.tiers[0];
```

ADD:
```javascript
// Define Energy Flow gradients for each tier
this.gradientMap = this.defineGradients();
```

Then ADD this new method AFTER the constructor:
```javascript
// Define the "Energy Flow" gradients for each tier
defineGradients() {
  // Green (Tiers 1, 2, 4) - User provided gradient
  const green = 'linear-gradient(90deg, #4CAF50 0%, #60c655 20%, #7FFF00 40%, #39FF14 50%, #7FFF00 60%, #60c655 80%, #4CAF50 100%)';
  
  // Gold (Tier 3) - Sophisticated gold energy flow
  const gold = 'linear-gradient(90deg, #DAA520 0%, #FFD700 20%, #FFEE58 40%, #FFFFE0 50%, #FFEE58 60%, #FFD700 80%, #DAA520 100%)';
  
  // Gray (Tier 0)
  const gray = 'linear-gradient(90deg, #6b7280 0%, #a1a1aa 50%, #6b7280 100%)';

  // Map Tiers to Styles
  return {
    0: { gradient: gray, glow: 'rgba(107, 114, 128, 0.3)', color: '#6b7280' },
    1: { gradient: green, glow: 'rgba(96, 198, 85, 0.5)', color: '#60c655' },
    2: { gradient: green, glow: 'rgba(127, 255, 0, 0.6)', color: '#60c655' },
    3: { gradient: gold, glow: 'rgba(255, 215, 0, 0.7)', color: '#FFD700' },
    4: { gradient: green, glow: 'rgba(96, 198, 85, 0.8)', color: '#60c655' }
  };
}
```

═══════════════════════════════════════════════════════════════
CHANGE 2: UPDATE cacheDOM (Add discount labels)
═══════════════════════════════════════════════════════════════

Find cacheDOM() method, ADD this line:
```javascript
cacheDOM() {
  return {
    sliderInput: this.container.querySelector('.bf25-hero__input'),
    sliderWrapper: this.container.querySelector('.bf25-hero__slider-wrapper'),
    giftBoxes: this.container.querySelectorAll('.bf25-hero__gift-box'),
    checkpoints: this.container.querySelectorAll('.bf25-hero__checkpoint'),
    discountLabels: this.container.querySelectorAll('.bf25-hero__discount-label-item'), // ADD THIS
    // ... rest of elements
  };
}
```

═══════════════════════════════════════════════════════════════
CHANGE 3: REPLACE updateVisualization() METHOD
═══════════════════════════════════════════════════════════════

Find updateVisualization() method (around line 130):

REPLACE WITH (applies gradient + glow dynamically):
```javascript
updateVisualization() {
  const percentage = (this.currentValue / this.config.max_items) * 100;
  const section = document.getElementById('bf25-hero-section') || this.container;
  
  // Update width
  section.style.setProperty('--pb-fill-width', `${percentage}%`);
  
  // Get tier-specific styling
  const currentStyle = this.gradientMap[this.currentTier.id] || this.gradientMap[0];
  
  // Apply gradient, glow, and color with RAF for smooth updates
  requestAnimationFrame(() => {
    section.style.setProperty('--pb-fill-gradient', currentStyle.gradient);
    section.style.setProperty('--pb-glow-color', currentStyle.glow);
    section.style.setProperty('--color-tier-current', currentStyle.color);
  });
}
```

═══════════════════════════════════════════════════════════════
CHANGE 4: ADD updateDiscountLabels() METHOD
═══════════════════════════════════════════════════════════════

After updateCheckpoints() method (around line 160), ADD:
```javascript
// Update Discount Labels (Above bar)
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

═══════════════════════════════════════════════════════════════
CHANGE 5: CALL updateDiscountLabels() IN handleSliderInput
═══════════════════════════════════════════════════════════════

Find handleSliderInput() method, ADD call to updateDiscountLabels:
```javascript
handleSliderInput(value) {
  // ... existing code ...
  
  this.updateVisualization();
  this.updateGiftBoxes();
  this.updateGiftsHeader();
  this.updateCheckpoints();
  this.updateDiscountLabels(); // ADD THIS LINE
  this.updateTierCard();
  
  // ... rest of method
}
```

═══════════════════════════════════════════════════════════════
CHANGE 6: UPDATE triggerCelebration() (Celebrate discount labels too)
═══════════════════════════════════════════════════════════════

Find triggerCelebration() method (around line 350):

REPLACE WITH:
```javascript
triggerCelebration() {
  // Celebrate the checkpoint (below bar)
  const checkpoint = Array.from(this.elements.checkpoints).find(
    cp => parseInt(cp.dataset.tier, 10) === this.currentTier.id
  );
  if (checkpoint) this.triggerAnimation(checkpoint, 'animate-celebration');

  // Celebrate the discount label (above bar)
  const discountLabel = Array.from(this.elements.discountLabels).find(
    dl => parseInt(dl.dataset.tier, 10) === this.currentTier.id
  );
  if (discountLabel) this.triggerAnimation(discountLabel, 'animate-celebration');
}
```

═══════════════════════════════════════════════════════════════
CHANGE 7: SIMPLIFY updateTierCard() (Color handled in updateVisualization)
═══════════════════════════════════════════════════════════════

Find updateTierCard() method, SIMPLIFY to:
```javascript
updateTierCard() {
  this.elements.card.dataset.activeTier = this.currentTier.id;
  // Note: Colors now handled globally in updateVisualization()

  if (this.elements.tierBadgeText) {
    this.elements.tierBadgeText.textContent = this.currentTier.badge;
  }
  if (this.elements.discountLabel) {
    this.elements.discountLabel.textContent = this.currentTier.display_label;
  }
}
```

═══════════════════════════════════════════════════════════════
VERIFICATION:
═══════════════════════════════════════════════════════════════

After applying, hard refresh and test:

AT 0 ITEMS:
- Bar empty with gray gradient
- All discount labels gray
- All checkpoints gray

AT 4 ITEMS (Tier 1):
- Green flowing gradient appears (animated)
- "60% OFF" label turns green background
- 1 item + 4 items checkpoints turn green
- Celebration animation on both discount label and checkpoint

AT 8 ITEMS (Tier 2):
- Brighter green glow
- "70% OFF" label active
- Checkpoints up to 8 active

AT 12 ITEMS (Tier 3):
- GOLD flowing gradient! ✨
- "80% OFF" label with gold background
- Tier card border turns gold

AT 16 ITEMS (Tier 4):
- Green gradient with intense glow
- "85% OFF" label active
- All elements lit up

Report:
1. Energy Flow animation visible? YES/NO
2. Gradients changing per tier? YES/NO
3. Discount labels lighting up? YES/NO
4. Gold gradient at Tier 3? YES/NO
5. Any console errors? YES/NO