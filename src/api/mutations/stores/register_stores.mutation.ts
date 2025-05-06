import AuthClient from "@/api/client/axios";
import { responseStores } from "@/api/types/storesTypes";
import { RegisterStoreSchemaType } from "@/api/types/storeTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export const useRegisterStoreMutation = () => {
  const useErrors = useError("stores")

  const queryClient = useQueryClient()

  return useMutation<responseStores, Error, RegisterStoreSchemaType>({
    mutationFn: async (formData: RegisterStoreSchemaType): Promise<responseStores> => {

  
      const response = await authClient.post<responseStores>('/stores', formData);

      localStorage.setItem('nameStore', response.store.name);

      return response;

    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.remove();
      return new Promise(resolve => {
        setTimeout(() => {
          toast.success("Registro exitoso");
          resolve(void 0);
        }, 5000);
      });
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  },
 
)
}





