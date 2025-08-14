import { useBranchByStore } from "@/api/queries/stores/stores.query";
import { Branch } from "@/api/types/branches/branches.types";
import { AssignBranchAdminModal } from "@/common/molecules/admin_stores/branches/assign_branch_admin_modal.molecule";
import { BranchDetails } from "@/common/molecules/admin_stores/branches/branch_details.molecule";
import { QRCodeBranchModal } from "@/common/molecules/admin_stores/branches/qr_code_branches_modal.molecule";
import { Card, CardContent } from "@/common/ui/card";
import { getEncryptedItem, saveEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { BranchListWidget } from "@/common/widgets/branch/branch_list.widget";
import { useState } from "react";

export default function BranchManagementView() {
  const [isQrCode, setIsQrCode] = useState({ isOpen: false, code: 0 });
  const [onViewDetails, setViewDetails] = useState<Branch>();
  const [onAssingBranch, setOnAssingBranch] = useState<Branch>();
  const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;
  
  const storeId = getEncryptedItem("storeId") as string | null;
  if (!storeId) return (window.location.href = "/");

  const { data: branchesList} = useBranchByStore(Number(storeId));

  const handleVisit = (branch: Branch) => {
  
  if ( branch.id) {
    saveEncryptedItem('branchId', branch.id?.toString());
    const url = `${EXPOSED_URL}/branch`;
    window.open(url, '_blank');
  }
};

  return (
    <Card className="h-full overflow-y-auto border-none bg-gray-50/90">
      <CardContent className="p-5">
        {branchesList && (
          <BranchListWidget
            branches={branchesList.branches}
            showActions
            onVisit={handleVisit}
            onViewDetails={setViewDetails}
            onAssingBranch={setOnAssingBranch}
            initialPageSize={5}
            onQR={setIsQrCode}
          ></BranchListWidget>
        )}

        {isQrCode && (
          <QRCodeBranchModal
            isOpen={isQrCode.isOpen}
            onClose={() => setIsQrCode({ isOpen: false, code: 0 })}
            qrCodeUrl={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${isQrCode.code}`}
          />
        )}

        {onViewDetails && (
          <BranchDetails
            branch={onViewDetails}
            isOpen={!!onViewDetails}
            onClose={() => setViewDetails(undefined)}
          />
        )}


        {
          onAssingBranch && (
            <AssignBranchAdminModal
              isOpen={onAssingBranch? true:false}
              onClose={()=>setOnAssingBranch(undefined)}
              branch={onAssingBranch}
            ></AssignBranchAdminModal>

          )
        }

        
      </CardContent>
    </Card>
  );
}
