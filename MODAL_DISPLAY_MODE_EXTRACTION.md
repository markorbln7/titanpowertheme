# MODAL DISPLAY MODE LOGIC EXTRACTION

**Purpose:** Understand how pack buttons vs quantity stepper are toggled in BF25 modal
**Date:** 2025-11-24
**Status:** CRITICAL FINDING - No conditional logic exists yet

---

## EXTRACTION 1: Schema Setting Definition

**Command:** `grep -n -B5 -A15 "Display Mode|display_mode|Power Packs|Individual" sections/section-bundle-builder-bf25.liquid | head -80`

**Results:**

```liquid
301-  'use strict';
302-
303-  // Configuration for this section
304-  const sectionConfig = {
305-    // Display mode from Theme Customizer
306:    mode: "{{ section.settings.modal_display_mode | default: 'power_packs' }}",
307-
308-    // Tier structure for discount calculations (Black Friday 2025)
309:    // Thresholds: 4, 8, 12 items (Power Packs mode)
310-    tiers: [
311-      {
312-        min: 1,
313-        max: 3,
314-        multiplier: 1.0,
315-        displayLabel: "Standard",
316-        label: "Standard",
317-        badge: null
318-      },
319-      {
320-        min: 4,
321-        max: 7,
322-        multiplier: 0.91,
323-        displayLabel: "60% OFF",
324-        label: "Better Deal",
--
620-      "type": "header",
621-      "content": "🎛️ Modal Configuration"
622-    },
623-    {
624-      "type": "paragraph",
625:      "content": "Configure how products are added to cart in the expansion modal. Power Packs mode emphasizes bulk savings with tier buttons. Individual mode offers traditional quantity selection."
626-    },
627-    {
628-      "type": "select",
629:      "id": "modal_display_mode",
630:      "label": "Display Mode",
631:      "info": "Power Packs: Tier buttons | Individual: Stepper",
632-      "options": [
633-        {
634-          "value": "power_packs",
635:          "label": "Power Packs (Tier Buttons)"
636-        },
637-        {
638-          "value": "individual",
639:          "label": "Individual (Quantity Stepper)"
640-        }
641-      ],
642-      "default": "power_packs"
643-    },
644-    {
645-      "type": "header",
646-      "content": "💰 Tier Discount Structure"
647-    },
648-    {
649-      "type": "paragraph",
650-      "content": "The tier percentages below are optimized for Black Friday 2025 and are currently hardcoded in the JavaScript configuration. Future updates can make these Theme Customizer editable if needed."
651-    },
652-    {
653-      "type": "paragraph",
654-      "content": "Current structure: Tier 1 (4 items, 60% off) → Tier 2 (8 items, 75% off) → Tier 3 (12 items, 80% off) → Tier 4 (16 items, 85% off)"
```

**Finding:**
- Schema setting exists at line 629: `"id": "modal_display_mode"`
- Default value: `"power_packs"`
- Options: `"power_packs"` or `"individual"`
- Config output at line 306: `mode: "{{ section.settings.modal_display_mode | default: 'power_packs' }}"`
- Stored in `window.bf25Config.mode`

---

## EXTRACTION 2: Modal Snippet Structure (First 200 Lines)

**Command:** `cat snippets/buy-now-popup-bf25.liquid | head -200`

**Results:**

