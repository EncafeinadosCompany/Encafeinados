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
  const statusBg = branch.isOpen 
    ? "from-green-400 to-green-500" 
    : "from-red-400 to-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="w-full"
    >
      <Card className="overflow-hidden border border-gray-100 hover:border-[#D4A76A]/30 shadow-sm hover:shadow-md transition-all duration-300 bg-white group h-full flex flex-col">
        <div className="w-full h-1.5 bg-gradient-to-r from-[#D4A76A]/80 to-[#6F4E37]/80"></div>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-md bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-[#6F4E37] shadow-sm flex-shrink-0 border border-amber-100">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-800 truncate group-hover:text-[#6F4E37] transition-colors">
                  {branch.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${statusBg}`}></div>
                  <span className="text-xs text-gray-500">{branch.isOpen ? "Abierto ahora" : "Cerrado"}</span>
                </div>
              </div>
            </div>

            {branch.rating && (
              <Badge variant="outline" className="bg-amber-50/50 text-amber-700 border-amber-200 font-medium">
                <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                {branch.rating}
              </Badge>
            )}
          </div>

          <div className="space-y-2 mt-3 text-sm">
            {branch.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-700/70" />
                <span className="leading-tight">{branch.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
              <span>{branch.phone_number || "No disponible"}</span>
            </div>

            {branch.schedule && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>{branch.schedule}</span>
              </div>
            )}
            
            {branch.founded && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>Desde {branch.founded}</span>
              </div>
            )}
            
            {branch.staff && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4 flex-shrink-0 text-amber-700/70" />
                <span>{branch.staff} empleados</span>
              </div>
            )}
          </div>
          
          {branch.specialty && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex gap-1.5 items-center">
                <Coffee className="h-3.5 w-3.5 text-[#6F4E37]" />
                <span className="text-xs font-medium text-[#6F4E37]">ESPECIALIDAD</span>
              </div>
              <p className="text-sm text-gray-600 mt-1.5">{branch.specialty}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-gray-100">
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

