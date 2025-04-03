import AuthClient from '@/api/client/axios'
import { BranchesResponse } from '@/api/types/branchesTypes'
import { StoresResponse } from '@/api/types/storesTypes'
import { useQuery } from '@tanstack/react-query'

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