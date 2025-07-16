import { LinkReturn } from "@/common/molecules/auth/LinkReturn";
import CuestionCard from "@/common/molecules/auth/login/cuestion_card.molecule";
import {motion} from "framer-motion";


export default function CuestionCardView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-orange-100 to-orange-200 h-full flex flex-col"
    >
      <LinkReturn link="/login" className="xl:m-4"></LinkReturn>
      <div className="flex flex-col  items-center justify-center">
        <CuestionCard />
      </div>
    </motion.div>
  );
}
