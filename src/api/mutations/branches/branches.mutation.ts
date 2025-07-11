import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/auth/auth.types";
import { BranchPost } from "@/api/types/branches/branches.types";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useRegisterCriteriaMutation } from "../criteria/criteria.mutation";


const authClient = new AuthClient();

export const useRegisterBrandMutation = () => {
  const useCriteriaMutation = useRegisterCriteriaMutation();
    const useErrors = useError("branches");
    const queryClient = useQueryClient()
  
    return useMutation<any, Error, BranchPost>({
      mutationFn: async (formData: BranchPost): Promise<LoginResponse> => {
        try {
          const response = await authClient.post<any>('/branches', formData); 
          return response;
       
        } catch (error: any) {
          throw handleApiError(error)
        }
    
      },
      onSuccess: (data, value:BranchPost) => {
         useCriteriaMutation.mutateAsync({
          branchId: data.branch.id,
          criteriaResponseData: value.criteria,
      });
        toast.remove();
        toast.success("Sucursal registrada con éxito"); 
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

  return useMutation<any, Error, {  data: Partial<BranchPost> }>({
      mutationFn: async ({ data }): Promise<LoginResponse> => {
          try {
              const response = await authClient.patch<any>(`/branches/${1}`, data);
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





