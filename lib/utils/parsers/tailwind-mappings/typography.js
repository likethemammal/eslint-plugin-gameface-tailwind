/**
 * Typography related Tailwind class mappings
 */

const { TYPOGRAPHY_MAPPINGS } = require('../../../constants/tailwind-mappings/typography');
const { BASIC_COLORS, FONT_SIZES, FONT_WEIGHTS } = require('../../../constants/css-properties');

function parseFontSize(size) {
  return FONT_SIZES[size] || size;
}

function parseFontWeight(weight) {
  return FONT_WEIGHTS[weight] || weight;
}

function parseColorValue(colorValue) {
  return BASIC_COLORS[colorValue] || colorValue;
}

function parseFontFamily(className) {
  const fontFamilyMappings = {
    'font-sans': { 
      property: 'font-family', 
      value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    },
    'font-serif': { 
      property: 'font-family', 
      value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
    },
    'font-mono': { 
      property: 'font-family', 
      value: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    }
  };

  return fontFamilyMappings[className] || null;
}

function getTypographyProperty(className) {
  // Check static mappings first
  if (TYPOGRAPHY_MAPPINGS[className]) {
    return TYPOGRAPHY_MAPPINGS[className];
  }

  // Handle text colors
  if (className.startsWith('text-') && !className.includes('size') && !className.includes('align')) {
    const colorValue = className.substring(5);
    return { property: 'color', value: parseColorValue(colorValue) };
  }

  // Handle font sizes with patterns
  if (className.startsWith('text-') && ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].some(size => className.includes(size))) {
    return { property: 'font-size', value: parseFontSize(className.substring(5)) };
  }

  // Handle font weights with patterns
  if (className.startsWith('font-') && ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'].some(weight => className.includes(weight))) {
    return { property: 'font-weight', value: parseFontWeight(className.substring(5)) };
  }

  // Handle font families
  if (className.startsWith('font-') && ['sans', 'serif', 'mono'].includes(className.substring(5))) {
    return parseFontFamily(className);
  }

  return null;
}

module.exports = {
  getTypographyProperty,
};