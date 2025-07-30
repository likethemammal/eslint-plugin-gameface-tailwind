#!/usr/bin/env node
/**
 * Test runner for ESLint Plugin Gameface
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running ESLint Plugin Gameface Tests\n');

// Test files to run
const testFiles = [
  'tests/gameface-tailwind.test.js',
  'tests/gameface-inline-css.test.js',
  'tests/non-react.test.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Run each test file
for (const testFile of testFiles) {
  console.log(`📁 Running ${testFile}...`);
  
  try {
    // Clear require cache to ensure fresh test runs
    const fullPath = path.resolve(testFile);
    if (require.cache[fullPath]) {
      delete require.cache[fullPath];
    }
    
    // Run the test file
    require(`./${testFile}`);
    console.log(`✅ ${testFile} completed successfully\n`);
    
  } catch (error) {
    console.error(`❌ ${testFile} failed:`);
    console.error(error.message);
    console.error(error.stack);
    console.log('');
    failedTests++;
  }
}

// Summary
console.log('📊 Test Summary:');
console.log(`Total test files: ${testFiles.length}`);
console.log(`Passed: ${testFiles.length - failedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  console.log('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}