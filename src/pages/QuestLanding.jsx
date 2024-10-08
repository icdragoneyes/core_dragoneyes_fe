import { useEffect } from "react";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticatedAtom, telegramUserDataAtom } from "../store/Atoms";
import useTelegramWebApp from "../hooks/useTelegramWebApp";
import useInitializeOpenlogin from "../hooks/useInitializeOpenLogin";

import BottomNavbar from "../components/BottomNavbar";
// import Quest from "../components/Quest";
import QuestV2 from "../components/QuestV2";

const QuestLanding = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);

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
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName("head")[0].appendChild(meta);

    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta);
    };
  }, []);

  return (
    <main className="overflow-hidden h-screen">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <QuestV2 />
          <BottomNavbar />
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default QuestLanding;
