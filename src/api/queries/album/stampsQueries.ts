import AuthClient from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";

const authClient = new AuthClient();

export interface stamps {
  id: number;
  logo: string;
  name: string;
  description: string;
  status: boolean;
}



export interface stampsResponse {
  pageId: number;
  stamps: stamps[];  
  }



  export interface stampsByClientResponse {
    
      client_id: number,
      stamps: [
        {
          id: number,
          coffecoins_earned: number
        }
      ]
    
  }

  export const useStampsByPageQuery = (id: number) => {
    return useQuery<stampsResponse, Error>({
      queryKey: ['page-stamps', id], // More specific query key
      queryFn: async (): Promise<stampsResponse> => {
        try {
          // Log the request for debugging
          console.log(`🔍 Fetching stamps for page ID: ${id}`);
          
          const response = await authClient.get<stampsResponse>(`/pages-stamps/${id}`);
          
          // Ensure we have a valid response structure
          if (!response || typeof response !== 'object') {
            console.warn(`⚠️ Invalid response for page ${id}:`, response);
            return { pageId: id, stamps: [] };
          }
          
          // Make sure we're accessing the stamps array correctly
          if (!Array.isArray(response.stamps)) {
            console.warn(`⚠️ No stamps array found for page ${id}:`, response);
            return { pageId: id, stamps: [] };
          }
          
          console.log(`✅ Retrieved ${response.stamps.length} stamps for page ${id}`);
          
          // Return properly structured data
          return {
            pageId: id,
            stamps: response.stamps || []
          };
          
        } catch (error) {
          console.error(`❌ Error fetching stamps for page ${id}:`, error);
          // Return empty stamps array on error for graceful failure
          return { pageId: id, stamps: [] };
        }
      },
      // Only fetch when we have a valid ID
      enabled: !!id && id > 0,
      // Avoid unnecessary refetching
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Ensure query cache is properly scoped to the page ID

    });
};



  export const useStampsByClientQuery = (id:number) => {
    return useQuery<stampsByClientResponse, Error>({
      queryKey: ['stamps'],
      queryFn: async (): Promise<stampsByClientResponse> => {
        

        console.log('🔍 Fetching stamps for client ID:', id);
        try {
          const response = await authClient.get<stampsByClientResponse>(`/stamp-clients/${id}`);
          const stamps = response;

          console.log("✅ stampas obtenidas:", stamps);
          
          return response;
          
        } catch (error) {
          console.error("❌ Error al obtener stampas:", error);
          throw error; 
        }
      }
    });
  };