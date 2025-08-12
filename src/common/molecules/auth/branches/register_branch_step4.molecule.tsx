import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import storeSVG from "@/assets/images/store.svg";
import branchesSVG from "@/assets/images/branches.svg";

interface RegisterBranchProps {
  methods: UseFormReturn<any>;
}

export default function RegisterBranchStep4({ methods }: RegisterBranchProps) {
  const [show, setShow] = useState(true);
  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          ¿Cuántas sucursales tiene tu cafetería?
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          No te preocupes, si más adelante tienes más sucursales, podrás
          gestionarlas fácilmente desde tu panel
        </p>
      </div>

      {/* Contenedor responsive para las opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        {/* ✅ OPCIÓN: UNA SUCURSAL */}
        <motion.button
          type="button"
          onClick={() => {
            methods.setValue("hasMultipleBranches", false);
            setShow(true); // Mostrar imagen de store
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
          relative overflow-hidden rounded-xl p-4 sm:p-6 border-2 transition-all duration-300
          ${
            !methods.watch("hasMultipleBranches") &&
            methods.watch("hasMultipleBranches") !== undefined
              ? "border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-200"
              : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
          }
        `}
        >
          {/* Imagen de una tienda */}
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <img
                src={storeSVG}
                alt="Una sucursal"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
            Una sucursal
          </h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Tengo una sola cafetería por el momento
          </p>

          {/* Indicador de selección */}
          {!methods.watch("hasMultipleBranches") &&
            methods.watch("hasMultipleBranches") !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <BadgeCheck className="w-4 h-4 text-white" />
              </motion.div>
            )}
        </motion.button>

        {/* ✅ OPCIÓN: MÚLTIPLES SUCURSALES */}
        <motion.button
          type="button"
          onClick={() => {
            methods.setValue("hasMultipleBranches", true);
            setShow(false); // Mostrar imagen de branches
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
          relative overflow-hidden rounded-xl p-4 sm:p-6 border-2 transition-all duration-300
          ${
            methods.watch("hasMultipleBranches")
              ? "border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-200"
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
          }
        `}
        >
          {/* Imagen de múltiples sucursales */}
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src={branchesSVG}
                alt="Múltiples sucursales"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
            Varias sucursales
          </h4>
          <p className="text-xs sm:text-sm text-gray-600">
            Tengo múltiples cafeterías en diferentes ubicaciones
          </p>

          {/* Indicador de selección */}
          {methods.watch("hasMultipleBranches") && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <BadgeCheck className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* ✅ IMAGEN GRANDE CON ANIMACIÓN */}
      <AnimatePresence mode="wait">
        <motion.div
          key={show ? "single" : "multiple"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mt-6 sm:mt-8 flex justify-center"
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl shadow-md flex items-center justify-center border border-gray-100">
            {show ? (
              <img
                src={storeSVG}
                alt="Cafetería única"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            ) : (
              <img
                src={branchesSVG}
                alt="Múltiples cafeterías"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ✅ MENSAJE DE CONFIRMACIÓN */}
      <AnimatePresence>
        {methods.watch("hasMultipleBranches") !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 sm:mt-6 text-center"
          >
            <div
              className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                methods.watch("hasMultipleBranches")
                  ? "bg-blue-100 text-blue-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              <span className="mr-2">
                {methods.watch("hasMultipleBranches") ? "🏢" : "🏪"}
              </span>
              {methods.watch("hasMultipleBranches")
                ? "Perfecto, gestionaremos todas tus sucursales"
                : "Excelente, empezamos con tu primera cafetería"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ INFORMACIÓN ADICIONAL */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs sm:text-sm">💡</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-800">
            <p className="font-medium mb-1">¿Sabías que?</p>
            <p>
              Puedes agregar o editar sucursales en cualquier momento desde tu
              panel de administración. ¡No hay límite en la cantidad de
              cafeterías que puedes gestionar!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
