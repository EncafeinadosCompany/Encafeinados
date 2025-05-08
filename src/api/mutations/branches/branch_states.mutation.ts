import { useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";
import { ValidateVisitInput, ValidateVisitResponse} from "../../types/branches/branches_approval.types";
import AuthClient from "../../client/axios";

const authClient = new AuthClient();

export const useApproveBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: number) => {
      const userId = localStorage.getItem("userId");

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
      const userId = localStorage.getItem("userId");

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

export const useRegisterVisitMutation = (): UseMutationResult<
  ValidateVisitResponse,
  Error,
  ValidateVisitInput
> => {
  return useMutation({
    mutationFn: async ({
      branchId,
      latitude,
      longitude,
    }: ValidateVisitInput) => {
      const res: any = await authClient.post("/branches/register-visit", {
        branch_id: branchId,
        latitude,
        longitude
      });
      
      console.log("Respuesta completa:", res);
      console.log("Datos de la respuesta:", res.data);
      
      // Nos aseguramos de que la respuesta tenga la estructura correcta
      let validResponse: ValidateVisitResponse;
      
      // Aquí transformamos la respuesta para asegurar que cumpla con nuestro tipo
      if (res.data?.message && res.data?.data) {
        // La API ya devuelve la estructura esperada
        validResponse = res.data as ValidateVisitResponse;
      } else if (res.data?.coffeecoins_earned && res.data?.stamp) {
        // La API devuelve la estructura sin el nivel "data"
        validResponse = {
          message: "Visit registered successfully",
          data: {
            coffeecoins_earned: res.data.coffeecoins_earned,
            stamp: res.data.stamp
          }
        };
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
      
      return validResponse;
    },
  });
};
