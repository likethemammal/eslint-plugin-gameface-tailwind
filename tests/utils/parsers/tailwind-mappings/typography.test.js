/**
 * Tests for typography mapping functions
 */

const { 
  getTypographyProperty,
} = require('../../../../lib/utils/parsers/tailwind-mappings/typography');
const {
  TYPOGRAPHY_MAPPINGS,
  parseFontSize,
  parseFontWeight,
  parseColorValue
} = require('../../../../lib/constants/tailwind-mappings/typography');

describe('Typography Mappings', () => {
  describe('TYPOGRAPHY_MAPPINGS', () => {
    test('should contain expected typography classes', () => {
      expect(TYPOGRAPHY_MAPPINGS['text-xl']).toEqual({
        property: 'font-size',
        value: '1.25rem'
      });
      
      expect(TYPOGRAPHY_MAPPINGS['font-bold']).toEqual({
        property: 'font-weight',
        value: '700'
      });
      
      expect(TYPOGRAPHY_MAPPINGS['text-center']).toEqual({
        property: 'text-align',
        value: 'center'
      });
    });
  });

  describe('getTypographyProperty', () => {
    test('should return static mappings', () => {
      const result = getTypographyProperty('text-xl');
      expect(result).toEqual({
        property: 'font-size',
        value: '1.25rem'
      });
    });

    test('should handle text colors', () => {
      const result = getTypographyProperty('text-blue-500');
      expect(result).toEqual({
        property: 'color',
        value: 'blue-500'
      });
    });

    test('should not match text classes with size in name', () => {
      const result = getTypographyProperty('text-size-adjust');
      expect(result).toBeNull();
    });

    test('should not match text classes with align in name', () => {
      const result = getTypographyProperty('text-align-last');
      expect(result).toBeNull();
    });

    test('should handle font sizes with patterns', () => {
      // This tests the font size pattern matching
      const result = getTypographyProperty('text-2xl');
      expect(result).toEqual({
        property: 'font-size',
        value: '1.5rem'
      });
    });

    test('should handle font weights with patterns', () => {
      // This tests the font weight pattern matching
      const result = getTypographyProperty('font-semibold');
      expect(result).toEqual({
        property: 'font-weight',
        value: '600'
      });
    });

    test('should return null for unknown classes', () => {
      const result = getTypographyProperty('unknown-typography-class');
      expect(result).toBeNull();
    });

    test('should return null for non-typography classes', () => {
      const result = getTypographyProperty('flex');
      expect(result).toBeNull();
    });
  });

  describe('parseFontSize', () => {
    test('should return mapped font size values', () => {
      const { FONT_SIZES } = require('../../../../lib/constants/css-properties');
      
      // Test a few known mappings
      expect(parseFontSize('xl')).toBe(FONT_SIZES['xl'] || 'xl');
      expect(parseFontSize('2xl')).toBe(FONT_SIZES['2xl'] || '2xl');
      expect(parseFontSize('sm')).toBe(FONT_SIZES['sm'] || 'sm');
    });

    test('should return original value for unknown sizes', () => {
      expect(parseFontSize('custom-size')).toBe('custom-size');
    });

    test('should handle null/undefined input', () => {
      expect(parseFontSize(null)).toBeNull();
      expect(parseFontSize(undefined)).toBeUndefined();
    });
  });

  describe('parseFontWeight', () => {
    test('should return mapped font weight values', () => {
      const { FONT_WEIGHTS } = require('../../../../lib/constants/css-properties');
      
      // Test a few known mappings
      expect(parseFontWeight('bold')).toBe(FONT_WEIGHTS['bold'] || 'bold');
      expect(parseFontWeight('normal')).toBe(FONT_WEIGHTS['normal'] || 'normal');
      expect(parseFontWeight('light')).toBe(FONT_WEIGHTS['light'] || 'light');
    });

    test('should return original value for unknown weights', () => {
      expect(parseFontWeight('custom-weight')).toBe('custom-weight');
    });

    test('should handle null/undefined input', () => {
      expect(parseFontWeight(null)).toBeNull();
      expect(parseFontWeight(undefined)).toBeUndefined();
    });
  });

  describe('parseColorValue', () => {
    test('should return mapped color values', () => {
      const { BASIC_COLORS } = require('../../../../lib/constants/css-properties');
      
      // Test a few known mappings
      expect(parseColorValue('red')).toBe(BASIC_COLORS['red'] || 'red');
      expect(parseColorValue('blue')).toBe(BASIC_COLORS['blue'] || 'blue');
      expect(parseColorValue('black')).toBe(BASIC_COLORS['black'] || 'black');
    });

    test('should return original value for unknown colors', () => {
      expect(parseColorValue('custom-color')).toBe('custom-color');
    });

    test('should handle complex color values', () => {
      expect(parseColorValue('red-500')).toBe('red-500');
      expect(parseColorValue('blue-200')).toBe('blue-200');
    });

    test('should handle null/undefined input', () => {
      expect(parseColorValue(null)).toBeNull();
      expect(parseColorValue(undefined)).toBeUndefined();
    });
  });

  describe('edge cases and integration', () => {
    test('should handle text color classes that are not font sizes', () => {
      const result = getTypographyProperty('text-red');
      expect(result).toEqual({
        property: 'color',
        value: expect.any(String)
      });
    });

    test('should handle font classes that are not weights', () => {
      const result = getTypographyProperty('font-sans');
      expect(result).toEqual({
        property: 'font-family',
        value: 'system-ui, -apple-system, sans-serif'
      });
    });

    test('should prefer static mappings over pattern matching', () => {
      // text-xl should come from static mapping, not pattern matching
      const result = getTypographyProperty('text-xl');
      expect(result).toEqual(TYPOGRAPHY_MAPPINGS['text-xl']);
    });
  });
});