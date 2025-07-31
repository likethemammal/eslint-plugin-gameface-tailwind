/**
 * Consolidated validation rules for Gameface/Coherent UI
 * Combines property-level support, value-level validation, and Tailwind-specific rules
 * into a single, consistent system
 */

// Status constants for better performance and maintainability
const SUPPORT_STATUS = {
  YES: 'YES',
  NO: 'NO',
  PARTIAL: 'PARTIAL',
  CONDITIONAL: 'CONDITIONAL'
};

// Consolidated validation rules that combine all three systems
const VALIDATION_RULES = {
  // Display properties
  'display': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['flex'],
    unsupportedValues: ['block', 'inline', 'inline-block', 'table', 'table-cell', 'table-row', 'grid', 'inline-grid'],
    reason: (value) => value === 'grid' ? 'CSS Grid is not supported by Gameface' : `Display value "${value}" is not supported by Gameface. Only "flex" is fully supported.`
  },

  // Position properties
  'position': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['relative', 'absolute', 'fixed'],
    unsupportedValues: ['sticky', 'static'],
    reason: (value) => value === 'sticky' ? 'Position "sticky" is not supported by Gameface. Use "relative", "absolute", or "fixed" instead.' : `Position value "${value}" is not supported by Gameface.`
  },

  // Border style properties
  'border-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid', 'none', 'hidden'],
    unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    reason: (value) => `Border style "${value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.`
  },
  'border-top-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid', 'none', 'hidden'],
    unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    reason: (value) => `Border style "${value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.`
  },
  'border-right-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid', 'none', 'hidden'],
    unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    reason: (value) => `Border style "${value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.`
  },
  'border-bottom-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid', 'none', 'hidden'],
    unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    reason: (value) => `Border style "${value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.`
  },
  'border-left-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid', 'none', 'hidden'],
    unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    reason: (value) => `Border style "${value}" is not supported by Gameface. Only "solid", "none", and "hidden" are supported.`
  },

  // Background properties
  'background-repeat': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
    unsupportedValues: ['space'],
    reason: (value) => 'background-repeat: space is not supported by Gameface. It defaults back to "round".'
  },
  'background-attachment': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['scroll', 'fixed', 'local'],
    reason: () => 'background-attachment is not supported by Gameface.'
  },
  'background-clip': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['border-box', 'padding-box', 'content-box', 'text'],
    reason: () => 'background-clip is not supported by Gameface.'
  },
  'background-origin': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['padding-box', 'border-box', 'content-box'],
    reason: () => 'background-origin is not supported by Gameface.'
  },

  // Flexbox properties
  'justify-content': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    unsupportedValues: ['space-evenly', 'stretch'],
    reason: (value) => value === 'space-evenly' ? 'justify-content: space-evenly is not supported by Gameface.' : `justify-content: ${value} is not supported by Gameface.`
  },
  'align-items': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['stretch', 'flex-start', 'flex-end', 'center'],
    unsupportedValues: ['baseline'],
    reason: (value) => 'align-items: baseline is not supported by Gameface.'
  },
  'align-content': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['stretch', 'flex-start', 'flex-end', 'center'],
    unsupportedValues: ['space-between', 'space-around', 'space-evenly'],
    reason: (value) => `align-content: ${value} is not supported by Gameface.`
  },
  'align-self': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['auto', 'stretch', 'flex-start', 'flex-end', 'center'],
    unsupportedValues: ['baseline'],
    reason: (value) => 'align-self: baseline is not supported by Gameface.'
  },
  'flex-basis': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['auto'],
    unsupportedValues: ['content'],
    reason: (value) => 'flex-basis: content is not supported by Gameface.'
  },
  'flex-grow': {
    status: SUPPORT_STATUS.CONDITIONAL,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'flex-grow is supported only as part of the flex shorthand property in Gameface.'
  },
  'flex-shrink': {
    status: SUPPORT_STATUS.CONDITIONAL,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'flex-shrink is supported only as part of the flex shorthand property in Gameface.'
  },

  // Layout properties
  'max-width': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['none'],
    reason: (value) => 'max-width: none is not supported by Gameface.'
  },
  'max-height': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['none'],
    reason: (value) => 'max-height: none is not supported by Gameface.'
  },

  // Typography properties
  'text-decoration-style': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['solid'],
    unsupportedValues: ['dashed', 'dotted', 'double', 'wavy'],
    reason: (value) => `text-decoration-style: ${value} is not supported by Gameface. Only "solid" is supported.`
  },
  'font-family': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Font family is supported but fonts must be loaded first in Gameface. System fonts and web fonts require proper loading.',
    note: 'Fonts like Segoe UI, Roboto, and others must be preloaded before use in Gameface'
  },
  'white-space': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['normal', 'nowrap', 'pre', 'pre-wrap'],
    unsupportedValues: ['pre-line', 'break-spaces'],
    reason: (value) => value === 'pre-line' ? 'whitespace-pre-line is not supported in Gameface.' : `white-space: ${value} is not supported by Gameface.`
  },
  'visibility': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['visible', 'hidden'],
    unsupportedValues: ['collapse'],
    reason: (value) => 'visibility: collapse is not supported by Gameface.'
  },

  // Interaction properties
  'pointer-events': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['auto', 'none', 'inherit'],
    unsupportedValues: ['all', 'fill', 'stroke', 'painted', 'visible', 'visibleFill', 'visibleStroke', 'visiblePainted'],
    reason: (value) => `pointer-events: ${value} is not supported by Gameface.`
  },
  'user-select': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['all', 'text', 'auto', 'none'],
    reason: () => 'The user-select property is not supported by Gameface.'
  },

  // Mask properties
  'mask-repeat': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
    unsupportedValues: ['space'],
    reason: (value) => 'mask-repeat: space is not supported by Gameface.'
  },
  'mask-clip': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['border-box'],
    unsupportedValues: ['padding-box', 'content-box', 'margin-box', 'fill-box', 'stroke-box', 'view-box'],
    reason: (value) => `mask-clip: ${value} is not supported by Gameface. Only "border-box" is supported.`
  },
  'border-image-repeat': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['stretch', 'repeat', 'round'],
    unsupportedValues: ['space'],
    reason: (value) => 'border-image-repeat: space is not supported by Gameface.'
  },

  // Special property handling
  'all': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['initial'],
    unsupportedValues: ['inherit', 'unset', 'revert'],
    reason: (value) => `The "all" property value "${value}" is not supported by Gameface. Only "initial" is supported.`
  },

  // Gradient properties
  'background-image': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Background gradients are supported by Gameface including linear gradients and color stops.'
  },
  '--tw-gradient-from': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Gradient from color stops are supported by Gameface.'
  },
  '--tw-gradient-via': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Gradient via color stops are supported by Gameface.'
  },
  '--tw-gradient-to': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Gradient to color stops are supported by Gameface.'
  },

  // Shadow properties
  'box-shadow': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Box shadow is not supported by Gameface. CSS variables in box-shadow values cannot be resolved.',
    note: 'Gameface cannot resolve CSS variables like var(--tw-shadow) in box-shadow values'
  },

  // Completely unsupported properties
  'box-sizing': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['content-box'],
    reason: () => 'box-sizing: content-box is not supported by Gameface. The default box-sizing in Gameface is border-box.',
    note: 'The default box-sizing in Gameface is border-box.'
  },
  'border-collapse': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['collapse', 'separate'],
    reason: () => 'border-collapse is not supported by Gameface.'
  },
  'border-spacing': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'border-spacing is not supported by Gameface.'
  },
  'clear': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['left', 'right', 'both', 'none'],
    reason: () => 'Clear properties are not supported by Gameface.'
  },
  'direction': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['ltr', 'rtl'],
    reason: (value) => `Text direction value "${value}" is not supported by Gameface.`
  },
  'float': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['left', 'right', 'none'],
    reason: () => 'Float properties are not supported by Gameface.'
  },
  'font-variant': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['normal', 'small-caps'],
    reason: () => 'font-variant is not supported by Gameface.'
  },
  'list-style': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'List styles are not supported by Gameface.'
  },
  'list-style-type': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['disc', 'circle', 'square', 'decimal', 'none'],
    reason: () => 'List styles are not supported by Gameface.'
  },
  'list-style-position': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['inside', 'outside'],
    reason: () => 'List styles are not supported by Gameface.'
  },
  'list-style-image': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'List styles are not supported by Gameface.'
  },
  'object-fit': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['fill', 'contain', 'cover', 'none', 'scale-down'],
    reason: (value) => `object-fit value "${value}" is not supported by Gameface.`
  },
  'object-position': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'object-position is not supported by Gameface.'
  },
  'order': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'CSS order property is not supported by Gameface.'
  },
  'outline': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Outline properties are not supported by Gameface.'
  },
  'outline-color': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Outline properties are not supported by Gameface.'
  },
  'outline-style': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['none', 'solid', 'dashed', 'dotted', 'double'],
    reason: () => 'Outline properties are not supported by Gameface.'
  },
  'outline-width': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Outline properties are not supported by Gameface.'
  },
  'resize': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['none', 'both', 'horizontal', 'vertical'],
    reason: () => 'The resize property is not supported by Gameface.'
  },
  'table-layout': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['auto', 'fixed'],
    reason: () => 'Table-related properties are not supported by Gameface.'
  },
  'text-indent': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'text-indent is not supported by Gameface.'
  },
  'text-justify': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['auto', 'inter-word', 'inter-character', 'none'],
    reason: () => 'text-justify is not supported by Gameface.'
  },
  'vertical-align': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super'],
    reason: (value) => `vertical-align value "${value}" is not supported by Gameface.`
  },
  'word-break': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: [],
    unsupportedValues: ['normal', 'break-all', 'keep-all', 'break-word'],
    reason: (value) => `word-break value "${value}" is not supported by Gameface.`
  },
  'word-spacing': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'word-spacing is not supported by Gameface.'
  },
  'zoom': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'zoom is not supported by Gameface.'
  },
  'text-overflow': {
    status: SUPPORT_STATUS.PARTIAL,
    supportedValues: ['clip', 'ellipsis'],
    unsupportedValues: [],
    reason: (value) => `text-overflow: ${value} is not supported by Gameface.`
  },
  '-webkit-font-smoothing': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['antialiased', 'subpixel-antialiased'],
    reason: () => '-webkit-font-smoothing is not supported by Gameface.'
  },
  'appearance': {
    status: SUPPORT_STATUS.NO,
    supportedValues: [],
    unsupportedValues: ['none'],
    reason: () => 'The appearance property is not supported by Gameface.'
  },

  // Custom Gameface Properties
  'coh-rendering-option': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: ['invalid-value'],
    reason: () => 'Custom Gameface property for controlling element rendering options.'
  },
  'coh-composition-id': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for identifying composition elements.'
  },
  'coh-partitioned': {
    status: SUPPORT_STATUS.YES,
    supportedValues: ['on', 'off'],
    unsupportedValues: ['true', 'false', '1', '0', 'yes', 'no'],
    reason: () => 'Custom Gameface property for element partitioning.'
  },
  'coh-font-fit': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for font fitting behavior.'
  },
  'coh-font-fit-min-size': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: ['invalid'],
    reason: () => 'Custom Gameface property for minimum font fit size.'
  },
  'coh-font-fit-max-size': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for maximum font fit size.'
  },
  'coh-blend-mode': {
    status: SUPPORT_STATUS.YES,
    supportedValues: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for blend modes.'
  },
  'coh-backdrop-filter': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for backdrop filtering.'
  },
  'coh-transform-3d': {
    status: SUPPORT_STATUS.YES,
    supportedValues: ['true', 'false'],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for 3D transform support.'
  },
  'coh-gpu-rendering': {
    status: SUPPORT_STATUS.YES,
    supportedValues: ['true', 'false', 'auto'],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for GPU rendering control.'
  },
  'coh-layer-priority': {
    status: SUPPORT_STATUS.YES,
    supportedValues: [],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for layer priority.'
  },
  'coh-event-passthrough': {
    status: SUPPORT_STATUS.YES,
    supportedValues: ['true', 'false'],
    unsupportedValues: [],
    reason: () => 'Custom Gameface property for event passthrough behavior.'
  }
};

