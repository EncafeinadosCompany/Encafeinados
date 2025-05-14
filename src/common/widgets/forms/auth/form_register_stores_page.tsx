import { Input } from "@/common/ui/input";
import { Label } from "@radix-ui/react-label";
import { Store, Phone, Coffee } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextError } from "@/common/atoms/textError";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card";
import SocialNetworksForm from "./form_social_network.widget";
import { RegisterStoreBranchePage, RegisterStoreBranchePageSchemas } from "@/common/utils/schemas/auth/register_branches_page.schema";
import { useSocialNetworksQuery } from "@/api/queries/social_networks/social_networks.query";
import MapSearch from "../../map/map_search.widget";
import { useState } from "react";
import { Textarea } from "@/common/ui/textarea";
import { InputForm } from "@/common/atoms/auth/input_form.atom";
import { Button } from "@/common/ui/button";
import RegisterStoreBrancheStep2 from "@/common/molecules/auth/stores/register_store_branche_step2.molecule";
import { useCriteria } from "@/api/queries/criteria/criteria.query";
import { AnimatePresence, motion } from "framer-motion";
import { renderRadioGroup } from "@/common/atoms/RenderRadio";



type FormData = {
    name: string;
    phone_number: string;
};

export default function FormRegisterBranchPage() {
    const { data: socialNetworks } = useSocialNetworksQuery();
    const [baseAddress, setBaseAddress] = useState("");
    const { data: criteria } = useCriteria();
    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<RegisterStoreBranchePage>({
        resolver: zodResolver(RegisterStoreBranchePageSchemas),
        mode: "onChange",
        defaultValues: {
            name: "",
            phone_number: ""
        }
    });

    const watchedCriteria = watch("criteria");

    const onLocationSelect = (lat: number, lng: number, address: string) => {
        setValue("latitude", lat, { shouldValidate: true });
        setValue("longitude", lng, { shouldValidate: true });
        setValue("address", address, { shouldValidate: true });
        setBaseAddress(address);
    }

    return (
        <div className="min-h-screen bg-[#FAF6F3] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg border-none bg-white">
                    <CardHeader className="flex flex-col items-center relative z-10">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                                <Coffee className="text-white" size={24} />
                            </div>
                            <CardTitle className="text-[#020F17] font-semibold text-xl">
                                Registrar una nueva sucursal
                            </CardTitle>
                        </div>
                        <div className="flex items-center space-x-1 ">
                            <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                            <div className="text-[#DB8935]">●</div>
                            <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                        </div>
                        <p className="text-[#546F75] text-sm text-center max-w-xs">

                            "Formulario para registrar una sucursal"

                        </p>

                        <div className="absolute opacity-5 -right-0 -top-0">
                            <Store className="text-[#2B2B2B]" size={120} />
                        </div>

                    </CardHeader>
                    <CardContent className="p-6 space-y-4">

                        <div className="grid gap-6 md:grid-cols-1">
                            <form>
                                <div className="grid grid-cols-2 md:grid-cols-2 space-x-2 md:px-10">
                                    {/* Nombre de la sucursal */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                                            Nombre de la sucursal
                                        </Label>
                                        <div className="relative">
                                            <Store className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                placeholder="Ej: Café del Centro"
                                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 
                                                 focus:ring-2 focus:ring-amber-200 focus:border-amber-400
                                                 bg-white/80 backdrop-blur-sm"
                                            />
                                            {errors.name && (
                                                <TextError>{errors.name.message}</TextError>
                                            )}
                                        </div>
                                    </div>

                                    {/* Número de teléfono */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
                                            Número de teléfono
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute h-4 w-4 top-3 left-3 text-gray-500" />
                                            <Input
                                                id="phone"
                                                {...register("phone_number")}
                                                placeholder="Ej: +1234567890"
                                                type="tel"
                                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 
                                                 focus:ring-2 focus:ring-amber-200 focus:border-amber-400
                                                 bg-white/80 backdrop-blur-sm"
                                            />
                                            {errors.phone_number && (
                                                <TextError>{errors.phone_number.message}</TextError>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Incluye el código de país para números internacionales
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {criteria?.map((criterion) => {
                                        const criteriaId = criterion.id.toString();
                                        const selectedValue = watchedCriteria?.[criteriaId]?.response_text;

                                        return (
                                            <div key={criteriaId} className="border-none rounded m-2 p-4 space-y-4 bg-white shadow-lg">
                                                <div>
                                                    <Label className="font-semibold m-1 text-amber-800">{criterion.name}</Label>
                                                    <p className="text-xs md:text-sm text-gray-500">{criterion.description}</p>
                                                </div>

                                                <Controller
                                                    control={control}
                                                    name={`criteria.${criteriaId}.response_text`}
                                                    render={({ field }) => renderRadioGroup(criteriaId, field)}
                                                />

                                                {selectedValue === "other" && (
                                                    <Controller
                                                        control={control}
                                                        name={`criteria.${criteriaId}.other_text`}
                                                        render={({ field }) => (
                                                            <Input
                                                                placeholder="Escribe tu respuesta"
                                                                data-testid={`criteria-${criteriaId}-other-text`}
                                                                value={field.value ?? ""}
                                                                onChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                {criterion.requires_image && selectedValue === "yes" && (
                                                    <Controller
                                                        control={control}
                                                        name={`criteria.${criteriaId}.image_url`}
                                                        render={({ field }) => (
                                                            <div className="flex flex-col gap-2">
                                                                <Label>Sube una imagen:</Label>
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    data-testid={`criteria-${criteriaId}-image-upload`}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const preview = URL.createObjectURL(file);

                                                                            // Guardás ambos valores en RHF
                                                                            field.onChange({
                                                                                file,
                                                                                preview,
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                {typeof field.value === 'object' && field.value?.preview && (
                                                                    <img
                                                                        src={field.value.preview}
                                                                        alt="Preview"
                                                                        className="w-32 h-auto mt-2 rounded shadow"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                )}

                                                {(errors as any).criteria?.[criteriaId]?.response_text && (
                                                    <AnimatePresence>
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 5 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="pt-2 flex flex-col justify-center items-end"
                                                        >
                                                            <p className="text-[0.75rem] text-amber-900 bg-[#F5E4D2] px-3 py-1 rounded-full w-fit shadow-sm">
                                                                {(errors as any).criteria?.[criteriaId]?.response_text?.message}
                                                            </p>
                                                        </motion.div>
                                                    </AnimatePresence>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2 m-6 ">
                                    <MapSearch
                                        initialAddress={baseAddress}
                                        initialLat={watch("latitude")}
                                        initialLng={watch("longitude")}
                                        onLocationSelect={onLocationSelect}>
                                    </MapSearch>
                                    <div>

                                        <div className="space-y-2">
                                            <Label htmlFor="addressDetails" className={`flex items-center text-xs transition-colors"
                                                }`}>
                                                Número y detalles adicionales *
                                            </Label>
                                            <InputForm
                                                id="addressDetails"
                                                {...register("addressDetails")}

                                                placeholder="Ej. Calle 123 #45-67"
                                                className="rounded-full text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                                            />
                                            {errors.addressDetails && (
                                                <p className="text-sm text-red-500">{errors.addressDetails.message as string}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">

                                            <div className="space-y-2">
                                                <Label htmlFor="nearbyReference" className={`flex items-center text-xs transition-colors "
                                                    }`}>
                                                    Referencia cercana (Opcional)
                                                </Label>
                                                <Input
                                                    id="nearbyReference"
                                                    {...register("nearbyReference")}

                                                    placeholder="Ej. Frente a la panadería"
                                                    className="rounded-full text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Additional notes (Optional) */}
                                        <div className="space-y-2">
                                            <Label htmlFor="additionalNotes" className={`flex items-center text-xs transition-colors 
                                                }`}>
                                                <span className="mr-2">📜</span> Notas adicionales (Opcional)
                                            </Label>
                                            <Textarea
                                                id="additionalNotes"
                                                {...register("additionalNotes")}

                                                placeholder="Instrucciones especiales para la entrega, puntos de referencia, etc."
                                                className="rounded-md text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                                                rows={2} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 m-4">
                                    <SocialNetworksForm
                                        register={register}
                                        control={control}
                                        error={errors}
                                        availableSocialNetworks={socialNetworks}
                                    >
                                    </SocialNetworksForm>
                                </div>
                                <div className="w-full flex items-center">
                                    <Button className="bg-amber-600 hover:bg-amber-700 w-2xl text-white mx-auto" >Registrar Sucursal</Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}