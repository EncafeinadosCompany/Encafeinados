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


export interface RegisterStoreDto {
  name: string
  email: string,
  logo: string | File,
  type_document: number
  number_document: string
  phone_number: string
}

export interface StoresResponse {
  message: string;
  stores: {
    stores: Store[];
  };
}


export interface responseStores  {
  store: {
      id: string;
      name: string;
  }
}
