# BF25 Bundle Builder - User Guide

## What Is It?

The BF25 Bundle Builder is a premium modal system designed to help your customers easily purchase multiple items while automatically receiving tier-based discounts. It transforms single-item purchases into multi-item orders, significantly increasing your average order value.

## Key Features

✅ **Beautiful Product Expansion Modal** - Premium Apple/Tesla-quality design
✅ **Automatic Tier Discounts** - Up to 20% off for larger orders
✅ **Cart-Aware Pricing** - Shows combined discounts from cart + modal
✅ **Dual Mode System** - Power Packs (preset tiers) or Individual (custom quantity)
✅ **Mobile-Optimized** - Perfect experience for 70% of traffic
✅ **Trust Signals** - Reviews, ratings, and quality badges
✅ **Urgency Elements** - Countdown timer and stock indicators
✅ **Keyboard Accessible** - Full keyboard navigation support
✅ **Lightning Fast** - <300ms modal open, green Core Web Vitals

## How It Works

### For Your Customers

1. **Browse Products** - Customer sees product cards on collection page
2. **Click to Expand** - Clicking any card opens the premium modal
3. **View Details** - See product images, features, reviews, and pricing
4. **Select Options** - Choose product variants (color, size, capacity, etc.)
5. **Choose Quantity** - Select from preset tiers or use quantity stepper
6. **See Discount** - Discount automatically applied based on quantity
7. **Add to Cart** - One-click add to cart with success notification
8. **Keep Shopping** - Modal stays open, can add more products

### The Tier System

Your customers see these automatic discounts:

| Quantity | Tier | Discount | Label |
|----------|------|----------|-------|
| 1-3 items | Tier 1 | 0% off | Standard |
| 4-6 items | Tier 2 | 10% off | Better Deal |
| 7-9 items | Tier 3 | 15% off | Great Deal ⭐ |
| 10+ items | Tier 4 | 20% off | Best Deal 🎉 |

**Most Popular:** Tier 3 (7-9 items at 15% off) - The sweet spot for customer value and your profit margin.

### Cart-Aware Intelligence

The modal knows what's already in the customer's cart:

**Scenario:** Customer has 3 items in cart, modal shows 4 items
- **Display:** "You have 3 items in cart"
- **Calculation:** 3 + 4 = 7 total items
- **Tier Applied:** Tier 3 (15% off)
- **Message:** "Add 4 items to unlock 15% off your entire order!"

This motivates customers to reach the next tier by showing combined value.

## Configuration

### Switching Between Modes

#### Power Packs Mode (Recommended for Bundles)

Best for: Multi-packs, bundles, products sold in sets

```javascript
window.bf25Config.mode = 'power_packs';
```

**Features:**
- 3 large tier buttons (4, 7, 10 items)
- "Most Popular" badge on recommended tier
- Visual discount percentages
- One-click tier selection
- Faster checkout flow

**Use for:** Power banks, chargers, accessories sold in packs

---

#### Individual Products Mode (Recommended for Single Items)

Best for: Accessories, single units, customizable quantities

```javascript
window.bf25Config.mode = 'individual_products';
```

**Features:**
- Traditional quantity stepper (+ and - buttons)
- Manual quantity input field
- Keyboard shortcuts (numbers, arrows)
- Flexible quantity selection
- Gradual tier unlocking

**Use for:** Individual accessories, replacement parts, gifts

---

### Customizing Tier Thresholds

You can adjust tier breakpoints to match your inventory and profit goals:

```javascript
window.bf25Config.tiers = [
  { min: 1, max: 3, discount: 0, label: "Standard" },
  { min: 4, max: 6, discount: 10, label: "Better Deal" },
  { min: 7, max: 9, discount: 15, label: "Great Deal" },
  { min: 10, max: 999, discount: 20, label: "Best Deal" }
];
```

**Customization Examples:**

