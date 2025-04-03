export const mockRegisterCoffelover = () => {
  cy.intercept("POST", "/api/v2/clients", {
    statusCode: 201,
    body: {
      message: "Registration successful",
    },
  }).as("registerCoffelover");
};
