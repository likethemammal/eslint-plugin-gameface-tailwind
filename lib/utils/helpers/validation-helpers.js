/**
 * Validation helper utilities - Legacy compatibility layer
 * This file provides backwards compatibility for existing code
 * New code should use the validators directly
 */

const { validateTailwindClasses, validateCSSProperties } = require('../validators/validation-engine');

/**
 * Format error message for Tailwind classes
 */
function formatTailwindErrorMessage(className, reason) {
  return `Class "${className}" is not supported: ${reason}`;
}

/**
 * Format error message for CSS properties
 */
function formatCSSErrorMessage(property, reason) {
  return `CSS property "${property}" is not supported: ${reason}`;
}

/**
 * Get severity level based on reason
 */
function getSeverityForReason(reason) {
  if (!reason) return 'error';
  
  // Convert to lowercase for case-insensitive matching
  const lowerReason = reason.toLowerCase();
  
  // Warning-level issues
  if (lowerReason.includes('limited') || 
      lowerReason.includes('attachment') ||
      lowerReason.includes('partial') ||
      lowerReason.includes('fallback')) {
    return 'warning';
  }
  
  // Error-level issues (default)
  return 'error';
}

/**
 * Check if violation should be reported based on options
 */
function shouldReportViolation(violation, options = {}) {
  const { ignoreUnknown = false, severity = 'error' } = options;
  
  // Skip unknown classes if configured to ignore them
  if (ignoreUnknown && violation.reason === 'unknown_class') {
    return false;
  }
  
  // Filter by severity level - use violation's severity if available, otherwise determine from reason
  const violationSeverity = violation.severity || getSeverityForReason(violation.reason);
  if (severity === 'error' && violationSeverity === 'warning') {
    return false;
  }
  
  return true;
}

// Re-export for backwards compatibility
module.exports = {
  validateTailwindClasses,
  validateCSSProperties,
  formatTailwindErrorMessage,
  formatCSSErrorMessage,
  getSeverityForReason,
  shouldReportViolation
};