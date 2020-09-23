module.exports = {
  roots: ['<rootDir>', '<rootDir>/bin', '<rootDir>/__tests__'],
  transform: {
    '.js': 'babel-jest',
    '.ts': 'ts-jest'
  },
  testRegex: '(\\.(test|spec))\\.[tj]s$', // step === cucumber!
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^bin/(.*)$': '<rootDir>/bin/$1'
  },
  setupFiles: ['dotenv/config'],
  moduleDirectories: ['node_modules', 'bin', '__tests__'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: 'reports',
        outputName: 'test-reporter.xml',
        reportedFilePath: 'absolute'
      }
    ]
  ],
  coveragePathIgnorePatterns: ['node_modules', 'print.ts'],
  collectCoverageFrom: ['bin/*.{t,j}s', 'bin/**/*.{t,j}s'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
