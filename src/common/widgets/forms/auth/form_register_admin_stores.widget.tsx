import { TitleForm } from "@/common/atoms/auth/title_form.atom";
import { FinishAdminStore } from "@/common/molecules/auth/admin_stores/finish_admin_store_step1.molecule"
import { Button } from "@/common/ui/button"
import { Card } from "@/common/ui/card"
import { CurrentAdminSchema, RegisterAdminStoreSchema } from "@/common/utils/schemas/auth/register_admin_store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FinistAdminStore2 } from "@/common/molecules/auth/admin_stores/finish_admin_store_step2.molecule";
import ProgressIndicator from "@/common/atoms/auth/progress_indicator.atom";
import { useRegisterAdminMutation } from "@/api/mutations/admin/admin_stores.mutation";

import { useNavigate } from "react-router-dom";
import { TermConditions } from "./form_term_conditions.widget";
import { Register_admin_stores } from "@/api/types/auth/auth.types";
import { FormControl, FormField, FormItem, FormLabel } from "@/common/ui/form";
import { Switch } from "@/common/ui/switch";

import { ROLES } from "@/common/utils/lists/roles.utils";
import { RegisterAdminData } from "@/api/types/admin_stores/admin_stores.type";


interface RegisteAdminProps {
    storeId: number | 0;
    branchId: number | 0;
    ref?: string;
}


export const FormFinishRegisteAdmin = ({ ref, storeId, branchId }: RegisteAdminProps) => {

    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({})
    const [step, setStep] = useState(0)
    const useRegisterAdminMutations = useRegisterAdminMutation();
    const navigate = useNavigate();


    console.log("Dtos importante", ref, storeId, branchId);
    const methods = useForm<CurrentAdminSchema>({
        resolver: zodResolver(RegisterAdminStoreSchema[step] as any),
        defaultValues: {
            name: "",
            email: "",
            type_document: "CC",
            number_document: "",
            phone_number: "",
            hasMultipleBranch: false
        },
        mode: "onChange"
    })

    const onNext = () => {
        methods.trigger().then((isValid) => {
            if (isValid) {
                setStep(step + 1)
                setDirection(1)
                setFormData({ ...formData, ...methods.getValues() })
            };
        });

    };
    const onSubmit = async (data: any) => {

        const finalData = { ...formData, ...data };

        console.log("Final Data:", finalData);
        const register: RegisterAdminData= {
            userData: {
                email: finalData.email,
                password: finalData.password,
                roles: finalData.hasMultipleBranch? [ROLES.STORE, ROLES.ADMIN_SUCURSAL] : [ROLES.STORE]
            },
            personData: {
                full_name: finalData.name,
                type_document: finalData.type_document,
                number_document: finalData.number_document,
                phone_number: finalData.phone_number,
            },
            entityData: {
                storeId: Number(storeId),
                ...(finalData.hasMultipleBranch ? { branchId: Number(branchId) } : {})
            },

        }

        try {
            console.log("Register Data prueba:", register);

            await useRegisterAdminMutations.mutateAsync(register);
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    return (
        <Card className="border-none  bg-white/60 p-10 shadow-lg">

            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col justify-center">
                    <div className="w-full flex flex-col  justify-center content-center text-center ">
                        <TitleForm
                            title="¡Finalicemos tu registro!"
                            subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
                        >
                        </TitleForm>
                    {/* Progress indicator */}
                    <ProgressIndicator className="mt-2" step={step + 1} totalSteps={RegisterAdminStoreSchema.length}></ProgressIndicator>
                    </div>

                </div>
                <FormProvider {...methods}>
                    <form className="space-y-4  relative overflow-hidden">
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
                                        <FinishAdminStore
                                            direction={direction}
                                            register={methods.register}
                                            control={methods.control}
                                            errors={methods.formState.errors}
                                        ></FinishAdminStore>
                                    )},

                                {
                                    step === 2 && (
                                        <div className="flex flex-col justify-center items-center h-[20vh]">
                                            <TermConditions
                                                register={methods.register}
                                                control={methods.control}
                                                errors={methods.formState.errors}

                                            />
                                            <FormField
                                                control={methods.control}
                                                name="hasMultipleBranch"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Múltiples Sucursales</FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

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
                                            type="button"
                                             onClick={methods.handleSubmit(onSubmit)}
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