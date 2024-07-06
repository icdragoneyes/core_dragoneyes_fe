import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
//import SplashText from "./SplashText";
import { determineOutcome } from "../../utils/gameLogic";
import Confetti from "react-confetti";
import { eyesWonAtom } from "../../store/Atoms";
import { useAtom } from "jotai";

const ResultOverlay = ({ userChoice, cpuChoice, onClose }) => {
  const [vidPath, setVidPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [eyesWon] = useAtom(eyesWonAtom);

  useEffect(() => {
    const getVideoPath = async (user, cpu) => {
      setLoading(true);
      try {
        const video = await import(
          `../../assets/hand-gif/${user}${cpu}/${user}${cpu}.mp4`
        );
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
      if (determineOutcome(userChoice, cpuChoice) === "You Win!") {
        setShowConfetti(true);
      }
    }, 5500);

    return () => clearTimeout(timeout);
  }, [userChoice, cpuChoice]);

  const outcome = determineOutcome(userChoice, cpuChoice);
  const winnerText = outcome === "Draw!" ? "TIE!" : outcome;
  const handWinsText =
    outcome === "Draw!" ? (
      ""
    ) : (
      <>
        {outcome === "You Win!" ? (
          <div className="flex gap-3 justify-center items-center">
            <div className="text-3xl">{userChoice}</div>
            <span className="text-black font-bold text-2xl leading-tight">
              BEATS
            </span>{" "}
            <div>{cpuChoice}</div>
          </div>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <div className="text-3xl">{cpuChoice}</div>
            <span className="text-black font-bold text-2xl leading-tight">
              BEATS
            </span>{" "}
            <div>{userChoice}</div>
          </div>
        )}
      </>
    );

  const getExpImg = (outcome) => {
    const exp =
      outcome === "Draw!" ? "mock" : outcome === "You Win!" ? "sad" : "happy";
    return require(`../../assets/img/face/${exp}.png`);
  };

  const expImg = getExpImg(outcome);

  return (
    <div className="absolute inset-0 bottom-20 md:bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full">
        {loading ? (
          <p>Loading...</p>
        ) : vidPath ? (
          <>
            <motion.video
              src={vidPath}
              alt={`${userChoice} vs ${cpuChoice}`}
              className={`${
                window.innerWidth > 768
                  ? "w-[337px] "
                  : "w-full h-full object-fill"
              }`}
              autoPlay
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              preload="metadata"
            />
          </>
        ) : (
          <p>GIF not found</p>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
            <motion.div
              className={`bg-[#E35721] opacity-95 rounded-lg shadow-lg text-center w-[337px] ${
                outcome === "You Win!" ? "h-[387px] mt-16" : "h-[243px]"
              } flex flex-col justify-center items-center relative`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="absolute -top-28 w-40 h-40">
                <img
                  src={expImg}
                  alt={`${outcome} face`}
                  className="w-full h-full object-fill"
                />
              </div>
              <h2 className="text-white text-5xl font-bold font-passion mb-2">
                {winnerText}
              </h2>
              <div className="text-white text-xl font-bold font-passion mb-2">
                {handWinsText}
              </div>

              <div className="text-[#FFF4BC] text-2xl font-bold font-passion mb-10 mt-3 border-y-4 w-2/3 py-4">
                You got
                <div className="text-3xl">{eyesWon} EYES</div>
                <button
                  onClick={onClose}
                  className="bg-[#006823] text-white text-4xl font-semibold font-passion px-4 py-2 rounded-md hover:bg-green-700 transition w-64 h-16"
                >
                  PLAY AGAIN
                </button>
              </div>

              {/*outcome === "You Win!" && (
                <div className="text-[#FFF4BC] text-2xl font-bold font-passion mb-10 mt-3 border-y-4 w-2/3 py-4">
                  You got
                  <div className="text-3xl">{eyesWon} EYES</div>
                </div>
              )}
              {outcome === "Draw!" ? (
               
                  <div className="text-[#FFF4BC] text-2xl font-bold font-passion mb-10 mt-3 border-y-4 w-2/3 py-4">
                    You got
                    <div className="text-3xl">{eyesWon} EYES</div>
                  </div>
             
              ) : (
                <button
                  onClick={onClose}
                  className="bg-[#006823] text-white text-4xl font-semibold font-passion px-4 py-2 rounded-md hover:bg-green-700 transition w-64 h-16"
                >
                  PLAY AGAIN
                </button>
              )*/}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
        />
      )}
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
