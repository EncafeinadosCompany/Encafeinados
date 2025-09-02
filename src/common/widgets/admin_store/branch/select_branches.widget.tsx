import { useBranches } from "@/api/queries/branches/branch.query";
import { Branch } from "@/api/types/branches/branches.types";
import { useBranchContext } from "@/common/context/branch_context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { useEffect, useMemo, useState } from "react";

interface SelectProps {
  isAdminStore: boolean;
}

export default function SelectBranchesWidget({ isAdminStore }: SelectProps) {
  const { data, isLoading, isError } = useBranches();

  const [filterBranch, setFilterBranch] = useState<Branch[]>([]);

  const ApprovedBranches = useMemo(
    () => data?.branches.branches.filter((e) => e.status === "APPROVED") || [],
    [data]
  );

  const { selectedBranchId, setSelectedBranchId, isActive } =
    useBranchContext();

  useEffect(() => {
    if (isAdminStore && ApprovedBranches) {
      if (ApprovedBranches.length > 0) {
        setSelectedBranchId(ApprovedBranches[0].id);
      }
      setFilterBranch(ApprovedBranches);
    }
  }, [isAdminStore, ApprovedBranches]);

  return (
    <div className={` absolute top-1 right-4 ${isActive ? "block" : "hidden"}`}>
      {isActive && (
        <Select
          value={selectedBranchId ?? ""}
          onValueChange={setSelectedBranchId}
        >
          <SelectTrigger
            className={`w-[200px] bg-white border border-gray-100`}
            aria-label="seleccionar sucursal"
          >
            <SelectValue placeholder={"Seleccionar sucursal"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Surcursales</SelectLabel>
              {isLoading && (
                <SelectItem value="loading" disabled>
                  Cargando...
                </SelectItem>
              )}
              {isError && (
                <SelectItem value="error" disabled>
                  Error al cargar
                </SelectItem>
              )}
              {filterBranch.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
