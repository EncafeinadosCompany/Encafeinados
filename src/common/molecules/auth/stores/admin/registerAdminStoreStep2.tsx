import { pageVariants } from "@/common/atoms/auth/page_variants.atom"

import { UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"

import { useState } from "react"
import MapSearch from "@/common/widgets/map/mapSearch"


interface registerStoreProps {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any

}

const RegisterAdminStoreStep2 = ({ register, errors, direction, control }: registerStoreProps) => {

    const [location, setLocation] = useState({ lat: 0, lng: 0, address: "" });

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setLocation({ lat, lng, address });
    };

    return (
        <motion.div
            key="step1"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full"
            style={{ perspective: "1000px" }}
        >

            <div className="w-max-[500px]">
                <MapSearch onLocationSelect={(lat, lng, address) => console.log(lat, lng, address)} />
            </div>


        </motion.div>
    )
}

export default RegisterAdminStoreStep2