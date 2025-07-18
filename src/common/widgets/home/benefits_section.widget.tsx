import React, { useEffect } from 'react';
import { Text } from '@/common/atoms/common/text.atom';
import { useInView } from 'react-intersection-observer';
import { BenefitCard } from '@/common/molecules/home/benefit_card.molecule';
import { motion, useAnimation } from 'framer-motion';
import { Coffee, MapPin, Clock, Star, Gift } from "@/common/ui/icons";

export const BenefitsSection = () => {

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

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
      title: 'Ubicación Precisa',
      description: 'Navega fácilmente en el mapa hasta la cafetería de tu elección con direcciones precisas.',
      icon: <MapPin className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=500&fit=crop'
    },
    {
      title: 'Álbum y eventos',
      description: 'Acumula sellos al visitar tus cafeterías favoritas y completa el álbum. También podrás asistir a eventos y conectar con otros coffelovers.',
      icon: <Gift className="h-8 w-8" />,
      imageSrc: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop'
    },
    

  ];

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

  const decorElements = [
    { top: '10%', left: '5%', size: 'w-24 h-24', opacity: 'opacity-5', delay: 0 },
    { top: '40%', right: '8%', size: 'w-40 h-40', opacity: 'opacity-10', delay: 0.4 },
    { bottom: '15%', left: '15%', size: 'w-32 h-32', opacity: 'opacity-5', delay: 0.8 }
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 relative overflow-hidden bg-gradient-to-b from-white to-[#FAF3E0]">
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


        <motion.div
          className={`grid grid-cols-1 ${benefits.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} lg:grid-cols-3 gap-6 md:gap-8`}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`${
                index === benefits.length - 1 && benefits.length % 2 !== 0 && benefits.length !== 3
                  ? 'md:col-span-2 lg:col-span-1 lg:mx-auto lg:w-2/3'
                  : ''
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
      </div>
    </section>
  );
};