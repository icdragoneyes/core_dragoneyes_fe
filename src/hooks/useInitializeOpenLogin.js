import { useEffect } from "react";
import { useSetAtom, useAtom } from "jotai";
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
  isAuthenticatedAtom,
  telegramInitDataAtom,
  chainNameAtom,
  currencyDecimalAtom,
  selectedChainAtom,
  chainsAtom,
} from "../store/Atoms";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent as icpAgentCreation } from "../service/icpledgercanister";
import { createDragonSolAgent } from "../service/solledgercanister";
import { actorCreationSpin } from "../service/spincanister";
import { actorCreationRoshambo } from "../service/roshambocanister";
import { actorCreationRoshambo as actorCreationRoshamboSol } from "../service/roshamboSOL";
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
  const setSelectedChain = useSetAtom(selectedChainAtom);
  const [chains] = useAtom(chainsAtom);

  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setChainName = useSetAtom(chainNameAtom);

  //game canisters
  const setSpinActor = useSetAtom(spinActorAtom);
  const setRoshamboActor = useSetAtom(roshamboActorAtom);
  const setRoshamboEyes = useSetAtom(roshamboEyesAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom); // dice
  const setTelegramInitData = useSetAtom(telegramInitDataAtom);
  const setCurrencyDecimal = useSetAtom(currencyDecimalAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const { webApp } = useTelegramWebApp();

  useEffect(() => {
    console.log(webApp, "<<<<<<< wtg");
    if (webApp) {
      setTelegramInitData(webApp.initData);
    }
  }, [webApp, setTelegramInitData]);

  useEffect(() => {
    const initialize = async () => {
      var sdkInstance = false;
      var privKey = false;
      if (!isAuthenticated) {
        sdkInstance = new OpenLogin(openLoginConfig);
        await sdkInstance.init();
        privKey = sdkInstance.privKey;
      } else {
        privKey = isAuthenticated;
      }

      setSdk(sdkInstance);

      if (privKey) {
        //const privKey = sdkInstance.privKey;
        const actor = actorCreation(privKey);
        if (isAuthenticated) {
          setChainName("SOL");
          setSelectedChain(chains["sol"]);
          setCurrencyDecimal(1e9);
        }
        var icpAgent_ = icpAgentCreation(privKey);
        if (isAuthenticated) icpAgent_ = createDragonSolAgent(privKey);
        //icpAgent_ = createDragonSolAgent(privKey);
        const eyes_ = eyesCreation(privKey);
        const spinWheel_ = actorCreationSpin(privKey);
        var roshambo = actorCreationRoshambo(privKey);
        if (isAuthenticated) roshambo = actorCreationRoshamboSol(privKey);
        //roshambo = actorCreationRoshamboSol(privKey);
        const roshamboEyes = eyesAgentCreation(privKey);
        const principalString_ = getUserPrincipal(privKey).toString();
        // const [user_, game_] = await Promise.all([actor.getUserData(), actor.getCurrentGame()]);
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
    setTelegramInitData,
    isAuthenticated,
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
    setRoshamboEyes,
  ]);
};

export default useInitializeOpenlogin;
