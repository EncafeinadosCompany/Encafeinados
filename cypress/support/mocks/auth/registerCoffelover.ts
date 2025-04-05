/// <reference types="cypress" />

const API_URL = Cypress.env("API_URL");

export const mockRegisterCoffelover = () => {

  cy.intercept("POST",  `${API_URL}/clients`, {
    statusCode: 201,
    body: {
      message: "Registration successful",
    },
  }).as("registerCoffelover");
};
