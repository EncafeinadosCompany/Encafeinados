import { motion } from "framer-motion";

const StepTransition = ({
  children,
  step,
  direction = 0,
  className = "",
}: {
  children: React.ReactNode;
  step: string | number;
  direction?: number;
  className?: string;
}) => (
  <motion.div
    key={step}
    initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default StepTransition;
