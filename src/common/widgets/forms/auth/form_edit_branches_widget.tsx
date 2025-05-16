import { Input } from "@/common/ui/input";

import { Store, Phone, Coffee } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import SocialNetworksForm from "./form_social_network.widget";

import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query";
import MapSearch from "../../map/map_search.widget";
import { useEffect, useState } from "react";

import { Button } from "@/common/ui/button";
import { EditBranchesSchemas, EditBrancheType } from "@/common/utils/schemas/auth/edit_branches.schema";

import { useBranchesID } from "@/api/queries/branches/branch.query";



import { Label } from "@/common/ui/label";
import { useUpdateBranchMutation } from "@/api/mutations/branches/branches.mutation";



type FormData = {
    name: string;
    phone_number: string;
};

export default function FormEditBranch() {
    const { data: useBranches } = useBranchesID(1)
    const {mutateAsync: useUpdateBranches}= useUpdateBranchMutation()

    const [baseAddress, setBaseAddress] = useState("");




    const { register, setValue, reset, handleSubmit, watch, control, formState: { errors } } = useForm<EditBrancheType>({
        resolver: zodResolver(EditBranchesSchemas),
        defaultValues: {
            name: "",
            phone_number: "",
            address: "",
            latitude: 0,
            longitude: 0,
            // addressDetails: "",
            // social_networks: [],
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
                // social_networks: useBranches.branch.social_branches?.map(branch => ({
                //     value: branch.value,
                //     social_network_id: socialNetworks?.social.find(
                //         (b) => b.name === branch.social_network_id
                //     )?.id || 0,
                //     description: branch.description
                // })) || []
            })
        }

        console.log("useBranches:", useBranches);
    }, [useBranches]);



    const onSubmit = async (data: EditBrancheType) => {
        try {
            useUpdateBranches({data})
            // Add your API call here
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

        <div className="max-w-4xl mx-auto">
            <Card className=" border-none bg-white">
                <CardHeader className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center mb-2">
                        <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                            <Coffee className="text-white" size={24} />
                        </div>
                        <CardTitle className="text-[#020F17] font-semibold text-xl">
                            Registrar una nueva sucursal
                        </CardTitle>
                    </div>
                    <div className="flex items-center space-x-1 ">
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                        <div className="text-[#DB8935]">●</div>
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                    </div>
                    <p className="text-[#546F75] text-sm text-center max-w-xs">

                        "Formulario para registrar una sucursal"

                    </p>

                    <div className="absolute opacity-5 -right-0 -top-0">
                        <Store className="text-[#2B2B2B]" size={120} />
                    </div>

                </CardHeader>
                <CardContent className="p-6 space-y-4">

                    <div className="grid gap-6 md:grid-cols-1">

                        <form onSubmit={handleSubmit(onSubmit, (errors) => {
                            console.error("Errores del formulario:", errors);
                        })} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Nombre de la sucursal</Label>

                                    <div className="relative">
                                        <Store className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                        <Input
                                            {...register("name")}
                                            placeholder="Ej: Café del Centro"
                                            className="pl-10 pr-4 py-2 w-full rounded-lg border"
                                        />
                                    </div>

                                    <p>{errors.name?.message}</p>
                                </div>

                                <div>
                                    <Label>Número de teléfono</Label>

                                    <div className="relative">
                                        <Phone className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                        <Input
                                            {...register("phone_number")}
                                            placeholder="Ej: +1234567890"
                                            className="pl-10 pr-4 py-2 w-full rounded-lg border"
                                        />
                                    </div>

                                    <p>{errors.phone_number?.message}</p>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="space-y-4">
                                <MapSearch
                                    initialAddress={baseAddress}
                                    initialLat={watch("latitude")}
                                    initialLng={watch("longitude")}
                                    onLocationSelect={onLocationSelect}
                                />

                            </div>

                            {/* <div>
                                <Label>Detalles de la dirección</Label>

                                <Input
                                    {...register("addressDetails")}
                                    placeholder="Ej. Calle 123 #45-67"
                                />

                                <p>{errors.addressDetails?.message}</p>
                            </div> */}

                            {/* Social Networks Section */}
                            {/* <SocialNetworksForm
                                register={register}
                                control={control}
                                availableSocialNetworks={socialNetworks}
                            /> */}

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