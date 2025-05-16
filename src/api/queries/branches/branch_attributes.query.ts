import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { BranchAttributesResponse } from '@/api/types/branches/branch_attributes.types';

const authClient = new AuthClient();

export const useBranchAttributes = (branchId: number | undefined) => {
  return useQuery<BranchAttributesResponse>({
    queryKey: ['branchAttributes', branchId],
    queryFn: async () => {
      const response = await authClient.get<BranchAttributesResponse>(`/branch-attributes/${branchId}`);
      return response;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, 
  });
};