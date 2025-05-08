import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReviewWidget from "@/common/widgets/review/review.widget";
import { CoffeeBackground } from "@/common/widgets/coffee_background.widget";

export const ReviewView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchId = searchParams.get("branch_id");
  const branchName = searchParams.get("branch_name");

  const handleClose = () => {
    navigate('/coffeelover');
  };

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/coffeelover');
    }, 2000);
  };

  if (!branchId) {
    return <div>No se proporcionó una sucursal válida</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/5 backdrop-blur-sm">
      <CoffeeBackground />
      <div className="w-full max-w-md z-10">
        <ReviewWidget 
          branchId={parseInt(branchId)} 
          branchName={branchName || undefined}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default ReviewView;