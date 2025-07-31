/**
 * Tests for flexbox mapping constants
 */

const { FLEXBOX_MAPPINGS } = require('../../../lib/constants/tailwind-mappings/flexbox');

describe('Flexbox Mappings', () => {
  test('should define FLEXBOX_MAPPINGS', () => {
    expect(FLEXBOX_MAPPINGS).toBeDefined();
    expect(typeof FLEXBOX_MAPPINGS).toBe('object');
  });

  test('should have consistent mapping structure', () => {
    const mappings = Object.entries(FLEXBOX_MAPPINGS);
    expect(mappings.length).toBeGreaterThan(0);

    for (const [className, mapping] of mappings) {
      expect(typeof className).toBe('string');
      expect(mapping).toHaveProperty('property');
      expect(mapping).toHaveProperty('value');
      expect(typeof mapping.property).toBe('string');
      expect(typeof mapping.value).toBe('string');
    }
  });

  describe('Flex direction mappings', () => {
    test('should include flex direction classes', () => {
      expect(FLEXBOX_MAPPINGS['flex-row']).toEqual({
        property: 'flex-direction',
        value: 'row'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-col']).toEqual({
        property: 'flex-direction',
        value: 'column'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-row-reverse']).toEqual({
        property: 'flex-direction',
        value: 'row-reverse'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-col-reverse']).toEqual({
        property: 'flex-direction',
        value: 'column-reverse'
      });
    });

    test('should have valid flex-direction values', () => {
      const directionClasses = Object.keys(FLEXBOX_MAPPINGS).filter(key => 
        FLEXBOX_MAPPINGS[key].property === 'flex-direction'
      );
      
      const validDirections = ['row', 'row-reverse', 'column', 'column-reverse'];
      
      for (const className of directionClasses) {
        const value = FLEXBOX_MAPPINGS[className].value;
        expect(validDirections).toContain(value);
      }
    });
  });

  describe('Flex wrap mappings', () => {
    test('should include flex wrap classes', () => {
      expect(FLEXBOX_MAPPINGS['flex-wrap']).toEqual({
        property: 'flex-wrap',
        value: 'wrap'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-nowrap']).toEqual({
        property: 'flex-wrap',
        value: 'nowrap'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-wrap-reverse']).toEqual({
        property: 'flex-wrap',
        value: 'wrap-reverse'
      });
    });
  });

  describe('Flex shorthand mappings', () => {
    test('should include flex shorthand classes', () => {
      expect(FLEXBOX_MAPPINGS['flex-1']).toEqual({
        property: 'flex',
        value: '1 1 0%'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-auto']).toEqual({
        property: 'flex',
        value: '1 1 auto'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-initial']).toEqual({
        property: 'flex',
        value: '0 1 auto'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-none']).toEqual({
        property: 'flex',
        value: 'none'
      });
    });
  });

  describe('Flex grow/shrink mappings', () => {
    test('should include flex-grow classes', () => {
      expect(FLEXBOX_MAPPINGS['flex-grow']).toEqual({
        property: 'flex-grow',
        value: '1'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-grow-0']).toEqual({
        property: 'flex-grow',
        value: '0'
      });
    });

    test('should include flex-shrink classes', () => {
      expect(FLEXBOX_MAPPINGS['flex-shrink']).toEqual({
        property: 'flex-shrink',
        value: '1'
      });
      
      expect(FLEXBOX_MAPPINGS['flex-shrink-0']).toEqual({
        property: 'flex-shrink',
        value: '0'
      });
    });
  });

  describe('Order mappings', () => {
    test('should include numeric order classes', () => {
      for (let i = 1; i <= 12; i++) {
        expect(FLEXBOX_MAPPINGS[`order-${i}`]).toEqual({
          property: 'order',
          value: i.toString()
        });
      }
    });

    test('should include special order classes', () => {
      expect(FLEXBOX_MAPPINGS['order-first']).toEqual({
        property: 'order',
        value: '-9999'
      });
      
      expect(FLEXBOX_MAPPINGS['order-last']).toEqual({
        property: 'order',
        value: '9999'
      });
      
      expect(FLEXBOX_MAPPINGS['order-none']).toEqual({
        property: 'order',
        value: '0'
      });
    });
  });

  describe('Justify content mappings', () => {
    test('should include justify-content classes', () => {
      expect(FLEXBOX_MAPPINGS['justify-start']).toEqual({
        property: 'justify-content',
        value: 'flex-start'
      });
      
      expect(FLEXBOX_MAPPINGS['justify-center']).toEqual({
        property: 'justify-content',
        value: 'center'
      });
      
      expect(FLEXBOX_MAPPINGS['justify-between']).toEqual({
        property: 'justify-content',
        value: 'space-between'
      });
      
      expect(FLEXBOX_MAPPINGS['justify-evenly']).toEqual({
        property: 'justify-content',
        value: 'space-evenly'
      });
    });

    test('should have valid justify-content values', () => {
      const justifyClasses = Object.keys(FLEXBOX_MAPPINGS).filter(key => 
        FLEXBOX_MAPPINGS[key].property === 'justify-content'
      );
      
      const validValues = [
        'flex-start', 'flex-end', 'center', 
        'space-between', 'space-around', 'space-evenly'
      ];
      
      for (const className of justifyClasses) {
        const value = FLEXBOX_MAPPINGS[className].value;
        expect(validValues).toContain(value);
      }
    });
  });

  describe('Align items mappings', () => {
    test('should include align-items classes', () => {
      expect(FLEXBOX_MAPPINGS['items-start']).toEqual({
        property: 'align-items',
        value: 'flex-start'
      });
      
      expect(FLEXBOX_MAPPINGS['items-center']).toEqual({
        property: 'align-items',
        value: 'center'
      });
      
      expect(FLEXBOX_MAPPINGS['items-stretch']).toEqual({
        property: 'align-items',
        value: 'stretch'
      });
      
      expect(FLEXBOX_MAPPINGS['items-baseline']).toEqual({
        property: 'align-items',
        value: 'baseline'
      });
    });
  });

  describe('Align content mappings', () => {
    test('should include align-content classes', () => {
      expect(FLEXBOX_MAPPINGS['content-center']).toEqual({
        property: 'align-content',
        value: 'center'
      });
      
      expect(FLEXBOX_MAPPINGS['content-between']).toEqual({
        property: 'align-content',
        value: 'space-between'
      });
      
      expect(FLEXBOX_MAPPINGS['content-evenly']).toEqual({
        property: 'align-content',
        value: 'space-evenly'
      });
    });
  });

  describe('Align self mappings', () => {
    test('should include align-self classes', () => {
      expect(FLEXBOX_MAPPINGS['self-auto']).toEqual({
        property: 'align-self',
        value: 'auto'
      });
      
      expect(FLEXBOX_MAPPINGS['self-center']).toEqual({
        property: 'align-self',
        value: 'center'
      });
      
      expect(FLEXBOX_MAPPINGS['self-baseline']).toEqual({
        property: 'align-self',
        value: 'baseline'
      });
    });
  });

  describe('Property grouping validation', () => {
    test('should group properties correctly', () => {
      const propertyGroups = {};
      
      for (const [className, mapping] of Object.entries(FLEXBOX_MAPPINGS)) {
        if (!propertyGroups[mapping.property]) {
          propertyGroups[mapping.property] = [];
        }
        propertyGroups[mapping.property].push(className);
      }
      
      // Should have multiple flexbox properties
      const expectedProperties = [
        'flex-direction', 'flex-wrap', 'flex', 'flex-grow', 'flex-shrink',
        'order', 'justify-content', 'align-items', 'align-content', 'align-self'
      ];
      
      for (const property of expectedProperties) {
        expect(propertyGroups[property]).toBeDefined();
        expect(propertyGroups[property].length).toBeGreaterThan(0);
      }
    });

    test('should not have duplicate class names', () => {
      const classNames = Object.keys(FLEXBOX_MAPPINGS);
      const uniqueNames = [...new Set(classNames)];
      
      expect(classNames.length).toBe(uniqueNames.length);
    });

    test('should only contain flexbox-related properties', () => {
      const flexboxProperties = [
        'flex-direction', 'flex-wrap', 'flex', 'flex-grow', 'flex-shrink',
        'order', 'justify-content', 'align-items', 'align-content', 'align-self'
      ];
      
      for (const mapping of Object.values(FLEXBOX_MAPPINGS)) {
        expect(flexboxProperties).toContain(mapping.property);
      }
    });
  });
});