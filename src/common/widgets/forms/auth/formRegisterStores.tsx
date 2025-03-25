import { TitleForm } from "@/common/atoms/auth/titleForm"
import { LinkReturn } from "@/common/molecules/auth/LinkReturn"
import RegisterStoreStep1 from "@/common/molecules/auth/stores/registerStoreStep1"
import { motion, AnimatePresence } from "framer-motion"


const FormRegisterStores = () => {
    return (
        <div >
            <LinkReturn link="/register" >
            </LinkReturn>
            <motion.div
                className="max-w-2xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mt-8">
                    <TitleForm
                    title="Cafeteria"
                    subtitle="Disfruta"
                    >
                    </TitleForm>
                    <RegisterStoreStep1>
                    </RegisterStoreStep1>
                </div>
            </motion.div>

        </div>
    )
}

export default FormRegisterStores