
import AuthClient from "@/api/client/axios";
import { PageStampsResponse } from "@/api/types/album/page.types";
import { useQuery } from "@tanstack/react-query";

const authClient = new AuthClient();

export const usePageStampsQuery = (pageId: number | null) => {
    return useQuery<PageStampsResponse, Error>({
      queryKey: ['page-stamps', pageId],
      queryFn: async () => {
        if (!pageId) throw new Error("Page ID is required");
        
        try {
          const response = await authClient.get<PageStampsResponse>(`/pages-stamps/${pageId}`);
          return response;
        } catch (error) {
          throw error;
        }
      },
      enabled: !!pageId, 
    });
  };