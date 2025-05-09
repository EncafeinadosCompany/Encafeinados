import AuthClient from "@/api/client/axios";
import { CreateAlbumDto, AlbumResponse } from "@/api/types/album/album.types";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { uploadImage } from "../image/image.mutations";

const authClient = new AuthClient();

export const useCreateAlbumMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError("createAlbum");

    return useMutation<AlbumResponse, Error, CreateAlbumDto & { logoFile?: File }>({
        mutationFn: async (albumData): Promise<AlbumResponse> => {
            try {
                let finalAlbumData = { ...albumData };

                if (albumData.logoFile instanceof File) {
                    const logoUrl = await uploadImage(albumData.logoFile);
                    finalAlbumData = { ...finalAlbumData, logo: logoUrl };
                }

                const { logoFile, ...cleanAlbumData } = finalAlbumData;
                const response: AxiosResponse<AlbumResponse> = await authClient.post('/albums', cleanAlbumData);
                return response.data;

            } catch (error: any) {
                throw handleApiError(error);
            }
        },
        onSuccess: () => {

            const loadingToast = toast.loading('Creando álbum...', {id: "loading"});

            toast.success('¡Álbum creado con éxito!', { id: loadingToast });

            queryClient.invalidateQueries({ queryKey: ['albums'] });

        },
        onError: (error: any) => {
            toast.remove();
            useErrors(error);
        }
    });
};



