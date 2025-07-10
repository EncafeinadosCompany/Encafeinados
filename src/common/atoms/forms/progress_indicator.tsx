import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  variant?: 'default' | 'simple';
}

export const ProgressIndicatorLine: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
  variant = 'default'
}) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Variante simple - solo barra de progreso
  if (variant === 'simple') {
    return (
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
        />
      </div>
    );
  }
  
  // Variante por defecto - barra + indicadores
  return (
    <div className="w-full space-y-4">
      {/* Barra de progreso */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-amber-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {/* Indicador de paso actual */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                i < currentStep 
                  ? 'bg-amber-600 text-white' 
                  : i === currentStep 
                  ? 'bg-amber-200 text-amber-800 ring-2 ring-amber-600' 
                  : 'bg-gray-200 text-gray-400'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Nombres de pasos (opcional) */}
      {steps && (
        <div className="hidden sm:flex justify-between text-xs text-gray-500">
          {steps.map((stepName, i) => (
            <span 
              key={i}
              className={`${i <= currentStep ? 'text-amber-600 font-medium' : ''}`}
            >
              {stepName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Exportar también como componente individual simple
export const SimpleProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
  className?: string;
}> = ({ currentStep, totalSteps, className = "" }) => {
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
      />
    </div>
  );
};