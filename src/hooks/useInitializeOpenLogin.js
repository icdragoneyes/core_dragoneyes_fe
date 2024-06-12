import { useEffect } from "react";
import { useSetAtom } from "jotai";
import OpenLogin from "@toruslabs/openlogin";
import { newLoginAtom, oldLoginAtom, canisterActorAtom, userDataAtom, gameDataAtom, ticketPriceAtom, walletAddressAtom, icpAgentAtom, eyesLedgerAtom, loginInstanceAtom } from "../store/Atoms";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent as icpAgentCreation } from "../service/icpledgercanister";
import { openLoginConfig } from "../constant/openLoginConfig";

const useInitializeOpenlogin = () => {
  const setSdk = useSetAtom(loginInstanceAtom);
  const setNewLogin = useSetAtom(newLoginAtom);
  const setOldLogin = useSetAtom(oldLoginAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom);
  const setUserData = useSetAtom(userDataAtom);
  const setGameData = useSetAtom(gameDataAtom);
  const setTicketPrice = useSetAtom(ticketPriceAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const setICPAgent = useSetAtom(icpAgentAtom);
  const setEyesLedger = useSetAtom(eyesLedgerAtom);

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
        const principalString_ = getUserPrincipal(privKey).toString();

        const [user_, game_] = await Promise.all([actor.getUserData(), actor.getCurrentGame()]);

        setCanisterActor(actor);
        setICPAgent(icpAgent_);
        setEyesLedger(eyes_);
        setUserData(user_);
        setGameData(game_);
        setWalletAddress(principalString_);
      }
    };

    initialize();
  }, [setSdk, setNewLogin, setOldLogin, setCanisterActor, setUserData, setGameData, setTicketPrice, setWalletAddress, setICPAgent, setEyesLedger]);
};

export default useInitializeOpenlogin;
