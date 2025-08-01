import { BranchSchedule, CurrentScheduleInfo, DayOfWeek, DAY_ORDER } from '@/api/types/schedules/schedule.types';

/**
 * Mapeo de nombres de días en español a inglés
 */
const SPANISH_TO_ENGLISH_DAYS: Record<string, DayOfWeek> = {
  'lunes': 'monday',
  'martes': 'tuesday', 
  'miércoles': 'wednesday',
  'miercoles': 'wednesday', // Sin tilde también
  'jueves': 'thursday',
  'viernes': 'friday',
  'sábado': 'saturday',
  'sabado': 'saturday', // Sin tilde también
  'domingo': 'sunday'
};

/**
 * Convierte el día de la semana de JavaScript (0=domingo, 6=sábado) a nuestro formato
 */
export const getJsDayToDayOfWeek = (jsDay: number): DayOfWeek => {
  const dayMap: Record<number, DayOfWeek> = {
    0: 'sunday',
    1: 'monday', 
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  return dayMap[jsDay] || 'monday';
};

/**
 * Obtiene el día actual de la semana en nuestro formato
 */
export const getCurrentDayOfWeek = (): DayOfWeek => {
  const now = new Date();
  return getJsDayToDayOfWeek(now.getDay());
};

/**
 * Normaliza el nombre del día de español a inglés
 */
export const normalizeDayName = (day: string): DayOfWeek => {
  const normalizedDay = day.toLowerCase().trim();
  return SPANISH_TO_ENGLISH_DAYS[normalizedDay] || 'monday';
};

/**
 * Convierte tiempo en formato HH:mm:ss o HH:mm a minutos desde medianoche
 */
export const timeToMinutes = (time: string): number => {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
};

/**
 * Convierte minutos desde medianoche a formato HH:mm
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Formatea el tiempo a formato AM/PM
 */
export const formatTimeAmPm = (time: string): string => {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Verifica si una sucursal está abierta ahora
 */
export const isBranchOpenNow = (schedules: BranchSchedule[]): boolean => {
  const now = new Date();
  const currentDay = getCurrentDayOfWeek();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = schedules.find(schedule => {
    const normalizedDay = normalizeDayName(schedule.day);
    return normalizedDay === currentDay;
  });

  if (!todaySchedule || todaySchedule.is_closed) {
    return false;
  }

  const openTime = timeToMinutes(todaySchedule.open_time);
  const closeTime = timeToMinutes(todaySchedule.close_time);

  // Manejar horarios que cruzan medianoche
  if (closeTime < openTime) {
    return currentTime >= openTime || currentTime <= closeTime;
  }

  return currentTime >= openTime && currentTime <= closeTime;
};

/**
 * Obtiene información completa del horario actual de una sucursal
 */
export const getCurrentScheduleInfo = (schedules: BranchSchedule[]): CurrentScheduleInfo => {
  const currentDay = getCurrentDayOfWeek();
  
  const todaySchedule = schedules.find(schedule => {
    const normalizedDay = normalizeDayName(schedule.day);
    return normalizedDay === currentDay;
  });

  if (!todaySchedule || todaySchedule.is_closed) {
    // Buscar el próximo día que esté abierto
    const nextOpenInfo = getNextOpenTime(schedules, currentDay);
    return {
      isOpen: false,
      currentDay,
      nextOpenTime: nextOpenInfo?.openTime,
      nextOpenDay: nextOpenInfo?.day
    };
  }

  const isOpen = isBranchOpenNow(schedules);

  return {
    isOpen,
    currentDay,
    openTime: formatTimeAmPm(todaySchedule.open_time),
    closeTime: formatTimeAmPm(todaySchedule.close_time)
  };
};

/**
 * Obtiene el próximo horario de apertura
 */
export const getNextOpenTime = (schedules: BranchSchedule[], fromDay: DayOfWeek): { day: string; openTime: string } | null => {
  const currentDayIndex = DAY_ORDER.indexOf(fromDay);
  
  // Buscar en los próximos 7 días
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = DAY_ORDER[nextDayIndex];
    
    const schedule = schedules.find(s => {
      const normalizedDay = normalizeDayName(s.day);
      return normalizedDay === nextDay && !s.is_closed;
    });
    
    if (schedule) {
      return {
        day: nextDay,
        openTime: formatTimeAmPm(schedule.open_time)
      };
    }
  }
  
  return null;
};

/**
 * Genera el texto de horarios para mostrar en el mapa
 */
export const generateScheduleDisplayText = (schedules: BranchSchedule[]): string => {
  if (!schedules.length) {
    return "Horarios no disponibles";
  }

  const currentInfo = getCurrentScheduleInfo(schedules);
  
  if (currentInfo.isOpen && currentInfo.openTime && currentInfo.closeTime) {
    return `${currentInfo.openTime} - ${currentInfo.closeTime}`;
  }
  
  if (!currentInfo.isOpen && currentInfo.nextOpenTime && currentInfo.nextOpenDay) {
    return `Cerrado - Abre ${currentInfo.nextOpenDay} ${currentInfo.nextOpenTime}`;
  }
  
  return "Cerrado";
};

/**
 * Obtiene todos los horarios de la semana formateados
 */
export const getWeeklyScheduleFormatted = (schedules: BranchSchedule[]): Array<{
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}> => {
  return DAY_ORDER.map(day => {
    const schedule = schedules.find(s => {
      const normalizedDay = normalizeDayName(s.day);
      return normalizedDay === day;
    });
    
    if (!schedule || schedule.is_closed) {
      return {
        day: day,
        openTime: '',
        closeTime: '',
        isClosed: true
      };
    }
    
    return {
      day: day,
      openTime: formatTimeAmPm(schedule.open_time),
      closeTime: formatTimeAmPm(schedule.close_time),
      isClosed: false
    };
  });
};
