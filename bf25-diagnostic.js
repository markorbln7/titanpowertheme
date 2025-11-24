// BF25 Hero Visualization Diagnostic Script
// Copy and paste this entire script into browser console

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('BF25 HERO VISUALIZATION DIAGNOSTICS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1. CHECK ELEMENT EXISTENCE
console.log('\n=== 1. ELEMENT EXISTENCE ===');
const section = document.getElementById('bf25-hero-section');
const viz = document.querySelector('.bf25-hero__visualization');
const track = document.querySelector('.bf25-hero__track');
const fill = document.querySelector('.bf25-hero__fill');
const input = document.querySelector('.bf25-hero__input');

console.log('Section:', section ? '✅ Found' : '❌ Missing');
console.log('Visualization:', viz ? '✅ Found' : '❌ Missing');
console.log('Track:', track ? '✅ Found' : '❌ Missing');
console.log('Fill:', fill ? '✅ Found' : '❌ Missing');
console.log('Input:', input ? '✅ Found' : '❌ Missing');

if (!fill) {
  console.error('❌ CRITICAL: Fill element not found! Check HTML structure.');
  throw new Error('Fill element missing');
}

// 2. CHECK BOUNDING BOXES
console.log('\n=== 2. BOUNDING BOX ANALYSIS ===');
const vizRect = viz.getBoundingClientRect();
const trackRect = track.getBoundingClientRect();
const fillRect = fill.getBoundingClientRect();

console.log('Visualization rect:', {
  width: vizRect.width,
  height: vizRect.height,
  top: vizRect.top,
  left: vizRect.left,
  visible: vizRect.width > 0 && vizRect.height > 0
});

console.log('Track rect:', {
  width: trackRect.width,
  height: trackRect.height,
  top: trackRect.top,
  left: trackRect.left,
  visible: trackRect.width > 0 && trackRect.height > 0
});

console.log('Fill rect:', {
  width: fillRect.width,
  height: fillRect.height,
  top: fillRect.top,
  left: fillRect.left,
  visible: fillRect.width > 0 && fillRect.height > 0
});

if (fillRect.width === 0 || fillRect.height === 0) {
  console.warn('⚠️ Fill element has zero dimensions!');
}

// 3. CHECK COMPUTED STYLES ON FILL
console.log('\n=== 3. FILL ELEMENT COMPUTED STYLES ===');
const fillStyles = getComputedStyle(fill);
console.log({
  display: fillStyles.display,
  visibility: fillStyles.visibility,
  opacity: fillStyles.opacity,
  position: fillStyles.position,
  top: fillStyles.top,
  left: fillStyles.left,
  width: fillStyles.width,
  height: fillStyles.height,
  zIndex: fillStyles.zIndex,
  background: fillStyles.background,
  backgroundColor: fillStyles.backgroundColor,
  backgroundImage: fillStyles.backgroundImage,
  boxShadow: fillStyles.boxShadow,
  transform: fillStyles.transform,
  filter: fillStyles.filter,
});

// 4. CHECK CSS CUSTOM PROPERTIES
console.log('\n=== 4. CSS CUSTOM PROPERTIES ===');
const sectionStyles = getComputedStyle(section);
console.log({
  '--fill-width': sectionStyles.getPropertyValue('--fill-width'),
  '--color-accent-lime': sectionStyles.getPropertyValue('--color-accent-lime'),
  '--color-tier-current': sectionStyles.getPropertyValue('--color-tier-current'),
  '--tier-glow-color': sectionStyles.getPropertyValue('--tier-glow-color'),
});

// 5. CHECK ANCESTOR STACKING CONTEXTS
console.log('\n=== 5. ANCESTOR STACKING CONTEXT ANALYSIS ===');
let element = viz;
let depth = 0;
while (element && depth < 10) {
  const styles = getComputedStyle(element);
  const hasTransform = styles.transform !== 'none';
  const hasFilter = styles.filter !== 'none';
  const hasPerspective = styles.perspective !== 'none';
  const hasOpacity = parseFloat(styles.opacity) < 1;
  const hasIsolation = styles.isolation === 'isolate';
  const hasWillChange = styles.willChange !== 'auto';

  if (hasTransform || hasFilter || hasPerspective || hasOpacity || hasIsolation || hasWillChange) {
    console.log(`⚠️ STACKING CONTEXT at depth ${depth}:`, element.className || element.tagName);
    console.log('  Properties:', {
      transform: hasTransform ? styles.transform : 'none',
      filter: hasFilter ? styles.filter : 'none',
      perspective: hasPerspective ? styles.perspective : 'none',
      opacity: hasOpacity ? styles.opacity : '1',
      isolation: hasIsolation ? 'isolate' : 'auto',
      willChange: hasWillChange ? styles.willChange : 'auto',
    });
  }
  element = element.parentElement;
  depth++;
}

// 6. CHECK Z-INDEX HIERARCHY
console.log('\n=== 6. Z-INDEX HIERARCHY ===');
console.log('Visualization z-index:', getComputedStyle(viz).zIndex);
console.log('Track z-index:', getComputedStyle(track).zIndex);
console.log('Fill z-index:', getComputedStyle(fill).zIndex);
console.log('Input z-index:', getComputedStyle(input).zIndex);

// 7. TEST BACKGROUND RENDERING
console.log('\n=== 7. BACKGROUND RENDERING TEST ===');
const testBg = fillStyles.backgroundImage;
if (testBg === 'none') {
  console.error('❌ No background-image! Gradient not applied.');
} else if (testBg.includes('linear-gradient')) {
  console.log('✅ Linear gradient detected:', testBg.substring(0, 100) + '...');
} else {
  console.log('Background image:', testBg);
}

// 8. CHECK CURRENT SLIDER VALUE
console.log('\n=== 8. SLIDER STATE ===');
if (input) {
  console.log('Current value:', input.value);
  console.log('Min:', input.min);
  console.log('Max:', input.max);

  // Calculate expected fill width
  const value = parseInt(input.value);
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  const percentage = ((value - min) / (max - min)) * 100;
  console.log('Expected fill width:', percentage + '%');
  console.log('Actual fill width (CSS var):', sectionStyles.getPropertyValue('--fill-width'));
}

// 9. PAINT LAYER ANALYSIS
console.log('\n=== 9. PAINT LAYER HINTS ===');
console.log('Fill will-change:', fillStyles.willChange);
console.log('Fill contain:', fillStyles.contain);
console.log('Fill transform:', fillStyles.transform);

// 10. VISUAL OVERRIDE TEST
console.log('\n=== 10. FORCING VISIBILITY (DEBUG) ===');
console.log('Applying debug styles to fill element...');

// Temporarily force visible styles
fill.style.background = 'red !important';
fill.style.opacity = '1 !important';
fill.style.width = '50% !important';
fill.style.height = '100% !important';
fill.style.position = 'absolute !important';
fill.style.top = '0 !important';
fill.style.left = '0 !important';
fill.style.zIndex = '999 !important';

setTimeout(() => {
  const isNowVisible = fill.getBoundingClientRect().width > 0;
  if (isNowVisible) {
    console.log('✅ Fill IS visible with forced styles! CSS issue confirmed.');
    console.log('Problem: Original CSS not being applied or overridden');
  } else {
    console.log('❌ Fill STILL not visible! Deeper rendering issue.');
    console.log('Problem: Possible display:none ancestor, visibility:hidden, or clip-path');
  }

  // Restore original styles
  fill.style.cssText = '';
  console.log('Restored original styles.');
}, 2000);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DIAGNOSTIC COMPLETE - Check output above for issues');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
