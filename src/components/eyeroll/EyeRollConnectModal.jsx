import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import eyeClose from "../../assets/eyeroll/eye-close.png";
import eyeOpenVid from "../../assets/eyeroll/eye-open-vid.mp4";
import eyeOpen from "../../assets/eyeroll/eye-open.jpg";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, walletAddressAtom, hasSeenSplashScreenAtom, progressAtom } from "../../store/Atoms";

const EyeRollConnectModal = ({ onComplete }) => {
  const [stage, setStage] = useState("initial");
  const [fadeOut, setFadeOut] = useState(false);
  const eyeOpenVideoRef = useRef(null);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [hasSeenSplashScreen, setHasSeenSplashScreen] = useAtom(hasSeenSplashScreenAtom);
  const [progress] = useAtom(progressAtom);
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplashScreen");
    if (hasSeenSplash) {
      setHasSeenSplashScreen(true);
      onComplete();
    }
  }, []);

  useEffect(() => {
    const preloadAssets = [eyeClose, eyeOpenVid, eyeOpen];
    preloadAssets.forEach((asset) => {
      if (asset.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = asset;
        video.preload = "auto";
      } else {
        const img = new Image();
        img.src = asset;
      }
    });
  }, []);

  useEffect(() => {
    if (progress === 100 && isAuthenticated && walletAddress) {
      setStage("videoPlaying");
      setTimeout(() => {
        eyeOpenVideoRef.current.play();
      }, 500);
    }
  }, [progress, isAuthenticated, walletAddress]);

  useEffect(() => {
    const smoothen = () => {
      if (smoothProgress < progress) {
        setSmoothProgress((prev) => Math.min(prev + 1, progress));
        requestAnimationFrame(smoothen);
      }
    };
    smoothen();
  }, [progress, smoothProgress]);

  const handleVideoEnd = () => {
    setStage("eyeOpen");
    setTimeout(() => {
      setFadeOut(true);
      setHasSeenSplashScreen(true);
      sessionStorage.setItem("hasSeenSplashScreen", true);
      onComplete();
    }, 2000);
  };

  if (hasSeenSplashScreen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="relative w-full h-full overflow-hidden">
        <img src={eyeClose} alt="Sleeping Dragon" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "initial" ? "opacity-100" : "opacity-0"}`} />

        {stage === "initial" && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="bg-black bg-opacity-70 p-6 mt-[300px] rounded-lg text-white text-center font-passion w-4/5">
              <p className="text-xl mb-4 ">Awaking The Dragon</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${smoothProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        <video
          ref={eyeOpenVideoRef}
          src={eyeOpenVid}
          muted
          playsInline
          onEnded={handleVideoEnd}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "videoPlaying" ? "opacity-100" : "opacity-0"}`}
        />

        <img src={eyeOpen} alt="Dragon Eye Open" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "eyeOpen" ? "opacity-100" : "opacity-0"}`} />
      </div>
    </div>
  );
};

EyeRollConnectModal.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default EyeRollConnectModal;
