import { motion } from "framer-motion"
import CardRegister from "@/common/atoms/auth/cardRegister"
import { LinkReturn } from "./LinkReturn"

export default function CuestionCard() {
  return (
    <div className=" bg-gradient-to-b from-orange-100 to-orange-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen">
        <LinkReturn link="/login" className="m-2 xl:m-10"></LinkReturn>
        <div className="flex flex-col items-center justify-center p-4 sm:p-3">
          <div className="w-full max-w-sm sm:max-w-md ">

            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-3"
            >

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl sm:text-3xl font-medium text-[#5a3e2b]"
              >
                Registrarse
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-amber-700 mt-2 mb-10 text-sm sm:text-base"
              >
                ¿Cómo te gustaría unirte a nuestra comunidad?
              </motion.p>
            </motion.div>

            {/* Tarjetas con diseño inspirado en la imagen */}
            <div className="grid gap-4 ">
              <CardRegister
                link="/coffee-lover-registration"
                title="CoffeeLover"
                subtitle="Amante del Café"
                description="Para Amantes del café, que buscan las mejores cafeterías de especialidad 
                y quieren vivir las mejores experiencias sensoriales alrededor del café."
              ></CardRegister>
              <CardRegister
                link="/store-registration"
                title="Tienda"
               
                subtitle="Cafetería de Especialidad"
                description="Haz parte del selecto club de cafeterías de especialidad, 
                enamora a los coffeelovers con tu café de especialidad y con tus especialidades alrededor del café."
              ></CardRegister>

            </div>

            {/* Footer con elementos decorativos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 text-center"
            >
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  )

}

