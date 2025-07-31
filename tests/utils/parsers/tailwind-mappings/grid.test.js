/**
 * Tests for grid mapping functions
 */

const { getGridProperty } = require('../../../../lib/utils/parsers/tailwind-mappings/grid');

describe('Grid Mappings', () => {
  describe('getGridProperty', () => {
    test('should handle static grid mappings', () => {
      // The grid class should return from GRID_MAPPINGS
      const result = getGridProperty('grid');
      expect(result).toEqual({
        property: 'display',
        value: 'grid'
      });
    });

    test('should handle dynamic grid columns patterns', () => {
      const result1 = getGridProperty('grid-cols-1');
      expect(result1).toEqual({
        property: 'grid-template-columns',
        value: 'repeat(1, minmax(0, 1fr))'
      });

      const result2 = getGridProperty('grid-cols-12');
      expect(result2).toEqual({
        property: 'grid-template-columns',
        value: 'repeat(12, minmax(0, 1fr))'
      });

      const result3 = getGridProperty('grid-cols-3');
      expect(result3).toEqual({
        property: 'grid-template-columns',
        value: 'repeat(3, minmax(0, 1fr))'
      });
    });

    test('should handle dynamic grid rows patterns', () => {
      const result1 = getGridProperty('grid-rows-1');
      expect(result1).toEqual({
        property: 'grid-template-rows',
        value: 'repeat(1, minmax(0, 1fr))'
      });

      const result2 = getGridProperty('grid-rows-6');
      expect(result2).toEqual({
        property: 'grid-template-rows',
        value: 'repeat(6, minmax(0, 1fr))'
      });
    });

    test('should handle dynamic column span patterns', () => {
      const result1 = getGridProperty('col-span-1');
      expect(result1).toEqual({
        property: 'grid-column',
        value: 'span 1 / span 1'
      });

      const result2 = getGridProperty('col-span-full');
      expect(result2).toEqual({
        property: 'grid-column',
        value: '1 / -1'
      }); // col-span-full is in static mappings

      const result3 = getGridProperty('col-span-12');
      expect(result3).toEqual({
        property: 'grid-column',
        value: 'span 12 / span 12'
      });
    });

    test('should handle dynamic row span patterns', () => {
      const result1 = getGridProperty('row-span-1');
      expect(result1).toEqual({
        property: 'grid-row',
        value: 'span 1 / span 1'
      });

      const result2 = getGridProperty('row-span-4');
      expect(result2).toEqual({
        property: 'grid-row',
        value: 'span 4 / span 4'
      });
    });

    test('should handle static gap patterns', () => {
      const result1 = getGridProperty('gap-0');
      expect(result1).toEqual({
        property: 'gap',
        value: '0px' // from static mappings
      });

      const result2 = getGridProperty('gap-4');
      expect(result2).toEqual({
        property: 'gap',
        value: '1rem' // from static mappings
      });

      const result3 = getGridProperty('gap-8');
      expect(result3).toEqual({
        property: 'gap',
        value: '2rem' // from static mappings
      });
    });

    test('should handle static gap-x patterns', () => {
      const result1 = getGridProperty('gap-x-0');
      expect(result1).toEqual({
        property: 'column-gap',
        value: '0px'
      });

      const result2 = getGridProperty('gap-x-2');
      expect(result2).toEqual({
        property: 'column-gap',
        value: '0.5rem'
      });
    });

    test('should handle static gap-y patterns', () => {
      const result1 = getGridProperty('gap-y-0');
      expect(result1).toEqual({
        property: 'row-gap',
        value: '0px'
      });

      const result2 = getGridProperty('gap-y-4');
      expect(result2).toEqual({
        property: 'row-gap',
        value: '1rem'
      });
    });

    test('should return null for non-matching grid classes', () => {
      expect(getGridProperty('flex')).toBeNull();
      expect(getGridProperty('grid-auto-rows')).toBeNull();
      expect(getGridProperty('col-auto')).toBeNull();
      expect(getGridProperty('row-auto')).toBeNull();
      expect(getGridProperty('gap-x-auto')).toBeNull();
    });

    test('should handle edge cases', () => {
      expect(getGridProperty('')).toBeNull();
      // Note: null and undefined will cause errors in actual implementation
      // These are edge cases that should be handled by the calling code
    });

    test('should handle invalid numeric patterns', () => {
      expect(getGridProperty('grid-cols-')).toBeNull(); // missing number
      expect(getGridProperty('grid-cols-abc')).toBeNull(); // non-numeric
      expect(getGridProperty('col-span-')).toBeNull(); // missing number
      expect(getGridProperty('gap-')).toBeNull(); // missing number
    });

    test('should handle complex numeric patterns', () => {
      const result1 = getGridProperty('grid-cols-100');
      expect(result1).toEqual({
        property: 'grid-template-columns',
        value: 'repeat(100, minmax(0, 1fr))'
      });

      const result2 = getGridProperty('col-span-999');
      expect(result2).toEqual({
        property: 'grid-column',
        value: 'span 999 / span 999'
      });
    });

    test('should not match partial patterns', () => {
      expect(getGridProperty('grid-cols')).toBeNull();
      expect(getGridProperty('grid-rows')).toBeNull();
      expect(getGridProperty('col-span')).toBeNull();
      expect(getGridProperty('row-span')).toBeNull();
      expect(getGridProperty('gap')).toBeNull();
      expect(getGridProperty('gap-x')).toBeNull();
      expect(getGridProperty('gap-y')).toBeNull();
    });
  });
});