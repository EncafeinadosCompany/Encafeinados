import { useRegisterVisitMutation } from "@/api/mutations/branches/branch_states.mutation";
import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Coffee, CheckCircle, AlertCircle, Loader2, Store, MapIcon, ArrowUpRight, RefreshCcw, Sparkles, MessageCircle } from "@/common/ui/icons"
import { Button } from "@/common/ui/button";
import { CoffeeBackground } from "@/common/widgets/coffee_background.widget";

const ValidateVisitPage = () => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch_id");
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  const { mutate: validateVisit, isError, isIdle, status, error, reset, data: responseData } = useRegisterVisitMutation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
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

  useEffect(() => {
    if (responseData) {
      console.log("Datos de respuesta:", responseData);
    }
  }, [responseData]);

  const coffeecoinsEarned = responseData?.data?.coffeecoins_earned || 0;
  const stampInfo = responseData?.data?.stamp || null;

  const handleReviewClick = () => {
    navigate(`/coffeelover/review?branch_id=${branchId}&branch_name=${encodeURIComponent(stampInfo?.name || '')}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden touch-none">
      <CoffeeBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-2 xs:px-3 sm:px-4 z-10 relative"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg border border-amber-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-[#6F4E37] to-[#8A624A] p-4 sm:p-5 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-pattern-coffee"></div>
              </div>

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

            <div className="p-3 xs:p-4 sm:p-6 overflow-y-auto flex-1 max-h-[calc(80vh-100px)] sm:max-h-[calc(85vh-130px)] md:max-h-[500px]">
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
                <div className="flex flex-col items-center pt-0 pb-1 sm:pb-1">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mb-2 relative"
                  >
                    {Array.from({ length: 3 }).map((_, i) => (
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
                          x: Math.cos(i * Math.PI * 0.67) * 40,
                          y: Math.sin(i * Math.PI * 0.67) * 40,
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
                    <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full"
                  >
                    <h2 className="text-[#2C1810] font-medium text-base sm:text-lg mb-1 text-center">
                      ¡Visita registrada!
                    </h2>

                    <div className="bg-[#FAF3E0] p-3 rounded-lg sm:rounded-xl border border-amber-100 w-full mb-3">
                      {stampInfo && (
                        <div className="flex items-center mb-2 pb-2 border-b border-amber-100">
                          {stampInfo.logo ? (
                            <img
                              src={stampInfo.logo}
                              alt={stampInfo.name}
                              className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-lg mr-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/public/cafeino.png";
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-amber-200 rounded-lg flex items-center justify-center mr-2">
                              <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xs sm:text-sm font-medium text-amber-800">
                              {stampInfo.name}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-amber-600">
                              Cafetería visitada
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-amber-800 flex items-center">
                          <Coffee className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-amber-600" />
                          Recompensa:
                        </span>
                        <div className="bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                          +{coffeecoinsEarned} CoffeeCoins
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-4 space-y-2">
                      <h3 className="text-xs text-[#6F4E37] font-medium mb-1.5 text-center">
                        ¿Qué deseas hacer ahora?
                      </h3>

                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs sm:text-sm h-auto py-2.5 sm:py-3 shadow-md relative overflow-hidden border-b-2 border-amber-700 group"
                        onClick={handleReviewClick}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-center">
                          <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white mr-1.5" />
                          <span>Comparte tu experiencia</span>
                          <div className="flex items-center ml-1.5 bg-amber-400/30 rounded-full px-1.5 py-0.5">
                            <Sparkles className="h-2.5 w-2.5 text-yellow-200 mr-0.5" /> {/* Cambio de Star a Sparkles */}
                            <span className="text-[10px] text-white font-medium">+5</span>
                          </div>
                        </div>
                      </Button>

                      <div className="flex gap-2 w-full mt-2">
                        <Button
                          className="flex-1 bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium text-xs sm:text-sm h-auto py-2 sm:py-2.5 transition-colors"
                          onClick={() => navigate("/coffeelover")}
                        >
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                          Volver al inicio
                        </Button>

                        <Button
                          className="flex-1 bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium text-xs sm:text-sm h-auto py-2 sm:py-2.5 transition-colors"
                          onClick={() => navigate("/coffeelover/map-coffelover")}
                        >
                          <MapIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                          Ver mapa
                        </Button>
                      </div>

                      <p className="text-[9px] sm:text-[10px] text-center text-amber-800/70 mt-1">
                        Gana 5 CoffeeCoins adicionales por compartir tu opinión
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

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
            <div className="bg-[#FAF3E0]/50 border-t border-amber-100 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 text-center flex-shrink-0">
              <p className="text-[9px] xs:text-[10px] sm:text-xs text-[#6F4E37]/70">
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