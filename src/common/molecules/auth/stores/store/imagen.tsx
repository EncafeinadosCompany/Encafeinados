import { CurrentSchema } from "@/common/utils/schemas/auth/registerStoreShema"
import { Controller, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import { pageVariants } from "@/common/atoms/auth/page_variants.atom"
import { Label } from "@/common/ui/label"
import { TitleForm } from "@/common/atoms/auth/title_form.atom"
import { useState, useRef } from "react"
import { Coffee, Upload, X, Check } from "lucide-react"

interface registerStoreProps {
    register: UseFormRegister<CurrentSchema>
    errors: any
    direction: number
    control: any
}

const ImagenB = ({register, errors, direction, control}:registerStoreProps) =>{
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
                
                const event = new Event('change', { bubbles: true });
                fileInputRef.current.dispatchEvent(event);
            }
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
        }
    };

    return ( 
        <motion.div
        key="step1"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="absolute w-full"
        style={{ perspective: "1000px" }}>
        <div className="space-y-2 m-4">
            <div className="grid grid-cols-1 gap-10">
                <div className="space-y-4 flex flex-col items-center">
                    <TitleForm
                        title="Es momento de subir tu logo"
                        subtitle="Es importante para nosotros darte a conocer como tienda que ofrece café de especialidad"
                    />
                    
                    <Controller
                        control={control}
                        name="store_logo"
                        render={({ field }) => (
                            <div className="w-full max-w-md mx-auto">
                                <div 
                                    className={`relative mt-2 flex flex-col items-center justify-center border border-dashed rounded-3xl p-6 transition-all duration-300 ease-in-out ${
                                        isDragging 
                                            ? "border-amber-500 bg-amber-50/50" 
                                            : previewImage 
                                                ? "border-amber-400 bg-amber-50/30" 
                                                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/20"
                                    } ${errors?.store_logo ? "border-red-300" : ""}`}
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
                                            field.onChange(e.target.files?.[0] || null);
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
                                {errors?.store_logo && (
                                    <p className="text-red-500 text-xs mt-2 text-center">{errors.store_logo.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    </motion.div>
    )
}

export default ImagenB