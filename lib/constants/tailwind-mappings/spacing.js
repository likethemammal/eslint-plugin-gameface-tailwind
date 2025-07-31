/**
 * Spacing related Tailwind class mappings (margin, padding, positioning)
 */

const { SPACING_VALUES } = require('../css-properties');

const SPACING_MAPPINGS = {
  // Position
  'static': { property: 'position', value: 'static' },
  'fixed': { property: 'position', value: 'fixed' },
  'absolute': { property: 'position', value: 'absolute' },
  'relative': { property: 'position', value: 'relative' },
  'sticky': { property: 'position', value: 'sticky' },

  // Float
  'float-right': { property: 'float', value: 'right' },
  'float-left': { property: 'float', value: 'left' },
  'float-none': { property: 'float', value: 'none' },

  // Clear
  'clear-left': { property: 'clear', value: 'left' },
  'clear-right': { property: 'clear', value: 'right' },
  'clear-both': { property: 'clear', value: 'both' },
  'clear-none': { property: 'clear', value: 'none' },

  // Container
  'container': { property: 'max-width', value: '100%' }
};

// Dynamic spacing class generators
const SPACING_PREFIXES = {
  'w-': 'width',
  'h-': 'height',
  'min-w-': 'min-width',
  'min-h-': 'min-height',
  'max-w-': 'max-width',
  'max-h-': 'max-height',
  'm-': 'margin',
  'mt-': 'margin-top',
  'mr-': 'margin-right',
  'mb-': 'margin-bottom',
  'ml-': 'margin-left',
  'mx-': ['margin-left', 'margin-right'],
  'my-': ['margin-top', 'margin-bottom'],
  'p-': 'padding',
  'pt-': 'padding-top',
  'pr-': 'padding-right',
  'pb-': 'padding-bottom',
  'pl-': 'padding-left',
  'px-': ['padding-left', 'padding-right'],
  'py-': ['padding-top', 'padding-bottom'],
  'top-': 'top',
  'right-': 'right',
  'bottom-': 'bottom',
  'left-': 'left',
  'inset-x-': ['left', 'right'],
  'inset-y-': ['top', 'bottom'],
  'inset-': ['top', 'right', 'bottom', 'left']
};

module.exports = {
  SPACING_MAPPINGS,
  SPACING_PREFIXES
};