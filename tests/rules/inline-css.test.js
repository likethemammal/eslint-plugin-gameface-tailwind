/**
 * Tests for inline-css rule
 */

const rule = require('../../lib/rules/inline-css');
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

ruleTester.run('inline-css', rule, {
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
    // Previously missing CSS properties validation
    {
      code: '<div style={{ backgroundAttachment: "fixed" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'background-attachment' }
        }
      ]
    },
    {
      code: '<div style={{ backgroundClip: "padding-box" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'background-clip' }
        }
      ]
    },
    {
      code: '<div style={{ borderCollapse: "collapse" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'border-collapse' }
        }
      ]
    },
    {
      code: '<div style={{ boxSizing: "content-box" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'box-sizing' }
        }
      ]
    },
    {
      code: '<div style={{ clear: "both" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'clear' }
        }
      ]
    },
    {
      code: '<div style={{ direction: "rtl" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'direction', value: 'rtl' }
        }
      ]
    },
    {
      code: '<div style={{ listStyle: "disc" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'list-style' }
        }
      ]
    },
    {
      code: '<div style={{ objectFit: "cover" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'object-fit', value: 'cover' }
        }
      ]
    },
    {
      code: '<div style={{ order: "1" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'order' }
        }
      ]
    },
    {
      code: '<div style={{ resize: "both" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'resize' }
        }
      ]
    },
    {
      code: '<div style={{ tableLayout: "fixed" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'table-layout' }
        }
      ]
    },
    {
      code: '<div style={{ textIndent: "2em" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'text-indent' }
        }
      ]
    },
    {
      code: '<div style={{ verticalAlign: "top" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'vertical-align', value: 'top' }
        }
      ]
    },
    {
      code: '<div style={{ wordBreak: "break-all" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'word-break', value: 'break-all' }
        }
      ]
    },
    {
      code: '<div style={{ whiteSpace: "pre-line" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'white-space', value: 'pre-line' }
        }
      ]
    },
    {
      code: '<div style={{ visibility: "collapse" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedValue',
          data: { property: 'visibility', value: 'collapse' }
        }
      ]
    },
    {
      code: '<div style={{ userSelect: "all" }}>Content</div>',
      errors: [
        {
          messageId: 'cssUnsupported',
          data: { item: 'user-select' }
        }
      ]
    },
    {
      code: '<div style={{ borderStyle: "double" }}>Content</div>',
      errors: [
        {
          messageId: 'unsupportedBorderStyle',
          data: { value: 'double' }
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
