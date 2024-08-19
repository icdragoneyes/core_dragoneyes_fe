import { useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { telegramUserDataAtom, telegramWebAppAtom, isAuthenticatedAtom } from "../store/Atoms";
import WebApp from "@twa-dev/sdk";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);
  const setTelegramUserData = useSetAtom(telegramUserDataAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const baseUrlApi = "https://us-central1-eyeroll-backend.cloudfunctions.net/api/api";

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrlApi}/session`, {
        method: "GET",
        credentials: "include", // Ini penting untuk mengirim cookies
      });
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }, [setIsAuthenticated]);

  const authenticateUser = async () => {
    if (webApp) {
      const initData = webApp.initData;
      console.log("initData:", initData);
      if (initData) {
        try {
          const response = await fetch(`${baseUrlApi}/auth`, {
            method: "POST",
            credentials: "include", // Ini penting untuk mengirim cookies
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ initData }),
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            console.error("Authentication failed");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          setIsAuthenticated(false);
        }
      }
    }
  };

  useEffect(() => {
    const telegram = WebApp;
    if (telegram) {
      telegram.ready();
      setTelegramUserData(telegram.initData);
      setWebApp(telegram);
      checkAuth();
    }
  }, [setWebApp, setTelegramUserData, checkAuth]);

  return { webApp, isAuthenticated, authenticateUser };
};

export default useTelegramWebApp;
