import { useState, useEffect, useRef } from "react";
import eyeClose from "../../assets/eyeroll/eye-close.png";
import eyeOpenVid from "../../assets/eyeroll/eye-open-vid.mp4";
import eyeOpen from "../../assets/eyeroll/eye-open.jpg";
import { useAtom, useSetAtom } from "jotai";
import { isAuthenticatedAtom, isConnectedAtom, walletAddressAtom } from "../../store/Atoms";

const EyeRollConnectModal = () => {
  const [stage, setStage] = useState("initial");
  const [fadeOut, setFadeOut] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const eyeOpenVideoRef = useRef(null);
  const setIsConnected = useSetAtom(isConnectedAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [walletAddress] = useAtom(walletAddressAtom);

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

    const timer = setTimeout(() => {
      setStage("videoPlaying");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === "videoPlaying") {
      eyeOpenVideoRef.current.play();
    }
  }, [stage]);

  useEffect(() => {
    let flashInterval;
    if (stage === "eyeOpen" && (!isAuthenticated || !walletAddress)) {
      setIsFlashing(true);
      flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev);
      }, 500); // Flash every 500ms
    } else {
      setIsFlashing(false);
    }

    return () => clearInterval(flashInterval);
  }, [stage, isAuthenticated, walletAddress]);

  const handleVideoEnd = () => {
    setStage("eyeOpen");
    if (isAuthenticated && walletAddress) {
      setTimeout(() => {
        setFadeOut(true);
        setIsConnected(true);
      }, 2000);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className={`relative w-full h-full overflow-hidden ${isFlashing ? 'animate-flash' : ''}`}>
        <img src={eyeOpen} alt="Dragon Eye Open" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "eyeOpen" ? "opacity-100" : "opacity-0"}`} />
        <video
          ref={eyeOpenVideoRef}
          src={eyeOpenVid}
          muted
          playsInline
          onEnded={handleVideoEnd}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "videoPlaying" ? "opacity-100" : "opacity-0"}`}
        />
        <img src={eyeClose} alt="Sleeping Dragon" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stage === "initial" ? "opacity-100" : "opacity-0"}`} />
      </div>
    </div>
  );
};

export default EyeRollConnectModal;