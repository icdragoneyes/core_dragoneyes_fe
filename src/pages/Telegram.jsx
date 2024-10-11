import { useAtom } from "jotai";
import BottomNavbar from "../components/BottomNavbar";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom, hasSeenSplashScreenAtom, progressAtom, telegramWebAppAtom, userAtom } from "../store/Atoms";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";
import { useCallback, useEffect, useState } from "react";
import EyeRollConnectModal from "../components/eyeroll/EyeRollConnectModal";
import { AnimatePresence, motion } from "framer-motion";
import analytics from "../utils/segment";
import RoshamboHeader from "../components/RoshamboHeader";
import ArenaMobile from "../components/Roshambo/ArenaMobile";
import QRCode from "qrcode.react";

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
  // eslint-disable-next-line no-unused-vars
  const [hasTrackedSession, setHasTrackedSession] = useState(false);
  const [hasTrackedPlatform, setHasTrackedPlatform] = useState(false);

  useInitializeOpenlogin();

  useEffect(() => {
    if (telegram && telegram.platform) {
      setPlatform(telegram.platform);
      setIsValidPlatform(telegram.platform === "android" || telegram.platform === "ios");

      const hasTrackedPlatformThisSession = sessionStorage.getItem("hasTrackedPlatformDetected");
      if (!hasTrackedPlatformThisSession && !hasTrackedPlatform) {
        analytics.track("Platform Detected", {
          platform: telegram.platform,
          user_id: telegramUserData?.id,
        });
        sessionStorage.setItem("hasTrackedPlatformDetected", "true");
        setHasTrackedPlatform(true);
      }
    }
  }, [telegram, telegramUserData, hasTrackedPlatform]);

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
    }
  }, [telegramUserData, authenticateUser, isAuthenticated, setProgress, isValidPlatform, platform]);

  const trackSession = useCallback(() => {
    if (isAuthenticated && telegramUserData && user && user.principal) {
      const sessionKey = `hasTrackedDragonEyesSession_${telegramUserData.id}`;
      const hasTrackedThisSession = sessionStorage.getItem(sessionKey);

      if (!hasTrackedThisSession) {
        analytics.identify(`T_${telegramUserData.id}`, {
          user_id: telegramUserData.id,
          name: telegramUserData.first_name,
          game_name: user.userName,
          SOL_Balance: user.userBalance,
          principal_id: user.principal,
        });
        analytics.track("Dragon Eyes Session Start", {
          user_id: telegramUserData.id,
          name: telegramUserData.first_name,
          game_name: user.userName,
        });
        sessionStorage.setItem(sessionKey, "true");
        setHasTrackedSession(true);
        console.log("Session tracked successfully");
      }
    } else if (telegramUserData) {
      analytics.track("Incomplete Session Data", {
        isAuthenticated,
        hasTelegramUserData: !!telegramUserData,
        hasUser: !!user,
        hasPrincipal: !!user?.principal,
      });
      console.log("Incomplete session data tracked");
    }
  }, [isAuthenticated, telegramUserData, user]);

  useEffect(() => {
    if (isAuthenticated && telegramUserData && user) {
      trackSession();
    }
  }, [isAuthenticated, telegramUserData, user, trackSession]);

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
    const searchParams = new URLSearchParams(location.search);
    const startappParam = searchParams.get("startapp");

    let qrCodeUrl;
    if (startappParam) {
      qrCodeUrl = `https://t.me/dragoneyesxyz_bot/roshambo?startapp=${startappParam}`;
    } else {
      qrCodeUrl = "https://t.me/dragoneyesxyz_bot/roshambo";
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <p className="text-lg font-semibold text-center mb-6 text-gray-800">Please scan this QR code with your Telegram mobile app to access Dragon Eyes</p>
        <div className="bg-black p-4 rounded-lg shadow-lg">
          <QRCode value={qrCodeUrl} size={256} level="H" />
        </div>
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
            <RoshamboHeader />
            <ArenaMobile />
            <BottomNavbar />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Telegram;
