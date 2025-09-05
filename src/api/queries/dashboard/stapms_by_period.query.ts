import AuthClient from "@/api/client/axios";
import { StampByPeriod } from "@/api/types/dashboard/stamps";
import { useQuery } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useQuantityStampByPeriod = ( startDate:Date, endDate:Date, id?: string) => {
    return useQuery<StampByPeriod[], Error>({
        queryKey: ['stamps_by_period'],
        queryFn: async () => {

            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });

            if (id !== undefined) {
                params.append('branchId', id.toString());
            }
          
            const response = await authClient.get<StampByPeriod[]>(`/stamp-clients/all-branches/quantity?${params.toString()}`);
            return response;
        },
        staleTime: 1 * 60 * 1000, 
        refetchOnWindowFocus: false
    });
}