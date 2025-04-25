export type AlbumType = 'ANNUAL';

/**
 * Estructura de una página dentro de un álbum
 */
export interface AlbumPage {
  id: number;
  title: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para la creación de un nuevo álbum
 */
export interface CreateAlbumDto {
  title: string;
  logo: string;
  introduction: string;
  type: AlbumType;
  start_date: string; 
  end_date: string; 
}

/**
 * Respuesta de la API al crear o consultar un álbum
 * Actualizada según la estructura real de la API
 */
export interface AlbumResponse {
  id: number; 
  title: string;
  logo: string;
  introduction: string;
  type: AlbumType;
  start_date: string;
  end_date: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  pages: AlbumPage[];
}

export type AlbumsResponse = AlbumResponse[];

export interface AlbumResponseWithMessage {
  message: string;
  album: AlbumResponse;
}