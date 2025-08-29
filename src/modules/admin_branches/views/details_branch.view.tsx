import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import DetailsBranchWidget from "@/common/widgets/admin_branches/details_branches.widget";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DetailsBranchView() {
  const BranchId = getEncryptedItem("branchId") as string | null;
    const navigate = useNavigate();

  if (!BranchId) {
      toast.error("No se encontro el id de la sucursal",{duration:2000});

    setTimeout(() => {
      navigate("/");
    }, 2000);
    
  }

  return <DetailsBranchWidget BranchId={BranchId || null}></DetailsBranchWidget>;
}
