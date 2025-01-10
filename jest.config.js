/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // For absolute imports (optional)
  },
  testMatch: ['**/tests/**/*.test.ts'], // Ensure it runs tests in the `tests/` folder
  verbose: true,
};
