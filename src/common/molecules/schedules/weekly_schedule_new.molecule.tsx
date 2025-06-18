import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { BranchSchedule } from "@/api/types/schedules/schedule.types";
import { 
  getWeeklyScheduleFormatted, 
  isBranchOpenNow,
  getCurrentScheduleInfo,
  getCurrentDayOfWeek
} from "@/common/utils/schedules/schedule.utils";

interface WeeklyScheduleProps {
  schedules: BranchSchedule[];
  compact?: boolean;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  schedules, 
  compact = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Debug para ver qué datos están llegando
  console.log("Schedules data received:", schedules);

  const dayNames: { [key: string]: string } = {
    'monday': 'Lunes',
    'tuesday': 'Martes', 
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
  };

  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-gray-500 text-sm flex items-center gap-2 py-2">
        <Clock size={16} className="text-gray-400" />
        <span>Horario no disponible</span>
      </div>
    );
  }

  const weeklySchedule = getWeeklyScheduleFormatted(schedules);
  const isCurrentlyOpen = isBranchOpenNow(schedules);
  const currentInfo = getCurrentScheduleInfo(schedules);
  const currentDay = getCurrentDayOfWeek();

  console.log("Processed data:", { weeklySchedule, isCurrentlyOpen, currentInfo, currentDay });

  // Buscar el horario de hoy
  const todaySchedule = weeklySchedule.find(schedule => 
    schedule.day.toLowerCase() === currentDay.toLowerCase()
  );

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Estado actual */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estado actual:</span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            isCurrentlyOpen 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {isCurrentlyOpen ? "Abierto" : "Cerrado"}
          </span>
        </div>

        {/* Horario de hoy */}
        {todaySchedule && (
          <div className="bg-white/80 border border-[#E6D7C3] rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#5F4B32]">
                Hoy ({dayNames[currentDay] || currentDay})
              </span>
              <span className="text-[#5F4B32] font-medium">
                {todaySchedule.isClosed ? "Cerrado" : `${todaySchedule.openTime} - ${todaySchedule.closeTime}`}
              </span>
            </div>
          </div>
        )}

        {/* Información adicional si está cerrado */}
        {!isCurrentlyOpen && currentInfo.nextOpenTime && currentInfo.nextOpenDay && (
          <div className="text-xs text-gray-600 text-center py-1">
            Abre {dayNames[currentInfo.nextOpenDay] || currentInfo.nextOpenDay} a las {currentInfo.nextOpenTime}
          </div>
        )}

        {/* Toggle para ver horarios completos */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-[#6F4E37] text-sm font-medium hover:text-[#5D3D26] transition-colors py-2 border-t border-[#E6D7C3]/50"
        >
          <span>{isExpanded ? "Ocultar" : "Ver"} horarios completos</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Horarios completos expandibles */}
        {isExpanded && (
          <div className="space-y-2 border-t border-[#E6D7C3] pt-3">
            {weeklySchedule.map((schedule, index) => {
              const isToday = schedule.day.toLowerCase() === currentDay.toLowerCase();
              return (
                <div 
                  key={index}
                  className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                    isToday 
                      ? "bg-[#F5E4D2]/60 border border-[#E6D7C3]" 
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                >
                  <span className={`text-sm ${
                    isToday ? "font-medium text-[#5F4B32]" : "text-gray-700"
                  }`}>
                    {dayNames[schedule.day.toLowerCase()] || schedule.day}
                    {isToday && (
                      <span className="ml-2 text-xs bg-[#6F4E37] text-white px-2 py-0.5 rounded-full">
                        Hoy
                      </span>
                    )}
                  </span>
                  <span className={`text-sm ${
                    isToday ? "font-medium text-[#5F4B32]" : "text-gray-600"
                  }`}>
                    {schedule.isClosed ? "Cerrado" : `${schedule.openTime} - ${schedule.closeTime}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6D7C3] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#2C1810] flex items-center gap-2">
          <Clock size={18} className="text-[#6F4E37]" />
          Horarios de atención
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCurrentlyOpen 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {isCurrentlyOpen ? "Abierto ahora" : "Cerrado ahora"}
        </span>
      </div>

      <div className="space-y-2">
        {weeklySchedule.map((schedule, index) => {
          const isToday = schedule.day.toLowerCase() === currentDay.toLowerCase();
          return (
            <div 
              key={index}
              className={`flex justify-between items-center py-3 px-4 rounded-lg transition-colors ${
                isToday 
                  ? "bg-[#F5E4D2]/50 border border-[#E6D7C3]" 
                  : "hover:bg-gray-50"
              }`}
            >
              <span className={`font-medium ${
                isToday ? "text-[#5F4B32]" : "text-gray-700"
              }`}>
                {dayNames[schedule.day.toLowerCase()] || schedule.day}
                {isToday && (
                  <span className="ml-2 text-xs bg-[#6F4E37] text-white px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                )}
              </span>
              <span className={`${
                isToday ? "text-[#5F4B32] font-medium" : "text-gray-600"
              }`}>
                {schedule.isClosed ? "Cerrado" : `${schedule.openTime} - ${schedule.closeTime}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Información adicional del estado actual */}
      {currentInfo && (
        <div className="mt-4 p-3 bg-[#F5E4D2]/30 rounded-lg border-l-4 border-[#6F4E37]">
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-[#6F4E37] mt-0.5" />
            <div>
              <p className="font-medium text-[#5F4B32]">
                Estado actual: {isCurrentlyOpen ? "Abierto" : "Cerrado"}
              </p>
              {!isCurrentlyOpen && currentInfo.nextOpenTime && currentInfo.nextOpenDay && (
                <p className="text-sm text-gray-600 mt-1">
                  Próxima apertura: {dayNames[currentInfo.nextOpenDay] || currentInfo.nextOpenDay} a las {currentInfo.nextOpenTime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
