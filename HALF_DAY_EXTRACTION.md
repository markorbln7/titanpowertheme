=== EXTRACTION 4: localStorage Write Locations ===

function saveBOGOState() {
  try {
    const stateToSave = {
      pairs: window.bogoState.pairs || [],
      currentPair: window.bogoState.currentPair || {},
      activePairNumber: window.bogoState.activePairNumber || 1,  // ✅ FIX: Save pair number (BOGO-SURGICAL-FIX-COMBINED-001)
      timestamp: Date.now()
    };
    localStorage.setItem(BOGO_STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('💾 BOGO state saved to localStorage');
  } catch (error) {
    console.warn('Failed to save BOGO state:', error);
  }
}

=== All saveBOGOState() Calls ===
193:function saveBOGOState() {
886:    saveBOGOState();
1002:    saveBOGOState();
1063:  saveBOGOState();
1828:    saveBOGOState();
2790:    saveBOGOState();

=== updateStickyCart Context ===
    if (currentTier >= 2) {
      tooltipTierItem.style.display = 'block';
      tooltipTier.textContent = formatMoney(tierDiscountCents);
      tooltipTierLabel.textContent = currentTier === 3 ? 'Tier 3 Bonus (10%):' : 'Tier 2 Bonus (5%):';
    } else {
      tooltipTierItem.style.display = 'none';
    }

    if (tooltipShippingItem) tooltipShippingItem.style.display = currentTier >= 2 ? 'block' : 'none';
    if (tooltipCableItem) tooltipCableItem.style.display = currentTier >= 3 ? 'block' : 'none';

    tooltipTotal.textContent = formatMoney(totalSavingsCents);

    console.log('✅ Tooltip updated:', formatMoney(totalSavingsCents));
  }

  console.log('=== STICKY CART V2 UPDATE COMPLETE ===\n');

  // --- 5. UPDATE PREVIOUS STATE ---
  window.bogoCartPrevState = {
    pairCount: pairCount,
    currentTier: currentTier,
    totalSavings: totalSavingsCents
  };

  // --- 6. SAVE STATE TO LOCALSTORAGE ---
  if (typeof saveBOGOState === 'function') {
    saveBOGOState();
  }
}

=== EXTRACTION 5: Touch Target Elements ===

              {%- comment -%} Product Info Icon (opens modal) {%- endcomment -%}
              <div class="product-info-icon product-info-btn" data-product-id="{{ product.id }}" data-action="info" onclick="openProductInfoModal(event, this)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#60c655" stroke-width="2"/>
                  <text x="12" y="17" text-anchor="middle" fill="#60c655" font-size="14" font-weight="700">i</text>
                </svg>
              </div>

=== Touch Target CSS ===
  }

  /* Info button (product-info-icon already styled above) */
  .product-info-btn {
    z-index: 100; /* ✅ Ensure it's above card click area */
  }

  /* ========================================
     VARIANT STATE STYLING
     ======================================== */

--

  {%- comment -%} Product Info Icon - 30px to match stock badge (BOGO-PRODUCT-CARD-ICONS-015) {%- endcomment -%}
  .product-info-icon {
    position: absolute;
    top: 8px; /* ✅ Matches stock badge */
    right: 8px; /* ✅ Symmetrical positioning */
    width: 30px; /* ✅ 15% smaller: 30px to match stock badge */
    height: 30px; /* ✅ 15% smaller: 30px to match stock badge */
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(96, 198, 85, 0.6);
    border-radius: 50%;
--
  }

  .product-info-icon:hover {
    background: rgba(96, 198, 85, 0.3);
    border-color: rgba(96, 198, 85, 1.0);
    transform: scale(1.05); /* ✅ Reduced hover scale to match stock badge */
  }

  .product-info-icon svg {
    width: 15px; /* ✅ Proportionally smaller to fit 30px container */
    height: 15px;
  }

  @keyframes pulse-info {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(96, 198, 85, 0.4);
    }
--
  /* Mobile - 27px to match stock badge (BOGO-PRODUCT-CARD-ICONS-015) */
  @media (max-width: 768px) {
    .product-info-icon {
      width: 27px;
      height: 27px;
      margin-right: -10px;
      margin-top: -10px;
    }
  .btn-sticky-secondary {
    min-height: 44px; /* Slightly smaller in landscape */
    font-size: 14px;
  }
}

/* ========================================

=== EXTRACTION 6: Product Card Structure ===
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

=== Existing Badge Styles ===
  }

  /* Premium badge at top */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 32px;
    background: linear-gradient(135deg, #60c655 0%, #50b645 100%);
--
    box-shadow: 0 8px 40px rgba(96, 198, 85, 0.6); /* Static max glow */
    z-index: -1;
    animation: badgeGlow-opacity 2000ms ease-in-out infinite;
    pointer-events: none;
    will-change: opacity;
  }

  @keyframes badgeGlow-opacity {
    0%, 100% {
      opacity: 0.67; /* 0.4/0.6 = 0.67 to match original min intensity */
    }
    50% {
      opacity: 1; /* Full max glow */
--
  }

  .bf-badge {
    max-width: 400px;
    width: 100%;
    height: auto;
    margin: 0 auto 0px;
    display: block;
--
  }

  .countdown-label {
    font-size: 11px; /* ✅ Reduced from 12px */
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
