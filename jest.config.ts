import { defaults } from "jest-config";
import path from "path";

export default {
  rootDir: path.resolve(__dirname),
  ...defaults,

  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  testMatch: ["<rootDir>/tests/unit/**/*.test.(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  verbose: true,
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },

  // Cobertura mínima requerida
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
