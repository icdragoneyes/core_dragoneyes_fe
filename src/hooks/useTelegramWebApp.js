import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { telegramUserDataAtom, telegramWebAppAtom } from "../store/Atoms";
import { useAtom, useSetAtom } from "jotai";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);
  const setTelegramUserData = useSetAtom(telegramUserDataAtom);

  useEffect(() => {
    const telegram = WebApp;
    if (telegram) {
      telegram.ready();
      setTelegramUserData(telegram.initDataUnsafe.user);
      setWebApp(telegram);
    }
  }, [setWebApp, setTelegramUserData]);

  return webApp;
};

export default useTelegramWebApp;
