/**
 * Shared test utilities and helpers for consistent testing
 */

const { getTailwindCSSProperty, getGamefaceTailwindSupport } = require('../parsers/tailwind-parser');

/**
 * Test helper for consistent CSS property mapping expectations  
 */
function expectCSSMapping(className, expectedProperty, expectedValue) {
  const result = getTailwindCSSProperty(className);
  expect(result).toEqual({ property: expectedProperty, value: expectedValue });
}

/**
 * Test helper for consistent support checking
 */
function expectSupported(className, shouldBeSupported = true, expectedReason = null) {
  const result = getGamefaceTailwindSupport(className);
  if (shouldBeSupported) {
    expect(result.supported).toBe(true);
  } else {
    expect(result.supported).toBe(false);
    if (expectedReason) {
      expect(result.reason).toContain(expectedReason);
    }
  }
}

/**
 * Test helper for batch testing multiple classes
 */
function expectMultipleMappings(classesToProperty) {
  classesToProperty.forEach(([className, property, value]) => {
    expectCSSMapping(className, property, value);
  });
}

/**
 * Test helper for batch testing support
 */
function expectMultipleSupport(classesToSupport) {
  classesToSupport.forEach(([className, shouldBeSupported, reason]) => {
    expectSupported(className, shouldBeSupported, reason);
  });
}

/**
 * Common test data for reuse across test files
 */
const TEST_DATA = {
  // Display classes that should be supported
  SUPPORTED_DISPLAY: [
    ['flex', 'display', 'flex'],
    ['hidden', 'display', 'none'],
    ['flex-col', 'flex-direction', 'column'],
    ['flex-row', 'flex-direction', 'row']
  ],
  
  // Display classes that should NOT be supported
  UNSUPPORTED_DISPLAY: [
    ['grid', false, 'Grid'],
    ['block', false, 'Limited display'],
    ['inline', false, 'Limited display'],
    ['table', false, 'Limited display']
  ],
  
  // Spacing classes that should be supported
  SUPPORTED_SPACING: [
    ['p-4', 'padding', '1rem'],
    ['m-2', 'margin', '0.5rem'],
    ['w-full', 'width', '100%'],
    ['h-auto', 'height', 'auto']
  ],
  
  // Classes that should be unsupported
  UNSUPPORTED_CLASSES: [
    ['float-left', false, 'Float'],
    ['sticky', false, 'sticky'],
    ['order-1', false, 'order'],
    ['shadow-lg', false, 'shadow']
  ]
};

module.exports = {
  expectCSSMapping,
  expectSupported,
  expectMultipleMappings,
  expectMultipleSupport,
  TEST_DATA
};