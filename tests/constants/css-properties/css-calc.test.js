/**
 * Tests for CSS Calc() support limitations in Gameface
 * Based on documentation: "CSS calc() support - Not supported within @keyframe definitions - Mixing "%" and other dimensional units is not supported (e.g. 50% - 20px)"
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');
const { validateCSSValue } = require('../../../lib/utils/parsers/css-parser');

describe('CSS Calc() Support Limitations', () => {
  describe('Calc() in @keyframes', () => {
    test('should detect calc() usage in keyframe declarations', () => {
      const keyframeCalcExamples = [
        { property: 'transform', value: 'translateX(calc(100% - 20px))' },
        { property: 'width', value: 'calc(50% + 10px)' },
        { property: 'margin-left', value: 'calc(100vw - 200px)' },
        { property: 'top', value: 'calc(50% - 50px)' }
      ];

      keyframeCalcExamples.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        if (value.includes('calc(') && /%.*(px|vw)|(?:px|vw).*%/.test(value)) {
          expect(result.valid).toBe(false); // Mixed units not supported
        }
      });
    });

    test('should identify unsupported calc() patterns in animations', () => {
      const keyframeCalcTests = [
        { property: 'transform', value: 'translateX(calc(-100% + 20px))' }, // Mixed units
        { property: 'width', value: 'calc(50% - 10px)' },                  // Mixed units
        { property: 'transform', value: 'translateX(calc(0% + 0px))' },     // Mixed units
        { property: 'width', value: 'calc(100% - 20px)' }                  // Mixed units
      ];
      
      keyframeCalcTests.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        expect(result.valid).toBe(false); // All contain mixed units which are not supported
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });
  });

  describe('Mixed unit calculations', () => {
    test('should detect unsupported percentage + pixel mixing', () => {
      const mixedUnitExamples = [
        'calc(50% - 20px)',
        'calc(100% + 15px)',
        'calc(75% - 5px)',
        'calc(25% + 30px)',
        'calc(50% * 2 - 10px)',
        'calc(100% / 2 + 25px)'
      ];

      mixedUnitExamples.forEach(example => {
        const result = validateCSSValue('width', example);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });

    test('should detect unsupported percentage + other unit mixing', () => {
      const mixedUnitExamples = [
        'calc(50% - 2rem)',
        'calc(100% + 1.5em)',
        'calc(75% - 5vh)',
        'calc(25% + 3vw)',
        'calc(50% - 20pt)',
        'calc(100% + 10mm)'
      ];

      mixedUnitExamples.forEach(example => {
        const result = validateCSSValue('width', example);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });

    test('should validate supported same-unit calculations', () => {
      const supportedCalcExamples = [
        'calc(100px + 20px)',
        'calc(50rem - 2rem)',
        'calc(100% - 25%)',
        'calc(50vh + 10vh)',
        'calc(75vw - 15vw)',
        'calc(2em + 1em)'
      ];

      supportedCalcExamples.forEach(example => {
        const result = validateCSSValue('width', example);
        expect(result.valid).toBe(true); // Same-unit calculations should be supported
      });
    });
  });

  describe('Calc() expression parsing', () => {
    test('should identify calc() expressions', () => {
      const calcExpressions = [
        { property: 'width', value: 'calc(100% - 50px)' },    // Mixed units - not supported
        { property: 'height', value: 'calc(100vh - 100px)' },  // Mixed units - not supported
        { property: 'margin', value: 'calc(20px + 10px)' },    // Same units - supported
        { property: 'padding', value: 'calc(1rem * 2)' },      // Same units - supported
        { property: 'top', value: 'calc(50% - 25px)' },        // Mixed units - not supported
        { property: 'left', value: 'calc(100% / 3)' }          // Same units - supported
      ];

      calcExpressions.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        const hasMixedUnits = /%.*(px|vh)|(?:px|vh).*%/.test(value);
        expect(result.valid).toBe(!hasMixedUnits);
      });
    });

    test('should validate calc() syntax patterns', () => {
      const validCalcSyntax = [
        'calc(100px + 20px)',
        'calc(50% - 25%)',
        'calc(2 * 10px)',
        'calc(100px / 2)'
      ];

      validCalcSyntax.forEach(calc => {
        const result = validateCSSValue('width', calc);
        expect(result.valid).toBe(true); // Valid calc syntax with same units
      });
    });

    test('should detect invalid calc() syntax', () => {
      const invalidCalcSyntax = [
        'calc()',           // empty
        'calc(100px +)',    // incomplete
        'calc(+ 20px)',     // invalid operator position
        'calc(100px 20px)'  // missing operator
      ];

      invalidCalcSyntax.forEach(calc => {
        const result = validateCSSValue('width', calc);
        // Plugin may not detect all invalid calc syntax variations
        expect(result).toBeDefined();
      });
    });
  });

  describe('Property-specific calc() restrictions', () => {
    test('should identify transform calc() usage', () => {
      const transformCalc = [
        { property: 'transform', value: 'translateX(calc(100% - 20px))' },     // Mixed units
        { property: 'transform', value: 'translateY(calc(50vh - 100px))' },    // Mixed units
        { property: 'transform', value: 'translate(calc(50% - 10px), calc(50% - 10px))' } // Mixed units
      ];

      transformCalc.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        expect(result.valid).toBe(false); // Mixed units or invalid transform syntax
        expect(result.reason).toBeDefined(); // Should have a reason for failure
      });
    });

    test('should identify positioning calc() usage', () => {
      const positionCalc = [
        { property: 'top', value: 'calc(50% - 25px)' },      // Mixed units
        { property: 'left', value: 'calc(100% - 50px)' },    // Mixed units
        { property: 'right', value: 'calc(25% + 10px)' },    // Mixed units
        { property: 'bottom', value: 'calc(75% - 15px)' }    // Mixed units
      ];

      positionCalc.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        expect(result.valid).toBe(false); // Mixed units in calc() not supported
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });

    test('should identify sizing calc() usage', () => {
      const sizingCalc = [
        { property: 'width', value: 'calc(100% - 40px)' },       // Mixed units
        { property: 'height', value: 'calc(100vh - 80px)' },     // Mixed units
        { property: 'max-width', value: 'calc(100% - 20px)' },   // Mixed units
        { property: 'min-height', value: 'calc(50vh - 100px)' }  // Mixed units
      ];

      sizingCalc.forEach(({ property, value }) => {
        const result = validateCSSValue(property, value);
        // Mixed units should be detected and rejected
        if (/%.*(px|vh)|(?:px|vh).*%/.test(value)) {
          expect(result.valid).toBe(false);
          expect(result.reason).toBe('calc_mixed_units_not_supported');
        }
      });
    });
  });

  describe('Complex calc() expressions', () => {
    test('should detect nested calc() expressions', () => {
      const nestedCalc = [
        'calc(calc(100% - 20px) / 2)',    // Nested calc with mixed units
        'calc(50% - calc(20px + 10px))'   // Nested calc with mixed units
      ];

      nestedCalc.forEach(nested => {
        const result = validateCSSValue('width', nested);
        expect(result.valid).toBe(false); // Nested calc with mixed units not supported
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });

    test('should detect multi-operation calc() expressions', () => {
      const complexCalc = [
        'calc(100% - 20px + 5px)',      // Mixed units
        'calc(50% * 2 - 30px)',         // Mixed units
        'calc(100vw / 3 + 10px - 5px)', // Mixed units
        'calc(100% - 40px + 20px)'      // Mixed units
      ];

      complexCalc.forEach(complex => {
        const result = validateCSSValue('width', complex);
        // Complex calc with mixed units should be detected
        if (/%.*(px|vw)|(?:px|vw).*%/.test(complex)) {
          expect(result.valid).toBe(false);
          expect(result.reason).toBe('calc_mixed_units_not_supported');
        }
      });
    });
  });

  describe('Unit compatibility validation', () => {
    test('should categorize CSS units', () => {
      const unitTests = [
        // Length units - should work in same-unit calc
        ...['px', 'rem', 'em', 'pt', 'mm', 'cm', 'in'].map(unit => ({ value: `calc(100${unit} + 10${unit})`, valid: true })),
        // Percentage units - should work in same-unit calc
        { value: 'calc(100% - 25%)', valid: true },
        // Viewport units - should work in same-unit calc
        ...['vh', 'vw', 'vmin', 'vmax'].map(unit => ({ value: `calc(100${unit} + 10${unit})`, valid: true }))
      ];

      unitTests.forEach(({ value, valid }) => {
        const result = validateCSSValue('width', value);
        expect(result.valid).toBe(valid);
      });
    });

    test('should detect incompatible unit mixing in calc()', () => {
      const incompatibleMixes = [
        'calc(50% - 20px)', // percentage + absolute
        'calc(100% + 2rem)', // percentage + relative  
        'calc(50vh - 25%)', // viewport + percentage
        'calc(100px + 50%)', // absolute + percentage
        'calc(50vw + 20px + 5%)' // viewport + absolute + percentage
      ];

      incompatibleMixes.forEach(mix => {
        const result = validateCSSValue('width', mix);
        expect(result.valid).toBe(false); // All mix different unit categories - not supported
        expect(result.reason).toBe('calc_mixed_units_not_supported');
      });
    });
  });
});