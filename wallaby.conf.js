module.exports = () => ({
  env: {
    type: "node"
  },
  files: ["src/**/*.ts"],
  tests: ["__tests__/**/*.spec.ts"],
  testFramework: "jest"
});
