import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import {
  isModalOpenAtom,
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
import { toast } from "react-toastify";
import { actorCreationRoshambo } from "../service/roshambocanister";
import { coreActorCreation } from "../service/core";

export default function ConnectModal() {
  const [isModalOpen, setModalOpen] = useAtom(isModalOpenAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
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

  const [loading, setLoading] = useState(false);

  const closeModal = () => setModalOpen(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { privKey } = await loginInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });
      if (!privKey) throw new Error("failed login");

      setCurrentEmail(loginInstance.getUserInfo().email);

      const diceAgent = actorCreation(privKey);
      const icpAgent_ = icpAgent(privKey);
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

      setModalOpen(false);
    } catch (err) {
      console.log("Failed to connect to ICP:", err);
      toast.error("Failed to connect to ICP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
            &times;
          </button>
          <h3 className="text-xl font-semibold mb-4 text-center">{!walletAddress ? "Connect to ICP to continue" : "Welcome to Dragon Eyes!"}</h3>
          <div className="text-center">
            <button onClick={handleLogin} disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition duration-200">
              {loading ? "Connecting..." : "Connect with Google"}
            </button>
            <p className="mt-4 text-sm text-gray-600">We do not store any data related to your social logins.</p>
          </div>
        </div>
      </div>
    )
  );
}
