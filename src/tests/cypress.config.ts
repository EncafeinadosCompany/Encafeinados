import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    baseUrl:`http://localhost:5173`,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
