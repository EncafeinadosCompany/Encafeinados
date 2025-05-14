import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "@/common/atoms/LoadingSpinner";

export const RouteLoadingIndicator = () => {
    const [progress, setProgress] = useState(0);
    const location = useLocation();
  
    useEffect(() => {
      setProgress(0);
  
      const expectedLoadTime = 2500;
      const startTime = Date.now();
  
      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const calculatedProgress = Math.min(99, (elapsed / expectedLoadTime) * 100);
  
        setProgress(Math.round(calculatedProgress));
  
        if (calculatedProgress >= 99) {
          clearInterval(intervalId);
        }
      }, 50);
  
      return () => clearInterval(intervalId);
    }, [location.pathname]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setProgress(100);
      }, 300);
  
      return () => clearTimeout(timeout);
    }, []);
  
    return <LoadingSpinner progress={progress} message="Preparando tu café..." size="lg" />;
  };