import React, { useRef } from 'react';
import { TeamCard } from '@/common/molecules/home/TeamCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { teamMembers } from '@/common/utils/lists/teamMembers';



export const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  // Subtle parallax effect for decorative circles
  const circle1X = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const circle2X = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, y }}
      className="py-16 md:py-24 px-4 relative overflow-hidden"
    >
      <motion.div
        style={{ x: circle1X }}
        className="absolute top-10 left-10 md:left-20 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-br from-[#D4A76A]/5 to-transparent rounded-full blur-xl"
      ></motion.div>
      <motion.div
        style={{ x: circle2X }}
        className="absolute bottom-10 right-10 md:right-20 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-tl from-[#6F4E37]/5 to-transparent rounded-full blur-xl"
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