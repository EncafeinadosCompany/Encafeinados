// Interfaz para los datos de redes sociales
export interface SocialBranch {
  social_network_name: string;
  url: string;
  description: string;
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
  status: string; // Cambiado de boolean a string para reflejar valores como "PENDING"
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
}

export interface BranchPost {
  store_id: number;
  name: string;
  phone_number: string;
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