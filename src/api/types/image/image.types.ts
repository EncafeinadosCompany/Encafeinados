
// ESTE ES GLOBAL ENVIA LA IMAGEN A CLAUDINARY
export interface ImageType {
        mesagge: string,
        image: {
            url: string,
            publicId: string
        }
}

export interface image {
  image_type: string;
  image_url: string;
}

export interface UpdateImagen {
  related_type: string;
  related_id: string;
  images: image[];
}