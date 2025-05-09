import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/ui/dialog';
import { Button } from '@/common/ui/button';
import { X, RefreshCw, Scan, Camera, ZoomIn } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

interface QRScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

const QRScannerDialog: React.FC<QRScannerDialogProps> = ({ 
  isOpen, 
  onClose, 
  onScanSuccess 
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [scanning, setScanning] = useState(false);
  const containerId = "qr-scanner-container";
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(console.error);
          }
          scannerRef.current.clear();
          scannerRef.current = null;
        } catch (e) {
          console.error("Error cleaning up scanner:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        initializeScanner();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCameraStarted && !scannerError) {
      interval = setInterval(() => {
        setScanning(prev => !prev);
      }, 1500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraStarted, scannerError]);

  const initializeScanner = () => {
    setIsInitializing(true);
    setScannerError(null);
    
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(console.error);
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      
      const containerElement = document.getElementById(containerId);
      if (!containerElement) {
        setScannerError("No se encontró el contenedor del scanner");
        setIsInitializing(false);
        return;
      }
      
      scannerRef.current = new Html5Qrcode(containerId);
      startCamera();
    } catch (error) {
      console.error("Error initializing QR scanner:", error);
      setScannerError("Error al inicializar el scanner");
      setIsInitializing(false);
    }
  };

  const startCamera = async () => {
    if (!scannerRef.current) {
      setScannerError("Scanner no inicializado");
      setIsInitializing(false);
      return;
    }
    
    setIsInitializing(true);
    setScannerError(null);
    
    try {
      const qrCodeSuccessCallback = (decodedText: string) => {
        console.log("QR code detected:", decodedText);
        
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        handleScannedUrl(decodedText);
        
        onClose();
      };
      
      const qrCodeErrorCallback = (errorMessage: string) => {
        if (!errorMessage.includes("No MultiFormat Readers")) {
          console.log("QR scan error:", errorMessage);
        }
      };

      await scannerRef.current.start(
        { facingMode: "environment" }, 
        { 
          fps: 15,  
          qrbox: { width: 250, height: 250 }, 
          aspectRatio: 1.0,
          disableFlip: false,
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );
      
      setIsCameraStarted(true);
    } catch (err) {
      console.error("Error starting camera:", err);
      setScannerError("No se pudo acceder a la cámara. Verifica los permisos.");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleScannedUrl = (url: string) => {
    try {
      if (!url.startsWith('http')) {
        console.log('El código QR no contiene una URL:', url);
        onScanSuccess(url);
        return;
      }
      
      const parsedUrl = new URL(url);
      
      const isAppUrl = parsedUrl.hostname === window.location.hostname;
      
      if (isAppUrl) {
        let path = parsedUrl.pathname;
        
        if (path.includes('/coffeelover/')) {
          path = path.substring(path.indexOf('/coffeelover/') + '/coffeelover/'.length);
          
          if (parsedUrl.search) {
            path += parsedUrl.search;
          }
          
          navigate('/' + path);
          console.log('Navegación interna a:', path);
        } else {
          navigate(path + parsedUrl.search);
          console.log('Navegación a ruta completa:', path + parsedUrl.search);
        }
        
        onScanSuccess(url);
      } else {
        window.open(url, '_blank');
        onScanSuccess(url);
      }
    } catch (error) {
      console.error('Error al procesar la URL escaneada:', error);
      onScanSuccess(url); 
    }
  };

  const stopCamera = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        scannerRef.current.stop()
          .then(() => {
            setIsCameraStarted(false);
          })
          .catch(err => {
            console.error("Error stopping camera:", err);
          });
      } catch (err) {
        console.error("Error during camera stop:", err);
      }
    }
  };

  const handleRestartScanner = () => {
    stopCamera();
    setTimeout(() => {
      initializeScanner();
    }, 300);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-amber-800/20 backdrop-blur-sm z-50" aria-hidden="true" />
      )}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
        <DialogContent className="sm:max-w-md bg-[#FFFBF6] border border-amber-100 shadow-lg z-[51] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#6F4E37]">
              <Camera className="h-5 w-5 text-amber-600" />
              <span>Escanear código QR</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div 
              id={containerId} 
              className="w-full aspect-square max-h-[70vh] relative bg-black rounded-lg overflow-hidden shadow-md border border-amber-100"
            />
            {isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-3"></div>
                <p className="text-sm font-medium text-amber-100">Iniciando cámara...</p>
              </div>
            )}
            
            {!isInitializing && !isCameraStarted && !scannerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80 z-10">
                <Camera className="h-10 w-10 opacity-50 mb-2 text-amber-200" />
                <p className="text-sm">Cámara no disponible</p>
              </div>
            )}
            
            {scannerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80 p-4 text-center z-10">
                <div className="bg-amber-700/30 rounded-full p-3 mb-3">
                  <X className="h-8 w-8 text-amber-300" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Error</h3>
                <p className="mb-4 text-amber-200 max-w-xs">{scannerError}</p>
                <Button
                  onClick={handleRestartScanner}
                  variant="outline"
                  className="bg-amber-700/20 hover:bg-amber-700/30 text-amber-100 border-amber-500/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            )}
            
            {isCameraStarted && !scannerError && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className={`w-64 h-64 border-2 ${scanning ? 'border-amber-500' : 'border-amber-400'} rounded-lg transition-colors duration-300`}>
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-400"></div>
                    
                    <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-amber-400/0 via-amber-500/90 to-amber-400/0 animate-qrscan"></div>
                    
                    <div className="absolute -bottom-12 left-0 right-0 text-center">
                      <p className={`text-sm font-medium ${scanning ? 'text-amber-300' : 'text-white'} transition-colors duration-300 animate-pulse`}>
                        {scanning ? 'Detectando...' : 'Buscando código QR'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-amber-800 border-amber-200 bg-amber-50/80 hover:bg-amber-50"
                onClick={handleRestartScanner}
                disabled={isInitializing}
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </Button>
            </div>
            
            <Button 
              onClick={onClose} 
              variant="ghost"
              className="text-amber-800 hover:bg-amber-100/50"
            >
              <X className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Cerrar</span>
            </Button>
          </div>
          
          <div className="text-center mt-3 space-y-1.5">
            <p className="text-sm text-amber-800 font-medium">
              Escanea el código QR de la cafetería
            </p>
            <p className="text-xs text-amber-700/70">
              Mantén el dispositivo estable para mejores resultados
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRScannerDialog;