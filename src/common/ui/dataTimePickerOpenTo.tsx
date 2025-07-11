import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }
  
  export default function DateTimePickerOpenTo({ value, onChange, label = "Seleccionar hora" }: TimePickerProps) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['MobileTimePicker']}>
          <MobileTimePicker
            label={label}
            openTo="hours"
            value={value ? dayjs(value, 'HH:mm') : null}
            onChange={(newValue) => {
              if (newValue) {
                const timeString = newValue.format('HH:mm');
                onChange(timeString);
              }
            }}
            format="HH:mm"
            ampm={false}
          />
        </DemoContainer>
      </LocalizationProvider>
    );
  }