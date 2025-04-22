import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sparkles, Heart } from '@/common/ui/icons';
import { Separator } from '@/common/ui/separator';
import coffeeBgPattern from '@/assets/images/logo.png'; 

export const AboutSection = () => {
  return (
    <section 
      id="about" 
      className="relative py-16 md:py-24 px-4 scroll-mt-20 bg-[#FAF3E0]"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${coffeeBgPattern || 
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%236F4E37' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8h1a4 4 0 0 1 0 8h-1'%3E%3C/path%3E%3Cpath d='M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z'%3E%3C/path%3E%3Cline x1='6' y1='1' x2='6' y2='4'%3E%3C/line%3E%3Cline x1='10' y1='1' x2='10' y2='4'%3E%3C/line%3E%3Cline x1='14' y1='1' x2='14' y2='4'%3E%3C/line%3E%3C/svg%3E"})`,
          backgroundSize: '60px',
        }}
      />

      {/* Elemento decorativo - ahora con z-index bajo y pointer-events-none */}
      <div className="absolute top-10 right-10 text-[#D4A76A]/20 hidden md:block z-0 pointer-events-none">
        <Coffee size={120} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Columna izquierda: imagen */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" 
              alt="Café colombiano" 
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </motion.div>
          
          {/* Columna derecha: contenido */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#2C1810]/5 text-[#6F4E37] text-sm font-medium mb-4">
              <Sparkles size={16} className="mr-2 text-[#D4A76A]" />
              Nuestra Misión
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-6 leading-tight">
              Conectamos amantes del café con experiencias auténticas
            </h2>
            
            <Separator className="w-16 h-1 bg-[#D4A76A] mb-6" />
            
            <div className="space-y-4 text-[#6F4E37] leading-relaxed">
              <p className="text-lg">
                Coffeelovers apasionados que disfrutan creando soluciones para todo el ecosistema de café: conectamos, soñamos y cocreamos parches alrededor del café.
              </p>
              
              <p>
                Queremos convertirnos en la plataforma de referencia para descubrir, valorar y disfrutar de las experiencias cafeteras más auténticas, mientras creamos una comunidad apasionada por el buen café.
              </p>
            </div>
            
            {/* Valores */}
            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-[#D4A76A]/10">
                <Heart size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-sm font-medium text-[#6F4E37]">Pasión</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-[#D4A76A]/10">
                <Coffee size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-sm font-medium text-[#6F4E37]">Calidad</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-[#D4A76A]/10">
                <Sparkles size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-sm font-medium text-[#6F4E37]">Autenticidad</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Separador para asegurar que no haya problemas con la siguiente sección */}
      <div className="h-1 w-full"></div>
    </section>
  );
};