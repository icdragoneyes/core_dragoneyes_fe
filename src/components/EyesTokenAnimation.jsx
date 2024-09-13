import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import eyesToken from "../assets/img/eyes-token.png";

const EyesTokenAnimation = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.img
            src={eyesToken}
            alt="Eyes Token"
            className="w-32 h-32"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 10 }}
            onAnimationComplete={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EyesTokenAnimation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EyesTokenAnimation;
