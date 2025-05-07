import { useRegisterVisitMutation } from "@/api/mutations/branches/branch_states.mutation";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Coffee,
  CheckCircle,
  AlertCircle,
  Loader2,
  Store,
  MapIcon,
  ArrowUpRight,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/common/ui/button";
import { CoffeeBackground } from "@/common/widgets/coffee_background.widget";

const ValidateVisitPage = () => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch_id");
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  const {
    mutate: validateVisit,
    isError,
    isIdle,
    status,
    error,
    reset,
  } = useRegisterVisitMutation();

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!branchId) return;
      requestLocation();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const requestLocation = () => {
    if (!branchId) {
      console.error("ID de tienda no proporcionado");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          validateVisit({
            branchId: branchId,
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
    <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 xl:p-12">
      <CoffeeBackground />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-3 sm:px-4 z-10 relative"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-[#6F4E37] to-[#8A624A] p-4 sm:p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-pattern-coffee"></div>
              </div>

              {/* Decoración de la cabecera */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="w-full h-full"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M50 0 C60 20 80 30 100 30 C80 40 70 60 70 100 C60 70 40 60 0 60 C30 50 40 30 50 0" fill="white" />
                  </svg>
                </motion.div>
              </div>

              <div className="relative z-10">
                <h1 className="font-medium text-lg sm:text-xl flex items-center">
                  <Store className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Visita a Cafetería
                </h1>
                <p className="text-amber-100 mt-1 text-xs sm:text-sm">
                  Estamos validando tu presencia en la sucursal
                </p>
              </div>
            </div>

            {/* Contenido principal - Con altura máxima y scroll interno si es necesario */}
            <div className="p-4 sm:p-6 max-h-[calc(85vh-130px)] md:max-h-[500px] overflow-y-auto">
              {isIdle && !animationComplete && (
                <div className="flex flex-col items-center py-4 sm:py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      duration: 0.6,
                      onComplete: () => setAnimationComplete(true),
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                  >
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#2C1810] font-medium text-base sm:text-lg mb-1 sm:mb-2"
                  >
                    Preparando validación...
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[#6F4E37] text-sm text-center max-w-xs"
                  >
                    Necesitamos acceder a tu ubicación para verificar tu visita
                    a la cafetería
                  </motion.p>
                </div>
              )}

              {isIdle && animationComplete && (
                <div className="flex flex-col items-center py-4 sm:py-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1],
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
                        ease: "linear",
                      }}
                    >
                      <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600" />
                    </motion.div>
                  </div>

                  <h2 className="text-[#2C1810] font-medium text-base sm:text-lg mb-1 sm:mb-2">
                    Validando tu visita...
                  </h2>

                  <p className="text-[#6F4E37] text-sm text-center max-w-xs">
                    Estamos confirmando tu ubicación en la cafetería. Esto puede
                    tomar unos segundos.
                  </p>

                  <motion.div
                    className="mt-4 sm:mt-6 flex justify-center w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex gap-2 items-center bg-amber-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-amber-700 text-xs sm:text-sm">
                      <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                      Procesando...
                    </div>
                  </motion.div>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center py-4 sm:py-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 relative"
                  >
                    {/* Efecto de brillos */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={`spark-${i}`}
                        className="absolute w-2 h-2 bg-green-300 rounded-full"
                        initial={{ 
                          x: 0, 
                          y: 0, 
                          opacity: 1, 
                          scale: 0.2 
                        }}
                        animate={{ 
                          x: Math.cos(i * Math.PI * 0.4) * 50, 
                          y: Math.sin(i * Math.PI * 0.4) * 50, 
                          opacity: 0,
                          scale: 0 
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5,
                          delay: i * 0.2,
                          repeatDelay: 1
                        }}
                      />
                    ))}
                    <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full"
                  >
                    <h2 className="text-[#2C1810] font-medium text-lg sm:text-xl mb-1 sm:mb-2 text-center">
                      ¡Visita registrada!
                    </h2>

                    <p className="text-[#6F4E37] text-sm text-center mx-auto max-w-xs mb-4 sm:mb-6">
                      Tu visita ha sido registrada exitosamente. Ahora puedes
                      disfrutar de un delicioso café.
                    </p>

                    <div className="bg-[#FAF3E0] p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-amber-800">
                          Recompensa:
                        </span>
                        <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          +5 CoffeeCoins
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Coffee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 mr-2" />
                        <span className="text-xs sm:text-sm text-[#6F4E37]">
                          ¡Gracias por visitarnos!
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-sm h-auto py-2.5"
                      onClick={() => navigate("/coffeelover")}
                    >
                      Volver al inicio
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Error */}
              {isError && (
                <div className="flex flex-col items-center py-4 sm:py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                  >
                    <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center w-full"
                  >
                    <h2 className="text-[#2C1810] font-medium text-base sm:text-lg mb-1 sm:mb-2">
                      No se pudo validar tu visita
                    </h2>

                    <p className="text-[#6F4E37] text-xs sm:text-sm text-center mx-auto max-w-xs mb-3 sm:mb-4">
                      {error?.message ||
                        "Parece que no estás en la ubicación de la cafetería o hubo un problema al verificar tu posición."}
                    </p>

                    <div className="bg-red-50 p-2 sm:p-3 rounded-lg border border-red-100 text-xs sm:text-sm text-red-700 mb-4 sm:mb-6">
                      <p>
                        Asegúrate de estar dentro de la cafetería y tener el GPS
                        activado.
                      </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 text-xs sm:text-sm py-1.5 h-auto"
                        onClick={handleRetry}
                      >
                        <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                        Intentar nuevamente
                      </Button>

                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm py-1.5 h-auto"
                        onClick={() => navigate("/coffeelover/map-coffelover")}
                      >
                        <MapIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                        Ver mapa
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#FAF3E0]/50 border-t border-amber-100 px-3 sm:px-4 py-2 sm:py-3 text-center">
              <p className="text-[10px] sm:text-xs text-[#6F4E37]/70">
                Encafeinados © {new Date().getFullYear()} • Registro de visitas
              </p>
            </div>
          </div>
          
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-amber-900/5 blur-xl rounded-full z-0"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ValidateVisitPage;
