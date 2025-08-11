import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  MapPin,
  BadgeCheck,
  ChevronDown,
} from "@/common/ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import { Button } from "@/common/ui/button";
import { validateImageRequirements } from "@/common/hooks/criteria/use_criteria.hook";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import {
  RegisterStoreBrancheSchema,
  RegisterStoreBrancheSchemaType,
} from "@/common/utils/schemas/auth/register_store_branche.schema";

import RegisterStoreBrancheStep1 from "@/common/molecules/auth/stores/register_store_branche_step1.molecule";
import RegisterStoreBrancheStep2 from "@/common/molecules/auth/stores/register_store_branche_step2.molecule";
import RegisterStoreBrancheStep3 from "@/common/molecules/auth/stores/register_store_branche_step3.molecule";
import SocialNetworksForm from "./form_social_network.widget";
import MapSearch from "@/common/widgets/map/map_search.widget";

import { showSuccessToast } from "@/common/molecules/auth/login/card_success.molecule";
import { useRegisterBrandMutation } from "@/api/mutations/branches/branches.mutation";
import { useCriteria } from "@/api/queries/criteria/criteria.query";
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query";
import { FormHeader } from "@/common/atoms/forms/form_header.atom";
import IconProcess from "@/common/atoms/forms/icon_process.atom";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import { ButtonSuccess } from "@/common/atoms/forms/button_success.atom";
import { useRegisterCriteriaMutation } from "@/api/mutations/criteria/criteria.mutation";
import { ChevronsUp, ChevronUp } from "lucide-react";

