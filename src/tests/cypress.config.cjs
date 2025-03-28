const { defineConfig } = require('cypress');
const browserify = require('@cypress/browserify-preprocessor');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', browserify());
    },
  },
});