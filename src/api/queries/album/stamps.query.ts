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
        // console.log(`🔍 Fetching stamps for page ID: ${id}`);

        const response = await authClient.get<StampsResponse>(`/pages-stamps/${id}`);

        if (!response || typeof response !== 'object') {
          // console.warn(`⚠️ Invalid response for page ${id}:`, response);
          return { pageId: id, stamps: [] };
        }


        if (!Array.isArray(response.stamps)) {
          // console.warn(`⚠️ No stamps array found for page ${id}:`, response);
          return { pageId: id, stamps: [] };
        }

        // console.log(`✅ Retrieved ${response.stamps.length} stamps for page ${id}`);

        return {
          pageId: id,
          stamps: response.stamps || []
        };

      } catch (error) {
        // console.error(`❌ Error fetching stamps for page ${id}:`, error);

        return { pageId: id, stamps: [] };
      }
    },

    enabled: !!id && id > 0,
    // Avoid unnecessary refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Ensure query cache is properly scoped to the page ID

  });
};


export const useMockStampsByPageQuery = (id: number, useMock = false) => {
  return useQuery<StampsResponse, Error>({
    queryKey: ['mock-page-stampss', id],
    queryFn: async (): Promise<StampsResponse> => {
      if (useMock) {
        console.log(`🔍 Generating 50 mock stamps for page ID: ${id}`);
        
        // Generate 50 mock stamps
        const mockStamps = Array.from({ length: 50 }, (_, index) => ({
          id: index + 1,
          title: `Stamp ${index + 1}`,
          description: `This is a mock description for stamp ${index + 1}`,
          image_url: `https://picsum.photos/seed/${id}-${index}/200/300`,
          status: Math.random() > 0.3, // 70% chance of being active
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updated_at: new Date().toISOString(),
          page_id: id,
          position: index + 1,
          points: Math.floor(Math.random() * 100) + 10,
          is_collected: Math.random() > 0.5, // 50% chance of being collected
          collected_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 5000000000).toISOString() : null,
          coffee_type: ['Arabica', 'Robusta', 'Liberica', 'Excelsa'][Math.floor(Math.random() * 4)],
          region: ['Antioquia', 'Huila', 'Nariño', 'Cauca', 'Santander'][Math.floor(Math.random() * 5)],
          flavor_notes: [
            'Chocolate', 'Caramel', 'Fruity', 'Nutty', 'Floral', 
            'Citrus', 'Berry', 'Spicy', 'Vanilla', 'Honey'
          ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1).join(', '),
          rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)]
        }));
        
        console.log(`✅ Generated 50 mock stamps for page ${id}`);
        
        return {
          pageId: id,
          stamps: mockStamps.map(stamp => ({
            ...stamp,
            logo: `https://picsum.photos/seed/logo-${stamp.id}/50/50`,
            name: `Coffee Stamp ${stamp.id}`,
            coffeecoins_value: Math.floor(Math.random() * 50) + 10
          }))
        };
      }
      
      // If not using mock, call the real API
      try {
        const response = await authClient.get<StampsResponse>(`/pages-stamps/${id}`);
        
        if (!response || !Array.isArray(response.stamps)) {
          return { pageId: id, stamps: [] };
        }
        
        return {
          pageId: id,
          stamps: response.stamps
        };
      } catch (error) {
        console.error(`❌ Error fetching stamps for page ${id}:`, error);
        return { pageId: id, stamps: [] };
      }
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStampsByClientQuery = (id: number) => {
  return useQuery<StampsByClientResponse, Error>({
    queryKey: ['stamps'],
    queryFn: async (): Promise<StampsByClientResponse> => {
      
      try {
        const response = await authClient.get<StampsByClientResponse>(`/stamp-clients/${id}`);
        const stamps = response;

        // console.log("✅ stampas obtenidas:", stamps);

        return response;

      } catch (error) {
        console.error("❌ Error al obtener stampas:", error);
        throw error;
      }
    }
  });
};