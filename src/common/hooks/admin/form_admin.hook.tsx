import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

interface UseProfileFormProps {
  schema: any;
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void>;
}

export const useProfileForm = ({ schema, defaultValues, onSubmit }: UseProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      type_document: "CC",
      number_document: "",
      phone_number: "",
      terms_accepted: false,
      ...defaultValues
    },
    mode: "onChange"
  });

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isLoading,
    getGreeting
  };
};