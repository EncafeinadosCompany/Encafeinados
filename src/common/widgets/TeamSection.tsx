import React, { useRef } from 'react';
import { TeamCard } from '@/common/molecules/home/TeamCard';
import { motion, useScroll, useTransform } from 'framer-motion';

const teamMembers = [
  { name: 'Santiago Florez Valencia', role: 'Frontend Developer', imageUrl: 'https://lh3.google.com/u/0/d/15gFGVknZHndepP3NwhYxrmS6U59f5Bln=w1224-h837-iv1' },
  { name: 'Valentina Cordoba', role: 'Frontend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Crony Lopez', role: 'Backend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Deisy Zapata', role: 'Backend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Jose 👍', role: 'Frontend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Juan Pablo', role: 'Backend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Daniela Torres', role: 'Mobile Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

export const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  // Efecto de parallax sutil para los círculos decorativos
  const circle1X = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const circle2X = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  
  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity, y }}
      className="py-16 md:py-24 px-4 relative overflow-hidden"
    >
      {/* Círculos decorativos con efecto parallax */}
      <motion.div 
        style={{ x: circle1X }}
        className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-[#D4A76A]/5 to-transparent rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div 
        style={{ x: circle2X }}
        className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tl from-[#6F4E37]/5 to-transparent rounded-full blur-3xl"
      ></motion.div>
      
      {/* Líneas decorativas */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A76A]/20 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4A76A]/20 to-transparent"></div>
      
      <motion.div
        style={{ scale }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <TeamCard members={teamMembers} />
      </motion.div>
    </motion.section>
  );
};