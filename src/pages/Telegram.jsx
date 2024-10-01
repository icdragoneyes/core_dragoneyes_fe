import { useAtom } from "jotai";
import BottomNavbar from "../components/BottomNavbar";
import LastHouseShot from "../components/LastHouseShot";
import ArenaMobile from "../components/Roshambo/ArenaMobile";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom, hasSeenSplashScreenAtom, progressAtom, telegramWebAppAtom, userAtom } from "../store/Atoms";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import { useEffect, useState } from "react";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { AnimatePresence, motion } from "framer-motion";
import analytics from "../utils/segment";
import teleQR from "../assets/img/teleQR.jpeg";

const Telegram = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [user] = useAtom(userAtom);
  const [hasSeenSplashScreen, setHasSeenSplashScreen] = useAtom(hasSeenSplashScreenAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const [telegram] = useAtom(telegramWebAppAtom);
  const [platform, setPlatform] = useState(null);
  const [isValidPlatform, setIsValidPlatform] = useState(false);

  useInitializeOpenlogin();

  useEffect(() => {
    if (telegram && telegram.platform) {
      setPlatform(telegram.platform);
      setIsValidPlatform(telegram.platform === "android" || telegram.platform === "ios");
      analytics.track("Platform Detected", {
        platform: telegram.platform,
        user_id: telegramUserData?.id,
      });
    }
  }, [telegram, telegramUserData]);

  useEffect(() => {
    const handleAuthenticate = async () => {
      if (!isAuthenticated && isValidPlatform) {
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
    if (telegramUserData && !isAuthenticated && isValidPlatform) {
      handleAuthenticate();
    } else if (!isValidPlatform) {
      console.log("Invalid platform");
      analytics.track("Invalid Platform", {
        platform: platform,
        user_id: telegramUserData?.id,
      });
    } else {
      console.log("Telegram user data not available");
      analytics.track("Telegram User Data Unavailable", {
        user_id: telegramUserData?.id,
      });
    }
  }, [telegramUserData, authenticateUser, isAuthenticated, setProgress, isValidPlatform, platform]);

  useEffect(() => {
    if (isAuthenticated && telegramUserData && user && user.principal) {
      analytics.identify(`T_${telegramUserData.id}`, {
        user_id: telegramUserData.id,
        name: telegramUserData.first_name,
        game_name: user.userName,
        SOL_Balance: user.userBalance,
        principal_id: user.principal,
      });
    } else if (telegramUserData) {
      analytics.track("Telegram User Data Available but Incomplete", {
        isAuthenticated,
        hasTelegramUserData: !!telegramUserData,
        hasUser: !!user,
        hasPrincipal: !!user.principal,
      });
    }
  }, []);

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

  if (!isValidPlatform) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <p className="text-lg font-semibold text-center mb-6 text-gray-800">Please scan this QR code with your Telegram mobile app to access Dragon Eyes</p>
        <img src={teleQR} alt="Telegram QR Code" className="max-w-full max-h-[70vh] rounded-lg shadow-lg" />
        <p className="text-sm text-center mt-4 text-gray-600">This app is only accessible through the Telegram mobile application</p>
      </div>
    );
  }

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
