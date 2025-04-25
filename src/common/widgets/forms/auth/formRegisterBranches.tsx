import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"

import { RegisterBranchesStep1 } from "@/common/molecules/auth/stores/branches/registerBranchesStep1"
import { RegisterBranchesStep3 } from "@/common/molecules/auth/stores/branches/registerBranchesStep3"

import { useRegisterBrandMutation } from "@/api/mutations/stores/branchesMutation"
import { useCriteria } from "@/api/queries/stores/criteriaQueries"
import { useSocialNetworksQuery } from "@/api/queries/stores/socialNetworksQueries"
import { RegisterStoreBrancheSchema, RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/registerStoreBrancheSchema"
import RegisterStoreBrancheStep2 from "@/common/molecules/auth/stores/store/registerStoreBrancheStep2"
import MapSearch from "../../map/mapSearch"
import SocialNetworksForm from "./socialNetwork"
import { validateImageRequirements } from "@/common/hooks/useCriteria"



interface FormRegisterBrandsProps {
    onClose: () => void
}

const FormRegisterBrands = ({ onClose }: FormRegisterBrandsProps) => {
    const [direction, setDirection] = useState(0);
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const [baseAddress, setBaseAddress] = useState("");
    const useBranchesMutation = useRegisterBrandMutation();
    const { data: criteria } = useCriteria();
    const { data: socialNetworks } = useSocialNetworksQuery();



    const storeId = localStorage.getItem("storeOrBranchId");


    const methods = useForm<RegisterStoreBrancheSchemaType>({
        resolver: zodResolver(RegisterStoreBrancheSchema[step] as any),
        defaultValues: {
            name: "",
            phone_number: "",
            address: "",
            latitude: 0,
            longitude: 0,
            addressDetails: "",
        },
        mode: "onChange",
    })


    useEffect(() => {
        if (criteria && Object.keys(methods.getValues("criteria") || {}).length === 0) {
            methods.setValue("criteria", criteria.reduce((acc, c) => {
                acc[String(c.id)] = {
                    response_text: "",
                    image_url: undefined,
                };
                return acc;
            }, {} as Record<string, { response_text: string; image_url?: string; other_text?: string }>));
        }
    }, [criteria, methods]);


    const onNext = () => {
        methods.trigger(undefined, { shouldFocus: false }).then((isValid) => {
            if (isValid) {
                setFormData(prev => ({ ...prev, ...methods.getValues() }));

                if (step === 1) {
                    const error = validateImageRequirements(Array.isArray(criteria) ? criteria : [], methods.getValues("criteria"));
                    if (error) {
                        toast.error(error);
                        return;
                    }
                }
                setStep((prev) => prev + 1)
            }
        })
    };

    const onSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };
        const social = finalData.social_networks || [];

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

            await useBranchesMutation.mutateAsync(data)
            onClose();
        }
        catch (error) {
            toast.error("Error al registrar la sucursal");
        }
    };


    const onLocationSelect = (lat: number, lng: number, address: string) => {
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });
        setBaseAddress(address);
    }

    return (
        <div >
            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative ">

                        <div className="relative w-full max-w-3xl mx-auto  flex flex-col" style={{ maxHeight: "300px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait"
                            >
                                <div className="flex-1 max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[65vh] xl:max-h-[40vh] overflow-y-auto scrollbar-subtle
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
                                            <RegisterStoreBrancheStep2
                                                methods={methods}
                                                criteria={criteria || []}
                                            ></RegisterStoreBrancheStep2>
                                        )
                                    }
                                    {
                                        step === 2 && (
                                            <MapSearch
                                                initialAddress={baseAddress}
                                                initialLat={methods.watch("latitude")}
                                                initialLng={methods.watch("longitude")}
                                                onLocationSelect={onLocationSelect}>
                                            </MapSearch>

                                        )
                                    }
                                    {
                                        step === 3 && (

                                            <RegisterBranchesStep3
                                                register={methods.register}
                                                errors={methods.formState.errors}
                                                baseAddress={baseAddress}>
                                            </RegisterBranchesStep3>
                                        )
                                    }{
                                        step === 4 && (

                                            <SocialNetworksForm
                                                register={methods.register}
                                                control={methods.control}
                                                availableSocialNetworks={socialNetworks}
                                            >
                                            </SocialNetworksForm>

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
                                {step < RegisterStoreBrancheSchema.length - 1 ? (
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
                                            disabled={!methods.formState.isValid || !methods.getValues("social_networks")?.length}
                                            className={`rounded-lg px-6 py-2 ${!methods.formState.isValid
                                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                                }`}
                                        >
                                            Complete Registration
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

export default FormRegisterBrands 