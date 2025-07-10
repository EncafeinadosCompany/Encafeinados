import AuthClient from "@/api/client/axios";
import { BranchSchedule } from "@/api/types/schedules/schedule.types";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export interface ScheduleCreateData {
  branch_id: number;
  day: string;
  open_time: string;
  close_time: string;
}

export interface ScheduleUpdateData {
  id: number;
  data: {
    day?: string;
    open_time?: string;
    close_time?: string;
  };
}

export interface BulkScheduleUpdateData {
  updates: ScheduleUpdateData[];
}

export const useUpdateBranchScheduleMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("updateBranchSchedule");

  return useMutation<BranchSchedule[], Error, BulkScheduleUpdateData>({
    mutationFn: async (updateData: BulkScheduleUpdateData): Promise<BranchSchedule[]> => {
      try {
        const response = await authClient.patch<BranchSchedule[]>('/branch-schedule', updateData);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      // Extract branch_id from the first update to invalidate queries
      const firstUpdate = variables.updates[0];
      if (firstUpdate) {
        queryClient.invalidateQueries({ queryKey: ['branch-schedules'] });
        const dayName = firstUpdate.data.day || 'día';
        toast.success(`Horario(s) actualizado(s) exitosamente`);
      }
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

  return useMutation<BranchSchedule, Error, ScheduleCreateData>({
    mutationFn: async (scheduleData: ScheduleCreateData): Promise<BranchSchedule> => {
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

  return useMutation<BranchSchedule[], Error, { branchId: number; schedules: ScheduleCreateData[] }>({
    mutationFn: async ({ schedules }): Promise<BranchSchedule[]> => {
      try {
        // For bulk operations, we'll use multiple POST requests for creation
        const promises = schedules.map(schedule => 
          authClient.post<BranchSchedule>('/branch-schedule', schedule)
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
      
      toast.success("Horarios guardados exitosamente");
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
};

export const useUpdateSingleBranchScheduleMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("updateSingleBranchSchedule");

  return useMutation<BranchSchedule[], Error, ScheduleUpdateData>({
    mutationFn: async (updateData: ScheduleUpdateData): Promise<BranchSchedule[]> => {
      try {
        const response = await authClient.patch<BranchSchedule[]>('/branch-schedule', {
          updates: [updateData]
        });
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['branch-schedules'] });
      const dayName = variables.data.day || 'día';
      toast.success(`Horario actualizado para ${dayName}`);
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
};
