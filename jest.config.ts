import type { Config } from 'jest'

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  // setupFilesAfterEnv runs AFTER the test framework is installed
  // so expect/beforeEach/afterEach globals are available
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: { jsx: 'react-jsx', esModuleInterop: true },
    }],
  },
  clearMocks: true,   // auto-clear mock.calls/.instances/.results between tests
  testMatch: ['<rootDir>/tests/unit/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    'src/components/**/*.tsx',
    '!src/**/*.d.ts',
  ],
}

export default config
