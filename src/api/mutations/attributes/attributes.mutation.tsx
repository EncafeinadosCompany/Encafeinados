import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { RegisterAttibute } from "@/api/types/attributes/attributes.type";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

const authClient = new AuthClient();


interface CreateAttributes {
    branchId:number,
    attributes: {
        attributeId: number;
        value: string;
    }[];
}


export const useCreateAttributeMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError("attributes");

    return useMutation<CreateAttributes,Error, any>({
        mutationFn: async (data: RegisterAttibute[]): Promise<CreateAttributes> => {
            try {

                const id_branch = getEncryptedItem("branchId");
                if(!id_branch) throw new Error("No se encontró el id de la sucursal");

                const lis_data = {
                    branchId: Number(id_branch),
                    attributes: data.map((item) => {
                        return {
                            attributeId: item.attributeId,
                            value: item.value
                        }
                    })
                }
                const response: AxiosResponse<CreateAttributes> = await authClient.post('/branch-attributes',lis_data);
                return response.data;

            } catch (error: any) {
                throw handleApiError(error);
            }
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['branch-attributes'] });

            const loadingToast = toast.loading('Creando attributos...', {id: "loading"});

            toast.success('¡Los attributos se han creado con éxito!', { id: loadingToast });


        },
        onError: (error: any) => {
            toast.remove();
            useErrors(error);
        }
    });
};


export const useUpdateAttributeMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError("attributes");

    return useMutation<any, Error, {data: Partial<RegisterAttibute>}>({
        mutationFn: async ({data}) :Promise<any> => {
            try {

                const id_branch = getEncryptedItem("branchId");
                if(!id_branch) throw new Error("No se encontró el id de la sucursal");
                const response: AxiosResponse = await authClient.patch(`/branch-attributes/branch/${id_branch}/attribute/${data.attributeId}`, {value:data.value});
                return response.data;

            } catch (error: any) {
                throw handleApiError(error);
            }
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['branch-attributes'] });

            const loadingToast = toast.loading('Editando attributos...', {id: "loading"});

            toast.success('¡El attributo se han editado con éxito!', { id: loadingToast });


        },
        onError: (error: any) => {
            toast.remove();
            useErrors(error);
        }
    });
};



