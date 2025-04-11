import { useQuery } from '@tanstack/react-query'
import { BranchesResponse, BranchesResponseList } from '../../types/branchesTypes'
import AuthClient from '../../client/axios'

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
