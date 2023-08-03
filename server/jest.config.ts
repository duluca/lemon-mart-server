/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testPathIgnorePatterns: [".d.ts", ".js"],
  // All imported modules in your tests should be mocked automatically
  // automock: false,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 67,
      lines: 82,
      functions: 65,
      statements: 82,
    },
  },

  testEnvironment: "node",
  testTimeout: 10000,
};

export default config;
