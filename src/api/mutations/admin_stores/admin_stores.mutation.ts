import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";
import { Register_admin_stores } from "@/api/types/auth/auth.types";

const authClient = new AuthClient();

export const useAdminStoreMutation = () => {
    const queryClient = useQueryClient()
    const useLonginMutation = useLoginMutation()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<any, Error, Register_admin_stores>({
      mutationFn: async (formData: Register_admin_stores): Promise<any> => {
  
        try {
          const response = await authClient.post<any>('/admin/store-admin', formData); 
          return response.data;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data, variable) => {
        queryClient.invalidateQueries({ queryKey: ['adminStore'] });
        useLonginMutation.mutate({
          email: variable.userData.email,
          password: variable.userData.password
        })
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }