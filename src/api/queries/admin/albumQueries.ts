import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import {  AlbumResponse, AlbumsListResponse, PageStampsResponse, StampsResponse} from "@/api/types/albumTypes";


const authClient = new AuthClient();

export const useAlbumsQuery = () => {
  return useQuery<AlbumResponse[], Error>({
    queryKey: ['albums'],
    queryFn: async () => {
      try {
        const response = await authClient.get<AlbumsListResponse>('/albums');
        
        const albumsData = response.albums || [];
        
        if (!Array.isArray(albumsData)) {
          return [];
        }
        
        return albumsData;
      } catch (error) {
        throw error; 
      }
    },
    refetchOnWindowFocus: true,
    retry: 1
  });
};

export const useAlbumDetailsQuery = (albumId: number | null) => {
  return useQuery<AlbumResponse, Error>({
    queryKey: ['album', albumId],
    queryFn: async () => {
      if (!albumId) throw new Error("Album ID is required");
      
      try {
        const response = await authClient.get<AlbumResponse>(`/albums/${albumId}`);
        return response;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!albumId, 
  });
};

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

export function useAllStampsQuery() {
  return useQuery<StampsResponse, Error>({
    queryKey: ['stamps'],
    queryFn: async () => {
      const response = await authClient.get<StampsResponse>('/stamps');
      return response;
    },
  });
}
