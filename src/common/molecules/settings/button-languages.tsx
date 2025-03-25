import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="flex items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-amber-800 text-white"
        onClick={toggleLanguage}
      >
        {i18n.language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;