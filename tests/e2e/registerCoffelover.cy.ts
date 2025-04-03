import { mockRegisterCoffelover } from "../../cypress/support/mocks/auth/registerCoffelover";

describe("Coffee Lover Registration", () => {
  beforeEach(() => {
    mockRegisterCoffelover();
    cy.visit("/coffee-lover-registration");
  });

  it("should mock the API request and handle success", () => {
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

    //   // Step 3: Confirm and submit
    cy.get('button[data-testid="submit-button"]').click();

    cy.wait("@registerCoffelover").its("response.statusCode").should("eq", 201);
  });
});
