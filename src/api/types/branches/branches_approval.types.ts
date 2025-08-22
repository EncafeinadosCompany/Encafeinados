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
  id: string;
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
  id: string;
  name: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  address: string;
  store_name?: string;
  store_logo?: string;
  store_email?: string;
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
  id: string;
  name: string;
  address: string;
  status: string;
  store_logo: string;
  store_email: string;
  average_rating?: string;
}

export interface ValidateVisitInput {
  branchId: string;
  latitude: number;
  longitude: number;
}

export type ApprovedBranchesResponse = ApprovedBranch[];

export interface RejectedBranch {
  id: string;
  name: string;
  address: string;
  status: string;
  store_logo: string;
  store_email: string;
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
  rejection_reason?: string;
  rejected_at?: string;
  rejected_by?: string;
  social_branches?: SocialBranch[];
}

export type RejectedBranchesResponse = RejectedBranch[];
