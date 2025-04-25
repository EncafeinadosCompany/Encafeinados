import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMonth, useDay} from "@datepicker-react/hooks"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/common/ui/button"

type CalendarProps = {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  selected?: Date | Date[] | null
  onSelect?: (date: Date | null) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  disabled?: boolean | ((date: Date) => boolean)
  mode?: "single" | "range" | "multiple"
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  month: initialMonth,
  onMonthChange,
  disabled,
  mode = "single",
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(initialMonth || new Date())
  
  const handlePreviousMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleDayClick = (date: Date) => {
    onSelect?.(date)
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (Array.isArray(selected)) {
      return selected.some(d => 
        d.getDate() === date.getDate() && 
        d.getMonth() === date.getMonth() && 
        d.getFullYear() === date.getFullYear()
      )
    }
    return (
      selected.getDate() === date.getDate() && 
      selected.getMonth() === date.getMonth() && 
      selected.getFullYear() === date.getFullYear()
    )
  }

  const isDisabled = (date: Date) => {
    if (typeof disabled === "function") {
      return disabled(date)
    }
    return !!disabled
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Generate days for the current month
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  
  // Adjust for Sunday as first day (0)
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  
  // Generate days array
  const days = []
  
  // Add previous month days if showOutsideDays is true
  if (showOutsideDays) {
    const prevMonthDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
    for (let i = startingDay; i > 0; i--) {
      const date = new Date(month.getFullYear(), month.getMonth() - 1, prevMonthDays - i + 1)
      days.push({ date, isOutside: true })
    }
  } else {
    // Add empty slots
    for (let i = 0; i < startingDay; i++) {
      days.push({ date: null, isOutside: true })
    }
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i)
    days.push({ date, isOutside: false })
  }
  
  // Add next month days to complete the grid
  const remainingDays = 42 - days.length // 6 rows x 7 days
  if (showOutsideDays && remainingDays > 0) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(month.getFullYear(), month.getMonth() + 1, i)
      days.push({ date, isOutside: true })
    }
  }
  
  // Split days into weeks
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  return (
    <div className={cn("p-3 bg-[#ffff] border-none", className)}>
      <div className="flex flex-col  gap-4">
        <div className="flex justify-center pt-1 relative items-center w-full">
          <div className="text-sm font-medium">
            {format(month, "MMMM yyyy", { locale: es })}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex">
            {weekdays.map((day, i) => (
              <div key={i} className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center flex-1">
                {day}
              </div>
            ))}
          </div>
          
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex w-full mt-2">
              {week.map((day, dayIndex) => {
                if (!day.date) {
                  return <div key={dayIndex} className="flex-1" />
                }
                
                const isSelectedDay = isSelected(day.date)
                const isDayToday = isToday(day.date)
                const isDayDisabled = isDisabled(day.date)
                
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                      isSelectedDay && "bg-accent rounded-md"
                    )}
                  >
                    <button
                      onClick={() => !isDayDisabled && handleDayClick(day.date)}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "size-8 p-0 font-normal w-full",
                        isSelectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        isDayToday && !isSelectedDay && "bg-accent text-accent-foreground",
                        day.isOutside && "text-muted-foreground",
                        isDayDisabled && "text-muted-foreground opacity-50",
                        !day.isOutside && !isSelectedDay && !isDayToday && !isDayDisabled && "hover:bg-accent hover:text-accent-foreground"
                      )}
                      disabled={isDayDisabled}
                    >
                      {day.date.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Calendar }