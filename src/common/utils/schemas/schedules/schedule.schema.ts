import { z } from "zod";

export const ScheduleSchema = z.object({
  branch_id: z
    .number()
    .int()
    .positive({ message: "ID de sucursal inválido" }),
  day: z
    .string()
    .min(1, { message: "El día es obligatorio" })
    .refine((day) => 
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(day),
      { message: "Día inválido" }
    ),
  open_time: z
    .string()
    .min(1, { message: "La hora de apertura es obligatoria" })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
      message: "Formato de hora inválido (HH:MM)" 
    }),
  close_time: z
    .string()
    .min(1, { message: "La hora de cierre es obligatoria" })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
      message: "Formato de hora inválido (HH:MM)" 
    })
}).refine((data) => {
  const [openHour, openMinute] = data.open_time.split(':').map(Number);
  const [closeHour, closeMinute] = data.close_time.split(':').map(Number);
  
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  return closeTimeInMinutes > openTimeInMinutes;
}, {
  message: "La hora de cierre debe ser posterior a la hora de apertura",
  path: ["close_time"]
});

export const ScheduleItemSchema = z.object({
  day: z
    .string()
    .min(1, { message: "El día es obligatorio" })
    .refine((day) => 
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(day),
      { message: "Día inválido" }
    ),
  open_time: z
    .string()
    .min(1, { message: "La hora de apertura es obligatoria" })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
      message: "Formato de hora inválido (HH:MM)" 
    }),
  close_time: z
    .string()
    .min(1, { message: "La hora de cierre es obligatoria" })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
      message: "Formato de hora inválido (HH:MM)" 
    })
}).refine((data) => {
  const [openHour, openMinute] = data.open_time.split(':').map(Number);
  const [closeHour, closeMinute] = data.close_time.split(':').map(Number);
  
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  return closeTimeInMinutes > openTimeInMinutes;
}, {
  message: "La hora de cierre debe ser posterior a la hora de apertura",
  path: ["close_time"]
});

export const WeeklyScheduleSchema = z.object({
  branch_id: z
    .number()
    .int()
    .positive({ message: "ID de sucursal inválido" }),
  schedules: z
    .array(ScheduleItemSchema)
    .min(1, { message: "Debe proporcionar al menos un horario" })
    .max(7, { message: "No puede haber más de 7 horarios (uno por día)" })
    .refine((schedules) => {
      const days = schedules.map(s => s.day);
      const uniqueDays = [...new Set(days)];
      return uniqueDays.length === days.length;
    }, {
      message: "No puede haber horarios duplicados para el mismo día"
    })
});

export type ScheduleFormData = z.infer<typeof ScheduleSchema>;
export type WeeklyScheduleFormData = z.infer<typeof WeeklyScheduleSchema>;

export const validateDaySchedule = (openTime: string, closeTime: string): boolean => {
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  return closeTimeInMinutes > openTimeInMinutes;
};

export const DEFAULT_SCHEDULE_DATA = {
  open_time: "08:00",
  close_time: "17:00"
};

export const DAYS_OF_WEEK = [
  "Lunes", 
  "Martes", 
  "Miércoles", 
  "Jueves", 
  "Viernes", 
  "Sábado", 
  "Domingo"
] as const;
