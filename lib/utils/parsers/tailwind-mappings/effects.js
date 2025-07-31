const {
  EFFECTS_MAPPINGS,
} = require('../../../constants/tailwind-mappings/effects')

const { BASIC_COLORS, SPACING_VALUES } = require('../../../constants/css-properties');

function getEffectsProperty(className) {
  // Check static mappings first
  if (EFFECTS_MAPPINGS[className]) {
    return EFFECTS_MAPPINGS[className];
  }

  // Handle border color patterns (border-red-500, border-blue-200, etc.)
  if (className.startsWith('border-') && !className.includes('style')) {
    const value = className.substring(7);
    
    // Check if it's a color pattern (contains color names or numbers)
    const isColorPattern = BASIC_COLORS[value] ||
                          value.match(/^(red|blue|green|yellow|purple|pink|indigo|gray|grey)-\d+$/) ||
                          value.match(/^(slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+$/);
    
    if (isColorPattern) {
      return { property: 'border-color', value: BASIC_COLORS[value] || value };
    }
    
    // Handle directional borders (border-t, border-r, border-b, border-l)
    if (['t', 'r', 'b', 'l'].includes(value)) {
      const sideMap = { 't': 'top', 'r': 'right', 'b': 'bottom', 'l': 'left' };
      return { property: `border-${sideMap[value]}-width`, value: '1px' };
    }
    
    // Handle directional border widths (border-t-2, border-r-4, etc.)
    if (['t', 'r', 'b', 'l'].some(side => value.startsWith(side + '-'))) {
      const side = value[0];
      const width = value.substring(2);
      const sideMap = { 't': 'top', 'r': 'right', 'b': 'bottom', 'l': 'left' };
      const spacingValues = { '0': '0px', '2': '2px', '4': '4px', '8': '8px' };
      
      return { property: `border-${sideMap[side]}-width`, value: spacingValues[width] || width };
    } else {
      // Check if it's a width value
      const spacingValues = { '0': '0px', '2': '2px', '4': '4px', '8': '8px' };
      if (spacingValues[value] || value.match(/^\d+$/)) {
        return { property: 'border-width', value: spacingValues[value] || value };
      }
    }
  }

  // Handle border radius
  if (className.startsWith('rounded')) {
    if (className === 'rounded') {
      return { property: 'border-radius', value: '0.25rem' };
    }
    if (className.startsWith('rounded-')) {
      const value = className.substring(8);
      const radiusValues = { 'sm': '0.125rem', 'md': '0.375rem', 'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px' };
      return { property: 'border-radius', value: radiusValues[value] || value };
    }
  }

  // Handle background colors
  if (className.startsWith('bg-') && !className.includes('size') && !className.includes('position')) {
    const colorValue = className.substring(3);
    return { property: 'background-color', value: BASIC_COLORS[colorValue] || colorValue };
  }

  // Handle shadow classes
  if (className.startsWith('shadow')) {
    return parseShadowClass(className);
  }

  // Handle gradient classes
  if (className.startsWith('bg-gradient-') || className.startsWith('from-') || className.startsWith('via-') || className.startsWith('to-')) {
    return parseGradientClass(className);
  }

  // Handle transform functions
  if (className.match(/^-?(rotate|scale|skew|translate)-/)) {
    return parseTransformClass(className);
  }

  return null;
}

function parseTransformClass(className) {
  // Rotate
  if (className.match(/^-?rotate-\d+$/)) {
    const isNegative = className.startsWith('-');
    const degrees = className.match(/\d+$/)[0];
    const value = isNegative ? `-${degrees}deg` : `${degrees}deg`;
    return { property: 'transform', value: `rotate(${value})` };
  }

  // Scale
  if (className.match(/^scale(-[xy])?-\d+$/)) {
    const parts = className.split('-');
    const value = parts[parts.length - 1];
    const scaleValue = value === '0' ? '0' : value === '50' ? '.5' : value === '75' ? '.75' : value === '90' ? '.9' : value === '95' ? '.95' : value === '100' ? '1' : value === '105' ? '1.05' : value === '110' ? '1.1' : value === '125' ? '1.25' : value === '150' ? '1.5' : value;
    
    if (className.includes('-x-')) {
      return { property: 'transform', value: `scaleX(${scaleValue})` };
    } else if (className.includes('-y-')) {
      return { property: 'transform', value: `scaleY(${scaleValue})` };
    } else {
      return { property: 'transform', value: `scale(${scaleValue})` };
    }
  }

  // Skew
  if (className.match(/^-?skew-[xy]-\d+$/)) {
    const isNegative = className.startsWith('-');
    const parts = className.split('-');
    const axis = parts[parts.length - 2];
    const degrees = parts[parts.length - 1];
    const value = isNegative ? `-${degrees}deg` : `${degrees}deg`;
    return { property: 'transform', value: `skew${axis.toUpperCase()}(${value})` };
  }

  // Translate
  if (className.match(/^-?translate-[xy]-/)) {
    const isNegative = className.startsWith('-');
    const normalizedClassName = isNegative ? className.substring(1) : className;
    const parts = normalizedClassName.split('-');
    const axis = parts[1];
    const value = parts.slice(2).join('-');
    
    const translateValue = SPACING_VALUES[value] || value;
    const finalValue = isNegative ? `-${translateValue}` : translateValue;
    
    return { property: 'transform', value: `translate${axis.toUpperCase()}(${finalValue})` };
  }

  return null;
}

function parseShadowClass(className) {
  // Shadow class mappings based on Tailwind defaults
  const shadowMappings = {
    'shadow-xs': { property: 'box-shadow', value: '0 0 0 1px rgba(0, 0, 0, 0.05)' },
    'shadow-sm': { property: 'box-shadow', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    'shadow': { property: 'box-shadow', value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
    'shadow-md': { property: 'box-shadow', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    'shadow-lg': { property: 'box-shadow', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    'shadow-xl': { property: 'box-shadow', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    'shadow-2xl': { property: 'box-shadow', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
    'shadow-inner': { property: 'box-shadow', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
    'shadow-outline': { property: 'box-shadow', value: '0 0 0 3px rgba(66, 153, 225, 0.5)' },
    'shadow-none': { property: 'box-shadow', value: 'none' }
  };

  return shadowMappings[className] || null;
}

function parseGradientClass(className) {
  // Background gradient direction classes
  if (className.startsWith('bg-gradient-to-')) {
    const direction = className.substring(15); // Remove 'bg-gradient-to-'
    const directionMappings = {
      't': 'to top',
      'tr': 'to top right',
      'r': 'to right',
      'br': 'to bottom right',
      'b': 'to bottom',
      'bl': 'to bottom left',
      'l': 'to left',
      'tl': 'to top left'
    };
    
    if (directionMappings[direction]) {
      return {
        property: 'background-image',
        value: `linear-gradient(${directionMappings[direction]}, var(--tw-gradient-stops))`
      };
    }
  }

  // Gradient color stop classes
  if (className.startsWith('from-') || className.startsWith('via-') || className.startsWith('to-')) {
    const parts = className.split('-');
    const stopType = parts[0]; // from, via, or to
    const colorName = parts.slice(1).join('-'); // rest is color
    
    const properties = {
      'from': '--tw-gradient-from',
      'via': '--tw-gradient-via', 
      'to': '--tw-gradient-to'
    };

    if (properties[stopType]) {
      return {
        property: properties[stopType],
        value: BASIC_COLORS[colorName] || colorName
      };
    }
  }

  return null;
}

module.exports = {
  getEffectsProperty,
};