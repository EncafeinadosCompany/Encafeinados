import React from 'react';
import { TeamCard } from '@/common/molecules/TeamCard';
import { motion } from 'framer-motion';

const teamMembers = [
  { name: 'Santiago Florez Valencia', role: 'Frontend Developer', imageUrl: 'https://lh3.google.com/u/0/d/15gFGVknZHndepP3NwhYxrmS6U59f5Bln=w1224-h837-iv1' },
  { name: 'Valentina Cordoba', role: 'Frontend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Crony Lopez', role: 'Backend Developer', imageUrl: 'https://lh3.google.com/u/0/d/1uS8nfm0EKUsMueZpANJ1z_buiXDiQtd1=w1224-h861-iv1' },
  { name: 'Deisy Zapata', role: 'Backend Developer', imageUrl: 'https://lh3.google.com/u/0/d/11VAo3Q7zCoZ9n5pFc5s4YR5g5GLUlbgd=w2625-h5830-iv1?auditContext=forDisplay' },
  { name: 'Jose 👍', role: 'Frontend Developer', imageUrl: 'https://lh3.google.com/u/0/d/1f-h7CbaHoww-OOeRKldcfONIJEEgPNUG=w2625-h5830-iv1?auditContext=forDisplay' },
  { name: 'Juan Pablo', role: 'Backend Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { name: 'Daniela Torres', role: 'Mobile Developer', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

export const TeamSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-16 px-4 bg-gradient-to-b from-white to-[#FAF3E0]/30">
      <div className="max-w-7xl mx-auto">
        <TeamCard members={teamMembers} />
      </div>
    </motion.section>
  );
};