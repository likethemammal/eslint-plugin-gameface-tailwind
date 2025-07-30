/**
 * Tests for gameface-inline-css rule
 */

const rule = require('../lib/rules/gameface-inline-css');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
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

ruleTester.run('gameface-inline-css', rule, {
  valid: [
    // Supported flexbox properties
    {
      code: '<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>Content</div>'
    },
    // Supported spacing properties
    {
      code: '<div style={{ padding: "1rem", margin: "0.5rem", width: "100%", height: "auto" }}>Content</div>'
    },
    // Supported positioning
    {
      code: '<div style={{ position: "relative", top: "0", left: "0" }}>Content</div>'
    },
    // Supported border with solid style
    {
      code: '<div style={{ border: "1px solid #000", borderRadius: "4px" }}>Content</div>'
    },
    // Supported background properties
    {
      code: '<div style={{ backgroundColor: "#blue", backgroundImage: "url(image.png)" }}>Content</div>'
    },
    // Empty style object
    {
      code: '<div style={{}}>Content</div>'
    },
    // React.createElement with supported styles  
    {
      code: 'React.createElement("div", { style: { display: "flex", padding: "1rem" } })'
    },
    // Ignored properties
    {
      code: '<div style={{ customProperty: "value" }}>Content</div>',
      options: [{ ignoreProperties: ['customProperty'] }]
    }
  ],

  invalid: [
    // Grid layout
    {
      code: '<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'grid' }
        },
        {
          messageId: 'gridNotSupported',
          data: { property: 'grid-template-columns' }
        }
      ]
    },
    // Float property
    {
      code: '<div style={{ float: "left" }}>Content</div>',
      errors: [
        {
          messageId: 'floatNotSupported',
          data: {}
        }
      ]
    },
    // Unsupported border styles
    {
      code: '<div style={{ borderStyle: "dashed" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedBorderStyle',
          data: { value: 'dashed' }
        }
      ]
    },
    // GIF images
    {
      code: '<div style={{ backgroundImage: "url(image.gif)" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedGif',
          data: { property: 'background-image' }
        }
      ]
    },
    // flex-basis: content
    {
      code: '<div style={{ flexBasis: "content" }}>Content</div>',
      errors: [
        {
          messageId: 'flexBasisContent',
          data: {}
        }
      ]
    },
    // Unsupported display values
    {
      code: '<div style={{ display: "block" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'block' }
        }
      ]
    },
    // Unsupported position values
    {
      code: '<div style={{ position: "sticky" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'position', value: 'sticky' }
        }
      ]
    },
    // Unsupported properties
    {
      code: '<div style={{ outline: "1px solid red" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedProperty',
          data: { property: 'outline' }
        }
      ]
    },
    // Unsupported justify-content values
    {
      code: '<div style={{ justifyContent: "space-evenly" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'justify-content', value: 'space-evenly' }
        }
      ]
    },
    // Unsupported align-items values
    {
      code: '<div style={{ alignItems: "baseline" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'align-items', value: 'baseline' }
        }
      ]
    },
    // Multiple unsupported properties
    {
      code: '<div style={{ display: "grid", float: "left", outline: "1px solid red", borderStyle: "dotted" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'grid' }
        },
        {
          messageId: 'floatNotSupported',
          data: {}
        },
        {
          messageId: 'unsupportedProperty',
          data: { property: 'outline' }
        },
        {
          messageId: 'unsupportedBorderStyle',
          data: { value: 'dotted' }
        }
      ]
    },
    // React.createElement with unsupported styles
    {
      code: 'React.createElement("div", { style: { display: "grid", float: "left" } })',
      errors: [
        {
          messageId: 'unsupportedDisplayValue',
          data: { value: 'grid' }
        },
        {
          messageId: 'floatNotSupported',
          data: {}
        }
      ]
    }
  ]
});
