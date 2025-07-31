/**
 * ESLint Plugin for Coherent Labs Gameface Framework Compatibility
 * Validates Tailwind classes and inline CSS against Gameface supported features
 */

const classesRule = require('./lib/rules/classes');
const inlineCSSRule = require('./lib/rules/inline-css');

module.exports = {
  meta: {
    name: 'eslint-plugin-gameface-tailwind',
    version: '1.0.0'
  },
  rules: {
    'classes': classesRule,
    'inline-css': inlineCSSRule
  },
  configs: {
    recommended: {
      plugins: ['gameface'],
      rules: {
        'gameface-tailwind/classes': 'error',
        'gameface-tailwind/inline-css': 'error'
      }
    },
    strict: {
      plugins: ['gameface'],
      rules: {
        'gameface-tailwind/classes': ['error', { strict: true }],
        'gameface-tailwind/inline-css': ['error', { strict: true }]
      }
    }
  }
};
