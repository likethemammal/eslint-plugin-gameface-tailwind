/**
 * CSS parsing utilities for inline styles
 */

const {
  validateCSSPropertyValue, 
  getPropertySupport 
} = require('../../constants/validation-rules');

function camelToKebabCase(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function parseInlineCSS(cssText) {
  if (!cssText || typeof cssText !== 'string') {
    return {};
  }

  const styles = {};
  const declarations = cssText.split(';');

  declarations.forEach(declaration => {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex === -1) return;

    const property = declaration.substring(0, colonIndex).trim();
    const value = declaration.substring(colonIndex + 1).trim();

    if (property && value) {
      styles[property] = value;
    }
  });

  return styles;
}

function validateCSSProperty(property) {
  const kebabProperty = camelToKebabCase(property);
  
  // Check for grid-related properties explicitly
  if (kebabProperty.startsWith('grid') || kebabProperty.includes('grid')) {
    return { 
      valid: false, 
      reason: `CSS Grid properties are not supported in Gameface` 
    };
  }
  
  const propertySupport = getPropertySupport(kebabProperty);
  
  if (!propertySupport.supported) {
    return { 
      valid: false, 
      reason: `${kebabProperty} is not supported in Gameface`,
      note: propertySupport.note
    };
  }
  
  return { 
    valid: true, 
    note: propertySupport.note 
  };
}

function validateCSSValue(property, value) {
  const kebabProperty = camelToKebabCase(property);

  // Special case for background-image GIF detection - check before other validation
  if (kebabProperty === 'background-image' && value && value.includes('url(') && value.includes('.gif')) {
    return { valid: false, reason: 'gif_not_supported' };
  }

  // Check for calc() with mixed units (not supported in Gameface)
  if (value && value.includes('calc(')) {
    const mixedUnitsPattern = /%.*(?:px|rem|em|vh|vw|pt|mm|cm|in)|(?:px|rem|em|vh|vw|pt|mm|cm|in).*%/;
    if (mixedUnitsPattern.test(value)) {
      return { valid: false, reason: 'calc_mixed_units_not_supported' };
    }
    // Also check if it's within @keyframes context (would need context from caller)
    // For now, we'll allow calc() outside of keyframes
  }

  // Validate transform function syntax
  if (kebabProperty === 'transform' && value) {
    const transformFunctionPattern = /^(translate|translateX|translateY|translateZ|translate3d|scale|scaleX|scaleY|scaleZ|scale3d|rotate|rotateX|rotateY|rotateZ|skew|skewX|skewY|matrix|matrix3d|perspective)\([^)]*\)(\s+(translate|translateX|translateY|translateZ|translate3d|scale|scaleX|scaleY|scaleZ|scale3d|rotate|rotateX|rotateY|rotateZ|skew|skewX|skewY|matrix|matrix3d|perspective)\([^)]*\))*$/;
    if (!transformFunctionPattern.test(value.trim()) && value !== 'none') {
      return { valid: false, reason: 'invalid_transform_function_syntax' };
    }
  }

  // Use the consolidated validation system
  const validationResult = validateCSSPropertyValue(kebabProperty, value);
  
  if (!validationResult.valid) {
    return {
      valid: false,
      reason: validationResult.reason || 'unsupported_value',
      note: validationResult.note
    };
  }

  return { 
    valid: true,
    note: validationResult.note 
  };
}

function detectGifUsage(cssText) {
  if (!cssText) return false;
  
  // Simple regex to detect .gif in URLs
  return /\.gif(\?|$|'|"|\))/i.test(cssText);
}

function detectUnsupportedUnits(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Check for unsupported font-size units (only px, em, rem, vw, vh, % are supported)
  const fontSizeUnitRegex = /(pt|pc|in|cm|mm)/;
  return fontSizeUnitRegex.test(value);
}

function extractUrlFromCSSValue(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  // Extract URL from url() function
  const urlMatch = value.match(/url\(['"]?([^'"]+)['"]?\)/);
  return urlMatch ? urlMatch[1].trim() : null;
}

function detectCSSVariables(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  // Detect CSS variables (custom properties)
  return /var\(--[^)]+\)/.test(value);
}

