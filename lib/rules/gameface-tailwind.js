/**
 * ESLint rule to validate Tailwind classes against Gameface compatibility
 */

const { getGamefaceSupport } = require("../utils/gameface-support");
const {
  parseTailwindClasses,
  getTailwindCSSProperty,
} = require("../utils/tailwind-parser");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Validate Tailwind classes against Gameface Framework compatibility",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          strict: {
            type: "boolean",
            default: false,
          },
          ignoreClasses: {
            type: "array",
            items: { type: "string" },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unsupportedProperty:
        'Tailwind class "{{className}}" uses CSS property "{{property}}" which is not supported by Gameface',
      partiallySupported:
        'Tailwind class "{{className}}" uses CSS property "{{property}}" which has limited support in Gameface: {{limitation}}',
      unsupportedValue:
        'Tailwind class "{{className}}" uses unsupported value "{{value}}" for property "{{property}}" in Gameface',
      unsupportedBorderStyle:
        'Tailwind class "{{className}}" uses border style other than "solid" which is not supported by Gameface',
      unsupportedGif:
        'Tailwind class "{{className}}" may reference GIF images which are not supported by Gameface',
      gridNotSupported:
        'Tailwind class "{{className}}" uses CSS Grid which is not supported by Gameface. Consider using Flexbox instead.',
      floatNotSupported:
        'Tailwind class "{{className}}" uses float which is not supported by Gameface. Use Flexbox for layout instead.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const strict = options.strict || false;
    const ignoreClasses = options.ignoreClasses || [];
    const gamefaceSupport = getGamefaceSupport();

    function validateTailwindClass(className, node) {
      // Skip ignored classes
      if (ignoreClasses.includes(className)) {
        return;
      }

      const cssProperty = getTailwindCSSProperty(className);
      if (!cssProperty) {
        return; // Unknown class, skip validation
      }

      const { property, value, specifics } = cssProperty;

      // Check if property is supported
      const support = gamefaceSupport.properties[property];

      if (!support) {
        context.report({
          node,
          messageId: "unsupportedProperty",
          data: { className, property },
        });
        return;
      }

      if (support.status === "NO") {
        // Special handling for common unsupported features
        if (property.startsWith("grid-")) {
          context.report({
            node,
            messageId: "gridNotSupported",
            data: { className },
          });
        } else if (property === "float") {
          context.report({
            node,
            messageId: "floatNotSupported",
            data: { className },
          });
        } else {
          context.report({
            node,
            messageId: "unsupportedProperty",
            data: { className, property },
          });
        }
        return;
      }

      // Validate specific values first (important for PARTIAL status properties)
      if (
        value &&
        support.unsupportedValues &&
        support.unsupportedValues.includes(value)
      ) {
        // Special case for display: grid - show grid-specific message
        if (property === "display" && value === "grid") {
          context.report({
            node,
            messageId: "gridNotSupported",
            data: { className },
          });
        } else {
          context.report({
            node,
            messageId: "unsupportedValue",
            data: { className, property, value },
          });
        }
        return;
      }

      if (support.status === "PARTIAL") {
        // Check specific limitations for partial support
        const limitation = support.limitation || "Limited support";

        // Border style validation
        if (
          property.includes("border-style") &&
          value &&
          value !== "solid" &&
          value !== "none" &&
          value !== "hidden"
        ) {
          context.report({
            node,
            messageId: "unsupportedBorderStyle",
            data: { className },
          });
          return;
        }

        // Background image GIF check
        if (
          property === "background-image" &&
          specifics &&
          specifics.includes("gif")
        ) {
          context.report({
            node,
            messageId: "unsupportedGif",
            data: { className },
          });
          return;
        }

        // Only report partial support in strict mode
        if (strict) {
          context.report({
            node,
            messageId: "partiallySupported",
            data: { className, property, limitation },
          });
        }
      }
    }

    function checkClassNames(node, classNamesValue) {
      if (!classNamesValue) return;

      const classes = parseTailwindClasses(classNamesValue);
      classes.forEach((className) => {
        validateTailwindClass(className, node);
      });
    }

    return {
      // Handle className="..." and class="..." in JSX
      JSXAttribute(node) {
        if (
          (node.name.name === "className" || node.name.name === "class") &&
          node.value
        ) {
          if (node.value.type === "Literal") {
            checkClassNames(node, node.value.value);
          } else if (node.value.type === "JSXExpressionContainer") {
            // Handle template literals and string concatenation
            if (node.value.expression.type === "TemplateLiteral") {
              const quasis = node.value.expression.quasis;
              quasis.forEach((quasi) => {
                if (quasi.value.raw) {
                  checkClassNames(node, quasi.value.raw);
                }
              });
            } else if (node.value.expression.type === "Literal") {
              checkClassNames(node, node.value.expression.value);
            }
          }
        }
      },

      // Handle vanilla JS: element.className = "..."
      AssignmentExpression(node) {
        if (
          node.left.type === "MemberExpression" &&
          node.left.property.name === "className" &&
          node.right.type === "Literal"
        ) {
          checkClassNames(node, node.right.value);
        }
      },

      // Handle setAttribute calls: element.setAttribute("class", "...")
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.name === "setAttribute" &&
          node.arguments.length >= 2 &&
          node.arguments[0].type === "Literal" &&
          node.arguments[0].value === "class" &&
          node.arguments[1].type === "Literal"
        ) {
          checkClassNames(node, node.arguments[1].value);
        }
      },

      // Handle template literals that might contain HTML with class attributes
      TemplateLiteral(node) {
        node.quasis.forEach((quasi) => {
          const text = quasi.value.raw;
          // Look for class="..." patterns in template literals
          const classMatches = text.match(/class\s*=\s*["']([^"']+)["']/g);
          if (classMatches) {
            classMatches.forEach((match) => {
              const classValue = match.match(/class\s*=\s*["']([^"']+)["']/)[1];
              checkClassNames(node, classValue);
            });
          }
        });
      },
    };
  },
};
