import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next"

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Simplified coffee bean positions for subtle animation
  const beans = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  }));

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/coffee-3759005_1280.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay to make background darker */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      
      {/* Subtle animated coffee beans */}
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          className="absolute w-6 h-3 rounded-full bg-amber-800 opacity-10 z-10"
          style={{ left: `${bean.x}%`, top: `${bean.y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: bean.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Main content */}
      <motion.div 
        className="max-w-md w-full relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Minimalist 404 heading */}
        <motion.h1 
          className="text-8xl font-bold text-[#D4A76A] mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          className="text-3xl font-medium text-white mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Momento <span className="text-amber-500">{t('Not found')}</span>
        </motion.h2>
        
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-gray-300 text-1xl mb-2 ">
            La página que buscas se ha desvanecido como el aroma del café.
          </h1>
          <div className="w-16 h-0.5 bg-amber-700 mx-auto my-6"></div>
        </motion.div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            className="bg-transparent rounded-full text-[#c8bbaa] border border-amber-100 px-6 py-2 hover:bg-[#bea87a8d] hover:bg-opacity-20 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </motion.button>
          
          <motion.button
            className="bg-transparent text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
          >
            Página anterior
          </motion.button>
        </div>
      </motion.div>
      
      {/* Minimalist coffee cup icon */}
      <motion.div 
        className="absolute bottom-10 opacity-20 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-20 h-16 border-2 border-amber-700 rounded-b-full rounded-t-lg relative">
          <div className="absolute -right-4 top-1/4 w-4 h-8 border-2 border-amber-700 rounded-r-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;