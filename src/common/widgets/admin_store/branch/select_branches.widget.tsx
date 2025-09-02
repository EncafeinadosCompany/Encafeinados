import { useBranches } from "@/api/queries/branches/branch.query";
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
import { useMemo } from "react";

interface SelectProps {
  isAdminStore: boolean;
}

export default function SelectBranchesWidget({ isAdminStore }: SelectProps) {
  const { data, isLoading, isError } = useBranches();
  const { selectedBranchId, setSelectedBranchId } = useBranchContext();

  const ApprovedBranches = useMemo(
    () => data?.branches.branches.filter((e) => e.status === "APPROVED") || [],
    [data]
  );

  return (
    <div>
      {isAdminStore && (
        <Select
          value={selectedBranchId ? selectedBranchId : ApprovedBranches[0].id}
          onValueChange={setSelectedBranchId}
        >
          <SelectTrigger
            className={`w-[200px] border border-amber-600 shadow focus:none bg-white text-amber-950 `}
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
              {ApprovedBranches.map((branch) => (
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
