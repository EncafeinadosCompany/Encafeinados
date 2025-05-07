import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import React, { useRef, useMemo } from "react";

interface CoffeeBackgroundProps {
  coffeeCount?: number;
  circleCount?: number;
  gradientFrom?: string;
  gradientTo?: string;
  opacity?: number;
  coffeeColor?: string;
  circleColor?: string;
  zIndex?: number;
}

export const CoffeeBackground: React.FC<CoffeeBackgroundProps> = React.memo(({
  coffeeCount = 20,
  circleCount = 12,
  gradientFrom = "#FFFBF6",
  gradientTo = "#FAF3E0",
  opacity = 95,
  coffeeColor = "amber-800",
  circleColor = "217, 119, 6",
  zIndex = 0,
}) => {
  const coffeeElements = useMemo(() => {
    return Array(coffeeCount).fill(0).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      scale: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
      rotate: Math.random() * 360,
      duration: Math.random() * 20 + 15,
      size: Math.floor(Math.random() * 8 + 4)
    }));
  }, [coffeeCount]); 

  const circleElements = useMemo(() => {
    return Array(circleCount).fill(0).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      width: Math.random() * 40 + 10,
      height: Math.random() * 40 + 10,
      opacity: Math.random() * 0.07 + 0.02,
      duration: Math.random() * 25 + 20,
    }));
  }, [circleCount]); 

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-${zIndex}`}>
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          opacity: `${opacity}%`
        }}
      ></div>
      
      {coffeeElements.map(item => (
        <motion.div
          key={`coffee-${item.id}`}
          className="absolute"
          initial={{
            x: item.x,
            y: item.y,
            scale: item.scale,
            opacity: item.opacity,
            rotate: item.rotate
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            rotate: [item.rotate, item.rotate + 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse",
          }}
        >
          <Coffee 
            className={`text-${coffeeColor}/20 w-${item.size} h-${item.size}`} 
          />
        </motion.div>
      ))}
      
      {circleElements.map(item => (
        <motion.div
          key={`circle-${item.id}`}
          className="absolute rounded-full"
          style={{
            width: `${item.width}px`,
            height: `${item.height}px`,
            background: `rgba(${circleColor}, ${item.opacity})`,
          }}
          initial={{
            x: item.x,
            y: item.y,
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
});

CoffeeBackground.displayName = "CoffeeBackground";

export default CoffeeBackground;