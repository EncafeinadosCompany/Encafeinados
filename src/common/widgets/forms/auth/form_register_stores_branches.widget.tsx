"use client"
import { useEffect, useState } from "react"
import { Suspense, lazy } from "react"
import { ArrowRight } from "@/common/ui/icons"
import { useNavigate, useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"

import toast from "react-hot-toast"

import { Button } from "@/common/ui/button"
import { TitleForm } from "@/common/atoms/auth/title_form.atom"
import { validateImageRequirements } from "@/common/hooks/useCriteria"
import { Card, CardContent, CardFooter, CardHeader } from "@/common/ui/card"
import { RegisterStoreBrancheSchema, RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/register_store_branche.schema"

const RegisterStoreBrancheStep1 = lazy(() => import("@/common/molecules/auth/stores/register_store_branche_step1.molecule"))
const RegisterStoreBrancheStep2 = lazy(() => import("@/common/molecules/auth/stores/register_store_branche_step2.molecule"))
const RegisterStoreBrancheStep3 = lazy(() => import("@/common/molecules/auth/stores/register_store_branche_step3.molecule"))

const SocialNetworksForm = lazy(() => import("./form_social_network.widget"))
const MapSearch = lazy(() => import("@/common/widgets/map/map_search.widget"));


import { showSuccessToast } from "@/common/molecules/auth/login/card_success.molecule"
import { useRegisterBrandMutation } from "@/api/mutations/branches/branches.mutation"
import { useCriteria } from "@/api/queries/criteria/criteria.query"
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query"


export default function RegisterStoreBranches() {

    const [step, setStep] = useState(0)
    const { storeId } = useParams();
    const [formData, setFormData] = useState({})
    const [baseAddress, setBaseAddress] = useState("");

    const navigate = useNavigate();
    const { data: socialNetworks } = useSocialNetworksQuery();
    const { data: criteria } = useCriteria();
    const [invalid, setInvalid] = useState(false)
    const { mutateAsync: useBranchesMutation, status } = useRegisterBrandMutation();


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
        setInvalid(false)
    }, [criteria, methods, invalid]);


    const handleSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };

        const social = finalData.social_networks || [];

        if (!social.length) {
            toast.error("Debes agregar al menos una red social.");
            return;
        }

        try {
            storeId ? storeId : toast.error('no cuenta con el id')

            const detailsParts = [];

            if (finalData.addressDetails) detailsParts.push(`Detalles: ${finalData.addressDetails}`);
            if (finalData.nearbyReference) detailsParts.push(`Referencia cercana: ${finalData.nearbyReference}`);
            if (finalData.additionalNotes) detailsParts.push(`Notas adicionales: ${finalData.additionalNotes}`);
            const details = detailsParts.join(" | ");


            const data = {
                store_id: Number(storeId),
                name: finalData.name,
                phone_number: finalData.phone_number,
                latitude: finalData.latitude,
                longitude: finalData.longitude,
                address: finalData.address,
                social_branches: finalData.social_networks,
                criteria: finalData.criteria,
                details,
            }
            await useBranchesMutation(data)
            const name = localStorage.getItem("nameStore");
            showSuccessToast(name)
            navigate("/")
        } catch (err) {
            setStep(0)
            setInvalid(true)
            if ((err as { statusCode?: number })?.statusCode === 404) {
                return methods.reset()
            }


        }

    }

    const nextStep = () => {
        methods.trigger().then((isValid) => {
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
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });
        setBaseAddress(address);
    }

    return (<div className="min-h-screen flex items-center justify-center p-4  bg-gradient-to-b from-orange-100 to-orange-300 sm:to-orange-200" translate="no">
        <Card className="relative w-full max-w-3xl mx-auto min-h-[50vh] max-h-[90vh]  md:max-h-[85vh] flex flex-col overflow-y-auto border-none shadow-2xl bg-white/90">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
            >
                <CardHeader className="mb-1 text-center" >
                    <TitleForm
                        title={step != 4 ? "Formulario de registro de sucursal" : ""}
                        subtitle={(() => {
                            switch (step) {
                                case 0:
                                    return "Estás a un paso de hacer que tu cafetería crezca y se conecte con más amantes del café como vos. Este formulario nos ayuda a conocer mejor tu sucursal, sus sabores, su esencia y todo eso que la hace única.";
                                case 1:
                                    return "Cuidamos que cada sucursal nueva que se registra en Encafeinados ofrezca toda la experiencia de una cafetería de especialidad, para eso te solicitamos responder las siguientes preguntas:";

                                case 2:
                                    return "Selecciona con el marcador del mapa el lugar exacto donde se encuentra la sucursal para que los coffeelovers te encuentren con exactitud. (Importante: verifica que la ubicación en el mapa corresponde con el lugar de tu sucursal)"
                                default:
                                    return "";
                            }
                        })()}
                        className="px-10"
                    />
                </CardHeader>
                <FormProvider {...methods}>
                    <Suspense fallback={<div className="text-center">Cargando...</div>}>
                        <form className="space-y-9 md:space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent  sm:px-6 ">
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
                                            error={methods.formState.errors}
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

                                        <Button data-testid="next-button" type="button" onClick={nextStep} className={`${step > 0 ? "" : "ml-auto"} bg-amber-600 text-white `}>

                                            Siguiente
                                            <ArrowRight className="ml-2 text-white " />
                                        </Button>

                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={methods.handleSubmit(handleSubmit)}
                                            disabled={!methods.formState.isValid || !methods.getValues("social_networks")?.length || status === "pending"}
                                            className="ml-auto bg-black text-white">{status === "pending" ? "Cargando..." : "Guardar"}</Button>
                                    )}
                                </div>
                            </CardFooter>
                        </form>
                    </Suspense>
                </FormProvider>
            </motion.div>
        </Card>
    </div >
    )
}

