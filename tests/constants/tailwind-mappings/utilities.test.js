/**
 * Tests for utilities mapping constants
 */

const { UTILITIES_MAPPINGS } = require('../../../lib/constants/tailwind-mappings/utilities');

describe('Utilities Mappings', () => {
  test('should define UTILITIES_MAPPINGS', () => {
    expect(UTILITIES_MAPPINGS).toBeDefined();
    expect(typeof UTILITIES_MAPPINGS).toBe('object');
  });

  test('should have consistent mapping structure', () => {
    const mappings = Object.entries(UTILITIES_MAPPINGS);
    expect(mappings.length).toBeGreaterThan(0);

    for (const [className, mapping] of mappings) {
      expect(typeof className).toBe('string');
      expect(mapping).toHaveProperty('property');
      expect(mapping).toHaveProperty('value');
      expect(typeof mapping.property).toBe('string');
      expect(typeof mapping.value).toBe('string');
    }
  });

  describe('Cursor mappings', () => {
    test('should include all cursor classes', () => {
      const cursorClasses = {
        'cursor-auto': 'auto',
        'cursor-default': 'default',
        'cursor-move': 'move',
        'cursor-pointer': 'pointer',
        'cursor-text': 'text',
        'cursor-wait': 'wait',
        'cursor-not-allowed': 'not-allowed'
      };

      for (const [className, expectedValue] of Object.entries(cursorClasses)) {
        expect(UTILITIES_MAPPINGS[className]).toEqual({
          property: 'cursor',
          value: expectedValue
        });
      }
    });

    test('should have valid cursor values', () => {
      const cursorClasses = Object.keys(UTILITIES_MAPPINGS).filter(key => 
        key.startsWith('cursor-')
      );
      
      const validCursorValues = [
        'auto', 'default', 'move', 'pointer', 'text', 'wait', 'not-allowed'
      ];
      
      for (const className of cursorClasses) {
        const mapping = UTILITIES_MAPPINGS[className];
        expect(mapping.property).toBe('cursor');
        expect(validCursorValues).toContain(mapping.value);
      }
    });
  });

  describe('Appearance mappings', () => {
    test('should include appearance classes', () => {
      expect(UTILITIES_MAPPINGS['appearance-none']).toEqual({
        property: 'appearance',
        value: 'none'
      });
    });
  });

  describe('Outline mappings', () => {
    test('should include outline classes', () => {
      expect(UTILITIES_MAPPINGS['outline-none']).toEqual({
        property: 'outline',
        value: 'none'
      });
    });
  });

  describe('Pointer events mappings', () => {
    test('should include pointer-events classes', () => {
      expect(UTILITIES_MAPPINGS['pointer-events-none']).toEqual({
        property: 'pointer-events',
        value: 'none'
      });
      
      expect(UTILITIES_MAPPINGS['pointer-events-auto']).toEqual({
        property: 'pointer-events',
        value: 'auto'
      });
    });

    test('should have valid pointer-events values', () => {
      const pointerEventsClasses = Object.keys(UTILITIES_MAPPINGS).filter(key => 
        key.startsWith('pointer-events-')
      );
      
      const validValues = ['none', 'auto'];
      
      for (const className of pointerEventsClasses) {
        const mapping = UTILITIES_MAPPINGS[className];
        expect(mapping.property).toBe('pointer-events');
        expect(validValues).toContain(mapping.value);
      }
    });
  });

  describe('Resize mappings', () => {
    test('should include resize classes', () => {
      expect(UTILITIES_MAPPINGS['resize']).toEqual({
        property: 'resize',
        value: 'both'
      });
      
      expect(UTILITIES_MAPPINGS['resize-none']).toEqual({
        property: 'resize',
        value: 'none'
      });
      
      expect(UTILITIES_MAPPINGS['resize-y']).toEqual({
        property: 'resize',
        value: 'vertical'
      });
      
      expect(UTILITIES_MAPPINGS['resize-x']).toEqual({
        property: 'resize',
        value: 'horizontal'
      });
    });

    test('should have valid resize values', () => {
      const resizeClasses = Object.keys(UTILITIES_MAPPINGS).filter(key => 
        key.startsWith('resize')
      );
      
      const validValues = ['both', 'none', 'vertical', 'horizontal'];
      
      for (const className of resizeClasses) {
        const mapping = UTILITIES_MAPPINGS[className];
        expect(mapping.property).toBe('resize');
        expect(validValues).toContain(mapping.value);
      }
    });
  });

  describe('User select mappings', () => {
    test('should include user-select classes', () => {
      expect(UTILITIES_MAPPINGS['select-none']).toEqual({
        property: 'user-select',
        value: 'none'
      });
      
      expect(UTILITIES_MAPPINGS['select-text']).toEqual({
        property: 'user-select',
        value: 'text'
      });
      
      expect(UTILITIES_MAPPINGS['select-all']).toEqual({
        property: 'user-select',
        value: 'all'
      });
      
      expect(UTILITIES_MAPPINGS['select-auto']).toEqual({
        property: 'user-select',
        value: 'auto'
      });
    });

    test('should have valid user-select values', () => {
      const selectClasses = Object.keys(UTILITIES_MAPPINGS).filter(key => 
        key.startsWith('select-')
      );
      
      const validValues = ['none', 'text', 'all', 'auto'];
      
      for (const className of selectClasses) {
        const mapping = UTILITIES_MAPPINGS[className];
        expect(mapping.property).toBe('user-select');
        expect(validValues).toContain(mapping.value);
      }
    });
  });

  describe('SVG mappings', () => {
    test('should include SVG stroke classes', () => {
      expect(UTILITIES_MAPPINGS['stroke-2']).toEqual({
        property: 'stroke-width',
        value: '2'
      });
    });
  });

  describe('Property grouping validation', () => {
    test('should group properties correctly', () => {
      const propertyGroups = {};
      
      for (const [className, mapping] of Object.entries(UTILITIES_MAPPINGS)) {
        if (!propertyGroups[mapping.property]) {
          propertyGroups[mapping.property] = [];
        }
        propertyGroups[mapping.property].push(className);
      }
      
      // Should have multiple utility properties
      const expectedProperties = [
        'cursor', 'appearance', 'outline', 'pointer-events', 
        'resize', 'user-select', 'stroke-width'
      ];
      
      for (const property of expectedProperties) {
        expect(propertyGroups[property]).toBeDefined();
        expect(propertyGroups[property].length).toBeGreaterThan(0);
      }
      
      // Cursor should be the largest group
      expect(propertyGroups['cursor'].length).toBeGreaterThanOrEqual(7);
    });

    test('should not have duplicate class names', () => {
      const classNames = Object.keys(UTILITIES_MAPPINGS);
      const uniqueNames = [...new Set(classNames)];
      
      expect(classNames.length).toBe(uniqueNames.length);
    });

    test('should only contain utility-related properties', () => {
      const utilityProperties = [
        'cursor', 'appearance', 'outline', 'pointer-events', 
        'resize', 'user-select', 'stroke-width'
      ];
      
      for (const mapping of Object.values(UTILITIES_MAPPINGS)) {
        expect(utilityProperties).toContain(mapping.property);
      }
    });
  });

  describe('Class naming conventions', () => {
    test('should follow consistent naming patterns', () => {
      const classNames = Object.keys(UTILITIES_MAPPINGS);
      
      for (const className of classNames) {
        // Should be kebab-case with possible numbers
        expect(className).toMatch(/^[a-z0-9-]+$/);
        
        // Should not start or end with dash
        expect(className).not.toMatch(/^-/);
        expect(className).not.toMatch(/-$/);
        
        // Should not have consecutive dashes
        expect(className).not.toMatch(/--/);
      }
    });

    test('should have descriptive class names', () => {
      const classNames = Object.keys(UTILITIES_MAPPINGS);
      
      for (const className of classNames) {
        // Should be at least 4 characters (reasonable minimum)
        expect(className.length).toBeGreaterThanOrEqual(4);
        
        // Should contain property hint in the name
        const mapping = UTILITIES_MAPPINGS[className];
        const property = mapping.property;
        
        // Most class names should contain part of the property name
        const propertyHints = {
          'cursor': 'cursor',
          'appearance': 'appearance',
          'outline': 'outline',
          'pointer-events': 'pointer',
          'resize': 'resize',
          'user-select': 'select',
          'stroke-width': 'stroke'
        };
        
        const hint = propertyHints[property];
        if (hint) {
          expect(className).toContain(hint);
        }
      }
    });
  });
});