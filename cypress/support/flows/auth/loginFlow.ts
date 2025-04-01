/// <reference types="cypress" />


export function doLogin(email = "admin@example.com", password = "123456") {
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("button[type=submit]").click();
  cy.wait("@login");
}
