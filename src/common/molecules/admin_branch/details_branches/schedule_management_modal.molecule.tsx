import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Save, RotateCcw, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { Input } from '@/common/ui/input';
import { Label } from '@/common/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/ui/card';
import { Branch } from '@/api/types/branches/branches.types';
import { BranchSchedule } from '@/api/types/schedules/schedule.types';
import { useBranchSchedules } from '@/api/queries/schedules/schedule.query';
import {
  useUpdateBranchScheduleMutation,
  useBulkUpdateBranchSchedulesMutation,
  useCreateBranchScheduleMutation,
  useUpdateSingleBranchScheduleMutation
} from '@/api/mutations/schedules/schedule.mutation';
import { DAYS_OF_WEEK, DEFAULT_SCHEDULE_DATA, validateDaySchedule } from '@/common/utils/schemas/schedules/schedule.schema';
import LoadingSpinner from '@/common/atoms/LoadingSpinner';

interface ScheduleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
}

interface DayScheduleData {
  day: string;
  open_time: string;
  close_time: string;
  is_closed?: boolean;
}

export const ScheduleManagementModal: React.FC<ScheduleManagementModalProps> = ({
  isOpen,
  onClose,
  branch
}) => {
  const [activeDay, setActiveDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [scheduleData, setScheduleData] = useState<Record<string, DayScheduleData>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { 
    data: currentSchedules, 
    isLoading: isLoadingSchedules,
    refetch: refetchSchedules
  } = useBranchSchedules(branch?.id);  const updateSingleScheduleMutation = useUpdateSingleBranchScheduleMutation();
  const bulkUpdateScheduleMutation = useUpdateBranchScheduleMutation();
  const bulkCreateMutation = useBulkUpdateBranchSchedulesMutation();
  const createScheduleMutation = useCreateBranchScheduleMutation();

  useEffect(() => {
    if (branch && isOpen) {
      const initialData: Record<string, DayScheduleData> = {};
      
      DAYS_OF_WEEK.forEach(day => {
        const existingSchedule = currentSchedules?.find(s => s.day === day);
        
        initialData[day] = {
          day,
          open_time: existingSchedule?.open_time || DEFAULT_SCHEDULE_DATA.open_time,
          close_time: existingSchedule?.close_time || DEFAULT_SCHEDULE_DATA.close_time,
          is_closed: existingSchedule?.is_closed || false
        };
      });
      
      setScheduleData(initialData);
      setHasChanges(false);
      setValidationErrors({});
    }
  }, [branch, isOpen, currentSchedules]);

  const handleTimeChange = (day: string, field: 'open_time' | 'close_time', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(true);

    const updatedSchedule = { ...scheduleData[day], [field]: value };
    if (updatedSchedule.open_time && updatedSchedule.close_time) {
      const isValid = validateDaySchedule(updatedSchedule.open_time, updatedSchedule.close_time);
      
      setValidationErrors(prev => ({
        ...prev,
        [day]: isValid ? '' : 'La hora de cierre debe ser posterior a la hora de apertura'
      }));
    }
  };
  const handleSaveSingleDay = async (day: string) => {
    if (!branch || validationErrors[day]) return;

    const dayData = scheduleData[day];
    const existingSchedule = currentSchedules?.find(s => s.day === day);

    try {      if (existingSchedule) {
        await updateSingleScheduleMutation.mutateAsync({
          id: existingSchedule.id,
          data: {
            day: dayData.day,
            open_time: dayData.open_time,
            close_time: dayData.close_time
          }
        });
      } else {
        await createScheduleMutation.mutateAsync({
          branch_id: branch.id,
          day: dayData.day,
          open_time: dayData.open_time,
          close_time: dayData.close_time
        });
      }
      
      await refetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };
  const handleSaveAllSchedules = async () => {
    if (!branch) return;

    const schedulesToCreate = [];
    const schedulesToUpdate = [];

    for (const day of DAYS_OF_WEEK) {
      if (validationErrors[day]) continue;

      const dayData = scheduleData[day];
      const existingSchedule = currentSchedules?.find(s => s.day === day);

      if (existingSchedule) {
        schedulesToUpdate.push({
          id: existingSchedule.id,
          data: {
            day: dayData.day,
            open_time: dayData.open_time,
            close_time: dayData.close_time
          }
        });
      } else {
        schedulesToCreate.push({
          branch_id: branch.id,
          day: dayData.day,
          open_time: dayData.open_time,
          close_time: dayData.close_time
        });
      }
    }

    try {    
      if (schedulesToCreate.length > 0) {
        await bulkCreateMutation.mutateAsync({
          branchId: branch.id,
          schedules: schedulesToCreate
        });
      }

      if (schedulesToUpdate.length > 0) {
        await bulkUpdateScheduleMutation.mutateAsync({
          updates: schedulesToUpdate
        });
      }
      
      setHasChanges(false);
      await refetchSchedules();
    } catch (error) {
      console.error('Error updating schedules:', error);
    }
  };

  const handleReset = () => {
    if (branch) {
      const resetData: Record<string, DayScheduleData> = {};
      
      DAYS_OF_WEEK.forEach(day => {
        const existingSchedule = currentSchedules?.find(s => s.day === day);
        
        resetData[day] = {
          day,
          open_time: existingSchedule?.open_time || DEFAULT_SCHEDULE_DATA.open_time,
          close_time: existingSchedule?.close_time || DEFAULT_SCHEDULE_DATA.close_time,
          is_closed: existingSchedule?.is_closed || false
        };
      });
      
      setScheduleData(resetData);
      setHasChanges(false);
      setValidationErrors({});
    }
  };

  const currentDayData = scheduleData[activeDay];
  const hasValidationError = validationErrors[activeDay];
  const isUpdating = updateSingleScheduleMutation.isPending || bulkUpdateScheduleMutation.isPending || 
                     bulkCreateMutation.isPending || createScheduleMutation.isPending;

  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#FBF7F4] border border-[#E6D7C3] shadow-xl rounded-2xl w-[95vw] max-w-4xl max-h-[95vh] overflow-hidden p-0"
        aria-describedby="schedule-management-description"
      >
        <DialogDescription id="schedule-management-description" className="sr-only">
          Gestión de horarios para la sucursal {branch.name}
        </DialogDescription>
        
        <div className="bg-gradient-to-r from-[#DB8935] to-[#C87000] p-4 sm:p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0"> 
                <DialogTitle className="text-lg sm:text-xl font-semibold text-white truncate">
                  Gestión de Horarios
                </DialogTitle>
                <p className="text-[#FFF3E5] mt-1 text-xs sm:text-sm truncate">
                  Sucursal: <span className="font-medium text-white">{branch.name}</span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {isLoadingSchedules ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <LoadingSpinner size="md" message="Cargando horarios..." />
            </div>
          ) : (
            <Card className="border-[#E6D7C3]">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-[#E6D7C3] p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#DB8935] flex-shrink-0" />
                  <CardTitle className="text-base sm:text-lg text-[#5F4B32] truncate">
                    Configuración de Horarios
                  </CardTitle>
                </div>
                <CardDescription className="text-[#A67C52] text-xs sm:text-sm line-clamp-2">
                  Establezca los horarios de apertura y cierre para cada día de la semana
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6">
                <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                  <div className="overflow-x-auto pb-2 -mx-1 px-1">
                    <TabsList className="inline-flex min-w-full sm:grid sm:grid-cols-7 mb-4 sm:mb-6 bg-[#F5E4D2] p-1">
                      {DAYS_OF_WEEK.map((day) => (
                        <TabsTrigger 
                          key={day} 
                          value={day} 
                          className="min-w-[4rem] text-[10px] xs:text-xs sm:text-sm data-[state=active]:bg-[#DB8935] data-[state=active]:text-white cursor-pointer"
                        >
                          {day.substring(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {DAYS_OF_WEEK.map((day) => (
                    <TabsContent key={day} value={day} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-2 sm:space-y-4">
                          <Label htmlFor={`open-${day}`} className="text-base sm:text-lg font-medium text-[#5F4B32]">
                            Hora de Apertura
                          </Label>
                          <Input
                            id={`open-${day}`}
                            type="time"
                            value={currentDayData?.open_time || ''}
                            onChange={(e) => handleTimeChange(day, 'open_time', e.target.value)}
                            className="border-[#E6D7C3] focus:border-[#DB8935] focus:ring-[#DB8935] h-10 sm:h-11 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-2 sm:space-y-4">
                          <Label htmlFor={`close-${day}`} className="text-base sm:text-lg font-medium text-[#5F4B32]">
                            Hora de Cierre
                          </Label>
                          <Input
                            id={`close-${day}`}
                            type="time"
                            value={currentDayData?.close_time || ''}
                            onChange={(e) => handleTimeChange(day, 'close_time', e.target.value)}
                            className="border-[#E6D7C3] focus:border-[#DB8935] focus:ring-[#DB8935] h-10 sm:h-11 cursor-pointer"
                          />
                        </div>
                      </div>

                      {hasValidationError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center gap-2"
                        >
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                          <span className="text-red-700 text-xs sm:text-sm">{hasValidationError}</span>
                        </motion.div>
                      )}

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-amber-800">
                          <span className="font-semibold">Resumen:</span> La cafetería abrirá los días {day} de{" "}
                          <span className="font-medium">{currentDayData?.open_time}</span> a{" "}
                          <span className="font-medium">{currentDayData?.close_time}</span>
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleSaveSingleDay(day)}
                          disabled={isUpdating || !!hasValidationError}
                          variant="outline"
                          size="sm"
                          className="border-[#DB8935] text-[#DB8935] hover:bg-[#DB8935] hover:text-white text-xs sm:text-sm h-9 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">Guardar {day}</span>
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 p-3 sm:p-2 border-t border-[#E6D7C3] bg-[#FFF9F2]">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isUpdating}
            className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white text-xs sm:text-sm mt-3 sm:mt-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Restablecer</span>
          </Button>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="border-[#E6D7C3] text-[#A67C52] hover:bg-[#F5E4D2]/30 text-xs sm:text-sm flex-1 sm:flex-none cursor-pointer"
            >
              <span className="truncate">Cancelar</span>
            </Button>
            <Button
              onClick={handleSaveAllSchedules}
              disabled={!hasChanges || isUpdating || Object.values(validationErrors).some(error => error)}
              className="bg-gradient-to-r from-[#DB8935] to-[#C87000] hover:from-[#C87000] hover:to-[#A65C00] text-white shadow-lg text-xs sm:text-sm flex-1 sm:flex-none cursor-pointer"
            >
              {isUpdating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0"
              >
                <LoadingSpinner size="sm" />
              </motion.div>
              ) : (
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              )}
              <span className="truncate">Guardar Todos los Horarios</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
