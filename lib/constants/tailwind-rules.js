/**
 * Consolidated Tailwind CSS validation rules for Gameface/Coherent UI
 * Combines pattern-based, exact class, and property-based rules into a unified system
 */

const { ERROR_REASONS } = require('./error-messages');

// Pattern-based validation rules for Tailwind classes
const TAILWIND_PATTERN_RULES = {
  // Shadow classes - completely unsupported
  SHADOW: {
    pattern: /shadow/,
    supported: false,
    reason: ERROR_REASONS.shadow
  },

  // Background opacity classes 
  BACKGROUND_OPACITY: {
    pattern: /^bg-opacity-\d+$/,
    supported: false,
    reason: ERROR_REASONS.backgroundOpacity
  },

  // Background clip classes
  BACKGROUND_CLIP: {
    pattern: /^bg-clip-(border|content|padding|text)$/,
    supported: false,
    reason: ERROR_REASONS.backgroundClip
  },

  // Background attachment classes
  BACKGROUND_ATTACHMENT: {
    pattern: /^bg-(fixed|local|scroll)$/,
    supported: false,
    reason: ERROR_REASONS.backgroundAttachment
  },

  // Ring classes - use unsupported box-shadow
  RING: {
    pattern: /^ring-/,
    supported: false,
    reason: ERROR_REASONS.ring
  },

  // Overscroll behavior classes
  OVERSCROLL: {
    pattern: /^overscroll-/,
    supported: false,
    reason: ERROR_REASONS.overscroll
  },

  // Space utilities - use :not selector
  SPACE: {
    pattern: /space-/,
    supported: false,
    reason: ERROR_REASONS.notSelector
  },

  // Divide utilities - use :not selector
  DIVIDE: {
    pattern: /divide-/,
    supported: false,
    reason: ERROR_REASONS.notSelector
  },

  // SVG fill/stroke with currentColor
  SVG_CURRENT_COLOR: {
    pattern: /(fill|stroke).*current/,
    supported: false,
    reason: ERROR_REASONS.currentColor
  },

  // SVG styling
  SVG: {
    pattern: /svg/,
    supported: false,
    reason: ERROR_REASONS.svgStyling
  },

  // Responsive variants
  RESPONSIVE: {
    pattern: /^(sm|md|lg|xl|2xl):/,
    supported: false,
    reason: ERROR_REASONS.mediaQueries
  },

  // Pseudo-class variants
  PSEUDO_CLASSES: {
    pattern: /^(hover|focus|active|visited|disabled|first|last|odd|even|focus-within|group-hover):/,
    supported: false,
    reason: ERROR_REASONS.pseudoClasses
  },

  // Table classes
  TABLE: {
    pattern: /^table-/,
    supported: false,
    reason: ERROR_REASONS.tables
  },

  // List classes
  LIST: {
    pattern: /^list-/,
    supported: false,
    reason: ERROR_REASONS.lists
  },

  // Font variant numeric classes
  FONT_VARIANT_NUMERIC: {
    pattern: /^(lining-nums|normal-nums|oldstyle-nums|stacked-fractions)$/,
    supported: false,
    reason: ERROR_REASONS.fontVariantNumeric
  },

  // Font smoothing classes
  FONT_SMOOTHING: {
    pattern: /^(antialiased|subpixel-antialiased)$/,
    supported: false,
    reason: ERROR_REASONS.fontSmoothing
  },

  // Text opacity classes
  TEXT_OPACITY: {
    pattern: /^text-opacity-\d+$/,
    supported: false,
    reason: ERROR_REASONS.textOpacity
  },

  // Word break classes
  WORD_BREAK: {
    pattern: /^(break-normal|break-all)$/,
    supported: false,
    reason: ERROR_REASONS.wordBreak
  },

  // Cursor classes - special case (supported but needs C++ implementation)
  CURSOR: {
    pattern: /^cursor-(auto|default|move|pointer|text|wait|not-allowed)$/,
    supported: true,
    note: 'Has to be implemented from C++'
  },

  // Placeholder classes
  PLACEHOLDER: {
    pattern: /^placeholder-/,
    supported: false,
    reason: ERROR_REASONS.placeholders
  },

  // Resize classes
  RESIZE: {
    pattern: /^resize(-none|-y|-x)?$/,
    supported: false,
    reason: ERROR_REASONS.resize
  },

  // User select classes  
  USER_SELECT: {
    pattern: /^select-(none|text|all|auto)$/,
    supported: false,
    reason: ERROR_REASONS.userSelect
  },

  // Outline classes
  OUTLINE: {
    pattern: /^outline-/,
    supported: false,
    reason: 'No support for outline'
  },

  // Grid gap classes
  GAP: {
    pattern: /^gap(-[xy])?-/,
    supported: false,
    reason: ERROR_REASONS.grid
  }
};

