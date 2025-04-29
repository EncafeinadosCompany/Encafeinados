import AuthClient from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";

const authClient = new AuthClient();

interface stamp {
  id: number;
  logo: string;
  name: string;
  description: string;
  status: boolean;
}



interface stampsResponse {
  stamps: stamp[];  
  }


export const useStampsAllQuery = () => {
    return useQuery<stampsResponse, Error>({
      queryKey: ['stamps'],
      queryFn: async (): Promise<stampsResponse> => {
        
        try {
          const response = await authClient.get<stampsResponse>('/stamps');
          const stamps = response;

          console.log("✅ Álbumes obtenidos:", stamps);

        
          
          // if (!Array.isArray(stamps.stamps)) {
          //   return [];
          // }
          console.log("✅ Álbumes obtenidos:", stamps); 
          
          return response;
          
        } catch (error) {
          console.error("❌ Error al obtener álbumes:", error);
          throw error; 
        }
      }
    });
  };