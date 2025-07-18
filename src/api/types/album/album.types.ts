export interface AlbumsListResponse {
    albums: AlbumResponse[];
}
  
export type AlbumType = 'ANNUAL' | 'EVENT';
  
export interface AlbumPage {
    id: number;
    title: string;
    description: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
  
export interface CreateAlbumDto {
    title: string;
    logo: string;
    introduction: string;
    type: AlbumType;
    start_date: string; 
    end_date: string;
    entity_id?: number;
}
  
export interface AlbumResponse {
    id: number; 
    title: string;
    logo: string;
    introduction: string;
    type: AlbumType;
    start_date: string;
    end_date: string;
    status: boolean;
    entity_id?: number;
    createdAt?: string; 
    updatedAt?: string; 
    pages?: AlbumPage[];
}
  
export type AlbumsResponse = AlbumResponse[];





