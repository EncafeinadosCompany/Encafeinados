// Hook personalizado para testing de pagos
import { useState, useCallback } from 'react';


interface TestResult {
  id: string;
  scenarioName: string;
  status: 'pending' | 'success' | 'error';
  payment?: PaymentResponse;
  error?: any;
  timestamp: Date;
  duration?: number;
}

interface UsePaymentTestingReturn {
  testResults: TestResult[];
  currentTest: TestResult | null;
  isTestMode: boolean;
  startTest: (scenarioId: string, scenarioName: string) => void;
  completeTest: (payment?: PaymentResponse, error?: any) => void;
  clearResults: () => void;
  setTestMode: (enabled: boolean) => void;
  getTestStats: () => {
    total: number;
    success: number;
    error: number;
    pending: number;
    successRate: number;
  };
}

export const usePaymentTesting = (): UsePaymentTestingReturn => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null);
  const [isTestMode, setIsTestMode] = useState(true);

  const startTest = useCallback((scenarioId: string, scenarioName: string) => {
    const testResult: TestResult = {
      id: `${scenarioId}-${Date.now()}`,
      scenarioName,
      status: 'pending',
      timestamp: new Date(),
    };

    setCurrentTest(testResult);
    console.log(`🧪 Iniciando test: ${scenarioName}`);
  }, []);

  const completeTest = useCallback((payment?: PaymentResponse, error?: any) => {
    if (!currentTest) return;

    const completedTest: TestResult = {
      ...currentTest,
      status: payment ? 'success' : 'error',
      payment,
      error,
      duration: Date.now() - currentTest.timestamp.getTime(),
    };

    setTestResults(prev => [...prev, completedTest]);
    setCurrentTest(null);

    // Log del resultado
    if (payment) {
      console.log(`✅ Test completado exitosamente: ${completedTest.scenarioName}`, {
        // paymentId: payment.id,
        // amount: payment.transaction_amount,
        duration: `${completedTest.duration}ms`
      });
    } else {
      console.error(`❌ Test falló: ${completedTest.scenarioName}`, {
        error: error?.message || 'Error desconocido',
        duration: `${completedTest.duration}ms`
      });
    }
  }, [currentTest]);

  const clearResults = useCallback(() => {
    setTestResults([]);
    setCurrentTest(null);
    console.log('🧹 Resultados de test limpiados');
  }, []);

  const setTestModeEnabled = useCallback((enabled: boolean) => {
    setIsTestMode(enabled);
    if (enabled) {
      console.log('🧪 Modo testing activado');
    } else {
      console.log('🚀 Modo producción activado');
    }
  }, []);

  const getTestStats = useCallback(() => {
    const total = testResults.length;
    const success = testResults.filter(r => r.status === 'success').length;
    const error = testResults.filter(r => r.status === 'error').length;
    const pending = testResults.filter(r => r.status === 'pending').length;
    const successRate = total > 0 ? (success / total) * 100 : 0;

    return {
      total,
      success,
      error,
      pending,
      successRate: Math.round(successRate * 100) / 100
    };
  }, [testResults]);

  return {
    testResults,
    currentTest,
    isTestMode,
    startTest,
    completeTest,
    clearResults,
    setTestMode: setTestModeEnabled,
    getTestStats,
  };
};

// Hook para validar configuración de testing
export const useTestingConfig = () => {
  const [configStatus, setConfigStatus] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>({
    isValid: false,
    errors: [],
    warnings: []
  });

  const validateConfig = useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar variables de entorno
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!publicKey) {
      errors.push('VITE_MERCADOPAGO_PUBLIC_KEY no está configurada');
    } else if (!publicKey.startsWith('TEST-')) {
      warnings.push('Public key no es de testing (no empieza con TEST-)');
    }

    if (!accessToken) {
      errors.push('VITE_MERCADOPAGO_ACCESS_TOKEN no está configurada');
    } else if (!accessToken.startsWith('TEST-')) {
      warnings.push('Access token no es de testing (no empieza con TEST-)');
    }

    if (!apiUrl) {
      errors.push('VITE_API_URL no está configurada');
    }

    const isValid = errors.length === 0;

    setConfigStatus({
      isValid,
      errors,
      warnings
    });

    return { isValid, errors, warnings };
  }, []);

  return {
    configStatus,
    validateConfig
  };
};
