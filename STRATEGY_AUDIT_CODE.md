# BOGO BUILDER - STRATEGY & CONVERSION AUDIT CODE EXTRACTION
**Date:** 2024-11-15
**Branch:** bf-2025 (LIVE PRODUCTION)
**Purpose:** Conversion Rate & Revenue Optimization Analysis

---

## FILE 1: BOGO LOGIC & PRICING
**Source:** assets/bogo-builder.js

### Tier Discount System

### getTierDiscount Function
function getTierDiscount(pairCount) {
  if (pairCount >= 3) return 10;
  if (pairCount >= 2) return 5;
  return 0;
}

### getTierForCount Function
function getTierForCount(pairCount) {
  if (pairCount >= 3) return 3;
  if (pairCount >= 2) return 2;
  return 1;
}

### calculateTotals Function

### completePair Function
function completePair() {
  const state = window.bogoState;
  const pair = state.currentPair;

  console.log('🎉 Completing pair:', pair);

  // ✅ CHECK TIER BEFORE COMPLETION
  const previousTier = getTierForCount(state.pairs.length);

  // Determine which is free (cheaper)
  const cheaper = pair.slot1.price <= pair.slot2.price ? pair.slot1 : pair.slot2;
  const moreExpensive = pair.slot1.price > pair.slot2.price ? pair.slot1 : pair.slot2;

  // ✅ FIX: Save pair with PRICE-ORDERED products (expensive left, cheap right for FREE display)
  state.pairs.push({
    slot1: moreExpensive,  // ✅ More expensive on LEFT (pays)
    slot2: cheaper,        // ✅ Cheaper on RIGHT (FREE)
    product1: moreExpensive,  // Keep for backwards compatibility
    product2: cheaper,        // Keep for backwards compatibility
    savings: cheaper.price,
    pairNumber: state.activePairNumber
  });

  // ⚡ ELECTRIC CELEBRATION SEQUENCE
  celebratePairCompletion(pair.slot1.element, pair.slot2.element, state.activePairNumber);

  // Calculate tier discount
  const tierDiscount = getTierDiscount(state.pairs.length);
  const nextTierDiscount = getTierDiscount(state.pairs.length + 1);

  // Show tier message
  let tierMessage = `🎉 Pair ${state.activePairNumber} Complete! ${cheaper.title} is FREE!`;
  if (nextTierDiscount > tierDiscount) {
    tierMessage += ` Add another pair and save ${nextTierDiscount}% on entire order!`;
  }

  showNotification(tierMessage, 'success');

  // ✅ CHECK IF TIER UNLOCKED - TRIGGER CELEBRATION
  const newTier = getTierForCount(state.pairs.length);
  if (newTier > previousTier && newTier >= 2) {
    console.log(`🎯 Tier ${newTier} unlocked!`);
    setTimeout(() => {
      if (window.tierCelebrations) {
        window.tierCelebrations.celebrate(newTier);
      }
    }, 800);
  }

  // Reset for next pair
  state.currentPair = { slot1: null, slot2: null };
  state.activePairNumber++;

  // ✅ Save state after completing pair
  saveBOGOState();

  // Update UI
  updateStickyCart();
}

