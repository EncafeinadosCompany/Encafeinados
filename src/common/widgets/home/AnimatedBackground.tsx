import React from 'react';
import { motion } from 'framer-motion';

const backgroundStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
};

const createCircleVariant = (
  xRange: number[],
  yRange: number[],
  opacityRange: number[],
  duration: number
) => ({
  initial: { 
    x: 0, 
    y: 0,
    opacity: opacityRange[0],
  },
  animate: { 
    x: xRange,
    y: yRange,
    opacity: opacityRange,
    transition: { 
      duration: duration * 1.5, // Más lento
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
});

interface CircleConfig {
  variant: any;
  className: string;
  delay: number;
}

const circles: CircleConfig[] = [
  {
    variant: createCircleVariant([0, 10, -5, 0], [0, -15, 5, 0], [0.7, 0.8, 0.6, 0.7], 8),
    className: "absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#8B5A2B] opacity-50 blur-sm shadow-lg clip-coffee-bean",
    delay: 0
  },
  {
    variant: createCircleVariant([0, -15, 10, 0], [0, 10, -10, 0], [0.6, 0.7, 0.5, 0.6], 10),
    className: "absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-[#3E2723] opacity-50 blur-sm shadow-lg clip-coffee-stain",
    delay: 2
  },
  {
    variant: createCircleVariant([0, 8, -12, 0], [0, -5, 15, 0], [0.4, 0.5, 0.3, 0.4], 9),
    className: "absolute -bottom-16 left-1/3 w-36 h-36 rounded-full bg-[#4CAF50] opacity-40 blur-sm shadow-lg clip-coffee-leaf",
    delay: 4
  },
];

const AnimatedBackground: React.FC = () => {
  return (
    <div style={backgroundStyle}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3E0]/30 to-[#D4A76A]/10" />

      {/* Coffee beans texture */}
      <div className="absolute inset-0 opacity-20 bg-coffee-beans-texture" />

      {/* Animated circles */}
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          variants={circle.variant}
          initial="initial"
          animate="animate"
          className={circle.className}
          style={{ animationDelay: `${circle.delay}s` }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;