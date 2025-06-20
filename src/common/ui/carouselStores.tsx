import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Theme {
  id: string;
  name: string;
  image: string;
  color: string;
}

interface ThemeCarouselProps {
  themes: Theme[];
  onSelectTheme?: (theme: Theme) => void;
  className?: string;
}

export const ThemeCarousel = ({ 
  themes, 
  onSelectTheme,
  className 
}: ThemeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle theme
  const [direction, setDirection] = useState(0);

  // Get visible themes (previous, current, next)
  const visibleThemes = () => {
    const result = [];
    const prev = currentIndex - 1 >= 0 ? currentIndex - 1 : themes.length - 1;
    const next = (currentIndex + 1) % themes.length;
    
    result.push(themes[prev]);
    result.push(themes[currentIndex]);
    result.push(themes[next]);
    
    return result;
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 >= 0 ? prevIndex - 1 : themes.length - 1
    );
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className={cn("w-full py-8 px-4", className)}>
      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-3xl font-light text-gray-700 mb-6 flex justify-between">
          Theme
          <span className="text-gray-400">
            {String(currentIndex + 1).padStart(2, '0')}/{themes.length}
          </span>
        </h2>
        
        <div className="relative h-[400px] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Navigate Previous */}
            <button 
              onClick={handlePrev}
              className="absolute left-2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
              aria-label="Previous theme"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            
            {/* Carousel */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                {visibleThemes().map((theme, idx) => {
                  // Position: 0 = left, 1 = center, 2 = right
                  const position = idx;
                  
                  return (
                    <motion.div
                      key={theme.id}
                      custom={direction}
                      initial={{
                        scale: position === 1 ? 0.95 : 0.7,
                        x: position === 0 ? -280 : position === 2 ? 280 : 0,
                        opacity: position === 1 ? 1 : 0.6,
                        zIndex: position === 1 ? 10 : 5,
                      }}
                      animate={{
                        scale: position === 1 ? 1 : 0.75,
                        x: position === 0 ? -280 : position === 2 ? 280 : 0,
                        opacity: position === 1 ? 1 : 0.7,
                        zIndex: position === 1 ? 10 : 5,
                      }}
                      exit={{
                        scale: 0.7,
                        opacity: 0.5,
                        zIndex: 0,
                      }}
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className={`absolute cursor-pointer overflow-hidden rounded-3xl shadow-xl ${
                        position === 1 ? "w-80 h-96" : "w-64 h-80"
                      }`}
                      onClick={() => {
                        if (position !== 1) {
                          setDirection(position === 0 ? -1 : 1);
                          setCurrentIndex(
                            themes.findIndex((t) => t.id === theme.id)
                          );
                        } else if (onSelectTheme) {
                          onSelectTheme(theme);
                        }
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${theme.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 
                          className={`text-${position === 1 ? "5xl" : "3xl"} font-light text-white transition-all duration-300`}
                          style={{ 
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
                          }}
                        >
                          {theme.name}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Navigate Next */}
            <button
              onClick={handleNext}
              className="absolute right-2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
              aria-label="Next theme"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {themes.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                "w-6 h-1.5 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-gray-600 w-10" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to theme ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};