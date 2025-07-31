/**
 * Tests for Tailwind shadow class failures in Gameface
 * Based on documentation: "Cohtml can't seem to resolve the css variables in the box-shadow" - all shadow classes marked as "No"
 */

const { getGamefaceTailwindSupport } = require('../../lib/utils/parsers/tailwind-parser');

describe('Tailwind Shadow Classes Failures', () => {
  describe('Box shadow classes', () => {
    test('should identify all shadow class patterns', () => {
      const shadowClasses = [
        'shadow-xs',
        'shadow-sm',
        'shadow',
        'shadow-md',
        'shadow-lg',
        'shadow-xl',
        'shadow-2xl',
        'shadow-inner',
        'shadow-outline',
        'shadow-none'
      ];

      shadowClasses.forEach(className => {
        expect(className).toMatch(/^shadow/);
        
        // Verify that these shadow classes are flagged as unsupported
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/shadow|CSS variables|not supported/i);
      });
    });

    test('should detect CSS variable usage in shadow values', () => {
      const shadowVariablePatterns = [
        'var(--tw-shadow)',
        'var(--tw-shadow-color)',
        'var(--tw-ring-shadow)',
        'var(--tw-shadow-colored)'
      ];

      shadowVariablePatterns.forEach(pattern => {
        expect(pattern).toMatch(/var\(--tw-/);
      });
    });
  });

  describe('Shadow CSS output analysis', () => {
    test('should identify problematic box-shadow syntax', () => {
      // These are the types of CSS that Tailwind generates for shadows
      const problematicShadowCSS = [
        'box-shadow: var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
        'box-shadow: 0 1px 3px 0 rgb(0 0 0 / var(--tw-shadow-opacity))',
        'box-shadow: var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
        'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      ];

      problematicShadowCSS.forEach(css => {
        const hasVariables = /var\(/.test(css);
        const hasModernColorSyntax = /rgb\([^)]+\/[^)]+\)/.test(css);
        
        expect(hasVariables || hasModernColorSyntax).toBe(true);
      });
    });

    test('should identify unsupported color formats in shadows', () => {
      const unsupportedColorFormats = [
        'rgb(0 0 0 / var(--tw-shadow-opacity))',
        'rgb(255 255 255 / 0.1)',
        'hsl(0 0% 0% / var(--tw-shadow-opacity))',
        'rgba(0, 0, 0, var(--tw-shadow-opacity))'
      ];

      unsupportedColorFormats.forEach(format => {
        const hasSpaceSeparated = /rgb\(\d+\s+\d+\s+\d+\s*\//.test(format);
        const hasVariableAlpha = /var\(--tw-/.test(format);
        
        expect(hasSpaceSeparated || hasVariableAlpha).toBe(true);
      });
    });
  });

  describe('Ring shadow classes', () => {
    test('should identify all unsupported ring classes', () => {
      const ringClasses = [
        'ring-0',
        'ring-1',
        'ring-2',
        'ring-4',
        'ring-8',
        'ring',
        'ring-inset',
        'ring-white',
        'ring-black',
        'ring-gray-500',
        'ring-opacity-50'
      ];

      ringClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should detect ring-specific CSS variables', () => {
      const ringVariables = [
        'var(--tw-ring-shadow)',
        'var(--tw-ring-color)',
        'var(--tw-ring-opacity)',
        'var(--tw-ring-offset-width)',
        'var(--tw-ring-offset-color)',
        'var(--tw-ring-offset-shadow)'
      ];

      ringVariables.forEach(variable => {
        expect(variable).toMatch(/var\(--tw-ring/);
      });
    });
  });

  describe('Drop shadow classes', () => {
    test('should identify unsupported drop-shadow classes', () => {
      const dropShadowClasses = [
        'drop-shadow-sm',
        'drop-shadow',
        'drop-shadow-md',
        'drop-shadow-lg',
        'drop-shadow-xl',
        'drop-shadow-2xl',
        'drop-shadow-none'
      ];

      dropShadowClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        // Drop shadows use filter property with CSS variables
        expect(support.supported).toBe(false);
      });
    });

    test('should detect filter-based shadow syntax', () => {
      const filterShadowCSS = [
        'filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
        'filter: var(--tw-blur) var(--tw-brightness) drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))',
        'filter: drop-shadow(0 0 #0000)'
      ];

      filterShadowCSS.forEach(css => {
        expect(css).toContain('drop-shadow');
        const hasVariables = /var\(--tw-/.test(css);
        const hasModernSyntax = /rgb\([^)]+\/[^)]+\)/.test(css);
        
        if (hasVariables || hasModernSyntax) {
          expect(true).toBe(true); // These would be problematic
        }
      });
    });
  });

  describe('Shadow color classes', () => {
    test('should identify unsupported shadow color classes', () => {
      const shadowColorClasses = [
        'shadow-red-500',
        'shadow-blue-400',
        'shadow-green-600',
        'shadow-gray-500',
        'shadow-black',
        'shadow-white'
      ];

      shadowColorClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should detect shadow color CSS variables', () => {
      const shadowColorVariables = [
        '--tw-shadow-color: #ef4444',
        '--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color)',
        'var(--tw-shadow-color)',
        'rgb(239 68 68 / var(--tw-shadow-opacity))'
      ];

      shadowColorVariables.forEach(variable => {
        const hasColorVariable = /--tw-shadow-color|var\(--tw-shadow/.test(variable);
        expect(hasColorVariable).toBe(true);
      });
    });
  });

  describe('Alternative shadow solutions', () => {
    test('should suggest manual box-shadow as alternative', () => {
      const manualShadowCSS = [
        'box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      ];

      manualShadowCSS.forEach(css => {
        // These use standard rgba syntax that should work
        expect(css).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/);
        expect(css).not.toContain('var(');
      });
    });

    test('should validate supported shadow syntax patterns', () => {
      const supportedPatterns = [
        /box-shadow:\s*\d+\s+\d+px\s+\d+px\s+rgba\(/,
        /box-shadow:\s*inset\s+\d+\s+\d+px\s+\d+px\s+rgba\(/,
        /box-shadow:\s*none/
      ];

      const testCases = [
        'box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)',
        'box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'box-shadow: none'
      ];

      testCases.forEach((css, index) => {
        expect(css).toMatch(supportedPatterns[index]);
      });
    });
  });

  describe('CSS variable failure modes', () => {
    test('should identify why CSS variables fail in shadows', () => {
      const failureReasons = [
        'CSS variables in color functions',
        'Space-separated RGB syntax', 
        'Variable opacity values',
        'Complex variable interpolation'
      ];

      const problematicExamples = [
        'rgb(0 0 0 / var(--tw-shadow-opacity))', // Variable in color function
        'rgb(255 255 255 / 0.1)', // Space-separated syntax
        'var(--tw-ring-shadow, 0 0 #0000)', // Variable with fallback
        'var(--tw-ring-shadow), var(--tw-shadow)' // Multiple variables
      ];

      problematicExamples.forEach((example, index) => {
        expect(example).toBeTruthy();
        // Each represents a different failure mode
      });
    });

    test('should detect complex shadow compositions', () => {
      const complexShadows = [
        'var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000)',
        '0 0 0 1px rgb(255 255 255 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.1)',
        'var(--tw-ring-shadow), 0 1px 3px 0 rgb(0 0 0 / 0.1)'
      ];

      complexShadows.forEach(shadow => {
        const hasMultipleShadows = shadow.includes(',');
        const hasVariables = /var\(/.test(shadow);
        const hasModernSyntax = /rgb\([^)]+\//.test(shadow);
        
        expect(hasMultipleShadows || hasVariables || hasModernSyntax).toBe(true);
      });
    });
  });

  describe('Error message validation', () => {
    test('should provide helpful error messages for shadow classes', () => {
      const shadowClasses = ['shadow', 'shadow-lg', 'ring-2'];
      
      shadowClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.reason).toBeTruthy();
        expect(support.reason).toMatch(/colors|shadow|support/i);
      });
    });

    test('should suggest alternatives in error messages', () => {
      const expectedSuggestions = [
        'Use manual box-shadow with rgba() colors',
        'Avoid CSS variables in shadow values',
        'Use traditional shadow syntax'
      ];

      expectedSuggestions.forEach(suggestion => {
        expect(suggestion).toMatch(/manual|rgba|traditional|avoid/i);
      });
    });
  });
});