"use client"

import * as React from "react"
import { Clock }  from "@/common/ui/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Button } from "@/common/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>(value ? value.split(":")[0] : "12")
  const [selectedMinute, setSelectedMinute] = React.useState<string>(value ? value.split(":")[1] : "00")
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(
    value ? (Number.parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM") : "AM",
  )

  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? "12" : String(i + 1).padStart(2, "0")))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  React.useEffect(() => {
    if (selectedHour && selectedMinute) {
      let hour = Number.parseInt(selectedHour)
      if (selectedPeriod === "PM" && hour !== 12) hour += 12
      if (selectedPeriod === "AM" && hour === 12) hour = 0

      const formattedHour = String(hour).padStart(2, "0")
      const timeString = `${formattedHour}:${selectedMinute}`
      onChange?.(timeString)
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? <span>{`${selectedHour}:${selectedMinute} ${selectedPeriod}`}</span> : <span>Seleccionar hora</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 bg-white border-0 shadow-2xs" align="start">
        <div className="flex items-center space-x-2">
          <Select value={selectedHour} onValueChange={(value) => setSelectedHour(value)}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hora" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour, index) => (
                <SelectItem key={index} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-center">:</span>
          <Select value={selectedMinute} onValueChange={(value) => setSelectedMinute(value)}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute, index) => (
                <SelectItem key={index} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as "AM" | "PM")}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}
