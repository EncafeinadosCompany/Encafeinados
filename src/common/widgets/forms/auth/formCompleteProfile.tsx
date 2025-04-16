import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegisterCoffeloverMutation } from "@/api/mutations/coffelover/coffeloverMutation";
import { Button } from "@/common/ui/button";
import { motion } from "framer-motion";
import { TitleForm } from "@/common/atoms/auth/titleForm";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrentfinishSchema, registerCoffeeloverGoogleSchema } from "@/common/utils/schemas/auth/registerCoffeeloverSchema";
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument";
import { InputForm } from "@/common/atoms/auth/inputForm";
import { TermConditions } from "./termConditions";
import { TextError } from "@/common/atoms/textError";


const CompletePerfil = () => {
  const navigate = useNavigate();
  const useRegisterCoffeelover = useRegisterCoffeloverMutation();
  const [formData, setFormData] = useState({
    full_name: "",
    type_document: "CC",
    number_document: "",
    phone_number: "",
  });

  const { register, control, formState: { errors }, handleSubmit } = useForm<CurrentfinishSchema>({
    resolver: zodResolver(registerCoffeeloverGoogleSchema),
    defaultValues: {
      full_name: "",
      type_document: "",
      number_document: "",
      phone_number: ""
    },
    mode: "onChange"
  });

  useEffect(() => {
    const tempUserData = sessionStorage.getItem("tempUserData");
    if (tempUserData) {
      const userData = JSON.parse(tempUserData);
      setFormData({ ...userData.personData });
    }
  }, []);

    const onSubmit = async (data: any) => {
    const tempUserData = JSON.parse(sessionStorage.getItem("tempUserData") || "{}");
    const updatedUserData = { ...tempUserData, personData: data };

    await useRegisterCoffeelover.mutateAsync(updatedUserData).then((response) => {
      toast.success("Perfil completado correctamente. ¡Bienvenido!");
      sessionStorage.removeItem("tempUserData");
      navigate("/login");
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4  bg-gradient-to-b from-orange-100 to-orange-300 sm:to-orange-200" >
      <motion.div
        className="max-w-2xl w-full "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-8 mb-6">
          <TitleForm
            title="Completa tu perfil"
            subtitle="Necesitamos algunos datos adicionales para completar tu registro y brindarte una mejor experiencia."
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-10 rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <InputForm
                id="full_name"
                type="text"
                value={formData.full_name}
                {...register("full_name")}
                placeholder="Nombre completo"
              // className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">

                <label htmlFor="phone_number" className="block text-sm font-medium  text-gray-700">Tipo de documento</label>
                <Controller
                  control={control}
                  name="type_document"
                  render={({ field }) => (
                    <SelectTypeDocument
                      className="rounded-full"
                      onValueChange={field.onChange}
                      value={field.value}
                    />

                  )} />
                {errors?.type_document && <TextError>{errors.type_document.message}</TextError>}
              </div>

              <div className="space-y-2">
                <label htmlFor="number_document" className="block text-sm font-medium text-gray-700">
                  Número de documento
                </label>
                <InputForm
                  id="number_document"
                  type="number"
                  {...register("number_document")}
                  placeholder="Número de documento"
                // className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors?.number_document && <TextError>{errors.number_document.message}</TextError>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone_number" className="block text-sm font-medium  text-gray-700">
                Número de teléfono
              </label>
              <InputForm
                id="phone_number"
                type="tel"
                {...register("phone_number")}
                placeholder="Número de teléfono"
              />
              {errors?.phone_number && <TextError>{errors.phone_number.message}</TextError>}
            </div>
            <div>
              <TermConditions
                register={register}
                control={control}
                errors={errors}/>
            </div>
          </div>

          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg px-6 py-2 text-white"
              >
                Guardar perfil
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CompletePerfil;