import { FlameIcon as Fire } from "@/common/ui/icons";
import { Card, CardContent } from "@/common/ui/card";
import { Dialog } from "@/common/ui/dialog";
import { useState } from "react";
import { DialogDetailStores } from "./detailsStores";
import { ApprovedBranch} from "@/api/types/branchesApprovalTypes";
import { Coffee } from "lucide-react";

interface FeaturedCardProps {
  branches: ApprovedBranch

}

export default function FeaturedCard({ branches }: FeaturedCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
    <div className="max-w-xs transform transition-transform duration-300 hover:scale-[1.02]">
      <Card 
        className="overflow-hidden border border-[#E6D7C3] shadow-md hover:shadow-xl transition-all duration-300 mb-2 bg-white/80 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-0 relative">
          <div className="relative h-48 w-full overflow-hidden">
            <div className={`absolute inset-0 bg-[#8B5A2B]/10 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-500 z-10 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
              <Coffee className="h-8 w-8 text-[#8B5A2B] animate-pulse" />
            </div>
            <img
              src={branches.store_logo || "/placeholder.svg"}
              alt={branches.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-100' : 'scale-105'} hover:scale-110`}
            />
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="bg-[#F5E4D2] text-[#5F4B32] text-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm hover:shadow transition-all duration-300">
              <Fire className="h-4 w-4" />
              <span>{branches.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="px-1">
        <h3 className="font-semibold font-SF-pro text-base text-[#5F4B32] truncate">{branches.address}</h3>
      </div>
    </div>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogDetailStores details={branches} setIsOpen={setIsOpen}></DialogDetailStores>
    </Dialog>
    </>
  );
}