### addProductToPair Function
function addProductToPair(productData) {
  console.log('📦 Adding product to pair:', productData);

  // ✅ CRITICAL FIX: Multi-priority image fallback system
  if (!productData.image || productData.image.includes('lightning') || productData.image === '') {
    console.warn('⚠️ Image missing or invalid, retrieving from element');

    // PRIORITY 1: Get from product card element (original image)
    if (productData.element) {
      const mainImage = productData.element.querySelector('.section-collections-with-nav__product-image img');
      if (mainImage) {
        productData.image = mainImage.src.split('?')[0]; // Clean URL
        console.log('✅ Image retrieved from card element:', productData.image);
      }
    }

    // PRIORITY 2: Get from modal if card fails
    if (!productData.image || productData.image === '') {
      const modal = document.querySelector('.buy-now-popup');
      if (modal) {
        const modalImage = modal.querySelector('figure img');
        if (modalImage) {
          productData.image = modalImage.src.split('?')[0];
          console.log('✅ Image retrieved from modal:', productData.image);
        }
      }
    }

    // PRIORITY 3: Get from data attribute if both fail
    if (!productData.image || productData.image === '') {
      if (productData.element && productData.element.dataset.image) {
        productData.image = productData.element.dataset.image.split('?')[0];
        console.log('✅ Image retrieved from data attribute:', productData.image);
      }
    }

    // FALLBACK: Use placeholder if all attempts fail
    if (!productData.image || productData.image === '') {
      console.error('❌ No image found for product, using placeholder');
      productData.image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd"/%3E%3C/svg%3E';
    }
  } else {
    console.log('✅ Valid image provided:', productData.image);
  }

  const state = window.bogoState;

  // Determine which slot to fill
  if (!state.currentPair.slot1) {
    // Fill first slot
    state.currentPair.slot1 = productData;
    highlightProduct(productData.element, 1, state.activePairNumber);
    showNotification(`${productData.title} added to Pair ${state.activePairNumber} (Slot 1) ✓`);

    // ✅ FIX: Save state immediately after slot1 fill (BOGO-SURGICAL-FIX-COMBINED-001)
    saveBOGOState();

    updateStickyCart();
  } else if (!state.currentPair.slot2) {
    // Fill second slot
    state.currentPair.slot2 = productData;
    highlightProduct(productData.element, 2, state.activePairNumber);

    // Pair complete - lock it in
    completePair();
  } else {
    // Pair full - notify user
    showNotification('⚠️ Pair full! Lock in your pair to start a new one.', 'warning');
  }
}

### proceedToCheckout Function

### Tier Messages & Incentives
  const moreExpensive = pair.slot1.price > pair.slot2.price ? pair.slot1 : pair.slot2;

  // ✅ FIX: Save pair with PRICE-ORDERED products (expensive left, cheap right for FREE display)
  state.pairs.push({
    slot1: moreExpensive,  // ✅ More expensive on LEFT (pays)
    slot2: cheaper,        // ✅ Cheaper on RIGHT (FREE)
    product1: moreExpensive,  // Keep for backwards compatibility
    product2: cheaper,        // Keep for backwards compatibility
    savings: cheaper.price,
    pairNumber: state.activePairNumber
  });
--
  celebratePairCompletion(pair.slot1.element, pair.slot2.element, state.activePairNumber);

  // Calculate tier discount
  const tierDiscount = getTierDiscount(state.pairs.length);
  const nextTierDiscount = getTierDiscount(state.pairs.length + 1);

  // Show tier message
  let tierMessage = `🎉 Pair ${state.activePairNumber} Complete! ${cheaper.title} is FREE!`;
  if (nextTierDiscount > tierDiscount) {
    tierMessage += ` Add another pair and save ${nextTierDiscount}% on entire order!`;
  }

  showNotification(tierMessage, 'success');

  // ✅ CHECK IF TIER UNLOCKED - TRIGGER CELEBRATION
  const newTier = getTierForCount(state.pairs.length);
  if (newTier > previousTier && newTier >= 2) {
    console.log(`🎯 Tier ${newTier} unlocked!`);
--
    });

    // Tier discount
    const discountedSubtotal = orderSubtotal - bogoSavings;
    if (currentTier === 3) {
      tierDiscount = discountedSubtotal * 0.10;
    } else if (currentTier === 2) {
      tierDiscount = discountedSubtotal * 0.05;
    }
  }

  // Update tooltip elements
  const formatMoney = (amount) => BOGOCurrency.formatMoney(Math.round(amount * 100));
