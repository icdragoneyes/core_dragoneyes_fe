import { useEffect } from "react";
import { useSetAtom, useAtom } from "jotai";
import OpenLogin from "@toruslabs/openlogin";
import { Principal } from "@dfinity/principal";

import {
  canisterActorAtom,
  roshamboEyesAtom,
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
  dragonSOLMinterAtom,
  userAtom,
  coreAtom,
  telegramUserDataAtom,
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
import { createAgent, agents } from "../service/canisteragent";
import useTelegramWebApp from "./useTelegramWebApp";
import analytics from "../utils/segment";

//THIS HOOK IS CALLED TO FETCH THE STATE OF WEB3AUTH AND INITIATE CORE PARAMETERS AND VARIABLE. IT WILL ALSO LISTEN IF THE APPS IS OPENED IN TELEGRAM
const useInitializeOpenlogin = () => {
  const setSdk = useSetAtom(loginInstanceAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const setICPAgent = useSetAtom(icpAgentAtom);
  const setEyesLedger = useSetAtom(eyesLedgerAtom);
  const setSelectedChain = useSetAtom(selectedChainAtom);
  const [chains] = useAtom(chainsAtom);
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const setChainName = useSetAtom(chainNameAtom);
  const telegramUserData = useAtom(telegramUserDataAtom);

  //game canisters
  const setSpinActor = useSetAtom(spinActorAtom);
  const setRoshamboActor = useSetAtom(roshamboActorAtom);
  const setRoshamboEyes = useSetAtom(roshamboEyesAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom); // dice
  const setTelegramInitData = useSetAtom(telegramInitDataAtom);
  const setCurrencyDecimal = useSetAtom(currencyDecimalAtom);
  const setDragonMinter = useSetAtom(dragonSOLMinterAtom);
  const setUser = useSetAtom(userAtom);
  const setCoreActor = useSetAtom(coreAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const { webApp } = useTelegramWebApp();

  useEffect(() => {
    if (webApp) {
      setTelegramInitData(webApp.initData);
    }
  }, [webApp, setTelegramInitData]);

  useEffect(() => {
    const initialize = async () => {
      try {
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
          const actor = actorCreation(privKey);

          var icpAgent_ = icpAgentCreation(privKey);
          const eyes_ = eyesCreation(privKey);
          const spinWheel_ = actorCreationSpin(privKey);
          var roshambo = actorCreationRoshambo(privKey);
          var dragonMinterAgent = createAgent(privKey, agents.dragonMinter, "65ga4-5yaaa-aaaam-ade6a-cai");
          var coreAgent = createAgent(privKey, agents.coreIDL, "p7g6o-ayaaa-aaaam-acwea-cai");
          const minterAddr = await dragonMinterAgent.getMinterAddress();

          setCoreActor(coreAgent);
          const user_ = await coreAgent.getUser();
          setDragonMinter(dragonMinterAgent);

          if (isAuthenticated) {
            setChainName("SOL");
            setSelectedChain(chains["sol"]);
            setCurrencyDecimal(1e9);
            icpAgent_ = createDragonSolAgent(privKey);
            roshambo = actorCreationRoshamboSol(privKey);
          }
          const roshamboEyes = eyesAgentCreation(privKey);
          const principalString_ = getUserPrincipal(privKey).toString();
          const acc = { owner: Principal?.fromText(principalString_), subaccount: [] };
          let userBalance = await icpAgent_.icrc1_balance_of(acc);

          setCanisterActor(actor);
          setICPAgent(icpAgent_);
          setEyesLedger(eyes_);
          setSpinActor(spinWheel_);
          setRoshamboActor(roshambo);
          setRoshamboEyes(roshamboEyes);
          setWalletAddress(principalString_);
          var userData = {
            solMinter: minterAddr.toString(),
            principal: principalString_,
            btcMinter: "",
            referralCode: user_.referralCode,
            userName: user_.userName,
            userBalance: Number(userBalance) / 1e9,
          };
          setUser(userData);
          if (webApp) {
            analytics.identify(`T_${telegramUserData?.id}`, {
              user_id: telegramUserData?.id,
              name: telegramUserData?.first_name,
              game_name: userData.userName,
              SOL_Balance: userData.userBalance,
              principal_id: userData.principal,
            });
          }

          setIsLoggedIn(true);
        } else {
          setWalletAddress(false);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        analytics.track("Initialization Error", {
          error: error,
          isAuthenticated: isAuthenticated,
        });
        setWalletAddress(false);
        setIsLoggedIn(false);
      }
    };

    initialize();
  }, [setTelegramInitData, isAuthenticated, setSdk, setCanisterActor, setWalletAddress, setICPAgent, setEyesLedger, setIsLoggedIn, setSpinActor, setRoshamboActor, setRoshamboEyes]);
};

export default useInitializeOpenlogin;
