import React from "react";
import { Clock, Calendar } from "lucide-react";
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
  showCurrentStatus?: boolean;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ 
  schedules, 
  compact = false,
  showCurrentStatus = true 
}) => {  const weeklySchedule = getWeeklyScheduleFormatted(schedules);
  const isCurrentlyOpen = isBranchOpenNow(schedules);
  const currentInfo = getCurrentScheduleInfo(schedules);
  const currentDay = getCurrentDayOfWeek();
  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes", 
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
          <Clock size={14} className="text-[#6F4E37]" />
          <span>Horarios</span>
          {showCurrentStatus && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isCurrentlyOpen 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {isCurrentlyOpen ? "Abierto" : "Cerrado"}
            </span>
          )}
        </h4>        
        {currentInfo && (
          <div className="mb-2 p-2 bg-white rounded border-l-4 border-[#6F4E37]">
            <p className="text-sm text-[#6F4E37] font-medium">
              Hoy: {currentInfo.isOpen && currentInfo.openTime && currentInfo.closeTime 
                ? `${currentInfo.openTime} - ${currentInfo.closeTime}` 
                : "Cerrado"}
            </p>
            {currentInfo.nextOpenTime && currentInfo.nextOpenDay && (
              <p className="text-xs text-gray-600">
                Abre {dayNames[currentInfo.nextOpenDay as keyof typeof dayNames]} {currentInfo.nextOpenTime}
              </p>
            )}
          </div>
        )}        <div className="space-y-1">
          {weeklySchedule.map((schedule, index) => (
            <div 
              key={index}
              className={`flex justify-between text-sm py-1 px-2 rounded ${
                schedule.day.toLowerCase() === currentDay ? "bg-[#6F4E37]/10 font-medium" : ""
              }`}
            >
              <span className={schedule.day.toLowerCase() === currentDay ? "text-[#6F4E37]" : "text-gray-700"}>
                {dayNames[schedule.day.toLowerCase() as keyof typeof dayNames] || schedule.day}
              </span>
              <span className={`${schedule.day.toLowerCase() === currentDay ? "text-[#6F4E37]" : "text-gray-600"} text-right`}>
                {schedule.isClosed ? "Cerrado" : `${schedule.openTime} - ${schedule.closeTime}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
          <Calendar size={18} className="text-[#6F4E37]" />
          Horarios de atención
        </h3>
        {showCurrentStatus && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCurrentlyOpen 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {isCurrentlyOpen ? "Abierto ahora" : "Cerrado ahora"}
          </span>
        )}
      </div>      {currentInfo && (
        <div className="mb-4 p-3 bg-[#FBF7F4] rounded-lg border-l-4 border-[#6F4E37]">
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-[#6F4E37] mt-0.5" />
            <div>
              <p className="font-medium text-[#6F4E37]">
                Hoy: {currentInfo.isOpen && currentInfo.openTime && currentInfo.closeTime 
                  ? `${currentInfo.openTime} - ${currentInfo.closeTime}` 
                  : "Cerrado"}
              </p>
              {currentInfo.nextOpenTime && currentInfo.nextOpenDay && (
                <p className="text-sm text-gray-600 mt-1">
                  Abre {dayNames[currentInfo.nextOpenDay as keyof typeof dayNames]} {currentInfo.nextOpenTime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}      <div className="space-y-2">
        {weeklySchedule.map((schedule, index) => (
          <div 
            key={index}
            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
              schedule.day.toLowerCase() === currentDay 
                ? "bg-[#6F4E37]/10 border border-[#6F4E37]/20" 
                : "hover:bg-gray-50"
            }`}
          >
            <span className={`font-medium ${
              schedule.day.toLowerCase() === currentDay ? "text-[#6F4E37]" : "text-gray-700"
            }`}>
              {dayNames[schedule.day.toLowerCase() as keyof typeof dayNames] || schedule.day}
              {schedule.day.toLowerCase() === currentDay && (
                <span className="ml-2 text-xs bg-[#6F4E37] text-white px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </span>
            <span className={`${
              schedule.day.toLowerCase() === currentDay ? "text-[#6F4E37] font-medium" : "text-gray-600"
            }`}>
              {schedule.isClosed ? "Cerrado" : `${schedule.openTime} - ${schedule.closeTime}`}
            </span>
          </div>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Clock size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Horarios no disponibles</p>
        </div>
      )}
    </div>
  );
};

export default WeeklySchedule;
