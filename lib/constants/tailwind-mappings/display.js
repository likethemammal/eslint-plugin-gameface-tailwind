/**
 * Display and visibility related Tailwind class mappings
 */

const DISPLAY_MAPPINGS = {
  // Display values
  'block': { property: 'display', value: 'block' },
  'inline-block': { property: 'display', value: 'inline-block' },
  'inline': { property: 'display', value: 'inline' },
  'flex': { property: 'display', value: 'flex' },
  'inline-flex': { property: 'display', value: 'inline-flex' },
  'table': { property: 'display', value: 'table' },
  'inline-table': { property: 'display', value: 'inline-table' },
  'table-caption': { property: 'display', value: 'table-caption' },
  'table-cell': { property: 'display', value: 'table-cell' },
  'table-column': { property: 'display', value: 'table-column' },
  'table-column-group': { property: 'display', value: 'table-column-group' },
  'table-footer-group': { property: 'display', value: 'table-footer-group' },
  'table-header-group': { property: 'display', value: 'table-header-group' },
  'table-row-group': { property: 'display', value: 'table-row-group' },
  'table-row': { property: 'display', value: 'table-row' },
  'flow-root': { property: 'display', value: 'flow-root' },
  'grid': { property: 'display', value: 'grid' },
  'inline-grid': { property: 'display', value: 'inline-grid' },
  'contents': { property: 'display', value: 'contents' },
  'list-item': { property: 'display', value: 'list-item' },
  'hidden': { property: 'display', value: 'none' },

  // Visibility
  'visible': { property: 'visibility', value: 'visible' },
  'invisible': { property: 'visibility', value: 'hidden' },
  'sr-only': { property: 'position', value: 'absolute' },
  'not-sr-only': { property: 'position', value: 'static' },

  // Overflow
  'overflow-auto': { property: 'overflow', value: 'auto' },
  'overflow-hidden': { property: 'overflow', value: 'hidden' },
  'overflow-visible': { property: 'overflow', value: 'visible' },
  'overflow-scroll': { property: 'overflow', value: 'scroll' },
  'overflow-x-auto': { property: 'overflow-x', value: 'auto' },
  'overflow-y-auto': { property: 'overflow-y', value: 'auto' },
  'overflow-x-hidden': { property: 'overflow-x', value: 'hidden' },
  'overflow-y-hidden': { property: 'overflow-y', value: 'hidden' },
  'overflow-x-visible': { property: 'overflow-x', value: 'visible' },
  'overflow-y-visible': { property: 'overflow-y', value: 'visible' },
  'overflow-x-scroll': { property: 'overflow-x', value: 'scroll' },
  'overflow-y-scroll': { property: 'overflow-y', value: 'scroll' },

  // Opacity
  'opacity-100': { property: 'opacity', value: '1' },
  'opacity-75': { property: 'opacity', value: '0.75' },
  'opacity-50': { property: 'opacity', value: '0.5' },
  'opacity-25': { property: 'opacity', value: '0.25' },
  'opacity-10': { property: 'opacity', value: '0.1' },
  'opacity-0': { property: 'opacity', value: '0' }
};

module.exports = {
  DISPLAY_MAPPINGS
};