/**
 * Consolidated error messages and message templates for Gameface ESLint plugin
 * Unified system that works with the consolidated validation rules
 */

const ERROR_TEMPLATES = {
  // General validation errors
  UNSUPPORTED_PROPERTY: 'CSS property "{property}" is not supported by Gameface.',
  UNSUPPORTED_VALUE: 'CSS value "{value}" for property "{property}" is not supported by Gameface.',
  UNSUPPORTED_CSS_PROPERTY: '{property} is not supported by Gameface: {reason}',
  UNSUPPORTED_CSS_VALUE: '{property} with value "{value}" is not supported by Gameface: {reason}',
  
  // ESLint rule messages
  GAMEFACE_UNSUPPORTED: '{item} is not supported by Gameface: {reason}',
  TAILWIND_UNSUPPORTED: 'Tailwind class "{item}" is not supported by Gameface',
  CSS_UNSUPPORTED: 'CSS property "{item}" is not supported by Gameface',
  
  // Specific error scenarios
  SHADOW_NOT_SUPPORTED: 'Box shadow is not supported by Gameface',
  GRID_NOT_SUPPORTED: 'CSS Grid is not supported by Gameface. Consider using Flexbox instead.',
  DISPLAY_NOT_SUPPORTED: 'Display value "{value}" is not supported by Gameface. Only "flex" is fully supported.',
  POSITION_NOT_SUPPORTED: 'Position value "{value}" is not supported by Gameface.',
  BORDER_STYLE_NOT_SUPPORTED: 'Border style "{value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.',
  FLEX_SHORTHAND_ONLY: '{property} is supported only as part of the flex shorthand property in Gameface.',
  UNKNOWN_CLASS: 'Unknown Tailwind class.',
  GIF_NOT_SUPPORTED: 'GIF images are not supported by Gameface.',
  
  // Tailwind-specific patterns
  TAILWIND_PATTERN_UNSUPPORTED: 'Tailwind class "{className}" matches an unsupported pattern: {reason}',
  TAILWIND_EXACT_CLASS_UNSUPPORTED: 'Tailwind class "{className}" is not supported: {reason}',
  TAILWIND_PROPERTY_UNSUPPORTED: 'Tailwind class "{className}" generates unsupported CSS: {reason}',
  
  // Special cases with notes
  BOX_SIZING_NOTE: 'box-sizing: content-box is not supported, but the default box-sizing in Gameface is border-box.',
  CURSOR_CPP_IMPLEMENTATION: 'Cursor styles require implementation from C++ in Gameface.',
  FONT_LOADING_NOTE: 'Font must be loaded first in Gameface.'
};

// Common error reason mappings
const ERROR_REASONS = {
  // Shadow-related
  shadow: "Cohtml can't resolve the CSS variables in the box-shadow",
  ring: "Cohtml doesn't support the colors used for the shadows",
  
  // Background-related
  backgroundOpacity: "Adds a variable for the bg-color classes which don't work",
  backgroundClip: "No support for the background-clip property",
  backgroundAttachment: "No support for background-attachment",
  
  // Selector-related
  notSelector: "Uses the not supported :not selector",
  pseudoClasses: "We don't support any of the pseudo-classes in Tailwind because of the selector they are using",
  mediaQueries: "We don't support the selector that is used for media-queries",
  
  // Color-related
  currentColor: "No support for the currentcolor keyword",
  cssVariablesInColors: "Colors in the format rgb(255 255 255/var(--tw-bg-opacity)) can't be parsed in cohtml",
  textOpacity: "Sets a variable for the text-color",
  
  // Layout-related
  tables: "Cohtml doesn't support tables",
  lists: "Cohtml doesn't support lists",
  grid: "No support for display: grid and any of its properties",
  order: "order not supported in cohtml",
  autoMargins: "No support for auto margins",
  
  // Typography-related
  fontVariantNumeric: "No support for font-variant-numeric in cohtml",
  fontSmoothing: "No support for -webkit-font-smoothing in cohtml",
  wordBreak: "No support for word-break in cohtml",
  placeholders: "No support for placeholders in cohtml",
  
  // Misc
  resize: "No support for the resize property",
  userSelect: "No support for the select property in cohtml",
  appearance: "No support for appearance in cohtml",
  svgStyling: "SVG styling not supported in Gameface",
  overscroll: "No support for the overscroll-behavior",
  unknownClass: "unknown_class"
};

