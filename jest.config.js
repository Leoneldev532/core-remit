const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
    'logic/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'pages/api/**/*.{ts,tsx}'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
}

module.exports = createJestConfig(config)
