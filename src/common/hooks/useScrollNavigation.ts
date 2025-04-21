import { useEffect, useState, useCallback } from "react";

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

export function useScrollNavigation() {
  const [activeSection, setActiveSection] = useState<string>("home");
  useEffect(() => {
    const sectionIds = ["home", "map", "stores", "benefits"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: "-20% 0px -30% 0px",
      threshold: [0.3, 0.5, 0.7]
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string, options: ScrollOptions = {}) => {
    const { offset = -80, behavior = "smooth" } = options;
    
    const targetElement = document.getElementById(id);
    if (!targetElement) {
      return false;
    }
    
    try {
      targetElement.scrollIntoView({
        behavior,
        block: "start"
      });
      
      setTimeout(() => {
        window.scrollBy({
          top: offset,
          behavior: "auto"
        });
      }, 100);
      
      return true;
    } catch (error) {
      
      try {
        const elementPosition = targetElement.offsetTop;
        window.scrollTo({
          top: elementPosition + offset,
          behavior
        });
        return true;
      } catch (secondError) {
        return false;
      }
    }
  }, []);

  const isActive = useCallback((id: string): boolean => {
    return id === activeSection;
  }, [activeSection]);

  return { scrollToSection, isActive, activeSection };
}