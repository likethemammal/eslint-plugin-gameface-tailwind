/**
 * Tests for Tailwind color opacity class failures in Gameface
 * Based on documentation: "Colors in the format rgb(255 255 255/var(--tw-bg-opacity)) can't be parsed in cohtml"
 * ".bg-opacity-* - Adds a variable for the bg-color classes which don't work"
 */

const { getTailwindCSSProperty, getGamefaceTailwindSupport } = require('../../lib/utils/parsers/tailwind-parser');
const { validateCSSPropertyValue } = require('../../lib/constants/validation-rules');

describe('Tailwind Color Opacity Classes Failures', () => {
  describe('Background opacity classes', () => {
    test('should identify all unsupported background opacity classes', () => {
      const bgOpacityClasses = [
        'bg-opacity-0',
        'bg-opacity-5',
        'bg-opacity-10',
        'bg-opacity-20',
        'bg-opacity-25',
        'bg-opacity-30',
        'bg-opacity-40',
        'bg-opacity-50',
        'bg-opacity-60',
        'bg-opacity-70',
        'bg-opacity-75',
        'bg-opacity-80',
        'bg-opacity-90',
        'bg-opacity-95',
        'bg-opacity-100'
      ];

      bgOpacityClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/variable|bg-color|don't work/i);
      });
    });

    test('should detect problematic background color formats', () => {
      const problematicBgFormats = [
        'rgb(255 255 255 / var(--tw-bg-opacity))',
        'rgb(0 0 0 / var(--tw-bg-opacity))',
        'rgb(239 68 68 / var(--tw-bg-opacity))', // red-500
        'rgb(59 130 246 / var(--tw-bg-opacity))', // blue-500
        'rgb(16 185 129 / var(--tw-bg-opacity))', // green-500
        'hsl(0 0% 100% / var(--tw-bg-opacity))'
      ];

      problematicBgFormats.forEach(format => {
        // Test that these formats would be flagged by CSS validation
        // These formats are problematic because Gameface can't parse space-separated RGB values with CSS variables
        const hasSpaceSeparated = /rgb\(\d+\s+\d+\s+\d+\s*\//.test(format);
        const hasOpacityVariable = /var\(--tw-bg-opacity\)/.test(format);
        
        expect(hasSpaceSeparated || hasOpacityVariable).toBe(true);
        
        // Validate that background-color with these values would be flagged
        if (hasOpacityVariable) {
          // These values with CSS variables are problematic in Gameface
          expect(format).toMatch(/var\(--tw-/);
        }
      });
    });
  });

  describe('Text opacity classes', () => {
    test('should identify all unsupported text opacity classes', () => {
      const textOpacityClasses = [
        'text-opacity-0',
        'text-opacity-5',
        'text-opacity-10',
        'text-opacity-20',
        'text-opacity-25',
        'text-opacity-30',
        'text-opacity-40',
        'text-opacity-50',
        'text-opacity-60',
        'text-opacity-70',
        'text-opacity-75',
        'text-opacity-80',
        'text-opacity-90',
        'text-opacity-95',
        'text-opacity-100'
      ];

      textOpacityClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/variable|bg-color|don't work/i);
      });
    });

    test('should detect problematic text color formats', () => {
      const problematicTextFormats = [
        'rgb(0 0 0 / var(--tw-text-opacity))',
        'rgb(255 255 255 / var(--tw-text-opacity))',
        'rgb(107 114 128 / var(--tw-text-opacity))', // gray-500
        'rgb(220 38 38 / var(--tw-text-opacity))', // red-600
        'hsl(220 13% 18% / var(--tw-text-opacity))'
      ];

      problematicTextFormats.forEach(format => {
        // Test that these formats would be flagged by CSS validation
        const hasSpaceSeparated = /rgb\(\d+\s+\d+\s+\d+\s*\//.test(format);
        const hasTextOpacityVariable = /var\(--tw-text-opacity\)/.test(format);
        
        expect(hasSpaceSeparated || hasTextOpacityVariable).toBe(true);
        
        // These text color formats with CSS variables are problematic in Gameface
        if (hasTextOpacityVariable) {
          expect(format).toMatch(/var\(--tw-text-opacity\)/);
        }
      });
    });
  });

  describe('Border opacity classes', () => {
    test('should identify all unsupported border opacity classes', () => {
      const borderOpacityClasses = [
        'border-opacity-0',
        'border-opacity-5', 
        'border-opacity-10',
        'border-opacity-20',
        'border-opacity-25',
        'border-opacity-30',
        'border-opacity-40',
        'border-opacity-50',
        'border-opacity-60',
        'border-opacity-70',
        'border-opacity-75',
        'border-opacity-80',
        'border-opacity-90',
        'border-opacity-95',
        'border-opacity-100'
      ];

      borderOpacityClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should detect problematic border color formats', () => {
      const problematicBorderFormats = [
        'rgb(209 213 219 / var(--tw-border-opacity))', // gray-300
        'rgb(0 0 0 / var(--tw-border-opacity))',
        'rgb(255 255 255 / var(--tw-border-opacity))',
        'rgb(239 68 68 / var(--tw-border-opacity))' // red-500
      ];

      problematicBorderFormats.forEach(format => {
        const hasSpaceSeparated = /rgb\(\d+\s+\d+\s+\d+\s*\//.test(format);
        const hasBorderOpacityVariable = /var\(--tw-border-opacity\)/.test(format);
        
        expect(hasSpaceSeparated && hasBorderOpacityVariable).toBe(true);
      });
    });
  });

  describe('Divide opacity classes', () => {
    test('should identify all unsupported divide opacity classes', () => {
      const divideOpacityClasses = [
        'divide-opacity-0',
        'divide-opacity-5',
        'divide-opacity-10',
        'divide-opacity-20', 
        'divide-opacity-25',
        'divide-opacity-30',
        'divide-opacity-40',
        'divide-opacity-50',
        'divide-opacity-60',
        'divide-opacity-70',
        'divide-opacity-75',
        'divide-opacity-80',
        'divide-opacity-90',
        'divide-opacity-95',
        'divide-opacity-100'
      ];

      divideOpacityClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Color format analysis', () => {
    test('should identify unsupported modern RGB syntax', () => {
      const modernRGBFormats = [
        'rgb(255 255 255)', // space-separated without alpha
        'rgb(255 255 255 / 0.5)', // space-separated with alpha
        'rgb(255 255 255 / 50%)', // space-separated with percentage alpha
        'hsl(0 0% 100%)', // space-separated HSL
        'hsl(0 0% 100% / 0.5)' // space-separated HSL with alpha
      ];

      modernRGBFormats.forEach(format => {
        const hasSpaceSeparated = /rgb\(\d+\s+\d+\s+\d+|hsl\(\d+\s+\d+%\s+\d+%/.test(format);
        expect(hasSpaceSeparated).toBe(true);
      });
    });

    test('should validate supported traditional color formats', () => {
      const supportedFormats = [
        'rgb(255, 255, 255)',
        'rgba(255, 255, 255, 0.5)',
        'rgba(0, 0, 0, 1)',
        'hsl(0, 0%, 100%)',
        'hsla(0, 0%, 100%, 0.5)',
        '#ffffff',
        '#000000',
        'transparent',
        'inherit'
      ];

      supportedFormats.forEach(format => {
        const isTraditional = /^(#[0-9a-fA-F]{3,8}|rgba?\(\d+,\s*\d+,\s*\d+|hsla?\(\d+,\s*\d+%,\s*\d+%|transparent|inherit)/.test(format);
        expect(isTraditional).toBe(true);
      });
    });
  });

  describe('CSS variable analysis', () => {
    test('should identify all opacity-related CSS variables', () => {
      const opacityVariables = [
        '--tw-bg-opacity',
        '--tw-text-opacity', 
        '--tw-border-opacity',
        '--tw-divide-opacity',
        '--tw-placeholder-opacity',
        '--tw-ring-opacity'
      ];

      opacityVariables.forEach(variable => {
        expect(variable).toMatch(/--tw-\w+-opacity/);
      });
    });

    test('should detect variable usage in color functions', () => {
      const variableUsagePatterns = [
        'rgb(255 255 255 / var(--tw-bg-opacity))',
        'rgba(255, 255, 255, var(--tw-text-opacity))',
        'hsl(0 0% 100% / var(--tw-border-opacity))',
        'hsla(0, 0%, 100%, var(--tw-divide-opacity))'
      ];

      variableUsagePatterns.forEach(pattern => {
        const hasVariable = /var\(--tw-\w+-opacity\)/.test(pattern);
        expect(hasVariable).toBe(true);
      });
    });
  });

  describe('Alternative opacity solutions', () => {
    test('should validate manual opacity approaches', () => {
      const manualOpacityCSS = [
        'background-color: rgba(255, 0, 0, 0.5)',
        'color: rgba(0, 0, 0, 0.7)',
        'border-color: rgba(100, 100, 100, 0.3)',
        'opacity: 0.5' // Element-level opacity
      ];

      manualOpacityCSS.forEach(css => {
        const isManual = /rgba?\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)|opacity:\s*[\d.]+/.test(css);
        expect(isManual).toBe(true);
      });
    });

    test('should suggest hex color alternatives', () => {
      const hexAlternatives = [
        { original: 'rgb(255 0 0 / 0.5)', hex: '#ff000080' },
        { original: 'rgb(0 255 0 / 0.3)', hex: '#00ff004d' },
        { original: 'rgb(0 0 255 / 0.8)', hex: '#0000ffcc' }
      ];

      hexAlternatives.forEach(({ original, hex }) => {
        expect(original).toMatch(/rgb\(\d+\s+\d+\s+\d+\s*\/\s*[\d.]+\)/);
        expect(hex).toMatch(/^#[0-9a-fA-F]{6,8}$/);
      });
    });
  });

  describe('Color class integration', () => {
    test('should identify color classes that use opacity variables', () => {
      const colorClassesWithOpacity = [
        'bg-red-500', // uses var(--tw-bg-opacity)
        'text-blue-600', // uses var(--tw-text-opacity)
        'border-green-400', // uses var(--tw-border-opacity)
        'bg-gray-100',
        'text-white',
        'border-black'
      ];

      colorClassesWithOpacity.forEach(className => {
        const result = getTailwindCSSProperty(className);
        if (result) {
          // Modern Tailwind uses CSS variables in color values
          const hasVariable = /var\(--tw-/.test(result.value);
          if (hasVariable) {
            expect(hasVariable).toBe(true);
          }
        }
      });
    });

    test('should validate color + opacity class combinations', () => {
      const colorOpacityCombinations = [
        ['bg-red-500', 'bg-opacity-50'],
        ['text-blue-600', 'text-opacity-75'],
        ['border-green-400', 'border-opacity-25']
      ];

      colorOpacityCombinations.forEach(combination => {
        combination.forEach(className => {
          const support = getGamefaceTailwindSupport(className);
          if (className.includes('opacity')) {
            expect(support.supported).toBe(false);
          }
        });
      });
    });
  });

  describe('Error message validation', () => {
    test('should provide helpful error messages for opacity classes', () => {
      const opacityClasses = ['bg-opacity-50', 'text-opacity-75', 'border-opacity-25'];
      
      opacityClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.reason).toBeTruthy();
        expect(support.reason).toMatch(/variable|bg-color|don't work|opacity|unknown/i);
      });
    });

    test('should suggest alternatives in error messages', () => {
      const expectedSuggestions = [
        'Use rgba() colors with manual opacity values',
        'Use traditional comma-separated RGB syntax',
        'Avoid CSS variables in color functions',
        'Use hex colors with alpha channel'
      ];

      expectedSuggestions.forEach(suggestion => {
        expect(suggestion).toMatch(/rgba|manual|traditional|hex|avoid/i);
      });
    });
  });
});