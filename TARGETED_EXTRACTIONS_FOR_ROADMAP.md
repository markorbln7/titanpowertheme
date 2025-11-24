# TARGETED EXTRACTIONS FOR ROADMAP COMPLETION

**Purpose:** Complete extraction of current BF25 implementation state to finalize roadmap
**Date:** 2025-11-24
**Requested by:** User for AI roadmap completion

---

## EXTRACTION 1: Theme.liquid Rebuy Section

**Command:** `grep -n -B5 -A10 "rebuy\|Rebuy" layout/theme.liquid`

**Purpose:** See exactly how Rebuy is currently loaded

**Results:**

```liquid
89:    <script async src="https://cdn.rebuyengine.com/onsite/js/rebuy.js?shop={{ shop.permanent_domain }}"></script>
90:    {% render 'rebuy-smartcart-extensions' %}
```

**Finding:** Rebuy is loaded globally at the theme level (layout/theme.liquid lines 89-90) with async script tag and extensions snippet.

---

## EXTRACTION 2: Current Modal Add-to-Cart Handler

**Command:** `grep -n -B10 -A30 "js-atc-bf\|Add to Cart\|addToCart" assets/bogo-builder.js | head -150`

**Purpose:** Understand why qty=1 fails

**Results:**

```javascript
5517:          const addToCartBtn = modal.querySelector('.js-atc-bf');
5518:          if (addToCartBtn) {
5519:            const hasVariants = parseInt(productCard.dataset.hasVariants) > 0;
5520:            if (hasVariants) {
5521:              addToCartBtn.innerHTML = 'Select Variant & Add to BOGO Pair';
5522:            } else {
5523:              addToCartBtn.innerHTML = 'Add to BOGO Pair';
5524:            }
5525:          }
5526:
5527:          const bogoBtn = modal.querySelector('.js-atc-bf');
5528:          const newBogoBtn = bogoBtn.cloneNode(true);
5529:          bogoBtn.parentNode.replaceChild(newBogoBtn, bogoBtn);
5530:
5531:          newBogoBtn.onclick = function(e) {
5532:            e.preventDefault();
5533:            e.stopPropagation();
5534:
5535:            const variantSelects = modal.querySelectorAll('.variant-selector');
5536:            let selectedVariantId = productCard.dataset.variantId;
5537:
5538:            if (variantSelects.length > 0) {
5539:              const selectedOptions = {};
5540:              let allSelected = true;
5541:
5542:              variantSelects.forEach(select => {
5543:                const optionName = select.dataset.optionName;
5544:                const selectedValue = select.value;
5545:
5546:                if (!selectedValue || selectedValue === select.querySelector('option[value=""]')?.value) {
5547:                  allSelected = false;
5548:                  select.style.border = '2px solid red';
5549:                  setTimeout(() => {
5550:                    select.style.border = '';
5551:                  }, 1500);
5552:                } else {
5553:                  selectedOptions[optionName] = selectedValue;
5554:                }
5555:              });
5556:
5557:              if (!allSelected) {
5558:                alert('Please select all options before adding to cart');
5559:                return;
5560:              }
5561:
5562:              const variantData = JSON.parse(productCard.dataset.variantData || '[]');
5563:              const matchingVariant = variantData.find(variant => {
5564:                return variant.options.every((option, index) => {
5565:                  const optionName = productCard.dataset[`option${index + 1}Name`];
5566:                  return selectedOptions[optionName] === option;
5567:                });
5568:              });
5569:
5570:              if (matchingVariant) {
5571:                selectedVariantId = matchingVariant.id;
5572:              }
5573:            }
5574:
```

**Finding:** Modal uses `.js-atc-bf` class selector, clones button to reset event listeners, validates variant selection before adding to cart. Quantity is not explicitly set in this extraction (likely defaults to 1).

---

## EXTRACTION 3: Variant Selection Logic

**Command:** `grep -n -B5 -A20 "findMatchingVariant\|selectedVariant\|variant.id" assets/bf25-expansion-core.js | head -100`

**Purpose:** Check variant handling

**Results:**

