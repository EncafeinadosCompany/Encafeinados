import { UseFormRegister } from "react-hook-form"
import { useState, useRef, useEffect } from "react"
import ImagenFull from "@/common/molecules/auth/imagenFull"


interface registerStoreProps {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any
}

const Imagen = ({register, errors, direction, control}:registerStoreProps) =>{
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

    useEffect(() => {
        if (!previewImage && control._formValues.logo) {
            const file = control._formValues.logo;
            if (file instanceof File) {
                const imageUrl = URL.createObjectURL(file);
                setPreviewImage(imageUrl);
            }
        }
    }, [control._formValues.logo]);

    return ( 
     <ImagenFull
        register={register}
        direction={direction}
        errors={errors}
        control={control}
        isDragging={isDragging}
        previewImage={previewImage}
        handleImageChange={handleImageChange}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        removeImage={removeImage}
        fileInputRef={fileInputRef}
     ></ImagenFull>
    )
}

export default Imagen