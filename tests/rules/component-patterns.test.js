/**
 * Tests for traditional web components using Tailwind patterns
 * Includes cards, buttons, forms, and complex layouts with both valid and invalid classes
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

describe('Web Component Patterns', () => {
  describe('Card Components', () => {
    ruleTester.run('card-component-patterns', classesRule, {
      valid: [
        // Valid card component
        {
          code: `
            <div className="border rounded-lg p-6 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <button className="text-sm opacity-75">×</button>
              </div>
              <p className="mb-4">Card description goes here</p>
              <div className="flex justify-end">
                <button className="px-4 py-2 border rounded">
                  Action
                </button>
              </div>
            </div>
          `,
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        // Card with unsupported classes
        {
          code: `
            <div className="bg-white shadow-lg border rounded-lg p-6 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Card Title</h3>
                <button className="text-sm text-gray-500">×</button>
              </div>
              <p className="text-gray-600 mb-4">Card description</p>
              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 border rounded">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                  Save
                </button>
              </div>
            </div>
          `,
          output: `
            <div className="border rounded-lg p-6 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <button className="text-sm">×</button>
              </div>
              <p className="mb-4">Card description</p>
              <div className="flex justify-end">
                <button className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button className="px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          `,
          options: [{ autofix: true }],
          errors: [
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-lg' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-800' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-600' } },
            { messageId: 'tailwindUnsupported', data: { className: 'space-x-2' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-gray-100' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow' } }
          ]
        },

        // Card with template literal and complex patterns
        {
          code: `
            <div className={\`
              bg-white
              shadow-xl
              border
              rounded-xl
              p-6
              mx-auto
              max-w-md
            \`}>
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full p-2 mr-3">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Notification</h3>
              </div>
              <p className="text-gray-600 mb-6">
                You have a new message waiting for you.
              </p>
              <div className="flex justify-end space-x-3">
                <button className="text-gray-500 hover:text-gray-700">
                  Dismiss
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded shadow-sm">
                  View
                </button>
              </div>
            </div>
          `,
          output: `
            <div className={\`
              border
              rounded-xl
              p-6
              max-w-md
            \`}>
              <div className="flex items-center mb-4">
                <div className="rounded-full p-2 mr-3">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold">Notification</h3>
              </div>
              <p className="mb-6">
                You have a new message waiting for you.
              </p>
              <div className="flex justify-end">
                <button className="">
                  Dismiss
                </button>
                <button className="px-4 py-2 rounded">
                  View
                </button>
              </div>
            </div>
          `,
          options: [{ autofix: true }],
          errors: [
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-xl' } },
            { messageId: 'tailwindUnsupported', data: { className: 'mx-auto' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-900' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-600' } },
            { messageId: 'tailwindUnsupported', data: { className: 'space-x-3' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'hover:text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } }
          ]
        }
      ]
    });
  });

  describe('Button Components', () => {
    ruleTester.run('button-component-patterns', classesRule, {
      valid: [
        // Valid button variants
        {
          code: `
            <div className="flex">
              <button className="px-4 py-2 border rounded mr-2">
                Secondary
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold">
                Primary
              </button>
            </div>
          `,
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        // Button with unsupported classes
        {
          code: `
            <div className="flex gap-4">
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-blue-500 text-white shadow-sm">
                Primary
              </button>
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md">
                Secondary  
              </button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Ghost
              </button>
            </div>
          `,
          output: `
            <div className="flex">
              <button className="items-center justify-center px-4 py-2 rounded-md font-medium">
                Primary
              </button>
              <button className="px-4 py-2 border rounded-md">
                Secondary  
              </button>
              <button className="px-4 py-2 rounded-md">
                Ghost
              </button>
            </div>
          `,
          options: [{ autofix: true }],
          errors: [
            { messageId: 'gridNotSupported', data: { className: 'gap-4' } },
            { messageId: 'unsupportedValue', data: { className: 'inline-flex' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'tailwindUnsupported', data: { className: 'border-gray-300' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'hover:bg-gray-100' } }
          ]
        }
      ]
    });
  });

  describe('Form Components', () => {
    ruleTester.run('form-component-patterns', classesRule, {
      valid: [
        // Valid form layout
        {
          code: `
            <form className="max-w-md">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <button className="w-full py-2 px-4 rounded-md font-medium">
                Sign In
              </button>
            </form>
          `,
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        // Form with unsupported styling
        {
          code: `
            <form className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input 
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              
              <button className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md font-medium shadow hover:bg-blue-600">
                Sign In
              </button>
              
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? 
                <a href="#" className="text-blue-500 hover:text-blue-700">Sign up</a>
              </p>
            </form>
          `,
          options: [{ autofix: false }],
          errors: [
            { messageId: 'tailwindUnsupported', data: { className: 'mx-auto' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-lg' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-800' } },
            { messageId: 'tailwindUnsupported', data: { className: 'space-y-4' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'border-gray-300' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'tailwindUnsupported', data: { className: 'focus:ring-2' } },
            { messageId: 'tailwindUnsupported', data: { className: 'focus:ring-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'border-gray-300' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow' } },
            { messageId: 'tailwindUnsupported', data: { className: 'hover:bg-blue-600' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-600' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'hover:text-blue-700' } }
          ]
        }
      ]
    });
  });

  describe('Dashboard Layout Components', () => {
    ruleTester.run('dashboard-layout-patterns', classesRule, {
      valid: [
        // Valid dashboard sidebar layout
        {
          code: `
            <div className="flex h-screen">
              <aside className="w-64 border">
                <div className="p-6">
                  <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
                <nav className="px-4">
                  <ul>
                    <li className="mb-2">
                      <a href="#" className="block px-3 py-2 rounded">
                        Home
                      </a>
                    </li>
                    <li className="mb-2">
                      <a href="#" className="block px-3 py-2 rounded">
                        Analytics
                      </a>
                    </li>
                  </ul>
                </nav>
              </aside>
              
              <main className="flex-1 overflow-y-auto">
                <header className="border-b p-6">
                  <h2 className="text-2xl font-semibold">Dashboard</h2>
                </header>
                
                <div className="p-6">
                  <div className="flex flex-wrap">
                    <div className="w-full px-3 mb-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Widget 1</h3>
                        <p>Content here</p>
                      </div>
                    </div>
                    <div className="w-full px-3 mb-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Widget 2</h3>
                        <p>Content here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          `,
          options: [{ autofix: true }]
        }
      ],

      invalid: [
        // Dashboard with grid and unsupported classes
        {
          code: `
            <div className="min-h-screen bg-gray-100">
              <div className="grid grid-cols-12 gap-6">
                <aside className="col-span-3 bg-white shadow-sm border-r">
                  <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                  </div>
                  <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                      <span>Home</span>
                    </a>
                    <a href="#" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                      <span>Analytics</span>
                    </a>
                  </nav>
                </aside>
                
                <main className="col-span-9">
                  <header className="bg-white shadow-sm border-b p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded shadow-sm">
                        New Item
                      </button>
                    </div>
                  </header>
                  
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="bg-white shadow rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="bg-blue-500 text-white rounded-full p-3 mr-4">
                          <span>$</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">$12,345</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          `,
          options: [{ autofix: false }],
          errors: [
            { messageId: 'tailwindUnsupported', data: { className: 'bg-gray-100' } },
            { messageId: 'gridNotSupported', data: { className: 'grid' } },
            { messageId: 'gridNotSupported', data: { className: 'grid-cols-12' } },
            { messageId: 'gridNotSupported', data: { className: 'gap-6' } },
            { messageId: 'gridNotSupported', data: { className: 'col-span-3' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-800' } },
            { messageId: 'tailwindUnsupported', data: { className: 'space-y-2' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-gray-100' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-700' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-gray-100' } },
            { messageId: 'gridNotSupported', data: { className: 'col-span-9' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-800' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow-sm' } },
            { messageId: 'gridNotSupported', data: { className: 'grid' } },
            { messageId: 'gridNotSupported', data: { className: 'grid-cols-3' } },
            { messageId: 'gridNotSupported', data: { className: 'gap-6' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-white' } },
            { messageId: 'shadowNotSupported', data: { className: 'shadow' } },
            { messageId: 'tailwindUnsupported', data: { className: 'bg-blue-500' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-white' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-600' } },
            { messageId: 'tailwindUnsupported', data: { className: 'text-gray-900' } }
          ]
        }
      ]
    });
  });
});