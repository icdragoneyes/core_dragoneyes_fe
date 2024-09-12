import { useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { telegramUserDataAtom, telegramWebAppAtom, isAuthenticatedAtom, telegramInitDataAtom } from "../store/Atoms";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
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
  telegramAuthAtom,
} from "../store/Atoms";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { actorCreationRoshambo as createRoshamboEyes } from "../service/roshamboeyes";
import { eyesCreation } from "../service/eyesledgercanister";
import { createDragonSolAgent } from "../service/solledgercanister";
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
  const setTelegramAuth = useSetAtom(telegramAuthAtom);

  const baseUrlApi = "https://api.dragoneyes.xyz/dragontelegram/";
  // const baseUrlApi =
  //"https://us-central1-eyeroll-backend.cloudfunctions.net/api/api";

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
      console.log(response, "<<<< res");
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }, [setIsAuthenticated]);

  function ensureJson(input) {
    // Check if the input is already a JSON string
    if (typeof input === "string") {
      try {
        // Try to parse the string as JSON
        JSON.parse(input);
        return input; // If parsing succeeds, input is already a JSON string
      } catch (error) {
        // If parsing fails, it's not a valid JSON string
      }
    }

    // If input is not a string or not valid JSON, convert it to JSON
    try {
      return JSON.stringify(input);
    } catch (error) {
      throw new Error("Input cannot be converted to JSON");
    }
  }

  const authenticateUser = async () => {
    if (webApp) {
      const initData = telegramInitData;
      let url = baseUrlApi + "/api/auth";
      if (initData) {
        var param = Object.fromEntries(new URLSearchParams(initData));
        try {
          const response = await axios.post(url, param, {
            headers: {
              "Content-Type": "application/json", // Optional headers
            },
          });

          // Handle success
          setTelegramAuth(response.data.message + " | " + response.data.siwt);
          setIsAuthenticated(response.data.siwt);
          console.log("Response:", response.data);
        } catch (error) {
          setTelegramAuth("exception error " + error + " " + param + " with hash" + param.hash);
          param = ensureJson(param);
          console.error("Authentication failed");
          setIsAuthenticated(false);
        }

        /*setTelegramAuth(JSON.stringify(response));
          if (response.ok) {
            response.json().then((data) => {
              data.token && localStorage.setItem("token", data.token);
            });
            setIsAuthenticated(true);

            // localStorage.setItem("token", response);
          } else {
            //setTelegramAuth("bad response " + JSON.stringify(response));
            console.error("Authentication failed");
            setIsAuthenticated(false);
          }*/
      }
    }
  };

  const handleLogin = useCallback(
    async (p) => {
      try {
        const privKey = p;

        setCurrentEmail(loginInstance.getUserInfo().email);

        const diceAgent = actorCreation(privKey);
        var icpAgent_ = icpAgent(privKey);
        icpAgent_ = createDragonSolAgent(privKey);
        const eyes_ = eyesCreation(privKey);
        const spinWheel_ = actorCreationSpin(privKey);
        const roshambo = actorCreationRoshambo(privKey);
        const coreActor_ = coreActorCreation(privKey);
        const roshamboEyesAgent = createRoshamboEyes(privKey);
        const generalPrivKey = "0bc9866cbc181a4f5291476f7be00ca4f11cae6787e10ed9dc1d40db7943f643";
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

        const [user_, game_] = await Promise.all([diceAgent.getUserData(), diceAgent.getCurrentGame()]);

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
    },
    [
      loginInstance,
      setCurrentEmail,
      setRosamboEyesAgent,
      setPreConnectRoshambo,
      setCanisterActor,
      setICPAgent,
      setEyesLedger,
      setSpinActor,
      setRoshamboActor,
      setCoreActor,
      setUserData,
      setGameData,
      setWalletAddress,
      setWalletAlias,
      setIsLoggedIn,
    ]
  );

  useEffect(() => {
    const telegram = WebApp;
    if (telegram) {
      telegram.ready();
      setTelegramInitData(telegram.initData);
      setTelegramUserData(telegram.initDataUnsafe.user);
      setWebApp(telegram);
      handleLogin(telegram.initData.hash);
      // analytics.indentify(`${telegram?.initDataUnsafe?.user?.first_name}`, {
      //   user_id: telegram?.initDataUnsafe?.user?.id,
      // });
    }
  }, [setWebApp, setTelegramUserData, checkAuth, setTelegramInitData, handleLogin, analytics]);

  return { webApp, isAuthenticated, authenticateUser, checkAuth };
};

export default useTelegramWebApp;
