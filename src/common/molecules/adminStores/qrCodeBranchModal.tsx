import { QRCode } from "@/common/atoms/QRCode";
import { CardContent } from "@/common/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import { QrCodeIcon } from "lucide-react";

export const QRCodeBranchModal = ({
  isOpen,
  onClose,
  qrCodeUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
}) => {
  qrCodeUrl = "encafeinados.club";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="qr-code-dialog"
        aria-labelledby="qr-code-dialog-title"
        aria-describedby="qr-code-dialog-description"
        className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[95vw] 2xl:w-[45vw] max-h-[72vh] sm:max-h-[90vh] max-w-[90vh] bg-white shadow-xl border-none rounded-lg"
      >
        <div className="p-4 relative">
          <div className="absolute opacity-5 -right-7 -top-6">
            <QrCodeIcon className="text-[#2B2B2B]" size={120} />
          </div>

          <DialogHeader className="flex flex-col items-center relative z-10">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                <QrCodeIcon className="text-white" size={24} />
              </div>
              <DialogTitle className="text-[#020F17] font-semibold text-xl"></DialogTitle>
            </div>
            <div className="flex items-center space-x-1 ">
              <div className="h-[2px] w-12 bg-[#DC3545]"></div>
              <div className="text-[#DB8935]">●</div>
              <div className="h-[2px] w-12 bg-[#DC3545]"></div>
            </div>
            <Description className="text-[#546F75] text-sm text-center max-w-xs">
              El siguiente código podrá ser utilizado para que los coffeelovers
              que entren a tu tienda registren su visita.
            </Description>
          </DialogHeader>
        </div>

        {/* QR Code Display */}
        <CardContent className="bg-[#FAFAFA] sm:p-2 rounded-md border border-[#D4D4D4] shadow-inner relative z-10">
          {qrCodeUrl ? (
            <div className="flex items-center justify-center mt-10 mb-10">
              <QRCode url={qrCodeUrl} />
            </div>
          ) : (
            "Cargando QR Code..."
          )}
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};
