"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/common/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/ui/tabs"
import { Coffee } from "lucide-react"
import toast from "react-hot-toast"
import DateTimePickerOpenTo from "@/common/ui/dataTimePickerOpenTo"

interface ScheduleData {
  branch_id: number
  day: string
  open_time: string
  close_time: string
}

interface ScheduleModuleProps {
  branchId: number
}

const DAYS_OF_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

// Datos iniciales de ejemplo
const INITIAL_SCHEDULES: Record<string, ScheduleData> = DAYS_OF_WEEK.reduce(
  (acc, day) => {
    acc[day] = {
      branch_id: 1,
      day,
      open_time: "08:00",
      close_time: "17:00",
    }
    return acc
  },
  {} as Record<string, ScheduleData>,
)

export function ScheduleModule({ branchId }: ScheduleModuleProps) {
  const [schedules, setSchedules] = useState<Record<string, ScheduleData>>(INITIAL_SCHEDULES)
  const [activeDay, setActiveDay] = useState(DAYS_OF_WEEK[0])

  const handleTimeChange = async (type: "open_time" | "close_time", time: string) => {
    const updatedSchedule = {
      ...schedules[activeDay],
      [type]: time,
    }

    setSchedules({
      ...schedules,
      [activeDay]: updatedSchedule,
    })

    try {
    //   await updateSchedule(updatedSchedule)
      toast('Cambio guardado correctamente')
    } catch (error) {
      toast('Error al guardar el cambio')
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-amber-700 dark:text-amber-400" />
          <CardTitle>Configuración de Horarios</CardTitle>
        </div>
        <CardDescription>Establezca los horarios de apertura y cierre para cada día de la semana</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            {DAYS_OF_WEEK.map((day) => (
              <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                {day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS_OF_WEEK.map((day) => (
            <TabsContent key={day} value={day} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Hora de Apertura</h3>
                  <DateTimePickerOpenTo
                    value={schedules[day].open_time}
                    onChange={(time) => handleTimeChange("open_time", time)}
                    label="Hora de apertura"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Hora de Cierre</h3>
                  <DateTimePickerOpenTo
                    value={schedules[day].close_time}
                    onChange={(time) => handleTimeChange("close_time", time)}
                    label="Hora de cierre"
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Resumen:</span> La cafetería abrirá los días {day} de{" "}
                  {schedules[day].open_time} a {schedules[day].close_time}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
