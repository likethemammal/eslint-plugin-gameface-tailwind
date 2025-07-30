/**
 * Tailwind CSS class parser and CSS property mapper
 */

function parseTailwindClasses(classString) {
  if (!classString || typeof classString !== 'string') {
    return [];
  }

  // Split on whitespace and filter out empty strings
  return classString.trim().split(/\s+/).filter(cls => cls.length > 0);
}

function getTailwindCSSProperty(className) {
  // Handle null, undefined, or empty input
  if (!className || typeof className !== 'string') {
    return null;
  }
  
  // Comprehensive mapping of Tailwind classes to CSS properties and values
  const tailwindMap = {
    // Display
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

    // Float
    'float-right': { property: 'float', value: 'right' },
    'float-left': { property: 'float', value: 'left' },
    'float-none': { property: 'float', value: 'none' },

    // Clear
    'clear-left': { property: 'clear', value: 'left' },
    'clear-right': { property: 'clear', value: 'right' },
    'clear-both': { property: 'clear', value: 'both' },
    'clear-none': { property: 'clear', value: 'none' },

    // Position
    'static': { property: 'position', value: 'static' },
    'fixed': { property: 'position', value: 'fixed' },
    'absolute': { property: 'position', value: 'absolute' },
    'relative': { property: 'position', value: 'relative' },
    'sticky': { property: 'position', value: 'sticky' },

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

    // Grid
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
    'self-baseline': { property: 'align-self', value: 'baseline' },

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
  };

  // Check for exact matches first
  if (tailwindMap[className]) {
    return tailwindMap[className];
  }

  // Check for dynamic classes with patterns

  // Mapping of class prefixes to respective style properties
  const propertyMap = {
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
    'p-': 'padding',
    'pt-': 'padding-top',
    'pr-': 'padding-right',
    'pb-': 'padding-bottom',
    'pl-': 'padding-left',
    'top-': 'top',
    'right-': 'right',
    'bottom-': 'bottom',
    'left-': 'left'
  };

  // Check for matching class prefix and return the corresponding style property and value
  for (const prefix in propertyMap) {
    if (className.startsWith(prefix)) {
      const property = propertyMap[prefix];
      const value = parseSpacingValue(className.substring(prefix.length));
      return { property, value };
    }
  }
  // Border width
  if (className.startsWith('border-') && !className.includes('color') && !className.includes('style')) {
    const value = className.substring(7);
    if (['t', 'r', 'b', 'l'].some(side => value.startsWith(side + '-'))) {
      const side = value[0];
      const width = parseSpacingValue(value.substring(2));
      return { property: `border-${getSideName(side)}-width`, value: width };
    } else {
      return { property: 'border-width', value: parseSpacingValue(value) };
    }
  }

  // Border style
  if (className.startsWith('border-') && ['solid', 'dashed', 'dotted', 'double', 'none'].some(style => className.includes(style))) {
    const style = className.substring(7);
    return { property: 'border-style', value: style };
  }

  // Border radius
  if (className.startsWith('rounded')) {
    if (className === 'rounded') {
      return { property: 'border-radius', value: '0.25rem' };
    }
    if (className.startsWith('rounded-')) {
      const value = className.substring(8);
      return { property: 'border-radius', value: parseSpacingValue(value) };
    }
  }

  // Text colors
  if (className.startsWith('text-') && !className.includes('size') && !className.includes('align')) {
    const colorValue = className.substring(5);
    return { property: 'color', value: parseColorValue(colorValue) };
  }

  // Background colors
  if (className.startsWith('bg-') && !className.includes('size') && !className.includes('position')) {
    const colorValue = className.substring(3);
    return { property: 'background-color', value: parseColorValue(colorValue) };
  }

  // Font size
  if (className.startsWith('text-') && ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].some(size => className.includes(size))) {
    return { property: 'font-size', value: parseFontSize(className.substring(5)) };
  }

  // Font weight
  if (className.startsWith('font-') && ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'].some(weight => className.includes(weight))) {
    return { property: 'font-weight', value: parseFontWeight(className.substring(5)) };
  }

  return null; // Unknown class
}

function parseSpacingValue(value) {
  const spacingMap = {
    '0': '0px',
    'px': '1px',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '2.5': '0.625rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
    '11': '2.75rem',
    '12': '3rem',
    '14': '3.5rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
    '32': '8rem',
    '36': '9rem',
    '40': '10rem',
    '44': '11rem',
    '48': '12rem',
    '52': '13rem',
    '56': '14rem',
    '60': '15rem',
    '64': '16rem',
    '72': '18rem',
    '80': '20rem',
    '96': '24rem',
    'auto': 'auto',
    'full': '100%',
    'screen': '100vh',
    'min': 'min-content',
    'max': 'max-content',
    'fit': 'fit-content'
  };

  return spacingMap[value] || value;
}

function parseColorValue(colorValue) {
  // This is a simplified color parser - in reality, Tailwind has hundreds of color combinations
  const basicColors = {
    'transparent': 'transparent',
    'current': 'currentColor',
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#10b981',
    'yellow': '#f59e0b',
    'purple': '#8b5cf6',
    'pink': '#ec4899',
    'gray': '#6b7280',
    'indigo': '#6366f1',
    'orange': '#f97316'
  };

  return basicColors[colorValue] || colorValue;
}

function parseFontSize(size) {
  const fontSizes = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem'
  };

  return fontSizes[size] || size;
}

function parseFontWeight(weight) {
  const fontWeights = {
    'thin': '100',
    'extralight': '200',
    'light': '300',
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
    'extrabold': '800',
    'black': '900'
  };

  return fontWeights[weight] || weight;
}

function getSideName(side) {
  const sideMap = {
    't': 'top',
    'r': 'right',
    'b': 'bottom',
    'l': 'left'
  };
  return sideMap[side] || side;
}

module.exports = {
  parseTailwindClasses,
  getTailwindCSSProperty
};
