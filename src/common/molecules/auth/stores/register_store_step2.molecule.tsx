import { CurrentSchema } from "@/common/utils/schemas/auth/register_store_shema"
import {  UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import { pageVariants } from "@/common/atoms/auth/page_variants.atom"
import { TitleForm } from "@/common/atoms/auth/title_form.atom"
import Imagen from "@/common/widgets/Image/image_full.widget"

interface registerStoreProps {
    register: UseFormRegister<CurrentSchema>
    errors: any
    direction: number
    control: any
}

const RegisterStoreStep2 = ({register, errors, direction, control}:registerStoreProps) =>{
    return ( 
        <motion.div
        key="step2"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
        style={{ perspective: "1000px" }}>
        <div className=" m-4">
            <div className="grid grid-cols-1  gap-10">
                <div className="space-y-2">
                  <Imagen
                  register={register}
                  errors={errors}
                  direction={direction}
                  control={control}    
                  ></Imagen>
                </div>
                {/* <div className="space-y-2  flex flex-col text-center">
                    <TitleForm
                    title="Es momento de subir tu logo"
                    subtitle="Es importante para nosotros darte a conocer comó tienda que ofrece café de especialidad"
                    >         
                    </TitleForm>

                </div> */}
            </div>
        </div>
    </motion.div>
    )

}

export default RegisterStoreStep2