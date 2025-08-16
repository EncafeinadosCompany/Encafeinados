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
import { FormHeader } from "@/common/molecules/form/form_header.molecule";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import { useRegisterCriteriaMutation } from "@/api/mutations/criteria/criteria.mutation";
import StepTransition from "@/common/atoms/forms/step_transition.atom";
import ButtonChevronUp from "@/common/atoms/forms/buttonChevronUp.atom";
import { useStepMetaBranch } from "@/common/hooks/branches/use_step_meta.hook";

export default function RegisterBranchesWidget() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const { storeId } = useParams();
  const [baseAddress, setBaseAddress] = useState("");

  const navigate = useNavigate();
  const { data: socialNetworks } = useSocialNetworksQuery();
  const { data: criteria } = useCriteria();
  const [invalid, setInvalid] = useState(false);

  const registerBranchMutation = useRegisterBrandMutation();
  const registerCriteriaMutation = useRegisterCriteriaMutation();
  const {icon, title, description} = useStepMetaBranch(step);

  const [formData, setFormData] = useState({});

  const nameStore = localStorage.getItem("store");
  const tel = localStorage.getItem("tel");
  const methods = useForm<RegisterStoreBrancheSchemaType>({
    resolver: zodResolver(RegisterStoreBrancheSchema[step] as any),
    defaultValues: {
      name: nameStore ? nameStore : "",
      phone_number: tel ? tel : "",

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

  const onSubmit = async (finaldata: any) => {
  
    const data = { ...formData, ...finaldata };

    try {
      if (!storeId) {
        toast.error("No cuenta con el id de la tienda");
        return;
      }

      const detailsParts = [];
      if (data.addressDetails)
        detailsParts.push(`Detalles: ${data.addressDetails}`);
      if (data.nearbyReference)
        detailsParts.push(`Referencia cercana: ${data.nearbyReference}`);
      if (data.additionalNotes)
        detailsParts.push(`Notas adicionales: ${data.additionalNotes}`);
      const details = detailsParts.join(" | ");

      const submitData = {
        store_id: Number(storeId),
        name: data.name,
        phone_number: data.phone_number,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        social_branches: data.social_networks || [],
        criteria: data.criteria,
        details,
      };

      const branchResponse = await registerBranchMutation.mutateAsync(
        submitData
      );

      await registerCriteriaMutation.mutateAsync({
        branchId: branchResponse.branch.id,
        criteriaResponseData: data.criteria,
      });

      if(tel || nameStore){
        localStorage.removeItem("tel")
        localStorage.removeItem("store")
      }

      methods.reset();
      const name = localStorage.getItem("nameStore");
      showSuccessToast(name);

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
          >
            {/* Encabezado moderno */}
            <FormHeader
              getGreeting={getGreeting}
              getStepTitle={title}
              getStepDescription={description}
              getStepIcon={icon}
              totalSteps={RegisterStoreBrancheSchema.length}
              steps={step}
              colorProccessBar={"bg-gradient-to-r from-amber-400 to-orange-400"}
            ></FormHeader>

            {/* Contenido del formulario con altura adaptativa */}
            <div
              className={` h-full min-h-[70vh] md:min-h-[60vh] max-h-[75vh] scrollbar-subtle pb-24 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent`}
            >
              <form>
                <CardContent className={`p-4 sm:p-4 md:p-5 rounded-2xl`}>
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    {step === 0 && (
                      <StepTransition
                        step="step1"
                        className="overflow-hidden border p-3 border-blue-100 shadow-inner h-full flex-grow"
                      >
                        <RegisterStoreBrancheStep1
                          register={methods.register}
                          error={methods.formState.errors}
                        />
                      </StepTransition>
                    )}

                    {step === 1 && (
                      <StepTransition
                        step="step2"
                        className="p-3 sm:p-4  bg-amber-50/40 rounded-xl sm:rounded-2xl border  border-amber-100"
                      >
                        <RegisterStoreBrancheStep2
                          methods={methods}
                          criteria={criteria || []}
                        />
                      </StepTransition>
                    )}

                    {step === 2 && (
                      <StepTransition
                        step="step3"
                        className="rounded-xl sm:rounded-2xl overflow-hidden border border-blue-100 shadow-inner flex-grow w-full"
                      >
                        <ButtonChevronUp Id_redirect={"card-top"} />

                        <MapSearch
                          initialAddress={baseAddress}
                          initialLat={methods.watch("latitude")}
                          initialLng={methods.watch("longitude")}
                          isLargeSize={true}
                          onLocationSelect={onLocationSelect}
                        />
                      </StepTransition>
                    )}

                    {step === 3 && (
                      <StepTransition
                        step="step4"
                        className="p-3 sm:p-4  rounded-xl sm:rounded-2xl border-none"
                      >
                        <RegisterStoreBrancheStep3
                          baseAddress={baseAddress}
                          errors={methods.formState.errors}
                          register={methods.register}
                        />
                      </StepTransition>
                    )}

                    {step === 4 && (
                      <StepTransition
                        step="step5"
                        className="p-3 sm:p-4 bg-purple-50/40 rounded-xl sm:rounded-2xl border border-purple-100"
                      >
                        <SocialNetworksForm
                          register={methods.register}
                          control={methods.control}
                          error={methods.formState.errors}
                          availableSocialNetworks={socialNetworks}
                        />
                      </StepTransition>
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
