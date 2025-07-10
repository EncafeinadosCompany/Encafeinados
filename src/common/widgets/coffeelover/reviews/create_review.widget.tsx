import React, {  useState } from "react";
import { useSubmitReviewMutation } from "@/api/mutations/reviews/review.mutation";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Check, ArrowLeft }  from "@/common/ui/icons"
import toast from "react-hot-toast";
import ReviewForm from "@/common/molecules/reviews/review_form.molecule";
import { Button } from "@/common/ui/button";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";

interface ReviewWidgetProps {
  branchId: number;
  branchName?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({
  branchId,
  branchName,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const submitReview = useSubmitReviewMutation();
  const encryptedUserId = getEncryptedItem<string>("userId");
  const userId = encryptedUserId ? parseInt(encryptedUserId) : null;

  const handleSubmitReview = (data: {
    rating: number;
    comment: string;
    imageUrls?: string[] | undefined;
  }) => {
    if (!userId) {
      toast.error("Debes iniciar sesión para dejar una reseña");
      navigate("/login");
      return;
    }

    submitReview.mutate({
      branchId,
      userId,
      rating: data.rating,
      comment: data.comment,
      imageUrls: data.imageUrls || [],
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      },
      onError: (error) => {
        console.error("Error al enviar reseña:", error);
      }
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#6F4E37] to-[#8A624A] p-4 sm:p-5 text-white">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Comparte tu experiencia</h2>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 p-1.5"
              onClick={onClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              ¡Reseña enviada con éxito!
            </h3>
            <p className="text-gray-600 mb-6 max-w-xs">
              Tu opinión ha sido registrada. ¡Gracias por compartir tu experiencia!
            </p>
            <div className="flex items-center bg-amber-100 rounded-md px-4 py-2">
              <Award className="h-5 w-5 mr-2 text-amber-600" />
              <span className="text-amber-800 font-medium">
                +5 CoffeeCoins añadidos a tu cuenta
              </span>
            </div>
          </motion.div>
        ) : (
          <ReviewForm
            branchId={branchId}
            branchName={branchName}
            onSubmit={handleSubmitReview}
            isLoading={submitReview.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewWidget;