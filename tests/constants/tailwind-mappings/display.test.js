/**
 * Tests for display mapping constants
 */

const { DISPLAY_MAPPINGS } = require('../../../lib/constants/tailwind-mappings/display');

describe('Display Mappings', () => {
  test('should define DISPLAY_MAPPINGS', () => {
    expect(DISPLAY_MAPPINGS).toBeDefined();
    expect(typeof DISPLAY_MAPPINGS).toBe('object');
  });

  test('should have consistent mapping structure', () => {
    const mappings = Object.entries(DISPLAY_MAPPINGS);
    expect(mappings.length).toBeGreaterThan(0);

    for (const [className, mapping] of mappings) {
      expect(typeof className).toBe('string');
      expect(mapping).toHaveProperty('property');
      expect(mapping).toHaveProperty('value');
      expect(typeof mapping.property).toBe('string');
      expect(typeof mapping.value).toBe('string');
    }
  });

  describe('Display property mappings', () => {
    test('should include basic display values', () => {
      expect(DISPLAY_MAPPINGS['block']).toEqual({
        property: 'display',
        value: 'block'
      });
      
      expect(DISPLAY_MAPPINGS['flex']).toEqual({
        property: 'display',
        value: 'flex'
      });
      
      expect(DISPLAY_MAPPINGS['grid']).toEqual({
        property: 'display',
        value: 'grid'
      });
      
      expect(DISPLAY_MAPPINGS['hidden']).toEqual({
        property: 'display',
        value: 'none'
      });
    });

    test('should include table display values', () => {
      expect(DISPLAY_MAPPINGS['table']).toBeDefined();
      expect(DISPLAY_MAPPINGS['table-cell']).toBeDefined();
      expect(DISPLAY_MAPPINGS['table-row']).toBeDefined();
      
      expect(DISPLAY_MAPPINGS['table'].property).toBe('display');
      expect(DISPLAY_MAPPINGS['table'].value).toBe('table');
    });

    test('should include inline variants', () => {
      expect(DISPLAY_MAPPINGS['inline']).toEqual({
        property: 'display',
        value: 'inline'
      });
      
      expect(DISPLAY_MAPPINGS['inline-block']).toEqual({
        property: 'display',
        value: 'inline-block'
      });
      
      expect(DISPLAY_MAPPINGS['inline-flex']).toEqual({
        property: 'display',
        value: 'inline-flex'
      });
    });
  });

  describe('Visibility property mappings', () => {
    test('should include visibility classes', () => {
      expect(DISPLAY_MAPPINGS['visible']).toEqual({
        property: 'visibility',
        value: 'visible'
      });
      
      expect(DISPLAY_MAPPINGS['invisible']).toEqual({
        property: 'visibility',
        value: 'hidden'
      });
    });

    test('should include screen reader classes', () => {
      expect(DISPLAY_MAPPINGS['sr-only']).toEqual({
        property: 'position',
        value: 'absolute'
      });
      
      expect(DISPLAY_MAPPINGS['not-sr-only']).toEqual({
        property: 'position',
        value: 'static'
      });
    });
  });

  describe('Overflow property mappings', () => {
    test('should include basic overflow classes', () => {
      expect(DISPLAY_MAPPINGS['overflow-auto']).toEqual({
        property: 'overflow',
        value: 'auto'
      });
      
      expect(DISPLAY_MAPPINGS['overflow-hidden']).toEqual({
        property: 'overflow',
        value: 'hidden'
      });
      
      expect(DISPLAY_MAPPINGS['overflow-visible']).toEqual({
        property: 'overflow',
        value: 'visible'
      });
    });

    test('should include directional overflow classes', () => {
      expect(DISPLAY_MAPPINGS['overflow-x-auto']).toEqual({
        property: 'overflow-x',
        value: 'auto'
      });
      
      expect(DISPLAY_MAPPINGS['overflow-y-hidden']).toEqual({
        property: 'overflow-y',
        value: 'hidden'
      });
    });
  });

  describe('Opacity property mappings', () => {
    test('should include opacity values', () => {
      expect(DISPLAY_MAPPINGS['opacity-100']).toEqual({
        property: 'opacity',
        value: '1'
      });
      
      expect(DISPLAY_MAPPINGS['opacity-50']).toEqual({
        property: 'opacity',
        value: '0.5'
      });
      
      expect(DISPLAY_MAPPINGS['opacity-0']).toEqual({
        property: 'opacity',
        value: '0'
      });
    });

    test('should have valid opacity values', () => {
      const opacityClasses = Object.keys(DISPLAY_MAPPINGS).filter(key => 
        key.startsWith('opacity-')
      );
      
      for (const className of opacityClasses) {
        const mapping = DISPLAY_MAPPINGS[className];
        expect(mapping.property).toBe('opacity');
        
        const value = parseFloat(mapping.value);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Property grouping validation', () => {
    test('should group properties correctly', () => {
      const propertyGroups = {};
      
      for (const [className, mapping] of Object.entries(DISPLAY_MAPPINGS)) {
        if (!propertyGroups[mapping.property]) {
          propertyGroups[mapping.property] = [];
        }
        propertyGroups[mapping.property].push(className);
      }
      
      // Should have multiple property types
      expect(Object.keys(propertyGroups).length).toBeGreaterThan(1);
      
      // Display should be the largest group
      expect(propertyGroups['display']).toBeDefined();
      expect(propertyGroups['display'].length).toBeGreaterThan(10);
    });

    test('should not have duplicate class names', () => {
      const classNames = Object.keys(DISPLAY_MAPPINGS);
      const uniqueNames = [...new Set(classNames)];
      
      expect(classNames.length).toBe(uniqueNames.length);
    });
  });
});