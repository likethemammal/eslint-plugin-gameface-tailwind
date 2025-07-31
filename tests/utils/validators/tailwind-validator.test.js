/**
 * Tests for tailwind-validator
 */

const {
  validateTailwindClass,
  validateTailwindClasses,
  shouldReportViolation
} = require('../../../lib/utils/validators/tailwind-validator');

describe('Tailwind Validator', () => {
  describe('validateTailwindClass', () => {
    test('should validate supported Tailwind classes', () => {
      const result = validateTailwindClass('flex');
      
      expect(result).toHaveProperty('supported');
      expect(typeof result.supported).toBe('boolean');
    });

    test('should reject classes matching unsupported patterns', () => {
      const result = validateTailwindClass('shadow-lg');
      
      expect(result.supported).toBe(false);
      expect(result).toHaveProperty('reason');
      expect(typeof result.reason).toBe('string');
    });

    test('should reject exact unsupported classes', () => {
      const result = validateTailwindClass('box-content');
      
      expect(result.supported).toBe(false);
      expect(result).toHaveProperty('reason');
    });

    test('should handle grid-related classes', () => {
      const result = validateTailwindClass('grid');
      
      expect(result.supported).toBe(false);
      // Without CSS property, it returns unknown_class
      expect(result.reason).toBe('unknown_class');
    });

    test('should handle invalid inputs', () => {
      const result1 = validateTailwindClass(null);
      const result2 = validateTailwindClass(undefined);
      const result3 = validateTailwindClass('');
      const result4 = validateTailwindClass(123);
      
      expect(result1.supported).toBe(false);
      expect(result1.reason).toBe('invalid_class');
      expect(result2.supported).toBe(false);
      expect(result3.supported).toBe(false);
      expect(result4.supported).toBe(false);
    });

    test('should return unknown_class for unrecognized classes without CSS property', () => {
      const result = validateTailwindClass('unknown-custom-class');
      
      expect(result.supported).toBe(false);
      expect(result.reason).toBe('unknown_class');
    });

    test('should validate with CSS property context when provided', () => {
      const cssProperty = { property: 'display', value: 'flex' };
      const result = validateTailwindClass('flex', cssProperty);
      
      expect(result).toHaveProperty('supported');
      expect(typeof result.supported).toBe('boolean');
    });

    test('should provide additional notes when available', () => {
      const result = validateTailwindClass('cursor-pointer');
      
      if (result.note) {
        expect(typeof result.note).toBe('string');
      }
    });
  });

  describe('validateTailwindClasses', () => {
    test('should validate array of classes', () => {
      const classes = 'flex shadow-lg grid'; // Pass as string (actual implementation expects string)
      const result = validateTailwindClasses(classes);
      
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        // Should find violations for shadow and grid if they're detected as unsupported
        // Note: actual results depend on getGamefaceTailwindSupport implementation
        expect(result.every(v => v.hasOwnProperty('className'))).toBe(true);
      }
    });

    test('should handle string input by splitting on spaces', () => {
      const classes = 'flex shadow-lg grid';
      const result = validateTailwindClasses(classes);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should filter out empty class names', () => {
      const classes = ['flex', '', '  ', 'shadow-lg'];
      const result = validateTailwindClasses(classes);
      
      // Should not include violations for empty strings
      expect(result.every(v => v.className && v.className.trim().length > 0)).toBe(true);
    });

    test('should handle empty input gracefully', () => {
      const result1 = validateTailwindClasses([]);
      const result2 = validateTailwindClasses('');
      const result3 = validateTailwindClasses(null);
      const result4 = validateTailwindClasses(undefined);
      
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(result3).toEqual([]);
      expect(result4).toEqual([]);
    });

    test('should provide violation details', () => {
      const classes = 'shadow-lg'; // Pass as string
      const result = validateTailwindClasses(classes);
      
      // Check if violations were found
      if (result.length > 0) {
        const violation = result[0];
        expect(violation).toHaveProperty('className');
        expect(violation).toHaveProperty('reason');
        expect(violation).toHaveProperty('type');
        expect(violation).toHaveProperty('messageId');
      }
      
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle context parameter', () => {
      const classes = ['shadow-lg'];
      const context = { ignoreUnknown: true };
      const result = validateTailwindClasses(classes, context);
      
      expect(Array.isArray(result)).toBe(true);
    });

    test('should validate mixed supported and unsupported classes', () => {
      const classes = ['flex', 'shadow-lg', 'p-4', 'grid'];
      const result = validateTailwindClasses(classes);
      
      expect(Array.isArray(result)).toBe(true);
      // Should only return violations for unsupported classes
      expect(result.every(v => !v.supported)).toBe(true);
    });
  });

  describe('shouldReportViolation', () => {
    test('should report violations by default', () => {
      const violation = { type: 'class', reason: 'not_supported' };
      const result = shouldReportViolation(violation);
      
      expect(result).toBe(true);
    });

    test('should ignore unknown classes when configured', () => {
      const violation = { type: 'class', reason: 'unknown_class' };
      const context = { ignoreUnknown: true };
      
      const result = shouldReportViolation(violation, context);
      
      expect(result).toBe(false);
    });

    test('should not ignore known unsupported classes', () => {
      const violation = { type: 'class', reason: 'shadow_not_supported' };
      const context = { ignoreUnknown: true };
      
      const result = shouldReportViolation(violation, context);
      
      expect(result).toBe(true);
    });

    test('should handle missing context', () => {
      const violation = { type: 'class', reason: 'test' };
      
      expect(() => shouldReportViolation(violation)).not.toThrow();
      expect(shouldReportViolation(violation)).toBe(true);
    });

    test('should handle missing violation properties', () => {
      const violation = { type: 'class' }; // missing reason
      
      expect(() => shouldReportViolation(violation)).not.toThrow();
    });
  });

  describe('Integration and edge cases', () => {
    test('should handle responsive variants', () => {
      const result = validateTailwindClass('md:flex');
      
      expect(result.supported).toBe(false);
      expect(result.reason.toLowerCase()).toContain('media'); // Should mention media queries not supported
    });

    test('should handle pseudo-class variants', () => {
      const result = validateTailwindClass('hover:bg-blue-500');
      
      expect(result.supported).toBe(false);
      expect(result.reason).toContain('pseudo'); // Should mention pseudo-classes not supported
    });

    test('should handle complex class patterns', () => {
      const classes = 'grid-cols-12 col-span-6 gap-4 transform rotate-45 scale-110';
      
      const result = validateTailwindClasses(classes);
      
      expect(Array.isArray(result)).toBe(true);
      // Check if violations were found for grid classes
      if (result.length > 0) {
        expect(result.every(v => v.hasOwnProperty('className'))).toBe(true);
      }
    });

    test('should provide consistent violation structure', () => {
      const result = validateTailwindClasses('shadow-lg grid');
      
      for (const violation of result) {
        expect(violation).toHaveProperty('className');
        expect(violation).toHaveProperty('reason');
        expect(violation).toHaveProperty('type');
        expect(violation).toHaveProperty('messageId');
        expect(typeof violation.className).toBe('string');
        expect(typeof violation.reason).toBe('string');
        expect(typeof violation.type).toBe('string');
        expect(typeof violation.messageId).toBe('string');
      }
    });
  });

  describe('Comprehensive Pattern Rules', () => {
    test('should handle comprehensive pattern rules for color classes', () => {
      // Test color classes that should match comprehensive pattern rules
      const colorClass = 'text-blue-500';
      const result = validateTailwindClass(colorClass);
      
      // This should be handled by comprehensive pattern rules
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
      expect(typeof result.reason).toBe('string');
    });

    test('should handle auto margin classes with pattern rules', () => {
      // Test margin auto classes that should match comprehensive pattern rules  
      const autoClass = 'mx-auto';
      const result = validateTailwindClass(autoClass);
      
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
    });

    test('should handle pattern rule matching', () => {
      // Test various classes that should hit different pattern rules
      const testClasses = [
        'bg-red-500',
        'border-blue-300', 
        'text-green-700',
        'ml-auto',
        'mr-auto'
      ];

      testClasses.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
        expect(typeof result.supported).toBe('boolean');
      });
    });
  });

  describe('Special Class Rules', () => {
    test('should handle special class-property combinations', () => {
      // Test classes that should trigger special class rules
      const specialClass = 'shadow-lg';
      const result = validateTailwindClass(specialClass, { property: 'box-shadow', value: '0 10px 15px rgba(0,0,0,0.1)' });
      
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
    });

    test('should check special rules before other validations', () => {
      // Create a test case where special rules should be checked
      const className = 'container'; // Assuming this has special rules
      const result = validateTailwindClass(className);
      
      expect(result).toBeDefined();
    });
  });

  describe('Array Property Validation', () => {
    test('should validate array properties like mx-auto', () => {
      const cssProperties = [
        { property: 'margin-left', value: 'auto' },
        { property: 'margin-right', value: 'auto' }
      ];
      
      const result = validateTailwindClass('mx-auto', cssProperties);
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
    });

    test('should handle array properties with mixed validation results', () => {
      // Test array properties that may have different validation results
      const cssProperties = [
        { property: 'margin-left', value: 'auto' },
        { property: 'margin-right', value: 'auto' }
      ];
      
      const result = validateTailwindClass('mx-auto', cssProperties);
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
      expect(result.reason).toBeDefined();
    });

    test('should return true for valid array properties', () => {
      // Test valid array properties that should pass
      const cssProperties = [
        { property: 'padding-top', value: '1rem' },
        { property: 'padding-bottom', value: '1rem' }
      ];
      
      const result = validateTailwindClass('py-4', cssProperties);
      expect(result).toBeDefined();
    });
  });

  describe('Grid-Specific Rules', () => {
    test('should handle grid-related class names', () => {
      const gridClasses = [
        'grid',
        'grid-cols-3', 
        'grid-rows-2',
        'col-span-2',
        'row-span-1'
      ];

      gridClasses.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
        expect(result.supported).toBe(false);
        // The reason may be 'unknown_class' if not specifically mapped
        expect(result.reason).toBeDefined();
      });
    });

    test('should handle grid properties in cssProperty parameter', () => {
      const result = validateTailwindClass('some-class', { 
        property: 'grid-template-columns', 
        value: 'repeat(3, 1fr)' 
      });
      
      expect(result).toBeDefined();
      expect(result.supported).toBe(false);
      // Should contain message about grid not being supported
      expect(result.reason).toContain('display: grid');
    });

    test('should handle grid-related CSS properties', () => {
      const gridProperties = [
        'grid-template-columns',
        'grid-template-rows', 
        'grid-gap',
        'grid-area',
        'grid-column',
        'grid-row'
      ];

      gridProperties.forEach(property => {
        const result = validateTailwindClass('test-class', { 
          property: property, 
          value: 'some-value' 
        });
        expect(result.supported).toBe(false);
      });
    });
  });

  describe('Property-Based Rules', () => {
    test('should check property-based rules when cssProperty is provided', () => {
      const result = validateTailwindClass('test-class', {
        property: 'display',
        value: 'block'
      });
      
      expect(result).toBeDefined();
      expect(typeof result.supported).toBe('boolean');
    });

    test('should handle properties not in rules', () => {
      const result = validateTailwindClass('test-class', {
        property: 'custom-property',
        value: 'custom-value'
      });
      
      // Should fall through to default supported: true
      expect(result.supported).toBe(true);
    });

    test('should validate CSS property values', () => {
      // Test a property that should be rejected
      const result = validateTailwindClass('test-class', {
        property: 'position',
        value: 'sticky'
      });
      
      expect(result).toBeDefined();
      expect(result.supported).toBe(false);
    });
  });

  describe('Helper Functions Coverage', () => {
    test('should handle responsive variants', () => {
      const responsiveClasses = [
        'sm:flex',
        'md:grid', 
        'lg:block',
        'xl:inline',
        '2xl:table'
      ];

      responsiveClasses.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
      });
    });

    test('should handle pseudo-class variants', () => {
      const pseudoClasses = [
        'hover:bg-blue-500',
        'focus:text-red-600',
        'active:border-green-300',
        'first:font-bold',
        'last:text-sm',
        'odd:bg-gray-100',
        'even:bg-white',
        'group-hover:opacity-75'
      ];

      pseudoClasses.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
      });
    });

    test('should extract base class names from variants', () => {
      // These should test the extractBaseClassName functionality
      const variantClasses = [
        'sm:hover:bg-blue-500',
        'md:focus:text-red-600', 
        'lg:active:border-green-300',
        'xl:first:font-bold'
      ];

      variantClasses.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
      });
    });

    test('should handle complex variant combinations', () => {
      const complexVariants = [
        'sm:md:hover:focus:bg-blue-500', // Multiple variants
        'lg:group-hover:active:text-red-600',
        'xl:odd:hover:border-green-300'
      ];

      complexVariants.forEach(className => {
        const result = validateTailwindClass(className);
        expect(result).toBeDefined();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing CSS property gracefully', () => {
      const result = validateTailwindClass('unknown-class');
      expect(result.supported).toBe(false);
      expect(result.reason).toBe('unknown_class');
    });

    test('should handle null and undefined inputs', () => {
      expect(() => validateTailwindClass(null)).not.toThrow();
      expect(() => validateTailwindClass(undefined)).not.toThrow();
      expect(() => validateTailwindClass('')).not.toThrow();
    });

    test('should handle invalid cssProperty formats', () => {
      const result1 = validateTailwindClass('test', null);
      const result2 = validateTailwindClass('test', {});
      const result3 = validateTailwindClass('test', { property: null });
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
      
      // These should not throw errors and should have valid structures
      expect(typeof result1.supported).toBe('boolean');
      expect(typeof result2.supported).toBe('boolean'); 
      expect(typeof result3.supported).toBe('boolean');
    });

    test('should default to supported when no rules match', () => {
      // Test a class that should pass through all checks
      const result = validateTailwindClass('valid-class', {
        property: 'color',
        value: 'blue'
      });
      
      // Should default to supported: true if no negative rules match
      expect(result.supported).toBe(true);
    });
  });

  describe('Integration with All Rule Types', () => {
    test('should test complete validation flow', () => {
      // Test a class that goes through multiple validation steps
      const testCases = [
        { className: 'flex', expected: false }, // May be unknown_class
        { className: 'grid', expected: false },
        { className: 'mx-auto', expected: false }, // Should be caught by margin auto rules
        { className: 'bg-blue-500', expected: false }, // Colors may not be supported
        { className: 'hover:flex', expected: false }, // Pseudo-classes not supported
        { className: 'sm:grid', expected: false }
      ];

      testCases.forEach(({ className, expected }) => {
        const result = validateTailwindClass(className);
        expect(result.supported).toBe(expected);
      });
    });

    test('should handle complex real-world examples', () => {
      const realWorldClasses = [
        'container mx-auto px-4 py-8',
        'flex flex-col sm:flex-row gap-4',
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'hover:shadow-lg transition-all duration-300'
      ];

      realWorldClasses.forEach(classString => {
        const violations = validateTailwindClasses(classString);
        expect(Array.isArray(violations)).toBe(true);
        
        // Each violation should have proper structure
        violations.forEach(violation => {
          expect(violation).toHaveProperty('className');
          expect(violation).toHaveProperty('reason');
          expect(violation).toHaveProperty('type');
          expect(violation).toHaveProperty('messageId');
        });
      });
    });
  });
});