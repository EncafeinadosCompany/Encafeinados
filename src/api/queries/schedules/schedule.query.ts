import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { BranchSchedule } from '@/api/types/schedules/schedule.types';

const authClient = new AuthClient();

export const useBranchSchedules = (branchId: number | undefined) => {
  return useQuery<BranchSchedule[]>({
    queryKey: ['branch-schedules', branchId],
    queryFn: async () => {
      if (!branchId) return [];
      try {
        // La respuesta es directamente un array de schedules
        const response = await authClient.get<BranchSchedule[]>(`/branch-schedule/branch/${branchId}`);
        console.log("API Response:", response);
        return response || [];
      } catch (error) {
        console.error("Error fetching schedules:", error);
        return [];
      }
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false
  });
};
