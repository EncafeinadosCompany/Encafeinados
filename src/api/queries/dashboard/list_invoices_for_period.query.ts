import AuthClient from "@/api/client/axios"
import { InvoiceResponse } from "@/api/types/dashboard/invoice_for_period.type"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()


export const useInvoicesForPeriod= (startDate:Date,endDate:Date) => {
    return useQuery<InvoiceResponse, Error>({
      queryKey: ['invoicesForPeriod', startDate, endDate],
      queryFn: async () => {
        const response = await authClient.get<InvoiceResponse>(`/branch-invoice/by-period/${startDate.toISOString()}/${endDate.toISOString()}`)
        return response
      } 
    })
  }