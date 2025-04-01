import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Avatar } from '@/common/ui/avatar';
import { Text } from '@/common/atoms/Text';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Coffee, Sparkles } from '@/common/ui/icons';

interface TeamMember {
  name: string;
  role: string;
  imagenUrl?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

interface TeamCardProps {
  members: TeamMember[];
}

export const TeamCard = ({ members }: TeamCardProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const backgroundStyle = {
    backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
  };

  return (
    <Card 
      ref={cardRef}
      className="w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-xl
        bg-gradient-to-br from-white via-[#faf3e0]/80 to-[#f5e9d8]
        dark:from-[#2C1810] dark:via-[#3a2615] dark:to-[#4a2f1a]
        backdrop-blur-sm border border-[#D4A76A]/20
        transition-all duration-500 ease-out transform"
      style={{
        boxShadow: '0 10px 40px -10px rgba(111, 78, 55, 0.2)',
        ...backgroundStyle
      }}
    >
      <CardContent className="p-8 pt-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-[#D4A76A]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#6F4E37]/10 rounded-full blur-2xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-8 md:mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-3"
            >
              <span className="inline-flex items-center justify-center p-1 bg-[#D4A76A]/10 backdrop-blur-sm rounded-full">
                <Sparkles className="text-[#D4A76A] w-5 h-5" />
              </span>
            </motion.div>
            
            <Text variant="h2" className="text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6F4E37] to-[#A67C52] mb-2">
              Nuestro Increíble Equipo
            </Text>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center text-[#A67C52] dark:text-[#D4A76A]/90 mb-2 mx-auto max-w-lg font-light"
            >
              Conoce a las personas apasionadas que hacen posible Encafeinados
            </motion.p>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={isInView ? { width: "80px" } : { width: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent my-4"
            ></motion.div>
          </div>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 relative z-10"
        >
          {members.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.2 } 
              }}
              className="relative group"
            >
              <div 
                className={`relative flex flex-col items-center p-2 md:p-3 rounded-xl 
                transition-all duration-300 transform cursor-pointer
                ${activeIndex === index ? 'bg-white/80 dark:bg-[#2C1810]/80 backdrop-blur-md scale-105 z-20 shadow-lg' : 
                'hover:bg-white/40 dark:hover:bg-[#2C1810]/40 hover:backdrop-blur-sm'}`}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-br from-[#D4A76A] to-[#6F4E37]">
                    <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-white dark:border-[#2C1810] overflow-hidden rounded-full">
                      <motion.img 
                        src={member.imagenUrl} 
                        alt={member.name}
                        className="object-cover w-full h-full"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.12, transition: { duration: 0.6 } }}
                      />
                    </Avatar>
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={activeIndex === index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[#6F4E37] to-[#A67C52] rounded-full p-1.5 shadow-lg"
                  >
                    <Coffee size={14} className="text-white" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  className="mt-3 text-center w-full"
                >
                  <h4 className="font-medium text-[#2C1810] dark:text-white text-sm md:text-base truncate max-w-full">
                    {member.name}
                  </h4>
                  <p className="text-[#6F4E37] dark:text-[#D4A76A] text-xs md:text-sm font-light opacity-90 mt-0.5">
                    {member.role}
                  </p>
                </motion.div>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex space-x-1 mt-3 justify-center overflow-hidden"
                    >
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Reflejo/Sombra debajo */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex === index ? 0.15 : 0.1 }}
                className="w-14 h-1.5 bg-[#6F4E37] absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rounded-full blur-sm"
                style={{ 
                  scale: activeIndex === index ? 1.2 : 1,
                  transition: "all 0.3s ease-out" 
                }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent"></div>
            <span className="mx-3 text-[#6F4E37] dark:text-[#D4A76A] text-xs font-light tracking-wide">PASIÓN POR EL CAFÉ</span>
            <div className="h-px w-12 bg-gradient-to-r from-[#D4A76A] via-[#D4A76A] to-transparent"></div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
