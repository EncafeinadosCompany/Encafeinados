import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { BookPlus, Coffee, Sparkles, AlertTriangle, X } from 'lucide-react';
import { CreateAlbumDto, AlbumType } from '@/api/types/album/album.types';
import { cn } from '@/lib/utils';
import { useCreateAlbumMutation } from '@/api/mutations/album/album.mutation';
import AlbumForm from '@/common/molecules/admin/album/album_form.molecule';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/common/ui/alert';

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
  const [open, setOpen] = useState(autoOpen);
  const navigate = useNavigate();
  const { mutateAsync: UseCreateAlbumMutation, isPending } = useCreateAlbumMutation();
  const [success, setSuccess] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Cambiamos esto para que por defecto sea true cuando es un evento
  const formStarted = useRef(!!eventId);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (autoOpen && !open) {
      setOpen(true);
      console.log("Modal abierto automáticamente");
      
      if (onAfterOpen) {
        onAfterOpen();
      }
    }
  }, [autoOpen, open, onAfterOpen]);

  // Modificamos esta función para asegurar que capture todos los intentos de cierre
  const handleOpenChange = (newOpen: boolean) => {
    console.log("handleOpenChange llamado con:", { newOpen, eventId, formStarted: formStarted.current, success });
    
    if (!newOpen) {
      // Para álbumes de evento, siempre mostrar la alerta a menos que ya haya tenido éxito
      if (eventId && !success) {
        console.log("Mostrando alerta de confirmación");
        setShowCloseWarning(true);
        
        setCountdownSeconds(10);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
          setCountdownSeconds(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current as NodeJS.Timeout);
              setShowCloseWarning(false);
              setOpen(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return; 
      }
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  
  const confirmClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowCloseWarning(false);
    setOpen(false);
  };

  const cancelClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowCloseWarning(false);
  };

  const handleFormInteraction = () => {
    formStarted.current = true;
  };

  const handleCreateAlbum = async (data: CreateAlbumDto & { logoFile?: File }) => {
    try {
      const albumType: AlbumType = eventId ? 'EVENT' : 'ANNUAL';
      
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
      
      await UseCreateAlbumMutation(albumData, {
        onSuccess: () => {
          setSuccess(true);
          
          if (eventId) {
            setTimeout(() => {
              navigate('/admin/album', { replace: true });
            }, 1500);
          }
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      
      <DialogContent 
        className="w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[75vw] xl:w-[65vw] 2xl:w-[60vw]
          max-h-[95vh] h-auto
          bg-[#FBF7F4] rounded-2xl border-none shadow-xl p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          if (showCloseWarning || (eventId && formStarted.current && !success)) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (showCloseWarning || (eventId && formStarted.current && !success)) {
            e.preventDefault();
          }
        }}
      >
        {showCloseWarning ? (
          <div className="p-6 flex flex-col space-y-6">
            <Alert variant="destructive" className="border-amber-500 bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-800 text-lg font-medium mb-2">
                ¡Atención! Esta es tu única oportunidad
              </AlertTitle>
              <AlertDescription className="text-amber-700 space-y-4">
                <p>
                  Estás intentando salir sin crear el álbum para este evento. Si cierras esta ventana, 
                  <strong className="font-semibold"> no podrás volver a crear un álbum para este evento específico</strong>.
                </p>
                <p>
                  La ventana se cerrará automáticamente en <span className="font-bold text-amber-800">{countdownSeconds}</span> segundos.
                </p>
                <div className="flex flex-col xs:flex-row gap-3 justify-end mt-4">
                  <Button 
                    variant="outline" 
                    className="border-amber-500 text-amber-700 hover:bg-amber-100"
                    onClick={confirmClose}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cerrar de todos modos
                  </Button>
                  <Button 
                    className="bg-[#6F4E37] hover:bg-[#5D3D26] text-white"
                    onClick={cancelClose}
                  >
                    Continuar creando el álbum
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 bg-[#FBF7F4] border-b border-[#E6D7C3]/50">
              <div className="absolute right-4 top-4 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white text-[#5F4B32] hover:text-[#2C1810] hover:scale-105 transition-all shadow-sm"
                  onClick={() => handleOpenChange(false)}
                  aria-label="Cerrar diálogo"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#DB8935]/10 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <DialogHeader className="px-6 pt-6 pb-4 relative">
                <DialogTitle className="flex items-center gap-2 text-[#2C1810] text-xl md:text-2xl">
                  <div className="bg-[#DB8935]/10 p-2 rounded-full">
                    <Coffee className="h-5 w-5 text-[#DB8935]" />
                  </div>
                  <span>
                    {success ? '¡Álbum creado con éxito!' : 
                     eventId ? 'Crear Álbum de Evento' : 'Crear Nuevo Álbum'}
                  </span>
                </DialogTitle>
                {!success && (
                  <DialogDescription className="text-[#5F4B32]/80 mt-1.5">
                    {eventId 
                      ? 'Este álbum estará vinculado al evento seleccionado'
                      : 'Crea un nuevo álbum para destacar tus cafeterías favoritas'}
                  </DialogDescription>
                )}
              </DialogHeader>
            </div>
            
            {/* Línea divisoria sutil */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#E6D7C3]/50 to-transparent"></div>
            
            {/* Contenido con scroll */}
            <div className="overflow-y-auto max-h-[calc(95vh-130px)] custom-scrollbar">
              {success ? (
                <div className="p-8 text-center">
                  <div className="mx-auto bg-[#DB8935]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-[#DB8935]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#5F4B32] mb-2">¡Álbum creado con éxito!</h3>
                  <p className="text-[#5F4B32]/80">
                    Tu nuevo álbum ha sido creado y ya está disponible en la galería.
                  </p>
                </div>
              ) : (
                <div className="px-6 py-5">
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
                    onFormInteraction={handleFormInteraction}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAlbumWidget;