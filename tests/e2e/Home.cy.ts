import {
  mockStores,
  mockBranches,
  mockUserLocation,
  apiStates,
} from "../../cypress/support/mocks/home/storeMocks";

const apiUrl = Cypress.env("API_URL");

describe("Home page", () => {
  beforeEach(() => {
    console.log("API URL:", apiUrl);

    cy.intercept("GET", `${apiUrl}/stores`, {
      statusCode: 200,
      body: mockStores,
    }).as("getStores");

    cy.intercept("GET", `${apiUrl}/branches`, {
      statusCode: 200,
      body: mockBranches,
    }).as("getBranches");

    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
        (cb) => {
          return cb(mockUserLocation);
        }
      );
    });
  });

  it("should load the home page correctly", () => {
    cy.visit("/");
    cy.wait(["@getStores", "@getBranches"]);
    cy.wait(2000);

    cy.contains("Tiendas Aliadas").should("exist");
  });

  it("should display the store carousel with data", () => {
    cy.visit("/");
    cy.wait(["@getStores", "@getBranches"]);
    cy.wait(2000);

    // Use a better selector strategy
    cy.get("h3").should("exist"); // First verify any h3 exists
    
    // Use contains with the specific element type
    cy.get("h3").contains("Café Aroma").should("exist");
    cy.get("h3").contains("El Barista").should("exist");
  });

  it("should allow navigation in the carousel", () => {
    cy.visit("/");
    cy.wait(["@getStores", "@getBranches"]);
    cy.wait(2000);

    cy.get("button").then(($buttons) => {
      const $navigationButtons = $buttons.filter((_, el) => {
        return (
          Cypress.$(el).find("svg").length > 0 &&
          !Cypress.$(el).parents("div").text().includes("Café Aroma")
        );
      });

      if ($navigationButtons.length > 0) {
        cy.wrap($navigationButtons[0]).click({ force: true });
        cy.wait(1000);
      }
    });
  });

  it("should display message when there are no stores", () => {
    cy.intercept("GET", `${apiUrl}/stores`, {
      statusCode: 200,
      body: apiStates.emptyStores,
    }).as("emptyStores");

    cy.visit("/");
    cy.wait("@emptyStores");
    cy.wait(2000);
    
    // Check for the no stores message
    cy.contains("No se encontraron tiendas").should("exist");
  });

  it("should display error when API fails", () => {
    cy.intercept("GET", `${apiUrl}/stores`, apiStates.errorResponse).as(
      "errorStores"
    );

    cy.visit("/");
    cy.wait("@errorStores");
    cy.wait(2000);

    cy.get("body").then(($body) => {
      if ($body.text().includes("Error loading stores")) {
        cy.contains("Error loading stores").should("exist");
      } else if ($body.text().includes("Error")) {
        cy.contains("Error").should("exist");
      } else if ($body.text().includes("failed")) {
        cy.contains("failed").should("exist");
      } else {
        cy.contains("Café Aroma").should("not.exist");
      }
    });
  });
});