/**
 * Validate a CSS property and value against Gameface support
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @returns {Object} - Validation result with valid flag, reason, and additional info
 */
function validateCSSPropertyValue(property, value) {
  const rule = VALIDATION_RULES[property];
  
  if (!rule) {
    // Property not in our rules - assume supported
    return { valid: true };
  }

  // Handle completely unsupported properties
  if (rule.status === SUPPORT_STATUS.NO) {
    return {
      valid: false,
      reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
      note: rule.note
    };
  }

  // Handle conditionally supported properties
  if (rule.status === SUPPORT_STATUS.CONDITIONAL) {
    return {
      valid: false,
      reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
      note: rule.note
    };
  }

  // Handle partially supported properties with value validation
  if (rule.status === SUPPORT_STATUS.PARTIAL || rule.status === SUPPORT_STATUS.YES) {
    // Check if value is explicitly unsupported
    if (rule.unsupportedValues && rule.unsupportedValues.includes(value)) {
      return {
        valid: false,
        reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
        note: rule.note
      };
    }

    // If there's a supported values list, check if value is in it
    if (rule.supportedValues && rule.supportedValues.length > 0) {
      if (!rule.supportedValues.includes(value)) {
        return {
          valid: false,
          reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
          note: rule.note
        };
      }
    }
  }

  return { valid: true, note: rule.note };
}

/**
 * Check if a property is supported at all (regardless of value)
 * @param {string} property - CSS property name
 * @returns {Object} - Support information
 */
function getPropertySupport(property) {
  const rule = VALIDATION_RULES[property];
  
  if (!rule) {
    return { supported: true, status: SUPPORT_STATUS.YES };
  }

  return {
    supported: rule.status !== SUPPORT_STATUS.NO,
    status: rule.status,
    limitation: rule.limitation,
    note: rule.note
  };
}

module.exports = {
  VALIDATION_RULES,
  SUPPORT_STATUS,
  validateCSSPropertyValue,
  getPropertySupport
};