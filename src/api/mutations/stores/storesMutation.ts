import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/authTypes";
import { responseStores } from "@/api/types/storesTypes";
import { RegisterStoreSchemaType } from "@/api/types/storeTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { setAuthStorage } from "@/common/utils/authStorage";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { focusManager, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../imageMutations";

const authClient = new AuthClient();

export const useRegisterStoreMutation = () => {
    const useErrors = useError("registeCoffelover")
 
    const queryClient = useQueryClient()
  
    return useMutation<responseStores, Error, RegisterStoreSchemaType>({
      mutationFn: async (formData: RegisterStoreSchemaType): Promise<responseStores> => {
        try {
          if (formData.logo && formData.logo instanceof File) {
            const imagenUrl = await uploadImage(formData.logo);
            formData.logo = imagenUrl;
          } else {
            formData.logo = "https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743628429/images-coffee/Captura%20de%20pantalla%202025-03-20%20184910.png.png";
          }
      
          const response = await authClient.post<responseStores>('/stores', formData);
      
          localStorage.setItem('nameStore', response.store.name);
      
          return response;
      
        } catch (error: any) {
          throw handleApiError(error);
        }
      },
      onSuccess: (data) => {  
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
}


