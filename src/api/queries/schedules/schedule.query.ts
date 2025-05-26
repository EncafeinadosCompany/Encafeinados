import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { BranchSchedulesResponse, ScheduleByBranchResponse, BranchSchedule } from '@/api/types/schedules/schedule.types';

const authClient = new AuthClient();

export const useBranchSchedules = (branchId: number | undefined) => {
  return useQuery<BranchSchedule[]>({
    queryKey: ['branch-schedules', branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const response = await authClient.get<BranchSchedulesResponse>(`/branch-schedule/branch/${branchId}`);
      return response.schedules || [];
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false
  });
};
