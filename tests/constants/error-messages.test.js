/**
 * Tests for error messages and formatting utilities
 */

const { 
  ERROR_TEMPLATES, 
  formatErrorMessage, 
  generatePropertyValueError, 
  generatePropertyError, 
  generateTailwindClassError 
} = require('../../lib/constants/error-messages');

describe('Error Messages', () => {
  describe('ERROR_TEMPLATES', () => {
    test('should contain all required message keys', () => {
      expect(ERROR_TEMPLATES.UNSUPPORTED_PROPERTY).toBeDefined();
      expect(ERROR_TEMPLATES.GRID_NOT_SUPPORTED).toBeDefined();
      expect(ERROR_TEMPLATES.UNKNOWN_CLASS).toBeDefined();
      expect(ERROR_TEMPLATES.GAMEFACE_UNSUPPORTED).toBeDefined();
    });

    test('should have consistent message format', () => {
      expect(ERROR_TEMPLATES.UNSUPPORTED_PROPERTY).toContain('{property}');
      expect(ERROR_TEMPLATES.UNSUPPORTED_VALUE).toContain('{value}');
      expect(ERROR_TEMPLATES.UNSUPPORTED_VALUE).toContain('{property}');
    });
  });

  describe('formatErrorMessage', () => {
    test('should replace placeholders with provided values', () => {
      const template = 'CSS property "{property}" with value "{value}" is not supported';
      const result = formatErrorMessage(template, { property: 'display', value: 'grid' });
      
      expect(result).toBe('CSS property "display" with value "grid" is not supported');
    });

    test('should leave unmatched placeholders unchanged', () => {
      const template = 'Property "{property}" with unknown "{unknown}" placeholder';
      const result = formatErrorMessage(template, { property: 'display' });
      
      expect(result).toBe('Property "display" with unknown "{unknown}" placeholder');
    });

    test('should handle empty replacements object', () => {
      const template = 'No placeholders here';
      const result = formatErrorMessage(template, {});
      
      expect(result).toBe('No placeholders here');
    });

    test('should handle no replacements parameter', () => {
      const template = 'Template with {placeholder}';
      const result = formatErrorMessage(template);
      
      expect(result).toBe('Template with {placeholder}');
    });

    test('should handle multiple occurrences of same placeholder', () => {
      const template = '{property} and {property} again';
      const result = formatErrorMessage(template, { property: 'display' });
      
      expect(result).toBe('display and display again');
    });
  });

  describe('Error Generation Functions', () => {
    test('generateTailwindClassError should format correctly with pattern type', () => {
      const result = generateTailwindClassError('grid-cols-3', 'pattern', 'CSS Grid is not supported');
      
      expect(result).toEqual({
        message: 'Tailwind class "grid-cols-3" matches an unsupported pattern: CSS Grid is not supported',
        className: 'grid-cols-3',
        type: 'pattern',
        reason: 'CSS Grid is not supported'
      });
    });

    test('generateTailwindClassError should use default template for unknown type', () => {
      const result = generateTailwindClassError('unknown-class', 'unknown', 'Unknown reason');
      
      expect(result).toEqual({
        message: 'Tailwind class "unknown-class" is not supported by Gameface',
        className: 'unknown-class',
        type: 'unknown',
        reason: 'Unknown reason'
      });
    });

    test('generatePropertyValueError should format property and value', () => {
      const result = generatePropertyValueError('display', 'grid', 'CSS Grid is not supported', 'Use flexbox instead');
      
      expect(result).toEqual({
        message: 'display with value "grid" is not supported by Gameface: CSS Grid is not supported',
        property: 'display',
        value: 'grid',
        reason: 'CSS Grid is not supported',
        note: 'Use flexbox instead'
      });
    });

    test('generatePropertyError should format property correctly', () => {
      const result = generatePropertyError('order', 'CSS order property is not supported');
      
      expect(result).toEqual({
        message: 'order is not supported by Gameface: CSS order property is not supported',
        property: 'order',
        reason: 'CSS order property is not supported',
        note: undefined
      });
    });
  });
});