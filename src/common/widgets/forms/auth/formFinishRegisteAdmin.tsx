import { FinistAdminStore } from "@/common/molecules/auth/stores/admin/finistAdminStore"
import { Button } from "@/common/ui/button"
import { Card } from "@/common/ui/card"


export const FormFinishRegisteAdmin = () => {
    return (
        <Card className="border-none bg-white/80 p-10 shadow-2xl">
            <form>
                <FinistAdminStore></FinistAdminStore>
                <div className=" text-center mt-6">
                    <Button className=" rounded-md bg-black text-white items-center hover:bg-gray-800">Enviar registro</Button>
                </div>
            </form>
        </Card >
    )
}