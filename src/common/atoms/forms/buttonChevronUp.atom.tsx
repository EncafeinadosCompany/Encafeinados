import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

interface ButtonChevronUpProps {
  Id_redirect: string;
}
export default function ButtonChevronUp({ Id_redirect }: ButtonChevronUpProps) {
  return (
    <div className="absolute block lg:hidden bottom-10 left-1/2 transform -translate-x-1/2 z-10">
      <motion.button
        type="button"
        onClick={() => {
          const cardTop = document.getElementById(Id_redirect);
          if (cardTop) {
            cardTop.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
        initial={{ opacity: 0.5 }}
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <ChevronUp className="h-4 w-4 text-[#6F4E37]" />
      </motion.button>
    </div>
  );
}
