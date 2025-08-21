import { useQuery } from '@tanstack/react-query'
import { BrancheIDresponse, BranchesImagen, BranchesResponse, image, SearchBranchesResponse} from '../../types/branches/branches.types'
import { BranchesResponseList, PendingBranchesResponse, BranchApprovalDetails, ApprovedBranchesResponse, RejectedBranchesResponse } from '../../types/branches/branches_approval.types'

import AuthClient from '@/api/client/axios'
import { BranchAttributesResponse } from '@/api/types/branches/branch_attributes.types'
import { defaultRetryConfig, isValidId } from '../Config/Config.Qurey'
import { de } from 'date-fns/locale'


const authClient = new AuthClient()
export const useBranches = () => {
  return useQuery<BranchesResponseList, Error>({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponseList>('/branches');
      return response;
    },
    
  });
};


export const useBranchesID = (id?: string | number) => {
  return useQuery<BrancheIDresponse>({
    queryKey: ['branches', id],
    queryFn: async () => {
      const response = await authClient.get<BrancheIDresponse>(`/branches/${id}`)
      return response
    },
    enabled: isValidId(id),
    ...defaultRetryConfig
  })
}

export const useImagenBranch = (id:string) => {

  return useQuery<image[]>({
    queryKey: ['branches_imagen'],
    queryFn: async (): Promise<image[]> => {
      const response = await authClient.get<BranchesImagen>(`/images/branch/${id}`);
      return response.images ?? [];
    },
    enabled: isValidId(id),
    staleTime: 1000 * 60 * 5,
    ...defaultRetryConfig
  });
}

export const usePendingBranches = () => {
  return useQuery<BranchesResponse>({
    queryKey: ['branches', 'PENDING'],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>('/branches/status/PENDING')
      return response
    },
  })
}

export const useBranch = (branchId: number | undefined) => {
  return useQuery<BranchesResponse, Error>({
    queryKey: ['branches', 'stores', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>(`/branches/${branchId}`)
      return response
    },
    enabled: isValidId(branchId),
    ...defaultRetryConfig
  })
}

export const usePendingBranchesQuery = () => {
  return useQuery<PendingBranchesResponse>({
    queryKey: ['branches', 'pending'],
    queryFn: async () => {
      const response = await authClient.get<PendingBranchesResponse>('/branches/status/PENDING')
      return response
    },
    refetchOnWindowFocus: false,
    ...defaultRetryConfig
  })
}

export const useBranchApprovalDetails = (branchId: number | undefined) => {
  return useQuery<BranchApprovalDetails, Error>({
    queryKey: ['branches','branch-approvals', 'detail', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`)
      return response
    },
     enabled:isValidId(branchId),

  })
}

export const useApprovedBranches = () => {
  return useQuery<ApprovedBranchesResponse>({
    queryKey: ['branches', 'APPROVED'],
    queryFn: async () => {
      const response = await authClient.get<ApprovedBranchesResponse>('/branches/status/APPROVED')
      return response
    },
    
  })
}

export const useRejectedBranches = () => {
  return useQuery<RejectedBranchesResponse>({
    queryKey: ['branches', 'REJECTED'],
    queryFn: async () => {
      const response = await authClient.get<RejectedBranchesResponse>('/branches/status/REJECTED')
      return response
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useBranchAttributes = (branchId: string | number | undefined) => {
  return useQuery<BranchAttributesResponse>({
    queryKey: ['branchAttributes', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchAttributesResponse>(`/branch-attributes/${branchId}`);
      return response;
    },
    enabled: isValidId(branchId),
    ...defaultRetryConfig
  });
};

export const useValidateVisit = (coordinates: any, shopId: any) => {

  return {
    data: "success",
    isLoading: false,
    isError: false,
  }
}

export interface BranchSearchParams {
  q?: string;
  minRating?: number;
  isOpen?: boolean;
  lat?: number;
  lng?: number;
  sortBy?: 'distance' | 'rating';
  attributes?: string; 
}

export const useSearchBranches = (params: BranchSearchParams) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  return useQuery<SearchBranchesResponse>({
    queryKey: ['branches', 'search', params],
    queryFn: async () => {
      const response = await authClient.get<SearchBranchesResponse>(`/branches/search?${queryString}`);
      return response;
    },
    enabled: true, 
    staleTime: 1000 * 60 * 5 
  });
};