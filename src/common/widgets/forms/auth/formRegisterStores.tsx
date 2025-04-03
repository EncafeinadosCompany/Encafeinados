import toast from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"

import { TitleForm } from "@/common/atoms/auth/titleForm"
import { LinkReturn } from "@/common/molecules/auth/LinkReturn"

import RegisterStoreStep1 from "@/common/molecules/auth/stores/store/registerStoreStep1"
import RegisterStoreStep2 from "@/common/molecules/auth/stores/store/registerStoreStep2"

import { useNavigate } from "react-router-dom"
import { CurrentSchema, RegisterStoreSchema } from "@/common/utils/schemas/auth/registerStoreShema"

import { useImagenMutation } from "@/api/mutations/imageMutations"
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator"
import { useRegisterStoreMutation } from "@/api/mutations/stores/storesMutation"

const FormRegisterStores = () => {
    const [direction, setDirection] = useState(0);
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const useRegiterStore = useRegisterStoreMutation();
    const useImageMutation = useImagenMutation()
    const navigate = useNavigate();
    const methods = useForm<CurrentSchema>({
        resolver: zodResolver(RegisterStoreSchema[step] as any),
        defaultValues: {
            email: "",
            name: "",
            type_document: "",
            number_document: "",
            phone_number: "",

        }
    })

    const onNext = () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                console.log("paso siguiente", direction);
                setFormData(prev => ({ ...prev, ...methods.getValues() }));
                setStep(step + 1);
                setDirection(1);
            }
        });
    };

    const onSubmit = async(data: any) => {
        const finalData = { ...formData, ...data };
        console.log("Formulario enviado:", finalData);
    
        // Inicia la subida de la imagen sin bloquear el formulario
        const imageUploadPromise = useImageMutation.mutateAsync((formData as any).logo)
            .then((response) => response.image.url)
            .catch(() => "https://res.cloudinary.com/dtnnyqa0g/image/upload/v1743628429/images-coffee/Captura%20de%20pantalla%202025-03-20%20184910.png.png");
    
        // Envía el formulario sin esperar la imagen
        try {
            await useRegiterStore.mutateAsync({
                email: finalData.email,
                name: finalData.name,
                type_document: finalData.type_document,
                number_document: finalData.number_document,
                phone_number: finalData.phone_number,
                logo: await imageUploadPromise, // Espera la URL de la imagen aquí
            });
    
            toast.success("Registro exitoso, por favor revisa tu correo electrónico");
            navigate("/login");
    
        } catch (error) {
            console.log("Error al registrar la tienda:", error);
        }
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
                            title="Registra tu cafetería de especialidad"
                            subtitle="Forma parte de nuestra comunidad y da a conocer tu pasión por el café. Conéctate con amantes del buen café y haz crecer tu negocio."
                        />
                    </div>
                    {/* Progress indicator */}
                    <ProgressIndicator step={step} totalSteps={RegisterStoreSchema.length}></ProgressIndicator>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative">

                        <div className="relative" style={{ minHeight: "500px"}}>
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
                                            control={methods.control}
                                            errors={methods.formState.errors}
                                        ></RegisterStoreStep2>

                                    )
                                }
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
                        <div className="relative">
                            <motion.div
                                className="pt-2 m-2 flex justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {step > 0 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" variant="outline" onClick={() => { setStep(step - 1), setDirection(-1) }} className="border-gray-200 bg-amber-50/50">
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
                                            disabled={!methods.formState.isValid}
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

export default FormRegisterStores