import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // Vite
    supportFile: "cypress/support/e2e.ts",
    specPattern: "tests/e2e/**/*.cy.ts",
    setupNodeEvents(on, config) {
      // Puedes agregar listeners si lo necesitas
    },
  },
});
