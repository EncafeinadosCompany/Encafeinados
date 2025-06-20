import React, { useState, useRef } from "react";
import { Camera, X, Upload } from "@/common/ui/icons";
import { uploadImage } from "@/api/mutations/image/image.mutations";
import toast from "react-hot-toast";


interface ReviewImageUploadProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ReviewImageUpload: React.FC<ReviewImageUploadProps> = ({
  imageUrls,
  onChange,
  maxImages = 3,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    const remainingSlots = maxImages - imageUrls.length;
    const filesToUpload = files.slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) return;
    
    setIsUploading(true);
    const uploadPromises = filesToUpload.map(file => {
      return uploadImage(file)
        .then(url => url)
        .catch(error => {
          console.error("Error al subir imagen:", error);
          toast.error(`Error al subir ${file.name}`);
          return null;
        });
    });
    
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null) as string[];
    
    onChange([...imageUrls, ...validUrls]);
    setIsUploading(false);
    
    // Resetear el campo de archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {imageUrls.map((url, index) => (
          <div 
            key={`image-${index}`} 
            className="relative w-24 h-24 rounded-md overflow-hidden border border-amber-200"
          >
            <img 
              src={url} 
              alt={`Imagen ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-white/70 rounded-full p-1 hover:bg-white transition-colors"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        ))}

        {imageUrls.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-colors ${
              isUploading 
                ? "border-amber-300 bg-amber-50 cursor-wait" 
                : "border-amber-200 hover:border-amber-400 hover:bg-amber-50"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin">
                  <Upload className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-amber-500 text-xs mt-2">Subiendo...</span>
              </div>
            ) : (
              <>
                <Camera className="h-5 w-5 text-amber-500 mb-1" />
                <span className="text-xs text-amber-600">Añadir foto</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {imageUrls.length > 0 && (
        <p className="text-xs text-amber-700/70">
          {imageUrls.length} de {maxImages} imágenes
        </p>
      )}
    </div>
  );
};

export default ReviewImageUpload;