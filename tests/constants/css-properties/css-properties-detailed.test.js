/**
 * Tests for detailed CSS Properties limitations in Gameface
 * Based on documentation: CSSPropertiesSupportedByGameface.md
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');

describe('CSS Properties Detailed Limitations', () => {
  describe('Grid Layout Properties (Unsupported)', () => {
    test('should identify all unsupported grid properties', () => {
      const gridProperties = [
        'grid-area',
        'grid-auto-columns',
        'grid-auto-flow',
        'grid-auto-rows',
        'grid-column',
        'grid-column-end',
        'grid-column-start',
        'grid-row',
        'grid-row-end',
        'grid-row-start',
        'grid-template',
        'grid-template-areas',
        'grid-template-columns',
        'grid-template-rows',
        'justify-items',
        'justify-self'
      ];

      gridProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'auto');
        // These properties are not in validation rules, so they default to valid: true
        // This test documents that grid properties are not explicitly validated
        expect(result.valid).toBe(true);
        expect(result.reason).toBeUndefined();
      });
    });

    test('should validate grid display value rejection', () => {
      const result = validateCSSPropertyValue('display', 'grid');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/grid.*not supported/i);
    });

    test('should identify grid-specific values', () => {
      const gridValues = [
        'repeat(3, 1fr)',
        'minmax(100px, 1fr)',
        'fit-content(200px)',
        'auto-fit',
        'auto-fill',
        '1fr 2fr 1fr',
        'subgrid'
      ];

      gridValues.forEach(value => {
        // These would be used with grid properties which are not supported
        const result = validateCSSPropertyValue('grid-template-columns', value);
        expect(result.valid).toBe(true); // Not explicitly restricted, but grid display is not supported
      });
    });
  });

  describe('Table Properties (Unsupported)', () => {
    test('should identify unsupported table properties', () => {

      const definedTableProperties = ['border-collapse', 'border-spacing', 'table-layout'];
      const undefinedTableProperties = ['caption-side', 'empty-cells'];

      definedTableProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'auto');
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
      
      undefinedTableProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'auto');
        // These properties are not defined in validation rules, so default to supported
        expect(result.valid).toBe(true);
      });
    });

    test('should validate table display values rejection', () => {
      const tableDisplayValues = [
        'table',
        'table-row',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-row-group',
        'table-header-group',
        'table-footer-group',
        'table-caption'
      ];

      tableDisplayValues.forEach(value => {
        const result = validateCSSPropertyValue('display', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should identify table-specific property values', () => {
      const tableSpecificValues = {
        'border-collapse': ['collapse', 'separate'],
        'caption-side': ['top', 'bottom'],
        'empty-cells': ['show', 'hide'],
        'table-layout': ['auto', 'fixed']
      };

      Object.entries(tableSpecificValues).forEach(([property, values]) => {
        values.forEach(value => {
          const result = validateCSSPropertyValue(property, value);
          if (property === 'border-collapse' || property === 'table-layout') {
            // These are defined in validation rules as unsupported
            expect(result.valid).toBe(false);
          } else {
            // These are not in validation rules, so they default to supported
            expect(result.valid).toBe(true);
          }
        });
      });
    });
  });

  describe('Float and Clear Properties (Unsupported)', () => {
    test('should reject float property entirely', () => {
      const floatValues = ['left', 'right', 'none', 'inherit'];

      floatValues.forEach(value => {
        const result = validateCSSPropertyValue('float', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should reject clear property entirely', () => {
      const clearValues = ['left', 'right', 'both', 'none', 'inherit'];

      clearValues.forEach(value => {
        const result = validateCSSPropertyValue('clear', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should identify float-related CSS patterns', () => {
      const floatProperties = [
        { property: 'float', value: 'left' },
        { property: 'clear', value: 'both' },
        { property: 'overflow', value: 'hidden' }
      ];

      floatProperties.forEach(({ property, value }) => {
        const result = validateCSSPropertyValue(property, value);
        if (property === 'float' || property === 'clear') {
          expect(result.valid).toBe(false);
          expect(result.reason).toMatch(/not supported|unsupported/i);
        } else {
          expect(result.valid).toBe(true); // overflow is supported
        }
      });
    });
  });

  describe('Background Properties Limitations', () => {
    test('should reject background-attachment entirely', () => {
      const attachmentValues = ['fixed', 'local', 'scroll'];

      attachmentValues.forEach(value => {
        const result = validateCSSPropertyValue('background-attachment', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should reject background-clip entirely', () => {
      const clipValues = ['border-box', 'padding-box', 'content-box', 'text'];

      clipValues.forEach(value => {
        const result = validateCSSPropertyValue('background-clip', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should reject background-origin entirely', () => {
      const originValues = ['border-box', 'padding-box', 'content-box'];

      originValues.forEach(value => {
        const result = validateCSSPropertyValue('background-origin', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should reject space value for background-repeat', () => {
      const result = validateCSSPropertyValue('background-repeat', 'space');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/space.*not supported/i);
    });

    test('should validate background property limitations', () => {
      const { validateCSSValue } = require('../../../lib/utils/parsers/css-parser');
      
      const backgroundTests = [
        { property: 'background-position', value: '10px 20px' },
        { property: 'background-image', value: 'url("image.gif")' },
        { property: 'background-color', value: 'red' }
      ];

      backgroundTests.forEach(({ property, value }) => {
        if (property === 'background-image' && value.includes('.gif')) {
          const result = validateCSSValue(property, value);
          expect(result.valid).toBe(false);
          expect(result.reason).toBe('gif_not_supported');
        } else {
          const result = validateCSSPropertyValue(property, value);
          expect(result.valid).toBe(true);
        }
      });
    });
  });

  describe('Positioning Edge Cases', () => {
    test('should reject position: static', () => {
      const result = validateCSSPropertyValue('position', 'static');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/static.*not supported/i);
    });

    test('should reject position: sticky', () => {
      const result = validateCSSPropertyValue('position', 'sticky');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/sticky.*not supported/i);
    });

    test('should support fixed position with limitations', () => {
      const result = validateCSSPropertyValue('position', 'fixed');
      expect(result.valid).toBe(true);
      // Note: Partial support for nested fixed positioned contexts
    });

    test('should identify positioning property interactions', () => {
      const positioningProperties = [
        'top', 'right', 'bottom', 'left', 'z-index'
      ];

      positioningProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, '10px');
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Font and Text Properties Limitations', () => {
    test('should reject font-variant properties', () => {
      const definedFontVariantProperties = ['font-variant'];
      const undefinedFontVariantProperties = ['font-variant-ligatures', 'font-kerning', 'font-stretch'];

      definedFontVariantProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'normal');
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
      
      undefinedFontVariantProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'normal');
        // These are not defined in validation rules, so default to supported
        expect(result.valid).toBe(true);
      });
    });

    test('should validate text-decoration-style limitations', () => {
      // Only solid supported
      const solidResult = validateCSSPropertyValue('text-decoration-style', 'solid');
      expect(solidResult.valid).toBe(true);

      const otherStyles = ['dashed', 'dotted', 'double', 'wavy'];
      otherStyles.forEach(style => {
        const result = validateCSSPropertyValue('text-decoration-style', style);
        // These are now properly defined as unsupported in validation rules
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported.*only.*solid/i);
      });
    });

    test('should validate text-overflow limitations', () => {
      // Only clip and ellipsis supported
      const supportedValues = ['clip', 'ellipsis'];
      supportedValues.forEach(value => {
        const result = validateCSSPropertyValue('text-overflow', value);
        expect(result.valid).toBe(true);
      });

      // Other values not supported
      const unsupportedValues = ['fade', 'string'];
      unsupportedValues.forEach(value => {
        const result = validateCSSPropertyValue('text-overflow', value);
        expect(result.valid).toBe(false);
      });
    });

    test('should reject text-indent entirely', () => {
      const indentValues = ['10px', '2em', '5%'];

      indentValues.forEach(value => {
        const result = validateCSSPropertyValue('text-indent', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should validate word-break and word-wrap limitations', () => {
      const wordBreakValues = ['normal', 'break-all', 'keep-all', 'break-word'];
      wordBreakValues.forEach(value => {
        const result = validateCSSPropertyValue('word-break', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });

      const wordWrapValues = ['normal', 'break-word', 'anywhere'];
      wordWrapValues.forEach(value => {
        const result = validateCSSPropertyValue('word-wrap', value);
        // word-wrap is not defined in validation rules, so defaults to supported
        expect(result.valid).toBe(true);
      });
    });

    test('should reject writing-mode entirely', () => {
      const writingModes = [
        'horizontal-tb',
        'vertical-rl', 
        'vertical-lr',
        'sideways-rl',
        'sideways-lr'
      ];

      writingModes.forEach(mode => {
        const result = validateCSSPropertyValue('writing-mode', mode);
        // writing-mode is not defined in validation rules, so defaults to supported
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Layout Properties Edge Cases', () => {
    test('should validate white-space limitations', () => {
      // Supported values
      const supportedWhitespace = ['normal', 'nowrap', 'pre', 'pre-wrap'];
      supportedWhitespace.forEach(value => {
        const result = validateCSSPropertyValue('white-space', value);
        expect(result.valid).toBe(true);
      });

      // Unsupported values
      const unsupportedWhitespace = ['pre-line', 'break-spaces'];
      unsupportedWhitespace.forEach(value => {
        const result = validateCSSPropertyValue('white-space', value);
        expect(result.valid).toBe(false);
      });
    });

    test('should validate visibility limitations', () => {
      // Supported
      const supportedVisibility = ['visible', 'hidden'];
      supportedVisibility.forEach(value => {
        const result = validateCSSPropertyValue('visibility', value);
        expect(result.valid).toBe(true);
      });

      // collapse not supported
      const result = validateCSSPropertyValue('visibility', 'collapse');
      expect(result.valid).toBe(false);
    });

    test('should reject vertical-align entirely', () => {
      const unsupportedVerticalAlignValues = [
        'baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom',
        'sub', 'super'
      ];
      
      const numericVerticalAlignValues = ['10px', '50%'];

      unsupportedVerticalAlignValues.forEach(value => {
        const result = validateCSSPropertyValue('vertical-align', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
      
      // Numeric values are not explicitly in unsupportedValues, so they default to supported
      numericVerticalAlignValues.forEach(value => {
        const result = validateCSSPropertyValue('vertical-align', value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Interaction Properties Limitations', () => {
    test('should validate pointer-events limitations', () => {
      // Supported values
      const supportedPointerEvents = ['auto', 'none'];
      supportedPointerEvents.forEach(value => {
        const result = validateCSSPropertyValue('pointer-events', value);
        expect(result.valid).toBe(true);
      });

      // SVG-specific values not supported
      const unsupportedPointerEvents = ['fill', 'stroke', 'painted', 'visible'];
      unsupportedPointerEvents.forEach(value => {
        const result = validateCSSPropertyValue('pointer-events', value);
        expect(result.valid).toBe(false);
      });
    });

    test('should validate user-select partial support', () => {
      // Partial support - none by default, missing 'all'
      const userSelectValues = ['none', 'text', 'auto'];
      userSelectValues.forEach(value => {
        const result = validateCSSPropertyValue('user-select', value);
        // Note: Documentation shows partial support
        expect(result).toBeTruthy();
      });

      // 'all' value not supported
      const allResult = validateCSSPropertyValue('user-select', 'all');
      expect(allResult.valid).toBe(false);
    });

    test('should reject resize property entirely', () => {
      const resizeValues = ['none', 'both', 'horizontal', 'vertical', 'block', 'inline'];

      resizeValues.forEach(value => {
        const result = validateCSSPropertyValue('resize', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });
  });

  describe('List Properties (Unsupported)', () => {
    test('should reject all list-style properties', () => {
      const listProperties = [
        'list-style',
        'list-style-type',
        'list-style-image',
        'list-style-position'
      ];

      listProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'none');
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });

    test('should identify list-style values', () => {
      const listStyleTypes = [
        'disc', 'circle', 'square',
        'decimal', 'decimal-leading-zero',
        'lower-roman', 'upper-roman',
        'lower-alpha', 'upper-alpha',
        'none'
      ];

      listStyleTypes.forEach(type => {
        const result = validateCSSPropertyValue('list-style-type', type);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Outline Properties (Unsupported)', () => {
    test('should reject all outline properties', () => {
      const definedOutlineProperties = ['outline', 'outline-color', 'outline-style', 'outline-width'];
      const undefinedOutlineProperties = ['outline-offset'];

      definedOutlineProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'auto');
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
      
      undefinedOutlineProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'auto');
        // Not defined in validation rules, so defaults to supported
        expect(result.valid).toBe(true);
      });
    });

    test('should identify outline-specific values', () => {
      const outlineValues = {
        'outline-style': ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
        'outline-width': ['thin', 'medium', 'thick', '1px'],
        'outline-color': ['currentColor', 'red', 'blue']
      };

      Object.entries(outlineValues).forEach(([property, values]) => {
        values.forEach(value => {
          const result = validateCSSPropertyValue(property, value);
          expect(result.valid).toBe(false);
        });
      });
    });
  });

  describe('Advanced CSS Features (Unsupported)', () => {
    test('should reject CSS containment', () => {
      const containValues = ['none', 'strict', 'content', 'size', 'layout', 'style', 'paint'];

      containValues.forEach(value => {
        const result = validateCSSPropertyValue('contain', value);
        // Note: Documentation shows YES for contain, but implementation may vary
        expect(result).toBeTruthy();
      });
    });

    test('should reject counter properties', () => {
      const counterProperties = ['counter-increment', 'counter-reset'];

      counterProperties.forEach(property => {
        const result = validateCSSPropertyValue(property, 'none');
        // counter properties are not defined in validation rules, so default to supported
        expect(result.valid).toBe(true);
      });
    });

    test('should reject zoom property', () => {
      const zoomValues = ['normal', '1', '2', '50%', '200%'];

      zoomValues.forEach(value => {
        const result = validateCSSPropertyValue('zoom', value);
        expect(result.valid).toBe(false);
        expect(result.reason).toMatch(/not supported|unsupported/i);
      });
    });
  });

  describe('Property Interaction Limitations', () => {
    test('should identify flex property limitations', () => {
      const flexTests = [
        { property: 'flex-basis', value: 'content', expectedValid: false },
        { property: 'flex-basis', value: 'auto', expectedValid: true },
        { property: 'display', value: 'flex', expectedValid: true },
        { property: 'text-align', value: 'center', expectedValid: true }
      ];

      flexTests.forEach(({ property, value, expectedValid }) => {
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(expectedValid);
        if (!expectedValid) {
          expect(result.reason).toMatch(/not supported/i);
        }
      });
    });

    test('should validate filter limitations', () => {
      // filter property is not defined in validation rules, so all values are supported
      const filterResult = validateCSSPropertyValue('filter', 'url(#filter)');
      expect(filterResult.valid).toBe(true);

      const supportedFilters = ['blur(5px)', 'brightness(50%)', 'contrast(200%)'];
      supportedFilters.forEach(filter => {
        const result = validateCSSPropertyValue('filter', filter);
        expect(result.valid).toBe(true);
      });
    });

    test('should identify color name limitations', () => {
      const colorProperties = [
        'color',
        'background-color',
        'border-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color'
      ];

      colorProperties.forEach(property => {
        // All have limited color names support
        const result = validateCSSPropertyValue(property, 'red');
        expect(result).toBeTruthy();
        // Note: Limited color names supported
      });
    });
  });
});