import { useState } from 'react';

export const usePhoneFormat = (initialValue = '') => {
  const [formattedValue, setFormattedValue] = useState(initialValue);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces: XXX XXX XX XX
    let formatted = '';
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.substring(6, 8);
    if (digits.length > 8) formatted += ' ' + digits.substring(8, 10);
    
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, onChange?: (value: string) => void) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormattedValue(formatted);
    
    // If an onChange handler was provided, call it with the raw digits
    if (onChange) {
      onChange(formatted);
    }
  };

  return {
    value: formattedValue,
    handleChange,
    setValue: setFormattedValue
  };
};