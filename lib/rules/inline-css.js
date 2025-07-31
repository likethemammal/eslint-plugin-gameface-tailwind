/**
 * ESLint rule to detect unsupported inline CSS properties in Gameface/Coherent UI
 * Refactored version using modular utilities and consolidated constants
 */

const {
  extractStylePropertiesAsObject: extractStyleProperties,
  hasAttribute,
  getAttribute,
  isReactElementCall,
  extractCreateElementProps
} = require('../utils/helpers/ast-helpers');

const {
  validateCSSProperties,
  shouldReportCSSViolation: shouldReportViolation
} = require('../utils/validators/validation-engine');

const {
  reportViolations,
  createPropertyRemovalFix,
  generateSuggestions,
} = require('../utils/helpers/report-helpers');
const {
  RULE_MESSAGES
} = require("../constants/error-messages");

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow inline CSS properties that are not supported by Gameface/Coherent UI',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/your-repo/eslint-plugin-gameface-tailwind'
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: RULE_MESSAGES,
    schema: [
      {
        type: 'object',
        properties: {
          severity: {
            type: 'string',
            enum: ['error', 'warning'],
            default: 'warning'
          },
          checkValues: {
            type: 'boolean',
            default: true
          },
          ignoreProperties: {
            type: 'array',
            items: {
              type: 'string'
            },
            default: []
          },
          autofix: {
            type: 'boolean',
            default: false
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const { severity = 'warning', checkValues = true, ignoreProperties = [], autofix = false } = options;

    /**
     * Handle JSX style attribute
     */
    function handleJSXStyleAttribute(node) {
      if (!hasAttribute(node, 'style')) {
        return;
      }

      const styleAttr = getAttribute(node, 'style');
      
      // Extract value from JSX attribute
      let styleProperties = {};
      
      if (styleAttr && styleAttr.value) {
        if (styleAttr.value.type === 'JSXExpressionContainer') {
          // Handle style={{ display: "flex" }} format
          const styleValue = styleAttr.value.expression;
          if (styleValue) {
            styleProperties = extractStyleProperties(styleValue);
          }
        } else if (styleAttr.value.type === 'Literal' && typeof styleAttr.value.value === 'string') {
          // Handle style="display: flex" format
          const cssText = styleAttr.value.value;
          const parsedProperties = parseCSSString(cssText, styleAttr.value);
          styleProperties = {};
          parsedProperties.forEach(({ property, value }) => {
            if (property && value) {
              styleProperties[property] = value;
            }
          });
        }
      }
      
      if (Object.keys(styleProperties).length === 0) {
        return;
      }

      const violations = validateCSSProperties(styleProperties, { severity, checkValues });
      const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreProperties }));
      
      if (reportableViolations.length > 0) {
        // Add suggestions and fixes
        reportableViolations.forEach(violation => {
          violation.suggestions = generateSuggestions(violation);
          if (autofix) {
            violation.fix = createPropertyRemovalFix(styleAttr, [violation.property]);
          }
        });

        reportViolations(context, styleAttr, reportableViolations, {
          suggest: false,
          fixable: autofix
        });
      }
    }

    /**
     * Handle React.createElement with style props
     */
    function handleCreateElementStyle(node) {
      if (!isReactElementCall(node)) {
        return;
      }

      const props = extractCreateElementProps(node);
      const styleProp = props.style;
      
      if (!styleProp || !styleProp.value || styleProp.value.type !== 'ObjectExpression') {
        return;
      }

      const styleProperties = {};
      styleProp.value.properties.forEach(prop => {
        const key = prop.key.name || prop.key.value;
        const value = prop.value.type === 'Literal' ? prop.value.value : null;
        if (key && value !== null) {
          styleProperties[key] = value;
        }
      });

      const violations = validateCSSProperties(styleProperties, { severity, checkValues });
      const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreProperties }));
      
      if (reportableViolations.length > 0) {
        reportableViolations.forEach(violation => {
          violation.suggestions = generateSuggestions(violation);
        });

        reportViolations(context, styleProp, reportableViolations, {
          suggest: false
        });
      }
    }

    /**
     * Handle element.style.property assignments
     */
    function handleStyleAssignment(node) {
      // Handle element.style.property = value
      if (node.left &&
          node.left.type === 'MemberExpression' &&
          node.left.object &&
          node.left.object.type === 'MemberExpression' &&
          node.left.object.property &&
          node.left.object.property.name === 'style' &&
          node.left.property &&
          node.right &&
          node.right.type === 'Literal') {
        
        const property = node.left.property.name;
        const value = node.right.value;
        const styleProperties = [{ property, value, node: node.right }];
        
        const violations = validateCSSProperties(styleProperties, { severity, checkValues });
        const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreProperties }));
        
        if (reportableViolations.length > 0) {
          reportViolations(context, node.right, reportableViolations, {});
        }
      }
    }

    /**
     * Handle element.setAttribute("style", "...") calls
     */
    function handleSetStyleAttribute(node) {
      if (node.callee &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property &&
          node.callee.property.name === 'setAttribute' &&
          node.arguments.length >= 2 &&
          node.arguments[0].type === 'Literal' &&
          node.arguments[0].value === 'style' &&
          node.arguments[1].type === 'Literal') {
        
        // Parse CSS string into properties (simplified parsing)
        const cssString = node.arguments[1].value;
        const styleProperties = parseCSSString(cssString, node.arguments[1]);
        
        const violations = validateCSSProperties(styleProperties, { severity, checkValues });
        const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreProperties }));
        
        if (reportableViolations.length > 0) {
          reportViolations(context, node.arguments[1], reportableViolations, {});
        }
      }
    }

    /**
     * Simple CSS string parser for setAttribute cases
     */
    function parseCSSString(cssString, node) {
      if (!cssString || typeof cssString !== 'string') {
        return [];
      }

      return cssString.split(';')
        .map(rule => rule.trim())
        .filter(rule => rule.includes(':'))
        .map(rule => {
          const [property, value] = rule.split(':').map(s => s.trim());
          return { property, value, node };
        })
        .filter(p => p.property && p.value);
    }

    /**
     * Handle template literals with HTML-like content containing style attributes
     */
    function handleTemplateLiteral(node) {
      // Look for style attributes in template literals
      const templateValue = node.quasis.map(quasi => quasi.value.raw).join('${...}');
      
      // Simple regex to find style attributes in HTML-like strings
      const styleMatches = templateValue.match(/style=["']([^"']+)["']/g);
      
      if (styleMatches) {
        styleMatches.forEach(match => {
          const styleValue = match.match(/style=["']([^"']+)["']/)[1];
          const styleProperties = parseCSSString(styleValue, node);
          
          const violations = validateCSSProperties(styleProperties, { severity, checkValues });
          const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreProperties }));
          
          if (reportableViolations.length > 0) {
            reportViolations(context, node, reportableViolations, {});
          }
        });
      }
    }

    return {
      JSXElement: handleJSXStyleAttribute,
      JSXFragment: handleJSXStyleAttribute,
      CallExpression(node) {
        handleCreateElementStyle(node);
        handleSetStyleAttribute(node);
      },
      AssignmentExpression: handleStyleAssignment,
      TemplateLiteral: handleTemplateLiteral
    };
  }
};