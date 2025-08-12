import RegisterAdminStore from "@/common/widgets/forms/auth/form_register_admin_stores.widget"
import { useSearchParams } from "react-router-dom";

const FinishAdminRegistration = () => {

    const [searchParams] = useSearchParams();
    const storeId = searchParams.get('store');
    const branchId = searchParams.get('branch');

    return (
        <RegisterAdminStore 
        storeId={Number(storeId) || 0} 
        branchId={Number(branchId)} 
        /> 
    )
}


export default FinishAdminRegistration