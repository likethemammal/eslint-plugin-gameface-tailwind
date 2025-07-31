/**
 * Flexbox related Tailwind class mappings
 */

const FLEXBOX_MAPPINGS = {
  // Flexbox Direction
  'flex-row': { property: 'flex-direction', value: 'row' },
  'flex-row-reverse': { property: 'flex-direction', value: 'row-reverse' },
  'flex-col': { property: 'flex-direction', value: 'column' },
  'flex-col-reverse': { property: 'flex-direction', value: 'column-reverse' },

  // Flexbox Wrap
  'flex-wrap': { property: 'flex-wrap', value: 'wrap' },
  'flex-wrap-reverse': { property: 'flex-wrap', value: 'wrap-reverse' },
  'flex-nowrap': { property: 'flex-wrap', value: 'nowrap' },

  // Flex
  'flex-1': { property: 'flex', value: '1 1 0%' },
  'flex-auto': { property: 'flex', value: '1 1 auto' },
  'flex-initial': { property: 'flex', value: '0 1 auto' },
  'flex-none': { property: 'flex', value: 'none' },

  // Flex Grow
  'flex-grow-0': { property: 'flex-grow', value: '0' },
  'flex-grow': { property: 'flex-grow', value: '1' },

  // Flex Shrink
  'flex-shrink-0': { property: 'flex-shrink', value: '0' },
  'flex-shrink': { property: 'flex-shrink', value: '1' },

  // Order
  'order-1': { property: 'order', value: '1' },
  'order-2': { property: 'order', value: '2' },
  'order-3': { property: 'order', value: '3' },
  'order-4': { property: 'order', value: '4' },
  'order-5': { property: 'order', value: '5' },
  'order-6': { property: 'order', value: '6' },
  'order-7': { property: 'order', value: '7' },
  'order-8': { property: 'order', value: '8' },
  'order-9': { property: 'order', value: '9' },
  'order-10': { property: 'order', value: '10' },
  'order-11': { property: 'order', value: '11' },
  'order-12': { property: 'order', value: '12' },
  'order-first': { property: 'order', value: '-9999' },
  'order-last': { property: 'order', value: '9999' },
  'order-none': { property: 'order', value: '0' },

  // Justify Content
  'justify-start': { property: 'justify-content', value: 'flex-start' },
  'justify-end': { property: 'justify-content', value: 'flex-end' },
  'justify-center': { property: 'justify-content', value: 'center' },
  'justify-between': { property: 'justify-content', value: 'space-between' },
  'justify-around': { property: 'justify-content', value: 'space-around' },
  'justify-evenly': { property: 'justify-content', value: 'space-evenly' },

  // Align Items
  'items-start': { property: 'align-items', value: 'flex-start' },
  'items-end': { property: 'align-items', value: 'flex-end' },
  'items-center': { property: 'align-items', value: 'center' },
  'items-baseline': { property: 'align-items', value: 'baseline' },
  'items-stretch': { property: 'align-items', value: 'stretch' },

  // Align Content
  'content-center': { property: 'align-content', value: 'center' },
  'content-start': { property: 'align-content', value: 'flex-start' },
  'content-end': { property: 'align-content', value: 'flex-end' },
  'content-between': { property: 'align-content', value: 'space-between' },
  'content-around': { property: 'align-content', value: 'space-around' },
  'content-evenly': { property: 'align-content', value: 'space-evenly' },

  // Align Self
  'self-auto': { property: 'align-self', value: 'auto' },
  'self-start': { property: 'align-self', value: 'flex-start' },
  'self-end': { property: 'align-self', value: 'flex-end' },
  'self-center': { property: 'align-self', value: 'center' },
  'self-stretch': { property: 'align-self', value: 'stretch' },
  'self-baseline': { property: 'align-self', value: 'baseline' }
};

module.exports = {
  FLEXBOX_MAPPINGS
};