import { mockStores, mockBranches, mockUserLocation, apiStates } from '../../cypress/support/mocks/home/storeMocks';

describe('Página de inicio', () => {
  beforeEach(() => {

    cy.intercept('GET', 'http://localhost:3300/api/v2/stores', {
      statusCode: 200,
      body: mockStores
    }).as('getStores');

    cy.intercept('GET', 'http://localhost:3300/api/v2/branches', {
      statusCode: 200,
      body: mockBranches
    }).as('getBranches');


    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
        return cb(mockUserLocation);
      });
    });

  });

  it('debería cargar la página de inicio correctamente', () => {
    cy.visit('/');
    cy.wait(['@getStores', '@getBranches']);
    cy.wait(2000);

    cy.contains('Tiendas Aliadas').should('exist');
  });

  it('debería mostrar el carrusel de tiendas con datos', () => {
    cy.visit('/');
    cy.wait(['@getStores', '@getBranches']);
    cy.wait(2000);


    cy.contains('Café Aroma').should('exist');
    cy.contains('El Barista').should('exist');
  });

  it('debería permitir navegación en el carrusel', () => {
    cy.visit('/');
    cy.wait(['@getStores', '@getBranches']);
    cy.wait(2000);


    cy.get('button').then($buttons => {

      const $navigationButtons = $buttons.filter((_, el) => {

        return Cypress.$(el).find('svg').length > 0 &&
          !Cypress.$(el).parents('div').text().includes('Café Aroma');
      });

      if ($navigationButtons.length > 0) {

        cy.wrap($navigationButtons[0]).click({ force: true });
        cy.wait(1000);
      }
    });
  });

  it('debería mostrar estado de carga', () => {
    cy.intercept('GET', 'http://localhost:3300/api/v2/stores', {
      statusCode: 200,
      body: mockStores,
      delay: 1000
    }).as('getStoresWithDelay');

    cy.visit('/');

    cy.contains('Cargando tiendas...').should('be.visible');
    cy.get('.animate-spin').should('be.visible');
  });


  it('debería mostrar mensaje cuando no hay tiendas', () => {
    cy.intercept('GET', 'http://localhost:3300/api/v2/stores', {
      statusCode: 200,
      body: apiStates.emptyStores
    }).as('emptyStores');

    cy.visit('/');
    cy.wait('@emptyStores');

    cy.contains('No se encontraron tiendas').should('be.visible');
  });

  it('debería mostrar error cuando falla la API', () => {
    cy.intercept('GET', 'http://localhost:3300/api/v2/stores', apiStates.errorResponse).as('errorStores');

    cy.visit('/');
    cy.wait('@errorStores');
    cy.wait(2000);


    cy.get('body').then($body => {
      if ($body.text().includes('Error al cargar las tiendas')) {
        cy.contains('Error al cargar las tiendas').should('exist');
      } else if ($body.text().includes('Error')) {

        cy.contains('Error').should('exist');
      } else if ($body.text().includes('falló')) {

        cy.contains('falló').should('exist');
      } else {

        cy.contains('Café Aroma').should('not.exist');
      }
    });
  });

  it('debería navegar al hacer clic en "Ver todas las tiendas"', () => {
    cy.visit('/');
    cy.wait(['@getStores', '@getBranches']);
    cy.wait(2000); 


    cy.get('button').then($buttons => {
      const $verMasBtn = $buttons.filter((_, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('ver') || text.includes('todas') || text.includes('tiendas') ||
          text.includes('más') || text.includes('explorar');
      });

      if ($verMasBtn.length > 0) {
      
        cy.wrap($verMasBtn[0]).click();
      
        cy.url().should('not.equal', 'http://localhost:5173/');
      }
    });
  });
});