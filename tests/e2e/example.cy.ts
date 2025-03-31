/// <reference types="cypress" />

describe("Encafeinados - App básica", () => {
  it("Carga la landing page", () => {
    cy.visit("/");
    cy.contains("Encafeinados");
  });
});
