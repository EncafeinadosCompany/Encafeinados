import { ApprovedBranch } from "@/api/types/branchesApprovalTypes";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/common/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { MapPin, Mail } from "lucide-react";

interface detailsProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    details: ApprovedBranch
}

export const DialogDetailStores = ({details, setIsOpen}: detailsProps) => {
  return (
    <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] 
        max-h-[90vh]  bg-white shadow-xl border-none rounded-lg p-4 sm:p-6 md:p-8">
      <DialogHeader className="pb-2 border-b">
        <DialogTitle className="text-lg sm:text-xl font-bold text-[#5F4B32] break-words">{details.name}</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 sm:gap-5 py-3 sm:py-4">
        <div className="relative h-48 sm:h-64 w-full rounded-lg overflow-hidden shadow-md">
          <img 
            src={details.store_logo || "/placeholder.svg"} 
            alt={details.name}  
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        <div className="space-y-3 sm:space-y-4 px-0 sm:px-1">
          <h3 className="font-semibold text-[#5F4B32] text-sm sm:text-base border-b pb-2">Información de la tienda</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5A2B] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Dirección:</span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground pl-5 sm:pl-0 sm:flex-1 break-words">{details.address}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5A2B] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Email:</span>
            </div>
            <Badge className="bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1] text-xs sm:text-sm w-fit ml-5 sm:ml-0 break-all">{details.store_email}</Badge>
          </div>
        
        </div>
      </div>
      
      <DialogFooter className="pt-2 border-t flex justify-center sm:justify-end mt-2">
        <Button 
          className="bg-[#8B5A2B] hover:bg-[#6F4823] text-white font-medium px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-colors w-full sm:w-auto"
          onClick={() => setIsOpen(false)}
        >
          Cerrar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}