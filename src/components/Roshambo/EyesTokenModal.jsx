import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import chestImg from "../../assets/img/chest.png";
import confettiGif from "../../assets/img/confetti.gif";

const EyesTokenModal = ({ isOpen, onClose, eyesWon }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-[#343433FA] bg-opacity-98 p-6 rounded-lg shadow-xl font-passion max-w-md w-4/5" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col justify-center items-center text-center">
              <motion.h2 className="text-2xl font-bold text-white " initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                You Got
              </motion.h2>
              <motion.img src={chestImg} alt="Treasure Chest" className="w-36 h-w-36 mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }} />
              <motion.p className="text-[#22C31F] text-4xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {eyesWon} EYES
              </motion.p>
              <motion.button onClick={onClose} className="px-6 py-2 bg-[#1132A6] text-white rounded-lg hover:bg-[#6783eb] transition-colors" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                Hurray! 🎉
              </motion.button>
            </div>
          </motion.div>
          <motion.img src={confettiGif} alt="Confetti" className="absolute inset-0 w-full h-full object-cover pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EyesTokenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eyesWon: PropTypes.number.isRequired,
};

export default EyesTokenModal;
