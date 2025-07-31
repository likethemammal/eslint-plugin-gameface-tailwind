/**
 * Tailwind CSS validation engine for Gameface/Coherent UI
 * Refactored from the original getGamefaceTailwindSupport function
 */

const {
  TAILWIND_SPECIAL_CLASS_RULES,
  TAILWIND_COMPREHENSIVE_PATTERN_RULES,
  TAILWIND_ARRAY_PROPERTY_RULES,
  TAILWIND_GRID_RULES,
  checkPatternRules,
  checkExactClassRules,
  checkPropertyRules
} = require('../../constants/tailwind-rules');

/**
 * Validate a Tailwind class against Gameface support rules
 * @param {string} className - The Tailwind class to validate
 * @param {Object} cssProperty - The parsed CSS property object
 * @returns {Object} - Validation result with supported status and reason
 */
function validateTailwindClass(className, cssProperty = null) {
  if (!className || typeof className !== 'string') {
    return { supported: false, reason: 'invalid_class' };
  }

  // 0. Check for responsive prefixes first
  const responsivePrefixes = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];
  const hasResponsivePrefix = responsivePrefixes.some(prefix => className.startsWith(prefix));
  if (hasResponsivePrefix) {
    return {
      supported: false,
      reason: 'Responsive breakpoint prefixes are not supported by Gameface. Media query selectors cannot be processed.',
      note: 'Gameface does not support @media queries or responsive design patterns'
    };
  }

  // 1. Check pattern-based rules first
  const patternResult = checkPatternRules(className);
  if (patternResult) {
    return {
      supported: patternResult.supported,
      reason: patternResult.reason,
      note: patternResult.note
    };
  }

  // 1.5. Check comprehensive pattern rules for color classes and auto margins
  for (const [ruleName, rule] of Object.entries(TAILWIND_COMPREHENSIVE_PATTERN_RULES)) {
    if (rule.pattern && rule.pattern.test(className)) {
      return {
        supported: rule.supported,
        reason: rule.reason,
        note: rule.note
      };
    }
  }

  // 2. Check exact class name rules
  const exactResult = checkExactClassRules(className);
  if (exactResult) {
    return {
      supported: exactResult.supported,
      reason: exactResult.reason,
      note: exactResult.note
    };
  }

  // 3. If no CSS property provided, try to get it
  if (!cssProperty) {
    return { supported: false, reason: 'unknown_class' };
  }

  // 4. Check special class-property combinations
  const specialRule = TAILWIND_SPECIAL_CLASS_RULES[className];
  if (specialRule) {
    return {
      supported: specialRule.supported,
      reason: specialRule.reason,
      note: specialRule.note
    };
  }

  // 5. Handle array properties (like mx-auto)
  if (Array.isArray(cssProperty)) {
    return validateArrayProperties(cssProperty);
  }

  // 6. Check grid-specific rules
  for (const [ruleKey, rule] of Object.entries(TAILWIND_GRID_RULES)) {
    if (rule.condition(className) || (cssProperty && rule.condition(cssProperty.property))) {
      return {
        supported: rule.supported,
        reason: rule.reason
      };
    }
  }

  // 7. Check property-based rules
  if (cssProperty) {
    const propertyResult = checkPropertyRules(cssProperty.property, cssProperty.value, className);
    if (propertyResult) {
      return {
        supported: propertyResult.supported,
        reason: propertyResult.reason,
        note: propertyResult.note
      };
    }
  }

  // 8. Default to supported if all checks pass
  return { supported: true };
}


/**
 * Validate array of CSS properties (like mx-auto)
 * @param {Array} cssProperties - Array of CSS property objects
 * @returns {Object} - Validation result
 */
function validateArrayProperties(cssProperties) {
  for (const prop of cssProperties) {
    for (const [ruleName, rule] of Object.entries(TAILWIND_ARRAY_PROPERTY_RULES)) {
      if (rule.condition(prop)) {
        return {
          supported: rule.supported,
          reason: rule.reason
        };
      }
    }
  }
  return { supported: true }; // If no issues found with array
}


/**
 * Check if a CSS property is related to grid
 * @param {string} property - The CSS property name
 * @returns {boolean} - Whether it's a grid property
 */
function isGridProperty(property) {
  return property && property.includes('grid');
}

/**
 * Check if a class name is a responsive variant
 * @param {string} className - The class name to check
 * @returns {boolean} - Whether it's a responsive variant
 */
function isResponsiveVariant(className) {
  return /^(sm|md|lg|xl|2xl):/.test(className);
}

/**
 * Check if a class name is a pseudo-class variant
 * @param {string} className - The class name to check  
 * @returns {boolean} - Whether it's a pseudo-class variant
 */
function isPseudoClassVariant(className) {
  return /^(hover|focus|active|visited|disabled|first|last|odd|even|focus-within|group-hover):/.test(className);
}

/**
 * Extract base class name from variant (remove responsive/pseudo-class prefixes)
 * @param {string} className - The class name to process
 * @returns {string} - Base class name without variants
 */
function extractBaseClassName(className) {
  // Remove responsive prefixes
  let baseClass = className.replace(/^(sm|md|lg|xl|2xl):/, '');
  
  // Remove pseudo-class prefixes
  baseClass = baseClass.replace(/^(hover|focus|active|visited|disabled|first|last|odd|even|focus-within|group-hover):/, '');
  
  return baseClass;
}

const { parseTailwindClasses, getGamefaceTailwindSupport } = require('../parsers/tailwind-parser');

/**
 * Validate Tailwind classes and return violations
 */
function validateTailwindClasses(classString, context = {}) {
  if (!classString || typeof classString !== 'string') {
    return [];
  }

  const violations = [];
  const classes = parseTailwindClasses(classString);

  for (const className of classes) {
    // Skip empty classes
    if (!className.trim()) {
      continue;
    }

    // Get Tailwind class support information
    const support = getGamefaceTailwindSupport(className);

    if (!support.supported) {
      violations.push({
        type: 'class',
        className,
        reason: support.reason,
        note: support.note,
        messageId: 'tailwindUnsupported'
      });
    } else if (support.note) {
      // Add informational note for conditionally supported classes
      violations.push({
        type: 'info',
        className,
        reason: support.note,
        messageId: 'tailwindConditional'
      });
    }
  }

  return violations;
}

/**
 * Check if Tailwind violation should be reported based on context
 */
function shouldReportViolation(violation, context = {}) {
  const { ignoreUnknown = false, severity = 'error', reportInfo = false, ignoreClasses = [] } = context;

  // Skip classes in the ignore list
  if (ignoreClasses.includes(violation.className)) {
    return false;
  }

  // Skip unknown classes if configured to ignore them
  if (ignoreUnknown && violation.reason === 'unknown_class') {
    return false;
  }

  // Skip info-level violations unless explicitly requested
  if (violation.type === 'info' && !reportInfo) {
    return false;
  }

  return true;
}

module.exports = {
  validateTailwindClass,
  validateTailwindClasses,
  shouldReportViolation,
  validateArrayProperties,
  isGridProperty,
  isResponsiveVariant,
  isPseudoClassVariant,
  extractBaseClassName
};