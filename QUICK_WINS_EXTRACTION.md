=== EXTRACTION 1: populateProductRatings Function ===

function populateProductRatings() {
  const ratingDisplays = document.querySelectorAll('.product-rating-display');

  console.log(`⭐ Populating ratings for ${ratingDisplays.length} products`);

  ratingDisplays.forEach(display => {
    const productId = display.dataset.productId;

    if (!productId) {
      console.warn('⚠️ Rating display missing product ID');
      return;
    }

    // Get product data directly from PRODUCT_REVIEWS object
    const productData = PRODUCT_REVIEWS[productId];

    if (!productData || !productData.reviews || productData.reviews.length === 0) {
      // No reviews - hide the rating display
      display.classList.add('no-reviews');
      console.log(`📝 No reviews for product ${productId}`);
      return;
    }

    const avgRating = productData.avgRating || 0;
    const totalReviews = productData.totalReviews || 0;

    // Update star fill percentage
    const starsFilled = display.querySelector('.stars-filled');
    if (starsFilled) {
      const percentage = (avgRating / 5) * 100;
      starsFilled.style.width = `${percentage}%`;
    }

    // Update review count text
    const ratingCount = display.querySelector('.rating-count');
    if (ratingCount) {
      // Desktop: Show full text
      let countText = `${totalReviews.toLocaleString()} review${totalReviews !== 1 ? 's' : ''}`;

      // Mobile: Shorter format
      if (window.innerWidth <= 768) {
        countText = `(${totalReviews.toLocaleString()})`;
      }

      ratingCount.textContent = countText;
    }

    // Add aria-label for accessibility
    display.setAttribute('aria-label', `Rated ${avgRating} out of 5 stars, ${totalReviews} reviews. Click to view all reviews.`);

    // Remove loading state
    display.removeAttribute('data-loading');

    console.log(`✅ Rating populated for product ${productId}: ${avgRating}⭐ (${totalReviews} reviews)`);
  });

  console.log('✅ All product ratings populated');
}

=== Other window.innerWidth Usage ===
330:    canvas.width = window.innerWidth;
1143:  if (window.innerWidth >= 768) {
1280:  canvas.width = window.innerWidth;
1357:  if (window.innerWidth >= 768) return; // Mobile only
5991:    this.canvas.width = window.innerWidth;
6031:    this.canvas.width = window.innerWidth;
6631:      if (window.innerWidth <= 768) {

=== EXTRACTION 2: Shipping Message Locations ===
{% assign tier1_savings_cents = 3000 %}
{% assign tier2_savings_cents = 6000 %}
{% assign tier3_savings_cents = 10500 %}
{% assign shipping_value_cents = 499 %}
{% assign cable_value_cents = 1895 %}
{% assign tier_price_diff_cents = 1500 %}
{% assign tier_price_diff_max_cents = 2000 %}
--
              </div>
              <div class="tier-feature included premium">
                <span class="feature-icon">✨</span>
                <span class="feature-text">FREE Premium Shipping<br><span class="feature-value">(<span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span> value)</span></span>
              </div>
              <div class="tier-feature excluded">
                <span class="feature-icon">❌</span>
--
              </div>
              <div class="tier-feature included premium">
                <span class="feature-icon">✨</span>
                <span class="feature-text">FREE Premium Shipping<br><span class="feature-value">(<span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span> value)</span></span>
              </div>
              <div class="tier-feature included premium">
                <span class="feature-icon">🎁</span>
--
                <div class="milestone-marker">
                  <span class="milestone-icon">🚚</span>
                </div>
                <span class="milestone-label">+5% OFF<br>+ SHIP</span>
              </div>

              {%- comment -%} Tier 3 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
--
                <span class="tooltip-label" id="tooltip-tier-label">Tier Discount:</span>
                <span class="tooltip-value" id="tooltip-tier">€0.00</span>
              </div>
              <div class="tooltip-item" id="tooltip-shipping-item" style="display: none;">
                <span class="tooltip-label">FREE Shipping:</span>
                <span class="tooltip-value"><span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span></span>
              </div>
              <div class="tooltip-item" id="tooltip-cable-item" style="display: none;">
                <span class="tooltip-label">FREE Cable:</span>
--
            </tr>
            <tr class="highlight-row">
              <td class="feature-name">Premium Shipping</td>
              <td class="feature-val empty"><span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span></td>
              <td class="feature-val good">✅ FREE<br><span class="val-note">(<span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span> value)</span></td>
              <td class="feature-val best">✅ FREE<br><span class="val-note">(<span class="bogo-currency" data-amount="{{ shipping_value_cents }}">€4.99</span> value)</span></td>
            </tr>
            <tr class="highlight-row">
5287:  .milestone-label {
5303:  .bogo-milestone.active .milestone-label {
5348:    .milestone-label {
5397:    .milestone-label {

=== EXTRACTION 3: Headline Location ===
  <div class="bogo-sticky-cart" style="display: none;">
    <div class="bogo-sticky-cart__inner">

      {%- comment -%} Left: Status Message {%- endcomment -%}
      <div class="bogo-sticky-cart__left">
        <div class="bogo-sticky-cart__title">🎁 BOGO Builder</div>
        <div class="bogo-sticky-cart__status" id="sticky-cart-status">
          Select 2 products to start
        </div>
      </div>

--
    </div>
</div>

{% schema %}
{
  "name": "BOGO Builder 2024",
  "settings": [
    {
      "type": "checkbox",
      "label": "Activate Popups",
      "id": "use_popup",
--
      ]
    }
  ],
  "presets": [
    {
      "name": "BOGO Builder 2024"
    }
  ]
}
{% endschema %}
46:      <h1 class="hero-headline hero-headline--main">
48:      </h1>
62:      <h2 class="hero-headline-secondary">
