export default {
  // Use node environment for testing
  testEnvironment: 'node',

  // Support ES modules
  preset: null,

  // Transform configuration for ES modules
  transform: {},

  // Module name mapping for path aliases (correct property name)
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#validations/(.*)$': '<rootDir>/src/validations/$1',
  },

  // Test file patterns
  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.js', '**/*.test.js'],

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/server.js',
    '!**/__tests__/**',
    '!**/tests/**',
    '!**/node_modules/**',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Globals for test environment
  globals: {
    'process.env.NODE_ENV': 'test',
    'process.env.ARCJET_ENV': 'development',
  },
};
