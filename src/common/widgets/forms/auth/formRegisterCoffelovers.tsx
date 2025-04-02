import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/common/ui/button";

import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@/common/ui/icons";
import { motion, AnimatePresence } from "framer-motion";

import { RegisterCoffelover, useRegisterCoffeloverMutation } from "@/api";
import registerCoffeeloverSchema from "@/common/utils/schemas/auth/registerCoffeeloverSchema";
import { TitleForm } from "@/common/atoms/auth/titleForm";
import { pageVariants } from "@/common/atoms/auth/pageVariants";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";
import { registerWithGoogle} from "@/api/firebase";
import { LinkReturn } from "@/common/molecules/auth/LinkReturn";

import RegisterCoffeloverStep2 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep2";
import RegisterCoffeloverStep3 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep3";
import RegisterCoffeloverStep1 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep1";
import { useAuth } from "@/common/molecules/hooks/useAuth";



const FormRegisterCoffeelover = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [showInfo, setShowInfo] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const navigate = useNavigate();

    // const { user, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const totalSteps = 3


    const toggleInfo = () => {
        setShowInfo(!showInfo)

        if (!showInfo) {
            setTimeout(() => {
                setShowInfo(false)
            }, 5000)
        }
    }
    const { control, register, handleSubmit, trigger, getValues, formState: { errors }, reset } = useForm({
        resolver: zodResolver(registerCoffeeloverSchema),
        defaultValues: {
            personData: {
                name: "",
                lastname: "",
                type_document: "",
                number_document: "",
                phone_number: ""
            },
            userData: {
                email: "",
                password: "",
                confirmPassword: "",
                role_id: 3,
            }
        }
    });

    const useRegisterCoffeelover = useRegisterCoffeloverMutation()

    const nextStepValidated = async () => {
        let fieldsToValidate: string[] = [];

        if (step === 1) {
            fieldsToValidate = ["personData.name", "personData.lastname", "userData.email"];
        } else if (step === 2) {
            fieldsToValidate = ["personData.type_document_id", "personData.number_document", "personData.phone_number"];
        } else if (step === 3) {
            fieldsToValidate = ["userData.password", "userData.confirmPassword"];
            const { password, confirmPassword } = getValues("userData"); // Obtener valores

            if (password !== confirmPassword) {
                toast.error("Las contraseñas no coinciden");
                return;
            }
        }

        const isValid = await trigger(fieldsToValidate as any);

        if (isValid) {
            setDirection(1);
            setStep((prev) => prev + 1);
        }
    };


    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
        }
    }

    const onSubmit = (data: any) => {

        console.log(data);

        const dataCoffeelover: RegisterCoffelover = {
            personData: {
                full_name: `${data.personData.name} ${data.personData.lastname}`,
                type_document: data.personData.type_document,
                number_document: (data.personData.number_document),
                phone_number: data.personData.phone_number,
            },
            userData: {
                email: data.userData.email,
                password: data.userData.password,
                role_id: Number(data.userData.role_id)
            }
        };

        try {
            useRegisterCoffeelover.mutateAsync(dataCoffeelover)
                .then((response) => {
                    toast.success("Coffelover creado exitosamente.¡Bienvenido!");
                    navigate("/login");
                })
        } catch (error) {
            console.log(error);
        }
    };


    const handleGoogleSignIn = async () => {

        try {
            setIsLoading(true)
            const user = await registerWithGoogle().then((userCredential) => {
                const user = userCredential.user.providerData;
                const userData: RegisterCoffelover = {
                    userData: {
                        id_google: user[0].uid,
                        email: user[0].email || "",
                        password: "",
                        role_id: 3
                    },
                    personData: {
                        full_name: user[0].displayName || "",
                        type_document: 1,
                        number_document: user[0].uid,
                        phone_number: user[0].uid
                    }
                }


                useRegisterCoffeelover.mutateAsync(userData).then((response) => {
                    toast.success("Coffelover creado exitosamente.¡Bienvenido!");
                }).catch((error) => {
                    setIsLoading(false)
                })
                console.log("Usuario creado:", userData);
                console.log("Usuario logueado:", user);
                return user
            });
        } catch (error) {
            console.error("Error en el login:", error);

            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }

    return (
        <div className="min-h-screen  bg-gradient-to-b from-orange-50 to-orange-200" translate="no">
            <LinkReturn link="/register" className="m-2 xl:m-10" >
            </LinkReturn>

            <div className="flex flex-col items-center justify-center p-4">
                <motion.div
                    className="max-w-2xl w-full"
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
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
                        <ProgressIndicator step={step} totalSteps={totalSteps}></ProgressIndicator>
                    </div>

                    <form className="space-y-4 relative overflow-hidden" onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                    }}>
                        {/* Animated form steps */}
                        <div className="relative" style={{ minHeight: "300px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        custom={direction}
                                        variants={pageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute w-full"
                                        style={{ perspective: "1000px" }}
                                    >
                                        <RegisterCoffeloverStep1
                                            onGoogleSignIn={handleGoogleSignIn}
                                            isLoading={isLoading}
                                            register={register as UseFormRegister<any>}
                                            errors={errors}
                                        />
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        custom={direction}
                                        variants={pageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute w-full"
                                        style={{ perspective: "1000px" }}
                                    >
                                        <RegisterCoffeloverStep2
                                            showInfo={showInfo}
                                            toggleInfo={toggleInfo}
                                            register={register as UseFormRegister<any>}
                                            errors={errors}
                                            control={control}
                                        />
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        custom={direction}
                                        variants={pageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute w-full"
                                        style={{ perspective: "1000px" }}
                                    >
                                        <RegisterCoffeloverStep3
                                            register={register as UseFormRegister<any>}
                                            errors={errors}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation buttons */}
                        <motion.div
                            className="pt-2 m-2 flex justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {step > 1 ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="button" variant="outline" onClick={prevStep} className="border-gray-200 bg-amber-50/50">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                </motion.div>
                            ) : (
                                <div></div>
                            )}

                            {step <= totalSteps ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="button" data-testid="next-button" onClick={nextStepValidated} className="bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white">
                                        {isLoading ? "Cargando..." : "Siguiente"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div whileHover={passwordsMatch ? { scale: 1.05 } : {}} whileTap={passwordsMatch ? { scale: 0.95 } : {}}>
                                    <Button
                                        type="submit"
                                        data-testid="submit-button"
                                        disabled={!!errors.userData?.confirmPassword}
                                        className={`rounded-lg px-6 py-2 ${errors.userData?.confirmPassword ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white"
                                            }`}
                                    >
                                        Complete Registration
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default FormRegisterCoffeelover