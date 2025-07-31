/**
 * Simplified and consolidated tests for tailwind-parser using test helpers
 */

const { parseTailwindClasses, getTailwindCSSProperty } = require('../../lib/utils/parsers/tailwind-parser');
const { expectSupported, expectMultipleMappings, expectMultipleSupport, TEST_DATA } = require('../../lib/utils/helpers/test-helpers');

describe('tailwind-parser (consolidated)', () => {
  describe('parseTailwindClasses', () => {
    test('should parse class strings correctly', () => {
      expect(parseTailwindClasses('flex p-4 m-2')).toEqual(['flex', 'p-4', 'm-2']);
      expect(parseTailwindClasses('')).toEqual([]);
      expect(parseTailwindClasses(null)).toEqual([]);
      expect(parseTailwindClasses('  flex   p-4  ')).toEqual(['flex', 'p-4']);
    });
  });

  describe('getTailwindCSSProperty', () => {
    test('should map display classes using modular functions', () => {
      expectMultipleMappings(TEST_DATA.SUPPORTED_DISPLAY);
    });

    test('should map spacing classes using modular functions', () => {
      expectMultipleMappings(TEST_DATA.SUPPORTED_SPACING);
    });

    test('should map flexbox classes', () => {
      expectMultipleMappings([
        ['justify-center', 'justify-content', 'center'],
        ['items-center', 'align-items', 'center'],
        ['flex-wrap', 'flex-wrap', 'wrap']
      ]);
    });

    test('should map typography classes', () => {
      expectMultipleMappings([
        ['text-xl', 'font-size', '1.25rem'],
        ['font-bold', 'font-weight', '700'],
        ['text-center', 'text-align', 'center']
      ]);
    });

    test('should map effects classes', () => {
      expectMultipleMappings([
        ['bg-red', 'background-color', '#ef4444'],
        ['border-solid', 'border-style', 'solid'],
        ['rounded-lg', 'border-radius', '0.5rem']
      ]);
    });

    test('should map utilities classes', () => {
      expectMultipleMappings([
        ['cursor-pointer', 'cursor', 'pointer'],
        ['opacity-50', 'opacity', '0.5'],
        ['overflow-hidden', 'overflow', 'hidden']
      ]);
    });

    test('should return null for unknown classes', () => {
      expect(getTailwindCSSProperty('unknown-class')).toBeNull();
      expect(getTailwindCSSProperty('')).toBeNull();
      expect(getTailwindCSSProperty(null)).toBeNull();
    });
  });

  describe('getGamefaceTailwindSupport', () => {
    test('should identify supported classes', () => {
      expectMultipleSupport([
        ['flex', true],
        ['p-4', true],
        ['text-center', true],
        ['bg-red', true],
        ['cursor-pointer', true]
      ]);
    });

    test('should identify unsupported classes', () => {
      expectMultipleSupport(TEST_DATA.UNSUPPORTED_CLASSES);
    });

    test('should handle edge cases', () => {
      expectSupported('', false, 'invalid');
      expectSupported(null, false, 'invalid');
      expectSupported('unknown-class', false, 'unknown');
    });
  });

  describe('modular architecture integration', () => {
    test('should use all mapping modules correctly', () => {
      // Test that each module is being called
      const displayResult = getTailwindCSSProperty('flex');
      const spacingResult = getTailwindCSSProperty('p-4');
      const typographyResult = getTailwindCSSProperty('text-xl');
      const effectsResult = getTailwindCSSProperty('bg-red');
      const utilitiesResult = getTailwindCSSProperty('cursor-pointer');
      const flexboxResult = getTailwindCSSProperty('justify-center');

      expect(displayResult).toBeTruthy();
      expect(spacingResult).toBeTruthy();
      expect(typographyResult).toBeTruthy();
      expect(effectsResult).toBeTruthy();
      expect(utilitiesResult).toBeTruthy();
      expect(flexboxResult).toBeTruthy();
    });

    test('should maintain backward compatibility', () => {
      // Test that legacy grid classes still work
      expect(getTailwindCSSProperty('grid-cols-3')).toEqual({
        property: 'grid-template-columns',
        value: 'repeat(3, minmax(0, 1fr))'
      });
    });
  });
});