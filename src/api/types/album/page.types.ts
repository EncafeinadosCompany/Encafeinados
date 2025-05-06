import { Stamps } from "./stamps.types";

export interface CreatePageDto {
    album_id: number;
    title: string;
    description: string;
    status: boolean;
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