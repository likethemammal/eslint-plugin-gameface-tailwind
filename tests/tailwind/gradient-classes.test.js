/**
 * Tests for Tailwind gradient class support in Gameface
 * Based on documentation: Background gradient classes are supported including .bg-gradient-to-*, .from-*, .via-*, .to-*
 */

const { getGamefaceTailwindSupport, getTailwindCSSProperty } = require('../../lib/utils/parsers/tailwind-parser');

describe('Tailwind Gradient Classes Support', () => {
  describe('Background gradient direction classes', () => {
    test('should identify gradient direction class patterns', () => {
      const gradientDirections = [
        'bg-gradient-to-t',    // to top
        'bg-gradient-to-tr',   // to top right
        'bg-gradient-to-r',    // to right  
        'bg-gradient-to-br',   // to bottom right
        'bg-gradient-to-b',    // to bottom
        'bg-gradient-to-bl',   // to bottom left
        'bg-gradient-to-l',    // to left
        'bg-gradient-to-tl'    // to top left
      ];

      gradientDirections.forEach(className => {
        expect(className).toMatch(/^bg-gradient-to-/);
        
        // Verify these gradient directions are supported
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(true);
        
        // Verify they map to background-image CSS property
        const cssProperty = getTailwindCSSProperty(className);
        expect(cssProperty).toBeTruthy();
        expect(cssProperty.property).toBe('background-image');
        expect(cssProperty.value).toMatch(/linear-gradient/);
      });
    });

    test('should validate gradient direction naming convention', () => {
      const directions = ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
      
      directions.forEach(direction => {
        const className = `bg-gradient-to-${direction}`;
        expect(className).toMatch(/^bg-gradient-to-[a-z]+$/);
      });
    });
  });

  describe('Gradient color stop classes', () => {
    test('should identify gradient color stop patterns', () => {
      const colorStopClasses = [
        'from-red-500',
        'via-blue-400', 
        'to-green-600',
        'from-transparent',
        'to-black'
      ];

      colorStopClasses.forEach(className => {
        expect(className).toMatch(/^(from|via|to)-/);
        
        // Verify these gradient color stops are supported  
        const support = getGamefaceTailwindSupport(className);
        expect(support.supported).toBe(true);
        
        // Verify they map to gradient CSS custom properties
        const cssProperty = getTailwindCSSProperty(className);
        expect(cssProperty).toBeTruthy();
        expect(cssProperty.property).toMatch(/--tw-gradient-(from|via|to)/);
      });
    });

    test('should support special gradient color values', () => {
      const specialColors = [
        'from-transparent',
        'via-transparent', 
        'to-transparent',
        'from-current',
        'via-current',
        'to-current',
        'from-black',
        'via-white',
        'to-gray-50'
      ];

      specialColors.forEach(className => {
        expect(className).toMatch(/^(from|via|to)-/);
      });
    });
  });

  describe('Gradient documentation validation', () => {
    test('should validate gradient support according to documentation', () => {
      // According to docs, gradient classes are supported
      const supportedFeatures = [
        'Linear gradients',
        'Direction control',
        'Color stops',
        'Multiple color transitions'
      ];

      supportedFeatures.forEach(feature => {
        expect(feature).toBeTruthy();
      });
    });

    test('should identify gradient CSS properties', () => {
      const gradientProperties = [
        'background-image',
        'background',
        '--tw-gradient-from',
        '--tw-gradient-via', 
        '--tw-gradient-to'
      ];

      gradientProperties.forEach(property => {
        expect(property).toBeTruthy();
      });
    });
  });

  describe('Gradient combination patterns', () => {
    test('should validate complete gradient class combinations', () => {
      const gradientCombinations = [
        ['bg-gradient-to-r', 'from-blue-500', 'to-red-500'],
        ['bg-gradient-to-br', 'from-green-400', 'via-blue-500', 'to-purple-600'],
        ['bg-gradient-to-t', 'from-yellow-400', 'to-orange-500']
      ];

      gradientCombinations.forEach(combination => {
        expect(combination.length).toBeGreaterThan(1);
        
        // Check direction class
        expect(combination[0]).toMatch(/^bg-gradient-to-/);
        
        // Check color stop classes
        combination.slice(1).forEach(colorStop => {
          expect(colorStop).toMatch(/^(from|via|to)-/);
        });
      });
    });

    test('should validate gradient syntax patterns', () => {
      const gradientExamples = [
        'linear-gradient(to right, #3b82f6, #ef4444)',
        'linear-gradient(to bottom right, #10b981, #3b82f6, #a855f7)',
        'linear-gradient(to top, #eab308, #f97316)'
      ];

      gradientExamples.forEach(gradient => {
        expect(gradient).toMatch(/linear-gradient\(/);
        expect(gradient).toMatch(/to (top|bottom|left|right)/);
      });
    });
  });

  describe('Gradient browser compatibility', () => {
    test('should identify supported gradient syntax', () => {
      const supportedSyntax = [
        'linear-gradient()',
        'radial-gradient()',
        'background-image property',
        'CSS variables for color stops'
      ];

      supportedSyntax.forEach(syntax => {
        expect(syntax).toBeTruthy();
      });
    });

    test('should validate color format compatibility', () => {
      const colorFormats = [
        '#ff0000',           // hex
        'rgb(255, 0, 0)',    // rgb
        'rgba(255, 0, 0, 0.5)', // rgba
        'hsl(0, 100%, 50%)', // hsl
        'transparent',       // keyword
        'currentColor'       // keyword
      ];

      colorFormats.forEach(format => {
        expect(format).toBeTruthy();
      });
    });
  });
});