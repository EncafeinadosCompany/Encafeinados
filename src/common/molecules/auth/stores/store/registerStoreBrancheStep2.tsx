import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { renderRadioGroup } from "@/common/atoms/RenderRadio";
import { criteriaResponseData } from "@/api/types/criteriaTypes";




interface RegisterStoreBrancheStep2Props {
  methods: any;
  criteria: criteriaResponseData[];
}

export default function RegisterStoreBrancheStep2({ methods, criteria }: RegisterStoreBrancheStep2Props) {
  const watchedCriteria = methods.watch("criteria");

  return (
    <>
      {criteria.map((criterion) => {
        const criteriaId = criterion.id.toString();
        const selectedValue = watchedCriteria?.[criteriaId]?.response_text;

        return (
          <div key={criteriaId} className="border-none rounded m-2 p-4 space-y-4 bg-white shadow-lg">
            <div>
              <Label className="font-semibold m-1 text-amber-800">{criterion.name}</Label>
              <p className="text-xs md:text-sm text-gray-500">{criterion.description}</p>
            </div>

            <Controller
              control={methods.control}
              name={`criteria.${criteriaId}.response_text`}
              render={({ field }) => renderRadioGroup(criteriaId, field)}
            />

            {selectedValue === "other" && (
              <Controller
                control={methods.control}
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
                control={methods.control}
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
                    {field.value?.preview && (
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

            {(methods.formState.errors as any).criteria?.[criteriaId]?.response_text && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="pt-2 flex flex-col justify-center items-end"
                >
                  <p className="text-[0.75rem] text-amber-900 bg-[#F5E4D2] px-3 py-1 rounded-full w-fit shadow-sm">
                    {(methods.formState.errors as any).criteria?.[criteriaId]?.response_text?.message}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </>
  );
};
