#!/usr/bin/env node

/**
 * Performance benchmark script for eslint-plugin-gameface-tailwind
 * Run with: node scripts/benchmark.js
 */

const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs');

// Performance tracking utilities
class PerformanceTracker {
  constructor() {
    this.measurements = new Map();
  }

  start(label) {
    this.measurements.set(label, { start: process.hrtime.bigint() });
  }

  end(label) {
    const measurement = this.measurements.get(label);
    if (!measurement) throw new Error(`No measurement started for: ${label}`);
    
    measurement.end = process.hrtime.bigint();
    measurement.durationMs = Number(measurement.end - measurement.start) / 1_000_000;
    return measurement.durationMs;
  }

  getStats() {
    const stats = {};
    for (const [label, measurement] of this.measurements.entries()) {
      if (measurement.durationMs !== undefined) {
        stats[label] = measurement.durationMs;
      }
    }
    return stats;
  }

  reset() {
    this.measurements.clear();
  }
}

// Test file generators
function generateLargeReactComponent(classCount = 100) {
  const classes = [];
  const mixedClasses = [
    'flex', 'block', 'grid', 'bg-white', 'text-gray-500', 'p-4', 'mb-2', 
    'border', 'rounded', 'shadow-lg', 'max-w-md', 'mx-auto', 'hover:bg-blue-500',
    'focus:ring-2', 'focus:ring-blue-500', 'transition-colors', 'duration-200'
  ];
  
  for (let i = 0; i < classCount; i++) {
    classes.push(mixedClasses[i % mixedClasses.length]);
  }
  
  return `
import React from 'react';

function LargeComponent() {
  return (
    <div className="${classes.join(' ')}">
      <h1 className="text-2xl font-bold text-gray-800">Large Component</h1>
      <p className="text-gray-600 mb-4">This component has many classes.</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
        Action Button
      </button>
    </div>
  );
}

export default LargeComponent;
  `;
}

function generateComplexDashboard() {
  return `
import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
              New Item
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full p-3 mr-4">
                  <span className="text-lg font-semibold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Metric {i + 1}</h3>
                  <p className="text-gray-600">$12,345</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chart 1</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">Chart placeholder</span>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chart 2</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">Chart placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
  `;
}

function generateFormComponent() {
  return `
import React from 'react';

function ComplexForm() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complex Form</h2>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ display: "block", position: "relative", float: "none" }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              style={{ display: "flex", gridColumn: "span 2", float: "left" }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            Submit Form
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplexForm;
  `;
}

// ESLint configuration
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
    'gameface-tailwind': require('../index')
  },
  rules: {
    'gameface-tailwind/classes': ['error', { autofix: true }],
    'gameface-tailwind/inline-css': ['error', { autofix: true }]
  }
};

async function runBenchmark() {
  console.log('🚀 Running ESLint Plugin Performance Benchmark\n');
  
  const tracker = new PerformanceTracker();
  
  // Test scenarios
  const scenarios = [
    {
      name: 'Small Component (10 classes)',
      code: generateLargeReactComponent(10),
      expectedTime: 20
    },
    {
      name: 'Medium Component (50 classes)',
      code: generateLargeReactComponent(50),
      expectedTime: 50
    },
    {
      name: 'Large Component (100 classes)',
      code: generateLargeReactComponent(100),
      expectedTime: 100
    },
    {
      name: 'Complex Dashboard',
      code: generateComplexDashboard(),
      expectedTime: 150
    },
    {
      name: 'Form with Inline CSS',
      code: generateFormComponent(),
      expectedTime: 100
    }
  ];

  const results = [];

  for (const scenario of scenarios) {
    console.log(`Testing: ${scenario.name}`);
    
    const eslint = new ESLint({
      baseConfig: eslintConfig,
      overrideConfigFile: true
    });

    tracker.start(scenario.name);
    
    try {
      const lintResults = await eslint.lintText(scenario.code, {
        filePath: 'test-file.jsx'
      });
      
      const duration = tracker.end(scenario.name);
      const errorCount = lintResults[0]?.errorCount || 0;
      const warningCount = lintResults[0]?.warningCount || 0;
      
      const result = {
        name: scenario.name,
        duration: Math.round(duration * 100) / 100,
        expectedTime: scenario.expectedTime,
        passed: duration < scenario.expectedTime,
        errors: errorCount,
        warnings: warningCount,
        status: duration < scenario.expectedTime ? '✅' : '❌'
      };
      
      results.push(result);
      
      console.log(`  Duration: ${result.duration}ms (expected < ${scenario.expectedTime}ms) ${result.status}`);
      console.log(`  Issues found: ${errorCount} errors, ${warningCount} warnings\n`);
      
    } catch (error) {
      console.error(`  Error: ${error.message}\n`);
      results.push({
        name: scenario.name,
        duration: 0,
        expectedTime: scenario.expectedTime,
        passed: false,
        errors: 0,
        warnings: 0,
        status: '❌',
        error: error.message
      });
    }
  }

  // Memory usage test
  console.log('Testing memory usage...');
  const initialMemory = process.memoryUsage();
  
  for (let i = 0; i < 50; i++) {
    const eslint = new ESLint({
      baseConfig: eslintConfig,
      overrideConfigFile: true
    });
    
    await eslint.lintText(generateLargeReactComponent(20), {
      filePath: 'test-file.jsx'
    });
  }
  
  if (global.gc) {
    global.gc();
  }
  
  const finalMemory = process.memoryUsage();
  const memoryIncrease = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;
  
  console.log(`Memory increase: ${Math.round(memoryIncrease * 100) / 100}MB\n`);

  // Summary
  console.log('📊 Benchmark Results Summary');
  console.log('━'.repeat(60));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  console.log(`Memory usage: ${memoryIncrease < 50 ? '✅' : '❌'} (${Math.round(memoryIncrease * 100) / 100}MB increase)`);
  
  console.log('\nDetailed Results:');
  results.forEach(result => {
    console.log(`${result.status} ${result.name}: ${result.duration}ms`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  const slowTests = results.filter(r => !r.passed);
  if (slowTests.length === 0) {
    console.log('✅ All performance targets met!');
  } else {
    slowTests.forEach(test => {
      console.log(`⚠️  ${test.name} exceeded target by ${Math.round((test.duration - test.expectedTime) * 100) / 100}ms`);
    });
  }

  if (memoryIncrease > 50) {
    console.log('⚠️  Memory usage is higher than expected - consider optimization');
  }

  console.log('\n🏁 Benchmark completed!');
  
  // Exit with error code if any tests failed
  if (passedTests < totalTests || memoryIncrease > 50) {
    process.exit(1);
  }
}

// Run the benchmark
if (require.main === module) {
  runBenchmark().catch(error => {
    console.error('Benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = { runBenchmark };