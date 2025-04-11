// src/modules/coffeelover/components/CoffeeList.tsx
import { useCoffees } from '@/api'
import { LoadingSpinner } from '@/common/atoms/LoadingSpinner'


export const CoffeeList = () => {
  const { data: coffees, isLoading } = useCoffees()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      {coffees?.map((coffee) => (
        <div key={coffee.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold">{coffee.name}</h2>
          <p className="text-gray-600">{coffee.description}</p>
          <p className="text-green-600">${coffee.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}