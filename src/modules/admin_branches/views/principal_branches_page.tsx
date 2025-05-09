import { useStatesIsOpen } from "@/api/mutations/branches/branch_states.mutation";
import { useBranchesID, useImagenBranch } from "@/api/queries/branches/branch.query";

import { QRCode } from "@/common/atoms/QRCode";
import BranchStatusModal from "@/common/molecules/admin_branch/branch_status_modal";
import ImageCarousel from "@/common/molecules/admin_branch/imagen_carousel";
import { Badge } from "@/common/ui/badge";
import { Card } from "@/common/ui/card";
import { Switch } from "@/common/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Clock1, Clock2,  PhoneIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PrincipalBranchesPage() {
    
    const BranchId = localStorage.getItem('storeOrBranchId') 
    if(!BranchId){
      return toast.error('No se encontro el id de la sucursal')
    }
    const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;
    const {data:branches, error, isPending} = useBranchesID(Number(BranchId))
    const [branchStatus, setBranchStatus] = useState<boolean>(branches?.branch.is_open ?? true);
    const {data:imagen , error:errorImagen, isPending:isPendingImagen} = useImagenBranch(Number(BranchId))
    const {mutateAsync:useStateOpen, error:errorStatus, status} = useStatesIsOpen()


    console.log('branches', branches, 'imagen', imagen)


    useEffect(() => {
        if (branches?.branch.is_open !== undefined) {
            setBranchStatus(branches.branch.is_open);
        }
    }, [branches?.branch.is_open]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmStatusChange = () => {
        setBranchStatus(branchStatus === true ? false : true);
        useStateOpen({ id: Number(BranchId), isOpen: branchStatus === true? false : true})
        setIsModalOpen(true);
    };


    const handleStatusClick = () => {
        setIsModalOpen(true); // Only open modal, don't change status yet
    };


    return (
        <div className="container h-full mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full xl:h-full">
                {/* Left column */}
                <div className="h-full">
                    <Card className="p-6 bg-white h-full shadow-lg rounded-xl border-none">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 relative">
                                <Badge className={`${branches?.branch.status == 'APPROVED' ? 'bg-emerald-200/60 border-emerald-700' : 'bg-orange-300 border-orange-500'} p-1 px-2 rounded-full absolute z-10  right-0`}>{branches?.branch.status === 'APPROVED'? 'Aprobada': 'Pediente'}</Badge>
                                {
                                   imagen && imagen?.length > 0 ? (
                                        <ImageCarousel images={imagen||[]} alt="MacBook Air" />
                                    ):(
                                       <div>
                                        <p>No hay imagenes disponibles</p>
                                       </div> 
                                    )
                                }
                                <div className="mx-auto text-center">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-6 ">{branches?.branch.name}</h2>
                                    <p className="text-gray-500 text-center mb-6">{branches?.branch.address}</p>
                                </div>
                                <div className="w-full text-sm text-gray-600 space-y-2.5">
                                   
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                        <div className="flex items-center space-x-2">
                                            <p>Rating</p>
                                            <div className="flex items-center">
                                                <p className="font-semibold">{branches?.branch.average_rating}</p>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <p className="text-gray-400">5.0</p>
                                                <div className="flex ml-2">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            className={`w-4 h-4 ${
                                                                index < Math.floor(Number(branches?.branch.average_rating))
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <PhoneIcon className="w-3 h-3 mr-2" />
                                        <div className="flex space-x-2">
                                            <p>Teléfono</p>
                                            <p>{branches?.branch.phone_number}</p>
                                        </div>

                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex flex-col w-full border-t border-gray-200 space-y-4">
                                            <p className="font-medium mt-4">Redes Sociales</p>
                                            <div className="flex flex-wrap gap-3">
                                                {branches?.branch.social_branches.map((social) => (
                                                    <a
                                                        key={social.social_network_id}
                                                        href={social.value}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                                    >
                                                        {/* Here you could add social media icons based on the network */}
                                                        <span className="text-sm text-gray-700">{social.description}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right column */}
                <div className="h-full">
                    <Card className="p-6 bg-white h-full shadow-lg rounded-xl border-none">
                        <div className="flex flex-col h-full">
                            {/* Screen Size Section */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Horarios</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg flex space-x-4 text-gray-500">
                                        <Clock1></Clock1>
                                        <p className="font-medium">7:00 AM</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg flex space-x-4 text-gray-500">
                                        <Clock2></Clock2>
                                        <p className="font-medium">7:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Memory Section */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de QR</h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <QRCode url={`${EXPOSED_URL}/coffeelover/register-branch-visit?branch_id=${branches?.branch.id}`} />
                                </div>
                            </div>

                            {/* Branch Status Section */}
                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Estado de Sucursal</h3>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <Label htmlFor="branch-status" className="text-base font-medium">
                                            Sucursal actualmente {branchStatus ? "abierta" : "cerrada"}
                                        </Label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {branchStatus
                                                ? "La sucursal está operando con normalidad"
                                                : "La sucursal no está disponible para clientes"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            id="branch-status"
                                            checked={branchStatus}
                                            onCheckedChange={handleStatusClick}
                                        />
                                        <span className="text-sm font-medium">
                                            {branchStatus ? "Abierta" : "Cerrada"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <BranchStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentStatus={branchStatus}
                onConfirm={handleConfirmStatusChange}
            />
        </div>
    );
}