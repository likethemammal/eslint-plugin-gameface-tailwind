/**
 * Utilities property parsing utilities for Tailwind classes
 */

const { UTILITIES_MAPPINGS } = require('../../../constants/tailwind-mappings/utilities');

function getUtilitiesProperty(className) {
  return UTILITIES_MAPPINGS[className] || null;
}

module.exports = {
  getUtilitiesProperty
};