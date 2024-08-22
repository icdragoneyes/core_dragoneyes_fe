import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { telegramUserDataAtom, telegramWebAppAtom, isAuthenticatedAtom, telegramInitDataAtom } from "../store/Atoms";
import WebApp from "@twa-dev/sdk";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);
  const [, setTelegramUserData] = useAtom(telegramUserDataAtom);
  const [telegramInitData, setTelegramInitData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const baseUrlApi = "https://us-central1-eyeroll-backend.cloudfunctions.net/api/api";

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrlApi}/session`, {
        method: "GET",
        credentials: "include",
        // get user data from local storage called token and send it as authorization header
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
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
      const initData = telegramInitData;
      if (initData) {
        try {
          const response = await fetch(`${baseUrlApi}/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ initData }),
          });

          if (response.ok) {
            setIsAuthenticated(true);
            console.log(response);
            // localStorage.setItem("token", response);
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
      setTelegramInitData(telegram.initData);
      setTelegramUserData(telegram.initDataUnsafe.user);
      setWebApp(telegram);
      checkAuth();
    }
  }, [setWebApp, setTelegramUserData, checkAuth, setTelegramInitData]);

  return { webApp, isAuthenticated, authenticateUser, checkAuth };
};

export default useTelegramWebApp;
