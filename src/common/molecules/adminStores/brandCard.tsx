"use client"

import React from "react"
import { MapPin, Phone, Store, Coffee, Clock, ArrowRight, Calendar, Star, Users } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/common/ui/card"
import { Button } from "@/common/ui/button"
import { Badge } from "@/common/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/common/ui/tooltip"

interface BranchCardProps {
  branch: any
  onViewDetails: () => void
  index?: number
}

export function BranchCard({ branch, onViewDetails, index = 0 }: BranchCardProps) {
  // Status styling
  const statusColor = branch.isOpen ? "green" : "red";
  const statusStyles = {
    green: {
      badge: "bg-green-50 text-green-700 border-green-200",
      icon: "text-green-500",
      gradient: "from-green-400 to-green-500"
    },
    red: {
      badge: "bg-red-50 text-red-700 border-red-200",
      icon: "text-red-500",
      gradient: "from-red-400 to-red-500"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="w-full"
    >
      <Card className="overflow-hidden border border-gray-100 hover:border-[#D4A76A]/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white group h-full flex flex-col relative">
        {/* Decorative coffee beans pattern (subtle background) */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#6F4E37]">
            <path d="M50,0 C77.6142,0 100,22.3858 100,50 C100,77.6142 77.6142,100 50,100 C22.3858,100 0,77.6142 0,50 C0,22.3858 22.3858,0 50,0 Z M40,30 C31.7157,30 25,36.7157 25,45 C25,53.2843 31.7157,60 40,60 C48.2843,60 55,53.2843 55,45 C55,36.7157 48.2843,30 40,30 Z M70,50 C61.7157,50 55,56.7157 55,65 C55,73.2843 61.7157,80 70,80 C78.2843,80 85,73.2843 85,65 C85,56.7157 78.2843,50 70,50 Z"/>
          </svg>
        </div>

        {/* Top gradient bar */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#D4A76A]/90 to-[#6F4E37]/90"></div>
        
        <CardContent className="p-5 flex-grow">
          {/* Header with name, status and rating */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-[#6F4E37] shadow-sm flex-shrink-0 border border-amber-100 relative">
                <Store className="h-5 w-5" />
                <div className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-gradient-to-r ${statusStyles[statusColor].gradient}`}></div>
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-800 truncate group-hover:text-[#6F4E37] transition-colors">
                  {branch.name}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`mt-1.5 text-[10px] py-0 h-5 px-2 font-normal ${statusStyles[statusColor].badge}`}
                >
                  <Clock className={`mr-1 h-3 w-3 ${statusStyles[statusColor].icon}`} />
                  {branch.isOpen ? "Abierto ahora" : "Cerrado"}
                </Badge>
              </div>
            </div>

            {branch.rating && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(branch.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-amber-700 font-medium mt-1">{branch.rating}/5</span>
              </div>
            )}
          </div>

          {/* Branch information */}
          <div className="space-y-2.5 mt-4 text-sm pl-0.5">
            {branch.address && (
              <div className="flex items-start gap-2.5 text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-700/70" />
                <span className="leading-tight">{branch.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
              <span>{branch.phone_number || "No disponible"}</span>
            </div>

            {branch.schedule && (
              <div className="flex items-center gap-2.5 text-gray-600">
                <Clock className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>{branch.schedule}</span>
              </div>
            )}
            
            {branch.founded && (
              <div className="flex items-center gap-2.5 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>Desde {branch.founded}</span>
              </div>
            )}
            
            {branch.staff && (
              <div className="flex items-center gap-2.5 text-gray-600">
                <Users className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>{branch.staff} empleados</span>
              </div>
            )}
          </div>
          
          {/* Specialty section with enhanced visual */}
          {branch.specialty && (
            <div className="mt-4 pt-4 border-t border-dashed border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 items-center">
                  <Coffee className="h-3.5 w-3.5 text-[#6F4E37]" />
                  <span className="text-xs font-medium text-[#6F4E37]">CAFÉ ESPECIALIDAD</span>
                </div>
                {branch.specialtyRating && (
                  <Badge variant="secondary" className="bg-[#6F4E37]/10 text-[#6F4E37] text-xs">
                    {branch.specialtyRating} pts
                  </Badge>
                )}
              </div>
              <div className="mt-2 pl-5 border-l-2 border-amber-100 py-1">
                <p className="text-sm text-gray-600 italic">"{branch.specialty}"</p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer with action button */}
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gradient-to-r from-amber-50/30 to-transparent">
          <Button 
            variant="outline" 
            onClick={onViewDetails} 
            className="w-full border-[#D4A76A]/50 text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white hover:border-[#6F4E37] transition-all group"
          >
            Ver Detalles
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

