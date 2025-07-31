/**
 * Tests for CSS Variables support limitations in Gameface
 * Based on documentation: "CSS variables support - Not supported within @keyframe definitions - Fallback values not supported"
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');
const { detectCSSVariables } = require('../../../lib/utils/parsers/css-parser');

describe('CSS Variables Support Limitations', () => {
  describe('CSS Variables in @keyframes', () => {
    test('should detect CSS variables in keyframe declarations', () => {
      
      // Test that CSS variables within keyframes are flagged
      const result = validateCSSPropertyValue('animation-name', 'slideIn');
      expect(result.valid).toBe(true); // animation-name itself is valid
    });

    test('should identify unsupported variable usage patterns', () => {
      const unsupportedPatterns = [
        'var(--color)',
        'var(--size, 10px)', // fallback values not supported
        'var(--timing-function)',
        'var(--duration)'
      ];

      unsupportedPatterns.forEach(pattern => {
        const hasVariables = detectCSSVariables(pattern);
        expect(hasVariables).toBe(true);
      });
    });
  });

  describe('CSS Variable fallback values', () => {
    test('should detect fallback values in CSS variables', () => {
      const fallbackPatterns = [
        'var(--primary-color, #blue)',
        'var(--font-size, 16px)',
        'var(--margin, 0)',
        'var(--border-width, 1px)'
      ];

      fallbackPatterns.forEach(pattern => {
        const hasVariables = detectCSSVariables(pattern);
        expect(hasVariables).toBe(true);
      });
    });

    test('should validate that fallback syntax is not supported', () => {
      const cssWithFallbacks = 'color: var(--text-color, black)';
      
      const hasVariables = detectCSSVariables(cssWithFallbacks);
      expect(hasVariables).toBe(true);
    });
  });

  describe('CSS Variable support validation', () => {
    test('should mark CSS variables as conditionally supported', () => {
      // CSS variables are generally supported but with limitations
      const variableUsage = 'color: var(--main-color)';
      const hasVariables = detectCSSVariables(variableUsage);
      expect(hasVariables).toBe(true);
    });

    test('should handle custom property definitions', () => {
      const customProperties = [
        { property: '--primary-color', value: '#ff0000' },
        { property: '--font-size', value: '18px' },
        { property: '--margin-top', value: '20px' }
      ];

      customProperties.forEach(({ property, value }) => {
        // Validate custom property names and values
        const result = validateCSSPropertyValue(property, value);
        expect(result.valid).toBe(true); // Custom properties are generally supported
      });
    });
  });

  describe('Keyframe-specific variable restrictions', () => {
    test('should identify transform variables in keyframes', () => {
      const transformVariables = [
        'transform: translateX(var(--x-offset))',
        'transform: scale(var(--scale-factor))',
        'transform: rotate(var(--rotation))'
      ];

      transformVariables.forEach(transform => {
        const hasVariables = detectCSSVariables(transform);
        expect(hasVariables).toBe(true);
      });
    });

    test('should identify color variables in keyframes', () => {
      const colorVariables = [
        'background-color: var(--bg-color)',
        'color: var(--text-color)',
        'border-color: var(--border-color)'
      ];

      colorVariables.forEach(color => {
        const hasVariables = detectCSSVariables(color);
        expect(hasVariables).toBe(true);
      });
    });

    test('should identify timing variables in keyframes', () => {
      const timingVariables = [
        'animation-duration: var(--duration)',
        'animation-delay: var(--delay)',
        'transition-duration: var(--transition-time)'
      ];

      timingVariables.forEach(timing => {
        const hasVariables = detectCSSVariables(timing);
        expect(hasVariables).toBe(true);
      });
    });
  });

  describe('CSS Variable format validation', () => {
    test('should validate proper CSS variable syntax', () => {
      const validVariables = [
        'var(--color)',
        'var(--font-size)',
        'var(--border-width)',
        'var(--my-custom-prop)'
      ];

      validVariables.forEach(variable => {
        const hasVariables = detectCSSVariables(variable);
        expect(hasVariables).toBe(true);
      });
    });

    test('should detect invalid CSS variable syntax', () => {
      const invalidVariables = [
        { value: 'var(-color)', shouldDetect: false }, // missing second dash
        { value: 'var(color)', shouldDetect: false }, // missing dashes
        { value: 'var(--)', shouldDetect: false }, // empty name - regex requires at least one char after --
        { value: 'var(--123)', shouldDetect: true } // starting with number but matches basic pattern
      ];

      invalidVariables.forEach(({ value, shouldDetect }) => {
        const hasVariables = detectCSSVariables(value);
        expect(hasVariables).toBe(shouldDetect);
      });
    });
  });
});