// Configuración de MercadoPago para la pasarela de pago
import { initMercadoPago } from '@mercadopago/sdk-react';

// Configuración de MercadoPago
export const configureMercadoPago = () => {
  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('VITE_MERCADOPAGO_PUBLIC_KEY no está configurada en las variables de entorno');
  }

  try {
    initMercadoPago(publicKey, {
      locale: 'es-CO'
    });
    console.log('✅ MercadoPago configurado correctamente');
  } catch (error) {
    console.error('❌ Error configurando MercadoPago:', error);
    throw error;
  }
};

// Configuración para diferentes ambientes
export const getMercadoPagoConfig = () => {
  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
  
  const isProduction = publicKey?.startsWith('APP-') && accessToken?.startsWith('APP-');
  
  return {
    publicKey,
    accessToken,
    environment: isProduction ? 'production' : 'sandbox',
    isConfigured: !!(publicKey && accessToken)
  };
};

// Validar configuración
export const validateMercadoPagoConfig = () => {
  const config = getMercadoPagoConfig();
  
  if (!config.isConfigured) {
    throw new Error('MercadoPago no está configurado correctamente. Verifica las variables de entorno.');
  }
  
  if (config.environment === 'sandbox') {
    console.warn('⚠️ MercadoPago está en modo sandbox (testing)');
  } else {
    console.log('🚀 MercadoPago está en modo producción');
  }
  
  return config;
};
