import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"

import { RegisterBranchesStep1 } from "@/common/molecules/auth/branches/register_branches_step1.module"
import { RegisterBranchesStep3 } from "@/common/molecules/auth/branches/register_branches_step3.module"



import MapSearch from "../../map/map_search.widget"
import SocialNetworksForm from "./form_social_network.widget"
import { Branch } from "@/api/types/branches/branches.types"
import { EditStoreBrancheSchema, EditStoreBrancheSchemaType } from "@/common/utils/schemas/auth/edit_store_branche.schema"
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query"


interface FormEditBrandsProps {
    onClose: () => void
    data?: Branch | null

}

const FormEditBrands = ({ onClose, data }: FormEditBrandsProps) => {
    const [direction, setDirection] = useState(0);
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const [baseAddress, setBaseAddress] = useState("");
    const { data: socialNetworks } = useSocialNetworksQuery();
    const storeId = localStorage.getItem("storeOrBranchId");

    const methods = useForm<EditStoreBrancheSchemaType>({
        resolver: zodResolver(EditStoreBrancheSchema[step] as any),
        defaultValues: {
            name: data?.name || "",
            phone_number: data?.phone_number || "",
            address: data?.address || "",
            latitude: data?.latitude || 0,
            longitude: data?.longitude || 0,
            addressDetails: "",
            social_networks: data?.social_branches?.map(branch => ({
                value: branch.value,
                social_network_id: socialNetworks?.social.filter((b) => b.name === branch.social_network_id)[0]?.id || 0,
                description: branch.description

            })) || [],
           

        },
        // mode: "onChange",
    })



    const onNext = async () => {
        const isValid = await methods.trigger(undefined, { shouldFocus: false });

        if (!isValid) return;

        // Si ya estás en el último paso, NO avances más
        if (step >= EditStoreBrancheSchema.length - 1) return;

        setFormData(prev => ({ ...prev, ...methods.getValues() }));
        setStep(prev => prev + 1);
    };

    const onSubmit = async (data: any) => {


        if (step < EditStoreBrancheSchema.length - 1) {
            console.warn("Intento de submit antes del paso final, ignorado");
            return;
        }
        const finalData = { ...formData, ...data };
        const social = finalData.social_networks || [];

        console.log('finalData', finalData)
        if (!social.length) {
            toast.error("Debes agregar al menos una red social.");
            return;
        }
        try {

            storeId ? storeId : toast.error('no cuenta con el id')
            const data = {
                store_id: Number(storeId),
                name: finalData.name,
                phone_number: finalData.phone_number,
                latitude: finalData.latitude,
                longitude: finalData.longitude,
                address: finalData.address,
                social_branches: finalData.social_networks,
                criteria: finalData.criteria
            }

            // await useBranchesMutation.mutateAsync(data)
            // onClose();
        }
        catch (error) {
            toast.error("Error al registrar la sucursal");
        }
    };


    const onLocationSelect = (lat: number, lng: number, address: string) => {
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });
        setBaseAddress(data?.address || "");
    }

    return (
        <div >
            <motion.div
                className="max-w-2xl w-full relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative">

                        <div className="relative w-full max-w-3xl mx-auto  flex flex-col" style={{ maxHeight: "600px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait"
                            >
                                <div className="flex-1  max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[65vh] xl:max-h-[40vh] overflow-y-auto scrollbar-subtle
                                scrollbar-track-transparent px-2 sm:px-4 md:px-6 lg:px-2 
                                pb-4 transition-all duration-300 rounded-md">
                                    {step === 0 && (
                                        <RegisterBranchesStep1
                                            register={methods.register}
                                            errors={methods.formState.errors}
                                        >
                                        </RegisterBranchesStep1>
                                    )}
                                    {
                                        step === 1 && (
                                            <MapSearch
                                                initialAddress={baseAddress}
                                                initialLat={methods.watch("latitude")}
                                                initialLng={methods.watch("longitude")}
                                                onLocationSelect={onLocationSelect}>
                                            </MapSearch>
                                        )
                                    }
                                    {
                                        step === 2 && (

                                            <RegisterBranchesStep3
                                                register={methods.register}
                                                errors={methods.formState.errors}
                                                baseAddress={baseAddress}>
                                            </RegisterBranchesStep3>
                                        )
                                    }{
                                        step === 3 && (
                                            <SocialNetworksForm
                                                register={methods.register}
                                                control={methods.control}
                                                availableSocialNetworks={socialNetworks}
                                                idSocialNetworks={data?.social_branches}
                                                error={methods.formState.errors}
                                            >
                                            </SocialNetworksForm>
                                        )
                                    }
                                    {
                                        step === 4 && (
                                         <div className="">
                                            <img src="/cafeino.png" className="mx-auto"  width={300} alt="" />
                                         </div>
                                        )
                                    }
                                </div>
                            </AnimatePresence>
                        </div>
                        <div className="relative">
                            <motion.div
                                className="pt-2 m-2 flex justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {step > 0 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" variant="outline" onClick={() => { setStep(step - 1), setDirection(-1) }} className="border-gray-200 bg-white border-1 ">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Anterior
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div></div>
                                )}
                                {step < EditStoreBrancheSchema.length-1? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" onClick={onNext} className="bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white">
                                            Siguiente
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div>
                                        <Button
                                            type="submit"
                                           onClick={() => methods.register("valid", {
                                            value: false // Register valid field as a boolean value
                                        })}
                                            disabled={!methods.formState.isValid || !methods.getValues("social_networks")?.length}
                                            className={`rounded-lg px-6 py-2 ${!methods.formState.isValid
                                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                                }`}
                                        >
                                            Listo
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                    </form>
                </FormProvider>
            </motion.div>
        </div>
    )
}

export default FormEditBrands 