**Higher Volume Strategy:**
```javascript
{ min: 1, max: 5, discount: 0, label: "Standard" },
{ min: 6, max: 11, discount: 12, label: "Better Deal" },
{ min: 12, max: 19, discount: 18, label: "Great Deal" },
{ min: 20, max: 999, discount: 25, label: "Best Deal" }
```

**Lower Entry Strategy:**
```javascript
{ min: 1, max: 1, discount: 0, label: "Single" },
{ min: 2, max: 3, discount: 8, label: "Better Deal" },
{ min: 4, max: 6, discount: 15, label: "Great Deal" },
{ min: 7, max: 999, discount: 20, label: "Best Deal" }
```

---

### Enabling/Disabling Features

Control which enhanced features are shown:

```javascript
window.bf25Config.enhancedFeatures = {
  showReviews: true,           // Star ratings and review count
  showStockLevels: true,       // "Only X left at this price" warnings
  showCountdown: true,         // Black Friday countdown timer
  showFeatures: true,          // Bulleted product features list
  showShipping: true,          // Free shipping information
  enableKeyboardShortcuts: true, // Keyboard navigation
  showTrustBadges: true        // Premium Quality / Fast Shipping / 30-Day Guarantee
};
```

**Minimal Setup (Clean Look):**
```javascript
window.bf25Config.enhancedFeatures = {
  showReviews: true,
  showStockLevels: false,
  showCountdown: false,
  showFeatures: true,
  showShipping: true,
  enableKeyboardShortcuts: true,
  showTrustBadges: false
};
```

**Maximum Conversion (All Features):**
```javascript
window.bf25Config.enhancedFeatures = {
  showReviews: true,
  showStockLevels: true,
  showCountdown: true,
  showFeatures: true,
  showShipping: true,
  enableKeyboardShortcuts: true,
  showTrustBadges: true
};
```

## Best Practices

### Product Selection

**Best Products for BF25 Modal:**
- Products with multiple color/size/capacity options
- Items customers frequently buy in quantity
- Products with complementary uses
- Gift-worthy items (customers buy multiple as gifts)
- Consumables or replaceable items

**Avoid Using For:**
- Very high-ticket items (>$200)
- Products with complex customization
- Digital products
- Services or subscriptions

### Pricing Strategy

**Tier Design Tips:**
1. **Anchor Pricing:** Make Tier 1 feel expensive to motivate tier upgrades
2. **Sweet Spot:** Tier 3 should feel like the obvious choice (15% off)
3. **Max Value:** Tier 4 should feel like an amazing deal (20%+ off)
4. **Profit Margins:** Ensure all tiers maintain healthy profit margins

**Example Calculation:**
- Product Cost: €10
- Base Price: €25 (150% markup)
- Tier 3 (15% off): €21.25 (112.5% markup) ✅ Still profitable
- Tier 4 (20% off): €20 (100% markup) ✅ Acceptable margin

### Content Optimization

**Product Images:**
- Use high-quality images (1200x1200px minimum)
- Show product in use (lifestyle shots)
- Multiple angles if available
- Consistent lighting and backgrounds
- WebP format for faster loading

**Product Titles:**
- Clear and descriptive
- Include key features (e.g., "PrismCore Duo 10000mAh Wireless Power Bank")
- Avoid overly long titles (50 characters max)

**Feature Lists:**
- 3-5 bullet points maximum
- Focus on benefits, not just features
- Use action words ("Charges 3 devices simultaneously")
- Keep concise (1 line per feature)

**Product Descriptions:**
- Write for scannability
- Use short paragraphs
- Highlight unique selling points
- Include technical specs if relevant

### Mobile Optimization

70% of your traffic is mobile - optimize accordingly:

**Mobile Best Practices:**
- Keep feature lists short (3-4 items)
- Use large, easy-to-tap buttons
- Minimize text in modal
- Test on real devices (not just emulators)
- Ensure images load quickly

## Troubleshooting

### Modal Won't Open

**Symptoms:** Clicking product card does nothing

