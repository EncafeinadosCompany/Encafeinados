import AuthClient from "@/api/client/axios";
import { CreateAlbumDto, AlbumResponse, CreatePageDto, CreatePageResponse, AddStampsToPageDto } from "@/api/types/albumTypes";
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
      console.log("Respuesta del servidor:", data);
      
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      
      if (data && typeof data === 'object' && 'id' in data) {
        queryClient.invalidateQueries({ queryKey: ['album', data.id] });
      } else {
        console.warn("La respuesta del servidor no tiene el formato esperado:", data);
      }
    },
    onError: (error: any) => {
      useErrors(error);
    }
  });
};

export function useCreatePageMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<CreatePageResponse, Error, CreatePageDto>({
    mutationFn: async (pageData) => {
      const response = await authClient.post<CreatePageResponse>('/pages', pageData);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['album', data.album.album_id.toString()] });
    },
  });
}; 

export function useAddStampsToPageMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, AddStampsToPageDto>({
    mutationFn: async (data) => {
      const response = await authClient.post<any>('/pages-stamps', data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidar consultas relevantes
      queryClient.invalidateQueries({ queryKey: ['page-stamps', variables.pageId.toString()] });
    },
  });
}