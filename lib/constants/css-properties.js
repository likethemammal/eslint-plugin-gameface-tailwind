/**
 * Consolidated CSS property definitions and validation rules for Gameface
 */

const SUPPORT_STATUS = {
  YES: 'YES',
  NO: 'NO',
  PARTIAL: 'PARTIAL',
  CONDITIONAL: 'CONDITIONAL'
};

const CSS_PROPERTIES = {
  DISPLAY: {
    SUPPORTED: ['flex'],
    UNSUPPORTED: ['block', 'inline', 'inline-block', 'table', 'table-cell', 'table-row', 'grid', 'inline-grid', 'flow-root'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'Only flex is fully supported',
      unsupportedValues: ['block', 'inline', 'inline-block', 'table', 'table-cell', 'table-row', 'grid', 'inline-grid']
    }
  },
  
  POSITION: {
    SUPPORTED: ['relative', 'absolute', 'fixed'],
    UNSUPPORTED: ['sticky', 'static'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'relative, absolute, fixed (partial support for nested fixed positioned contexts)',
      unsupportedValues: ['sticky', 'static']
    }
  },
  
  BORDER_STYLES: {
    SUPPORTED: ['solid', 'none', 'hidden'],
    UNSUPPORTED: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'Only solid, none, hidden supported',
      unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
    }
  },
  
  BACKGROUND_REPEAT: {
    SUPPORTED: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'round'],
    UNSUPPORTED: ['space'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'Space is not supported',
      unsupportedValues: ['space']
    }
  },
  
  FLEX_JUSTIFY: {
    SUPPORTED: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    UNSUPPORTED: ['space-evenly', 'stretch'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'flex-start (default), flex-end, center, space-between, space-around',
      unsupportedValues: ['space-evenly', 'stretch']
    }
  },
  
  FLEX_ALIGN_ITEMS: {
    SUPPORTED: ['stretch', 'flex-start', 'flex-end', 'center'],
    UNSUPPORTED: ['baseline'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'stretch (default), flex-start, flex-end and center',
      unsupportedValues: ['baseline']
    }
  },
  
  FLEX_ALIGN_CONTENT: {
    SUPPORTED: ['stretch', 'flex-start', 'flex-end', 'center'],
    UNSUPPORTED: ['space-between', 'space-around', 'space-evenly'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'stretch (default), flex-start, flex-end and center',
      unsupportedValues: ['space-between', 'space-around', 'space-evenly']
    }
  },
  
  FLEX_ALIGN_SELF: {
    SUPPORTED: ['auto', 'stretch', 'flex-start', 'flex-end', 'center'],
    UNSUPPORTED: ['baseline'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.PARTIAL,
      limitation: 'auto (default), stretch, flex-start, flex-end and center',
      unsupportedValues: ['baseline']
    }
  },
  
  POINTER_EVENTS: {
    SUPPORTED: ['auto', 'none', 'inherit'],
    UNSUPPORTED: ['all', 'fill', 'stroke', 'painted', 'visible', 'visibleFill', 'visibleStroke', 'visiblePainted'],
    PROPERTY_CONFIG: {
      status: SUPPORT_STATUS.YES,
      limitation: 'auto, none, inherit',
      unsupportedValues: ['all', 'fill', 'stroke', 'painted', 'visible', 'visibleFill', 'visibleStroke', 'visiblePainted']
    }
  }
};

const SPACING_VALUES = {
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

const FONT_SIZES = {
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

const FONT_WEIGHTS = {
  'thin': '100',
  'hairline': '100',
  'extralight': '200',
  'light': '300',
  'normal': '400',
  'medium': '500',
  'semibold': '600',
  'bold': '700',
  'extrabold': '800',
  'black': '900'
};

const BASIC_COLORS = {
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

module.exports = {
  SUPPORT_STATUS,
  CSS_PROPERTIES,
  SPACING_VALUES,
  FONT_SIZES,
  FONT_WEIGHTS,
  BASIC_COLORS
};