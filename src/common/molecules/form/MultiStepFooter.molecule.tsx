import { motion } from "framer-motion";
import { Button } from "@/common/ui/button";
import { ArrowLeft, ArrowRight } from "@/common/ui/icons";
import { ButtonSuccess } from "../../atoms/forms/button_success.atom";

interface MultiStepFooterProps {
  step: number;
  totalSteps: number;
  isCoffelover?: boolean;
  methods?: any;
  validStep?: number;
  value?: string;
  prevStep: () => void;
  nextStep: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
}

export function MultiStepFooter({
  step,
  totalSteps,
  prevStep,
  nextStep,
  onSubmit,
  isCoffelover,
  value,
  validStep,
  methods,
  isSubmitting = false,
  isValid = true,
}: MultiStepFooterProps) {
  return (
    <div className="flex justify-between w-full">
      {/* Botón Anterior */}
      {step > 0 ? (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="text-xs sm:text-sm border-gray-200 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Anterior
          </Button>
        </motion.div>
      ) : (
        <div />
      )}

      {/* Botón Siguiente o Submit */}
      {step < totalSteps - 1 ? (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={step === 0 ? "ml-auto" : ""}
        >
          <Button
            type="button"
            data-testid="next-button"
            onClick={nextStep}
            className="text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white"
          >
            {(() => {
              if (step === 0) return "Continuar registro";
              if (!isCoffelover) return "Siguiente";
              
              if (step === validStep) {
                const documentNumber = methods?.watch("number_document");
                return documentNumber ? "Siguiente" : value;
              }
              
              return "Siguiente";
            })()}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="ml-auto"
        >
          <ButtonSuccess
            type="button"
            data-testid="submit-button"
            onClick={onSubmit}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Registrando..." : "Completar registro"}
          </ButtonSuccess>
        </motion.div>
      )}
    </div>
  );
}
