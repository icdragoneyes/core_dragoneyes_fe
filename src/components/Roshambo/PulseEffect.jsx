import PropTypes from "prop-types";
import { motion } from "framer-motion";

const PulseEffect = ({ show, currentStreak }) => {
  if (!show) return null;

  const pulseStyles = {
    left: {
      background: "linear-gradient(to right, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.1), transparent)",
    },
    right: {
      background: "linear-gradient(to left, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.1), transparent)",
    },
  };

  const animationDuration = currentStreak > 0 ? 1 : 2;

  return (
    <>
      {/* Left pulse */}
      <motion.div className="fixed left-0 top-0 bottom-0 w-12 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="h-full w-full"
          style={pulseStyles.left}
          animate={{
            opacity: [0.3, 0.6, 0.3, 0],
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Right pulse */}
      <motion.div className="fixed right-0 top-0 bottom-0 w-12 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          className="h-full w-full"
          style={pulseStyles.right}
          animate={{
            opacity: [0.3, 0.6, 0.3, 0],
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </>
  );
};

PulseEffect.propTypes = {
  show: PropTypes.bool.isRequired,
  currentStreak: PropTypes.number.isRequired,
};

export default PulseEffect;