export default function RegisterStoreBranches() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const { storeId } = useParams();
  const [formData, setFormData] = useState({});
  const [baseAddress, setBaseAddress] = useState("");

  const navigate = useNavigate();
  const { data: socialNetworks } = useSocialNetworksQuery();
  const { data: criteria } = useCriteria();
  const [invalid, setInvalid] = useState(false);

  const registerBranchMutation = useRegisterBrandMutation();
  const registerCriteriaMutation = useRegisterCriteriaMutation();

  const methods = useForm<RegisterStoreBrancheSchemaType>({
    resolver: zodResolver(RegisterStoreBrancheSchema[step] as any),
    defaultValues: {
      name: "",
      phone_number: "",

      criteria: {},

      address: "",
      latitude: 0,
      longitude: 0,
      addressDetails: "",
      nearbyReference: null,
      additionalNotes: null,
      social_networks: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (
      criteria &&
      Object.keys(methods.getValues("criteria") || {}).length === 0
    ) {
      methods.setValue(
        "criteria",
        criteria.reduce((acc, c) => {
          acc[String(c.id)] = {
            response_text: "",
            image_url: undefined,
          };
          return acc;
        }, {} as Record<string, { response_text: string; image_url?: string; other_text?: string }>)
      );
    }
    setInvalid(false);
  }, [criteria, methods]);

  const onSubmit = async (data: any) => {
    const finalData = { ...formData, ...data };

    try {
      if (!storeId) {
        toast.error("No cuenta con el id de la tienda");
        return;
      }

      const detailsParts = [];
      if (finalData.addressDetails)
        detailsParts.push(`Detalles: ${finalData.addressDetails}`);
      if (finalData.nearbyReference)
        detailsParts.push(`Referencia cercana: ${finalData.nearbyReference}`);
      if (finalData.additionalNotes)
        detailsParts.push(`Notas adicionales: ${finalData.additionalNotes}`);
      const details = detailsParts.join(" | ");

      const submitData = {
        store_id: Number(storeId),
        name: finalData.name,
        phone_number: finalData.phone_number,
        latitude: finalData.latitude,
        longitude: finalData.longitude,
        address: finalData.address,
        social_branches: finalData.social_networks || [],
        criteria: finalData.criteria,
        details,
      };
      // ✅ PASO 1: Registrar sucursal (SIN criteria)
      console.log("🟡 Registrando sucursal...");
      const branchResponse = await registerBranchMutation.mutateAsync(
        submitData
      );
      console.log("🟢 Sucursal registrada:", branchResponse);

      // ✅ PASO 2: Registrar criteria por separado
      console.log("🟡 Registrando criteria...");
      await registerCriteriaMutation.mutateAsync({
        branchId: branchResponse.branch.id,
        criteriaResponseData: finalData.criteria,
      });
      console.log("🟢 Criteria registrada");

      // ✅ ÉXITO: Todo completado
      methods.reset();
      const name = localStorage.getItem("nameStore");
      showSuccessToast(name);

      // Navegación después del toast como en coffeelover
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      console.error("Error during submission:", err);
      // El error ya se maneja en la mutación
    }
  };

  const nextStep = () => {
    methods.trigger().then((isValid) => {
      if (isValid) {
        setFormData((prev) => ({ ...prev, ...methods.getValues() }));

        if (step === 1) {
          const error = validateImageRequirements(
            Array.isArray(criteria) ? criteria : [],
            methods.getValues("criteria")
          );
          if (error) {
            toast.error(error, {
              id: "error",
            });
            return;
          }
        }
        setStep((prev) => prev + 1);
        setDirection(1);
      }
    });
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setDirection(-1);
  };

  const onLocationSelect = (lat: number, lng: number, address: string) => {
    methods.setValue("latitude", lat, { shouldValidate: true });
    methods.setValue("longitude", lng, { shouldValidate: true });
    methods.setValue("address", address, { shouldValidate: true });
    setBaseAddress(address);
  };

  // Calculate which icon to show based on current step
  const getStepIcon = () => {
    switch (step) {
      case 0:
      case 1:
        return <Coffee className="w-12 h-12 text-amber-600" />;
      case 2:
        return <MapPin className="w-12 h-12 text-orange-600" />;
      default:
        return <BadgeCheck className="w-12 h-12 text-emerald-600" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Haz que tu cafetería crezca y se conecte con más amantes del café";
      case 1:
        return "Cuéntanos qué hace especial a tu café de especialidad";
      case 2:
        return "Ayuda a los coffeelovers a encontrarte fácilmente";
      case 3:
        return "Proporciona detalles adicionales sobre la ubicación";
      case 4:
        return "Comparte tus redes sociales para mayor visibilidad";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 0:
        return "Haz que tu cafetería crezca y se conecte con más amantes del café";
      case 1:
        return "Cuéntanos qué hace especial a tu café de especialidad";
      case 2:
        return "Ayuda a los coffeelovers a encontrarte fácilmente";
      case 3:
        return "Proporciona detalles adicionales sobre la ubicación";
      case 4:
        return "Comparte tus redes sociales para mayor visibilidad";
      default:
        return "";
    }
  };

  // const isMapStep = step === 2;

  return (
    <div className="w-full h-full max-w-5xl mx-auto ">
      <Card
        className={`relative overflow-hidden border-0 rounded-2xl sm:rounded-3xl shadow-lg bg-white 
          `}
      >
        <FormProvider {...methods}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            // className={`${isMapStep ? "flex flex-col" : ""}`}
          >
            {/* Encabezado moderno */}
            <FormHeader
              getGreeting={getGreeting}
              getStepTitle={getStepTitle}
              getStepDescription={getStepDescription}
              getStepIcon={getStepIcon}
              totalSteps={RegisterStoreBrancheSchema.length}
              steps={step}
              colorProccessBar={"bg-gradient-to-r from-amber-400 to-orange-400"}
              color="bg-amber-100/70"
            ></FormHeader>

            {/* Contenido del formulario con altura adaptativa */}
            <div
              className={` h-full min-h-[70vh] md:min-h-[60vh] max-h-[60vh] scrollbar-subtle pb-24 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent`}
            >
              {step === 2 && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                  <motion.button
                    onClick={() => {
                      const cardTop = document.getElementById("card-top");
                      if (cardTop) {
                        cardTop.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    initial={{ opacity: 0.5 }}
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <ChevronUp className="h-4 w-4 text-[#6F4E37]" />
                  </motion.button>
                </div>
              )}
              <form>
                <CardContent className={`p-4 sm:p-4 md:p-5 rounded-2xl`}>
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    {step === 0 && (
                      <motion.div
                        key="step1"
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border p-3 border-blue-100 shadow-inner h-full flex-grow"
                      >
                        <RegisterStoreBrancheStep1
                          register={methods.register}
                          error={methods.formState.errors}
                          control={methods.control}
                        />
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="step2"
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4  bg-amber-50/40 rounded-xl sm:rounded-2xl border border-amber-100"
                      >
                        <RegisterStoreBrancheStep2
                          methods={methods}
                          criteria={criteria || []}
                        />
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step3"
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl sm:rounded-2xl overflow-hidden border border-blue-100 shadow-inner flex-grow w-full"
                      >
                        <MapSearch
                          initialAddress={baseAddress}
                          initialLat={methods.watch("latitude")}
                          initialLng={methods.watch("longitude")}
                          isLargeSize={true}
                          onLocationSelect={onLocationSelect}
                        />
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step4"
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 bg-green-50/40 rounded-xl sm:rounded-2xl border border-green-100"
                      >
                        <RegisterStoreBrancheStep3
                          baseAddress={baseAddress}
                          errors={methods.formState.errors}
                          register={methods.register}
                        />
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step5"
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 bg-purple-50/40 rounded-xl sm:rounded-2xl border border-purple-100"
                      >
                        <SocialNetworksForm
                          register={methods.register}
                          control={methods.control}
                          error={methods.formState.errors}
                          availableSocialNetworks={socialNetworks}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                {/* Footer con botones responsivos */}
                <CardFooter className="absolute bottom-0 w-full px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100  rounded-lg bg-gray-50">
                  <div className=" flex justify-between w-full">
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

                    {step < RegisterStoreBrancheSchema.length - 1 ? (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={step === 0 ? "ml-auto" : ""}
                      >
                        <Button
                          type="button"
                          onClick={nextStep}
                          data-testid="next-button"
                          className="text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white"
                        >
                          Siguiente
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
                          type="button"
                          onClick={methods.handleSubmit(onSubmit)}
                          disabled={
                            registerBranchMutation.isPending ||
                            registerCriteriaMutation.isPending
                          }
                          className={`text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 ${
                            !methods.formState.isValid
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                          }`}
                        >
                          <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {registerBranchMutation.isPending ||
                          registerCriteriaMutation.isPending
                            ? "Registrando..."
                            : "Completar registro"}
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
    </div>
  );
}
