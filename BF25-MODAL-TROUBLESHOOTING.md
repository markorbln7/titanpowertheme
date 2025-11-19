# BF25 Bundle Builder - Troubleshooting Guide

## Quick Diagnostics

### First Steps for Any Issue

1. **Enable Debug Mode:**
   ```javascript
   window.bf25Config.debug = true;
   ```
   Then reload the page and check browser console (F12)

2. **Check Console for Errors:**
   - Press F12 to open DevTools
   - Click "Console" tab
   - Look for red error messages
   - Copy error messages for support

3. **Test in Incognito Mode:**
   - Rules out browser extensions
   - Uses fresh cache
   - Isolates the issue

4. **Check Browser Compatibility:**
   - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   - IE not supported

5. **Verify JavaScript Enabled:**
   - Modal requires JavaScript
   - Check browser settings

---

## Common Issues & Solutions

### Issue 1: Modal Won't Open

**Symptoms:**
- Clicking product card does nothing
- No animation
- No errors visible to user

**Possible Causes:**
- JavaScript not loaded
- Product data missing or malformed
- Conflicting JavaScript from other apps
- DOM elements not found
- Modal already in error state

**Diagnostic Steps:**

1. **Check if modal system initialized:**
   ```javascript
   console.log(window.bf25Expansion);
   ```
   - Should see `ExpansionManager` object
   - If undefined → JavaScript not loaded

2. **Check product data exists:**
   ```javascript
   console.log(window.productData);
   console.log(window.productVariants);
   ```
   - Should see objects with product IDs
   - If undefined → Data not configured

3. **Check for JavaScript errors:**
   - Open Console (F12)
   - Look for red error messages
   - Note the file and line number

4. **Check DOM elements:**
   ```javascript
   console.log(document.getElementById('bf25-modal-container'));
   console.log(document.getElementById('bf25-modal-overlay'));
   ```
   - Should see HTML elements
   - If null → HTML structure missing

**Solutions:**

**If JavaScript not loaded:**
- Verify `bf25-expansion-core.js` is in assets folder
- Check it's included in theme.liquid
- Clear Shopify cache
- Hard refresh browser (Ctrl+Shift+R)

**If product data missing:**
- Check `window.productData` configuration
- Verify product IDs match
- Ensure data loaded before modal init
- Check for JSON syntax errors

**If conflicting JavaScript:**
- Disable other apps temporarily
- Check for jQuery conflicts
- Look for global variable collisions
- Test with minimal theme

**If DOM elements missing:**
- Verify modal HTML is in theme
- Check for typos in element IDs
- Ensure modal container exists in DOM
- Check element isn't hidden by CSS

---

### Issue 2: Discounts Not Calculating

**Symptoms:**
- Prices don't update when quantity changes
- Always shows base price
- Tier badges don't appear
- Savings amount is $0

**Possible Causes:**
- Tier configuration missing or invalid
- State not updating
- TierCalculator not initialized
- Quantity not being set
- Price data incorrect

**Diagnostic Steps:**

1. **Check tier configuration:**
   ```javascript
   console.log(window.bf25Config.tiers);
   ```
   - Should see array of tier objects
   - Each tier should have min, max, discount, label

2. **Check current state:**
   ```javascript
   console.log(window.bf25Expansion.state.getAll());
   ```
   - Check `quantity` value
   - Check `productId` value
   - Check `basePrice` value

3. **Manually trigger calculation:**
   ```javascript
   const pricing = window.bf25Expansion.tierCalculator.calculatePricing();
   console.log(pricing);
   ```
   - Should see pricing object with tier, discount, etc.
   - If error → TierCalculator issue

4. **Check TierCalculator exists:**
   ```javascript
   console.log(window.bf25Expansion.tierCalculator);
   ```
   - Should see TierCalculator object
   - If undefined → Not initialized

**Solutions:**

**If tier config missing:**
```javascript
window.bf25Config.tiers = [
  { min: 1, max: 3, discount: 0, label: "Standard" },
  { min: 4, max: 6, discount: 10, label: "Better Deal" },
  { min: 7, max: 9, discount: 15, label: "Great Deal" },
  { min: 10, max: 999, discount: 20, label: "Best Deal" }
];
```

