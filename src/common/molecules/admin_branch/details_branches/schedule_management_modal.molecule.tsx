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
import { useUpdateBranchScheduleMutation, useBulkUpdateBranchSchedulesMutation } from '@/api/mutations/schedules/schedule.mutation';
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

  // Fetch current schedules
  const { 
    data: currentSchedules, 
    isLoading: isLoadingSchedules,
    refetch: refetchSchedules
  } = useBranchSchedules(branch?.id);

  // Mutations
  const updateScheduleMutation = useUpdateBranchScheduleMutation();
  const bulkUpdateMutation = useBulkUpdateBranchSchedulesMutation();

  // Initialize schedule data when modal opens or schedules load
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

    // Validate the time change
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
    
    try {
      await updateScheduleMutation.mutateAsync({
        branch_id: branch.id,
        day: dayData.day,
        open_time: dayData.open_time,
        close_time: dayData.close_time
      });
      
      // Refresh the schedules
      await refetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleSaveAllSchedules = async () => {
    if (!branch) return;

    const schedulesToUpdate = DAYS_OF_WEEK
      .filter(day => !validationErrors[day])
      .map(day => ({
        branch_id: branch.id,
        day: scheduleData[day].day,
        open_time: scheduleData[day].open_time,
        close_time: scheduleData[day].close_time
      }));

    try {
      await bulkUpdateMutation.mutateAsync({
        branchId: branch.id,
        schedules: schedulesToUpdate
      });
      
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
  const isUpdating = updateScheduleMutation.isPending || bulkUpdateMutation.isPending;

  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#FBF7F4] border border-[#E6D7C3] shadow-xl rounded-2xl max-w-4xl max-h-[95vh] overflow-hidden"
        aria-describedby="schedule-management-description"
      >
        <DialogDescription id="schedule-management-description" className="sr-only">
          Gestión de horarios para la sucursal {branch.name}
        </DialogDescription>
        
        <div className="bg-gradient-to-r from-[#DB8935] to-[#C87000] p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-white">
                  Gestión de Horarios
                </DialogTitle>
                <p className="text-[#FFF3E5] mt-1">
                  Sucursal: <span className="font-medium text-white">{branch.name}</span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6">
          {isLoadingSchedules ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" message="Cargando horarios..." />
            </div>
          ) : (
            <Card className="border-[#E6D7C3]">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-[#E6D7C3]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#DB8935]" />
                  <CardTitle className="text-[#5F4B32]">Configuración de Horarios</CardTitle>
                </div>
                <CardDescription className="text-[#A67C52]">
                  Establezca los horarios de apertura y cierre para cada día de la semana
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                  <TabsList className="grid grid-cols-7 mb-6 bg-[#F5E4D2]">
                    {DAYS_OF_WEEK.map((day) => (
                      <TabsTrigger 
                        key={day} 
                        value={day} 
                        className="text-xs sm:text-sm data-[state=active]:bg-[#DB8935] data-[state=active]:text-white"
                      >
                        {day.substring(0, 3)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {DAYS_OF_WEEK.map((day) => (
                    <TabsContent key={day} value={day} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label htmlFor={`open-${day}`} className="text-lg font-medium text-[#5F4B32]">
                            Hora de Apertura
                          </Label>
                          <Input
                            id={`open-${day}`}
                            type="time"
                            value={currentDayData?.open_time || ''}
                            onChange={(e) => handleTimeChange(day, 'open_time', e.target.value)}
                            className="border-[#E6D7C3] focus:border-[#DB8935] focus:ring-[#DB8935]"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor={`close-${day}`} className="text-lg font-medium text-[#5F4B32]">
                            Hora de Cierre
                          </Label>
                          <Input
                            id={`close-${day}`}
                            type="time"
                            value={currentDayData?.close_time || ''}
                            onChange={(e) => handleTimeChange(day, 'close_time', e.target.value)}
                            className="border-[#E6D7C3] focus:border-[#DB8935] focus:ring-[#DB8935]"
                          />
                        </div>
                      </div>

                      {hasValidationError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"
                        >
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <span className="text-red-700 text-sm">{hasValidationError}</span>
                        </motion.div>
                      )}

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">Resumen:</span> La cafetería abrirá los días {day} de{" "}
                          {currentDayData?.open_time} a {currentDayData?.close_time}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleSaveSingleDay(day)}
                          disabled={isUpdating || !!hasValidationError}
                          variant="outline"
                          className="border-[#DB8935] text-[#DB8935] hover:bg-[#DB8935] hover:text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar {day}
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between gap-3 p-6 border-t border-[#E6D7C3] bg-[#FFF9F2]">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isUpdating}
              className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="border-[#E6D7C3] text-[#A67C52] hover:bg-[#F5E4D2]/30"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAllSchedules}
              disabled={!hasChanges || isUpdating || Object.values(validationErrors).some(error => error)}
              className="bg-gradient-to-r from-[#DB8935] to-[#C87000] hover:from-[#C87000] hover:to-[#A65C00] text-white shadow-lg"
            >
              {isUpdating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <LoadingSpinner size="sm" />
                </motion.div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Todos los Horarios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
