import { motion} from "framer-motion"


interface TitleFormProps {
    title: string,
    subtitle: string
}

export const TitleForm = ({title, subtitle}: TitleFormProps) => {
    return (
        <div>
            <motion.h1
                className="text-2xl font-medium text-amber-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h1>
            <motion.p
                className="text-gray-500 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
        </div>
    )
}