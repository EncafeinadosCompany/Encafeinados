/// <reference types="cypress" />

import { mockLoginSuccess } from "../../../cypress/support/mocks/auth/loginSuccess";
// import { doLogin } from "../../../cypress/support/flows/auth/loginFlow";

describe("Login", () => {
  it("loguea correctamente al admin", () => {
    mockLoginSuccess();
    cy.visit("/login");

    // cy.contains("Inicia sesión Encafeinados");
    //doLogin();
  });
});
