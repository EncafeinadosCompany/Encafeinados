import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { AlbumResponse, AlbumsResponse } from "@/api/types/albumTypes";
import { AxiosResponse } from "axios";

const authClient = new AuthClient();

export const useAlbumsQuery = () => {
  return useQuery<AlbumResponse[], Error>({
    queryKey: ['albums'],
    queryFn: async () => {
      
      try {
        const response: AxiosResponse<AlbumsResponse> = await authClient.get('/albums');
        
        
        const albums = response.data;
        
        if (!Array.isArray(albums)) {
          return [];
        }
        
        return albums;
        
      } catch (error) {
        console.error("❌ Error al obtener álbumes:", error);
        throw error; 
      }
    },
    refetchOnWindowFocus: true,
    retry: 1
  });
};