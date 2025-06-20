import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { ValidateVisitInput, ValidateVisitResponse } from "../../types/branches/branches_approval.types";
import AuthClient from "../../client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { formSchemaBranches } from "@/common/widgets/admin_branches/images.widget";
import { uploadImage } from "../image/image.mutations";
import { AxiosResponse } from "axios";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import toast from "react-hot-toast";
import { z } from "zod";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

const authClient = new AuthClient();

export const useApproveBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: number) => {
      const userId = getEncryptedItem("userId");

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      console.log("Aprobando sucursal con ID:", userId, approvalId);

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: true,
        approvedById: Number(userId),
      });
    },    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "APPROVED"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useRejectBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    
    mutationFn: async ({
      approvalId,
      reason,
    }: {
      approvalId: number;
      reason: string;
    }) => {
      const userId = getEncryptedItem("userId");

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: false,
        approvedById: Number(userId),
        comments: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "REJECTED"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useRegisterVisitMutation = (): UseMutationResult<
  ValidateVisitResponse,
  Error,
  ValidateVisitInput
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      branchId,
      latitude,
      longitude,
    }: ValidateVisitInput) => {
      const res: any = await authClient.post("/branches/register-visit", {
        branch_id: branchId,
        latitude,
        longitude
      });

      console.log("Respuesta completa:", res);
      console.log("Datos de la respuesta:", res.data);

      let validResponse: ValidateVisitResponse;

      if (res.data?.message && res.data?.data) {
        validResponse = res.data as ValidateVisitResponse;
      } else if (res.data?.coffeecoins_earned && res.data?.stamp) {
        validResponse = {
          message: "Visit registered successfully",
          data: {
            coffeecoins_earned: res.data.coffeecoins_earned,
            stamp: res.data.stamp
          }
        };
      } else {
        throw new Error("Formato de respuesta inesperado");
      }

      return validResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coffecoins"] });
    },
  })
};


export const useStatesIsOpen = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error,{ id: number; is_open: boolean } >({
    mutationFn: async ({ id, is_open }: { id: number; is_open: boolean }) => {
      const response = await authClient.patch(`/branches/open-close/${id}`, { isOpen: is_open });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey:['branches', 'APPROVED'] });
      queryClient.invalidateQueries({ queryKey: ['branch-approvals'] });
      
    }
  });
}

interface image {
  image_type: string;
  image_url: string;

}

interface UpdateImagen {
  related_type: string;
  related_id: number;
  images: image[];
}

export const useUpdateImagenBrandMutation = () => {
  const queryClient = useQueryClient();
  const useErrors = useError("attributes");

  return useMutation<image, Error, z.infer<typeof formSchemaBranches>>({
    mutationFn: async (data: z.infer<typeof formSchemaBranches>): Promise<image> => {
      try {

         const id_branch = getEncryptedItem("branchId");
        if (!id_branch) throw new Error("No se encontró el id de la sucursal");

        let image_url = "";

        if (data.image_file instanceof File) {
          image_url = await uploadImage(data.image_file);
        }

        const payload: UpdateImagen = {
          related_type: 'BRANCH',
          related_id: Number(id_branch),
          images: [
            {
              image_url: image_url,
              image_type: data.image_type
            }
          ]
        };
        console.log(payload);
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
      queryClient.invalidateQueries({queryKey:['branch-approvals']})

    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  });
}



export const deleteImagenBrandMutation =  () => {
  const queryClient = useQueryClient();
  const useErrors = useError("attributes");
 
  return useMutation<number, Error,any>({
    mutationFn: async (id:number): Promise<any> => {
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