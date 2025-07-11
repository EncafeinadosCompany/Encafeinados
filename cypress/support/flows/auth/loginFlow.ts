/// <reference types="cypress" />

import { mockLoginSuccess } from "../../api/login";

interface UserProps {
  email?: string,
  password?: string
  roles?: Array<"Super Administrador" |"Administrador de Sucursal"| "Administrador de Tienda" | "Cliente">
  name?: string
  storeId?: number
  branchId?: number
}

export function doLogin({
  email = "admin@example.com",
  password = "1234",
  roles = ["Super Administrador"],
  name = "Santiago",
  storeId,
  branchId,
}: UserProps) {

  mockLoginSuccess({ email, roles, name, storeId, branchId });
  cy.get("input[name=email]").type(email);
  cy.get("[data-testid='custom-input-password']").type(password);
  cy.get("button[type=submit]").click();
  cy.wait("@login");
}
