/**
 * Tests for CSS Selectors support in Gameface
 * Based on documentation: CSSSelectorsSupportedByGameface.md
 */

const { validateCSSPropertyValue, SUPPORT_STATUS } = require('../../../lib/constants/validation-rules');
const { validateCSSSelector } = require('../../../lib/utils/parsers/css-parser');

describe('CSS Selectors Support', () => {
  describe('Simple Selectors (Supported)', () => {
    test('should support type selectors', () => {
      const typeSelectors = [
        'div',
        'span',
        'input',
        'button',
        'img',
        'a'
      ];

      typeSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(true);
        expect(selector).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/);
      });
    });

    test('should support class selectors', () => {
      const classSelectors = [
        '.classname',
        '.my-class',
        '.component_name',
        '.class123'
      ];

      classSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(true);
        expect(selector).toMatch(/^\.[a-zA-Z_-][a-zA-Z0-9_-]*$/);
      });
    });

    test('should support ID selectors', () => {
      const idSelectors = [
        '#id',
        '#my-id',
        '#component_id',
        '#id123'
      ];

      idSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(true);
        expect(selector).toMatch(/^#[a-zA-Z_-][a-zA-Z0-9_-]*$/);
      });
    });

    test('should support universal selector', () => {
      const universalSelector = '*';
      const result = validateCSSSelector(universalSelector);
      expect(result.valid).toBe(true);
      expect(universalSelector).toBe('*');
    });

    test('should support attribute selectors', () => {
      const attributeSelectors = [
        'a[href]',
        'input[type="text"]',
        'div[class~="active"]',
        'span[data-value*="test"]',
        'img[alt^="Icon"]',
        'a[href$=".pdf"]'
      ];

      attributeSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(true);
        expect(selector).toMatch(/\[[\w-]+([~|^$*]?=.*)?\]/);
      });
    });
  });

  describe('Combinators (Conditional Support)', () => {
    test('should identify adjacent sibling combinators', () => {
      const adjacentSiblingSelectors = [
        'img + p',
        'h1 + h2',
        'div + span',
        '.class1 + .class2',
        '#id1 + #id2'
      ];

      adjacentSiblingSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        expect(selector).toMatch(/\s*\+\s*/);
        // These require EnableComplexCSSSelectorsStyling = true
      });
    });

    test('should identify general sibling combinators', () => {
      const generalSiblingSelectors = [
        'p ~ span',
        'h1 ~ p',
        'div ~ div',
        '.class1 ~ .class2',
        '#header ~ section'
      ];

      generalSiblingSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        expect(selector).toMatch(/\s*~\s*/);
        // These require EnableComplexCSSSelectorsStyling = true
      });
    });

    test('should identify child combinators', () => {
      const childSelectors = [
        'div > span',
        'ul > li',
        'nav > ul',
        '.parent > .child',
        '#container > .item'
      ];

      childSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        expect(selector).toMatch(/\s*>\s*/);
        // These require EnableComplexCSSSelectorsStyling = true
      });
    });

    test('should identify descendant combinators', () => {
      const descendantSelectors = [
        'li li',
        'div span',
        'nav ul li',
        '.container .item',
        '#header .navigation .link'
      ];

      descendantSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        expect(selector).toMatch(/\s+/);
        // These require EnableComplexCSSSelectorsStyling = true
      });
    });

    test('should validate complex selector requirements', () => {
      const complexSelectors = [
        'img + p',           // Adjacent sibling
        'p ~ span',          // General sibling  
        'div > span',        // Child
        'li li',             // Descendant
        'div > p + span'     // Combined
      ];

      complexSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        // All these require EnableComplexCSSSelectorsStyling = true
        const hasComplexCombinator = /[+~>]|\s+\w/.test(selector);
        expect(hasComplexCombinator).toBe(true);
      });
    });
  });

  describe('Pseudo Classes', () => {
    describe('Supported Pseudo Classes', () => {
      test('should support :active pseudo-class', () => {
        const activeSelectors = [
          'p:active',
          'button:active',
          'a:active',
          '.button:active'
        ];

        activeSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/:active$/);
        });
      });

      test('should support :focus pseudo-class', () => {
        const focusSelectors = [
          'input:focus',
          'button:focus',
          'a:focus',
          '.form-control:focus'
        ];

        focusSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/:focus$/);
        });
      });

      test('should support :hover pseudo-class', () => {
        const hoverSelectors = [
          'p:hover',
          'div:hover',
          'a:hover',
          '.card:hover'
        ];

        hoverSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/:hover$/);
        });
      });

      test('should support structural pseudo-classes', () => {
        const structuralSelectors = [
          'p:first-child',
          'li:last-child', 
          'div:only-child',
          '.item:first-child'
        ];

        structuralSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/:(?:first-child|last-child|only-child)$/);
        });
      });

      test('should support :root pseudo-class', () => {
        const rootSelector = ':root';
        const result = validateCSSSelector(rootSelector);
        expect(result.valid).toBe(true);
        expect(rootSelector).toBe(':root');
      });

      test('should support :nth-child() with limitations', () => {
        const nthChildSelectors = [
          ':nth-child(4n)',
          'li:nth-child(2n+1)',
          'div:nth-child(odd)',
          'p:nth-child(even)'
        ];

        nthChildSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/:nth-child\([^)]+\)/);
          // Note: No support for complex selector list syntax
          expect(selector).not.toMatch(/:nth-child\([^)]*of[^)]*\)/);
        });
      });
    });

    describe('Unsupported Pseudo Classes', () => {
      test('should identify unsupported form pseudo-classes', () => {
        const unsupportedFormPseudos = [
          'input:checked',
          'input:disabled',
          'input:enabled',
          'input:invalid',
          'input:valid',
          'input:required',
          'input:optional',
          'input:read-only',
          'input:read-write',
          'input:in-range',
          'input:out-of-range',
          'input:indeterminate'
        ];

        unsupportedFormPseudos.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(false);
          expect(selector).toMatch(/:(?:checked|disabled|enabled|invalid|valid|required|optional|read-only|read-write|in-range|out-of-range|indeterminate)$/);
        });
      });

      test('should identify unsupported structural pseudo-classes', () => {
        const unsupportedStructural = [
          'p:first-of-type',
          'h2:last-of-type',
          'p:nth-last-child(4n)',
          'p:nth-last-of-type(4n)',
          'p:nth-of-type(4n)',
          'p:only-of-type',
          'p:empty'
        ];

        unsupportedStructural.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(false);
          expect(selector).toMatch(/:(?:first-of-type|last-of-type|nth-last-child|nth-last-of-type|nth-of-type|only-of-type|empty)/);
        });
      });

      test('should identify unsupported link pseudo-classes', () => {
        const unsupportedLink = [
          'a:link',
          'a:visited',
          'a:any-link'
        ];

        unsupportedLink.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(false);
          expect(selector).toMatch(/:(?:link|visited|any-link)$/);
        });
      });

      test('should identify unsupported functional pseudo-classes', () => {
        const unsupportedFunctional = [
          ':not(p,h1)',
          ':matches(header, main)',
          'p:lang(en)',
          ':dir(rtl)',
          ':host',
          ':host(.special-custom-element)',
          ':host-context(h1)',
          ':target',
          ':scope'
        ];

        unsupportedFunctional.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(false);
          expect(selector).toMatch(/:(?:not|matches|lang|dir|host|target|scope)/);
        });
      });
    });
  });

  describe('Pseudo Elements', () => {
    describe('Supported Pseudo Elements', () => {
      test('should support ::before and ::after', () => {
        const supportedPseudoElements = [
          'a::before',
          'q::after',
          '.content::before',
          '#element::after'
        ];

        supportedPseudoElements.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/::(?:before|after)$/);
        });
      });

      test('should support ::selection with limitations', () => {
        const selectionSelectors = [
          '::selection',
          'p::selection',
          '.text::selection'
        ];

        selectionSelectors.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(true);
          expect(selector).toMatch(/::selection$/);
          // Note: Only color and background-color properties supported
        });
      });
    });

    describe('Unsupported Pseudo Elements', () => {
      test('should identify unsupported pseudo-elements', () => {
        const unsupportedPseudoElements = [
          'p::first-letter',
          'p::first-line',
          '::cue',
          '::slotted(span)'
        ];

        unsupportedPseudoElements.forEach(selector => {
          const result = validateCSSSelector(selector);
          expect(result.valid).toBe(false);
          expect(selector).toMatch(/::(?:first-letter|first-line|cue|slotted)/);
        });
      });
    });
  });

  describe('Performance Considerations', () => {
    test('should identify performance-impacting selectors', () => {
      const performanceImpactingSelectors = [
        'p:first-child',      // Structural pseudo-classes cause rematching
        'li:last-child', 
        'div:only-child',
        ':nth-child(2n+1)',
        'div > p:first-child' // Combined with complex selectors
      ];

      performanceImpactingSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        // Some may be complex selectors requiring EnableComplexCSSSelectorsStyling
        if (result.conditional) {
          expect(result.valid).toBe(false);
        } else {
          expect(result.valid).toBe(true);
        }
        const hasStructuralPseudo = /:(?:first-child|last-child|only-child|nth-child|nth-last-child)/.test(selector);
        expect(hasStructuralPseudo).toBe(true);
      });
    });

    test('should validate EnableComplexCSSSelectorsStyling requirements', () => {
      const requiresComplexSelectorFlag = [
        'img + p',           // Adjacent sibling
        'p ~ span',          // General sibling
        'div > span',        // Child
        'li li',             // Descendant
        'nav > ul > li',     // Multiple levels
        '.parent > .child:hover' // Combined with pseudo-class
      ];

      requiresComplexSelectorFlag.forEach(selector => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(false);
        expect(result.conditional).toBe(true);
        const hasComplexCombinator = /[+~>]|\s+\w/.test(selector);
        expect(hasComplexCombinator).toBe(true);
      });
    });
  });

  describe('Selector Syntax Validation', () => {
    test('should validate valid selector syntax patterns', () => {
      const validSelectors = [
        'div',                    // Type
        '.class',                 // Class
        '#id',                    // ID
        '*',                      // Universal
        'input[type="text"]',     // Attribute
        'p:hover',                // Pseudo-class
        'div::before',            // Pseudo-element
        'nav > ul',               // Child combinator (conditional)
        'h1 + p'                  // Adjacent sibling (conditional)
      ];

      validSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        // Note: Some are conditionally valid (require EnableComplexCSSSelectorsStyling)
        if (result.conditional) {
          expect(result.valid).toBe(false); // Without the flag enabled
        } else {
          expect(result.valid).toBe(true);
        }
        // Basic syntax validation
        expect(selector).toBeTruthy();
        expect(selector.trim()).toBe(selector);
      });
    });

    test('should identify malformed selectors', () => {
      const malformedSelectors = [
        '.123class',     // Class starting with number
        '#123id',        // ID starting with number
        'div >',         // Incomplete combinator
        'p +',           // Incomplete combinator
        '::invalid',     // Non-existent pseudo-element
        ':unknown',      // Non-existent pseudo-class
        'div[',          // Incomplete attribute selector
        'p::before::after' // Multiple pseudo-elements
      ];

      malformedSelectors.forEach(selector => {
        const result = validateCSSSelector(selector);
        // These should be detected as invalid
        expect(result.valid).toBe(false);
        // These would be considered malformed in proper CSS
        expect(selector).toBeTruthy(); // Just checking they exist for testing
      });
    });
  });

  describe('Selector Specificity', () => {
    test('should understand selector specificity patterns', () => {

      const specificityExamples = [
        { selector: '*', expectedValid: true },              // Universal
        { selector: 'div', expectedValid: true },            // Type
        { selector: '.class', expectedValid: true },         // Class
        { selector: '#id', expectedValid: true },            // ID
        { selector: 'div.class', expectedValid: true },      // Type + Class (not descendant, so allowed)
        { selector: '#id.class', expectedValid: true },      // ID + Class (not descendant, so allowed)
        { selector: 'div:hover', expectedValid: true },      // Type + Pseudo-class
        { selector: 'div::before', expectedValid: true }     // Type + Pseudo-element
      ];

      specificityExamples.forEach(({ selector, expectedValid }) => {
        const result = validateCSSSelector(selector);
        expect(result.valid).toBe(expectedValid);
      });
    });
  });
});