```liquid
{% assign first_upsell_product = all_products[upsell_product_one] %}
{% assign second_upsell_product = all_products[upsell_product_two] %}

<aside class="buy-now-popup fixed inset-0 bottom-0 left-0 right-0 top-0 z-[1000] bg-black bg-opacity-60 close-buy-now-popup" data-section="bf25" data-product-id="{{ product_id_attr }}">
    <div class="buy-now-popup__wrapper absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[70vh] max-h-[860px] w-[80vw] max-w-[1280px] py-[70px] rounded-xl bg-[#fff]">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6948" width="32" height="32" class="close-buy-now-popup absolute right-[16px] top-[16px] z-[2] h-[25px] w-[25px] cursor-pointer fill-[#999]">
            <path d="M557.311759 513.248864l265.280473-263.904314c12.54369-12.480043 12.607338-32.704421 0.127295-45.248112-12.512727-12.576374-32.704421-12.607338-45.248112-0.127295L512.127295 467.904421 249.088241 204.063755c-12.447359-12.480043-32.704421-12.54369-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.280796l262.975407 263.775299-265.151458 263.744335c-12.54369 12.480043-12.607338 32.704421-0.127295 45.248112 6.239161 6.271845 14.463432 9.440452 22.687703 9.440452 8.160624 0 16.319527-3.103239 22.560409-9.311437l265.216826-263.807983 265.440452 266.240344c6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.311759 513.248864z" p-id="6949"></path>
        </svg>
        <div class="buy-now-popup__product-body flex h-full px-[70px] overflow-y-auto">
            <figure class="max-h-[432px] h-full w-[47%] mr-[5%] relative">
                {% if badge_text %}
                  <div class="absolute left-[10px] top-[10px]">
                    <div class="discount_message relative flex bg-[#60c655] rounded-tl-[20px] md:text-[18px] text-[14px] color-white p-[6px] font-bold pr-[10px]">
                      <div>{{ badge_text }}</div>
                      <div class="absolute right-[-25px] md:right-[-40px] md:w-[60px] w-[40px] md:top-[-15px] top-[-8px]"><img width="100" height="auto" src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/lightning_bolt.png?v=1730972558"></div>
                    </div>
                  </div>
                {% endif %}
                <img src="{{ product_image | img_url: 'master' }}" alt="{{product_image.alt}}" height="432" width="432" class="h-full w-full object-cover js-variant-image"/>
            </figure>
            <div class="buy-now-popup__content flex-1">
                <a href="{{ product.url }}" class="text-[21px] pb-[6px] border-b border-solid border-[#e5e5e5] leading-[1.2] font-bold color-black">{{ title }}</a>
                <div class="flex items-center mt-[12px]">
                    <span class="mr-[8px] text-[21px] text-[#60c655] font-bold js-variant-price">{{ price | money }}</span> <span class="crossed text-[#999] js-variant-compare-price">{{ compare_at_price | money }}</span>
                </div>
                {% if description != blank %}
                    <div class="buy-now-popup__description pb-[24px] overflow-hidden">
                        <div class="buy-now-popup__description-inner h-[100px] with-gradient overflow-hidden">
                            <div>{{ description }}</div>
                        </div>
                        <p class="buy-now-popup__expand-desc text-black text-[16px] pt-[14px] pointer flex items-center gap-[6px] color-[#60c655] color-titan-green">
                           <span> Learn More</span>
                            <svg class="text-black w-[16px] h-[16px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5772" width="32" height="32">
                                <path d="M225.408 368.384L496 640.641l270.592-272.257-48.64-49.024L496 542.592 274.176 319.36l-48.768 49.024z m0 0z" fill="#60c655" p-id="5773"></path>
                            </svg>
                        </p>
                    </div>
                {% endif %}
                {% if product.variants.size > 1 %}
                  <!-- Visual Variant Selectors (BOGO-VARIANT-SWATCHES-020) -->
                  <div class="variant-selectors-visual">
                    {% for option in product.options_with_values %}
                      {% if option.name != 'Title' or option.values[0] != 'Default Title' %}
                        <div class="variant-option-group">
                          <label class="variant-option-label">{{ option.name }}:</label>

                          {% assign option_lower = option.name | downcase %}
                          {% if option_lower contains 'color' or option_lower contains 'colour' %}
                            <!-- Color Swatches -->
                            <div class="variant-swatches" data-option-index="{{ forloop.index }}">
                              {% for value in option.values %}
                                {% assign color_slug = value | downcase | replace: ' ', '' %}
                                <div class="variant-swatch {% if forloop.first %}selected{% endif %}"
                                     data-value="{{ value }}"
                                     data-color="{{ color_slug }}"
                                     title="{{ value }}"
                                     onclick="selectVariantSwatch(this, {{ forloop.index }})">
                                </div>
                              {% endfor %}
                            </div>

                          {% else %}
                            <!-- Size/Length Buttons -->
                            <div class="variant-buttons" data-option-index="{{ forloop.index }}">
                              {% for value in option.values %}
                                <button class="variant-button {% if forloop.first %}selected{% endif %}"
                                        data-value="{{ value }}"
                                        type="button"
                                        onclick="selectVariantButton(this, {{ forloop.index }})">
                                  {{ value }}
                                </button>
                              {% endfor %}
                            </div>

                          {% endif %}
                        </div>
                      {% endif %}
                    {% endfor %}
                  </div>

                  <!-- Hidden fallback selects for compatibility -->
                  <div class="variant-selectors-fallback">
                    {% for option in product.options_with_values %}
                      {% if option.name != 'Title' or option.values[0] != 'Default Title' %}
                        <select class="variant-selector" data-option-index="{{ forloop.index }}">
                          {% for value in option.values %}
                            <option value="{{ value }}">{{ value }}</option>
                          {% endfor %}
                        </select>
                      {% endif %}
                    {% endfor %}
                  </div>
                {% endif %}
                {% if grid_1 %}
                  <div class="grid-images flex gap-[10px] mb-[20px] cursor-pointer md:max-w-[100%]">
                      <div data-image-qty="{{ grid_1_text }}" class="grid-images__single js-grid-image w-[33%]">
                          <img class="w-full" width="100" height="auto" src="{{ grid_1 | img_url: 'master' }}" alt="">
                      </div>
                      <div data-image-qty="{{ grid_2_text }}" class="grid-images__single js-grid-image w-[33%]">
                        <img class="w-full" width="100" height="auto" src="{{ grid_2 | img_url: 'master' }}" alt="">
                    </div>
                    <div data-image-qty="{{ grid_3_text }}" class="grid-images__single js-grid-image w-[33%]">
                      <img class="w-full" width="100" height="auto" src="{{ grid_3 | img_url: 'master' }}" alt="">
                  </div>
                  </div>
                {% endif %}
                <div class="buy-now-popup__quantity">
                    <h4 class="text-[16px] font-semibold">Quantity</h4>
                    <div class="buy-now-popup__quantity mt-[8px] mb-[24px] flex items-center gap-[20px]">
                        <quantity-input class="quantity cart-quantity">
                            <button class="quantity__button" name="minus" type="button">
                              {% render 'icon-minus' %}
                            </button>
                            <input
                              class="quantity__input"
                              type="number"
                              value="1"
                              min="1"
                            >
                            <button class="quantity__button" name="plus" type="button">
                              {% render 'icon-plus' %}
                            </button>
                          </quantity-input>
                          {% if grid_1 %}
                            <div data-count="4" class="js-buy-more">
                              Add 4 Save 55%
                            </div>
                          {% endif %}
                    </div>
                </div>

                {% if upsell_product_one or upsell_product_two %}
                    <div class="buy-now-popup__upsell">
                      <h4 class="text-[16px] font-semibold">You May Also Like:</h4>
                      <div class="mt-[10px]">
                        {% if upsell_product_one %}
                          <div class="mb-4 last:mb-0">
                            <div data-product-id="{{first_upsell_product.selected_or_first_available_variant.id}}"
                                class="js-upsell-selector buy-now-popup__upsell-box relative flex items-center py-[20px] pr-[16px] pl-[50px] border-2 border-[#ddd] cursor-pointer mb-[2px] rounded-[6px] box-border">
                              <label class="buy-now-popup__checkbox">
                                <input type="checkbox" />
                                <span class="custom-checkbox"></span>
                              </label>
                              <figure class="relative mr-[16px]">
                                <img src="{{ first_upsell_product.featured_image | img_url: 'master' }}" alt="{{first_upsell_product.title}}" height="60" width="60" class="h-[60px] w-[60px] object-contain"/>
                              </figure>
                              <div class="w-full">
                                <h4 class="mt-[4px] text-[16px] font-medium text-[#000] mb-[6px] leading-[1]">{{ first_upsell_product.title }}</h4>
                                <div class="flex w-full flex-wrap items-center justify-between">
                                  <div class="flex items-center flex-wrap">
                                    <div class="font-semibold mr-[6px] text-[#000] leading-[1]">{{ first_upsell_product.price | money }}</div>
                                    {% if first_upsell_product.compare_at_price != blank %}
                                        <div class="text-[14px] font-semibold text-[#777777] line-through">{{ first_upsell_product.compare_at_price | money }}</div>
                                    {% endif %}
                                    {% if first_upsell_product.compare_at_price > first_upsell_product.price  %}
                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
                                        Save {{ first_upsell_product.compare_at_price | minus: first_upsell_product.price | money }}
                                      </div>
                                    {% endif %}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {% endif %}
                        {% if upsell_product_two %}
                          <div class="mb-4 last:mb-0">
                            <div data-product-id="{{second_upsell_product.selected_or_first_available_variant.id}}"
                                class="js-upsell-selector buy-now-popup__upsell-box relative flex items-center py-[20px] pr-[16px] pl-[50px] border-2 border-[#ddd] cursor-pointer rounded-[6px] box-border">
                              <label class="buy-now-popup__checkbox">
                                <input type="checkbox" />
                                <span class="custom-checkbox"></span>
                              </label>
                              <figure class="relative mr-[16px]">
                                <img src="{{ second_upsell_product.featured_image | img_url: 'master' }}" alt="{{second_upsell_product.title}}" height="60" width="60" class="h-[60px] w-[60px] object-contain"/>
                              </figure>
                              <div class="w-full">
                                <h4 class="mt-[4px] text-[16px] font-medium text-[#000] mb-[6px] leading-[1]">{{ second_upsell_product.title }}</h4>
                                <div class="flex w-full flex-wrap items-center justify-between">
                                  <div class="flex items-center flex-wrap">
                                    <div class="font-semibold mr-[6px] text-[#000] leading-[1]">{{ second_upsell_product.price | money }}</div>
                                    {% if second_upsell_product.compare_at_price != blank %}
                                        <div class="text-[14px] font-semibold text-[#777777] line-through">{{ second_upsell_product.compare_at_price | money }}</div>
                                    {% endif %}
                                    {% if second_upsell_product.compare_at_price > second_upsell_product.price %}
                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
                                        Save {{ second_upsell_product.compare_at_price | minus: second_upsell_product.price | money }}
                                      </div>
                                    {% endif %}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {% endif %}
                      </div>
                    </div>
                {% endif %}
            </div>
        </div>
```

