/**
 * ESLint rule to validate inline CSS styles against Gameface compatibility
 */

const { getGamefaceSupport } = require('../utils/gameface-support');
const { parseInlineCSS, validateCSSValue } = require('../utils/css-parser');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate inline CSS styles against Gameface Framework compatibility',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          strict: {
            type: 'boolean',
            default: false
          },
          ignoreProperties: {
            type: 'array',
            items: { type: 'string' },
            default: []
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unsupportedProperty: 'CSS property "{{property}}" is not supported by Gameface',
      partiallySupported: 'CSS property "{{property}}" has limited support in Gameface: {{limitation}}',
      unsupportedValue: 'Value "{{value}}" for property "{{property}}" is not supported in Gameface',
      unsupportedBorderStyle: 'Border style "{{value}}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.',
      unsupportedGif: 'GIF images are not supported by Gameface in "{{property}}"',
      gridNotSupported: 'CSS Grid ({{property}}) is not supported by Gameface. Consider using Flexbox instead.',
      floatNotSupported: 'Float property is not supported by Gameface. Use Flexbox for layout instead.',
      unsupportedDisplayValue: 'Display value "{{value}}" is not supported by Gameface. Only "flex" is fully supported.',
      flexBasisContent: 'flex-basis: content is not supported by Gameface. Use specific values or auto with caution.'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const strict = options.strict || false;
    const ignoreProperties = options.ignoreProperties || [];
    const gamefaceSupport = getGamefaceSupport();

    function validateCSSProperty(property, value, node) {
      // Skip ignored properties
      if (ignoreProperties.includes(property)) {
        return;
      }

      // Convert camelCase to kebab-case for CSS property names
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      const support = gamefaceSupport.properties[cssProperty];

      if (!support) {
        context.report({
          node,
          messageId: 'unsupportedProperty',
          data: { property: cssProperty }
        });
        return;
      }

      if (support.status === 'NO') {
        // Special handling for common unsupported features
        if (cssProperty.startsWith('grid-')) {
          context.report({
            node,
            messageId: 'gridNotSupported',
            data: { property: cssProperty }
          });
        } else if (cssProperty === 'float') {
          context.report({
            node,
            messageId: 'floatNotSupported',
            data: {}
          });
        } else {
          context.report({
            node,
            messageId: 'unsupportedProperty',
            data: { property: cssProperty }
          });
        }
        return;
      }

      // Special validations before checking unsupported values
      // Flex-basis content validation
      if (cssProperty === 'flex-basis' && value === 'content') {
        context.report({
          node,
          messageId: 'flexBasisContent',
          data: {}
        });
        return;
      }

      // Border style validation (with custom message)
      if (cssProperty.includes('border-style') && value) {
        const supportedBorderStyles = ['solid', 'none', 'hidden'];
        if (!supportedBorderStyles.includes(value)) {
          context.report({
            node,
            messageId: 'unsupportedBorderStyle',
            data: { value }
          });
          return;
        }
      }

      // Validate specific values (important for PARTIAL status properties)
      if (value && support.unsupportedValues && support.unsupportedValues.includes(value)) {
        // Special case for display property - use specific message
        if (cssProperty === 'display') {
          context.report({
            node,
            messageId: 'unsupportedDisplayValue',
            data: { value }
          });
        } else {
          context.report({
            node,
            messageId: 'unsupportedValue',
            data: { property: cssProperty, value }
          });
        }
        return;
      }

      // Background image GIF validation (applies to all status levels)
      if (cssProperty === 'background-image' && value && value.includes('.gif')) {
        context.report({
          node,
          messageId: 'unsupportedGif',
          data: { property: cssProperty }
        });
        return;
      }

      if (support.status === 'PARTIAL') {
        const limitation = support.limitation || 'Limited support';

        // Specific validations for partially supported properties

        // Report partial support in strict mode
        if (strict) {
          context.report({
            node,
            messageId: 'partiallySupported',
            data: { property: cssProperty, limitation }
          });
        }
      }
    }

    function checkStyleObject(node) {
      if (node.type === 'ObjectExpression') {
        node.properties.forEach(prop => {
          if (prop.type === 'Property' && prop.key.type === 'Identifier') {
            const property = prop.key.name;
            let value = null;

            if (prop.value.type === 'Literal') {
              value = prop.value.value;
            } else if (prop.value.type === 'TemplateLiteral') {
              // Handle template literals - extract static parts
              value = prop.value.quasis.map(q => q.value.raw).join('');
            }

            validateCSSProperty(property, value, prop);
          }
        });
      }
    }

    function checkStyleString(node, styleString) {
      if (!styleString) return;
      
      // Parse CSS string like "color: red; display: grid"
      const declarations = styleString.split(';').filter(d => d.trim());
      declarations.forEach(declaration => {
        const [property, value] = declaration.split(':').map(s => s.trim());
        if (property && value) {
          validateCSSProperty(property, value, node);
        }
      });
    }

    return {
      // Handle style={{...}} in JSX
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value) {
          if (node.value.type === 'JSXExpressionContainer') {
            checkStyleObject(node.value.expression);
          } else if (node.value.type === 'Literal') {
            // Handle style="color: red; display: grid" 
            checkStyleString(node, node.value.value);
          }
        }
      },

      // Handle vanilla JS: element.style.property = "value"
      AssignmentExpression(node) {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'MemberExpression' &&
          node.left.object.property.name === 'style' &&
          node.right.type === 'Literal'
        ) {
          const property = node.left.property.name;
          const value = node.right.value;
          validateCSSProperty(property, value, node);
        }
      },

      // Handle React.createElement style props and other object style assignments
      CallExpression(node) {
        // React.createElement with style props
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'React' &&
          node.callee.property.name === 'createElement' &&
          node.arguments.length >= 2
        ) {
          const propsArg = node.arguments[1];
          if (propsArg && propsArg.type === 'ObjectExpression') {
            const styleProp = propsArg.properties.find(
              prop => prop.key && prop.key.name === 'style'
            );
            if (styleProp) {
              checkStyleObject(styleProp.value);
            }
          }
        }

        // element.setAttribute("style", "...")
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'setAttribute' &&
          node.arguments.length >= 2 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'style' &&
          node.arguments[1].type === 'Literal'
        ) {
          checkStyleString(node, node.arguments[1].value);
        }
      },

      // Handle template literals that might contain HTML with style attributes
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          const text = quasi.value.raw;
          // Look for style="..." patterns in template literals
          const styleMatches = text.match(/style\s*=\s*["']([^"']+)["']/g);
          if (styleMatches) {
            styleMatches.forEach(match => {
              const styleValue = match.match(/style\s*=\s*["']([^"']+)["']/)[1];
              checkStyleString(node, styleValue);
            });
          }
        });
      }
    };
  }
};
