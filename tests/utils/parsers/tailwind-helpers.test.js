/**
 * Tests for tailwind-helpers
 */

const {
  getSideName,
  parseTailwindClasses,
  isColorPattern,
  isSpacingValue
} = require('../../../lib/utils/parsers/tailwind-helpers');

describe('Tailwind Helpers', () => {
  describe('getSideName', () => {
    test('should convert side abbreviations to full names', () => {
      expect(getSideName('t')).toBe('top');
      expect(getSideName('r')).toBe('right');
      expect(getSideName('b')).toBe('bottom');
      expect(getSideName('l')).toBe('left');
    });

    test('should return input for unknown abbreviations', () => {
      expect(getSideName('x')).toBe('x');
      expect(getSideName('unknown')).toBe('unknown');
      expect(getSideName('top')).toBe('top'); // Already full name
    });

    test('should handle edge cases', () => {
      expect(getSideName('')).toBe('');
      expect(getSideName(null)).toBe(null);
      expect(getSideName(undefined)).toBe(undefined);
      expect(getSideName(123)).toBe(123); // Non-string input
    });

    test('should be case sensitive', () => {
      expect(getSideName('T')).toBe('T'); // Capital T not mapped
      expect(getSideName('R')).toBe('R'); // Capital R not mapped
    });
  });

  describe('parseTailwindClasses', () => {
    test('should parse space-separated class strings', () => {
      expect(parseTailwindClasses('flex p-4 text-center')).toEqual([
        'flex', 'p-4', 'text-center'
      ]);
      
      expect(parseTailwindClasses('bg-blue-500 rounded shadow-lg')).toEqual([
        'bg-blue-500', 'rounded', 'shadow-lg'
      ]);
    });

    test('should handle multiple whitespace characters', () => {
      expect(parseTailwindClasses('flex  p-4   text-center')).toEqual([
        'flex', 'p-4', 'text-center'
      ]);
      
      expect(parseTailwindClasses('flex\tp-4\ntext-center')).toEqual([
        'flex', 'p-4', 'text-center'
      ]);
    });

    test('should handle leading and trailing whitespace', () => {
      expect(parseTailwindClasses('  flex p-4 text-center  ')).toEqual([
        'flex', 'p-4', 'text-center'
      ]);
      
      expect(parseTailwindClasses('\n\tflex p-4\t\n')).toEqual([
        'flex', 'p-4'
      ]);
    });

    test('should handle empty and invalid inputs', () => {
      expect(parseTailwindClasses('')).toEqual([]);
      expect(parseTailwindClasses('   ')).toEqual([]);
      expect(parseTailwindClasses(null)).toEqual([]);
      expect(parseTailwindClasses(undefined)).toEqual([]);
      expect(parseTailwindClasses(123)).toEqual([]);
      expect(parseTailwindClasses({})).toEqual([]);
    });

    test('should handle single class', () => {
      expect(parseTailwindClasses('flex')).toEqual(['flex']);
      expect(parseTailwindClasses(' flex ')).toEqual(['flex']);
    });

    test('should filter out empty strings from multiple spaces', () => {
      expect(parseTailwindClasses('flex   p-4')).toEqual(['flex', 'p-4']);
      expect(parseTailwindClasses('flex\t\t\tp-4')).toEqual(['flex', 'p-4']);
    });

    test('should handle special characters in class names', () => {
      expect(parseTailwindClasses('md:flex hover:bg-blue-500')).toEqual([
        'md:flex', 'hover:bg-blue-500'
      ]);
      
      expect(parseTailwindClasses('-m-4 w-1/2')).toEqual(['-m-4', 'w-1/2']);
    });
  });

  describe('isColorPattern', () => {
    test('should detect basic color patterns', () => {
      // These should match the regex patterns
      expect(isColorPattern('red-500')).toBe(true);
      expect(isColorPattern('blue-200')).toBe(true);
      expect(isColorPattern('green-800')).toBe(true);
      expect(isColorPattern('purple-100')).toBe(true);
    });

    test('should detect extended color patterns', () => {
      expect(isColorPattern('slate-400')).toBe(true);
      expect(isColorPattern('zinc-600')).toBe(true);
      expect(isColorPattern('emerald-300')).toBe(true);
      expect(isColorPattern('sky-700')).toBe(true);
      expect(isColorPattern('fuchsia-900')).toBe(true);
    });

    test('should reject invalid color patterns', () => {
      // Note: 'red' is actually valid as it's in BASIC_COLORS
      expect(isColorPattern('red-abc')).toBe(false); // Non-numeric
      expect(isColorPattern('invalid-500')).toBe(false); // Invalid color name
      expect(isColorPattern('red-')).toBe(false); // Missing number
      expect(isColorPattern('-500')).toBe(false); // Missing color
      expect(isColorPattern('unknown-color')).toBe(false); // Unknown color
    });

    test('should handle edge cases', () => {
      expect(isColorPattern('')).toBe(false);
      expect(isColorPattern(null)).toBe(false);
      expect(isColorPattern(undefined)).toBe(false);
      expect(isColorPattern(123)).toBe(false);
    });

    test('should be case sensitive', () => {
      expect(isColorPattern('RED-500')).toBe(false); // Capital letters
      expect(isColorPattern('Red-500')).toBe(false); // Mixed case
    });

    test('should handle multi-digit numbers', () => {
      expect(isColorPattern('red-50')).toBe(true);
      expect(isColorPattern('blue-100')).toBe(true);
      expect(isColorPattern('green-1000')).toBe(true); // Even invalid weights
    });
  });

  describe('isSpacingValue', () => {
    test('should detect numeric spacing patterns', () => {
      expect(isSpacingValue('4')).toBe(true);
      expect(isSpacingValue('12')).toBe(true);
      expect(isSpacingValue('0')).toBe(true);
      expect(isSpacingValue('100')).toBe(true);
    });

    test('should reject non-numeric patterns not in SPACING_VALUES', () => {
      // Note: 'px' is actually in SPACING_VALUES, so test other values
      expect(isSpacingValue('em')).toBe(false);
      expect(isSpacingValue('4px')).toBe(false);
      expect(isSpacingValue('-4')).toBe(false); // Negative
      expect(isSpacingValue('invalid')).toBe(false); // Non-spacing value
      expect(isSpacingValue('rem')).toBe(false); // Unit without number
    });

    test('should handle edge cases', () => {
      expect(isSpacingValue('')).toBe(false);
      expect(isSpacingValue(null)).toBe(false);
      expect(isSpacingValue(undefined)).toBe(false);
      expect(isSpacingValue({})).toBe(false);
    });

    test('should use SPACING_VALUES lookup when available', () => {
      // The function checks SPACING_VALUES first, then falls back to numeric pattern
      const result = isSpacingValue('4');
      expect(result).toBe(true);
      
      // Test that function returns boolean type
      expect(typeof isSpacingValue('0')).toBe('boolean');
      expect(typeof isSpacingValue('invalid')).toBe('boolean');
    });

    test('should handle leading zeros', () => {
      expect(isSpacingValue('04')).toBe(true);
      expect(isSpacingValue('00')).toBe(true);
    });

    test('should reject alphabetic characters', () => {
      expect(isSpacingValue('4a')).toBe(false);
      expect(isSpacingValue('a4')).toBe(false);
      expect(isSpacingValue('four')).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('should work together for class parsing and validation', () => {
      const classes = parseTailwindClasses('p-4 bg-red-500 m-8');
      
      expect(classes).toEqual(['p-4', 'bg-red-500', 'm-8']);
      
      // Check if any contain color patterns
      const hasColorPattern = classes.some(cls => {
        const parts = cls.split('-');
        if (parts.length >= 2) {
          return isColorPattern(parts.slice(1).join('-'));
        }
        return false;
      });
      
      expect(hasColorPattern).toBe(true); // bg-red-500 contains red-500
    });

    test('should handle complex class parsing scenarios', () => {
      const complexClasses = parseTailwindClasses(
        'md:flex lg:grid hover:bg-slate-200 focus:ring-blue-500 p-4 m-2'
      );
      
      expect(complexClasses).toContain('md:flex');
      expect(complexClasses).toContain('hover:bg-slate-200');
      expect(complexClasses).toContain('focus:ring-blue-500');
      
      // Should be able to process all classes
      for (const cls of complexClasses) {
        expect(typeof cls).toBe('string');
        expect(cls.length).toBeGreaterThan(0);
      }
    });
  });
});