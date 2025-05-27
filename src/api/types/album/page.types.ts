import { Stamps } from "./stamps.types";



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

export interface CreatePageDto {
    album_id: number;
    title: string;
    description: string;
    status: boolean;
    type?: string
  }
  
  export interface CreatePageResponse {
    album: {
      album_id: number;
      album_title: string;
    };
    id: number;
    title: string;
    description: string;
    status: boolean;
  }


export interface PageStampsResponse {
    pageId: number;
    stamps: Stamps[];
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