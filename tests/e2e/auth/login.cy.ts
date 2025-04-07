/// <reference types="cypress" />

import { mockLoginSuccess } from "../../../cypress/support/mocks/auth/loginSuccess";
import { doLogin } from "../../../cypress/support/flows/auth/loginFlow";

console.log("mockLoginSuccess", mockLoginSuccess);

describe("Login", () => {
  
  it("successfully logs in as admin", () => {
    doLogin({
      email: "admin@example.com",
      password: "1234",
      role: "Super Administrador",
      name: "Anita",
    });
    cy.url().should("include", "/admin"); 
    cy.wait(2000);    
  });

  it("successfully logs in as client", () => {
    doLogin({
       email: "coffeelover@example.com",
       password: "1234",
       role: "Cliente",
       name: "Coffeelover"
    });

    cy.url().should("include", "/coffeelover");
    cy.wait(2000); 
  });

  it("successfully logs in as store", () => {
    doLogin({
      email:"tienda@example.com",
      password: "1234",
      role: "Administrador de Tienda",
      name: "Tienda" 
    }) 
    cy.url().should("include", "/store");
  })
});
