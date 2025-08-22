import AuthClient from "@/api/client/axios"
import { InvoiceByBranchResponse } from "@/api/types/dashboard/invoice_by_branch.type"
import { useQuery } from "@tanstack/react-query"
import { isValidId } from "../Config/Config.Query"

const authClient = new AuthClient()


export const useInvoicesByBranch = (id: string) => {
    return useQuery<InvoiceByBranchResponse, Error>({
        queryKey: ['invoicesBybranch', id],
        queryFn: async () => {
            const response = await authClient.get<InvoiceByBranchResponse>(`/branch-invoice/by-branch/${id}`)
            return response
        },
        enabled: isValidId(id),
        staleTime: 1 * 60 * 1000,
        refetchOnWindowFocus: false

    })
}



export const registerPaymentMethod = (id: number) => {
    return useQuery<{ url: string }, Error>({
        queryKey: ['regirterinvoicesBybranch', id],
        queryFn: async () => {
            const response = await authClient.get<{ url: string }>(`/payments/invoice/${id}`)
            return response
        },
         enabled: id !== undefined && id !== null,
        staleTime: 1 * 60 * 1000, 
        refetchOnWindowFocus: false
    })
}