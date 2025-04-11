import React from 'react';
import { ApprovedBranch } from "@/api/types/branchesApprovalTypes";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay 
} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Badge } from "@/common/ui/badge";
import { MapPin, Mail, Coffee } from "lucide-react";

interface BranchDetailsDialogProps {
  branch: ApprovedBranch | null;
  onClose: () => void;
}

export const BranchDetailsDialog = ({ branch, onClose }: BranchDetailsDialogProps) => {
  if (!branch) return null;

  return (
    <Dialog open={!!branch} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-md border-0 shadow-lg bg-white rounded-lg overflow-hidden z-50">
        <div className="relative z-10">
          <DialogHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 px-4 py-3 border-b border-green-100">
            <DialogTitle className="text-[#2E7D32] flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Sucursal Aprobada
            </DialogTitle>
            <DialogDescription>
              Información detallada de la sucursal
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              {branch.store_logo ? (
                <img 
                  src={branch.store_logo} 
                  alt={branch.name}
                  className="h-14 w-14 rounded-md object-cover border border-green-100"
                />
              ) : (
                <div className="h-14 w-14 rounded-md bg-green-50 flex items-center justify-center text-emerald-500 border border-green-100">
                  <Coffee className="h-8 w-8" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-lg">{branch.name}</h4>
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 font-normal">
                  Aprobada
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 rounded-md p-3 mb-4">
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">{branch.address}</span>
              </div>
              
              {branch.store_email && (
                <div className="flex items-start space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{branch.store_email}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-200"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};