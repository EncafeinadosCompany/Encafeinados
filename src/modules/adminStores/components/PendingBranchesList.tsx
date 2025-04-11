import React from "react";
import { PendingBranchesWidget } from '@/common/widgets/admin/PendingBranchesWidget';
import { ApprovedBranchesWidget } from '@/common/widgets/admin/ApprovedBranchesWidget';


const PendingBranchesList = () => {
    return (
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex-grow overflow-hidden rounded-xl shadow-sm bg-white border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full p-4">
            <div className="h-full rounded-lg border border-amber-100 overflow-hidden bg-amber-50/10 flex flex-col">
              <PendingBranchesWidget />
            </div>
            <div className="h-full rounded-lg border border-green-100 overflow-hidden bg-green-50/10">
              <ApprovedBranchesWidget />
            </div>
          
          </div>
        </div>
      </div>
    );
  };

export default PendingBranchesList;