**If state not updating:**
- Check state subscriptions are working
- Manually update: `window.bf25Expansion.state.update('quantity', 7)`
- Check for errors in state listeners

**If prices incorrect:**
- Verify `basePrice` in product data
- Check price is a number, not string
- Ensure variant prices are correct
- Check for currency conversion issues

---

### Issue 3: Add to Cart Fails

**Symptoms:**
- Red error notification appears
- "Unable to add to cart" message
- Loading spinner hangs
- Cart count doesn't update

**Possible Causes:**
- Network connectivity issue
- Variant out of stock
- Invalid variant ID
- Shopify Cart API error
- Variant not selected
- Cart API endpoint blocked

**Diagnostic Steps:**

1. **Check network request:**
   - Open DevTools → Network tab
   - Click "Add to Cart"
   - Look for `/cart/add.js` request
   - Check status code (200 = success, 4xx/5xx = error)

2. **Check selected variant:**
   ```javascript
   console.log(window.bf25Expansion.state.get('selectedVariantId'));
   ```
   - Should be a variant ID number
   - If null/undefined → No variant selected

3. **Check variant availability:**
   ```javascript
   const productId = window.bf25Expansion.state.get('productId');
   const variants = window.productVariants[productId];
   console.log(variants);
   ```
   - Check `available: true` on variants
   - Verify inventory in Shopify admin

4. **Test Cart API directly:**
   ```javascript
   fetch('/cart.js')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error);
   ```
   - Should return cart object
   - If error → Cart API issue

**Solutions:**

**If network error:**
- Check internet connection
- Retry (system auto-retries 2 times)
- Check Shopify status page
- Verify no firewall/ad-blocker blocking requests

**If out of stock:**
- Check inventory in Shopify admin
- Update stock levels
- Disable variant if permanently out of stock
- Add "notify when available" option

**If invalid variant ID:**
- Verify variant IDs in `window.productVariants`
- Check variant IDs match Shopify
- Ensure variant exists in product
- Check for typos in variant data

**If Shopify error:**
- Check Shopify admin for issues
- Verify product is published
- Check product isn't archived
- Ensure cart API is enabled

**Emergency bypass (testing only):**
```javascript
// Force add specific variant
const response = await fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 'VARIANT_ID', quantity: 1 })
});
console.log(await response.json());
```

---

### Issue 4: Images Not Loading

**Symptoms:**
- Placeholder images remain
- Broken image icon
- Images load very slowly
- Images don't swap on variant change

**Possible Causes:**
- Image URLs incorrect
- Lazy loading not triggering
- Intersection Observer not supported
- Images not on CDN
- Image files deleted
- Network throttling

**Diagnostic Steps:**

1. **Check image URL:**
   ```javascript
   const productId = window.bf25Expansion.state.get('productId');
   console.log(window.productData[productId].image);
   ```
   - Should be full CDN URL
   - Test URL in browser address bar

2. **Check image element:**
   ```javascript
   const img = document.querySelector('.bf25-modal-image');
   console.log(img.src);
   console.log(img.dataset.src);
   ```
   - `data-src` = URL to load
   - `src` = loaded URL (or placeholder)

3. **Check Intersection Observer:**
   ```javascript
   console.log('IntersectionObserver' in window);
   ```
   - Should be `true`
   - If `false` → Browser doesn't support lazy loading

4. **Check network:**
   - DevTools → Network tab
   - Filter by "Img"
   - Check image requests
   - Check response codes

**Solutions:**

