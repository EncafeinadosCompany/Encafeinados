import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173", // Vite
    supportFile: "cypress/support/e2e.ts",
    specPattern: "tests/e2e/**/*.cy.ts",
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
  },
});
