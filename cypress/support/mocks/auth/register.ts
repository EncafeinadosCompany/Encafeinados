/// <reference types="cypress" />

import { API_URL } from "../../constants";

export const mockRegisterCoffelover = () => {

  cy.intercept("POST", `${API_URL}/clients`, {
    statusCode: 201,
    body: {
      message: "Registration successful",
      client: {
          person: {
            user_email: 'coffeelover@example.com'
          }
        }
    },
  }).as("registerCoffelover");
};

export const mockRegisterStores = () => {
  cy.intercept("POST", `${API_URL}/stores`, {
    statusCode: 201,
    body: {
      message: "Registration successful",
        store: {
          id: 123,
          name: "Tienda de prueba",
        }
      
    },
  }).as("registerStores");
};

export const mockImagen = () =>{
  cy.intercept('POST', `${API_URL}/images/upload`, {
  statusCode: 200,
  body: {
    image: {
      url: "https://fakeurl.com/fakeimage.png"
    }
  }
}).as('uploadImage');
}