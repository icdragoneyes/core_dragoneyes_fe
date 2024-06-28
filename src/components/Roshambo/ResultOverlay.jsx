import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashText from "./SplashText"; // Pastikan path ini benar
import { determineOutcome } from "../../utils/gameLogic";

const ResultOverlay = ({ userChoice, cpuChoice, onClose }) => {
  const [vidPath, setVidPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getVideoPath = async (user, cpu) => {
      setLoading(true);
      try {
        const video = await import(`../../assets/hand-gif/${user}${cpu}/${user}${cpu}.mp4`);
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
    }, 4800);

    return () => clearTimeout(timeout);
  }, [userChoice, cpuChoice]);

  // logic to determine the outcome of the game for modal
  const outcome = determineOutcome(userChoice, cpuChoice);
  const winnerText = outcome === "Draw!" ? "TIE!" : outcome;
  const handWinsText =
    outcome === "Draw!" ? (
      ""
    ) : (
      <>
        {outcome === "You Win!" ? (
          <div className="flex gap-3 justify-center items-center">
            <div>{userChoice}</div>
            <span className="text-black font-bold text-xl leading-tight">BEATS</span> <div>{cpuChoice}</div>
          </div>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <div>{cpuChoice}</div>
            <span className="text-black font-bold text-xl leading-tight">BEATS</span> <div>{userChoice}</div>
          </div>
        )}
      </>
    );

  // getting exp image
  const getExpImg = (outcome) => {
    const exp = outcome === "Draw!" ? "mock" : outcome === "You Win!" ? "sad" : "happy";
    return require(`../../assets/img/face/${exp}.png`);
  };

  const expImg = getExpImg(outcome);

  return (
    <div className="absolute inset-0 bottom-20 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full">
        {loading ? (
          <p>Loading...</p>
        ) : vidPath ? (
          <>
            <motion.video
              src={vidPath}
              alt={`${userChoice} vs ${cpuChoice}`}
              className="w-full h-full object-fill"
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
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
            <motion.div
              className="bg-[#E35721] opacity-95 rounded-lg shadow-lg text-center w-[337px] h-[243px] flex flex-col justify-center items-center relative"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="absolute -top-28 w-40 h-40">
                <img src={expImg} alt={`${outcome} face`} className="w-full h-full object-fill" />
              </div>
              <h2 className="text-white text-5xl font-bold font-alatsi mb-4 mt-4">{winnerText}</h2>
              <div className="text-white text-xl font-bold font-alatsi mb-6">{handWinsText}</div>
              {outcome === "Draw!" ? (
                <div className="w-full">
                  <div className="flex justify-center items-center">
                    <div className="w-1/2 h-3 bg-gray-200 overflow-x-auto relative rounded-full shadow-md">
                      <div className="absolute inset-0 bg-[#006823] animate-scroll rounded-full" onAnimationEnd={onClose}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={onClose} className="bg-[#006823] text-white text-4xl font-semibold font-alatsi px-4 py-2 rounded-md hover:bg-green-700 transition w-64 h-16">
                  PLAY AGAIN
                </button>
              )}
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
