/**
 * Tests for validation-rules constants
 */

const {
  SUPPORT_STATUS,
  VALIDATION_RULES,
  getPropertySupport,
  validateCSSPropertyValue
} = require('../../lib/constants/validation-rules');

describe('Validation Rules Constants', () => {
  describe('SUPPORT_STATUS', () => {
    test('should define all status constants', () => {
      expect(SUPPORT_STATUS).toBeDefined();
      expect(SUPPORT_STATUS.YES).toBeDefined();
      expect(SUPPORT_STATUS.NO).toBeDefined();
      expect(SUPPORT_STATUS.PARTIAL).toBeDefined();
      expect(SUPPORT_STATUS.CONDITIONAL).toBeDefined();
    });

    test('should have consistent status values', () => {
      expect(typeof SUPPORT_STATUS.YES).toBe('string');
      expect(typeof SUPPORT_STATUS.NO).toBe('string');
      expect(typeof SUPPORT_STATUS.PARTIAL).toBe('string');
      expect(typeof SUPPORT_STATUS.CONDITIONAL).toBe('string');
    });
  });

  describe('VALIDATION_RULES', () => {
    test('should be defined and be an object', () => {
      expect(VALIDATION_RULES).toBeDefined();
      expect(typeof VALIDATION_RULES).toBe('object');
      expect(VALIDATION_RULES).not.toBeNull();
    });

    test('should contain CSS properties', () => {
      const keys = Object.keys(VALIDATION_RULES);
      expect(keys.length).toBeGreaterThan(0);
      expect(keys).toContain('display');
      expect(keys).toContain('position');
    });

    test('should have proper rule structure', () => {
      const displayRule = VALIDATION_RULES.display;
      expect(displayRule).toHaveProperty('status');
      expect(displayRule).toHaveProperty('supportedValues');
      expect(displayRule).toHaveProperty('unsupportedValues');
      expect(Array.isArray(displayRule.supportedValues)).toBe(true);
      expect(Array.isArray(displayRule.unsupportedValues)).toBe(true);
    });

    test('should have valid status values', () => {
      const someRules = Object.values(VALIDATION_RULES).slice(0, 5);
      for (const rule of someRules) {
        expect([SUPPORT_STATUS.YES, SUPPORT_STATUS.NO, SUPPORT_STATUS.PARTIAL, SUPPORT_STATUS.CONDITIONAL]).toContain(rule.status);
      }
    });

    test('should have consistent rule structure for all properties', () => {
      const allRules = Object.entries(VALIDATION_RULES);
      for (const [property, rule] of allRules) {
        expect(rule).toHaveProperty('status');
        expect(rule).toHaveProperty('supportedValues');
        expect(rule).toHaveProperty('unsupportedValues');
        expect(rule).toHaveProperty('reason');
        expect(Array.isArray(rule.supportedValues)).toBe(true);
        expect(Array.isArray(rule.unsupportedValues)).toBe(true);
        expect(['function', 'string'].includes(typeof rule.reason)).toBe(true);
      }
    });
  });

  describe('getPropertySupport', () => {
    test('should return support info for known properties', () => {
      const displaySupport = getPropertySupport('display');
      expect(displaySupport).toBeDefined();
      expect(displaySupport).toHaveProperty('supported');
      expect(typeof displaySupport.supported).toBe('boolean');
    });

    test('should handle partially supported properties', () => {
      const displaySupport = getPropertySupport('display');
      expect(displaySupport.supported).toBe(true);
    });

    test('should handle unsupported properties', () => {
      const clearSupport = getPropertySupport('clear');
      expect(clearSupport.supported).toBe(false);
    });

    test('should handle unknown properties', () => {
      const unknownSupport = getPropertySupport('unknown-property');
      // Unknown properties default to supported: true based on implementation
      expect(unknownSupport.supported).toBe(true);
    });

    test('should handle conditional properties', () => {
      const flexGrowSupport = getPropertySupport('flex-grow');
      expect(flexGrowSupport.supported).toBe(true);
      expect(flexGrowSupport.status).toBe(SUPPORT_STATUS.CONDITIONAL);
    });

    test('should return complete support information', () => {
      const displaySupport = getPropertySupport('display');
      expect(displaySupport).toHaveProperty('supported');
      expect(displaySupport).toHaveProperty('status');
      expect(displaySupport.status).toBe(SUPPORT_STATUS.PARTIAL);
    });

    test('should handle edge cases', () => {
      // Edge cases default to supported: true based on implementation
      expect(getPropertySupport('')).toHaveProperty('supported', true);
      expect(getPropertySupport(null)).toHaveProperty('supported', true);
      expect(getPropertySupport(undefined)).toHaveProperty('supported', true);
    });
  });

  describe('validateCSSPropertyValue', () => {
    test('should validate supported property values', () => {
      const result = validateCSSPropertyValue('display', 'flex');
      expect(result).toHaveProperty('valid');
      expect(result.valid).toBe(true);
    });

    test('should reject unsupported property values', () => {
      const result = validateCSSPropertyValue('display', 'grid');
      expect(result).toHaveProperty('valid');
      expect(result.valid).toBe(false);
      expect(result).toHaveProperty('reason');
      expect(result.reason).toContain('CSS Grid is not supported');
    });

    test('should handle properties with partial support', () => {
      const validResult = validateCSSPropertyValue('position', 'relative');
      expect(validResult.valid).toBe(true);
      
      const invalidResult = validateCSSPropertyValue('position', 'sticky');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.reason).toContain('Position "sticky" is not supported');
    });

    test('should handle fully unsupported properties', () => {
      const result = validateCSSPropertyValue('clear', 'both');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Clear properties are not supported');
    });

    describe('Display property validation', () => {
      test('should support flex display', () => {
        const result = validateCSSPropertyValue('display', 'flex');
        expect(result.valid).toBe(true);
      });

      test('should reject block display', () => {
        const result = validateCSSPropertyValue('display', 'block');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Display value "block" is not supported');
      });

      test('should reject inline display', () => {
        const result = validateCSSPropertyValue('display', 'inline');
        expect(result.valid).toBe(false);
      });

      test('should reject grid display with specific message', () => {
        const result = validateCSSPropertyValue('display', 'grid');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('CSS Grid is not supported');
      });
    });

    describe('Position property validation', () => {
      test('should support relative position', () => {
        const result = validateCSSPropertyValue('position', 'relative');
        expect(result.valid).toBe(true);
      });

      test('should support absolute position', () => {
        const result = validateCSSPropertyValue('position', 'absolute');
        expect(result.valid).toBe(true);
      });

      test('should support fixed position', () => {
        const result = validateCSSPropertyValue('position', 'fixed');
        expect(result.valid).toBe(true);
      });

      test('should reject sticky position', () => {
        const result = validateCSSPropertyValue('position', 'sticky');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Position "sticky" is not supported');
      });

      test('should reject static position', () => {
        const result = validateCSSPropertyValue('position', 'static');
        expect(result.valid).toBe(false);
      });
    });

    describe('Border style validation', () => {
      test('should support solid border style', () => {
        const result = validateCSSPropertyValue('border-style', 'solid');
        expect(result.valid).toBe(true);
      });

      test('should support none border style', () => {
        const result = validateCSSPropertyValue('border-style', 'none');
        expect(result.valid).toBe(true);
      });

      test('should support hidden border style', () => {
        const result = validateCSSPropertyValue('border-style', 'hidden');
        expect(result.valid).toBe(true);
      });

      test('should reject dotted border style', () => {
        const result = validateCSSPropertyValue('border-style', 'dotted');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Border style "dotted" is not supported');
      });

      test('should reject double border style', () => {
        const result = validateCSSPropertyValue('border-style', 'double');
        expect(result.valid).toBe(false);
      });
    });

    describe('Border directional styles validation', () => {
      test('should handle border-top-style', () => {
        expect(validateCSSPropertyValue('border-top-style', 'solid').valid).toBe(true);
        expect(validateCSSPropertyValue('border-top-style', 'dotted').valid).toBe(false);
      });

      test('should handle border-right-style', () => {
        expect(validateCSSPropertyValue('border-right-style', 'solid').valid).toBe(true);
        expect(validateCSSPropertyValue('border-right-style', 'dashed').valid).toBe(false);
      });

      test('should handle border-bottom-style', () => {
        expect(validateCSSPropertyValue('border-bottom-style', 'solid').valid).toBe(true);
        expect(validateCSSPropertyValue('border-bottom-style', 'groove').valid).toBe(false);
      });

      test('should handle border-left-style', () => {
        expect(validateCSSPropertyValue('border-left-style', 'solid').valid).toBe(true);
        expect(validateCSSPropertyValue('border-left-style', 'ridge').valid).toBe(false);
      });
    });

    describe('Background property validation', () => {
      test('should support background-repeat values', () => {
        expect(validateCSSPropertyValue('background-repeat', 'repeat').valid).toBe(true);
        expect(validateCSSPropertyValue('background-repeat', 'repeat-x').valid).toBe(true);
        expect(validateCSSPropertyValue('background-repeat', 'repeat-y').valid).toBe(true);
        expect(validateCSSPropertyValue('background-repeat', 'no-repeat').valid).toBe(true);
      });

      test('should reject background-repeat space', () => {
        const result = validateCSSPropertyValue('background-repeat', 'space');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('background-repeat: space is not supported');
      });

      test('should reject background-attachment', () => {
        const result = validateCSSPropertyValue('background-attachment', 'fixed');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('background-attachment is not supported');
      });

      test('should reject background-clip', () => {
        const result = validateCSSPropertyValue('background-clip', 'border-box');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('background-clip is not supported');
      });

      test('should reject background-origin', () => {
        const result = validateCSSPropertyValue('background-origin', 'padding-box');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('background-origin is not supported');
      });
    });

    describe('Flexbox property validation', () => {
      test('should support justify-content values', () => {
        expect(validateCSSPropertyValue('justify-content', 'flex-start').valid).toBe(true);
        expect(validateCSSPropertyValue('justify-content', 'flex-end').valid).toBe(true);
        expect(validateCSSPropertyValue('justify-content', 'center').valid).toBe(true);
        expect(validateCSSPropertyValue('justify-content', 'space-between').valid).toBe(true);
        expect(validateCSSPropertyValue('justify-content', 'space-around').valid).toBe(true);
      });

      test('should reject justify-content space-evenly', () => {
        const result = validateCSSPropertyValue('justify-content', 'space-evenly');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('justify-content: space-evenly is not supported');
      });

      test('should support align-items values', () => {
        expect(validateCSSPropertyValue('align-items', 'stretch').valid).toBe(true);
        expect(validateCSSPropertyValue('align-items', 'flex-start').valid).toBe(true);
        expect(validateCSSPropertyValue('align-items', 'flex-end').valid).toBe(true);
        expect(validateCSSPropertyValue('align-items', 'center').valid).toBe(true);
      });

      test('should reject align-items baseline', () => {
        const result = validateCSSPropertyValue('align-items', 'baseline');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('align-items: baseline is not supported');
      });

      test('should support align-content values', () => {
        expect(validateCSSPropertyValue('align-content', 'stretch').valid).toBe(true);
        expect(validateCSSPropertyValue('align-content', 'flex-start').valid).toBe(true);
        expect(validateCSSPropertyValue('align-content', 'flex-end').valid).toBe(true);
        expect(validateCSSPropertyValue('align-content', 'center').valid).toBe(true);
      });

      test('should reject align-content space-between', () => {
        const result = validateCSSPropertyValue('align-content', 'space-between');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('align-content: space-between is not supported');
      });

      test('should support align-self values', () => {
        expect(validateCSSPropertyValue('align-self', 'auto').valid).toBe(true);
        expect(validateCSSPropertyValue('align-self', 'stretch').valid).toBe(true);
        expect(validateCSSPropertyValue('align-self', 'flex-start').valid).toBe(true);
        expect(validateCSSPropertyValue('align-self', 'flex-end').valid).toBe(true);
        expect(validateCSSPropertyValue('align-self', 'center').valid).toBe(true);
      });

      test('should reject align-self baseline', () => {
        const result = validateCSSPropertyValue('align-self', 'baseline');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('align-self: baseline is not supported');
      });

      test('should support flex-basis auto', () => {
        const result = validateCSSPropertyValue('flex-basis', 'auto');
        expect(result.valid).toBe(true);
      });

      test('should reject flex-basis content', () => {
        const result = validateCSSPropertyValue('flex-basis', 'content');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('flex-basis: content is not supported');
      });

      test('should handle conditional flex properties', () => {
        const flexGrowResult = validateCSSPropertyValue('flex-grow', '1');
        expect(flexGrowResult.valid).toBe(false);
        expect(flexGrowResult.reason).toContain('flex-grow is supported only as part of the flex shorthand');

        const flexShrinkResult = validateCSSPropertyValue('flex-shrink', '0');
        expect(flexShrinkResult.valid).toBe(false);
        expect(flexShrinkResult.reason).toContain('flex-shrink is supported only as part of the flex shorthand');
      });
    });

    describe('Layout property validation', () => {
      test('should reject max-width none', () => {
        const result = validateCSSPropertyValue('max-width', 'none');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('max-width: none is not supported');
      });

      test('should reject max-height none', () => {
        const result = validateCSSPropertyValue('max-height', 'none');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('max-height: none is not supported');
      });
    });

    describe('Typography property validation', () => {
      test('should support white-space values', () => {
        expect(validateCSSPropertyValue('white-space', 'normal').valid).toBe(true);
        expect(validateCSSPropertyValue('white-space', 'nowrap').valid).toBe(true);
        expect(validateCSSPropertyValue('white-space', 'pre').valid).toBe(true);
        expect(validateCSSPropertyValue('white-space', 'pre-wrap').valid).toBe(true);
      });

      test('should reject white-space pre-line', () => {
        const result = validateCSSPropertyValue('white-space', 'pre-line');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('whitespace-pre-line is not supported');
      });

      test('should support visibility values', () => {
        expect(validateCSSPropertyValue('visibility', 'visible').valid).toBe(true);
        expect(validateCSSPropertyValue('visibility', 'hidden').valid).toBe(true);
      });

      test('should reject visibility collapse', () => {
        const result = validateCSSPropertyValue('visibility', 'collapse');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('visibility: collapse is not supported');
      });
    });

    describe('Interaction property validation', () => {
      test('should support pointer-events values', () => {
        expect(validateCSSPropertyValue('pointer-events', 'auto').valid).toBe(true);
        expect(validateCSSPropertyValue('pointer-events', 'none').valid).toBe(true);
        expect(validateCSSPropertyValue('pointer-events', 'inherit').valid).toBe(true);
      });

      test('should reject pointer-events all', () => {
        const result = validateCSSPropertyValue('pointer-events', 'all');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('pointer-events: all is not supported');
      });

      test('should reject user-select', () => {
        const result = validateCSSPropertyValue('user-select', 'none');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('The user-select property is not supported');
      });
    });

    describe('Mask property validation', () => {
      test('should support mask-repeat values', () => {
        expect(validateCSSPropertyValue('mask-repeat', 'repeat').valid).toBe(true);
        expect(validateCSSPropertyValue('mask-repeat', 'repeat-x').valid).toBe(true);
        expect(validateCSSPropertyValue('mask-repeat', 'repeat-y').valid).toBe(true);
        expect(validateCSSPropertyValue('mask-repeat', 'no-repeat').valid).toBe(true);
      });

      test('should reject mask-repeat space', () => {
        const result = validateCSSPropertyValue('mask-repeat', 'space');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('mask-repeat: space is not supported');
      });

      test('should support mask-clip border-box', () => {
        const result = validateCSSPropertyValue('mask-clip', 'border-box');
        expect(result.valid).toBe(true);
      });

      test('should reject mask-clip padding-box', () => {
        const result = validateCSSPropertyValue('mask-clip', 'padding-box');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('mask-clip: padding-box is not supported');
      });

      test('should support border-image-repeat values', () => {
        expect(validateCSSPropertyValue('border-image-repeat', 'stretch').valid).toBe(true);
        expect(validateCSSPropertyValue('border-image-repeat', 'repeat').valid).toBe(true);
        expect(validateCSSPropertyValue('border-image-repeat', 'round').valid).toBe(true);
      });

      test('should reject border-image-repeat space', () => {
        const result = validateCSSPropertyValue('border-image-repeat', 'space');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('border-image-repeat: space is not supported');
      });
    });

    describe('Special property validation', () => {
      test('should support all initial', () => {
        const result = validateCSSPropertyValue('all', 'initial');
        expect(result.valid).toBe(true);
      });

      test('should reject all inherit', () => {
        const result = validateCSSPropertyValue('all', 'inherit');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('The "all" property value "inherit" is not supported');
      });
    });

    describe('Completely unsupported properties', () => {
      test('should reject box-sizing', () => {
        const result = validateCSSPropertyValue('box-sizing', 'content-box');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('box-sizing: content-box is not supported');
        expect(result.note).toContain('The default box-sizing in Gameface is border-box');
      });

      test('should reject float', () => {
        const result = validateCSSPropertyValue('float', 'left');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Float properties are not supported');
      });

      test('should reject outline properties', () => {
        expect(validateCSSPropertyValue('outline', 'none').valid).toBe(false);
        expect(validateCSSPropertyValue('outline-color', 'red').valid).toBe(false);
        expect(validateCSSPropertyValue('outline-style', 'solid').valid).toBe(false);
        expect(validateCSSPropertyValue('outline-width', '1px').valid).toBe(false);
      });

      test('should reject various unsupported properties', () => {
        const unsupportedProps = [
          ['border-collapse', 'collapse'],
          ['border-spacing', '2px'],
          ['clear', 'both'],
          ['direction', 'ltr'],
          ['font-variant', 'small-caps'],
          ['list-style', 'disc'],
          ['list-style-type', 'circle'],
          ['list-style-position', 'inside'],
          ['list-style-image', 'url(bullet.png)'],
          ['object-fit', 'cover'],
          ['object-position', 'center'],
          ['order', '1'],
          ['resize', 'both'],
          ['table-layout', 'fixed'],
          ['text-indent', '1em'],
          ['text-justify', 'auto'],
          ['vertical-align', 'baseline'],
          ['word-break', 'break-all'],
          ['word-spacing', '2px'],
          ['zoom', '1.5'],
          ['-webkit-font-smoothing', 'antialiased'],
          ['appearance', 'none']
        ];

        unsupportedProps.forEach(([prop, value]) => {
          const result = validateCSSPropertyValue(prop, value);
          expect(result.valid).toBe(false);
          expect(result.reason).toBeDefined();
        });
      });
    });

    describe('Text overflow validation', () => {
      test('should support text-overflow values', () => {
        expect(validateCSSPropertyValue('text-overflow', 'clip').valid).toBe(true);
        expect(validateCSSPropertyValue('text-overflow', 'ellipsis').valid).toBe(true);
      });
    });

    describe('Properties with supportedValues but not in unsupportedValues', () => {
      test('should handle properties that only have supportedValues', () => {
        // Test a property that has supportedValues but the test value is not in it
        const result = validateCSSPropertyValue('justify-content', 'stretch');
        expect(result.valid).toBe(false);
      });
    });

    describe('Custom Gameface Properties', () => {
      test('should support coh-rendering-option', () => {
        const result = validateCSSPropertyValue('coh-rendering-option', 'snap-off aa-on');
        expect(result.valid).toBe(true);
        
        const resultWithReason = validateCSSPropertyValue('coh-rendering-option', 'test');
        expect(resultWithReason.valid).toBe(true);
        expect(typeof VALIDATION_RULES['coh-rendering-option'].reason).toBe('function');
        expect(VALIDATION_RULES['coh-rendering-option'].reason()).toContain('Custom Gameface property for controlling element rendering options');
      });

      test('should support coh-composition-id', () => {
        const result = validateCSSPropertyValue('coh-composition-id', 'my-id');
        expect(result.valid).toBe(true);
        expect(VALIDATION_RULES['coh-composition-id'].reason()).toContain('Custom Gameface property for identifying composition elements');
      });

      test('should support coh-partitioned with specific values', () => {
        // Test supported values (only 'on' and 'off' are supported)
        expect(validateCSSPropertyValue('coh-partitioned', 'on').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-partitioned', 'off').valid).toBe(true);
        
        // Test unsupported values (true/false are explicitly unsupported)
        expect(validateCSSPropertyValue('coh-partitioned', 'true').valid).toBe(false);
        expect(validateCSSPropertyValue('coh-partitioned', 'false').valid).toBe(false);
        
        // Test unsupported value - should be false since supportedValues are defined
        const invalidResult = validateCSSPropertyValue('coh-partitioned', 'invalid');
        expect(invalidResult.valid).toBe(false);
        expect(invalidResult.reason).toContain('Custom Gameface property for element partitioning');
      });

      test('should support coh-font-fit properties', () => {
        expect(validateCSSPropertyValue('coh-font-fit', 'auto').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-font-fit-min-size', '12px').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-font-fit-max-size', '24px').valid).toBe(true);
        
        expect(VALIDATION_RULES['coh-font-fit'].reason()).toContain('Custom Gameface property for font fitting behavior');
        expect(VALIDATION_RULES['coh-font-fit-min-size'].reason()).toContain('Custom Gameface property for minimum font fit size');
        expect(VALIDATION_RULES['coh-font-fit-max-size'].reason()).toContain('Custom Gameface property for maximum font fit size');
      });

      test('should support coh-blend-mode with specific values', () => {
        const supportedModes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'];
        
        supportedModes.forEach(mode => {
          expect(validateCSSPropertyValue('coh-blend-mode', mode).valid).toBe(true);
        });
        
        expect(VALIDATION_RULES['coh-blend-mode'].reason()).toContain('Custom Gameface property for blend modes');
      });

      test('should support coh-backdrop-filter', () => {
        expect(validateCSSPropertyValue('coh-backdrop-filter', 'blur(5px)').valid).toBe(true);
        expect(VALIDATION_RULES['coh-backdrop-filter'].reason()).toContain('Custom Gameface property for backdrop filtering');
      });

      test('should support coh-transform-3d with boolean values', () => {
        expect(validateCSSPropertyValue('coh-transform-3d', 'true').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-transform-3d', 'false').valid).toBe(true);
        expect(VALIDATION_RULES['coh-transform-3d'].reason()).toContain('Custom Gameface property for 3D transform support');
      });

      test('should support coh-gpu-rendering with specific values', () => {
        expect(validateCSSPropertyValue('coh-gpu-rendering', 'true').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-gpu-rendering', 'false').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-gpu-rendering', 'auto').valid).toBe(true);
        expect(VALIDATION_RULES['coh-gpu-rendering'].reason()).toContain('Custom Gameface property for GPU rendering control');
      });

      test('should support coh-layer-priority', () => {
        expect(validateCSSPropertyValue('coh-layer-priority', '10').valid).toBe(true);
        expect(VALIDATION_RULES['coh-layer-priority'].reason()).toContain('Custom Gameface property for layer priority');
      });

      test('should support coh-event-passthrough with boolean values', () => {
        expect(validateCSSPropertyValue('coh-event-passthrough', 'true').valid).toBe(true);
        expect(validateCSSPropertyValue('coh-event-passthrough', 'false').valid).toBe(true);
        expect(VALIDATION_RULES['coh-event-passthrough'].reason()).toContain('Custom Gameface property for event passthrough behavior');
      });
    });

    describe('Text overflow with unsupported values', () => {
      test('should reject unsupported text-overflow values', () => {
        const result = validateCSSPropertyValue('text-overflow', 'fade');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('text-overflow: fade is not supported by Gameface');
      });
    });

    describe('Properties with supportedValues validation', () => {
      test('should validate against supportedValues list', () => {
        // Test a property with supportedValues where value is NOT in the list
        const rule = VALIDATION_RULES['coh-blend-mode'];
        expect(rule.supportedValues.length).toBeGreaterThan(0);
        
        const result = validateCSSPropertyValue('coh-blend-mode', 'invalid-mode');
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Custom Gameface property for blend modes');
      });

      test('should handle properties with empty supportedValues array', () => {
        // Properties like coh-rendering-option have empty supportedValues arrays
        const result = validateCSSPropertyValue('coh-rendering-option', 'any-value');
        expect(result.valid).toBe(true);
      });
    });

    test('should handle edge cases', () => {
      // Based on implementation, these should return valid: true
      expect(validateCSSPropertyValue('', 'value').valid).toBe(true);
      expect(validateCSSPropertyValue('property', '').valid).toBe(true);
      expect(validateCSSPropertyValue(null, 'value').valid).toBe(true);
      expect(validateCSSPropertyValue('property', null).valid).toBe(true);
    });
  });
});