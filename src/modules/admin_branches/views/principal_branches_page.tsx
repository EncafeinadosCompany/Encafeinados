import { BranchByIdMock } from "@/api/types/branches/branch_by_id.mock";
import { QRCode } from "@/common/atoms/QRCode";
import BranchStatusModal from "@/common/molecules/admin_branch/branch_status_modal";
import ImageCarousel from "@/common/molecules/admin_branch/imagen_carousel";
import { Badge } from "@/common/ui/badge";
import { Card } from "@/common/ui/card";
import { Switch } from "@/common/ui/switch";
import { Label } from "@radix-ui/react-label";
import { Clock1, Clock2, Phone, PhoneIcon, Star } from "lucide-react";
import { useState } from "react";


// MacBook Air images
const macbookImages = [
    "https://th.bing.com/th/id/OIP.0OjnGiILya4rKAOib941YwHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    "/cafeino.png",
    "/placeholder.svg?height=400&width=400&text=MacBook+Air+Open",
]
// ... imports remain the same ...

export default function PrincipalBranchesPage() {
    const [branchStatus, setBranchStatus] = useState<true | false>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmStatusChange = () => {
        setBranchStatus(branchStatus === true ? false : true);
        setIsModalOpen(true);
    };

    return (
        <div className="container h-full mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left column */}
                <div className="h-full">
                    <Card className="p-6 bg-white h-full shadow-lg rounded-xl border-none">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 relative">
                                <Badge className={`${BranchByIdMock.status == 'aprovada' ? 'bg-emerald-200/60 border-emerald-700' : 'bg-red-300 border-red-500'} p-1 px-2 rounded-full absolute z-10  right-0`}>{BranchByIdMock.status}</Badge>
                                <ImageCarousel images={macbookImages} alt="MacBook Air" />
                                <div className="mx-auto text-center">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-6 ">{BranchByIdMock.name}</h2>
                                    <p className="text-gray-500 text-center mb-6">{BranchByIdMock.address}</p>
                                </div>
                                <div className="w-full text-sm text-gray-600 space-y-2.5">
                                   
                                    <p className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                        <div className="flex items-center space-x-2">
                                            <p>Rating</p>
                                            <div className="flex items-center">
                                                <p className="font-semibold">{BranchByIdMock.average_rating}</p>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <p className="text-gray-400">5.0</p>
                                                <div className="flex ml-2">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            className={`w-4 h-4 ${
                                                                index < Math.floor(BranchByIdMock.average_rating)
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <PhoneIcon className="w-3 h-3 mr-2" />
                                        <div className="flex space-x-2">
                                            <p>Teléfono</p>
                                            <p>{BranchByIdMock.phone_number}</p>
                                        </div>

                                    </p>
                                    <p className="flex items-center">
                                        <div className="flex flex-col w-full border-t border-gray-200 space-y-4">
                                            <p className="font-medium mt-4">Redes Sociales</p>
                                            <div className="flex flex-wrap gap-3">
                                                {BranchByIdMock.social_branches.map((social) => (
                                                    <a
                                                        key={social.social_network_id}
                                                        href={social.url}
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
                                    </p>
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
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Horario</h3>
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
                                    <QRCode url="/" />
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
                                            onCheckedChange={handleConfirmStatusChange}
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