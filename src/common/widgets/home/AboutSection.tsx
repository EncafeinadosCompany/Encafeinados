import React from 'react';
import { Text } from '@/common/atoms/Text';
import { Separator } from '@/common/ui/separator';
import { motion } from 'framer-motion';

export const AboutSection = () => {
  return (
    <section className="relative py-16 px-4 bg-cover bg-center" style={{ backgroundImage: 'url(/api/placeholder/1920/1080)' }}>
      <div className="absolute inset-0 bg-[#2C1810] bg-opacity-70"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Text variant="h2" className="mb-4">Acerca de Nosotros</Text>
          <Separator className="mx-auto w-24 h-1 bg-[#D4A76A] mb-6" />
          
          <Text variant="p" className="mb-6">
          Coffeelovers apasionados que disfrutan creando soluciones para todo el ecosistema de café: conectamos, soñamos y cocreamos parches alrededor del café.
          </Text>
          
          <Text variant="p">
            Queremos convertirnos en la plataforma de referencia para descubrir, valorar y disfrutar de las experiencias cafeteras más auténticas, 
            mientras creamos una comunidad apasionada por el buen café.
          </Text>
        </motion.div>
      </div>
    </section>
  );
};