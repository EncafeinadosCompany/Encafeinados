import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin, Phone, Star, Eye, Edit } from "lucide-react";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/ui/table";
import { Branch } from "@/api/types/branches/branches.types";

export type SortField = 'name' | 'status' | 'average_rating' | 'store_name';
export type SortDirection = 'asc' | 'desc';

interface BranchTableViewProps {
  branches: Branch[];
  onViewDetails?: (branch: Branch) => void;
  onEdit?: (branch: Branch) => void;
  showActions?: boolean;
  isLoading?: boolean;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
}

export const BranchTableView = ({
  branches,
  onViewDetails,
  onEdit,
  showActions = true,
  isLoading = false,
  sortField,
  sortDirection,
  onSort
}: BranchTableViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const handleSort = (field: SortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tienda</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              {showActions && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                {showActions && (
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tienda</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              {showActions && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            No se encontraron sucursales
          </div>
          <p className="text-gray-400 text-sm">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-semibold text-left justify-start"
              >
                Nombre
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('store_name')}
                className="h-auto p-0 font-semibold text-left justify-start"
              >
                Tienda
                {getSortIcon('store_name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('status')}
                className="h-auto p-0 font-semibold text-left justify-start"
              >
                Estado
                {getSortIcon('status')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('average_rating')}
                className="h-auto p-0 font-semibold text-left justify-start"
              >
                Calificación
                {getSortIcon('average_rating')}
              </Button>
            </TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            {showActions && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{branch.name}</div>
                  {branch.is_open !== undefined && (
                    <div className="text-xs text-gray-500">
                      {branch.is_open ? '🟢 Abierto' : '🔴 Cerrado'}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {branch.store?.store_name || '-'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(branch.status)}>
                  {getStatusText(branch.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {branch.average_rating ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{parseFloat(branch.average_rating).toFixed(1)}</span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {branch.address ? (
                  <div className="flex items-start gap-1 max-w-xs">
                    <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate" title={branch.address}>
                      {branch.address}
                    </span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {branch.phone_number ? (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">{branch.phone_number}</span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex gap-2">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(branch)}
                        title="Ver detalles"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(branch)}
                        title="Editar"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
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
