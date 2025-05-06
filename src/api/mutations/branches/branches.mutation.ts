import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/authTypes";
import { BranchPost } from "@/api/types/branchesTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
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


