# Power Pairs BF25 - Maintenance Guide

## Regular Maintenance Tasks

### Daily (During Active Campaign)

**Error Monitoring:**
- Check Shopify Admin → Analytics → Reports
- Review browser console for JavaScript errors
- Monitor Shopify API status
- Check customer support tickets

**Performance Check:**
- Run Lighthouse audit (mobile)
- Verify LCP <2.5s
- Check error rate <0.1%
- Monitor page load times

**Inventory Monitoring:**
- Check stock levels
- Update out-of-stock variants
- Adjust bundle availability if needed

### Weekly

**Analytics Review:**
- Conversion rate trends
- Most popular bundles
- Average order value
- Drop-off points in funnel

**Code Health:**
- Review error logs
- Check for any warnings
- Verify all features functional
- Test on new browser versions

**Content Updates:**
- Update product images if needed
- Refresh copy if stale
- Update social proof numbers
- Adjust trust badges

### Monthly

**Performance Audit:**
- Full Lighthouse audit
- Core Web Vitals check
- Load testing (if possible)
- Mobile performance review

**Security Check:**
- Review Shopify security notices
- Check for disclosed vulnerabilities
- Update dependencies (if any)
- Verify SSL certificate

**Feature Review:**
- User feedback analysis
- Feature usage statistics
- Identify optimization opportunities
- Plan enhancements

### Quarterly

**Major Review:**
- Full code audit
- Design refresh consideration
- Technology stack update
- Competitive analysis
- A/B testing plan

---

## Common Maintenance Scenarios

### Updating Product Prices

**Steps:**
1. Update product price in Shopify Admin
2. Verify variant prices updated
3. Check bundle pricing calculations
4. Test add to cart flow
5. Confirm checkout displays correctly

**No code changes needed** - prices pulled from Shopify API

### Adding New Products to Bundles

**Steps:**
1. Create product in Shopify
2. Add product to collection (if using)
3. Note product handle
4. Update bundle configuration in Theme Customizer
5. Add product handle and quantity
6. Save and test

### Changing Discount Codes

**Steps:**
1. Create new codes in Shopify Admin
2. Update code generation logic in JavaScript:
```javascript
generateDiscountCode(tier, itemCount) {
  return `BF26-TIER${tier}-${itemCount}ITEMS`; // Changed year
}
```
3. Test checkout with new codes
4. Deactivate old codes

### Updating Trust Badges

**Steps:**
1. Go to Theme Customizer
2. Find Power Pairs section
3. Scroll to Trust & Social Proof
4. Update badge text/icons
5. Save changes
6. Preview and verify

### Seasonal Updates (e.g., Christmas)

**Steps:**
1. Update color scheme (CSS variables):
```css
--pp-accent-primary: #C41E3A; /* Christmas red */
--pp-accent-gold: #FFD700; /* Gold */
```
2. Update copy/messaging
3. Update free gifts for season
4. Update trust badge text
5. Test thoroughly

---

## Troubleshooting Common Issues

### Issue: Slow Performance

**Diagnosis:**
- Run Lighthouse audit
- Check Network tab for slow requests
- Review image sizes
- Check JavaScript execution time

**Solutions:**
- Optimize images (WebP, smaller sizes)
- Review third-party scripts
- Check for memory leaks
- Contact Shopify support if CDN issues

### Issue: Discount Code Not Applying

**Diagnosis:**
- Check code exists in Shopify Admin
- Verify code is active
- Check date range
- Test code manually in checkout

**Solutions:**
- Recreate code if corrupted
- Verify no conflicting discount rules
- Check code spelling in JavaScript
- Contact Shopify support

### Issue: Products Not Displaying

**Diagnosis:**
- Check product handles in configuration
- Verify products are published
- Check inventory status
- Review console for errors

**Solutions:**
- Correct product handles
- Publish products
- Update inventory
- Fix any JavaScript errors

### Issue: Mobile Display Issues

**Diagnosis:**
- Test on actual device
- Check responsive CSS
- Review viewport settings
- Test different screen sizes

**Solutions:**
- Adjust media queries
- Fix CSS issues
- Test on various devices
- Use browser dev tools

### Issue: Accessibility Problems

**Diagnosis:**
- Run WAVE extension
- Test with keyboard
- Try screen reader
- Check color contrast

**Solutions:**
- Add missing ARIA labels
- Fix focus indicators
- Improve color contrast
- Update semantic HTML

### Issue: Bottom Sheet Not Opening

**Diagnosis:**
- Check browser console for errors
- Verify JavaScript loaded
- Test event listeners
- Check for conflicting scripts

**Solutions:**
- Fix JavaScript errors
- Ensure proper script loading order
- Remove conflicting code
- Clear browser cache

### Issue: Variant Selection Not Working

**Diagnosis:**
- Check product has variants
- Verify variant modal initialized
- Review JavaScript errors
- Test on different browsers

**Solutions:**
- Ensure product variants exist
- Fix modal initialization
- Debug JavaScript
- Test cross-browser

### Issue: Multiplier Not Updating Price

