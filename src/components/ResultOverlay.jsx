import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashText from "./SplashText"; // Pastikan path ini benar
import { determineOutcome } from "../utils/gameLogic";

const ResultOverlay = ({ userChoice, cpuChoice, onClose }) => {
  const [vidPath, setVidPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getVideoPath = async (user, cpu) => {
      setLoading(true);
      try {
        const video = await import(`../assets/hand-gif/${user}${cpu}/${user}${cpu}.mp4`);
        setVidPath(video.default);
      } catch (e) {
        console.error("Video not found:", e);
        setVidPath(null);
      } finally {
        setLoading(false);
      }
    };

    getVideoPath(userChoice, cpuChoice);

    const timeout = setTimeout(() => {
      setShowModal(true);
    }, 3800);

    return () => clearTimeout(timeout);
  }, [userChoice, cpuChoice]);

  const outcome = determineOutcome(userChoice, cpuChoice);
  const winnerText = outcome;
  const handWinsText = outcome === "Draw!" ? "No one wins" : `${outcome.includes("Win") ? userChoice : cpuChoice} Wins`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full">
        {loading ? (
          <p>Loading...</p>
        ) : vidPath ? (
          <>
            <motion.video
              src={vidPath}
              alt={`${userChoice} vs ${cpuChoice}`}
              className="w-screen h-screen object-fill"
              autoPlay
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              preload="metadata"
            />
            <SplashText texts={["ROCK", "PAPER", "SCISSOR", "SHOOT"]} onAnimationComplete={() => {}} />
          </>
        ) : (
          <p>GIF not found</p>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-end bg-black bg-opacity-75 z-50">
            <motion.div
              className="bg-[#FAAC52] rounded-lg shadow-lg text-center w-[337px] h-[243px] flex flex-col justify-center items-center mb-20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <h2 className="text-black text-5xl font-bold font-alatsi mb-4">{winnerText}</h2>
              <p className="text-white text-3xl font-bold font-alatsi mb-6">{handWinsText}</p>
              <button onClick={onClose} className="bg-[#006823] text-white text-4xl font-semibold font-alatsi px-4 py-2 rounded-md hover:bg-green-700 transition w-64 h-16">
                PLAY AGAIN
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

ResultOverlay.propTypes = {
  userChoice: PropTypes.string.isRequired,
  cpuChoice: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  delay: PropTypes.number,
};

export default ResultOverlay;
