/**
 * Grid property parsing utilities for Tailwind classes
 */

const { GRID_MAPPINGS } = require('../../../constants/tailwind-mappings/grid');
const { SPACING_VALUES } = require('../../../constants/css-properties');

function getGridProperty(className) {
  // Check static mappings first
  if (GRID_MAPPINGS[className]) {
    return GRID_MAPPINGS[className];
  }

  // Dynamic grid columns pattern (grid-cols-[number])
  if (className.match(/^grid-cols-\d+$/)) {
    const cols = className.match(/\d+$/)[0];
    return { property: 'grid-template-columns', value: `repeat(${cols}, minmax(0, 1fr))` };
  }

  // Dynamic grid rows pattern (grid-rows-[number])  
  if (className.match(/^grid-rows-\d+$/)) {
    const rows = className.match(/\d+$/)[0];
    return { property: 'grid-template-rows', value: `repeat(${rows}, minmax(0, 1fr))` };
  }

  // Dynamic column span pattern (col-span-[number])
  if (className.match(/^col-span-\d+$/)) {
    const span = className.match(/\d+$/)[0];
    return { property: 'grid-column', value: `span ${span} / span ${span}` };
  }

  // Dynamic row span pattern (row-span-[number])
  if (className.match(/^row-span-\d+$/)) {
    const span = className.match(/\d+$/)[0];
    return { property: 'grid-row', value: `span ${span} / span ${span}` };
  }

  // Dynamic gap patterns
  if (className.match(/^gap-\d+$/)) {
    const value = className.match(/\d+$/)[0];
    return { property: 'gap', value: SPACING_VALUES[value] || `${value}px` };
  }

  if (className.match(/^gap-x-\d+$/)) {
    const value = className.match(/\d+$/)[0];
    return { property: 'column-gap', value: SPACING_VALUES[value] || `${value}px` };
  }

  if (className.match(/^gap-y-\d+$/)) {
    const value = className.match(/\d+$/)[0];
    return { property: 'row-gap', value: SPACING_VALUES[value] || `${value}px` };
  }

  return null;
}

module.exports = {
  getGridProperty
};