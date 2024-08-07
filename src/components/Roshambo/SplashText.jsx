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
    if (texts && currentTextIndex < texts.length) {
      const timeout = setTimeout(() => {
        setCurrentTextIndex(currentTextIndex + 1);
      }, 550);
      return () => clearTimeout(timeout);
    } else if (texts) {
      const timeout = setTimeout(() => {
        onAnimationComplete();
      }, 550);
      return () => clearTimeout(timeout);
    }
  }, [currentTextIndex, texts, onAnimationComplete]);

  return (
    <motion.div
      key={texts && currentTextIndex < texts.length ? texts[currentTextIndex] : "loading"}
      className="fixed inset-0 flex items-center justify-center"
      variants={splashVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <span className="text-white font-alatsi text-[88px] drop-shadow-[0_4px_4px_rgba(227,87,33,1)] translate-y-16 text-center">{texts && currentTextIndex < texts.length ? texts[currentTextIndex] : ""}</span>
    </motion.div>
  );
};

SplashText.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnimationComplete: PropTypes.func,
};

export default SplashText;
