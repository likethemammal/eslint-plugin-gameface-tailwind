/**
 * CSS parsing utilities for inline styles
 */

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

function validateCSSValue(property, value) {
  const validationRules = {
    'display': {
      supported: ['flex'],
      unsupported: ['block', 'inline', 'inline-block', 'table', 'table-cell', 'table-row', 'grid', 'inline-grid']
    },
    'position': {
      supported: ['relative', 'absolute', 'fixed'],
      unsupported: ['sticky']
    },
    'border-style': {
      supported: ['solid', 'none', 'hidden'],
      unsupported: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    'border-top-style': {
      supported: ['solid', 'none', 'hidden'],
      unsupported: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    'border-right-style': {
      supported: ['solid', 'none', 'hidden'],
      unsupported: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    'border-bottom-style': {
      supported: ['solid', 'none', 'hidden'],
      unsupported: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    'border-left-style': {
      supported: ['solid', 'none', 'hidden'],
      unsupported: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    'background-repeat': {
      supported: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
      unsupported: ['space']
    },
    'mask-repeat': {
      supported: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
      unsupported: ['space']
    },
    'border-image-repeat': {
      supported: ['stretch', 'repeat', 'round'],
      unsupported: ['space']
    },
    'justify-content': {
      supported: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
      unsupported: ['space-evenly', 'stretch']
    },
    'align-items': {
      supported: ['stretch', 'flex-start', 'flex-end', 'center'],
      unsupported: ['baseline']
    },
    'align-content': {
      supported: ['stretch', 'flex-start', 'flex-end', 'center'],
      unsupported: ['space-between', 'space-around', 'space-evenly']
    },
    'align-self': {
      supported: ['auto', 'stretch', 'flex-start', 'flex-end', 'center'],
      unsupported: ['baseline']
    },
    'flex-basis': {
      supported: ['auto'],
      unsupported: ['content']
    },
    'max-width': {
      supported: [],
      unsupported: ['none']
    },
    'max-height': {
      supported: [],
      unsupported: ['none']
    },
    'all': {
      supported: ['initial'],
      unsupported: ['inherit', 'unset', 'revert']
    },
    'mask-clip': {
      supported: ['border-box'],
      unsupported: ['padding-box', 'content-box', 'margin-box', 'fill-box', 'stroke-box', 'view-box']
    },
    'pointer-events': {
      supported: ['auto', 'none', 'inherit'],
      unsupported: ['all', 'fill', 'stroke', 'painted', 'visible', 'visibleFill', 'visibleStroke', 'visiblePainted']
    }
  };

  const rule = validationRules[property];
  if (!rule) {
    return { valid: true };
  }

  if (rule.unsupported.includes(value)) {
    return { valid: false, reason: 'unsupported_value' };
  }

  if (rule.supported.length > 0 && !rule.supported.includes(value)) {
    return { valid: false, reason: 'not_in_supported_list' };
  }

  return { valid: true };
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

  // Check for unsupported font-size units (only px, em, rem, vw, vh are supported)
  const fontSizeUnitRegex = /(pt|pc|in|cm|mm|%)/;
  return fontSizeUnitRegex.test(value);
}

function extractUrlFromCSSValue(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  // Extract URL from url() function
  const urlMatch = value.match(/url\(['"]?([^'"]+)['"]?\)/);
  return urlMatch ? urlMatch[1] : null;
}

module.exports = {
  parseInlineCSS,
  validateCSSValue,
  detectGifUsage,
  detectUnsupportedUnits,
  extractUrlFromCSSValue
};
