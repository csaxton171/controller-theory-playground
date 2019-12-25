module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["<rootDir>/__tests__/**/*.spec.ts"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/fixtures/"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/__tests__/",
    "<rootDir>/src/config.ts"
  ],
  reporters: ["default"]
};
