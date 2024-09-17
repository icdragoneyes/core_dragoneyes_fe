import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import eyesToken from "../assets/img/eyes-token.png";
import { eyesWonAtom } from "../store/Atoms";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

const EyesTokenAnimation = ({ isVisible, onClose, onCountComplete, outcome }) => {
  const [eyesWon] = useAtom(eyesWonAtom);
  const [coins, setCoins] = useState([]);
  const [count, setCount] = useState(0);
  const [showCoins, setShowCoins] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const newCoins = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * (window.innerWidth - 64) + 64,
        delay: Math.random() * 0.5,
      }));
      setCoins(newCoins);
      setTimeout(() => setShowCoins(true), 1000); // Start coin animation after 1 second
    }
  }, [isVisible]);

  useEffect(() => {
    if (showCoins) {
      // Tunggu animasi koin selesai sebelum memulai penghitungan
      setTimeout(() => {
        const incrementInterval = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount < eyesWon) {
              return prevCount + 1;
            } else {
              clearInterval(incrementInterval);
              onCountComplete();
              return prevCount;
            }
          });
        }, 50);
      }, 1000); // Sesuaikan dengan durasi animasi koin
    }
  }, [showCoins, eyesWon, onCountComplete]);

  useEffect(() => {
    if (count === eyesWon) {
      if (outcome === "Draw!") {
        setTimeout(onCountComplete(), 1500);
      } else {
        onCountComplete();
      }
      setTimeout(onClose, 6000); // Close after 1 second
    }
  }, [count, eyesWon, onCountComplete, onClose, outcome]);

  if (!isVisible) return null;
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute text-4xl font-bold text-orange-500" style={{ top: "calc(50% - 140px)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            {count}
          </motion.div>
          <motion.img src={eyesToken} alt="Eyes Token" className="w-40 h-40" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} transition={{ type: "spring", damping: 10 }} />
          {showCoins &&
            coins.map((coin) => (
              <motion.div
                key={coin.id}
                className="absolute text-4xl"
                style={{ left: `${coin.x - 35}px` }}
                initial={{ y: window.innerHeight }}
                animate={{
                  y: -50,
                  x: window.innerWidth / 2 - coin.x,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  delay: coin.delay,
                  ease: "easeOut",
                }}
              >
                🪙
              </motion.div>
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EyesTokenAnimation.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCountComplete: PropTypes.func.isRequired,
  outcome: PropTypes.string.isRequired,
};

export default EyesTokenAnimation;
