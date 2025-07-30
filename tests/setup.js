/**
 * Jest test setup file
 * Runs before each test suite
 */

// Global test utilities and configurations
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};