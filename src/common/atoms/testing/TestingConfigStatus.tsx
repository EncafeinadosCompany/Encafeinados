// Componente para verificar configuración de testing
import React, { useEffect } from 'react';
import { useTestingConfig } from '@/common/hooks/usePaymentTesting';
import { CheckCircle, XCircle, AlertCircle } from '@/common/ui/icons';

export const TestingConfigStatus: React.FC = () => {
  const { configStatus, validateConfig } = useTestingConfig();

  useEffect(() => {
    validateConfig();
  }, [validateConfig]);

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Estado de Configuración</h3>
      
      <div className="space-y-2">
        {/* Estado general */}
        <div className="flex items-center gap-2">
          {configStatus.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={`font-medium ${
            configStatus.isValid ? 'text-green-700' : 'text-red-700'
          }`}>
            {configStatus.isValid ? 'Configuración válida' : 'Configuración incompleta'}
          </span>
        </div>

        {/* Errores */}
        {configStatus.errors.map((error, index) => (
          <div key={index} className="flex items-start gap-2 ml-4">
            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        ))}

        {/* Warnings */}
        {configStatus.warnings.map((warning, index) => (
          <div key={index} className="flex items-start gap-2 ml-4">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-yellow-700 text-sm">{warning}</span>
          </div>
        ))}

        {/* Variables de entorno actuales */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            Ver variables de entorno
          </summary>
          <div className="mt-2 bg-gray-50 rounded p-3 text-xs font-mono space-y-1">
            <div>
              <span className="text-gray-600">VITE_MERCADOPAGO_PUBLIC_KEY:</span>
              <span className="ml-2">
                {import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ? 
                  `${import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY.substring(0, 20)}...` : 
                  'No configurada'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">VITE_MERCADOPAGO_ACCESS_TOKEN:</span>
              <span className="ml-2">
                {import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN ? 
                  `${import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN.substring(0, 20)}...` : 
                  'No configurada'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">VITE_API_URL:</span>
              <span className="ml-2">
                {import.meta.env.VITE_API_URL || 'No configurada'}
              </span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
