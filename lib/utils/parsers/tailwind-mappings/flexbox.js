/**
 * Flexbox property parsing utilities for Tailwind classes
 */

const { FLEXBOX_MAPPINGS } = require('../../../constants/tailwind-mappings/flexbox');

function getFlexboxProperty(className) {
  return FLEXBOX_MAPPINGS[className] || null;
}

module.exports = {
  getFlexboxProperty
};