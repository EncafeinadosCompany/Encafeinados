import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowLeft, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/common/ui/card';

export default function PaymentResultView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Obtener parámetros de MercadoPago
  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');
  const merchantOrderId = searchParams.get('merchant_order_id');
  const collection_status = searchParams.get('collection_status');

  // Determinar el estado del pago
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

  // Countdown para redirección automática
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/sucursal/pagos');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleBackToPagos = () => {
    navigate('/sucursal/pagos');
  };

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
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 shadow-lg`}>
            <CardContent className="p-8 text-center">
              
              {/* Icono animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className={`w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center shadow-md`}>
                  <StatusIcon className={`w-10 h-10 ${statusConfig.iconColor}`} />
                </div>
              </motion.div>

              {/* Título */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                {statusConfig.title}
              </motion.h1>

              {/* Mensaje principal */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 mb-3"
              >
                {statusConfig.message}
              </motion.p>

              {/* Detalles */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-600 mb-6"
              >
                {statusConfig.details}
              </motion.p>

              {/* Información del pago */}
              {paymentId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-lg p-4 mb-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Detalles de la Transacción</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {paymentId && (
                      <div className="flex justify-between">
                        <span>ID de Pago:</span>
                        <span className="font-mono">#{paymentId}</span>
                      </div>
                    )}
                    {merchantOrderId && (
                      <div className="flex justify-between">
                        <span>Orden:</span>
                        <span className="font-mono">#{merchantOrderId}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                <button
                  onClick={handleBackToPagos}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a Pagos
                </button>

                {/* Contador de redirección */}
                <p className="text-xs text-gray-500">
                  Redirección automática en {countdown} segundos
                </p>
              </motion.div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Debug info en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 bg-gray-800 text-white p-4 rounded-lg text-xs"
          >
            <h4 className="font-semibold mb-2">Debug Info (Solo en desarrollo):</h4>
            <div className="space-y-1">
              <div>Status: {status || 'N/A'}</div>
              <div>Payment ID: {paymentId || 'N/A'}</div>
              <div>Merchant Order: {merchantOrderId || 'N/A'}</div>
              <div>Collection Status: {collection_status || 'N/A'}</div>
              <div>Determined Status: {paymentStatus}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
