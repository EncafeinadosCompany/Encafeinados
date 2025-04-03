import { TitleForm } from "@/common/atoms/auth/titleForm";
import { FinistAdminStore } from "@/common/molecules/auth/stores/admin/finistAdminStore1"
import { Button } from "@/common/ui/button"
import { Card } from "@/common/ui/card"
import { CurrentAdminSchema, RegisterAdminStoreSchema } from "@/common/utils/schemas/auth/registerAdminStoreSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FinistAdminStore2 } from "@/common/molecules/auth/stores/admin/finishAdminStore2";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";

export const FormFinishRegisteAdmin = ({ref}:any) => {

    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({})

    const [step, setStep] = useState(0)
    const methods = useForm<CurrentAdminSchema>({
        resolver: zodResolver(RegisterAdminStoreSchema[step] as any),
        defaultValues: {
            name: "",
            email: "",
            type_document: "",
            number_document: "",
            phone_number: ""
        },
        mode: "onChange"
    })

    const onNext = () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                setStep(step + 1)
                setDirection(1)
                setFormData({ ...formData, ...methods.getValues()})
            };
        });

    };

    const onSubmit = (data: any) => {
        console.log("Formulario enviado:", formData, ref);
    };

    return (
        <Card className="border-none bg-white/80 p-10 shadow-2xl">

            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col justify-center items-center">
                    <div className="mt-8 mb-2 text-center ">
                        <TitleForm
                            title="¡Finalicemos tu registro!"
                            subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
                        >
                        </TitleForm>
                    </div>
                    {/* Progress indicator */}
                    <ProgressIndicator className="space-x-5" step={step} totalSteps={RegisterAdminStoreSchema.length}></ProgressIndicator>
                    
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-3 relative overflow-hidden">
                        <div className="relative" style={{ minHeight: "250px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <FinistAdminStore
                                        direction={direction}
                                        register={methods.register}
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    ></FinistAdminStore>
                                )},
                                {
                                    step === 1 && (
                                        <FinistAdminStore2
                                            register={methods.register}
                                            control={methods.control}
                                            errors={methods.formState.errors}
                                        ></FinistAdminStore2>
                                    )},

                                {
                                    step === 2 && (
                                        <>
                                        <p>Condiciones</p>
                                        <div>
                                            <p>
                                                Política de privacidad
                                                <br />
                                                Términos y condiciones
                                            </p>
                                        </div>
                                        <input type="checkbox" {...methods.register("conditions")} />
                                        {step === 2 && "conditions" in methods.formState.errors && (
                                            <p className=" text-red-500">{methods.formState.errors.conditions?.message}</p>
                                        )}

                                    </>
                                    )
                                }
                            </AnimatePresence>
                        </div>
                        <div className="text-center mt-10">
                            <motion.div
                                className="space-x-3 flex justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {step > 0 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" variant="outline" onClick={() => { setStep(step - 1), setDirection(-1) }} className="border-gray-200 bg-gray-400/50">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div></div>
                                )}
                                {step < RegisterAdminStoreSchema.length - 1 ? (
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
                                            disabled={!methods.formState.isValid}
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
        </Card >
    )
}