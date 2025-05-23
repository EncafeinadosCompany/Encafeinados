import { useStatesIsOpen } from "@/api/mutations/branches/branch_states.mutation";
import { useBranchesID, useImagenBranch } from "@/api/queries/branches/branch.query";
import { ScrollIndicator } from "@/common/atoms/indicator";

import { QRCode } from "@/common/atoms/QRCode";
import BranchStatusModal from "@/common/molecules/admin_branch/branch_status_modal";
import ImageCarousel from "@/common/molecules/admin_branch/imagen_carousel";
import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { Card } from "@/common/ui/card";
import { Switch } from "@/common/ui/switch";
import { Label } from "@radix-ui/react-label";
import { AlertCircle, Clock1, Clock2, Coffee, PhoneIcon, RefreshCw, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function PrincipalBranchesPage() {

    const BranchId = localStorage.getItem('storeOrBranchId')
    if (!BranchId) {
        return toast.error('No se encontro el id de la sucursal')
    }
    const EXPOSED_URL = import.meta.env.VITE_EXPOSED_URL;

    const { data: branches, error: branchError, isPending: isBranchLoading, status } = useBranchesID(Number(BranchId));
    const { data: imagen, error: imageError, isPending: isImageLoading } = useImagenBranch(Number(BranchId));
    const { mutateAsync: useStateOpen, error: statusError } = useStatesIsOpen();
    const [branchStatus, setBranchStatus] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // Add a loading check for both queries
    const isLoading = isImageLoading || isBranchLoading;
    const hasError = imageError || branchError || statusError;

    useEffect(() => {
        if (branches?.branch.is_open !== undefined) {
            setBranchStatus(branches.branch.is_open);
        }
    }, [branches?.branch.is_open]);

    // Update the loading condition
    if (status === 'pending') {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43765C] mx-auto"></div>
                        <p className="text-gray-500">Cargando información de la sucursal...</p>
                    </div>
                </div>
            </div>
        );
    }


    // useEffect(() => {
    //     if (branches?.branch.is_open !== undefined) {
    //         setBranchStatus(branches.branch.is_open);
    //     }
    // }, [branches?.branch.is_open]);




    // Handle loading states
    if (isBranchLoading || isImageLoading) {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43765C] mx-auto"></div>
                        <p className="text-gray-500">Cargando información de la sucursal...</p>
                    </div>
                </div>
            </div>
        );
    }


    if (branchError || imageError || statusError) {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-600 mb-4">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold">Error al cargar la información</h3>
                    </div>
                    <p className="text-red-500 mb-4">
                        {branchError?.message || imageError?.message || statusError?.message ||
                            'Ocurrió un error al cargar los datos de la sucursal'}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Intentar nuevamente
                    </Button>
                </div>
            </div>
        );
    }

    // Handle empty data
    if (!branches?.branch) {
        return (
            <div className="container h-full mx-auto max-w-7xl px-4 py-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <Coffee className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600">No hay información disponible</h3>
                    <p className="text-gray-500 mt-2">No se encontraron datos de la sucursal</p>
                </div>
            </div>
        );
    }


    const handleConfirmStatusChange = () => {
        setBranchStatus(branchStatus === true ? false : true);
        useStateOpen({ id: Number(BranchId), is_open: branchStatus === true ? false : true })

        setTimeout(() => {
            setIsModalOpen(false);
        }, 900);
    };


    const handleStatusClick = () => {
        setIsModalOpen(true);
    };


    return (
        <div className="container h-full max-w-full  px-5 py-5 scrollbar-subtle">
            <div ref={scrollContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full  overflow-y-auto  scrollbar-subtle">

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ScrollIndicator className="bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20" containerRef={scrollContainerRef as React.RefObject<HTMLElement>}></ScrollIndicator>
                </div>
                {/* Left column */}
                <div className="h-full">
                    <Card className="p-6 bg-white h-full  shadow-lg rounded-xl border-none">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 relative">
                                <Badge className={`${branches?.branch.status == 'APPROVED' ? 'bg-emerald-200/60 border-emerald-700' : 'bg-orange-300 border-orange-500'} p-1 px-2 rounded-full absolute z-10  right-0`}>{branches?.branch.status === 'APPROVED' ? 'Aprobada' : 'Pediente'}</Badge>
                                <div className="h-[40vh] relative">
                                {
                                    imagen && imagen?.length > 0 ? (
                                        <ImageCarousel images={imagen || []} alt="Branch Images" />
                                    ) : (
                                        <div className="flex flex-col items-center h-full justify-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-gray-400 mb-2">
                                                <AlertCircle className="h-8 w-8" />
                                            </div>
                                            <p className="text-gray-600 font-medium">No hay imágenes disponibles</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Por favor, agregue imágenes de la sucursal
                                            </p>
                                        </div>
                                    )
                                }
                                </div>
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
                                                            className={`w-4 h-4 ${index < Math.floor(Number(branches?.branch.average_rating))
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