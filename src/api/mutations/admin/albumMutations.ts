import AuthClient from "@/api/client/axios";
import { CreateAlbumDto, AlbumResponse } from "@/api/types/albumTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios"; 
import { uploadImage } from "@/api/mutations/imageMutations"; 

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['album', data.id] });
      }
    },
    onError: (error: any) => {
      useErrors(error);
    }
  });
};

