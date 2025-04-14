/// <reference types="cypress" />

import { mockLoginSuccess } from "cypress/support/mocks/auth/loginSuccess";

interface UserProps {
  email?: string,
  password?: string
  role?: "Super Administrador" | "Administrador de Tienda" | "Cliente"
  name?: string
}

export function doLogin({
  email = "admin@example.com",
  password = "1234",
  role = "Super Administrador",
  name = "Santiago"
}: UserProps) {

  mockLoginSuccess({ email, role, name });
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("button[type=submit]").click();
  cy.wait("@login");
}
