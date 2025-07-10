import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ProfileFormContainerProps {
  children: ReactNode;
  backgroundGradient?: string;
}

export const ProfileFormContainer: React.FC<ProfileFormContainerProps> = ({
  children,
  backgroundGradient = "from-amber-50 via-orange-50 to-red-50"
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} p-4`}>
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};