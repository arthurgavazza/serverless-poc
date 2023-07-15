module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
};
