import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SplashText from "./SplashText";

const RandomizerOverlay = () => {
  const [vidPath, setVidPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideoPath = async () => {
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

    const timeout = setTimeout(() => {
      // setShowModal(true);
    }, 5500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute inset-0 bottom-20 md:bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full">
        {loading ? (
          <p>Loading...</p>
        ) : vidPath ? (
          <>
            {" "}
            <SplashText
              texts={["ROCK", "PAPER", "SCISSOR", "SHOOT"]}
              onAnimationComplete={() => {}}
            />
            <motion.video
              src={vidPath}
              alt=""
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
    </div>
  );
};

RandomizerOverlay.propTypes = {
  delay: PropTypes.number,
};

export default RandomizerOverlay;
