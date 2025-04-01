import { Controller, UseFormRegister } from "react-hook-form";
import { Check, Coffee, Upload, X } from "@/common/ui/icons";

interface ImagenFullProp {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any
    isDragging: boolean
    previewImage: string | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
    removeImage: () => void
    handleDrop: (e: React.DragEvent) => void
    handleDragLeave: () => void
    handleDragOver: (e: React.DragEvent) => void
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ImagenFull = ({ register,direction, errors, control, isDragging, previewImage, removeImage, handleDragOver, handleImageChange, handleDragLeave, fileInputRef, handleDrop }: ImagenFullProp) => {
    return ( 
        <Controller
            control={control}
            name="logo"
            render={({ field }) => (
                <div className="w-full max-w-md mx-auto">
                    <div
                        className={`relative mt-2 flex flex-col items-center justify-center border border-dashed rounded-3xl p-6 transition-all duration-300 ease-in-out ${isDragging
                            ? "border-amber-500 bg-amber-50/50"
                            : previewImage 
                                ? "border-amber-400 bg-amber-50/30"
                                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/20"
                            } ${errors?.logo ? "border-red-300" : ""}`}
                        style={{ minHeight: "220px" }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            
                            onChange={(e) => {
                                handleImageChange(e);
                                field.onChange(e.target.files?.[0] || null );
                            }}
                        />

                        {previewImage ? (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <div className="absolute -top-3 -right-3 z-10">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                            field.onChange(null);
                                        }}
                                        className="bg-white text-gray-400 hover:text-red-500 rounded-full p-1.5 shadow-sm border border-gray-100 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-amber-200 shadow-sm mb-4">
                                    <img
                                        src={previewImage}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-amber-600 font-medium text-sm">
                                    <Check size={14} className="mr-1" />
                                    <span>Logo cargado</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 mb-4 bg-amber-50 rounded-full flex items-center justify-center">
                                    <Coffee className="h-10 w-10 text-amber-700 opacity-80" />
                                </div>
                                <div className="animate-pulse bg-amber-400/80 p-2 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="h-5 w-5 text-white" />
                                </div>
                                <p className="font-medium text-amber-800 text-sm">Arrastra tu logo aquí</p>
                                <p className="text-xs text-gray-400 mt-1">o haz clic para seleccionar</p>
                            </div>
                        )}
                    </div>
                    {errors?.logo && (
                        <p className="text-red-500 text-xs mt-2 text-center">{errors.logo.message}</p>
                    )}
                </div>
            )}
        />
    )
}

export default ImagenFull