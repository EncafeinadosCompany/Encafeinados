import { API_URL } from "../constants";

import {socialNetworkMock} from "../mocks/auth/social_network.mock";

export const mockGetSocialNetwork =()=>{
    cy.intercept("GET", `${API_URL}/social-networks`, {
        statusCode: 200,
        body: socialNetworkMock,
      }).as("getCriteria");
}