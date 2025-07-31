/**
 * Tests for non-React cases in gameface rules
 */

const tailwindRule = require('../../lib/rules/classes');
const inlineCSSRule = require('../../lib/rules/inline-css');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: require('@babel/eslint-parser'),
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react']
      }
    }
  }
});

console.log('Testing Tailwind rule for non-React cases...');

ruleTester.run('tailwind-non-react', tailwindRule, {
  valid: [
    // Vanilla JS with supported classes
    {
      code: 'element.className = "flex flex-col p-4";'
    },
    // setAttribute with supported classes
    {
      code: 'element.setAttribute("class", "flex items-center");'
    },
    // Template literal with supported classes
    {
      code: 'const html = `<div class="flex justify-center">Content</div>`;'
    }
  ],

  invalid: [
    // Vanilla JS with unsupported classes
    {
      code: 'element.className = "grid float-left";',
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        },
        {
          messageId: 'floatNotSupported',
          data: { className: 'float-left' }
        }
      ]
    },
    // setAttribute with unsupported classes
    {
      code: 'element.setAttribute("class", "block sticky");',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { className: 'sticky', property: 'position', value: 'sticky' }
        }
      ]
    },
    // Template literal with unsupported classes
    {
      code: 'const html = `<div class="grid grid-cols-3">Content</div>`;',
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        },
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid-cols-3' }
        }
      ]
    }
  ]
});

console.log('Testing Inline CSS rule for non-React cases...');

ruleTester.run('inline-css-non-react', inlineCSSRule, {
  valid: [
    // Vanilla JS with supported styles
    {
      code: 'element.style.display = "flex";'
    },
    // setAttribute with supported styles
    {
      code: 'element.setAttribute("style", "display: flex; padding: 1rem");'
    },
    // JSX style string with supported properties
    {
      code: '<div style="display: flex; flex-direction: column">Content</div>'
    }
  ],

  invalid: [
    // Vanilla JS with unsupported styles
    {
      code: 'element.style.display = "grid";',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'grid' }
        }
      ]
    },
    // setAttribute with unsupported styles
    {
      code: 'element.setAttribute("style", "display: block; float: left");',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'block' }
        },
        {
          messageId: 'floatNotSupported',
          data: {}
        }
      ]
    },
    // Template literal with unsupported styles
    {
      code: 'const html = `<div style="display: grid; position: sticky">Content</div>`;',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'grid' }
        },
        {
          messageId: 'unsupportedValue',
          data: { property: 'position', value: 'sticky' }
        }
      ]
    },
    // JSX style string with unsupported properties
    {
      code: '<div style="border-style: dashed; flex-basis: content">Content</div>',
      errors: [
        {
          messageId: 'unsupportedBorderStyle',
          data: { value: 'dashed' }
        },
        {
          messageId: 'flexBasisContent',
          data: {}
        }
      ]
    }
  ]
});

console.log('✅ All non-React tests completed successfully!');