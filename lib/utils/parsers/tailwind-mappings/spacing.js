/**
 * Spacing related Tailwind class mappings (margin, padding, positioning)
 */

const { SPACING_MAPPINGS, SPACING_PREFIXES } = require('../../../constants/tailwind-mappings/spacing');
const { SPACING_VALUES } = require('../../../constants/css-properties');

function parseSpacingValue(value) {
  return SPACING_VALUES[value] || value;
}

function getSpacingProperty(className) {
  // Check static mappings first
  if (SPACING_MAPPINGS[className]) {
    return SPACING_MAPPINGS[className];
  }

  // Handle negative margins
  const isNegative = className.startsWith('-') && !className.startsWith('-translate');
  const normalizedClassName = isNegative ? className.substring(1) : className;

  // Check for matching spacing prefix
  for (const prefix in SPACING_PREFIXES) {
    if (normalizedClassName.startsWith(prefix)) {
      const property = SPACING_PREFIXES[prefix];
      const valueStr = normalizedClassName.substring(prefix.length);
      const value = parseSpacingValue(valueStr);
      const finalValue = isNegative && value !== 'auto' ? `-${value}` : value;

      // Handle multi-property classes (mx-, my-, px-, py-, inset-)
      if (Array.isArray(property)) {
        return property.map(prop => ({ property: prop, value: finalValue }));
      }

      return { property, value: finalValue };
    }
  }

  // Z-index classes
  if (className.match(/^z-(\d+|auto)$/)) {
    const value = className.substring(2);
    return { property: 'z-index', value };
  }

  return null;
}

module.exports = {
  getSpacingProperty,
  parseSpacingValue
};