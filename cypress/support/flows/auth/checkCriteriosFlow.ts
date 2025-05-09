import { mockCriteria } from "../../mocks/auth/criteria.mock";


export const checkCriteriosFlow = () => {
    cy.fixture('cafeino.png', 'base64').then((fileContent) => {
        // Recorremos los criterios desde el mismo mock
        cy.wrap(null).then(() => {
          mockCriteria.forEach((criterion:any) => {
            const criteriaId = criterion.id;
    
            if (criterion.requires_image) {
              cy.get(`[data-testid="criteria-${criteriaId}-yes"]`).click();
              cy.get(`input[data-testid="criteria-${criteriaId}-image-upload"]`).selectFile({
                contents: Cypress.Buffer.from(fileContent, 'base64'),
                fileName: 'test-image.jpg',
                mimeType: 'image/jpeg',
                // encoding: 'utf-8',
              }, { force: true });
            } else if (criterion.name.includes("Otro")) {
              cy.get(`[data-testid="criteria-${criteriaId}-other"]`).click();
              cy.get(`input[data-testid="criteria-${criteriaId}-other-text"]`).type('Respuesta personalizada');
            } else {
              cy.get(`[data-testid="criteria-${criteriaId}-no"]`).click();
            }
          });
        });
      });
}