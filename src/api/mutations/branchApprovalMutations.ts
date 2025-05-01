import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import AuthClient from "../client/axios";

const authClient = new AuthClient();

// Mutación para aprobar una sucursal
export const useApproveBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: number) => {
      // Obtener el userId del localStorage
      const userId = localStorage.getItem("userId");

      console.log("userId from localStorage:", userId); // Depuración

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: true,
        approvedById: parseInt(userId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

// Mutación para rechazar una sucursal
export const useRejectBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      approvalId,
      reason,
    }: {
      approvalId: number;
      reason: string;
    }) => {
      // Obtener el userId del localStorage con verificación
      const userId = localStorage.getItem("userId");

      console.log("userId from localStorage:", userId); // Depuración

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: false,
        approvedById: parseInt(userId),
        comments: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

interface ValidateVisitInput {
  shop_id: string;
  latitude: number;
  longitude: number;
}

interface ValidateVisitResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useRegisterVisitMutation = (): UseMutationResult<
  ValidateVisitResponse,
  Error,
  ValidateVisitInput
> => {
  const queryClient = useQueryClient();
  console.log("ingreso a la mutacion");

  return useMutation({
    mutationFn: async ({
      shop_id,
      latitude,
      longitude,
    }: ValidateVisitInput) => {
      console.log("ingreso a la mutacion");
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró ID de usuario.");

      const res: any = await authClient.post("/branches/register-visit", {
        shop_id,
        latitude,
        longitude
      });

      return res.data as ValidateVisitResponse;
    },
  });
};
