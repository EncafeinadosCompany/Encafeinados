
import AuthClient from "@/api/client/axios";
import {CreatePageDto, CreatePageResponse} from "@/api/types/albumTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export function useCreatePageMutation() {

    const queryClient = useQueryClient();
     const useErrors = useError("createPage");

    return useMutation<CreatePageResponse, Error, CreatePageDto>({
      mutationFn: async (pageData) => {
        const response = await authClient.post<CreatePageResponse>('/pages', pageData);
        return response;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['pages'] });
        toast.success("Página creada correctamente");
      },
      onError: (error) => {
        toast.remove();
        toast.error("Error al crear la página");
        useErrors(error);
      } 
    });
  }; 