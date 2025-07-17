import React, { useState, useEffect } from "react";
import { Text } from "@/common/atoms/common/text.atom";
import { motion } from "framer-motion";
import { ArrowRightIcon, ChevronDownIcon } from "@/common/ui/icons";
import { Link } from "react-router-dom";
import { useScrollNavigation } from "@/common/hooks/useScrollNavigation";

export const HeroSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollToSection } = useScrollNavigation(['map']);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToMap = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('map', { offset: -80 });
  };

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


      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-4xl text-center"
        >
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
            <Link
              to="/login"

              className="group relative px-6 py-3 bg-[#D4A76A] hover:bg-[#C19559] text-[#0F0F0F] rounded-full 
                transition-all duration-300 font-medium flex items-center justify-center gap-2 
                shadow-lg shadow-[#D4A76A]/20 hover:shadow-[#D4A76A]/30 overflow-hidden"
            >
              <span className="relative z-10">Comenzar</span>
              <ArrowRightIcon className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </Link>

          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <button 
            onClick={handleScrollToMap}
            className="text-white/70 text-sm mb-2 block cursor-pointer hover:text-white transition"
          >
            Descubre más
          </button>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={handleScrollToMap}
            className="cursor-pointer"
          >
            <ChevronDownIcon className="h-6 w-6 text-white/70 hover:text-white transition" />
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

    </section>
  );
};
