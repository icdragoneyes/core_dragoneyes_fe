import { useAtom } from "jotai";
import BottomNavbar from "../components/BottomNavbar";
import LastHouseShot from "../components/LastHouseShot";
import ArenaMobile from "../components/Roshambo/ArenaMobile";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom, walletAddressAtom } from "../store/Atoms";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import { useEffect, useState } from "react";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { AnimatePresence, motion } from "framer-motion";

const Telegram = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [showEyeRoll, setShowEyeRoll] = useState(true);
  const [walletAddress] = useAtom(walletAddressAtom);
  const [eyeRollComplete, setEyeRollComplete] = useState(false);

  useInitializeOpenlogin();

  useEffect(() => {
    const handleAuthenticate = async () => {
      if (!isAuthenticated) await authenticateUser();
    };

    if (telegramUserData && !isAuthenticated) {
      handleAuthenticate();
    } else {
      console.log("Telegram user data not available");
    }
  }, [telegramUserData, authenticateUser, isAuthenticated]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName("head")[0].appendChild(meta);

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && walletAddress && eyeRollComplete) {
      setShowEyeRoll(false);
    }
  }, [isAuthenticated, walletAddress, eyeRollComplete]);

  const handleEyeRollComplete = () => {
    setEyeRollComplete(true);
  };

  return (
    <main className="overflow-hidden h-screen">
      <AnimatePresence>
        {showEyeRoll && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <EyeRollConnectModal onComplete={handleEyeRollComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!showEyeRoll && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <LastHouseShot />
            <ArenaMobile />
            <BottomNavbar />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Telegram;
