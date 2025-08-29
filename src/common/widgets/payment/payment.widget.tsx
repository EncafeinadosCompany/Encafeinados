import { UseMetaPayment } from "@/common/hooks/Payment/use_meta.hook";
import PaymentResult from "@/common/molecules/payment/payment_result.molecule";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentProp {
  merchantOrderId: string | null;
  paymentId: string | null;
  collection_status: string | null;
}

export default function PaymentWidget({
  paymentId,
  merchantOrderId,
  collection_status,
}: PaymentProp) {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const { statusConfig } = UseMetaPayment(
    collection_status ? collection_status : ""
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/branch/payments");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleBackToPagos = () => {
    navigate("/branch/payments");
  };

  return (
    <PaymentResult
      handleBackToPagos={handleBackToPagos}
      countdown={countdown}
      paymentId={paymentId || ""}
      merchantOrderId={merchantOrderId || ""}
      statusConfig={statusConfig}
    ></PaymentResult>
  );
}