**Solutions:**
1. Check browser console for JavaScript errors (F12)
2. Verify product data is configured correctly
3. Ensure JavaScript is enabled in browser
4. Clear browser cache and reload
5. Try in incognito mode to rule out extensions

---

### Discounts Not Calculating

**Symptoms:** Price doesn't change with quantity

**Solutions:**
1. Enable debug mode: `window.bf25Config.debug = true`
2. Check tier configuration is correct
3. Verify quantity falls within tier range
4. Check browser console for calculation logs
5. Reload page to reset state

---

### Add to Cart Fails

**Symptoms:** Error notification appears after clicking "Add to Cart"

**Solutions:**
1. Check product inventory in Shopify admin
2. Verify variant is available
3. Test internet connection
4. Try again (auto-retry may resolve network issues)
5. Check Shopify status page for API issues

---

### Images Not Loading

**Symptoms:** Placeholder images remain

**Solutions:**
1. Check image URLs are correct in product data
2. Verify images exist on CDN
3. Check network tab in browser DevTools
4. Scroll modal to trigger lazy loading
5. Use smaller image sizes

---

### Performance Issues

**Symptoms:** Slow modal opening, laggy animations

**Solutions:**
1. Optimize images (compress, use WebP)
2. Reduce number of enhanced features enabled
3. Check for other heavy scripts on page
4. Test without browser extensions
5. Use performance monitoring: `window.bf25Performance.logSummary()`

---

### Mobile-Specific Issues

**Symptoms:** Issues only on mobile devices

**iOS Safari:**
- Gap at bottom → Check --vh CSS variable
- Text too small → Verify font sizes ≥16px
- Scrolling janky → Disable other scripts temporarily

**Android:**
- Buttons hard to tap → Check touch target sizes
- Slow animations → Enable GPU acceleration

**Solutions:**
1. Test on real device (not emulator)
2. Clear mobile browser cache
3. Update browser to latest version
4. Test in landscape and portrait modes

## Support

### Getting Help

**Before contacting support:**
1. Check this user guide
2. Review troubleshooting section
3. Enable debug mode and check console
4. Test in incognito mode
5. Try on different browser/device

**When contacting support, include:**
- Browser and version
- Device type (desktop/mobile)
- Steps to reproduce issue
- Screenshots or screen recording
- Console error messages (if any)
- Your store URL

### Resources

- **Technical Documentation:** BF25-MODAL-TECHNICAL-DOCS.md
- **Troubleshooting Guide:** BF25-MODAL-TROUBLESHOOTING.md
- **Support Email:** [your-support-email]
- **Documentation Site:** [your-docs-url]

## Success Tips

### Getting the Most from BF25 Modal

1. **Test Different Modes:** Try both power_packs and individual_products to see which converts better
2. **A/B Test Tiers:** Experiment with tier thresholds to find optimal breakpoints
3. **Monitor Analytics:** Track AOV, conversion rate, and tier adoption
4. **Optimize Content:** Use high-quality images and compelling feature lists
5. **Mobile-First:** Always test on mobile devices first
6. **Customer Feedback:** Listen to user feedback and iterate
7. **Seasonal Adjustments:** Adjust tiers for different seasons/promotions
8. **Stock Management:** Use stock indicators to create urgency
9. **Trust Signals:** Enable reviews and badges for social proof
10. **Performance:** Monitor Core Web Vitals weekly

### Expected Results

**Realistic Targets:**
- Average Order Value: +5-15% increase
- Items Per Transaction: 5-10 items average
- Conversion Rate: Maintain or slight increase
- Tier 3-4 Adoption: 40-60% of transactions

**Timeline:**
- **Week 1:** Learning phase, monitor closely
- **Week 2-4:** Optimization phase, A/B test settings
- **Month 2+:** Stable performance, focus on content

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-19
**For:** Titan Power Plus Black Friday 2025

**Questions?** Contact your development team or refer to the technical documentation.
