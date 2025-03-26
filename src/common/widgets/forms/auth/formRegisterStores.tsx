import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator"
import ProgressIndicator1 from "@/common/atoms/auth/ProgressIndicator1"
import { TitleForm } from "@/common/atoms/auth/titleForm"
import { LinkReturn } from "@/common/molecules/auth/LinkReturn"
import RegisterStoreStep1 from "@/common/molecules/auth/stores/registerStoreStep1"
import RegisterStoreStep2 from "@/common/molecules/auth/stores/registerStoreStep2"
import { Button } from "@/common/ui/button"
import { RegisterStoreSchema } from "@/common/utils/schemas/auth/registerStoreSchema"
import { RegisterStoreSchemaType } from "@/common/utils/schemas/auth/types/registerShemaType"
import { zodResolver } from "@hookform/resolvers/zod"
import { error } from "console"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"


const FormRegisterStores = () => {
    const [direction, setDirection] = useState(0);

    const [step, setStep] = useState(0)
    const methods = useForm({
        resolver: zodResolver(RegisterStoreSchema[step] as any),
        defaultValues: {
            name: "",
            email: "",
            type_document_id: 0,
            number_document: "",
            phone_number: "",
        }
    })

    const onNext = () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                setStep(step + 1)
                console.log("paso siguiente", direction)
                setDirection(1)
            };
        });

    };

    const onSubmit = (data: any) => {
        console.log("Formulario enviado:", data);
    };

    return (
        <div >
            <LinkReturn link="/register" >
            </LinkReturn>
            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="mt-8 mb-2">
                        <TitleForm
                            title="Conviértete en un verdadero Coffelover"
                            subtitle=" Descubre un mundo de aromas y sabores. Únete a la comunidad donde el café es más que una bebida, es una pasión."
                        >
                        </TitleForm>
                    </div>
                    {/* Progress indicator */}
                    <ProgressIndicator1 step={step} totalSteps={RegisterStoreSchema.length}></ProgressIndicator1>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative overflow-hidden">

                        <div className="relative" style={{ minHeight: "500px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">

                                {step === 0 && (
                                    <RegisterStoreStep1
                                        direction={direction}
                                        register={methods.register} 
                                        control={methods.control}
                                        errors={methods.formState.errors}>
                                    </RegisterStoreStep1>
                                )}
                                {
                                    step === 1 && (
                                       <RegisterStoreStep2
                                       direction={direction}
                                       register={methods.register}
                                       errors={methods.formState.errors}
                                       control={methods.control}
                                       >
                                       </RegisterStoreStep2>
                                    )
                                }
                                {
                                    step === 3 && (
                                        <div>
                                            <label>
                                                Nombre
                                                <input type="text" {...methods.register("name")} />
                                            </label>
                                            <label>
                                                Email
                                                <input type="email" {...methods.register("email")} />
                                            </label>
                                        </div>
                                    )
                                }
                            </AnimatePresence>
                        </div>




                        <div>
                            <motion.div
                                className="pt-2 m-2 flex justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {step > 0 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" variant="outline" onClick={() => {setStep(step - 1), setDirection(-1)}} className="border-gray-200 bg-amber-50/50">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div></div>
                                )}
                                {step < RegisterStoreSchema.length - 1 ? (
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
                                            disabled={!!methods.formState.errors.email}
                                            className={`rounded-lg px-6 py-2 ${methods.formState.errors.email ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white"
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

export default FormRegisterStores