
import {mockGetCriteria} from "cypress/support/api/criteria";
import {mockGetSocialNetwork} from "cypress/support/api/socialNetwork";

import {checkCriteriosFlow} from "cypress/support/flows/auth/checkCriteriosFlow";

describe('template spec', () => {
  
    beforeEach(() => {
      cy.visit('/stores-registration/branches/123');
      mockGetCriteria(); 
      mockGetSocialNetwork();
    })

    

    it("Should complete the store registration flow and handle successful API responses", () => {
      // Step 1: Fill personal data
      cy.get('input[name="name"]').type('Encafeinados junior');
      cy.get('input[name="phone_number"]').type('123456789');

      cy.get('button[data-testid="next-button"]').click();

      //Step 2: Fill criteria
      // cy.wait ('@getCriteria');
      checkCriteriosFlow();

      cy.get('button[data-testid="next-button"]').click();

      //Step 3: Fill location
      cy.get('input[data-testid="search-input-location"').type('Calle 80, Localidad Chapinero, Bogotá, Bogotá, Distrito Capital, Colombia');
      
      cy.wait(4000);
      cy.get('button[data-testid="next-button"]').click();

      //Step 4: Fill data aditional
      cy.get('input[name="addressDetails"]').type('#64-01');
      cy.get('input[name="nearbyReference"').type('Cerca de la plaza de la republica');
      cy.get('button[data-testid="next-button"]').click();

      //Step 5: Fill social networks
      



    });

})