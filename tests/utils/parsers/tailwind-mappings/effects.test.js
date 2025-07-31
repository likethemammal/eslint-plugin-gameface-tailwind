/**
 * Tests for effects mapping functions
 */

const { getEffectsProperty } = require('../../../../lib/utils/parsers/tailwind-mappings/effects');

describe('Effects Mappings', () => {
  describe('getEffectsProperty', () => {
    test('should handle static effects mappings', () => {
      // Test shadow class mapping (now supported)
      const result = getEffectsProperty('shadow');
      expect(result).toEqual({
        property: 'box-shadow',
        value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      });
      
      // Test a class that should return null
      const nullResult = getEffectsProperty('not-a-real-class');
      expect(nullResult).toBeNull();
    });

    test('should handle border color patterns with basic colors', () => {
      const result1 = getEffectsProperty('border-red');
      expect(result1).toEqual({
        property: 'border-color',
        value: expect.any(String) // Will be BASIC_COLORS['red'] or 'red'
      });

      const result2 = getEffectsProperty('border-blue');
      expect(result2).toEqual({
        property: 'border-color',
        value: expect.any(String)
      });
    });

    test('should handle border color patterns with color variants', () => {
      const result1 = getEffectsProperty('border-red-500');
      expect(result1).toEqual({
        property: 'border-color',
        value: 'red-500' // Complex colors returned as-is
      });

      const result2 = getEffectsProperty('border-blue-200');
      expect(result2).toEqual({
        property: 'border-color',
        value: 'blue-200'
      });

      const result3 = getEffectsProperty('border-slate-400');
      expect(result3).toEqual({
        property: 'border-color',
        value: 'slate-400'
      });
    });

    test('should handle directional border widths', () => {
      const result1 = getEffectsProperty('border-t-2');
      expect(result1).toEqual({
        property: 'border-top-width',
        value: '2px'
      });

      const result2 = getEffectsProperty('border-r-4');
      expect(result2).toEqual({
        property: 'border-right-width',
        value: '4px'
      });

      const result3 = getEffectsProperty('border-b-8');
      expect(result3).toEqual({
        property: 'border-bottom-width',
        value: '8px'
      });

      const result4 = getEffectsProperty('border-l-0');
      expect(result4).toEqual({
        property: 'border-left-width',
        value: '0px'
      });
    });

    test('should handle general border widths', () => {
      const result1 = getEffectsProperty('border-0');
      expect(result1).toEqual({
        property: 'border-width',
        value: '0px'
      });

      const result2 = getEffectsProperty('border-2');
      expect(result2).toEqual({
        property: 'border-width',
        value: '2px'
      });

      const result3 = getEffectsProperty('border-8');
      expect(result3).toEqual({
        property: 'border-width',
        value: '8px'
      });
    });

    test('should handle border radius patterns', () => {
      const result1 = getEffectsProperty('rounded');
      expect(result1).toEqual({
        property: 'border-radius',
        value: '0.25rem'
      });

      const result2 = getEffectsProperty('rounded-sm');
      expect(result2).toEqual({
        property: 'border-radius',
        value: '0.125rem'
      });

      const result3 = getEffectsProperty('rounded-lg');
      expect(result3).toEqual({
        property: 'border-radius',
        value: '0.5rem'
      });

      const result4 = getEffectsProperty('rounded-full');
      expect(result4).toEqual({
        property: 'border-radius',
        value: '9999px'
      });
    });

    test('should handle background color patterns', () => {
      const result1 = getEffectsProperty('bg-red');
      expect(result1).toEqual({
        property: 'background-color',
        value: expect.any(String)
      });

      const result2 = getEffectsProperty('bg-blue-500');
      expect(result2).toEqual({
        property: 'background-color',
        value: 'blue-500'
      });
    });

    test('should exclude bg classes with size/position', () => {
      const result1 = getEffectsProperty('bg-size-cover');
      expect(result1).toBeNull();

      const result2 = getEffectsProperty('bg-position-center');
      expect(result2).toBeNull();
    });

    test('should handle rotate transform patterns', () => {
      const result1 = getEffectsProperty('rotate-45');
      expect(result1).toEqual({
        property: 'transform',
        value: 'rotate(45deg)'
      });

      const result2 = getEffectsProperty('-rotate-90');
      expect(result2).toEqual({
        property: 'transform',
        value: 'rotate(-90deg)'
      });

      const result3 = getEffectsProperty('rotate-180');
      expect(result3).toEqual({
        property: 'transform',
        value: 'rotate(180deg)'
      });
    });

    test('should handle scale transform patterns', () => {
      const result1 = getEffectsProperty('scale-100');
      expect(result1).toEqual({
        property: 'transform',
        value: 'scale(1)'
      });

      const result2 = getEffectsProperty('scale-50');
      expect(result2).toEqual({
        property: 'transform',
        value: 'scale(.5)'
      });

      const result3 = getEffectsProperty('scale-x-75');
      expect(result3).toEqual({
        property: 'transform',
        value: 'scaleX(.75)'
      });

      const result4 = getEffectsProperty('scale-y-150');
      expect(result4).toEqual({
        property: 'transform',
        value: 'scaleY(1.5)'
      });
    });

    test('should handle skew transform patterns', () => {
      const result1 = getEffectsProperty('skew-x-12');
      expect(result1).toEqual({
        property: 'transform',
        value: 'skewX(12deg)'
      });

      const result2 = getEffectsProperty('-skew-y-6');
      expect(result2).toEqual({
        property: 'transform',
        value: 'skewY(-6deg)'
      });
    });

    test('should handle translate transform patterns', () => {
      const result1 = getEffectsProperty('translate-x-4');
      expect(result1).toEqual({
        property: 'transform',
        value: 'translateX(1rem)' // Uses SPACING_VALUES mapping
      });

      const result2 = getEffectsProperty('-translate-y-2');
      expect(result2).toEqual({
        property: 'transform',
        value: 'translateY(-0.5rem)' // Uses SPACING_VALUES mapping
      });
    });

    test('should return null for non-matching effects classes', () => {
      expect(getEffectsProperty('flex')).toBeNull();
      expect(getEffectsProperty('text-center')).toBeNull();
      expect(getEffectsProperty('p-4')).toBeNull();
      expect(getEffectsProperty('border-style-dashed')).toBeNull(); // Contains 'style'
    });

    test('should handle edge cases', () => {
      expect(getEffectsProperty('')).toBeNull();
      // Note: null and undefined will cause errors in actual implementation
      // These should be handled by calling code before reaching this function
    });

    test('should handle invalid transform patterns', () => {
      expect(getEffectsProperty('rotate-')).toBeNull(); // missing number
      expect(getEffectsProperty('scale-abc')).toBeNull(); // non-numeric
      expect(getEffectsProperty('skew-x-')).toBeNull(); // missing number
      expect(getEffectsProperty('translate-z-4')).toBeNull(); // unsupported axis
    });

    test('should handle custom values in border and background', () => {
      const result1 = getEffectsProperty('border-custom');
      expect(result1).toBeNull(); // Non-numeric, non-color border value

      const result2 = getEffectsProperty('border-999');
      expect(result2).toEqual({
        property: 'border-width',
        value: '999' // Custom numeric value
      });

      const result3 = getEffectsProperty('rounded-custom');
      expect(result3).toEqual({
        property: 'border-radius',
        value: 'custom' // Custom radius value
      });
    });

    test('should prioritize color patterns over width patterns for border', () => {
      // border-red should be treated as color, not width
      const result = getEffectsProperty('border-red');
      expect(result.property).toBe('border-color');
    });
  });
});