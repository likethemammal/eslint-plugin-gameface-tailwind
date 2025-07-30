/**
 * Gameface Framework CSS support definitions
 * Based on official documentation from Coherent Labs
 */

// Status constants for better performance and maintainability
const SUPPORT_STATUS = {
  YES: 'YES',
  NO: 'NO',
  PARTIAL: 'PARTIAL',
  CONDITIONAL: 'CONDITIONAL'
};

function getGamefaceSupport() {
  return {
    properties: {
      // Layout Properties
      'display': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only flex is fully supported',
        unsupportedValues: ['block', 'inline', 'inline-block', 'table', 'table-cell', 'table-row', 'grid', 'inline-grid']
      },
      'position': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'relative, absolute, fixed (partial support for nested fixed positioned contexts)',
        unsupportedValues: ['sticky']
      },
      'float': { status: SUPPORT_STATUS.NO },
      'clear': { status: SUPPORT_STATUS.NO },

      // Flexbox Properties
      'flex': { status: SUPPORT_STATUS.YES, limitation: 'Currently does not work correctly together with text-align. Flex basis with value content is not supported.' },
      'flex-direction': { status: SUPPORT_STATUS.YES },
      'flex-wrap': { status: SUPPORT_STATUS.YES },
      'flex-flow': { status: SUPPORT_STATUS.NO },
      'flex-basis': { 
        status: SUPPORT_STATUS.YES,
        unsupportedValues: ['content']
      },
      'flex-grow': { status: SUPPORT_STATUS.YES },
      'flex-shrink': { status: SUPPORT_STATUS.YES },
      'justify-content': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'flex-start (default), flex-end, center, space-between, space-around',
        unsupportedValues: ['space-evenly', 'stretch']
      },
      'align-items': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'stretch (default), flex-start, flex-end and center',
        unsupportedValues: ['baseline']
      },
      'align-content': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'stretch (default), flex-start, flex-end and center',
        unsupportedValues: ['space-between', 'space-around', 'space-evenly']
      },
      'align-self': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'auto (default), stretch, flex-start, flex-end and center',
        unsupportedValues: ['baseline']
      },
      'order': { status: SUPPORT_STATUS.NO },

      // Grid Properties (Not supported)
      'grid': { status: SUPPORT_STATUS.NO },
      'grid-area': { status: SUPPORT_STATUS.NO },
      'grid-auto-columns': { status: SUPPORT_STATUS.NO },
      'grid-auto-flow': { status: SUPPORT_STATUS.NO },
      'grid-auto-rows': { status: SUPPORT_STATUS.NO },
      'grid-column': { status: SUPPORT_STATUS.NO },
      'grid-column-end': { status: SUPPORT_STATUS.NO },
      'grid-column-start': { status: SUPPORT_STATUS.NO },
      'grid-row': { status: SUPPORT_STATUS.NO },
      'grid-row-end': { status: SUPPORT_STATUS.NO },
      'grid-row-start': { status: SUPPORT_STATUS.NO },
      'grid-template': { status: SUPPORT_STATUS.NO },
      'grid-template-areas': { status: SUPPORT_STATUS.NO },
      'grid-template-columns': { status: SUPPORT_STATUS.NO },
      'grid-template-rows': { status: SUPPORT_STATUS.NO },

      // Box Model
      'width': { status: SUPPORT_STATUS.YES },
      'height': { 
        status: SUPPORT_STATUS.YES,
        limitation: 'Percent units for inline images are not supported'
      },
      'min-width': { status: SUPPORT_STATUS.YES },
      'min-height': { status: SUPPORT_STATUS.YES },
      'max-width': { 
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'none value is not supported',
        unsupportedValues: ['none']
      },
      'max-height': { 
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'none value is not supported',
        unsupportedValues: ['none']
      },
      'margin': { status: SUPPORT_STATUS.YES },
      'margin-top': { status: SUPPORT_STATUS.YES },
      'margin-right': { status: SUPPORT_STATUS.YES },
      'margin-bottom': { status: SUPPORT_STATUS.YES },
      'margin-left': { status: SUPPORT_STATUS.YES },
      'padding': { status: SUPPORT_STATUS.YES },
      'padding-top': { status: SUPPORT_STATUS.YES },
      'padding-right': { status: SUPPORT_STATUS.YES },
      'padding-bottom': { status: SUPPORT_STATUS.YES },
      'padding-left': { status: SUPPORT_STATUS.YES },
      'box-sizing': { status: SUPPORT_STATUS.NO },

      // Border Properties
      'border': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid style supported',
        unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
      },
      'border-top': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid style supported'
      },
      'border-right': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid style supported'
      },
      'border-bottom': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid style supported'
      },
      'border-left': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid style supported'
      },
      'border-width': { status: SUPPORT_STATUS.YES },
      'border-top-width': { status: SUPPORT_STATUS.YES },
      'border-right-width': { status: SUPPORT_STATUS.YES },
      'border-bottom-width': { status: SUPPORT_STATUS.YES },
      'border-left-width': { status: SUPPORT_STATUS.YES },
      'border-style': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid, none, hidden supported',
        unsupportedValues: ['dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']
      },
      'border-top-style': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid supported'
      },
      'border-right-style': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid supported'
      },
      'border-bottom-style': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid supported'
      },
      'border-left-style': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only solid supported'
      },
      'border-color': { status: SUPPORT_STATUS.YES, limitation: 'Limited color names' },
      'border-top-color': { status: SUPPORT_STATUS.YES, limitation: 'Limited color names' },
      'border-right-color': { status: SUPPORT_STATUS.YES, limitation: 'Limited color names' },
      'border-bottom-color': { status: SUPPORT_STATUS.YES, limitation: 'Limited color names' },
      'border-left-color': { status: SUPPORT_STATUS.YES, limitation: 'Limited color names' },
      'border-radius': { status: SUPPORT_STATUS.YES },
      'border-top-left-radius': { status: SUPPORT_STATUS.YES },
      'border-top-right-radius': { status: SUPPORT_STATUS.YES },
      'border-bottom-left-radius': { status: SUPPORT_STATUS.YES },
      'border-bottom-right-radius': { status: SUPPORT_STATUS.YES },
      'border-image': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'space repeat mode is not supported, multiple images are not supported, GIFs are not supported'
      },
      'border-image-source': { status: SUPPORT_STATUS.YES },
      'border-image-slice': { status: SUPPORT_STATUS.YES },
      'border-image-width': { status: SUPPORT_STATUS.YES },
      'border-image-outset': { status: SUPPORT_STATUS.YES },
      'border-image-repeat': {
        status: SUPPORT_STATUS.YES,
        limitation: 'space repeat mode is not supported',
        unsupportedValues: ['space']
      },

      // Background Properties
      'background': { status: SUPPORT_STATUS.YES },
      'background-color': { status: SUPPORT_STATUS.PARTIAL, limitation: 'Limited color names' },
      'background-image': { 
        status: SUPPORT_STATUS.YES,
        limitation: 'GIFs are not supported'
      },
      'background-position': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Offsets are not supported'
      },
      'background-position-x': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Offsets are not supported'
      },
      'background-position-y': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Offsets are not supported'
      },
      'background-size': { status: SUPPORT_STATUS.YES },
      'background-repeat': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Space is not supported',
        unsupportedValues: ['space']
      },
      'background-attachment': { status: SUPPORT_STATUS.NO },
      'background-clip': { status: SUPPORT_STATUS.NO },
      'background-origin': { status: SUPPORT_STATUS.NO },

      // Typography
      'font': { status: SUPPORT_STATUS.YES, limitation: 'No support for system keywords e.g. caption, icon, menu' },
      'font-family': { status: SUPPORT_STATUS.YES },
      'font-size': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Supported units are pixels, em, rem, vw, vh'
      },
      'font-weight': { status: SUPPORT_STATUS.YES },
      'font-style': { status: SUPPORT_STATUS.YES },
      'font-variant': { status: SUPPORT_STATUS.NO },
      'font-stretch': { status: SUPPORT_STATUS.NO },
      'line-height': { status: SUPPORT_STATUS.YES },
      'letter-spacing': { status: SUPPORT_STATUS.YES },
      'text-align': { status: SUPPORT_STATUS.YES },
      'text-decoration': { status: SUPPORT_STATUS.YES },
      'text-transform': { status: SUPPORT_STATUS.YES },
      'text-indent': { status: SUPPORT_STATUS.YES },
      'text-shadow': { status: SUPPORT_STATUS.YES },
      'white-space': { status: SUPPORT_STATUS.YES },
      'word-spacing': { status: SUPPORT_STATUS.YES },
      'word-wrap': { status: SUPPORT_STATUS.YES },
      'overflow-wrap': { status: SUPPORT_STATUS.YES },

      // Color and Opacity
      'color': { status: SUPPORT_STATUS.PARTIAL, limitation: 'Limited color names' },
      'opacity': { status: SUPPORT_STATUS.YES },

      // Transform and Animation
      'transform': { status: SUPPORT_STATUS.YES },
      'transform-origin': { status: SUPPORT_STATUS.YES },
      'transform-style': { status: SUPPORT_STATUS.YES },
      'perspective': { status: SUPPORT_STATUS.YES },
      'perspective-origin': { status: SUPPORT_STATUS.YES },
      'backface-visibility': { status: SUPPORT_STATUS.YES },
      'animation': { status: SUPPORT_STATUS.YES },
      'animation-name': { status: SUPPORT_STATUS.YES },
      'animation-duration': { status: SUPPORT_STATUS.YES },
      'animation-timing-function': { status: SUPPORT_STATUS.YES },
      'animation-delay': { status: SUPPORT_STATUS.YES },
      'animation-iteration-count': { status: SUPPORT_STATUS.YES },
      'animation-direction': { status: SUPPORT_STATUS.YES },
      'animation-fill-mode': { status: SUPPORT_STATUS.YES },
      'animation-play-state': { status: SUPPORT_STATUS.YES },

      // Visual Effects
      'box-shadow': { status: SUPPORT_STATUS.YES },
      'filter': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Cannot use url for svg filter. All other filters are working.'
      },
      'clip-path': {
        status: SUPPORT_STATUS.YES,
        limitation: 'Only basic shapes'
      },
      'mask': { status: SUPPORT_STATUS.PARTIAL },
      'mask-image': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only for pngs with alpha channel, multiple images are not supported, GIFs are not supported'
      },
      'mask-position': { status: SUPPORT_STATUS.YES },
      'mask-size': { status: SUPPORT_STATUS.YES },
      'mask-repeat': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Space is not supported',
        unsupportedValues: ['space']
      },
      'mask-clip': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'Only border-box',
        unsupportedValues: ['padding-box', 'content-box', 'margin-box', 'fill-box', 'stroke-box', 'view-box']
      },

      // Layout Control
      'overflow': { status: SUPPORT_STATUS.YES },
      'overflow-x': { status: SUPPORT_STATUS.YES },
      'overflow-y': { status: SUPPORT_STATUS.YES },
      'visibility': { status: SUPPORT_STATUS.YES },
      'z-index': { status: SUPPORT_STATUS.YES },
      'top': { status: SUPPORT_STATUS.YES },
      'right': { status: SUPPORT_STATUS.YES },
      'bottom': { status: SUPPORT_STATUS.YES },
      'left': { status: SUPPORT_STATUS.YES },

      // Interaction
      'cursor': { status: SUPPORT_STATUS.YES },
      'pointer-events': {
        status: SUPPORT_STATUS.YES,
        limitation: 'auto, none, inherit',
        unsupportedValues: ['all', 'fill', 'stroke', 'painted', 'visible', 'visibleFill', 'visibleStroke', 'visiblePainted']
      },

      // Misc
      'content': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'none, normal, <string>'
      },
      'all': {
        status: SUPPORT_STATUS.PARTIAL,
        limitation: 'only initial is supported',
        unsupportedValues: ['inherit', 'unset', 'revert']
      },

      // Unsupported Properties
      'outline': { status: SUPPORT_STATUS.NO },
      'outline-color': { status: SUPPORT_STATUS.NO },
      'outline-style': { status: SUPPORT_STATUS.NO },
      'outline-width': { status: SUPPORT_STATUS.NO },
      'outline-offset': { status: SUPPORT_STATUS.NO },
      'list-style': { status: SUPPORT_STATUS.NO },
      'list-style-type': { status: SUPPORT_STATUS.NO },
      'list-style-position': { status: SUPPORT_STATUS.NO },
      'list-style-image': { status: SUPPORT_STATUS.NO },
      'table-layout': { status: SUPPORT_STATUS.NO },
      'border-collapse': { status: SUPPORT_STATUS.NO },
      'border-spacing': { status: SUPPORT_STATUS.NO },
      'caption-side': { status: SUPPORT_STATUS.NO },
      'empty-cells': { status: SUPPORT_STATUS.NO },
      'quotes': { status: SUPPORT_STATUS.NO },
      'counter-reset': { status: SUPPORT_STATUS.NO },
      'counter-increment': { status: SUPPORT_STATUS.NO },
      'resize': { status: SUPPORT_STATUS.NO },
      'user-select': { status: SUPPORT_STATUS.NO }
    },

    selectors: {
      // Simple selectors
      'type': { status: SUPPORT_STATUS.YES },
      'class': { status: SUPPORT_STATUS.YES },
      'id': { status: SUPPORT_STATUS.YES },
      'universal': { status: SUPPORT_STATUS.YES },
      'attribute': { status: SUPPORT_STATUS.YES },

      // Combinators - require EnableComplexCSSSelectorsStyling
      'adjacent-sibling': { status: SUPPORT_STATUS.CONDITIONAL, requirement: 'EnableComplexCSSSelectorsStyling must be set to true' },
      'general-sibling': { status: SUPPORT_STATUS.CONDITIONAL, requirement: 'EnableComplexCSSSelectorsStyling must be set to true' },
      'child': { status: SUPPORT_STATUS.CONDITIONAL, requirement: 'EnableComplexCSSSelectorsStyling must be set to true' },
      'descendant': { status: SUPPORT_STATUS.CONDITIONAL, requirement: 'EnableComplexCSSSelectorsStyling must be set to true' },

      // Pseudo-classes
      'active': { status: SUPPORT_STATUS.YES },
      'focus': { status: SUPPORT_STATUS.YES },
      'hover': { status: SUPPORT_STATUS.YES },
      'root': { status: SUPPORT_STATUS.YES },
      'first-child': { status: SUPPORT_STATUS.YES, limitation: 'Structural pseudo-class selectors cause additional style rematching' },
      'last-child': { status: SUPPORT_STATUS.YES, limitation: 'Structural pseudo-class selectors cause additional style rematching' },
      'only-child': { status: SUPPORT_STATUS.YES, limitation: 'Structural pseudo-class selectors cause additional style rematching' },
      'nth-child': { status: SUPPORT_STATUS.PARTIAL, limitation: 'No support for the [ of <complex-selector-list> ] syntax. Structural pseudo-class selectors cause additional style rematching' },

      // Pseudo-elements
      'before': { status: SUPPORT_STATUS.YES },
      'after': { status: SUPPORT_STATUS.YES },
      'selection': { status: SUPPORT_STATUS.PARTIAL, limitation: 'only color and background-color properties' },

      // Unsupported pseudo-classes
      'checked': { status: SUPPORT_STATUS.NO },
      'disabled': { status: SUPPORT_STATUS.NO },
      'enabled': { status: SUPPORT_STATUS.NO },
      'empty': { status: SUPPORT_STATUS.NO },
      'first-of-type': { status: SUPPORT_STATUS.NO },
      'last-of-type': { status: SUPPORT_STATUS.NO },
      'nth-of-type': { status: SUPPORT_STATUS.NO },
      'nth-last-child': { status: SUPPORT_STATUS.NO },
      'nth-last-of-type': { status: SUPPORT_STATUS.NO },
      'only-of-type': { status: SUPPORT_STATUS.NO },
      'target': { status: SUPPORT_STATUS.NO },
      'visited': { status: SUPPORT_STATUS.NO },
      'link': { status: SUPPORT_STATUS.NO },
      'lang': { status: SUPPORT_STATUS.NO },
      'not': { status: SUPPORT_STATUS.NO },

      // Unsupported pseudo-elements
      'first-letter': { status: SUPPORT_STATUS.NO },
      'first-line': { status: SUPPORT_STATUS.NO }
    }
  };
}

module.exports = { getGamefaceSupport, SUPPORT_STATUS };
