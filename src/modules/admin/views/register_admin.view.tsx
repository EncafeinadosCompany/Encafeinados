import RegisterAdminStore from "@/common/widgets/forms/auth/form_register_admin_stores.widget"
import { useSearchParams } from "react-router-dom";

export default function RegisterAdmin () {

    const [searchParams] = useSearchParams();
    const storeId = searchParams.get('store');
    const branchId = searchParams.get('branch');

    return (
      <div className="w-full h-full flex flex-col ">
          <RegisterAdminStore 
        storeId={Number(storeId) || 0} 
        branchId={Number(branchId)} 
        /> 
      </div>
    )
}


