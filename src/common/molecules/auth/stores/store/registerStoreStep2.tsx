import { CurrentSchema } from "@/common/utils/schemas/auth/registerStoreShema"
import {  UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import { pageVariants } from "@/common/atoms/auth/pageVariants"
import { TitleForm } from "@/common/atoms/auth/titleForm"
import Imagen from "@/common/widgets/Image/imageFull"

interface registerStoreProps {
    register: UseFormRegister<CurrentSchema>
    errors: any
    direction: number
    control: any
}

const RegisterStoreStep2 = ({register, errors, direction, control}:registerStoreProps) =>{
    return ( 
        <motion.div
        key="step1"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="absolute w-full"
        style={{ perspective: "1000px" }}>
        <div className="space-y-2 m-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <Imagen
                  register={register}
                  errors={errors}
                  direction={direction}
                  control={control}    
                  ></Imagen>
                </div>
                <div className="space-y-2  flex flex-col text-center">
                    {/* <Controller
                        control={control}
                        name="type_document"
                        render={({ field }) => (
                            <div>
                                {errors?.type_document && <p className="text-red-500">{errors.type_document.message}</p>}
                            </div>
                        )} /> */}
                    <TitleForm
                    title="Es momento de subir tu logo"
                    subtitle="Es importante para nosotros darte a conocer comó tienda que ofrece café de especialidad"
                    >         
                    </TitleForm>

                </div>
            </div>
        </div>
    </motion.div>
    )

}

export default RegisterStoreStep2