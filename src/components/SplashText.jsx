import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const splashVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const SplashText = ({ texts, onAnimationComplete }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (texts && currentTextIndex < texts.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentTextIndex(currentTextIndex + 1);
      }, 500); // Adjust the duration as needed
      return () => clearTimeout(timeout);
    } else if (texts) {
      const timeout = setTimeout(() => {
        onAnimationComplete();
      }, 500); // Adjust the duration as needed
      return () => clearTimeout(timeout);
    }
  }, [currentTextIndex, texts, onAnimationComplete]);

  return (
    <motion.div
      key={texts ? texts[currentTextIndex] : "loading"}
      className="absolute md:top-[43.5%] ms:top-1/3 top-[45%]  md:left-[43.5%] sm:left-[39%] transform -translate-x-1/2 -translate-y-1/2 md:text-7xll text-5xl tracking-wide font-bold"
      variants={splashVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <span className="drop-shadow-[0_4px_4px_rgba(100,100,100,1)] bg-clip-text text-transparent bg-gradient-to-b from-yellow-500 to-slate-300">{texts ? texts[currentTextIndex] : ""}</span>
    </motion.div>
  );
};

SplashText.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnimationComplete: PropTypes.func,
};

export default SplashText;