/**
 * Format error message template with replacements
 * @param {string} template - The error message template
 * @param {Object} replacements - Key-value pairs for template replacement
 * @returns {string} - Formatted error message
 */
function formatErrorMessage(template, replacements = {}) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return replacements[key] || match;
  });
}

/**
 * Generate error message for unsupported CSS property/value
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @param {string} reason - Specific reason for non-support
 * @param {string} note - Additional note
 * @returns {Object} - Error message object
 */
function generatePropertyValueError(property, value, reason, note) {
  return {
    message: formatErrorMessage(ERROR_TEMPLATES.UNSUPPORTED_CSS_VALUE, {
      property,
      value,
      reason
    }),
    property,
    value,
    reason,
    note
  };
}

/**
 * Generate error message for unsupported CSS property
 * @param {string} property - CSS property name
 * @param {string} reason - Specific reason for non-support
 * @param {string} note - Additional note
 * @returns {Object} - Error message object
 */
function generatePropertyError(property, reason, note) {
  return {
    message: formatErrorMessage(ERROR_TEMPLATES.UNSUPPORTED_CSS_PROPERTY, {
      property,
      reason
    }),
    property,
    reason,
    note
  };
}

/**
 * Generate error message for unsupported Tailwind class
 * @param {string} className - Tailwind class name
 * @param {string} type - Type of error (pattern, exact, property)
 * @param {string} reason - Specific reason for non-support
 * @returns {Object} - Error message object
 */
function generateTailwindClassError(className, type, reason) {
  const templates = {
    pattern: ERROR_TEMPLATES.TAILWIND_PATTERN_UNSUPPORTED,
    exact: ERROR_TEMPLATES.TAILWIND_EXACT_CLASS_UNSUPPORTED,
    property: ERROR_TEMPLATES.TAILWIND_PROPERTY_UNSUPPORTED
  };

  return {
    message: formatErrorMessage(templates[type] || ERROR_TEMPLATES.TAILWIND_UNSUPPORTED, {
      item: className,
      className,
      reason
    }),
    className,
    type,
    reason
  };
}

// ESLint rule message templates (for compatibility with existing rules)
const RULE_MESSAGES = {
  gamefaceUnsupported: ERROR_TEMPLATES.GAMEFACE_UNSUPPORTED,
  tailwindUnsupported: ERROR_TEMPLATES.TAILWIND_UNSUPPORTED,
  cssUnsupported: ERROR_TEMPLATES.CSS_UNSUPPORTED,
  gridNotSupported: ERROR_TEMPLATES.GRID_NOT_SUPPORTED,
  shadowNotSupported: ERROR_TEMPLATES.SHADOW_NOT_SUPPORTED,
  floatNotSupported: 'Float and clear properties are not supported by Gameface.',
  unsupportedValue: ERROR_TEMPLATES.UNSUPPORTED_VALUE,
  unsupportedProperty: ERROR_TEMPLATES.UNSUPPORTED_PROPERTY,
  unsupportedDisplayValue: ERROR_TEMPLATES.DISPLAY_NOT_SUPPORTED,
  unsupportedBorderStyle: ERROR_TEMPLATES.BORDER_STYLE_NOT_SUPPORTED,
  unsupportedGif: ERROR_TEMPLATES.GIF_NOT_SUPPORTED,
  flexBasisContent: 'flex-basis: content is not supported by Gameface'
};

module.exports = {
  ERROR_TEMPLATES,
  ERROR_REASONS,
  RULE_MESSAGES,
  formatErrorMessage,
  generatePropertyValueError,
  generatePropertyError,
  generateTailwindClassError
};