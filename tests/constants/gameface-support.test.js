/**
 * Jest unit tests for gameface-support utility module
 */

const { describe, test, expect } = require('@jest/globals');
const { VALIDATION_RULES, SUPPORT_STATUS, getPropertySupport } = require('../../lib/constants/validation-rules');

describe('validation-rules utility', () => {
  test('should return valid validation rules structure', () => {
    expect(VALIDATION_RULES).toBeDefined();
    expect(typeof VALIDATION_RULES).toBe('object');
    expect(SUPPORT_STATUS).toBeDefined();
    expect(getPropertySupport).toBeDefined();
  });

  test('should contain expected CSS properties', () => {
    const expectedProperties = ['display', 'position', 'float'];
    
    expectedProperties.forEach(prop => {
      expect(VALIDATION_RULES[prop]).toBeDefined();
    });
  });

  test('should have valid status values for all properties', () => {
    const validStatuses = [SUPPORT_STATUS.YES, SUPPORT_STATUS.NO, SUPPORT_STATUS.PARTIAL, SUPPORT_STATUS.CONDITIONAL];
    
    Object.values(VALIDATION_RULES).forEach(rule => {
      expect(validStatuses).toContain(rule.status);
    });
  });

  test('should have unsupportedValues array for PARTIAL properties', () => {
    const displayRule = VALIDATION_RULES.display;
    
    expect(displayRule.status).toBe(SUPPORT_STATUS.PARTIAL);
    expect(Array.isArray(displayRule.unsupportedValues)).toBe(true);
    expect(displayRule.unsupportedValues.length).toBeGreaterThan(0);
  });

  test('should mark float as not supported', () => {
    const floatRule = VALIDATION_RULES.float;
    
    expect(floatRule).toBeDefined();
    expect(floatRule.status).toBe(SUPPORT_STATUS.NO);
  });

  test('should mark flexbox properties as supported or partial', () => {
    const justifyContentRule = VALIDATION_RULES['justify-content'];
    
    expect(justifyContentRule).toBeDefined();
    expect([SUPPORT_STATUS.YES, SUPPORT_STATUS.PARTIAL]).toContain(justifyContentRule.status);
  });

  test('should have reason functions for properties with restrictions', () => {
    const displayRule = VALIDATION_RULES.display;
    
    expect(displayRule.reason).toBeDefined();
    expect(typeof displayRule.reason).toBe('function');
    expect(displayRule.reason('grid')).toContain('not supported');
  });

  test('should include comprehensive flexbox property coverage', () => {
    const flexboxProperties = [
      'justify-content', 'align-items', 'align-content', 'align-self',
      'flex-basis', 'flex-grow', 'flex-shrink'
    ];
    
    flexboxProperties.forEach(prop => {
      expect(VALIDATION_RULES[prop]).toBeDefined();
    });
  });

  test('getPropertySupport should work correctly', () => {
    const displaySupport = getPropertySupport('display');
    expect(displaySupport.supported).toBe(true);
    expect(displaySupport.status).toBe(SUPPORT_STATUS.PARTIAL);
    
    const floatSupport = getPropertySupport('float');
    expect(floatSupport.supported).toBe(false);
    expect(floatSupport.status).toBe(SUPPORT_STATUS.NO);
  });
});

// Export removed - Jest handles test execution directly