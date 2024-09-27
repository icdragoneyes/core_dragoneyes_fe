import { useAtom } from "jotai";
import BottomNavbar from "../components/BottomNavbar";
import LastHouseShot from "../components/LastHouseShot";
import ArenaMobile from "../components/Roshambo/ArenaMobile";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom, hasSeenSplashScreenAtom, progressAtom } from "../store/Atoms";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import { useEffect } from "react";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { AnimatePresence, motion } from "framer-motion";
import analytics from "../utils/segment";

const Telegram = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [hasSeenSplashScreen, setHasSeenSplashScreen] = useAtom(hasSeenSplashScreenAtom);
  const [progress, setProgress] = useAtom(progressAtom);

  useInitializeOpenlogin();

  useEffect(() => {
    const handleAuthenticate = async () => {
      if (!isAuthenticated) {
        try {
          setProgress(0);
          await authenticateUser();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setProgress(30);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setProgress(60);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setProgress(80);
          // Simulate additional loading time
          await new Promise((resolve) => setTimeout(resolve, 800));
          setProgress(100);
        } catch (error) {
          console.error("Authentication failed:", error);
          analytics.track("Authentication Error", {
            error: error.message,
            user_id: telegramUserData?.id,
          });
        }
      }
    };
    if (telegramUserData && !isAuthenticated) {
      handleAuthenticate();
    } else {
      console.log("Telegram user data not available");
      analytics.track("Telegram User Data Unavailable", {
        user_id: telegramUserData?.id,
      });
    }
  }, [telegramUserData, authenticateUser, isAuthenticated, setProgress]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName("head")[0].appendChild(meta);

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta);
    };
  }, []);

  const handleEyeRollComplete = () => {
    setHasSeenSplashScreen(true);
  };

  return (
    <main className="overflow-hidden h-screen">
      <AnimatePresence>
        {!hasSeenSplashScreen && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <EyeRollConnectModal onComplete={handleEyeRollComplete} progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasSeenSplashScreen && (
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
