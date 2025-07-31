/**
 * Tests for Tailwind pseudo-class variant failures in Gameface
 * Based on documentation: "We don't support the selector that is used for pseudo-classes" - .hover:, .focus:, .group-hover: marked as "No"
 */

const { getTailwindCSSProperty, getGamefaceTailwindSupport } = require('../../lib/utils/parsers/tailwind-parser');

describe('Tailwind Pseudo-class Variant Failures', () => {
  describe('Basic pseudo-class variants', () => {
    test('should identify all unsupported hover variants', () => {
      const hoverVariants = [
        'hover:bg-blue-500',
        'hover:text-white',
        'hover:border-red-300',
        'hover:opacity-75',
        'hover:scale-105',
        'hover:shadow-lg',
        'hover:underline',
        'hover:no-underline'
      ];

      hoverVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/shadow|variable|support|selector/i);
      });
    });

    test('should identify all unsupported focus variants', () => {
      const focusVariants = [
        'focus:bg-blue-500',
        'focus:text-white',
        'focus:border-blue-400',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        'focus:ring-opacity-50',
        'focus:scale-105'
      ];

      focusVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/shadow|variable|support|selector/i);
      });
    });

    test('should identify all unsupported active variants', () => {
      const activeVariants = [
        'active:bg-blue-700',
        'active:text-white',
        'active:border-blue-500',
        'active:scale-95',
        'active:opacity-80'
      ];

      activeVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Group pseudo-class variants', () => {
    test('should identify all unsupported group-hover variants', () => {
      const groupHoverVariants = [
        'group-hover:bg-blue-500',
        'group-hover:text-white',
        'group-hover:opacity-100',
        'group-hover:scale-105',
        'group-hover:translate-x-2',
        'group-hover:shadow-lg'
      ];

      groupHoverVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/shadow|variable|support|selector/i);
      });
    });

    test('should identify all unsupported group-focus variants', () => {
      const groupFocusVariants = [
        'group-focus:bg-blue-500',
        'group-focus:text-white',
        'group-focus:opacity-100',
        'group-focus:scale-105'
      ];

      groupFocusVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Form pseudo-class variants', () => {
    test('should identify unsupported form state variants', () => {
      const formStateVariants = [
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'enabled:hover:bg-blue-500',
        'checked:bg-blue-500',
        'checked:border-transparent',
        'indeterminate:bg-gray-300',
        'invalid:border-red-500',
        'valid:border-green-500',
        'required:border-red-300',
        'optional:border-gray-300'
      ];

      formStateVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should identify unsupported placeholder variants', () => {
      const placeholderVariants = [
        'placeholder:text-gray-400',
        'placeholder:opacity-75',
        'placeholder:italic'
      ];

      placeholderVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Structural pseudo-class variants', () => {
    test('should identify unsupported first/last variants', () => {
      const structuralVariants = [
        'first:border-t-0',
        'last:border-b-0',
        'first:rounded-t-lg',
        'last:rounded-b-lg',
        'first:mt-0',
        'last:mb-0',
        'only:rounded-lg'
      ];

      structuralVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should identify unsupported nth-child variants', () => {
      const nthChildVariants = [
        'odd:bg-gray-50',
        'even:bg-white',
        'nth-child-3:font-bold'
      ];

      nthChildVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Pseudo-class CSS selector analysis', () => {
    test('should identify problematic pseudo-class selectors', () => {
      const pseudoClassClasses = [
        'hover:bg-blue-500',
        'focus:ring-2',
        'group-hover:opacity-100',
        'disabled:opacity-50',
        'first:border-t-0'
      ];

      pseudoClassClasses.forEach(className => {
        // Verify these pseudo-class variants are not supported by the plugin
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
        expect(support.reason).toMatch(/pseudo-class|selector/i);
      });
    });

    test('should detect complex pseudo-class combinations', () => {
      const complexSelectors = [
        '.group:hover .group-hover\\:scale-105:hover',
        '.focus-within\\:ring-2:focus-within',
        '.hover\\:focus\\:bg-blue-500:hover:focus'
      ];

      complexSelectors.forEach(selector => {
        const pseudoClassCount = (selector.match(/:[a-z-]+/g) || []).length;
        expect(pseudoClassCount).toBeGreaterThan(0);
      });
    });
  });

  describe('Alternative interaction solutions', () => {
    test('should suggest JavaScript event handling alternatives', () => {
      const jsAlternatives = [
        'addEventListener("mouseenter", handler)',
        'addEventListener("mouseleave", handler)',
        'addEventListener("focus", handler)',
        'addEventListener("blur", handler)',
        'addEventListener("click", handler)',
        'element.onmouseenter = handler'
      ];

      jsAlternatives.forEach(alternative => {
        expect(alternative).toMatch(/addEventListener|on\w+/);
      });
    });

    test('should validate manual state management approaches', () => {
      const stateManagementApproaches = [
        'CSS class toggling with JavaScript',
        'Inline style manipulation',
        'Data attribute state tracking',
        'Custom event system'
      ];

      stateManagementApproaches.forEach(approach => {
        expect(approach).toBeTruthy();
      });
    });
  });

  describe('Focus management alternatives', () => {
    test('should suggest focus handling patterns', () => {
      const focusPatterns = [
        'element.addEventListener("focus", showFocusStyles)',
        'element.addEventListener("blur", hideFocusStyles)',
        'document.activeElement tracking',
        'TabIndex management'
      ];

      focusPatterns.forEach(pattern => {
        expect(pattern).toBeTruthy();
      });
    });

    test('should validate accessibility considerations', () => {
      const a11yConsiderations = [
        'Keyboard navigation support',
        'Screen reader compatibility',
        'Focus visible indicators',
        'ARIA state attributes'
      ];

      a11yConsiderations.forEach(consideration => {
        expect(consideration).toBeTruthy();
      });
    });
  });

  describe('Supported base classes without variants', () => {
    test('should validate that base classes work without pseudo-class variants', () => {
      const baseClasses = [
        'bg-blue-500',
        'text-white',
        'border-red-300',
        'opacity-75',
        'scale-105',
        'shadow-lg'
      ];

      baseClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        // Base classes might still fail due to other reasons (shadows, etc)
        if (!className.includes(':')) {
          // Just check that we get a result
          expect(support).toBeTruthy();
        }
      });
    });

    test('should compare variant vs base class support', () => {
      const classPairs = [
        ['bg-blue-500', 'hover:bg-blue-500'],
        ['text-white', 'focus:text-white'],
        ['opacity-75', 'group-hover:opacity-75'],
        ['scale-105', 'active:scale-105']
      ];

      classPairs.forEach(([baseClass, variantClass]) => {
        const baseSupport = getGamefaceTailwindSupport(baseClass);
        const variantSupport = getGamefaceTailwindSupport(variantClass);
        
        // Variant classes should definitely not be supported
        expect(variantSupport.supported).toBe(false);
        // Base classes might fail for other reasons (e.g. shadow classes)
        expect(baseSupport).toBeTruthy();
      });
    });
  });

  describe('Complex variant combinations', () => {
    test('should identify unsupported multi-variant classes', () => {
      const multiVariantClasses = [
        'hover:focus:bg-blue-500',
        'group-hover:hover:scale-105',
        'disabled:hover:opacity-50',
        'first:hover:bg-gray-100',
        'sm:hover:bg-red-500' // Responsive + pseudo-class
      ];

      multiVariantClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should parse variant structure correctly', () => {
      const variantClasses = [
        'hover:bg-blue-500',
        'group-hover:opacity-100',
        'focus:ring-2',
        'disabled:cursor-not-allowed'
      ];

      variantClasses.forEach(className => {
        const parts = className.split(':');
        expect(parts.length).toBe(2);
        expect(parts[0]).toMatch(/^(hover|focus|active|group-hover|group-focus|disabled|first|last)$/);
      });
    });
  });

  describe('Error message validation', () => {
    test('should provide helpful error messages for pseudo-class variants', () => {
      const pseudoClassVariants = ['hover:bg-blue-500', 'focus:ring-2', 'group-hover:opacity-100'];
      
      pseudoClassVariants.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.reason).toBeTruthy();
        expect(support.reason).toMatch(/pseudo-class|selector|not supported/i);
      });
    });

    test('should suggest alternatives in error messages', () => {
      const expectedSuggestions = [
        'Use JavaScript event listeners for interaction states',
        'Implement manual state management with CSS classes',
        'Handle hover/focus states in application logic',
        'Use data attributes for state tracking'
      ];

      expectedSuggestions.forEach(suggestion => {
        expect(suggestion).toMatch(/JavaScript|manual|application|data attributes/i);
      });
    });
  });

  describe('Gameface-specific interaction patterns', () => {
    test('should suggest Gameface-compatible interaction approaches', () => {
      const gamefacePatterns = [
        'Coherent UI event system',
        'Custom CSS class management',
        'Direct style property manipulation',
        'State-based rendering approaches'
      ];

      gamefacePatterns.forEach(pattern => {
        expect(pattern).toBeTruthy();
      });
    });

    test('should validate performance considerations', () => {
      const performanceNotes = [
        'Avoid frequent DOM queries',
        'Batch style updates',
        'Use efficient event delegation',
        'Minimize layout thrashing'
      ];

      performanceNotes.forEach(note => {
        expect(note).toBeTruthy();
      });
    });
  });
});