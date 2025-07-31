/**
 * Tests for css-properties constants
 */

const {
  SUPPORT_STATUS,
  CSS_PROPERTIES,
  BASIC_COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING_VALUES
} = require('../../lib/constants/css-properties');

describe('CSS Properties Constants', () => {
  describe('SUPPORT_STATUS', () => {
    test('should define all status constants', () => {
      expect(SUPPORT_STATUS).toBeDefined();
      expect(SUPPORT_STATUS.YES).toBe('YES');
      expect(SUPPORT_STATUS.NO).toBe('NO');
      expect(SUPPORT_STATUS.PARTIAL).toBe('PARTIAL');
      expect(SUPPORT_STATUS.CONDITIONAL).toBe('CONDITIONAL');
    });

    test('should have string values', () => {
      const statuses = Object.values(SUPPORT_STATUS);
      for (const status of statuses) {
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
      }
    });
  });

  describe('CSS_PROPERTIES', () => {
    test('should define property configurations', () => {
      expect(CSS_PROPERTIES).toBeDefined();
      expect(typeof CSS_PROPERTIES).toBe('object');
    });

    test('should have consistent structure for property configs', () => {
      const properties = Object.keys(CSS_PROPERTIES);
      expect(properties.length).toBeGreaterThan(0);

      for (const property of properties) {
        const config = CSS_PROPERTIES[property];
        expect(config).toHaveProperty('SUPPORTED');
        expect(config).toHaveProperty('UNSUPPORTED');
        expect(config).toHaveProperty('PROPERTY_CONFIG');
        
        expect(Array.isArray(config.SUPPORTED)).toBe(true);
        expect(Array.isArray(config.UNSUPPORTED)).toBe(true);
        expect(typeof config.PROPERTY_CONFIG).toBe('object');
      }
    });

    test('should have valid property configs', () => {
      const displayConfig = CSS_PROPERTIES.DISPLAY;
      expect(displayConfig.PROPERTY_CONFIG.status).toBe(SUPPORT_STATUS.PARTIAL);
      expect(displayConfig.SUPPORTED).toContain('flex');
      expect(displayConfig.UNSUPPORTED).toContain('grid');

      const positionConfig = CSS_PROPERTIES.POSITION;
      expect(positionConfig.SUPPORTED).toContain('relative');
      expect(positionConfig.UNSUPPORTED).toContain('sticky');
    });

    test('should not have overlapping supported/unsupported values', () => {
      for (const property of Object.keys(CSS_PROPERTIES)) {
        const config = CSS_PROPERTIES[property];
        const supported = config.SUPPORTED;
        const unsupported = config.UNSUPPORTED;
        
        // Check for overlaps
        const overlap = supported.filter(value => unsupported.includes(value));
        expect(overlap).toEqual([]);
      }
    });
  });

  describe('BASIC_COLORS', () => {
    test('should define color mappings', () => {
      if (BASIC_COLORS) {
        expect(typeof BASIC_COLORS).toBe('object');
        
        // Check some basic colors exist
        const colorKeys = Object.keys(BASIC_COLORS);
        expect(colorKeys.length).toBeGreaterThan(0);
        
        // All values should be strings (color values)
        for (const color of Object.values(BASIC_COLORS)) {
          expect(typeof color).toBe('string');
        }
      }
    });

    test('should have consistent color format', () => {
      if (BASIC_COLORS) {
        const colors = Object.values(BASIC_COLORS);
        for (const color of colors) {
          // Should be hex, rgb, or named color
          expect(color).toMatch(/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|[a-zA-Z]+).*$/);
        }
      }
    });
  });

  describe('FONT_SIZES', () => {
    test('should define font size mappings', () => {
      if (FONT_SIZES) {
        expect(typeof FONT_SIZES).toBe('object');
        
        const sizeKeys = Object.keys(FONT_SIZES);
        expect(sizeKeys.length).toBeGreaterThan(0);
        
        // All values should be strings (size values)
        for (const size of Object.values(FONT_SIZES)) {
          expect(typeof size).toBe('string');
        }
      }
    });

    test('should have valid CSS size units', () => {
      if (FONT_SIZES) {
        const sizes = Object.values(FONT_SIZES);
        for (const size of sizes) {
          // Should have valid CSS units
          expect(size).toMatch(/^(\d+(\.\d+)?(px|rem|em|%|pt)|\d+)$/);
        }
      }
    });
  });

  describe('FONT_WEIGHTS', () => {
    test('should define font weight mappings', () => {
      if (FONT_WEIGHTS) {
        expect(typeof FONT_WEIGHTS).toBe('object');
        
        const weightKeys = Object.keys(FONT_WEIGHTS);
        expect(weightKeys.length).toBeGreaterThan(0);
        
        // All values should be strings or numbers
        for (const weight of Object.values(FONT_WEIGHTS)) {
          expect(['string', 'number']).toContain(typeof weight);
        }
      }
    });

    test('should have valid font weight values', () => {
      if (FONT_WEIGHTS) {
        const weights = Object.values(FONT_WEIGHTS);
        for (const weight of weights) {
          // Should be numeric (100-900) or named (normal, bold, etc.)
          if (typeof weight === 'string') {
            expect(weight).toMatch(/^(normal|bold|bolder|lighter|\d{3})$/);
          } else {
            expect(weight).toBeGreaterThanOrEqual(100);
            expect(weight).toBeLessThanOrEqual(900);
          }
        }
      }
    });
  });

  describe('SPACING_VALUES', () => {
    test('should define spacing mappings', () => {
      if (SPACING_VALUES) {
        expect(typeof SPACING_VALUES).toBe('object');
        
        const spacingKeys = Object.keys(SPACING_VALUES);
        expect(spacingKeys.length).toBeGreaterThan(0);
        
        // All values should be strings (spacing values)
        for (const spacing of Object.values(SPACING_VALUES)) {
          expect(typeof spacing).toBe('string');
        }
      }
    });

    test('should have valid CSS spacing units', () => {
      if (SPACING_VALUES) {
        const spacings = Object.values(SPACING_VALUES);
        for (const spacing of spacings) {
          // Should have valid CSS units or keywords
          expect(spacing).toMatch(/^(\d+(\.\d+)?(px|rem|em|%|vh|vw)|0|auto|min-content|max-content|fit-content)$/);
        }
      }
    });

    test('should include common spacing values', () => {
      if (SPACING_VALUES) {
        // Should have zero spacing
        const hasZero = Object.values(SPACING_VALUES).some(value => 
          value === '0' || value === '0px'
        );
        expect(hasZero).toBe(true);
      }
    });
  });

  describe('Integration and consistency', () => {
    test('should have consistent exports', () => {
      expect(SUPPORT_STATUS).toBeDefined();
      expect(CSS_PROPERTIES).toBeDefined();
      
      // Optional exports should be objects if they exist
      if (BASIC_COLORS) expect(typeof BASIC_COLORS).toBe('object');
      if (FONT_SIZES) expect(typeof FONT_SIZES).toBe('object');
      if (FONT_WEIGHTS) expect(typeof FONT_WEIGHTS).toBe('object');
      if (SPACING_VALUES) expect(typeof SPACING_VALUES).toBe('object');
    });

    test('should use consistent status values in property configs', () => {
      const validStatuses = Object.values(SUPPORT_STATUS);
      
      for (const property of Object.keys(CSS_PROPERTIES)) {
        const config = CSS_PROPERTIES[property];
        expect(validStatuses).toContain(config.PROPERTY_CONFIG.status);
      }
    });
  });
});