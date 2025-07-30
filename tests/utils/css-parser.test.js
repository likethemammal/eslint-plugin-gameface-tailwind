/**
 * Jest unit tests for css-parser utility module
 */

const { describe, test, expect } = require('@jest/globals');
const { parseInlineCSS, validateCSSValue } = require('../../lib/utils/css-parser');

describe('css-parser utility', () => {
  describe('parseInlineCSS', () => {
    test('should parse valid CSS string correctly', () => {
      const result = parseInlineCSS('display: flex; margin: 10px; padding: 5px');
      const expected = {
        'display': 'flex',
        'margin': '10px',
        'padding': '5px'
      };
      
      expect(result).toEqual(expected);
    });

    test('should handle empty input', () => {
      const result = parseInlineCSS('');
      
      expect(typeof result).toBe('object');
      expect(Object.keys(result)).toHaveLength(0);
    });

    test('should handle null and undefined input', () => {
      const result1 = parseInlineCSS(null);
      const result2 = parseInlineCSS(undefined);
      
      expect(typeof result1).toBe('object');
      expect(Object.keys(result1)).toHaveLength(0);
      expect(typeof result2).toBe('object');
      expect(Object.keys(result2)).toHaveLength(0);
    });

    test('should handle malformed CSS gracefully', () => {
      const result = parseInlineCSS('display flex; margin: ; : 10px');
      
      expect(typeof result).toBe('object');
      // Should only parse valid declarations, malformed ones are ignored
    });

    test('should handle CSS with extra whitespace', () => {
      const result = parseInlineCSS('  display : flex  ;  margin: 10px  ;  ');
      
      expect(result).toEqual({
        'display': 'flex',
        'margin': '10px'
      });
    });

    test('should handle CSS properties with hyphens', () => {
      const result = parseInlineCSS('flex-direction: column; justify-content: center');
      
      expect(result).toEqual({
        'flex-direction': 'column',
        'justify-content': 'center'
      });
    });
  });

  describe('validateCSSValue', () => {
    test('should validate display values correctly', () => {
      const flexValid = validateCSSValue('display', 'flex');
      const blockInvalid = validateCSSValue('display', 'block');
      const gridInvalid = validateCSSValue('display', 'grid');
      
      expect(flexValid.valid).toBe(true);
      expect(blockInvalid.valid).toBe(false);
      expect(blockInvalid.reason).toBeDefined();
      expect(gridInvalid.valid).toBe(false);
      expect(gridInvalid.reason).toBeDefined();
    });

    test('should validate position values correctly', () => {
      const relativeValid = validateCSSValue('position', 'relative');
      const absoluteValid = validateCSSValue('position', 'absolute');
      const stickyInvalid = validateCSSValue('position', 'sticky');
      
      expect(relativeValid.valid).toBe(true);
      expect(absoluteValid.valid).toBe(true);
      expect(stickyInvalid.valid).toBe(false);
      expect(stickyInvalid.reason).toBeDefined();
    });

    test('should validate border-style values correctly', () => {
      const solidValid = validateCSSValue('border-style', 'solid');
      const noneValid = validateCSSValue('border-style', 'none');
      const dottedInvalid = validateCSSValue('border-style', 'dotted');
      
      expect(solidValid.valid).toBe(true);
      expect(noneValid.valid).toBe(true);
      expect(dottedInvalid.valid).toBe(false);
      expect(dottedInvalid.reason).toBeDefined();
    });

    test('should validate justify-content values correctly', () => {
      const centerValid = validateCSSValue('justify-content', 'center');
      const betweenValid = validateCSSValue('justify-content', 'space-between');
      const evenlyInvalid = validateCSSValue('justify-content', 'space-evenly');
      
      expect(centerValid.valid).toBe(true);
      expect(betweenValid.valid).toBe(true);
      expect(evenlyInvalid.valid).toBe(false);
      expect(evenlyInvalid.reason).toBeDefined();
    });

    test('should return valid for unknown properties', () => {
      const result = validateCSSValue('unknown-property', 'any-value');
      
      expect(result.valid).toBe(true);
    });

    test('should handle edge cases gracefully', () => {
      expect(validateCSSValue('', '')).toEqual({ valid: true });
      expect(validateCSSValue(null, null)).toEqual({ valid: true });
      expect(validateCSSValue(undefined, undefined)).toEqual({ valid: true });
    });

    test('should validate special properties correctly', () => {
      const { validateCSSValue, detectGifUsage, detectUnsupportedUnits, extractUrlFromCSSValue } = require('../../lib/utils/css-parser');
      
      // Test detectGifUsage
      expect(detectGifUsage('url(image.gif)')).toBe(true);
      expect(detectGifUsage('url(image.png)')).toBe(false);
      expect(detectGifUsage('')).toBe(false);
      expect(detectGifUsage(null)).toBe(false);
      
      // Test detectUnsupportedUnits
      expect(detectUnsupportedUnits('12pt')).toBe(true);
      expect(detectUnsupportedUnits('12px')).toBe(false);
      expect(detectUnsupportedUnits('')).toBe(false);
      expect(detectUnsupportedUnits(null)).toBe(false);
      
      // Test extractUrlFromCSSValue
      expect(extractUrlFromCSSValue('url(image.png)')).toBe('image.png');
      expect(extractUrlFromCSSValue('url("image.jpg")')).toBe('image.jpg');
      expect(extractUrlFromCSSValue('blue')).toBeNull();
      expect(extractUrlFromCSSValue('')).toBeNull();
      expect(extractUrlFromCSSValue(null)).toBeNull();
    });

    test('should validate additional CSS properties', () => {
      // Test pointer-events validation
      const pointerEventsAuto = validateCSSValue('pointer-events', 'auto');
      const pointerEventsNone = validateCSSValue('pointer-events', 'none');
      const pointerEventsAll = validateCSSValue('pointer-events', 'all');
      
      expect(pointerEventsAuto.valid).toBe(true);
      expect(pointerEventsNone.valid).toBe(true);
      expect(pointerEventsAll.valid).toBe(false);
      
      // Test mask-clip validation
      const maskClipBorder = validateCSSValue('mask-clip', 'border-box');
      const maskClipPadding = validateCSSValue('mask-clip', 'padding-box');
      
      expect(maskClipBorder.valid).toBe(true);
      expect(maskClipPadding.valid).toBe(false);
      
      // Test all property validation
      const allInitial = validateCSSValue('all', 'initial');
      const allInherit = validateCSSValue('all', 'inherit');
      
      expect(allInitial.valid).toBe(true);
      expect(allInherit.valid).toBe(false);
    });
  });
});

// Export removed - Jest handles test execution directly