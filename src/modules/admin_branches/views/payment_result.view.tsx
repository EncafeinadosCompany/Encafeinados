import { useSearchParams } from "react-router-dom";
import PaymentWidget from "@/common/widgets/payment/payment.widget";

export default function PaymentResultView() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const merchantOrderId = searchParams.get("merchant_order_id");
  const collection_status = searchParams.get("collection_status");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <PaymentWidget
          paymentId={paymentId}
          merchantOrderId={merchantOrderId}
          collection_status={collection_status}
        />
      </div>
    </div>
  );
}
