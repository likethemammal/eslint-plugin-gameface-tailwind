/**
 * AST parsing utilities for ESLint rules
 * Consolidated and cleaned up from legacy helpers
 */

/**
 * Extract className value from JSX attribute or string literal
 */
function extractClassNameValue(node) {
  if (!node) return null;

  // Handle JSX attribute node - extract the value
  if (node.type === 'JSXAttribute' && node.value) {
    return extractClassNameValue(node.value);
  }

  // Handle JSX expression container
  if (node.type === 'JSXExpressionContainer' && node.expression) {
    return extractClassNameValue(node.expression);
  }

  // Handle string literals
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }

  // Handle template literals (simple case)
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
    return node.quasis[0].value.cooked;
  }

  // Handle template literals (complex case with multiple parts)
  if (node.type === 'TemplateLiteral') {
    return extractFromTemplateLiteral(node);
  }

  // Handle direct node with value property (for test compatibility)
  if (node.value && node.value.type) {
    return extractClassNameValue(node.value);
  }

  // For complex expressions, return null (can't statically analyze)
  return null;
}

/**
 * Extract text from template literal by joining quasi values
 */
function extractFromTemplateLiteral(templateLiteral) {
  if (!templateLiteral || !templateLiteral.quasis) {
    return '';
  }

  return templateLiteral.quasis
    .map(quasi => quasi.value.cooked || '')
    .join(' ')
    .trim();
}

/**
 * Extract style properties from a style object or CSS string
 * Returns an array of {property, value, node} objects
 */
function extractStylePropertiesAsObject(node) {
  // This version returns an object (for compatibility with existing rules)
  if (!node || node.type !== 'ObjectExpression') {
    return {};
  }

  const properties = {};

  for (const property of node.properties) {
    if (property.type === 'Property' && !property.computed) {
      let key = null;
      let value = null;

      // Get property key
      if (property.key.type === 'Identifier') {
        key = property.key.name;
      } else if (property.key.type === 'Literal') {
        key = property.key.value;
      }

      // Get property value (only handle simple cases)
      if (property.value.type === 'Literal') {
        value = property.value.value;
      }

      if (key && value !== null) {
        properties[key] = value;
      }
    }
  }

  return properties;
}

/**
 * Extract style properties from a style object or CSS string
 * Returns an array of {property, value, node} objects (for test compatibility)
 */
function extractStyleProperties(node) {
  if (!node) {
    return [];
  }

  // Handle direct object expression
  if (node.type === 'ObjectExpression') {
    return extractStylePropertiesFromObject(node);
  }

  // Handle JSX expression container with object expression
  if (node.value && node.value.type === 'JSXExpressionContainer' && 
      node.value.expression && node.value.expression.type === 'ObjectExpression') {
    return extractStylePropertiesFromObject(node.value.expression);
  }

  // Handle CSS string literals
  if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
    return parseCSSString(node.value.value, node.value);
  }

  return [];
}

/**
 * Extract style properties from an ObjectExpression node
 */
function extractStylePropertiesFromObject(objectNode) {
  const properties = [];

  for (const property of objectNode.properties) {
    if (property.type === 'Property' && !property.computed && property.key && property.value) {
      let key = null;
      let value = null;

      // Get property key  
      if (property.key.name) {
        key = property.key.name;
      } else if (property.key.value) {
        key = property.key.value;
      }

      // Get property value
      if (property.value.type === 'Literal') {
        value = property.value.value;
      } else if (property.value.type === 'Identifier') {
        value = property.value.name;
      }

      if (key && value !== null) {
        properties.push({
          property: key,
          value: value,
          node: property
        });
      }
    }
  }

  return properties;
}

/**
 * Parse CSS string into array of {property, value, node} objects
 */
function parseCSSString(cssText, node) {
  if (!cssText || typeof cssText !== 'string') {
    return [];
  }

  const properties = [];
  const declarations = cssText.split(';');

  declarations.forEach(declaration => {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex === -1) return;

    const property = declaration.substring(0, colonIndex).trim();
    const value = declaration.substring(colonIndex + 1).trim();

    if (property && value) {
      properties.push({
        property: property,
        value: value,
        node: node
      });
    }
  });

  return properties;
}

/**
 * Check if node has a specific attribute
 */
function hasAttribute(node, attributeName) {
  if (!node) return false;
  
  // Get the attributes from the opening element for JSXElement nodes, or direct attributes
  let attributes = null;
  if (node.openingElement?.attributes) {
    attributes = node.openingElement.attributes;
  } else if (node.attributes) {
    attributes = node.attributes;
  }
    
  if (!attributes) return false;
  
  return attributes.some(attr => 
    attr.type === 'JSXAttribute' && 
    attr.name && 
    attr.name.name === attributeName
  );
}

/**
 * Get attribute node by name
 */
function getAttribute(node, attributeName) {
  if (!node) return null;
  
  // Get the attributes from the opening element for JSXElement nodes, or direct attributes
  let attributes = null;
  if (node.openingElement?.attributes) {
    attributes = node.openingElement.attributes;
  } else if (node.attributes) {
    attributes = node.attributes;
  }
    
  if (!attributes) return null;
  
  return attributes.find(attr => 
    attr.type === 'JSXAttribute' && 
    attr.name && 
    attr.name.name === attributeName
  );
}

/**
 * Check if node is a React.createElement call, createElement call, or h call
 */
function isReactElementCall(node) {
  if (!node || node.type !== 'CallExpression' || !node.callee) {
    return false;
  }

  // Handle React.createElement
  if (node.callee.type === 'MemberExpression' &&
      node.callee.object && node.callee.object.name === 'React' &&
      node.callee.property && node.callee.property.name === 'createElement') {
    return true;
  }

  // Handle createElement and h calls (with or without explicit type)
  if ((node.callee.type === 'Identifier' || node.callee.name) &&
      (node.callee.name === 'createElement' || node.callee.name === 'h')) {
    return true;
  }

  return false;
}

/**
 * Extract props from React.createElement call
 */
function extractCreateElementProps(node) {
  if (!isReactElementCall(node) || node.arguments.length < 2) {
    return {};
  }

  const propsArg = node.arguments[1];
  if (!propsArg || propsArg.type !== 'ObjectExpression') {
    return {};
  }

  const props = {};
  
  // Extract each property from the props object
  for (const property of propsArg.properties) {
    if (property.type === 'Property' && !property.computed && property.key) {
      let key = null;
      
      // Handle different key structures (like in the tests)
      if (property.key.name) {
        key = property.key.name;
      } else if (property.key.value) {
        key = property.key.value;
      }
      
      if (key) {
        props[key] = property;
      }
    }
  }
  
  return props;
}

module.exports = {
  extractClassNameValue,
  extractFromTemplateLiteral,
  extractStyleProperties,
  extractStylePropertiesAsObject,
  parseCSSString,
  hasAttribute,
  getAttribute,
  isReactElementCall,
  extractCreateElementProps
};