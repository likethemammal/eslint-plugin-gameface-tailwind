/**
 * Simple performance tests for ESLint plugin
 * Tests core performance characteristics without complex integrations
 */

const classesRule = require('../../lib/rules/classes');
const inlineCssRule = require('../../lib/rules/inline-css');
const { validateTailwindClasses } = require('../../lib/utils/validators/validation-engine');

describe('Simple Performance Tests', () => {
  // Helper to measure execution time
  function measureTime(fn) {
    const start = process.hrtime.bigint();
    const result = fn();
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    return { result, durationMs };
  }

  // Generate test class strings
  function generateClassString(count) {
    const baseClasses = [
      'flex', 'block', 'grid', 'bg-white', 'text-gray-500', 'p-4', 'mb-2', 
      'border', 'rounded', 'shadow-lg', 'max-w-md', 'mx-auto', 'hover:bg-blue-500'
    ];
    
    const classes = [];
    for (let i = 0; i < count; i++) {
      classes.push(baseClasses[i % baseClasses.length]);
    }
    
    return classes.join(' ');
  }

  describe('Core Validation Performance', () => {
    test('should validate small class lists quickly (< 5ms)', () => {
      const classString = generateClassString(10);
      
      const { durationMs } = measureTime(() => {
        return validateTailwindClasses(classString, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(5);
    });

    test('should validate medium class lists efficiently (< 15ms)', () => {
      const classString = generateClassString(50);
      
      const { durationMs } = measureTime(() => {
        return validateTailwindClasses(classString, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(15);
    });

    test('should validate large class lists within reasonable time (< 50ms)', () => {
      const classString = generateClassString(100);
      
      const { durationMs } = measureTime(() => {
        return validateTailwindClasses(classString, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(50);
    });

    test('should scale reasonably with class count', () => {
      const sizes = [10, 20, 40];
      const times = [];

      sizes.forEach(size => {
        const classString = generateClassString(size);
        
        const { durationMs } = measureTime(() => {
          return validateTailwindClasses(classString, { severity: 'warning' });
        });

        times.push(durationMs);
      });

      // Check that performance scales reasonably (not exponentially)
      const ratio1 = times[1] / times[0]; // 20 vs 10 classes
      const ratio2 = times[2] / times[1]; // 40 vs 20 classes
      
      // Should not be more than 4x slower when doubling class count
      expect(ratio1).toBeLessThan(4);
      expect(ratio2).toBeLessThan(4);
    });
  });

  describe('Rule Context Performance', () => {
    // Mock context for rule testing
    function createMockContext() {
      const reports = [];
      return {
        report: (report) => reports.push(report),
        options: [{ autofix: true }],
        getReports: () => reports
      };
    }

    // Mock AST node
    function createMockNode(className) {
      return {
        type: 'JSXAttribute',
        name: { name: 'className' },
        value: {
          type: 'Literal',
          value: className
        }
      };
    }

    test('should process rule logic quickly for small components', () => {
      const context = createMockContext();
      const classString = generateClassString(10);
      const node = createMockNode(classString);

      const { durationMs } = measureTime(() => {
        // Simulate rule processing
        const ruleInstance = classesRule.create(context);
        ruleInstance.JSXElement(node);
        return context.getReports();
      });

      expect(durationMs).toBeLessThan(10);
    });

    test('should handle repeated rule execution efficiently', () => {
      const iterations = 100;
      const classString = generateClassString(5);

      const { durationMs } = measureTime(() => {
        for (let i = 0; i < iterations; i++) {
          const context = createMockContext();
          const node = createMockNode(classString);
          const ruleInstance = classesRule.create(context);
          ruleInstance.JSXElement(node);
        }
      });

      // Should average less than 1ms per iteration
      const avgTime = durationMs / iterations;
      expect(avgTime).toBeLessThan(1);
    });
  });

  describe('String Processing Performance', () => {
    test('should split class strings efficiently', () => {
      const longClassString = generateClassString(200);

      const { durationMs } = measureTime(() => {
        // Simulate class string processing
        const classes = longClassString.split(/\s+/).filter(cls => cls.trim());
        return classes.length;
      });

      expect(durationMs).toBeLessThan(2);
    });

    test('should handle whitespace normalization quickly', () => {
      const messyClassString = `  ${generateClassString(50).split(' ').join('   ')}  `;

      const { durationMs } = measureTime(() => {
        const classes = messyClassString.split(/\s+/).filter(cls => cls.trim());
        const newValue = classes.join(' ');
        return newValue;
      });

      expect(durationMs).toBeLessThan(5);
    });
  });

  describe('Memory Usage Patterns', () => {
    test('should not accumulate excessive memory during repeated validation', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const classString = generateClassString(20);
      
      // Process many validations
      for (let i = 0; i < 1000; i++) {
        validateTailwindClasses(classString, { severity: 'warning' });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10);
    });

    test('should clean up resources properly', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Create and discard many rule instances
      for (let i = 0; i < 100; i++) {
        const context = {
          report: () => {},
          options: [{ autofix: true }]
        };
        
        const ruleInstance = classesRule.create(context);
        const node = createMockNode(generateClassString(10));
        ruleInstance.JSXElement(node);
      }
      
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      // Should not leak significant memory
      expect(memoryIncrease).toBeLessThan(5);
    });
  });

  describe('Edge Case Performance', () => {
    test('should handle empty inputs efficiently', () => {
      const { durationMs } = measureTime(() => {
        validateTailwindClasses('', { severity: 'warning' });
        validateTailwindClasses(null, { severity: 'warning' });
        validateTailwindClasses(undefined, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(1);
    });

    test('should handle very long single class names', () => {
      const longClassName = 'a'.repeat(1000);

      const { durationMs } = measureTime(() => {
        return validateTailwindClasses(longClassName, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(5);
    });

    test('should handle many short class names efficiently', () => {
      const manyClasses = Array.from({ length: 500 }, (_, i) => `c${i}`).join(' ');

      const { durationMs } = measureTime(() => {
        return validateTailwindClasses(manyClasses, { severity: 'warning' });
      });

      expect(durationMs).toBeLessThan(100);
    });
  });

  // Helper to create mock context and node (defined at bottom for reuse)
  function createMockContext() {
    const reports = [];
    return {
      report: (report) => reports.push(report),
      options: [{ autofix: true }],
      getReports: () => reports
    };
  }

  function createMockNode(className) {
    return {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: {
        type: 'Literal',
        value: className
      }
    };
  }
});