/// <reference types="cypress" />

import { mockLoginSuccess } from "../../api/login";

interface UserProps {
  email?: string,
  password?: string
  roles?: Array<"Super Administrador" | "Administrador de Tienda" | "Cliente">
  name?: string
}

export function doLogin({
  email = "admin@example.com",
  password = "1234",
  roles = ["Super Administrador"],
  name = "Santiago"
}: UserProps) {

  mockLoginSuccess({ email, roles, name });
  cy.get("input[name=email]").type(email);
  cy.get("[data-testid='custom-input-password']").type(password);
  cy.get("button[type=submit]").click();
  cy.wait("@login");
}
