import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { BookPlus, Coffee, Sparkles } from 'lucide-react';
import { CreateAlbumDto } from '@/api/types/album/album.types';
import { cn } from '@/lib/utils';
import { useCreateAlbumMutation } from '@/api/mutations/album/album.mutation';
import AlbumForm from '@/common/molecules/admin/AlbumForm';

interface CreateAlbumWidgetProps {
  className?: string;
}

export const CreateAlbumWidget: React.FC<CreateAlbumWidgetProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: UseCreateAlbumMutation , isPending } = useCreateAlbumMutation();
  const [success, setSuccess] = useState(false);

  const handleCreateAlbum = async (data: CreateAlbumDto & { logoFile?: File }) => {

    try {

      UseCreateAlbumMutation(data,{
      onSuccess: () => {
        setSuccess(true); 
      }
    })
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
    }, 2000);

    }catch(err){

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
            <AlbumForm onSubmit={handleCreateAlbum} isSubmitting={isPending} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumWidget;