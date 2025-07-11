import React from 'react';
import { motion } from "framer-motion";

interface TitleFormProps {
    title: string,
    subtitle: string
    className?: string
}

export const TitleForm = ({title, subtitle, className}: TitleFormProps) => {
    return (
        <div>
            <motion.h1
                className="text-[20px] text-center sm:text-2xl font-medium text-[#1c2c50]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h1>
            <motion.p
                className={`text-[14px] text-center text-gray-500 mt-3 ${className}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
        </div>
    )
}