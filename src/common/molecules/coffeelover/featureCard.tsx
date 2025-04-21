import { FlameIcon as Fire } from "@/common/ui/icons";
import { Card, CardContent } from "@/common/ui/card";
import { Dialog } from "@/common/ui/dialog";
import { useState } from "react";
import { DialogDetailStores } from "./detailsStores";
import { ApprovedBranch} from "@/api/types/branchesApprovalTypes";

interface FeaturedCardProps {
  branches: ApprovedBranch

}

export default function FeaturedCard({ branches }: FeaturedCardProps) {

  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
    <div className="max-w-xs">
      <Card className="overflow-hidden border border-gray-200/60 shadow-md hover:shadow-lg transition-shadow duration-300 mb-2"
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-0 relative">
          <div className="relative h-48 w-full">
            <img
              src={branches.store_logo || "/placeholder.svg"}
              alt={branches.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="bg-[#F5E4D2]  text-black text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Fire className="h-4 w-4" />
              <span>{branches.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="px-1">
        <h3 className="font-semibold font-SF-pro text-base">{branches.address}</h3>
      </div>

      
    </div>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogDetailStores details={branches} setIsOpen={setIsOpen}></DialogDetailStores>
  </Dialog>
    </>
  );
}
