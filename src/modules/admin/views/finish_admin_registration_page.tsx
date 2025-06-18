import { FormFinishRegisteAdmin } from "@/common/widgets/forms/auth/form_register_admin_stores.widget"
import { useSearchParams } from "react-router-dom";

const FinishAdminRegistration = () => {
    
    const [searchParams] = useSearchParams();
    const token = searchParams.get('ref'); 
    const storeId= searchParams.get('store'); 
    const branchId = searchParams.get('branch');

    return (
        <div className="min-h-screen bg-[#f5e4d2]  md:bg-[#f5ebe0] flex flex-col">
            <div className="flex-1 flex flex-col  items-center justify-center p-2 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                <FormFinishRegisteAdmin ref={token||""} storeId={Number(storeId)|| 0} branchId={Number(branchId)}>
                </FormFinishRegisteAdmin>  
                </div>
            </div>
        </div>
    )
}


export default FinishAdminRegistration