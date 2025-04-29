import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { AlbumResponse} from "@/api/types/albumTypes";


const authClient = new AuthClient();

export const useAlbumsQuery = () => {
  return useQuery<AlbumResponse[], Error>({
    queryKey: ['albums'],
    queryFn: async () => {
      
      try {
        const response = await authClient.get<AlbumResponse>('/albums');
        const albums = response;
        
        if (!Array.isArray(albums)) {
          return [];
        }
        console.log("✅ Álbumes obtenidos:", albums); 
        
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