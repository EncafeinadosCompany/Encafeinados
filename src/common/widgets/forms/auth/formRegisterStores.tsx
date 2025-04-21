import toast from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { TitleForm } from "@/common/atoms/auth/titleForm"

import RegisterStoreStep1 from "@/common/molecules/auth/stores/store/registerStoreStep1"
import RegisterStoreStep2 from "@/common/molecules/auth/stores/store/registerStoreStep2"

import { useNavigate } from "react-router-dom"

import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator"
import { useRegisterStoreMutation } from "@/api/mutations/stores/storesMutation"
import { Card, CardContent, CardFooter, CardHeader } from "@/common/ui/card"
import { TermConditions } from "./termConditions"
import { CurrentSchema, RegisterStoreSchema } from "@/common/utils/schemas/auth/registerStoreShema"


const FormRegisterStores = () => {
    const [direction, setDirection] = useState(0);
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const useRegiterStore = useRegisterStoreMutation();
    const navigate = useNavigate();

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

    const onSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };

        
            await useRegiterStore.mutateAsync(finalData).then((response) => {
              
                methods.reset();
                navigate(`/stores-registration/branches/${response.store.id}`)
            })
              
            .finally(() => {   
               
            setStep(0); 
            })
        
    };

    return (
        <Card className="w-full max-w-3xl overflow-x-hidden mx-auto h-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent relative p-4 sm:p-6 border-none shadow-2xl bg-white/90">
            <FormProvider {...methods}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardHeader className="flex flex-col">
                        <TitleForm
                            title="¡Regístrate y déjanos contarle al mundo lo especial que es tu café!"
                            subtitle={(() => {
                                switch (step) {
                                    case 0:
                                        return "¡Regístrate y déjanos contarle al mundo lo especial que es tu café!";
                                    case 1:
                                        return ""
                                    default:
                                        return "";
                                }
                            })()}
                        />
                        <div className="mt-2 ml-8 sm:ml-20  md:ml-48 grid grid-cols-1  justify-between">
                            <ProgressIndicator step={step + 1} totalSteps={RegisterStoreSchema.length} />
                        </div>

                    </CardHeader>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
                        <CardContent className="grid gap-4 min-h-[310px]">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <RegisterStoreStep1
                                        direction={direction}
                                        register={methods.register}
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    />
                                )}

                                {step === 1 && (
                                    <>
                                        <RegisterStoreStep2
                                            direction={direction}
                                            register={methods.register}
                                            control={methods.control}
                                            errors={methods.formState.errors}
                                        />
                                        <div className="mt-4 text-center">
                                            <TermConditions
                                                register={methods.register}
                                                control={methods.control}
                                                errors={methods.formState.errors}

                                            >
                                            </TermConditions>
                                        </div>
                                    </>
                                )}
                            </AnimatePresence>

                        </CardContent>
                        <CardFooter>
                            <div className=" self-end flex justify-between w-full flex-wrap gap-2">
                                {step > 0 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={() => {
                                                setStep(step - 1);
                                                setDirection(-1);
                                            }}
                                            className="border-gray-200 bg-amber-50/50"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Anterior
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div />
                                )}

                                {step < RegisterStoreSchema.length - 1 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            type="button"
                                            onClick={onNext}
                                            data-testid="next-button"
                                            className="bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white"
                                        >
                                            Siguiente
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div>
                                        <Button
                                            type="submit"
                                            disabled={!methods.formState.isValid}
                                            data-testid="submit-button"
                                            className={`rounded-lg px-6 py-2 ${!methods.formState.isValid
                                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                                }`}
                                        >
                                            Listo
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </motion.div>
            </FormProvider>
        </Card>


    )
}

export default FormRegisterStores