import AuthClient from "@/api/client/axios";
import { BranchSchedule } from "@/api/types/schedules/schedule.types";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export interface ScheduleUpdateData {
  branch_id: number;
  day: string;
  open_time: string;
  close_time: string;
}

export const useUpdateBranchScheduleMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("updateBranchSchedule");

  return useMutation<BranchSchedule, Error, ScheduleUpdateData>({
    mutationFn: async (scheduleData: ScheduleUpdateData): Promise<BranchSchedule> => {
      try {
        const response = await authClient.patch<BranchSchedule>('/branch-schedule', scheduleData);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-schedules', variables.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['branch-schedules'] });
      
      toast.success(`Horario actualizado para ${variables.day}`);
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
};

export const useCreateBranchScheduleMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("createBranchSchedule");

  return useMutation<BranchSchedule, Error, ScheduleUpdateData>({
    mutationFn: async (scheduleData: ScheduleUpdateData): Promise<BranchSchedule> => {
      try {
        const response = await authClient.post<BranchSchedule>('/branch-schedule', scheduleData);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-schedules', variables.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['branch-schedules'] });
      
      toast.success(`Horario creado para ${variables.day}`);
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
};

export const useBulkUpdateBranchSchedulesMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("bulkUpdateBranchSchedules");

  return useMutation<BranchSchedule[], Error, { branchId: number; schedules: ScheduleUpdateData[] }>({
    mutationFn: async ({ schedules }): Promise<BranchSchedule[]> => {
      try {
        const promises = schedules.map(schedule => 
          authClient.patch<BranchSchedule>('/branch-schedule', schedule)
        );
        const responses = await Promise.all(promises);
        return responses;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-schedules', variables.branchId] });
      queryClient.invalidateQueries({ queryKey: ['branch-schedules'] });
      
      toast.success("Horarios actualizados exitosamente");
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
};
