import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { AlbumResponse, AlbumsListResponse } from "@/api/types/album/album.types";



const authClient = new AuthClient();

export interface Albums {
    id: number; 
    title: string;
    logo: string;
    introduccion: string;
    type: string;
    status: boolean;
    start_date: string;
    end_date: string;  
}




export interface Page {
    id: number; 
    title: string;
    description: string;
} 


export interface AlbumPageResponse {
    albumId:number;
    albumTitle:string;
    albumLogo:string;
    pages:Page[];
}


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


export const useAlbumsClientQuery = () => {
  return useQuery<AlbumResponse[], Error>({
    queryKey: ['albums'],
    queryFn: async () => {
      try {
        const response = await authClient.get<AlbumsListResponse>('/albums/client');
        
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


export const usePageByAlbumQuery = (id: string | null) => {
  return useQuery<AlbumPageResponse, Error>({
    queryKey: ['albums', id],
    queryFn: async () => {
      try {
        const response = await authClient.get<AlbumPageResponse>(`/pages/album/${id}`);
        const albums = response;    


        albums.pages ? albums.pages : [];
        return albums;
        
      } catch (error) {
        console.error("❌ Error al obtener álbumes:", error);
        throw error; 
      }
    },
    refetchOnWindowFocus: true,
    retry: 1
  })

}


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