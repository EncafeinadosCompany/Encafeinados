/// <reference types="cypress" />

import { mockGetBranches, mockLoginSuccess } from "cypress/support/api/login";
import { doLogin } from "cypress/support/flows/auth/loginFlow";

console.log("mockLoginSuccess", mockLoginSuccess);

describe("Login", () => {

  beforeEach(() => {
    cy.visit("/login");
    mockGetBranches();

  });

  it("Successfully logs in as admin", () => {
    doLogin({
      email: "admin@example.com",
      password: "1234",
      roles: ["Super Administrador"],
      name: "Anita",
    });
    cy.url().should("include", "/admin");
    cy.wait(2000);
  });

  it("Successfully logs in as client", () => {
    doLogin({
      email: "coffeelover@example.com",
      password: "1234",
      roles: ["Cliente"],
      name: "Coffeelover"
    });

    cy.url().should("include", "/coffeelover");
    cy.wait(2000);
  });

  it("Successfully logs in as store", () => {
    doLogin({
      email: "tienda@example.com",
      password: "1234",
      roles: ["Administrador de Tienda"],
      name: "Tienda",
      storeId: 1
      
    })
    cy.url().should("include", "/stores");
    cy.wait(2000);
  })
});
