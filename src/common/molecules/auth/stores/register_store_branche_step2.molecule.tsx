import { Input } from "@/common/ui/input";
import { Label } from "@/common/ui/label";
import { Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { renderRadioGroup } from "@/common/atoms/criteria/render_radio.atom";
import { criteriaResponseData } from "@/api/types/criteria/criteria.types";
import { Image as ImageIcon, Check } from "lucide-react";

interface RegisterStoreBrancheStep2Props {
  methods: any;
  criteria: criteriaResponseData[];
}

export default function RegisterStoreBrancheStep2({ methods, criteria }: RegisterStoreBrancheStep2Props) {
  const watchedCriteria = methods.watch("criteria");

  return (
    <div className="space-y-5">
      {criteria.map((criterion) => {
        const criteriaId = criterion.id.toString();
        const selectedValue = watchedCriteria?.[criteriaId]?.response_text;
        const isCompleted = !!selectedValue;

        return (
          <div 
            key={criteriaId} 
            className={`
              relative overflow-hidden rounded-2xl border transition-all duration-300
              ${isCompleted 
                ? 'border-amber-200 bg-gradient-to-br from-amber-50/80 to-white' 
                : 'border-gray-200 bg-white'}
              shadow-sm hover:shadow-md
            `}
          >
            {/* Indicador de completado */}
            {isCompleted && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            )}
            
            {/* Cabecera del criterio */}
            <div className="p-4 sm:p-5">
              <div className="flex gap-2 mb-3">
                <div className={`
                  flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium
                  ${isCompleted 
                    ? 'bg-amber-400/20 text-amber-700' 
                    : 'bg-gray-100 text-gray-500'}
                `}>
                  {criteriaId}
                </div>
                <div className="flex-1">
                  <Label className="text-base font-medium text-gray-800">{criterion.name}</Label>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">{criterion.description}</p>
                </div>
                
                {criterion.requires_image && (
                  <div className="flex-shrink-0 flex items-start">
                    <div className="p-1 rounded-md bg-amber-100/50">
                      <ImageIcon className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Opciones de respuesta */}
              <div className={`
                p-4 rounded-xl
                ${isCompleted 
                  ? 'bg-white border border-amber-100' 
                  : 'bg-gray-50 border border-gray-100'}
              `}>
                <Controller
                  control={methods.control}
                  name={`criteria.${criteriaId}.response_text`}
                  render={({ field }) => renderRadioGroup(criteriaId, field)}
                />
              </div>

              {/* Campo de texto para "other" */}
              {selectedValue === "other" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 pl-3 border-l-2 border-amber-200"
                >
                  <Controller
                    control={methods.control}
                    name={`criteria.${criteriaId}.other_text`}
                    render={({ field }) => (
                      <>
                        <Label className="text-xs text-amber-700 mb-1.5 inline-block">
                          Especifica tu respuesta:
                        </Label>
                        <Input
                          placeholder="Escribe tu respuesta personalizada"
                          data-testid={`criteria-${criteriaId}-other-text`}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="border-amber-200 focus-visible:ring-amber-400"
                        />
                      </>
                    )}
                  />
                </motion.div>
              )}

              {/* Subida de imagen */}
              {criterion.requires_image && selectedValue === "yes" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Controller
                    control={methods.control}
                    name={`criteria.${criteriaId}.image_url`}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-700 flex items-center gap-1.5">
                          <ImageIcon className="h-4 w-4 text-amber-500" />
                          Evidencia fotográfica
                        </Label>
                        
                        {!field.value?.preview ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50">
                            <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 mb-3">Sube una imagen como evidencia</p>
                            
                            <label className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer text-sm">
                              Seleccionar imagen
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                data-testid={`criteria-${criteriaId}-image-upload`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const preview = URL.createObjectURL(file);
                                    field.onChange({
                                      file,
                                      preview,
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="rounded-xl overflow-hidden border border-amber-200">
                            <div className="relative">
                              <img
                                src={field.value.preview}
                                alt="Preview"
                                className="w-full h-48 object-cover"
                              />
                              <button
                                onClick={() => field.onChange(null)}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 6L6 18"></path>
                                  <path d="M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <div className="p-3 bg-amber-50/50 text-xs text-amber-700 border-t border-amber-100">
                              Imagen cargada correctamente
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  />
                </motion.div>
              )}

              {/* Mensajes de error */}
              {(methods.formState.errors as any).criteria?.[criteriaId]?.response_text && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 flex items-center"
                  >
                    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {(methods.formState.errors as any).criteria?.[criteriaId]?.response_text?.message}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};