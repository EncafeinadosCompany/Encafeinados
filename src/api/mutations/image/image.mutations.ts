import AuthClient from "@/api/client/axios";
import { ImageType } from "@/api/types/image/image.types";

const authClient = new AuthClient()

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await authClient.post<ImageType>(
      "/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    return response.image.url;
  };