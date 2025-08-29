import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthClient from "../../client/axios";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

const authClient = new AuthClient();

export const useApproveBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: number) => {
      const userId = getEncryptedItem("userId") as string | null;

      if (!userId) throw new Error("No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente.")

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: true,
        approvedById:userId,
      });
    }, onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "APPROVED"] });
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
      const userId = getEncryptedItem("userId");

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: false,
        approvedById: Number(userId),
        comments: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "REJECTED"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useReApproveBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (approvalId: number) => {
      const userId = getEncryptedItem("userId");

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: true,
        approvedById:userId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "APPROVED"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "REJECTED"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

export const useReRejectBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      approvalId,
      reason,
    }: {
      approvalId: number;
      reason?: string;
    }) => {
      const userId = getEncryptedItem("userId");

      if (!userId) {
        throw new Error(
          "No se encontró ID de usuario en el sistema. Por favor, inicia sesión nuevamente."
        );
      }

      return await authClient.patch(`/branch-approvals/${approvalId}`, {
        status: false,
        approvedById: Number(userId),
        ...(reason && { comments: reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "PENDING"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "APPROVED"] });
      queryClient.invalidateQueries({ queryKey: ["branches", "REJECTED"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

interface response {
  message: string
  branch:
  {
    id: number,
    name: string,
    is_open: boolean
  }
}

export const useStatesIsOpen = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; is_open: boolean }>({
    mutationFn: async ({ id, is_open }: { id: string; is_open: boolean }) => {
      const response = await authClient.patch<response>(`/branches/open-close/${id}`, { isOpen: is_open });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches_imagen"] });
      queryClient.invalidateQueries({ queryKey: ["branches"], exact: true });
    },
  }
  );
}

