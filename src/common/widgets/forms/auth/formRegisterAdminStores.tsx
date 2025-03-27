import { useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { TitleForm } from "@/common/atoms/auth/titleForm"

import { RegisterAdminStoreSchema } from "@/common/utils/schemas/auth/registerAdminStoreSchema"
import RegisterAdminStoreStep1 from "@/common/molecules/auth/stores/admin/registerAdminStoreStep1"
import RegisterAdminStoreStep2 from "@/common/molecules/auth/stores/admin/registerAdminStoreStep2"
import { LinkReturn } from "@/common/molecules/auth/linkReturn"
import ProgressIndicator1 from "@/common/atoms/auth/ProgressIndicator1"


const FormRegisterAdminStores = () => {
    const [direction, setDirection] = useState(0);

    const [step, setStep] = useState(0)
    const methods = useForm({
        resolver: zodResolver(RegisterAdminStoreSchema[step] as any),
        defaultValues: {
            name: "",
            email: "",
            type_document: "",
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
                    <ProgressIndicator1 step={step} totalSteps={RegisterAdminStoreSchema.length}></ProgressIndicator1>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative overflow-hidden">

                        <div className="relative" style={{ minHeight: "500px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">

                                {step === 0 && (
                                    <RegisterAdminStoreStep1
                                        direction={direction}
                                        register={methods.register} 
                                        control={methods.control}
                                        errors={methods.formState.errors}>
                                    </RegisterAdminStoreStep1>
                                )}
                                {
                                    step === 1 && (
                                       <RegisterAdminStoreStep2
                                       direction={direction}
                                       register={methods.register}
                                       errors={methods.formState.errors}
                                       control={methods.control}
                                       >
                                       </RegisterAdminStoreStep2>
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

export default FormRegisterAdminStores