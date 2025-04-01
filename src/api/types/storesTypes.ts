export interface Store {
  id: number;
  name: string;
  type_document: string;
  number_document: string;
  logo: string;
  email: string;
  phone_number: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

export interface StoresResponse {
  message: string;
  stores: {
    stores: Store[];
  };
}

