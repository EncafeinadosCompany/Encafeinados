import { uploadImage } from "@/api/mutations/imageMutations";
type UploadConfig = {
  field: string; // ej: 'logoFile'
  targetField: string; // ej: 'logo'
};

export const prepareFormDataWithUploads = async <
  T extends Record<string, any>
>(
  data: T,
  uploads: UploadConfig[]
): Promise<Record<string, any>> => {
  const result: Record<string, any> = { ...data };

  for (const { field, targetField } of uploads) {
    if (result[field] instanceof File) {
      const url = await uploadImage(result[field]);
      result[targetField] = url;
      delete result[field];
      console.log(result)
    }
  }

  return result;
};