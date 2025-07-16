import { motion } from "framer-motion";
import CardRegister from "@/common/atoms/forms/card_register.atom";
import { User } from "@/common/ui/icons";

export default function CuestionCard() {
  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-4xl ">
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">

        <CardRegister
          icon={<User className="w-8 h-8 text-amber-600" />}
          link="/coffee-lover-registration"
          title="CoffeeLover"
          subtitle="Inicia esta nueva aventura como CoffeeLover"
          description="Descubre las mejores cafeterías de especialidad y los mejores planes para los amantes del café."
        ></CardRegister>

        <CardRegister
          link="/store-registration"
          title="Tienda"
          subtitle="Cafetería de Especialidad"
          description="Únete al club exclusivo de cafeterías que celebran el arte del café de especialidad. 
                Conquista a los coffeelovers con tus experiencias únicas, tu pasión por el café y las especialidades que ofreces con amor en cada taza."
        ></CardRegister>
      </div>

      {/* Footer con elementos decorativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-6 text-center"
      ></motion.div>
    </div>
  );
}