function validateCSSSelector(selector) {
  if (!selector || typeof selector !== 'string') {
    return { valid: false, reason: 'Invalid selector' };
  }
  
  const trimmedSelector = selector.trim();
  
  // Check for incomplete combinators first
  if (/[+~>]\s*$/.test(trimmedSelector) || /^\s*[+~>]/.test(trimmedSelector)) {
    return { valid: false, reason: 'Incomplete combinator in selector' };
  }
  
  // Check for complex selectors that require EnableComplexCSSSelectorsStyling
  // First remove attribute selectors and pseudo-classes with parentheses to avoid false positives
  let cleanSelector = trimmedSelector.replace(/\[[^\]]*\]/g, ''); // Remove [attr="value"]
  cleanSelector = cleanSelector.replace(/:[a-zA-Z-]+\([^)]*\)/g, ''); // Remove :pseudo-class(args)
  
  // Check for combinators
  const hasCombinators = /[+~>]/.test(cleanSelector);
  const hasDescendantCombinator = /\s+[.#]?[\w-]/.test(cleanSelector);
  
  if (hasCombinators || hasDescendantCombinator) {
    return { 
      valid: false, 
      reason: 'Complex selectors require EnableComplexCSSSelectorsStyling = true',
      conditional: true 
    };
  }
  
  // Check for unsupported pseudo-classes
  const unsupportedPseudoClasses = /:(?:checked|disabled|enabled|invalid|valid|required|optional|read-only|read-write|in-range|out-of-range|indeterminate|first-of-type|last-of-type|nth-last-child|nth-last-of-type|nth-of-type|only-of-type|empty|link|visited|any-link|not|matches|lang|dir|host|target|scope|unknown)/;
  if (unsupportedPseudoClasses.test(trimmedSelector)) {
    return { valid: false, reason: 'Unsupported pseudo-class in selector' };
  }
  
  // Check for unsupported pseudo-elements
  const unsupportedPseudoElements = /::(?:first-letter|first-line|cue|slotted)/;
  if (unsupportedPseudoElements.test(trimmedSelector)) {
    return { valid: false, reason: 'Unsupported pseudo-element in selector' };
  }
  
  // Check for basic malformed selectors
  if (/^[0-9]/.test(trimmedSelector.replace(/^[.#]/, ''))) {
    return { valid: false, reason: 'Selector cannot start with a number' };
  }
  
  // Check for multiple pseudo-elements
  if ((trimmedSelector.match(/::/g) || []).length > 1) {
    return { valid: false, reason: 'Multiple pseudo-elements not allowed' };
  }
  
  // Check for unclosed attribute selector
  if (/\[[^\]]*$/.test(trimmedSelector)) {
    return { valid: false, reason: 'Unclosed attribute selector' };
  }
  
  // Basic selector validation - should be valid
  return { valid: true };
}

function validatePseudoElement(pseudoElement) {
  if (!pseudoElement || typeof pseudoElement !== 'string') {
    return { valid: false, reason: 'Invalid pseudo-element' };
  }
  
  const supported = ['::before', '::after', '::selection'];
  const unsupported = ['::first-letter', '::first-line', '::cue', '::slotted'];
  
  if (supported.some(pe => pseudoElement.includes(pe))) {
    if (pseudoElement.includes('::selection')) {
      return { 
        valid: true, 
        note: 'Only color and background-color properties supported for ::selection' 
      };
    }
    return { valid: true };
  }
  
  if (unsupported.some(pe => pseudoElement.includes(pe))) {
    return { valid: false, reason: 'Unsupported pseudo-element' };
  }
  
  return { valid: false, reason: 'Unknown pseudo-element' };
}

module.exports = {
  parseInlineCSS,
  validateCSSProperty,
  validateCSSValue,
  detectGifUsage,
  detectUnsupportedUnits,
  extractUrlFromCSSValue,
  detectCSSVariables,
  validateCSSSelector,
  validatePseudoElement
};
