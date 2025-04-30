// Agregar un nuevo tipo para la respuesta actual que incluye el arreglo albums
export interface AlbumsListResponse {
  albums: AlbumResponse[];
}

// Los demás tipos se mantienen igual
export type AlbumType = 'ANNUAL';

export interface AlbumPage {
  id: number;
  title: string;
  description: string;
  status?: boolean; // Hago opcional porque no viene en la respuesta de detalles
  createdAt?: string; // Hago opcional porque no viene en la respuesta de detalles
  updatedAt?: string; // Hago opcional porque no viene en la respuesta de detalles
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