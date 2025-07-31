/**
 * Tests for validation helpers used in rules
 */

const {
  validateTailwindClasses,
  validateCSSProperties,
  formatTailwindErrorMessage,
  formatCSSErrorMessage,
  getSeverityForReason,
  shouldReportViolation
} = require('../../../lib/utils/helpers/validation-helpers');

describe('validation-helpers', () => {
  describe('validateTailwindClasses', () => {
    test('should identify supported classes', () => {
      const violations = validateTailwindClasses('flex p-4 text-center');
      expect(violations).toHaveLength(0);
    });

    test('should identify unsupported classes', () => {
      const violations = validateTailwindClasses('grid float-left shadow-lg');
      expect(violations.length).toBeGreaterThan(0);
      expect(violations.some(v => v.className === 'grid')).toBe(true);
      expect(violations.some(v => v.className === 'float-left')).toBe(true);
      expect(violations.some(v => v.className === 'shadow-lg')).toBe(true);
    });

    test('should handle empty input', () => {
      expect(validateTailwindClasses('')).toEqual([]);
      expect(validateTailwindClasses(null)).toEqual([]);
      expect(validateTailwindClasses(undefined)).toEqual([]);
    });
  });

  describe('validateCSSProperties', () => {
    test('should identify supported properties', () => {
      const properties = [
        { property: 'display', value: 'flex', node: {} },
        { property: 'padding', value: '1rem', node: {} }
      ];
      const violations = validateCSSProperties(properties);
      expect(violations).toHaveLength(0);
    });

    test('should identify unsupported properties', () => {
      const properties = [
        { property: 'display', value: 'grid', node: {} },
        { property: 'float', value: 'left', node: {} }
      ];
      const violations = validateCSSProperties(properties);
      expect(violations.length).toBeGreaterThan(0);
    });
  });

  describe('formatTailwindErrorMessage', () => {
    test('should format error messages correctly', () => {
      const message = formatTailwindErrorMessage('grid', 'CSS Grid is not supported');
      expect(message).toContain('grid');
      expect(message).toContain('not supported');
    });
  });

  describe('getSeverityForReason', () => {
    test('should return correct severity levels', () => {
      expect(getSeverityForReason('CSS Grid is not supported')).toBe('error');
      expect(getSeverityForReason('unknown_class')).toBe('error');
      expect(getSeverityForReason('Limited display support')).toBe('warning');
      expect(getSeverityForReason('background-attachment: fixed not supported')).toBe('warning');
    });

    test('should handle edge cases', () => {
      expect(getSeverityForReason(null)).toBe('error');
      expect(getSeverityForReason(undefined)).toBe('error');
      expect(getSeverityForReason('')).toBe('error');
    });

    test('should handle case-insensitive matching', () => {
      expect(getSeverityForReason('LIMITED support')).toBe('warning');
      expect(getSeverityForReason('ATTACHMENT not supported')).toBe('warning');
      expect(getSeverityForReason('Partial support only')).toBe('warning');
      expect(getSeverityForReason('FALLBACK used')).toBe('warning');
    });
  });

  describe('shouldReportViolation', () => {
    test('should respect ignoreUnknown option', () => {
      const violation = { reason: 'unknown_class', severity: 'error' };
      
      expect(shouldReportViolation(violation, { ignoreUnknown: false })).toBe(true);
      expect(shouldReportViolation(violation, { ignoreUnknown: true })).toBe(false);
    });

    test('should respect severity filtering', () => {
      const warning = { reason: 'some reason', severity: 'warning' };
      const error = { reason: 'some reason', severity: 'error' };
      
      expect(shouldReportViolation(warning, { severity: 'warning' })).toBe(true);
      expect(shouldReportViolation(warning, { severity: 'error' })).toBe(false);
      expect(shouldReportViolation(error, { severity: 'error' })).toBe(true);
    });

    test('should handle violations without explicit severity', () => {
      const violationWithoutSeverity = { reason: 'Limited support' };
      
      expect(shouldReportViolation(violationWithoutSeverity, { severity: 'warning' })).toBe(true);
      expect(shouldReportViolation(violationWithoutSeverity, { severity: 'error' })).toBe(false);
    });

    test('should handle default options', () => {
      const violation = { reason: 'some error' };
      
      expect(shouldReportViolation(violation)).toBe(true);
      expect(shouldReportViolation(violation, {})).toBe(true);
    });

    test('should handle non-unknown violations with ignoreUnknown', () => {
      const violation = { reason: 'not_supported' };
      
      expect(shouldReportViolation(violation, { ignoreUnknown: true })).toBe(true);
    });
  });
});