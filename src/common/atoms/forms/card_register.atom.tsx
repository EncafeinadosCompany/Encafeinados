
import { motion } from "framer-motion"
import { Store } from "@/common/ui/icons"
import { Link } from "react-router-dom"

interface CartProps {
  link: string
  title: string
  subtitle: string
  description: string
  icon?: React.ReactNode
}

const CardRegister = ({ link, title, subtitle, description, icon }: CartProps) => {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white/90 rounded-2xl shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center mb-1">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="bg-amber-100 rounded-lg p-2 mr-3"
          >
            {icon ? (
              icon
            ) : (
              <Store className="w-8 h-8 text-amber-600" />
            )}
          </motion.div>
          <h3 className="text-lg font-medium text-[#5a3e2b]">{title}</h3>
        </div>

        <Link
          to={`${link}`}
          className="block mt-4"
           data-testid={`card-link-${title.toLowerCase()}`} 
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#f8f4e9] min-h-[22vh] rounded-xl p-5 hover:shadow-md transition-shadow duration-300"
          >
            <div className="grid items-center min-h-[20vh]">
              <div className="flex justify-between items-center space-x-3 w-full">
              <div className="flex flex-col justify-center">
                <h4 className="text-xl font-semibold text-[#5a7d5a] mb-2 text-center">{subtitle}</h4>
                <p className="text-[#5a3e2b] text-sm text-center">{description}</p>
              </div>
              <motion.div
                whileHover={{ x: 3 }}
                className="bg-[#8b5e34] rounded-full p-2 text-white flex items-center justify-center"
              >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}


export default CardRegister