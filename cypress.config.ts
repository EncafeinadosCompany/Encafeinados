import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import codeCoverage from "@cypress/code-coverage/task";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Vite
    supportFile: "cypress/support/e2e.ts",
    specPattern: "tests/e2e/**/*.cy.ts",
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
    env: {
      API_URL: process.env.VITE_API_URL || "http://localhost:3000",
    },
  

  },
});
