import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import eyeClose from "../../assets/eyeroll/eye-close.png";
import eyeOpenVid from "../../assets/eyeroll/eye-open-vid.mp4";
import eyeOpen from "../../assets/eyeroll/eye-open.jpg";
import eyeTrans from "../../assets/eyeroll/eye-trans.mp4";
import { useSetAtom } from "jotai";
import { isConnectedAtom, telegramUserDataAtom } from "../../store/Atoms";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";

const EyeRollConnectModal = ({ isOpen, onFinish }) => {
  const [stage, setStage] = useState("initial");
  const [fadeOut, setFadeOut] = useState(false);
  const eyeOpenVideoRef = useRef(null);
  const eyeTransVideoRef = useRef(null);
  const [showFlash, setShowFlash] = useState(false);
  const setIsConnected = useSetAtom(isConnectedAtom);
  const setTelegramUserData = useSetAtom(telegramUserDataAtom);
  const webApp = useTelegramWebApp();

  useEffect(() => {
    if (stage === "videoPlaying") {
      eyeOpenVideoRef.current.play();
    }
  }, [stage]);

  useEffect(() => {
    // Preload images and videos
    const preloadAssets = [eyeClose, eyeOpenVid, eyeOpen, eyeTrans];
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

  const handleConnect = () => {
    setStage("videoPlaying");
  };

  const handleVideoEnd = () => {
    setStage("connected");
  };

  const handleRollNow = () => {
    setStage("transition");
    eyeTransVideoRef.current.play();
    setTimeout(() => {
      setShowFlash(true);
      setTimeout(() => {
        setShowFlash(false);
        setFadeOut(true);
        setIsConnected(true);
        localStorage.setItem("isConnected", true);
        if (webApp && webApp.initialDataUnsafe && webApp.initialDataUnsafe.user) {
          const { user } = webApp.initialDataUnsafe;
          setTelegramUserData(user);
        } else {
          console.log("Telegram user data not available");
        }
      }, 200);
    }, 1000);

    setTimeout(onFinish, 2200);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-white z-50 transition-opacity duration-200 ${showFlash ? "opacity-100" : "opacity-0"}`} />
      <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        <div className="relative w-full h-full overflow-hidden">
          <img src={eyeOpen} alt="Dragon Eye Open" className="absolute inset-0 w-full h-full object-cover" />
          <video ref={eyeTransVideoRef} src={eyeTrans} muted playsInline className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "transition" ? "opacity-100" : "opacity-0"}`} />
          <video
            ref={eyeOpenVideoRef}
            src={eyeOpenVid}
            muted
            playsInline
            onEnded={handleVideoEnd}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "videoPlaying" ? "opacity-100" : "opacity-0"}`}
          />
          <img src={eyeClose} alt="Sleeping Dragon" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "initial" ? "opacity-100" : "opacity-0"}`} />

          <div className="absolute inset-0 flex items-center translate-y-28 justify-center">
            {stage === "initial" && (
              <button onClick={handleConnect} className="px-6 py-3 bg-green-500 text-white rounded-lg text-xl font-bold hover:bg-green-600 transition-colors">
                Connect Wallet
              </button>
            )}
            {stage === "connected" && (
              <div className="bg-white rounded-lg p-8 text-center translate-y-20">
                <h2 className="text-2xl font-bold mb-4">Wallet Connected</h2>
                <button onClick={handleRollNow} className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl font-bold hover:bg-blue-600 transition-colors">
                  Roll em now!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

EyeRollConnectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default EyeRollConnectModal;
