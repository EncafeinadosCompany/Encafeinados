import { useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Coffee, Store, BadgeCheck } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"

import RegisterStoreStep1 from "@/common/molecules/auth/stores/register_store_step1.molecule"
import RegisterStoreStep2 from "@/common/molecules/auth/stores/register_store_step2.molecule"

import { useNavigate } from "react-router-dom"
import { useRegisterStoreMutation } from "@/api/mutations/stores/register_stores.mutation"
import { Card, CardContent, CardFooter } from "@/common/ui/card"
import TermConditions  from "./form_term_conditions.widget"
import { CurrentSchema, RegisterStoreSchema } from "@/common/utils/schemas/auth/register_store_shema"
import { uploadImage } from "@/api/mutations/image/image.mutations"
import { RegisterStoreDto } from "@/api/types/stores/stores.type"

const FormRegisterStores = () => {
    const [direction, setDirection] = useState(0);

    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const { mutateAsync: useRegiterStore, status } = useRegisterStoreMutation();
    const navigate = useNavigate();



    // Get current time for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "¡Buenos días";
        if (hour < 18) return "¡Buenas tardes";
        return "¡Buenas noches";
    };

    const methods = useForm<CurrentSchema>({
        resolver: zodResolver(RegisterStoreSchema[step] as any),
        defaultValues: {
            email: "",
            name: "",
            type_document: "NIT",
            number_document: "",
            phone_number: ""
        },
        mode: "onChange"
    })

    const onNext = () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                setFormData(prev => ({ ...prev, ...methods.getValues() }));
                setStep(step + 1);
                setDirection(1);
            }
        });
    };

    const prepareFormData = async (data: RegisterStoreDto): Promise<RegisterStoreDto> => {
        const preparedData = { ...data };
        if (preparedData.logo && preparedData.logo instanceof File) {
            preparedData.logo = await uploadImage(preparedData.logo);
        } else {
            preparedData.logo = "https://res.cloudinary.com/...default-image.png";
        }

        return preparedData;
    };

    const onSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };

        try {
            const preparedData = await prepareFormData(finalData);
            console.log("Final Data to submit:", preparedData);
            const response = await useRegiterStore(preparedData);
            methods.reset();
            navigate(`/stores-registration/branches/${response.store.id}`)
        } catch (error) {
            // Error handling
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="overflow-hidden border-0 rounded-3xl shadow-lg bg-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header with illustration */}
                    <div className="relative bg-gradient-to-r from-orange-50 to-purple-50 p-8 overflow-hidden">
                        {/* Abstract shapes - background decorations */}
                        <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-amber-100 opacity-40 blur-2xl"></div>
                        <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-green-200 opacity-60"></div>
                        <div className="absolute bottom-5 right-20 w-16 h-16 rounded-full bg-rose-100 opacity-50"></div>

                        <div className="relative flex justify-between items-center mb-6">
                            {/* Logo and greeting */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">👋</span>
                                    <h3 className="text-indigo-700 font-medium">
                                        {getGreeting()}!
                                    </h3>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {step === 0 ? "Registra tu cafetería" : "Ya casi terminamos"}
                                </h1>
                                <p className="text-gray-600 mt-2 max-w-md">
                                    {step === 0
                                        ? "Cuéntanos sobre tu cafetería para darla a conocer al mundo"
                                        : "Es importante para nosotros identificar tu café de especialidad"}
                                </p>
                            </div>

                            {/* Header Illustration */}
                            <div className="hidden md:block">
                                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-sm">
                                    {step === 0 ? (
                                        <Store className="w-12 h-12 text-indigo-600" />
                                    ) : (
                                        <Coffee className="w-12 h-12 text-amber-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">Progreso</p>
                                <p className="text-sm text-gray-500">{step + 1}/{RegisterStoreSchema.length}</p>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: `${(step) * (100 / (RegisterStoreSchema.length - 1))}%` }}
                                    animate={{ width: `${(step + 1) * (100 / RegisterStoreSchema.length)}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form content */}
                    <FormProvider {...methods}>
                        <form>
                            <CardContent className="p-2 xl:p-8">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    {step === 0 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100"
                                        >
                                            <RegisterStoreStep1
                                                direction={direction}
                                                register={methods.register}
                                                control={methods.control}
                                                errors={methods.formState.errors}
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
                                            className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100"
                                        >
                                            <RegisterStoreStep2
                                                direction={direction}
                                                register={methods.register}
                                                control={methods.control}
                                                errors={methods.formState.errors}
                                            />
                                            <div className="mt-6">
                                                <TermConditions
                                                    register={methods.register}
                                                    control={methods.control}
                                                    errors={methods.formState.errors}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>

                            <CardFooter className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between w-full">
                                    {step > 0 ? (
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setStep(step - 1);
                                                    setDirection(-1);
                                                }}
                                                className="border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Anterior
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div />
                                    )}

                                    {step < RegisterStoreSchema.length - 1 ? (
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={step === 0 ? "ml-auto" : ""}
                                        >
                                            <Button
                                                type="button"
                                                onClick={onNext}
                                                data-testid="next-button"
                                                className="rounded-xl px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-300 hover:from-orange-600 hover:to-orange-500 text-white"
                                            >
                                                Siguiente
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Button
                                                type="button"

                                                onClick={methods.handleSubmit(onSubmit)}
                                                disabled={!methods.formState.isValid || status === "pending"}
                                                data-testid="submit-button"
                                                className={`rounded-xl px-6 py-2 ${!methods.formState.isValid
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                                    }`}
                                            >
                                                {status === "pending" ? (
                                                    <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Procesando...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <BadgeCheck className="w-4 h-4 mr-2" />
                                                        Completar registro
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </CardFooter>
                        </form>
                    </FormProvider>
                </motion.div>
            </Card>

            {/* Floating decoration */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-100/30 blur-3xl -z-10"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 rounded-full bg-amber-100/30 blur-3xl -z-10"></div>
        </div>
    )
}

export default FormRegisterStores