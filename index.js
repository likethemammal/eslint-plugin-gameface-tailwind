/**
 * ESLint Plugin for Coherent Labs Gameface Framework Compatibility
 * Validates Tailwind classes and inline CSS against Gameface supported features
 */

const gamefaceTailwind = require('./lib/rules/tailwind');
const gamefaceInlineCSS = require('./lib/rules/inline-css');

module.exports = {
  meta: {
    name: 'eslint-plugin-gameface-tailwind',
    version: '1.0.0'
  },
  rules: {
    'gameface-tailwind': gamefaceTailwind,
    'gameface-inline-css': gamefaceInlineCSS
  },
  configs: {
    recommended: {
      plugins: ['gameface'],
      rules: {
        'gameface/gameface-tailwind': 'error',
        'gameface/gameface-inline-css': 'error'
      }
    },
    strict: {
      plugins: ['gameface'],
      rules: {
        'gameface/gameface-tailwind': ['error', { strict: true }],
        'gameface/gameface-inline-css': ['error', { strict: true }]
      }
    }
  }
};
