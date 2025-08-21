import AuthClient from "@/api/client/axios";
import { image } from "@/api/types/branches/branches.types";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { BranchImagesSchema } from "@/common/utils/schemas/branch/images/brach_images.schema";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {z} from "zod";
import { uploadImage } from "../image/image.mutations";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import toast from "react-hot-toast";
import { UpdateImagen } from "@/api/types/image/image.types";
import { AxiosResponse } from "axios";

const authClient = new AuthClient();

export const useUpdateImagenBranchMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("attributes");

  return useMutation<image, Error, z.infer<typeof BranchImagesSchema>>({
    
    mutationFn: async (data: z.infer<typeof BranchImagesSchema>): Promise<image> => {
      try {

        const id_branch = getEncryptedItem("branchId") as string 
        if (!id_branch) throw new Error("No se encontró el id de la sucursal");

        let image_url = "";

        if (data.image_file instanceof File) {
          image_url = await uploadImage(data.image_file);
        }

        const payload: UpdateImagen = {
          related_type: 'BRANCH',
          related_id: id_branch,
          images: [
            {
              image_url: image_url,
              image_type: data.image_type
            }
          ]
        };
    
        const response: AxiosResponse<image> = await authClient.post('/images', payload);
        return response.data;

      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: () => {

      const loadingToast = toast.loading('Creando attributos...', { id: "loading" });
      toast.success('¡La imagen se ha subido con éxito!', { id: loadingToast });

      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches_imagen'] });
      queryClient.invalidateQueries({ queryKey: ['branch-approvals'] });

    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
}

export const useDeleteImagenBranchMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("attributes");

  return useMutation<number, Error, any>({
    mutationFn: async (id: number): Promise<any> => {
      try {
        const response = await authClient.delete(`/images/${id}`)
        return response

      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: () => {

      const loadingToast = toast.loading('Eliminando imagenes...', { id: "loading" });

      toast.success('¡La imagen se ha eliminado con éxito!', { id: loadingToast });

      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branches_imagen'] });

    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
}
