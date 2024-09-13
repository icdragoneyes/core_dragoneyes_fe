import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import eyesToken from "../assets/img/eyes-token.png";
import { eyesWonAtom } from "../store/Atoms";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

const EyesTokenAnimation = ({ isVisible, onClose }) => {
  const [eyesWon] = useAtom(eyesWonAtom);
  const [count, setCount] = useState(0);
  const [showCoins, setShowCoins] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const interval = 50;
      const increment = eyesWon / (duration / interval);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= eyesWon) {
          setCount(eyesWon);
          clearInterval(timer);
          setShowCoins(true);
        } else {
          setCount(Math.floor(current));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible, eyesWon]);

  const coinVariants = (index, totalCoins) => ({
    initial: {
      opacity: 0,
      y: 100,
      x: (index - totalCoins / 2) * 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 1,
        delay: index * 0.05,
      },
    },
    exit: { opacity: 0, y: -100 },
  });

  const coins = Array(30).fill("🪙");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="relative">
            <motion.div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-4xl font-bold text-yellow-400" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {count}
            </motion.div>
            <motion.img
              src={eyesToken}
              alt="Eyes Token"
              className="w-32 h-32"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 10, bounce: 0.5 }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  setShowCoins(false);
                  onClose();
                }, 3000);
              }}
            />
            {showCoins && (
              <>
                {coins.map((coin, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      bottom: `${index * 10}px`,
                      left: `${50 + (index - coins.length / 2) * 10}%`,
                    }}
                    variants={coinVariants(index, coins.length)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {coin}
                  </motion.div>
                ))}
              </>
            )}
          </div>
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
