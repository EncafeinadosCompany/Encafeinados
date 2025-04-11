// Interfaz para los datos de redes sociales
export interface SocialBranch {
  social_network_name: string;
  value: string;
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
  social_branches?: SocialBranch[];
  criteria?: any;
}

// Interface específica para la respuesta de branches pendientes
export interface PendingBranch {
  id: number;
  name: string;
  address?: string;
  status: string;
  store_logo?: string;
  store_email?: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
  average_rating?: string;
  store_name?: string;
  store?: {
    store_id: number;
    store_name: string;
    store_logo: string;
    store_email: string;
  };
  social_branches?: SocialBranch[];
}

// Tipo para la respuesta completa de la API
export type PendingBranchesResponse = PendingBranch[];
  
export interface BranchesResponse {
  message: string;
  branches: Branch[];
  
}