export function mockLoginSuccess() {
  cy.intercept("POST", "/api/v2/users/login", {
    statusCode: 200,
    body: {
      token: "fake-jwt-token",
      user: {
        id: "123",
        name: "Santiago",
        role: "admin",
      },
    },
  }).as("login");
}
