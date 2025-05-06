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
  console.log("ingreso a la mutacion");

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
      console.log("Respuesta de la mutación:", res);
      return res.data as ValidateVisitResponse;
    },
  });
};
