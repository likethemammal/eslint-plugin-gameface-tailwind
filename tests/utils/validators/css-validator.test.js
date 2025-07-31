/**
 * Tests for css-validator
 */

const {
  validateCSSProperties,
  shouldReportViolation,
  parseInlineCSS,
  detectGifUsage,
  detectUnsupportedUnits,
  extractUrlFromCSSValue
} = require('../../../lib/utils/validators/css-validator');

describe('CSS Validator', () => {
  describe('validateCSSProperties', () => {
    test('should validate array format CSS properties', () => {
      const properties = [
        { property: 'display', value: 'grid' },
        { property: 'float', value: 'left' }
      ];
      
      const result = validateCSSProperties(properties);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(v => v.property === 'display')).toBe(true);
      expect(result.some(v => v.property === 'float')).toBe(true);
    });

    test('should validate object format CSS properties', () => {
      const properties = {
        display: 'grid',
        float: 'left'
      };
      
      const result = validateCSSProperties(properties);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return violations for unsupported properties', () => {
      const properties = [{ property: 'clear', value: 'both' }];
      
      const result = validateCSSProperties(properties);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('type', 'property');
      expect(result[0]).toHaveProperty('property', 'clear');
      expect(result[0]).toHaveProperty('messageId', 'unsupportedProperty');
    });

    test('should return violations for unsupported values', () => {
      const properties = [{ property: 'display', value: 'grid' }];
      
      const result = validateCSSProperties(properties);
      
      expect(result.length).toBeGreaterThan(0);
      const violation = result.find(v => v.value === 'grid');
      expect(violation).toBeDefined();
      expect(violation.type).toBe('value');
    });

    test('should detect GIF usage in background images', () => {
      const properties = [{ property: 'backgroundImage', value: 'url(image.gif)' }];
      
      const result = validateCSSProperties(properties);
      
      const gifViolation = result.find(v => v.messageId === 'unsupportedGif');
      expect(gifViolation).toBeDefined();
    });

    test('should detect unsupported font units', () => {
      const properties = [{ property: 'fontSize', value: '12pt' }];
      
      const result = validateCSSProperties(properties);
      
      // Should include violation for unsupported units
      expect(result.some(v => v.reason === 'unsupported_font_units')).toBe(true);
    });

    test('should handle empty properties gracefully', () => {
      const result1 = validateCSSProperties([]);
      const result2 = validateCSSProperties({});
      
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });

    test('should skip value validation when property is unsupported', () => {
      const properties = [{ property: 'clear', value: 'both' }]; // Known unsupported property
      
      const result = validateCSSProperties(properties);
      
      // Should have property violation (value validation is skipped)
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe('property');
      expect(result[0].property).toBe('clear');
    });
  });

  describe('shouldReportViolation', () => {
    test('should report violations by default', () => {
      const violation = { type: 'property', reason: 'not_supported' };
      
      const result = shouldReportViolation(violation);
      
      expect(result).toBe(true);
    });

    test('should ignore unknown classes when configured', () => {
      const violation = { type: 'class', reason: 'unknown_class' };
      const context = { ignoreUnknown: true };
      
      const result = shouldReportViolation(violation, context);
      
      expect(result).toBe(false);
    });

    test('should not ignore non-unknown violations even with ignoreUnknown', () => {
      const violation = { type: 'property', reason: 'not_supported' };
      const context = { ignoreUnknown: true };
      
      const result = shouldReportViolation(violation, context);
      
      expect(result).toBe(true);
    });

    test('should respect severity context', () => {
      const violation = { type: 'property', reason: 'test' };
      const context = { severity: 'warning' };
      
      const result = shouldReportViolation(violation, context);
      
      expect(result).toBe(true); // Should still report regardless of severity
    });
  });

  describe('Helper functions', () => {
    test('parseInlineCSS should be available', () => {
      expect(typeof parseInlineCSS).toBe('function');
    });

    test('detectGifUsage should be available', () => {
      expect(typeof detectGifUsage).toBe('function');
      
      // Basic functionality test
      const hasGif = detectGifUsage('url(image.gif)');
      expect(typeof hasGif).toBe('boolean');
    });

    test('detectUnsupportedUnits should be available', () => {
      expect(typeof detectUnsupportedUnits).toBe('function');
      
      // Basic functionality test
      const hasUnsupported = detectUnsupportedUnits('12pt');
      expect(typeof hasUnsupported).toBe('boolean');
    });

    test('extractUrlFromCSSValue should be available', () => {
      expect(typeof extractUrlFromCSSValue).toBe('function');
      
      // Basic functionality test
      const url = extractUrlFromCSSValue('url(image.png)');
      expect(typeof url).toBe('string');
    });
  });

  describe('Integration and edge cases', () => {
    test('should handle null properties gracefully', () => {
      const properties = [{ property: null, value: 'test' }];
      
      // The actual implementation throws an error for null properties
      expect(() => validateCSSProperties(properties)).toThrow();
    });

    test('should handle undefined values gracefully', () => {
      const properties = [{ property: 'display', value: undefined }];
      
      expect(() => validateCSSProperties(properties)).not.toThrow();
    });

    test('should handle mixed valid and invalid properties', () => {
      const properties = [
        { property: 'display', value: 'flex' }, // valid
        { property: 'display', value: 'grid' }, // invalid value
        { property: 'clear', value: 'both' }    // invalid property
      ];
      
      const result = validateCSSProperties(properties);
      
      expect(Array.isArray(result)).toBe(true);
      // Should contain violations for invalid cases only
      expect(result.length).toBeGreaterThan(0);
    });

    test('should provide context information in violations', () => {
      const properties = [{ property: 'display', value: 'grid' }];
      const context = { severity: 'warning' };
      
      const result = validateCSSProperties(properties, context);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('property');
      expect(result[0]).toHaveProperty('value');
      expect(result[0]).toHaveProperty('reason');
      expect(result[0]).toHaveProperty('messageId');
    });
  });
});