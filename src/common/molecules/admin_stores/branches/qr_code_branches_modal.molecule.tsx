import { QRCode } from "@/common/atoms/QRCode";
import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/common/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import { toPng } from "html-to-image";
import { DownloadIcon, InfoIcon, QrCodeIcon } from'@/common/ui/icons';

export const QRCodeBranchModal = ({
  isOpen,
  onClose,
  qrCodeUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
}) => {
  const downloadComponent = () => {
    const node = document.getElementById("qr-code-branch");
    if (!node) return;

    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "encafeinados-qr.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error al generar la imagen:", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="qr-code-dialog"
        aria-labelledby="qr-code-dialog-title"
        aria-describedby="qr-code-dialog-description"
        className="bg-white shadow-xl border-none rounded-lg max-h-[90vh] w-full max-w-3xl p-0 overflow-hidden"
      >
        {/* Diseño de dos columnas */}
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Columna izquierda - QR Code */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-[#FAFAFA] border-r border-[#F0F0F0]">
            {/* QR Code Display */}
            <div
              id="qr-code-branch"
              className="bg-white w-full rounded-lg border border-[#D4D4D4] shadow-sm p-4 flex flex-col items-center"
            >
              {qrCodeUrl ? (
                <>
                  <div className="mb-4  w-full">
                    <QRCode
                      url={qrCodeUrl}
                      width={Math.min(250, window.innerWidth * 0.6)}
                    />
                  </div>
                  <div className="text-center text-sm text-[#546F75] mb-2">
                    Código QR para tu cafetería
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px]">
                  <div className="animate-pulse text-[#546F75]">
                    Cargando QR Code...
                  </div>
                </div>
              )}
            </div>

            {/* Botón de descarga */}
            <button
              onClick={downloadComponent}
              className="mt-4 flex items-center justify-center bg-[#DB8935] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg px-4 py-2 w-full max-w-xs"
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Descargar QR
            </button>
          </div>

          {/* Columna derecha - Información */}
          <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col">
            <DialogHeader className="mb-4">
              <div className="flex items-center">
                <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                  <QrCodeIcon className="text-white" size={20} />
                </div>
                <DialogTitle className="text-[#020F17] font-semibold text-lg">
                  Código QR de Verificación
                </DialogTitle>
              </div>

              <div className="flex items-center space-x-1 my-2">
                <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                <div className="text-[#DB8935]">●</div>
                <div className="h-[2px] w-12 bg-[#DC3545]"></div>
              </div>
            </DialogHeader>

            <div className="flex-grow">
              <div className="bg-[#FFF9F2] rounded-lg p-4 mb-4 border border-[#FFECD9]">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-[#DB8935] mt-0.5 mr-2 flex-shrink-0" />
                  <Description className="text-[#546F75] text-sm">
                    Este código QR podrá ser utilizado para que los coffeelovers
                    que visiten tu cafetería registren su visita.
                  </Description>
                </div>
              </div>

              <div className="space-y-3 text-sm text-[#546F75]">
                <h4 className="font-medium text-[#020F17]">
                  Cómo usar este código:
                </h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Al terminar una visita de un coffelover, muestra este codigo  QR 
                  </li>
                  <li>Los usuarios escanean el código con la app Encafeinados</li>
                  <li>La visita queda registrada automáticamente</li>
                  <li>
                    El usuario gana CoffeeCoins y añade tu cafetería a su álbum
                  </li>
                </ol>

                <div className="pt-2">
                  <p className="text-xs border-t border-[#F0F0F0] pt-2 mt-2 text-[#546F75]/70">
                    Recuerda que cada QR es único para tu sucursal y no debe ser
                    compartido con otras locaciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
