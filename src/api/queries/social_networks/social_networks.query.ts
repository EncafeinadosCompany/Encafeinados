import AuthClient from "@/api/client/axios"
import { useQuery } from "@tanstack/react-query"

const authClient = new AuthClient()

export interface social {
    id: number,
    name: string
}


export interface SocialNetworksType {
    social: social[]
}

export const useSocialNetworksQuery = () => {
    return useQuery<SocialNetworksType, Error>({
        queryKey: ['socialNetworks'],
        queryFn: async () => {
            const response = await authClient.get<SocialNetworksType>(`/social-networks`)
            return response
        }
    })
}