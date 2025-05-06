
import AuthClient from "@/api/client/axios";
import { AddStampsToPageDto } from "@/api/types/albumTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export function useCreateStampsToPageMutation() {
    const useErrors = useError("createAlbum");

    const queryClient = useQueryClient();
    
    return useMutation<any, Error, AddStampsToPageDto>({
      mutationFn: async (data) => {
        const response = await authClient.post<any>('/pages-stamps', data);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['page-stamps'] });
      },
      onError: (error) => {
        useErrors(error);
      }
    });
  }