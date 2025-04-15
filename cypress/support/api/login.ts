import { API_URL } from "../constants";

interface MockUser {
  email: string;
  name: string;
  role: "Super Administrador" | "Administrador de Tienda" | "Cliente";
}

export function mockLoginSuccess( user:MockUser) {
  cy.intercept("POST", `${API_URL}/auth/login`, {
    statusCode: 200,
    body: {
      token: "fake-jwt-token",
      user: {
        id: 1,
        email: user.email,
        name: user.name ,
        role: user.role,
      },
    },
    storeOrBranchId: 1
  }).as("login");
}