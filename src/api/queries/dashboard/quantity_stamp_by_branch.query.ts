import AuthClient from "@/api/client/axios";
import { useQuery } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useQuantityStampByBranch = (id?: number) => {
    return useQuery<{ quantity: number }, Error>({
        queryKey: ['quantity-stamp-by-branch', id],
        queryFn: async () => {
            if (id === undefined || id === null) {
                throw new Error("ID is required");
            }
            const response = await authClient.get<{ quantity: number }>(`/stamp-clients/quantity/${id}`);
            return response;
        },
        enabled: id !== undefined && id !== null,
    });
}