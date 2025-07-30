# eslint-plugin-gameface-tailwind

An ESLint plugin that validates Tailwind CSS classes and inline CSS styles in JavaScript/JSX files against [Coherent Labs Gameface Framework](https://docs.coherent-labs.com/cpp-gameface/) compatibility.

## Overview

Gameface is a UI framework for game development that supports a subset of the HTML5, CSS3, and JavaScript standards optimized for game interfaces. This ESLint plugin helps developers identify unsupported CSS properties, values, and Tailwind classes before runtime.

## Features

- ✅ **Multi-framework support**: React/JSX, vanilla JavaScript, and template literals
- ✅ **Tailwind CSS validation**: Detects unsupported classes and suggests alternatives
- ✅ **Inline CSS validation**: Detects unsupported styles within JS

## Installation

```bash
npm install --save-dev eslint-plugin-gameface-tailwind
```

### Supported Code Patterns

**React/JSX:**
```jsx
<div className="grid" />  // ❌ Detects grid usage
<div style={{ display: "grid" }} />  // ❌ Detects unsupported styles
```

**Vanilla JavaScript:**
```javascript
element.className = "float-left";  // ❌ Detects float usage
element.style.display = "grid";    // ❌ Detects grid usage
element.setAttribute("class", "sticky");  // ❌ Detects sticky positioning
```

**Template Literals (Vue, Angular, etc.):**
```javascript
const html = `<div class="grid grid-cols-3">Content</div>`;  // ❌ Detects grid in templates
const template = `<div style="display: block; float: left">`;  // ❌ Detects unsupported styles
```

## Configuration

Add the plugin to your ESLint configuration:

**ESLint v9+ (Flat Config):**
```javascript
import gamefaceTailwind from 'eslint-plugin-gameface-tailwind';

export default [
  {
    plugins: {
      'gameface-tailwind': gamefaceTailwind
    },
    rules: {
      'gameface-tailwind/gameface-tailwind': 'error',
      'gameface-tailwind/gameface-inline-css': 'error'
    }
  }
];
```

**ESLint v8 (Legacy Config):**
```json
{
  "plugins": ["gameface-tailwind"],
  "rules": {
    "gameface-tailwind/gameface-tailwind": "error",
    "gameface-tailwind/gameface-inline-css": "error"
  }
}
```

### Configuration Presets

**Recommended (default):**
```javascript
rules: {
  ...gamefaceTailwind.configs.recommended.rules
}
```

Use recommended when: You only want to catch definite incompatibilities and can work around partial support limitations.

**Strict mode:**
```javascript
rules: {
  ...gamefaceTailwind.configs.strict.rules
}
```

With strict mode on properties with PARTIAL support will warn:

- `max-width`/`max-height` (doesn't support `none` value)
- `justify-content` (doesn't support `space-evenly`)
- `align-items` (doesn't support `baseline`)
- `background-position` (offsets not supported)
- `border-style` variations with limitations
- And others

Use strict mode when: You want comprehensive validation and are willing to address even partial compatibility issues.