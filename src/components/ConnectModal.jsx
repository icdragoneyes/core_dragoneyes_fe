import { useAtom, useSetAtom } from "jotai";
import { isModalOpenAtom, loginInstanceAtom, canisterActorAtom, userDataAtom, gameDataAtom, walletAddressAtom, icpAgentAtom, eyesLedgerAtom, setCurrentEmailAtom, setWalletAliasAtom } from "../store/Atoms";
import { useState } from "react";
import { actorCreation, getUserPrincipal } from "../service/icdragoncanister";
import { eyesCreation } from "../service/eyesledgercanister";
import { icpAgent } from "../service/icpledgercanister";

export default function ConnectModal() {
  const [isModalOpen, setModalOpen] = useAtom(isModalOpenAtom);
  const [loginInstance] = useAtom(loginInstanceAtom);
  const setCanisterActor = useSetAtom(canisterActorAtom);
  const setUserData = useSetAtom(userDataAtom);
  const setGameData = useSetAtom(gameDataAtom);
  const setWalletAddress = useSetAtom(walletAddressAtom);
  const setICPAgent = useSetAtom(icpAgentAtom);
  const setEyesLedger = useSetAtom(eyesLedgerAtom);
  const [walletAddress] = useAtom(walletAddressAtom);
  const setCurrentEmail = useSetAtom(setCurrentEmailAtom);
  const setWalletAlias = useSetAtom(setWalletAliasAtom);

  const closeModal = () => {
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    console.log(loginInstance);
    setLoading(true);
    try {
      const { privKey } = await loginInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });
      if (!privKey) {
        throw new Error("failed login");
      }

      setCurrentEmail(loginInstance.getUserInfo().email);

      const actor = actorCreation(privKey);
      const icpAgent_ = icpAgent(privKey);
      const eyes_ = eyesCreation(privKey);
      const principalString_ = getUserPrincipal(privKey).toString();

      setCanisterActor(actor);
      setICPAgent(icpAgent_);
      setEyesLedger(eyes_);

      const user_ = await actor.getUserData();
      const game_ = await actor.getCurrentGame();

      setUserData(user_);
      setGameData(game_);
      setLoading(false);
      setWalletAddress(principalString_);
      setWalletAlias(user_.alias.toString());

      setModalOpen(false);
    } catch (error) {
      setLoading(false);
      setModalOpen(false);
      alert("Login failed");
    }
  }

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
