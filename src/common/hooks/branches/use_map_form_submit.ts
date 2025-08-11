import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UseMapFormSubmitProps<T> {
  mutation: {
    mutateAsync: (data: T) => Promise<any>;
    isPending: boolean;
  };
  onSuccess?: () => void;
  onError?: (error: any) => void;
  successRedirect?: string;
}

export const useMapFormSubmit = <T>({
  mutation,
  onSuccess,
  onError,
  successRedirect = "/",
}: UseMapFormSubmitProps<T>) => {
  const navigate = useNavigate();

  const submitWithMapCleanup = useCallback(
    async (data: T) => {
      try {
        await mutation.mutateAsync(data);
        onSuccess?.();

        // Simple delay y navegación
        setTimeout(() => {
          navigate(successRedirect, { replace: true });
        }, 100);
      } catch (error) {
        console.error("Error en submit:", error);
        if (onError) {
          onError(error);
        } else {
          toast.error("Error al procesar la solicitud");
        }
      }
    },
    [mutation, onSuccess, onError, successRedirect, navigate]
  );

  return {
    submitWithMapCleanup,
    isSubmitting: mutation.isPending,
  };
};
