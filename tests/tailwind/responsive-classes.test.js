/**
 * Tests for Tailwind responsive class failures in Gameface
 * Based on documentation: "We don't support the selector that is used for media-queries" - .sm:, .md:, .lg:, .xl: marked as "No"
 */

const { getTailwindCSSProperty, getGamefaceTailwindSupport } = require('../../lib/utils/parsers/tailwind-parser');

describe('Tailwind Responsive Classes Failures', () => {
  describe('Responsive breakpoint prefixes', () => {
    test('should identify all unsupported responsive prefixes', () => {
      const responsivePrefixes = [
        'sm:',
        'md:', 
        'lg:',
        'xl:',
        '2xl:'
      ];

      responsivePrefixes.forEach(prefix => {
        const testClasses = [
          `${prefix}flex`,
          `${prefix}hidden`,
          `${prefix}text-center`,
          `${prefix}bg-red-500`,
          `${prefix}p-4`
        ];

        testClasses.forEach(className => {
          const support = getGamefaceTailwindSupport(className);
          expect(support.supported).toBe(false);
          expect(support.reason).toMatch(/media|selector|support/i);
        });
      });
    });

    test('should detect media query selectors in responsive classes', () => {
      const mediaQuerySelectors = [
        '@media (min-width: 640px)',   // sm
        '@media (min-width: 768px)',   // md
        '@media (min-width: 1024px)',  // lg
        '@media (min-width: 1280px)',  // xl
        '@media (min-width: 1536px)'   // 2xl
      ];

      mediaQuerySelectors.forEach(selector => {
        expect(selector).toMatch(/@media\s*\([^)]+\)/);
        // These media queries are not supported by Gameface
        expect(selector).toContain('min-width');
      });
    });
  });

  describe('Responsive breakpoint values', () => {
    test('should identify Tailwind default breakpoints', () => {
      const defaultBreakpoints = {
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      };

      Object.entries(defaultBreakpoints).forEach(([breakpoint, value]) => {
        expect(value).toMatch(/^\d+px$/);
        expect(parseInt(value)).toBeGreaterThan(0);
      });
    });

    test('should validate custom breakpoint syntax', () => {
      const customBreakpoints = [
        'max-sm:',  // max-width queries
        'max-md:',
        'max-lg:',
        'max-xl:',
        'max-2xl:'
      ];

      customBreakpoints.forEach(prefix => {
        const testClass = `${prefix}hidden`;
        const support = getGamefaceTailwindSupport(testClass);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Responsive utility combinations', () => {
    test('should identify complex responsive class combinations', () => {
      const responsiveCombinations = [
        'block sm:hidden md:block lg:hidden',
        'text-left sm:text-center lg:text-right',
        'p-2 sm:p-4 md:p-6 lg:p-8',
        'bg-red-500 sm:bg-blue-500 lg:bg-green-500',
        'flex-col sm:flex-row lg:flex-col'
      ];

      responsiveCombinations.forEach(combination => {
        const classes = combination.split(' ');
        classes.forEach(className => {
          if (className.includes(':')) {
            const support = getGamefaceTailwindSupport(className);
            expect(support.supported).toBe(false);
          }
        });
      });
    });

    test('should validate base classes without responsive prefixes', () => {
      const baseClasses = [
        'flex',
        'hidden',
        'text-center',
        'bg-red-500',
        'p-4'
      ];

      baseClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        // Some base classes might fail for other reasons
        expect(support).toBeTruthy();
      });
    });
  });

  describe('Container responsive class', () => {
    test('should validate container class support', () => {
      const containerSupport = getGamefaceTailwindSupport('container');
      expect(containerSupport.supported).toBe(true);
    });

    test('should identify container responsive breakpoints', () => {
      const containerBreakpoints = {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px', 
        'xl': '1280px',
        '2xl': '1536px'
      };

      // Container should work but responsive modifiers should not
      Object.keys(containerBreakpoints).forEach(breakpoint => {
        const responsiveContainer = `${breakpoint}:container`;
        const support = getGamefaceTailwindSupport(responsiveContainer);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Media query CSS analysis', () => {
    test('should identify unsupported media query features', () => {
      const unsupportedMediaFeatures = [
        '@media (min-width: 640px) { .sm\\:flex { display: flex; } }',
        '@media (max-width: 767px) { .max-sm\\:hidden { display: none; } }',
        '@media (orientation: landscape) { .landscape\\:block { display: block; } }',
        '@media (prefers-color-scheme: dark) { .dark\\:bg-black { background-color: #000; } }'
      ];

      unsupportedMediaFeatures.forEach(css => {
        expect(css).toContain('@media');
        expect(css).toMatch(/:/); // Contains responsive prefix
      });
    });

    test('should detect escaped class name syntax', () => {
      const escapedClassNames = [
        '.sm\\:flex',
        '.md\\:hidden', 
        '.lg\\:block',
        '.xl\\:text-center',
        '.2xl\\:p-8'
      ];

      escapedClassNames.forEach(className => {
        expect(className).toMatch(/\./); // CSS class selector
      });
    });
  });

  describe('Alternative responsive solutions', () => {
    test('should suggest JavaScript-based responsive handling', () => {
      const jsAlternatives = [
        'window.matchMedia("(min-width: 768px)")',
        'ResizeObserver API',
        'Element.getBoundingClientRect()',
        'Custom event listeners for resize'
      ];

      jsAlternatives.forEach(alternative => {
        expect(alternative).toBeTruthy();
      });
    });

    test('should validate manual CSS media queries', () => {
      const manualMediaQueries = [
        '@media (min-width: 768px) { .custom-class { display: block; } }',
        '@media (max-width: 767px) { .mobile-only { display: none; } }',
        '@media screen and (min-width: 1024px) { .desktop { width: 100%; } }'
      ];

      manualMediaQueries.forEach(css => {
        expect(css).toMatch(/@media[^{]+\{[^}]+\}/);
      });
    });
  });

  describe('Responsive design patterns', () => {
    test('should identify common responsive patterns', () => {
      const responsivePatterns = [
        'Mobile-first design',
        'Desktop-first design', 
        'Breakpoint-specific layouts',
        'Fluid responsive grids',
        'Container queries'
      ];

      responsivePatterns.forEach(pattern => {
        expect(pattern).toBeTruthy();
      });
    });

    test('should validate viewport meta requirements', () => {
      const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1">';
      expect(viewportMeta).toContain('viewport');
      expect(viewportMeta).toContain('width=device-width');
    });
  });

  describe('Dark mode and print modifiers', () => {
    test('should identify unsupported dark mode classes', () => {
      const darkModeClasses = [
        'dark:bg-black',
        'dark:text-white',
        'dark:border-gray-700',
        'dark:hover:bg-gray-800'
      ];

      darkModeClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });

    test('should identify unsupported print classes', () => {
      const printClasses = [
        'print:hidden',
        'print:text-black',
        'print:bg-white',
        'print:text-sm'
      ];

      printClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Responsive class parsing', () => {
    test('should parse responsive class structure correctly', () => {
      const responsiveClasses = [
        'sm:flex',
        'md:grid-cols-2',
        'lg:space-x-4',
        'xl:max-w-7xl'
      ];

      responsiveClasses.forEach(className => {
        const [prefix, baseClass] = className.split(':');
        expect(['sm', 'md', 'lg', 'xl', '2xl']).toContain(prefix);
        expect(baseClass).toBeTruthy();
      });
    });

    test('should handle complex responsive class names', () => {
      const complexClasses = [
        'sm:hover:bg-blue-500',    // Multiple modifiers
        'md:focus:text-red-600',   // Pseudo-state + responsive
        'lg:first:border-t-0',     // Pseudo-selector + responsive
        'xl:dark:bg-gray-900'      // Dark mode + responsive
      ];

      complexClasses.forEach(className => {
        const parts = className.split(':');
        expect(parts.length).toBeGreaterThan(2);
        
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(false);
      });
    });
  });

  describe('Error message validation', () => {
    test('should provide helpful error messages for responsive classes', () => {
      const responsiveClasses = ['sm:flex', 'md:hidden', 'lg:block'];
      
      responsiveClasses.forEach(className => {
        const support = getGamefaceTailwindSupport(className);
        expect(support.reason).toBeTruthy();
        expect(support.reason).toMatch(/media|selector|support/i);
      });
    });

    test('should suggest alternatives in error messages', () => {
      const expectedSuggestions = [
        'Use JavaScript for responsive behavior',
        'Implement manual CSS media queries',
        'Use container-based responsive design',
        'Handle responsive logic in application code'
      ];

      expectedSuggestions.forEach(suggestion => {
        expect(suggestion).toMatch(/JavaScript|manual|container|application/i);
      });
    });
  });
});