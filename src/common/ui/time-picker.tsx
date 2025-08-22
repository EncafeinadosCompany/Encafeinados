"use client";

import * as React from "react";
import { Clock } from "@/common/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { Button } from "@/common/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  // Helper function to parse initial value
  const parseInitialValue = (
    timeValue?: string
  ): { hour: string; minute: string; period: "AM" | "PM" } => {
    if (!timeValue) return { hour: "12", minute: "00", period: "AM" };

    const [hourStr, minuteStr] = timeValue.split(":");
    const hour24 = Number.parseInt(hourStr);
    const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";

    let displayHour: string;
    if (hour24 === 0) {
      displayHour = "12";
    } else if (hour24 > 12) {
      displayHour = String(hour24 - 12);
    } else {
      displayHour = String(hour24);
    }

    return { hour: displayHour, minute: minuteStr, period };
  };

  const initialValue = parseInitialValue(value);

  const [selectedHour, setSelectedHour] = React.useState<string>(
    initialValue.hour
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    initialValue.minute
  );
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(
    initialValue.period
  );

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return String(hour);
  });
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  React.useEffect(() => {
    if (selectedHour && selectedMinute) {
      let hour = Number.parseInt(selectedHour);
      if (selectedPeriod === "PM" && hour !== 12) hour += 12;
      if (selectedPeriod === "AM" && hour === 12) hour = 0;

      const formattedHour = String(hour).padStart(2, "0");
      const timeString = `${formattedHour}:${selectedMinute}`;
      onChange?.(timeString);
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border-gray-400 rounded-md bg-gray-50 hover:border-amber-600 ring-amber-600",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? (
            <span>{`${selectedHour}:${selectedMinute} ${selectedPeriod}`}</span>
          ) : (
            <span>Seleccionar hora</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 bg-white border-gray-400 rounded-md shadow-lg"
        align="start"
      >
        <div className="flex items-center space-x-2">
          <Select
            value={selectedHour}
            onValueChange={(value) => setSelectedHour(value)}
          >
            <SelectTrigger className="w-[70px] border-gray-400 rounded-md bg-gray-50 hover:border-amber-600 focus:ring-amber-600">
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
          <Select
            value={selectedMinute}
            onValueChange={(value) => setSelectedMinute(value)}
          >
            <SelectTrigger className="w-[70px] border-gray-400 rounded-md bg-gray-50 hover:border-amber-600 focus:ring-amber-600">
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
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as "AM" | "PM")}
          >
            <SelectTrigger className="w-[70px] border-gray-400 rounded-md bg-gray-50 hover:border-amber-600 focus:ring-amber-600">
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
  );
}
