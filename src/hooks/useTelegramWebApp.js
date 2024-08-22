import { useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { telegramUserDataAtom, telegramWebAppAtom, isAuthenticatedAtom, telegramInitDataAtom } from "../store/Atoms";
import WebApp from "@twa-dev/sdk";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);
  const setTelegramUserData = useSetAtom(telegramUserDataAtom);
  const [telegramInitData, setTelegramInitData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const baseUrlApi = "https://us-central1-eyeroll-backend.cloudfunctions.net/api/api";

  const checkAuth = useCallback(async () => {
    console.log(localStorage.getItem("token"));
    try {
      const response = await fetch(`${baseUrlApi}/session`, {
        method: "GET",
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
            response.json().then((data) => {
              data.token && localStorage.setItem("token", data.token);
            });
            setIsAuthenticated(true);

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
    }
  }, [setWebApp, setTelegramUserData, checkAuth, setTelegramInitData]);

  return { webApp, isAuthenticated, authenticateUser, checkAuth };
};

export default useTelegramWebApp;
