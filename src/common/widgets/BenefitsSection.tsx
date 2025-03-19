import React from 'react';
import { Text } from '@/common/atoms/Text';
import { BenefitCard } from '@/common/molecules/BenefitCard';
import { motion } from 'framer-motion';

import { Coffee, Map, Clock, Star, Gift } from 'lucide-react';

export const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Descubre Cafeterías',
      description: 'Encuentra las mejores cafeterías de la ciudad en un solo lugar',
      icon: <Coffee />
    },
    {
      title: 'Ubicación Precisa',
      description: 'Localiza rápidamente las cafeterías más cercanas a ti',
      icon: <Map />
    },
    {
      title: 'Ahorra Tiempo',
      description: 'Haz pedidos anticipados y evita esperas innecesarias',
      icon: <Clock />
    },
    {
      title: 'Acumula Puntos',
      description: 'Gana puntos con cada compra y canjéalos por productos',
      icon: <Star />
    },
    {
      title: 'Promociones Exclusivas',
      description: 'Accede a ofertas y descuentos especiales',
      icon: <Gift />
    }
  ];

  // Variantes para animación al hacer scroll
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <Text variant="h2" className="text-center mb-12 text-[#6F4E37]">Beneficios de Encafeinados</Text>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <BenefitCard 
                title={benefit.title} 
                description={benefit.description} 
                icon={benefit.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};