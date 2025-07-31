/**
 * Tests for all critical missing test cases based on Gameface documentation
 * Covers CSS variable issues, selector limitations, and autofix functionality
 */

const { RuleTester } = require('eslint');
const classesRule = require('../../lib/rules/classes');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  }
});

describe('Unsupported Classes Tests', () => {
  describe('Background Color Classes (CSS Variable Issues)', () => {
    ruleTester.run('bg-color-classes-css-variables', classesRule, {
      valid: [
        // Supported background classes
        {
          code: '<div className="bg-transparent">Content</div>',
          options: [{ autofix: true }]
        },
        {
          code: '<div className="bg-none">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        // Single background color class
        {
          code: '<div className="bg-black">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-black' }
            }
          ]
        },
        {
          code: '<div className="bg-white">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-white' }
            }
          ]
        },
        {
          code: '<div className="bg-red-500">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-red-500' }
            }
          ]
        },
        {
          code: '<div className="bg-blue-200">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-blue-200' }
            }
          ]
        },
        
        // Multiple background color violations
        {
          code: '<div className="bg-black bg-red-500 p-4">Content</div>',
          output: '<div className="p-4">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-black' }
            },
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-red-500' }
            }
          ]
        },

        // Simple template literal with background colors
        {
          code: '<div className="bg-gray-100 p-4 bg-blue-300 m-2">Content</div>',
          output: '<div className="p-4 m-2">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-gray-100' }
            },
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-blue-300' }
            }
          ]
        }
      ]
    });
  });

  describe('Text Color Classes (CSS Variable Issues)', () => {
    ruleTester.run('text-color-classes-css-variables', classesRule, {
      valid: [
        // No valid text color classes with current color exist that work
        {
          code: '<div className="text-left">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="text-black">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'text-black' }
            }
          ]
        },
        {
          code: '<div className="text-white">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'text-white' }
            }
          ]
        },
        {
          code: '<div className="text-red-500">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'text-red-500' }
            }
          ]
        },

        // Multiple text colors with valid classes
        {
          code: '<div className="text-blue-300 text-lg text-gray-600">Content</div>',
          output: '<div className="text-lg">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'text-blue-300' }
            },
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'text-gray-600' }
            }
          ]
        }
      ]
    });
  });

  describe('Shadow Classes (CSS Variable Resolution Issues)', () => {
    ruleTester.run('shadow-classes-css-variables', classesRule, {
      valid: [
        {
          code: '<div className="border rounded">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="shadow-xs">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-xs' }
            }
          ]
        },
        {
          code: '<div className="shadow-sm">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-sm' }
            }
          ]
        },
        {
          code: '<div className="shadow">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow' }
            }
          ]
        },
        {
          code: '<div className="shadow-md">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-md' }
            }
          ]
        },
        {
          code: '<div className="shadow-xl">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-xl' }
            }
          ]
        },
        {
          code: '<div className="shadow-2xl">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-2xl' }
            }
          ]
        },
        {
          code: '<div className="shadow-inner">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-inner' }
            }
          ]
        },
        {
          code: '<div className="shadow-none">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-none' }
            }
          ]
        },

        // Multiple shadow classes
        {
          code: '<div className="shadow-lg shadow-md p-4">Content</div>',
          output: '<div className="p-4">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-lg' }
            },
            {
              messageId: 'shadowNotSupported',
              data: { className: 'shadow-md' }
            }
          ]
        }
      ]
    });
  });

  describe('Border Color Classes (CSS Variable Issues)', () => {
    ruleTester.run('border-color-classes-css-variables', classesRule, {
      valid: [
        {
          code: '<div className="border-transparent">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="border-black">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'border-black' }
            }
          ]
        },
        {
          code: '<div className="border-white">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'border-white' }
            }
          ]
        },
        {
          code: '<div className="border-red-500">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'border-red-500' }
            }
          ]
        },
        {
          code: '<div className="border-blue-300">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'border-blue-300' }
            }
          ]
        }
      ]
    });
  });

  describe('Auto Margin Classes', () => {
    ruleTester.run('auto-margin-classes', classesRule, {
      valid: [
        {
          code: '<div className="m-4">Content</div>',
          options: [{ autofix: true }]
        },
        {
          code: '<div className="mx-2">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="m-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'm-auto' }
            }
          ]
        },
        {
          code: '<div className="mx-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'mx-auto' }
            }
          ]
        },
        {
          code: '<div className="my-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'my-auto' }
            }
          ]
        },
        {
          code: '<div className="mt-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'mt-auto' }
            }
          ]
        },
        {
          code: '<div className="mr-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'mr-auto' }
            }
          ]
        },
        {
          code: '<div className="mb-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'mb-auto' }
            }
          ]
        },
        {
          code: '<div className="ml-auto">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'ml-auto' }
            }
          ]
        }
      ]
    });
  });

  describe('Additional Display Classes', () => {
    ruleTester.run('additional-display-classes', classesRule, {
      valid: [
        {
          code: '<div className="flex">Content</div>',
          options: [{ autofix: true }]
        },
        {
          code: '<div className="block">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="inline-flex">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'unsupportedValue',
              data: { className: 'inline-flex' }
            }
          ]
        },
        {
          code: '<div className="inline-grid">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'gridNotSupported',
              data: { className: 'inline-grid' }
            }
          ]
        },
        {
          code: '<div className="flow-root">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'unsupportedValue',
              data: { className: 'flow-root' }
            }
          ]
        },
        {
          code: '<div className="table">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'unsupportedValue',
              data: { className: 'table' }
            }
          ]
        },
        {
          code: '<div className="table-cell">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'table-cell' }
            }
          ]
        },
        {
          code: '<div className="table-row">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'table-row' }
            }
          ]
        }
      ]
    });
  });

  describe('Selector-Based Classes (:not selector)', () => {
    ruleTester.run('selector-based-classes', classesRule, {
      valid: [
        {
          code: '<div className="flex justify-between">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="divide-x-2">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'divide-x-2' }
            }
          ]
        },
        {
          code: '<div className="divide-y-4">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'divide-y-4' }
            }
          ]
        },
        {
          code: '<div className="space-x-4">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'space-x-4' }
            }
          ]
        },
        {
          code: '<div className="space-y-2">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'space-y-2' }
            }
          ]
        },
        {
          code: '<div className="space-x-reverse">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'space-x-reverse' }
            }
          ]
        }
      ]
    });
  });

  describe('Background Attachment Classes', () => {
    ruleTester.run('background-attachment-classes', classesRule, {
      valid: [
        {
          code: '<div className="bg-cover">Content</div>',
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        {
          code: '<div className="bg-fixed">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-fixed' }
            }
          ]
        },
        {
          code: '<div className="bg-local">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-local' }
            }
          ]
        },
        {
          code: '<div className="bg-scroll">Content</div>',
          output: '<div className="">Content</div>',
          options: [{ autofix: true }],
          errors: [
            {
              messageId: 'tailwindUnsupported',
              data: { className: 'bg-scroll' }
            }
          ]
        }
      ]
    });
  });
});