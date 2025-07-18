import AuthClient from '@/api/client/axios'
import { BranchesResponse, BranchesResponseStore } from '@/api/types/branches/branches.types'
import { StoresResponse } from '@/api/types/stores/stores.type'
import { useQuery } from '@tanstack/react-query'

const authClient = new AuthClient()


export const useStores = () => {
  return useQuery<StoresResponse>({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores')
      return response
    },
    // staleTime: 5 * 60 * 1000,
  })
}


export const useBranchesByStore = (storeId: number | undefined) => {
  return useQuery<BranchesResponse>({
    queryKey: ['stores', storeId, 'branches'],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>(`/stores/${storeId}/branches`)
      return response
    },
    enabled: !!storeId,
  })
}

export const useBranchByStore = (branchId: number | undefined) => {
  return useQuery<BranchesResponseStore, Error>({
    queryKey: ['branches', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponseStore>(`/branches/store/${branchId}`)
      return response
    },
    enabled: !!branchId,
  })
}

export const usePendingStores = () => {
  return useQuery<StoresResponse>({
    queryKey: ['stores', 'pending'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores/status/PENDING')
      return response
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useApprovedStores = () => {
  return useQuery<StoresResponse>({
    queryKey: ['stores', 'approved'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores/status/APPROVED')
      return response
    },
    // staleTime: 5 * 60 * 1000,
  })
}

export const useRejectedStores = () => {
  return useQuery<StoresResponse>({
    queryKey: ['stores', 'rejected'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores/status/REJECTED')
      return response
    },
    staleTime: 5 * 60 * 1000,
  })
}