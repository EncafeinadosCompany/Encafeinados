import { useQuery } from '@tanstack/react-query'
import { BranchesResponse } from '../types/branchesTypes'
import AuthClient from '../client/axios'

const authClient = new AuthClient()

export const useBranches = () => {
  return useQuery<BranchesResponse>({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>('/branches')
      return response
    },
  })
}

export const useBranch = (branchId: number | undefined) => {
  return useQuery<BranchesResponse>({
    queryKey: ['branches', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchesResponse>(`/branches/${branchId}`)
      return response
    },
    enabled: !!branchId, 
  })
}