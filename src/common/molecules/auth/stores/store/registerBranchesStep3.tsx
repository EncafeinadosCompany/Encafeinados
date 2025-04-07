"use client"

import { useState } from "react"
import { Button } from "@/common/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/common/ui/drawer"
import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import { RadioGroup, RadioGroupItem } from "@/common/ui/radio-group"
import { InputForm } from "@/common/atoms/auth/inputForm"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { Phone, Store } from "lucide-react"
import MapSearch from "@/common/widgets/map/mapSearch"


export default function BranchRegistrationDrawer() {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const { registerWithFocus, focusedField } = useRegisterFocus()
    const [formData, setFormData] = useState({
        branchName: "",
        phoneNumber: "",
        hasBarista: "",
        hasSpecialtyCoffee: "",
        baristaImage: null,
    })

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, baristaImage: file }))
        }
    }

    const nextStep = () => {
        setStep((prev) => prev + 1)
    }

    const prevStep = () => {
        setStep((prev) => prev - 1)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Registrar Nueva Sucursal</Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] max-h-[85vh] border-none bg-white">
                <DrawerHeader className="flex justify-between ">
                    <div>
                        <DrawerTitle className="text-amber-950 text-[18px]">Registro de Sucursal</DrawerTitle>
                        <DrawerDescription>
                            {step === 1 && "Ingrese la información básica de la sucursal"}
                            {step === 2 && "Seleccione la ubicación en el mapa"}
                            {step === 3 && "Complete la dirección detallada"}
                            {step === 4 && "Responda las preguntas adicionales"}
                        </DrawerDescription>
                    </div>
                    <div className="absolute right-4 top-4">
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                <span className="sr-only">Close</span>
                                ✕
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="px-4 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4 sm:space-y-6 grid p-0 md:grid-cols-2  min-h-[250px]">
                            <div className="relative hidden md:flex items-center justify-center w-full h-full rounded-xl overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center p-10">
                                    <img
                                        src="/cafeino.png"
                                        alt="Café"
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:p-5 gap-8 py-4">
                                <div className="grid gap-2 relative">
                                    <Label htmlFor="name_branches" className={`flex items-center text-xs transition-colors ${focusedField === "name_branches" ? "text-[#3e90a4]" : "text-gray-600"
                                        }`}>Nombre de la sucursal</Label>
                                    <div className="relative">
                                        <Store className="absolute top-3 left-4 text-gray-400" size={18} />

                                        <InputForm
                                            id="branchName"
                                            name="branchName"
                                            value={formData.branchName}
                                            onChange={handleInputChange}
                                            className="pl-10"
                                            placeholder="Ingrese el nombre de la sucursal"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name_branches" className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#3e90a4]" : "text-gray-600"
                                        }`}>Número de teléfono</Label>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-4 text-gray-400" size={18} />


                                        <InputForm
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Ingrese el número de teléfono"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="border-none p-4 flex items-center justify-center bg-muted">
                                <MapSearch
                                    onLocationSelect={(location) => console.log("Location selected:", location)}
                                >

                                </MapSearch>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="border rounded-md p-4 h-[300px] flex items-center justify-center bg-muted">
                                <p className="text-muted-foreground">Espacio para dirección detallada (componente existente)</p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>¿La cafetería cuenta con un barista de especialidad?</Label>
                                    <RadioGroup
                                        name="hasBarista"
                                        value={formData.hasBarista}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, hasBarista: value }))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="barista-yes" />
                                            <Label htmlFor="barista-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="barista-no" />
                                            <Label htmlFor="barista-no" className="text-gray-500">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    {formData.hasBarista === "yes" && (
                                        <div className="grid grid-cols-1  items-center gap-2">
                                            <Label htmlFor="baristaImage" className="md:py-4">Imagen del barista</Label>

                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                                <Input
                                                    id="baristaImage"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />

                                                <label
                                                    htmlFor="baristaImage"
                                                    className="cursor-pointer px-3 py-1.5 text-sm bg-amber-500 text-white font-medium rounded-full shadow hover:bg-amber-600 transition"
                                                >
                                                    Elegir archivo
                                                </label>

                                                {formData.baristaImage && (
                                                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                                        {(formData.baristaImage as File)?.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>¿Cuentan con un café de especialidad?</Label>
                                    <RadioGroup
                                        name="hasSpecialtyCoffee"
                                        value={formData.hasSpecialtyCoffee}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, hasSpecialtyCoffee: value }))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="specialty-yes" />
                                            <Label htmlFor="specialty-yes">Sí</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="specialty-no" />
                                            <Label htmlFor="specialty-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DrawerFooter className="pt-2">
                    <div className="flex justify-between w-full">
                        {step > 1 && (
                            <Button variant="outline" onClick={prevStep}>
                                Anterior
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button onClick={nextStep} className={step > 1 ? "" : "ml-auto"}>
                                Siguiente
                            </Button>
                        ) : (
                            <Button className="ml-auto">Guardar</Button>
                        )}
                    </div>

                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

