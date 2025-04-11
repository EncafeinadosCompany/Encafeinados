
/// <reference types="cypress" />





export const API_URL = Cypress.env("API_URL");


Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      return false;
    }
  });

  

