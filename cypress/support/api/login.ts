import { API_URL } from "../constants";

interface MockUser {
  email: string;
  name: string;
  roles:  Array<"Super Administrador" | "Administrador de Tienda"|"Administrador de Sucursal" | "Cliente">
  storeId?: number | null;
  branchId?: number | null;
}

export function mockLoginSuccess( user:MockUser) {
  cy.intercept("POST", `${API_URL}/auth/login`, {
    statusCode: 200,
    body: {
      accessToken: "fake-jwt-token",
      user: {
        id: 1,
        email: user.email,
        name: user.name ,
        roles: user.roles,
      },
      ...user.storeId && { storeId: user.storeId },
      ...user.branchId && { branchId: user.branchId }
    },
  }).as("login");
}




export const mockGetBranches =()=>{
    cy.intercept("GET", `${API_URL}/branches/store/1`, {
        statusCode: 200,
        body:{},
      }).as("getBranches");
}

