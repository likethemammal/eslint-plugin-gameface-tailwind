/**
 * Typography related Tailwind class mappings
 */

const { FONT_SIZES, FONT_WEIGHTS, BASIC_COLORS } = require('../css-properties');

const TYPOGRAPHY_MAPPINGS = {
  // Font smoothing
  'antialiased': { property: '-webkit-font-smoothing', value: 'antialiased' },
  'subpixel-antialiased': { property: '-webkit-font-smoothing', value: 'subpixel-antialiased' },

  // Word break
  'break-normal': { property: 'word-break', value: 'normal' },
  'break-words': { property: 'word-break', value: 'break-all' },
  'break-all': { property: 'word-break', value: 'break-all' },
  'truncate': { property: 'text-overflow', value: 'ellipsis' },

  // Text transform
  'uppercase': { property: 'text-transform', value: 'uppercase' },
  'lowercase': { property: 'text-transform', value: 'lowercase' },
  'capitalize': { property: 'text-transform', value: 'capitalize' },
  'normal-case': { property: 'text-transform', value: 'none' },

  // Line height
  'leading-none': { property: 'line-height', value: '1' },
  'leading-tight': { property: 'line-height', value: '1.25' },
  'leading-snug': { property: 'line-height', value: '1.375' },
  'leading-normal': { property: 'line-height', value: '1.5' },
  'leading-relaxed': { property: 'line-height', value: '1.625' },
  'leading-loose': { property: 'line-height', value: '2' },
  'leading-3': { property: 'line-height', value: '.75rem' },
  'leading-4': { property: 'line-height', value: '1rem' },
  'leading-5': { property: 'line-height', value: '1.25rem' },
  'leading-6': { property: 'line-height', value: '1.5rem' },
  'leading-7': { property: 'line-height', value: '1.75rem' },
  'leading-8': { property: 'line-height', value: '2rem' },
  'leading-9': { property: 'line-height', value: '2.25rem' },
  'leading-10': { property: 'line-height', value: '2.5rem' },

  // Text decoration
  'underline': { property: 'text-decoration', value: 'underline' },
  'line-through': { property: 'text-decoration', value: 'line-through' },
  'no-underline': { property: 'text-decoration', value: 'none' },

  // Font weight
  'font-hairline': { property: 'font-weight', value: '100' },
  'font-thin': { property: 'font-weight', value: '100' },
  'font-light': { property: 'font-weight', value: '300' },
  'font-normal': { property: 'font-weight', value: '400' },
  'font-medium': { property: 'font-weight', value: '500' },
  'font-semibold': { property: 'font-weight', value: '600' },
  'font-bold': { property: 'font-weight', value: '700' },
  'font-extrabold': { property: 'font-weight', value: '800' },
  'font-black': { property: 'font-weight', value: '900' },

  // Font size
  'text-xs': { property: 'font-size', value: '0.75rem' },
  'text-sm': { property: 'font-size', value: '0.875rem' },
  'text-base': { property: 'font-size', value: '1rem' },
  'text-lg': { property: 'font-size', value: '1.125rem' },
  'text-xl': { property: 'font-size', value: '1.25rem' },
  'text-2xl': { property: 'font-size', value: '1.5rem' },
  'text-3xl': { property: 'font-size', value: '1.875rem' },
  'text-4xl': { property: 'font-size', value: '2.25rem' },
  'text-5xl': { property: 'font-size', value: '3rem' },
  'text-6xl': { property: 'font-size', value: '3.75rem' },
  'text-7xl': { property: 'font-size', value: '4.5rem' },
  'text-8xl': { property: 'font-size', value: '6rem' },
  'text-9xl': { property: 'font-size', value: '8rem' },

  // Font family
  'font-sans': { property: 'font-family', value: 'system-ui, -apple-system, sans-serif' },
  'font-serif': { property: 'font-family', value: 'Georgia, serif' },
  'font-mono': { property: 'font-family', value: 'Consolas, monospace' },

  // Text align
  'text-left': { property: 'text-align', value: 'left' },
  'text-center': { property: 'text-align', value: 'center' },
  'text-right': { property: 'text-align', value: 'right' },
  'text-justify': { property: 'text-align', value: 'justify' },

  // Font style
  'italic': { property: 'font-style', value: 'italic' },
  'not-italic': { property: 'font-style', value: 'normal' },

  // White space
  'whitespace-normal': { property: 'white-space', value: 'normal' },
  'whitespace-nowrap': { property: 'white-space', value: 'nowrap' },
  'whitespace-pre': { property: 'white-space', value: 'pre' },
  'whitespace-pre-line': { property: 'white-space', value: 'pre-line' },
  'whitespace-pre-wrap': { property: 'white-space', value: 'pre-wrap' },

  // Letter spacing
  'tracking-tighter': { property: 'letter-spacing', value: '-0.05em' },
  'tracking-tight': { property: 'letter-spacing', value: '-0.025em' },
  'tracking-normal': { property: 'letter-spacing', value: '0' },
  'tracking-wide': { property: 'letter-spacing', value: '0.025em' },
  'tracking-wider': { property: 'letter-spacing', value: '0.05em' },
  'tracking-widest': { property: 'letter-spacing', value: '0.1em' }
};

/**
 * Parse font size value, returning mapped value or original
 */
function parseFontSize(size) {
  if (size === null) return null;
  if (size === undefined) return undefined;
  
  return FONT_SIZES[size] || size;
}

/**
 * Parse font weight value, returning mapped value or original
 */
function parseFontWeight(weight) {
  if (weight === null) return null;
  if (weight === undefined) return undefined;
  
  return FONT_WEIGHTS[weight] || weight;
}

/**
 * Parse color value, returning mapped value or original
 */
function parseColorValue(color) {
  if (color === null) return null;
  if (color === undefined) return undefined;
  if (typeof color !== 'string') return color;
  
  // If it's a complex color value (has variants like red-500), return as-is
  if (color.includes('-') || color.includes('.')) {
    return color;
  }
  
  // Only map simple base colors
  return BASIC_COLORS[color] || color;
}

module.exports = {
  TYPOGRAPHY_MAPPINGS,
  parseFontSize,
  parseFontWeight,
  parseColorValue
};