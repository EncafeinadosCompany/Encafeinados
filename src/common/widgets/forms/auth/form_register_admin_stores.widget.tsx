import { TitleForm } from "@/common/atoms/auth/title_form.atom";
import RegisterAdminStoreStep2 from "@/common/molecules/auth/admin_stores/finish_admin_store_step2.molecule"
import { Button } from "@/common/ui/button"
import { Card } from "@/common/ui/card"
import { CurrentAdminSchema, RegisterAdminStoreSchema } from "@/common/utils/schemas/auth/register_admin_store.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RegisterAdminStoreStep1 from "@/common/molecules/auth/admin_stores/finish_admin_store_step1.molecule";
import ProgressIndicator from "@/common/atoms/auth/progress_indicator.atom";
import { useRegisterAdminMutation } from "@/api/mutations/admin/admin_stores.mutation";

import { useNavigate } from "react-router-dom";
import { TermConditions } from "./form_term_conditions.widget";
import { FormControl, FormField, FormItem, FormLabel } from "@/common/ui/form";
import { Switch } from "@/common/ui/switch";

import { ROLES } from "@/common/utils/lists/roles.utils";
import { RegisterAdminData } from "@/api/types/admin_stores/admin_stores.type";


interface RegisteAdminProps {
    storeId: number | 0;
    branchId: number | 0;
    ref?: string;
}


export default function RegisterAdminStore({ ref, storeId, branchId }: RegisteAdminProps) {

    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState({})
    const [step, setStep] = useState(0)
    const useRegisterAdminMutations = useRegisterAdminMutation();
    const navigate = useNavigate();

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
        const register: RegisterAdminData = {
            userData: {
                email: finalData.email,
                password: finalData.password,
                roles: finalData.hasMultipleBranch ? [ROLES.STORE, ROLES.ADMIN_SUCURSAL] : [ROLES.STORE]
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
        <Card className="border-none  bg-white/60  p-3 md:p-10 shadow-lg">

            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col justify-center mt-4 md:mt-0">
                    <div className="w-full flex flex-col  justify-center content-center text-center ">
                        <TitleForm
                            title="¡Finalicemos tu registro!"
                            subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
                        >
                        </TitleForm>
                        <ProgressIndicator className="mt-2 m-4" step={step + 1} totalSteps={RegisterAdminStoreSchema.length}></ProgressIndicator>
                    </div>

                </div>
                <FormProvider {...methods}>
                    <form className="relative overflow-hidden">
                        <div className="relative" style={{ minHeight: "250px" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <RegisterAdminStoreStep1
                                        register={methods.register}
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    />

                                )},
                                {
                                    step === 1 && (
                                        <RegisterAdminStoreStep2
                                            direction={direction}
                                            register={methods.register}
                                            control={methods.control}
                                            errors={methods.formState.errors}
                                        />
                                    )},

                                {
                                    step === 2 && (
                                        <div className="flex flex-col gap-6 justify-center items-center h-full h-min-[28vh] w-full">
                                            <div className="w-full max-w-2xl flex flex-col justify-center items-center">

                                                <FormField
                                                    control={methods.control}
                                                    name="hasMultipleBranch"
                                                    render={({ field }) => (
                                                        <FormItem className="grid grid-cols-1 items-center justify-between rounded-xl border boder-1 border-gray-200 bg-white/50 p-4 shadow-sm">

                                                            <div className="flex flex-col">
                                                                <div className="w-full flex justify-between items-center mb-2">
                                                                    <FormLabel className="font-semibold text-gray-800">
                                                                        ¿Solo tendrás esta tienda?
                                                                    </FormLabel>
                                                                    <div className="flex items-center space-x-2">
                                                                        <FormControl>
                                                                            <Switch
                                                                                checked={field.value}
                                                                                onCheckedChange={field.onChange}
                                                                            />
                                                                        </FormControl>
                                                                        <span
                                                                            className={`font-medium  text-sm transition-all cursor-pointer duration-200 ${field.value
                                                                                ? "text-green-600"
                                                                                : "text-red-600"
                                                                                }`}
                                                                            onClick={() => field.onChange(!field.value)}
                                                                        >
                                                                            {field.value ? "Sí" : "No"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-gray-500 mt-1">
                                                                    Si estás seguro de que solo tendrás esta tienda, presiona <b>Sí</b>. Si piensas abrir más tiendas en el futuro, presiona <b>No</b>.<br />
                                                                    <span className="block mt-2">
                                                                        <b>Al marcar esta opción</b> tendrás acceso con el mismo usuario y contraseña a los dos paneles de administración.<br />
                                                                        Más adelante, si cambias de opinión, podrás agregar más cafeterías desde tu cuenta.
                                                                    </span>
                                                                </span>
                                                            </div>

                                                        </FormItem>
                                                    )}
                                                />

                                                <TermConditions
                                                    register={methods.register}
                                                    control={methods.control}
                                                    errors={methods.formState.errors}
                                                />
                                            </div>
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