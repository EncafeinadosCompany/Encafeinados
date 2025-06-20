import React from "react";
import { PendingBranchesWidget } from '@/common/widgets/admin/branches/pending_branches.widget';
import { ApprovedBranchesWidget } from '@/common/widgets/admin/branches/approved_branches.widget';
import { RejectedBranchesWidget } from '@/common/widgets/admin/branches/rejected_branches.widget';


const BranchManagement = () => {
    return (
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex-grow overflow-hidden rounded-xl shadow-sm bg-white border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 h-full p-4">
            <div className="h-full rounded-lg border border-amber-100 overflow-hidden bg-amber-50/10 flex flex-col">
              <PendingBranchesWidget />
            </div>            <div className="h-full rounded-lg border border-green-100 overflow-hidden bg-green-50/10 flex flex-col">
              <ApprovedBranchesWidget />
            </div>
            <div className="h-full rounded-lg border border-red-100 overflow-hidden bg-red-50/10 flex flex-col">
              <RejectedBranchesWidget />
            </div>
          </div>
        </div>
      </div>
    );
  };

export default BranchManagement;