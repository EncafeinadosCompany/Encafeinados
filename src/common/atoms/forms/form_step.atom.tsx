import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface FormStepProps {
  children: ReactNode;
  isActive: boolean;
  direction: number;
}

export const FormStep: React.FC<FormStepProps> = ({ 
  children, 
  isActive, 
  direction 
}) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="form-step"
          initial={{ x: direction * 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};