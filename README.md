# eslint-plugin-gameface-tailwind

An ESLint plugin that validates Tailwind CSS classes and inline CSS styles in JavaScript/JSX files against [Coherent Labs Gameface Framework](https://docs.coherent-labs.com/cpp-gameface/) compatibility.

## Overview

Gameface is a UI framework for game development that supports a subset of the HTML, CSS, JS standards optimized for game interfaces. This ESLint plugin helps identify unsupported CSS properties, values, and Tailwind classes before runtime.

The logic for this plugin is based on this Gameface documentation:

- [Differences to traditional browsers](https://docs.coherent-labs.com/cpp-gameface/what_is_gfp/htmlfeaturesupport/)
- [Supported Features - CSS Properties](https://docs.coherent-labs.com/cpp-gameface/content_development/supported_features_tables/cssproperties/)
- [Supported Features - CSS Selectors](https://docs.coherent-labs.com/cpp-gameface/content_development/supported_features_tables/cssselectors/)
- [Tailwind Support](https://docs.coherent-labs.com/cpp-gameface/content_development/tailwindsupport/)

### Features

- ✅ **Multi-framework support**: React/JSX, vanilla JavaScript, and template literals
- ✅ **Tailwind CSS validation**: Detects unsupported classes and suggests alternatives
- ✅ **Inline CSS validation**: Detects unsupported styles within JS

```jsx
<div className="grid" />  // ❌ Detects grid usage
<div style={{ display: "grid" }} />  // ❌ Detects unsupported grid styles

element.className = "float-left";  // ❌ Detects float usage
element.style.display = "grid";    // ❌ Detects grid usage
element.setAttribute("class", "sticky");  // ❌ Detects sticky positioning

const html = `<div class="grid grid-cols-3">Content</div>`;  // ❌ Detects grid in templates
const template = `<div style="display: block; float: left">`;  // ❌ Detects unsupported styles
```

## Installation

```bash
npm install --save-dev eslint-plugin-gameface-tailwind
```

## Configuration

Add the plugin to your ESLint configuration:

```javascript
import gamefaceTailwind from 'eslint-plugin-gameface-tailwind';

export default [
  {
    plugins: {
      'gameface-tailwind': gamefaceTailwind
    },
    rules: {
      'gameface-tailwind/classes': 'error',
      'gameface-tailwind/inline-css': 'error'
    }
  }
];
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

### Autofix

Enable autofix to automatically remove unsupported classes:

```javascript
rules: {
  'gameface-tailwind/classes': ['error', { autofix: true }],
  'gameface-tailwind/inline-css': ['error', { autofix: true }]
}
```

**Before autofix:**
```jsx
<div className="bg-white shadow-lg border rounded-lg p-6">
  <p className="text-gray-600 mb-4">Content</p>
</div>
```

**After autofix:**
```jsx
<div className="border rounded-lg p-6">
  <p className="mb-4">Content</p>
</div>
```

## Examples

### Template Literals

```javascript
// Single-line template literal
const buttonClass = `px-4 py-2 bg-blue-500 text-white rounded`;  // ❌ bg-blue-500, text-white unsupported

// Multi-line template literal  
const cardClasses = `
  bg-white          // ❌ Unsupported
  shadow-lg         // ❌ Unsupported  
  rounded-lg
  p-6
  max-w-sm
`;

// Template literal with conditional classes
const dynamicClass = `
  flex items-center justify-center
  px-4 py-2 rounded-md font-medium
  ${variant === 'primary' ? 'bg-blue-500 text-white' : 'border'}  // ❌ bg-blue-500, text-white
`;
```

### Class Variance Authority (CVA)

```javascript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors",  // ❌ inline-flex
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white shadow-sm",      // ❌ bg-blue-500, text-white, shadow-sm
        destructive: "bg-red-500 text-white shadow-sm",   // ❌ bg-red-500, text-white, shadow-sm
        outline: "border border-gray-300 bg-white text-gray-700",  // ❌ border-gray-300, bg-white, text-gray-700
        ghost: "text-gray-700 hover:bg-gray-100",         // ❌ text-gray-700, hover:bg-gray-100
      },
      size: {
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-8 text-lg",
      }
    }
  }
);

// Usage with cn utility
<button className={cn(buttonVariants({ variant, size }))}>
  Click me
</button>
```

### Gameface-friendly Example Components

#### Simple Card Component

```jsx
function Card({ title, description, onAction }) {
  return (
    <div className="border rounded-lg p-6 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button className="text-sm opacity-75">×</button>
      </div>
      <p className="mb-4">{description}</p>
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 border rounded"
          onClick={onAction}
        >
          Action
        </button>
      </div>
    </div>
  );
}
```

#### Button Component with Supported Variants

```jsx
function Button({ variant = 'default', size = 'md', children, ...props }) {
  const baseClasses = "items-center justify-center px-4 py-2 rounded-md font-medium";
  
  const variantClasses = {
    default: "border",
    outline: "border",
  };
  
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "px-4 py-2", 
    lg: "h-12 px-8 text-lg",
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Form Component

```jsx
function Form({ onSubmit }) {
  return (
    <form className="max-w-md" onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input 
          type="email"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Password
        </label>
        <input 
          type="password"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <button className="w-full py-2 px-4 rounded-md font-medium">
        Sign In
      </button>
    </form>
  );
}
```