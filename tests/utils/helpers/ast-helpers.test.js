/**
 * Tests for AST helpers
 */

const {
  extractClassNameValue,
  extractFromTemplateLiteral,
  extractStyleProperties,
  parseCSSString,
  hasAttribute,
  getAttribute,
  isReactElementCall,
  extractCreateElementProps
} = require('../../../lib/utils/helpers/ast-helpers');

describe('AST Helpers', () => {
  describe('extractClassNameValue', () => {
    test('should extract from literal values', () => {
      const node = {
        value: {
          type: 'Literal',
          value: 'flex p-4'
        }
      };

      const result = extractClassNameValue(node);
      expect(result).toBe('flex p-4');
    });

    test('should extract from JSX expression with literal', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'Literal',
            value: 'flex items-center'
          }
        }
      };

      const result = extractClassNameValue(node);
      expect(result).toBe('flex items-center');
    });

    test('should extract from template literals', () => {
      const templateLiteral = {
        type: 'TemplateLiteral',
        quasis: [
          { value: { cooked: 'flex ' } },
          { value: { cooked: ' p-4' } }
        ]
      };

      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: templateLiteral
        }
      };

      const result = extractClassNameValue(node);
      expect(result).toBe('flex   p-4'); // The function joins with space, so there are 3 spaces total
    });

    test('should return null for nodes without value', () => {
      const result = extractClassNameValue(null);
      expect(result).toBeNull();

      const result2 = extractClassNameValue({});
      expect(result2).toBeNull();
    });

    test('should return null for unsupported expression types', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'BinaryExpression',
            left: { type: 'Literal', value: 'flex' },
            operator: '+',
            right: { type: 'Literal', value: ' p-4' }
          }
        }
      };

      const result = extractClassNameValue(node);
      expect(result).toBeNull();
    });

    test('should return null for non-string literal expressions', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'Literal',
            value: 42
          }
        }
      };

      const result = extractClassNameValue(node);
      expect(result).toBeNull();
    });
  });

  describe('extractFromTemplateLiteral', () => {
    test('should join quasi values with spaces', () => {
      const templateLiteral = {
        quasis: [
          { value: { cooked: 'flex' } },
          { value: { cooked: 'p-4' } },
          { value: { cooked: 'items-center' } }
        ]
      };

      const result = extractFromTemplateLiteral(templateLiteral);
      expect(result).toBe('flex p-4 items-center');
    });

    test('should handle empty quasis', () => {
      const templateLiteral = {
        quasis: []
      };

      const result = extractFromTemplateLiteral(templateLiteral);
      expect(result).toBe('');
    });
  });

  describe('extractStyleProperties', () => {
    test('should extract from object expression', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { name: 'display' },
                value: { type: 'Literal', value: 'flex' }
              },
              {
                type: 'Property', 
                key: { value: 'padding' },
                value: { type: 'Literal', value: '1rem' }
              }
            ]
          }
        }
      };

      const result = extractStyleProperties(node);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        property: 'display',
        value: 'flex',
        node: node.value.expression.properties[0]
      });
      expect(result[1]).toEqual({
        property: 'padding',
        value: '1rem',
        node: node.value.expression.properties[1]
      });
    });

    test('should handle identifier values', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { name: 'display' },
                value: { type: 'Identifier', name: 'displayValue' }
              }
            ]
          }
        }
      };

      const result = extractStyleProperties(node);
      expect(result[0]).toEqual({
        property: 'display',
        value: 'displayValue',
        node: node.value.expression.properties[0]
      });
    });

    test('should extract from CSS string literals', () => {
      const node = {
        value: {
          type: 'Literal',
          value: 'display: flex; padding: 1rem'
        }
      };

      const result = extractStyleProperties(node);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        property: 'display',
        value: 'flex',
        node: node.value
      });
    });

    test('should return empty array for nodes without value', () => {
      const result = extractStyleProperties(null);
      expect(result).toEqual([]);

      const result2 = extractStyleProperties({});
      expect(result2).toEqual([]);
    });

    test('should filter out invalid properties', () => {
      const node = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { name: 'display' },
                value: { type: 'Literal', value: 'flex' }
              },
              {
                type: 'Property',
                key: null,
                value: null
              }
            ]
          }
        }
      };

      const result = extractStyleProperties(node);
      expect(result).toHaveLength(1);
    });

    test('should handle non-string literal values in CSS strings', () => {
      const node = {
        value: {
          type: 'Literal',
          value: 42
        }
      };

      const result = extractStyleProperties(node);
      expect(result).toEqual([]);
    });
  });

  describe('parseCSSString', () => {
    test('should parse valid CSS string', () => {
      const result = parseCSSString('display: flex; padding: 1rem; margin: 0', {});
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ property: 'display', value: 'flex', node: {} });
      expect(result[1]).toEqual({ property: 'padding', value: '1rem', node: {} });
      expect(result[2]).toEqual({ property: 'margin', value: '0', node: {} });
    });

    test('should handle CSS with extra whitespace', () => {
      const result = parseCSSString('  display : flex  ; padding:1rem;  ', {});
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ property: 'display', value: 'flex', node: {} });
      expect(result[1]).toEqual({ property: 'padding', value: '1rem', node: {} });
    });

    test('should filter out invalid rules', () => {
      const result = parseCSSString('display: flex; invalid-rule; color: red', {});
      
      expect(result).toHaveLength(2);
      expect(result[0].property).toBe('display');
      expect(result[1].property).toBe('color');
    });

    test('should return empty array for null/undefined input', () => {
      expect(parseCSSString(null)).toEqual([]);
      expect(parseCSSString(undefined)).toEqual([]);
      expect(parseCSSString('')).toEqual([]);
    });

    test('should return empty array for non-string input', () => {
      expect(parseCSSString(42)).toEqual([]);
      expect(parseCSSString({})).toEqual([]);
    });
  });

  describe('hasAttribute', () => {
    test('should return true when attribute exists', () => {
      const node = {
        openingElement: {
          attributes: [
            {
              type: 'JSXAttribute',
              name: { name: 'className' }
            }
          ]
        }
      };

      const result = hasAttribute(node, 'className');
      expect(result).toBe(true);
    });

    test('should return false when attribute does not exist', () => {
      const node = {
        openingElement: {
          attributes: [
            {
              type: 'JSXAttribute',
              name: { name: 'id' }
            }
          ]
        }
      };

      const result = hasAttribute(node, 'className');
      expect(result).toBe(false);
    });

    test('should return false for invalid nodes', () => {
      expect(hasAttribute(null, 'className')).toBe(false);
      expect(hasAttribute({}, 'className')).toBe(false);
      expect(hasAttribute({ openingElement: {} }, 'className')).toBe(false);
      expect(hasAttribute({ openingElement: { attributes: null } }, 'className')).toBe(false);
    });

    test('should handle non-JSXAttribute types', () => {
      const node = {
        openingElement: {
          attributes: [
            {
              type: 'JSXSpreadAttribute',
              name: { name: 'className' }
            }
          ]
        }
      };

      const result = hasAttribute(node, 'className');
      expect(result).toBe(false);
    });
  });

  describe('getAttribute', () => {
    test('should return attribute when found', () => {
      const classNameAttr = {
        type: 'JSXAttribute',
        name: { name: 'className' }
      };
      
      const node = {
        openingElement: {
          attributes: [classNameAttr]
        }
      };

      const result = getAttribute(node, 'className');
      expect(result).toBe(classNameAttr);
    });

    test('should return null when attribute not found', () => {
      const node = {
        openingElement: {
          attributes: [
            {
              type: 'JSXAttribute',
              name: { name: 'id' }
            }
          ]
        }
      };

      const result = getAttribute(node, 'className');
      expect(result).toBeUndefined();
    });

    test('should return null for invalid nodes', () => {
      expect(getAttribute(null, 'className')).toBeNull();
      expect(getAttribute({}, 'className')).toBeNull();
    });
  });

  describe('isReactElementCall', () => {
    test('should identify React.createElement calls', () => {
      const node = {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { name: 'React' },
          property: { name: 'createElement' }
        }
      };

      const result = isReactElementCall(node);
      expect(result).toBe(true);
    });

    test('should identify createElement calls', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'createElement' }
      };

      const result = isReactElementCall(node);
      expect(result).toBe(true);
    });

    test('should identify h calls', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'h' }
      };

      const result = isReactElementCall(node);
      expect(result).toBe(true);
    });

    test('should return false for non-createElement calls', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'someOtherFunction' }
      };

      const result = isReactElementCall(node);
      expect(result).toBe(false);
    });

    test('should return false for non-CallExpression nodes', () => {
      const node = {
        type: 'Identifier',
        name: 'createElement'
      };

      const result = isReactElementCall(node);
      expect(result).toBe(false);
    });
  });

  describe('extractCreateElementProps', () => {
    test('should extract props from createElement call', () => {
      const styleProp = {
        type: 'Property',
        key: { name: 'style' }
      };

      const node = {
        type: 'CallExpression',
        callee: { name: 'createElement' },
        arguments: [
          { type: 'Literal', value: 'div' },
          {
            type: 'ObjectExpression',
            properties: [styleProp]
          }
        ]
      };

      const result = extractCreateElementProps(node);
      expect(result).toEqual({ style: styleProp });
    });

    test('should return empty object for non-createElement calls', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'someFunction' }
      };

      const result = extractCreateElementProps(node);
      expect(result).toEqual({});
    });

    test('should return empty object when insufficient arguments', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'createElement' },
        arguments: [
          { type: 'Literal', value: 'div' }
        ]
      };

      const result = extractCreateElementProps(node);
      expect(result).toEqual({});
    });

    test('should return empty object for non-object props', () => {
      const node = {
        type: 'CallExpression',
        callee: { name: 'createElement' },
        arguments: [
          { type: 'Literal', value: 'div' },
          { type: 'Literal', value: null }
        ]
      };

      const result = extractCreateElementProps(node);
      expect(result).toEqual({});
    });

    test('should handle properties with key.value', () => {
      const styleProp = {
        type: 'Property',
        key: { value: 'style' }
      };

      const node = {
        type: 'CallExpression',
        callee: { name: 'createElement' },
        arguments: [
          { type: 'Literal', value: 'div' },
          {
            type: 'ObjectExpression',
            properties: [styleProp]
          }
        ]
      };

      const result = extractCreateElementProps(node);
      expect(result).toEqual({ style: styleProp });
    });
  });
});