'use strict';

module.exports = {
  rootDir: './',
  automock: false,
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  verbose: true,
  silent: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  moduleFileExtensions: [ 'ts', 'js', 'json', 'node' ],
  testPathIgnorePatterns: [ '/node_modules/', '__snapshots__' ],
  testMatch: [ '**/test/**/*.test.[jt]s' ],
  moduleNameMapper: {
    '@account/(.*)': '<rootDir>/src/account/$1',
    '@gateway/(.*)': '<rootDir>/src/gateway/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@transaction/(.*)': '<rootDir>/src/transaction/$1',
  },
};
