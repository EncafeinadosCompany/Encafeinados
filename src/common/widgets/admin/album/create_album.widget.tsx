import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { BookPlus, Coffee, Sparkles } from 'lucide-react';
import { CreateAlbumDto,  AlbumType  } from '@/api/types/album/album.types';
import { cn } from '@/lib/utils';
import { useCreateAlbumMutation } from '@/api/mutations/album/album.mutation';
import AlbumForm from '@/common/molecules/admin/album/album_form.molecule';


interface CreateAlbumWidgetProps {
  className?: string;
  autoOpen?: boolean;
  onAfterOpen?: () => void;
  eventId?: number;
  startDate?: string;
  endDate?: string;
}

export const CreateAlbumWidget: React.FC<CreateAlbumWidgetProps> = ({ 
  className, 
  autoOpen = false,
  onAfterOpen,
  eventId, 
  startDate, 
  endDate 
}) => {
  const [open, setOpen] = useState(autoOpen); // Inicializa con el valor de autoOpen
  const { mutateAsync: UseCreateAlbumMutation, isPending } = useCreateAlbumMutation();
  const [success, setSuccess] = useState(false);

  // Responder a cambios en autoOpen
  useEffect(() => {
    if (autoOpen && !open) {
      setOpen(true);
      console.log("Modal abierto automáticamente");
      
      // Notificar que el modal se ha abierto
      if (onAfterOpen) {
        onAfterOpen();
      }
    }
  }, [autoOpen, open, onAfterOpen]);

  const handleCreateAlbum = async (data: CreateAlbumDto & { logoFile?: File }) => {
    try {
      const albumType: AlbumType = eventId ? 'EVENT' : 'ANNUAL';
      
      // Crear el objeto con el tipo fuertemente tipado
      const albumData: CreateAlbumDto & { logoFile?: File } = {
        ...data,
        type: albumType,
        ...(eventId && { 
          entity_id: eventId,
          start_date: startDate || data.start_date,
          end_date: endDate || data.end_date
        })
      };

      console.log("Datos enviados al backend:", albumData);
      
      // Ahora TypeScript debería aceptar este objeto
      await UseCreateAlbumMutation(albumData, {
        onSuccess: () => {
          setSuccess(true);
        }
      });
      
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2000);
    } catch(err) {
      console.error("Error al crear álbum:", err);
    }
    
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={cn(
            "bg-[#6F4E37] hover:bg-[#5D3D26] text-white flex items-center gap-2 shadow-sm",
            className
          )}
          aria-label="Crear Nuevo Álbum"
        >
          <BookPlus size={16} />
          <span>Crear Álbum</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[65vw] lg:max-w-2xl xl:max-w-3xl bg-white rounded-xl border-amber-200 p-4 md:p-6 h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-[#2C1810] text-xl md:text-2xl">
            <Coffee className="h-5 w-5 text-[#6F4E37]" />
            {success ? '¡Álbum creado con éxito!' : 'Crear Nuevo Álbum'}
          </DialogTitle>
          {!success && (
            <DialogDescription className="text-amber-700/70">
              Crea un nuevo álbum para destacar tus cafeterías favoritas
            </DialogDescription>
          )}
        </DialogHeader>
        
        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-1">¡Perfecto!</h3>
            <p className="text-green-600">
              Tu álbum ha sido creado exitosamente.
            </p>
          </div>
        ) : (
          <div className="py-2 overflow-y-auto">
            <AlbumForm 
              onSubmit={handleCreateAlbum} 
              isSubmitting={isPending} 
              initialData={{
                type: eventId ? 'EVENT' : 'ANNUAL',
                start_date: startDate,
                end_date: endDate,
                entity_id: eventId
              }}
              isEventMode={!!eventId}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumWidget;