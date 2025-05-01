export interface AlbumsListResponse {
  albums: AlbumResponse[];
}

export type AlbumType = 'ANNUAL';

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
  createdAt?: string; 
  updatedAt?: string; 
  pages?: AlbumPage[];
}

export type AlbumsResponse = AlbumResponse[];

export interface Stamp {
  id: number;
  logo: string;
  name: string;
  description: string;
  coffeecoins_value: number;
  status: boolean;
}

export interface StampsResponse {
  stamps: Stamp[];
}

export interface AddStampsToPageDto {
  pageId: number;
  stampIds: number[];
}

export interface PageStampsResponse {
  pageId: number;
  stamps: Stamp[];
}

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