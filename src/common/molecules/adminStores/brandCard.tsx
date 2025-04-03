"use client"

import { MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/common/ui/card"
import { Button } from "@/common/ui/button"
import { Badge } from "@/common/ui/badge"
// import type { Branch } from "@/common/branches"

interface BranchCardProps {
  branch: any
  onViewDetails: () => void
}

export function BranchCard({ branch, onViewDetails }: BranchCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{branch.name}</h3>
            <Badge variant={branch.isOpen ? "outline" : "destructive"}>{branch.isOpen ? "Abierto" : "Cerrado"}</Badge>
          </div>

          {branch.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{branch.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{branch.phone_number}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  )
}

