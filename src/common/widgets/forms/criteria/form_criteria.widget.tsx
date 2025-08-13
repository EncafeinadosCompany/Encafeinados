import { useEffect, useMemo } from "react";

import { FormProvider, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/common/ui/card";

import RegisterStoreBrancheStep2 from "@/common/molecules/auth/stores/register_store_branche_step2.molecule";
import { useCriteria } from "@/api/queries/criteria/criteria.query";
import { FormHeader } from "@/common/molecules/form/form_header.molecule";
import { getGreeting } from "@/common/utils/get_greeting.utils";
import { useRegisterCriteriaMutation } from "@/api/mutations/criteria/criteria.mutation";
import {
  RegisterCriteriaSchema,
  RegisterCriteriaSchemaType,
} from "@/common/utils/schemas/criteria/register_criteria.schemas";
import toast from "react-hot-toast";
import { ButtonSuccess } from "@/common/atoms/forms/button_success.atom";
import { Pen } from "lucide-react";

interface RegisterCriteriProps {
  branchId: string;
}
const RegisterCriteriaWidget = ({ branchId }: RegisterCriteriProps) => {
  const { data: criteria } = useCriteria();

  const registerCriteriaMutation = useRegisterCriteriaMutation();

  const methods = useForm<RegisterCriteriaSchemaType>({
    resolver: zodResolver(RegisterCriteriaSchema),
    defaultValues: {
      criteria: {},
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (criteria && criteria.length > 0) {
      const currentCriteria = methods.getValues("criteria");
      const hasEmptyCriteria = Object.keys(currentCriteria || {}).length === 0;

      if (hasEmptyCriteria) {
        const newCriteria = criteria.reduce((acc, c) => {
          acc[String(c.id)] = {
            response_text: "",
            image_url: undefined,
            other_text: "",
          };
          return acc;
        }, {} as Record<string, { response_text: string; image_url?: string; other_text?: string }>);

        methods.reset({ criteria: newCriteria }); // Usar reset en lugar de setValue
      }
    }
  }, [criteria]);

  const onSubmit = async (data: any) => {
    try {
      await registerCriteriaMutation.mutateAsync({
        branchId: Number(branchId),
        criteriaResponseData: data.criteria,
      });
      toast.success(
        "¡Gracias por llenar la información!, estaremos comunicandonos por medio de tu correo eléctronico",
        { duration: 5000 }
      );
      window.location.replace("/");
    } catch (err) {
      console.error("Error during submission:", err);
    }
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
              getStepTitle={"Criterios"}
              getStepDescription={"Es tu momento"}
              getStepIcon={<Pen />}
              isLoaginBar={false}
              colorProccessBar={"bg-gradient-to-r from-amber-400 to-orange-400"}
            ></FormHeader>

            {/* Contenido del formulario con altura adaptativa */}
            <div
              className={` h-full min-h-[70vh] md:min-h-[60vh] max-h-[60vh] scrollbar-subtle pb-24 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent`}
            >
              <form>
                <CardContent className={`p-4 sm:p-4 md:p-5 rounded-2xl`}>
                  <RegisterStoreBrancheStep2
                    methods={methods}
                    criteria={criteria || []}
                  />
                </CardContent>
                {/* Footer con botones responsivos */}
                <CardFooter className="absolute bottom-0 w-full px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-t border-gray-100  rounded-lg bg-gray-50">
                  <div className=" flex justify-between w-full">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="ml-auto"
                    >
                      <ButtonSuccess
                        type="button"
                        aria-label="Completar registro de criterios"
                        title="Enviar formulario de criterios"
                        onClick={methods.handleSubmit(onSubmit)}
                      >
                        {registerCriteriaMutation.isPending
                          ? "Registrando..."
                          : "Completar registro"}
                      </ButtonSuccess>
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
};

export default RegisterCriteriaWidget;
