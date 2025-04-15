import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import { FormProvider, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@/common/ui/icons";
import { motion, AnimatePresence } from "framer-motion";

import { useRegisterCoffeloverMutation } from "@/api/mutations/coffelover/coffeloverMutation";
import { registerCoffeeloverSchema, CurrentCoffeeLoverSchema } from "@/common/utils/schemas/auth/registerCoffeeloverSchema";
import { TitleForm } from "@/common/atoms/auth/titleForm";
import { registerWithGoogle } from "@/api/firebase";


import RegisterCoffeloverStep2 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep2";
import RegisterCoffeloverStep3 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep3";
import RegisterCoffeloverStep1 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep1";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";
import { RegisterCoffelover } from "@/api";
import { ButtonGoogle } from "@/common/atoms/buttonGoogle";
import { TermConditions } from "./termConditions";

const FormRegisterCoffeelover = () => {
    const [step, setStep] = useState(0);
    const [showInfo, setShowInfo] = useState(false)
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({});
    const useRegisterCoffeelover = useRegisterCoffeloverMutation()
    const navigate = useNavigate();


    const methods = useForm<CurrentCoffeeLoverSchema>({
        resolver: zodResolver(registerCoffeeloverSchema[step] as any),
        defaultValues: {
            name: "",
            lastname: "",
            type_document: "",
            number_document: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange"
    });


    const toggleInfo = () => {
        setShowInfo(!showInfo)
        if (!showInfo) {
            setTimeout(() => {
                setShowInfo(false)
            }, 5000)
        }
    }

    const onNext = async () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                setFormData(prev => ({ ...prev, ...methods.getValues() }));
                setStep(step + 1);
                setDirection(1);
            }
        });
    };


    const prevStep = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(step - 1);
        }
    }

    const onSubmit = async(data: any) => {

        const finalData = { ...formData, ...data };
        const dataCoffeelover = {
            personData: {
                full_name: `${finalData.name} ${finalData.lastname}`,
                type_document: finalData.type_document,
                number_document: (finalData.number_document),
                phone_number: finalData.phone_number,
            },
            userData: {
                email: finalData.email,
                password: finalData.password,
            }
        };

        try {
            await useRegisterCoffeelover.mutateAsync(dataCoffeelover)
        } catch (error) {
            console.log(error);
        }finally{
            toast.remove();
            toast.success("Coffelover creado exitosamente.¡Bienvenido!")       
        }
    };


    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            const { user, token, isNewUser } = await registerWithGoogle();

            const userData: RegisterCoffelover = {
                userData: {
                    id_google: user.
                        providerData[0]?.uid,
                    email: user.email || "",
                },
                personData: {
                    full_name: user.displayName || "",
                    type_document: "",  // Datos vacíos
                    number_document: "",
                    phone_number: "",
                },
            };

            // Verificar si hay datos incompletos
            const datosIncompletos = !userData.personData.type_document || !userData.personData.number_document || !userData.personData.phone_number;

            setIsLoading(false);
            if (isNewUser || datosIncompletos) {
                sessionStorage.setItem("tempUserData", JSON.stringify(userData));
                navigate("/completar-perfil");
            }

        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center rounded-md max-w-3xl overflow-x-hidden mx-auto h-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent relative p-4 sm:p-6 border-none shadow-2xl bg-white/90">
            <motion.div
                className="max-w-2xl w-full"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="mt-8 mb-2">
                        <TitleForm
                            title="Inicia esta nueva aventura como CoffeeLover"
                            subtitle="Descubre las mejores cafeterías de especialidad y los mejores planes para los amantes del café"
                        >
                        </TitleForm>
                    </div>
                    {/* Progress indicator */}
                    <ProgressIndicator className="md:mx-40" step={step + 1} totalSteps={registerCoffeeloverSchema.length}></ProgressIndicator>
                </div>

                <FormProvider {...methods}>
                    <form className="space-y-2 relative overflow-hidden" onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="relative" >
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <RegisterCoffeloverStep1
                                        register={methods.register}
                                        errors={methods.formState.errors}
                                        direction={direction}
                                    />
                                )}
                                {step === 1 && (
                                    <RegisterCoffeloverStep2
                                        showInfo={showInfo}
                                        toggleInfo={toggleInfo}
                                        register={methods.register}
                                        direction={direction}
                                        errors={methods.formState.errors}
                                        control={methods.control}
                                    />

                                )}

                                {step === 2 && (
                                    <RegisterCoffeloverStep3
                                        register={methods.register as UseFormRegister<any>}
                                        errors={methods.formState.errors}
                                        direction={direction}
                                    />
                                )}
                                {
                                    step === 3 && (
                                       <div className="flex flex-col justify-center items-center h-[20vh]">
                                         <TermConditions
                                                register={methods.register}
                                                control={methods.control}
                                                errors={methods.formState.errors}>
                                        </TermConditions>
                                       </div>
                                    )
                                }
                            </AnimatePresence>
                        </div>

                        {/* Navigation buttons */}
                        {
                            step === 0 && (

                                <div className="mt-2 space-y-6">
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-900"></div>
                                        </div>
                                        <div className="relative px-4 text-sm  bg-white text-gray-500 font-medium">
                                            Opciones de registro
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={step === 0 ? 'w-full flex px-8' : ''}
                                    >

                                        <ButtonGoogle
                                            variant="outline"
                                            onClick={handleGoogleSignIn}
                                            disabled={isLoading}
                                            className=" w-full"
                                        >
                                            <span className="flex items-center">
                                                Continuar con Google
                                            </span>
                                        </ButtonGoogle>

                                    </motion.div>
                                </div>

                            )
                        }
                        <motion.div
                            className=" m-5 flex justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {step > 0 ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="button" variant="outline" onClick={prevStep} className="border-gray-200 ">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </Button>
                                </motion.div>
                            ) : (
                                <div></div>
                            )}
                            {step < registerCoffeeloverSchema.length - 1 ? (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={step === 0 ? 'w-full flex p-4' : ''}
                                >
                                    <Button
                                        type="button"
                                        className={`bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white ${step === 0 ? 'w-full' : 'bg-amber-600 hover:bg-amber-500'}`}
                                        // disabled={!methods.formState.isValid} 
                                        data-testid="next-button"
                                        onClick={onNext} >
                                        {step === 0 ? "Continuar registro manual" : "Siguiente"}
                                        {/* {isLoading ? "Cargando..." : "Siguiente"} */}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div>
                                    <Button
                                        type="submit"
                                        data-testid="submit-button"
                                        disabled={!methods.formState.isValid}
                                        className={`rounded-lg px-6 py-2 ${!methods.formState.isValid ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white"}`}>
                                        Complete Registration
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </form>
                </FormProvider>
            </motion.div>
        </div>

    )
}

export default FormRegisterCoffeelover