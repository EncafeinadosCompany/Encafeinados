import AuthClient from "@/api/client/axios";
import { ValidateVisitResponse } from "@/api/types/branches/branch_visit.type";
import { ValidateVisitInput } from "@/api/types/branches/branches_approval.types";

import {
    useMutation,
    UseMutationResult,
    useQueryClient,
} from "@tanstack/react-query";

const authClient = new AuthClient();

export const useRegisterVisitMutation = (): UseMutationResult<
    ValidateVisitResponse,
    Error,
    ValidateVisitInput
> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({branchId,latitude,longitude}: ValidateVisitInput) => {

            const res: any = await authClient.post("/visits", {
                branch_id: branchId,
                latitude,
                longitude,
            });

            let validResponse: ValidateVisitResponse;

            if (res.data?.message && res.data?.data) {
                validResponse = res.data as ValidateVisitResponse;
            } 
            else if (res.data?.coffeecoins_earned && res.data?.stamp) {
                validResponse = {
                    message: "Visit registered successfully",
                    data: {
                        coffeecoins_earned: res.data.coffeecoins_earned,
                        stamp: res.data.stamp,
                    },
                };
            } else {
                throw new Error("Formato de respuesta inesperado");
            }

            return validResponse;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coffecoins"] });
        },
    });
};
