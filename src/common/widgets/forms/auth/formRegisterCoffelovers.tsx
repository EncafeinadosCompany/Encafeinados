import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import { FormProvider, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "@/common/ui/icons";
import { motion, AnimatePresence} from "framer-motion";

import { useRegisterCoffeloverMutation } from "@/api/mutations/coffelover/coffeloverMutation";
import {registerCoffeeloverSchema, CurrentCoffeeLoverSchema } from "@/common/utils/schemas/auth/registerCoffeeloverSchema";
import { TitleForm } from "@/common/atoms/auth/titleForm";
import { registerWithGoogle} from "@/api/firebase";
import { LinkReturn } from "@/common/molecules/auth/LinkReturn";

import RegisterCoffeloverStep2 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep2";
import RegisterCoffeloverStep3 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep3";
import RegisterCoffeloverStep1 from "@/common/molecules/auth/Coffelover/registerCoffeloverStep1";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";
import { RegisterCoffelover } from "@/api";


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
        // mode: "onChange"
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
                setFormData(prev => ({...prev , ...methods.getValues()}));
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

    const onSubmit = (data: any) => {

        const finalData = { ...formData, ...data };
        // console.log(finalData);
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

        console.log('Coffelover',dataCoffeelover);

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
                        email: user[0].email || ""
                    },
                    personData: {
                        full_name: user[0].displayName || "",
                        type_document: 'CC',
                        number_document: '334343443',
                        phone_number:'344324324342'
                    }
                }

                console.log("Usuario creado:", userData);


                useRegisterCoffeelover.mutateAsync(userData).then((response) => {
                    toast.success("Coffelover creado exitosamente.¡Bienvenido!");
                    navigate("/coffeelover");
                }).catch((error) => {
                    console.log(error);
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
                        <ProgressIndicator step={step + 1} totalSteps={registerCoffeeloverSchema.length}></ProgressIndicator>
                    </div>

                    <FormProvider {...methods}>
                    <form className="space-y-4 relative overflow-hidden" onSubmit={methods.handleSubmit(onSubmit)}>
                        <div className="relative" style={{ minHeight: "300px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (      
                                        <RegisterCoffeloverStep1
                                            onGoogleSignIn={handleGoogleSignIn}
                                            isLoading={isLoading}
                                            register={methods.register}
                                            errors={methods.formState.errors}
                                            direction={direction}
                                        />
                                )}
                                {step === 1 && (
                                        <RegisterCoffeloverStep2
                                            showInfo={showInfo}
                                            toggleInfo={toggleInfo}
                                            register={methods.register }
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
                                            {step === 3 && "conditions" in methods.formState.errors && (
                                                <p className=" text-red-500">{methods.formState.errors.conditions?.message}</p>
                                            )}

                                        </>
                                    )
                                }
                            </AnimatePresence>
                        </div>

                        {/* Navigation buttons */}
                        <motion.div
                            className="pt-2 m-2 flex justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {step > 0 ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="button" variant="outline" onClick={prevStep} className="border-gray-200 bg-amber-50/50">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                </motion.div>
                            ) : (
                                <div></div>
                            )}

                            {step < registerCoffeeloverSchema.length -1  ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button disabled={!methods.formState.isValid} type="button" data-testid="next-button" onClick={onNext} className="bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white">
                                        {isLoading ? "Cargando..." : "Siguiente"}
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
        </div>
    )
}

export default FormRegisterCoffeelover