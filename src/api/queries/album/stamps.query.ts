import AuthClient from "@/api/client/axios";
import { StampsByClientResponse, StampsResponse } from "@/api/types/album/stamps.types";
import { useQuery } from "@tanstack/react-query";


const authClient = new AuthClient();

export function useAllStampsQuery() {
  return useQuery<StampsResponse, Error>({
    queryKey: ['stamps'],
    queryFn: async () => {
      const response = await authClient.get<StampsResponse>('/stamps');
      return response;
    },
  });
}


export const useStampsByPageQuery = (id: number) => {
  return useQuery<StampsResponse, Error>({
    queryKey: ['page-stamps', id],
    queryFn: async (): Promise<StampsResponse> => {
      try {
        // Log the request for debugging
        console.log(`🔍 Fetching stamps for page ID: ${id}`);

        const response = await authClient.get<StampsResponse>(`/pages-stamps/${id}`);

        if (!response || typeof response !== 'object') {
          console.warn(`⚠️ Invalid response for page ${id}:`, response);
          return { pageId: id, stamps: [] };
        }


        if (!Array.isArray(response.stamps)) {
          console.warn(`⚠️ No stamps array found for page ${id}:`, response);
          return { pageId: id, stamps: [] };
        }

        console.log(`✅ Retrieved ${response.stamps.length} stamps for page ${id}`);

        return {
          pageId: id,
          stamps: response.stamps || []
        };

      } catch (error) {
        console.error(`❌ Error fetching stamps for page ${id}:`, error);

        return { pageId: id, stamps: [] };
      }
    },

    enabled: !!id && id > 0,
    // Avoid unnecessary refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Ensure query cache is properly scoped to the page ID

  });
};

export const useStampsByClientQuery = (id: number) => {
  return useQuery<StampsByClientResponse, Error>({
    queryKey: ['stamps'],
    queryFn: async (): Promise<StampsByClientResponse> => {
      
      try {
        const response = await authClient.get<StampsByClientResponse>(`/stamp-clients/${id}`);
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