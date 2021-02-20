module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  setupFiles: [],
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  testPathIgnorePatterns: [
    '__testUtils__'
  ],
  testMatch: [
    '**/*.test.(js|ts)'
  ],
  roots: [
    '<rootDir>/src'
  ]
}