**Finding:**
- Modal structure exists with quantity stepper (lines 107-130)
- Grid images (lines 94-106) - legacy "Add 4/6/10" visual system
- Variant selectors (lines 48-93) - visual swatches/buttons
- Upsell products (lines 132-197)
- **NO pack buttons found** (4 ITEMS, 8 ITEMS, 12 ITEMS, etc.)
- **NO conditional logic** for `modal_display_mode`

---

## EXTRACTION 3: Display Mode Conditional in Modal

**Command:** `grep -n -B5 -A10 "display_mode|power_pack|individual|quantity-selector|pack-button" snippets/buy-now-popup-bf25.liquid`

**Results:** NO OUTPUT (no matches found)

**Finding:**
❌ **CRITICAL: No conditional logic exists in the modal snippet**
- The `modal_display_mode` setting is output to JavaScript config
- But the Liquid template does NOT check this setting
- Pack buttons are completely missing
- Quantity stepper is always visible

---

## EXTRACTION 4: Pack Buttons HTML

**Command:** `grep -n -B3 -A10 "pack|ITEMS|tier-button" snippets/buy-now-popup-bf25.liquid`

**Results:**

```
93-                {% endif %}
94-                {% if grid_1 %}
95-                  <div class="grid-images flex gap-[10px] mb-[20px] cursor-pointer md:max-w-[100%]">
96:                      <div data-image-qty="{{ grid_1_text }}" class="grid-images__single js-grid-image w-[33%]">
97-                          <img class="w-full" width="100" height="auto" src="{{ grid_1 | img_url: 'master' }}" alt="">
98-                      </div>
99:                      <div data-image-qty="{{ grid_2_text }}" class="grid-images__single js-grid-image w-[33%]">
100-                        <img class="w-full" width="100" height="auto" src="{{ grid_2 | img_url: 'master' }}" alt="">
101-                    </div>
102:                    <div data-image-qty="{{ grid_3_text }}" class="grid-images__single js-grid-image w-[33%]">
103-                      <img class="w-full" width="100" height="auto" src="{{ grid_3 | img_url: 'master' }}" alt="">
104-                  </div>
105-                  </div>
106-                {% endif %}
```

