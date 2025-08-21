import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/auth/auth.types";
import { BranchPost } from "@/api/types/branches/branches.types";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useRegisterCriteriaMutation } from "../criteria/criteria.mutation";
import { showSuccessToast } from "@/common/molecules/auth/login/card_success.molecule";

const authClient = new AuthClient();

export const useRegisterBrandMutation = () => {
  // const useCriteriaMutation = useRegisterCriteriaMutation();
    const useErrors = useError("branches");
    const queryClient = useQueryClient()
  
    return useMutation<any, Error, BranchPost>({
      mutationFn: async (formData: BranchPost): Promise<any> => {
        try {
          const response = await authClient.post<BranchPost>('/branches', formData);

      //       await useCriteriaMutation.mutateAsync({
      //     branchId: response.branch.id,
      //     criteriaResponseData: formData.criteria,
      // });

        //  toast.remove();
        //  toast.success("Sucursal registrada con éxito"); 

          return response;
       
        } catch (error: any) {
          throw handleApiError(error)
        }
    
      },
      onSuccess: async () => {
         
      
      // ✅ Navegación después del toast
     
//       const name = localStorage.getItem("nameStore");
//  showSuccessToast(name);
//         window.location.replace("/");

    
      
        queryClient.invalidateQueries({ queryKey: ['branches'] });
      },
      onError: (error: any) => {
        toast.remove();
        useErrors(error);
      }
    })
}


export const useUpdateBranchMutation = () => {
  const useErrors = useError("branches");
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string; data: Partial<BranchPost> }>({
      mutationFn: async ({ id, data }): Promise<LoginResponse> => {
          try {
              const response = await authClient.patch<any>(`/branches/${id}`, data);
              return response;
          } catch (error: any) {
              throw handleApiError(error);
          }
      },
      onSuccess: (data) => {
          toast.remove();
          toast.success("Sucursal actualizada con éxito");
          queryClient.invalidateQueries({ queryKey: ['branches'] });
      },
      onError: (error: any) => {
          toast.remove();
          useErrors(error);
      }
  });
};





