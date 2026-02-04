import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw", // Start from left off-screen
  },
  in: {
    opacity: 1,
    x: 0, // Slide to center
  },
  out: {
    opacity: 0,
    x: "100vw", // Exit to right off-screen
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
