import { CardVariants } from '@/api/types/map/map_search.types';

/**
 * Container animation variants
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * Card animation variants
 */
export const cardVariants: CardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

/**
 * Pulse animation variants
 */
export const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};