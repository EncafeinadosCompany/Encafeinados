import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthClient from "../client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { ImageType } from "../types/imageTypes";
import { handleApiError } from "@/common/utils/errors/handleApiError";

const authClient = new AuthClient()

export const useImagenMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError('imagen')
  
return useMutation<ImageType, Error, File>({
    mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file); // 👈 Nombre correcto según el backend

        try {
            const response = await authClient.post<ImageType>(
                "/images/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // 👈 Importante para enviar archivos
                    },
                    
                }
            );
            return response; // 👈 Retorna solo los datos relevantes
        } catch (error: any) {
            throw useErrors(error);
        }
    },
    onSuccess: (data) => {
        console.log("Imagen subida correctamente:", data);
        queryClient.invalidateQueries({ queryKey: ["imagen"] });
    },
    onError: (error: any) => {
        console.error("Error al subir imagen:", error);
    },
});
}