
import { API_URL } from "../constants";
import {mockCriteria} from "../mocks/auth/criteria.mock";

export const mockGetCriteria =()=>{
    cy.intercept("GET", `${API_URL}/criteria/status/true`, {
        statusCode: 200,
        body: mockCriteria,
      }).as("getCriteria");
}