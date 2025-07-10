// src/components/atoms/PaymentButton/PaymentButton.tsx
import React from 'react';
import { Button } from '@/common/ui/button';

interface PaymentButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  onClick, 
  loading = false, 
  disabled = false 
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || loading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
    </Button>
  );
};