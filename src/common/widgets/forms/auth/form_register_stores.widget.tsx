import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Coffee, Store } from "@/common/ui/icons";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import RegisterStoreStep1 from "@/common/molecules/auth/stores/register_store_step1.molecule";
import RegisterStoreStep2 from "@/common/molecules/auth/stores/register_store_step2.molecule";

import { useNavigate } from "react-router-dom";
import { useRegisterStoreMutation } from "@/api/mutations/stores/register_stores.mutation";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import TermConditions from "./form_term_conditions.widget";
import {
  CurrentSchema,
  RegisterStoreSchema,
} from "@/common/utils/schemas/auth/register_store_shema";
import { uploadImage } from "@/api/mutations/image/image.mutations";
import { RegisterStoreDto } from "@/api/types/stores/stores.type";
import { getGreeting } from "@/common/utils/get_greeting.utils";

import RegisterBranchStep4 from "@/common/molecules/auth/branches/register_branch_step4.molecule";
import { MultiStepFooter } from "@/common/molecules/form/MultiStepFooter.molecule";
import StepTransition from "@/common/atoms/forms/step_transition.atom";

const FormRegisterStores = () => {
  const [direction, setDirection] = useState(0);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { mutateAsync: useRegiterStore, status } = useRegisterStoreMutation();
  const navigate = useNavigate();

  const methods = useForm<CurrentSchema>({
    resolver: zodResolver(RegisterStoreSchema[step] as any),
    defaultValues: {
      email: "",
      name: "",
      type_document: "NIT",
      number_document: "",
      phone_number: "",
    },
    mode: "onChange",
  });

  const onNext = () => {
    methods.trigger().then((isValid) => {
      if (isValid) {
        setFormData((prev) => ({ ...prev, ...methods.getValues() }));
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
  };

  const prepareFormData = async (
    data: RegisterStoreDto
  ): Promise<RegisterStoreDto> => {
    const preparedData = { ...data };
    if (preparedData.logo && preparedData.logo instanceof File) {
      preparedData.logo = await uploadImage(preparedData.logo);
    } else {
      preparedData.logo = "https://res.cloudinary.com/...default-image.png";
    }

    return preparedData;
  };

  const onSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };

    try {
      const preparedData = await prepareFormData(finalData);

      if (!finalData.hasMultipleBranches) {
        localStorage.setItem("store", finalData.name);
        localStorage.setItem("tel", finalData.phone_number);
      }

      console.log(finalData, "hola");
      const response = await useRegiterStore(preparedData);
      methods.reset();
      navigate(`/register/branch/${response.store.id}`);
    } catch (error) {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-0 rounded-3xl shadow-lg bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative bg-gradient-to-r from-orange-50 to-purple-50 p-8 overflow-hidden">
            {/* Abstract shapes - background decorations */}
            <div className="absolute -top-10 right-10 w-40 h-40 rounded-full bg-amber-100 opacity-40 blur-2xl"></div>
            <div className="absolute top-5 left-5 w-10 h-10 rounded-full bg-green-200 opacity-60"></div>
            <div className="absolute bottom-5 right-20 w-16 h-16 rounded-full bg-rose-100 opacity-50"></div>

            <div className="relative flex justify-between items-center mb-6">
              {/* Logo and greeting */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👋</span>
                  <h3 className="text-indigo-700 font-medium">
                    {getGreeting()}!
                  </h3>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {step === 0 ? "Registra tu cafetería" : "Ya casi terminamos"}
                </h1>
                <p className="text-gray-600 mt-2 max-w-md">
                  {step === 0
                    ? "Cuéntanos sobre tu cafetería para darla a conocer al mundo"
                    : "Es importante para nosotros identificar tu café de especialidad"}
                </p>
              </div>

              {/* Header Illustration */}
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-sm">
                  {step === 0 ? (
                    <Store className="w-12 h-12 text-indigo-600" />
                  ) : (
                    <Coffee className="w-12 h-12 text-amber-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Progreso</p>
                <p className="text-sm text-gray-500">
                  {step + 1}/{RegisterStoreSchema.length}
                </p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{
                    width: `${
                      step * (100 / (RegisterStoreSchema.length - 1))
                    }%`,
                  }}
                  animate={{
                    width: `${
                      (step + 1) * (100 / RegisterStoreSchema.length)
                    }%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Form content */}
          <FormProvider {...methods}>
            <form>
              <CardContent className="p-2 xl:p-8">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {step === 0 && (
                    <StepTransition
                      step="step1"
                      className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100"
                    >
                      <RegisterStoreStep1
                        direction={direction}
                        register={methods.register}
                        control={methods.control}
                        errors={methods.formState.errors}
                      />
                    </StepTransition>
                  )}

                  {step === 1 && (
                    <StepTransition
                      step="step2"
                      className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100"
                    >
                      <RegisterStoreStep2
                        direction={direction}
                        register={methods.register}
                        control={methods.control}
                        errors={methods.formState.errors}
                      />
                      <div className="mt-6">
                        <TermConditions
                          register={methods.register}
                          control={methods.control}
                          errors={methods.formState.errors}
                        />
                      </div>
                    </StepTransition>
                  )}
                  {step === 2 && (
                    <StepTransition
                      step="step3"
                      className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                    >
                      <RegisterBranchStep4 methods={methods} />
                    </StepTransition>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                <MultiStepFooter
                  step={step}
                  methods={methods}
                  totalSteps={RegisterStoreSchema.length}
                  prevStep={prevStep}
                  nextStep={onNext}
                  onSubmit={methods.handleSubmit(onSubmit)}
                  isSubmitting={status === "pending"}
                  isValid={methods.formState.isValid}
                ></MultiStepFooter>
              </CardFooter>
            </form>
          </FormProvider>
        </motion.div>
      </Card>
    </div>
  );
};

export default FormRegisterStores;
