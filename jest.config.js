/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
  coverageReporters: ['cobertura', 'html', 'lcov'],
  coveragePathIgnorePatterns: ['index.ts$'],
  testTimeout: 500,
};
