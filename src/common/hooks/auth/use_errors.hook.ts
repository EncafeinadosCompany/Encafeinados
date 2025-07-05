import { toast } from "react-hot-toast";
import { errorMessages, moduleErrorMessages } from "@/common/utils/errors/errors_messages.utils";

export const useError = (moduleName?: string) => {

  const handleError = (error: any) => {
    const statusCode = error.status || error.statusCode ||  500; 
    const serverMessage = error.message || "Error desconocido.";

    const moduleMessages = moduleName ? moduleErrorMessages[moduleName] : {};
    const userFriendlyMessage = moduleMessages[statusCode] || errorMessages[statusCode] || serverMessage;

    toast.remove();
    toast.error(userFriendlyMessage, {
      duration: 1500,
      position: "top-center",
      id: "error"
    });

    return userFriendlyMessage;
  };

  return handleError;
};