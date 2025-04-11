import { useQuery } from '@tanstack/react-query'
import { BranchesResponse } from '../../types/branchesTypes'
import {  BranchesResponseList, PendingBranchesResponse, BranchApprovalDetails } from '../../types/branchesApprovalTypes'

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

export const useBranchApprovalDetails = (branchId: number | undefined) => {
  return useQuery<BranchApprovalDetails, Error>({
    queryKey: ['branch-approvals', 'detail', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchApprovalDetails>(`/branch-approvals/detail/${branchId}`)
      return response
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}