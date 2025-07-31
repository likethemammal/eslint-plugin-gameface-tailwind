/**
 * Tests for gameface-tailwind rule
 */

const rule = require('../../lib/rules/classes');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: require('@babel/eslint-parser'),
    parserOptions: {
      requireConfigFile: false,
      ecmaFeatures: {
        jsx: true
      },
      babelOptions: {
        presets: ['@babel/preset-react']
      }
    }
  }
});

ruleTester.run('tailwind', rule, {
  valid: [
    // Supported Flexbox classes
    {
      code: '<div className="flex flex-col items-center justify-center">Content</div>'
    },
    // Supported spacing
    {
      code: '<div className="p-4 m-2 w-full h-auto">Content</div>'
    },
    // Supported positioning
    {
      code: '<div className="relative absolute fixed">Content</div>'
    },
    // Supported overflow
    {
      code: '<div className="overflow-hidden overflow-x-scroll">Content</div>'
    },
    // Empty className
    {
      code: '<div className="">Content</div>'
    },
    // Template literal with supported classes
    {
      code: '<div className={`flex ${isActive ? "bg-blue" : "bg-gray"}`}>Content</div>'
    },
    // Test with ignoreUnknown option
    {
      code: '<div className="unknown-class flex">Content</div>',
      options: [{ ignoreUnknown: true }]
    },
    // Test with ignoreClasses option
    {
      code: '<div className="grid shadow-lg">Content</div>',
      options: [{ ignoreClasses: ['grid', 'shadow-lg'] }]
    },
    // Test with severity option
    {
      code: '<div className="flex">Content</div>',
      options: [{ severity: 'error' }]
    },
    // Test with autofix option
    {
      code: '<div className="flex">Content</div>',
      options: [{ autofix: true }]
    },
    // Elements without className
    {
      code: '<div>Content</div>'
    },
    // Non-JSX elements
    {
      code: 'const element = document.createElement("div");'
    },
    // Ignored classes
    {
      code: '<div className="some-custom-class">Content</div>',
      options: [{ ignoreClasses: ['some-custom-class'] }]
    }
  ],

  invalid: [
    // Grid layout
    {
      code: '<div className="grid grid-cols-3">Content</div>',
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
    },
    // Float
    {
      code: '<div className="float-left">Content</div>',
      errors: [
        {
          messageId: 'floatNotSupported',
          data: { className: 'float-left' }
        }
      ]
    },
    // Unsupported display values
    {
      code: '<div className="block inline">Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { className: 'inline', property: 'display', value: 'inline' }
        }
      ]
    },
    // Unsupported positioning
    {
      code: '<div className="sticky">Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { className: 'sticky', property: 'position', value: 'sticky' }
        }
      ]
    },
    // Order property (not supported)
    {
      code: '<div className="order-1">Content</div>',
      errors: [
        {
          messageId: 'unsupportedProperty',
          data: { className: 'order-1', property: 'order' }
        }
      ]
    },
    // Unsupported justify-content values
    {
      code: '<div className="justify-evenly">Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { className: 'justify-evenly', property: 'justify-content', value: 'space-evenly' }
        }
      ]
    },
    // Unsupported align-items values
    {
      code: '<div className="items-baseline">Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { className: 'items-baseline', property: 'align-items', value: 'baseline' }
        }
      ]
    },
    // Clear property (not supported)
    {
      code: '<div className="clear-both">Content</div>',
      errors: [
        {
          messageId: 'unsupportedProperty',
          data: { className: 'clear-both', property: 'clear' }
        }
      ]
    },
    // Border double style (previously missing)
    {
      code: '<div className="border-double">Content</div>',
      errors: [
        {
          messageId: 'unsupportedProperty',
          data: { className: 'border-double', property: 'border-style' }
        }
      ]
    },
    // Focus-within pseudo-class (previously missing)
    {
      code: '<div className="focus-within:bg-blue-500">Content</div>',
      errors: [
        {
          messageId: 'tailwindUnsupported',
          data: { item: 'focus-within:bg-blue-500' }
        }
      ]
    },
    // Group-hover pseudo-class (previously missing)
    {
      code: '<div className="group-hover:opacity-50">Content</div>',
      errors: [
        {
          messageId: 'tailwindUnsupported',
          data: { item: 'group-hover:opacity-50' }
        }
      ]
    },
    // Responsive prefix variants (2xl: was missing)
    {
      code: '<div className="2xl:flex">Content</div>',
      errors: [
        {
          messageId: 'tailwindUnsupported',
          data: { item: '2xl:flex' }
        }
      ]
    },
    // Multiple unsupported classes
    {
      code: '<div className="grid float-left block order-1">Content</div>',
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        },
        {
          messageId: 'floatNotSupported',
          data: { className: 'float-left' }
        },
        {
          messageId: 'unsupportedProperty',
          data: { className: 'order-1', property: 'order' }
        }
      ]
    },
    // Test with autofix option enabled
    {
      code: '<div className="grid shadow-lg flex">Content</div>',
      output: '<div className="flex">Content</div>',
      options: [{ autofix: true }],
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        },
        {
          messageId: 'shadowNotSupported',
          data: { className: 'shadow-lg' }
        }
      ]
    },
    // Test with different severity levels
    {
      code: '<div className="grid">Content</div>',
      options: [{ severity: 'error' }],
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        }
      ]
    },
    // Test combined options
    {
      code: '<div className="grid unknown-class shadow-lg">Content</div>',
      options: [{ ignoreUnknown: true, ignoreClasses: ['shadow-lg'] }],
      errors: [
        {
          messageId: 'gridNotSupported',
          data: { className: 'grid' }
        }
      ]
    }
  ]
});
