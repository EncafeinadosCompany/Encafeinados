import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    setTimeout(() => {
      setIsSubmitted(true);
      setEmail('');
      // Reset después de 3 segundos
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 500);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {!isSubmitted ? (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-grow px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#D4A76A] transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-[#D4A76A] text-white font-medium rounded-full hover:bg-[#A67C52] transition-colors shadow-lg"
          >
            Suscribir
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-2 rounded-lg bg-green-500/20 backdrop-blur-sm text-white"
        >
          ¡Gracias por suscribirte! ☕
        </motion.div>
      )}
    </div>
  );
};