// Exact class name rules for specific Tailwind classes
const TAILWIND_EXACT_CLASS_RULES = {
  // Box sizing
  'box-content': {
    supported: false,
    reason: 'box-sizing: content-box; not supported in cohtml',
    note: 'The default box-sizing in Gameface is border-box'
  },

  // Appearance
  'appearance-none': {
    supported: false,
    reason: ERROR_REASONS.appearance
  }
};

// Property-based validation rules (after CSS property parsing)
const TAILWIND_PROPERTY_RULES = {
  // Display rules
  DISPLAY_GRID: {
    property: 'display',
    value: 'grid',
    supported: false,
    reason: ERROR_REASONS.grid
  },

  DISPLAY_INLINE_VARIANTS: {
    property: 'display',
    values: ['inline', 'inline-block', 'inline-flex', 'inline-grid', 'flow-root', 'table', 'table-cell'],
    supported: false,
    reason: (value) => `No support for display: ${value}`
  },

  // Position rules
  POSITION_STICKY: {
    property: 'position',
    value: 'sticky',
    supported: false,
    reason: 'No support for position: sticky'
  },

  POSITION_STATIC: {
    property: 'position',
    value: 'static', 
    supported: false,
    reason: 'No support for position: static'
  },

  // Flexbox rules
  FLEX_GROW: {
    property: 'flex-grow',
    supported: false,
    reason: 'flex-grow supported only as part of flex shorthand'
  },

  FLEX_SHRINK: {
    property: 'flex-shrink',
    supported: false,
    reason: 'flex-shrink supported only as part of flex shorthand'
  },

  JUSTIFY_CONTENT_SPACE_EVENLY: {
    property: 'justify-content',
    value: 'space-evenly',
    supported: false,
    reason: 'No support for justify-evenly'
  },

  ALIGN_ITEMS_BASELINE: {
    property: 'align-items',
    value: 'baseline',
    supported: false,
    reason: 'No support for items-baseline class'
  },

  ALIGN_CONTENT_UNSUPPORTED: {
    property: 'align-content',
    values: ['space-around', 'space-evenly', 'baseline'],
    supported: false,
    reason: (value) => `No support for content-${value}`
  },

  ALIGN_SELF_BASELINE: {
    property: 'align-self',
    value: 'baseline',
    supported: false,
    reason: 'No support for self-baseline'
  },

  // Background rules
  BACKGROUND_ATTACHMENT_FIXED: {
    property: 'background-attachment',
    value: 'fixed',
    supported: false,
    reason: 'background-attachment: fixed not supported'
  },

  BACKGROUND_REPEAT_SPACE: {
    property: 'background-repeat',
    value: 'space',
    supported: false,
    reason: "No support for background-repeat: space; defaults back to 'round'"
  },

  // Border rules  
  BORDER_STYLE_DASHED: {
    property: 'border-style',
    value: 'dashed',
    supported: false,
    reason: 'No support for border-style: dashed;'
  },

  BORDER_STYLE_DOTTED: {
    property: 'border-style',
    value: 'dotted',
    supported: false,
    reason: 'No support for border-style: dotted;'
  },

  BORDER_STYLE_DOUBLE: {
    property: 'border-style',
    value: 'double',
    supported: false,
    reason: 'No support for border-style: double;'
  },

  // Text rules
  WHITE_SPACE_PRE_LINE: {
    property: 'white-space',
    value: 'pre-line',
    supported: false,
    reason: 'whitespace-pre-line is not supported in cohtml'
  },

  VISIBILITY_COLLAPSE: {
    property: 'visibility',
    value: 'collapse',
    supported: false,
    reason: 'visibility: collapse is not supported'
  },

  // Property-level unsupported (any value)
  WEBKIT_FONT_SMOOTHING: {
    property: '-webkit-font-smoothing',
    supported: false,
    reason: ERROR_REASONS.fontSmoothing
  },

  WORD_BREAK: {
    property: 'word-break',
    supported: false,
    reason: ERROR_REASONS.wordBreak
  },

  APPEARANCE: {
    property: 'appearance',
    supported: false,
    reason: ERROR_REASONS.appearance
  },

  OUTLINE: {
    property: 'outline',
    supported: false,
    reason: 'No support for outline'
  },

  USER_SELECT: {
    property: 'user-select',
    supported: false,
    reason: ERROR_REASONS.userSelect
  },

  FLOAT: {
    property: 'float',
    supported: false,
    reason: 'Float properties not supported in Gameface'
  },

  CLEAR: {
    property: 'clear',
    supported: false,
    reason: 'Clear property not supported in Gameface'
  },

  ORDER: {
    property: 'order',
    supported: false,
    reason: ERROR_REASONS.order
  },

  // Special cursor case
  CURSOR_POINTER: {
    property: 'cursor',
    value: 'pointer',
    supported: true,
    note: 'Has to be implemented from C++'
  }
};

