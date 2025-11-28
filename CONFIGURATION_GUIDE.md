# Power Pairs BF25 - Configuration Guide

## Section Settings (Shopify Theme Customizer)

### Bundle Configuration

**Location:** Theme Customizer → Section Settings → Power Pairs BF25

#### Bundle 1: Quick Start Kit
- **Enable:** Checkbox (default: true)
- **Bundle ID:** "quick-start" (unique identifier)
- **Title:** "Quick Start Kit"
- **Description:** "Everything you need to get started"
- **Image:** Upload 600×400px image (WebP recommended)
- **Products:** (Add up to 10)
  - Product 1 Handle: "usb-c-cable"
  - Product 1 Quantity: 1
  - Product 2 Handle: "power-bank"
  - Product 2 Quantity: 1
  - (etc.)
- **Multipliers:** "1,2,3,4" (comma-separated)
- **Starting Price:** Auto-calculated from products

#### Bundle 2: Pro Bundle
- (Same structure as Bundle 1)

#### Bundle 3: Ultimate Kit
- (Same structure as Bundle 1)

#### Bundle 4: Enterprise Pack
- (Same structure as Bundle 1)

### Trust Badge Settings

**Location:** Trust & Social Proof section

#### Badge 1
- **Enable:** Checkbox
- **Icon:** "🔒" (emoji or HTML entity)
- **Text:** "Secure Checkout"

#### Badge 2
- **Enable:** Checkbox
- **Icon:** "✓"
- **Text:** "30-Day Returns"

#### Badge 3
- **Enable:** Checkbox
- **Icon:** "🚚"
- **Text:** "Free Shipping €75+"

#### Badge 4
- **Enable:** Checkbox
- **Icon:** "⭐"
- **Text:** "4.8★ (270 Reviews)"

### Social Proof Settings

- **Show social proof in CTA:** Checkbox
- **Customers served:** "10,000+"
- **Satisfaction rate:** "98%"

### Performance Settings

- **Enable performance optimizations:** Checkbox (default: true)
- **Defer bottom sheet initialization:** Checkbox (default: true)

---

## Product Setup Requirements

### Product Metafields

**Namespace:** reviews

**Fields:**
- **rating** (decimal): Average rating (0-5)
  - Example: 4.5
- **count** (integer): Number of reviews
  - Example: 89

**How to set:**
1. Products → Select product → Metafields
2. Add custom definition:
   - Namespace: reviews
   - Key: rating
   - Type: Decimal
3. Add custom definition:
   - Namespace: reviews
   - Key: count
   - Type: Integer

### Product Tags

**Best Seller Tag:**
- Add tag: "best-seller" or "bestseller"
- Case-insensitive
- Shows "BEST SELLER" badge on product card

### Product Variants

**Requirements:**
- All variants must have unique titles
- Variants should have distinct images (recommended)
- Variant prices can differ
- Inventory tracking enabled (recommended)

**Example Product Structure:**
```
Product: USB-C Cable
- Variant 1: 3ft (€19.95)
- Variant 2: 6ft (€22.95)
- Variant 3: 10ft (€29.95)
```

---

## Discount Code Setup

### Shopify Admin Configuration

**Location:** Discounts → Create discount

#### Tier 1 Code

- **Code:** BF25-TIER1-4ITEMS
- **Type:** Percentage
- **Value:** 9%
- **Applies to:** Entire order
- **Minimum purchase:** None
- **Customer eligibility:** Everyone
- **Usage limits:** None (or set as needed)
- **Active dates:** Black Friday period
- **Combinations:** Can combine with other discounts (optional)

#### Tier 2 Code

- **Code:** BF25-TIER2-8ITEMS
- **Value:** 24%
- (Same other settings)

#### Tier 3 Code

- **Code:** BF25-TIER3-12ITEMS
- **Value:** 35%
- (Same other settings)

#### Tier 4 Code

- **Code:** BF25-TIER4-16ITEMS
- **Value:** 43%
- (Same other settings)

**Important:** These percentages stack on top of existing product sale prices (55% base discount already in product prices).

---

## Customization Options

### Color Scheme (CSS Variables)

