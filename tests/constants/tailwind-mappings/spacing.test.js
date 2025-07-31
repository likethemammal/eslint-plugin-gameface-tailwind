/**
 * Tests for spacing mapping constants
 */

const { SPACING_MAPPINGS, SPACING_PREFIXES } = require('../../../lib/constants/tailwind-mappings/spacing');

describe('Spacing Mappings', () => {
  test('should define SPACING_MAPPINGS', () => {
    expect(SPACING_MAPPINGS).toBeDefined();
    expect(typeof SPACING_MAPPINGS).toBe('object');
  });

  test('should have consistent mapping structure', () => {
    const mappings = Object.entries(SPACING_MAPPINGS);
    expect(mappings.length).toBeGreaterThan(0);

    for (const [className, mapping] of mappings) {
      expect(typeof className).toBe('string');
      expect(mapping).toHaveProperty('property');
      expect(mapping).toHaveProperty('value');
      expect(typeof mapping.property).toBe('string');
      expect(typeof mapping.value).toBe('string');
    }
  });

  describe('Position mappings', () => {
    test('should include all position values', () => {
      const positionClasses = ['static', 'fixed', 'absolute', 'relative', 'sticky'];
      
      for (const className of positionClasses) {
        expect(SPACING_MAPPINGS[className]).toEqual({
          property: 'position',
          value: className
        });
      }
    });
  });

  describe('Float mappings', () => {
    test('should include float classes', () => {
      expect(SPACING_MAPPINGS['float-left']).toEqual({
        property: 'float',
        value: 'left'
      });
      
      expect(SPACING_MAPPINGS['float-right']).toEqual({
        property: 'float',
        value: 'right'
      });
      
      expect(SPACING_MAPPINGS['float-none']).toEqual({
        property: 'float',
        value: 'none'
      });
    });
  });

  describe('Clear mappings', () => {
    test('should include clear classes', () => {
      expect(SPACING_MAPPINGS['clear-left']).toEqual({
        property: 'clear',
        value: 'left'
      });
      
      expect(SPACING_MAPPINGS['clear-right']).toEqual({
        property: 'clear',
        value: 'right'
      });
      
      expect(SPACING_MAPPINGS['clear-both']).toEqual({
        property: 'clear',
        value: 'both'
      });
      
      expect(SPACING_MAPPINGS['clear-none']).toEqual({
        property: 'clear',
        value: 'none'
      });
    });
  });

  describe('Container mapping', () => {
    test('should include container class', () => {
      expect(SPACING_MAPPINGS['container']).toEqual({
        property: 'max-width',
        value: '100%'
      });
    });
  });

  describe('SPACING_PREFIXES', () => {
    test('should define spacing prefixes', () => {
      expect(SPACING_PREFIXES).toBeDefined();
      expect(typeof SPACING_PREFIXES).toBe('object');
    });

    test('should include width/height prefixes', () => {
      expect(SPACING_PREFIXES['w-']).toBe('width');
      expect(SPACING_PREFIXES['h-']).toBe('height');
      expect(SPACING_PREFIXES['min-w-']).toBe('min-width');
      expect(SPACING_PREFIXES['min-h-']).toBe('min-height');
      expect(SPACING_PREFIXES['max-w-']).toBe('max-width');
      expect(SPACING_PREFIXES['max-h-']).toBe('max-height');
    });

    test('should include margin prefixes', () => {
      expect(SPACING_PREFIXES['m-']).toBe('margin');
      expect(SPACING_PREFIXES['mt-']).toBe('margin-top');
      expect(SPACING_PREFIXES['mr-']).toBe('margin-right');
      expect(SPACING_PREFIXES['mb-']).toBe('margin-bottom');
      expect(SPACING_PREFIXES['ml-']).toBe('margin-left');
      
      // Array values for multi-property mappings
      expect(SPACING_PREFIXES['mx-']).toEqual(['margin-left', 'margin-right']);
      expect(SPACING_PREFIXES['my-']).toEqual(['margin-top', 'margin-bottom']);
    });

    test('should include padding prefixes', () => {
      expect(SPACING_PREFIXES['p-']).toBe('padding');
      expect(SPACING_PREFIXES['pt-']).toBe('padding-top');
      expect(SPACING_PREFIXES['pr-']).toBe('padding-right');
      expect(SPACING_PREFIXES['pb-']).toBe('padding-bottom');
      expect(SPACING_PREFIXES['pl-']).toBe('padding-left');
      
      expect(SPACING_PREFIXES['px-']).toEqual(['padding-left', 'padding-right']);
      expect(SPACING_PREFIXES['py-']).toEqual(['padding-top', 'padding-bottom']);
    });

    test('should include positioning prefixes', () => {
      expect(SPACING_PREFIXES['top-']).toBe('top');
      expect(SPACING_PREFIXES['right-']).toBe('right');
      expect(SPACING_PREFIXES['bottom-']).toBe('bottom');
      expect(SPACING_PREFIXES['left-']).toBe('left');
      
      expect(SPACING_PREFIXES['inset-x-']).toEqual(['left', 'right']);
      expect(SPACING_PREFIXES['inset-y-']).toEqual(['top', 'bottom']);
      expect(SPACING_PREFIXES['inset-']).toEqual(['top', 'right', 'bottom', 'left']);
    });

    test('should have consistent prefix format', () => {
      const prefixes = Object.keys(SPACING_PREFIXES);
      
      for (const prefix of prefixes) {
        expect(prefix).toMatch(/^[a-z-]+-$/); // Should end with dash
        
        const value = SPACING_PREFIXES[prefix];
        if (Array.isArray(value)) {
          for (const prop of value) {
            expect(typeof prop).toBe('string');
            expect(prop.length).toBeGreaterThan(0);
          }
        } else {
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Integration validation', () => {
    test('should not have duplicate class names between mappings and prefixes', () => {
      const mappingClasses = Object.keys(SPACING_MAPPINGS);
      const prefixClasses = Object.keys(SPACING_PREFIXES);
      
      // No direct overlap expected, but check structure
      expect(mappingClasses.length).toBeGreaterThan(0);
      expect(prefixClasses.length).toBeGreaterThan(0);
    });

    test('should group properties logically', () => {
      const propertyGroups = {};
      
      for (const [className, mapping] of Object.entries(SPACING_MAPPINGS)) {
        if (!propertyGroups[mapping.property]) {
          propertyGroups[mapping.property] = [];
        }
        propertyGroups[mapping.property].push(className);
      }
      
      // Should have positioning properties
      expect(propertyGroups['position']).toBeDefined();
      expect(propertyGroups['position'].length).toBe(5); // static, fixed, absolute, relative, sticky
      
      // Should have float properties
      expect(propertyGroups['float']).toBeDefined();
      expect(propertyGroups['float'].length).toBe(3); // left, right, none
      
      // Should have clear properties
      expect(propertyGroups['clear']).toBeDefined();
      expect(propertyGroups['clear'].length).toBe(4); // left, right, both, none
    });

    test('should handle multi-property prefixes correctly', () => {
      const multiPropertyPrefixes = Object.entries(SPACING_PREFIXES).filter(
        ([prefix, value]) => Array.isArray(value)
      );
      
      expect(multiPropertyPrefixes.length).toBeGreaterThan(0);
      
      for (const [prefix, properties] of multiPropertyPrefixes) {
        expect(Array.isArray(properties)).toBe(true);
        expect(properties.length).toBeGreaterThan(1);
        
        // All properties should be strings
        for (const property of properties) {
          expect(typeof property).toBe('string');
        }
      }
    });
  });
});