import { useQuery } from '@tanstack/react-query'
import { BrancheIDresponse, BranchesImagen, BranchesResponse } from '../../types/branches/branches.types'
import { BranchesResponseList, PendingBranchesResponse, BranchApprovalDetails, ApprovedBranchesResponse } from '../../types/branches/branches_approval.types'

import AuthClient from '@/api/client/axios'

const authClient = new AuthClient()

export const useBranches = () => {
  return useQuery<BranchesResponseList>({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponseList>('/branches')
      return response
    },
  })
}


export const useBranchesID = (id: number) => {
  return useQuery<BrancheIDresponse>({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await authClient.get<BrancheIDresponse>(`/branches/${id}`)
      return response
    },
  })
}

export const useImagenBranch = (id:number) => {

  return useQuery<BranchesImagen[]>({
    queryKey: ['branches_imagen'],
    queryFn: async (): Promise<BranchesImagen[]> => {
      const response = await authClient.get<BranchesImagen[]>(`/images/branch/${id}`);
      console.log("Imagenes", response)
      return response;
    },
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
    queryKey: ['branches', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>(`/branches/${branchId}`)
      return response
    },
    enabled: !!branchId,
  })
}

export const usePendingBranchesQuery = () => {
  return useQuery<PendingBranchesResponse>({
    queryKey: ['branches', 'pending'],
    queryFn: async () => {
      const response = await authClient.get<PendingBranchesResponse>('/branches/status/PENDING')
      return response
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useBranchApprovalDetails = (branchId: number | undefined) => {
  return useQuery<BranchApprovalDetails, Error>({
    queryKey: ['branch-approvals', 'detail', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`)
      return response
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useApprovedBranches = () => {
  return useQuery<ApprovedBranchesResponse>({
    queryKey: ['branches', 'APPROVED'],
    queryFn: async () => {
      const response = await authClient.get<ApprovedBranchesResponse>('/branches/status/APPROVED')
      return response
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useValidateVisit = (coordinates: any, shopId: any) => {

  console.log("Coordinates", coordinates)
  console.log("ShopId", shopId)

  return {
    data: "success",
    isLoading: false,
    isError: false,
  }
}



export const  deleteImagenBrandQuery = async (id: number) => {
  try {
    const response = await authClient.delete(`/images/branch/${id}`)
    return response
  } catch (error) {
    console.log(error)  
  }
}