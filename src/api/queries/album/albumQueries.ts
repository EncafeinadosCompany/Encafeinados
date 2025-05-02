import { useQuery } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";



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



export interface AlbumAllResponse {
albums: Albums[];

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

export const useAlbumsAllQuery = () => {
  return useQuery<AlbumAllResponse, Error>({
    queryKey: ['albums'],
    queryFn: async () => {
      try {
        const response = await authClient.get<AlbumAllResponse>('/albums');
        const albums = response;    
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