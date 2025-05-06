import AuthClient from "@/api/client/axios";
import { RegisterAdminStores } from "@/api/types/admin_stores/admin_stores.type";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";

const authClient = new AuthClient();

export const useAdminStoreMutation = () => {
    const queryClient = useQueryClient()
    const useLonginMutation = useLoginMutation()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<any, Error, RegisterAdminStores>({
      mutationFn: async (formData: RegisterAdminStores): Promise<any> => {
  
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