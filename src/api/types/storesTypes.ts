export interface Store {
  id: number;
  name: string;
  type_document: string;
  number_document: string;
  logo: string;  // Asegúrate de que el campo 'logo' exista
  email: string;
  phone_number: string;
  status: string;
}

export interface StoresResponse {
  message: string;
  stores: {
    store: Store[];
  };
}