/**
 * Jest unit tests for gameface-support utility module
 */

const { describe, test, expect } = require('@jest/globals');
const { getGamefaceSupport } = require('../../lib/utils/gameface-support');

describe('gameface-support utility', () => {
  let support;

  beforeAll(() => {
    support = getGamefaceSupport();
  });

  test('should return valid support data structure', () => {
    expect(support).toBeDefined();
    expect(support.properties).toBeDefined();
    expect(typeof support.properties).toBe('object');
  });

  test('should contain expected CSS properties', () => {
    const expectedProperties = ['display', 'position', 'float', 'flex', 'grid', 'width', 'height'];
    
    expectedProperties.forEach(prop => {
      expect(support.properties[prop]).toBeDefined();
    });
  });

  test('should have valid status values for all properties', () => {
    const validStatuses = ['YES', 'NO', 'PARTIAL'];
    
    Object.values(support.properties).forEach(prop => {
      expect(validStatuses).toContain(prop.status);
    });
  });

  test('should have unsupportedValues array for PARTIAL properties', () => {
    const displayProp = support.properties.display;
    
    expect(displayProp.status).toBe('PARTIAL');
    expect(Array.isArray(displayProp.unsupportedValues)).toBe(true);
    expect(displayProp.unsupportedValues.length).toBeGreaterThan(0);
  });

  test('should mark grid as not supported', () => {
    const gridProp = support.properties.grid;
    
    expect(gridProp).toBeDefined();
    expect(gridProp.status).toBe('NO');
  });

  test('should mark flexbox as supported', () => {
    const flexProp = support.properties.flex;
    
    expect(flexProp).toBeDefined();
    expect(['YES', 'PARTIAL']).toContain(flexProp.status);
  });

  test('should have limitations for properties with restrictions', () => {
    const flexProp = support.properties.flex;
    
    expect(flexProp.limitation).toBeDefined();
    expect(typeof flexProp.limitation).toBe('string');
    expect(flexProp.limitation.length).toBeGreaterThan(0);
  });

  test('should include comprehensive flexbox property coverage', () => {
    const flexboxProperties = [
      'flex', 'flex-direction', 'flex-wrap', 'flex-basis', 
      'flex-grow', 'flex-shrink', 'justify-content', 'align-items'
    ];
    
    flexboxProperties.forEach(prop => {
      expect(support.properties[prop]).toBeDefined();
    });
  });
});

// Export removed - Jest handles test execution directly