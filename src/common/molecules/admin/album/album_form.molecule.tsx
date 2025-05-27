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
import { CalendarIcon, UploadIcon, XIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { CreateAlbumDto, AlbumType } from '@/api/types/album/album.types';
import { Image, Edit2, BookmarkIcon, AlignLeft, CalendarCheck, InfoIcon, BookPlus, AlertCircle } from 'lucide-react';

const albumSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "El título no puede exceder 100 caracteres"),
  introduction: z.string().min(10, "La introducción debe tener al menos 10 caracteres"),
  type: z.enum(["ANNUAL", "EVENT"]),
  start_date: z.date(),
  end_date: z.date(),
  entity_id: z.number().optional(),
}).refine(data => data.end_date > data.start_date, {
  message: "La fecha de finalización debe ser posterior a la de inicio",
  path: ["end_date"]
});

type AlbumFormValues = z.infer<typeof albumSchema>;

interface AlbumFormProps {
  onSubmit: (data: CreateAlbumDto & { logoFile?: File }) => void;
  isSubmitting: boolean;
  initialData?: {
    type?: AlbumType;
    start_date?: string;
    end_date?: string;
    entity_id?: number;
  };
  isEventMode?: boolean;
  onFormInteraction?: () => void;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  initialData,
  isEventMode = false,
  onFormInteraction
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors }, clearErrors } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: '',
      introduction: '',
      type: initialData?.type || (isEventMode ? 'EVENT' : 'ANNUAL'),
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      entity_id: initialData?.entity_id
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
    setLogoFile(undefined); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const processForm = async (data: AlbumFormValues) => {
    if (isEventMode && initialData?.start_date && initialData?.end_date) {
      onSubmit({
        ...data,
        logo: "",
        logoFile: logoFile,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        entity_id: initialData.entity_id
      });
    } else {
      onSubmit({
        ...data,
        logo: "",
        logoFile: logoFile,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd')
      });
    }
  };

  const handleInteraction = () => {
    if (onFormInteraction) {
      onFormInteraction();
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disablePastDates = (date: Date) => {
    return date < today;
  };

  const disableInvalidEndDates = (date: Date) => {
    const startDate = watch("start_date");
    if (date < today) return true;
    if (startDate && date < startDate) return true;
    return false;
  };

  return (
    <form 
      onSubmit={handleSubmit(processForm)} 
      className="space-y-6"
      onClick={handleInteraction}
      onChange={handleInteraction} 
    >
      <div className="mb-8 relative">
        <Label htmlFor="logo" className="text-[#5F4B32] font-medium mb-2 flex items-center gap-1.5">
          <div className="bg-[#DB8935]/10 p-1 rounded-full">
            <Image size={14} className="text-[#DB8935]" />
          </div>
          <span>Logo del álbum</span>
        </Label>
        
        <div 
          className={`relative mx-auto w-40 h-40 rounded-xl overflow-hidden transition-all duration-300
            ${logoPreview 
              ? 'shadow-md hover:shadow-lg group transform hover:-translate-y-1' 
              : 'border-2 border-dashed border-[#E6D7C3] hover:border-[#DB8935]/50'
            }
            cursor-pointer flex items-center justify-center 
            ${logoPreview ? 'bg-transparent' : 'bg-[#FBF7F4]'}`}
          onClick={triggerFileInput}
        >
          {logoPreview ? (
            <>
              <img 
                src={logoPreview} 
                alt="Vista previa del logo" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                  <Edit2 size={14} className="text-[#5F4B32]" />
                </div>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogo();
                }}
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm hover:bg-white transition-all duration-300 hover:scale-110"
              >
                <XIcon size={14} className="text-rose-600" />
              </button>
            </>
          ) : (
            <div className="text-center p-4">
              <div className="bg-[#DB8935]/10 p-3 rounded-full mx-auto mb-3">
                <UploadIcon size={20} className="text-[#DB8935]" />
              </div>
              <p className="text-sm font-medium text-[#5F4B32]">Subir imagen</p>
              <p className="text-xs mt-1 text-[#5F4B32]/70">JPG, PNG o GIF (máx. 2MB)</p>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-[#5F4B32] font-medium flex items-center gap-1.5">
          <div className="bg-[#DB8935]/10 p-1 rounded-full">
            <BookmarkIcon size={14} className="text-[#DB8935]" />
          </div>
          <span>Título del álbum</span>
        </Label>
        <Input
          id="title"
          placeholder="Ejemplo: Cafés de Especialidad 2025"
          className="bg-white/70 focus-visible:ring-[#DB8935] focus-visible:border-[#E6D7C3] rounded-lg px-3 py-2 border border-[#E6D7C3]/50 transition-all duration-300 hover:border-[#E6D7C3]"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-rose-500 text-sm mt-1 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{errors.title.message}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction" className="text-[#5F4B32] font-medium flex items-center gap-1.5">
          <div className="bg-[#DB8935]/10 p-1 rounded-full">
            <AlignLeft size={14} className="text-[#DB8935]" />
          </div>
          <span>Descripción</span>
        </Label>
        <Textarea
          id="introduction"
          placeholder="Escribe una breve descripción del álbum..."
          className="h-24 resize-none bg-white/70 focus-visible:ring-[#DB8935] focus-visible:border-[#E6D7C3] rounded-lg px-3 py-2 border border-[#E6D7C3]/50 transition-all duration-300 hover:border-[#E6D7C3]"
          {...register("introduction")}
        />
        {errors.introduction && (
          <p className="text-rose-500 text-sm mt-1 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{errors.introduction.message}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#5F4B32] font-medium flex items-center gap-1.5">
            <div className="bg-[#DB8935]/10 p-1 rounded-full">
              <CalendarIcon size={14} className="text-[#DB8935]" />
            </div>
            <span>Fecha de inicio</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/70 hover:bg-white border-[#E6D7C3]/50 focus-visible:ring-[#DB8935] rounded-lg px-3 py-2 transition-all duration-300 hover:border-[#DB8935]/50"
                disabled={isEventMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#DB8935]" />
                {watch("start_date") ? (
                  format(watch("start_date"), 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watch("start_date")}
                onSelect={(date) => {
                  if (date && !disablePastDates(date)) {
                    setValue("start_date", date);
                    clearErrors("start_date");
                    if (onFormInteraction) onFormInteraction();
                  }
                }}
                disabled={disablePastDates}
              />
            </PopoverContent>
          </Popover>
          {errors.start_date && (
            <p className="text-red-600 text-xs flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.start_date.message}
            </p>
          )}
          {isEventMode && (
            <p className="text-xs text-[#5F4B32]/60">
              La fecha está vinculada al evento y no se puede modificar
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[#5F4B32] font-medium flex items-center gap-1.5">
            <div className="bg-[#DB8935]/10 p-1 rounded-full">
              <CalendarCheck size={14} className="text-[#DB8935]" />
            </div>
            <span>Fecha de finalización</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/70 hover:bg-white border-[#E6D7C3]/50 focus-visible:ring-[#DB8935] rounded-lg px-3 py-2 transition-all duration-300 hover:border-[#DB8935]/50"
                disabled={isEventMode}
              >
                <CalendarCheck className="mr-2 h-4 w-4 text-[#DB8935]" />
                {watch("end_date") ? (
                  format(watch("end_date"), 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watch("end_date")}
                onSelect={(date) => {
                  if (date && !disableInvalidEndDates(date)) {
                    setValue("end_date", date);
                    clearErrors("end_date");
                    if (onFormInteraction) onFormInteraction();
                  }
                }}
                disabled={disableInvalidEndDates}
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && (
            <p className="text-red-600 text-xs flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.end_date.message}
            </p>
          )}
          {isEventMode && (
            <p className="text-xs text-[#5F4B32]/60">
              La fecha está vinculada al evento y no se puede modificar
            </p>
          )}
        </div>
      </div>

      <input 
        type="hidden" 
        {...register("type")} 
        value={(isEventMode ? 'EVENT' : 'ANNUAL') as AlbumType} 
      />
      
      {isEventMode && initialData?.entity_id && (
        <input type="hidden" {...register("entity_id")} value={initialData.entity_id} />
      )}
      
      {isEventMode && (
        <div className="bg-[#FBF7F4] border border-[#E6D7C3]/70 rounded-xl p-4 flex items-start gap-3">
          <div className="bg-[#DB8935]/10 p-2 rounded-full flex-shrink-0 mt-0.5">
            <InfoIcon size={16} className="text-[#DB8935]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-medium text-[#5F4B32]">Álbum vinculado a evento</h4>
            <p className="text-sm text-[#5F4B32]/80">
              Este álbum estará asociado al evento seleccionado. Las fechas se han configurado automáticamente según el periodo del evento y no pueden modificarse.
            </p>
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-[#6F4E37] hover:bg-[#5D3D26] text-white transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:scale-[1.01] rounded-xl py-2.5"
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
            <div className="flex items-center justify-center gap-2">
              <BookPlus size={18} />
              <span>Crear Álbum</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AlbumForm;