// Vista principal para el módulo de pagos por sucursal
import React, { useState, useEffect } from 'react';
import { PaymentsByBranchWidget } from '@/common/widgets/admin_branches/mercadoPago/payment.widget';
import { motion } from 'framer-motion';
import { CreditCard, Building, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';



export default function PaymentsByBranchView ()  {

const branchIdRaw = getEncryptedItem('branchId');
const branchId = branchIdRaw ? Number(branchIdRaw) : 0;

if(!branchId){
    toast.error('No se encontró el ID de la sucursal. Por favor, verifica tu sesión.');
}
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePaymentSuccess = (invoiceId: number) => {
    toast.success(`Pago iniciado para la factura #${invoiceId}`);
    setIsRefreshing(true);
    
    // Simular un refresh después de que el usuario regrese de MercadoPago
    setTimeout(() => {
      setIsRefreshing(false);
      // Aquí podrías hacer un refetch de los datos si es necesario
    }, 2000);
  };

  const handleGoBack = () => {
    navigate('/sucursal');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Gestión de Pagos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Administra los pagos de la sucursal
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isRefreshing && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Actualizando...</span>
                </div>
              )}
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Información adicional */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Sistema de Pagos MercadoPago
                </h2>
                <p className="text-orange-100">
                  Gestiona las facturas pendientes y procesa pagos de forma segura a través de MercadoPago.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <CreditCard className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Widget principal */}
          <PaymentsByBranchWidget
            branchId={branchId}
            onPaymentSuccess={handlePaymentSuccess}
          />

          {/* Información de ayuda */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              ℹ️ Información importante
            </h3>
            <div className="space-y-2 text-blue-800">
              <p className="text-sm">
                • Al hacer clic en "Pagar", serás redirigido a MercadoPago para completar el proceso de forma segura.
              </p>
              <p className="text-sm">
                • Los pagos se procesan inmediatamente y recibirás una confirmación por email.
              </p>
              <p className="text-sm">
                • Si tienes problemas con el pago, contacta al equipo de soporte técnico.
              </p>
              <p className="text-sm">
                • Las facturas pagadas aparecerán marcadas con un estado "Pagada" en verde.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


