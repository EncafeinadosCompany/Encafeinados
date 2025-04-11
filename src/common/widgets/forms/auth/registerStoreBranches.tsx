"use client"
import { useEffect, useState } from "react"
import { Suspense, lazy } from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
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

const SocialNetworksForm = lazy(() => import("./socialNetwork"))
const MapSearch = lazy(() => import("@/common/widgets/map/mapSearch"));

import { useCriteria } from "@/api/queries/stores/criteriaQueries"
import { useSocialNetworksQuery } from "@/api/queries/stores/socialNetworksQueries"
import { useRegisterBrandMutation } from "@/api/mutations/stores/branchesMutation"
import { showSuccessToast } from "@/common/molecules/auth/cardSuccess"


export default function RegisterStoreBranches() {
    
    const [step, setStep] = useState(0)
    const { storeId } = useParams();
    const [formData, setFormData] = useState({})
    const [baseAddress, setBaseAddress] = useState("");

    const navigate = useNavigate();
    
    const { data: socialNetworks } = useSocialNetworksQuery();
    const { data: criteria } = useCriteria();
    const useBranchesMutation = useRegisterBrandMutation();


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


    const handleSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };
        console.log(finalData.criteria)

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
            const name = localStorage.getItem("nameStore");
            showSuccessToast(name) 

        } catch (err) {
            console.log(err)
        }

    }

    const nextStep = () => {
        methods.trigger(undefined, { shouldFocus: false }).then((isValid) => {
            if (isValid) {
                setFormData(prev => ({ ...prev, ...methods.getValues() }));
                if (step === 1) {
                    const error = validateImageRequirements(Array.isArray(criteria) ? criteria : [], methods.getValues("criteria"));
                    if (error) {
                        toast.error(error, {
                            id: "error"
                        });
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
        <Card className="relative w-full max-w-3xl mx-auto min-h-[50vh] max-h-[90vh]   md:max-h-[85vh] flex flex-col overflow-y-auto border-none shadow-2xl bg-white/90">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
            >
                <CardHeader className="mb-1 text-center" >
                    <TitleForm
                        title="Formulario de registro de sucursal"
                        subtitle={(() => {
                            switch (step) {
                                case 0:
                                    return "Estás a un paso de hacer que tu cafetería crezca y se conecte con más amantes del café como vos. Este formulario nos ayuda a conocer mejor tu sucursal, sus sabores, su esencia y todo eso que la hace única.";
                                case 1:
                                    return "No hay respuestas correctas ni incorrectas - solo queremos conocerte mejor para acompañarte. Respondé con 'Sí', 'No' u 'Otro', y si podés, ¡sumá una imagen!";
                                default:
                                    return "";
                            }
                        })()}
                        className="px-10"
                    />
                </CardHeader>
                <FormProvider {...methods}>
                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <form className="space-y-9 md:space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent px-4 sm:px-6 " onSubmit={methods.handleSubmit(handleSubmit)}>
                            <CardContent className="flex-1 max-h[10vh] ">
                                {step === 0 && (
                                    <RegisterStoreBrancheStep1
                                        register={methods.register}
                                        error={methods.formState.errors}
                                        control={methods.control}
                                    />

                                )}

                                {step === 1 && (
                                    <div className=" ">
                                        <RegisterStoreBrancheStep2
                                        methods={methods}
                                        criteria={criteria || []}
                                    ></RegisterStoreBrancheStep2>
                                    </div>

                                )}

                                {step === 2 && (
                                    <div className="border-none flex items-center justify-center bg-muted">
                                        <MapSearch
                                            initialAddress={baseAddress}
                                            initialLat={methods.watch("latitude")}
                                            initialLng={methods.watch("longitude")}
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
                                            availableSocialNetworks={socialNetworks}>
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
                                        <Button
                                            disabled={!methods.formState.isValid || !methods.getValues("social_networks")?.length}
                                            type="submit" className="ml-auto bg-black text-white">Guardar</Button>
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

