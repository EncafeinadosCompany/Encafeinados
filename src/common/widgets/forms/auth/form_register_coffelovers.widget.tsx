import { useState, useEffect } from "react";
import { FormProvider, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/common/ui/card";

import RegisterCoffeloverStep2 from "@/common/molecules/auth/coffelover/register_coffelover_step2.molecule";
import RegisterCoffeloverStep3 from "@/common/molecules/auth/coffelover/register_coffelover_step3.molecule";
import RegisterCoffeloverStep1 from "@/common/molecules/auth/coffelover/register_coffelover_step1.molecule";
import TermConditions from "./form_term_conditions.widget";

// SCHEMAS AND TYPES
import {
  registerCoffeeloverSchema,
  CurrentCoffeeLoverSchema,
} from "@/common/utils/schemas/auth/register_coffeelover.schema";

// MUTATIONS
import { useRegisterCoffeloverMutation } from "@/api/mutations/coffelover/coffelover.mutation";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import { FormHeader } from "@/common/molecules/form/form_header.molecule";
import { useStepMetaCoffeelover } from "@/common/hooks/coffeelover/use_step_meta.hook";
import { MultiStepFooter } from "@/common/molecules/form/MultiStepFooter.molecule";
import StepTransition from "@/common/atoms/forms/step_transition.atom";

interface GoogleUser {
  email: string;
  name: string;
  lastname: string;
  googleId: string;
}

const FormRegisterCoffeelover = () => {
  const [step, setStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [direction, setDirection] = useState(0);

  const searchParams = new URLSearchParams(window.location.search);
  const users = searchParams.get("user");

  const [formData, setFormData] = useState<GoogleUser>({
    email: "",
    name: "",
    lastname: "",
    googleId: "",
  });
  const {
    mutateAsync: useRegisterCoffeelover,
    reset,
    status,
  } = useRegisterCoffeloverMutation();

  const { icon, title, description } = useStepMetaCoffeelover(step);

  useEffect(() => {
    if (users) {
      const userData = JSON.parse(decodeURIComponent(users));
      setFormData((prev) => ({ ...prev, ...userData }));
    }
  }, [users]);

  const methods = useForm<CurrentCoffeeLoverSchema>({
    resolver: zodResolver(registerCoffeeloverSchema[step] as any),
    defaultValues: {
      name: formData.name ?? "",
      lastname: formData.lastname ?? "",
      type_document: "",
      number_document: "",
      email: formData.email ?? "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (formData.googleId && (formData.name || formData.email)) {
      methods.reset({
        name: formData.name ?? "",
        lastname: formData.lastname ?? "",
        type_document: "",
        number_document: "",
        email: formData.email ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [formData.googleId, formData.name, formData.email, methods]);


  const onSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };
    const dataCoffeelover = {
      personData: {
        full_name: `${finalData.name} ${finalData.lastname}`,
        ...(finalData.type_document && {
          type_document: finalData.type_document,
        }),
        ...(finalData.number_document && {
          number_document: finalData.number_document,
        }),
        phone_number: finalData.phone_number,
      },
      userData: {
        email: finalData.email,
        password: finalData.password,
        ...(formData.googleId && { id_google: formData.googleId }),
      },
    };

    try {
      await useRegisterCoffeelover(dataCoffeelover);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleNextStep = async () => {
    methods.trigger().then((isValid) => {
      if (isValid) {
        setFormData((prev) => ({ ...prev, ...methods.getValues() }));
        setStep(step + 1);
        setDirection(1);
      }
    });
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

    const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      setTimeout(() => {
        setShowInfo(false);
      }, 5000);
    }
  };


  return (
    <div className="w-full max-w-4xl overflow-hidden mx-auto relative">
      <Card className="overflow-hidden border-0 rounded-2xl  sm:rounded-3xl shadow-lg bg-white">
        <FormProvider {...methods}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Encabezado moderno */}
            <FormHeader
              getGreeting={getGreeting}
              getStepTitle={title}
              getStepDescription={description}
              getStepIcon={icon}
              totalSteps={registerCoffeeloverSchema.length}
              steps={step}
              colorProccessBar={"bg-gradient-to-r from-amber-400 to-orange-400"}
            ></FormHeader>

            {/* Contenido del formulario */}
            <div className="max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <CardContent className="p-3 sm:p-4 md:p-5">
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    {step === 0 && (
                      <StepTransition
                        step="step1"
                        className="p-3 sm:p-4 bg-blue-50/40  rounded-xl sm:rounded-2xl border border-blue-100"
                      >
                        <RegisterCoffeloverStep1
                          register={methods.register}
                          errors={methods.formState.errors}
                          direction={direction}
                        />
                      </StepTransition>
                    )}

                    {step === 1 && (
                      <StepTransition
                        step="step2"
                        className="p-3 sm:p-4 bg-blue-50/40 rounded-xl sm:rounded-2xl border border-blue-100"
                      >
                        <RegisterCoffeloverStep2
                          showInfo={showInfo}
                          toggleInfo={toggleInfo}
                          register={methods.register}
                          direction={direction}
                          errors={methods.formState.errors}
                          control={methods.control}
                        />
                      </StepTransition>
                    )}

                    {step === 2 && (
                      <StepTransition
                        step="step3"
                        className="p-3 sm:p-4 bg-blue-50/40 rounded-xl sm:rounded-2xl border border-blue-100"
                      >
                        <RegisterCoffeloverStep3
                          register={methods.register as UseFormRegister<any>}
                          errors={methods.formState.errors}
                          direction={direction}
                        />
                      </StepTransition>
                    )}

                    {step === 3 && (
                      <StepTransition
                        step="step4"
                        className="p-3 sm:p-4 bg-blue-50/40 rounded-xl sm:rounded-2xl border border-blue-100"
                      >
                        <div className="flex flex-col justify-center items-center min-h-[20vh]">
                          <TermConditions
                            register={methods.register}
                            control={methods.control}
                            errors={methods.formState.errors}
                          />
                        </div>
                      </StepTransition>
                    )}
                  </AnimatePresence>
                </CardContent>

                {/* Footer con botones responsivos */}
                <CardFooter className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100 bg-gray-50">
                  <MultiStepFooter
                    step={step}
                    isCoffelover={true}
                    validStep={1}
                    value="Continuar sin documento"
                    methods={methods}
                    totalSteps={registerCoffeeloverSchema.length}
                    prevStep={handlePrevStep}
                    nextStep={handleNextStep}
                    onSubmit={methods.handleSubmit(onSubmit)}
                    isSubmitting={status === "pending"}
                    isValid={methods.formState.isValid}
                  ></MultiStepFooter>
                </CardFooter>
                
              </form>
            </div>
          </motion.div>
        </FormProvider>
      </Card>
    </div>
  );
};

export default FormRegisterCoffeelover;
