"use client";
import {
  MapPin,
  Phone,
  Star,
  ArrowRight,
  Edit,
  Globe,
  QrCodeIcon,
  UserPlus,
  Clock
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/common/ui/button";
import { Branch } from "@/api/types/branches/branches.types";
import { on } from "events";

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
      text: "Pendiente",
      dotColor: "bg-[#DB8935]",
      bgColor: "bg-[#F5E4D2]",
      textColor: "text-[#A67C52]",
    };
  } else if (branch.status === "APPROVED") {
    statusConfig = {
      text: "Aprobado",
      dotColor: "bg-[#DB8935]",
      bgColor: "bg-[#F5E4D2]",
      textColor: "text-[#A67C52]",
    };
  } else if (branch.status === "REJECTED") {
    statusConfig = {
      text: "",
      dotColor: "bg-[#AAAAAA]",
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
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
        {/* Status indicator as a floating badge */}
        <div className="absolute top-3 right-3 z-10">
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

            <span
              className={`w-2 h-2 rounded-full ${statusConfig?.dotColor}`}
            ></span>
            {statusConfig?.text}
          </div>
        </div>

        {/* Header with branch name and rating */}
        <div className="p-4 border-b border-[#F5E4D2]">
          {/* Branch name - more prominent */}
          <h3 className="font-semibold text-[#A67C52] text-lg mb-2">
            {branch.name}
          </h3>

          {/* Rating */}
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
          {/* Contact information */}
          <div className="flex items-center gap-2 text-[#A67C52]">
            <Phone className="h-4 w-4 text-[#DB8935]" />
            <span className="text-sm">
              {branch.phone_number || "No disponible"}
            </span>
          </div>

          {/* Social media links in a horizontal row */}
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
        </CardContent>        {/* Footer with buttons */}
        <CardFooter className="p-3 border-t border-[#F5E4D2] bg-white flex gap-2">
          {/* Solo mostrar botón de asignar admin si la sucursal está aprobada */}
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
            className="flex-1 bg-gradient-to-r from-[#DB8935] to-[#C87000] hover:from-[#C87000] hover:to-[#A65C00] text-white transition-all group shadow-sm text-xs py-2 h-auto rounded-full"
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
