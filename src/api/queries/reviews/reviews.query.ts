import { useQuery } from '@tanstack/react-query'
import AuthClient from '@/api/client/axios'
import { Reviews, SingleReview, ClientWithReviews, ClientReview } from '@/api/types/reviews/review.type'

const authClient = new AuthClient()

export const useReviewsByIdBranches = (id:number) => {
  return useQuery<SingleReview[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await authClient.get<Reviews>(`/reviews/branch/${id}`)
      return response.reviews
    },
  })
}

export const useClientReviews = (clientId: number) => {
  return useQuery<ClientReview[]>({
    queryKey: ['clientReviews', clientId],
    queryFn: async () => {
      const response = await authClient.get<ClientWithReviews>(`/reviews/client/${clientId}`)
      return response.reviews
    },
  })
}