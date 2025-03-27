export interface Store {
  id: number;
  name: string;
  type_document: string;
  number_document: string;
  logo: string;
  email: string;
  phone_number: string;
  status: string;
  latitude?: number; // Agregamos para cálculo de distancia
  longitude?: number; // Agregamos para cálculo de distancia
}

export interface StoresResponse {
  message: string;
  stores: {
    store: Store[];
  };
}