**Diagnosis:**
- Check console for calculation errors
- Verify tier logic
- Test with different multipliers
- Review state management

**Solutions:**
- Fix calculation logic
- Debug tier progression
- Test state updates
- Verify price formatting

---

## Code Update Procedures

### Minor Updates (Bug Fixes)

1. **Create backup:**
```bash
shopify theme pull --live
```

2. **Make changes in development theme**
3. **Test thoroughly**
4. **Deploy to production:**
```bash
shopify theme push --live --only assets/section-power-pairs-bf25.js
```

5. **Verify in production**
6. **Monitor for issues**

### Major Updates (New Features)

1. **Create backup**
2. **Develop in separate branch (if using Git)**
3. **Test extensively in development**
4. **Get stakeholder approval**
5. **Deploy during low-traffic period**
6. **Monitor closely**
7. **Have rollback plan ready**

---

## File Structure Reference

### Core Files

**[sections/section-power-pairs-bf25.liquid](sections/section-power-pairs-bf25.liquid)**
- Main section template
- Shopify schema configuration
- Data processing and rendering
- ~600 lines

**[assets/section-power-pairs-bf25.css](assets/section-power-pairs-bf25.css)**
- Complete styling system
- Design tokens (CSS variables)
- Responsive layouts
- Accessibility enhancements
- Cross-browser compatibility
- ~4,000 lines

**[assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js)**
- State management
- UI interactions
- Add to cart logic
- Performance optimizations
- Browser compatibility
- ~2,700 lines

---

## Performance Monitoring

### Key Metrics to Track

**Technical:**
- Lighthouse score (maintain 90+)
- LCP (<2.5s)
- FID (<100ms)
- CLS (<0.1)
- Error rate (<0.1%)

**Business:**
- Conversion rate
- Average order value
- Revenue per visitor
- Cart abandonment rate

### Monitoring Tools

**Shopify Analytics:**
- Online Store → Analytics
- Review daily/weekly reports
- Set up custom reports

**Google Analytics (if integrated):**
- Real-time monitoring
- Conversion funnel analysis
- User flow visualization

**Performance Monitoring:**
- Lighthouse CI (automated)
- WebPageTest (detailed analysis)
- Shopify speed report

### Performance Optimization Tips

**Images:**
- Use WebP format
- Optimize file sizes (<200KB)
- Implement lazy loading
- Use responsive images

**JavaScript:**
- Minimize bundle size
- Use code splitting
- Defer non-critical scripts
- Minimize DOM manipulation

**CSS:**
- Remove unused styles
- Minimize file size
- Use critical CSS
- Optimize animations

---

## Backup & Recovery

### Regular Backups

**Frequency:** Before any changes

**Method:**
```bash
# Download theme
shopify theme pull --live

# Or use Shopify Admin:
# Themes → Actions → Download theme file
```

**Storage:** Keep last 5 versions minimum

### Recovery Procedure

**If issues after update:**

1. **Assess severity**
2. **If critical, rollback immediately**
3. **Restore from backup:**
```bash
shopify theme push --live
```
4. **Verify restoration**
5. **Diagnose issue offline**
6. **Fix and redeploy**

---

## Browser Compatibility Maintenance

### Testing Matrix

**Desktop Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Mobile Browsers:**
- Safari iOS (14+)
- Chrome Android (90+)
- Samsung Internet (14+)

### Browser-Specific Issues

**Safari:**
- Backdrop-filter support
- Sticky positioning
- CSS Grid inconsistencies

**Firefox:**
- Flexbox gap support
- Scrollbar styling
- Font rendering

**iOS Safari:**
- 100vh viewport issues
- Touch event handling
- Scroll lock behavior

**Solutions:**
- Polyfills already included
- Fallbacks in place
- Regular testing protocol

---

## Accessibility Maintenance

### Regular Checks

**Weekly:**
- Keyboard navigation test
- Screen reader spot check
- Color contrast verification
- Focus indicator visibility

**Monthly:**
- Full WAVE audit
- Complete keyboard test
- Screen reader full test
- WCAG compliance review

### Common Accessibility Fixes

**Missing ARIA labels:**
```javascript
// Add to interactive elements
aria-label="Description of action"
```

**Poor color contrast:**
```css
/* Increase opacity/brightness */
--pp-text-secondary: rgba(255, 255, 255, 0.87);
```

**Missing focus indicators:**
```css
*:focus-visible {
  outline: 3px solid var(--pp-accent-primary);
}
```

---

## Support & Escalation

### Internal Support Tiers

**Tier 1 (Self-Service):**
- Configuration changes
- Content updates
- Minor CSS tweaks
- Trust badge updates

**Tier 2 (Developer):**
- Bug fixes
- Performance issues
- Integration problems
- New feature requests

**Tier 3 (Senior Developer):**
- Architecture changes
- Major refactoring
- Security concerns
- Complex integrations

### External Support

**Shopify Support:**
- partners.shopify.com/current/support
- Available 24/7
- Use for Shopify platform issues

**Community Resources:**
- Shopify Community forums
- Stack Overflow (tag: shopify)
- GitHub (if open source)

