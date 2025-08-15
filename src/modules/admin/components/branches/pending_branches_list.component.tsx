import React from "react";
import { PendingBranchesWidget } from '@/common/widgets/admin/branches/pending_branches.widget';
import { ApprovedBranchesWidget } from '@/common/widgets/admin/branches/approved_branches.widget';
import { RejectedBranchesWidget } from '@/common/widgets/admin/branches/rejected_branches.widget';


const BranchManagement = () => {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1">
          <div className="h-full bg-white  border border-gray-100 overflow-hidden ">
            
            <div className="h-full p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
                
                <div className="h-full min-h-[400px]">
                  <div className="h-full rounded-xl  border-[#DB8935]/20 bg-gradient-to-br from-[#DB8935]/5 via-white to-[#DB8935]/3 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <PendingBranchesWidget />
                    </div>
                  </div>
                </div>

                <div className="h-full min-h-[400px]">
                  <div className="h-full rounded-xl border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <ApprovedBranchesWidget />
                    </div>
                  </div>
                </div>

                <div className="h-full min-h-[400px] lg:col-span-2 xl:col-span-1">
                  <div className="h-full rounded-xl  border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <RejectedBranchesWidget />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default BranchManagement;