**Location:** [assets/section-power-pairs-bf25.css](assets/section-power-pairs-bf25.css)

```css
:root {
  /* Primary Colors */
  --pp-accent-primary: #60c655; /* Lime green */
  --pp-accent-gold: #FFD700; /* Gold for premium */

  /* Background Colors */
  --pp-bg-primary: #0A0A0A; /* Dark background */
  --pp-bg-secondary: rgba(26, 26, 26, 0.8); /* Cards */

  /* Text Colors */
  --pp-text-primary: #FFFFFF;
  --pp-text-secondary: rgba(255, 255, 255, 0.85);
  --pp-text-tertiary: rgba(255, 255, 255, 0.7);

  /* Border Colors */
  --pp-border-primary: rgba(255, 255, 255, 0.2);
  --pp-border-secondary: rgba(255, 255, 255, 0.15);

  /* Border Radius */
  --pp-radius-sm: 6px;
  --pp-radius-md: 12px;
  --pp-radius-lg: 16px;
  --pp-radius-xl: 24px;

  /* Spacing */
  --pp-space-xs: 4px;
  --pp-space-sm: 8px;
  --pp-space-md: 16px;
  --pp-space-lg: 24px;
  --pp-space-xl: 32px;
  --pp-space-2xl: 48px;
}
```

### Typography

```css
/* Font Sizes */
--pp-font-xs: 12px;
--pp-font-sm: 14px;
--pp-font-base: 16px;
--pp-font-lg: 18px;
--pp-font-xl: 24px;
--pp-font-2xl: 32px;

/* Font Weights */
--pp-font-weight-normal: 400;
--pp-font-weight-medium: 500;
--pp-font-weight-semibold: 600;
--pp-font-weight-bold: 700;
```

### Animation Timing

```css
/* Transition Speeds */
--pp-transition-fast: 150ms ease-in-out;
--pp-transition-base: 300ms ease-in-out;
--pp-transition-slow: 500ms ease-in-out;
```

---

## Advanced Configuration

### Changing Tier Thresholds

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js)

```javascript
// Current tier thresholds (items)
calculateTierFromItems(itemCount) {
  if (itemCount >= 16) return 4; // Tier 4
  if (itemCount >= 12) return 3; // Tier 3
  if (itemCount >= 8) return 2;  // Tier 2
  if (itemCount >= 4) return 1;  // Tier 1
  return 0; // Below minimum
}
```

To modify: Change the numbers (16, 12, 8, 4) to your desired thresholds.

### Changing Discount Percentages

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js)

```javascript
// Current tier discount multipliers
const TIER_MULTIPLIERS = {
  1: 0.91,  // 9% discount
  2: 0.76,  // 24% discount
  3: 0.65,  // 35% discount
  4: 0.57   // 43% discount
};
```

**Important:** If you change these, you MUST update the Shopify discount codes to match!

### Changing Free Gifts

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js)

```javascript
const TIER_GIFTS = {
  1: [
    { name: '4-in-1 Cable', value: 30 }
  ],
  2: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 }
  ],
  3: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 },
    { name: 'Magnetic Cable Set', value: 60 }
  ],
  4: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 },
    { name: 'Magnetic Cable Set', value: 60 },
    { name: 'MYSTERY BOX', value: 150 }
  ]
};
```

**Note:** These are display-only. Actual free gifts must be added to cart separately or via Shopify Scripts.

---

## Troubleshooting Common Configuration Issues

### Issue: Bundle not showing products

**Solution:**
- Verify product handles are correct
- Check products are published
- Ensure products are in stock
- Verify collection assignments (if filtering)

### Issue: Discount codes not applying

**Solution:**
- Check codes exist in Shopify Admin
- Verify spelling matches exactly
- Check date range is active
- Ensure no conflicting discount rules

### Issue: Images not loading

**Solution:**
- Verify image URLs are correct
- Check file format (WebP, JPG, PNG)
- Ensure images uploaded to Shopify
- Check CDN connectivity

### Issue: Trust badges not showing

**Solution:**
- Verify "Show trust badges" enabled
- Check at least one badge is enabled
- Verify emoji/HTML entities render
- Check CSS loaded correctly

