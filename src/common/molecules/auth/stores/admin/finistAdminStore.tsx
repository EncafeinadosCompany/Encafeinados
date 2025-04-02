import { TitleForm } from "@/common/atoms/auth/titleForm"
import { InputEmail } from "@/common/atoms/Input-email"
import { InputPassword } from "@/common/atoms/input-passwork"

import { Label } from "@radix-ui/react-label"

export const FinistAdminStore = () => {
    return(
        <>
        <div className="m-5 text-center">
            <TitleForm
                title="¡Finalicemos tu registro!"
                subtitle="Completa los siguientes campos para finalizar tu registro como administrador"
            >
            </TitleForm>
        </div>
        <div>
            <div className="space-y-6 ">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <InputEmail
                        id="email"
                        type="email"
                        // {...register('userData.email')}
                        placeholder="tiendaEspecialidad@example.com"
                    />
                    {/* {errors?.userData?.email && <p className="text-red-500">{errors.userData.email.message}</p>} */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className=" flex flex-col space-y-2">
                        <Label htmlFor="firstName">Contraseña</Label>
                        <InputPassword

                            id="firstName" placeholder="Ingresa tu contraseña"
                        />
                        {/* {errors?.personData?.name && <p className="text-red-500">{errors.personData.name.message}</p>} */}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="lastName">Confirma Contraseña</Label>
                        <InputPassword

                            id="lastName"
                            // {...register('personData.lastname')}
                            placeholder="Confirma tu contraseña" />
                        {/* {errors?.personData?.lastname && <p className="text-red-500">{errors.personData.lastname.message}</p>} */}
                    </div>
                </div>

            </div>

        </div>
        </>
    )
}