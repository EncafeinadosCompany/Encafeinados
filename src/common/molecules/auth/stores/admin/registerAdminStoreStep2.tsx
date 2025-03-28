import { pageVariants } from "@/common/atoms/auth/pageVariants"
import { Controller, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import { InputForm } from "@/common/atoms/auth/inputs-form"
import { Label } from "@radix-ui/react-label"

import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/common/ui/select"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"

import { useState } from "react"
import MapSearch from "@/common/molecules/mapSearch"

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
            <div>

                {/* <label>
                    Email
                    <input className="bg-amber-50" type="email" {...register("number_document")} />
                    {errors?.number_document && <p className="text-red-500">{errors?.number_document.message}</p>}
                </label>
                <label>
                    Email
                    <input className="bg-amber-50" type="email" {...register("phone_number")} />
                    {errors?.phone_number && <p className="text-red-500">{errors?.phone_number.message}</p>}
                </label> */}
                 <div className="w-max-[500px]">
                    {/* <h2>Registro de Cafetería</h2>
                    <MapSearch onLocationSelect={handleLocationSelect} />
                    <p>Latitud: {location.lat}</p>
                    <p>Longitud: {location.lng}</p>
                    <p>Dirección: {location.address}</p>  */}
                    <MapSearch onLocationSelect={(lat, lng, address) => console.log(lat, lng, address)} />
                </div>
            </div>
        </motion.div>
    )
}

export default RegisterAdminStoreStep2