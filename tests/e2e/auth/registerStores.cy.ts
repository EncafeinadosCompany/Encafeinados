/// <reference types="cypress" />


import { mockRegisterStores, mockImagen } from "cypress/support/mocks/auth/register";

describe('Stores Registration', () => {

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid=register-link]').click();
   
    mockRegisterStores();
    mockImagen();

  });

  it('Should show the card with the correct info', () => {
    cy.contains('Tienda').should('be.visible');
    cy.contains('Cafetería de Especialidad').should('be.visible');
    cy.contains('Para baristas, tostadores y amantes del café de origen').should('be.visible');
    cy.wait(2000); 
  });

  it('Should navigate to the store registration form by clicking on', () => {
    cy.get('[data-testid="card-link-tienda"]').click();
    cy.url().should('include', '/store-registration');
    cy.wait(2000);
  });


  it("Should complete the store registration flow and handle successful API responses", () => {

    cy.visit('/store-registration');
    
    // Step 1: Fill personal data
    cy.get('input[name="name"]').type('Encafeinados');
    cy.get('input[name="email"]').type('john.doe@example.com');

    // select the option type document
    cy.get('[data-testid="type-document-select"]').click();
    cy.get('[data-testid="type-document-option-CC"]').click();
    cy.get('[data-testid="type-document-select"]').should("contain","Cédula de Ciudadanía (CC)");

    cy.get('input[name="number_document"]').type('1234567890');
    cy.get('input[name="phone_number"]').type('9876543210');

    cy.get('button[data-testid="next-button"]').click();


    // Step 2: Image
    cy.fixture('cafeino.png', 'base64').then(fileContent => {
      cy.get('input[name="logo"]').selectFile({
        contents: Cypress.Blob.base64StringToBlob(fileContent, 'image/png'),
        fileName: 'cafeino.png',
        mimeType: 'image/png'
      },
      { force: true });
    });

    cy.get('[data-testid="conditions-checkbox"]').click();

     //   // Step 4: Confirm and submit
     cy.get('button[data-testid="submit-button"]').click();

     cy.wait("@uploadImage")
     cy.wait("@registerStores").its("response.statusCode").should("eq", 201);
     
  });

});