import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/ui/tabs";
import CanvasDashboard from "@/common/widgets/admin_branches/create_attributes.widgets";
import CafeGallery  from "@/common/widgets/admin_branches/edit_images.widget";
import FormEditBranch from "@/common/widgets/forms/auth/form_edit_branches_widget";
import { Coffee, ImageIcon, Settings } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Perfil_branches() {
    const [activeTab, setActiveTab] = useState("atributos");
    const navigate = useNavigate()
    return (
        <main className="h-full bg-[#FAF3E0] overflow-y-hidden overflow-x-hidden py-4 px-4">
             <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#2C1810] text-center">
                        Perfil de Sucursal
                    </h1>
                    <p className="text-[#6F4E37] text-center mt-2">
                        Gestiona la información de tu sucursal
                    </p>
                </div>
            <div className="container h-[95vh] w-full relative bg-white rounded-xl shadow-sm border border-[#E6D7C3]  mx-auto overflow-y-auto max-h-[75vh]">   
                    <nav className="absolute w-full">
                        <ul className="grid w-full grid-cols-3 p-1 gap-2 bg-[#FAF3E0]/50">
                            <li>
                                <a
                                    href={"/sucursal/perfil/attributes"}
                                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors
                                        ${activeTab === "atributos" ? "border-b-2 border-b-lime-950 text-yellow-950" : "hover:bg-[#6F4E37]/10"}`}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Atributos
                                </a>
                            </li>
                            <li>
                                <a
                                    href={"/sucursal/perfil/images"}
                                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors
                                        ${activeTab === "imagenes" ? "bg-[#6F4E37] text-white" : "hover:bg-[#6F4E37]/10"}`}
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Imágenes
                                </a>
                            </li>
                            <li>
                                <a
                                    href={"/sucursal/perfil/branch"}
                                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors
                                        ${activeTab === "datos" ? "bg-[#6F4E37] text-white" : "hover:bg-[#6F4E37]/10"}`}
                                >
                                    <Coffee className="h-4 w-4 mr-2" />
                                    Datos
                                </a>
                            </li>
                        </ul>

                        <div className="p-6">
                        <Outlet />
                        </div>
                    </nav>
                
            </div>
        </main>
    );
}