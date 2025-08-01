import { useQuery } from '@tanstack/react-query'
import AuthClient from '@/api/client/axios'
import { Reviews, SingleReview, ClientWithReviews} from '@/api/types/reviews/review.type'

const authClient = new AuthClient()

export const useReviewsByIdBranches = (id:number) => {
  return useQuery<SingleReview[]>({
    queryKey: ['reviews', id], 
    queryFn: async () => {
      const response = await authClient.get<Reviews>(`/reviews/branch/${id}`)
      return response.reviews
    },
    staleTime: 1000 * 60 * 5
  })
}

export const useClientReviews = (id: number) => {
  return useQuery<ClientWithReviews>({
    queryKey: ['clientReviews', id],
    queryFn: async () => {
      const response = await authClient.get<ClientWithReviews>(`/reviews/client/${id}`)
      return response
    },
    staleTime: 1000 * 60 * 5,
    retry: false
  })
}