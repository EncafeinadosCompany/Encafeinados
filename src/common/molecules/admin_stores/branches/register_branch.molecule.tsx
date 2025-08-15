import { Card, CardContent } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FormHeader } from "../../form/form_header.molecule";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import {
  ArrowLeft,
  BadgeCheck,
  StoreIcon,
  Building2,
  MapPin,
  Globe,
  Settings,
} from "lucide-react";
import { useState } from "react";
import StepTransition from "@/common/atoms/forms/step_transition.atom";
import RegisterStoreBrancheStep1 from "../../auth/stores/register_store_branche_step1.molecule";
import RegisterStoreBrancheStep2 from "../../auth/stores/register_store_branche_step2.molecule";
import ButtonChevronUp from "@/common/atoms/forms/buttonChevronUp.atom";
import MapSearch from "@/common/widgets/map/map_search.widget";
import RegisterStoreBrancheStep3 from "../../auth/stores/register_store_branche_step3.molecule";
import SocialNetworksForm from "@/common/widgets/forms/auth/form_social_network.widget";
import { CardFooter } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { criteriaResponseData } from "@/api/types/criteria/criteria.types";
import { SocialNetworksType } from "@/api/queries/social_networks/social_networks.query";

interface RegistBranchProp {
  methods: any;
  isPending: boolean;
  baseAddress: string;
  criteria: criteriaResponseData[];
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  socialNetworks: SocialNetworksType | undefined;
  onSubmit: (data: any) => void;
}

export default function RegisterBranch({
  methods,
  isPending,
  baseAddress,
  criteria,
  onLocationSelect,
  socialNetworks,
  onSubmit,
}: RegistBranchProp) {
  const [direction, setDirection] = useState(0);

  return (
    <div className="max-w-6xl mx-auto">
      <Card
        className={`relative overflow-hidden border-0 rounded-4xl sm:rounded-3xl shadow-lg bg-white`}
      >
        <FormProvider {...methods}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FormHeader
              getGreeting={getGreeting}
              getStepTitle={"Registro de sucursal"}
              getStepDescription={"Informacion esencial"}
              getStepIcon={<StoreIcon />}
              isLoaginBar={false}
              color="white"
            ></FormHeader>

            <div
              className={`h-full pb-24`}
            >
              <form>
                <CardContent
                  className={`p-2 sm:p-4 md:p-5 rounded-2xl space-y-8`}
                >
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    <StepTransition
                      step="step1"
                      className="overflow-hidden h-full flex-grow space-y-8"
                    >
                      {/* 📋 Sección 1: Información Básica */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className=" rounded-xl border border-transparent "
                      >
                        {/* <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                              Información Básica
                            </h3>
                            <p className="text-sm text-blue-600">
                              Datos esenciales de la sucursal
                            </p>
                          </div>
                        </div> */}

                        <RegisterStoreBrancheStep1
                          register={methods.register}
                          error={methods.formState.errors}
                          isImage={false}
                        />
                      </motion.div>

                      {/* ⚙️ Sección 2: Configuración y Criterios */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-2 border border-amber-100 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Settings className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-amber-900">
                              Criterios
                            </h3>
                            <p className="text-sm text-amber-600">
                              Características y servicios disponibles
                            </p>
                          </div>
                        </div>

                        <RegisterStoreBrancheStep2
                          methods={methods}
                          criteria={criteria || []}
                        />
                      </motion.div>

                      {/* 📍 Sección 3: Ubicación */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className=" rounded-xl border border-transparent"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <MapPin className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-emerald-900">
                              Ubicación de la Sucursal
                            </h3>
                            <p className="text-sm text-emerald-600">
                              Dirección y localización en el mapa
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 bg-white rounded-2xl p-2 shadow-lg">
                          <ButtonChevronUp Id_redirect={"card-top"} />

                          <div className="bg-white ">
                            <MapSearch
                            initialAddress={baseAddress}
                            initialLat={methods.watch("latitude")}
                            initialLng={methods.watch("longitude")}
                            isLargeSize={true}
                            onLocationSelect={onLocationSelect}
                          />
                          </div>

                          <RegisterStoreBrancheStep3
                            isHead={true}
                            baseAddress={baseAddress}
                            errors={methods.formState.errors}
                            register={methods.register}
                          />
                        </div>
                      </motion.div>

                      {/* 🌐 Sección 4: Redes Sociales */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className=" rounded-xl border border-transparent"
                      >
                        <SocialNetworksForm
                          isHead={true}
                          register={methods.register}
                          control={methods.control}
                          error={methods.formState.errors}
                          availableSocialNetworks={socialNetworks}
                        />
                      </motion.div>
                    </StepTransition>
                  </AnimatePresence>
                </CardContent>

                {/* Footer con botones responsivos */}
                <CardFooter className="absolute bottom-0 w-full px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100  rounded-lg bg-gray-50">
                  <div className=" flex justify-between w-full">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="ml-auto"
                    >
                      <Button
                        type="button"
                        onClick={methods.handleSubmit(onSubmit)}
                        disabled={isPending}
                        className={`text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2  bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white`}
                      >
                        <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {isPending ? "Registrando..." : "Completar registro"}
                      </Button>
                    </motion.div>
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
