import { useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";
import { ValidateVisitInput, ValidateVisitResponse} from "../../types/branches/branches_approval.types";
import AuthClient from "../../client/axios";
import { is } from "cypress/types/bluebird";

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
      
      let validResponse: ValidateVisitResponse;
      
      if (res.data?.message && res.data?.data) {
        validResponse = res.data as ValidateVisitResponse;
      } else if (res.data?.coffeecoins_earned && res.data?.stamp) {
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


export const useStatesIsOpen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isOpen }: { id: number; isOpen: boolean }) => {
      const response = await authClient.patch(`/branches/open-close/${id}`,{ isOpen:isOpen});
      return response;
    },
  });
}
