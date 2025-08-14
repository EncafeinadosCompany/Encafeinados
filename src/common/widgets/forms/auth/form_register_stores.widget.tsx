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
import { FormHeader } from "@/common/molecules/form/form_header.molecule";
import { useStepMetaStore } from "@/common/hooks/stores/use_step_meta.hook";

const FormRegisterStores = () => {
  const [direction, setDirection] = useState(0);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { mutateAsync: useRegiterStore, status } = useRegisterStoreMutation();
  const navigate = useNavigate();
  const {title, icon, description} =  useStepMetaStore(step);

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
         <FormHeader
              getGreeting={getGreeting}
              getStepTitle={title}
              getStepDescription={description}
              getStepIcon={icon}
              totalSteps={RegisterStoreSchema.length}
              steps={step}
              colorProccessBar={"bg-gradient-to-r from-amber-400 to-orange-400"}
          ></FormHeader>

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
