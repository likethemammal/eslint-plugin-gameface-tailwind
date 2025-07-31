/**
 * Display property parsing utilities for Tailwind classes
 */

const { DISPLAY_MAPPINGS } = require('../../../constants/tailwind-mappings/display');

function getDisplayProperty(className) {
  return DISPLAY_MAPPINGS[className] || null;
}

module.exports = {
  getDisplayProperty
};