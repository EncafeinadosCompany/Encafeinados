import React from "react";
import { PendingStoresWidget } from "@/common/widgets/admin/PendingStoresWidget";

export const PendingStoresView = () => {
  return (
    <div className="p-3 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex-grow overflow-hidden">
        <PendingStoresWidget />
      </div>
    </div>
  );
};

export default PendingStoresView;