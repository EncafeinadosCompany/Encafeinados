import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger} from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { BookPlus, Coffee, Sparkles, AlertTriangle, X, Calendar } from "@/common/ui/icons";
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
  const [showConflictError, setShowConflictError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');
  const [dateErrorMessage, setDateErrorMessage] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Función para validar fechas
  const validateDates = (data: CreateAlbumDto): { isValid: boolean; errorMessage?: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas

    if (data.start_date) {
      const startDate = new Date(data.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        return {
          isValid: false,
          errorMessage: `La fecha de inicio (${new Date(data.start_date).toLocaleDateString('es-ES')}) no puede ser anterior a hoy (${today.toLocaleDateString('es-ES')})`
        };
      }
    }

    if (data.end_date) {
      const endDate = new Date(data.end_date);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        return {
          isValid: false,
          errorMessage: `La fecha de fin (${new Date(data.end_date).toLocaleDateString('es-ES')}) no puede ser anterior a hoy (${today.toLocaleDateString('es-ES')})`
        };
      }
    }

    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (startDate > endDate) {
        return {
          isValid: false,
          errorMessage: 'La fecha de inicio no puede ser posterior a la fecha de fin'
        };
      }
    }

    return { isValid: true };
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log("handleOpenChange llamado con:", { newOpen, eventId, formStarted: formStarted.current, success });
    
    if (!newOpen) {
      // No mostrar advertencia si estamos en estado de error o éxito
      if (showConflictError || showDateError || success) {
        setOpen(false);
        return;
      }

      if (eventId && !success) {
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

  const handleConflictClose = () => {
    setShowConflictError(false);
    setConflictMessage('');
    setOpen(false);
  };

  const handleDateErrorClose = () => {
    setShowDateError(false);
    setDateErrorMessage('');
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

      // Validar fechas antes de enviar
      const dateValidation = validateDates(albumData);
      if (!dateValidation.isValid) {
        setDateErrorMessage(dateValidation.errorMessage || 'Error en las fechas');
        setShowDateError(true);
        return;
      }

      console.log("Datos enviados al backend:", albumData);
      
      await UseCreateAlbumMutation(albumData);
      
      setSuccess(true);
      
      if (eventId) {
        setTimeout(() => {
          navigate('/admin/albums', { replace: true });
        }, 1500);
      }
      
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2000);
      
    } catch(error: any) {
      console.error("Error al crear álbum:", error);
      
      if (error?.statusCode === 409 || error?.status === 409) {
        setConflictMessage(error.message || 'Ya existe un álbum para este período');
        setShowConflictError(true);
      }
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
       
          bg-[#FBF7F4] rounded-2xl border-none shadow-xl p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          if (showCloseWarning || showDateError || (eventId && formStarted.current && !success && !showConflictError)) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (showCloseWarning || showDateError || (eventId && formStarted.current && !success && !showConflictError)) {
            e.preventDefault();
          }
        }}
      >
        {showDateError ? (
          // Dialog de error de fechas inválidas
          <div className="p-6 flex flex-col space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#2C1810]">
                  Fechas Inválidas
                </h3>
                <p className="text-[#5F4B32]/80 text-sm">
                  Las fechas seleccionadas no son válidas para crear el álbum
                </p>
              </div>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-medium mb-2">
                Error en las fechas
              </AlertTitle>
              <AlertDescription className="text-red-700">
                <p className="leading-relaxed">
                  {dateErrorMessage}
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Coffee className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 text-sm">
                    Requisitos para las fechas:
                  </h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Las fechas no pueden ser anteriores a hoy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>La fecha de inicio debe ser anterior o igual a la fecha de fin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ambas fechas son obligatorias para crear el álbum</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E6D7C3] text-[#5F4B32] hover:bg-[#F5E4D2]/30"
                onClick={handleDateErrorClose}
              >
                Corregir fechas
              </Button>
              <Button 
                className="flex-1 bg-[#6F4E37] hover:bg-[#5D3D26] text-white"
                onClick={handleDateErrorClose}
              >
                Entendido
              </Button>
            </div>
          </div>
        ) : showConflictError ? (
          // Dialog de error de conflicto (álbum duplicado)
          <div className="p-6 flex flex-col space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#2C1810]">
                  Álbum Anual Ya Existente
                </h3>
                <p className="text-[#5F4B32]/80 text-sm">
                  No se puede crear el álbum porque ya existe uno para este período
                </p>
              </div>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Calendar className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800 font-medium mb-2">
                Detalles del conflicto
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                <p className="leading-relaxed">
                  {conflictMessage}
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Coffee className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 text-sm">
                    ¿Qué puedes hacer?
                  </h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Revisa el álbum existente en la galería de álbumes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Espera al próximo año para crear un nuevo álbum anual</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Considera crear un álbum de evento específico en su lugar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                className="flex-1 bg-[#6F4E37] hover:bg-[#5D3D26] text-white"
                onClick={handleConflictClose}
              >
                Entendido
              </Button>
            </div>
          </div>
        ) : showCloseWarning ? (
          // Dialog de advertencia de cierre (álbumes de evento)
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
          // Contenido normal del formulario
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
            
            <div className="h-px bg-gradient-to-r from-transparent via-[#E6D7C3]/50 to-transparent"></div>
            
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