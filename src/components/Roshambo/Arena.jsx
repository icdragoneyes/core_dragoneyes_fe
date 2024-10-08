import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import ArenaMobile from "./ArenaMobile"; // Komponen untuk tampilan mobile
import ArenaDesktop from "./ArenaDesktop"; // Komponen untuk tampilan desktop
import useInitializeOpenlogin from "../../hooks/useInitializeOpenLogin";
import useTelegramWebApp from "../../hooks/useTelegramWebApp";
import {
  isAuthenticatedAtom,
  telegramUserDataAtom,
  questAtom,
  commissionAtom,
  roshamboActorAtom,
  coreAtom,
} from "../../store/Atoms";

const Arena = () => {
  const { authenticateUser } = useTelegramWebApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [telegramUserData] = useAtom(telegramUserDataAtom);
  const [questData, setQuest] = useAtom(questAtom);
  const setCommission = useSetAtom(commissionAtom);
  const [roshamboAgent] = useAtom(roshamboActorAtom);
  const [coreAgent] = useAtom(coreAtom);

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
    async function questFetch() {
      var a = await coreAgent.getQuestData();
      setQuest(a);
      var b = await roshamboAgent.getCommissionData();
      setCommission(b);
    }

    if (!questData && roshamboAgent && coreAgent) {
      questFetch();
    }
  }, [telegramUserData, roshamboAgent, coreAgent]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <ArenaMobile /> : <ArenaDesktop />}</>;
};

export default Arena;
