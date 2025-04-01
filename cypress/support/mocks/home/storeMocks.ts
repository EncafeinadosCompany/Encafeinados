import { StoresResponse } from '../../../../src/api/types/storesTypes';
import { BranchesResponse } from '../../../../src/api/types/branchesTypes';

// Datos mock para las tiendas
export const mockStores: StoresResponse = {
  message: "Stores retrieved successfully",
  stores: {
    stores: [
      {
        id: 1,
        name: "Café Aroma",
        type_document: "NIT",
        number_document: "900123456",
        logo: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
        email: "info@cafearoma.com",
        phone_number: "+57 300 1234567",
        status: "active"
      },
      {
        id: 2,
        name: "El Barista",
        type_document: "NIT",
        number_document: "900123457",
        logo: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
        email: "contacto@elbarista.com",
        phone_number: "+57 300 7654321",
        status: "active"
      },
      {
        id: 3,
        name: "Café del Valle",
        type_document: "NIT",
        number_document: "900123458",
        logo: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
        email: "info@cafedelvalle.com",
        phone_number: "+57 300 9876543",
        status: "active"
      }
    ]
  }
};

// Datos mock para las sucursales
export const mockBranches: BranchesResponse = {
  message: "Branches retrieved successfully",
  branches: {
    branches: [
      {
        id: 1,
        store_name: "Café Aroma",
        name: "Sede Centro",
        phone_number: "+57 300 1234567",
        average_rating: "4.5",
        status: true,
        latitude: 4.624335,
        longitude: -74.063644,
        address: "Calle 10 # 5-51"
      },
      {
        id: 2,
        store_name: "Café Aroma",
        name: "Sede Norte",
        phone_number: "+57 300 1234568",
        average_rating: "4.7",
        status: true,
        latitude: 4.724335,
        longitude: -74.053644,
        address: "Calle 100 # 15-20"
      },
      {
        id: 3,
        store_name: "El Barista",
        name: "Sede Principal",
        phone_number: "+57 300 7654321",
        average_rating: "4.2",
        status: true,
        latitude: 4.654335,
        longitude: -74.083644,
        address: "Carrera 7 # 45-10"
      }
    ]
  }
};

// Ubicación mock del usuario
export const mockUserLocation = {
  coords: {
    latitude: 4.654335,
    longitude: -74.073644,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
};

// Estados de API para pruebas específicas
export const apiStates = {
  emptyStores: {
    message: "Stores retrieved successfully",
    stores: {
      stores: []
    }
  },
  errorResponse: {
    statusCode: 500,
    body: {
      message: "Internal Server Error"
    }
  }
};