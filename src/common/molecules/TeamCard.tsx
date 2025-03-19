import React, { useState } from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Avatar } from '@/common/ui/avatar';
import { Text } from '@/common/atoms/Text';
import { motion } from 'framer-motion';
import { Coffee, Linkedin, Mail, Twitter } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-[#faf3e0]">
      
      
      <CardContent className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}>
          <Text variant="h2" className="text-center mb-2 text-[#6F4E37] font-bold">Nuestro Increíble Equipo</Text>
          <p className="text-center text-[#A67C52] mb-8 mx-auto max-w-lg">
            Conoce a las personas apasionadas que hacen posible Encafeinados, 
            uniendo tecnología y amor por el café.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {members.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative">
              <div 
                className={`relative flex flex-col items-center transition-all duration-300 transform 
                ${activeIndex === index ? 'scale-110 z-10' : 'hover:scale-105'}`}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                <div className="relative">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 shadow-md group-hover:shadow-xl transition-all duration-500
                    border-2 border-[#D4A76A] bg-gradient-to-br from-[#6F4E37]/10 to-[#D4A76A]/20
                    overflow-hidden group-hover:border-[#6F4E37]">
                    <motion.img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.15, transition: { duration: 0.6 } }}
                    />
                  </Avatar>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={activeIndex === index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-2 right-0 bg-[#6F4E37] rounded-full p-1 shadow-lg">
                    <Coffee size={16} className="text-white" />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  className="mt-3 text-center w-full">
                  <Text variant="p" className="text-center font-medium text-[#2C1810] text-sm md:text-base truncate max-w-full">
                    {member.name}
                  </Text>
                  <Text variant="small" className="text-center text-[#6F4E37] opacity-80 text-xs md:text-sm">
                    {member.role}
                  </Text>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, height: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex space-x-2 mt-2 justify-center overflow-hidden">
                  <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} 
                    className="p-1 rounded-full bg-[#6F4E37] text-white hover:bg-[#A67C52] transition-colors">
                    <Linkedin size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} 
                    className="p-1 rounded-full bg-[#6F4E37] text-white hover:bg-[#A67C52] transition-colors">
                    <Twitter size={16} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} 
                    className="p-1 rounded-full bg-[#6F4E37] text-white hover:bg-[#A67C52] transition-colors">
                    <Mail size={16} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-px w-12 bg-[#D4A76A] opacity-50"></div>
            <span className="mx-4 text-[#6F4E37] text-sm">Uniendo pasión y tecnología</span>
            <div className="h-px w-12 bg-[#D4A76A] opacity-50"></div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};