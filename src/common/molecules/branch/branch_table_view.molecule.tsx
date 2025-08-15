import { Dispatch, SetStateAction, useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Phone,
  Star,
  Eye,
  Edit,
  QrCode,
  User,
  DoorOpen,
} from "lucide-react";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { Branch } from "@/api/types/branches/branches.types";

export type SortField = "name" | "status" | "average_rating" | "store_name";
export type SortDirection = "asc" | "desc";

interface BranchTableViewProps {
  branches: Branch[];
  onViewDetails?: (branch: Branch) => void;
  onAssingBranch?: (branch: Branch) => void;
  onVisit?: (branch: Branch) => void;
  onQr?: Dispatch<SetStateAction<{ isOpen: boolean; code: number }>>;
  showActions?: boolean;
  isLoading?: boolean;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
}

export const BranchTableView = ({
  branches,
  onViewDetails,
  onVisit,
  onAssingBranch,
  onQr,
  showActions = true,
  isLoading = false,
  sortField,
  sortDirection,
  onSort,
}: BranchTableViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "aprobada":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "Rechazada":
        return "bg-red-100 text-red-800";
      case "pending":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleSort = (field: SortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-50 bg-gray-50/40">
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Nombre</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Tienda</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Estado</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Calificación</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Dirección</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Teléfono</TableHead>
              {showActions && <TableHead className="text-xs font-semibold text-gray-700 h-10">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-b border-gray-50/60 last:border-0">
                <TableCell className="py-3">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse"></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse"></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse"></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse"></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse"></div>
                </TableCell>
                {showActions && (
                  <TableCell className="py-3">
                    <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-50 bg-gray-50/40">
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Nombre</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Tienda</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Estado</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Calificación</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Dirección</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 h-10">Teléfono</TableHead>
              {showActions && <TableHead className="text-xs font-semibold text-gray-700 h-10">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg font-medium mb-2">
            No se encontraron sucursales
          </div>
          <p className="text-gray-500 text-sm">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-50 bg-gray-50/40">
            <TableHead className="text-xs font-semibold text-gray-700 h-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("name")}
                className="h-auto p-0 font-semibold text-left justify-start text-xs text-gray-700 hover:text-gray-900 hover:bg-transparent"
              >
                Nombre
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-700 h-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("store_name")}
                className="h-auto p-0 font-semibold text-left justify-start text-xs text-gray-700 hover:text-gray-900 hover:bg-transparent"
              >
                Tienda
                {getSortIcon("store_name")}
              </Button>
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-700 h-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("status")}
                className="h-auto p-0 font-semibold text-left justify-start text-xs text-gray-700 hover:text-gray-900 hover:bg-transparent"
              >
                Estado
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-700 h-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("average_rating")}
                className="h-auto p-0 font-semibold text-left justify-start text-xs text-gray-700 hover:text-gray-900 hover:bg-transparent"
              >
                Calificación
                {getSortIcon("average_rating")}
              </Button>
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-700 h-10">Dirección</TableHead>
            <TableHead className="text-xs font-semibold text-gray-700 h-10">Teléfono</TableHead>
            {showActions && <TableHead className="text-xs font-semibold text-gray-700 h-10">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id} className="border-b border-gray-50/60 last:border-0 hover:bg-gray-50/50 transition-colors">
              <TableCell className="font-medium py-3">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{branch.name}</div>
                  {branch.is_open !== undefined && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${branch.is_open ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      {branch.is_open ? "Abierto" : "Cerrado"}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3">
                <span className="text-sm text-gray-700">{branch.store?.store_name || "-"}</span>
              </TableCell>
              <TableCell className="py-3">
                <Badge className={getStatusColor(branch.status)}>
                  {getStatusText(branch.status)}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                {branch.average_rating ? (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{parseFloat(branch.average_rating).toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell className="py-3">
                {branch.address ? (
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate" title={branch.address}>
                      {branch.address}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell className="py-3">
                {branch.phone_number ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-600">{branch.phone_number}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              {showActions && (
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(branch)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {branch.status === "APPROVED" && (
                      <>
                        {onVisit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVisit(branch)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Entrar"
                          >
                            <DoorOpen className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onQr && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onQr({ isOpen: true, code: branch.id })
                            }
                            className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="QR"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onAssingBranch && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAssingBranch(branch)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Admin"
                          >
                            <User className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
