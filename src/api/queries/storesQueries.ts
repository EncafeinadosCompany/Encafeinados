import { useQuery } from '@tanstack/react-query'
import { StoresResponse } from '../types/storesTypes'
import { BranchesResponse } from '../types/branchesTypes'
import AuthClient from '../client/axios'
const authClient = new AuthClient()


export const useStores = () => {
  return useQuery<StoresResponse>({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores')
      return response
    },
    staleTime: 5 * 60 * 1000, 
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
    staleTime: 5 * 60 * 1000,
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