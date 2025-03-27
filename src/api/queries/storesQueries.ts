import { useQuery } from '@tanstack/react-query'
import { StoresResponse } from '../types/storesTypes'
import { BranchesResponse } from '../types/branchesTypes'

import AuthClient from '../client/axios'

const authClient = new AuthClient()

export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await authClient.get<StoresResponse>('/stores')
      return response.stores.store // Accedemos directamente al array de tiendas
    }
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