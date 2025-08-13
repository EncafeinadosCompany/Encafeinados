import RegisterCriteriaWidget from "@/common/widgets/forms/criteria/form_criteria.widget";
import toast from "react-hot-toast";
import {useSearchParams } from "react-router-dom";

const RegisterCriteriaView = () => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  if (!branchId) {
    toast.error("No contiene el ID");
    return (window.location.href = "/");
  }

  return <RegisterCriteriaWidget branchId={branchId} />;
};
export default RegisterCriteriaView;
