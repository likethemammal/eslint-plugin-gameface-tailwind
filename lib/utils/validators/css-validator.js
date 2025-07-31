/**
 * CSS validation utilities for Gameface compatibility
 * Consolidated from various validation helper functions
 */

const { 
  validateCSSProperty, 
  validateCSSValue, 
  detectGifUsage,
  detectUnsupportedUnits,
  extractUrlFromCSSValue,
  parseInlineCSS,
  detectCSSVariables,
  validateCSSSelector,
  validatePseudoElement
} = require('../parsers/css-parser');

/**
 * Validate CSS properties and return violations
 */
function validateCSSProperties(styleProperties, context = {}) {
  const violations = [];

  // Handle both array and object formats
  const properties = Array.isArray(styleProperties) 
    ? styleProperties 
    : Object.entries(styleProperties).map(([property, value]) => ({ property, value }));

  for (const { property, value } of properties) {
    // Validate property support
    const propertyResult = validateCSSProperty(property);
    if (!propertyResult.valid) {
      violations.push({
        type: 'property',
        property,
        value,
        reason: propertyResult.reason,
        note: propertyResult.note,
        messageId: 'unsupportedProperty'
      });
      continue; // Skip value validation if property is unsupported
    }

    // Validate property value
    const valueResult = validateCSSValue(property, value);
    if (!valueResult.valid) {
      violations.push({
        type: 'value',
        property,
        value,
        reason: valueResult.reason,
        note: valueResult.note,
        messageId: valueResult.reason === 'gif_not_supported' ? 'unsupportedGif' : 'unsupportedValue'
      });
    }

    // Check for unsupported units in font-size
    if (property === 'fontSize' && detectUnsupportedUnits(value)) {
      violations.push({
        type: 'value',
        property,
        value,
        reason: 'unsupported_font_units',
        messageId: 'unsupportedValue'
      });
    }
  }

  return violations;
}

/**
 * Check if CSS violation should be reported based on context
 */
function shouldReportViolation(violation, context = {}) {
  const { ignoreUnknown = false, severity = 'error' } = context;
  
  // Skip unknown classes if configured to ignore them
  if (ignoreUnknown && violation.reason === 'unknown_class') {
    return false;
  }
  
  return true;
}

module.exports = {
  validateCSSProperties,
  shouldReportViolation,
  parseInlineCSS,
  detectGifUsage,
  detectUnsupportedUnits,
  extractUrlFromCSSValue,
  detectCSSVariables,
  validateCSSSelector,
  validatePseudoElement
};