---

## Maintenance Checklist

### Pre-Update Checklist
- [ ] Backup created
- [ ] Changes tested in development
- [ ] Stakeholders notified
- [ ] Low-traffic period scheduled
- [ ] Rollback plan ready

### Post-Update Checklist
- [ ] Changes verified in production
- [ ] No console errors
- [ ] Performance maintained
- [ ] Analytics tracking works
- [ ] Customer feedback reviewed

### Monthly Audit Checklist
- [ ] Performance metrics reviewed
- [ ] Error logs checked
- [ ] User feedback analyzed
- [ ] Content updated
- [ ] Security check completed
- [ ] Backup verified
- [ ] Documentation updated

---

## Maintenance Log Template

```
Date: _______________
Performed By: _______________
Type: [Routine / Bug Fix / Feature / Emergency]

Changes Made:
-
-
-

Testing Performed:
-
-

Results:
-

Issues Found:
-

Next Actions:
-

Sign-off: _______________
```

---

## Common Code Modifications

### Update Tier Thresholds

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js) (line ~2200)

```javascript
calculateTierFromItems(itemCount) {
  if (itemCount >= 20) return 4; // Changed from 16
  if (itemCount >= 15) return 3; // Changed from 12
  if (itemCount >= 10) return 2; // Changed from 8
  if (itemCount >= 5) return 1;  // Changed from 4
  return 0;
}
```

### Update Free Gift Display

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js) (line ~2220)

```javascript
const TIER_GIFTS = {
  1: [
    { name: 'Bonus Cable', value: 25 }
  ],
  2: [
    { name: 'Bonus Cable', value: 25 },
    { name: 'Travel Pouch', value: 30 }
  ],
  // etc.
};
```

### Change Color Scheme

**Location:** [assets/section-power-pairs-bf25.css](assets/section-power-pairs-bf25.css) (line ~25-60)

```css
:root {
  --pp-accent-primary: #60c655; /* Your brand color */
  --pp-accent-gold: #FFD700;
  --pp-bg-primary: #0A0A0A;
  /* etc. */
}
```

### Update Discount Code Format

**Location:** [assets/section-power-pairs-bf25.js](assets/section-power-pairs-bf25.js) (line ~1820)

```javascript
generateDiscountCode(tier, itemCount) {
  // Update format as needed
  return `SALE2026-T${tier}-${itemCount}`;
}
```

---

## Seasonal Campaign Updates

### Black Friday → Cyber Monday

1. **Update discount codes** (create new codes for CM)
2. **Update messaging** (change "Black Friday" → "Cyber Monday")
3. **Adjust tier thresholds** (if different strategy)
4. **Test thoroughly** before CM launch

### Post-Holiday Cleanup

1. **Deactivate old discount codes**
2. **Remove urgency messaging**
3. **Update social proof numbers**
4. **Review performance data**
5. **Plan next campaign**

---

## Long-Term Maintenance

### Year 1
- Monitor and optimize
- Gather user feedback
- Implement quick wins
- Plan major enhancements

### Year 2
- Design refresh
- New features based on data
- Technology stack updates
- Competitive repositioning

### Year 3+
- Major version upgrade
- Platform migration (if needed)
- AI/ML integration
- Advanced personalization

---

## Emergency Procedures

### Critical Issue Response

**Step 1: Assess (1 minute)**
- Determine severity
- Impact on users
- Revenue impact

**Step 2: Contain (5 minutes)**
- Remove section (if critical)
- OR disable problematic bundle
- OR revert to backup theme

**Step 3: Notify (10 minutes)**
- Alert team
- Update status page
- Communicate timeline

**Step 4: Fix (variable)**
- Diagnose in development
- Test fix thoroughly
- Deploy carefully

**Step 5: Post-Mortem**
- Document issue
- Identify root cause
- Prevent recurrence

---

## Version History

### v1.0.0 (Initial Launch)
- All 17 prompts completed
- Production-ready
- Full feature set

### Future Versions
- v1.1.0: Minor enhancements
- v1.2.0: Bug fixes and optimizations
- v2.0.0: Major feature additions

---

## Knowledge Base

### Frequently Asked Questions

**Q: How do I add a new bundle?**
A: Go to Theme Customizer → Power Pairs section → Add Block → Select "Bundle" → Configure settings → Save

**Q: Can I change the discount percentages?**
A: Yes, update both the JavaScript TIER_MULTIPLIERS and Shopify discount codes

**Q: How do I optimize images?**
A: Use WebP format, compress to <200KB, upload to Shopify Files

**Q: What if a product goes out of stock?**
A: Bundle will automatically handle it - variant will show as unavailable

**Q: Can I use this for other campaigns?**
A: Yes! Update discount codes, messaging, and configuration

---

## Contact Information

**Technical Support:**
- Developer: _________________
- Email: _________________
- Slack: _________________

**Emergency Contact:**
- On-call: _________________
- Phone: _________________

---

**Maintenance Owner:** _______________
**Last Updated:** _______________
**Next Review Date:** _______________
