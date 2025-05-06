import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useError } from "@/common/hooks/auth/useErrors";

import { handleApiError } from "@/common/utils/errors/handleApiError";
import AuthClient from "@/api/client/axios";
import { ImageType } from "@/api/types/imageTypes";

const authClient = new AuthClient()

export const useImagenMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError('images')
  
return useMutation<ImageType, Error, File>({
    mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file); 
        try {
            const response = await authClient.post<ImageType>(
                "/images/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", 
                    },
                    
                }
            );
            return response; 
        } catch (error: any) {
            console.error("Error al subir imagen:", error);
            throw useErrors(error);
        }
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["imagen"] });
    },
    onError: (error: any) => {
        console.error("Error al subir imagen:", error);
         handleApiError(error)

    },
});
}


export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await authClient.post<ImageType>(
      "/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    return response.image.url;
  };