import { toast } from "react-hot-toast";
import { errorMessages, moduleErrorMessages } from "@/common/utils/errors/errorsMessages";

export const useError = (moduleName?: string) => {

  const handleError = (error: any) => {
    const statusCode = error.status || 500; 
    const serverMessage = error.message || "Error desconocido.";

    console.log(statusCode)
    
    const moduleMessages = moduleName ? moduleErrorMessages[moduleName] : {};
    const userFriendlyMessage = moduleMessages[statusCode] || errorMessages[statusCode] || serverMessage;

    toast.error(userFriendlyMessage, {
      duration: 1000,
      position: "top-center",
      id: "error"
    });

    return userFriendlyMessage;
  };

  return handleError;
};