import { FormFinishRegisteAdmin } from "@/common/widgets/forms/auth/formFinishRegisteAdmin"
import { useSearchParams } from "react-router-dom";

const FinishAdminRegistration = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('ref');
    console.log(token);
    return (
        <div className="min-h-screen bg-[#f5e4d2] md:bg-gray-50 bg-gradient-to-b from-orange-50 to-orange-200 md:bg-none flex flex-col">
            <div className="flex-1 flex flex-col  items-center justify-center p-2 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                <FormFinishRegisteAdmin ref={token}>
                </FormFinishRegisteAdmin>  
                </div>
            </div>
        </div>
    )
}


export default FinishAdminRegistration