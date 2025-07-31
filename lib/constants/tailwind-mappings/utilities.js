/**
 * Utility related Tailwind class mappings (cursor, pointer-events, etc.)
 */

const UTILITIES_MAPPINGS = {
  // Cursor
  'cursor-auto': { property: 'cursor', value: 'auto' },
  'cursor-default': { property: 'cursor', value: 'default' },
  'cursor-move': { property: 'cursor', value: 'move' },
  'cursor-pointer': { property: 'cursor', value: 'pointer' },
  'cursor-text': { property: 'cursor', value: 'text' },
  'cursor-wait': { property: 'cursor', value: 'wait' },
  'cursor-not-allowed': { property: 'cursor', value: 'not-allowed' },

  // Appearance
  'appearance-none': { property: 'appearance', value: 'none' },

  // Outline
  'outline-none': { property: 'outline', value: 'none' },

  // Pointer events
  'pointer-events-none': { property: 'pointer-events', value: 'none' },
  'pointer-events-auto': { property: 'pointer-events', value: 'auto' },

  // Resize
  'resize': { property: 'resize', value: 'both' },
  'resize-none': { property: 'resize', value: 'none' },
  'resize-y': { property: 'resize', value: 'vertical' },
  'resize-x': { property: 'resize', value: 'horizontal' },

  // User select
  'select-none': { property: 'user-select', value: 'none' },
  'select-text': { property: 'user-select', value: 'text' },
  'select-all': { property: 'user-select', value: 'all' },
  'select-auto': { property: 'user-select', value: 'auto' },

  // SVG stroke width
  'stroke-2': { property: 'stroke-width', value: '2' }
};

module.exports = {
  UTILITIES_MAPPINGS
};