// Pattern-based rules for comprehensive class matching
const TAILWIND_COMPREHENSIVE_PATTERN_RULES = {
  // Color classes with numeric variants (CSS variable issues)
  BACKGROUND_COLOR_VARIANTS: {
    pattern: /^bg-(red|blue|green|yellow|purple|pink|indigo|gray|grey|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+$/,
    supported: false,
    reason: ERROR_REASONS.cssVariablesInColors
  },

  TEXT_COLOR_VARIANTS: {
    pattern: /^text-(red|blue|green|yellow|purple|pink|indigo|gray|grey|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+$/,
    supported: false,
    reason: 'Color variants with CSS variables are not supported'
  },

  BORDER_COLOR_VARIANTS: {
    pattern: /^border-(red|blue|green|yellow|purple|pink|indigo|gray|grey|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+$/,
    supported: false,
    reason: 'Border color variants with CSS variables are not supported'
  },

  // Basic color classes without numbers
  BASIC_BACKGROUND_COLORS: {
    pattern: /^bg-(black|white|current)$/,
    supported: false,
    reason: ERROR_REASONS.cssVariablesInColors
  },

  BASIC_TEXT_COLORS: {
    pattern: /^text-(black|white|current)$/,
    supported: false,
    reason: 'Basic color classes use CSS variables which are not supported'
  },

  BASIC_BORDER_COLORS: {
    pattern: /^border-(black|white|current)$/,
    supported: false,
    reason: 'Basic border color classes use CSS variables which are not supported'
  },

  // Auto margin classes
  AUTO_MARGIN_CLASSES: {
    pattern: /^(m|mx|my|mt|mr|mb|ml)-auto$/,
    supported: false,
    reason: ERROR_REASONS.autoMargins
  },

  // Cursor classes with special handling
  CURSOR_NOT_ALLOWED: {
    pattern: /^cursor-not-allowed$/,
    supported: false,
    reason: 'Cursor styles require C++ implementation beyond basic pointer support'
  },

  // Additional display classes
  INLINE_FLEX_DISPLAY: {
    pattern: /^inline-flex$/,
    supported: false,
    reason: 'No support for display: inline-flex'
  },

  FLOW_ROOT_DISPLAY: {
    pattern: /^flow-root$/,
    supported: false,
    reason: 'No support for display: flow-root'
  },

  TABLE_DISPLAY: {
    pattern: /^table$/,
    supported: false,
    reason: 'No support for display: table'
  },

};

// Specific class-property combinations with special handling
const TAILWIND_SPECIAL_CLASS_RULES = {
  'bg-black': {
    property: 'background-color',
    supported: false,
    reason: ERROR_REASONS.cssVariablesInColors
  },

  'text-red-500': {
    property: 'color',
    supported: false,
    reason: 'Not supported for the same reason as the background-color'
  },

  'border-blue-200': {
    property: 'border-color',
    supported: false,
    reason: 'Uses a CSS variable in the border-color shorthand expression which is not supported'
  }
};

// Rules for handling array properties (like mx-auto that maps to multiple margin properties)
const TAILWIND_ARRAY_PROPERTY_RULES = {
  AUTO_MARGINS: {
    condition: (prop) => prop.value === 'auto' && prop.property.startsWith('margin'),
    supported: false,
    reason: ERROR_REASONS.autoMargins
  },

  UNKNOWN_VALUES: {
    condition: (prop) => prop.value && prop.value !== 'auto' && 
                        prop.value.includes('-') && 
                        !prop.value.match(/^\d+(\.\d+)?(rem|px|em|%)?$/),
    supported: false,
    reason: ERROR_REASONS.unknownClass
  }
};

// Grid-specific rules
const TAILWIND_GRID_RULES = {
  GRID_PROPERTIES: {
    condition: (property) => property && property.includes('grid'),
    supported: false,
    reason: ERROR_REASONS.grid
  },

  ORDER_CLASSES: {
    condition: (className) => className && className.match(/^order-/),
    supported: false,
    reason: ERROR_REASONS.order
  }
};

/**
 * Check if a Tailwind class matches any pattern-based rules
 * @param {string} className - The Tailwind class name
 * @returns {Object|null} - Rule match result or null
 */
function checkPatternRules(className) {
  for (const [ruleKey, rule] of Object.entries(TAILWIND_PATTERN_RULES)) {
    if (rule.pattern.test(className)) {
      return {
        type: 'pattern',
        rule: ruleKey,
        supported: rule.supported,
        reason: rule.reason,
        note: rule.note
      };
    }
  }
  return null;
}

/**
 * Check if a Tailwind class matches any exact class rules
 * @param {string} className - The Tailwind class name
 * @returns {Object|null} - Rule match result or null
 */
function checkExactClassRules(className) {
  const rule = TAILWIND_EXACT_CLASS_RULES[className];
  if (rule) {
    return {
      type: 'exact',
      supported: rule.supported,
      reason: rule.reason,
      note: rule.note
    };
  }
  return null;
}

/**
 * Check if a parsed CSS property matches any property-based rules
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @param {string} className - Original Tailwind class name
 * @returns {Object|null} - Rule match result or null
 */
function checkPropertyRules(property, value, className) {
  for (const [ruleKey, rule] of Object.entries(TAILWIND_PROPERTY_RULES)) {
    if (rule.property === property) {
      // Check single value match
      if (rule.value && rule.value === value) {
        return {
          type: 'property',
          rule: ruleKey,
          supported: rule.supported,
          reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
          note: rule.note
        };
      }
      
      // Check multiple values match
      if (rule.values && rule.values.includes(value)) {
        return {
          type: 'property',
          rule: ruleKey,
          supported: rule.supported,
          reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
          note: rule.note
        };
      }
      
      // Check property-level rules (any value unsupported)
      if (!rule.value && !rule.values) {
        return {
          type: 'property',
          rule: ruleKey,
          supported: rule.supported,
          reason: typeof rule.reason === 'function' ? rule.reason(value) : rule.reason,
          note: rule.note
        };
      }
    }
  }
  return null;
}

module.exports = {
  TAILWIND_PATTERN_RULES,
  TAILWIND_COMPREHENSIVE_PATTERN_RULES,
  TAILWIND_EXACT_CLASS_RULES,
  TAILWIND_PROPERTY_RULES,
  TAILWIND_SPECIAL_CLASS_RULES,
  TAILWIND_ARRAY_PROPERTY_RULES,
  TAILWIND_GRID_RULES,
  checkPatternRules,
  checkExactClassRules,
  checkPropertyRules
};