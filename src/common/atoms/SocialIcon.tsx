import React from 'react';
import { motion } from 'framer-motion';

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export const SocialIcon = ({ icon, href, label }: SocialIconProps) => {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="text-white hover:text-[#D4A76A] transition-colors duration-300"
    >
      {icon}
    </motion.a>
  );
};