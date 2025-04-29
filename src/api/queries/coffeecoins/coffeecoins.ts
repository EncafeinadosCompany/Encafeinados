
import { useQuery } from '@tanstack/react-query'
interface  coffeecoins  {
    quantity: number
}

const cooffeecoinstMock: coffeecoins = {
    quantity: 100
}

export const useCoffeeCoinsQuery = () => {
    return useQuery<coffeecoins>({
        queryKey: ['coffecoins'],
        queryFn: async () => cooffeecoinstMock
    })
}
