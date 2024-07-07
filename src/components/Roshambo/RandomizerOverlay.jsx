import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import SplashText from "./SplashText";

const RandomizerOverlay = ({ userChoice }) => {
  const [vidPath, setVidPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRandomizer, setShowRandomizer] = useState(false);
  const [handImage, setHandImage] = useState(`../../assets/img/hands/rock.png`);

  useEffect(() => {
    const getVideoPath = async () => {
      var im = require(`../../assets/img/hands/${userChoice.toLowerCase()}.png`);
      setHandImage(im);
      console.log(userChoice.toLowerCase(), "<<<asdaww");
      setLoading(true);
      try {
        const video = await import(`../../assets/hand-gif/loop.mp4`);

        setVidPath(video.default);
      } catch (e) {
        console.error("Video not found:", e);
        setVidPath(null);
      } finally {
        setLoading(false);
      }
    };

    getVideoPath();
  }, []);

  const handleSplashComplete = () => {
    setShowRandomizer(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="relative flex flex-col items-center">
        {loading ? (
          <div className="animate-spin rounded-full h-48 w-48 border-8 border-[#E35721] border-t-transparent"></div>
        ) : vidPath ? (
          <motion.video
            src={vidPath}
            alt=""
            className="w-full h-auto max-w-3xl rounded-lg shadow-2xl"
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            preload="auto"
          />
        ) : (
          <p className="text-white text-2xl">Video not found</p>
        )}
        <SplashText
          texts={["READY", "SET", userChoice, "SHOOT"]}
          onAnimationComplete={handleSplashComplete}
        />
        {showRandomizer && (
          <motion.div
            className="absolute top-1/2 left-1/2 justify-center items-center transform -translate-x-1/2 -translate-y-1/2 w-[80%] bg-gray-800 bg-opacity-80 rounded-lg p-6 shadow-lg "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.img
              src={handImage}
              alt="Character face"
              className="left-[25%] relative w-[50%] h-[50%]  object-cover rounded-full border-4 border-white shadow-lg"
            />
            <h2 className="text-white font-passion text-3xl text-center mb-2">
              You chose {userChoice.toLowerCase()}
            </h2>

            <h3 className="text-[#E35721] font-passion text-2xl text-center">
              Waiting for Dragon On-Chain Randomizer
            </h3>
            <div className="mt-4 flex justify-center">
              <div className="animate-pulse w-3 h-3 bg-[#E35721] rounded-full mr-2"></div>
              <div
                className="animate-pulse w-3 h-3 bg-[#E35721] rounded-full mr-2"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="animate-pulse w-3 h-3 bg-[#E35721] rounded-full"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

RandomizerOverlay.propTypes = {
  userChoice: PropTypes.string.isRequired,
};

export default RandomizerOverlay;
