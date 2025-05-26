export interface BranchSchedule {
  id: number;
  branch_id: number;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchSchedulesResponse {
  message: string;
  schedules: BranchSchedule[];
}

export interface ScheduleByBranchResponse {
  [branchId: number]: BranchSchedule[];
}

export interface BranchScheduleMap {
  [branchId: number]: {
    [dayOfWeek: string]: BranchSchedule;
  };
}

export interface CurrentScheduleInfo {
  isOpen: boolean;
  currentDay: string;
  openTime?: string;
  closeTime?: string;
  nextOpenTime?: string;
  nextOpenDay?: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_NAMES: Record<DayOfWeek, string> = {
  monday: 'Lunes',
  tuesday: 'Martes', 
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export const DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
