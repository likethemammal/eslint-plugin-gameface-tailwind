/**
 * Essential helper functions for Tailwind CSS parsing
 * Moved from the old tailwind-helpers.js, keeping only what's actually used
 */

const { SPACING_VALUES, BASIC_COLORS } = require('../../constants/css-properties');

/**
 * Convert side abbreviation to full name
 * @param {string} side - Side abbreviation ('t', 'r', 'b', 'l')
 * @returns {string} - Full side name ('top', 'right', 'bottom', 'left')
 */
function getSideName(side) {
  const sideMap = {
    't': 'top',
    'r': 'right',
    'b': 'bottom',
    'l': 'left'
  };
  return sideMap[side] || side;
}

/**
 * Parse Tailwind class string into array of individual classes
 * @param {string} classString - Space-separated class string
 * @returns {string[]} - Array of individual class names
 */
function parseTailwindClasses(classString) {
  if (!classString || typeof classString !== 'string') {
    return [];
  }

  // Split on whitespace and filter out empty strings
  return classString.trim().split(/\s+/).filter(cls => cls.length > 0);
}

/**
 * Check if a color value matches Tailwind color patterns
 * @param {string} value - The color value to check
 * @returns {boolean} - Whether it matches a color pattern
 */
function isColorPattern(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return !!(BASIC_COLORS[value] || 
         value.match(/^(red|blue|green|yellow|purple|pink|indigo|gray|grey)-\d+$/) ||
         value.match(/^(slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+$/));
}

/**
 * Check if a value matches spacing patterns
 * @param {string} value - The value to check
 * @returns {boolean} - Whether it matches a spacing pattern
 */
function isSpacingValue(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return !!(SPACING_VALUES[value] || value.match(/^\d+$/));
}

module.exports = {
  getSideName,
  parseTailwindClasses,
  isColorPattern,
  isSpacingValue
};