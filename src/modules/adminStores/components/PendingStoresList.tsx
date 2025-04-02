import React from "react";
import { PendingStoresWidget } from "@/common/widgets/admin/PendingStoresWidget";

export const PendingStoresView = () => {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col p-4">
      <div className="flex-grow overflow-hidden rounded-xl shadow-sm bg-white border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full p-3">
       
          <div className="h-full rounded-lg border border-amber-100 overflow-hidden bg-amber-50/10">
            <PendingStoresWidget />
          </div>
          

          <div className="h-full rounded-lg border border-red-100 overflow-hidden bg-red-50/10 relative">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="rounded-full bg-red-50 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">Tiendas Rechazadas</p>
              <p className="text-xs text-gray-400 mt-1">En desarrollo</p>
            </div>
            <PendingStoresWidget />
          </div>
          
         
          <div className="h-full rounded-lg border border-green-100 overflow-hidden bg-green-50/10 relative">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="rounded-full bg-green-50 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">Tiendas Aprobadas</p>
              <p className="text-xs text-gray-400 mt-1">En desarrollo</p>
            </div>
            <PendingStoresWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingStoresView;