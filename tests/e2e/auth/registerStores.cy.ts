/// <reference types="cypress" />


describe('stores', () => {

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid=register-link]').click();
  });

  it('debería mostrar la tarjeta con la info correcta', () => {
    cy.contains('Tienda').should('be.visible');
    cy.contains('Cafetería de Especialidad').should('be.visible');
    cy.contains('Para baristas, tostadores y amantes del café de origen').should('be.visible');
    cy.wait(2000); 
  });

  it('debería navegar al formulario de registro de tienda al hacer clic', () => {
    cy.get('[data-testid="card-link-tienda"]').click();
    cy.url().should('include', '/store-registration');
    cy.wait(2000);
  });

});