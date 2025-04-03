import React from "react";
import { PendingStoresWidget } from "@/common/widgets/admin/PendingStoresWidget";
import { ApprovedStoresWidget } from "@/common/widgets/admin/ApprovedStoresWidget";
import { RejectedStoresWidget } from "@/common/widgets/admin/RejectedStoresWidget";

export const PendingStoresView = () => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex-grow overflow-hidden rounded-xl shadow-sm bg-white border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full p-4">
          <div className="h-full rounded-lg border border-amber-100 overflow-hidden bg-amber-50/10 flex flex-col">
            <PendingStoresWidget />
          </div>
          <div className="h-full rounded-lg border border-green-100 overflow-hidden bg-green-50/10">
            <ApprovedStoresWidget />
          </div>
          <div className="h-full rounded-lg border border-red-100 overflow-hidden bg-red-50/10 flex flex-col">
            <RejectedStoresWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingStoresView;