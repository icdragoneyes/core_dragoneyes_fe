import { useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { telegramUserDataAtom, telegramWebAppAtom, isAuthenticatedAtom, telegramInitDataAtom } from "../store/Atoms";
import WebApp from "@twa-dev/sdk";
import {

  loginInstanceAtom,
  canisterActorAtom,
  userDataAtom,
  gameDataAtom,
  walletAddressAtom,
  icpAgentAtom,
  eyesLedgerAtom,
  setCurrentEmailAtom,
  setWalletAliasAtom,
  isLoggedInAtom,
  spinActorAtom,
  roshamboActorAtom,
  roshamboEyesAtom,
  preConnectRoshamboAtom,
  coreAtom,
} from "../store/Atoms";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { actorCreationRoshambo as createRoshamboEyes } from "../service/roshamboeyes";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent } from "../service/icpledgercanister";
import { actorCreationSpin } from "../service/spincanister";
import { actorCreationRoshambo } from "../service/roshambocanister";
import { coreActorCreation } from "../service/core";

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useAtom(telegramWebAppAtom);
  const setTelegramUserData = useSetAtom(telegramUserDataAtom);
  const [telegramInitData, setTelegramInitData] = useAtom(telegramInitDataAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);

  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom);
  const setUserData = useSetAtom(userDataAtom);
  const setGameData = useSetAtom(gameDataAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const setICPAgent = useSetAtom(icpAgentAtom);
  const setEyesLedger = useSetAtom(eyesLedgerAtom);
  const setCurrentEmail = useSetAtom(setCurrentEmailAtom);
  const setWalletAlias = useSetAtom(setWalletAliasAtom);
  const setSpinActor = useSetAtom(spinActorAtom);
  const setRoshamboActor = useSetAtom(roshamboActorAtom);
  const setPreConnectRoshambo = useSetAtom(preConnectRoshamboAtom);
  const setCoreActor = useSetAtom(coreAtom);
  const setRosamboEyesAgent = useSetAtom(roshamboEyesAtom);



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
      handleLogin(telegram.initData.hash);
    }
  }, [setWebApp, setTelegramUserData, checkAuth, setTelegramInitData]);

  const handleLogin = async (p) => {
    
    try {
      const privKey = p;

      setCurrentEmail(loginInstance.getUserInfo().email);

      const diceAgent = actorCreation(privKey);
      const icpAgent_ = icpAgent(privKey);
      const eyes_ = eyesCreation(privKey);
      const spinWheel_ = actorCreationSpin(privKey);
      const roshambo = actorCreationRoshambo(privKey);
      const coreActor_ = coreActorCreation(privKey);
      const roshamboEyesAgent = createRoshamboEyes(privKey);
      const generalPrivKey =
        "0bc9866cbc181a4f5291476f7be00ca4f11cae6787e10ed9dc1d40db7943f643";
      const preConnectRoshamboAgent = actorCreationRoshambo(generalPrivKey);

      setRosamboEyesAgent(roshamboEyesAgent);
      const principalString_ = getUserPrincipal(privKey).toString();
      setPreConnectRoshambo(preConnectRoshamboAgent);
      setCanisterActor(diceAgent);
      setICPAgent(icpAgent_);
      setEyesLedger(eyes_);
      setSpinActor(spinWheel_);
      setRoshamboActor(roshambo);
      setCoreActor(coreActor_);

      const [user_, game_] = await Promise.all([
        diceAgent.getUserData(),
        diceAgent.getCurrentGame(),
      ]);

      setUserData(user_);
      setGameData(game_);
      setWalletAddress(principalString_);
      setWalletAlias(user_.alias.toString());
      setIsLoggedIn(true);

    } catch (err) {
     // toast.error("Failed to connect to ICP. Please try again.");
    } finally {
      //
    }
  };

  return { webApp, isAuthenticated, authenticateUser, checkAuth };

  
};

export default useTelegramWebApp;
