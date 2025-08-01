"use client";
import {MapPin,Phone,Star,ArrowRight,Globe,QrCodeIcon,UserPlus, Mail} from'@/common/ui/icons';
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/common/ui/button";
import { Branch } from "@/api/types/branches/branches.types";


interface BranchCardProps {
  branch: Branch;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onGenerateQrCode?: () => void;
  onAssignAdmin?: () => void;
  onManageSchedule?: () => void;
  index?: number;
}

export function BranchCard({
  branch,
  onViewDetails,
  onEdit,
  onGenerateQrCode,
  onAssignAdmin,
  onManageSchedule,
  index = 0,
}: BranchCardProps) {
  let statusConfig;

  if (branch.status === "PENDING") {
    statusConfig = {
      dotColor: "bg-yellow-400",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      showQr: false
    };
  } else if (branch.status === "APPROVED") {
    statusConfig = {
      dotColor: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      showQr: true
    };
  } else if (branch.status === "REJECTED") {
    statusConfig = {
      dotColor: "bg-gray-400",
      bgColor: "bg-gray-50",
      textColor: "text-gray-500",
      showQr: false
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="w-full h-full"
    >
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col relative rounded-lg">
        <div className="absolute top-3 right-3 z-10">
          {statusConfig?.showQr ? (
            <div
              onClick={onGenerateQrCode}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig?.bgColor} ${statusConfig?.textColor} text-xs font-medium shadow-sm`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[#DB8935] hover:bg-[#F5E4D2]/50"
              >
                <QrCodeIcon className="h-4 w-4 text-[#DB8935]" />
              </Button>
              <span className={`w-2 h-2 rounded-full ${statusConfig?.dotColor}`}></span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig?.bgColor} ${statusConfig?.textColor} text-xs font-medium shadow-sm opacity-70`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig?.dotColor}`}></span>
            </div>
          )}
        </div>

        <div className="p-4 border-b border-[#F5E4D2]">
          <h3 className="font-semibold text-[#A67C52] text-lg mb-2">
            {branch.name}
          </h3>

          {branch.average_rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <Star className="h-4 w-4 fill-[#DB8935] text-[#DB8935]" />
              <span className="text-sm font-medium text-[#DB8935]">
                {branch.average_rating}
              </span>
            </div>
          )}

          {branch.address && (
            <div className="flex items-start gap-2 text-[#A67C52] mt-1">
              <MapPin className="h-4 w-4 text-[#DB8935] flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-tight">{branch.address}</p>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-grow space-y-4">
          <div className="flex items-center gap-2 text-[#A67C52]">
            <Phone className="h-4 w-4 text-[#DB8935]" />
            <span className="text-sm">
              {branch.phone_number || "No disponible"}
            </span>
          </div>
          
            {branch.social_branches && branch.social_branches.length > 0 && (
            <div className="border-t border-[#F5E4D2] pt-3">
              <p className="text-xs font-medium text-[#DB8935] mb-2">
                Redes Sociales
              </p>
              <div className="flex flex-wrap gap-2">
                {branch.social_branches.map((socialBranch, idx) => (
                  <a
                    key={idx}
                    href={socialBranch.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F5E4D2]/50 rounded-md border border-[#F5E4D2] text-xs text-[#A67C52] hover:bg-[#F5E4D2] transition-colors"
                  >
                    <Globe className="h-3 w-3 text-[#DB8935]" />
                    {socialBranch.description || "Red social"}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>        
        
        <CardFooter className="p-3 border-t border-[#F5E4D2] bg-white flex gap-2">
            {branch.status === "APPROVED" && (
            <Button
              onClick={onAssignAdmin}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all text-xs py-2 h-auto rounded-full"
              size="sm"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Admin
            </Button>
          )}

          <Button
            onClick={onViewDetails}
            className={`flex-1 ${branch.status === "APPROVED" 
              ? "bg-gradient-to-r from-[#DB8935] to-[#C87000] hover:from-[#C87000] hover:to-[#A65C00] text-white" 
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"} transition-all group shadow-sm text-xs py-2 h-auto rounded-full`}
            size="sm"
          >
            Ver Detalles
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
