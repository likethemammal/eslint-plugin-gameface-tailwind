/**
 * Performance configuration and thresholds
 * Used by performance tests and benchmarks
 */

module.exports = {
  // Time thresholds in milliseconds
  thresholds: {
    // Component size based thresholds
    smallComponent: 20,      // < 20 classes
    mediumComponent: 50,     // 20-50 classes  
    largeComponent: 100,     // 50-100 classes
    xlComponent: 200,        // 100+ classes
    
    // Specific scenario thresholds
    templateLiteral: 75,     // Template literal processing
    multipleComponents: 150, // Multiple components in one file
    nestedComponents: 200,   // Deeply nested component trees
    complexDashboard: 150,   // Real-world dashboard layout
    formWithStyles: 100,     // Forms with inline CSS
    
    // Edge cases
    longClassString: 75,     // Very long className strings
    deepNesting: 50,         // Deeply nested template literals
    
    // Autofix performance
    autofixSmall: 25,        // Autofix on small components
    autofixMedium: 75,       // Autofix on medium components
    autofixLarge: 150,       // Autofix on large components
  },
  
  // Memory thresholds
  memory: {
    maxIncreasePerRun: 10,   // MB - Maximum memory increase per lint run
    maxTotalIncrease: 50,    // MB - Maximum total memory increase in benchmark
    gcThreshold: 100,        // Number of runs before forcing GC
  },
  
  // Scaling expectations
  scaling: {
    // Maximum acceptable performance degradation when size doubles
    maxScalingRatio: 3,      // Should not be more than 3x slower
    
    // Linear scaling tolerance (deviation from linear)
    linearTolerance: 0.5,    // 50% tolerance for linear scaling
  },
  
  // Test data generation
  testData: {
    // Mix of classes for realistic testing
    classPool: [
      // Layout
      'flex', 'block', 'inline-block', 'grid', 'table', 'hidden',
      
      // Positioning  
      'static', 'relative', 'absolute', 'fixed', 'sticky',
      
      // Spacing
      'p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8',
      'm-0', 'm-1', 'm-2', 'm-4', 'm-6', 'm-8',
      
      // Sizing
      'w-full', 'w-1/2', 'w-1/3', 'w-auto', 'h-full', 'h-64',
      'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
      
      // Colors (mostly unsupported)
      'bg-white', 'bg-gray-100', 'bg-blue-500', 'bg-red-500',
      'text-gray-500', 'text-white', 'text-black', 'text-blue-600',
      
      // Borders
      'border', 'border-t', 'border-r', 'border-b', 'border-l',
      'border-2', 'border-4', 'rounded', 'rounded-lg', 'rounded-full',
      
      // Typography
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
      'font-thin', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
      
      // Effects (mostly unsupported)
      'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
      
      // Interactions
      'hover:bg-blue-600', 'focus:ring-2', 'focus:ring-blue-500',
      'transition-colors', 'duration-200', 'ease-in-out',
      
      // Grid (unsupported)
      'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-12',
      'col-span-1', 'col-span-2', 'col-span-3', 'gap-2', 'gap-4', 'gap-6',
      
      // Flexbox
      'items-start', 'items-center', 'items-end', 'items-stretch',
      'justify-start', 'justify-center', 'justify-end', 'justify-between',
      'justify-around', 'justify-evenly', 'flex-wrap', 'flex-nowrap',
      
      // Float (unsupported)
      'float-left', 'float-right', 'float-none', 'clear-both',
      
      // Order (unsupported)
      'order-1', 'order-2', 'order-first', 'order-last',
    ],
    
    // CSS properties for inline style testing
    cssProperties: [
      { property: 'display', values: ['flex', 'block', 'grid', 'inline', 'none'] },
      { property: 'position', values: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
      { property: 'float', values: ['left', 'right', 'none'] },
      { property: 'clear', values: ['both', 'left', 'right', 'none'] },
      { property: 'overflow', values: ['visible', 'hidden', 'scroll', 'auto'] },
      { property: 'borderStyle', values: ['solid', 'dashed', 'dotted', 'double', 'none'] },
      { property: 'backgroundColor', values: ['#ffffff', '#000000', '#ff0000', '#00ff00'] },
      { property: 'color', values: ['#333333', '#666666', '#999999', '#cccccc'] },
      { property: 'padding', values: ['0px', '4px', '8px', '16px', '24px'] },
      { property: 'margin', values: ['0px', '4px', '8px', '16px', '24px'] },
    ]
  },
  
  // Benchmark output configuration
  output: {
    // Console output formatting
    console: {
      showDetails: true,
      showMemory: true,
      showRecommendations: true,
    },
    
    // File output
    saveResults: false,
    outputFile: 'benchmark-results.json',
    
    // CI-specific settings
    ci: {
      failOnThresholdExceeded: true,
      generateReport: true,
      reportFormat: 'json', // 'json' | 'markdown' | 'both'
    }
  }
};