// Widget para listar y gestionar pagos por sucursal
import React, { useState } from 'react';
import { useInvoicesByBranch } from '@/api/queries/dashboard/list_invoices_by_branch.query';
import {  invoicesBranch } from '@/api/types/dashboard/invoice_by_branch.type';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, Users, AlertCircle, CheckCircle, ExternalLink, CreditCard, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthClient from '@/api/client/axios';

interface PaymentsByBranchWidgetProps {
  branchId: number;
  onPaymentSuccess?: (invoiceId: number) => void;
}

export const PaymentsByBranchWidget: React.FC<PaymentsByBranchWidgetProps> = ({
  branchId,
  onPaymentSuccess
}) => {
  
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);

  // Cliente HTTP para hacer llamadas a la API
  const authClient = new AuthClient();

  // Query para obtener las facturas de la sucursal
  const {
    data: invoicesData,
    isLoading,
    error,
    refetch
  } = useInvoicesByBranch(branchId);

  const handlePayment = async (invoice: invoicesBranch) => {
    try {
      setProcessingPayment(invoice.invoiceId);
      
      console.log('🔄 Iniciando proceso de pago para factura:', invoice.invoiceId);
      console.log('🌐 URL del endpoint:', `/payments/invoice/${invoice.invoiceId}`);
      
      // URLs de retorno para MercadoPago
      const baseUrl = window.location.origin;
      const returnUrls = {
        success: `${baseUrl}/payment/result?status=approved&invoice_id=${invoice.invoiceId}`,
        failure: `${baseUrl}/payment/result?status=rejected&invoice_id=${invoice.invoiceId}`,
        pending: `${baseUrl}/payment/result?status=pending&invoice_id=${invoice.invoiceId}`
      };
      
      console.log('🔗 URLs de retorno configuradas:', returnUrls);
      
      // Hacer llamada directa para obtener la URL de pago de MercadoPago
      const response = await authClient.get<{ url: string }>(`/payments/invoice/${invoice.invoiceId}`);
      
      console.log('📥 Respuesta completa del servidor:', response);
      console.log('🔗 URL en respuesta:', response?.url);
      
      if (response && response.url) {
        console.log('✅ URL de pago válida obtenida:', response.url);
        
        // Mostrar toast antes de redirigir
        toast.success('Redirigiendo a MercadoPago...');
        
        // Redirigir al usuario a MercadoPago en la misma ventana
        setTimeout(() => {
          window.location.href = response.url;
        }, 1000);
        
        onPaymentSuccess?.(invoice.invoiceId);
      } else {
        console.error('❌ No se encontró URL en la respuesta:', response);
        throw new Error('No se pudo obtener la URL de pago de MercadoPago');
      }
    } catch (error: any) {
      console.error('💥 Error completo procesando pago:', error);
      console.error('📋 Detalles del error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Mostrar error más específico al usuario
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al procesar el pago';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setProcessingPayment(null);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar las facturas
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las facturas de la sucursal.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!invoicesData?.invoices?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay facturas
          </h3>
          <p className="text-gray-600">
            No se encontraron facturas para esta sucursal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Pagos - {invoicesData.branchName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Gestiona los pagos y facturas de la sucursal
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {invoicesData.invoices.length} facturas
            </div>
          </div>
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="p-6 space-y-4">
        <AnimatePresence>
          {invoicesData.invoices.map((invoice, index) => (
            <motion.div
              key={invoice.invoiceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gray-50 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                invoice.isPaid 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        invoice.isPaid ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {invoice.isPaid ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Factura #{invoice.invoiceId}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {invoice.isPaid ? 'Pagada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div className="text-sm">
                          <span className="block font-medium text-gray-900">Período</span>
                          <span>{formatDate(invoice.startDate)} - {formatDate(invoice.endDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <div className="text-sm">
                          <span className="block font-medium text-gray-900">Visitas</span>
                          <span>{invoice.totalVisits.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <div className="text-sm">
                          <span className="block font-medium text-gray-900">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(invoice.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de pago */}
                  {!invoice.isPaid && (
                    <div className="ml-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          console.log('Botón de pago clickeado para factura:', invoice.invoiceId);
                          handlePayment(invoice);
                        }}
                        disabled={processingPayment === invoice.invoiceId}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          processingPayment === invoice.invoiceId
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {processingPayment === invoice.invoiceId ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            <span>Pagar</span>
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer con resumen */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-600">
            <span>
              Total facturas: <span className="font-medium text-gray-900">{invoicesData.invoices.length}</span>
            </span>
            <span>
              Pagadas: <span className="font-medium text-green-600">
                {invoicesData.invoices.filter(i => i.isPaid).length}
              </span>
            </span>
            <span>
              Pendientes: <span className="font-medium text-orange-600">
                {invoicesData.invoices.filter(i => !i.isPaid).length}
              </span>
            </span>
          </div>
          
          <button
            onClick={() => refetch()}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};