**Finding:**
- Only found legacy grid images (visual tier selection via images)
- **NO tier buttons** (4 ITEMS, 8 ITEMS, 12 ITEMS, 16+ ITEMS)
- **NO pack button HTML structure**

---

## EXTRACTION 5: Quantity Stepper HTML

**Command:** `grep -n -B3 -A10 "quantity|stepper|qty|minus|plus" snippets/buy-now-popup-bf25.liquid`

**Results:**

```
93-                {% endif %}
94-                {% if grid_1 %}
95-                  <div class="grid-images flex gap-[10px] mb-[20px] cursor-pointer md:max-w-[100%]">
96:                      <div data-image-qty="{{ grid_1_text }}" class="grid-images__single js-grid-image w-[33%]">
97-                          <img class="w-full" width="100" height="auto" src="{{ grid_1 | img_url: 'master' }}" alt="">
98-                      </div>
99:                      <div data-image-qty="{{ grid_2_text }}" class="grid-images__single js-grid-image w-[33%]">
100-                        <img class="w-full" width="100" height="auto" src="{{ grid_2 | img_url: 'master' }}" alt="">
101-                    </div>
102:                    <div data-image-qty="{{ grid_3_text }}" class="grid-images__single js-grid-image w-[33%]">
103-                      <img class="w-full" width="100" height="auto" src="{{ grid_3 | img_url: 'master' }}" alt="">
104-                  </div>
105-                  </div>
106-                {% endif %}
107:                <div class="buy-now-popup__quantity">
108-                    <h4 class="text-[16px] font-semibold">Quantity</h4>
109:                    <div class="buy-now-popup__quantity mt-[8px] mb-[24px] flex items-center gap-[20px]">
110:                        <quantity-input class="quantity cart-quantity">
111:                            <button class="quantity__button" name="minus" type="button">
112:                              {% render 'icon-minus' %}
113-                            </button>
114-                            <input
115:                              class="quantity__input"
116-                              type="number"
117-                              value="1"
118-                              min="1"
119-                            >
120:                            <button class="quantity__button" name="plus" type="button">
121:                              {% render 'icon-plus' %}
122-                            </button>
123:                          </quantity-input>
124-                          {% if grid_1 %}
125-                            <div data-count="4" class="js-buy-more">
126-                              Add 4 Save 55%
127-                            </div>
128-                          {% endif %}
129-                    </div>
130-                </div>
131-
132-                {% if upsell_product_one or upsell_product_two %}
133-                    <div class="buy-now-popup__upsell">
--
154-                                    {% endif %}
155-                                    {% if first_upsell_product.compare_at_price > first_upsell_product.price  %}
156-                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
157:                                        Save {{ first_upsell_product.compare_at_price | minus: first_upsell_product.price | money }}
158-                                      </div>
159-                                    {% endif %}
160-                                  </div>
161-                                </div>
162-                              </div>
163-                            </div>
164-                          </div>
165-                        {% endif %}
166-                        {% if upsell_product_two %}
167-                          <div class="mb-4 last:mb-0">
--
184-                                    {% endif %}
185-                                    {% if second_upsell_product.compare_at_price > second_upsell_product.price %>
186-                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
187:                                        Save {{ second_upsell_product.compare_at_price | minus: second_upsell_product.price | money }}
188-                                      </div>
189-                                    {% endif %}
190-                                  </div>
191-                                </div>
192-                              </div>
193-                            </div>
194-                          </div>
195-                        {% endif %}
196-                      </div>
197-                    </div>
--
204-                <span class="text-[#999] font-medium text-[16px] crossed js-variant-compare-price-2">{{ compare_at_price | money }}</span>
205-            </div>
206-            <div class="flex items-center justify-end gap-[10px]">
207:                <button data-product-id="{{ product_id}}" data-quantity="{{ quantity }}"
208-                    class="js-atc-bf buy-now-popup__atc min-w-[200px] h-[46px] bg-[#60c655]  text-[16px] text-white font-semibold rounded-[20px] leading-[46px]"
209-                >
210-                    Add To Cart
211-                </button>
212-                <button data-product-id="{{ product_id}}"
213-                    class="absolute left-[-40000px] js-checkout js-atc-bf buy-now-popup__atc min-w-[200px] h-[46px] bg-[#60c655]  text-[16px] text-white font-semibold rounded-[20px] leading-[46px]">
214-                    Buy Now
215-                </button>
216-                </div>
217-        </div>
```

