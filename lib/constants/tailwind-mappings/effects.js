/**
 * Effects related Tailwind class mappings (backgrounds, borders, transforms, animations)
 */

const EFFECTS_MAPPINGS = {
  // Animation and transitions
  'ease-linear': { property: 'transition-timing-function', value: 'linear' },
  'ease-in': { property: 'transition-timing-function', value: 'cubic-bezier(0.4, 0, 1, 1)' },
  'ease-out': { property: 'transition-timing-function', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  'ease-in-out': { property: 'transition-timing-function', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  'duration-75': { property: 'transition-duration', value: '75ms' },
  'duration-100': { property: 'transition-duration', value: '100ms' },
  'duration-150': { property: 'transition-duration', value: '150ms' },
  'duration-200': { property: 'transition-duration', value: '200ms' },
  'duration-300': { property: 'transition-duration', value: '300ms' },
  'duration-500': { property: 'transition-duration', value: '500ms' },
  'duration-700': { property: 'transition-duration', value: '700ms' },
  'duration-1000': { property: 'transition-duration', value: '1000ms' },
  'delay-75': { property: 'transition-delay', value: '75ms' },
  'delay-100': { property: 'transition-delay', value: '100ms' },
  'delay-150': { property: 'transition-delay', value: '150ms' },
  'delay-200': { property: 'transition-delay', value: '200ms' },
  'delay-300': { property: 'transition-delay', value: '300ms' },
  'delay-500': { property: 'transition-delay', value: '500ms' },
  'delay-700': { property: 'transition-delay', value: '700ms' },
  'delay-1000': { property: 'transition-delay', value: '1000ms' },
  'transition': { property: 'transition-property', value: 'all' },
  'transition-colors': { property: 'transition-property', value: 'color, background-color, border-color, text-decoration-color, fill, stroke' },
  'transition-opacity': { property: 'transition-property', value: 'opacity' },
  'transition-shadow': { property: 'transition-property', value: 'box-shadow' },
  'transition-transform': { property: 'transition-property', value: 'transform' },
  'animate-bounce': { property: 'animation', value: 'bounce 1s infinite' },
  'animate-none': { property: 'animation', value: 'none' },
  'animate-ping': { property: 'animation', value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' },
  'animate-pulse': { property: 'animation', value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
  'animate-spin': { property: 'animation', value: 'spin 1s linear infinite' },

  // Background
  'bg-auto': { property: 'background-size', value: 'auto' },
  'bg-cover': { property: 'background-size', value: 'cover' },
  'bg-contain': { property: 'background-size', value: 'contain' },
  'bg-bottom': { property: 'background-position', value: 'bottom' },
  'bg-top': { property: 'background-position', value: 'top' },
  'bg-center': { property: 'background-position', value: 'center' },
  'bg-left': { property: 'background-position', value: 'left' },
  'bg-left-bottom': { property: 'background-position', value: 'left bottom' },
  'bg-left-top': { property: 'background-position', value: 'left top' },
  'bg-right': { property: 'background-position', value: 'right' },
  'bg-right-bottom': { property: 'background-position', value: 'right bottom' },
  'bg-right-top': { property: 'background-position', value: 'right top' },
  'bg-fixed': { property: 'background-attachment', value: 'fixed' },
  'bg-local': { property: 'background-attachment', value: 'local' },
  'bg-scroll': { property: 'background-attachment', value: 'scroll' },
  'bg-no-repeat': { property: 'background-repeat', value: 'no-repeat' },
  'bg-repeat': { property: 'background-repeat', value: 'repeat' },
  'bg-repeat-x': { property: 'background-repeat', value: 'repeat-x' },
  'bg-repeat-y': { property: 'background-repeat', value: 'repeat-y' },
  'bg-repeat-round': { property: 'background-repeat', value: 'round' },
  'bg-repeat-space': { property: 'background-repeat', value: 'space' },
  'bg-none': { property: 'background-image', value: 'none' },

  // Background gradients  
  'bg-gradient-to-b': { property: 'background-image', value: 'linear-gradient(to bottom, var(--tw-gradient-stops))' },
  'bg-gradient-to-bl': { property: 'background-image', value: 'linear-gradient(to bottom left, var(--tw-gradient-stops))' },
  'bg-gradient-to-br': { property: 'background-image', value: 'linear-gradient(to bottom right, var(--tw-gradient-stops))' },
  'bg-gradient-to-l': { property: 'background-image', value: 'linear-gradient(to left, var(--tw-gradient-stops))' },
  'bg-gradient-to-r': { property: 'background-image', value: 'linear-gradient(to right, var(--tw-gradient-stops))' },
  'bg-gradient-to-t': { property: 'background-image', value: 'linear-gradient(to top, var(--tw-gradient-stops))' },
  'bg-gradient-to-tl': { property: 'background-image', value: 'linear-gradient(to top left, var(--tw-gradient-stops))' },
  'bg-gradient-to-tr': { property: 'background-image', value: 'linear-gradient(to top right, var(--tw-gradient-stops))' },

  // Background colors
  'bg-transparent': { property: 'background-color', value: 'transparent' },
  'bg-current': { property: 'background-color', value: 'currentColor' },

  // Border colors
  'border-transparent': { property: 'border-color', value: 'transparent' },
  'border-current': { property: 'border-color', value: 'currentColor' },

  // Border styles
  'border-solid': { property: 'border-style', value: 'solid' },
  'border-dashed': { property: 'border-style', value: 'dashed' },
  'border-dotted': { property: 'border-style', value: 'dotted' },
  'border-double': { property: 'border-style', value: 'double' },
  'border-none': { property: 'border-style', value: 'none' },

  // Border widths
  'border': { property: 'border-width', value: '1px' },
  'border-0': { property: 'border-width', value: '0px' },
  'border-2': { property: 'border-width', value: '2px' },
  'border-4': { property: 'border-width', value: '4px' },
  'border-8': { property: 'border-width', value: '8px' },

  // Box sizing
  'box-border': { property: 'box-sizing', value: 'border-box' },
  'box-content': { property: 'box-sizing', value: 'content-box' },

  // Transform
  'transform': { property: 'transform', value: 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))' },
  'transform-none': { property: 'transform', value: 'none' },

  // Transform origin
  'origin-center': { property: 'transform-origin', value: 'center' },
  'origin-top': { property: 'transform-origin', value: 'top' },
  'origin-top-right': { property: 'transform-origin', value: 'top right' },
  'origin-right': { property: 'transform-origin', value: 'right' },
  'origin-bottom-right': { property: 'transform-origin', value: 'bottom right' },
  'origin-bottom': { property: 'transform-origin', value: 'bottom' },
  'origin-bottom-left': { property: 'transform-origin', value: 'bottom left' },
  'origin-left': { property: 'transform-origin', value: 'left' },
  'origin-top-left': { property: 'transform-origin', value: 'top left' }
};

module.exports = {
  EFFECTS_MAPPINGS,
};