**If URLs incorrect:**
- Verify image URLs in product data
- Use full CDN URLs (https://cdn.shopify.com/...)
- Check for typos in URLs
- Ensure images uploaded to Shopify

**If lazy loading not working:**
- Scroll modal to trigger observer
- Disable lazy loading temporarily:
  ```javascript
  document.querySelectorAll('[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
  ```
- Check browser support
- Use polyfill for older browsers

**If images too large:**
- Compress images (use TinyPNG)
- Use Shopify's image CDN parameters
- Convert to WebP format
- Lazy load images

**If network slow:**
- Use smaller images
- Enable CDN
- Optimize image format
- Use responsive images

---

### Issue 5: Cart Progress Not Showing

**Symptoms:**
- "X items in cart" doesn't appear
- Cart-aware pricing not working
- Progress bar always empty
- Combined quantity incorrect

**Possible Causes:**
- Cart fetch failed
- Cart empty (so nothing to show)
- Cart API blocked
- Cart state not syncing
- Feature disabled

**Diagnostic Steps:**

1. **Check cart fetched:**
   ```javascript
   console.log(window.bf25Expansion.state.get('cartFetched'));
   console.log(window.bf25Expansion.state.get('cartItemCount'));
   ```
   - `cartFetched` should be `true`
   - `cartItemCount` should be number

2. **Manually fetch cart:**
   ```javascript
   await window.bf25Expansion.cartManager.fetchCart(true);
   console.log(window.bf25Expansion.state.get('cartItemCount'));
   ```
   - Should update cart count
   - If error → Cart API issue

3. **Check cart data:**
   ```javascript
   fetch('/cart.js')
     .then(r => r.json())
     .then(data => {
       console.log('Cart item count:', data.item_count);
       console.log('Cart items:', data.items);
     });
   ```
   - Verify cart has items
   - Check item count matches

4. **Check network request:**
   - DevTools → Network tab
   - Look for `/cart.js` GET request
   - Should happen when modal opens
   - Check response

**Solutions:**

**If cart fetch fails:**
- Check network connection
- Verify `/cart.js` endpoint accessible
- Check for CORS issues
- Retry: `await window.bf25Expansion.cartManager.fetchCart(true)`

**If cart empty:**
- Add items to cart first
- Cart progress only shows when cart has items
- This is expected behavior

**If cart not syncing:**
- Check cart updated after add to cart
- Force refresh: `fetchCart(true)` (bypasses cache)
- Check cart cache TTL (default 30s)

**If feature disabled:**
- Cart awareness is always enabled
- Check cart-aware calculations working
- Verify combined quantity calculated correctly

---

### Issue 6: Performance Problems

**Symptoms:**
- Laggy animations (not 60fps)
- Slow modal opening (>300ms)
- Sluggish interactions
- High CPU usage
- Memory leaks

**Possible Causes:**
- Too many calculations
- Heavy third-party scripts
- Large images
- No GPU acceleration
- Memory not cleaned up
- Browser extensions

**Diagnostic Steps:**

1. **Check performance metrics:**
   ```javascript
   window.bf25Performance.logSummary();
   window.bf25Performance.checkTargets();
   ```
   - Check all metrics
   - Compare to targets

2. **Check GPU acceleration:**
   - DevTools → Rendering → Paint Flashing
   - Modal should use GPU (green flash)
   - Check `will-change: transform` in CSS

3. **Profile performance:**
   - DevTools → Performance tab
   - Click Record
   - Open/close modal
   - Stop recording
   - Analyze timeline

4. **Check for memory leaks:**
   - Open/close modal 10 times
   - DevTools → Memory tab
   - Take heap snapshot
   - Check for retained objects

**Solutions:**

**If animations laggy:**
- Enable GPU acceleration in CSS
- Reduce motion on low-end devices
- Check for layout thrashing
- Optimize JavaScript calculations

**If modal slow to open:**
- Optimize images (compress, WebP)
- Reduce enhanced features
- Check for blocking scripts
- Profile with Performance tab

**If memory leaks:**
- Ensure cleanup in close() method
- Clear intervals and timeouts
- Remove event listeners
- Check for circular references

**If third-party scripts slow:**
- Load scripts asynchronously
- Defer non-critical scripts
- Consider removing heavy scripts
- Use performance budget

**Optimization checklist:**
- [ ] Images compressed (<200KB each)
- [ ] GPU acceleration enabled
- [ ] Lazy loading working
- [ ] No blocking JavaScript
- [ ] Event listeners cleaned up
- [ ] Calculations debounced
- [ ] Cart API cached

---

### Issue 7: Mobile-Specific Issues

**Symptoms:**
- Issues only on mobile devices
- iOS Safari specific problems
- Android-specific bugs
- Touch interactions not working

**iOS Safari Issues:**

**100vh Gap at Bottom:**
```javascript
// Check --vh variable set
console.log(getComputedStyle(document.documentElement).getPropertyValue('--vh'));
```
- Should be close to `1vh`
- If not set → Browser fixes not initialized

**Solution:**
```javascript
// Manually set --vh
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
```

**Input Zoom on Focus:**
- Check font size ≥ 16px
- iOS zooms if font < 16px
- Verify CSS: `font-size: 16px !important`

**Scroll Jank:**
- Check `-webkit-overflow-scrolling: touch`
- Disable momentum scrolling if needed
- Optimize scroll event listeners

**Android Issues:**

**Touch Targets Too Small:**
- Verify buttons ≥ 44x44px
- Check spacing between targets
- Test on real device

**Animations Janky:**
- Enable GPU acceleration
- Use `transform` and `opacity` only
- Avoid animating layout properties

**Diagnostic Steps:**

1. **Test on real device:**
   - Don't rely on emulators
   - Use actual iPhone/Android phone
   - Test multiple OS versions

2. **Remote debugging:**
   - **iOS:** Safari → Develop → Device
   - **Android:** Chrome → chrome://inspect
   - Access console on desktop

3. **Check viewport:**
   ```javascript
   console.log(window.innerWidth, window.innerHeight);
   console.log(screen.width, screen.height);
   ```

4. **Check touch events:**
   ```javascript
   document.addEventListener('touchstart', e => {
     console.log('Touch:', e.touches[0]);
   });
   ```

**Solutions:**

**For iOS Safari:**
- Use --vh CSS variable fix
- Set font-size ≥ 16px
- Disable zoom: `maximum-scale=1`
- Test in both orientations

**For Android:**
- Increase touch target sizes
- Enable GPU acceleration
- Use passive event listeners
- Test on multiple devices

---

### Issue 8: Accessibility Issues

**Symptoms:**
- Screen reader not announcing content
- Keyboard navigation broken
- Focus trapped in modal
- Poor color contrast

**Diagnostic Steps:**

1. **Test keyboard navigation:**
   - Tab through all elements
   - Check focus visible
   - Test ESC to close
   - Verify focus restored

2. **Test with screen reader:**
   - **Windows:** NVDA (free)
   - **Mac:** VoiceOver (built-in)
   - **Android:** TalkBack
   - **iOS:** VoiceOver

3. **Check ARIA attributes:**
   ```javascript
   const modal = document.querySelector('.bf25-expansion-modal');
   console.log(modal.getAttribute('role'));
   console.log(modal.getAttribute('aria-modal'));
   console.log(modal.getAttribute('aria-labelledby'));
   ```

4. **Check color contrast:**
   - DevTools → Lighthouse
   - Run accessibility audit
   - Check contrast ratios

**Solutions:**

**If keyboard navigation broken:**
- Check focus trap initialized
- Verify Tab key handler working
- Test focus restoration on close
- Check for JavaScript errors

**If screen reader issues:**
- Verify ARIA live regions present
- Check ARIA attributes correct
- Test announcements on actions
- Add screen reader only text where needed

**If focus issues:**
- Check focusable elements have tabindex
- Verify focus trap working
- Test Shift+Tab (backwards navigation)
- Ensure focus visible

**If color contrast fails:**
- Check all text meets WCAG AA (4.5:1)
- Use high contrast mode
- Test with color blindness simulators
- Adjust colors if needed

---

## Debug Mode Reference

### Enable Debug Logging

```javascript
window.bf25Config.debug = true;
```

Then reload the page. You'll see detailed logs:

### Log Messages Explained

| Message | Meaning |
|---------|---------|
| `🚀 Opening Modal` | Modal open initiated |
| `✅ Cart response` | Add to cart succeeded |
| `❌ Cart error` | Add to cart failed |
| `📊 Performance Summary` | Performance metrics logged |
| `⚠️ Warning` | Non-critical issue |
| `🔒 Focus trap initialized` | Keyboard accessibility active |
| `📢 Screen reader announcement` | ARIA live region updated |
| `🔄 Retry attempt` | Network retry in progress |
| `🛒 CartManager initialized` | Cart system ready |
| `💰 Tier calculation` | Price calculation completed |

### Performance Debugging

```javascript
// Log performance summary
window.bf25Performance.logSummary();

// Check if targets met
window.bf25Performance.checkTargets();

// Get specific metric
window.bf25Performance.metrics.lcp;
window.bf25Performance.metrics.fid;
window.bf25Performance.metrics.cls;
```

### State Debugging

```javascript
// Get all state
window.bf25Expansion.state.getAll();

// Get specific state
window.bf25Expansion.state.get('quantity');
window.bf25Expansion.state.get('productId');
window.bf25Expansion.state.get('selectedVariantId');

// Subscribe to state changes
window.bf25Expansion.state.subscribe('quantity', (value) => {
  console.log('Quantity changed to:', value);
});
```

---

## Emergency Procedures

### Emergency Disable

If modal is causing critical issues:

```javascript
// Quick disable (refresh page to re-enable)
window.bf25Expansion = null;
```

Or comment out in theme.liquid:
```liquid
<!-- {{ 'bf25-expansion-core.js' | asset_url | script_tag }} -->
```

### Force Cart Refresh

If cart state is stuck:

```javascript
await window.bf25Expansion.cartManager.fetchCart(true);
```

### Reset State

If state is corrupted:

```javascript
window.bf25Expansion.state.reset();
```

### Clear Cache

If seeing old behavior:

1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Clear Shopify cache (if admin access)
4. Test in incognito mode

---

## Getting Support

### Before Contacting Support

Complete this checklist:

- [ ] Checked browser console for errors
- [ ] Enabled debug mode
- [ ] Tested in incognito mode
- [ ] Checked this troubleshooting guide
- [ ] Tested on different browser
- [ ] Verified JavaScript enabled
- [ ] Checked network connectivity

### Information to Provide

When contacting support, include:

1. **Error Details:**
   - Exact error message
   - Console error logs
   - Network tab screenshot

2. **Environment:**
   - Browser and version
   - Device type and OS
   - Screen size
   - Internet speed

3. **Steps to Reproduce:**
   - Step-by-step instructions
   - Expected vs actual behavior
   - When issue started
   - Frequency (always, sometimes, rare)

4. **Configuration:**
   - Mode (power_packs or individual_products)
   - Tier configuration
   - Enabled features
   - Debug logs

5. **Screenshots/Video:**
   - Screenshot of issue
   - Screen recording if possible
   - Network tab screenshot
   - Console tab screenshot

### Support Channels

- **Technical Documentation:** BF25-MODAL-TECHNICAL-DOCS.md
- **User Guide:** BF25-MODAL-USER-GUIDE.md
- **Email Support:** [your-support-email]
- **Documentation:** [your-docs-url]

---

## Testing Checklist

Use this checklist to verify everything works:

### Basic Functionality
- [ ] Modal opens on card click
- [ ] Modal closes on ESC key
- [ ] Modal closes on overlay click
- [ ] Modal closes on X button
- [ ] Focus returns to card on close

### Product Display
- [ ] Product image loads
- [ ] Product title shows
- [ ] Base price correct
- [ ] Features display (if enabled)
- [ ] Reviews show (if enabled)

### Variant Selection
- [ ] Variants display
- [ ] Can select variant
- [ ] Image updates on variant change
- [ ] Price updates on variant change

### Quantity Selection
- [ ] Can change quantity
- [ ] Tier updates with quantity
- [ ] Price recalculates
- [ ] Savings display correct

### Cart Operations
- [ ] Add to cart succeeds
- [ ] Cart count updates
- [ ] Success notification shows
- [ ] Cart progress displays

### Performance
- [ ] Modal opens <300ms
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] No memory leaks

### Mobile
- [ ] Works on iPhone
- [ ] Works on Android
- [ ] Touch targets adequate
- [ ] No zoom on input

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces
- [ ] Focus visible
- [ ] Color contrast passes

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-19
**Maintainer:** Titan Power Plus Development Team
