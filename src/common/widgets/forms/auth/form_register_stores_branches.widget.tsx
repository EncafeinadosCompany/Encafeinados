"use client"
import { useEffect, useState } from "react"
import { Suspense, lazy } from "react"
import { ArrowLeft, ArrowRight, Coffee, MapPin, BadgeCheck } from "@/common/ui/icons"
import { useNavigate, useParams } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"

import toast from "react-hot-toast"

import { Button } from "@/common/ui/button"
import { validateImageRequirements } from "@/common/hooks/criteria/use_criteria.hook"
import { Card, CardContent, CardFooter} from "@/common/ui/card"
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
    const [direction, setDirection] = useState(0);
    const { storeId } = useParams();
    const [formData, setFormData] = useState({})
    const [baseAddress, setBaseAddress] = useState("");

    const navigate = useNavigate();
    const { data: socialNetworks } = useSocialNetworksQuery();
    const { data: criteria } = useCriteria();
    const [invalid, setInvalid] = useState(false)
    const { mutateAsync: useBranchesMutation, status } = useRegisterBrandMutation();

    // Get current time for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "¡Buenos días";
        if (hour < 18) return "¡Buenas tardes";
        return "¡Buenas noches";
    };

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
                social_branches: finalData.social_networks || [], // Make sure this handles empty social networks
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
                setStep((prev) => prev + 1);
                setDirection(1);
            }
        })
    }

    const prevStep = () => {
        setStep((prev) => prev - 1);
        setDirection(-1);
    }

    const onLocationSelect = (lat: number, lng: number, address: string) => {
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });
        setBaseAddress(address);
    }

    // Calculate which icon to show based on current step
    const getStepIcon = () => {
        switch(step) {
            case 0:
            case 1:
                return <Coffee className="w-12 h-12 text-amber-600" />;
            case 2:
                return <MapPin className="w-12 h-12 text-orange-600" />;
            default:
                return <BadgeCheck className="w-12 h-12 text-emerald-600" />;
        }
    };
 const isMapStep = step === 2;

    return (
        <div className="h-full overflow-hidden w-full flex items-center justify-center p-2 sm:p-6 bg-gradient-to-b from-orange-100 to-orange-200">
            <div className="w-full max-w-5xl mx-auto relative">
                <Card className={`overflow-hidden border-0 rounded-2xl  sm:rounded-3xl shadow-lg bg-white ${isMapStep ? 'h-[90vh] md:h-[80vh]' : ''}`}>
                    <FormProvider {...methods}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`${isMapStep ? 'flex flex-col h-full' : ''}`}
                        >
                            {/* Encabezado más compacto */}
                            <div className={`relative bg-gradient-to-r from-orange-50 to-amber-50 p-3 md:p-4 lg:p-5 overflow-hidden ${isMapStep ? 'flex-shrink-0' : ''}`}>
                                {/* Decoraciones de fondo (más pequeñas) */}
                                <div className="absolute -top-10 right-10 w-20 h-20 rounded-full bg-amber-100 opacity-40 blur-2xl hidden sm:block"></div>
                                <div className="absolute bottom-3 right-10 w-8 h-8 rounded-full bg-rose-100 opacity-50 hidden sm:block"></div>
                                
                                <div className="relative flex flex-row justify-between items-center gap-4">
                                    {/* Contenido del encabezado (más compacto en desktop) */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                            <span className="text-lg md:text-xl">👋</span>
                                            <h3 className="text-amber-700 font-medium text-sm md:text-base">
                                                {getGreeting()}!
                                            </h3>
                                        </div>
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                            {(() => {
                                                switch(step) {
                                                    case 0: return "Registra tu sucursal";
                                                    case 1: return "Cuéntanos sobre tu café";
                                                    case 2: return "Ubica tu sucursal";
                                                    case 3: return "Detalles de dirección";
                                                    case 4: return "Redes sociales";
                                                    default: return "Registro de sucursal";
                                                }
                                            })()}
                                        </h1>
                                        <p className="text-xs md:text-sm text-gray-600 mt-0.5 max-w-md">
                                            {(() => {
                                                switch (step) {
                                                    case 0:
                                                        return "Haz que tu cafetería crezca y se conecte con más amantes del café";
                                                    case 1:
                                                        return "Cuéntanos qué hace especial a tu café de especialidad";
                                                    case 2:
                                                        return "Ayuda a los coffeelovers a encontrarte fácilmente";
                                                    case 3:
                                                        return "Proporciona detalles adicionales sobre la ubicación";
                                                    case 4:
                                                        return "Comparte tus redes sociales para mayor visibilidad";
                                                    default:
                                                        return "";
                                                }
                                            })()}
                                        </p>
                                    </div>
                                    
                                    {/* Ilustración más pequeña */}
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl shadow-sm">
                                            {getStepIcon()}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Indicador de progreso más compacto */}
                                <div className="mt-2 md:mt-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-medium text-gray-700">Progreso</p>
                                        <p className="text-xs text-gray-500">{step + 1}/{RegisterStoreBrancheSchema.length}</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: `${(step) * (100 / (RegisterStoreBrancheSchema.length - 1))}%` }}
                                            animate={{ width: `${(step + 1) * (100 / RegisterStoreBrancheSchema.length)}%` }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contenido del formulario con altura adaptativa */}
                            <div 
                                className={`
                                    ${isMapStep 
                                        ? 'flex-grow flex flex-col' 
                                        : 'max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh]'
                                    }
                                    overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent
                                `}
                            >
                                <form className={`${isMapStep ? 'flex flex-col flex-grow' : ''}`}>
                                    <CardContent className={`p-3 sm:p-4 md:p-5 ${isMapStep ? 'flex-grow' : ''}`}>
                                        <AnimatePresence initial={false} custom={direction} mode="wait">
                                            <Suspense fallback={
                                                <div className="flex justify-center items-center py-10">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                                                </div>
                                            }>
                                                {step === 0 && (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="p-3 sm:p-4 bg-orange-50/40 rounded-xl sm:rounded-2xl border border-orange-100"
                                                    >
                                                        <RegisterStoreBrancheStep1
                                                            register={methods.register}
                                                            error={methods.formState.errors}
                                                            control={methods.control}
                                                        />
                                                    </motion.div>
                                                )}

                                                {step === 1 && (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="p-3 sm:p-4 bg-amber-50/40 rounded-xl sm:rounded-2xl border border-amber-100"
                                                    >
                                                        <RegisterStoreBrancheStep2
                                                            methods={methods}
                                                            criteria={criteria || []}
                                                        />
                                                    </motion.div>
                                                )}

                                                {step === 2 && (
                                                    <motion.div
                                                        key="step3"
                                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="rounded-xl sm:rounded-2xl overflow-hidden border border-blue-100 shadow-inner h-full flex-grow min-h-[400px]"
                                                    >
                                                        <MapSearch
                                                            initialAddress={baseAddress}
                                                            initialLat={methods.watch("latitude")}
                                                            initialLng={methods.watch("longitude")}
                                                            onLocationSelect={onLocationSelect}
                                                        />
                                                    </motion.div>
                                                )}

                                                {step === 3 && (
                                                    <motion.div
                                                        key="step4"
                                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="p-3 sm:p-4 bg-green-50/40 rounded-xl sm:rounded-2xl border border-green-100"
                                                    >
                                                        <RegisterStoreBrancheStep3
                                                            baseAddress={baseAddress}
                                                            errors={methods.formState.errors}
                                                            register={methods.register}
                                                        />
                                                    </motion.div>
                                                )}

                                                {step === 4 && (
                                                    <motion.div
                                                        key="step5"
                                                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="p-3 sm:p-4 bg-purple-50/40 rounded-xl sm:rounded-2xl border border-purple-100"
                                                    >
                                                        <SocialNetworksForm
                                                            register={methods.register}
                                                            control={methods.control}
                                                            error={methods.formState.errors}
                                                            availableSocialNetworks={socialNetworks}
                                                        />
                                                    </motion.div>
                                                )}
                                            </Suspense>
                                        </AnimatePresence>
                                    </CardContent>

                                    {/* Footer con botones responsivos */}
                                    <CardFooter className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100 bg-gray-50">
                                        <div className="flex justify-between w-full">
                                            {step > 0 ? (
                                                <motion.div 
                                                    whileHover={{ scale: 1.03 }} 
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={prevStep}
                                                        className="text-xs sm:text-sm border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                                                    >
                                                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                        Anterior
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <div />
                                            )}

                                            {step < RegisterStoreBrancheSchema.length - 1 ? (
                                                <motion.div 
                                                    whileHover={{ scale: 1.03 }} 
                                                    whileTap={{ scale: 0.97 }}
                                                    className={step === 0 ? "ml-auto" : ""}
                                                >
                                                    <Button
                                                        type="button"
                                                        onClick={nextStep}
                                                        data-testid="next-button"
                                                        className="text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white"
                                                    >
                                                        Siguiente
                                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                                                    </Button>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    whileHover={{ scale: 1.03 }} 
                                                    whileTap={{ scale: 0.97 }}
                                                    className="ml-auto"
                                                >
                                                    <Button
                                                        type="button"
                                                        onClick={methods.handleSubmit(handleSubmit)}
                                                        disabled={
                                                            !methods.formState.isValid || 
                                                            status === "pending"
                                                        }
                                                        className={`text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 ${
                                                            !methods.formState.isValid 
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                                        }`}
                                                    >
                                                        {status === "pending" ? (
                                                            <div className="flex items-center">
                                                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Procesando...
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                                Guardar sucursal
                                                            </>
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardFooter>
                                </form>
                            </div>
                        </motion.div>
                    </FormProvider>
                </Card>
                
                {/* Elementos decorativos (solo visibles en pantallas medianas y grandes) */}
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange-100/30 blur-3xl -z-10 hidden md:block"></div>
                <div className="absolute top-40 -right-20 w-60 h-60 rounded-full bg-amber-100/30 blur-3xl -z-10 hidden md:block"></div>
            </div>
        </div>
    )
}