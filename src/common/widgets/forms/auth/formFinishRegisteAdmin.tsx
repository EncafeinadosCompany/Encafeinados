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
import { useAdminStoreMutation } from "@/api/mutations/admin_stores/admin_stores.mutation";
import { RegisterAdminStores } from "@/api/types/adminStoresTypes";
import { useNavigate } from "react-router-dom";
import { TermConditions } from "./termConditions";

export const FormFinishRegisteAdmin = ({ref}:any) => {

    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({})
    const useRegisterAdminStore = useAdminStoreMutation();
    const navigate = useNavigate();

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
    const onSubmit = async (data: any) => {

        const finalData = {...formData,...data };
        
        // const cleanPhoneNumber = finalData.phone_number.replace(/\s+/g, '');

        const register : RegisterAdminStores = {
            storeData:{
                id: Number(ref),
            },
            userData: {
                email: finalData.email,
                password: finalData.password, 
            },
            personData:{
                full_name: finalData.name,
                type_document: finalData.type_document,
                number_document: finalData.number_document,
                phone_number: finalData.phone_number,
            }
        }

        try {

            await useRegisterAdminStore.mutateAsync(register);
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <Card className="border-none bg-white/80 p-10 shadow-2xl">

            <motion.div
                className="max-w-2xlw-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col justify-center">
                    <div className="mt-8 mb-2 text-center ">
                        <TitleForm
                            title="¡Finalicemos tu registro!"
                            subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
                        >
                        </TitleForm>
                    </div>
                    {/* Progress indicator */}
                    <ProgressIndicator className="ml-16 md:ml-36" step={step + 1} totalSteps={RegisterAdminStoreSchema.length}></ProgressIndicator>
                    
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4  relative overflow-hidden">
                        <div className="relative" style={{ minHeight: "250px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <FinistAdminStore2
                                    register={methods.register}
                                    control={methods.control}
                                    errors={methods.formState.errors}
                                ></FinistAdminStore2>
                                  
                                )},
                                {
                                    step === 1 && (
                                        <FinistAdminStore
                                        direction={direction}
                                        register={methods.register}
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    ></FinistAdminStore>
                                    )},

                                {
                                    step === 2 && (
                                        <div className="flex flex-col justify-center items-center h-[20vh]">
                                        <TermConditions
                                               register={methods.register}
                                               control={methods.control}
                                               errors={methods.formState.errors}

                                           >
                                       </TermConditions>
                                      </div>
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
                                        <Button type="button" variant="outline" onClick={() => { setStep(step - 1), setDirection(-1) }} className="border-gray-200 bg-[#020F17] text-gray-200">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Anterior
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div></div>
                                )}
                                {step < RegisterAdminStoreSchema.length - 1 ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button type="button" onClick={onNext} className="bg-[#DB8935] hover:bg-gray-800 rounded-lg px-6 py-2 text-white">
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