---

## Best Practices

### Performance
- Keep bundle product count ≤ 6 per bundle
- Use WebP images (<200KB each)
- Limit multiplier options to 4 max
- Test on 3G connection

### User Experience
- Clear product titles (<40 characters)
- Concise descriptions (<100 characters)
- High-quality images (consistent style)
- Obvious variant differences

### Conversion Optimization
- Highlight best-value tier (Tier 3 or 4)
- Use ethical urgency (not fake timers)
- Show social proof prominently
- Make tier benefits clear

### Accessibility
- Maintain high color contrast
- Use descriptive alt text
- Test with keyboard only
- Verify screen reader compatibility

---

## Configuration Examples

### Example 1: Tech Bundle Configuration

```json
{
  "bundle_id": "tech-essentials",
  "title": "Tech Essentials",
  "description": "Complete tech setup for remote work",
  "products": [
    { "handle": "wireless-charger", "quantity": 1 },
    { "handle": "usb-hub", "quantity": 1 },
    { "handle": "cable-organizer", "quantity": 2 }
  ],
  "multipliers": [1, 2, 3, 4],
  "image": "tech-essentials.webp"
}
```

### Example 2: Travel Bundle Configuration

```json
{
  "bundle_id": "travel-kit",
  "title": "Travel Power Kit",
  "description": "Never run out of power on the go",
  "products": [
    { "handle": "power-bank-20000", "quantity": 1 },
    { "handle": "travel-adapter", "quantity": 1 },
    { "handle": "charging-cables-3pack", "quantity": 1 }
  ],
  "multipliers": [1, 2, 4],
  "image": "travel-kit.webp"
}
```

### Example 3: Gift Bundle Configuration

```json
{
  "bundle_id": "perfect-gift",
  "title": "The Perfect Gift",
  "description": "Thoughtfully curated tech gifts",
  "products": [
    { "handle": "bluetooth-speaker", "quantity": 1 },
    { "handle": "wireless-earbuds", "quantity": 1 },
    { "handle": "phone-stand", "quantity": 1 },
    { "handle": "screen-cleaner-kit", "quantity": 1 }
  ],
  "multipliers": [1, 2, 3],
  "image": "gift-bundle.webp"
}
```

---

## Testing Your Configuration

### Checklist

1. **Bundle Display**
   - [ ] All bundles show correct images
   - [ ] Titles and descriptions display
   - [ ] Prices calculate correctly
   - [ ] Trust badges appear

2. **Product Selection**
   - [ ] All products load correctly
   - [ ] Variants show when clicked
   - [ ] Variant images display
   - [ ] Selection updates state

3. **Multiplier System**
   - [ ] All multipliers clickable
   - [ ] Tier badges update correctly
   - [ ] Free gifts display for each tier
   - [ ] Pricing updates accurately

4. **Add to Cart**
   - [ ] Correct items added
   - [ ] Quantities accurate
   - [ ] Discount code applied
   - [ ] Checkout works

---

## Configuration Checklist

Before launching, verify:
- [ ] All bundle products configured
- [ ] All product handles correct
- [ ] All images uploaded and optimized
- [ ] Trust badges customized
- [ ] Social proof values updated
- [ ] Discount codes created
- [ ] Tier thresholds appropriate
- [ ] Free gifts configured
- [ ] Color scheme matches brand
- [ ] Performance settings enabled

---

## Reference: Schema Settings

### Complete Schema Structure

The section schema in [sections/section-power-pairs-bf25.liquid](sections/section-power-pairs-bf25.liquid) includes:

**Section-Level Settings:**
- Section title
- Section description
- Performance optimizations toggle

**Bundle Blocks (repeatable):**
- Bundle ID
- Enable/disable toggle
- Title
- Description
- Image upload
- Product list (handles + quantities)
- Multiplier options

**Trust Badge Blocks (repeatable):**
- Enable/disable toggle
- Icon (text/emoji)
- Badge text

**Social Proof Settings:**
- Show/hide toggle
- Customers served count
- Satisfaction rate percentage

---

**Configuration Complete:** _______________
**Configured By:** _______________
**Date:** _______________
