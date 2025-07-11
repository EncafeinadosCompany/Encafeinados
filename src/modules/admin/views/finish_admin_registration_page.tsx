import RegisterAdminStore from "@/common/widgets/forms/auth/form_register_admin_stores.widget"
import { useSearchParams } from "react-router-dom";

const FinishAdminRegistration = () => {

    const [searchParams] = useSearchParams();
    const storeId = searchParams.get('store');
    const branchId = searchParams.get('branch');

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            <div className="w-full max-w-4xl mx-auto relative">
                <RegisterAdminStore storeId={Number(storeId) || 0} branchId={Number(branchId)} />
            </div>
        </div>
    )
}


export default FinishAdminRegistration