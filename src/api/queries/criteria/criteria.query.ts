import AuthClient from "@/api/client/axios"
import { criteria, criteriaResponseData, GetcriteriaByBranch } from "@/api/types/criteria/criteria.types"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()


export const useCriteria= () => {
    return useQuery<criteriaResponseData[], Error>({
      queryKey: ['criteria status'],
      queryFn: async () => {
        const response = await authClient.get<criteriaResponseData[]>(`/criteria/status/true`)
        return response
      },
      staleTime: 1000 * 60 * 5,
      retry: false
    })
  }

  export const useCriteriosByBranch = (branchId: string) => {
    return useQuery<GetcriteriaByBranch, Error>({
      queryKey: ['criteria status', branchId],
      queryFn: async () => {
        const response = await authClient.get<GetcriteriaByBranch>(`/branch-approvals/detail/${branchId}`,
            {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlN1cGVyIEFkbWluaXN0cmFkb3IiXSwiaWF0IjoxNzU1MDM5NDgwLCJleHAiOjE3NTUwNjgyODB9.1i5abGSnorXTdMWeIrT1BShOd0VyT5Chu0KxMZzECvo`
            },
          }
        )
        return response
      }
    })
  }