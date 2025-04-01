import { InputForm } from "@/common/atoms/auth/inputForm"
import { TitleForm } from "@/common/atoms/auth/titleForm"
import { InputPassword } from "@/common/atoms/input-passwork"
import { Card } from "@/common/ui/card"
import { Label } from "@radix-ui/react-label"

const FinishAdminRegistration = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                  
                    <form>
                        <Card className="border bg-white p-6 shadow-2xs ">
                        <TitleForm
                        title="¡Finalicemos tu registro!"
                        subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
                    >
                    </TitleForm>
                        <div>
                            <div className="space-y-6 m-6">
                                

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <InputForm
                                        id="email"
                                        type="email"
                                        // {...register('userData.email')}
                                        placeholder="coffeelover@example.com"
                                    />
                                    {/* {errors?.userData?.email && <p className="text-red-500">{errors.userData.email.message}</p>} */}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Contraseña</Label>
                                        <InputPassword
                                           
                                            id="firstName" placeholder="Ingresa tu contraseña"
                                        />
                                        {/* {errors?.personData?.name && <p className="text-red-500">{errors.personData.name.message}</p>} */}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Confirma Contraseña</Label>
                                        <InputPassword 
                                        className="rounded-md"
                                        
                                        id="lastName"
                                            // {...register('personData.lastname')}
                                            placeholder="Confirma tu contraseña" />
                                        {/* {errors?.personData?.lastname && <p className="text-red-500">{errors.personData.lastname.message}</p>} */}
                                    </div>
                                </div>

                            </div>

                        </div>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default FinishAdminRegistration