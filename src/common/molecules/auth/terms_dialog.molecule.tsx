import React from "react";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogClose,DialogOverlay} from "@/common/ui/dialog";
import { Button } from "@/common/ui/button";
import { Checkbox } from "@/common/ui/checkbox";
import { ScrollArea } from "@/common/ui/scroll-area";
import { Coffee, Lock, Shield, FileCheck } from'@/common/ui/icons';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const TermsDialog = ({
  open,
  onOpenChange,
  onAccept,
  checked,
  onCheckedChange,
}: TermsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
      <DialogContent 
        className="max-w-md sm:max-w-lg md:max-w-xl w-[90vw] border-none shadow-xl 
                  p-0 rounded-lg overflow-hidden bg-white flex flex-col max-h-[90vh] sm:max-h-[85vh]
                  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-[#6F4E37] p-3 sm:p-4 flex-shrink-0">
          <DialogHeader className="text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-full">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-medium">
                Tratamiento de Datos
              </DialogTitle>
            </div>
            <DialogDescription className="text-amber-50 pt-1 sm:pt-2 text-xs sm:text-sm">
              Antes de registrarte, por favor lee el tratamiento de datos...
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-grow p-3 sm:p-4 bg-white overflow-auto">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <Coffee className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">1. Introducción</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Encafeina2, comprometido con la protección de la privacidad de sus usuarios y cumpliendo 
                  con las disposiciones establecidas en la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la 
                  República de Colombia, solicita su autorización para el tratamiento de sus datos personales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <FileCheck className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">2. Información Solicitada</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Para el registro de usuarios en nuestra plataforma, requerimos los siguientes datos:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 list-disc pl-4 sm:pl-5 space-y-1 mb-2 sm:mb-3">
                  <li>Nombre</li>
                  <li>Apellidos</li>
                  <li>Correo Electrónico</li>
                  <li>Número de Celular</li>
                </ul>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Para el registro de tiendas, requerimos los siguientes datos:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 list-disc pl-4 sm:pl-5 space-y-1">
                  <li>Razón Social o Nombre</li>
                  <li>NIT</li>
                  <li>Correo Electrónico</li>
                  <li>Número de Celular</li>
                  <li>Dirección</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <Lock className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">3. Finalidad del Tratamiento</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Los datos personales suministrados serán utilizados para las siguientes finalidades:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 list-disc pl-4 sm:pl-5 space-y-1">
                  <li>Verificar la identidad de los usuarios y tiendas registradas.</li>
                  <li>Facilitar la comunicación entre Encafeina2 y sus usuarios.</li>
                  <li>Realizar encuestas de satisfacción y análisis de mercado.</li>
                  <li>Enviar promociones, ofertas y mensajes publicitarios relacionados.</li>
                  <li>Cumplir con obligaciones legales y regulatorias aplicables.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <Shield className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">4. Derechos del Titular</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-2">
                  Los titulares de los datos tienen derecho a:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 list-disc pl-4 sm:pl-5 space-y-1">
                  <li>Conocer, actualizar y rectificar sus datos personales.</li>
                  <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
                  <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
                  <li>Presentar quejas ante la SIC por infracciones a las disposiciones.</li>
                  <li>Revocar la autorización y/o solicitar la supresión de los datos.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <FileCheck className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">5. Autorización</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Al aceptar los términos y condiciones de este documento, usted otorga su consentimiento 
                  expreso e informado para que Encafeina2 trate sus datos personales de acuerdo con las 
                  finalidades aquí establecidas.
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
                  Si no está de acuerdo con estos términos, le solicitamos que se abstenga de utilizar nuestra plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-amber-100 p-1.5 rounded-md mt-0.5 flex-shrink-0">
                <Coffee className="h-4 w-4 text-[#6F4E37]" />
              </div>
              <div>
                <h3 className="font-medium text-[#6F4E37] mb-1 text-sm sm:text-base">6. Contacto</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Para consultas o solicitudes, comuníquese vía 
                  <a href="mailto:encafeinadoscompany@gmail.com" className="text-amber-700 font-medium"> email</a> o 
                  al celular <span className="text-amber-700 font-medium">300 629 2795</span>.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-start space-x-2 mb-3">
            <Checkbox
              id="terms"
              checked={checked}
              onCheckedChange={onCheckedChange}
              className="border-[#D4A76A] text-[#6F4E37] mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm text-gray-700 leading-tight"
            >
              He leído y acepto los términos y condiciones para el tratamiento de mis datos personales.
            </label>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-3">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-200 w-full sm:w-auto text-xs sm:text-sm py-1 px-3 h-8 sm:h-9">
                Cerrar
              </Button>
            </DialogClose>
            <Button 
              onClick={onAccept} 
              disabled={!checked}
              className={`${checked ? 'bg-[#6F4E37] hover:bg-[#5d4230]' : 'bg-gray-300'} text-white w-full sm:w-auto text-xs sm:text-sm py-1 px-3 h-8 sm:h-9`}
            >
              Aceptar y Continuar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};