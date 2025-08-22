import { useQuery } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { BranchSchedule } from '@/api/types/schedules/schedule.types';

const authClient = new AuthClient();

export const useBranchSchedules = (branchId: string | number | undefined) => {
  return useQuery<BranchSchedule[]>({
    queryKey: ['branches','branch-schedules', branchId],
    queryFn: async () => {
      if (!branchId) {
        console.warn("useBranchSchedules: No branchId provided");
        return [];
      }
      
      try {
        
        const response = await authClient.get<BranchSchedule[]>(`/branch-schedule/branch/${branchId}`);
        
      
        const validSchedules = response.filter((schedule: any) => {
          const isValid = schedule && 
                         typeof schedule.id === 'number' &&
                         typeof schedule.day === 'string' &&
                         typeof schedule.open_time === 'string' &&
                         typeof schedule.close_time === 'string';
          
          if (!isValid) {
            console.warn("Invalid schedule item:", schedule);
          }
          
          return isValid;
        });
        
        
        return validSchedules;
      } catch (error: any) {
        console.error(`Error fetching schedules for branch ${branchId}:`, {
          error: error.message || error,
          status: error.response?.status,
          data: error.response?.data
        });
        
        return [];
      }
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    }
  });
};
