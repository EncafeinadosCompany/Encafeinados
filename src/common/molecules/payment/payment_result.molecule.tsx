import { Card, CardContent } from "@/common/ui/card";
import {motion} from "framer-motion"
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { ArrowLeft, LucideProps } from "lucide-react";


interface PaymentResultProp {
    paymentId:string | null;
    merchantOrderId:string | null;
    countdown:number;
    handleBackToPagos: () => void;
    statusConfig:
    {
        bgColor:string;
        borderColor:string;
        icon:ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
        iconColor:string;
        message:string;
        title:string;
        details:string;
    }
}
export default function PaymentResult ({paymentId,statusConfig, merchantOrderId, countdown, handleBackToPagos}:PaymentResultProp){

      const StatusIcon = statusConfig.icon;
    return (
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

              {/* Títle */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                {statusConfig.title}
              </motion.h1>

              {/* Menssage */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 mb-3"
              >
                {statusConfig.message}
              </motion.p>

              {/* Details */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-600 mb-6"
              >
                {statusConfig.details}
              </motion.p>

              {/* information */}
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

                <p className="text-xs text-gray-500">
                  Redirección automática en {countdown} segundos
                </p>
              </motion.div>

            </CardContent>
          </Card>
        </motion.div>
    )
}