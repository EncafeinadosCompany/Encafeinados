import React, { useState, useEffect } from "react";
import { Text } from "@/common/atoms/Text";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon, ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import logoIcon from "../../assets/images/logo.ico";

export const HeroSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showMobileLocation, setShowMobileLocation] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0F0F0F]">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/333523/pexels-photo-333523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollPosition * 0.15}px)`,
          opacity: 0.6,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/70 via-[#0F0F0F]/50 to-[#0F0F0F]/80" />

      <div className="absolute inset-0 bg-[url('/api/placeholder/100/100')] bg-repeat opacity-5" />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center"
        >
          <div className="flex items-center space-x-2">
            <img
              src={logoIcon}
              alt="Encafeinados logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-white font-bold text-xl">Encafeinados</span>
          </div>
            <div className="flex items-center space-x-3">
            <motion.div
              onClick={() => setShowMobileLocation((prev) => !prev)}
              className="cursor-pointer"
            >
              <MapPinIcon className="text-[#D4A76A] h-5 w-5" />
            </motion.div>

            <span className="text-white/80 text-sm hidden md:inline-block">
              Medellín, Colombia
            </span>

            <AnimatePresence>
              {showMobileLocation && (
              <motion.span
                variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="text-white/80 text-sm md:hidden"
              >
                Medellín, Colombia
              </motion.span>
              )}
            </AnimatePresence>
            </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-4xl text-center"
        >
          {/* Título principal animado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mb-6"
          >
            <Text
              variant="h1"
              className="text-white font-black tracking-tight leading-tight mb-2"
            >
              Encuentra tu <span className="text-[#D4A76A]">momento</span> de
              café perfecto
            </Text>

            {/* Línea decorativa */}
            <div className="mx-auto w-16 h-1 bg-[#D4A76A] rounded-full my-6" />

            <Text
              variant="p"
              className="text-white/80 max-w-xl mx-auto leading-relaxed"
            >
              Descubre, saborea y comparte la mejor experiencia cafetera en
              Medellín. Conectamos a los amantes del café con sabores únicos y
              lugares auténticos.
            </Text>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              onClick={() => setShowMap(true)}
              className="group relative px-6 py-3 bg-[#D4A76A] hover:bg-[#C19559] text-[#0F0F0F] rounded-full 
                transition-all duration-300 font-medium flex items-center justify-center gap-2 
                shadow-lg shadow-[#D4A76A]/20 hover:shadow-[#D4A76A]/30 overflow-hidden"
            >
              <span className="relative z-10">Comenzar</span>
              <ArrowRightIcon className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </button>

            <button
              className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-full 
                transition-all duration-300 font-medium backdrop-blur-sm"
            >
              Explorar
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-white/70 text-sm mb-2">Descubre más</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDownIcon className="h-6 w-6 text-white/70" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute -left-10 top-1/4 opacity-20 hidden md:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-32 h-32 rounded-full border border-[#D4A76A]/50 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-[#D4A76A]/50 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#D4A76A]/50" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-10 bottom-1/4 opacity-20 hidden md:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-40 h-40 rounded-full border border-[#D4A76A]/50 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-[#D4A76A]/50 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-[#D4A76A]/50" />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMap && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800">
                  Mapa de Cafeterías
                </h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="h-[60vh] bg-gray-100 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-lg text-gray-600">
                    Aquí se cargará el mapa de cafeterías
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Estamos trabajando en esta funcionalidad
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
