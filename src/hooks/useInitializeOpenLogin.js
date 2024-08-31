import { useEffect } from "react";
import { useSetAtom } from "jotai";
import OpenLogin from "@toruslabs/openlogin";
import {
  canisterActorAtom,
  roshamboEyesAtom,
  userDataAtom,
  gameDataAtom,
  walletAddressAtom,
  icpAgentAtom,
  eyesLedgerAtom,
  loginInstanceAtom,
  spinActorAtom,
  isLoggedInAtom,
  roshamboActorAtom,
  telegramInitDataAtom,
} from "../store/Atoms";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent as icpAgentCreation } from "../service/icpledgercanister";
import { actorCreationSpin } from "../service/spincanister";
import { actorCreationRoshambo } from "../service/roshambocanister";
import { actorCreationRoshambo as eyesAgentCreation } from "../service/roshamboeyes";
import { openLoginConfig } from "../constant/openLoginConfig";
import useTelegramWebApp from "./useTelegramWebApp";

const useInitializeOpenlogin = () => {
  const setSdk = useSetAtom(loginInstanceAtom);

  const setUserData = useSetAtom(userDataAtom);
  const setGameData = useSetAtom(gameDataAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const setICPAgent = useSetAtom(icpAgentAtom);
  const setEyesLedger = useSetAtom(eyesLedgerAtom);

  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  //game canisters
  const setSpinActor = useSetAtom(spinActorAtom);
  const setRoshamboActor = useSetAtom(roshamboActorAtom);
  const setRoshamboEyes = useSetAtom(roshamboEyesAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom); // dice
  const setTelegramInitData = useSetAtom(telegramInitDataAtom);

  const { webApp } = useTelegramWebApp();

  useEffect(() => {
    console.log(webApp, "<<<<<<< wtg");
    if (webApp) {
      setTelegramInitData(webApp.initData);
    }
  }, [webApp]);

  useEffect(() => {
    const initialize = async () => {
      const sdkInstance = new OpenLogin(openLoginConfig);
      await sdkInstance.init();

      setSdk(sdkInstance);

      if (sdkInstance?.privKey) {
        const privKey = sdkInstance.privKey;
        const actor = actorCreation(privKey);
        const icpAgent_ = icpAgentCreation(privKey);
        const eyes_ = eyesCreation(privKey);
        const spinWheel_ = actorCreationSpin(privKey);
        const roshambo = actorCreationRoshambo(privKey);
        const roshamboEyes = eyesAgentCreation(privKey);
        const principalString_ = getUserPrincipal(privKey).toString();
        /*const [user_, game_] = await Promise.all([
          actor.getUserData(),
          actor.getCurrentGame(),
        ]); */

        setCanisterActor(actor);
        setICPAgent(icpAgent_);
        setEyesLedger(eyes_);
        //setUserData(user_);
        // setGameData(game_);
        setSpinActor(spinWheel_);
        setRoshamboActor(roshambo);
        setRoshamboEyes(roshamboEyes);

        setWalletAddress(principalString_);
        setIsLoggedIn(true);
      } else {
        setWalletAddress(false);
        setIsLoggedIn(false);
      }
    };

    initialize();
  }, [
    setSdk,
    setCanisterActor,
    setUserData,
    setGameData,
    setWalletAddress,
    setICPAgent,
    setEyesLedger,
    setIsLoggedIn,
    setSpinActor,
    setRoshamboActor,
  ]);
};

export default useInitializeOpenlogin;
