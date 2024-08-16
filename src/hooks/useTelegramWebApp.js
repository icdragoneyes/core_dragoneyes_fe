import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { telegramWebAppAtom } from "../store/Atoms";
import { useAtom } from "jotai";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);

  useEffect(() => {
    const telegram = WebApp;
    if (telegram) {
      telegram.ready();
      setWebApp(telegram);
    }
  }, [setWebApp]);

  return webApp;
};

export default useTelegramWebApp;
