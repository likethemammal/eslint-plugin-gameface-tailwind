/**
 * Performance tests for ESLint plugin using ESLint API
 * Tests ensure the plugin runs efficiently on large codebases
 */

const { ESLint } = require('eslint');
const classesRule = require('../../lib/rules/classes');
const inlineCssRule = require('../../lib/rules/inline-css');

// ESLint configuration for performance testing
const eslintConfig = {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  plugins: {
    'gameface-tailwind': {
      rules: {
        classes: classesRule,
        'inline-css': inlineCssRule
      }
    }
  },
  rules: {
    'gameface-tailwind/classes': ['error', { autofix: true }],
    'gameface-tailwind/inline-css': ['error', { autofix: true }]
  }
};

describe('ESLint Integration Performance Tests', () => {
  // Helper to measure execution time
  async function measureTime(fn) {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    return { result, durationMs };
  }

  // Generate large test cases
  function generateLargeComponent(classCount = 100) {
    const classes = [];
    const mixedClasses = [
      'flex', 'block', 'grid', 'bg-white', 'text-gray-500', 'p-4', 'mb-2', 
      'border', 'rounded', 'shadow-lg', 'max-w-md', 'mx-auto', 'hover:bg-blue-500'
    ];
    
    for (let i = 0; i < classCount; i++) {
      classes.push(mixedClasses[i % mixedClasses.length]);
    }
    
    return `<div className="${classes.join(' ')}">Large component</div>`;
  }

  function generateLargeTemplateComponent(classCount = 100) {
    const classes = [];
    const mixedClasses = [
      'flex', 'block', 'grid', 'bg-white', 'text-gray-500', 'p-4', 'mb-2', 
      'border', 'rounded', 'shadow-lg', 'max-w-md', 'mx-auto', 'hover:bg-blue-500'
    ];
    
    for (let i = 0; i < classCount; i++) {
      classes.push('              ' + mixedClasses[i % mixedClasses.length]);
    }
    
    return `<div className={\`
${classes.join('\n')}
            \`}>
              Large template component
            </div>`;
  }

  function generateInlineStyleComponent() {
    return `
      <div style={{ 
        display: "grid", 
        position: "sticky", 
        float: "left",
        padding: "16px",
        backgroundColor: "#ffffff",
        borderStyle: "double"
      }}>
        Inline styles component
      </div>
    `;
  }

  describe('Classes Rule Performance', () => {
    test('should process small components quickly (< 50ms)', async () => {
      const code = generateLargeComponent(10);
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(50);
    });

    test('should process medium components efficiently (< 100ms)', async () => {
      const code = generateLargeComponent(50);
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(100);
    });

    test('should process large components within reasonable time (< 200ms)', async () => {
      const code = generateLargeComponent(100);
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(200);
    });

    test('should process template literals efficiently (< 150ms)', async () => {
      const code = generateLargeTemplateComponent(50);
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(150);
    });

    test('should scale reasonably with class count', async () => {
      const sizes = [10, 20, 40];
      const times = [];

      for (const size of sizes) {
        const code = generateLargeComponent(size);
        
        const { durationMs } = await measureTime(async () => {
          const eslint = new ESLint({
            baseConfig: eslintConfig,
            overrideConfigFile: true
          });
          
          return await eslint.lintText(code, { filePath: 'test.jsx' });
        });

        times.push(durationMs);
      }

      // Check that performance scales reasonably (not exponentially)
      const ratio1 = times[1] / times[0]; // 20 vs 10 classes
      const ratio2 = times[2] / times[1]; // 40 vs 20 classes
      
      // Should not be more than 5x slower when doubling class count
      expect(ratio1).toBeLessThan(5);
      expect(ratio2).toBeLessThan(5);
    }, 10000); // Increase timeout for scaling test
  });

  describe('Multiple Components Performance', () => {
    test('should process multiple components efficiently (< 300ms)', async () => {
      const components = Array.from({ length: 10 }, (_, i) => 
        `<div key="${i}" className="flex p-4 border grid shadow-lg">Component ${i}</div>`
      );
      const code = `<div>${components.join('\n')}</div>`;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(300);
    });

    test('should handle nested components efficiently (< 400ms)', async () => {
      let code = '<div className="grid bg-white shadow-lg">';
      for (let i = 0; i < 20; i++) {
        code += `<div className="flex p-${i % 8} border-${i % 4} text-gray-${(i % 9) * 100}">Nested ${i}</div>`;
      }
      code += '</div>';
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(400);
    });
  });

  describe('Inline CSS Rule Performance', () => {
    test('should process inline styles efficiently (< 100ms)', async () => {
      const code = generateInlineStyleComponent();
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(100);
    });

    test('should process large style objects efficiently (< 150ms)', async () => {
      const styleProps = [];
      const cssProps = [
        'display: "flex"', 'position: "sticky"', 'float: "left"', 
        'padding: "16px"', 'margin: "8px"', 'borderStyle: "double"',
        'backgroundColor: "#ffffff"', 'color: "#000000"'
      ];
      
      for (let i = 0; i < 20; i++) {
        styleProps.push(cssProps[i % cssProps.length]);
      }
      
      const code = `<div style={{ ${styleProps.join(', ')} }}>Styled component</div>`;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(150);
    });
  });

  describe('Memory Usage', () => {
    test('should not cause memory leaks with repeated processing', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process the same component multiple times
      for (let i = 0; i < 50; i++) {
        const code = generateLargeComponent(20);
        
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        await eslint.lintText(code, { filePath: 'test.jsx' });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      // Memory increase should be reasonable (less than 20MB)
      expect(memoryIncrease).toBeLessThan(20);
    }, 15000); // Increase timeout for memory test
  });

  describe('Real-world Scenarios', () => {
    test('should handle typical React component efficiently (< 200ms)', async () => {
      const code = `
        function Card({ title, description, variant = 'default' }) {
          return (
            <div className={\`
              bg-white shadow-lg border rounded-lg p-6 max-w-sm mx-auto
              \${variant === 'primary' ? 'border-blue-500 text-blue-900' : 'border-gray-200'}
              \${variant === 'danger' ? 'border-red-500 text-red-900' : ''}
            \`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <button className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <p className="text-gray-600 mb-4">{description}</p>
              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                  Save
                </button>
              </div>
            </div>
          );
        }
      `;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(200);
    });

    test('should handle dashboard layout efficiently (< 300ms)', async () => {
      const code = `
        <div className="min-h-screen bg-gray-100">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-3 bg-white shadow-sm">
              <nav className="p-4 space-y-2">
                {[1,2,3,4,5].map(i => (
                  <a key={i} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                    Link {i}
                  </a>
                ))}
              </nav>
            </aside>
            <main className="col-span-9">
              <div className="grid grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Widget {i}</h3>
                    <p className="text-gray-600">Content here</p>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      `;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(300);
    });
  });

  describe('Edge Cases Performance', () => {
    test('should handle very long class strings efficiently (< 150ms)', async () => {
      const longClassString = Array.from({ length: 200 }, (_, i) => `class-${i}`).join(' ');
      const code = `<div className="${longClassString}">Long classes</div>`;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(150);
    });

    test('should handle complex template expressions efficiently (< 100ms)', async () => {
      const code = `
        <div className={\`
          \${condition1 ? 'bg-white shadow-lg' : 'bg-gray-100'}
          \${condition2 ? 'border-blue-500' : 'border-gray-200'}
          \${condition3 ? 'text-red-500' : 'text-gray-500'}
          flex items-center p-4 rounded
        \`}>
          Complex template
        </div>
      `;
      
      const { durationMs } = await measureTime(async () => {
        const eslint = new ESLint({
          baseConfig: eslintConfig,
          overrideConfigFile: true
        });
        
        return await eslint.lintText(code, { filePath: 'test.jsx' });
      });

      expect(durationMs).toBeLessThan(100);
    });
  });
});