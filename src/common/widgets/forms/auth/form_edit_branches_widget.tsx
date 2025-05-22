import { Input } from "@/common/ui/input";

import { Store, Phone, Coffee, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import MapSearch from "../../map/map_search.widget";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/common/ui/button";
import { EditBranchesSchemas, EditBrancheType } from "@/common/utils/schemas/auth/edit_branches.schema";

import { useBranchesID } from "@/api/queries/branches/branch.query";

import { Label } from "@/common/ui/label";
import { useUpdateBranchMutation } from "@/api/mutations/branches/branches.mutation";
import { InputForm } from "@/common/atoms/auth/input_form.atom";


export default function FormEditBranch() {
    const { data: useBranches } = useBranchesID(1)
    const { mutateAsync: useUpdateBranches } = useUpdateBranchMutation()

    const [baseAddress, setBaseAddress] = useState("");




    const { register, setValue, reset, handleSubmit, watch, control, formState: { errors } } = useForm<EditBrancheType>({
        resolver: zodResolver(EditBranchesSchemas),
        defaultValues: {
            name: "",
            phone_number: "",
            address: "",
            latitude: 0,
            longitude: 0
        }
    });

    useEffect(() => {
        if (useBranches) {
            reset({
                name: useBranches.branch.name,
                phone_number: useBranches.branch.phone_number || "",
                address: useBranches.branch.address,
                latitude: useBranches.branch.latitude,
                longitude: useBranches.branch.longitude,
            })

            setValue('latitude', useBranches.branch.latitude)
            setValue('longitude', useBranches.branch.longitude)
            setBaseAddress(useBranches.branch.address)
        }

        console.log("useBranches:", useBranches);
    }, [useBranches]);



    const onSubmit = async (data: EditBrancheType) => {
        try {
            useUpdateBranches({ data })
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const onLocationSelect = (lat: number, lng: number, address: string) => {
        setValue("latitude", lat);
        setValue("longitude", lng);
        setValue("address", address);
        setBaseAddress(address);
    };

    return (
        <div className="h-[95-vh] md:h-full w-full p-4 grid grid-cols-1 items-center">
            <Card className=" border-none mx-auto w-full  md:w-5xl bg-white ">
                <CardHeader className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center mb-2">
                        <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                            <Coffee className="text-white" size={24} />
                        </div>
                        <CardTitle className="text-[#020F17] font-semibold text-xl">
                            Edita tu sucursal
                        </CardTitle>
                    </div>
                    <div className="flex items-center space-x-1 ">
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                        <div className="text-[#DB8935]">●</div>
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                    </div>
                    <p className="text-[#546F75] text-sm text-center max-w-xs">
                        "Formulario para editar los datos de tu sucursal"
                    </p>

                    <div className="absolute opacity-5 -right-0 -top-0">
                        <Store className="text-[#2B2B2B]" size={120} />
                    </div>

                </CardHeader>
                <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[70vh] scrollbar-subtle ">
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <motion.button
                            initial={{ opacity: 0.5 }}
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-white/80  p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                            <ChevronDown className="h-4 w-4 text-[#6F4E37]" />
                        </motion.button>
                    </div>
                    <div className="grid gap-6 md:grid-cols-1">

                        <form onSubmit={handleSubmit(onSubmit, (errors) => {
                            console.error("Errores del formulario:", errors);
                        })} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2">Nombre de la sucursal</Label>

                                    <div className="relative">
                                        <Store className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                        <InputForm
                                            {...register("name")}
                                            placeholder="Ej: Café del Centro"
                                            className="pl-10 pr-4 py-2 w-full"
                                        />
                                    </div>

                                    <p>{errors.name?.message}</p>
                                </div>

                                <div>
                                    <Label className="mb-2">Número de teléfono</Label>

                                    <div className="relative">
                                        <Phone className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                        <InputForm
                                            {...register("phone_number")}
                                            placeholder="Ej: +1234567890"
                                            className="pl-10 pr-4 py-2 w-full"
                                        />
                                    </div>

                                    <p>{errors.phone_number?.message}</p>
                                </div>
                            </div>

                            {/* Map Section */}
                            {watch("latitude") && watch("longitude") ? (
                                <MapSearch
                                    initialAddress={baseAddress}
                                    initialLat={watch("latitude")}
                                    initialLng={watch("longitude")}
                                    onLocationSelect={onLocationSelect}
                                />
                            ) : null}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>

                    </div>
                </CardContent>
            </Card>
        </div>

    );
}