"use client"
import { useEffect, useState } from "react"
import { Suspense, lazy } from "react"
import { ArrowRight } from "lucide-react"
import { useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"

import toast from "react-hot-toast"

import { Button } from "@/common/ui/button"
import { TitleForm } from "@/common/atoms/auth/titleForm"
import { validateImageRequirements } from "@/common/hooks/useCriteria"
import { Card, CardContent, CardFooter, CardHeader } from "@/common/ui/card"
import { RegisterStoreBrancheSchema, RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/registerStoreBrancheSchema"

const RegisterStoreBrancheStep1 = lazy(() => import("@/common/molecules/auth/stores/store/registerStoreBrancheStep1"))
const RegisterStoreBrancheStep2 = lazy(() => import("@/common/molecules/auth/stores/store/registerStoreBrancheStep2"))
const RegisterStoreBrancheStep3 = lazy(() => import("@/common/molecules/auth/stores/store/registerStoreBrancheStep3"))
const MapSearch = lazy(() => import("@/common/widgets/map/mapSearch"));

import { useCriteria } from "@/api/queries/stores/criteriaQueries"
const SocialNetworksForm = lazy(() => import("./socialNetwork"))
import { useSocialNetworksQuery } from "@/api/queries/stores/socialNetworksQueries"
import { useRegisterBrandMutation } from "@/api/mutations/stores/branchesMutation"
import { BranchPost } from "@/api/types/branchesTypes"
import { useRegisterCriteriaMutation } from "@/api/mutations/stores/criteriaMutation"


export default function RegisterStoreBranches() {
    const [step, setStep] = useState(0)
    const { data: criteria } = useCriteria();
    const { data: socialNetworks } = useSocialNetworksQuery();
    const useBranchesMutation = useRegisterBrandMutation();
    const useCriteriaMutation = useRegisterCriteriaMutation();
    const [baseAddress, setBaseAddress] = useState("");

    const { storeId } = useParams();

    const methods = useForm<RegisterStoreBrancheSchemaType>({
        resolver: zodResolver(RegisterStoreBrancheSchema[step] as any),
        defaultValues: {
            name: "",
            phone_number: "",
            address: "",
            latitude: 0,
            longitude: 0,
            addressDetails: ""
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

      
    const [formData, setFormData] = useState({})


    const handleSubmit = async(data: any) => {
        const finalData = { ...formData, ...data };
        console.log(finalData.criteria)


        const criteria= {
            branchId: 1,
            criteria: finalData.criteria
        }
       
        
        await useCriteriaMutation.mutateAsync({
          branchId: 1,
          criteriaResponseData: finalData.criteria,
        });

        // try{

        //     storeId? storeId : toast.error('no cuenta con el id') 
        //     const data: BranchPost ={
        //         store_id: Number(storeId),
        //         name: finalData.name,
        //         phone_number: finalData.phone_number,
        //         latitude: finalData.latitude,
        //         longitude: finalData.longitude,
        //         address: finalData.address,
        //         social_branches:finalData.social_networks
        //     }
        //     await useBranchesMutation.mutateAsync(data)

        // }catch(err){
        //     console.log(err)
        // }
        // const social_branches = selectedNetworks.map((network) => ({
        //     social_network_id: network.networkId,
        //     url: network.url,
        //     description: network.description,
        //   }))

        //   console.log(social_branches)

    }

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, baristaImage: file }))
        }
    }


    const nextStep = () => {
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
    }

    const prevStep = () => {
        setStep((prev) => prev - 1)
    }

    const onLocationSelect = (lat: number, lng: number, address: string) => {
        console.log(lat, lng, address)
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });

        setBaseAddress(address);
    }

    return (<div className="min-h-screen flex items-center justify-center p-4  bg-gradient-to-b from-orange-100 to-orange-300 sm:to-orange-200" translate="no">

        <Card className="relative w-full max-w-3xl mx-auto h-[90vh] flex flex-col overflow-y-auto border-none shadow-2xl bg-white/90">


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
            >
                <CardHeader className="mb-1" >
                    {step === 0 &&
                        <TitleForm
                            title="hola"
                            subtitle="Ingrese la información básica de la sucursal">
                        </TitleForm>

                    }
                    {step === 1 && "Complete los siguientes criterios"}
                    {step === 2 && "Complete la dirección detallada"}
                    {step === 3 && "Responda las preguntas adicionales"}
                    {step === 4 && "Redes sociales"}
                </CardHeader>
                <FormProvider {...methods}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <form className="space-y-9 md:space-y-2" onSubmit={methods.handleSubmit(handleSubmit)}>
                            <CardContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent px-4 sm:px-6 ">
                                {step === 0 && (
                                    <RegisterStoreBrancheStep1
                                        register={methods.register}
                                        error={methods.formState.errors}
                                        control={methods.control}
                                    />

                                )}

                                {step === 1 && (
                                    <RegisterStoreBrancheStep2
                                        methods={methods}
                                        criteria={criteria || []}
                                    ></RegisterStoreBrancheStep2>

                                )}

                                {step === 2 && (
                                    <div className="border-none p-4 flex items-center justify-center bg-muted">
                                        <MapSearch
                                            onLocationSelect={onLocationSelect}>
                                        </MapSearch>
                                    </div>
                                )}

                                {step === 3 && (
                                    <RegisterStoreBrancheStep3
                                        baseAddress={baseAddress}
                                        errors={methods.formState.errors}
                                        register={methods.register}>
                                    </RegisterStoreBrancheStep3>
                                )}
                                {
                                    step === 4 && (
                                        <SocialNetworksForm
                                            register={methods.register}
                                            control={methods.control}
                                            availableSocialNetworks={socialNetworks}

                                        >
                                        </SocialNetworksForm>
                                    )
                                }
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-between w-full">
                                    {step > 0 && (
                                        <Button
                                        type="button"
                                        
                                        variant="outline" onClick={prevStep}>
                                            Anterior
                                        </Button>
                                    )}
                                    {step < RegisterStoreBrancheSchema.length - 1 ? (

                                        <Button type="button" onClick={nextStep} className={`${step > 0 ? "" : "ml-auto"} bg-amber-600 text-white `}>
                                        
                                            Siguiente
                                            <ArrowRight className="ml-2 text-white " />
                                        </Button>

                                    ) : (
                                        <Button className="ml-auto">Guardar</Button>
                                    )}
                                </div>
                            </CardFooter>
                        </form>
                    </Suspense>
                </FormProvider>
            </motion.div>
        </Card>
    </div>
    )
}

