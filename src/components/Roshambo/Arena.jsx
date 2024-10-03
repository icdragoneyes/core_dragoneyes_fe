import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import ArenaDesktop from "./ArenaDesktop"; // Komponen untuk tampilan desktop
import useInitializeOpenlogin from "../../hooks/useInitializeOpenLogin";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";
import { isAuthenticatedAtom, telegramUserDataAtom } from "../../store/Atoms";
import ArenaMobile2 from "./ArenaMobile2";

const Arena = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);

  // Hook to initialize OpenLogin from torus
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <ArenaMobile2 /> : <ArenaDesktop />}</>;
};

export default Arena;