**Finding:**
- Quantity stepper exists at lines 107-130
- Structure:
  - Wrapper: `<div class="buy-now-popup__quantity">`
  - Web component: `<quantity-input>`
  - Minus button: `<button class="quantity__button" name="minus">`
  - Input: `<input class="quantity__input" type="number" value="1">`
  - Plus button: `<button class="quantity__button" name="plus">`
  - Legacy "Add 4 Save 55%" button (line 125)
- Add to Cart button at line 207-210: `data-quantity="{{ quantity }}"`

---

## CRITICAL FINDINGS SUMMARY

### ❌ Implementation Gap Identified

**The Problem:**
1. Schema setting `modal_display_mode` exists and outputs to `window.bf25Config.mode`
2. **BUT:** No conditional logic in `snippets/buy-now-popup-bf25.liquid` uses this setting
3. **Pack buttons (4 ITEMS, 8 ITEMS, 12 ITEMS, 16+ ITEMS) do NOT exist**
4. Quantity stepper is ALWAYS visible (no conditional hiding)
5. Only legacy grid images exist (not the tier button system)

### ✅ What Exists

**Quantity Stepper (lines 107-130):**
```liquid
<div class="buy-now-popup__quantity">
  <h4 class="text-[16px] font-semibold">Quantity</h4>
  <div class="buy-now-popup__quantity mt-[8px] mb-[24px] flex items-center gap-[20px]">
    <quantity-input class="quantity cart-quantity">
      <button class="quantity__button" name="minus" type="button">
        {% render 'icon-minus' %}
      </button>
      <input class="quantity__input" type="number" value="1" min="1">
      <button class="quantity__button" name="plus" type="button">
        {% render 'icon-plus' %}
      </button>
    </quantity-input>
    {% if grid_1 %}
      <div data-count="4" class="js-buy-more">Add 4 Save 55%</div>
    {% endif %}
  </div>
</div>
```

