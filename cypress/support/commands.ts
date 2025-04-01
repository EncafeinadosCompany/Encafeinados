
/// <reference types="cypress" />

export {};

Cypress.on('uncaught:exception', (err) => {
    // Ignora el error de ResizeObserver
    if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      return false; // Evita que Cypress falle el test
    }
  });


