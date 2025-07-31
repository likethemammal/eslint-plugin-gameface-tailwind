/**
 * Tests for report helpers
 */

const { 
  reportViolation, 
  reportViolations, 
  createClassRemovalFix, 
  createPropertyRemovalFix, 
  generateSuggestions,
} = require('../../../lib/utils/helpers/report-helpers');

const {
  RULE_MESSAGES,
} = require('../../../lib/constants/error-messages');

describe('Report Helpers', () => {
  let mockContext;
  let mockNode;
  let mockFixer;

  beforeEach(() => {
    mockContext = {
      report: jest.fn()
    };
    
    mockNode = {
      type: 'JSXAttribute',
      value: {
        type: 'Literal',
        value: 'grid float-left',
        raw: '"grid float-left"'
      }
    };

    mockFixer = {
      replaceText: jest.fn((node, text) => ({ type: 'replace', node, text })),
      remove: jest.fn((node) => ({ type: 'remove', node }))
    };
  });

  describe('reportViolation', () => {
    test('should report violation with default options', () => {
      const violation = {
        className: 'grid',
        reason: 'not supported',
        messageId: 'gridNotSupported'
      };

      reportViolation(mockContext, mockNode, violation);

      expect(mockContext.report).toHaveBeenCalledWith({
        node: mockNode,
        messageId: 'gridNotSupported',
        data: {
          item: 'grid',
          className: 'grid',
          property: undefined,
          value: undefined,
          reason: 'not supported',
          message: undefined
        }
      });
    });

    test('should include suggestions when enabled', () => {
      const violation = {
        className: 'grid',
        suggestions: ['Use flexbox instead']
      };

      reportViolation(mockContext, mockNode, violation, { suggest: true });

      expect(mockContext.report).toHaveBeenCalledWith(
        expect.objectContaining({
          suggest: expect.arrayContaining([
            expect.objectContaining({
              desc: 'Use flexbox instead'
            })
          ])
        })
      );
    });

    test('should include fix when fixable and fix provided', () => {
      const mockFix = jest.fn();
      const violation = {
        className: 'grid',
        fix: mockFix
      };

      reportViolation(mockContext, mockNode, violation, { fixable: true });

      expect(mockContext.report).toHaveBeenCalledWith(
        expect.objectContaining({
          fix: mockFix
        })
      );
    });

    test('should use default messageId when not provided', () => {
      const violation = {
        className: 'unknown-class'
      };

      reportViolation(mockContext, mockNode, violation);

      expect(mockContext.report).toHaveBeenCalledWith(
        expect.objectContaining({
          messageId: 'gamefaceUnsupported'
        })
      );
    });

    test('should handle property-based violations', () => {
      const violation = {
        property: 'display',
        value: 'grid',
        reason: 'not supported'
      };

      reportViolation(mockContext, mockNode, violation);

      expect(mockContext.report).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            item: 'display',
            property: 'display',
            value: 'grid'
          })
        })
      );
    });
  });

  describe('reportViolations', () => {
    test('should report multiple violations', () => {
      const violations = [
        { className: 'grid', messageId: 'gridNotSupported' },
        { className: 'float-left', messageId: 'floatNotSupported' }
      ];

      reportViolations(mockContext, mockNode, violations);

      expect(mockContext.report).toHaveBeenCalledTimes(2);
    });
  });

  describe('createClassRemovalFix', () => {
    test('should create fix that removes specified classes', () => {
      const fix = createClassRemovalFix(mockNode, ['grid']);
      const result = fix(mockFixer);

      expect(mockFixer.replaceText).toHaveBeenCalledWith(
        mockNode.value,
        '"float-left"'
      );
    });

    test('should handle multiple class removal', () => {
      const fix = createClassRemovalFix(mockNode, ['grid', 'float-left']);
      const result = fix(mockFixer);

      expect(mockFixer.replaceText).toHaveBeenCalledWith(
        mockNode.value,
        '""'
      );
    });

    test('should return null for non-literal nodes', () => {
      const nonLiteralNode = {
        value: { type: 'JSXExpressionContainer' }
      };
      
      const fix = createClassRemovalFix(nonLiteralNode, ['grid']);
      const result = fix(mockFixer);

      expect(result).toBeNull();
    });

    test('should return null for nodes without value', () => {
      const noValueNode = {};
      
      const fix = createClassRemovalFix(noValueNode, ['grid']);
      const result = fix(mockFixer);

      expect(result).toBeNull();
    });
  });

  describe('createPropertyRemovalFix', () => {
    let styleNode;

    beforeEach(() => {
      styleNode = {
        value: {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: { name: 'display' },
                value: { value: 'grid' }
              },
              {
                type: 'Property', 
                key: { name: 'float' },
                value: { value: 'left' }
              }
            ]
          }
        }
      };
    });

    test('should create fix that removes specified properties', () => {
      const fix = createPropertyRemovalFix(styleNode, ['display']);
      const result = fix(mockFixer);

      expect(mockFixer.remove).toHaveBeenCalledWith(
        styleNode.value.expression.properties[0]
      );
    });

    test('should return null for non-JSXExpressionContainer nodes', () => {
      const nonExpressionNode = {
        value: { type: 'Literal', value: 'display: grid' }
      };
      
      const fix = createPropertyRemovalFix(nonExpressionNode, ['display']);
      const result = fix(mockFixer);

      expect(result).toBeNull();
    });

    test('should return null for non-ObjectExpression', () => {
      const nonObjectNode = {
        value: {
          type: 'JSXExpressionContainer',
          expression: { type: 'Literal' }
        }
      };
      
      const fix = createPropertyRemovalFix(nonObjectNode, ['display']);
      const result = fix(mockFixer);

      expect(result).toBeNull();
    });

    test('should handle properties with key.value instead of key.name', () => {
      styleNode.value.expression.properties[0].key = { value: 'display' };
      delete styleNode.value.expression.properties[0].key.name;
      
      const fix = createPropertyRemovalFix(styleNode, ['display']);
      const result = fix(mockFixer);

      expect(mockFixer.remove).toHaveBeenCalledWith(
        styleNode.value.expression.properties[0]
      );
    });
  });

  describe('generateSuggestions', () => {
    test('should generate grid alternatives', () => {
      const violation = { className: 'grid-cols-3' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('Use flexbox layout instead of CSS Grid');
    });

    test('should generate shadow alternatives', () => {
      const violation = { className: 'shadow-lg' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('Use border or background-color for visual emphasis');
    });

    test('should generate float alternatives', () => {
      const violation = { className: 'float-left' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('Use flexbox or absolute positioning instead');
    });

    test('should generate order alternatives', () => {
      const violation = { className: 'order-1' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('Rearrange HTML elements directly instead of using CSS order');
    });

    test('should generate display grid alternatives', () => {
      const violation = { property: 'display', value: 'grid' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('display: flex');
    });

    test('should generate position sticky alternatives', () => {
      const violation = { property: 'position', value: 'sticky' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('position: fixed');
      expect(suggestions).toContain('position: absolute');
    });

    test('should generate float property alternatives', () => {
      const violation = { property: 'float' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toContain('Use flexbox with justify-content and align-items');
    });

    test('should return empty array for unknown violations', () => {
      const violation = { className: 'unknown-class' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toEqual([]);
    });

    test('should handle violations without className or property', () => {
      const violation = { reason: 'some reason' };
      const suggestions = generateSuggestions(violation);

      expect(suggestions).toEqual([]);
    });
  });

  describe('RULE_MESSAGES', () => {
    test('should return object with all required message keys', () => {
      const messages = RULE_MESSAGES;

      expect(messages).toHaveProperty('gamefaceUnsupported');
      expect(messages).toHaveProperty('tailwindUnsupported');
      expect(messages).toHaveProperty('cssUnsupported');
      expect(messages).toHaveProperty('gridNotSupported');
      expect(messages).toHaveProperty('shadowNotSupported');
      expect(messages).toHaveProperty('floatNotSupported');
      expect(messages).toHaveProperty('unsupportedValue');
      expect(messages).toHaveProperty('unsupportedProperty');
    });

    test('should have consistent message formatting', () => {
      const messages = RULE_MESSAGES;

      // Check that messages contain the expected placeholders (single braces for template strings)
      expect(messages.tailwindUnsupported).toContain('{item}');
      expect(messages.unsupportedValue).toContain('{value}');
      expect(messages.unsupportedValue).toContain('{property}');
    });

    test('should use fallback messages when ERROR_MESSAGES are undefined', () => {
      const messages = RULE_MESSAGES;

      // These should have fallbacks defined in the function
      expect(messages.gamefaceUnsupported).toBeDefined();
      expect(messages.tailwindUnsupported).toBeDefined();
      expect(messages.cssUnsupported).toBeDefined();
    });
  });
});