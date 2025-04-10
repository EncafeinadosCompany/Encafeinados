import toast from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/common/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "@/common/ui/icons"
import { FormProvider, useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"

import { RegisterStoreSchema } from "@/common/utils/schemas/auth/registerStoreShema"

import { CurrentBrancheSchema, registerBrancheSchema } from "@/common/utils/schemas/auth/registerBrancheSchema"
import { RegisterBranchesStep1 } from "@/common/molecules/auth/stores/branches/registerBranchesStep1"
import { RegisterBranchesStep2 } from "@/common/molecules/auth/stores/branches/registerBranchesStep2"
import { RegisterBranchesStep3 } from "@/common/molecules/auth/stores/branches/registerBranchesStep3"
import { BranchPost } from "@/api/types/branchesTypes"
import { useRegisterBrandMutation } from "@/api/mutations/stores/branchesMutation"


interface FormRegisterBrandsProps {
    onClose: () => void 
}

const FormRegisterBrands = ({onClose}:FormRegisterBrandsProps) => {
    const [direction, setDirection] = useState(0);
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({});
    const [baseAddress, setBaseAddress] = useState("");
    const useBranchesMuntation = useRegisterBrandMutation();
   
    const methods = useForm<CurrentBrancheSchema>({
        resolver: zodResolver(registerBrancheSchema[step] as any),
        defaultValues: {
            name: "",
            phone_number: "",
            latitude: 0,
            longitude: 0,
            address: ""
        },
        mode: "onChange"
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

    const onSubmit = async (data: any) => {
        const finalData = { ...formData, ...data };
        console.log("Formulario enviado:", finalData);
        const branchesData: BranchPost = {
            store_id: 1,
            name: finalData.name,
            phone_number: finalData.phone_number,
            latitude: finalData.latitude,
            longitude: finalData.longitude,
            address: `${finalData.address}, ${finalData.addressDetails}, ${finalData.nearbyReference}`,
        }

        try {
            useBranchesMuntation.mutateAsync(branchesData).then((res) => {
                toast.success("Sucursal registrada con exito");
                onClose();
                console.log(res)
            })
        } catch (error) {
            toast.error("Error al registrar la sucursal");
        }
    };


    const onLocationSelect = (lat: number, lng: number, address: string) => {
        console.log(lat, lng, address)
        methods.setValue("latitude", lat, { shouldValidate: true });
        methods.setValue("longitude", lng, { shouldValidate: true });
        methods.setValue("address", address, { shouldValidate: true });  
        setBaseAddress(address);
    }


    return (
        <div >
            <motion.div
                className="max-w-2xl  w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 relative ">

                        <div className="relative" style={{ maxHeight: "600px", overflow: "hidden" }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                {step === 0 && (
                                    <RegisterBranchesStep1
                                        register={methods.register}
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    >
                                    </RegisterBranchesStep1>
                                )}
                                {
                                    step === 1 && (
                                        <RegisterBranchesStep2
                                            onLocationSelect={onLocationSelect}>
                                        </RegisterBranchesStep2>
                                    )
                                }
                                {
                                    step === 2 && (
                                        <RegisterBranchesStep3
                                            register={methods.register}
                                            errors={methods.formState.errors}
                                            baseAddress={baseAddress}>
                                        </RegisterBranchesStep3>
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
                                            Anterior
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

export default FormRegisterBrands 