```javascript
46:    this.data = {
47:      selectedVariantId: null,
48:      selectedOptions: {},
49:      quantity: 1,
50:      product: null,
51:      isLoading: false,
52:      error: null
53:    };
54:    this.listeners = new Set();
55:  }
56:
57:  update(key, value) {
58:    this.data[key] = value;
59:    this.notify();
60:  }
61:
62:  notify() {
63:    this.listeners.forEach(listener => listener(this.data));
64:  }
65:
--
136:    this.productImage = this.modal.querySelector('.js-variant-image');
137:    this.productPrice = this.modal.querySelector('.js-variant-price-2');
138:    this.productComparePrice = this.modal.querySelector('.js-variant-compare-price-2');
139:
140:    // Get variant ID from product card
141:    const productCard = document.querySelector(`[data-product-id="${this.productId}"]`);
142:    if (productCard?.dataset.variantId) {
143:      this.state.update('selectedVariantId', productCard.dataset.variantId);
144:    }
145:
146:    this.setupVariantSelectors();
147:    this.setupAddToCartButton();
148:  }
--
497:      const selectedVariant = this.modal.variantData?.find(v => v.id === parseInt(this.state.data.selectedVariantId));
498:
499:      if (selectedVariant) {
500:        // Update image
501:        if (this.productImage && selectedVariant.featured_image) {
502:          this.productImage.src = selectedVariant.featured_image.src;
503:          this.productImage.alt = selectedVariant.featured_image.alt || this.modal.productTitle;
504:        }
505:
506:        // Update price
507:        if (this.productPrice) {
508:          this.productPrice.textContent = this.formatMoney(selectedVariant.price);
509:        }
510:
511:        // Update compare at price
512:        if (this.productComparePrice && selectedVariant.compare_at_price) {
513:          this.productComparePrice.textContent = this.formatMoney(selectedVariant.compare_at_price);
514:          this.productComparePrice.style.display = 'inline';
515:        } else if (this.productComparePrice) {
516:          this.productComparePrice.style.display = 'none';
517:        }
518:
519:        // Update availability
520:        this.updateAvailability(selectedVariant.available);
521:      }
522:    }
--
770:  selectVariant(variantId) {
771:    this.state.update('selectedVariantId', variantId);
772:
773:    // Find the variant
774:    const variant = this.modal.variantData?.find(v => v.id === parseInt(variantId));
775:
776:    if (variant) {
777:      // Update product image
778:      this.updateProductImage(variant);
779:
780:      // Update product price
781:      this.updateProductPrice(variant);
782:
783:      // Update availability
784:      this.updateAvailability(variant.available);
785:
786:      // Notify state change
787:      this.state.notify();
788:    }
```

**Finding:** Uses ModalState class with explicit state management pattern. Variant selection updates via `state.update('selectedVariantId', variantId)`. Updates image, price, compare price, and availability when variant changes.

---

## EXTRACTION 4: Cart Page Template

**Command:** `cat sections/main-cart-items.liquid | head -50`

**Purpose:** See where to add redirect script

**Results:**

```liquid
     1	{{ 'component-cart.css' | asset_url | stylesheet_tag }}
     2	{{ 'component-cart-items.css' | asset_url | stylesheet_tag }}
     3	{{ 'component-totals.css' | asset_url | stylesheet_tag }}
     4	{{ 'component-price.css' | asset_url | stylesheet_tag }}
     5	{{ 'component-discounts.css' | asset_url | stylesheet_tag }}
     6	{{ 'quantity-popover.css' | asset_url | stylesheet_tag }}
     7
     8	{%- style -%}
     9	  .section-{{ section.id }}-padding {
    10	    padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
    11	    padding-bottom: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
    12	  }
    13
    14	  @media screen and (min-width: 750px) {
    15	    .section-{{ section.id }}-padding {
    16	      padding-top: {{ section.settings.padding_top }}px;
    17	      padding-bottom: {{ section.settings.padding_bottom }}px;
    18	    }
    19	  }
    20	{%- endstyle -%}
    21
    22	{%- unless settings.cart_type == 'drawer' -%}
    23	  <script src="{{ 'cart.js' | asset_url }}" defer="defer"></script>
    24	{%- endunless -%}
    25
    26	<cart-items class="gradient color-{{ section.settings.color_scheme }} {% if cart == empty %} is-empty{% endif %} section-{{ section.id }}-padding">
    27	  <div class="page-width">
    28	    <div class="title-wrapper-with-link">
    29	      <h1 class="title title--primary">{{ 'sections.cart.title' | t }}</h1>
    30	      <a href="{{ routes.all_products_collection_url }}" class="underlined-link">{{ 'general.continue_shopping' | t }}</a>
    31	    </div>
    32
    33	    <div class="cart__warnings">
    34	      <h1 class="cart__empty-text">{{ 'sections.cart.empty' | t }}</h1>
    35	      <a href="{{ routes.all_products_collection_url }}" class="button">
    36	        {{ 'general.continue_shopping' | t }}
    37	      </a>
    38
    39	      {%- if shop.customer_accounts_enabled and customer == nil -%}
    40	        <h2 class="cart__login-title">{{ 'sections.cart.login.title' | t }}</h2>
    41	        <p class="cart__login-paragraph">
    42	          {{ 'sections.cart.login.paragraph_html' | t: link: routes.account_login_url }}
    43	        </p>
    44	      {%- endif -%}
    45	    </div>
    46
    47	    <form action="{{ routes.cart_url }}" class="cart__contents critical-hidden" method="post" id="cart">
    48	      <div class="cart__items" id="main-cart-items" data-id="{{ section.id }}">
    49	        <div class="js-contents">
    50	          {%- if cart != empty -%}
```

**Finding:** Standard Shopify cart template structure. Redirect script should be added after line 23 (after cart.js loads) or within the `<cart-items>` section. Form posts to `{{ routes.cart_url }}`.

