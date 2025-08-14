import {
  MapPin,
  Phone,
  Star,
  Clock,
  ExternalLink,
  QrCode,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/common/ui/card";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { Branch } from "@/api/types/branches/branches.types";
import { Dispatch, SetStateAction } from "react";

interface BranchCardProps {
  branch: Branch;
  onViewDetails?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  onQr?: Dispatch<SetStateAction<{ isOpen: boolean; code: number }>>;
  onVisit?: (branch: Branch) => void;
  showActions?: boolean;
}

export const BranchCard = ({
  branch,
  onViewDetails,
  onEdit,
  onQr,
  onVisit,
  showActions = true,
}: BranchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "activo":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "inactive":
      case "inactivo":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
      case "pendiente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getOpenStatusColor = (isOpen: boolean) => {
    return isOpen
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  console.log(onVisit)

  return (
    <Card className="h-full bg-white border-green-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4 bg-gradient-to-r from-white to-white-50 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-xl text-gray-800 truncate mb-1"
              title={branch.name}
            >
              {branch.name}
            </h3>
          </div>

          {/* Badges de estado */}
          <div className="flex  items-end gap-2 ml-4">
            <Badge
              className={`${getStatusColor(
                branch.status
              )} font-medium px-3 py-1 border rounded-full`}
            >
              {getStatusText(branch.status)}
            </Badge>
            {branch.is_open !== undefined && (
              <Badge
                className={`${getOpenStatusColor(
                  branch.is_open
                )} font-medium px-3 py-1 border rounded-full`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {branch.is_open ? "Abierto" : "Cerrado"}
              </Badge>
            )}
          </div>
        </div>

        {/* Botones de acción principales */}
        <div className="flex gap-2 mt-4">
          {onQr && (
            <Button
              onClick={() => onQr({ isOpen: true, code: branch.id })}
              size="sm"
              className="bg-[#4ea171] hover:bg-green-700 text-white flex-1 font-semibold py-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Ver QR
            </Button>
          )}

          {onVisit && (
            <Button
              onClick={() => onVisit(branch)}
              size="sm"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 flex-1 font-semibold py-2 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Visitar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {/* Información de contacto con iconos mejorados */}
        <div className="space-y-3">
          {/* Dirección */}
          {branch.address && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {branch.address}
                </p>
              </div>
            </div>
          )}

          {/* Teléfono */}
          {branch.phone_number && (
            <div  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow">
              <div className="bg-blue-100 p-2 rounded-full">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                <a href={`tel:${branch.phone_number}`} className="text-gray-600 hover:text-gray-700 font-medium hover:underline transition-colors duration-200">
                    {branch.phone_number}
                </a>
              </span>
            </div>
          )}

        </div>

        {/* Descripción */}
        {branch.details && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {branch.details}
            </p>
          </div>
        )}

        {/* Botones de acción secundarios */}
        {showActions && (onViewDetails || onEdit || onVisit) && (
          <div className="flex gap-2 pt-3 border-t border-green-100">
           
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(branch)}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Detalles
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                onClick={() => onEdit(branch)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                ✏️ Editar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
