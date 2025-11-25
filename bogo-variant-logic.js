function showInlineVariantSelection(card) {
  const productId = card.dataset.productId;

  const defaultState = card.querySelector('.card-default-state');
  const variantState = card.querySelector('.card-variant-state');
  const variantContainer = card.querySelector('.variant-selectors-inline');

  if (!defaultState || !variantState || !variantContainer) {
    console.error('Missing required elements');
    return;
  }

  // ✅ Get product options from window.productOptions
  const productOptions = window.productOptions?.[productId];
  if (!productOptions || productOptions.length === 0) {
    console.error('No product options found for product:', productId);
    return;
  }

  console.log('✅ Showing variant selection for product:', productId);
  console.log('Options:', productOptions);

  // Generate variant selectors
  variantContainer.innerHTML = '';

  productOptions.forEach(function(optionData) {
    const selector = document.createElement('div');
    selector.className = 'inline-variant-selector';

    const label = document.createElement('label');
    label.className = 'inline-variant-label';
    label.textContent = optionData.name;

    const select = document.createElement('select');
    select.className = 'inline-variant-select';
    select.dataset.optionName = optionData.name;
    select.dataset.optionPosition = optionData.position;

    // Add placeholder option
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = 'Select ' + optionData.name;
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    select.appendChild(placeholderOpt);

    // Add options
    optionData.values.forEach(function(value) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });

    // Listen for changes to enable add button
    select.addEventListener('change', function() {
      validateInlineVariantSelection(card);
    });

    selector.appendChild(label);
    selector.appendChild(select);
    variantContainer.appendChild(selector);
  });

  // Animate transition
  defaultState.classList.remove('active');
  setTimeout(function() {
    variantState.classList.add('active');
  }, 400);

  // ✅ BOGO-VARIANT-FIX-062: Add button click handler
  const addBtn = card.querySelector('.btn-add-variant');
  if (addBtn) {
    // Remove any existing listener
    addBtn.replaceWith(addBtn.cloneNode(true));
    const newAddBtn = card.querySelector('.btn-add-variant');

    newAddBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('🔘 Add to Pair button clicked');
      addProductWithInlineVariant(card);
