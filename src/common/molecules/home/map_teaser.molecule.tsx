import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Coffee, Navigation } from "@/common/ui/icons";
import { useNavigate } from "react-router-dom";
import { useCoffeloversCount } from "@/api/queries/coffelovers/coffelovers_count.query";
import SafeNumericDisplay from "@/common/atoms/common/safe_numeric_display.atom";
import { useApprovedBranches } from "@/api/queries/branches/branch.query";
import { useCityCurrency } from "@/common/utils/map/map_utils";

export const MapTeaser = () => {
  const navigate = useNavigate();
  const { data: coffeloversData } = useCoffeloversCount();

  const handleOpenMap = () => {
    navigate("/map");
  };

  const { data: totalCafes, isLoading, error:errorBranch } = useApprovedBranches();
  const { city, loading, error, requestLocation } = useCityCurrency();

  if (isLoading) {
    return (
      <div>
        <span>Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <span>ah ocurrído un error</span>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pinVariants = {
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="pt-16 px-4 overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto bg-gradient-to-r from-[#6F4E37]/5 to-[#D4A76A]/10 rounded-3xl overflow-hidden relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4A76A]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#6F4E37]/10 rounded-full blur-3xl"></div>

        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <motion.div
            className="flex flex-col justify-center"
            variants={containerVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4E37]/10 rounded-full mb-4 text-[#6F4E37] font-medium text-sm w-fit"
              variants={itemVariants}
            >
              <Coffee size={16} />
              <span>Encuentra tu café ideal</span>
            </motion.div>

            {!isLoading && !errorBranch && totalCafes ? (
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-[#2C1810]"
                variants={itemVariants}
              >
                Explora {totalCafes.length}+ cafeterías en tu ciudad 
              </motion.h2>
            ) : (
              <div></div>
            )}
            <motion.p
              className="text-[#6F4E37] mb-6 max-w-md"
              variants={itemVariants}
            >
              Descubre las mejores cafeterías cercanas, lee reseñas y encuentra
              tu próxima parada para un café excepcional.{" "}
              <span className="text-[#2C1810] font-semibold">
                Únete a nuestra comunidad de más de{" "}
                <SafeNumericDisplay
                  value={coffeloversData?.totalClients}
                  defaultValue="1,000"
                />{" "}
                coffelovers
              </span>{" "}
              que comparten la pasión por el buen café.
            </motion.p>

            <motion.button
              onClick={handleOpenMap}
              className="group flex items-center gap-2 bg-[#6F4E37] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#5a3e2c] w-fit cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Ver mapa interactivo</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Navigation size={18} className="transform -rotate-45" />
              </motion.div>
            </motion.button>

            <motion.div
              className="mt-6 flex gap-4 items-center text-sm text-[#6F4E37]"
              variants={itemVariants}
            ></motion.div>
          </motion.div>

          <motion.div className="relative h-80" variants={itemVariants}>
            <motion.div
            
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-[#D4A76A]/20 bg-white cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-full h-full relative">
                {/* Imagen de mapa en lugar de cuadrícula */}
                <img 
                  src="/map_teaser.jpg" 
                  alt="Mapa de cafeterías" 
                  className="w-full h-full object-cover" 
                />
                
                {/* Superponemos un filtro de color café suave */}
                <div className="absolute inset-0 bg-[#6F4E37]/10"></div>

                <motion.div
                  className="absolute top-1/4 left-1/3 z-10"
                  variants={pinVariants}
                  whileHover="hover"
                >
                 
                </motion.div>

            

              

                <div className="absolute top-4 z-10 right-4 bg-white/90 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white cursor-pointer transition-colors">
                  <motion.div
                   onClick={requestLocation}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Navigation size={20} className="text-[#6F4E37]" />
                  </motion.div>
                </div>

              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-[#3C2A21]/80 backdrop-blur-sm py-3 px-4 text-center text-sm font-medium text-white border-t border-[#E8C99B]/30">
                <motion.div
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <MapPin size={16} className="text-[#E8C99B]" />
                  <span>
                    {loading ? 
                      <span className="text-[#F5E6D0]/80">Obteniendo ubicación...</span> : 
                      <p className="text-[#F5E6D0]">Explora cafeterías en {city}</p>
                    }
                  </span>
                </motion.div>
              </div>

              {/* Overlay que cubre toda el área del mapa y muestra el botón al hacer hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center transition-colors cursor-pointer"
                initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                whileHover={{ backgroundColor: "rgba(60,42,33,0.4)" }}
                onClick={handleOpenMap}
              >
                <motion.span
                  className="bg-[#E8C99B] text-[#3C2A21] px-5 py-3 rounded-full font-medium shadow-lg border border-[#E8C99B]/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  whileInView={{ opacity: 0 }}
                >
                  Abrir mapa interactivo
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};


export default memo(MapTeaser)