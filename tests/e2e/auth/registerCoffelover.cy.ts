import { mockRegisterCoffelover } from "cypress/support/mocks/auth/register";
import { mockLoginSuccess } from "cypress/support/mocks/auth/loginSuccess";

describe("Coffee Lover Registration", () => {
  beforeEach(() => {
    
    mockRegisterCoffelover();
    
    mockLoginSuccess(
      {
        email: "coffelover@gmail.com",
        name: "Coffelover",
        role: "Cliente"
      }
     )
    cy.visit("/coffee-lover-registration");

  });

  it("Should complete the client registration flow and handle successful API responses", () => {
    // Step 1: Fill personal data
    cy.get('input[name="name"]').type('John');
    cy.get('input[name="lastname"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('button[data-testid="next-button"]').click();

    // Step 2: Fill user data
    cy.get('[data-testid="type-document-select"]').click();
    cy.get('[data-testid="type-document-option-CC"]').click();
    cy.get('[data-testid="type-document-select"]').should("contain","Cédula de Ciudadanía (CC)");

  
    cy.get('input[name="number_document"]').type('123456789');
    cy.get('input[name="phone_number"]').type('9876543210');
    cy.get('button[data-testid="next-button"]').click();

    //   // Step 3: Fill user data autentication
    cy.get('input[name="password"]').type('1234');
    cy.get('input[name="confirmPassword"]').type('1234');
    cy.get('button[data-testid="next-button"]').click();

    //   // Step 3: Confirm checkbox
    cy.get('[data-testid="conditions-checkbox"]').click();

    //   // Step 4: Confirm and submit
    cy.get('button[data-testid="submit-button"]').click();
    cy.wait("@registerCoffelover").its("response.statusCode").should("eq", 201);
    cy.wait("@login");
  
  });
});
