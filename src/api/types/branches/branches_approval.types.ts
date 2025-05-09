export interface SocialBranch {
  social_network_name: string;
  value: string;
  description: string;
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
  is_open: boolean;
  store_name?: string;
  store?: {
    store_id: number;
    store_name: string;
    store_logo: string;
    store_email: string;
  };
  social_branches?: SocialBranch[];
}

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

export type PendingBranchesResponse = PendingBranch[];

export interface BranchesResponseList {
  message: string;
  branches: {
    branches: Branch[];
  };
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



export interface Criteria {
  name: string;
  description: string;
}

export interface CriteriaResponse {
  criteria: Criteria;
  responseText: string;
  imageUrl: string | null;
}

export interface BranchInApproval {
  id: number;
  name: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface BranchApprovalDetails {
  approvalId: number;
  status: string;
  updatedAt: string;
  comments: string | null;
  branch: BranchInApproval;
  criteriaResponses: CriteriaResponse[];
  approvedBy: string | null;
}

export interface ApprovedBranch {
  id: number;
  name: string;
  address: string;
  status: string;
  store_logo: string;
  store_email: string;
}

export interface ValidateVisitInput {
  branchId: string;
  latitude: number;
  longitude: number;
}

export interface StampInfo {
  logo: string;
  name: string;
}

export interface VisitResponseData {
  coffeecoins_earned: number;
  stamp: StampInfo;
}

export interface ValidateVisitResponse {
  message: string;
  data: VisitResponseData;
}

export interface ValidateVisitInput {
  branchId: string;
  latitude: number;
  longitude: number;
}

export type ApprovedBranchesResponse = ApprovedBranch[];
