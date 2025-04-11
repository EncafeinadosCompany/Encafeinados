import { toast } from "react-hot-toast";
import { errorMessages, moduleErrorMessages } from "@/common/utils/errors/errorsMessages";

export const useError = (moduleName?: string) => {
  const handleError = (error: any) => {
    const statusCode = error.statusCode || 500; 
    const serverMessage = error.message || "Error desconocido.";
    
    const moduleMessages = moduleName ? moduleErrorMessages[moduleName] : {};
    const userFriendlyMessage = moduleMessages[statusCode] || errorMessages[statusCode] || serverMessage;

    toast.error(userFriendlyMessage);

    return userFriendlyMessage;
  };

  return handleError;
};