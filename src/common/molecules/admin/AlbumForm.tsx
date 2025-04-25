import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/common/ui/calendar';
import { Input } from '@/common/ui/input';
import { Button } from '@/common/ui/button';
import { Label } from '@/common/ui/label';
import { Textarea } from '@/common/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/ui/popover';
import { CalendarIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import { CreateAlbumDto } from '@/api/types/albumTypes';
import { toast } from 'react-toastify';

const albumSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "El título no puede exceder 100 caracteres"),
  introduction: z.string().min(10, "La introducción debe tener al menos 10 caracteres"),
  type: z.literal("ANNUAL"), 
  start_date: z.date(),
  end_date: z.date(),
}).refine(data => data.end_date > data.start_date, {
  message: "La fecha de finalización debe ser posterior a la de inicio",
  path: ["end_date"]
});

type AlbumFormValues = z.infer<typeof albumSchema>;

interface AlbumFormProps {
  onSubmit: (data: CreateAlbumDto & { logoFile?: File }) => void;
  isSubmitting: boolean;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ onSubmit, isSubmitting }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: '',
      introduction: '',
      type: 'ANNUAL',
      start_date: new Date(),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor sube una imagen en formato JPG, PNG, GIF o WEBP');
        return;
      }
            if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no puede superar los 2MB');
        return;
      }

      setLogoFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const clearLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processForm = async (data: AlbumFormValues) => {
    if (!logoFile) {
      toast.error('Por favor sube una imagen de logo para el álbum');
      return;
    }
    
    onSubmit({
      ...data,
      logo: "", 
      logoFile: logoFile, 
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd')
    });
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-6">
      <div className="mb-8">
        <Label htmlFor="logo" className="text-[#2C1810] block mb-2">
          Logo del Álbum<span className="text-red-500">*</span>
        </Label>
        
        <div 
          className={`relative mx-auto w-40 h-40 rounded-xl border-2 border-dashed cursor-pointer
            ${logoPreview ? 'border-amber-300' : 'border-amber-200'} 
            overflow-hidden flex items-center justify-center 
            ${logoPreview ? 'bg-amber-50/70' : 'bg-amber-50/40'} 
            hover:bg-amber-50/70 transition-colors mb-3`}
          onClick={triggerFileInput}
        >
          {logoPreview ? (
            <>
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="w-full h-full object-cover" 
              />
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogo();
                }}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:bg-white transition-colors"
              >
                <XIcon size={14} className="text-rose-600" />
              </button>
            </>
          ) : (
            <div className="text-center text-amber-800/60 p-4">
              <UploadIcon size={32} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Sube una imagen</p>
              <p className="text-xs mt-1">JPG, PNG, GIF (máx. 2MB)</p>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleLogoChange}
        />
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={triggerFileInput}
            className="text-sm text-[#6F4E37] hover:text-[#5D3D26] inline-flex items-center"
          >
            <UploadIcon size={14} className="mr-1" />
            {logoPreview ? 'Cambiar imagen' : 'Seleccionar archivo'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-[#2C1810]">
          Título del Álbum<span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Ejemplo: Cafés de Verano 2025"
          className="focus-visible:ring-[#6F4E37] focus-visible:border-amber-200"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction" className="text-[#2C1810]">
          Introducción<span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="introduction"
          placeholder="Introduce una breve descripción del álbum..."
          className="h-24 resize-none focus-visible:ring-[#6F4E37] focus-visible:border-amber-200"
          {...register("introduction")}
        />
        {errors.introduction && (
          <p className="text-red-500 text-sm">{errors.introduction.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-[#2C1810]">
            Fecha de Inicio<span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start_date"
                variant="outline"
                className="w-full justify-start text-left font-normal hover:bg-amber-50/50 border-amber-200/70"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#6F4E37]" />
                {watch("start_date") ? (
                  format(watch("start_date"), 'PP', { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch("start_date")}
                onSelect={(date: Date | null) => setValue("start_date", date || new Date())}
                classNames={{
                  
                  day_selected: "bg-[#6F4E37] text-white",
                  day_today: "bg-amber-100 text-[#2C1810]",
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.start_date && (
            <p className="text-red-500 text-sm">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-[#2C1810]">
            Fecha de Finalización<span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end_date"
                variant="outline"
                className="w-full justify-start text-left font-normal hover:bg-amber-50/50 border-amber-200/70"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#6F4E37]" />
                {watch("end_date") ? (
                  format(watch("end_date"), 'PP', { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch("end_date")}
                onSelect={(date: Date | null) => setValue("end_date", date || new Date())}
                classNames={{
                  day_selected: "bg-[#6F4E37] text-white",
                  day_today: "bg-amber-100 text-[#2C1810]",
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && (
            <p className="text-red-500 text-sm">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <input type="hidden" {...register("type")} value="ANNUAL" />

      <Button 
        type="submit" 
        className="w-full bg-[#6F4E37] hover:bg-[#5D3D26] text-white mt-6 rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creando álbum...
          </div>
        ) : (
          'Crear Álbum'
        )}
      </Button>
    </form>
  );
};

export default AlbumForm;