export interface SocialBranch {
  social_network_id?: string;    
  social_network_name?: string;  
  value?: string;                 
  description?: string;          
  url?: string;                  
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
  details?: string;
  store_name?: string; 
  store?: {
    store_id: number;
    store_name: string;
    store_logo: string;
    store_email: string;
  };
  social_branches?: SocialBranch[];
  is_open?: boolean; 
}

export interface BranchPost {
  store_id: number;
  name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
  details?: string;
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

export interface image {
  id: number;
  image_url: string;
  image_type:string
}
export interface BranchesImagen {
 images:image[];
};


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
    details?: string;
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

// THIS IS FOR THE SEARCH IN THE MAP AND FILTERS.
export interface SearchBranchesResponse {
  totalBranches: number;
  count: number;
  branches: SearchBranch[];
}

export interface SearchBranch {
  id: number;
  name: string;
  average_rating: string;
  isOpen: boolean;
  latitude: number;
  longitude: number;
  address: string;
  store_logo: string;
}  