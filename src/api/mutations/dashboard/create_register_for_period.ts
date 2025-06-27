import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { InvoiceForPeriodResponse, Period } from "@/api/types/dashboard/invoice_for_period.type";

const authClient = new AuthClient();


export const useCreateInvoiceMutation = () => {
    const queryClient = useQueryClient();
    const useErrors = useError("invoice");

    return useMutation<InvoiceForPeriodResponse[], Error, Period>({
        mutationFn: async (data: Period): Promise<InvoiceForPeriodResponse[]> => {
            try {

                const response: AxiosResponse<InvoiceForPeriodResponse[]> = await authClient.post('/branch-invoice', data);
                return response.data;

            } catch (error: any) {
                throw handleApiError(error);
            }
        },
        onSuccess: () => {

            const loadingToast = toast.loading('Creando registros...', {id: "loading"});
            toast.success('¡Los registros se han creado con éxito!', { id: loadingToast });


        },
        onError: (error: any) => {
            toast.remove();
            useErrors(error);
        }
    });
};

