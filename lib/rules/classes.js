/**
 * ESLint rule to detect unsupported Tailwind CSS classes in Gameface/Coherent UI
 * Refactored version using modular utilities and consolidated constants
 */

const {
  extractClassNameValue,
  hasAttribute,
  getAttribute,
  isReactElementCall,
  extractCreateElementProps
} = require('../utils/helpers/ast-helpers');

const {
  validateTailwindClasses,
  shouldReportTailwindViolation: shouldReportViolation
} = require('../utils/validators/validation-engine');

const {
  reportViolations,
  createClassRemovalFix,
  createTemplateLiteralFix,
  generateSuggestions,
} = require('../utils/helpers/report-helpers');
const {
  RULE_MESSAGES
} = require("../constants/error-messages");

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Tailwind CSS classes that are not supported by Gameface/Coherent UI',
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
          ignoreUnknown: {
            type: 'boolean',
            default: false
          },
          ignoreClasses: {
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
    const { severity = 'warning', ignoreUnknown = false, ignoreClasses = [], autofix = false } = options;

    /**
     * Handle JSX className attribute
     */
    function handleJSXAttribute(node) {
      if (!hasAttribute(node, 'className')) {
        return;
      }

      const classNameAttr = getAttribute(node, 'className');
      const classValue = extractClassNameValue(classNameAttr);
      
      if (!classValue) {
        return;
      }

      const violations = validateTailwindClasses(classValue, { severity, ignoreUnknown });
      const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreClasses }));
      
      if (reportableViolations.length > 0) {
        // Add suggestions to each violation
        reportableViolations.forEach(violation => {
          violation.suggestions = generateSuggestions(violation);
        });

        // If autofix is enabled, create one fix that removes all violating classes
        if (autofix) {
          const classesToRemove = reportableViolations.map(v => v.className);
          const allClassesFix = createClassRemovalFix(classNameAttr, classesToRemove);
          // Only add the fix to the first violation to avoid duplicate fixes
          reportableViolations[0].fix = allClassesFix;
        }

        reportViolations(context, classNameAttr, reportableViolations, {
          suggest: false,
          fixable: autofix
        });
      }
    }

    /**
     * Handle React.createElement calls
     */
    function handleCreateElementCall(node) {
      if (!isReactElementCall(node)) {
        return;
      }

      const props = extractCreateElementProps(node);
      const classNameProp = props.className;
      
      if (!classNameProp || !classNameProp.value) {
        return;
      }

      let classValue = null;
      if (classNameProp.value.type === 'Literal') {
        classValue = classNameProp.value.value;
      }

      if (!classValue) {
        return;
      }

      const violations = validateTailwindClasses(classValue, { severity, ignoreUnknown });
      const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreClasses }));
      
      if (reportableViolations.length > 0) {
        reportableViolations.forEach(violation => {
          violation.suggestions = generateSuggestions(violation);
        });

        reportViolations(context, classNameProp, reportableViolations, {
          suggest: false
        });
      }
    }

    /**
     * Handle regular element.className assignments and setAttribute calls
     */
    function handleAssignmentExpression(node) {
      // Handle element.className = "..."
      if (node.left &&
          node.left.type === 'MemberExpression' &&
          node.left.property &&
          node.left.property.name === 'className' &&
          node.right &&
          node.right.type === 'Literal') {
        
        const classValue = node.right.value;
        const violations = validateTailwindClasses(classValue, { severity, ignoreUnknown });
        const reportableViolations = violations.filter(v => shouldReportViolation(v, options));
        
        if (reportableViolations.length > 0) {
          reportViolations(context, node.right, reportableViolations, {});
        }
      }
    }

    /**
     * Handle element.setAttribute("class", "...") calls
     */
    function handleCallExpression(node) {
      if (node.callee &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property &&
          node.callee.property.name === 'setAttribute' &&
          node.arguments.length >= 2 &&
          node.arguments[0].type === 'Literal' &&
          (node.arguments[0].value === 'class' || node.arguments[0].value === 'className') &&
          node.arguments[1].type === 'Literal') {
        
        const classValue = node.arguments[1].value;
        const violations = validateTailwindClasses(classValue, { severity, ignoreUnknown });
        const reportableViolations = violations.filter(v => shouldReportViolation(v, options));
        
        if (reportableViolations.length > 0) {
          reportViolations(context, node.arguments[1], reportableViolations, {});
        }
      }
    }

    /**
     * Handle template literals with HTML-like content or standalone class lists
     */
    function handleTemplateLiteral(node) {
      // Skip template literals that are JSX expression container values (handled by JSX handler)
      if (node.parent && node.parent.type === 'JSXExpressionContainer') {
        return;
      }
      
      // Check if this is a simple template literal (no expressions) containing class names
      if (node.quasis.length === 1 && node.expressions.length === 0) {
        const templateValue = node.quasis[0].value.raw;
        
        // Check if it looks like a class list (doesn't contain HTML tags)
        if (!templateValue.includes('<') && !templateValue.includes('>')) {
          const violations = validateTailwindClasses(templateValue, { severity, ignoreUnknown });
          const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreClasses }));
          
          if (reportableViolations.length > 0) {
            reportableViolations.forEach(violation => {
              violation.suggestions = generateSuggestions(violation);
            });

            // If autofix is enabled, create a fix for the template literal
            if (autofix) {
              const classesToRemove = reportableViolations.map(v => v.className);
              const templateLiteralFix = createTemplateLiteralFix(node, classesToRemove);
              reportableViolations[0].fix = templateLiteralFix;
            }

            reportViolations(context, node, reportableViolations, {
              suggest: false,
              fixable: autofix
            });
          }
          return;
        }
      }
      
      // Look for class attributes in template literals with HTML-like content
      const templateValue = node.quasis.map(quasi => quasi.value.raw).join('${...}');
      
      // Simple regex to find class attributes in HTML-like strings
      const classMatches = templateValue.match(/class=["']([^"']+)["']/g);
      
      if (classMatches) {
        classMatches.forEach(match => {
          const classValue = match.match(/class=["']([^"']+)["']/)[1];
          
          const violations = validateTailwindClasses(classValue, { severity, ignoreUnknown });
          const reportableViolations = violations.filter(v => shouldReportViolation(v, { ...options, ignoreClasses }));
          
          if (reportableViolations.length > 0) {
            // Add suggestions and fixes for each violation
            reportableViolations.forEach(violation => {
              violation.suggestions = generateSuggestions(violation);
            });

            reportViolations(context, node, reportableViolations, {
              suggest: false,
              fixable: false
            });
          }
        });
      }
    }

    return {
      JSXElement: handleJSXAttribute,
      JSXFragment: handleJSXAttribute,
      CallExpression(node) {
        handleCreateElementCall(node);
        handleCallExpression(node);
      },
      AssignmentExpression: handleAssignmentExpression,
      TemplateLiteral: handleTemplateLiteral
    };
  }
};