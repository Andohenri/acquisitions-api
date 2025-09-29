// Jest test setup file
// This file runs before all tests

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.ARCJET_ENV = 'development';
process.env.LOG_LEVEL = 'silent'; // Suppress logs during testing

// Mock console.warn to reduce noise in test output
const originalWarn = console.warn;
console.warn = (...args) => {
  // Filter out Arcjet warnings during tests
  if (args[0] && typeof args[0] === 'string' && args[0].includes('✦Aj')) {
    return; // Skip Arcjet warnings
  }
  originalWarn(...args);
};

// Mock console.error for Arcjet errors
const originalError = console.error;
console.error = (...args) => {
  // Filter out Arcjet errors during tests
  if (args[0] && typeof args[0] === 'string' && args[0].includes('✦Aj')) {
    return; // Skip Arcjet errors
  }
  originalError(...args);
};

// Set test database URL if needed
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/test_db';

// Set test JWT secret
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Global test timeout is set in jest.config.js

// Clean up after tests
afterAll(() => {
  // Restore original console methods
  console.warn = originalWarn;
  console.error = originalError;
});
