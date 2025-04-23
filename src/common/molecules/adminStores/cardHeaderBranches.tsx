import {CardHeader, CardTitle} from "@/common/ui/card"
import { Badge } from "@/common/ui/badge"

interface CardHeaderProps {
   length: number
}

export const CardHeaderBranches = ({length}:CardHeaderProps) => {
  return (
    <CardHeader className="bg-white border-b border-gray-100 py-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium text-gray-800">
          Gestión de Sucursales
        </CardTitle>
        <Badge
          variant="outline"
          className="bg-gray-50 border-gray-200 text-gray-700 font-normal"
        >
          {length} {length === 1 ? "sucursal" : "sucursales"}
        </Badge>
      </div>
    </CardHeader>
  )
}