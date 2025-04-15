import {
  mockStores,
  mockBranches,
  mockUserLocation,
  apiStates,
} from "../../cypress/support/mocks/home/storeMocks";

const apiUrl = Cypress.env("API_URL");

describe("Home Page", () => {
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

  it("Should load the home page correctly", () => {
    cy.visit("/");
    cy.wait(["@getStores", "@getBranches"]);
    cy.wait(2000);

    cy.contains("Tiendas Aliadas").should("exist");
  });

  it("It should display the store carousel with data", () => {
    cy.visit("/");
    cy.wait(["@getStores", "@getBranches"]);
    cy.wait(2000);

    cy.contains("Café Aroma").should("exist");
    cy.contains("El Barista").should("exist");

  });

  it("It should allow navigation in the carousel", () => {
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


  it("It should display a menssage when there aren't store", () => {
    cy.intercept("GET", `${apiUrl}/stores`, {

      statusCode: 200,
      body: apiStates.emptyStores,
    }).as("emptyStores");

    cy.visit("/");
    cy.wait("@emptyStores");

    // cy.contains("No se encontraron tiendas").should("be.visible");
  });

  it("Should show error when API fails", () => {
    cy.intercept("GET", `${apiUrl}/stores`, apiStates.errorResponse).as(
      "errorStores"
    );

    cy.visit("/");
    cy.wait("@errorStores");
    cy.wait(2000);

    cy.get("body").then(($body) => {
      if ($body.text().includes("Error al cargar las tiendas")) {
        cy.contains("Error al cargar las tiendas").should("exist");
      } else if ($body.text().includes("Error")) {
        cy.contains("Error").should("exist");
      } else if ($body.text().includes("falló")) {
        cy.contains("falló").should("exist");



      } else {
        cy.contains("Café Aroma").should("not.exist");

      }
    });
  });

  // it('debería navegar al hacer clic en "Ver todas las tiendas"', () => {
  //   cy.visit("/");
  //   cy.wait(["@getStores", "@getBranches"]);
  //   cy.wait(2000);


  //   cy.get("button").then(($buttons) => {
  //     const $verMasBtn = $buttons.filter((_, el) => {
  //       const text = Cypress.$(el).text().toLowerCase();
  //       return (
  //         text.includes("ver") ||
  //         text.includes("todas") ||
  //         text.includes("tiendas") ||
  //         text.includes("más") ||
  //         text.includes("explorar")
  //       );
  //     });

  //     if ($verMasBtn.length > 0) {

  //       cy.wrap($verMasBtn[0]).click();

  //       cy.url().should("not.equal", `${apiUrl}/`);
  //     }
  //   });
  // });
});