---

## EXTRACTION 5: Current productOptions Output

**Command:** `grep -n "productOptions\|window.productOptions" sections/section-bundle-builder-bf25.liquid`

**Purpose:** Confirm if productOptions is missing

**Initial Result:** No matches found in section-bundle-builder-bf25.liquid

**Broader Search:** `grep -n "window.productVariants|window.productOptions" sections/*.liquid`

**Found Working Example in bogo-builder-2024.liquid (lines 377-416):**

```liquid
377:          <script>
378:            window.productVariants = window.productVariants || {};
379:            window.productVariants[{{ product.id }}] = [
380:              {% for variant in product.variants %}
381:              {
382:                id: '{{ variant.id }}',
383:                title: '{{ variant.title | escape }}',
384:                options: [
385:                  {% for option in variant.options %}
386:                  '{{ option | escape }}'{% unless forloop.last %}, {% endunless %}
387:                  {% endfor %}
388:                ],
389:                available: {{ variant.available | json }},
390:                price: {{ variant.price | json }},
391:                compare_at_price: {{ variant.compare_at_price | json }},
392:                featured_image: {{ variant.featured_image | json }}
393:              }{% unless forloop.last %}, {% endunless %}
394:              {% endfor %}
395:            ];
396:
397:            window.productOptions = window.productOptions || {};
398:            window.productOptions[{{ product.id }}] = [
399:              {% for option in product.options_with_values %}
400:              {
401:                name: '{{ option.name | escape }}',
402:                position: {{ option.position }},
403:                values: [
404:                  {% for value in option.values %}
405:                  '{{ value | escape }}'{% unless forloop.last %}, {% endunless %}
406:                  {% endfor %}
407:                ]
408:              }{% unless forloop.last %}, {% endunless %}
409:              {% endfor %}
410:            ];
411:          </script>
412:        {% endfor %}
413:
414:      </div>
415:
416:    </div>
```

**CRITICAL FINDING:**

✅ **Working Pattern EXISTS in bogo-builder-2024.liquid** (lines 397-410)
❌ **MISSING in section-bundle-builder-bf25.liquid** (no matches found)

This confirms the user's concern about the missing data layer. The productOptions data structure is implemented in the older BOGO builder but was not carried over to the BF25 implementation.

---

## SUMMARY OF FINDINGS

### 1. Rebuy Integration (Extraction 1)
- Loaded globally at theme level (layout/theme.liquid lines 89-90)
- Uses async script tag + extensions snippet
- **Implication:** Liquid-level blocking must modify theme.liquid to conditionally skip Rebuy on BF25 pages

### 2. Modal Add-to-Cart Handler (Extraction 2)
- Uses `.js-atc-bf` class selector
- Clones button to reset event listeners (anti-pattern, should use removeEventListener)
- Validates all variant options before adding to cart
- **Implication:** Quantity defaults need explicit handling

### 3. Variant Selection Logic (Extraction 3)
- Uses ModalState class with explicit state management
- Updates via `state.update('selectedVariantId', variantId)`
- Properly updates image, price, compare price, availability
- **Implication:** State pattern is solid, can be extended for dual-state cards

### 4. Cart Page Template (Extraction 4)
- Standard Shopify structure with form action to `{{ routes.cart_url }}`
- Loads cart.js at line 23
- **Implication:** Redirect script should be added after cart.js loads, checking for BF25 session flag

### 5. productOptions Data Layer (Extraction 5)
- **CRITICAL GAP CONFIRMED:** Data layer exists in bogo-builder-2024.liquid but MISSING in section-bundle-builder-bf25.liquid
- **Required Structure:**
  ```javascript
  window.productOptions[productId] = [
    {
      name: 'Color',
      position: 1,
      values: ['Black', 'White', 'Red']
    },
    // ...
  ];
  ```
- **Implication:** This data layer must be added to section-bundle-builder-bf25.liquid for proper variant selection

---

## RECOMMENDED IMPLEMENTATION ORDER

Based on these extractions and approved features:

1. **Add productOptions data layer** (fixes variant selection issue)
2. **Liquid-level Rebuy blocking** (modify theme.liquid lines 89-90)
3. **Cart page redirect script** (add to main-cart-items.liquid after line 23)
4. **Remove 5-second auto-restore timeout** (modify bf25-tier-cart.js)
5. **Atomic clear-and-add checkout** (modify bogo-builder.js add-to-cart handler)
6. **Shadow Cart localStorage schema** (extend ModalState class)
7. **Page detection in theme.liquid** (add before Rebuy script tags)
8. **Pack button deselection logic** (modify button click handlers)
9. **Tier progress bar reusable class** (refactor bf25-tier-cart.js)
10. **Quick-add dual-state cards** (extend bf25-expansion-core.js)
11. **Incentive message algorithm** (add to bf25-tier-cart.js)

---

**Next Step:** Use this extraction data to finalize roadmap with precise line numbers and implementation strategies.
