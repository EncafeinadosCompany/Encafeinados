import AuthClient from "@/api/client/axios";
import { RegisterAdminStores,  RegisterAdminData } from "@/api/types/admin/admin_stores.type";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";
import { Register_admin_stores } from "@/api/types/auth/auth.types";

const authClient = new AuthClient();

export const useRegisterAdminMutation = () => {
    const queryClient = useQueryClient()
    const useLonginMutation = useLoginMutation()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<any, Error, RegisterAdminData>({
      mutationFn: async (formData: RegisterAdminData): Promise<any> => {
  
        try {
          const response = await authClient.post<any>('/admin', formData); 
          return response.data;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data, variable) => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
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

// export const useCreateBranchAdminMutation = () => {
//   const queryClient = useQueryClient()
//   const useErrors = useError("createBranchAdmin")

//   return useMutation<any, Error, CreateBranchAdminData>({
//     mutationFn: async (formData: CreateBranchAdminData): Promise<any> => {
//       try {
//         const response = await authClient.post<any>('/admin/store-admin', formData); 
//         return response.data;
  
//       } catch (error: any) {
//         throw handleApiError(error)
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['branches'] });
//       queryClient.invalidateQueries({ queryKey: ['branchByStore'] });
//     },
//     onError: (error: any) => {
//       useErrors(error);
//     }
//   })
// }