--
  }

  // Tier discount (show only if applicable)
  const tierItem = document.getElementById('tooltip-tier-item');
  if (tierDiscount > 0) {
    const tierLabel = document.getElementById('tooltip-tier-label');
    tierLabel.textContent = currentTier === 3 ? 'Tier 3 (10%):' : 'Tier 2 (5%):';
    document.getElementById('tooltip-tier').textContent = formatMoney(tierDiscount);
--

  if (pairCount > 0 && state.pairs && state.pairs.length > 0) {
    // 1.1 Calculate BOGO Savings (100% off cheaper item = FREE)
    state.pairs.forEach(pair => {
      // CRITICAL: Use fallbacks for both old and new data
      const item1 = pair.slot1 || pair.product1;
      const item2 = pair.slot2 || pair.product2;

--
      totalRetailCents += price1 + price2;

      // BOGO FREE: 100% off cheaper item (not 50%!)
      const cheaperPrice = Math.min(price1, price2);
      if (cheaperPrice > 0) {
        bogoSavingsCents += cheaperPrice;
        console.log('BOGO savings for this pair:', (cheaperPrice / 100).toFixed(2));
      }
--

    // 1.2 Tier Discounts (on subtotal after BOGO)
    const discountedSubtotalCents = totalRetailCents - bogoSavingsCents;

    if (currentTier === 3) {
      tierDiscountCents = Math.round(discountedSubtotalCents * 0.10);
      totalSavingsCents += tierDiscountCents;
      console.log('Tier 3 Discount (10%):', (tierDiscountCents / 100).toFixed(2));
    } else if (currentTier === 2) {
      tierDiscountCents = Math.round(discountedSubtotalCents * 0.05);
      totalSavingsCents += tierDiscountCents;
      console.log('Tier 2 Discount (5%):', (tierDiscountCents / 100).toFixed(2));
    }

    // 1.3 Value Adds (in cents)
--
  // --- 2. UPDATE STATUS & MESSAGING ---
  const pairCountEl = document.getElementById('v2-pair-count');
  const incentiveMsgEl = document.getElementById('v2-incentive-message'); // Desktop version
  const incentiveMsgElMobile = document.getElementById('v2-incentive-message-mobile'); // Mobile version
  const primaryBtn = document.getElementById('v2-btn-primary');
  const reviewBtn = document.getElementById('v2-btn-review');
  
  // ✅ Helper function to update both desktop AND mobile incentive messages
  const updateIncentiveMessage = (htmlContent) => {
    if (incentiveMsgEl) incentiveMsgEl.innerHTML = htmlContent;
    if (incentiveMsgElMobile) incentiveMsgElMobile.innerHTML = htmlContent;
  };

---

## FILE 2: USER JOURNEY & UX FLOW
**Source:** assets/bogo-builder.js

### State Management

### State Structure
  // Clear localStorage
  localStorage.removeItem(BOGO_STORAGE_KEY);

  // ✅ BOGO-BACK-FIX-002: Also reset in-memory state
  if (window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
  }

  console.log('🗑️ BOGO state cleared (localStorage + memory)');
}

/**
 * Show Toast Notification (BOGO-REVIEW-MODAL-UX-024)
 * @param {string} message - Notification text
 * @param {string} type - 'success' or 'error'
 * @param {number} duration - Display duration in ms (default 3000)
 */
function showBogoToast(message, type = 'success', duration = 3000) {
--
    // Fallback if function doesn't exist
    localStorage.removeItem('titan-bogo-state');
  }

  // Always initialize fresh state (skip restoration logic)
  window.bogoState = {
    pairs: [],
    currentPair: {
      slot1: null,
      slot2: null
    },
    activePairNumber: 1
  };

  console.log('✅ BOGO state initialized (fresh - persistence disabled)');
  console.log('📝 Note: State will NOT persist across page navigations');

  // No validation needed - state is always fresh
})();

// ✅ BOGO-INLINE-VARIANTS-044: Enhanced product click handler
--
  if (!confirmed) return;

  console.log('🗑️ Clearing all pairs...');

  // Reset state
  window.bogoState = {

### Review System Integration
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

### Product Reviews Data Sample
const PRODUCT_REVIEWS = {

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTS 1-7: PREMIUM CABLES & MULTI-CABLES
  // ═══════════════════════════════════════════════════════════════

  // Product 1 & 2: Titan Smart Cable™ PRO + Titan PD Cable™ PRO (SHARED REVIEWS)
  '8467056656562': {
    totalReviews: 12654,
    avgRating: 4.6,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        date: "2025-11-12",
        title: "Finally stopped the replacement cycle",
        content: "I'm an electrician and I was going through cables every 6-8 weeks. Bought this in March. Still perfect. The 90° angle is genius for tight spaces in my van. Charged my phone from 12% to 68% in under 30 minutes yesterday. Worth every penny."
      },
      {
        author: "Sarah W.",
        rating: 5,
        date: "2025-11-09",
        title: "Best purchase for our family",
        content: "We have 3 teenagers. Do the math on how many cables we were buying. This one has survived 4 months of abuse between school bags, car charging, and daily bedroom use. The magnetic wind-up thing actually works - keeps it organized."
      },
      {
        author: "Rob H.",
        rating: 5,
        date: "2025-11-06",
        title: "Strong cable",
        content: "Really strong. Charges fast. Would definitely buy again."
      },
      {
        author: "Daniel K.",
        rating: 5,
        date: "2025-10-31",
        title: "Engineering quality",
        content: "I'm a mechanical engineer so I notice build quality. The stress relief at the 90° connector is properly designed - that's where cheap cables always fail. Military-grade braid isn't marketing BS, you can feel the difference. Using it daily for 5 months, zero degradation."
      },
      {
        author: "Emma L.",
        rating: 5,
        date: "2025-10-28",
        title: "Nurse life saver",
        content: "I work 12-hour shifts and my phone is my lifeline for patient updates. Old cable kept disconnecting in my pocket. This one? Rock solid connection every time. Fast charge during my 30min break gets me from 15% to 85%. Game changer."
      },
      {
        author: "Tom H.",
        rating: 5,
        date: "2025-10-22",
        title: "Good value",
        content: "Bit pricey but I've had it 6 months and it's still like new. Better than buying cheap ones every month."
      },
      {
        author: "Rachel M.",
        rating: 4,
        date: "2025-10-18",
        title: "Kids can't destroy it (somehow)",
        content: "My 9 and 11 year old have destroyed every cable we've owned. This one has survived 3 months of being yanked, bent, dropped, and used as a phone holder while gaming. Minor wear on the braid but connector is pristine. Impressed."
      },
      {
        author: "Dave P.",
        rating: 5,
        date: "2025-10-14",
        title: "Does the job",
        content: "Works great. No complaints. Charges my phone quick and seems tough."
      },
      {
        author: "Andrew S.",
        rating: 5,
        date: "2025-10-07",
        title: "The cable that ended my cable anxiety",
        content: "I used to panic buying a new cable every month wondering if this one would last. Bought 2 of these in April. Both still perfect. One lives in my car (Australian heat hasn't killed it), one at my desk. Fast charging actually works - 50% in about 20 minutes to my iPhone 15. Finally feel like I can trust a cable."
      },
      {
        author: "Linda B.",
        rating: 5,
        date: "2025-09-29",
        title: "Happy with it",
        content: "Great cable. My husband bought it and it's been really reliable. Charges fast."
      }
    ]
  },

  '8467055247538': {
    totalReviews: 12654,
    avgRating: 4.6,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        date: "2025-11-12",
        title: "Finally stopped the replacement cycle",
        content: "I'm an electrician and I was going through cables every 6-8 weeks. Bought this in March. Still perfect. The 90° angle is genius for tight spaces in my van. Charged my phone from 12% to 68% in under 30 minutes yesterday. Worth every penny."
      },
      {
        author: "Sarah W.",
        rating: 5,
        date: "2025-11-09",
        title: "Best purchase for our family",
        content: "We have 3 teenagers. Do the math on how many cables we were buying. This one has survived 4 months of abuse between school bags, car charging, and daily bedroom use. The magnetic wind-up thing actually works - keeps it organized."
      },
      {
        author: "Rob H.",
        rating: 5,
        date: "2025-11-06",
        title: "Strong cable",
        content: "Really strong. Charges fast. Would definitely buy again."
      },
      {
        author: "Daniel K.",
        rating: 5,
        date: "2025-10-31",
        title: "Engineering quality",

### Progress Bar Update

---

## FILE 3: VISUAL ELEMENTS & MESSAGING
**Source:** sections/bogo-builder-2024.liquid

### Product Grid Structure
    </div>

  {%- comment -%} ✅ BOGO-SOCIAL-PROOF-050: Live Activity Indicator {%- endcomment -%}
  <div class="live-activity-indicator">
    <span class="activity-pulse"></span>
    <span class="activity-icon">🔥</span>
    <span class="activity-text">
      <span class="activity-number" id="live-users">23</span>
      people building bundles now
    </span>
  </div>

  {%- comment -%} ✅ BOGO-SOCIAL-PROOF-050: Social Proof Notifications Container {%- endcomment -%}
  <div id="social-proof-notifications"></div>

  {%- comment -%} Product Filter Dropdown {%- endcomment -%}
  <div class="filter-container">
    <div class="filter-wrapper">
      <label for="category-filter" class="filter-label">
        <span class="stock-badge-circle" style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px;position:initial;">
          <span class="stock-number">⚠️</span>
        </span>
        <span>Limited stock available for this offer</span>
      </label>
      <select id="category-filter" class="filter-select">
        <option value="all">All Products</option>
        {% for collection in section.settings.collections %}
          {% assign collection_obj = collections[collection.handle] %}
          <option value="{{ collection_obj.handle }}">{{ collection_obj.title }}</option>
        {% endfor %}
      </select>
    </div>
  </div>

  {%- comment -%} Unified Product Grid {%- endcomment -%}
  <div class="section-collections-with-nav__wrapper">
    <div class="products">
      {% for collection in section.settings.collections %}
        {% assign collection_obj = collections[collection.handle] %}
        {% for product in collection_obj.products %}
          {% assign product_description = product.metafields.custom.product_description | metafield_tag %}
          {% assign upsell_product_one = product.metafields.custom.first_upsell_product %}
          {% assign upsell_product_two = product.metafields.custom.second_upsell_product %}

          <article class="section-collections-with-nav__product product-card relative"
                   data-product-id="{{ product.id }}"
                   data-variant-id="{{ product.selected_or_first_available_variant.id }}"
                   data-has-variants="{{ product.variants.size | minus: 1 }}"
                   data-price="{{ product.price }}"
                   data-category="{{ collection_obj.handle }}"
                   data-product-handle="{{ product.handle }}"
                   data-product-title="{{ product.title | escape }}"
                   onclick="handleProductClick(event, this)">

            {%- comment -%} ✅ BOGO-INLINE-VARIANTS-044: STATE 1 - Default Display {%- endcomment -%}
            <div class="card-default-state active">
              {%- comment -%} Discount Badge - COMPACT {%- endcomment -%}
              {% if product.metafields.custom.new_shop_discount_top and section.settings.show_alt_images == true %}
                <div class="absolute left-[0px] top-[0px] z-10">
                  <div class="discount_message">
                    {{ product.metafields.custom.new_shop_discount_top }}
                  </div>
                </div>
              {% else %}
                {% if product.metafields.custom.new_shop_discount %}
                  <div class="absolute left-[0px] top-[0px] z-10">
                    <div class="discount_message">
                      {{ product.metafields.custom.new_shop_discount }}
                    </div>
                  </div>
                {% endif %}
              {% endif %}

              {%- comment -%} Product Info Icon (opens modal) {%- endcomment -%}
              <div class="product-info-icon product-info-btn" data-product-id="{{ product.id }}" data-action="info" onclick="openProductInfoModal(event, this)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#60c655" stroke-width="2"/>
                  <text x="12" y="17" text-anchor="middle" fill="#60c655" font-size="14" font-weight="700">i</text>
                </svg>
              </div>

              <div class="product-image-container">
                <figure class="section-collections-with-nav__product-image">
                  {% if product.metafields.custom.top_new_shop_image and section.settings.show_alt_images == true %}
                    <img src="{{ product.metafields.custom.top_new_shop_image | image_url: width: 400 }}" width="360" height="auto" class="product-image object-cover" loading="lazy">
                  {% else %}
                    {% if product.metafields.custom.new_shop_image %}
                      <img src="{{ product.metafields.custom.new_shop_image | image_url: width: 400 }}" width="360" height="auto" class="product-image object-cover" loading="lazy">
                    {% else %}
                      {{ product.featured_image | image_url: width: 400 | image_tag: height: 360, loading: 'lazy', class: 'product-image object-cover' }}
                    {% endif %}
                  {% endif %}
                </figure>
              </div>

              <div class="product-details section-collections-with-nav__product-details">
                <div class="top-part">
                  <h4 class="product-title section-collections-with-nav__product-title">{{ product.title }}</h4>

                  {%- comment -%} ⭐ Star Ratings Display (SH-STAR-RATINGS-GRID-001) {%- endcomment -%}
                  <div class="product-rating-display"
                       data-product-id="{{ product.id }}"
                       onclick="openReviewsModal(event, this)"
                       role="button"
                       tabindex="0"
                       aria-label="View product reviews">
                    <div class="rating-stars" aria-hidden="true">
                      <span class="stars-empty">★★★★★</span>
                      <span class="stars-filled" style="width: 0%">★★★★★</span>
                    </div>
                    <span class="rating-count">Loading...</span>
                  </div>

                  {%- comment -%} BOGO "Get 1 FREE" Message {%- endcomment -%}
                  <div class="product-bogo-message product-bogo-badge">
                    → Get 1 FREE
                  </div>

                  <div class="section-collections-with-nav__product-prices product-price flex items-center flex-wrap text-center justify-center">
                    <div class="prices">
                      <span class="section-collections-with-nav__product-price">{{ product.price | money }}</span>
                      {% if product.compare_at_price  %}
                          <span class="section-collections-with-nav__product-price-compared ml-2">{{ product.compare_at_price | money }}</span>
                      {% endif %}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {%- comment -%} ✅ BOGO-INLINE-VARIANTS-044: STATE 2 - Variant Selection {%- endcomment -%}
            <div class="card-variant-state">
              <div class="variant-header">
                <h4>Pick Variants</h4>
                <button class="variant-close-btn" type="button" aria-label="Close variant selection">✕</button>
              </div>

              <div class="variant-selectors-inline">
                {%- comment -%} Populated dynamically by JavaScript {%- endcomment -%}
              </div>

              <button class="btn-add-variant" type="button" disabled>
                + Add to Pair
              </button>
            </div>

            {%- comment -%} Pair Badge Container {%- endcomment -%}
            <div class="pair-badge-container"></div>

            {%- comment -%} Modal Popup Data {%- endcomment -%}
            {% if product.metafields.custom.new_shop_discount_top %}
              {% assign badge_text = product.metafields.custom.new_shop_discount_top %}
            {% else %}
              {% assign badge_text = product.metafields.custom.new_shop_discount %}
            {% endif %}

            {% if section.settings.use_popup %}
              {% render 'buy-now-popup-bogof'
                product_image: product.featured_image,
                price: product.price,
                compare_at_price: product.compare_at_price,
                title: product.title,
                description: product_description,
                upsell_product_one: upsell_product_one,
                upsell_product_two: upsell_product_two,
                product_id: product.selected_or_first_available_variant.id,
                quantity: '1',
                product: product,
                badge_text: badge_text,
                grid_1: section.settings.add_4,
                grid_2: section.settings.add_6,
                grid_3: section.settings.add_10,
                grid_1_text: section.settings.add_4_text,
                grid_2_text: section.settings.add_6_text,
                grid_3_text: section.settings.add_10_text
              %}
            {% endif %}
          </article>

          <script>
            // ✅ BOGO-INLINE-VARIANTS-059: Store variant data
            window.productVariants = window.productVariants || {};
            window.productVariants[{{ product.id }}] = [
              {% for variant in product.variants %}
                {% if variant.metafields.custom.popup_image %}
                  {% assign images = variant.metafields.custom.popup_image | img_url: 'master' %}
                {% else %}
                  {% assign images = variant.image.src | img_url: 'master' %}
                {% endif %}
              {
                id: '{{ variant.id }}',
                title: '{{ variant.title | escape }}',
                options: [
                  {% for option in variant.options %}
                  '{{ option | escape }}'{% unless forloop.last %}, {% endunless %}
                  {% endfor %}
                ],
                option1: '{{ variant.option1 | escape }}',
                option2: '{{ variant.option2 | escape }}',
                option3: '{{ variant.option3 | escape }}',
                image: '{{ images }}',

### Sticky Cart HTML

  {%- comment -%} ========================================
      PREMIUM STICKY CART - ENHANCED REDESIGN
      ======================================== {%- endcomment -%}
  {%- comment -%} Sticky Cart - Simple Working Version (Stays outside wrapper) {%- endcomment -%}
  <div class="bogo-sticky-cart" style="display: none;">
    <div class="bogo-sticky-cart__inner">

      {%- comment -%} Left: Status Message {%- endcomment -%}
      <div class="bogo-sticky-cart__left">
        <div class="bogo-sticky-cart__title">🎁 BOGO Builder</div>
        <div class="bogo-sticky-cart__status" id="sticky-cart-status">
          Select 2 products to start
        </div>
      </div>

      {%- comment -%} Center: Pair Count + Progress Bar {%- endcomment -%}
      <div class="bogo-sticky-cart__center">
        <div class="bogo-sticky-cart__pairs" id="sticky-cart-pair-count">
          0 Pairs
        </div>

{%- comment -%} Enhanced Progress Bar (BOGO-PROGRESS-008) {%- endcomment -%}
        <div class="bogo-progress-container">
          <div class="bogo-progress-next-reward" id="progress-next-reward">
            <span class="reward-icon">🎁</span>
            <span class="reward-text">Add 1 pair for 5% OFF + Shipping</span>
          </div>

          <div class="bogo-progress-bar-enhanced">
            <div class="bogo-progress-track">
              <div class="bogo-progress-fill" id="bogo-progress-fill"></div>
            </div>

            <div class="bogo-progress-milestones">
              {%- comment -%} Tier 1 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
              <div class="bogo-milestone" data-tier="1">
                <div class="milestone-marker">
                  <span class="milestone-icon">1️⃣</span>
                </div>
                <span class="milestone-label">BOGO<br>Get FREE</span>
              </div>

              {%- comment -%} Tier 2 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
              <div class="bogo-milestone" data-tier="2">
                <div class="milestone-marker">
                  <span class="milestone-icon">🚚</span>
                </div>
                <span class="milestone-label">+5% OFF<br>+ SHIP</span>
--
          </div>
        </div>
      </div>

      {%- comment -%} Right: Savings & Buttons {%- endcomment -%}
      <div class="bogo-sticky-cart__right">
        <div class="bogo-sticky-cart__savings">
          <span class="bogo-sticky-cart__savings-label">SAVED:</span>
          <span class="bogo-sticky-cart__savings-amount" id="sticky-cart-savings">€0.00</span>
        </div>
        <div class="bogo-sticky-cart__actions">
          <button id="sticky-cart-review" class="bogo-sticky-cart__btn bogo-sticky-cart__btn--review" style="display: none;">
            Review
          </button>
          <button id="sticky-cart-checkout" class="bogo-sticky-cart__btn bogo-sticky-cart__btn--checkout" style="display: none;">
            Checkout
          </button>
        </div>
      </div>

    </div>
  </div>

  {%- comment -%} ========================================
      STICKY CART V2 - CRO OPTIMIZED (BOGO-V2-FOUNDATION)
      Structure + Calculations + Segmented Progress
      ======================================== {%- endcomment -%}
  <div class="bogo-sticky-cart-v2" id="bogo-sticky-cart-v2" style="display: none;">
    <div class="sticky-cart-container">

      {%- comment -%} 1. LEFT: Status & Pair Count {%- endcomment -%}
      <div class="sticky-cart-status">
        <div class="status-pair-count" id="v2-pair-count">Start Building</div>
      </div>
      <div class="progress-incentive progress-incentive-mobile" id="v2-incentive-message-mobile">
        Select 2 items to activate Buy 1 Get 1 FREE!
      </div>
      {%- comment -%} 2. CENTER: Progress & Incentive Message {%- endcomment -%}
      <div class="sticky-cart-progress">
        {%- comment -%} Mobile: Incentive message ABOVE progress bar {%- endcomment -%}
        

        {%- comment -%} Desktop: Incentive message INSIDE progress {%- endcomment -%}
        <div class="progress-incentive progress-incentive-desktop" id="v2-incentive-message">
          Select 2 items to activate Buy 1 Get 1 FREE!
        </div>

        {%- comment -%} Segmented 3-step progress bar {%- endcomment -%}
        <div class="progress-bar-segmented">
          <div class="progress-segment" data-tier="1">

---

## CURRENT PERFORMANCE DATA

### Conversion Metrics (Need to Track):
- Visit to Add Rate: ?%
- Add to Pair Complete Rate: ?%
- Pair Complete to Checkout Rate: ?%
- Checkout to Purchase Rate: ?%
- Overall Conversion Rate: ?%

### Revenue Metrics:
- Average Order Value (AOV): $X
- Revenue Per Visit: $X
- Average Pairs Per Order: X
- Tier 2 Unlock Rate: X%
- Tier 3 Unlock Rate: X%

### User Behavior Patterns:
- Most users build: X pairs
- Drop-off point: After X products added
- Most popular products: [List]
- Average time on page: X minutes

---

## CURRENT STRATEGY IMPLEMENTATION

### Tier Structure:
- **Tier 1** (1 pair): Second product FREE
- **Tier 2** (2 pairs): Second product FREE + 5% off entire order
- **Tier 3** (3+ pairs): Second product FREE + 10% off entire order

### Value Proposition:
- "Buy One Get One FREE"
- Tiered discounts incentivize buying more pairs
- Clear savings messaging
- Premium product quality

### Trust Signals:
- Star ratings on product cards (NEW)
- 270 reviews across 27 products
- Average rating: 4.3-4.7 stars
- Social proof visible before selection

### User Journey:
1. Land on BOGO page
2. Browse 27 products with star ratings
3. Click product → Opens modal with reviews
4. Add product to pair (Slot 1)
5. Add second product (Slot 2)
6. Celebration animation → Tier progress updates
7. Repeat for more pairs (unlock higher tiers)
8. Click "Checkout" → Proceed to cart

---

## KNOWN ISSUES & QUESTIONS

### Current Concerns:
1. Are users understanding the tier system?
2. Is the value proposition clear enough?
3. Are celebrations helping or distracting?
4. Should we show more urgency messaging?
5. Is the checkout flow smooth?
6. Are we optimizing for AOV or conversion rate?

### Friction Points:
- Users must complete pairs (can't checkout with incomplete)
- Limited to 27 products (all visible, no search)
- No product filtering/sorting
- State resets on page navigation (by design, but is it right?)

---

## COMPETITIVE CONTEXT

### Industry:
- Mobile charging accessories
- Average AOV in category: $30-$50
- Black Friday typical discount: 20-30%

### Our Offer:
- BOGO (50% discount on pair)
- + 5-10% additional tier discount
- Effective discount: 55-60% at Tier 3

### Positioning:
- Premium quality products
- Strong review social proof
- Tiered incentive to buy more
- Black Friday exclusive offer

---

