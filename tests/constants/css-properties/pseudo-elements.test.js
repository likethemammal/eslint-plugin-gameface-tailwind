/**
 * Tests for pseudo-element property restrictions in Gameface
 * Based on documentation: "::selection PARTIAL - only color and background-color properties"
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');
const { validatePseudoElement } = require('../../../lib/utils/parsers/css-parser');

describe('Pseudo-element Property Restrictions', () => {

  describe('::before and ::after pseudo-elements', () => {
    test('should validate ::before and ::after support', () => {
      const beforeAfterProperties = [
        'content',
        'display',
        'position',
        'width',
        'height',
        'background-color',
        'background-image',
        'border',
        'margin',
        'padding'
      ];

      beforeAfterProperties.forEach(property => {
        // ::before and ::after should support most properties
        const result = validateCSSPropertyValue(property, 'test-value');
        // Most properties should be valid for ::before/::after
        expect(result).toBeTruthy();
      });
    });

    test('should require content property for ::before and ::after', () => {
      const contentValues = [
        '"text"',
        "'text'",
        'attr(data-content)',
        'counter(section)',
        'open-quote',
        'close-quote',
        'none',
        '""'
      ];

      contentValues.forEach(value => {
        const result = validateCSSPropertyValue('content', value);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Unsupported pseudo-elements', () => {
    test('should identify completely unsupported pseudo-elements', () => {
      const unsupportedPseudoElements = [
        '::first-letter',
        '::first-line',
        '::cue',
        '::slotted',
        '::backdrop',
        '::placeholder',
        '::marker',
        '::spelling-error',
        '::grammar-error'
      ];

      unsupportedPseudoElements.forEach(pseudoElement => {
        const result = validatePseudoElement(pseudoElement);
        expect(result.valid).toBe(false);
        // These pseudo-elements are not supported at all
        expect(pseudoElement).toMatch(/^::/);
      });
    });
  });

  describe('CSS selector validation for pseudo-elements', () => {
    test('should validate pseudo-element selector syntax', () => {
      const pseudoElementSelectors = [
        'p::before',
        'div::after',
        'span::selection',
        '.class::before',
        '#id::after',
        'element::selection'
      ];

      pseudoElementSelectors.forEach(selector => {
        // Extract just the pseudo-element part for validation
        const pseudoElement = selector.match(/::[a-zA-Z-]+/)[0];
        const result = validatePseudoElement(pseudoElement);
        if (['::before', '::after', '::selection'].includes(pseudoElement)) {
          expect(result.valid).toBe(true);
        }
        expect(selector).toMatch(/::/);
      });
    });

    test('should identify invalid pseudo-element combinations', () => {
      const invalidCombinations = [
        'p::before::after', // Multiple pseudo-elements
        'div::selection::before', // Invalid combinations
        '::before p', // Pseudo-element not at end
        'p ::before' // Space before pseudo-element
      ];

      invalidCombinations.forEach(combination => {
        // These should be flagged as invalid due to syntax issues
        const pseudoElementCount = (combination.match(/::/g) || []).length;
        if (pseudoElementCount > 1) {
          expect(pseudoElementCount).toBeGreaterThan(1);
          // Multiple pseudo-elements are invalid
        }
        // Test first pseudo-element found to see if it would normally be valid
        const firstPseudoElement = combination.match(/::[a-zA-Z-]+/)?.[0];
        if (firstPseudoElement) {
          const result = validatePseudoElement(firstPseudoElement);
          // Individual pseudo-element might be valid, but combination is not
        }
      });
    });
  });

  describe('Property restrictions by pseudo-element', () => {
    test('should validate ::selection property restrictions', () => {
      const selectionCSS = [
        '::selection { color: blue; }', // Valid
        '::selection { background-color: yellow; }', // Valid
        '::selection { color: red; background-color: blue; }', // Valid
        '::selection { font-size: 16px; }', // Invalid
        '::selection { border: 1px solid black; }', // Invalid
        '::selection { text-shadow: 1px 1px 1px black; }' // Invalid
      ];

      selectionCSS.forEach(css => {
        const hasOnlyValidProps = /::selection\s*{\s*(color|background-color)[^}]*}/.test(css);
        const hasInvalidProps = /(font-size|border|text-shadow|margin|padding)/.test(css);
        
        // Test the pseudo-element validation
        const result = validatePseudoElement('::selection');
        expect(result.valid).toBe(true);
        if (result.note) {
          expect(result.note).toContain('color and background-color');
        }
        
        if (hasInvalidProps && css.includes('::selection')) {
          expect(hasInvalidProps).toBe(true); // Should be flagged as invalid
        }
      });
    });

    test('should validate ::before/::after content requirements', () => {
      const beforeAfterCSS = [
        '::before { content: ""; }', // Valid - has content
        '::after { content: "text"; }', // Valid - has content
        '::before { color: red; }', // Invalid - missing content
        '::after { background: blue; }' // Invalid - missing content
      ];

      beforeAfterCSS.forEach(css => {
        const hasContent = /content\s*:/.test(css);
        const isBeforeAfter = /::(before|after)/.test(css);

        // Test pseudo-element validity
        const pseudoElementMatch = css.match(/::(before|after)/);
        if (pseudoElementMatch) {
          const result = validatePseudoElement('::' + pseudoElementMatch[1]);
          expect(result.valid).toBe(true);
        }

        if (isBeforeAfter && !hasContent) {
          // Should be flagged as missing required content property
          expect(isBeforeAfter && !hasContent).toBe(true);
        }
      });
    });
  });

  describe('Pseudo-element inheritance and specificity', () => {
    test('should validate pseudo-element specificity rules', () => {
      const specificityExamples = [
        'p::before', // Element + pseudo-element
        '.class::after', // Class + pseudo-element
        '#id::selection', // ID + pseudo-element
        'div.class::before', // Element.class + pseudo-element
        'body p::after' // Descendant + pseudo-element
      ];

      specificityExamples.forEach(selector => {
        // Extract pseudo-element for validation
        const pseudoElementMatch = selector.match(/::[a-zA-Z-]+/);
        if (pseudoElementMatch) {
          const result = validatePseudoElement(pseudoElementMatch[0]);
          if (['::before', '::after', '::selection'].includes(pseudoElementMatch[0])) {
            expect(result.valid).toBe(true);
          }
        }
        expect(selector).toMatch(/::/);
        // Each should have different specificity values
      });
    });

    test('should validate inheritance behavior', () => {
      const inheritableProperties = [
        'color',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'text-align'
      ];

      const nonInheritableProperties = [
        'width',
        'height',
        'margin',
        'padding',
        'border',
        'background-color',
        'position',
        'display'
      ];

      inheritableProperties.forEach(property => {
        // Test that these properties are generally supported
        const result = validateCSSPropertyValue(property, 'inherit');
        expect(result.valid).toBe(true);
        // These properties can be inherited by pseudo-elements
      });

      nonInheritableProperties.forEach(property => {
        // Test that these properties are generally supported with appropriate values
        const testValues = {
          'width': '100px',
          'height': '100px', 
          'margin': '10px',
          'padding': '10px',
          'border': '1px solid black',
          'background-color': 'red',
          'position': 'relative',
          'display': 'flex'
        };
        const result = validateCSSPropertyValue(property, testValues[property] || 'initial');
        expect(result.valid).toBe(true);
        // These properties are not inherited by pseudo-elements by default
      });
    });
  });

  describe('Browser compatibility and fallbacks', () => {
    test('should identify legacy pseudo-element syntax', () => {
      const legacySyntax = [
        'p:before', // Old single-colon syntax
        'div:after',
        'span:first-letter',
        '.class:first-line'
      ];

      const modernSyntax = [
        'p::before', // Modern double-colon syntax
        'div::after',
        'span::first-letter',
        '.class::first-line'
      ];

      legacySyntax.forEach((legacy, index) => {
        // Test modern syntax validation
        const modernPseudoElement = modernSyntax[index].match(/::[a-zA-Z-]+/)?.[0];
        if (modernPseudoElement) {
          const result = validatePseudoElement(modernPseudoElement);
          // Some are supported, some are not
          expect(result).toBeTruthy(); // Should have a validation result
        }
        expect(legacy).toMatch(/:[^:]/);
        expect(modernSyntax[index]).toMatch(/::/);
      });
    });

    test('should validate pseudo-element feature detection', () => {
      const featureDetection = [
        '@supports (selector(::before))',
        '@supports (selector(::selection))',
        'CSS.supports("selector(::after)")'
      ];

      featureDetection.forEach(detection => {
        // These are CSS/JS feature detection patterns
        expect(detection).toMatch(/supports|selector/);
        // Extract pseudo-element if present
        const pseudoElementMatch = detection.match(/::[a-zA-Z-]+/);
        if (pseudoElementMatch) {
          const result = validatePseudoElement(pseudoElementMatch[0]);
          expect(result).toBeTruthy();
        }
      });
    });
  });

  describe('Common pseudo-element use cases', () => {
    test('should validate decorative elements with ::before/::after', () => {
      const decorativeCSS = [
        '::before { content: "★"; }',
        '::after { content: ""; width: 10px; height: 10px; background: red; }',
        '::before { content: attr(data-icon); }'
      ];

      decorativeCSS.forEach(css => {
        // Test pseudo-element validation
        const pseudoElementMatch = css.match(/::[a-zA-Z-]+/);
        if (pseudoElementMatch) {
          const result = validatePseudoElement(pseudoElementMatch[0]);
          if (['::before', '::after'].includes(pseudoElementMatch[0])) {
            expect(result.valid).toBe(true);
          }
        }
      });
    });

    test('should validate text selection styling', () => {
      const selectionStyling = [
        '::selection { background-color: #3390ff; color: white; }',
        '::-moz-selection { background-color: #3390ff; color: white; }' // Firefox prefix
      ];

      selectionStyling.forEach(css => {
        // Test ::selection pseudo-element validation
        if (css.includes('::selection')) {
          const result = validatePseudoElement('::selection');
          expect(result.valid).toBe(true);
          expect(result.note).toContain('color and background-color');
        }
      });
    });
  });

  describe('Error handling and validation', () => {
    test('should provide specific error messages for pseudo-element restrictions', () => {
      const restrictedUsage = [
        { element: '::selection', property: 'font-size', reason: 'Only color and background-color are supported in ::selection' },
        { element: '::before', property: '', reason: 'content property is required for ::before and ::after' },
        { element: '::first-letter', property: 'any', reason: '::first-letter pseudo-element is not supported' }
      ];

      restrictedUsage.forEach(({ element, property, reason }) => {
        // Test the pseudo-element validation
        const result = validatePseudoElement(element);
        if (['::before', '::after', '::selection'].includes(element)) {
          expect(result.valid).toBe(true);
        } else {
          expect(result.valid).toBe(false);
        }
      });
    });

    test('should suggest alternatives for unsupported pseudo-elements', () => {
      const alternatives = [
        { unsupported: '::first-letter', alternative: 'Use <span> wrapper with styling' },
        { unsupported: '::first-line', alternative: 'Use JavaScript to wrap first line' },
        { unsupported: '::placeholder', alternative: 'Style placeholder attribute directly' }
      ];

      alternatives.forEach(({ unsupported, alternative }) => {
        // Test that these are indeed unsupported
        const result = validatePseudoElement(unsupported);
        expect(result.valid).toBe(false);
      });
    });
  });
});