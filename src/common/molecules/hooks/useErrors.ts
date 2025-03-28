import { toast } from "react-hot-toast";
import { errorMessages, moduleErrorMessages } from "@/common/utils/errors/errorsMessages";

export const useError = (moduleName?: string) => {
  const handleError = (error: any) => {
    const statusCode = error.statusCode || 500; 
    const serverMessage = error.message || "Error desconocido.";
    
    // Primero, revisamos si hay un mensaje específico para este módulo
    const moduleMessages = moduleName ? moduleErrorMessages[moduleName] : {};
    const userFriendlyMessage = moduleMessages[statusCode] || errorMessages[statusCode] || serverMessage;

    // Mostramos el error con Toast
    toast.error(userFriendlyMessage);

    return userFriendlyMessage;
  };

  return handleError;
};