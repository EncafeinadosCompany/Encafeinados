
import { CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";

export function UseMetaPayment (collection_status:string) {
    
    const getPaymentStatus = () => {
    if (status === 'approved' || collection_status === 'approved') {
      return 'success';
    } else if (status === 'rejected' || status === 'failure' || collection_status === 'rejected') {
      return 'error';
    } else if (status === 'pending' || collection_status === 'pending') {
      return 'pending';
    } else {
      return 'unknown';
    }
  };

  const paymentStatus = getPaymentStatus();

    const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          title: '¡Pago Exitoso! 🎉',
          message: 'Tu pago ha sido procesado correctamente.',
          details: 'La factura ha sido marcada como pagada y recibirás una confirmación por email.'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          title: 'Pago Rechazado ❌',
          message: 'No se pudo procesar tu pago.',
          details: 'Por favor, verifica los datos de tu tarjeta e intenta nuevamente.'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          title: 'Pago Pendiente ⏳',
          message: 'Tu pago está siendo procesado.',
          details: 'Te notificaremos cuando el pago sea confirmado. Esto puede tomar unos minutos.'
        };
      default:
        return {
          icon: CreditCard,
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          title: 'Estado Desconocido',
          message: 'No se pudo determinar el estado del pago.',
          details: 'Por favor, contacta con soporte para verificar el estado de tu transacción.'
        };
    }
  };

const statusConfig = getStatusConfig();

  return {
    statusConfig,
    paymentStatus
  }
  
}