**Legacy Grid Images (lines 94-106):**
```liquid
{% if grid_1 %}
  <div class="grid-images flex gap-[10px] mb-[20px] cursor-pointer md:max-w-[100%]">
    <div data-image-qty="{{ grid_1_text }}" class="grid-images__single js-grid-image w-[33%]">
      <img src="{{ grid_1 | img_url: 'master' }}" alt="">
    </div>
    <div data-image-qty="{{ grid_2_text }}" class="grid-images__single js-grid-image w-[33%]">
      <img src="{{ grid_2 | img_url: 'master' }}" alt="">
    </div>
    <div data-image-qty="{{ grid_3_text }}" class="grid-images__single js-grid-image w-[33%]">
      <img src="{{ grid_3 | img_url: 'master' }}" alt="">
    </div>
  </div>
{% endif %}
```

### ❌ What's Missing

**Pack Buttons System:**
```liquid
<!-- THIS DOES NOT EXIST YET -->
<div class="bf25-pack-buttons">
  <button class="pack-button" data-quantity="4" data-tier="1">
    <span class="pack-count">4 ITEMS</span>
    <span class="pack-discount">60% OFF</span>
    <span class="pack-badge">⚡ FREE Cable</span>
  </button>
  <button class="pack-button" data-quantity="8" data-tier="2">
    <span class="pack-count">8 ITEMS</span>
    <span class="pack-discount">70% OFF</span>
    <span class="pack-badge">🎁 FREE Cable + Case</span>
  </button>
  <!-- ... tier 3, tier 4 -->
</div>
```

**Conditional Display Logic:**
```liquid
<!-- THIS DOES NOT EXIST YET -->
{% if section.settings.modal_display_mode == 'power_packs' %}
  <!-- Show pack buttons -->
  {% render 'bf25-pack-buttons' %}
{% else %}
  <!-- Show quantity stepper -->
  <div class="buy-now-popup__quantity">...</div>
{% endif %}
```

---

## REQUIRED IMPLEMENTATION

To make the `modal_display_mode` setting functional, we need to:

1. **Create pack buttons HTML structure** in `snippets/buy-now-popup-bf25.liquid`
2. **Add conditional logic** to toggle between pack buttons and quantity stepper
3. **Wire up JavaScript** to handle pack button clicks
4. **Update CSS** for pack button styling
5. **Remove or conditionally hide** legacy grid images when pack buttons are active

**Location for implementation:** `snippets/buy-now-popup-bf25.liquid` lines 94-130 (replace grid images + quantity section)

**Expected behavior:**
- `power_packs` mode → Show tier buttons (4, 8, 12, 16+), hide stepper
- `individual` mode → Show quantity stepper, hide tier buttons

---

## NEXT STEPS

1. Design pack buttons HTML structure with proper data attributes
2. Add Liquid conditional to `snippets/buy-now-popup-bf25.liquid`
3. Create JavaScript handler for pack button clicks
4. Style pack buttons to match BF25 tier theming
5. Test mode toggling via Theme Customizer
