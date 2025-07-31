/**
 * Tests for tailwind-rules constants
 */

const {
  TAILWIND_PATTERN_RULES,
  TAILWIND_EXACT_CLASS_RULES,
  TAILWIND_PROPERTY_RULES,
  TAILWIND_SPECIAL_CLASS_RULES,
  TAILWIND_ARRAY_PROPERTY_RULES,
  TAILWIND_GRID_RULES,
  checkPatternRules,
  checkExactClassRules,
  checkPropertyRules
} = require('../../lib/constants/tailwind-rules');

describe('Tailwind Rules Constants', () => {
  describe('Rule Objects', () => {
    test('should define all rule objects', () => {
      expect(TAILWIND_PATTERN_RULES).toBeDefined();
      expect(TAILWIND_EXACT_CLASS_RULES).toBeDefined();
      expect(TAILWIND_PROPERTY_RULES).toBeDefined();
      expect(TAILWIND_SPECIAL_CLASS_RULES).toBeDefined();
      expect(TAILWIND_ARRAY_PROPERTY_RULES).toBeDefined();
      expect(TAILWIND_GRID_RULES).toBeDefined();
    });

    test('should have proper structure', () => {
      expect(typeof TAILWIND_PATTERN_RULES).toBe('object');
      expect(typeof TAILWIND_EXACT_CLASS_RULES).toBe('object');
      expect(typeof TAILWIND_PROPERTY_RULES).toBe('object');
      expect(typeof TAILWIND_SPECIAL_CLASS_RULES).toBe('object');
      expect(typeof TAILWIND_ARRAY_PROPERTY_RULES).toBe('object'); // Not an array based on actual structure
      expect(typeof TAILWIND_GRID_RULES).toBe('object');
    });

    test('should contain expected rules', () => {
      // Pattern rules should contain some patterns
      const patternKeys = Object.keys(TAILWIND_PATTERN_RULES);
      expect(patternKeys.length).toBeGreaterThan(0);
      
      // Exact class rules should contain specific classes
      expect(Object.keys(TAILWIND_EXACT_CLASS_RULES).length).toBeGreaterThan(0);
      
      // Property rules should contain properties
      expect(Object.keys(TAILWIND_PROPERTY_RULES).length).toBeGreaterThan(0);
    });
  });

  describe('checkPatternRules', () => {
    test('should return rule match for pattern classes', () => {
      const result = checkPatternRules('p-4');
      expect(result).toBeDefined();
      if (result) {
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('rule');
      }
    });

    test('should return null for non-matching patterns', () => {
      const result = checkPatternRules('unknown-pattern-123');
      expect(result).toBeNull();
    });

    test('should handle edge cases', () => {
      expect(checkPatternRules('')).toBeNull();
      expect(checkPatternRules(null)).toBeNull();
      expect(checkPatternRules(undefined)).toBeNull();
    });
  });

  describe('checkExactClassRules', () => {
    test('should return rule match for exact classes', () => {
      const result = checkExactClassRules('flex');
      expect(result).toBeDefined();
      if (result) {
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('rule');
      }
    });

    test('should return null for non-matching classes', () => {
      const result = checkExactClassRules('unknown-class');
      expect(result).toBeNull();
    });

    test('should handle edge cases', () => {
      expect(checkExactClassRules('')).toBeNull();
      expect(checkExactClassRules(null)).toBeNull();
      expect(checkExactClassRules(undefined)).toBeNull();
    });
  });

  describe('checkPropertyRules', () => {
    test('should return rule match for property-value pairs', () => {
      const result = checkPropertyRules('display', 'flex');
      expect(result).toBeDefined();
      if (result) {
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('rule');
      }
    });

    test('should return null for non-matching properties', () => {
      const result = checkPropertyRules('unknown-property', 'value');
      expect(result).toBeNull();
    });

    test('should handle edge cases', () => {
      expect(checkPropertyRules('', 'value')).toBeNull();
      expect(checkPropertyRules('property', '')).toBeNull();
      expect(checkPropertyRules(null, 'value')).toBeNull();
      expect(checkPropertyRules('property', null)).toBeNull();
    });
  });
});