import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { determineOutcome } from "../../utils/gameLogic";
import {
  eyesModeAtom,
  streakModeAtom,
  currentStreakAtom,
  //chainNameAtom,
  selectedChainAtom,
} from "../../store/Atoms";
import { useAtom } from "jotai";
import { winArray, loseArray } from "../../constant/resultArray";
// import EyesTokenAnimation from "../EyesTokenAnimation";

const ResultOverlay = ({ userChoice, cpuChoice, onClose, icpWon }) => {
  const [showModal, setShowModal] = useState(false);
  // const [showEyesToken, setShowEyesToken] = useState(false);
  const [eyesMode] = useAtom(eyesModeAtom);
  const [handImage, setHandImage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [chosenArray, setChosenArray] = useState("");
  const [streakMode] = useAtom(streakModeAtom);
  const [currentStreak] = useAtom(currentStreakAtom);
  //const [chainName] = useAtom(chainNameAtom);
  const [chain] = useAtom(selectedChainAtom);
  // const [isCountingComplete, setIsCountingComplete] = useState(false);
  // const [showEyesTokenAnimation, setShowEyesTokenAnimation] = useState(true);

  const outcome = determineOutcome(userChoice, cpuChoice);
  const winnerText = outcome === "You Win!" ? "You Win!" : outcome === "You Lose!" ? "You Lose!" : "Draw!";
  const faceImage = require(`../../assets/img/face/${outcome === "You Win!" ? "sad" : "happy"}_f.png`);

  useEffect(() => {
    const loadHandImage = async () => {
      setChosenArray(outcome === "You Win!" ? winArray[Math.floor(Math.random() * winArray.length)] : loseArray[Math.floor(Math.random() * loseArray.length)]);
      try {
        const image = await import(`../../assets/hand-gif/${userChoice.toLowerCase()}${cpuChoice.toLowerCase()}.png`);
        setHandImage(image.default);
      } catch (error) {
        console.error("Failed to load hand image:", error);
      }
    };

    loadHandImage();
    setTimeout(() => setShowModal(true), 2000);
  }, [userChoice, cpuChoice, outcome]);

  useEffect(() => {
    if (outcome === "Draw!" && showModal) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onClose();
            return 100;
          }
          return Math.min(prev + 0.5, 100);
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [outcome, showModal, onClose]);

  const renderContent = () => {
    if (outcome === "Draw!") {
      return (
        <>
          <motion.div className="w-full bg-gray-200 rounded-full h-2.5 mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="bg-[#006823] h-2.5 rounded-full" style={{ width: `${loadingProgress}%` }} transition={{ duration: 0.1 }} />
          </motion.div>
          <motion.p className="text-white text-2xl mb-4 font-passion" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            {streakMode && "Streak mode ended!"}
          </motion.p>
        </>
      );
    }

    return (
      <>
        {outcome === "You Win!" && (
          <motion.div className="text-white text-3xl font-bold mb-6 font-passion" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
            {streakMode ? (
              <div className="flex flex-col justify-center items-center text-center gap-2 text-white text-base">
                {currentStreak < 3 ? (
                  <>
                    <div className="text-lg">Win 3 times in a row!</div>
                    <div className="flex items-center">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className={`w-7 h-7 border-2 rounded-full mx-1 ${index <= currentStreak ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-4xl text-yellow-300">
                    +{icpWon} {eyesMode ? "EYES" : chain.name.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-4xl text-yellow-300">
                +{Number(icpWon)} {!eyesMode ? chain.name.toUpperCase() : "EYES"}
              </span>
            )}
          </motion.div>
        )}
        <motion.div className="relative w-60 h-60 mb-6" initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 10, delay: 0.5 }}>
          <div className="absolute inset-0 bg-white rounded-full"></div>
          <motion.img src={faceImage} alt="Character face" className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg" />
        </motion.div>
        <motion.p className="text-white text-xl italic mb-6 font-passion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {chosenArray}
        </motion.p>
        <motion.button
          onClick={onClose}
          className="bg-[#006823] text-white text-2xl font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-passion"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          PLAY AGAIN
        </motion.button>
      </>
    );
  };

  return (
    <AnimatePresence>
      {handImage && !showModal && (
        <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.img src={handImage} alt={`${userChoice} vs ${cpuChoice}`} className="max-w-full max-h-full object-contain" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
        </motion.div>
      )}
      {showModal && (
        <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="bg-gradient-to-b from-[#FF7E31] to-[#E35721] rounded-2xl shadow-2xl text-center w-[90%] max-w-[400px] flex flex-col justify-between items-center relative p-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.h2 className="text-white text-5xl font-bold mb-4 font-passion" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              {winnerText}
            </motion.h2>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ResultOverlay.propTypes = {
  userChoice: PropTypes.string.isRequired,
  cpuChoice: PropTypes.string.isRequired,
  icpWon: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResultOverlay;
