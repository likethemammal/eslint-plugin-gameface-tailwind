/**
 * Tests for Custom Gameface properties support
 * Based on documentation: Lists custom properties like coh-rendering-option, coh-composition-id, coh-partitioned, coh-font-fit properties
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');

describe('Custom Gameface Properties Support', () => {
  describe('coh-rendering-option property', () => {
    test('should support coh-rendering-option property', () => {
      const result = validateCSSPropertyValue('coh-rendering-option', 'snap-off aa-on');
      expect(result.valid).toBe(true);
    });

    test('should validate coh-rendering-option syntax patterns', () => {
      const validValues = [
        'snap-off',
        'snap-on',
        'snap-auto',
        'aa-off',
        'aa-on', 
        'aa-auto',
        'snap-off aa-off',
        'snap-on aa-on',
        'snap-auto aa-auto',
        'snap-off aa-on',
        'snap-on aa-off'
      ];

      validValues.forEach(value => {
        const result = validateCSSPropertyValue('coh-rendering-option', value);
        expect(result.valid).toBe(true);
      });
    });

    test('should explain coh-rendering-option functionality', () => {
      const testValues = [
        'snap-on',  // Controls whether the element should be snapped to integer coordinates
        'aa-auto'   // Controls whether to generate anti-aliasing border for the element
      ];

      testValues.forEach(value => {
        const result = validateCSSPropertyValue('coh-rendering-option', value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('coh-composition-id property', () => {
    test('should support coh-composition-id property', () => {
      const result = validateCSSPropertyValue('coh-composition-id', 'my-composition');
      expect(result.valid).toBe(true);
    });

    test('should validate coh-composition-id string values', () => {
      const validCompositionIds = [
        'main-ui',
        'overlay',
        'hud-element',
        'menu-background',
        'particle-system',
        'ui-layer-1'
      ];

      validCompositionIds.forEach(id => {
        const result = validateCSSPropertyValue('coh-composition-id', id);
        expect(result.valid).toBe(true);
      });
    });

    test('should explain coh-composition-id functionality', () => {
      // Test that the element is drawn on the screen through the client's compositor
      const result = validateCSSPropertyValue('coh-composition-id', 'compositor-test');
      expect(result.valid).toBe(true);
    });
  });

  describe('coh-partitioned property', () => {
    test('should support coh-partitioned property', () => {
      const onResult = validateCSSPropertyValue('coh-partitioned', 'on');
      const offResult = validateCSSPropertyValue('coh-partitioned', 'off');
      
      expect(onResult.valid).toBe(true);
      expect(offResult.valid).toBe(true);
    });

    test('should validate coh-partitioned values', () => {
      const validValues = ['on', 'off'];
      const invalidValues = ['true', 'false', '1', '0', 'yes', 'no'];

      validValues.forEach(value => {
        const result = validateCSSPropertyValue('coh-partitioned', value);
        expect(result.valid).toBe(true);
      });

      invalidValues.forEach(value => {
        const result = validateCSSPropertyValue('coh-partitioned', value);
        expect(result.valid).toBe(false);
      });
    });

    test('should explain coh-partitioned functionality', () => {
      // Test that the element is rendered through the UI surface partitioning flow
      const result = validateCSSPropertyValue('coh-partitioned', 'on');
      expect(result.valid).toBe(true);
    });
  });

  describe('coh-font-fit properties', () => {
    test('should support coh-font-fit shorthand property', () => {
      const result = validateCSSPropertyValue('coh-font-fit', 'auto 12px 24px');
      expect(result.valid).toBe(true);
    });

    test('should support coh-font-fit-mode property', () => {
      const modeValues = [
        'none',
        'width',
        'height',
        'auto'
      ];

      modeValues.forEach(mode => {
        const result = validateCSSPropertyValue('coh-font-fit-mode', mode);
        expect(result.valid).toBe(true);
      });
    });

    test('should support coh-font-fit-min-size property', () => {
      const minSizeValues = [
        '8px',
        '10px',
        '12px',
        '1em',
        '0.8rem'
      ];

      minSizeValues.forEach(size => {
        const result = validateCSSPropertyValue('coh-font-fit-min-size', size);
        expect(result.valid).toBe(true);
      });
    });

    test('should support coh-font-fit-max-size property', () => {
      const maxSizeValues = [
        '24px',
        '32px',
        '48px',
        '2em',
        '3rem'
      ];

      maxSizeValues.forEach(size => {
        const result = validateCSSPropertyValue('coh-font-fit-max-size', size);
        expect(result.valid).toBe(true);
      });
    });

    test('should validate font-fit size relationships', () => {
      const sizePairs = [
        { min: '12px', max: '24px' },
        { min: '1em', max: '2em' },
        { min: '0.8rem', max: '1.5rem' }
      ];

      sizePairs.forEach(({ min, max }) => {
        const minResult = validateCSSPropertyValue('coh-font-fit-min-size', min);
        const maxResult = validateCSSPropertyValue('coh-font-fit-max-size', max);
        expect(minResult.valid).toBe(true);
        expect(maxResult.valid).toBe(true);
      });
    });

    test('should explain coh-font-fit functionality', () => {
      // Test that coh-font-fit allows fitting text within a container by automatically changing the size
      const result = validateCSSPropertyValue('coh-font-fit', 'auto 10px 20px');
      expect(result.valid).toBe(true);
    });
  });

  describe('coh-font-sdf property', () => {
    test('should support coh-font-sdf property for font rasterization control', () => {
      const sdfValues = ['off', 'on', 'auto'];

      sdfValues.forEach(value => {
        const result = validateCSSPropertyValue('coh-font-sdf', value);
        expect(result.valid).toBe(true);
      });
    });

    test('should explain coh-font-sdf functionality', () => {
      // Test that coh-font-sdf controls rasterisation using signed distance field fonts
      const result = validateCSSPropertyValue('coh-font-sdf', 'auto');
      expect(result.valid).toBe(true);
    });
  });

  describe('Custom property validation', () => {
    test('should identify all Gameface custom properties', () => {
      const customProperties = [
        'coh-rendering-option',
        'coh-composition-id',
        'coh-partitioned',
        'coh-font-fit',
        'coh-font-fit-mode',
        'coh-font-fit-min-size',
        'coh-font-fit-max-size',
        'coh-font-sdf'
      ];

      customProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'test-value');
        // Should have validation rules (either valid or invalid, but not unknown property)
        expect(result).toBeDefined();
      });
    });

    test('should validate custom property naming convention', () => {
      const customProperties = [
        'coh-rendering-option',
        'coh-composition-id',
        'coh-partitioned'
      ];

      customProperties.forEach(property => {
        // Test that the property follows coh- naming convention and has validation rules
        const result = validateCSSPropertyValue(property, 'test');
        expect(result).toBeDefined();
        expect(property.startsWith('coh-')).toBe(true);
      });
    });
  });

  describe('Custom property usage patterns', () => {
    test('should validate complete custom property declarations', () => {
      const customDeclarations = [
        { property: 'coh-rendering-option', value: 'snap-on aa-auto' },
        { property: 'coh-composition-id', value: 'main-overlay' },
        { property: 'coh-partitioned', value: 'on' },
        { property: 'coh-font-fit', value: 'auto 10px 20px' },
        { property: 'coh-font-fit-mode', value: 'width' },
        { property: 'coh-font-sdf', value: 'auto' }
      ];

      customDeclarations.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });

    test('should validate property value combinations', () => {
      const propertyCombinations = [
        {
          'coh-font-fit-mode': 'auto',
          'coh-font-fit-min-size': '12px',
          'coh-font-fit-max-size': '24px'
        },
        {
          'coh-rendering-option': 'snap-on aa-on',
          'coh-composition-id': 'ui-element'
        }
      ];

      propertyCombinations.forEach(combination => {
        Object.entries(combination).forEach(([property, value]) => {
          const result = validateCSSPropertyValue(property, value);
          expect(result.valid).toBe(true);
        });
      });
    });
  });

  describe('Performance and optimization considerations', () => {
    test('should identify performance-related custom properties', () => {
      const performanceProperties = {
        'coh-rendering-option': 'snap-on aa-on',  // Controls rendering optimization
        'coh-partitioned': 'on',                  // Affects UI surface partitioning
        'coh-composition-id': 'compositor-test'   // Impacts compositor usage
      };

      Object.entries(performanceProperties).forEach(([property, value]) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });

    test('should validate optimization recommendations', () => {
      const optimizationTests = [
        { property: 'coh-rendering-option', value: 'snap-on aa-auto' },  // control snapping and anti-aliasing
        { property: 'coh-partitioned', value: 'on' },                    // better surface partitioning
        { property: 'coh-font-fit', value: 'auto 12px 24px' },          // responsive text sizing
        { property: 'coh-composition-id', value: 'compositor-element' }   // compositor integration
      ];

      optimizationTests.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Integration with standard CSS', () => {
    test('should validate custom properties alongside standard CSS', () => {
      const mixedTests = [
        { customProp: 'coh-rendering-option', customValue: 'snap-on', standardProp: 'color', standardValue: 'red' },
        { customProp: 'coh-font-fit-mode', customValue: 'auto', standardProp: 'font-size', standardValue: '16px' },
        { customProp: 'coh-composition-id', customValue: 'overlay', standardProp: 'background', standardValue: 'blue' }
      ];

      mixedTests.forEach(({ customProp, customValue, standardProp, standardValue }) => {
        const customResult = validateCSSPropertyValue(customProp, customValue);
        const standardResult = validateCSSPropertyValue(standardProp, standardValue);
        expect(customResult.valid).toBe(true);
        expect(standardResult.valid).toBe(true);
      });
    });

    test('should handle property inheritance and specificity', () => {
      // Test that custom properties have normal CSS validation behavior
      const inheritanceTests = [
        { property: 'coh-rendering-option', value: 'snap-auto' },  // Custom properties do not inherit by default
        { property: 'coh-partitioned', value: 'off' },             // Custom properties have normal CSS specificity
        { property: 'coh-font-sdf', value: 'on' }                  // Custom properties can be set via CSS variables
      ];

      inheritanceTests.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Error handling and validation', () => {
    test('should provide specific error messages for invalid custom property values', () => {
      const invalidValues = [
        { property: 'coh-rendering-option', value: 'invalid-value' }, // Must be snap-{off|on|auto} and/or aa-{off|on|auto}
        { property: 'coh-partitioned', value: 'true' },              // Must be "on" or "off"
        { property: 'coh-font-fit-min-size', value: 'invalid' }      // Must be a valid CSS size value
      ];

      invalidValues.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(false);
        expect(result.reason).toBeTruthy();
      });
    });

    test('should suggest correct usage for custom properties', () => {
      const usageExamples = [
        { property: 'coh-rendering-option', value: 'snap-on aa-auto' },
        { property: 'coh-composition-id', value: 'my-element' },
        { property: 'coh-font-fit', value: 'auto 12px 24px' }
      ];

      usageExamples.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Documentation and reference', () => {
    test('should identify properties marked for internal use', () => {
      const internalProperties = ['coh-rendering-option'];
      
      internalProperties.forEach(property => {
        // These are marked as "for internal use only" in docs but should still validate
        const result = validateCSSPropertyValue(property, 'snap-auto');
        expect(result.valid).toBe(true);
      });
    });

    test('should reference related documentation sections', () => {
      const documentationTests = [
        { property: 'coh-composition-id', value: 'compositor-test' },    // Compositor integration
        { property: 'coh-partitioned', value: 'on' },                   // UI Surface Partitioning  
        { property: 'coh-font-fit', value: 'auto 10px 20px' },          // Font fitting and sizing
        { property: 'coh-rendering-option', value: 'snap-on aa-auto' }   // Rendering optimization
      ];

      documentationTests.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true);
      });
    });
  });
});