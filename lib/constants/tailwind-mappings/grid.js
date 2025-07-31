/**
 * Grid layout mappings for Tailwind CSS classes
 * Note: Grid is not supported in Gameface, but these mappings are needed
 * for proper class parsing and validation error reporting
 */

const { SPACING_VALUES } = require('../css-properties');

const GRID_MAPPINGS = {
  // Grid display
  'grid': { property: 'display', value: 'grid' },
  
  // Grid template columns - fixed values
  'grid-cols-1': { property: 'grid-template-columns', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-cols-2': { property: 'grid-template-columns', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-cols-3': { property: 'grid-template-columns', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-cols-4': { property: 'grid-template-columns', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-cols-5': { property: 'grid-template-columns', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-cols-6': { property: 'grid-template-columns', value: 'repeat(6, minmax(0, 1fr))' },
  'grid-cols-7': { property: 'grid-template-columns', value: 'repeat(7, minmax(0, 1fr))' },
  'grid-cols-8': { property: 'grid-template-columns', value: 'repeat(8, minmax(0, 1fr))' },
  'grid-cols-9': { property: 'grid-template-columns', value: 'repeat(9, minmax(0, 1fr))' },
  'grid-cols-10': { property: 'grid-template-columns', value: 'repeat(10, minmax(0, 1fr))' },
  'grid-cols-11': { property: 'grid-template-columns', value: 'repeat(11, minmax(0, 1fr))' },
  'grid-cols-12': { property: 'grid-template-columns', value: 'repeat(12, minmax(0, 1fr))' },

  // Grid template rows - fixed values
  'grid-rows-1': { property: 'grid-template-rows', value: 'repeat(1, minmax(0, 1fr))' },
  'grid-rows-2': { property: 'grid-template-rows', value: 'repeat(2, minmax(0, 1fr))' },
  'grid-rows-3': { property: 'grid-template-rows', value: 'repeat(3, minmax(0, 1fr))' },
  'grid-rows-4': { property: 'grid-template-rows', value: 'repeat(4, minmax(0, 1fr))' },
  'grid-rows-5': { property: 'grid-template-rows', value: 'repeat(5, minmax(0, 1fr))' },
  'grid-rows-6': { property: 'grid-template-rows', value: 'repeat(6, minmax(0, 1fr))' },

  // Grid column span
  'col-span-1': { property: 'grid-column', value: 'span 1 / span 1' },
  'col-span-2': { property: 'grid-column', value: 'span 2 / span 2' },
  'col-span-3': { property: 'grid-column', value: 'span 3 / span 3' },
  'col-span-4': { property: 'grid-column', value: 'span 4 / span 4' },
  'col-span-5': { property: 'grid-column', value: 'span 5 / span 5' },
  'col-span-6': { property: 'grid-column', value: 'span 6 / span 6' },
  'col-span-7': { property: 'grid-column', value: 'span 7 / span 7' },
  'col-span-8': { property: 'grid-column', value: 'span 8 / span 8' },
  'col-span-9': { property: 'grid-column', value: 'span 9 / span 9' },
  'col-span-10': { property: 'grid-column', value: 'span 10 / span 10' },
  'col-span-11': { property: 'grid-column', value: 'span 11 / span 11' },  
  'col-span-12': { property: 'grid-column', value: 'span 12 / span 12' },
  'col-span-full': { property: 'grid-column', value: '1 / -1' },

  // Grid row span
  'row-span-1': { property: 'grid-row', value: 'span 1 / span 1' },
  'row-span-2': { property: 'grid-row', value: 'span 2 / span 2' },
  'row-span-3': { property: 'grid-row', value: 'span 3 / span 3' },
  'row-span-4': { property: 'grid-row', value: 'span 4 / span 4' },
  'row-span-5': { property: 'grid-row', value: 'span 5 / span 5' },
  'row-span-6': { property: 'grid-row', value: 'span 6 / span 6' },
  'row-span-full': { property: 'grid-row', value: '1 / -1' },

  // Grid gap
  'gap-0': { property: 'gap', value: '0px' },
  'gap-1': { property: 'gap', value: '0.25rem' },
  'gap-2': { property: 'gap', value: '0.5rem' },
  'gap-3': { property: 'gap', value: '0.75rem' },
  'gap-4': { property: 'gap', value: '1rem' },
  'gap-5': { property: 'gap', value: '1.25rem' },
  'gap-6': { property: 'gap', value: '1.5rem' },
  'gap-8': { property: 'gap', value: '2rem' },
  'gap-10': { property: 'gap', value: '2.5rem' },
  'gap-12': { property: 'gap', value: '3rem' },

  // Grid column gap
  'gap-x-0': { property: 'column-gap', value: '0px' },
  'gap-x-1': { property: 'column-gap', value: '0.25rem' },
  'gap-x-2': { property: 'column-gap', value: '0.5rem' },
  'gap-x-3': { property: 'column-gap', value: '0.75rem' },
  'gap-x-4': { property: 'column-gap', value: '1rem' },
  'gap-x-5': { property: 'column-gap', value: '1.25rem' },
  'gap-x-6': { property: 'column-gap', value: '1.5rem' },
  'gap-x-8': { property: 'column-gap', value: '2rem' },

  // Grid row gap
  'gap-y-0': { property: 'row-gap', value: '0px' },
  'gap-y-1': { property: 'row-gap', value: '0.25rem' },
  'gap-y-2': { property: 'row-gap', value: '0.5rem' },
  'gap-y-3': { property: 'row-gap', value: '0.75rem' },
  'gap-y-4': { property: 'row-gap', value: '1rem' },
  'gap-y-5': { property: 'row-gap', value: '1.25rem' },
  'gap-y-6': { property: 'row-gap', value: '1.5rem' },
  'gap-y-8': { property: 'row-gap', value: '2rem' }
};

module.exports = {
  GRID_MAPPINGS
};