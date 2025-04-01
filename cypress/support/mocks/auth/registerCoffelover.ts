export const mockRegisterCoffelover = () => {
    cy.intercept('POST', '**/api/v2/auth/register-client', {
      statusCode: 201,
      body: {
        message: 'Registration successful',
      },
    }).as('registerCoffelover');
};


