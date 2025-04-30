import { useRegisterVisitMutation } from "@/api/mutations/branchApprovalMutations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Coffee, CheckCircle, AlertCircle, Loader2,
  Store, MapIcon, ArrowUpRight, RefreshCcw
} from "lucide-react";
import { Button } from "@/common/ui/button";

const ValidateVisitPage = () => {
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get("branch_id");
  const [animationComplete, setAnimationComplete] = useState(false);

  const {
    mutate: validateVisit,
    isError,
    isIdle,
    status,
    error,
    reset
  } = useRegisterVisitMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!shopId) return;
      requestLocation();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const requestLocation = () => {
    if (!shopId) {
      console.error("ID de tienda no proporcionado");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          validateVisit({
            branch_id: shopId, 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleRetry = () => {
    reset();
    requestLocation();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFBF6] to-[#FAF3E0] px-4 py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={status} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-[#6F4E37] to-[#8A624A] p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-pattern-coffee"></div>
              </div>
              
              <div className="relative z-10">
                <h1 className="font-medium text-xl flex items-center">
                  <Store className="mr-2 h-5 w-5" />
                  Visita a Cafetería
                </h1>
                <p className="text-amber-100 mt-1 text-sm">
                  Estamos validando tu presencia en la sucursal
                </p>
              </div>
            </div>
            
            <div className="p-6">
              {(isIdle && !animationComplete) && (
                <div className="flex flex-col items-center py-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      duration: 0.6,
                      onComplete: () => setAnimationComplete(true)
                    }}
                    className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6"
                  >
                    <MapPin className="h-10 w-10 text-amber-600" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#2C1810] font-medium text-lg mb-2"
                  >
                    Preparando validación...
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[#6F4E37] text-center max-w-xs"
                  >
                    Necesitamos acceder a tu ubicación para verificar tu visita a la cafetería
                  </motion.p>
                </div>
              )}
              
              {(isIdle && animationComplete) && (
                <div className="flex flex-col items-center py-6">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="absolute inset-0 bg-amber-100 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear"
                      }}
                    >
                      <MapPin className="h-10 w-10 text-amber-600" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-[#2C1810] font-medium text-lg mb-2">
                    Validando tu visita...
                  </h2>
                  
                  <p className="text-[#6F4E37] text-center max-w-xs">
                    Estamos confirmando tu ubicación en la cafetería. Esto puede tomar unos segundos.
                  </p>
                  
                  <motion.div 
                    className="mt-6 flex justify-center w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex gap-2 items-center bg-amber-50 px-4 py-1.5 rounded-full text-amber-700 text-sm">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Procesando...
                    </div>
                  </motion.div>
                </div>
              )}
              
              {status === "success" && (
                <div className="flex flex-col items-center py-6">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-[#2C1810] font-medium text-xl mb-2 text-center">
                      ¡Visita registrada!
                    </h2>
                    
                    <p className="text-[#6F4E37] text-center max-w-xs mb-6">
                      Tu visita ha sido registrada exitosamente. Ahora puedes disfrutar de un delicioso café.
                    </p>
                    
                    <div className="bg-[#FAF3E0] p-4 rounded-xl border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-800">Recompensa:</span>
                        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          +5 CoffeeCoins
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Coffee className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-sm text-[#6F4E37]">
                          ¡Gracias por visitarnos!
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
                      onClick={() => window.location.href = "/coffeelover/rewards"}
                    >
                      Ver mis recompensas
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                </div>
              )}
              
              {/* Error */}
              {isError && (
                <div className="flex flex-col items-center py-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6"
                  >
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <h2 className="text-[#2C1810] font-medium text-lg mb-2">
                      No se pudo validar tu visita
                    </h2>
                    
                    <p className="text-[#6F4E37] text-center max-w-xs mb-4">
                      {error?.message || "Parece que no estás en la ubicación de la cafetería o hubo un problema al verificar tu posición."}
                    </p>
                    
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-700 mb-6">
                      <p>Asegúrate de estar dentro de la cafetería y tener el GPS activado.</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                        onClick={handleRetry}
                      >
                        <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                        Intentar nuevamente
                      </Button>
                      
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => window.location.href = "/coffeelover"}
                      >
                        <MapIcon className="w-3.5 h-3.5 mr-1.5" />
                        Ver mapa
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-[#FAF3E0]/50 border-t border-amber-100 px-4 py-3 text-center">
              <p className="text-xs text-[#6F4E37]/70">
                Encafeinados © {new Date().getFullYear()} • Registro de visitas
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ValidateVisitPage;
