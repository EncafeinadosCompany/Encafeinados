import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerCoffeeloverSchema from "@/common/utils/registerCoffeeloverSchema";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/common/ui/button";
import RegisterCoffeloverStep1 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep1";
import { RegisterCoffelover, useRegisterCoffeloverMutation } from "@/api";
import RegisterCoffeloverStep2 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep2";
import RegisterCoffeloverStep3 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep3";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const FormRegisterCoffeelover = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [showInfo, setShowInfo] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [isLastStepSubmitted, setIsLastStepSubmitted] = useState(false);
    const navegate = useNavigate();
    const totalSteps = 3

    // Page variants for animations
    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            rotateY: direction > 0 ? 45 : -45,
        }),
        center: {
            x: 0,
            opacity: 1,
            rotateY: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.4 }
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            rotateY: direction < 0 ? 45 : -45,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.4 }
            }
        })
    };

    const toggleInfo = () => {
        setShowInfo(!showInfo)

        // Auto-hide after 5 seconds if showing
        if (!showInfo) {
            setTimeout(() => {
                setShowInfo(false)
            }, 5000)
        }
    }

    // ... existing code ...

    const { control, register, handleSubmit, trigger, formState: { errors }, reset } = useForm({
        resolver: zodResolver(registerCoffeeloverSchema),
        defaultValues: {
            personData: {
                name: "Valentina",
                lastname: "Perez",
                type_document_id: 0,
                number_document: ""
            },
            userData: {
                email: " ",
                password: ""
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
            fieldsToValidate = ["userData.password"]; 
            setIsLastStepSubmitted(false);
        }
    
        const isValid = await trigger(fieldsToValidate as any);
    
        if (isValid) {
            setDirection(1); // Moving forward
            setStep((prev) => prev + 1);
        }
    };
    

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1); // Moving backward
            setStep(step - 1);
        }
    }

    // ... existing onSubmit function ...

    const onSubmit = (data: any) => {
        if (!isLastStepSubmitted) return;
    
        console.log(data);
    
        const dataCoffeelover: RegisterCoffelover = {
            personData: {
                full_name: `${data.personData.name} ${data.personData.lastname}`,
                type_document_id: Number(data.personData.type_document_id),
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
                 navegate("/login");
            })
            .catch((error) => {
                console.error("Error al crear el Coffelover:", error);
                toast.error("Error al crear el Coffelover. Por favor, inténtalo de nuevo."); 
            })
            .finally(() => {
               
                setTimeout(() => {
                    reset();
                   
                }, 1000);
            });
    
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-200 to-orange-200" translate="no">
            <div className="fixed top-12 left-10 sm:left-20">
                    <Link to="/register" className="inline-flex items-center text-gray-800 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Link>
            </div>
            
            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                

                <div>
                    <div className="mb-6">
                        <motion.h1
                            className="text-2xl font-medium text-amber-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                           Conviértete en un verdadero Coffelover
                        </motion.h1>
                        <motion.p
                            className="text-gray-500 mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                              Descubre un mundo de aromas y sabores. Únete a la comunidad donde el café es más que una bebida, es una pasión.
                        </motion.p>
                    </div>

                    {/* Progress indicator */}
                    <ProgressIndicator step={step} totalSteps={totalSteps}></ProgressIndicator>
                </div>

                <form className="space-y-4 relative overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
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
                                        setPasswordsMatch={setPasswordsMatch}
                                        passwordsMatch={passwordsMatch}
                                        register={register as UseFormRegister<any>}
                                        errors={errors}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation buttons */}
                    <motion.div
                        className="pt-4 flex justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {step > 1 ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button type="button" variant="outline" onClick={prevStep} className="border-gray-200">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                            </motion.div>
                        ) : (
                            <div></div>
                        )}

                        {step < totalSteps ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button type="button" onClick={nextStepValidated} className="bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white">
                                    Siguiente
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div whileHover={passwordsMatch ? { scale: 1.05 } : {}} whileTap={passwordsMatch ? { scale: 0.95 } : {}}>
                                <Button
                                    disabled={!passwordsMatch}
                                    type="submit"
                                    onClick={() => setIsLastStepSubmitted(true)}
                                    className={`rounded-lg px-6 py-2 ${!passwordsMatch && !!errors?.userData?.password
                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        : "bg-gray-900 hover:bg-gray-800 text-white"}`}
                                >
                                    Complete Registration
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </form>
            </motion.div>
        </div>
    )
}

export default FormRegisterCoffeelover