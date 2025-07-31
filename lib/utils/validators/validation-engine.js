/**
 * Main validation engine that coordinates CSS and Tailwind validation
 * Provides a unified interface for all validation needs
 */

const { validateCSSProperties, shouldReportViolation: shouldReportCSSViolation } = require('./css-validator');
const { validateTailwindClasses, shouldReportViolation: shouldReportTailwindViolation } = require('./tailwind-validator');

/**
 * Validate both CSS properties and Tailwind classes
 * Returns consolidated violations from both validation systems
 */
function validateAll(cssProperties, tailwindClasses, context = {}) {
  const violations = [];

  // Validate CSS properties if provided
  if (cssProperties) {
    const cssViolations = validateCSSProperties(cssProperties, context)
      .filter(violation => shouldReportCSSViolation(violation, context));
    violations.push(...cssViolations);
  }

  // Validate Tailwind classes if provided
  if (tailwindClasses) {
    const tailwindViolations = validateTailwindClasses(tailwindClasses, context)
      .filter(violation => shouldReportTailwindViolation(violation, context));
    violations.push(...tailwindViolations);
  }

  return violations;
}

/**
 * Create validation context from ESLint rule options
 */
function createValidationContext(options = {}) {
  return {
    ignoreUnknown: options.ignoreUnknown || false,
    severity: options.severity || 'error',
    reportInfo: options.reportInfo || false,
    ...options
  };
}

module.exports = {
  validateAll,
  validateCSSProperties,
  validateTailwindClasses,
  shouldReportCSSViolation,
  shouldReportTailwindViolation,
  createValidationContext
};