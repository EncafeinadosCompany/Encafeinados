
export interface Store {
  id: number;
  name: string;
  type_document: string;
  number_document: string;
  logo: string;
  email: string;
  phone_number: string;
  status: string;
}
  
  export interface Branch {
    id: number;
    store_name: string;
    name: string;
    phone_number: string;
    average_rating: string;
    status: boolean;
    latitude: number;
    longitude: number;
    address: string;
  }
  
  export interface BranchesResponse {
    message: string;
    branches: {
      branches: Branch[];
    };
  }