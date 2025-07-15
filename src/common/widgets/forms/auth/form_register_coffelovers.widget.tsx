import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FormProvider, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Shield,
  BadgeCheck,
  Coffee,
} from "@/common/ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/common/ui/button";
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
  const [formData, setFormData] = useState<GoogleUser>({
    email: "",
    name: "",
    lastname: "",
    googleId: "",
  });
  const useRegisterCoffeelover = useRegisterCoffeloverMutation();
  const searchParams = new URLSearchParams(window.location.search);
  const users = searchParams.get("user");

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

  // Solo resetear el formulario cuando cambian los datos de Google (inicial)
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

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      setTimeout(() => {
        setShowInfo(false);
      }, 5000);
    }
  };

  const onNext = async () => {
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

  const onSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };
    const dataCoffeelover = {
      personData: {
        full_name: `${finalData.name} ${finalData.lastname}`,
        type_document: finalData.type_document,
        number_document: finalData.number_document,
        phone_number: finalData.phone_number,
      },
      userData: {
        email: finalData.email,
        password: finalData.password,
        ...(formData.googleId && { id_google: formData.googleId }),
      },
    };

    try {
      await useRegisterCoffeelover.mutateAsync(dataCoffeelover);
      useRegisterCoffeelover.reset();
    } catch (error) {
      console.log(error);
    } finally {
      toast.remove();
    }
  };

  // Calculate which icon to show based on current step
  const getStepIcon = () => {
    switch (step) {
      case 0:
        return <User className="w-12 h-12 text-amber-600" />;
      case 1:
        return <Shield className="w-12 h-12 text-blue-600" />;
      case 2:
        return <Coffee className="w-12 h-12 text-purple-600" />;
      case 3:
        return <BadgeCheck className="w-12 h-12 text-emerald-600" />;
      default:
        return <BadgeCheck className="w-12 h-12 text-emerald-600" />;
    }
  };

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Información personal";
      case 1:
        return "Credenciales de acceso";
      case 2:
        return "Configuración final";
      case 3:
        return "Términos y condiciones";
      default:
        return "Registro de CoffeeLover";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 0:
        return "Comparte tus datos básicos para empezar esta aventura";
      case 1:
        return "Crea tus credenciales de acceso seguras";
      case 2:
        return "Finaliza tu configuración de perfil";
      case 3:
        return "Acepta los términos para completar tu registro";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-4xl  overflow-hidden mx-auto relative">
      <Card className="overflow-hidden border-0 rounded-2xl  sm:rounded-3xl shadow-lg bg-white">
        <FormProvider {...methods}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Encabezado moderno */}
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 p-3 md:p-4 lg:p-5 overflow-hidden">
              {/* Decoraciones de fondo */}
              <div className="absolute -top-10 right-10 w-20 h-20 rounded-full bg-amber-100 opacity-40 blur-2xl hidden sm:block"></div>
              <div className="absolute bottom-3 right-10 w-8 h-8 rounded-full bg-orange-100 opacity-50 hidden sm:block"></div>

              <div className="relative flex flex-row justify-between items-center gap-4">
                {/* Contenido del encabezado */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <span className="text-lg md:text-xl">☕</span>
                    <h3 className="text-amber-700 font-medium text-sm md:text-base">
                      {getGreeting()}!
                    </h3>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {getStepTitle()}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 mt-0.5 max-w-md">
                    {getStepDescription()}
                  </p>
                </div>

                {/* Ilustración */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl shadow-sm">
                    {getStepIcon()}
                  </div>
                </div>
              </div>

              {/* Indicador de progreso */}
              <div className="mt-2 md:mt-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-700">Progreso</p>
                  <p className="text-xs text-gray-500">
                    {step + 1}/{registerCoffeeloverSchema.length}
                  </p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{
                      width: `${
                        step * (100 / (registerCoffeeloverSchema.length - 1))
                      }%`,
                    }}
                    animate={{
                      width: `${
                        (step + 1) * (100 / registerCoffeeloverSchema.length)
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                  />
                </div>
              </div>
            </div>

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
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 bg-amber-50/40 rounded-xl sm:rounded-2xl border border-amber-100"
                      >
                        <RegisterCoffeloverStep1
                          register={methods.register}
                          errors={methods.formState.errors}
                          direction={direction}
                        />
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
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
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 bg-purple-50/40 rounded-xl sm:rounded-2xl border border-purple-100"
                      >
                        <RegisterCoffeloverStep3
                          register={methods.register as UseFormRegister<any>}
                          errors={methods.formState.errors}
                          direction={direction}
                        />
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 bg-green-50/40 rounded-xl sm:rounded-2xl border border-green-100"
                      >
                        <div className="flex flex-col justify-center items-center min-h-[20vh]">
                          <TermConditions
                            register={methods.register}
                            control={methods.control}
                            errors={methods.formState.errors}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                {/* Footer con botones responsivos */}
                <CardFooter className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between w-full">
                    {step > 0 ? (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="text-xs sm:text-sm border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Anterior
                        </Button>
                      </motion.div>
                    ) : (
                      <div />
                    )}

                    {step < registerCoffeeloverSchema.length - 1 ? (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={step === 0 ? "ml-auto" : ""}
                      >
                        <Button
                          type="button"
                          onClick={onNext}
                          data-testid="next-button"
                          className="text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white"
                        >
                          {step === 0 ? "Continuar registro" : "Siguiente"}
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="ml-auto"
                      >
                        <Button
                          type="submit"
                          data-testid="submit-button"
                          disabled={!methods.formState.isValid}
                          className={`text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 ${
                            !methods.formState.isValid
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                          }`}
                        >
                          <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Completar registro
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardFooter>
              </form>
            </div>
          </motion.div>
        </FormProvider>
      </Card>

      {/* Elementos decorativos */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-amber-100/30 blur-3xl -z-10 hidden md:block"></div>
      <div className="absolute top-40 -right-20 w-60 h-60 rounded-full bg-orange-100/30 blur-3xl -z-10 hidden md:block"></div>
    </div>
  );
};

export default FormRegisterCoffeelover;
