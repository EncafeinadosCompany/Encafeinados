import { Card, CardContent } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FormHeader } from "../../form/form_header.molecule";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import { ArrowLeft, BadgeCheck, StoreIcon } from "lucide-react";
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
    methods:any
    isPending: boolean
    baseAddress:string
    criteria:criteriaResponseData[]
    onLocationSelect:(lat: number, lng: number, address: string) => void
    socialNetworks:SocialNetworksType | undefined
    onSubmit: (data:any) => void
}


export default function RegisterBranch({methods, isPending, baseAddress, criteria, onLocationSelect, socialNetworks, onSubmit}:RegistBranchProp) {
  const [direction, setDirection] = useState(0);

return(
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
            getStepTitle={"Registro de sucursal"}
            getStepDescription={"Informacion esencial"}
            getStepIcon={<StoreIcon />}
          ></FormHeader>

          {/* Contenido del formulario con altura adaptativa */}
          <div
            className={` h-full min-h-[70vh] md:min-h-[60vh] max-h-[60vh] scrollbar-subtle pb-24 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent`}
          >
            <form>
              <CardContent className={`p-4 sm:p-4 md:p-5 rounded-2xl`}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <StepTransition
                    step="step1"
                    className="overflow-hidden border p-3 border-blue-100 shadow-inner h-full flex-grow"
                  >
                    <RegisterStoreBrancheStep1
                      register={methods.register}
                      error={methods.formState.errors}
                      control={methods.control}
                    />

                    <RegisterStoreBrancheStep2
                      methods={methods}
                      criteria={criteria || []}
                    />

                      <ButtonChevronUp Id_redirect={"card-top"} />

                      <MapSearch
                        initialAddress={baseAddress}
                        initialLat={methods.watch("latitude")}
                        initialLng={methods.watch("longitude")}
                        isLargeSize={true}
                        onLocationSelect={onLocationSelect}
                      />

             
                      <RegisterStoreBrancheStep3
                        baseAddress={baseAddress}
                        errors={methods.formState.errors}
                        register={methods.register}
                        />
             
                      <SocialNetworksForm
                        register={methods.register}
                        control={methods.control}
                        error={methods.formState.errors}
                        availableSocialNetworks={socialNetworks}
                        />
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
                        className={`text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 ${
                          !methods.formState.isValid
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                        }`}
                      >
                        <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {isPending
                          ? "Registrando..."
                          : "Completar registro"}
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
)
}
