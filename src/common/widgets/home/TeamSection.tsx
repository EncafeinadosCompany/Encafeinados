import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Users, Handshake } from 'lucide-react';
import { TeamCard } from '@/common/molecules/home/TeamCard';
import { teamMembers, coLeaders, partners } from '@/common/utils/lists/teamMembers';

const developers = teamMembers;

export const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("developers");
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="py-16 md:py-24 px-4 relative bg-[#FAF3E0] overflow-hidden"
    >
      {/* Elementos decorativos inspirados en café */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 opacity-10 rounded-full bg-[#6F4E37]" 
             style={{ filter: 'blur(40px)' }}></div>
        <div className="absolute top-[30%] right-[10%] w-48 h-48 opacity-10 rounded-full bg-[#D4A76A]" 
             style={{ filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-[20%] left-[15%] w-40 h-40 opacity-10 rounded-full bg-[#D4A76A]" 
             style={{ filter: 'blur(50px)' }}></div>
        
        {/* Siluetas de granos de café */}
        <svg className="absolute top-5 left-5 w-20 h-20 text-[#6F4E37]/5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.23 15.39c-1.12.55-2.35.85-3.62.85-3.31 0-6.16-2.03-7.36-4.91-.23-.55.08-1.17.6-1.23.52-.06 1 .27 1.23.82.94 2.27 3.15 3.87 5.74 3.87.86 0 1.69-.17 2.45-.5.54-.24 1.16.01 1.4.55.24.54-.02 1.17-.55 1.41zm1.78-3c-1.12.55-2.35.85-3.62.85-3.31 0-6.16-2.03-7.36-4.91-.23-.55.08-1.17.6-1.23.52-.06 1 .27 1.23.82.94 2.27 3.15 3.87 5.74 3.87.86 0 1.69-.17 2.45-.5.54-.24 1.16.01 1.4.55.24.54-.02 1.17-.55 1.41z"/>
        </svg>
        
        <svg className="absolute bottom-8 right-8 w-24 h-24 text-[#D4A76A]/5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.23 15.39c-1.12.55-2.35.85-3.62.85-3.31 0-6.16-2.03-7.36-4.91-.23-.55.08-1.17.6-1.23.52-.06 1 .27 1.23.82.94 2.27 3.15 3.87 5.74 3.87.86 0 1.69-.17 2.45-.5.54-.24 1.16.01 1.4.55.24.54-.02 1.17-.55 1.41zm1.78-3c-1.12.55-2.35.85-3.62.85-3.31 0-6.16-2.03-7.36-4.91-.23-.55.08-1.17.6-1.23.52-.06 1 .27 1.23.82.94 2.27 3.15 3.87 5.74 3.87.86 0 1.69-.17 2.45-.5.54-.24 1.16.01 1.4.55.24.54-.02 1.17-.55 1.41z"/>
        </svg>
      </div>
      
      {/* Línea decorativa estilo café */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2C1810]/0 via-[#D4A76A] to-[#2C1810]/0"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Encabezado con animación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          {/* Badge con icono de taza de café */}
          <div className="inline-block mb-4">
            <div className="relative inline-flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A76A] to-[#6F4E37] rounded-full opacity-20"></div>
              <div className="absolute inset-1 bg-[#FAF3E0] rounded-full"></div>
              <Coffee size={32} className="relative z-10 text-[#6F4E37]" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-6 relative inline-block">
            Nuestro Equipo
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent"></div>
          </h2>
          
          <p className="max-w-2xl mx-auto text-[#6F4E37] text-lg">
            Apasionados por crear la mejor plataforma para los amantes del café colombiano.
          </p>
        </motion.div>

        {/* Selector de categorías creativo con temática de café */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12">
            {/* Botón Colíderes */}
            <CategoryButton 
              icon={<Users size={24} />}
              label="Colíderes"
              isActive={activeTab === "co-leaders"}
              onClick={() => setActiveTab("co-leaders")}
            />
            
            {/* Línea decorativa en forma de grano de café */}
            <div className="hidden md:block h-10 w-px bg-[#D4A76A]/30 relative">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-2 h-2 rounded-full bg-[#D4A76A]/50"></div>
            </div>
            
          
            <CategoryButton 
              icon={<Coffee size={24} />}
              label="CoffeeSolvers"
              isActive={activeTab === "developers"}
              onClick={() => setActiveTab("developers")}
            />
              
            <div className="hidden md:block h-10 w-px bg-[#D4A76A]/30 relative">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-2 h-2 rounded-full bg-[#D4A76A]/50"></div>
            </div>
            
       
            <CategoryButton 
              icon={<Handshake size={24} />}
              label="CoffeeThinkers"
              isActive={activeTab === "partners"}
              onClick={() => setActiveTab("partners")}
            />
          </div>
        </motion.div>
        
        {/* Contenido de categorías con animaciones */}
        <div className="min-h-[400px] relative overflow-visible">
          <AnimatePresence mode="wait">
            {activeTab === "co-leaders" && (
              <motion.div
                key="co-leaders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="mb-10 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-[#6F4E37] mb-2">
                    Fundadores & Liderazgo
                  </h3>
                  <p className="text-[#6F4E37]/80 max-w-xl mx-auto">
                    Visionarios con la misión de cambiar la forma en que disfrutamos del café.
                  </p>
                </div>
                <TeamCard members={coLeaders} variant="leadership" />
              </motion.div>
            )}
            
            {activeTab === "developers" && (
              <motion.div
                key="developers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="mb-10 text-center">
                  <p className="text-[#6F4E37]/80 max-w-xl mx-auto">
                    Mentes creativas construyendo la plataforma del futuro para los amantes del café.
                  </p>
                </div>
                <TeamCard members={developers} variant="developers" />
              </motion.div>
            )}
            
            {activeTab === "partners" && (
              <motion.div
                key="partners"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="mb-10 text-center">
                  {/* <h3 className="text-xl md:text-2xl font-bold text-[#6F4E37] mb-2">
                    Aliados Estratégicos
                  </h3> */}
                  <p className="text-[#6F4E37]/80 max-w-xl mx-auto">
                    Colaboradores clave que hacen posible nuestra misión cafetera.
                  </p>
                </div>
                <TeamCard members={partners} variant="partners" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Decoración de taza de café en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2C1810]/0 via-[#D4A76A] to-[#2C1810]/0"></div>
    </section>
  );
};

// Componente para los botones de categoría
const CategoryButton = ({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center transition-all duration-300 ${
        isActive ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'
      }`}
    >
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-br from-[#D4A76A] to-[#6F4E37] shadow-lg shadow-[#D4A76A]/20' 
          : 'bg-[#2C1810]/5 group-hover:bg-[#D4A76A]/20'
        }
      `}>
        <div className={`
          text-[#6F4E37] transition-all duration-300
          ${isActive ? 'text-white' : ''}
        `}>
          {icon}
        </div>
      </div>
      <span className={`
        font-medium transition-all duration-300
        ${isActive ? 'text-[#2C1810]' : 'text-[#6F4E37] group-hover:text-[#2C1810]'}
      `}>
        {label}
      </span>
      
      {/* Indicador de activo */}
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-[#D4A76A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
};