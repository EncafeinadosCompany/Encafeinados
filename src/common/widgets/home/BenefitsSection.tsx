import React, { useEffect } from 'react';
import { Text } from '@/common/atoms/Text';
import { BenefitCard } from '@/common/molecules/home/BenefitCard';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Importamos íconos 
import { Coffee, MapPin, Clock, Star, Gift } from 'lucide-react';

export const BenefitsSection = () => {
  // Ref para detectar cuando la sección está en vista
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Animaciones
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const benefits = [
    {
      title: 'Descubre Cafeterías',
      description: 'Encuentra las mejores cafeterías de especialidad de la ciudad, con opiniones y experiencias reales.',
      icon: <Coffee className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop'
    },
    {
      title: 'Talleres y catas guiadas por expertos',
      description: 'Aprende de baristas y expertos en café con talleres interactivos, donde descubrirás métodos de filtrado, notas de sabor y la ciencia detrás de cada taza.',
      icon: <Coffee className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?w=500&h=500&fit=crop'
    },
    {
      title: 'Ubicación Precisa',
      description: 'Navega fácilmente en el mapa hasta la cafetería de tu elección con direcciones precisas.',
      icon: <MapPin className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=500&fit=crop'
    },
    {
      title: 'Pasaporte cafetero',
      description: 'Descubre, prueba y colecciona. Explora las mejores cafeterías de especialidad y recibe sellos digitales por cada visita desbloqueando recompensas.',
      icon: <Clock className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&h=500&fit=crop'
    },
    {
      title: 'Acceso a cafés exclusivos',
      description: 'Accede a cafés únicos y de edición limitada, con la posibilidad de recibir recomendaciones personalizadas según tu perfil de sabor.',
      icon: <Star className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop'
    },
    {
      title: 'Promociones',
      description: 'Accede a ofertas especiales, disfruta de descuentos y promociones solo para miembros de la plataforma.',
      icon: <Gift className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1512034400317-de97d7d6c3ed?w=500&h=500&fit=crop'
    },
    
  ];

  // Variantes para animación 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12,
        duration: 0.7 
      } 
    }
  };

  // Elemento decorativo de fondo
  const decorElements = [
    { top: '10%', left: '5%', size: 'w-24 h-24', opacity: 'opacity-5', delay: 0 },
    { top: '40%', right: '8%', size: 'w-40 h-40', opacity: 'opacity-10', delay: 0.4 },
    { bottom: '15%', left: '15%', size: 'w-32 h-32', opacity: 'opacity-5', delay: 0.8 }
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-white to-[#FAF3E0]">
      {/* Elementos decorativos de fondo */}
      {decorElements.map((elem, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-[#6F4E37] ${elem.size} ${elem.opacity} transform`}
          style={{ 
            top: elem.top || 'auto', 
            left: elem.left || 'auto', 
            right: elem.right || 'auto', 
            bottom: elem.bottom || 'auto' 
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={inView ? { 
            scale: [0, 1.2, 1], 
            rotate: [0, 45, 0],
            transition: { 
              duration: 2, 
              delay: elem.delay,
              ease: "easeOut" 
            }
          } : {}}
        />
      ))}

      <div className="max-w-7xl mx-auto relative">
        {/* Encabezado con animación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <Text variant="h2" className="inline-block relative text-[#6F4E37] font-bold">
            Beneficios de Encafeinados
            <motion.div 
              className="absolute -bottom-2 left-0 h-1 bg-[#D4A76A]"
              initial={{ width: 0 }}
              animate={inView ? { width: '100%' } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </Text>
          <Text variant="p" className="mt-4 max-w-2xl mx-auto text-[#A67C52]">
            Descubre cómo nuestra aplicación transforma tu experiencia cafetera con estas funciones exclusivas
          </Text>
        </motion.div>
        
        {/* Grid de beneficios con diseño escalonado */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`${
                index === benefits.length - 1 && benefits.length % 2 !== 0 ? 
                  'md:col-span-2 lg:col-span-1 lg:mx-auto lg:w-2/3' : ''
              }`}
            >
              <BenefitCard
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
                imageSrc={benefit.imageSrc}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Botón de CTA */}
        {/* <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button className="group relative px-8 py-3 overflow-hidden font-medium rounded-lg bg-gradient-to-r from-[#6F4E37] to-[#A67C52] text-white shadow-md hover:shadow-xl transition-all duration-300">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">Descubre Todos los Beneficios</span>
          </button>
        </motion.div> */}
      </div>
    </section>
  );
};