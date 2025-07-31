/**
 * Tailwind CSS class parser and CSS property mapper
 * Refactored to use modular structure with clean separation of concerns
 */

// Import modular mapping functions
const { getDisplayProperty } = require('./tailwind-mappings/display');
const { getFlexboxProperty } = require('./tailwind-mappings/flexbox');
const { getSpacingProperty } = require('./tailwind-mappings/spacing');
const { getTypographyProperty } = require('./tailwind-mappings/typography');
const { getEffectsProperty } = require('./tailwind-mappings/effects');
const { getUtilitiesProperty } = require('./tailwind-mappings/utilities');
const { getGridProperty } = require('./tailwind-mappings/grid');

// We'll import validateTailwindClass only when needed to avoid circular imports

// Import helper functions
const { 
  parseTailwindClasses,
  getSideName
} = require('./tailwind-helpers');

// Import parsing functions from specific modules
const { parseSpacingValue } = require('./tailwind-mappings/spacing');
const { parseColorValue, parseFontSize, parseFontWeight } = require('./tailwind-mappings/typography');

/**
 * Parse a space-separated string of Tailwind classes into an array
 * @param {string} classString - Space-separated class string
 * @returns {string[]} - Array of individual class names
 */
function parseTailwindClassString(classString) {
  return parseTailwindClasses(classString);
}

/**
 * Map a Tailwind class name to its corresponding CSS property and value
 * @param {string} className - The Tailwind class name
 * @returns {Object|Array|null} - CSS property object, array of objects, or null
 */
function getTailwindCSSProperty(className) {
  // Handle null, undefined, or empty input
  if (!className || typeof className !== 'string') {
    return null;
  }
  
  // Try each modular mapping function in order
  const mappingFunctions = [
    getDisplayProperty,
    getFlexboxProperty,
    getSpacingProperty,
    getTypographyProperty,
    getEffectsProperty,
    getUtilitiesProperty,
    getGridProperty  // Grid is now properly modularized
  ];
  
  for (const mapFunction of mappingFunctions) {
    const result = mapFunction(className);
    if (result) {
      return result;
    }
  }
  
  return null;
}

/**
 * Validate a Tailwind class for Gameface/Coherent UI support
 * Uses the new validation engine for clean rule-based validation
 * @param {string} className - The Tailwind class to validate
 * @returns {Object} - Validation result with supported status and reason
 */
function getGamefaceTailwindSupport(className) {
  if (!className || typeof className !== 'string') {
    return { supported: false, reason: 'invalid_class' };
  }

  // Get the CSS property mapping for this class
  const cssProperty = getTailwindCSSProperty(className);
  
  // Lazy import to avoid circular dependency
  const { validateTailwindClass } = require('../validators/tailwind-validator');
  
  // Use the validation engine to check support
  return validateTailwindClass(className, cssProperty);
}

// Export functions with backward compatibility
module.exports = {
  parseTailwindClasses: parseTailwindClassString,
  getTailwindCSSProperty,
  getGamefaceTailwindSupport,
  
  // Helper functions for backward compatibility
  parseSpacingValue,
  parseColorValue,
  parseFontSize,
  parseFontWeight,
  getSideName
};