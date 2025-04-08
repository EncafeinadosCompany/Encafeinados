/// <reference types="cypress" />

import { API_URL } from "../../constants";

export const mockRegisterCoffelover = () => {

  cy.intercept("POST", `${API_URL}/clients`, {
    statusCode: 201,
    body: {
      message: "Registration successful",
    },
  }).as("registerCoffelover");
};


export const mockRegisterStores = () => {
  cy.intercept("POST", `${API_URL}/stores`, {
    statusCode: 201,
    body: {
      message: "Registration successful",
    },
  }).as("registerStores");
};
