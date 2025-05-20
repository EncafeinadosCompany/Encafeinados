"use client"

import type React from "react"
import z from "zod"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Coffee, Loader2, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react"
import { Button } from "@/common/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/common/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/common/ui/alert-dialog"
import { deleteImagenBrandQuery, useImagenBranch } from "@/api/queries/branches/branch.query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/common/ui/form"
import { BranchesImagen } from "@/api/types/branches/branches.types"
import { deleteImagenBrandMutation, useUpdateImagenBrandMutation } from "@/api/mutations/branches/branch_states.mutation"
import { ca } from "date-fns/locale"
import { Card, CardDescription, CardHeader, CardTitle } from "@/common/ui/card"
import toast from "react-hot-toast"

type Cafe = {
    id: string
    name: string
    location: string
    imageUrl: string
}


type ImageData = {
    id: string;
    url: string;
    type: string;
};

const tipo_imagen = [
    { id: 1, clasification: "LOGO" },
    { id: 2, clasification: "PORTADA" },
    { id: 3, clasification: "GALERIA" },
    { id: 4, clasification: "PERFIL" },
    { id: 5, clasification: "MENÚ" },
    { id: 6, clasification: "PROMOCIONES" }
] as const;

// Enhanced Zod schema with validation
const ImageSchema = z.object({
    image_type: z.enum(['LOGO', 'PORTADA', 'GALERIA', 'PERFIL', 'MENÚ', 'PROMOCIONES'], {
        required_error: "Por favor selecciona un tipo de imagen",
        invalid_type_error: "Tipo de imagen inválido"
    }),
    image_file: z
        .instanceof(File, { message: "Por favor selecciona una imagen" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "La imagen no debe superar 5MB")
        .refine(
            (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
            "Formato de imagen no soportado. Use PNG, JPG o GIF"
        ),
});


export const formSchemaBranches = z.object({
    image_type: z.enum(['LOGO', 'PORTADA', 'GALERIA', 'PERFIL', 'MENÚ', 'PROMOCIONES'], {
        required_error: "Por favor selecciona un tipo de imagen",
    }),
    image_file: z.any()
        .refine((file) => file instanceof File, "La imagen es requerida")
        .refine((file) => file?.size <= 5 * 1024 * 1024, "La imagen no debe superar 5MB")
    // .refine(
    //     (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file?.type),
    //     "Formato de imagen no soportado"
    // ),
});


export default function CafeGallery  ()  {

    const BranchId = localStorage.getItem('storeOrBranchId') 
    if(!BranchId){
      return toast.error('No se encontro el id de la sucursal')
    }
    const [cafes, setCafes] = useState<BranchesImagen[]>([])
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCafe, setSelectedCafe] = useState<string | null>(null)
    const [newImage, setNewImage] = useState<File | null>(null)
    const { data, isLoading, isError } = useImagenBranch(Number(BranchId))
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const {mutateAsync:useDeleteImagen, status, error}= deleteImagenBrandMutation()
  
    const [images, setImages] = useState<{ id: string; url: string; type: string }[]>([]);
    useEffect(() => {
        if (data) {
            setCafes(data)
        }
    }, [data])


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

const {mutateAsync:useImagen} = useUpdateImagenBrandMutation()

    const form = useForm<z.infer<typeof formSchemaBranches>>({
        resolver: zodResolver(formSchemaBranches),
        defaultValues: {
            image_file: undefined
        },
    });


    const onSubmit = async (values: z.infer<typeof formSchemaBranches>) => {
        if (modalMode === 'add') {
            // Add logic
            const newImageData = {
                id: crypto.randomUUID(),
                url: URL.createObjectURL(values.image_file),
                type: values.image_type,
            };
            setImages([...images, newImageData]);
        } else {
            setImages(images.map(img =>
                img.id === selectedCafe
                    ? { ...img, url: URL.createObjectURL(values.image_file), type: values.image_type }
                    : img
            ));
        }
        setIsModalOpen(false);
        console.log(values)
        useImagen(values)
        useUpdateImagenBrandMutation
        setPreviewUrl("")
        form.reset();
    };


    const handleAddClick = () => {
        setModalMode('add');
        form.reset();
        setIsModalOpen(true);
        console.log("Modal abierto")
    };



    const handleDeleteClick = (cafe:{value:string, id:number}) => {
        
        setSelectedCafe(cafe.value || null)
       
        setIsDeleteOpen(true)
    }



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("image_file", file, { shouldValidate: true });
            setNewImage(file)

            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith("image/")) {
            setNewImage(file)
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDeleteConfirm = () => {
        if (selectedCafe) {
            const datos = cafes.find((cafe) => cafe.image_url !== selectedCafe)
            console.log('datos',datos?.id)
            useDeleteImagen(datos?.id)
            setIsDeleteOpen(false)
        }
    }



    
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="relative rounded-lg overflow-hidden bg-gray-100 animate-pulse">
                        <div className="h-64 w-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-[#6F4E37] animate-spin" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="w-full bg-red-50 border-red-100">
                <CardHeader className="space-y-1 flex flex-col items-center text-center p-6">
                    <X className="h-12 w-12 text-red-500 mb-2" />
                    <CardTitle className="text-xl text-red-700">Error al cargar imágenes</CardTitle>
                    <CardDescription className="text-red-600">
                        No pudimos cargar las imágenes. Por favor, intenta recargar la página.
                    </CardDescription>
                    <Button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </Button>
                </CardHeader>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="w-full bg-[#FAF3E0] border-[#D4A76A]/20">
                <CardHeader className="space-y-1 flex flex-col items-center text-center p-6">
                    <Coffee className="h-12 w-12 text-[#6F4E37] mb-2" />
                    <CardTitle className="text-xl text-[#2C1810]">No hay imágenes</CardTitle>
                    <CardDescription className="text-[#6F4E37]">
                        Comienza agregando imágenes a tu galería
                    </CardDescription>
                    <Button 
                        onClick={handleAddClick}
                        className="mt-4 bg-[#6F4E37] hover:bg-[#5a3e2c] text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar primera imagen
                    </Button>
                </CardHeader>
            </Card>
        );
    }
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Button
                onClick={handleAddClick}
                className="bg-[#6F4E37] hover:bg-[#5a3e2c] text-white rounded-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Agregar imagen
            </Button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cafes?.map((cafe) => (
                    <div key={cafe.id} className="relative rounded-lg overflow-hidden">
                        <div className="relative h-64 w-full">
                            {/* Image loading state */}
                            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-[#6F4E37] animate-spin" />
                            </div>

                            {/* Actual image with loading handler */}
                            <img 
                                src={cafe.image_url || "/placeholder.svg"} 
                                alt={cafe.image_type} 
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                                onLoad={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.opacity = "1";
                                }}
                                style={{ opacity: 0 }}
                                loading="lazy"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleDeleteClick({id:cafe.id, value:cafe.image_url})}
                                    className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                >
                                    <Trash2 className="h-5 w-5 text-gray-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Modal para editar imagen */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white backdrop-blur-sm border-2 border-[#D4A76A]/20 shadow-xl rounded-xl">

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* Decorative elements */}
                                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4A76A]/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#6F4E37]/10 rounded-full blur-3xl"></div>

                                <DialogHeader className="flex flex-col mx-auto items-center relative">
                                    <motion.div
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4E37]/10 rounded-full mb-4 text-[#6F4E37] font-medium text-sm w-fit"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Coffee className="h-4 w-4" />
                                        <span>Galería de imágenes</span>
                                    </motion.div>
                                    <DialogTitle className="text-2xl font-bold text-[#2C1810] mb-2"> {modalMode === 'add' ? 'Agregar nueva imagen' : 'Editar imagen'}</DialogTitle>
                                    <DialogDescription className="text-[#6F4E37] text-center max-w-sm">
                                        ¡Comparte tu mejor foto del café! Buscamos imágenes que capturen la esencia y el ambiente único de este lugar.
                                    </DialogDescription>
                                </DialogHeader>

                                <motion.div
                                    className="grid gap-4 py-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >

                                    {/* Image Type Selection */}
                                    <FormField
                                        control={form.control}
                                        name="image_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Imagen</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-full border-2 border-[#D4A76A]/30 focus:border-[#D4A76A] rounded-lg">
                                                        <SelectValue placeholder="Selecciona el tipo de imagen" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {tipo_imagen.map((tipo) => (
                                                                <SelectItem
                                                                    key={tipo.id}
                                                                    value={tipo.clasification}
                                                                    className="cursor-pointer hover:bg-[#D4A76A]/10"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <p className="text-amber-900">{tipo.id}.</p>
                                                                        {tipo.clasification}
                                                                    </span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Image Upload Field */}
                                    <FormField
                                        control={form.control}
                                        name="image_file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Imagen</FormLabel>
                                                <FormControl>
                                                    <div
                                                        className={`border-2 border-dashed bg-gradient-to-br from-[#6F4E37]/5 via-white to-[#D4A76A]/5 rounded-xl p-8 text-center transition-all duration-300 ${previewUrl
                                                            ? "border-[#43765C] bg-[#43765C]/5"
                                                            : "border-[#D4A76A]/30 hover:border-[#D4A76A] bg-white/50"
                                                            }`}
                                                        onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                    >
                                                        {!previewUrl ? (
                                                            <motion.div
                                                                className="space-y-4"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <div className="mx-auto w-16 h-16 rounded-full bg-[#6F4E37]/10 flex items-center justify-center">
                                                                    <Coffee className="h-8 w-8 text-[#6F4E37]" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium text-[#2C1810]">Arrastra tu imagen aquí</p>
                                                                    <p className="text-sm text-[#6F4E37]/80">o haz clic para seleccionar</p>
                                                                </div>
                                                                <p className="text-xs text-[#6F4E37]/60">PNG, JPG o GIF (máximo 5MB)</p>
                                                                <Button
                                                                    variant="outline"
                                                                    className="relative bg-[#6F4E37] hover:bg-[#5a3e2c] text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                                                                >
                                                                    Seleccionar archivo
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        onChange={handleFileChange}
                                                                        accept="image/*"
                                                                    />
                                                                </Button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                className="space-y-4"
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-lg">
                                                                    <img
                                                                        src={previewUrl || "/placeholder.svg"}
                                                                        alt="Vista previa"
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                                </div>
                                                                <Button
                                                                    variant="outline"

                                                                    className="relative border-2 border-[#D4A76A] text-[#6F4E37] hover:bg-[#D4A76A]/10 rounded-full transition-all duration-300"
                                                                >
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Cambiar imagen
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                field.onChange(file),
                                                                                    handleFileChange
                                                                            }
                                                                        }}
                                                                        accept="image/*"
                                                                    />
                                                                </Button>
                                                              
                                                            </motion.div>
                                                            
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage>
                                                    {form.formState.errors.image_file?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                </motion.div>

                                <DialogFooter className="flex w-full relative border-t border-[#D4A76A]/20">
                                    <div className="w-full flex justify-between items-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditOpen(false)
                                                setNewImage(null)
                                                setPreviewUrl("")
                                            }}
                                            className="bg-white hover:bg-gray-50 border-2 border-[#D4A76A] text-[#6F4E37] transition-all duration-200"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!newImage}
                                            className="bg-gradient-to-r from-[#43765C] to-[#386048] hover:from-[#386048] hover:to-[#2D4F3B] text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            <Coffee className="h-4 w-4 mr-2" />
                                            Guardar cambios
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Diálogo de confirmación para eliminar */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent className="bg-white/90">
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción eliminará permanentemente la imagen del café. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )

}