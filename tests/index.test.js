/**
 * Jest unit tests for main index.js plugin file
 */

const { describe, test, expect } = require('@jest/globals');
const plugin = require('../index.js');

describe('ESLint Plugin Index', () => {
  test('should export plugin with correct structure', () => {
    expect(plugin).toBeDefined();
    expect(typeof plugin).toBe('object');
  });

  test('should have rules property with correct rules', () => {
    expect(plugin.rules).toBeDefined();
    expect(typeof plugin.rules).toBe('object');
    
    expect(plugin.rules['classes']).toBeDefined();
    expect(plugin.rules['inline-css']).toBeDefined();
  });

  test('should have configs property with presets', () => {
    expect(plugin.configs).toBeDefined();
    expect(typeof plugin.configs).toBe('object');
    
    expect(plugin.configs.recommended).toBeDefined();
    expect(plugin.configs.strict).toBeDefined();
  });

  test('should have correct recommended configuration', () => {
    const recommended = plugin.configs.recommended;
    
    expect(recommended.rules).toBeDefined();
    expect(recommended.rules['gameface-tailwind/classes']).toBe('error');
    expect(recommended.rules['gameface-tailwind/inline-css']).toBe('error');
  });

  test('should have correct strict configuration', () => {
    const strict = plugin.configs.strict;
    
    expect(strict.rules).toBeDefined();
    expect(strict.rules['gameface-tailwind/classes']).toEqual(['error', { strict: true }]);
    expect(strict.rules['gameface-tailwind/inline-css']).toEqual(['error', { strict: true }]);
  });
});