export interface SocialBranch {
  social_network_id?: string;    
  social_network_name?: string;  
  value?: string;                 
  description?: string;          
  url?: string;                  
}

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
  name: string;
  phone_number?: string;
  average_rating?: string;
  status: string; 
  latitude: number;
  longitude: number;
  address?: string;
  store_name?: string; 
  store?: {
    store_id: number;
    store_name: string;
    store_logo: string;
    store_email: string;
  };
  social_branches?: SocialBranch[];
  is_open?: boolean; // Nuevo campo añadido
}

export interface BranchPost {
  store_id: number;
  name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
  social_branches?: SocialBranch[];
  criteria?: any;
}


  
export interface BranchesResponse {
  message: string;
  branches: {
    branches: Branch[];
  }
}


export interface BranchesResponseStore {
  message: string;
    branches: Branch[];
 
}


export interface BranchesImagen {
  id: number;
  image_url: string;
}[];


export interface BrancheIDresponse {
  branch: {
    id: number;
    name: string;
    phone_number: string;
    average_rating: string;
    status: string;
    latitude: number;
    longitude: number;
    address: string;
    is_open: boolean;
    store: {
      store_id: number;
      store_name: string;
      store_logo: string;
      store_email: string;
    };
    social_branches: {
      social_network_id: string;
      value: string;
      description: string;
    }[];
  };
}